import { describe, it, expect } from 'vitest';
import { ostersonntag, ostersonntagMeeus, feiertage, LAENDER, nthWeekday, naechste, karfreitag, meldefrist, patrone } from '../src/lib/engine/feiertage';
import { optimiere, bruecken, fenstertage, arbeitstage, isoWeek, weeksInYear } from '../src/lib/engine/fenstertage';
import { schulbeginn, semesterferien, hauptferien, schulautonomMax, schuljahr, schulfrei } from '../src/lib/engine/schule';
import { wienInstant } from '../src/lib/zeit';

describe('Ostern', () => {
  it('stimmt mit der Osterfesttabelle überein', () => {
    expect(ostersonntag(2025)).toBe('2025-04-20');
    expect(ostersonntag(2026)).toBe('2026-04-05');
    expect(ostersonntag(2027)).toBe('2027-03-28');
    expect(ostersonntag(2028)).toBe('2028-04-16');
    expect(ostersonntag(2029)).toBe('2029-04-01');
    expect(karfreitag(2027)).toBe('2027-03-26');
  });
  it('Gauß und Meeus liefern 1600 bis 2600 dasselbe', () => {
    for (let y = 1600; y <= 2600; y++) expect(ostersonntag(y)).toBe(ostersonntagMeeus(y));
  });
});

describe('Gesetzliche Feiertage (§ 7 Abs. 2 ARG)', () => {
  it('13 Tage in jedem Jahr, in allen Ländern gleich', () => {
    for (const y of [2026, 2027, 2028]) for (const l of LAENDER) expect(feiertage(y, l).length).toBe(13);
  });
  it('bewegliche Feiertage 2027', () => {
    const d = Object.fromEntries(feiertage(2027).map((f) => [f.id, f.date]));
    expect(d).toMatchObject({ ostermontag: '2027-03-29', himmelfahrt: '2027-05-06', pfingstmontag: '2027-05-17', fronleichnam: '2027-05-27', nationalfeiertag: '2027-10-26' });
  });
  it('Karfreitag ist seit 2019 kein Feiertag', () => {
    expect(feiertage(2027).some((f) => f.date === '2027-03-26')).toBe(false);
  });
  it('Landespatrone nur auf Wunsch, Kärnten mit zwei Tagen', () => {
    expect(feiertage(2027, 'K', { patron: true }).length).toBe(15);
    expect(feiertage(2027, 'W', { patron: true }).length).toBe(14);
    expect(patrone('S')[0]).toMatchObject({ m: 9, d: 24 });
    expect(patrone('OOE')[0]).toMatchObject({ m: 5, d: 4 });
    expect(patrone('B')[0]).toMatchObject({ m: 11, d: 11 });
  });
  it('nächste Feiertage über den Jahreswechsel', () => {
    expect(naechste('2026-12-27', 'W', {}, 3).map((f) => f.date)).toEqual(['2027-01-01', '2027-01-06', '2027-03-29']);
    expect(naechste('2026-10-28', 'W', {}, 1)[0].id).toBe('allerheiligen');
  });
  it('Meldefrist für den persönlichen Feiertag: drei Monate vorher', () => {
    expect(meldefrist('2027-03-26')).toBe('2026-12-26');
    expect(meldefrist('2027-05-31')).toBe('2027-02-28');
    expect(meldefrist('2027-12-24')).toBe('2027-09-24');
  });
});

describe('Fenstertage', () => {
  it('7. Dezember 2026 ist ein echter Fenstertag', () => {
    expect(fenstertage(2026, 'W').some((b) => b.urlaubVon === '2026-12-07' && b.frei === 4)).toBe(true);
  });
  it('2027: Freitag nach Christi Himmelfahrt und nach Fronleichnam, Montag vor dem Nationalfeiertag', () => {
    expect(fenstertage(2027, 'W').map((b) => b.urlaubVon)).toEqual(['2027-05-07', '2027-05-28', '2027-10-25']);
  });
  it('2028 hat fünf Fenstertage', () => {
    expect(fenstertage(2028, 'W').length).toBe(5);
  });
  it('Optimierer: nie mehr Urlaub als das Budget, mehr Budget bringt nie weniger', () => {
    for (const l of ['W', 'K', 'S'] as const) for (const y of [2027, 2028]) {
      let prev = 0;
      for (let b = 0; b <= 30; b++) { const p = optimiere(y, l, b); expect(p.urlaub).toBeLessThanOrEqual(b); expect(p.frei).toBeGreaterThanOrEqual(prev); prev = p.frei; }
    }
  });
  it('jede Brücke grenzt an einen Feiertag', () => {
    for (const b of bruecken(2027, 'W')) expect(b.feiertage.length).toBeGreaterThan(0);
  });
  it('Arbeitstage', () => {
    expect(arbeitstage(2027, 'W').reduce((a, b) => a + b, 0)).toBe(252);
    expect(arbeitstage(2026, 'W').reduce((a, b) => a + b, 0)).toBe(251);
    expect(arbeitstage(2028, 'W').reduce((a, b) => a + b, 0)).toBe(248);
  });
  it('Kalenderwochen nach ISO 8601', () => {
    expect(isoWeek('2027-01-01')).toEqual({ year: 2026, week: 53 });
    expect(isoWeek('2027-01-04')).toEqual({ year: 2027, week: 1 });
    expect(weeksInYear(2026)).toBe(53); expect(weeksInYear(2027)).toBe(52);
  });
});

describe('Schulzeitgesetz 1985, § 2', () => {
  it('Schulbeginn: erster Montag im September im Osten, sonst zweiter', () => {
    expect(schulbeginn(2026, 'W')).toBe('2026-09-07');
    expect(schulbeginn(2026, 'T')).toBe('2026-09-14');
    expect(schulbeginn(2027, 'B')).toBe('2027-09-06');
  });
  it('Semesterferien 2027', () => {
    expect(semesterferien(2027, 'W').von).toBe('2027-02-01');
    expect(semesterferien(2027, 'K').von).toBe('2027-02-08');
    expect(semesterferien(2027, 'ST').von).toBe('2027-02-15');
  });
  it('Hauptferien 2027', () => {
    expect(hauptferien(2027, 'W')).toBe('2027-07-03');
    expect(hauptferien(2027, 'V')).toBe('2027-07-10');
  });
  it('Höchstzahl schulautonomer Tage nach dem Wochentag des 26. Oktober', () => {
    expect(schulautonomMax(2026)).toBe(3); // Montag
    expect(schulautonomMax(2027)).toBe(4); // Dienstag
    expect(schulautonomMax(2025)).toBe(2); // Sonntag
  });
  it('schulfrei: Allerseelen, Herbstferien, Landespatron', () => {
    const m = schulfrei(2026, 'S');
    expect(m.get(Date.UTC(2026, 10, 2) / 864e5)).toBe('allerseelen');
    expect(m.get(Date.UTC(2026, 9, 28) / 864e5)).toBe('herbst');
    expect(m.get(Date.UTC(2026, 8, 24) / 864e5)).toBe('patron');
  });
  it('Fenster im Schuljahr 2026/27: 7. Dezember und 7./8. Jänner', () => {
    const f = schuljahr(2026, 'W').fenster.map((x) => x.von);
    expect(f).toContain('2026-12-07'); expect(f).toContain('2027-01-07');
  });
});

describe('Österreichische Zeit', () => {
  it('Sommerzeit nach BGBl. II Nr. 58/2022 und Nr. 282/2026', () => {
    const v: Record<number, [string, string]> = { 2026: ['2026-03-29', '2026-10-25'], 2027: ['2027-03-28', '2027-10-31'], 2028: ['2028-03-26', '2028-10-29'], 2029: ['2029-03-25', '2029-10-28'], 2030: ['2030-03-31', '2030-10-27'], 2031: ['2031-03-30', '2031-10-26'] };
    for (const [y, [a, b]] of Object.entries(v)) { expect(nthWeekday(Number(y), 3, 0, -1)).toBe(a); expect(nthWeekday(Number(y), 10, 0, -1)).toBe(b); }
  });
  it('Mitternacht und Umstellung', () => {
    expect(wienInstant('2027-03-28', '02:00')).toBe('2027-03-28T01:00:00.000Z');
    expect(wienInstant('2027-01-01')).toBe('2026-12-31T23:00:00.000Z');
    expect(wienInstant('2027-05-16')).toBe('2027-05-15T22:00:00.000Z');
  });
});

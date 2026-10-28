/**
 * Die Werkzeuge der Seite. Jede Zahl und jedes Datum kommt aus dem Rechenkern (engine/feiertage.ts,
 * engine/fenstertage.ts, engine/schule.ts); nichts ist abgetippt. Eine Spec listet ihre Felder (sichtbar zuerst,
 * `adv` eingeklappt) und eine Funktion `run`, die die Ergebniskarte liefert. Kalender und „nächster Feiertag“
 * sind eigene Komponenten.
 */
import type { ToolSpec, V, ToolOut, Opt } from './tool-types';
import { resolve } from './tool-types';
import { formatNumber, formatDecimal, type Lang } from './format';
import { FEIERTAGE, PATRONE, feiertage, patrone, ostersonntag, nthWeekday, fromIso, toIso, isWeekend, weekday, dayNum, LAENDER, LAND_NAME, karfreitag, meldefrist, type Land, type Optionen } from './engine/feiertage';
import { optimiere, bruecken, fenstertage, arbeitstage, isoWeek, weeksInYear, werktageMoFr } from './engine/fenstertage';
import { schuljahr, schulbeginn, semesterferien, hauptferien, schulautonomMax } from './engine/schule';
import P from '../data/params-2026.json';

export type Args = Record<string, number | string>;
const T = (l: Lang, de: string, en: string) => (l === 'de' ? de : en);
const n = (v: V, k: string) => Number(v[k]) || 0;
const s = (v: V, k: string) => String(v[k] ?? '');
const num = (x: number, l: Lang) => formatNumber(x, 0, l);
const TAG = (l: Lang) => (l === 'de' ? 'de-AT' : 'en-GB');
const fmt = (iso: string, l: Lang, o: Intl.DateTimeFormatOptions) => new Date(`${iso}T12:00:00Z`).toLocaleDateString(TAG(l), { ...o, timeZone: 'UTC' });
/** « 28. März 2027 » / « 28 March 2027 » */
export const dLong = (iso: string, l: Lang) => fmt(iso, l, { day: 'numeric', month: 'long', year: 'numeric' });
/** « Sonntag, 28. März 2027 » */
export const dWeek = (iso: string, l: Lang) => fmt(iso, l, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
/** « Fr., 7. Mai » / « Fri 7 May » */
export const dShort = (iso: string, l: Lang) => fmt(iso, l, { weekday: 'short', day: 'numeric', month: 'long' });
export const wdLong = (iso: string, l: Lang) => fmt(iso, l, { weekday: 'long' });
const span = (a: string, b: string, l: Lang) => (a === b ? dShort(a, l) : `${dShort(a, l)} – ${dShort(b, l)}`);
const tage = (x: number, l: Lang) => `${num(x, l)} ${x === 1 ? T(l, 'Tag', 'day') : T(l, 'Tage', 'days')}`;
const off = (iso: string, d: number) => toIso(fromIso(iso) + d);

/* ------------------------------------------------------------------ Felder */
const JAHRE = P.jahre as number[];
const landOpts = (l: Lang): Opt[] => LAENDER.map((c) => ({ value: c, label: LAND_NAME[c][l] }));
const jahrOpts = (ys: number[]): Opt[] => ys.map((y) => ({ value: String(y), label: String(y) }));
const yearRange = (a: number, b: number) => Array.from({ length: b - a + 1 }, (_, i) => a + i);
const fLand = (l: Lang, def: string) => ({ kind: 'select' as const, id: 'land', label: T(l, 'Bundesland', 'Province'), def, options: landOpts(l) });
const fJahr = (l: Lang, def: number, ys = JAHRE) => ({ kind: 'select' as const, id: 'jahr', label: T(l, 'Jahr', 'Year'), def: String(def), options: jahrOpts(ys) });
const fPatron = (l: Lang, adv = true) => ({ kind: 'choice' as const, id: 'lp', label: T(l, 'Landespatron', "Patron saint's day"), def: 'arbeit', adv, options: [{ value: 'arbeit', label: T(l, 'Arbeitstag', 'Working day') }, { value: 'frei', label: T(l, 'Frei', 'Day off') }], help: T(l, 'Frei nur, wenn Kollektivvertrag oder Dienstrecht es vorsehen.', 'Off only if your collective agreement or service code says so.') });
const fHl = (l: Lang) => ({ kind: 'choice' as const, id: 'hl', label: T(l, '24. und 31. Dezember', '24 and 31 December'), def: 'arbeit', adv: true, options: [{ value: 'arbeit', label: T(l, 'Arbeitstage', 'Working days') }, { value: 'frei', label: T(l, 'Frei', 'Days off') }] });
const ctx = (v: V) => { const land = (s(v, 'land') || 'W') as Land; const o: Optionen = { patron: s(v, 'lp') === 'frei', heiligabend: s(v, 'hl') === 'frei' }; return { land, y: n(v, 'jahr'), o }; };
const fname = (id: string, l: Lang) => FEIERTAGE.find((f) => f.id === id)?.name[l] ?? PATRONE.find((p) => p.id === id)?.name[l] ?? id;
const sumA = (a: number[]) => a.reduce((x, z) => x + z, 0);

/* ------------------------------------------------------------------ Fenstertage-Optimierer */
function btSpec(l: Lang, a: Args = {}): ToolSpec {
  return {
    inputs: [fLand(l, String(a.land ?? 'W')), fJahr(l, Number(a.jahr ?? 2027)), { id: 'urlaub', label: T(l, 'Urlaubstage, die Sie einsetzen', 'Leave days you want to use'), def: Number(a.urlaub ?? 10), unit: T(l, 'Tage', 'days'), max: 60 }, fPatron(l), fHl(l)],
    run: (v) => {
      const { land, y, o } = ctx(v);
      const budget = Math.round(n(v, 'urlaub'));
      const p = optimiere(y, land, budget, o);
      const all = bruecken(y, land, o);
      const faktor = p.urlaub ? p.frei / p.urlaub : 0;
      const name = LAND_NAME[land][l];
      const out: ToolOut = {
        label: T(l, `${name} ${y}: mit ${num(p.urlaub, l)} Urlaubstagen`, `${name} ${y}: using ${num(p.urlaub, l)} leave days`),
        value: T(l, `${num(p.frei, l)} Tage frei`, `${num(p.frei, l)} days off`),
        sub: p.urlaub ? T(l, `Ein Urlaubstag ergibt im Schnitt ${formatDecimal(faktor, 1, l)} freie Tage am Stück.`, `On average one leave day buys ${formatDecimal(faktor, 1, l)} consecutive days off.`) : T(l, 'Tragen Sie mindestens einen Urlaubstag ein.', 'Enter at least one leave day.'),
        rows: p.bloecke.slice(0, 6).map((b) => [span(b.freiVon, b.freiBis, l), T(l, `${num(b.urlaub, l)} → ${num(b.frei, l)} Tage`, `${num(b.urlaub, l)} → ${num(b.frei, l)} days`), b.frei] as [string, string, number]),
        table: p.bloecke.length ? {
          caption: T(l, `Ihr Urlaubsplan ${y}: diese Tage einreichen`, `Your leave plan for ${y}: book these days`),
          headers: [T(l, 'Urlaub nehmen', 'Take leave'), T(l, 'Urlaubstage', 'Leave days'), T(l, 'Frei am Stück', 'Off in a row'), T(l, 'Freie Tage', 'Days off'), T(l, 'Dank', 'Thanks to')],
          rows: p.bloecke.map((b) => [span(b.urlaubVon, b.urlaubBis, l), num(b.urlaub, l), span(b.freiVon, b.freiBis, l), num(b.frei, l), b.feiertage.map((id) => fname(id, l)).join(', ')]),
          align: ['l', 'r', 'l', 'r', 'l'],
        } : undefined,
        tables: all.length ? [{
          caption: T(l, `Alle Fenstertage und kurzen Brücken ${y} in ${name}, die ergiebigste zuerst`, `Every bridge day and short bridge in ${name} in ${y}, best first`),
          headers: [T(l, 'Urlaub nehmen', 'Take leave'), T(l, 'Urlaubstage', 'Leave days'), T(l, 'Frei am Stück', 'Off in a row'), T(l, 'Freie Tage', 'Days off'), T(l, 'Feiertag', 'Holiday')],
          rows: all.map((b) => [span(b.urlaubVon, b.urlaubBis, l), num(b.urlaub, l), span(b.freiVon, b.freiBis, l), num(b.frei, l), b.feiertage.map((id) => fname(id, l)).join(', ')]),
          align: ['l', 'r', 'l', 'r', 'l'],
        }] : undefined,
        note: p.rest > 0 ? T(l, `${tage(p.rest, l)} verlängern keine Brücke mehr und bleiben frei planbar, etwa für den Sommer.`, `${tage(p.rest, l)} no longer lengthen a bridge and stay free to plan, for a summer trip for instance.`) : undefined,
      };
      return out;
    },
  };
}

/* ------------------------------------------------------------------ Feiertage eines Jahres und Landes */
function ftSpec(l: Lang, a: Args = {}): ToolSpec {
  return {
    inputs: [fLand(l, String(a.land ?? 'W')), fJahr(l, Number(a.jahr ?? 2027)), { ...fPatron(l, false), label: T(l, 'Landespatron zeigen', "Show patron saint's day"), def: String(a.lp ?? 'frei'), options: [{ value: 'frei', label: T(l, 'Ja', 'Yes') }, { value: 'arbeit', label: T(l, 'Nein', 'No') }], help: T(l, 'Schulfrei, aber kein gesetzlicher Feiertag.', 'No school, but not a statutory holiday.') }],
    run: (v) => {
      const { land, y } = ctx(v);
      const zeig = s(v, 'lp') === 'frei';
      const list = feiertage(y, land, { patron: zeig });
      const ges = list.filter((f) => f.gesetzlich);
      const wk = ges.filter((f) => !isWeekend(fromIso(f.date)));
      const ft = fenstertage(y, land);
      const at = sumA(arbeitstage(y, land));
      const name = LAND_NAME[land][l];
      return {
        label: T(l, `Feiertage ${y} in ${name}`, `Public holidays ${y} in ${name}`),
        value: T(l, `${num(ges.length, l)} gesetzliche Feiertage`, `${num(ges.length, l)} statutory holidays`),
        sub: T(l, `${num(wk.length, l)} davon fallen auf Montag bis Freitag, ${num(ft.length, l)} Fenstertage.`, `${num(wk.length, l)} of them fall on a weekday; ${num(ft.length, l)} bridge days.`),
        rows: [
          [T(l, 'Feiertage an Werktagen', 'Holidays on weekdays'), num(wk.length, l)],
          [T(l, 'Feiertage am Wochenende', 'Holidays at weekends'), num(ges.length - wk.length, l)],
          [T(l, 'Fenstertage (1 Urlaubstag → 4 frei)', 'Bridge days (1 leave day → 4 off)'), num(ft.length, l)],
          [T(l, 'Arbeitstage Montag bis Freitag', 'Working days Monday to Friday'), num(at, l)],
        ],
        table: {
          caption: T(l, `Feiertage ${y} in ${name}, mit Wochentag`, `Holidays ${y} in ${name}, with weekday`),
          headers: [T(l, 'Datum', 'Date'), T(l, 'Wochentag', 'Weekday'), T(l, 'Feiertag', 'Holiday'), T(l, 'Status', 'Status')],
          rows: list.map((f) => [dLong(f.date, l), wdLong(f.date, l), f.name[l], f.gesetzlich ? T(l, 'gesetzlich, ganz Österreich', 'statutory, all of Austria') : T(l, 'schulfrei, kein gesetzlicher Feiertag', 'no school, not a statutory holiday')]),
          align: ['l', 'l', 'l', 'l'],
        },
      };
    },
  };
}

/* ------------------------------------------------------------------ Arbeitstage */
const MONATE = (l: Lang) => Array.from({ length: 12 }, (_, i) => new Date(Date.UTC(2027, i, 15)).toLocaleDateString(TAG(l), { month: 'long', timeZone: 'UTC' }));
function atSpec(l: Lang, a: Args = {}): ToolSpec {
  return {
    inputs: [fLand(l, String(a.land ?? 'W')), fJahr(l, Number(a.jahr ?? 2027)), { kind: 'choice', id: 'woche', label: T(l, 'Arbeitstage pro Woche', 'Working days per week'), def: '5', options: [{ value: '5', label: '5' }, { value: '4', label: '4' }, { value: '3', label: '3' }] }, fPatron(l), fHl(l)],
    run: (v) => {
      const { land, y, o } = ctx(v);
      const m = arbeitstage(y, land, o), sum = sumA(m);
      const w = Number(s(v, 'woche')) || 5;
      const brutto = werktageMoFr(y);
      const anteil = Math.round((sum * w) / 5);
      const name = LAND_NAME[land][l];
      return {
        label: T(l, `Arbeitstage ${y} in ${name}`, `Working days ${y} in ${name}`),
        value: w === 5 ? num(sum, l) : `≈ ${num(anteil, l)}`,
        sub: w === 5 ? T(l, 'Montag bis Freitag, ohne die gesetzlichen Feiertage.', 'Monday to Friday, statutory holidays excluded.') : T(l, `Bei ${w} Tagen pro Woche, anteilig aus ${num(sum, l)} Arbeitstagen der Fünftagewoche.`, `For ${w} days a week, pro rata from ${num(sum, l)} days in a five-day week.`),
        rows: [
          [T(l, 'Montag bis Freitag im Jahr', 'Mondays to Fridays in the year'), num(brutto, l)],
          [T(l, 'davon frei (Feiertage und gewählte Tage)', 'of which off (holidays and chosen days)'), num(brutto - sum, l)],
          [T(l, '1. Halbjahr', 'First half'), num(sumA(m.slice(0, 6)), l)],
          [T(l, '2. Halbjahr', 'Second half'), num(sumA(m.slice(6)), l)],
        ],
        table: { caption: T(l, `Arbeitstage je Monat ${y}, ${name}`, `Working days per month, ${y}, ${name}`), headers: [T(l, 'Monat', 'Month'), T(l, 'Arbeitstage', 'Working days')], rows: MONATE(l).map((mn, i) => [mn, num(m[i], l)]), align: ['l', 'r'] },
      };
    },
  };
}

/* ------------------------------------------------------------------ Ostern (Gaußsche Osterformel) */
export function gaussSchritte(x: number) {
  const K = Math.floor(x / 100), M = 15 + Math.floor((3 * K + 3) / 4) - Math.floor((8 * K + 13) / 25), S = 2 - Math.floor((3 * K + 3) / 4);
  const A = x % 19, D = (19 * A + M) % 30, R = Math.floor((D + Math.floor(A / 11)) / 29), OG = 21 + D - R;
  const SZ = 7 - ((x + Math.floor(x / 4) + S) % 7), OE = 7 - ((((OG - SZ) % 7) + 7) % 7);
  return { K, M, S, A, D, R, OG, SZ, OE, OS: OG + OE };
}
function osSpec(l: Lang, a: Args = {}): ToolSpec {
  return {
    inputs: [fJahr(l, Number(a.jahr ?? 2027), yearRange(2000, 2060))],
    run: (v) => {
      const y = n(v, 'jahr'), os = ostersonntag(y), g = gaussSchritte(y);
      return {
        label: T(l, `Ostersonntag ${y}`, `Easter Sunday ${y}`),
        value: dLong(os, l),
        sub: T(l, `Ostermontag ist am ${dLong(off(os, 1), l)} gesetzlicher Feiertag; Osterferien vom ${dShort(off(os, -8), l)} bis ${dShort(off(os, 1), l)}.`, `Easter Monday, ${dLong(off(os, 1), l)}, is a public holiday; school Easter break ${dShort(off(os, -8), l)} to ${dShort(off(os, 1), l)}.`),
        rows: [
          [T(l, 'Palmsonntag', 'Palm Sunday'), dShort(off(os, -7), l)],
          [T(l, 'Gründonnerstag', 'Maundy Thursday'), dShort(off(os, -3), l)],
          [T(l, 'Karfreitag (kein Feiertag)', 'Good Friday (not a holiday)'), dShort(off(os, -2), l)],
          [T(l, 'Ostermontag', 'Easter Monday'), dShort(off(os, 1), l)],
          [T(l, 'Christi Himmelfahrt', 'Ascension Day'), dShort(off(os, 39), l)],
          [T(l, 'Pfingstmontag', 'Whit Monday'), dShort(off(os, 50), l)],
          [T(l, 'Fronleichnam', 'Corpus Christi'), dShort(off(os, 60), l)],
        ],
        table: {
          caption: T(l, `Gaußsche Osterformel für ${y}, Schritt für Schritt`, `Gauss's Easter formula for ${y}, step by step`),
          headers: [T(l, 'Größe', 'Quantity'), T(l, 'Bedeutung', 'Meaning'), T(l, 'Wert', 'Value')],
          rows: [
            ['K', T(l, 'Säkularzahl', 'Century number'), String(g.K)], ['M', T(l, 'säkulare Mondschaltung', 'Lunar correction'), String(g.M)], ['S', T(l, 'säkulare Sonnenschaltung', 'Solar correction'), String(g.S)],
            ['A', T(l, 'Mondparameter', 'Lunar parameter'), String(g.A)], ['D', T(l, 'Keim für den ersten Frühlingsvollmond', 'Seed for the first spring full moon'), String(g.D)], ['R', T(l, 'kalendarische Korrekturgröße', 'Calendar correction'), String(g.R)],
            ['OG', T(l, 'Ostergrenze (Tag im März)', 'Paschal full moon (day of March)'), String(g.OG)], ['SZ', T(l, 'erster Sonntag im März', 'First Sunday in March'), String(g.SZ)], ['OE', T(l, 'Abstand zum Ostersonntag', 'Days to Easter Sunday'), String(g.OE)],
            ['OS', T(l, 'Ostersonntag als Tag im März (32 = 1. April)', 'Easter Sunday as a day of March (32 = 1 April)'), String(g.OS)],
          ],
          align: ['l', 'l', 'r'],
        },
      };
    },
  };
}

/* ------------------------------------------------------------------ Pfingsten */
function pfSpec(l: Lang, a: Args = {}): ToolSpec {
  return {
    inputs: [fJahr(l, Number(a.jahr ?? 2027), yearRange(2000, 2060))],
    run: (v) => {
      const y = n(v, 'jahr'), os = ostersonntag(y), ps = off(os, 49);
      return {
        label: T(l, `Pfingstsonntag ${y}`, `Whit Sunday ${y}`),
        value: dLong(ps, l),
        sub: T(l, `Pfingstmontag, ${dLong(off(os, 50), l)}, ist in ganz Österreich gesetzlicher Feiertag.`, `Whit Monday, ${dLong(off(os, 50), l)}, is a public holiday everywhere in Austria.`),
        rows: [
          [T(l, 'Pfingstferien (Schule) ab', 'School Whitsun break from'), dShort(off(os, 48), l)],
          [T(l, 'Pfingstmontag', 'Whit Monday'), dShort(off(os, 50), l)],
          [T(l, 'Christi Himmelfahrt', 'Ascension Day'), dShort(off(os, 39), l)],
          [T(l, 'Fronleichnam', 'Corpus Christi'), dShort(off(os, 60), l)],
        ],
        table: { caption: T(l, 'Pfingsten in den nächsten Jahren', 'Whitsun in the coming years'), headers: [T(l, 'Jahr', 'Year'), T(l, 'Pfingstsonntag', 'Whit Sunday'), T(l, 'Pfingstmontag', 'Whit Monday'), T(l, 'Fronleichnam', 'Corpus Christi')], rows: yearRange(y, y + 7).map((z) => { const o2 = ostersonntag(z); return [String(z), dLong(off(o2, 49), l), dLong(off(o2, 50), l), dLong(off(o2, 60), l)]; }), align: ['l', 'l', 'l', 'l'] },
      };
    },
  };
}

/* ------------------------------------------------------------------ Zeitumstellung */
export const sommerzeit = (y: number) => ({ beginn: nthWeekday(y, 3, 0, -1), ende: nthWeekday(y, 10, 0, -1) });
/** Jahre, für die eine österreichische Verordnung die Sommerzeit bereits festlegt (params-2026.json). */
const VO = P.sommerzeit as Array<{ von: number; bis: number; bgbl: string }>;
const vo = (y: number) => VO.find((x) => y >= x.von && y <= x.bis);
function zuSpec(l: Lang, a: Args = {}): ToolSpec {
  return {
    inputs: [fJahr(l, Number(a.jahr ?? 2027), yearRange(2022, 2035)), { kind: 'choice', id: 'was', label: T(l, 'Umstellung', 'Change'), def: String(a.was ?? 'beide'), options: [{ value: 'beide', label: T(l, 'Beide', 'Both') }, { value: 'vor', label: T(l, 'Frühjahr', 'Spring') }, { value: 'zurueck', label: T(l, 'Herbst', 'Autumn') }] }],
    run: (v) => {
      const y = n(v, 'jahr'), z = sommerzeit(y), was = s(v, 'was');
      const dauer = fromIso(z.ende) - fromIso(z.beginn);
      const q = vo(y);
      const herbst = was === 'zurueck';
      return {
        label: herbst ? T(l, `Zeitumstellung ${y}: Ende der Sommerzeit`, `Clocks change ${y}: summer time ends`) : T(l, `Zeitumstellung ${y}: Beginn der Sommerzeit`, `Clocks change ${y}: summer time starts`),
        value: dLong(herbst ? z.ende : z.beginn, l),
        sub: herbst ? T(l, 'Um 3 Uhr MESZ werden die Uhren auf 2 Uhr MEZ zurückgestellt: eine Stunde mehr Schlaf.', 'At 3:00 summer time clocks go back to 2:00: one extra hour of sleep.') : T(l, 'Um 2 Uhr MEZ werden die Uhren auf 3 Uhr MESZ vorgestellt: eine Stunde weniger Schlaf.', 'At 2:00 clocks go forward to 3:00: one hour less sleep.'),
        rows: [
          [T(l, 'Sommerzeit beginnt (Uhr vor)', 'Summer time starts (clocks forward)'), dShort(z.beginn, l)],
          [T(l, 'Sommerzeit endet (Uhr zurück)', 'Summer time ends (clocks back)'), dShort(z.ende, l)],
          [T(l, 'Tage mit Sommerzeit', 'Days on summer time'), num(dauer, l)],
          [T(l, 'Rechtsgrundlage', 'Legal basis'), q ? `BGBl. II Nr. ${q.bgbl}` : T(l, 'noch keine Verordnung, Regel der EU-Richtlinie', 'no ordinance yet, EU directive rule')],
        ],
        table: { caption: T(l, 'Zeitumstellung in Österreich in den nächsten Jahren', 'Clock changes in Austria in the coming years'), headers: [T(l, 'Jahr', 'Year'), T(l, 'Uhr vor (2 → 3 Uhr)', 'Forward (2:00 → 3:00)'), T(l, 'Uhr zurück (3 → 2 Uhr)', 'Back (3:00 → 2:00)'), T(l, 'Verordnung', 'Ordinance')], rows: yearRange(y, y + 5).map((x) => { const w = sommerzeit(x), r = vo(x); return [String(x), dLong(w.beginn, l), dLong(w.ende, l), r ? `BGBl. II Nr. ${r.bgbl}` : T(l, 'ausständig', 'not yet issued')]; }), align: ['l', 'l', 'l', 'l'] },
      };
    },
  };
}

/* ------------------------------------------------------------------ Kalenderwoche */
function kwSpec(l: Lang, a: Args = {}): ToolSpec {
  return {
    inputs: [fJahr(l, Number(a.jahr ?? 2027), yearRange(2025, 2030)), { kind: 'select', id: 'kw', label: T(l, 'Kalenderwoche', 'Week number'), def: String(a.kw ?? 1), options: (v: V) => yearRange(1, weeksInYear(n(v, 'jahr'))).map((w) => ({ value: String(w), label: T(l, `KW ${w}`, `Week ${w}`) })) }],
    run: (v) => {
      const y = n(v, 'jahr'), w = n(v, 'kw');
      const j4 = fromIso(`${y}-01-04`), mo1 = j4 - ((weekday(j4) + 6) % 7);
      const mo = toIso(mo1 + 7 * (w - 1)), so = toIso(mo1 + 7 * (w - 1) + 6);
      const hol = feiertage(y).concat(feiertage(y + 1), feiertage(y - 1)).filter((f) => f.date >= mo && f.date <= so);
      return {
        label: T(l, `KW ${w} ${y}`, `Week ${w}, ${y}`),
        value: `${dShort(mo, l)} – ${dShort(so, l)}`,
        sub: T(l, `${y} hat ${weeksInYear(y)} Kalenderwochen nach ISO 8601.`, `${y} has ${weeksInYear(y)} ISO 8601 weeks.`),
        rows: [[T(l, 'Montag', 'Monday'), dLong(mo, l)], [T(l, 'Sonntag', 'Sunday'), dLong(so, l)], [T(l, 'Feiertage in dieser Woche', 'Holidays this week'), hol.length ? hol.map((f) => f.name[l]).join(', ') : T(l, 'keine', 'none')], [T(l, 'Kalenderwochen im Jahr', 'Weeks in the year'), num(weeksInYear(y), l)]],
      };
    },
  };
}

/* ------------------------------------------------------------------ Urlaubsanspruch (Urlaubsgesetz § 2) */
function uaSpec(l: Lang, a: Args = {}): ToolSpec {
  const U = P.urlaub;
  return {
    inputs: [
      { kind: 'select', id: 'woche', label: T(l, 'Arbeitstage pro Woche', 'Working days per week'), def: '5', options: ['6', '5', '4', '3', '2', '1'].map((x) => ({ value: x, label: x })) },
      { kind: 'choice', id: 'dienst', label: T(l, 'Dienstjahre', 'Years of service'), def: 'unter', options: [{ value: 'unter', label: T(l, 'unter 25', 'under 25') }, { value: 'ab', label: T(l, '25 oder mehr', '25 or more') }] },
      { kind: 'select', id: 'monate', label: T(l, 'Monate im ersten Arbeitsjahr', 'Months into your first year'), def: '12', options: [...yearRange(1, 5).map((x) => ({ value: String(x), label: String(x) })), { value: '12', label: T(l, '6 oder mehr (voller Anspruch)', '6 or more (full entitlement)') }] },
      fLand(l, String(a.land ?? 'W')), fJahr(l, Number(a.jahr ?? 2027)),
    ],
    run: (v) => {
      const w = Number(s(v, 'woche')), m = Number(s(v, 'monate'));
      const werktage = s(v, 'dienst') === 'ab' ? U.werktageAb25 : U.werktage;
      const voll = (werktage * w) / U.tageBasis;
      const anspruch = m >= 6 ? voll : (voll * m) / 12;
      const { land, y } = ctx(v);
      const p = optimiere(y, land, Math.floor(voll));
      return {
        label: T(l, 'Urlaubsanspruch nach dem Urlaubsgesetz', 'Leave under the Austrian Leave Act'),
        value: T(l, `${formatDecimal(voll, 2, l)} Arbeitstage`, `${formatDecimal(voll, 2, l)} working days`),
        sub: T(l, `${werktage} Werktage bei sechs Werktagen pro Woche, umgerechnet auf ${w} Arbeitstage.`, `${werktage} working days on a six-day week, converted to ${w} days a week.`),
        rows: [
          [T(l, 'Gesetzlich in Werktagen', 'Statutory, in working days (Mon–Sat)'), num(werktage, l)],
          [T(l, 'In Ihren Arbeitstagen', 'In your working days'), formatDecimal(voll, 2, l)],
          [T(l, 'Schon entstanden (erstes Arbeitsjahr)', 'Already accrued (first year)'), m >= 6 ? T(l, 'voller Anspruch', 'full entitlement') : formatDecimal(anspruch, 2, l)],
          [T(l, `Frei am Stück damit, ${LAND_NAME[land].de} ${y}`, `Days off in a row with it, ${LAND_NAME[land].en} ${y}`), num(p.frei, l)],
        ],
        note: T(l, 'Kollektivvertrag oder Arbeitsvertrag können mehr Urlaub geben, nie weniger. Für die sechste Woche ab 25 Dienstjahren zählen Zeiten bei früheren Arbeitgebern höchstens fünf Jahre, Schulzeiten höchstens zwei weitere (§ 3 UrlG).', 'A collective agreement or your contract can give more leave, never less. For the sixth week after 25 years, earlier employers count for at most five years and schooling for at most two more (section 3 of the Leave Act).'),
      };
    },
  };
}

/* ------------------------------------------------------------------ Schuljahr und schulautonome Tage */
const GRUND: Record<string, { de: string; en: string }> = {
  feiertag: { de: 'Feiertag', en: 'Holiday' }, herbst: { de: 'Herbstferien', en: 'Autumn break' }, allerseelen: { de: 'Allerseelen', en: "All Souls' Day" },
  patron: { de: 'Landespatron', en: 'Patron saint' }, weihnacht: { de: 'Weihnachtsferien', en: 'Christmas break' }, semester: { de: 'Semesterferien', en: 'Semester break' },
  ostern: { de: 'Osterferien', en: 'Easter break' }, pfingsten: { de: 'Pfingstferien', en: 'Whitsun break' },
};
function saSpec(l: Lang, a: Args = {}): ToolSpec {
  return {
    inputs: [fLand(l, String(a.land ?? 'W')), { kind: 'select', id: 'sj', label: T(l, 'Schuljahr', 'School year'), def: String(a.sj ?? 2026), options: [2026, 2027].map((y) => ({ value: String(y), label: `${y}/${String(y + 1).slice(2)}` })) }],
    run: (v) => {
      const land = s(v, 'land') as Land, y = n(v, 'sj');
      const j = schuljahr(y, land), sem = semesterferien(y + 1, land), os = ostersonntag(y + 1);
      const name = LAND_NAME[land][l];
      return {
        label: T(l, `Schuljahr ${y}/${String(y + 1).slice(2)} in ${name}`, `School year ${y}/${String(y + 1).slice(2)} in ${name}`),
        value: T(l, `höchstens ${schulautonomMax(y)} schulautonome Tage`, `at most ${schulautonomMax(y)} autonomous days off`),
        sub: T(l, `Der 26. Oktober ${y} ist ein ${wdLong(`${y}-10-26`, l)}; daraus folgt die Höchstzahl nach § 2 Abs. 5 SchZG.`, `26 October ${y} is a ${wdLong(`${y}-10-26`, l)}; that sets the maximum under section 2(5) of the School Hours Act.`),
        rows: [
          [T(l, 'Schulbeginn', 'First day of school'), dShort(j.beginn, l)],
          [T(l, 'Semesterferien', 'Semester break'), span(sem.von, sem.bis, l)],
          [T(l, 'Osterferien', 'Easter break'), span(off(os, -8), off(os, 1), l)],
          [T(l, 'Letzter Schultag', 'Last day of school'), dShort(off(hauptferien(y + 1, land), -1), l)],
          [T(l, 'Schultage Montag bis Freitag', 'School days Monday to Friday'), num(j.schultage, l)],
        ],
        table: j.fenster.length ? {
          caption: T(l, `Schultage zwischen freien Tagen ${y}/${String(y + 1).slice(2)}: hier liegen schulautonome Tage nahe`, `School days between days off ${y}/${String(y + 1).slice(2)}: where autonomous days are likely`),
          headers: [T(l, 'Schultag(e)', 'School day(s)'), T(l, 'Tage', 'Days'), T(l, 'Frei am Stück, wenn schulfrei', 'Off in a row if declared free')],
          rows: j.fenster.map((f) => [span(f.von, f.bis, l), num(f.tage, l), tage(f.frei, l)]),
          align: ['l', 'r', 'l'],
        } : undefined,
        note: T(l, 'Welche Tage schulautonom frei sind, beschließt jede Schule selbst (Schulforum oder Schulgemeinschaftsausschuss). Die Liste zeigt nur, wo es sich anbietet; fragen Sie an Ihrer Schule nach.', 'Each school decides its own autonomous days (school forum or school partnership committee). The list only shows where they fit best; ask your school.'),
      };
    },
  };
}
export { GRUND };

/* ------------------------------------------------------------------ Landespatrone */
function lpSpec(l: Lang, a: Args = {}): ToolSpec {
  return {
    inputs: [fJahr(l, Number(a.jahr ?? 2027)), fLand(l, String(a.land ?? 'K'))],
    run: (v) => {
      const y = n(v, 'jahr'), land = s(v, 'land') as Land;
      const eig = patrone(land).map((p) => ({ ...p, date: toIso(dayNum(y, p.m, p.d)) }));
      const first = eig[0];
      const mitP = optimiere(y, land, 10, { patron: true }).frei, ohne = optimiere(y, land, 10).frei;
      return {
        label: T(l, `${first.name.de.replace(/ \(.*\)/, '')}: ${LAND_NAME[land].de} ${y}`, `${first.name.en.replace(/ \(.*\)/, '')}: ${LAND_NAME[land].en} ${y}`),
        value: dWeek(first.date, l),
        sub: isWeekend(fromIso(first.date)) ? T(l, 'Fällt auf ein Wochenende: kein zusätzlicher freier Tag.', 'Falls at a weekend: no extra day off.') : T(l, 'Schulfrei im ganzen Land; arbeitsfrei nur nach Kollektivvertrag oder Dienstrecht.', 'No school across the province; a day off at work only under a collective agreement or service code.'),
        rows: [
          ...eig.slice(1).map((p) => [p.name[l], dShort(p.date, l)] as [string, string]),
          [T(l, 'Gesetzlicher Feiertag nach ARG', 'Statutory holiday under the ARG'), T(l, 'nein', 'no')],
          [T(l, 'Mit 10 Urlaubstagen frei, Patron als Arbeitstag', 'Days off with 10 leave days, patron worked'), num(ohne, l)],
          [T(l, 'Mit 10 Urlaubstagen frei, Patron frei', 'Days off with 10 leave days, patron off'), num(mitP, l)],
        ],
        table: {
          caption: T(l, `Landespatrone und Landesfeiertage ${y} in allen neun Bundesländern`, `Patron saints' days and provincial days ${y} in all nine provinces`),
          headers: [T(l, 'Bundesland', 'Province'), T(l, 'Tag', 'Day'), T(l, 'Datum', 'Date'), T(l, 'Wochentag', 'Weekday')],
          rows: PATRONE.map((p) => { const d = toIso(dayNum(y, p.m, p.d)); return [LAND_NAME[p.land][l], p.name[l], dLong(d, l), wdLong(d, l)]; }),
          align: ['l', 'l', 'l', 'l'],
        },
      };
    },
  };
}

/* ------------------------------------------------------------------ Persönlicher Feiertag (§ 7a ARG) */
function pfeiertagSpec(l: Lang, a: Args = {}): ToolSpec {
  const tagOpts = (v: V): Opt[] => {
    const y = n(v, 'jahr'), land = (s(v, 'land') || 'W') as Land;
    const o: Opt[] = [{ value: karfreitag(y), label: T(l, `Karfreitag, ${dShort(karfreitag(y), l)}`, `Good Friday, ${dShort(karfreitag(y), l)}`) }];
    for (const b of fenstertage(y, land)) o.push({ value: b.urlaubVon, label: T(l, `Fenstertag, ${dShort(b.urlaubVon, l)}`, `Bridge day, ${dShort(b.urlaubVon, l)}`) });
    for (const p of patrone(land)) { const d = toIso(dayNum(y, p.m, p.d)); if (!isWeekend(fromIso(d))) o.push({ value: d, label: `${p.name[l]}, ${dShort(d, l)}` }); }
    for (const d of [`${y}-12-24`, `${y}-12-31`]) if (!isWeekend(fromIso(d))) o.push({ value: d, label: `${dShort(d, l)}` });
    const seen = new Set<string>();
    return o.filter((x) => (seen.has(x.value) ? false : (seen.add(x.value), true)));
  };
  return {
    inputs: [fJahr(l, Number(a.jahr ?? 2027)), fLand(l, String(a.land ?? 'W')), { kind: 'select', id: 'tag', label: T(l, 'Ihr Wunschtag', 'The day you want'), def: karfreitag(Number(a.jahr ?? 2027)), options: tagOpts, wide: true }],
    run: (v) => {
      const d = s(v, 'tag'), y = n(v, 'jahr'), land = s(v, 'land') as Land;
      const frist = meldefrist(d);
      // Freier Block, wenn genau dieser Tag frei genommen wird.
      const hol = new Set(feiertage(y, land).concat(feiertage(y + 1, land), feiertage(y - 1, land)).map((f) => fromIso(f.date)));
      const free = (x: number) => isWeekend(x) || hol.has(x);
      let lo = fromIso(d), hi = fromIso(d); while (free(lo - 1)) lo--; while (free(hi + 1)) hi++;
      return {
        label: T(l, `Persönlicher Feiertag: ${dWeek(d, l)}`, `Personal holiday: ${dWeek(d, l)}`),
        value: T(l, `bis ${dLong(frist, l)} melden`, `notify by ${dLong(frist, l)}`),
        sub: T(l, 'Schriftlich, spätestens drei Monate vorher (§ 7a Abs. 1 ARG). Der Tag wird vom Urlaub abgezogen.', 'In writing, at least three months ahead (section 7a(1) ARG). The day comes out of your annual leave.'),
        rows: [
          [T(l, 'Meldung spätestens am', 'Notify at the latest on'), dWeek(frist, l)],
          [T(l, 'Frei am Stück mit diesem einen Urlaubstag', 'Days off in a row with this one leave day'), tage(hi - lo + 1, l)],
          [T(l, 'Arbeiten auf Bitte des Arbeitgebers', 'Working at the employer’s request'), T(l, 'doppeltes Entgelt, Urlaubstag bleibt', 'double pay, leave day kept')],
          [T(l, 'Wie oft', 'How often'), T(l, 'einmal pro Urlaubsjahr', 'once per leave year')],
        ],
      };
    },
  };
}

export const SPECS: Record<string, (l: Lang, arg?: Args) => ToolSpec> = { bt: btSpec, ft: ftSpec, at: atSpec, os: osSpec, pf: pfSpec, zu: zuSpec, kw: kwSpec, ua: uaSpec, sa: saSpec, lp: lpSpec, pt: pfeiertagSpec };
export const TOOL_KINDS = [...Object.keys(SPECS), 'kalender', 'naechster'];
export function getTool(kind: string, l: Lang, arg?: Args): ToolSpec {
  const f = SPECS[kind]; if (!f) throw new Error(`simulateur inconnu : ${kind}`);
  return f(l, arg);
}
/** Lance un simulateur avec ses valeurs par défaut (ou celles données) : sert aux pages et aux tests. */
export function runTool(kind: string, l: Lang, arg?: Args, values?: V): ToolOut {
  const spec = getTool(kind, l, arg);
  const v = Object.fromEntries(spec.inputs.map((i) => [i.id, i.def])) as V;
  return spec.run(resolve(spec.inputs, { ...v, ...(values ?? {}) }));
}
export { formatNumber, isoWeek, schulbeginn };

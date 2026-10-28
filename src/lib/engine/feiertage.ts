/**
 * Feiertage in Österreich, berechnet und nicht abgetippt.
 *
 * - Die 13 gesetzlichen Feiertage stehen in § 7 Abs. 2 Arbeitsruhegesetz (ARG) und gleichlautend in § 1 Abs. 1
 *   Feiertagsruhegesetz 1957. Sie gelten in allen neun Bundesländern gleich.
 * - Ostern: Gaußsche Osterformel (Fassung der PTB); Ostermontag +1, Christi Himmelfahrt +39, Pfingstmontag +50,
 *   Fronleichnam +60 Tage nach Ostersonntag.
 * - Fällt ein Feiertag auf einen Sonntag, gelten die Regeln der Wochenendruhe (§ 7 Abs. 7 ARG): kein Ersatztag.
 * - Karfreitag ist seit 2019 kein Feiertag mehr (§ 7 Abs. 3 ARG aufgehoben durch BGBl. I Nr. 22/2019);
 *   an seine Stelle tritt der „persönliche Feiertag“ des § 7a ARG, ein Urlaubstag nach eigener Wahl.
 * - Landespatrone (und in Kärnten der 10. Oktober) sind keine gesetzlichen Feiertage nach dem ARG. Sie sind schulfrei
 *   (§ 2 Abs. 4 Z 2 Schulzeitgesetz 1985 und die Schulzeitgesetze der Länder, die das Datum nennen). Ob ein
 *   Arbeitnehmer frei hat, regeln Kollektivvertrag, Betriebsvereinbarung oder Dienstrecht.
 */

export type Land = 'B' | 'K' | 'NOE' | 'OOE' | 'S' | 'ST' | 'T' | 'V' | 'W';
export const LAENDER: Land[] = ['B', 'K', 'NOE', 'OOE', 'S', 'ST', 'T', 'V', 'W'];
export const LAND_NAME: Record<Land, { de: string; en: string }> = {
  B: { de: 'Burgenland', en: 'Burgenland' },
  K: { de: 'Kärnten', en: 'Carinthia' },
  NOE: { de: 'Niederösterreich', en: 'Lower Austria' },
  OOE: { de: 'Oberösterreich', en: 'Upper Austria' },
  S: { de: 'Salzburg', en: 'Salzburg' },
  ST: { de: 'Steiermark', en: 'Styria' },
  T: { de: 'Tirol', en: 'Tyrol' },
  V: { de: 'Vorarlberg', en: 'Vorarlberg' },
  W: { de: 'Wien', en: 'Vienna' },
};

/* ------------------------------------------------------------------ Tage als ganze Zahlen (UTC) */
const MS = 86400000;
export const dayNum = (y: number, m: number, d: number) => Date.UTC(y, m - 1, d) / MS;
export const fromIso = (iso: string) => { const [y, m, d] = iso.split('-').map(Number); return dayNum(y, m, d); };
export const toIso = (n: number) => new Date(n * MS).toISOString().slice(0, 10);
/** 0 = Sonntag … 6 = Samstag */
export const weekday = (n: number) => new Date(n * MS).getUTCDay();
export const isWeekend = (n: number) => { const w = weekday(n); return w === 0 || w === 6; };

/* ------------------------------------------------------------------ Ostern */
/** Ostersonntag nach der Gaußschen Osterformel, Fassung der PTB (Lichtenberg). Ergebnis als ISO-Datum. */
export function ostersonntag(x: number): string {
  const K = Math.floor(x / 100);
  const M = 15 + Math.floor((3 * K + 3) / 4) - Math.floor((8 * K + 13) / 25);
  const S = 2 - Math.floor((3 * K + 3) / 4);
  const A = x % 19;
  const D = (19 * A + M) % 30;
  const R = Math.floor((D + Math.floor(A / 11)) / 29);
  const OG = 21 + D - R;
  const SZ = 7 - ((x + Math.floor(x / 4) + S) % 7);
  const OE = 7 - (((OG - SZ) % 7) + 7) % 7;
  return toIso(dayNum(x, 3, 1) + OG + OE - 1);
}
/** Zweite, unabhängige Rechnung (Meeus/Jones/Butcher), nur für die Tests. */
export function ostersonntagMeeus(y: number): string {
  const a = y % 19, b = Math.floor(y / 100), c = y % 100, d = Math.floor(b / 4), e = b % 4;
  const f = Math.floor((b + 8) / 25), g = Math.floor((b - f + 1) / 3), h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4), k = c % 4, l = (32 + 2 * e + 2 * i - h - k) % 7, m = Math.floor((a + 11 * h + 22 * l) / 451);
  const month = Math.floor((h + l - 7 * m + 114) / 31), day = ((h + l - 7 * m + 114) % 31) + 1;
  return toIso(dayNum(y, month, day));
}
/** n-ter Wochentag eines Monats (n = −1: letzter). wd 0 = Sonntag. */
export function nthWeekday(y: number, m: number, wd: number, n: number): string {
  if (n > 0) { const first = dayNum(y, m, 1); return toIso(first + ((wd - weekday(first) + 7) % 7) + 7 * (n - 1)); }
  const last = dayNum(y, m + 1, 1) - 1; return toIso(last - ((weekday(last) - wd + 7) % 7));
}
export const plusTage = (iso: string, d: number) => toIso(fromIso(iso) + d);

/* ------------------------------------------------------------------ Die 13 gesetzlichen Feiertage */
export interface FeiertagDef { id: string; name: { de: string; en: string }; date: (y: number) => string }
const fix = (m: number, d: number) => (y: number) => toIso(dayNum(y, m, d));
const ost = (off: number) => (y: number) => plusTage(ostersonntag(y), off);

export const FEIERTAGE: FeiertagDef[] = [
  { id: 'neujahr', name: { de: 'Neujahr', en: "New Year's Day" }, date: fix(1, 1) },
  { id: 'heilige-drei-koenige', name: { de: 'Heilige Drei Könige', en: 'Epiphany' }, date: fix(1, 6) },
  { id: 'ostermontag', name: { de: 'Ostermontag', en: 'Easter Monday' }, date: ost(1) },
  { id: 'staatsfeiertag', name: { de: 'Staatsfeiertag', en: 'Labour Day (Staatsfeiertag)' }, date: fix(5, 1) },
  { id: 'himmelfahrt', name: { de: 'Christi Himmelfahrt', en: 'Ascension Day' }, date: ost(39) },
  { id: 'pfingstmontag', name: { de: 'Pfingstmontag', en: 'Whit Monday' }, date: ost(50) },
  { id: 'fronleichnam', name: { de: 'Fronleichnam', en: 'Corpus Christi' }, date: ost(60) },
  { id: 'mariae-himmelfahrt', name: { de: 'Mariä Himmelfahrt', en: 'Assumption Day' }, date: fix(8, 15) },
  { id: 'nationalfeiertag', name: { de: 'Nationalfeiertag', en: 'National Day' }, date: fix(10, 26) },
  { id: 'allerheiligen', name: { de: 'Allerheiligen', en: "All Saints' Day" }, date: fix(11, 1) },
  { id: 'mariae-empfaengnis', name: { de: 'Mariä Empfängnis', en: 'Immaculate Conception' }, date: fix(12, 8) },
  { id: 'christtag', name: { de: 'Christtag', en: 'Christmas Day' }, date: fix(12, 25) },
  { id: 'stefanitag', name: { de: 'Stefanitag', en: "St Stephen's Day" }, date: fix(12, 26) },
  // Gesetzestext: „25. Dezember (Weihnachten), 26. Dezember (Stephanstag)“; Christtag und Stefanitag sind die üblichen Namen.
];

/* ------------------------------------------------------------------ Landespatrone und Landesfeiertage */
/** Schulfreie Tage der Länder aus ihren Schulzeitgesetzen (Pflichtschulen); kein gesetzlicher Feiertag nach ARG. */
export interface PatronDef { id: string; land: Land; name: { de: string; en: string }; m: number; d: number; art: 'patron' | 'landesfeiertag' }
const P = (id: string, land: Land, de: string, en: string, m: number, d: number, art: PatronDef['art'] = 'patron'): PatronDef => ({ id, land, name: { de, en }, m, d, art });
export const PATRONE: PatronDef[] = [
  P('martin', 'B', 'Hl. Martin (Landespatron)', 'St Martin (patron saint)', 11, 11),
  P('josef', 'K', 'Hl. Josef (Landespatron)', 'St Joseph (patron saint)', 3, 19),
  P('volksabstimmung', 'K', 'Tag der Volksabstimmung', 'Plebiscite Day', 10, 10, 'landesfeiertag'),
  P('leopold', 'NOE', 'Hl. Leopold (Landesfeiertag)', 'St Leopold (provincial day)', 11, 15, 'landesfeiertag'),
  P('florian', 'OOE', 'Hl. Florian (Landespatron)', 'St Florian (patron saint)', 5, 4),
  P('rupert', 'S', 'Hl. Rupert (Landespatron)', 'St Rupert (patron saint)', 9, 24),
  P('josef', 'ST', 'Hl. Josef (Landespatron)', 'St Joseph (patron saint)', 3, 19),
  P('josef', 'T', 'Hl. Josef (Landespatron)', 'St Joseph (patron saint)', 3, 19),
  P('josef', 'V', 'Hl. Josef (Landespatron)', 'St Joseph (patron saint)', 3, 19),
  P('leopold', 'W', 'Hl. Leopold (Landespatron)', 'St Leopold (patron saint)', 11, 15),
];
export const patrone = (land: Land) => PATRONE.filter((p) => p.land === land);

export interface Optionen {
  /** Landespatron (und Kärntner 10. Oktober) als freien Tag zählen: Kollektivvertrag, Dienstrecht, Schule. */
  patron?: boolean;
  /** 24. und 31. Dezember als freie Tage zählen (Kollektivvertrag, Betriebsvereinbarung). */
  heiligabend?: boolean;
}

export interface Feiertag { id: string; date: string; name: { de: string; en: string }; gesetzlich: boolean }
/** Die freien Tage eines Jahres: die 13 gesetzlichen, auf Wunsch die Tage des Landes. Nach Datum. */
export function feiertage(y: number, land: Land = 'W', o: Optionen = {}): Feiertag[] {
  const out: Feiertag[] = FEIERTAGE.map((f) => ({ id: f.id, date: f.date(y), name: f.name, gesetzlich: true }));
  if (o.patron) for (const p of patrone(land)) out.push({ id: p.id, date: toIso(dayNum(y, p.m, p.d)), name: p.name, gesetzlich: false });
  return out.sort((a, b) => a.date.localeCompare(b.date));
}
/** Nur die 13 gesetzlichen Feiertage. */
export const gesetzliche = (y: number) => feiertage(y);
/** Feiertage, die auf einen Werktag (Montag bis Freitag) fallen. */
export const aufWerktag = (list: Feiertag[]) => list.filter((f) => !isWeekend(fromIso(f.date)));
/** Der nächste gesetzliche Feiertag ab einem Tag (einschließlich). */
export function naechster(iso: string, land: Land = 'W', o: Optionen = {}): Feiertag {
  const y = Number(iso.slice(0, 4));
  return [...feiertage(y, land, o), ...feiertage(y + 1, land, o)].find((f) => f.date >= iso)!;
}

/** Die nächsten n freien Tage ab einem Tag (einschließlich), über den Jahreswechsel hinweg. */
export function naechste(iso: string, land: Land = 'W', o: Optionen = {}, n = 5): Feiertag[] {
  const y = Number(iso.slice(0, 4));
  return [...feiertage(y, land, o), ...feiertage(y + 1, land, o)].filter((f) => f.date >= iso).slice(0, n);
}
/** Karfreitag: seit 2019 kein Feiertag mehr (BGBl. I Nr. 22/2019), Datum zwei Tage vor Ostersonntag. */
export const karfreitag = (y: number) => plusTage(ostersonntag(y), -2);
/** Letzter Tag, an dem der „persönliche Feiertag“ (§ 7a ARG) schriftlich bekannt zu geben ist: drei Monate vorher.
 *  Gleicher Kalendertag drei Monate früher; gibt es ihn nicht (31. Mai → 31. Februar), der letzte Tag jenes Monats. */
export function meldefrist(iso: string): string {
  const [y, m, d] = iso.split('-').map(Number);
  let mm = m - 3, yy = y; if (mm < 1) { mm += 12; yy--; }
  const last = new Date(Date.UTC(yy, mm, 0)).getUTCDate();
  return toIso(dayNum(yy, mm, Math.min(d, last)));
}

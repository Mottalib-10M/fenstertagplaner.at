/**
 * Schulfreie Tage eines Schuljahres nach § 2 Schulzeitgesetz 1985 (Bundesschulen) und den Schulzeitgesetzen der Länder
 * (Pflichtschulen), die die Landespatrone mit Datum nennen. Gerechnet für die Fünftagewoche (Samstag schulfrei).
 *
 * - Schulbeginn: erster Montag im September (Burgenland, Niederösterreich, Wien), sonst zweiter Montag.
 * - Herbstferien 27. bis 31. Oktober, Allerseelen 2. November, Weihnachtsferien 24. Dezember bis 6. Jänner
 *   (23. Dezember, wenn er ein Montag ist), Semesterferien eine Woche ab dem 1. (NÖ, Wien), 2. (B, K, S, T, V)
 *   oder 3. Montag im Februar (OÖ, Stmk), Osterferien vom Samstag vor dem Palmsonntag bis Ostermontag,
 *   Pfingstferien vom Samstag vor Pfingsten bis Pfingstmontag.
 * - Schulautonome Tage (§ 2 Abs. 5): höchstens 2, wenn der 26. Oktober ein Sonntag ist, 3 bei Montag oder Samstag,
 *   sonst 4. Welche Tage es werden, beschließt jede Schule; hier stehen nur die Fenstertage, die sich dafür anbieten.
 */
import { feiertage, patrone, dayNum, toIso, fromIso, weekday, isWeekend, ostersonntag, nthWeekday, plusTage, type Land } from './feiertage';

const OST: Land[] = ['B', 'NOE', 'W'];
/** Erster Schultag des Schuljahres, das im September des Jahres y beginnt. */
export const schulbeginn = (y: number, land: Land) => nthWeekday(y, 9, 1, OST.includes(land) ? 1 : 2);
/** Erster Tag der Hauptferien (Samstag) im Sommer des Jahres y. */
export function hauptferien(y: number, land: Land): string {
  const von = OST.includes(land) ? dayNum(y, 6, 28) : dayNum(y, 7, 5);
  return toIso(von + ((6 - weekday(von) + 7) % 7));
}
const SEM: Record<Land, number> = { NOE: 1, W: 1, B: 2, K: 2, S: 2, T: 2, V: 2, OOE: 3, ST: 3 };
/** Semesterferien im Februar des Jahres y: Montag bis Samstag (gesetzliche Regel, § 2 Abs. 2 Z 1 lit. b). */
export const semesterferien = (y: number, land: Land) => { const mo = nthWeekday(y, 2, 1, SEM[land]); return { von: mo, bis: plusTage(mo, 5) }; };
/** Höchstzahl schulautonomer Tage im Schuljahr, das im Herbst y beginnt (§ 2 Abs. 5 SchZG). */
export function schulautonomMax(y: number): number {
  const w = weekday(dayNum(y, 10, 26));
  return w === 0 ? 2 : w === 1 || w === 6 ? 3 : 4;
}

export type Grund = 'feiertag' | 'herbst' | 'allerseelen' | 'patron' | 'weihnacht' | 'semester' | 'ostern' | 'pfingsten';
/** Schulfreie Tage (außer Wochenenden) im Unterrichtsjahr ab Herbst y, mit Grund. */
export function schulfrei(y: number, land: Land): Map<number, Grund> {
  const m = new Map<number, Grund>();
  const set = (a: number, b: number, g: Grund) => { for (let d = a; d <= b; d++) if (!m.has(d)) m.set(d, g); };
  for (const yy of [y, y + 1]) for (const f of feiertage(yy)) m.set(fromIso(f.date), 'feiertag');
  set(dayNum(y, 10, 27), dayNum(y, 10, 31), 'herbst');
  set(dayNum(y, 11, 2), dayNum(y, 11, 2), 'allerseelen');
  for (const p of patrone(land)) { const yy = p.m >= 9 ? y : y + 1; set(dayNum(yy, p.m, p.d), dayNum(yy, p.m, p.d), 'patron'); }
  const d23 = dayNum(y, 12, 23);
  set(weekday(d23) === 1 ? d23 : dayNum(y, 12, 24), dayNum(y + 1, 1, 6), 'weihnacht');
  const s = semesterferien(y + 1, land); set(fromIso(s.von), fromIso(s.bis), 'semester');
  const os = fromIso(ostersonntag(y + 1));
  set(os - 8, os + 1, 'ostern');
  set(os + 48, os + 50, 'pfingsten');
  return m;
}

export interface Schuljahr { beginn: string; ende: string; schultage: number; autonomMax: number; fenster: Array<{ von: string; bis: string; tage: number; frei: number }> }
/** Schuljahr y/y+1: Unterrichtstage, Höchstzahl schulautonomer Tage und die Fenstertage (1 bis 2 Schultage zwischen freien Tagen). */
export function schuljahr(y: number, land: Land): Schuljahr {
  const free = schulfrei(y, land);
  const a = fromIso(schulbeginn(y, land)), e = fromIso(hauptferien(y + 1, land)) - 1;
  const isFree = (d: number) => isWeekend(d) || free.has(d);
  let schultage = 0; for (let d = a; d <= e; d++) if (!isFree(d)) schultage++;
  const fenster: Schuljahr['fenster'] = [];
  for (let d = a; d <= e; d++) {
    if (isFree(d) || !isFree(d - 1)) continue;
    let k = d; while (k <= e && !isFree(k)) k++;
    const len = k - d;
    // Ein Fenster grenzt auf beiden Seiten an freie Tage, und mindestens eine Seite enthält einen freien Werktag
    // (Feiertag oder Ferien), ist also mehr als ein bloßes Wochenende.
    let l = d - 1; while (isFree(l - 1)) l--;
    let r = k; while (r < e + 60 && isFree(r + 1)) r++;
    const werktagFrei = (x: number, y2: number) => { for (let i = x; i <= y2; i++) if (free.has(i) && !isWeekend(i)) return true; return false; };
    if (len <= 2 && k <= e && (werktagFrei(l, d - 1) || werktagFrei(k, r))) {
      fenster.push({ von: toIso(d), bis: toIso(k - 1), tage: len, frei: r - l + 1 });
    }
    d = k;
  }
  return { beginn: toIso(a), ende: toIso(e), schultage, autonomMax: schulautonomMax(y), fenster };
}

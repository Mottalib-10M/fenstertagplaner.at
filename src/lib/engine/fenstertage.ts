/**
 * Fenstertage (in Österreich auch Zwickeltage) und Urlaubsplanung.
 *
 * Das Jahr wird in abwechselnde Blöcke zerlegt: freie Blöcke (Wochenende, gesetzlicher Feiertag, auf Wunsch
 * Landespatron und 24./31. Dezember) und Arbeitsblöcke (Montag bis Freitag ohne Feiertag). Wer alle Tage eines
 * Arbeitsblocks frei nimmt, verbindet die beiden freien Blöcke links und rechts zu einem langen.
 *
 * - `bruecken`: jeder Arbeitsblock von höchstens vier Tagen, der an einen Feiertag grenzt, mit dem Ertrag
 *   (freie Tage am Stück je Urlaubstag), nach Ertrag sortiert. Ein Block von einem Tag ist ein echter Fenstertag.
 * - `optimiere`: die beste Auswahl für ein Budget an Urlaubstagen. Dynamische Programmierung über die geordneten
 *   Arbeitsblöcke (gewählt / nicht gewählt, verbrauchte Tage): maximiert die freien Tage in den entstehenden
 *   Urlaubsblöcken; bei Gleichstand gewinnt die Lösung mit weniger Urlaubstagen. Exakt, kein Näherungsverfahren.
 */
import { feiertage, fromIso, toIso, isWeekend, dayNum, type Land, type Optionen } from './feiertage';
export type { Optionen };

interface Block { frei: boolean; start: number; len: number; feiertag: boolean }

/** Freie und Arbeitsblöcke von Anfang Dezember des Vorjahres bis Ende Januar des Folgejahres. */
export function bloecke(y: number, land: Land, o: Optionen = {}): Block[] {
  const hol = new Set<number>();
  for (const yy of [y - 1, y, y + 1]) for (const f of feiertage(yy, land, o)) hol.add(fromIso(f.date));
  if (o.heiligabend) for (const yy of [y - 1, y, y + 1]) { hol.add(dayNum(yy, 12, 24)); hol.add(dayNum(yy, 12, 31)); }
  const a = dayNum(y - 1, 12, 1), b = dayNum(y + 1, 1, 31);
  const out: Block[] = [];
  for (let d = a; d <= b; d++) {
    const isHol = hol.has(d), frei = isHol || isWeekend(d);
    // Nur ein Feiertag an einem Werktag macht einen Block zur Brücke; der 26. Oktober an einem Sonntag nicht.
    const wirkt = isHol && !isWeekend(d);
    const last = out[out.length - 1];
    if (last && last.frei === frei) { last.len++; last.feiertag ||= wirkt; }
    else out.push({ frei, start: d, len: 1, feiertag: wirkt });
  }
  return out;
}

export interface Bruecke {
  /** Urlaubstage: erster und letzter Tag (ISO). */
  urlaubVon: string; urlaubBis: string; urlaub: number;
  /** Freier Block am Stück, der entsteht. */
  freiVon: string; freiBis: string; frei: number;
  /** Feiertage im entstehenden Block (ids). */
  feiertage: string[];
}
const mk = (bl: Block[], i: number, j: number, y: number, land: Land, o: Optionen): Bruecke => {
  // Arbeitsblöcke i..j (Indizes in bl, alle !frei), mit den freien Blöcken davor und danach.
  const pre = bl[i - 1], post = bl[j + 1];
  const von = pre ? pre.start : bl[i].start, bis = post ? post.start + post.len - 1 : bl[j].start + bl[j].len - 1;
  let urlaub = 0; for (let k = i; k <= j; k++) if (!bl[k].frei) urlaub += bl[k].len;
  const ids = new Set<string>();
  for (const yy of [y - 1, y, y + 1]) for (const f of feiertage(yy, land, o)) { const n = fromIso(f.date); if (n >= von && n <= bis) ids.add(f.id); }
  return { urlaubVon: toIso(bl[i].start), urlaubBis: toIso(bl[j].start + bl[j].len - 1), urlaub, freiVon: toIso(von), freiBis: toIso(bis), frei: bis - von + 1, feiertage: [...ids] };
};
const imJahr = (b: Block, y: number) => b.start >= dayNum(y, 1, 1) && b.start + b.len - 1 <= dayNum(y, 12, 31);

/** Alle Brücken eines Jahres: Arbeitsblöcke bis `max` Tage neben einem Feiertag, beste zuerst. */
export function bruecken(y: number, land: Land, o: Optionen = {}, max = 4): Bruecke[] {
  const bl = bloecke(y, land, o), out: Bruecke[] = [];
  for (let i = 1; i < bl.length - 1; i++) {
    const b = bl[i];
    if (b.frei || b.len > max || !imJahr(b, y)) continue;
    if (!bl[i - 1].feiertag && !bl[i + 1].feiertag) continue;
    out.push(mk(bl, i, i, y, land, o));
  }
  return out.sort((a, b) => b.frei / b.urlaub - a.frei / a.urlaub || b.frei - a.frei || a.urlaubVon.localeCompare(b.urlaubVon));
}

/** Echte Fenstertage: ein einzelner Arbeitstag zwischen einem Feiertag und dem Wochenende (oder zwei Feiertagen). */
export const fenstertage = (y: number, land: Land, o: Optionen = {}) => bruecken(y, land, o, 1);

export interface Plan { bloecke: Bruecke[]; urlaub: number; frei: number; /** Urlaubstage, die keine Brücke mehr verlängern: frei planbar. */ rest: number }
/** Beste Verteilung von `budget` Urlaubstagen im Jahr y (nur Tage im Jahr y verbrauchen Urlaub). */
export function optimiere(y: number, land: Land, budget: number, o: Optionen = {}): Plan {
  const B = Math.max(0, Math.min(60, Math.floor(budget)));
  const bl = bloecke(y, land, o);
  // Indizes der Arbeitsblöcke, in Reihenfolge; zwischen zwei aufeinanderfolgenden liegt genau ein freier Block.
  const runs: number[] = []; for (let i = 0; i < bl.length; i++) if (!bl[i].frei) runs.push(i);
  const n = runs.length, NEG = -1e9;
  const ok = (r: number) => { const i = runs[r]; return i > 0 && i < bl.length - 1 && imJahr(bl[i], y) && bl[i].len <= 10; };
  const fr = (i: number) => (bl[i] && bl[i].frei ? bl[i].len : 0);
  // dp[r][s][c]: bester Wert nach Block r mit c verbrauchten Tagen. s = 0: Block r nicht gewählt;
  // 1: gewählt, die Kette berührt schon einen Feiertag; 2: gewählt, noch ohne Feiertag (darf so nicht enden:
  // eine Urlaubswoche ohne Feiertag ist keine Brücke und bleibt als „frei planbar“ übrig). Wert = 100·frei − urlaub.
  const dp: Float64Array[][] = [], from: Int32Array[][] = [];
  for (let r = 0; r <= n; r++) { dp.push([0, 1, 2].map(() => new Float64Array(B + 1).fill(NEG))); from.push([0, 1, 2].map(() => new Int32Array(B + 1).fill(-1))); }
  dp[0][0][0] = 0;
  const hol = (i: number) => !!(bl[i] && bl[i].frei && bl[i].feiertag);
  for (let r = 0; r < n; r++) {
    const i = runs[r], cost = bl[i].len;
    for (let c = 0; c <= B; c++) for (let s = 0; s < 3; s++) {
      const v = dp[r][s][c]; if (v <= NEG / 2) continue;
      if (s !== 2 && v > dp[r + 1][0][c]) { dp[r + 1][0][c] = v; from[r + 1][0][c] = s; }
      if (ok(r) && c + cost <= B) {
        const gain = s ? cost + fr(i + 1) : fr(i - 1) + cost + fr(i + 1);
        const has = (s === 1) || (s === 0 && hol(i - 1)) || hol(i + 1);
        const t = has ? 1 : 2, nv = v + 100 * gain - cost;
        if (nv > dp[r + 1][t][c + cost]) { dp[r + 1][t][c + cost] = nv; from[r + 1][t][c + cost] = s; }
      }
    }
  }
  let best = 0, bc = 0, bs = 0;
  for (let c = 0; c <= B; c++) for (let s = 0; s < 2; s++) if (dp[n][s][c] > best) { best = dp[n][s][c]; bc = c; bs = s; }
  const chosen: boolean[] = new Array(n).fill(false);
  for (let r = n, c = bc, s = bs; r > 0; r--) { const p = from[r][s][c]; if (s) { chosen[r - 1] = true; c -= bl[runs[r - 1]].len; } s = p < 0 ? 0 : p; }
  const plan: Bruecke[] = [];
  for (let r = 0; r < n; r++) {
    if (!chosen[r]) continue;
    let e = r; while (e + 1 < n && chosen[e + 1]) e++;
    plan.push(mk(bl, runs[r], runs[e], y, land, o)); r = e;
  }
  const urlaub = plan.reduce((a, b) => a + b.urlaub, 0);
  return { bloecke: plan, urlaub, frei: plan.reduce((a, b) => a + b.frei, 0), rest: B - urlaub };
}

/* ------------------------------------------------------------------ Arbeitstage, Kalenderwochen */
/** Arbeitstage (Montag bis Freitag ohne Feiertage) je Monat; 24./31.12. auf Wunsch als frei. */
export function arbeitstage(y: number, land: Land, o: Optionen = {}): number[] {
  const hol = new Set(feiertage(y, land, o).map((f) => fromIso(f.date)));
  if (o.heiligabend) { hol.add(dayNum(y, 12, 24)); hol.add(dayNum(y, 12, 31)); }
  const out: number[] = [];
  for (let m = 1; m <= 12; m++) {
    let c = 0; for (let d = dayNum(y, m, 1); d < dayNum(y, m + 1, 1); d++) if (!isWeekend(d) && !hol.has(d)) c++;
    out.push(c);
  }
  return out;
}
/** Werktage Montag bis Freitag eines Jahres ohne Feiertage. */
export const werktageMoFr = (y: number) => { let c = 0; for (let d = dayNum(y, 1, 1); d <= dayNum(y, 12, 31); d++) if (!isWeekend(d)) c++; return c; };
/** Kalenderwoche nach ISO 8601 (in Österreich ÖNORM EN 28601): Woche mit dem ersten Donnerstag ist KW 1. */
export function isoWeek(iso: string): { year: number; week: number } {
  const n = fromIso(iso), wd = (new Date(n * 86400000).getUTCDay() + 6) % 7; // 0 = Montag
  const thu = n - wd + 3, ty = new Date(thu * 86400000).getUTCFullYear();
  return { year: ty, week: Math.floor((thu - dayNum(ty, 1, 1)) / 7) + 1 };
}
export const weeksInYear = (y: number) => isoWeek(`${y}-12-28`).week;

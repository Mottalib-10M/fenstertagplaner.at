/** Österreichische gesetzliche Zeit → UTC-Zeitpunkt. Normalzeit MEZ (§ 1 Zeitzählungsgesetz); Sommerzeit nach den
 *  Verordnungen der Bundesregierung (zuletzt BGBl. II Nr. 282/2026 für 2027 bis 2031): vom letzten Sonntag im März,
 *  2 Uhr MEZ, bis zum letzten Sonntag im Oktober, 3 Uhr MESZ. Dient den Countdowns. */
import { nthWeekday, fromIso } from './engine/feiertage';
export function wienInstant(dateIso: string, time = '00:00'): string {
  const y = Number(dateIso.slice(0, 4)), [hh, mm] = time.split(':').map(Number);
  const local = Date.UTC(y, Number(dateIso.slice(5, 7)) - 1, Number(dateIso.slice(8, 10)), hh, mm);
  const b = fromIso(nthWeekday(y, 3, 0, -1)) * 864e5 + 1 * 3600e3; // 2 Uhr MEZ = 1 Uhr UTC
  const e = fromIso(nthWeekday(y, 10, 0, -1)) * 864e5 + 1 * 3600e3; // 3 Uhr MESZ = 1 Uhr UTC
  const guessUtc = local - 3600e3;
  const off = guessUtc > b && local - 7200e3 <= e ? 2 : 1;
  return new Date(local - off * 3600e3).toISOString();
}

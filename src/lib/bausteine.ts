/** Blocs de contenu calculés, partagés par plusieurs pages (tableaux : hors contrôle d'unicité). */
import type { Helpers } from './page-types';
import { feiertage, PATRONE, LAENDER, LAND_NAME, dayNum, toIso, isWeekend, fromIso, type Land } from './engine/feiertage';
import { bruecken, arbeitstage, fenstertage } from './engine/fenstertage';
import { schuljahr, schulautonomMax } from './engine/schule';
import { dLong, dShort, wdLong } from './tool-specs';

const T = (h: Helpers, de: string, en: string) => (h.lang === 'de' ? de : en);
const span = (h: Helpers, a: string, b: string) => (a === b ? dShort(a, h.lang) : `${dShort(a, h.lang)} – ${dShort(b, h.lang)}`);
/** Les 13 jours fériés d'une année avec le jour de la semaine et ce qu'ils valent en ponts. */
export function tabelleJahr(h: Helpers, y: number) {
  const ft = new Set(fenstertage(y, 'W').flatMap((b) => b.feiertage));
  const rows = feiertage(y).map((f) => {
    const we = isWeekend(fromIso(f.date));
    return [dLong(f.date, h.lang), wdLong(f.date, h.lang), f.name[h.lang], we ? T(h, 'fällt aufs Wochenende', 'falls at a weekend') : ft.has(f.id) ? T(h, 'mit Fenstertag', 'with a bridge day') : T(h, 'Werktag', 'weekday')];
  });
  return h.table([T(h, 'Datum', 'Date'), T(h, 'Wochentag', 'Weekday'), T(h, 'Feiertag', 'Holiday'), T(h, 'Für die Planung', 'For planning')], rows, T(h, `Die 13 gesetzlichen Feiertage ${y} in Österreich (§ 7 Abs. 2 ARG), gültig in allen neun Bundesländern`, `The 13 statutory public holidays ${y} in Austria, valid in all nine provinces`));
}
/** Landespatrone d'une année, tous les Länder. */
export function tabellePatrone(h: Helpers, y: number) {
  const rows = PATRONE.map((p) => { const d = toIso(dayNum(y, p.m, p.d)); return [LAND_NAME[p.land][h.lang], p.name[h.lang], dLong(d, h.lang), wdLong(d, h.lang)]; });
  return h.table([T(h, 'Bundesland', 'Province'), T(h, 'Tag', 'Day'), T(h, 'Datum', 'Date'), T(h, 'Wochentag', 'Weekday')], rows, T(h, `Landespatrone und Landesfeiertage ${y}: schulfrei, aber keine gesetzlichen Feiertage`, `Patron saints' days and provincial days ${y}: no school, but not statutory holidays`));
}
/** Les meilleurs ponts d'un Land. */
export function tabelleBruecken(h: Helpers, y: number, land: Land, max = 8, patron = false) {
  const rows = bruecken(y, land, { patron }).slice(0, max).map((b) => [span(h, b.urlaubVon, b.urlaubBis), b.urlaub, span(h, b.freiVon, b.freiBis), b.frei]);
  return h.table([T(h, 'Urlaub nehmen', 'Take leave'), T(h, 'Urlaubstage', 'Leave days'), T(h, 'Frei am Stück', 'Off in a row'), T(h, 'Freie Tage', 'Days off')], rows, T(h, `Die ergiebigsten Brücken ${y} in ${LAND_NAME[land].de}${patron ? ' (Landespatron frei)' : ''}`, `Best bridges ${y} in ${LAND_NAME[land].en}${patron ? ' (patron saint off)' : ''}`), ['l', 'r', 'l', 'r']);
}
/** Les Fenstertage d'une année (1 jour de congé), avec date. */
export function tabelleFenster(h: Helpers, y: number) {
  const rows = fenstertage(y, 'W').map((b) => [dLong(b.urlaubVon, h.lang), wdLong(b.urlaubVon, h.lang), span(h, b.freiVon, b.freiBis), b.frei]);
  return h.table([T(h, 'Fenstertag', 'Bridge day'), T(h, 'Wochentag', 'Weekday'), T(h, 'Frei am Stück', 'Off in a row'), T(h, 'Freie Tage', 'Days off')], rows, T(h, `Echte Fenstertage ${y}: ein Urlaubstag zwischen Feiertag und Wochenende`, `True bridge days ${y}: one leave day between a holiday and the weekend`), ['l', 'l', 'l', 'r']);
}
/** Arbeitstage par Land (patron chômé ou non). */
export function tabelleLaender(h: Helpers, y: number) {
  const rows = LAENDER.map((l: Land) => [LAND_NAME[l][h.lang], arbeitstage(y, l).reduce((a, b) => a + b, 0), arbeitstage(y, l, { patron: true }).reduce((a, b) => a + b, 0)]);
  return h.table([T(h, 'Bundesland', 'Province'), T(h, 'Arbeitstage', 'Working days'), T(h, 'mit freiem Landespatron', 'with patron saint off')], rows, T(h, `Arbeitstage ${y} je Bundesland (Montag bis Freitag)`, `Working days ${y} by province (Monday to Friday)`), ['l', 'r', 'r']);
}
/** Les jours fériés d'un Land sur trois ans, une ligne par jour, Landespatron compris. */
export function tabelleLand(h: Helpers, land: Land, jahre = [2026, 2027, 2028]) {
  const ids: Array<{ id: string; name: string; ges: boolean }> = [];
  const by = jahre.map((y) => new Map(feiertage(y, land, { patron: true }).map((f) => { if (!ids.some((x) => x.id === f.id)) ids.push({ id: f.id, name: f.name[h.lang], ges: f.gesetzlich }); return [f.id, f.date]; })));
  const order = (id: string) => { for (const m of by) { const d = m.get(id); if (d) return d.slice(5); } return '99'; };
  ids.sort((a, b) => order(a.id).localeCompare(order(b.id)));
  const cell = (d?: string) => (d ? new Date(`${d}T12:00:00Z`).toLocaleDateString(h.lang === 'de' ? 'de-AT' : 'en-GB', { weekday: 'short', day: 'numeric', month: 'short', timeZone: 'UTC' }) : '–');
  const rows = ids.map((x) => [x.ges ? x.name : `${x.name}*`, ...by.map((m) => cell(m.get(x.id)))]);
  return h.table([T(h, 'Feiertag', 'Holiday'), ...jahre.map(String)], rows, T(h, `Feiertage in ${LAND_NAME[land].de}, ${jahre[0]} bis ${jahre[jahre.length - 1]} (* schulfrei, kein gesetzlicher Feiertag)`, `Holidays in ${LAND_NAME[land].en}, ${jahre[0]} to ${jahre[jahre.length - 1]} (* no school, not a statutory holiday)`), ['l', 'l', 'l', 'l']);
}
/** Fenster d'une année scolaire : jours d'école entre deux jours libres. */
export function tabelleSchule(h: Helpers, y: number, land: Land) {
  const j = schuljahr(y, land);
  const rows = j.fenster.map((f) => [span(h, f.von, f.bis), f.tage, f.frei]);
  return h.table([T(h, 'Schultag(e)', 'School day(s)'), T(h, 'Tage', 'Days'), T(h, 'Frei am Stück, wenn schulautonom frei', 'Off in a row if declared free')], rows, T(h, `${LAND_NAME[land].de}, Schuljahr ${y}/${String(y + 1).slice(2)}: Schultage zwischen freien Tagen, höchstens ${schulautonomMax(y)} schulautonome Tage`, `${LAND_NAME[land].en}, school year ${y}/${String(y + 1).slice(2)}: school days between days off, at most ${schulautonomMax(y)} autonomous days`), ['l', 'r', 'r']);
}

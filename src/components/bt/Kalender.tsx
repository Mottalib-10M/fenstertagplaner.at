/**
 * Jahreskalender mit Kalenderwochen (ISO 8601), den 13 gesetzlichen Feiertagen und auf Wunsch dem Landespatron.
 * Premier rendu = valeurs par défaut du build ; l'adresse partagée est lue après le montage (RECETTE §17.5).
 */
import { useEffect, useMemo, useState } from 'react';
import SelectField from '../ui/SelectField';
import { Choice, ResultCard, Rows, ShareRow } from '../calc/parts';
import { readParams, updateURL } from '../../lib/url-state';
import { feiertage, LAENDER, LAND_NAME, fromIso, dayNum, type Land } from '../../lib/engine/feiertage';
import { arbeitstage, isoWeek, weeksInYear } from '../../lib/engine/fenstertage';
import { dLong } from '../../lib/tool-specs';
import { t } from '../../i18n/ui';
import type { Lang } from '../../lib/format';

interface Props { lang: Lang; year: number; land?: string; methodHref?: string; idPrefix?: string }
const TAG = (l: Lang) => (l === 'de' ? 'de-AT' : 'en-GB');

export default function Kalender({ lang, year, land: land0 = 'W', methodHref, idPrefix = 'k' }: Props) {
  const ui = t(lang), T = (de: string, en: string) => (lang === 'de' ? de : en);
  const [land, setLand] = useState<Land>(land0 as Land);
  const [lp, setLp] = useState<'ja' | 'nein'>('ja');
  useEffect(() => {
    const u = readParams(window.location.search);
    const l = u.get('land') as Land | null;
    if (l && LAENDER.includes(l)) setLand(l);
    const p = u.get('lp'); if (p === 'ja' || p === 'nein') setLp(p);
  }, []);
  useEffect(() => updateURL({ land, lp }), [land, lp]);
  const list = useMemo(() => feiertage(year, land, { patron: lp === 'ja' }), [year, land, lp]);
  const hol = useMemo(() => new Map(list.map((f) => [f.date, f])), [list]);
  const at = useMemo(() => arbeitstage(year, land).reduce((a, b) => a + b, 0), [year, land]);
  const ges = list.filter((f) => f.gesetzlich);
  const wk = ges.filter((f) => { const w = new Date(fromIso(f.date) * 864e5).getUTCDay(); return w !== 0 && w !== 6; }).length;
  const wdHead = Array.from({ length: 7 }, (_, i) => new Date(Date.UTC(2027, 1, 1 + i)).toLocaleDateString(TAG(lang), { weekday: 'short', timeZone: 'UTC' }).replace('.', ''));
  const months = Array.from({ length: 12 }, (_, m) => {
    const first = dayNum(year, m + 1, 1), last = dayNum(year, m + 2, 1) - 1;
    const lead = (new Date(first * 864e5).getUTCDay() + 6) % 7;
    const cells: Array<number | null> = [...Array(lead).fill(null)];
    for (let d = first; d <= last; d++) cells.push(d);
    while (cells.length % 7) cells.push(null);
    const weeks: Array<Array<number | null>> = []; for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7));
    return { name: new Date(first * 864e5).toLocaleDateString(TAG(lang), { month: 'long', timeZone: 'UTC' }), weeks };
  });
  const iso = (d: number) => new Date(d * 864e5).toISOString().slice(0, 10);
  return (
    <div className="rounded-xl border border-navy-200 bg-white p-4 sm:p-5">
      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,23rem)]">
        <form className="grid content-start grid-cols-1 gap-x-4 gap-y-3 sm:grid-cols-2" onSubmit={(e) => e.preventDefault()}>
          <SelectField id={`${idPrefix}-land`} label={T('Bundesland', 'Province')} value={land} onChange={(v) => setLand(v as Land)} options={LAENDER.map((c) => ({ value: c, label: LAND_NAME[c][lang] }))} />
          <div className="grid grid-rows-subgrid row-span-3"><Choice id={`${idPrefix}-lp`} label={T('Landespatron eintragen', "Mark the patron saint's day")} value={lp} options={[{ value: 'ja', label: T('Ja', 'Yes') }, { value: 'nein', label: T('Nein', 'No') }]} onChange={(v) => setLp(v)} /></div>
        </form>
        <ResultCard label={T(`Kalender ${year}, ${LAND_NAME[land].de}`, `Calendar ${year}, ${LAND_NAME[land].en}`)} value={T(`${ges.length} Feiertage`, `${ges.length} public holidays`)} sub={T(`${at} Arbeitstage, ${weeksInYear(year)} Kalenderwochen`, `${at} working days, ${weeksInYear(year)} weeks`)}>
          <Rows rows={[[T('Feiertage an Werktagen', 'Holidays on weekdays'), String(wk)], [T('KW 1 beginnt am', 'Week 1 starts on'), dLong(iso(dayNum(year, 1, 4) - ((new Date(dayNum(year, 1, 4) * 864e5).getUTCDay() + 6) % 7)), lang)]]} />
          <ShareRow methodHref={methodHref} labels={ui} />
        </ResultCard>
      </div>
      <div className="kal-grid mt-6">
        {months.map((mo) => (
          <table key={mo.name}>
            <caption className="mb-1 text-left text-sm font-semibold text-navy-900">{mo.name} {year}</caption>
            <thead><tr><th scope="col" className="text-[0.7rem] font-medium text-navy-600">{T('KW', 'Wk')}</th>{wdHead.map((h) => <th key={h} scope="col" className="font-medium text-navy-700">{h}</th>)}</tr></thead>
            <tbody>{mo.weeks.map((w, i) => {
              const firstDay = w.find((x) => x !== null)!;
              return (
                <tr key={i}><td className="kw">{isoWeek(iso(firstDay)).week}</td>
                  {w.map((d, j) => {
                    if (d === null) return <td key={j} />;
                    const f = hol.get(iso(d));
                    const cls = f ? (f.gesetzlich ? 'ft' : 'tf') : j >= 5 ? 'we' : '';
                    return <td key={j} className={cls} title={f ? f.name[lang] : undefined}>{new Date(d * 864e5).getUTCDate()}</td>;
                  })}
                </tr>
              );
            })}</tbody>
          </table>
        ))}
      </div>
      <p className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-navy-700"><span><span className="mr-1 inline-block h-3 w-3 rounded bg-accent-100 align-middle" aria-hidden="true" />{T('gesetzlicher Feiertag', 'public holiday')}</span><span><span className="mr-1 inline-block h-3 w-3 rounded bg-navy-100 align-middle" aria-hidden="true" />{T('Landespatron: schulfrei, kein gesetzlicher Feiertag', 'patron saint: no school, not a public holiday')}</span></p>
      <ul className="mt-4 grid gap-x-6 gap-y-1 text-sm text-navy-800 sm:grid-cols-2">
        {list.map((f) => <li key={f.id + f.date}><span className="tabular-nums">{dLong(f.date, lang)}</span> · {f.name[lang]}</li>)}
      </ul>
    </div>
  );
}

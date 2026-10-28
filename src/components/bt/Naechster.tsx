/**
 * Der nächste Feiertag: Name, Datum, Countdown in der Zeit des Geräts, die folgenden Feiertage.
 * Premier rendu = jour du build (__BUILD_DAY__), identique serveur/navigateur (RECETTE §17.5) ; l'horloge de
 * l'appareil prend le relais après le montage. Rien n'est envoyé.
 */
import { useEffect, useMemo, useState } from 'react';
import SelectField from '../ui/SelectField';
import { Choice, ResultCard, Rows, ShareRow } from '../calc/parts';
import { readParams, updateURL } from '../../lib/url-state';
import { naechste, LAENDER, LAND_NAME, fromIso, isWeekend, type Land } from '../../lib/engine/feiertage';
import { wienInstant } from '../../lib/zeit';
import { dWeek, dShort } from '../../lib/tool-specs';
import { t } from '../../i18n/ui';
import type { Lang } from '../../lib/format';

interface Props { lang: Lang; methodHref?: string; idPrefix?: string }
const isoOf = (ms: number) => { const d = new Date(ms); const p = (x: number) => String(x).padStart(2, '0'); return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`; };

export default function Naechster({ lang, methodHref, idPrefix = 'n' }: Props) {
  const ui = t(lang), T = (de: string, en: string) => (lang === 'de' ? de : en);
  const [land, setLand] = useState<Land>('W');
  const [lp, setLp] = useState<'nein' | 'ja'>('nein');
  const [now, setNow] = useState<number>(() => Date.parse(`${__BUILD_DAY__}T00:00:00Z`));
  const [live, setLive] = useState(false);
  useEffect(() => {
    const u = readParams(window.location.search);
    const l = u.get('land') as Land | null; if (l && LAENDER.includes(l)) setLand(l);
    const p = u.get('lp'); if (p === 'ja' || p === 'nein') setLp(p);
    setNow(Date.now()); setLive(true);
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);
  useEffect(() => updateURL({ land, lp }), [land, lp]);
  const today = live ? isoOf(now) : __BUILD_DAY__;
  const list = useMemo(() => naechste(today, land, { patron: lp === 'ja' }, 6), [today, land, lp]);
  const next = list[0];
  const left = Math.max(0, Date.parse(wienInstant(next.date)) - now);
  const d = Math.floor(left / 864e5), h = Math.floor((left % 864e5) / 36e5), m = Math.floor((left % 36e5) / 6e4), s = Math.floor((left % 6e4) / 1e3);
  const nf = new Intl.NumberFormat(lang === 'de' ? 'de-AT' : 'en-GB');
  const heute = next.date === today;
  return (
    <div className="rounded-xl border border-navy-200 bg-white p-4 sm:p-5">
      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,23rem)]">
        <form className="grid content-start grid-cols-1 gap-x-4 gap-y-3 sm:grid-cols-2" onSubmit={(e) => e.preventDefault()}>
          <SelectField id={`${idPrefix}-land`} label={T('Bundesland', 'Province')} value={land} onChange={(v) => setLand(v as Land)} options={LAENDER.map((c) => ({ value: c, label: LAND_NAME[c][lang] }))} />
          <div className="grid grid-rows-subgrid row-span-3"><Choice id={`${idPrefix}-lp`} label={T('Landespatron mitzählen', "Count the patron saint's day")} value={lp} options={[{ value: 'nein', label: T('Nein', 'No') }, { value: 'ja', label: T('Ja', 'Yes') }]} onChange={(v) => setLp(v)} /></div>
          <div className="sm:col-span-2 rounded-lg border border-accent-200 bg-accent-50 px-4 py-3" data-chrome>
            <p className="text-sm font-medium text-navy-700">{heute ? T('Heute ist Feiertag', 'Today is a holiday') : T('Noch bis', 'Time left until')} {next.name[lang]}</p>
            {!heute && <p className="mt-1 flex flex-wrap gap-x-4 gap-y-1" aria-live="off">
              {[[d, ui.days], [h, ui.hours], [m, ui.minutes], [s, ui.seconds]].map(([v, u]) => <span key={String(u)} className="inline-flex items-baseline gap-1"><span className="tabular-nums text-2xl font-bold text-navy-900">{nf.format(Number(v))}</span><span className="text-sm text-navy-600">{u}</span></span>)}
            </p>}
            <p className="mt-1 text-xs text-navy-600">{T('Gerechnet bis 0 Uhr österreichischer Zeit, mit der Uhr Ihres Geräts.', 'Counted to midnight Austrian time, using your device clock.')}</p>
          </div>
        </form>
        <ResultCard label={T(`Nächster Feiertag in ${LAND_NAME[land].de}`, `Next holiday in ${LAND_NAME[land].en}`)} value={next.name[lang]} sub={dWeek(next.date, lang)}>
          <Rows rows={list.slice(1).map((f) => [f.name[lang] + (f.gesetzlich ? '' : '*'), dShort(f.date, lang) + (isWeekend(fromIso(f.date)) ? T(' (Wochenende)', ' (weekend)') : '')] as [string, string])} />
          {list.some((f) => !f.gesetzlich) && <p className="mt-2 text-xs text-navy-600">{T('* schulfrei, kein gesetzlicher Feiertag', '* no school, not a statutory holiday')}</p>}
          <ShareRow methodHref={methodHref} labels={ui} />
        </ResultCard>
      </div>
    </div>
  );
}

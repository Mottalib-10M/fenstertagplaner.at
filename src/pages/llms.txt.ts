/** llms.txt (RECETTE §21), généré à partir du registre des pages. */
import { GUIDES } from '../lib/pages';
import { SITE_URL, LAST_UPDATED, SITE_NAMES } from '../data/site-config';
import { route } from '../i18n/routes';
import { GROUPS } from '../i18n/nav';
import { KIT as K } from '../lib/kit';
export function GET() {
  const w = K.optimiere(2027, 'W', 10), sz = K.P.sommerzeit;
  const lines = [
    `# ${SITE_NAMES.de}`, '',
    `> Bridge days (Fenstertage) and statutory public holidays for Austria's nine provinces, 2026 to 2028, in German (de-AT) and English. Holidays from section 7 of the Rest Periods Act (ARG) and the 1957 Public Holiday Rest Act, read on RIS on ${K.P.retrieved_at}: 13 holidays, the same in every province; Good Friday is not a holiday since 2019, replaced by the personal holiday under section 7a ARG (three months' written notice). Patron saints' days (e.g. 15 November in Vienna and Lower Austria, 19 March in Carinthia, Styria, Tyrol, Vorarlberg) are days without school under provincial school acts, not statutory holidays. School breaks and the maximum of autonomous school days from section 2 of the School Hours Act. Easter by Gauss's formula (PTB version), cross-checked against an independent algorithm for 1600-2600. Easter Sunday 2027: ${K.ostersonntag(2027)}; summer time 2027: ${K.nthWeekday(2027, 3, 0, -1)} to ${K.nthWeekday(2027, 10, 0, -1)} (BGBl. II ${sz[sz.length - 1].bgbl}). Leave planner: exact dynamic programming over the year's working blocks; example Vienna 2027, ${w.urlaub} leave days give ${w.frei} days off. Everything runs in the browser; nothing entered is sent. Independent site by Radif Partners; no travel, hotel or affiliate offers. Last updated ${LAST_UPDATED}.`, '',
    `## Bridge-day planner`, `- [Fenstertage 2027](${SITE_URL}${route('home', 'de')})`, `- [Bridge days 2027](${SITE_URL}${route('home', 'en')})`, '',
    ...GROUPS.flatMap((g) => [`## ${g.label.en} / ${g.label.de}`, ...GUIDES.filter((p) => p.group === g.id).flatMap((p) => [
      `- [${p.de.nav}](${SITE_URL}${route(p.id, 'de')}): ${p.de.card}`,
      `- [${p.en.nav}](${SITE_URL}${route(p.id, 'en')}): ${p.en.card}`,
    ]), '']),
    '## About', `- [Methode](${SITE_URL}${route('method', 'de')})`, `- [Method](${SITE_URL}${route('method', 'en')})`, `- [Über uns](${SITE_URL}${route('about', 'de')})`, `- [About](${SITE_URL}${route('about', 'en')})`,
  ];
  return new Response(lines.join('\n') + '\n', { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}

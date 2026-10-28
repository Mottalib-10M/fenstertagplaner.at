/** Une page par Bundesland : jours fériés 2026–2028, Landespatron (loi scolaire du Land), année scolaire, ponts 2027. Dates : moteur. */
import { defineGuide, type GuideDef, type FAQ, type Helpers } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';
import { tabelleLand, tabelleBruecken, tabelleSchule } from '../../lib/bausteine';
import { dLong, wdLong } from '../../lib/tool-specs';
import type { Land } from '../../lib/engine/feiertage';

type L = 'de' | 'en';
interface Txt { slug: string; nav: string; card: string; title: string; description: string; h1: string; intro: string; resume: string; faqs: FAQ[]; text: (h: Helpers) => string }
interface Def { id: string; land: Land; order: number; sources: string[]; related: string[]; de: Txt; en: Txt }

const iso = (y: number, m: number, d: number) => K.toIso(K.dayNum(y, m, d));
const wd = (y: number, m: number, d: number, l: L) => wdLong(iso(y, m, d), l);
const opt = (land: Land, y: number, b: number, patron = false) => K.optimiere(y, land, b, { patron });
const sem = (land: Land, y = 2027) => K.semesterferien(y, land);
const sj = (land: Land, y = 2026) => K.schuljahr(y, land);
const OST: Land[] = ['B', 'NOE', 'W'];

function build(d: Def): GuideDef {
  const body = (lang: L) => (h: Helpers) => {
    const name = h.land(d.land), T = (de: string, en: string) => (lang === 'de' ? de : en);
    const j = sj(d.land), s = sem(d.land), p = opt(d.land, 2027, 10), pp = opt(d.land, 2027, 10, true);
    const ost = OST.includes(d.land);
    return `<h2>${T(`Feiertage ${name} 2026, 2027 und 2028`, `${name} public holidays 2026, 2027 and 2028`)}</h2>
${tabelleLand(h, d.land)}
${d[lang].text(h)}
<h2>${T(`Schuljahr 2026/27 in ${name}`, `School year 2026/27 in ${name}`)}</h2>
<p>${T(`Die Schule begann am ${dLong(j.beginn, 'de')}, dem ${ost ? 'ersten' : 'zweiten'} Montag im September. Die Semesterferien dauern vom ${dLong(s.von, 'de')} bis ${dLong(s.bis, 'de')}, der letzte Schultag vor den Sommerferien ist der ${dLong(j.ende, 'de')}. ${name} hat damit ${j.schultage} Schultage von Montag bis Freitag. Schulautonom frei geben dürfen die Schulen höchstens ${K.schulautonomMax(2026)} Tage; die folgenden Schultage liegen zwischen zwei freien Tagen und bieten sich dafür an.`, `School started on ${dLong(j.beginn, 'en')}, the ${ost ? 'first' : 'second'} Monday in September. The semester break runs from ${dLong(s.von, 'en')} to ${dLong(s.bis, 'en')}, and the last school day before the summer is ${dLong(j.ende, 'en')}. That gives ${name} ${j.schultage} school days from Monday to Friday. Schools may declare at most ${K.schulautonomMax(2026)} autonomous days off; the school days below sit between two days off and are the natural candidates.`)}</p>
${tabelleSchule(h, 2026, d.land)}
<h2>${T(`Fenstertage 2027 in ${name}`, `Bridge days 2027 in ${name}`)}</h2>
<p>${T(`Mit zehn Urlaubstagen kommen Sie 2027 in ${name} auf insgesamt ${p.frei} freie Tage${pp.frei !== p.frei ? `, mit freiem Landespatron auf ${pp.frei}` : ''}. 2028 bringt dieselbe Zahl ${opt(d.land, 2028, 10).frei} freie Tage. Die Tabelle nimmt an, dass der Landespatron bei Ihnen frei ist; ist er es nicht, zeigt der Planer die Werte ohne ihn.`, `Ten leave days give ${p.frei} days off in total in ${name} in 2027${pp.frei !== p.frei ? `, or ${pp.frei} if your patron saint's day is off` : ''}. In 2028 the same number buys ${opt(d.land, 2028, 10).frei}. The table assumes the patron saint's day is off for you; if it is not, the planner shows the figures without it.`)}</p>
${tabelleBruecken(h, 2027, d.land, 8, true)}
${h.mini('bt', { p: ['urlaub', 'jahr'], d: { land: d.land, lp: 'frei' }, c: T(`Alle Brücken in ${name} planen`, `Plan every bridge in ${name}`) })}`;
  };
  return defineGuide({
    id: d.id, group: 'laender', order: d.order, tool: 'ft', toolArg: { land: d.land, jahr: 2027, lp: 'frei' },
    related: d.related, sources: ['arg7', 'schzg2', ...d.sources],
    de: { ...d.de, body: body('de') }, en: { ...d.en, body: body('en') },
  });
}

const DEFS: Def[] = [
  {
    id: 'feiertage-burgenland', land: 'B', order: 40, sources: ['schule-b'], related: ['feiertage-niederoesterreich', 'feiertage-wien', 'landesfeiertage', 'feiertage-2027'],
    de: {
      slug: 'feiertage-burgenland', nav: 'Burgenland', card: 'Martinitag am 11. November schulfrei',
      title: 'Feiertage Burgenland 2027: Martinitag, Ferien, Fenstertage',
      description: 'Feiertage im Burgenland 2027 mit Wochentag: die 13 gesetzlichen Feiertage, der Martinitag am 11. November, Semesterferien und Fenstertage für 2026 bis 2028.',
      h1: 'Feiertage im Burgenland 2027',
      intro: 'Gesetzliche Feiertage, Martinitag und Schulferien im Burgenland, mit Wochentag und den Brücken, die 2027 am meisten bringen.',
      resume: `Im Burgenland gelten die 13 gesetzlichen Feiertage Österreichs, dazu kommt der 11. November, der Tag des heiligen Martin. Der Landespatron ist nach § 48 des Burgenländischen Pflichtschulgesetzes schulfrei, aber kein gesetzlicher Feiertag nach dem Arbeitsruhegesetz; wer im Betrieb frei hat, verdankt das dem Kollektivvertrag oder dem Dienstrecht. 2026 fiel der Martinitag auf einen ${wd(2026, 11, 11, 'de')}, 2027 ist er ein ${wd(2027, 11, 11, 'de')}, 2028 ein ${wd(2028, 11, 11, 'de')}. Für Schulkinder ergibt das 2027 ein verlängertes Wochenende mit dem Freitag als möglichem schulautonomen Tag. Das Burgenland zählt mit Niederösterreich und Wien zum Osten: Die Schule beginnt am ersten Montag im September, die Hauptferien eine Woche früher als in den übrigen Ländern, 2027 am ${dLong(K.hauptferien(2027, 'B'), 'de')}. Die Semesterferien beginnen dagegen am zweiten Montag im Februar, 2027 am ${dLong(sem('B').von, 'de')}. Mit zehn Urlaubstagen und freiem Martinitag kommen Sie 2027 auf ${opt('B', 2027, 10, true).frei} freie Tage, ohne ihn auf ${opt('B', 2027, 10).frei}. Das Burgenland hat ${K.arbeitstage(2027, 'B').reduce((a, b) => a + b, 0)} Arbeitstage, wenn der 11. November gearbeitet wird.`,
      faqs: [
        { q: 'Ist der 11. November im Burgenland ein Feiertag?', a: 'Schulfrei ja, gesetzlich nein. Das Burgenländische Pflichtschulgesetz nennt den 11. November als schulfreien Tag. Im Arbeitsrecht ist er kein Feiertag; ob Sie frei haben, regelt Ihr Kollektivvertrag oder Dienstrecht. 2027 fällt der Martinitag auf einen Donnerstag, 2028 auf einen Samstag und damit ins Wochenende.' },
        { q: 'Wann sind die Semesterferien 2027 im Burgenland?', a: `Vom ${dLong(sem('B').von, 'de')} bis ${dLong(sem('B').bis, 'de')}, am zweiten Montag im Februar beginnend. 2028 beginnen sie am ${dLong(sem('B', 2028).von, 'de')}. Das Burgenland teilt den Termin mit Kärnten, Salzburg, Tirol und Vorarlberg; Wien und Niederösterreich haben eine Woche früher frei, Oberösterreich und die Steiermark eine Woche später.` },
        { q: 'Wann beginnen die Sommerferien 2027 im Burgenland?', a: `Am Samstag, ${dLong(K.hauptferien(2027, 'B'), 'de')}, wie in Niederösterreich und Wien. Das neue Schuljahr beginnt am ${dLong(K.schulbeginn(2027, 'B'), 'de')}. Die Sommerferien dauern damit rund neun Wochen. In den übrigen Ländern außer Niederösterreich und Wien beginnen sie eine Woche später, am 10. Juli 2027, und die Schule startet dort am 13. September.` },
      ],
      text: (h) => `<h2>Martinitag im Burgenland</h2>
<p>Der 11. November ist im Burgenland der Festtag des Landespatrons. Das ${h.src('schule-b', 'Burgenländische Pflichtschulgesetz')} nennt ihn ausdrücklich als schulfreien Tag; für die Bundesschulen verweist das Schulzeitgesetz auf den Landespatron. Im Arbeitsrecht ist der Tag ein gewöhnlicher Werktag. 2027 fällt er auf einen Donnerstag, der Freitag danach ist für Schulen ein naheliegender schulautonomer Tag und für Erwachsene mit freiem Martinitag ein Fenstertag.</p>`,
    },
    en: {
      slug: 'public-holidays-burgenland', nav: 'Burgenland', card: "St Martin's Day, 11 November, no school",
      title: "Public holidays Burgenland 2027: St Martin's Day, breaks",
      description: "Public holidays in Burgenland 2027 with weekdays: Austria's 13 statutory holidays, St Martin's Day on 11 November, the semester break and bridge days to 2028.",
      h1: 'Public holidays in Burgenland 2027',
      intro: "Statutory holidays, St Martin's Day and school breaks in Burgenland, with weekdays and the bridges that pay most in 2027.",
      resume: `Burgenland has Austria's 13 statutory holidays plus 11 November, St Martin's Day. Under section 48 of the Burgenland Compulsory Schools Act the patron saint's day is a day without school, but it is not a holiday under the Rest Periods Act; anyone who gets it off at work owes that to a collective agreement or the service code. In 2026 St Martin's Day fell on a ${wd(2026, 11, 11, 'en')}, in 2027 it is a ${wd(2027, 11, 11, 'en')} and in 2028 a ${wd(2028, 11, 11, 'en')}. For school children 2027 brings a long weekend, with the Friday a likely autonomous day. Burgenland belongs to the east with Lower Austria and Vienna: school starts on the first Monday in September and the summer holidays a week earlier than in the other provinces, on ${dLong(K.hauptferien(2027, 'B'), 'en')} in 2027. The semester break, however, starts on the second Monday in February, ${dLong(sem('B').von, 'en')} in 2027. Ten leave days with St Martin's Day off give ${opt('B', 2027, 10, true).frei} days off in 2027, without it ${opt('B', 2027, 10).frei}. Burgenland has ${K.arbeitstage(2027, 'B').reduce((a, b) => a + b, 0)} working days if 11 November is worked.`,
      faqs: [
        { q: 'Is 11 November a public holiday in Burgenland?', a: 'No school, yes; statutory holiday, no. The Burgenland Compulsory Schools Act lists 11 November as a day without school. In employment law it is no holiday; whether you get it off depends on your collective agreement or service code. In 2027 St Martin\'s Day is a Thursday, in 2028 a Saturday.' },
        { q: 'When is the 2027 semester break in Burgenland?', a: `From ${dLong(sem('B').von, 'en')} to ${dLong(sem('B').bis, 'en')}, starting on the second Monday in February. In 2028 it starts on ${dLong(sem('B', 2028).von, 'en')}. Burgenland shares the date with Carinthia, Salzburg, Tyrol and Vorarlberg; Vienna and Lower Austria are off a week earlier, Upper Austria and Styria a week later.` },
        { q: 'When do the 2027 summer holidays start in Burgenland?', a: `On Saturday ${dLong(K.hauptferien(2027, 'B'), 'en')}, as in Lower Austria and Vienna. The new school year starts on ${dLong(K.schulbeginn(2027, 'B'), 'en')}. That makes a summer break of about nine weeks. In the provinces other than Lower Austria and Vienna it starts a week later, on 10 July 2027, and school resumes there on 13 September.` },
      ],
      text: (h) => `<h2>St Martin's Day in Burgenland</h2>
<p>11 November is the feast of Burgenland's patron saint. The ${h.src('schule-b', 'Burgenland Compulsory Schools Act')} names it expressly as a day without school; for federal schools the School Hours Act refers to the patron saint. In employment law it is an ordinary working day. In 2027 it falls on a Thursday, so the Friday after is an obvious autonomous school day and, for adults who get St Martin's Day off, a bridge day.</p>`,
    },
  },
  {
    id: 'feiertage-kaernten', land: 'K', order: 41, sources: ['schule-k'], related: ['feiertage-steiermark', 'feiertage-salzburg', 'landesfeiertage', 'feiertage-2027'],
    de: {
      slug: 'feiertage-kaernten', nav: 'Kärnten', card: '19. März und 10. Oktober schulfrei',
      title: 'Feiertage Kärnten 2027: 19. März, 10. Oktober und Ferien',
      description: 'Feiertage in Kärnten 2027 mit Wochentag: die 13 gesetzlichen Feiertage, der Josefitag am 19. März und der 10. Oktober, Semesterferien und Fenstertage bis 2028.',
      h1: 'Feiertage in Kärnten 2027',
      intro: 'Gesetzliche Feiertage, Josefitag, Tag der Volksabstimmung und Schulferien in Kärnten, mit Wochentag und den besten Brücken 2027.',
      resume: `Kärnten ist das einzige Bundesland mit zwei eigenen schulfreien Tagen. Der 19. März ist der Tag des heiligen Josef, des Landespatrons, der 10. Oktober erinnert an die Volksabstimmung von 1920, mit der Südkärnten bei Österreich blieb. Beide stehen in § 74 des Kärntner Schulgesetzes; gesetzliche Feiertage im Sinne des Arbeitsruhegesetzes sind sie nicht. Für Beschäftigte gelten die 13 Feiertage, die in ganz Österreich gleich sind; ob Josefitag oder 10. Oktober frei sind, bestimmen Kollektivvertrag oder Dienstrecht. 2027 fällt der 19. März auf einen ${wd(2027, 3, 19, 'de')}, unmittelbar vor den Osterferien, die am ${dLong(K.toIso(K.fromIso(K.ostersonntag(2027)) - 8), 'de')} beginnen; der 10. Oktober ist ein ${wd(2027, 10, 10, 'de')}. 2028 liegen beide Tage auf einem Wochenende beziehungsweise Dienstag: der 19. März auf einem ${wd(2028, 3, 19, 'de')}, der 10. Oktober auf einem ${wd(2028, 10, 10, 'de')}. Kärnten zählt zu den sechs Ländern mit dem späteren Schuljahr: Schulbeginn am zweiten Montag im September, Hauptferien 2027 ab ${dLong(K.hauptferien(2027, 'K'), 'de')}, Semesterferien ab dem zweiten Montag im Februar, 2027 am ${dLong(sem('K').von, 'de')}.`,
      faqs: [
        { q: 'Ist der 10. Oktober in Kärnten frei?', a: `Für die Schulen ja: Das Kärntner Schulgesetz nennt den 10. Oktober als schulfrei. Für Arbeitnehmerinnen und Arbeitnehmer ist er kein gesetzlicher Feiertag. 2027 fällt er auf einen ${wd(2027, 10, 10, 'de')}, 2028 auf einen ${wd(2028, 10, 10, 'de')}. Der Tag erinnert an die Kärntner Volksabstimmung vom 10. Oktober 1920.` },
        { q: 'Ist der Josefitag in Kärnten ein Feiertag?', a: `Schulfrei ja, gesetzlich nein. 2027 fällt der 19. März auf einen ${wd(2027, 3, 19, 'de')}, sodass Schulkinder mit den Osterferien ab Samstag elf Tage am Stück frei haben. 2028 fällt der 19. März auf einen Sonntag und bringt weder Schulkindern noch Beschäftigten einen zusätzlichen freien Tag.` },
        { q: 'Wann sind die Semesterferien 2027 in Kärnten?', a: `Vom ${dLong(sem('K').von, 'de')} bis ${dLong(sem('K').bis, 'de')}. 2028 beginnen sie am ${dLong(sem('K', 2028).von, 'de')}. Kärnten teilt den Termin mit dem Burgenland, Salzburg, Tirol und Vorarlberg. Wien und Niederösterreich haben eine Woche früher frei, Oberösterreich und die Steiermark eine Woche später.` },
      ],
      text: (h) => `<h2>Josefitag und Tag der Volksabstimmung</h2>
<p>Das ${h.src('schule-k', 'Kärntner Schulgesetz')} zählt in § 74 neben Sonn- und Feiertagen und dem Allerseelentag ausdrücklich den 19. März und den 10. Oktober zu den schulfreien Tagen. Damit hat Kärnten einen schulfreien Tag mehr als jedes andere Land. Im Arbeitsrecht sind beide Tage Werktage. Wer Kinder hat und selbst arbeitet, sollte die beiden Tage früh im Urlaubsplan berücksichtigen; 2027 schließt der Josefitag direkt an die Osterferien an, 2028 fällt er auf einen Sonntag.</p>`,
    },
    en: {
      slug: 'public-holidays-carinthia', nav: 'Carinthia', card: 'No school on 19 March and 10 October',
      title: 'Public holidays Carinthia 2027: 19 March, 10 October',
      description: "Public holidays in Carinthia 2027 with weekdays: Austria's 13 statutory holidays, St Joseph's Day on 19 March and 10 October, semester break and bridge days.",
      h1: 'Public holidays in Carinthia 2027',
      intro: "Statutory holidays, St Joseph's Day, Plebiscite Day and school breaks in Carinthia, with weekdays and the best bridges of 2027.",
      resume: `Carinthia is the only province with two school days off of its own. 19 March is the feast of St Joseph, the patron saint, and 10 October recalls the 1920 plebiscite by which southern Carinthia stayed with Austria. Both are listed in section 74 of the Carinthian Schools Act; neither is a statutory holiday under the Rest Periods Act. Employees have the 13 holidays that apply across Austria; whether St Joseph's Day or 10 October is off depends on the collective agreement or service code. In 2027, 19 March falls on a ${wd(2027, 3, 19, 'en')}, right before the Easter break, which starts on ${dLong(K.toIso(K.fromIso(K.ostersonntag(2027)) - 8), 'en')}; 10 October is a ${wd(2027, 10, 10, 'en')}. In 2028, 19 March is a ${wd(2028, 3, 19, 'en')} and 10 October a ${wd(2028, 10, 10, 'en')}. Carinthia is one of the six provinces with the later school year: school starts on the second Monday in September, the summer holidays start on ${dLong(K.hauptferien(2027, 'K'), 'en')} in 2027, and the semester break begins on the second Monday in February, ${dLong(sem('K').von, 'en')} in 2027.`,
      faqs: [
        { q: 'Is 10 October a day off in Carinthia?', a: `For schools, yes: the Carinthian Schools Act lists 10 October as a day without school. For employees it is not a statutory holiday. In 2027 it falls on a ${wd(2027, 10, 10, 'en')}, in 2028 on a ${wd(2028, 10, 10, 'en')}. The day recalls the Carinthian plebiscite of 10 October 1920.` },
        { q: "Is St Joseph's Day a public holiday in Carinthia?", a: `No school, yes; statutory holiday, no. In 2027, 19 March is a ${wd(2027, 3, 19, 'en')}, so with the Easter break starting on the Saturday, school children have eleven days off in a row. In 2028, 19 March is a Sunday and gives neither pupils nor employees an extra day off.` },
        { q: 'When is the 2027 semester break in Carinthia?', a: `From ${dLong(sem('K').von, 'en')} to ${dLong(sem('K').bis, 'en')}. In 2028 it starts on ${dLong(sem('K', 2028).von, 'en')}. Carinthia shares the date with Burgenland, Salzburg, Tyrol and Vorarlberg. Vienna and Lower Austria are off a week earlier, Upper Austria and Styria a week later.` },
      ],
      text: (h) => `<h2>St Joseph's Day and Plebiscite Day</h2>
<p>Section 74 of the ${h.src('schule-k', 'Carinthian Schools Act')} lists 19 March and 10 October expressly among the days without school, next to Sundays, holidays and All Souls' Day. That gives Carinthia one more school day off than any other province. In employment law both are working days. Working parents should put both into their leave plan early; in 2027 St Joseph's Day runs straight into the Easter break, and in 2028 it falls on a Sunday.</p>`,
    },
  },
  {
    id: 'feiertage-niederoesterreich', land: 'NOE', order: 42, sources: ['schule-noe', 'noe-lv7'], related: ['feiertage-wien', 'feiertage-burgenland', 'landesfeiertage', 'feiertage-2027'],
    de: {
      slug: 'feiertage-niederoesterreich', nav: 'Niederösterreich', card: 'Leopolditag als Landesfeiertag',
      title: 'Feiertage Niederösterreich 2027: Leopolditag und Ferien',
      description: 'Feiertage in Niederösterreich 2027 mit Wochentag: 13 gesetzliche Feiertage, der Landesfeiertag am 15. November, Semesterferien ab 1. Februar und Fenstertage.',
      h1: 'Feiertage in Niederösterreich 2027',
      intro: 'Gesetzliche Feiertage, Leopolditag und Schulferien in Niederösterreich mit Wochentag, dazu die Brücken, die 2027 am meisten bringen.',
      resume: `Niederösterreich hat neben den 13 gesetzlichen Feiertagen einen Landesfeiertag, der sogar in der Landesverfassung steht: Nach Art. 7 Abs. 6 ist der heilige Leopold Landespatron und der 15. November Landesfeiertag. Trotzdem ist der Leopolditag kein Feiertag im Sinne des Arbeitsruhegesetzes. Schulfrei ist er nach § 83 des NÖ Pflichtschulgesetzes; für Beschäftigte entscheiden Kollektivvertrag, Betriebsvereinbarung oder Dienstrecht. 2026 fiel der 15. November auf einen Sonntag, 2027 ist er ein ${wd(2027, 11, 15, 'de')} und schafft ein langes Wochenende, 2028 ein ${wd(2028, 11, 15, 'de')}. Wer den Leopolditag 2027 frei hat und die vier Tage danach Urlaub nimmt, ist neun Tage am Stück zu Hause. Niederösterreich hat mit Wien die frühesten Semesterferien: Sie beginnen am ersten Montag im Februar, 2027 am ${dLong(sem('NOE').von, 'de')}. Die Schule beginnt am ersten Montag im September, die Hauptferien 2027 am ${dLong(K.hauptferien(2027, 'NOE'), 'de')}. Mit zehn Urlaubstagen kommen Sie 2027 auf ${opt('NOE', 2027, 10).frei} freie Tage.`,
      faqs: [
        { q: 'Ist der 15. November in Niederösterreich ein Feiertag?', a: 'Er ist Landesfeiertag nach der Landesverfassung und schulfrei. Ein gesetzlicher Feiertag nach dem Arbeitsruhegesetz ist er nicht; Geschäfte haben geöffnet, und ob Sie frei haben, regelt Ihr Kollektivvertrag oder Dienstrecht. 2026 fiel der Leopolditag auf einen Sonntag, 2027 fällt er auf einen Montag, 2028 auf einen Mittwoch.' },
        { q: 'Wann sind die Semesterferien 2027 in Niederösterreich?', a: `Vom ${dLong(sem('NOE').von, 'de')} bis ${dLong(sem('NOE').bis, 'de')}, gleichzeitig mit Wien. 2028 beginnen sie am ${dLong(sem('NOE', 2028).von, 'de')}. Oberösterreich und die Steiermark haben ihre Semesterferien zwei Wochen später, die übrigen Länder eine Woche später. Familien mit Kindern in verschiedenen Ländern sollten das bei der Planung beachten.` },
        { q: 'Wann beginnt die Schule 2027 in Niederösterreich?', a: `Am ${dLong(K.schulbeginn(2027, 'NOE'), 'de')}, dem ersten Montag im September. Die Sommerferien beginnen am ${dLong(K.hauptferien(2027, 'NOE'), 'de')}. Wien und das Burgenland beginnen am selben Tag, die übrigen sechs Länder eine Woche später, am 13. September 2027. Die Hauptferien dauern im Osten damit rund neun Wochen.` },
      ],
      text: (h) => `<h2>Der Leopolditag</h2>
<p>Die ${h.src('noe-lv7', 'NÖ Landesverfassung')} bestimmt in Art. 7: „Landespatron ist der Heilige Leopold. Landesfeiertag ist der 15. November.“ Das ${h.src('schule-noe', 'NÖ Pflichtschulgesetz 2018')} macht den Tag schulfrei. Eine Arbeitsruhe für alle schreibt das Landesrecht nicht vor, denn Feiertage im Arbeitsrecht regelt der Bund. 2027 fällt der 15. November auf einen Montag: Schulkinder haben ein langes Wochenende, und wer im Betrieb frei hat, ebenso.</p>`,
    },
    en: {
      slug: 'public-holidays-lower-austria', nav: 'Lower Austria', card: "St Leopold's Day as provincial holiday",
      title: "Public holidays Lower Austria 2027: St Leopold's Day",
      description: "Public holidays in Lower Austria 2027 with weekdays: 13 statutory holidays, the provincial holiday on 15 November, semester break from 1 February, bridge days.",
      h1: 'Public holidays in Lower Austria 2027',
      intro: "Statutory holidays, St Leopold's Day and school breaks in Lower Austria with weekdays, plus the bridges that pay most in 2027.",
      resume: `Besides the 13 statutory holidays, Lower Austria has a provincial holiday written into its constitution: under Art. 7(6), St Leopold is the patron saint and 15 November the provincial holiday. Even so, St Leopold's Day is not a holiday under the Rest Periods Act. Section 83 of the Lower Austria Compulsory Schools Act makes it a day without school; for employees the collective agreement, a works agreement or the service code decides. In 2026, 15 November fell on a Sunday; in 2027 it is a ${wd(2027, 11, 15, 'en')} and makes a long weekend, and in 2028 a ${wd(2028, 11, 15, 'en')}. If you get St Leopold's Day 2027 off and take the four days after it as leave, you are off for nine days in a row. Lower Austria shares the earliest semester break with Vienna: it starts on the first Monday in February, ${dLong(sem('NOE').von, 'en')} in 2027. School starts on the first Monday in September and the summer holidays on ${dLong(K.hauptferien(2027, 'NOE'), 'en')} in 2027. Ten leave days give ${opt('NOE', 2027, 10).frei} days off in 2027.`,
      faqs: [
        { q: 'Is 15 November a public holiday in Lower Austria?', a: 'It is the provincial holiday under the provincial constitution, and schools close. It is not a statutory holiday under the Rest Periods Act; shops open, and whether you get it off depends on your collective agreement or service code. In 2027 St Leopold\'s Day is a Monday, in 2028 a Wednesday.' },
        { q: 'When is the 2027 semester break in Lower Austria?', a: `From ${dLong(sem('NOE').von, 'en')} to ${dLong(sem('NOE').bis, 'en')}, at the same time as Vienna. In 2028 it starts on ${dLong(sem('NOE', 2028).von, 'en')}. Upper Austria and Styria have theirs two weeks later and the other provinces a week later. Families with children in different provinces should plan for that.` },
        { q: 'When does school start in Lower Austria in 2027?', a: `On ${dLong(K.schulbeginn(2027, 'NOE'), 'en')}, the first Monday in September. The summer holidays start on ${dLong(K.hauptferien(2027, 'NOE'), 'en')}. Vienna and Burgenland start the same day, the other six provinces a week later, on 13 September 2027. The summer break in the east therefore lasts about nine weeks.` },
      ],
      text: (h) => `<h2>St Leopold's Day</h2>
<p>Art. 7 of the ${h.src('noe-lv7', 'Lower Austria Constitution')} states: "The patron saint is St Leopold. The provincial holiday is 15 November." The ${h.src('schule-noe', 'Compulsory Schools Act 2018')} makes it a day without school. Provincial law does not impose a general day off work, since holidays in employment law are a federal matter. In 2027, 15 November is a Monday: school children get a long weekend, and so does anyone whose employer gives the day off.</p>`,
    },
  },
  {
    id: 'feiertage-oberoesterreich', land: 'OOE', order: 43, sources: ['schule-ooe'], related: ['feiertage-salzburg', 'feiertage-steiermark', 'landesfeiertage', 'feiertage-2027'],
    de: {
      slug: 'feiertage-oberoesterreich', nav: 'Oberösterreich', card: 'Florianitag am 4. Mai schulfrei',
      title: 'Feiertage Oberösterreich 2027: Florianitag und Fenstertage',
      description: 'Feiertage in Oberösterreich 2027 mit Wochentag: die 13 gesetzlichen Feiertage, der Florianitag am 4. Mai, Semesterferien ab 15. Februar und die Brücken im Mai.',
      h1: 'Feiertage in Oberösterreich 2027',
      intro: 'Gesetzliche Feiertage, Florianitag und Schulferien in Oberösterreich mit Wochentag, dazu die Brücken, mit denen der Mai 2027 besonders lang wird.',
      resume: `In Oberösterreich ist der 4. Mai schulfrei, der Tag des heiligen Florian, des Landespatrons und Schutzheiligen der Feuerwehr. Das Oö. Schulzeitgesetz 1976 nennt ihn in § 2 ausdrücklich; ein gesetzlicher Feiertag nach dem Arbeitsruhegesetz ist er nicht. 2027 fällt der Florianitag auf einen ${wd(2027, 5, 4, 'de')}, zwei Tage vor Christi Himmelfahrt. Das macht die erste Maiwoche 2027 in Oberösterreich ungewöhnlich ergiebig: Der Staatsfeiertag am Samstag, der Montag als Fenstertag vor Florian, der Mittwoch zwischen Florian und Himmelfahrt und der Freitag danach. Wer den Florianitag frei hat, ist mit drei Urlaubstagen vom 1. bis 9. Mai zu Hause. Mit zehn Urlaubstagen und freiem Landespatron kommen Sie 2027 auf ${opt('OOE', 2027, 10, true).frei} freie Tage, ohne ihn auf ${opt('OOE', 2027, 10).frei}. Oberösterreich hat mit der Steiermark die spätesten Semesterferien, ab dem dritten Montag im Februar, 2027 ab ${dLong(sem('OOE').von, 'de')}. Die Schule beginnt am zweiten Montag im September, die Sommerferien 2027 am ${dLong(K.hauptferien(2027, 'OOE'), 'de')}.`,
      faqs: [
        { q: 'Ist der 4. Mai in Oberösterreich frei?', a: `Für Schulen ja, nach dem Oö. Schulzeitgesetz. Für Beschäftigte ist der Florianitag kein gesetzlicher Feiertag; maßgeblich sind Kollektivvertrag oder Dienstrecht. 2027 fällt er auf einen ${wd(2027, 5, 4, 'de')}, 2028 auf einen ${wd(2028, 5, 4, 'de')}. Der heilige Florian ist Landespatron Oberösterreichs und zugleich Schutzheiliger der Feuerwehrleute. Schulen sind an diesem Tag geschlossen.` },
        { q: 'Wann sind die Semesterferien 2027 in Oberösterreich?', a: `Vom ${dLong(sem('OOE').von, 'de')} bis ${dLong(sem('OOE').bis, 'de')}, zeitgleich mit der Steiermark. 2028 beginnen sie am ${dLong(sem('OOE', 2028).von, 'de')}. Damit liegen sie zwei Wochen nach Wien und Niederösterreich und eine Woche nach Burgenland, Kärnten, Salzburg, Tirol und Vorarlberg. Gezählt wird von Montag bis Samstag.` },
        { q: 'Welche schulautonomen Tage bieten sich 2027 in Oberösterreich an?', a: 'Neben den Tagen nach Weihnachten und den Freitagen nach Christi Himmelfahrt und Fronleichnam der Montag, 3. Mai, und der Mittwoch, 5. Mai, rund um den Florianitag. Was Ihre Schule beschlossen hat, erfahren Sie dort. Wie viele es höchstens sein dürfen, hängt vom Wochentag des 26. Oktober ab: im Schuljahr 2026/27 drei.' },
      ],
      text: (h) => `<h2>Der Florianitag in Oberösterreich</h2>
<p>Das ${h.src('schule-ooe', 'Oö. Schulzeitgesetz 1976')} zählt in § 2 Abs. 4 den 4. Mai zu den schulfreien Tagen, zusammen mit Sonn- und Feiertagen und dem Allerseelentag. 2028 fällt der Florianitag auf einen Donnerstag, drei Wochen vor Christi Himmelfahrt; der Freitag danach wird dann für Schulen und für Beschäftigte mit freiem Landespatron zum Fenstertag.</p>`,
    },
    en: {
      slug: 'public-holidays-upper-austria', nav: 'Upper Austria', card: "St Florian's Day, 4 May, no school",
      title: "Public holidays Upper Austria 2027: St Florian's Day",
      description: "Public holidays in Upper Austria 2027 with weekdays: the 13 statutory holidays, St Florian's Day on 4 May, the semester break from 15 February, May bridges.",
      h1: 'Public holidays in Upper Austria 2027',
      intro: "Statutory holidays, St Florian's Day and school breaks in Upper Austria with weekdays, plus the bridges that make May 2027 especially long.",
      resume: `In Upper Austria 4 May is a day without school: the feast of St Florian, patron saint of the province and of firefighters. Section 2 of the Upper Austria School Hours Act 1976 names it expressly; it is not a holiday under the Rest Periods Act. In 2027 St Florian's Day falls on a ${wd(2027, 5, 4, 'en')}, two days before Ascension Day. That makes the first week of May 2027 unusually rich in Upper Austria: Labour Day on the Saturday, the Monday as a bridge day before St Florian, the Wednesday between St Florian and Ascension Day, and the Friday after. If you get St Florian's Day off, three leave days keep you at home from 1 to 9 May. Ten leave days with the patron saint off give ${opt('OOE', 2027, 10, true).frei} days off in 2027, without it ${opt('OOE', 2027, 10).frei}. Upper Austria shares the latest semester break with Styria, from the third Monday in February, ${dLong(sem('OOE').von, 'en')} in 2027. School starts on the second Monday in September and the summer holidays on ${dLong(K.hauptferien(2027, 'OOE'), 'en')} in 2027.`,
      faqs: [
        { q: 'Is 4 May a day off in Upper Austria?', a: `For schools, yes, under the Upper Austria School Hours Act. For employees St Florian's Day is not a statutory holiday; your collective agreement or service code decides. In 2027 it falls on a ${wd(2027, 5, 4, 'en')}, in 2028 on a ${wd(2028, 5, 4, 'en')}. St Florian is Upper Austria's patron saint and also the patron of firefighters.` },
        { q: 'When is the 2027 semester break in Upper Austria?', a: `From ${dLong(sem('OOE').von, 'en')} to ${dLong(sem('OOE').bis, 'en')}, together with Styria. In 2028 it starts on ${dLong(sem('OOE', 2028).von, 'en')}. That is two weeks after Vienna and Lower Austria and one week after Burgenland, Carinthia, Salzburg, Tyrol and Vorarlberg. It runs from Monday to Saturday.` },
        { q: 'Which autonomous school days fit 2027 in Upper Austria?', a: "Besides the days after Christmas and the Fridays after Ascension Day and Corpus Christi, Monday 3 May and Wednesday 5 May around St Florian's Day. Your school can tell you what it has decided. The maximum depends on the weekday of 26 October: three in the 2026/27 school year." },
      ],
      text: (h) => `<h2>St Florian's Day in Upper Austria</h2>
<p>Section 2(4) of the ${h.src('schule-ooe', 'Upper Austria School Hours Act 1976')} lists 4 May among the days without school, with Sundays, holidays and All Souls' Day. In 2028 St Florian's Day falls on a Thursday, three weeks before Ascension Day; the Friday after then becomes a bridge day for schools and for employees who get the patron saint's day off.</p>`,
    },
  },
  {
    id: 'feiertage-salzburg', land: 'S', order: 44, sources: ['schule-s'], related: ['feiertage-oberoesterreich', 'feiertage-tirol', 'landesfeiertage', 'feiertage-2027'],
    de: {
      slug: 'feiertage-salzburg', nav: 'Salzburg', card: 'Rupertitag am 24. September schulfrei',
      title: 'Feiertage Salzburg 2027: Rupertitag, Ferien und Brücken',
      description: 'Feiertage im Land Salzburg 2027 mit Wochentag: die 13 gesetzlichen Feiertage, der Rupertitag am 24. September, Semesterferien und Fenstertage bis 2028.',
      h1: 'Feiertage in Salzburg 2027',
      intro: 'Gesetzliche Feiertage, Rupertitag und Schulferien im Land Salzburg mit Wochentag, dazu die Brücken, die 2027 am meisten bringen.',
      resume: `Im Land Salzburg ist der 24. September schulfrei, der Tag des heiligen Rupert, des Landespatrons und Gründers der Stadt Salzburg. Das Salzburger Schulzeit-Ausführungsgesetz 2018 nennt den Tag in § 2 und gibt zusätzlich den 25. September frei, wenn er auf einen Samstag fällt. Gesetzlicher Feiertag nach dem Arbeitsruhegesetz ist der Rupertitag nicht; Beschäftigte haben frei, wenn Kollektivvertrag, Betriebsvereinbarung oder Dienstrecht das vorsehen. Weil er kurz nach Schulbeginn liegt, bringt der Rupertitag oft das erste lange Wochenende des Schuljahres. 2026 fiel er auf einen Donnerstag, 2027 ist er ein ${wd(2027, 9, 24, 'de')}, 2028 ein ${wd(2028, 9, 24, 'de')}. Wer den Rupertitag 2027 frei hat und die vier Tage davor Urlaub nimmt, kommt auf neun freie Tage. Salzburg gehört zum Westen: Schulbeginn am zweiten Montag im September, 2027 am ${dLong(K.schulbeginn(2027, 'S'), 'de')}, Semesterferien ab dem zweiten Montag im Februar, 2027 ab ${dLong(sem('S').von, 'de')}, Sommerferien ab ${dLong(K.hauptferien(2027, 'S'), 'de')}. Mit zehn Urlaubstagen kommen Sie 2027 auf ${opt('S', 2027, 10).frei} freie Tage.`,
      faqs: [
        { q: 'Ist der Rupertitag in Salzburg ein Feiertag?', a: 'Schulfrei ja, gesetzlich nein. Das Salzburger Schulzeit-Ausführungsgesetz macht den 24. September schulfrei. Im Arbeitsrecht ist er ein Werktag, solange Kollektivvertrag oder Dienstrecht nichts anderes vorsehen. 2027 fällt der Rupertitag auf einen Freitag, 2028 auf einen Sonntag; 2027 ergibt das ein langes Wochenende kurz nach Schulbeginn.' },
        { q: 'Wann ist der 25. September in Salzburg schulfrei?', a: 'Nur wenn er auf einen Samstag fällt, also wenn der Rupertitag ein Freitag ist. Das war zuletzt 2021 der Fall und betrifft vor allem Schulen mit Samstagsunterricht. Für Schulen ohne Samstagsunterricht ändert sich dadurch nichts, weil der Samstag ohnehin frei ist.' },
        { q: 'Wann sind die Semesterferien 2027 in Salzburg?', a: `Vom ${dLong(sem('S').von, 'de')} bis ${dLong(sem('S').bis, 'de')}. 2028 beginnen sie am ${dLong(sem('S', 2028).von, 'de')}. Salzburg teilt den Termin mit dem Burgenland, Kärnten, Tirol und Vorarlberg. Wien und Niederösterreich haben eine Woche früher frei, Oberösterreich und die Steiermark eine Woche später.` },
      ],
      text: (h) => `<h2>Rupertitag in Salzburg</h2>
<p>Das ${h.src('schule-s', 'Salzburger Schulzeit-Ausführungsgesetz 2018')} zählt in § 2 den 24. September zu den schulfreien Tagen und, wenn er auf einen Samstag fällt, auch den 25. September. Muss ausgefallener Unterricht eingebracht werden, etwa durch kürzere Ferien, bleiben der 24. September und der 2. November trotzdem schulfrei. 2027 fällt der Rupertitag auf einen Freitag, das erste verlängerte Wochenende des Schuljahres 2027/28.</p>`,
    },
    en: {
      slug: 'public-holidays-salzburg', nav: 'Salzburg', card: "St Rupert's Day, 24 September, no school",
      title: "Public holidays Salzburg 2027: St Rupert's Day, breaks",
      description: "Public holidays in the province of Salzburg 2027 with weekdays: the 13 statutory holidays, St Rupert's Day on 24 September, semester break and bridge days.",
      h1: 'Public holidays in Salzburg 2027',
      intro: "Statutory holidays, St Rupert's Day and school breaks in the province of Salzburg with weekdays, plus the bridges that pay most in 2027.",
      resume: `In the province of Salzburg, 24 September is a day without school: the feast of St Rupert, patron saint and founder of the city of Salzburg. Section 2 of the Salzburg School Hours Implementation Act 2018 names the day and also frees 25 September when it falls on a Saturday. St Rupert's Day is not a holiday under the Rest Periods Act; employees get it off where a collective agreement, works agreement or service code provides. Coming soon after the start of school, it often gives the first long weekend of the school year. In 2026 it fell on a Thursday, in 2027 it is a ${wd(2027, 9, 24, 'en')} and in 2028 a ${wd(2028, 9, 24, 'en')}. If you get St Rupert's Day 2027 off and take the four days before it as leave, you have nine days off. Salzburg belongs to the west: school starts on the second Monday in September, ${dLong(K.schulbeginn(2027, 'S'), 'en')} in 2027, the semester break on the second Monday in February, ${dLong(sem('S').von, 'en')} in 2027, and the summer holidays on ${dLong(K.hauptferien(2027, 'S'), 'en')}. Ten leave days give ${opt('S', 2027, 10).frei} days off in 2027.`,
      faqs: [
        { q: "Is St Rupert's Day a public holiday in Salzburg?", a: 'No school, yes; statutory holiday, no. The Salzburg School Hours Implementation Act makes 24 September a day without school. In employment law it is a working day unless a collective agreement or service code says otherwise. In 2027 St Rupert\'s Day is a Friday, a long weekend soon after school starts; in 2028 it is a Sunday.' },
        { q: 'When is 25 September a day without school in Salzburg?', a: "Only when it falls on a Saturday, i.e. when St Rupert's Day is a Friday. That last happened in 2021 and mainly concerns schools with Saturday lessons. For schools without Saturday lessons nothing changes, since the Saturday is off anyway." },
        { q: 'When is the 2027 semester break in Salzburg?', a: `From ${dLong(sem('S').von, 'en')} to ${dLong(sem('S').bis, 'en')}. In 2028 it starts on ${dLong(sem('S', 2028).von, 'en')}. Salzburg shares the date with Burgenland, Carinthia, Tyrol and Vorarlberg. Vienna and Lower Austria are off a week earlier, Upper Austria and Styria a week later.` },
      ],
      text: (h) => `<h2>St Rupert's Day in Salzburg</h2>
<p>Section 2 of the ${h.src('schule-s', 'Salzburg School Hours Implementation Act 2018')} lists 24 September among the days without school and, if it falls on a Saturday, 25 September too. Even when lost teaching time has to be made up, for example by shortening breaks, the act keeps 24 September and 2 November free. In 2027 St Rupert's Day is a Friday, the first long weekend of the 2027/28 school year.</p>`,
    },
  },
  {
    id: 'feiertage-steiermark', land: 'ST', order: 45, sources: ['schule-st'], related: ['feiertage-kaernten', 'feiertage-oberoesterreich', 'landesfeiertage', 'feiertage-2027'],
    de: {
      slug: 'feiertage-steiermark', nav: 'Steiermark', card: 'Josefitag am 19. März schulfrei',
      title: 'Feiertage Steiermark 2027: Josefitag, Ferien, Fenstertage',
      description: 'Feiertage in der Steiermark 2027 mit Wochentag: die 13 gesetzlichen Feiertage, der Josefitag am 19. März, Semesterferien ab 15. Februar und Brücken bis 2028.',
      h1: 'Feiertage in der Steiermark 2027',
      intro: 'Gesetzliche Feiertage, Josefitag und Schulferien in der Steiermark mit Wochentag, dazu die Brücken, die 2027 am meisten bringen.',
      resume: `Die Steiermark feiert am 19. März den heiligen Josef, ihren Landespatron. Das Steiermärkische Schulzeit-Ausführungsgesetz 1999 nennt in § 2 den „19. März als Festtag des Landespatrons“ ausdrücklich als schulfrei; ein gesetzlicher Feiertag nach dem Arbeitsruhegesetz ist der Josefitag nicht. In Betrieben gilt er nur als frei, wenn Kollektivvertrag, Betriebsvereinbarung oder Dienstrecht es vorsehen. 2027 fällt der 19. März auf einen ${wd(2027, 3, 19, 'de')}, unmittelbar vor den Osterferien; Schulkinder sind damit von Freitag, 19., bis Ostermontag, 29. März, frei. 2028 liegt der Josefitag auf einem Sonntag und bringt nichts. Die Steiermark hat mit Oberösterreich die spätesten Semesterferien, ab dem dritten Montag im Februar, 2027 vom ${dLong(sem('ST').von, 'de')} bis ${dLong(sem('ST').bis, 'de')}. Die Schule beginnt am zweiten Montag im September, die Sommerferien 2027 am ${dLong(K.hauptferien(2027, 'ST'), 'de')}. Wer den Josefitag 2027 frei hat und Montag bis Donnerstag davor Urlaub nimmt, kommt mit vier Urlaubstagen auf neun freie Tage. Mit zehn Urlaubstagen sind es 2027 insgesamt ${opt('ST', 2027, 10).frei} freie Tage.`,
      faqs: [
        { q: 'Ist der 19. März in der Steiermark frei?', a: `Für Schulen ja, nach dem Steiermärkischen Schulzeit-Ausführungsgesetz. Für Beschäftigte ist der Josefitag kein gesetzlicher Feiertag. 2027 fällt er auf einen ${wd(2027, 3, 19, 'de')}, 2028 auf einen ${wd(2028, 3, 19, 'de')}. In Kärnten, Tirol und Vorarlberg ist der Josefitag ebenfalls schulfrei, weil der heilige Josef dort auch Landespatron ist.` },
        { q: 'Wann sind die Semesterferien 2027 in der Steiermark?', a: `Vom ${dLong(sem('ST').von, 'de')} bis ${dLong(sem('ST').bis, 'de')}. 2028 beginnen sie am ${dLong(sem('ST', 2028).von, 'de')}. Die Steiermark teilt den späten Termin mit Oberösterreich. Wien und Niederösterreich haben zwei Wochen früher frei, die übrigen fünf Länder eine Woche früher. Gezählt wird von Montag bis Samstag.` },
        { q: 'Wann beginnen die Sommerferien 2027 in der Steiermark?', a: `Am Samstag, ${dLong(K.hauptferien(2027, 'ST'), 'de')}. Das neue Schuljahr beginnt am ${dLong(K.schulbeginn(2027, 'ST'), 'de')}. Der letzte Schultag ist Freitag, 9. Juli 2027. Die Steiermark folgt damit dem Termin der sechs Länder außerhalb des Ostens; in Burgenland, Niederösterreich und Wien beginnen die Sommerferien eine Woche früher, am 3. Juli.` },
      ],
      text: (h) => `<h2>Josefitag in der Steiermark</h2>
<p>§ 2 Abs. 6 des ${h.src('schule-st', 'Steiermärkischen Schulzeit-Ausführungsgesetzes 1999')} zählt die Samstage, Sonn- und Feiertage, den 19. März als Festtag des Landespatrons und den Allerseelentag zu den schulfreien Tagen. Den Josefitag teilt sich die Steiermark mit Kärnten, Tirol und Vorarlberg.</p>`,
    },
    en: {
      slug: 'public-holidays-styria', nav: 'Styria', card: "St Joseph's Day, 19 March, no school",
      title: "Public holidays Styria 2027: St Joseph's Day and breaks",
      description: "Public holidays in Styria 2027 with weekdays: the 13 statutory holidays, St Joseph's Day on 19 March, the semester break from 15 February and bridges to 2028.",
      h1: 'Public holidays in Styria 2027',
      intro: "Statutory holidays, St Joseph's Day and school breaks in Styria with weekdays, plus the bridges that pay most in 2027.",
      resume: `Styria celebrates its patron saint, St Joseph, on 19 March. Section 2 of the Styrian School Hours Implementation Act 1999 names "19 March as the feast of the patron saint" expressly as a day without school; St Joseph's Day is not a holiday under the Rest Periods Act. At work it is only off where a collective agreement, works agreement or service code says so. In 2027, 19 March falls on a ${wd(2027, 3, 19, 'en')}, just before the Easter break, so school children are off from Friday 19 to Easter Monday 29 March. In 2028 St Joseph's Day is a Sunday and gives nothing. Styria shares the latest semester break with Upper Austria, from the third Monday in February: ${dLong(sem('ST').von, 'en')} to ${dLong(sem('ST').bis, 'en')} in 2027. School starts on the second Monday in September and the summer holidays on ${dLong(K.hauptferien(2027, 'ST'), 'en')} in 2027. If you get St Joseph's Day 2027 off and take Monday to Thursday before it as leave, four leave days give nine days off. Ten leave days give ${opt('ST', 2027, 10).frei} days off in 2027 in all.`,
      faqs: [
        { q: 'Is 19 March a day off in Styria?', a: `For schools, yes, under the Styrian School Hours Implementation Act. For employees St Joseph's Day is not a statutory holiday. In 2027 it falls on a ${wd(2027, 3, 19, 'en')}, in 2028 on a ${wd(2028, 3, 19, 'en')}. In Carinthia, Tyrol and Vorarlberg St Joseph's Day is also a day without school, since he is their patron saint too.` },
        { q: 'When is the 2027 semester break in Styria?', a: `From ${dLong(sem('ST').von, 'en')} to ${dLong(sem('ST').bis, 'en')}. In 2028 it starts on ${dLong(sem('ST', 2028).von, 'en')}. Styria shares the late date with Upper Austria. Vienna and Lower Austria are off two weeks earlier, the other five provinces a week earlier. It runs from Monday to Saturday.` },
        { q: 'When do the 2027 summer holidays start in Styria?', a: `On Saturday ${dLong(K.hauptferien(2027, 'ST'), 'en')}. The new school year starts on ${dLong(K.schulbeginn(2027, 'ST'), 'en')}. The last school day is Friday 9 July 2027. Styria follows the six provinces outside the east; in Burgenland, Lower Austria and Vienna the summer holidays start a week earlier, on 3 July.` },
      ],
      text: (h) => `<h2>St Joseph's Day in Styria</h2>
<p>Section 2(6) of the ${h.src('schule-st', 'Styrian School Hours Implementation Act 1999')} lists Saturdays, Sundays and holidays, 19 March as the patron saint's feast and All Souls' Day as days without school. Styria shares St Joseph's Day with Carinthia, Tyrol and Vorarlberg.</p>`,
    },
  },
  {
    id: 'feiertage-tirol', land: 'T', order: 46, sources: ['schule-t'], related: ['feiertage-vorarlberg', 'feiertage-salzburg', 'landesfeiertage', 'feiertage-2027'],
    de: {
      slug: 'feiertage-tirol', nav: 'Tirol', card: 'Josefitag am 19. März schulfrei',
      title: 'Feiertage Tirol 2027: Josefitag, Ferien und Zwickeltage',
      description: 'Feiertage in Tirol 2027 mit Wochentag: die 13 gesetzlichen Feiertage, der Josefitag am 19. März, Semesterferien ab 8. Februar und die Zwickeltage bis 2028.',
      h1: 'Feiertage in Tirol 2027',
      intro: 'Gesetzliche Feiertage, Josefitag und Schulferien in Tirol mit Wochentag, dazu die Zwickeltage, die 2027 am meisten bringen.',
      resume: `In Tirol heißen die Fenstertage meist Zwickeltage, gemeint ist dasselbe: ein Arbeitstag, der zwischen Feiertag und Wochenende eingezwickt ist. 2027 gibt es davon in Tirol wie in ganz Österreich drei, die Freitage nach Christi Himmelfahrt und Fronleichnam und den Montag vor dem Nationalfeiertag. Landespatron ist der heilige Josef; § 110 des Tiroler Schulorganisationsgesetzes 1991 nennt den 19. März als Festtag des Landespatrons schulfrei. Arbeitsrechtlich ist der Josefitag kein Feiertag, frei ist er nur nach Kollektivvertrag, Betriebsvereinbarung oder Dienstrecht. 2027 fällt er auf einen ${wd(2027, 3, 19, 'de')} direkt vor den Osterferien, 2028 auf einen ${wd(2028, 3, 19, 'de')}. Die Tiroler Semesterferien beginnen am zweiten Montag im Februar, 2027 am ${dLong(sem('T').von, 'de')}; viele Familien verbinden sie mit Skiurlaub. Die Schule beginnt am zweiten Montag im September, die Sommerferien 2027 am ${dLong(K.hauptferien(2027, 'T'), 'de')}. Mit zehn Urlaubstagen kommen Sie 2027 auf ${opt('T', 2027, 10).frei} freie Tage, 2028 auf ${opt('T', 2028, 10).frei}.`,
      faqs: [
        { q: 'Was ist ein Zwickeltag?', a: 'So nennt man in Tirol und Vorarlberg den Fenstertag: einen einzelnen Arbeitstag zwischen einem Feiertag und dem Wochenende. Ein Urlaubstag an einem Zwickeltag ergibt vier freie Tage am Stück. In ganz Österreich gibt es 2027 drei echte Zwickeltage, 2028 sind es fünf. Der Planer findet sie für jedes Jahr.' },
        { q: 'Ist der 19. März in Tirol frei?', a: `Für Schulen ja, nach dem Tiroler Schulorganisationsgesetz. Für Beschäftigte ist er kein gesetzlicher Feiertag. 2027 fällt der Josefitag auf einen ${wd(2027, 3, 19, 'de')}, 2028 auf einen ${wd(2028, 3, 19, 'de')}. Der heilige Josef ist auch in Kärnten, der Steiermark und Vorarlberg Landespatron, dort ist der Tag ebenso schulfrei.` },
        { q: 'Wann sind die Semesterferien 2027 in Tirol?', a: `Vom ${dLong(sem('T').von, 'de')} bis ${dLong(sem('T').bis, 'de')}. 2028 beginnen sie am ${dLong(sem('T', 2028).von, 'de')}. Tirol teilt den Termin mit dem Burgenland, Kärnten, Salzburg und Vorarlberg. Wien und Niederösterreich haben eine Woche früher frei, Oberösterreich und die Steiermark eine Woche später.` },
      ],
      text: (h) => `<h2>Josefitag in Tirol</h2>
<p>Das ${h.src('schule-t', 'Tiroler Schulorganisationsgesetz 1991')} zählt in § 110 die schulfreien Tage auf, darunter die Semesterferien „vom zweiten Montag im Februar bis zum darauffolgenden Sonntag“ und „der 19. März (Festtag des Landespatrons)“. Tirol teilt sich den Josefitag mit Kärnten, der Steiermark und Vorarlberg; in den Semesterferien liegt Tirol gleichauf mit Burgenland, Kärnten, Salzburg und Vorarlberg.</p>`,
    },
    en: {
      slug: 'public-holidays-tyrol', nav: 'Tyrol', card: "St Joseph's Day, 19 March, no school",
      title: "Public holidays Tyrol 2027: St Joseph's Day and breaks",
      description: "Public holidays in Tyrol 2027 with weekdays: the 13 statutory holidays, St Joseph's Day on 19 March, the semester break from 8 February and bridge days to 2028.",
      h1: 'Public holidays in Tyrol 2027',
      intro: "Statutory holidays, St Joseph's Day and school breaks in Tyrol with weekdays, plus the bridge days that pay most in 2027.",
      resume: `In Tyrol bridge days are usually called Zwickeltage, but the meaning is the same: a working day pinched between a holiday and the weekend. In 2027 Tyrol, like all of Austria, has three: the Fridays after Ascension Day and Corpus Christi and the Monday before National Day. The patron saint is St Joseph; section 110 of the Tyrolean School Organisation Act 1991 lists 19 March, the patron saint's feast, as a day without school. In employment law St Joseph's Day is no holiday; it is only off under a collective agreement, works agreement or service code. In 2027 it falls on a ${wd(2027, 3, 19, 'en')} right before the Easter break, in 2028 on a ${wd(2028, 3, 19, 'en')}. Tyrol's semester break starts on the second Monday in February, ${dLong(sem('T').von, 'en')} in 2027, and many families combine it with a ski holiday. School starts on the second Monday in September and the summer holidays on ${dLong(K.hauptferien(2027, 'T'), 'en')} in 2027. Ten leave days give ${opt('T', 2027, 10).frei} days off in 2027 and ${opt('T', 2028, 10).frei} in 2028.`,
      faqs: [
        { q: 'What is a Zwickeltag?', a: 'It is the Tyrolean and Vorarlberg word for a bridge day: a single working day between a holiday and the weekend. One leave day on a Zwickeltag gives four days off in a row. Across Austria there are three true Zwickeltage in 2027 and five in 2028.' },
        { q: 'Is 19 March a day off in Tyrol?', a: `For schools, yes, under the Tyrolean School Organisation Act. For employees it is not a statutory holiday. In 2027 St Joseph's Day falls on a ${wd(2027, 3, 19, 'en')}, in 2028 on a ${wd(2028, 3, 19, 'en')}. St Joseph is also patron saint of Carinthia, Styria and Vorarlberg, where the day is likewise free of school.` },
        { q: 'When is the 2027 semester break in Tyrol?', a: `From ${dLong(sem('T').von, 'en')} to ${dLong(sem('T').bis, 'en')}. In 2028 it starts on ${dLong(sem('T', 2028).von, 'en')}. Tyrol shares the date with Burgenland, Carinthia, Salzburg and Vorarlberg. Vienna and Lower Austria are off a week earlier, Upper Austria and Styria a week later.` },
      ],
      text: (h) => `<h2>St Joseph's Day in Tyrol</h2>
<p>Section 110 of the ${h.src('schule-t', 'Tyrolean School Organisation Act 1991')} lists the days without school, including the semester break "from the second Monday in February to the following Sunday" and "19 March (feast of the patron saint)". Tyrol shares St Joseph's Day with Carinthia, Styria and Vorarlberg, and its semester break with Burgenland, Carinthia, Salzburg and Vorarlberg.</p>`,
    },
  },
  {
    id: 'feiertage-vorarlberg', land: 'V', order: 47, sources: ['schule-v'], related: ['feiertage-tirol', 'feiertage-salzburg', 'landesfeiertage', 'feiertage-2027'],
    de: {
      slug: 'feiertage-vorarlberg', nav: 'Vorarlberg', card: 'Josefitag am 19. März schulfrei',
      title: 'Feiertage Vorarlberg 2027: Josefitag und Zwickeltage',
      description: 'Feiertage in Vorarlberg 2027 mit Wochentag: die 13 gesetzlichen Feiertage, der Josefitag am 19. März, Semesterferien, Sommerferien und die Zwickeltage bis 2028.',
      h1: 'Feiertage in Vorarlberg 2027',
      intro: 'Gesetzliche Feiertage, Josefitag und Schulferien in Vorarlberg mit Wochentag, dazu die Zwickeltage, die 2027 am meisten bringen.',
      resume: `Vorarlberg hat dieselben 13 gesetzlichen Feiertage wie das übrige Österreich; Landespatron ist der heilige Josef, sein Festtag am 19. März ist schulfrei. Das Vorarlberger Pflichtschulzeitgesetz zählt in § 3 die schulfreien Tage einzeln auf: neben Samstagen und Sonntagen den 19. März, den 1. Mai, Christi Himmelfahrt, Fronleichnam, den 26. Oktober, den 1. November, Allerseelen und den 8. Dezember; die übrigen Feiertage liegen ohnehin in den Ferien. Für Beschäftigte ist der Josefitag kein gesetzlicher Feiertag. 2027 fällt er auf einen ${wd(2027, 3, 19, 'de')}, unmittelbar vor den Osterferien, 2028 auf einen ${wd(2028, 3, 19, 'de')}. Die Semesterferien beginnen am zweiten Montag im Februar, 2027 am ${dLong(sem('V').von, 'de')}, die Sommerferien 2027 am ${dLong(K.hauptferien(2027, 'V'), 'de')}; die Schule beginnt am zweiten Montag im September. Viele Vorarlberger arbeiten in der Schweiz oder in Liechtenstein: Dort gelten andere Feiertage, und die österreichischen Feiertage sind am Arbeitsort dann Arbeitstage. Mit zehn Urlaubstagen kommen Sie 2027 in Vorarlberg auf ${opt('V', 2027, 10).frei} freie Tage.`,
      faqs: [
        { q: 'Ist der 19. März in Vorarlberg frei?', a: `Für Schulen ja, nach § 3 Pflichtschulzeitgesetz. Für Beschäftigte ist der Josefitag kein gesetzlicher Feiertag. 2027 fällt er auf einen ${wd(2027, 3, 19, 'de')}, 2028 auf einen ${wd(2028, 3, 19, 'de')}. Für Grenzgängerinnen und Grenzgänger in die Schweiz oder nach Liechtenstein gelten am Arbeitsort ohnehin die dortigen Feiertage.` },
        { q: 'Gelten die österreichischen Feiertage auch für Grenzgänger?', a: 'Maßgeblich ist das Recht am Arbeitsort. Wer in der Schweiz oder in Liechtenstein arbeitet, hat die dortigen Feiertage; ein österreichischer Feiertag ist dann nur frei, wenn er dort ebenfalls gilt oder der Arbeitsvertrag es vorsieht. Im Zweifel hilft ein Blick in den Arbeitsvertrag.' },
        { q: 'Wann sind die Semesterferien 2027 in Vorarlberg?', a: `Vom ${dLong(sem('V').von, 'de')} bis ${dLong(sem('V').bis, 'de')}. 2028 beginnen sie am ${dLong(sem('V', 2028).von, 'de')}. Vorarlberg teilt den Termin mit dem Burgenland, Kärnten, Salzburg und Tirol. Wien und Niederösterreich haben eine Woche früher frei, Oberösterreich und die Steiermark eine Woche später.` },
      ],
      text: (h) => `<h2>Josefitag in Vorarlberg</h2>
<p>Das ${h.src('schule-v', 'Vorarlberger Pflichtschulzeitgesetz')} nennt den 19. März in § 3 an erster Stelle der schulfreien Tage, vor dem 1. Mai. Anders als andere Länder zählt Vorarlberg die Feiertage einzeln auf, statt nur auf „die gesetzlichen Feiertage“ zu verweisen. Inhaltlich ergibt sich dasselbe Bild: Alle 13 Feiertage sind schulfrei, dazu Josefitag und Allerseelen.</p>`,
    },
    en: {
      slug: 'public-holidays-vorarlberg', nav: 'Vorarlberg', card: "St Joseph's Day, 19 March, no school",
      title: "Public holidays Vorarlberg 2027: St Joseph's Day, bridges",
      description: "Public holidays in Vorarlberg 2027 with weekdays: the 13 statutory holidays, St Joseph's Day on 19 March, semester and summer breaks, and bridge days to 2028.",
      h1: 'Public holidays in Vorarlberg 2027',
      intro: "Statutory holidays, St Joseph's Day and school breaks in Vorarlberg with weekdays, plus the bridge days that pay most in 2027.",
      resume: `Vorarlberg has the same 13 statutory holidays as the rest of Austria; its patron saint is St Joseph, and his feast on 19 March is a day without school. Section 3 of the Vorarlberg Compulsory School Hours Act lists the school days off one by one: besides Saturdays and Sundays, 19 March, 1 May, Ascension Day, Corpus Christi, 26 October, 1 November, All Souls' Day and 8 December; the other holidays fall in the school breaks anyway. For employees St Joseph's Day is not a statutory holiday. In 2027 it falls on a ${wd(2027, 3, 19, 'en')}, just before the Easter break, and in 2028 on a ${wd(2028, 3, 19, 'en')}. The semester break starts on the second Monday in February, ${dLong(sem('V').von, 'en')} in 2027, and the summer holidays on ${dLong(K.hauptferien(2027, 'V'), 'en')}; school starts on the second Monday in September. Many people in Vorarlberg work in Switzerland or Liechtenstein, where other holidays apply and Austrian holidays are working days at the workplace. Ten leave days give ${opt('V', 2027, 10).frei} days off in Vorarlberg in 2027.`,
      faqs: [
        { q: 'Is 19 March a day off in Vorarlberg?', a: `For schools, yes, under section 3 of the Compulsory School Hours Act. For employees St Joseph's Day is not a statutory holiday. In 2027 it falls on a ${wd(2027, 3, 19, 'en')}, in 2028 on a ${wd(2028, 3, 19, 'en')}. Cross-border commuters to Switzerland or Liechtenstein follow the holidays of their workplace anyway.` },
        { q: 'Do Austrian holidays apply to cross-border commuters?', a: 'The law of the place of work applies. If you work in Switzerland or Liechtenstein you have the holidays there; an Austrian holiday is only off if it also applies there or your contract provides for it. If in doubt, check your employment contract.' },
        { q: 'When is the 2027 semester break in Vorarlberg?', a: `From ${dLong(sem('V').von, 'en')} to ${dLong(sem('V').bis, 'en')}. In 2028 it starts on ${dLong(sem('V', 2028).von, 'en')}. Vorarlberg shares the date with Burgenland, Carinthia, Salzburg and Tyrol. Vienna and Lower Austria are off a week earlier, Upper Austria and Styria a week later.` },
      ],
      text: (h) => `<h2>St Joseph's Day in Vorarlberg</h2>
<p>The ${h.src('schule-v', 'Vorarlberg Compulsory School Hours Act')} puts 19 March first among the days without school in section 3, ahead of 1 May. Unlike other provinces, Vorarlberg lists the holidays one by one instead of simply referring to "the statutory holidays". The result is the same: all 13 holidays are school days off, plus St Joseph's Day and All Souls' Day.</p>`,
    },
  },
  {
    id: 'feiertage-wien', land: 'W', order: 48, sources: ['schule-w'], related: ['feiertage-niederoesterreich', 'feiertage-burgenland', 'landesfeiertage', 'feiertage-2027'],
    de: {
      slug: 'feiertage-wien', nav: 'Wien', card: 'Leopolditag am 15. November schulfrei',
      title: 'Feiertage Wien 2027: Leopolditag, Semesterferien, Brücken',
      description: 'Feiertage in Wien 2027 mit Wochentag: die 13 gesetzlichen Feiertage, der Leopolditag am 15. November, Semesterferien ab 1. Februar und alle Fenstertage.',
      h1: 'Feiertage in Wien 2027',
      intro: 'Gesetzliche Feiertage, Leopolditag und Schulferien in Wien mit Wochentag, dazu die Fenstertage, die 2027 am meisten bringen.',
      resume: `Wien hat die 13 gesetzlichen Feiertage Österreichs und als eigenen schulfreien Tag den 15. November, das Fest des heiligen Leopold, des Landespatrons von Wien und Niederösterreich. Das Wiener Schulgesetz nennt den 15. November in § 56 neben Sonn- und Feiertagen und dem Allerseelentag als schulfrei. Arbeitsrechtlich ist er in Wien wie in Niederösterreich ein Werktag; Geschäfte und die meisten Betriebe arbeiten. 2027 fällt der Leopolditag auf einen ${wd(2027, 11, 15, 'de')}, 2028 auf einen ${wd(2028, 11, 15, 'de')}. Wiener Schulen haben mit Niederösterreich die frühesten Semesterferien: 2027 vom ${dLong(sem('W').von, 'de')} bis ${dLong(sem('W').bis, 'de')}. Die Schule beginnt am ersten Montag im September, 2027 am ${dLong(K.schulbeginn(2027, 'W'), 'de')}, und endet eine Woche früher als in den übrigen Ländern, die Sommerferien beginnen 2027 am ${dLong(K.hauptferien(2027, 'W'), 'de')}. Mit zehn Urlaubstagen kommen Sie 2027 in Wien auf ${opt('W', 2027, 10).frei} freie Tage, 2028 auf ${opt('W', 2028, 10).frei}. Wien hat 2027 ${K.arbeitstage(2027, 'W').reduce((a, b) => a + b, 0)} Arbeitstage.`,
      faqs: [
        { q: 'Ist der 15. November in Wien ein Feiertag?', a: 'Nein, nicht für Beschäftigte. Für die Schulen ist der Leopolditag nach dem Wiener Schulgesetz schulfrei. Ob Sie im Betrieb frei haben, steht in Ihrem Kollektivvertrag oder Dienstrecht. 2027 fällt der Leopolditag auf einen Montag, 2028 auf einen Mittwoch; Geschäfte haben an diesem Tag geöffnet.' },
        { q: 'Wann sind die Semesterferien 2027 in Wien?', a: `Vom ${dLong(sem('W').von, 'de')} bis ${dLong(sem('W').bis, 'de')}. 2028 beginnen sie am ${dLong(sem('W', 2028).von, 'de')}. Wien teilt den frühen Termin mit Niederösterreich. Burgenland, Kärnten, Salzburg, Tirol und Vorarlberg folgen eine Woche später, Oberösterreich und die Steiermark zwei Wochen später. Gezählt wird von Montag bis Samstag.` },
        { q: 'Wann beginnen die Sommerferien 2027 in Wien?', a: `Am Samstag, ${dLong(K.hauptferien(2027, 'W'), 'de')}. Der letzte Schultag ist der Freitag davor, das neue Schuljahr beginnt am ${dLong(K.schulbeginn(2027, 'W'), 'de')}. Die Sommerferien dauern damit rund neun Wochen. Im Burgenland und in Niederösterreich gelten dieselben Termine, in den übrigen Ländern beginnen Ferien und Schuljahr eine Woche später.` },
      ],
      text: (h) => `<h2>Leopolditag in Wien</h2>
<p>Das ${h.src('schule-w', 'Wiener Schulgesetz')} zählt in § 56 die Samstage, Sonn- und Feiertage, den Allerseelentag und den 15. November zu den schulfreien Tagen. 2027 ist der 15. November ein Montag, also ein langes Wochenende für Schulkinder. Wer den Tag nicht frei hat, kann ihn als ${h.a('karfreitag', 'persönlichen Feiertag')} festlegen, wenn er ihn drei Monate vorher meldet.</p>`,
    },
    en: {
      slug: 'public-holidays-vienna', nav: 'Vienna', card: "St Leopold's Day, 15 November, no school",
      title: "Public holidays Vienna 2027: St Leopold's Day and breaks",
      description: "Public holidays in Vienna 2027 with weekdays: the 13 statutory holidays, St Leopold's Day on 15 November, the semester break from 1 February and bridge days.",
      h1: 'Public holidays in Vienna 2027',
      intro: "Statutory holidays, St Leopold's Day and school breaks in Vienna with weekdays, plus the bridge days that pay most in 2027.",
      resume: `Vienna has Austria's 13 statutory holidays and, as its own school day off, 15 November, the feast of St Leopold, patron saint of Vienna and Lower Austria. Section 56 of the Vienna Schools Act lists 15 November alongside Sundays, holidays and All Souls' Day as a day without school. In employment law it is a working day in Vienna, as in Lower Austria; shops and most businesses work. In 2027 St Leopold's Day falls on a ${wd(2027, 11, 15, 'en')}, in 2028 on a ${wd(2028, 11, 15, 'en')}. Vienna's schools share the earliest semester break with Lower Austria: ${dLong(sem('W').von, 'en')} to ${dLong(sem('W').bis, 'en')} in 2027. School starts on the first Monday in September, ${dLong(K.schulbeginn(2027, 'W'), 'en')} in 2027, and ends a week earlier than in the other provinces, with the summer holidays starting on ${dLong(K.hauptferien(2027, 'W'), 'en')} in 2027. Ten leave days give ${opt('W', 2027, 10).frei} days off in Vienna in 2027 and ${opt('W', 2028, 10).frei} in 2028. Vienna has ${K.arbeitstage(2027, 'W').reduce((a, b) => a + b, 0)} working days in 2027.`,
      faqs: [
        { q: 'Is 15 November a public holiday in Vienna?', a: "No, not for employees. Under the Vienna Schools Act St Leopold's Day is a day without school. Whether you get it off at work is set by your collective agreement or service code. In 2027 St Leopold's Day is a Monday, in 2028 a Wednesday; shops are open." },
        { q: 'When is the 2027 semester break in Vienna?', a: `From ${dLong(sem('W').von, 'en')} to ${dLong(sem('W').bis, 'en')}. In 2028 it starts on ${dLong(sem('W', 2028).von, 'en')}. Vienna shares the early date with Lower Austria. Burgenland, Carinthia, Salzburg, Tyrol and Vorarlberg follow a week later, Upper Austria and Styria two weeks later. It runs from Monday to Saturday.` },
        { q: 'When do the 2027 summer holidays start in Vienna?', a: `On Saturday ${dLong(K.hauptferien(2027, 'W'), 'en')}. The last school day is the Friday before, and the new school year starts on ${dLong(K.schulbeginn(2027, 'W'), 'en')}. That makes a summer break of about nine weeks. Burgenland and Lower Austria have the same dates; in the other provinces the holidays and the school year start a week later.` },
      ],
      text: (h) => `<h2>St Leopold's Day in Vienna</h2>
<p>Section 56 of the ${h.src('schule-w', 'Vienna Schools Act')} lists Saturdays, Sundays and holidays, All Souls' Day and 15 November as days without school. In 2027, 15 November is a Monday, a long weekend for school children. If you do not get the day off, you can fix it as your ${h.a('karfreitag', 'personal holiday')}, provided you give three months' notice.</p>`,
    },
  },
];

export default DEFS.map(build);

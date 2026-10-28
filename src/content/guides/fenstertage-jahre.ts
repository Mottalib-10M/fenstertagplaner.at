/** Fenstertage 2026 (ce qui reste de l'année) et 2028 (l'année faste). L'année 2027 est l'accueil. Dates : moteur. */
import { defineGuide } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';
import { tabelleFenster, tabelleBruecken } from '../../lib/bausteine';
import { dLong, dWeek } from '../../lib/tool-specs';

const plus = (iso: string, x: number) => K.toIso(K.fromIso(iso) + x);
const d = (id: string, y: number) => K.feiertage(y).find((f) => f.id === id)!.date;
const list = (xs: string[], l: 'de' | 'en') => xs.join(', ').replace(/, ([^,]*)$/, l === 'de' ? ' und $1' : ' and $1');

/* ---------------------------------------------------------------- 2026 */
const ft26 = K.fenstertage(2026, 'W');
const p26 = K.optimiere(2026, 'W', 10);
const xmas26 = K.bruecken(2026, 'W').find((b) => b.urlaubVon === '2026-12-28')!;
const xmas26hl = K.bruecken(2026, 'W', { heiligabend: true }).find((b) => b.urlaubVon === '2026-12-28')!;
const jan27 = K.bruecken(2027, 'W').find((b) => b.urlaubVon === '2027-01-04')!;

const f2026 = defineGuide({
  id: 'fenstertage-2026', group: 'werkzeuge', order: 2, tool: 'bt', toolArg: { jahr: 2026, urlaub: 5 },
  related: ['home', 'fenstertage-2028', 'feiertage-2026', 'naechster-feiertag'],
  sources: ['arg7', 'urlg4', 'arg13a'],
  de: {
    slug: 'fenstertage-2026', nav: 'Fenstertage 2026', card: 'Was 2026 bis Silvester noch geht',
    title: 'Fenstertage 2026 Österreich: 7. Dezember und Weihnachten',
    description: 'Fenstertage 2026 in Österreich: Montag, 7. Dezember, vor Mariä Empfängnis und die Weihnachtswoche. Alle Brücken 2026 mit Datum, der Planer rechnet für Ihr Land.',
    h1: 'Fenstertage 2026: was bis Silvester noch möglich ist',
    intro: 'Für den Rest von 2026 lohnt vor allem der Montag vor Mariä Empfängnis. Der Planer zeigt alle Brücken des Jahres und rechnet mit Ihrem restlichen Urlaub.',
    resume: `Das Jahr 2026 hatte ${ft26.length} echte Fenstertage: ${list(ft26.map((b) => dLong(b.urlaubVon, 'de')), 'de')}. Bis auf einen liegen sie Ende Oktober schon hinter uns. Offen ist noch der ${dWeek('2026-12-07', 'de')}: Mariä Empfängnis fällt auf einen Dienstag, ein Urlaubstag am Montag davor ergibt vier freie Tage vom 5. bis 8. Dezember. Allerheiligen fällt 2026 auf einen Sonntag und bringt keinen freien Tag. Über Weihnachten liegen Christtag und Stefanitag auf Freitag und Samstag. Wer die vier Arbeitstage vom 28. bis 31. Dezember frei nimmt, ist ${xmas26.frei} Tage am Stück zu Hause, vom ${dLong(xmas26.freiVon, 'de')} bis ${dLong(xmas26.freiBis, 'de')}. Sind Heiligabend und Silvester in Ihrem Betrieb frei, reichen ${xmas26hl.urlaub} Urlaubstage. Zwei Tage im Jänner 2027, der 4. und 5., schließen an Heilige Drei Könige an; sie zählen aber schon zum Urlaub des neuen Jahres. Über das ganze Jahr 2026 hätten zehn Urlaubstage ${p26.frei} freie Tage gebracht.`,
    faqs: [
      { q: 'Welche Fenstertage gibt es 2026 noch?', a: `Nur einen: Montag, 7. Dezember 2026. Mariä Empfängnis am 8. Dezember ist ein Dienstag; mit einem Urlaubstag am Montag haben Sie von Samstag, 5., bis Dienstag, 8. Dezember, frei. Allerheiligen fällt 2026 auf einen Sonntag und bringt deshalb keine Brücke.` },
      { q: 'Wie viele Urlaubstage brauche ich über Weihnachten 2026?', a: `Vier: 28., 29., 30. und 31. Dezember. Damit sind Sie ${xmas26.frei} Tage frei, vom Christtag am Freitag bis Sonntag, 3. Jänner 2027. Wenn Heiligabend und Silvester bei Ihnen frei sind, reichen drei Tage, weil der 31. Dezember dann ohnehin frei ist.` },
      { q: 'Haben die Geschäfte am 8. Dezember 2026 offen?', a: 'Viele ja. Nach § 13a Arbeitsruhegesetz dürfen Verkaufsstellen am 8. Dezember Beschäftigte einsetzen, wenn der Tag auf einen Werktag fällt, wie 2026 an einem Dienstag. Für die Beschäftigten bleibt es trotzdem ein Feiertag: Sie dürfen die Arbeit ohne Angabe von Gründen ablehnen und dürfen deswegen nicht benachteiligt werden.' },
      { q: 'Verfällt mein Resturlaub 2026 am Jahresende?', a: 'Nein. In Österreich verjährt Urlaub nach § 4 Abs. 5 Urlaubsgesetz erst zwei Jahre nach dem Ende des Urlaubsjahres, in dem er entstanden ist. Resturlaub aus 2026 können Sie also auch 2027 oder 2028 noch verbrauchen, etwa für die Fenstertage im Mai.' },
    ],
    body: (h) => `<h2>Die Fenstertage 2026 im Überblick</h2>
<p>Die Tabelle zeigt alle echten Fenstertage des Jahres, auch die vergangenen. Sie gelten in allen Bundesländern gleich, weil die ${h.src('arg7', '13 gesetzlichen Feiertage')} bundesweit festgelegt sind.</p>
${tabelleFenster(h, 2026)}
<h2>Dezember 2026: zwei Gelegenheiten</h2>
<p>Am meisten bringt der 7. Dezember: ein Urlaubstag, vier freie Tage. Wer einen längeren Block möchte, nimmt Montag, 7., und dazu Mittwoch bis Freitag, 9. bis 11. Dezember, und ist mit vier Urlaubstagen neun Tage frei.</p>
<p>Über Weihnachten gibt es 2026 keine echten Fenstertage, aber eine günstige Lage: Christtag ist ein Freitag, Stefanitag ein Samstag, Neujahr 2027 ein Freitag. Die vier Arbeitstage dazwischen verbinden zwei lange Wochenenden zu ${xmas26.frei} freien Tagen. Danach folgt im Jänner 2027 noch eine Brücke: Mit ${jan27.urlaub} Urlaubstagen am 4. und 5. Jänner verlängern Sie bis Heilige Drei Könige, insgesamt ${jan27.frei} freie Tage ab Neujahr.</p>
${tabelleBruecken(h, 2026, 'W', 6)}
<h2>Resturlaub sinnvoll ins nächste Jahr tragen</h2>
<p>Urlaub verfällt in Österreich nicht zum Jahreswechsel; nach ${h.src('urlg4', '§ 4 Urlaubsgesetz')} verjährt er zwei Jahre nach Ende des Urlaubsjahres. Es kann sich also lohnen, ein paar Tage für 2027 aufzuheben: Dort liegen die Fenstertage nach Christi Himmelfahrt, nach Fronleichnam und vor dem Nationalfeiertag. Der ${h.a('home', 'Planer für 2027')} zeigt, wie viel ein übertragener Tag dort bringt.</p>
${h.mini('bt', { p: ['urlaub'], d: { jahr: 2027, urlaub: 5 }, c: 'Fenstertage 2027 planen' })}`,
  },
  en: {
    slug: 'bridge-days-2026', nav: 'Bridge days 2026', card: 'What is still possible before New Year',
    title: 'Bridge days Austria 2026: 7 December and Christmas week',
    description: 'Bridge days 2026 in Austria: Monday 7 December before the Immaculate Conception, plus Christmas week. Every bridge with dates, worked out for each province.',
    h1: 'Bridge days 2026 in Austria: what is left before New Year',
    intro: 'For the rest of 2026 the Monday before the Immaculate Conception is the one to book. The planner lists every bridge of the year and works with your remaining leave.',
    resume: `2026 had ${ft26.length} true bridge days in Austria: ${list(ft26.map((b) => dLong(b.urlaubVon, 'en')), 'en')}. By late October all but one are behind us. Still ahead is ${dWeek('2026-12-07', 'en')}: the Immaculate Conception falls on a Tuesday, so one leave day on the Monday gives four days off from 5 to 8 December. All Saints' Day falls on a Sunday in 2026 and adds nothing. At Christmas, Christmas Day and St Stephen's Day are a Friday and a Saturday. Taking the four working days from 28 to 31 December off keeps you at home for ${xmas26.frei} days, from ${dLong(xmas26.freiVon, 'en')} to ${dLong(xmas26.freiBis, 'en')}. If your employer gives Christmas Eve and New Year's Eve off, ${xmas26hl.urlaub} leave days are enough. Two days in January 2027, the 4th and 5th, connect to Epiphany, but they come out of the new year's leave. Over the whole of 2026, ten leave days would have bought ${p26.frei} days off.`,
    faqs: [
      { q: 'Which bridge days are left in 2026?', a: 'Just one: Monday 7 December 2026. The Immaculate Conception on 8 December is a Tuesday; one leave day on the Monday gives you Saturday 5 to Tuesday 8 December off. All Saints\' Day falls on a Sunday in 2026, so it gives no bridge.' },
      { q: 'How many leave days do I need over Christmas 2026?', a: `Four: 28, 29, 30 and 31 December. That gives ${xmas26.frei} days off, from Christmas Day on the Friday to Sunday 3 January 2027. If Christmas Eve and New Year's Eve are days off where you work, three are enough, because 31 December is then off anyway.` },
      { q: 'Are shops open on 8 December 2026?', a: 'Many are. Section 13a of the Rest Periods Act lets shops employ staff on 8 December when it falls on a weekday, as it does in 2026 (a Tuesday). For staff it remains a public holiday: they may refuse to work without giving reasons and must not be penalised for doing so.' },
      { q: 'Does my unused 2026 leave expire at year end?', a: 'No. In Austria leave only becomes time-barred two years after the end of the leave year in which it arose (section 4(5) of the Leave Act). You can still use leave from 2026 in 2027 or 2028, for the May bridge days for example.' },
    ],
    body: (h) => `<h2>The 2026 bridge days at a glance</h2>
<p>The table lists every true bridge day of the year, past ones included. They are the same in every province because the ${h.src('arg7', '13 statutory holidays')} are set nationally.</p>
${tabelleFenster(h, 2026)}
<h2>December 2026: two chances</h2>
<p>The best value is 7 December: one leave day, four days off. For a longer break, take Monday the 7th plus Wednesday to Friday, 9 to 11 December, and four leave days give nine days off.</p>
<p>Christmas 2026 has no true bridge day, but the calendar is kind: Christmas Day is a Friday, St Stephen's Day a Saturday and New Year's Day 2027 a Friday. The four working days in between join two long weekends into ${xmas26.frei} days off. January 2027 then has one more bridge: ${jan27.urlaub} leave days on 4 and 5 January extend the break to Epiphany, ${jan27.frei} days off from New Year's Day.</p>
${tabelleBruecken(h, 2026, 'W', 6)}
<h2>Carrying leave into next year</h2>
<p>Leave does not lapse at New Year in Austria; under ${h.src('urlg4', 'section 4 of the Leave Act')} it is only time-barred two years after the end of the leave year. Keeping a few days for 2027 can pay: that year has bridge days after Ascension Day, after Corpus Christi and before National Day. The ${h.a('home', '2027 planner')} shows what a carried-over day is worth there.</p>
${h.mini('bt', { p: ['urlaub'], d: { jahr: 2027, urlaub: 5 }, c: 'Plan the 2027 bridge days' })}`,
  },
});

/* ---------------------------------------------------------------- 2028 */
const ft28 = K.fenstertage(2028, 'W');
const p10 = K.optimiere(2028, 'W', 10), p5 = K.optimiere(2028, 'W', 5), p27 = K.optimiere(2027, 'W', 10);
const herbst = K.optimiere(2028, 'W', 5);
const wk28 = K.feiertage(2028).filter((f) => !K.isWeekend(K.fromIso(f.date))).length;
const xmas28 = K.bruecken(2028, 'W').find((b) => b.urlaubVon === '2028-12-27')!;

const f2028 = defineGuide({
  id: 'fenstertage-2028', group: 'werkzeuge', order: 3, tool: 'bt', toolArg: { jahr: 2028 },
  related: ['home', 'feiertage-2028', 'kalender-2028', 'urlaubsanspruch'],
  sources: ['arg7', 'arg7a', 'urlg2'],
  de: {
    slug: 'fenstertage-2028', nav: 'Fenstertage 2028', card: `${ft28.length} echte Fenstertage, das beste Jahr seit langem`,
    title: 'Fenstertage 2028 Österreich: 5 Zwickeltage und alle Brücken',
    description: 'Fenstertage 2028 in Österreich: fünf echte Zwickeltage, 12 Feiertage an Werktagen und ein langer Herbst. Der Planer verteilt Ihren Urlaub für jedes Bundesland.',
    h1: 'Fenstertage 2028: ein ungewöhnlich gutes Jahr',
    intro: '2028 fallen fast alle Feiertage auf Werktage. Der Planer zeigt, wie Sie Ihren Urlaub verteilen, und listet jeden Fenstertag des Jahres mit Datum.',
    resume: `2028 ist für Fenstertage eines der besten Jahre des Jahrzehnts. ${wk28} der 13 gesetzlichen Feiertage fallen auf Montag bis Freitag; nur Neujahr liegt auf einem Samstag. Es gibt ${ft28.length} echte Fenstertage: ${list(ft28.map((b) => dLong(b.urlaubVon, 'de')), 'de')}. Der Freitag nach Heilige Drei Könige, die beiden Freitage nach Christi Himmelfahrt und Fronleichnam, der Montag vor Mariä Himmelfahrt und der Freitag nach dem Nationalfeiertag bringen je vier freie Tage für einen Urlaubstag. Im Herbst folgen Nationalfeiertag am Donnerstag und Allerheiligen am Mittwoch so dicht aufeinander, dass fünf Urlaubstage vom 26. Oktober bis 5. November elf freie Tage ergeben. Christtag und Stefanitag fallen auf Montag und Dienstag: Drei Urlaubstage bis Silvester bringen ${xmas28.frei} freie Tage. Mit zehn Urlaubstagen kommen Sie 2028 auf ${p10.frei} freie Tage, mit fünf auf ${p5.frei}. Zum Vergleich: 2027 sind es mit zehn Tagen ${p27.frei}. Wer 2028 vorausplant, sollte Urlaubswünsche früh im Betrieb anmelden.`,
    faqs: [
      { q: 'Wie viele Fenstertage gibt es 2028?', a: `${ft28.length} echte: ${list(ft28.map((b) => dLong(b.urlaubVon, 'de')), 'de')}. Dazu kommen kurze Brücken rund um Allerheiligen und zu Weihnachten. Die Feiertage gelten in ganz Österreich, die Zahl ist daher in jedem Bundesland gleich.` },
      { q: 'Wann sollte ich den Urlaub für 2028 einreichen?', a: 'Ein gesetzliches Datum gibt es nicht; den Zeitpunkt vereinbaren Sie mit dem Arbeitgeber. Weil 2028 so viele Kolleginnen und Kollegen dieselben Fenstertage wollen, lohnt es sich, Wünsche schon im Herbst 2027 anzumelden. Einen einzelnen Tag dürfen Sie als persönlichen Feiertag selbst festlegen, wenn Sie ihn drei Monate vorher schriftlich bekannt geben.' },
      { q: 'Wie viele Feiertage verliert man 2028 ans Wochenende?', a: 'Nur Neujahr, ein Samstag. Alle anderen zwölf liegen auf Werktagen. Das ist selten: 2027 fallen vier Feiertage auf ein Wochenende, 2026 waren es drei. Wer seinen Urlaub für 2028 plant, kann deshalb mit mehr langen Wochenenden rechnen als in den beiden Jahren davor.' },
      { q: 'Lohnt sich der Herbst 2028 besonders?', a: 'Ja. Der Nationalfeiertag ist ein Donnerstag, Allerheiligen der Mittwoch darauf. Mit dem Fenstertag am 27. Oktober und vier weiteren Urlaubstagen am 30. und 31. Oktober sowie am 2. und 3. November sind Sie vom 26. Oktober bis 5. November frei, elf Tage für fünf Urlaubstage.' },
    ],
    body: (h) => `<h2>Die Fenstertage 2028</h2>
${tabelleFenster(h, 2028)}
<p>Jeder dieser Tage bringt vier freie Tage für einen Urlaubstag. Mariä Himmelfahrt am Dienstag, 15. August, ist im Sommer besonders praktisch: Der Montag davor verlängert das Wochenende, ohne die Sommerferien zu stören. Mariä Empfängnis fällt auf einen Freitag und bringt ohne Urlaub ein langes Wochenende.</p>
<h2>Längere Blöcke 2028</h2>
<p>Für einen längeren Urlaub eignen sich drei Zeiträume. Die Woche nach Ostermontag (${dLong(plus(d('ostermontag', 2028), 1), 'de')} bis ${dLong(plus(d('ostermontag', 2028), 4), 'de')}) kostet vier Urlaubstage für neun freie Tage. Der Herbst rund um Nationalfeiertag und Allerheiligen bringt mit fünf Tagen elf. Weihnachten: Christtag Montag, Stefanitag Dienstag, Neujahr 2029 ein Montag; drei Urlaubstage vom 27. bis 29. Dezember ergeben ${xmas28.frei} freie Tage.</p>
${tabelleBruecken(h, 2028, 'W', 10)}
<p>Wie viel Urlaub Ihnen zusteht, regelt das ${h.src('urlg2', 'Urlaubsgesetz')}: 25 Arbeitstage in der Fünftagewoche, ab dem 26. Dienstjahr 30. Den Rest rechnet der Planer oben; für einen einzelnen Wunschtag gibt es den ${h.a('karfreitag', 'persönlichen Feiertag')}.</p>
${h.mini('ua', { p: ['woche', 'dienst'], d: { jahr: 2028 }, c: 'Urlaubsanspruch prüfen' })}`,
  },
  en: {
    slug: 'bridge-days-2028', nav: 'Bridge days 2028', card: `${ft28.length} true bridge days, the best year in a while`,
    title: 'Bridge days Austria 2028: five Fenstertage and all bridges',
    description: 'Bridge days 2028 in Austria: five true Fenstertage, twelve holidays on weekdays and a long autumn break. The planner spreads your leave for every province.',
    h1: 'Bridge days 2028 in Austria: an unusually good year',
    intro: 'In 2028 almost every public holiday falls on a weekday. The planner shows how to spread your leave and lists every bridge day of the year with its date.',
    resume: `For bridge days, 2028 is one of the best years of the decade in Austria. ${wk28} of the 13 statutory holidays fall between Monday and Friday; only New Year's Day is a Saturday. There are ${ft28.length} true bridge days: ${list(ft28.map((b) => dLong(b.urlaubVon, 'en')), 'en')}. The Friday after Epiphany, the Fridays after Ascension Day and Corpus Christi, the Monday before Assumption Day and the Friday after National Day each turn one leave day into four days off. In autumn, National Day on a Thursday and All Saints' Day on the following Wednesday are so close that five leave days give eleven days off from 26 October to 5 November. Christmas Day and St Stephen's Day are a Monday and a Tuesday, so three leave days up to New Year's Eve give ${xmas28.frei} days off. Ten leave days buy ${p10.frei} days off in 2028, five buy ${p5.frei}. For comparison, ten days buy ${p27.frei} in 2027. If you plan for 2028, put your requests in early.`,
    faqs: [
      { q: 'How many bridge days are there in 2028?', a: `${ft28.length} true ones: ${list(ft28.map((b) => dLong(b.urlaubVon, 'en')), 'en')}. There are also short bridges around All Saints' Day and Christmas. Holidays are national in Austria, so the count is the same in every province.` },
      { q: 'When should I book leave for 2028?', a: 'There is no legal deadline; you agree the timing with your employer. Since many colleagues will want the same bridge days in 2028, it pays to register your wishes in autumn 2027. You may fix one single day yourself as a personal holiday if you give written notice three months ahead.' },
      { q: 'How many 2028 holidays are lost to the weekend?', a: 'Only New Year\'s Day, a Saturday. The other twelve are weekdays. That is rare: four holidays fall at a weekend in 2027, and three did in 2026. Anyone planning leave for 2028 can therefore expect more long weekends than in the two years before.' },
      { q: 'Is autumn 2028 especially good?', a: 'Yes. National Day is a Thursday and All Saints\' Day the following Wednesday. With the bridge day on 27 October and four more leave days on 30 and 31 October and 2 and 3 November, you are off from 26 October to 5 November: eleven days for five days of leave.' },
    ],
    body: (h) => `<h2>The 2028 bridge days</h2>
${tabelleFenster(h, 2028)}
<p>Each of these turns one leave day into four days off. Assumption Day on Tuesday 15 August is especially handy in summer: the Monday before extends the weekend without touching the school holidays. The Immaculate Conception falls on a Friday and gives a long weekend without any leave.</p>
<h2>Longer breaks in 2028</h2>
<p>Three periods suit a longer break. The week after Easter Monday (${dLong(plus(d('ostermontag', 2028), 1), 'en')} to ${dLong(plus(d('ostermontag', 2028), 4), 'en')}) costs four leave days for nine days off. The autumn around National Day and All Saints' Day gives eleven for five. At Christmas, Christmas Day is a Monday, St Stephen's Day a Tuesday and New Year's Day 2029 a Monday; three leave days from 27 to 29 December give ${xmas28.frei} days off.</p>
${tabelleBruecken(h, 2028, 'W', 10)}
<p>Your allowance comes from the ${h.src('urlg2', 'Leave Act')}: 25 working days on a five-day week, 30 from the 26th year of service. The planner above does the rest; for one chosen day there is the ${h.a('karfreitag', 'personal holiday')}.</p>
${h.mini('ua', { p: ['woche', 'dienst'], d: { jahr: 2028 }, c: 'Check your leave entitlement' })}`,
  },
});

export default [f2026, f2028];
void herbst;

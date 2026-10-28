/** Accueil, allemand d'Autriche et anglais. Dates et chiffres : moteur (src/lib/engine) via la trousse, jamais tapés à la main. */
import { KIT as K } from '../lib/kit';
import type { FAQ, Helpers } from '../lib/page-types';
import { formatNumber } from '../lib/format';
import { dLong, dWeek } from '../lib/tool-specs';

interface HomeLang {
  title: string; description: string; h1: string; intro: string; resume: string;
  facts: Array<{ k: string; v: string }>; toolsTitle: string; foldTitle: string; faqs: FAQ[];
  why: (h: Helpers) => string; sections: (h: Helpers) => Array<{ title: string; html: string }>;
}
const Y = 2027;
const n = (x: number, l: 'de' | 'en') => formatNumber(x, 0, l);
const d = (id: string, y = Y) => K.feiertage(y).find((f) => f.id === id)!.date;
const ft = K.fenstertage(Y, 'W');
const p10 = K.optimiere(Y, 'W', 10), p5 = K.optimiere(Y, 'W', 5), p25 = K.optimiere(Y, 'W', 25);
const p10_28 = K.optimiere(Y + 1, 'W', 10);
const at = K.arbeitstage(Y, 'W').reduce((a, b) => a + b, 0);
const wk = K.feiertage(Y).filter((f) => !K.isWeekend(K.fromIso(f.date))).length;
const os = K.ostersonntag(Y);
const plus = (iso: string, x: number) => K.toIso(K.fromIso(iso) + x);
// Block um den Nationalfeiertag: Samstag vor dem Fenstertag bis Allerheiligen.
const natVon = plus(d('nationalfeiertag'), -3), natBis = d('allerheiligen');

const de: HomeLang = {
  title: 'Fenstertage 2027 Österreich: Urlaubsplaner für alle Länder',
  description: 'Fenstertage 2027 in Österreich: Der Planer verteilt Ihre Urlaubstage auf die besten Zwickeltage und zeigt jeden Feiertag mit Datum, für alle neun Bundesländer.',
  h1: 'Fenstertage 2027: mit wenigen Urlaubstagen möglichst lange frei',
  intro: 'Bundesland und Zahl der Urlaubstage wählen: Der Planer legt Ihren Urlaub 2027 auf die ergiebigsten Fenstertage und listet jede Brücke des Jahres mit Datum.',
  resume: `Österreich hat ${K.FEIERTAGE.length} gesetzliche Feiertage, und sie gelten nach § 7 des Arbeitsruhegesetzes in allen neun Bundesländern gleich. ${Y} fallen ${wk} davon auf Montag bis Freitag. Echte Fenstertage, an denen ein einziger Urlaubstag vier freie Tage am Stück ergibt, gibt es ${Y} ${ft.length}: ${ft.map((b) => dWeek(b.urlaubVon, 'de')).join(', ').replace(/, ([^,]*)$/, ' und $1')}. Der dritte ist der ergiebigste, weil der Nationalfeiertag auf einen Dienstag fällt und Allerheiligen auf den Montag darauf: Mit dem Montag und drei weiteren Urlaubstagen sind Sie vom ${dLong(natVon, 'de')} bis ${dLong(natBis, 'de')} frei. Mit zehn Urlaubstagen kommen Sie ${Y} auf ${p10.frei} freie Tage, mit fünf auf ${p5.frei}. Weniger günstig ist ${Y}, weil der Staatsfeiertag auf einen Samstag fällt, Mariä Himmelfahrt auf einen Sonntag und Christtag und Stefanitag auf das Wochenende; nachgeholt wird in Österreich kein Feiertag. Der Karfreitag ist seit 2019 kein Feiertag mehr. Wer Wert auf ihn legt, nimmt ihn als persönlichen Feiertag aus dem eigenen Urlaub.`,
  facts: [
    { k: 'Echte Fenstertage 2027', v: n(ft.length, 'de') },
    { k: '10 Urlaubstage ergeben', v: `${p10.frei} Tage frei` },
    { k: 'Arbeitstage 2027', v: n(at, 'de') },
    { k: 'Ostersonntag 2027', v: dLong(os, 'de') },
  ],
  toolsTitle: 'Weitere Rechner rund um Feiertage, Urlaub und Schule',
  foldTitle: 'Fenstertage verstehen und den Urlaub einreichen',
  faqs: [
    { q: 'Was ist ein Fenstertag?', a: 'So heißt in Österreich ein einzelner Arbeitstag, der zwischen einem Feiertag und dem Wochenende eingeklemmt ist, im Westen auch Zwickeltag genannt. Typisch ist der Freitag nach Christi Himmelfahrt oder nach Fronleichnam, die immer auf einen Donnerstag fallen. Wer an diesem einen Tag Urlaub nimmt, hat vier Tage am Stück frei. Der Planer zählt außerdem kurze Lücken von zwei bis vier Arbeitstagen, die zwei freie Blöcke verbinden.' },
    { q: 'Wie viele Fenstertage gibt es 2027 in Österreich?', a: `Drei echte: ${ft.map((b) => dLong(b.urlaubVon, 'de')).join(', ').replace(/, ([^,]*)$/, ' und $1')}. Dazu kommen Brücken mit zwei Urlaubstagen rund um Heilige Drei Könige und Mariä Empfängnis. Da die Feiertage bundesweit gelten, ist die Zahl in allen neun Bundesländern gleich; nur wer am Tag des Landespatrons frei hat, bekommt eventuell eine zusätzliche Brücke.` },
    { q: 'Werden Feiertage am Wochenende nachgeholt?', a: `Nein. Fällt ein Feiertag auf einen Sonntag, gelten nach § 7 Abs. 7 Arbeitsruhegesetz einfach die Regeln für die Wochenendruhe, einen Ersatztag gibt es nicht. ${Y} trifft das den Staatsfeiertag (Samstag), Mariä Himmelfahrt (Sonntag) sowie Christtag und Stefanitag (Samstag und Sonntag). Nur ein Kollektivvertrag oder eine Betriebsvereinbarung könnte etwas anderes vorsehen.` },
    { q: 'Sind Heiligabend und Silvester frei?', a: `Gesetzlich nicht: Der 24. und der 31. Dezember sind Werktage. Viele Kollektivverträge geben sie ganz oder ab Mittag frei. ${Y} fallen beide auf einen ${K.weekday(K.fromIso(`${Y}-12-24`)) === 5 ? 'Freitag' : 'Werktag'}. Unter „Weitere Angaben“ können Sie beide Tage als frei markieren; der Planer rechnet dann mit kürzeren Brücken über Weihnachten.` },
    { q: 'Zählt der Landespatron als freier Tag?', a: 'Der Tag des Landespatrons ist kein gesetzlicher Feiertag nach dem Arbeitsruhegesetz. Schulfrei ist er nach den Schulgesetzen der Länder. Ob Sie im Betrieb frei haben, entscheiden Kollektivvertrag, Betriebsvereinbarung oder, im öffentlichen Dienst, das Dienstrecht. Unter „Weitere Angaben“ können Sie ihn als frei markieren.' },
    { q: 'Werden meine Eingaben gespeichert oder gesendet?', a: 'Nein. Bundesland, Jahr und Urlaubstage verarbeitet nur Ihr Browser. Es gibt kein Konto und kein Formular. Wenn Sie etwas ändern, schreibt die Seite Ihre Auswahl in die Adresszeile, damit Sie den Link weitergeben können; auch das bleibt auf Ihrem Gerät.' },
  ],
  why: (h) => `<h2>Welche Brücken ${Y} am meisten bringen</h2>
<p>Den Wert einer Brücke misst man an freien Tagen je Urlaubstag. Ein echter Fenstertag bringt vier freie Tage für einen Urlaubstag. Eine gewöhnliche Urlaubswoche von Montag bis Freitag bringt neun freie Tage für fünf Urlaubstage, also nicht einmal das Doppelte. Alles, was deutlich über diesem Wert liegt, lohnt sich; der Planer sortiert die Brücken genau danach.</p>
<p>${Y} liegen die ergiebigsten Wochen im Frühling und im Herbst. Ostermontag fällt auf den ${dLong(d('ostermontag'), 'de')}, Christi Himmelfahrt auf den ${dLong(d('himmelfahrt'), 'de')}, Pfingstmontag auf den ${dLong(d('pfingstmontag'), 'de')} und Fronleichnam auf den ${dLong(d('fronleichnam'), 'de')}. Im Herbst folgen Nationalfeiertag am Dienstag und Allerheiligen am Montag kurz aufeinander, im Dezember liegt Mariä Empfängnis an einem Mittwoch. Der Sommer hat dagegen keinen einzigen Feiertag an einem Werktag, weil der 15. August auf einen Sonntag fällt.</p>
${h.mini('ua', { p: ['woche', 'dienst'], c: 'Urlaubsanspruch genau berechnen' })}
<p>Wie viel Urlaub Ihnen zusteht, regelt das ${h.src('urlg2', 'Urlaubsgesetz')}: 30 Werktage im Jahr, ab dem 26. Dienstjahr 36. In der Fünftagewoche sind das 25 beziehungsweise 30 Arbeitstage, also fünf oder sechs Wochen. Die Einzelheiten stehen unter ${h.a('urlaubsanspruch', 'Urlaubsanspruch')}.</p>`,
  sections: (h) => [
    { title: `Die Fenstertage ${Y} in der Reihenfolge des Jahres`, html: `<p><strong>Jänner.</strong> Neujahr ist ein Freitag, Heilige Drei Könige ein Mittwoch. Zwei Urlaubstage am Montag und Dienstag dazwischen ergeben sechs freie Tage vom 1. bis 6. Jänner; wer auch Donnerstag und Freitag nimmt, ist bis zum 10. Jänner zu Hause.</p>
<p><strong>Ostern.</strong> Ostermontag ist der ${dLong(d('ostermontag'), 'de')}. Vier Urlaubstage von Dienstag bis Freitag nach Ostern verbinden ihn mit dem folgenden Wochenende, zusammen neun freie Tage. Der Karfreitag, ${dLong(K.karfreitag(Y), 'de')}, ist ein normaler Arbeitstag, außer Sie nehmen ihn als ${h.a('karfreitag', 'persönlichen Feiertag')}.</p>
<p><strong>Mai und Juni.</strong> Der Freitag nach Christi Himmelfahrt, ${dLong(plus(d('himmelfahrt'), 1), 'de')}, und der Freitag nach Fronleichnam, ${dLong(plus(d('fronleichnam'), 1), 'de')}, sind die beiden klassischen Fenstertage. Dazwischen liegt Pfingstmontag; die vier Tage danach, ${dLong(plus(d('pfingstmontag'), 1), 'de')} bis ${dLong(plus(d('pfingstmontag'), 4), 'de')}, ergeben neun freie Tage.</p>
<p><strong>Oktober und November.</strong> Montag, ${dLong(plus(d('nationalfeiertag'), -1), 'de')}, ist der dritte Fenstertag. Nimmt man zusätzlich Mittwoch bis Freitag nach dem Nationalfeiertag, reicht die freie Zeit dank Allerheiligen am Montag bis zum ${dLong(d('allerheiligen'), 'de')}: vier Urlaubstage für zehn freie Tage.</p>
<p><strong>Dezember.</strong> Mariä Empfängnis am Mittwoch, ${dLong(d('mariae-empfaengnis'), 'de')}, braucht zwei Urlaubstage davor oder danach für fünf freie Tage. Christtag und Stefanitag liegen auf dem Wochenende; die Woche vom 27. bis 31. Dezember kostet fünf Urlaubstage für neun freie Tage bis zum 2. Jänner ${Y + 1}.</p>` },
    { title: 'So benutzen Sie den Planer', html: `<p>Wählen Sie Bundesland, Jahr und die Zahl der Urlaubstage, die Sie für Brücken einsetzen möchten. Selten sind das alle Tage, denn ein Teil bleibt für den Sommer. Fünf bis zwölf Tage sind ein guter Anfang. Oben steht die Zahl der freien Tage, darunter jeder Block mit Datum, ganz unten alle Brücken des Jahres nach Ergiebigkeit.</p>
<p>Unter „Weitere Angaben“ lassen sich zwei Besonderheiten einstellen. Erstens der Landespatron: Wer laut Kollektivvertrag oder Dienstrecht an diesem Tag frei hat, markiert ihn als frei, und der Planer rechnet mit ihm wie mit einem Feiertag. Zweitens Heiligabend und Silvester, die in vielen Betrieben frei sind. Beides verändert vor allem die Brücken im Herbst und zu Weihnachten.</p>
<p>Bleiben Urlaubstage übrig, die keine Brücke mehr verlängern, zeigt der Planer sie als „frei planbar“. Für sie gibt es keinen Feiertagsvorteil mehr; eine ganze Urlaubswoche bringt dann neun freie Tage. Mit 25 Urlaubstagen, dem gesetzlichen Jahresurlaub in der Fünftagewoche, kommen Sie ${Y} auf ${p25.frei} freie Tage, wenn alle Tage auf Brücken liegen.</p>` },
    { title: 'Urlaub einreichen: was das Gesetz sagt', html: `<p>Den Zeitpunkt des Urlaubs vereinbaren Arbeitgeber und Arbeitnehmer nach ${h.src('urlg4', '§ 4 Urlaubsgesetz')} gemeinsam, unter Rücksicht auf den Betrieb und auf Ihre Erholung. Einseitig festlegen darf ihn keiner von beiden, mit einer Ausnahme: dem persönlichen Feiertag nach ${h.src('arg7a', '§ 7a Arbeitsruhegesetz')}. Einen Tag pro Urlaubsjahr dürfen Sie selbst bestimmen, wenn Sie ihn spätestens drei Monate vorher schriftlich bekannt geben. Für einen Fenstertag im Mai ${Y} ist das spätestens im Februar.</p>
<p>Nicht verbrauchter Urlaub verfällt nicht am Jahresende. Er verjährt nach § 4 Abs. 5 Urlaubsgesetz erst zwei Jahre nach dem Ende des Urlaubsjahres, in dem er entstanden ist. Ein Feiertag während des Urlaubs zählt nicht als Urlaubstag, und für den Feiertag selbst wird das Entgelt nach ${h.src('arg9', '§ 9 Arbeitsruhegesetz')} weitergezahlt.</p>` },
    { title: `Fenstertage 2026 und 2028 im Vergleich`, html: `<p>Vom Jahr 2026 ist noch ein Fenstertag übrig: Montag, 7. Dezember, vor Mariä Empfängnis am Dienstag. Was sonst bis Silvester geht, steht unter ${h.a('fenstertage-2026', 'Fenstertage 2026')}.</p>
<p>2028 wird deutlich besser. Der Staatsfeiertag fällt auf einen Montag, Mariä Himmelfahrt auf einen Dienstag, der Nationalfeiertag auf einen Donnerstag, Allerheiligen auf einen Mittwoch und Mariä Empfängnis auf einen Freitag. Es gibt ${K.fenstertage(Y + 1, 'W').length} echte Fenstertage, und zehn Urlaubstage bringen ${p10_28.frei} freie Tage. Die Übersicht steht unter ${h.a('fenstertage-2028', 'Fenstertage 2028')}.</p>` },
  ],
};

const en: HomeLang = {
  title: 'Bridge days Austria 2027: leave planner for every province',
  description: 'Bridge days 2027 in Austria (Fenstertage): the planner spreads your leave over the best bridges and lists every public holiday with its date, for 9 provinces.',
  h1: 'Bridge days in Austria 2027: the most time off for the fewest leave days',
  intro: 'Choose your province and the number of leave days: the planner places your 2027 leave on the best bridge days and lists every bridge of the year with dates.',
  resume: `Austria has ${K.FEIERTAGE.length} statutory public holidays, and under section 7 of the Rest Periods Act they are the same in all nine provinces. In ${Y}, ${wk} of them fall between Monday and Friday. True bridge days, known locally as Fenstertage, where a single leave day gives four days off in a row, number ${ft.length} in ${Y}: ${ft.map((b) => dWeek(b.urlaubVon, 'en')).join(', ').replace(/, ([^,]*)$/, ' and $1')}. The last one pays best because National Day falls on a Tuesday and All Saints' Day on the following Monday, so the Monday plus three more leave days keep you off work from ${dLong(natVon, 'en')} to ${dLong(natBis, 'en')}. Ten leave days give ${p10.frei} days off in ${Y}; five give ${p5.frei}. ${Y} is not a generous year: Labour Day falls on a Saturday, Assumption Day on a Sunday and both Christmas holidays at the weekend, and Austria never moves a holiday to a weekday. Good Friday has not been a holiday since 2019; anyone who wants it off takes it as a personal holiday out of their own leave.`,
  facts: [
    { k: 'True bridge days 2027', v: n(ft.length, 'en') },
    { k: '10 leave days give', v: `${p10.frei} days off` },
    { k: 'Working days 2027', v: n(at, 'en') },
    { k: 'Easter Sunday 2027', v: dLong(os, 'en') },
  ],
  toolsTitle: 'More calculators for holidays, leave and school',
  foldTitle: 'Understanding bridge days and booking leave',
  faqs: [
    { q: 'What is a Fenstertag?', a: 'It is the Austrian word for a single working day squeezed between a public holiday and the weekend; in the west people also say Zwickeltag. The classic examples are the Fridays after Ascension Day and Corpus Christi, which always fall on a Thursday. One leave day on that Friday gives four days off in a row. The planner also counts short gaps of two to four working days that join two blocks of days off.' },
    { q: 'How many bridge days does Austria have in 2027?', a: `Three true ones: ${ft.map((b) => dLong(b.urlaubVon, 'en')).join(', ').replace(/, ([^,]*)$/, ' and $1')}. There are also two-day bridges around Epiphany and the Immaculate Conception. Because public holidays are national, the count is the same in all nine provinces; only people who get their patron saint's day off may gain an extra bridge.` },
    { q: 'Are holidays that fall at the weekend moved to a weekday?', a: `No. When a holiday falls on a Sunday, section 7(7) of the Rest Periods Act simply applies the weekend rest rules; there is no substitute day. In ${Y} that affects Labour Day (Saturday), Assumption Day (Sunday) and both Christmas holidays (Saturday and Sunday). Only a collective or works agreement could provide otherwise.` },
    { q: 'Are Christmas Eve and New Year’s Eve days off?', a: 'Not by law: 24 and 31 December are ordinary working days. Many collective agreements give them off in full or from noon. Under "More details" you can mark both days as off and the planner will work with shorter bridges over Christmas.' },
    { q: "Does the patron saint's day count as a day off?", a: "A patron saint's day is not a statutory holiday under the Rest Periods Act. Schools close under the provincial school acts. Whether you get it off at work depends on your collective agreement, a works agreement or, in the public sector, the civil-service code. Under \"More details\" you can mark it as a day off." },
    { q: 'Is anything I enter stored or sent?', a: 'No. Province, year and leave days are processed in your browser only. There is no account and no form. When you change something, the page writes your choice into the address bar so you can share the link; that also stays on your device.' },
  ],
  why: (h) => `<h2>Which bridges pay off most in ${Y}</h2>
<p>A bridge is worth the days off it gives per leave day. A true bridge day yields four days off for one day of leave. An ordinary Monday-to-Friday week of leave yields nine days off for five leave days, less than double. Anything well above that ratio is worth booking, and the planner ranks every bridge by exactly that measure.</p>
<p>In ${Y} the best weeks are in spring and autumn. Easter Monday is ${dLong(d('ostermontag'), 'en')}, Ascension Day ${dLong(d('himmelfahrt'), 'en')}, Whit Monday ${dLong(d('pfingstmontag'), 'en')} and Corpus Christi ${dLong(d('fronleichnam'), 'en')}. In autumn, National Day on a Tuesday and All Saints' Day on a Monday sit close together, and in December the Immaculate Conception is a Wednesday. The summer has no holiday on a weekday at all, since 15 August is a Sunday.</p>
${h.mini('ua', { p: ['woche', 'dienst'], c: 'Work out your leave entitlement' })}
<p>Your leave is set by the ${h.src('urlg2', 'Leave Act')}: 30 working days a year (Monday to Saturday), 36 from the 26th year of service. On a five-day week that is 25 or 30 days, five or six weeks. The details are on ${h.a('urlaubsanspruch', 'leave entitlement')}.</p>`,
  sections: (h) => [
    { title: `The ${Y} bridge days in calendar order`, html: `<p><strong>January.</strong> New Year's Day is a Friday and Epiphany a Wednesday. Two leave days on the Monday and Tuesday in between give six days off from 1 to 6 January; adding Thursday and Friday keeps you at home until 10 January.</p>
<p><strong>Easter.</strong> Easter Monday is ${dLong(d('ostermontag'), 'en')}. Four leave days from the Tuesday to the Friday after Easter join it to the next weekend, nine days off in all. Good Friday, ${dLong(K.karfreitag(Y), 'en')}, is a normal working day unless you take it as your ${h.a('karfreitag', 'personal holiday')}.</p>
<p><strong>May and June.</strong> The Friday after Ascension Day, ${dLong(plus(d('himmelfahrt'), 1), 'en')}, and the Friday after Corpus Christi, ${dLong(plus(d('fronleichnam'), 1), 'en')}, are the two classic bridge days. Whit Monday sits between them; the four days after it, ${dLong(plus(d('pfingstmontag'), 1), 'en')} to ${dLong(plus(d('pfingstmontag'), 4), 'en')}, give nine days off.</p>
<p><strong>October and November.</strong> Monday ${dLong(plus(d('nationalfeiertag'), -1), 'en')} is the third bridge day. Add the Wednesday to Friday after National Day and, thanks to All Saints' Day on the Monday, the break lasts until ${dLong(d('allerheiligen'), 'en')}: four leave days for ten days off.</p>
<p><strong>December.</strong> The Immaculate Conception on Wednesday ${dLong(d('mariae-empfaengnis'), 'en')} needs two leave days before or after it for five days off. Christmas Day and St Stephen's Day fall at the weekend; the week of 27 to 31 December costs five leave days for nine days off up to 2 January ${Y + 1}.</p>` },
    { title: 'How to use the planner', html: `<p>Choose your province, the year and the number of leave days you want to spend on bridges. It is rarely your whole allowance, since some of it goes on the summer. Five to twelve days is a good start. The top line shows the days off, then each block with its dates, and at the bottom every bridge of the year ranked by yield.</p>
<p>"More details" holds two settings. The first is the patron saint's day: if your collective agreement or service code gives it off, mark it and the planner treats it like a holiday. The second is Christmas Eve and New Year's Eve, which many employers give off. Both mainly change the autumn and Christmas bridges.</p>
<p>Leave days that no longer lengthen a bridge are shown as "free to plan". They carry no holiday bonus, and a full week of leave then gives nine days off. With 25 leave days, the statutory allowance on a five-day week, you reach ${p25.frei} days off in ${Y} if every day goes on a bridge.</p>` },
    { title: 'Booking leave: what the law says', html: `<p>Under ${h.src('urlg4', 'section 4 of the Leave Act')} employer and employee agree the timing of leave together, taking account of the business and of your need for rest. Neither side may fix it alone, with one exception: the personal holiday under ${h.src('arg7a', 'section 7a of the Rest Periods Act')}. You may choose one day per leave year yourself if you give written notice at least three months ahead. For a bridge day in May ${Y} that means February at the latest.</p>
<p>Unused leave does not lapse at the end of the year. Under section 4(5) of the Leave Act it only becomes time-barred two years after the end of the leave year in which it arose. A holiday during your leave does not count as a leave day, and the holiday itself is paid under ${h.src('arg9', 'section 9 of the Rest Periods Act')}.</p>` },
    { title: 'Bridge days 2026 and 2028 compared', html: `<p>One bridge day of 2026 is still ahead: Monday 7 December, before the Immaculate Conception on the Tuesday. Everything else up to New Year's Eve is on ${h.a('fenstertage-2026', 'bridge days 2026')}.</p>
<p>2028 is much better. Labour Day falls on a Monday, Assumption Day on a Tuesday, National Day on a Thursday, All Saints' Day on a Wednesday and the Immaculate Conception on a Friday. There are ${K.fenstertage(Y + 1, 'W').length} true bridge days, and ten leave days give ${p10_28.frei} days off. The overview is on ${h.a('fenstertage-2028', 'bridge days 2028')}.</p>` },
  ],
};

export const HOME = { de, en, sources: ['arg7', 'arg7a', 'frg', 'urlg2', 'urlg4', 'arg9', 'ostern-ptb'] };

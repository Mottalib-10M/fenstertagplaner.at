/** Schulautonome Tage : nombre maximal (§ 2 Abs. 5 SchZG), fenêtres de l'année scolaire, qui décide. Dates : moteur. */
import { defineGuide } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';
import { tabelleSchule } from '../../lib/bausteine';
import { dLong, wdLong } from '../../lib/tool-specs';

const sj26 = K.schuljahr(2026, 'W'), sj27 = K.schuljahr(2027, 'W');
const span = (a: string, b: string, l: 'de' | 'en') => (a === b ? dLong(a, l) : `${dLong(a, l)} – ${dLong(b, l)}`);
const best27 = [...sj27.fenster].sort((a, b) => b.frei / b.tage - a.frei / a.tage)[0];
const sem = (land: Parameters<typeof K.semesterferien>[1]) => K.semesterferien(2027, land).von;

export default defineGuide({
  id: 'schulautonome-tage', group: 'werkzeuge', order: 7, tool: 'sa', toolArg: { sj: 2026, land: 'W' },
  related: ['landesfeiertage', 'feiertage-2027', 'kalender-2027', 'home'],
  sources: ['schzg2', 'schule-w', 'schule-noe', 'schule-ooe', 'schule-s', 'schule-k'],
  de: {
    slug: 'schulautonome-tage', nav: 'Schulautonome Tage', card: 'Höchstzahl und passende Tage je Schuljahr',
    title: 'Schulautonome Tage 2026/27: Höchstzahl und passende Tage',
    description: 'Schulautonome Tage im Schuljahr 2026/27 und 2027/28: wie viele eine Schule geben darf, welche Schultage zwischen Feiertagen liegen und wer entscheidet.',
    h1: 'Schulautonome Tage: wie viele es gibt und wo sie liegen',
    intro: 'Bundesland und Schuljahr wählen: Der Rechner zeigt die Höchstzahl schulautonomer Tage, die Ferien und jeden Schultag, der zwischen zwei freien Tagen eingeklemmt ist.',
    resume: `Schulautonome Tage sind Tage, die eine Schule selbst schulfrei erklären darf. Wie viele es höchstens sind, hängt nach § 2 Abs. 5 Schulzeitgesetz vom Wochentag des 26. Oktober ab: zwei, wenn der Nationalfeiertag auf einen Sonntag fällt, drei bei Montag oder Samstag, sonst vier. Im Schuljahr 2026/27 ist der 26. Oktober ein Montag, also sind es höchstens ${K.schulautonomMax(2026)}; 2027/28 fällt er auf einen Dienstag, dann sind es ${K.schulautonomMax(2027)}. Dazu kommen in jeder Schule die festen Herbstferien vom 27. bis 31. Oktober. Welche Tage es werden, beschließt jede Schule: an Pflichtschulen das Schulforum, an mittleren und höheren Schulen der Schulgemeinschaftsausschuss. Die Schulbehörde darf in besonderen Fällen einen weiteren Tag freigeben. Eine verbindliche Liste für ganz Österreich gibt es daher nicht. Der Rechner zeigt die Schultage, die zwischen zwei freien Tagen liegen und sich anbieten; 2026/27 sind das in Wien etwa der ${dLong(sj26.fenster[0].von, 'de')} vor Mariä Empfängnis und der 7. und 8. Jänner nach den Weihnachtsferien. Fragen Sie an der Schule Ihres Kindes nach, welche Tage beschlossen sind.`,
    faqs: [
      { q: 'Wie viele schulautonome Tage gibt es 2026/27?', a: `Höchstens ${K.schulautonomMax(2026)}, weil der 26. Oktober 2026 ein Montag ist. Dazu kann die Schulbehörde in besonderen Fällen einen weiteren Tag schulfrei erklären. Im Schuljahr 2027/28 sind es höchstens ${K.schulautonomMax(2027)}. Im Schuljahr 2025/26, als der Nationalfeiertag auf einen Sonntag fiel, waren es nur zwei.` },
      { q: 'Wer legt die schulautonomen Tage fest?', a: 'Das Schulforum an Volks- und Mittelschulen, der Schulgemeinschaftsausschuss an mittleren und höheren Schulen; die Schulleitung stimmt mit. Jede Schule entscheidet für sich, deshalb können Geschwister an verschiedenen Schulen unterschiedliche freie Tage haben. Fragen Sie im Sekretariat oder auf der Website der Schule nach den beschlossenen Terminen.' },
      { q: 'Welche Tage werden meistens schulautonom frei gegeben?', a: `Meist Schultage zwischen einem Feiertag und dem Wochenende, also die Fenstertage. 2026/27 bieten sich in Wien der ${dLong(sj26.fenster[0].von, 'de')}, der 7. und 8. Jänner sowie die Freitage nach Christi Himmelfahrt und Fronleichnam an. Verbindlich ist nur, was Ihre Schule beschlossen hat.` },
      { q: 'Was passiert, wenn eine Schule keine Herbstferien hat?', a: 'Die Schulbehörde kann die Herbstferien für einzelne Schulen streichen. Dann sind der Dienstag nach Ostern und der Dienstag nach Pfingsten schulfrei, und die Schule darf fünf schulautonome Tage vergeben (§ 2 Abs. 5a Schulzeitgesetz). Die Herbstferien vom 27. bis 31. Oktober gelten sonst an allen Schulen.' },
    ],
    body: (h) => `<h2>Die Regel im Schulzeitgesetz</h2>
<p>${h.src('schzg2', '§ 2 Abs. 5 Schulzeitgesetz')} knüpft die Zahl an den 26. Oktober. Fällt er auf einen Sonntag, sind höchstens zwei Tage möglich, bei Montag oder Samstag drei, an jedem anderen Wochentag vier. In den nächsten Schuljahren:</p>
${h.table(['Schuljahr', '26. Oktober', 'Höchstzahl'], [2025, 2026, 2027, 2028, 2029].map((y) => [`${y}/${String(y + 1).slice(2)}`, wdLong(`${y}-10-26`, 'de'), K.schulautonomMax(y)]), 'Höchstzahl schulautonomer Tage nach dem Wochentag des Nationalfeiertags', ['l', 'l', 'r'])}
<h2>Wo schulautonome Tage 2026/27 hinpassen</h2>
${tabelleSchule(h, 2026, 'W')}
<p>Die Tabelle gilt für Wien; im Rechner oben wählen Sie Ihr Bundesland. Unterschiede entstehen durch den Landespatron und die Semesterferien, die 2027 in Niederösterreich und Wien am ${dLong(sem('W'), 'de')}, in Burgenland, Kärnten, Salzburg, Tirol und Vorarlberg am ${dLong(sem('K'), 'de')} und in Oberösterreich und der Steiermark am ${dLong(sem('ST'), 'de')} beginnen. Auf Antrag von Land und Bildungsdirektion kann das Ministerium die Semesterferien eines Landes um eine Woche verlegen; die Bildungsdirektion Ihres Landes nennt die geltenden Termine.</p>
<h2>Ausblick 2027/28</h2>
<p>Im Schuljahr 2027/28 sind bis zu ${K.schulautonomMax(2027)} Tage möglich. Am ergiebigsten ist ${span(best27.von, best27.bis, 'de')}: ${best27.tage === 1 ? 'ein Schultag' : `${best27.tage} Schultage`} für ${best27.frei} freie Tage am Stück.</p>
${tabelleSchule(h, 2027, 'W')}
<p>Wer als berufstätiger Elternteil die schulautonomen Tage abdecken muss, findet die passenden Fenstertage im ${h.a('home', 'Fenstertage-Planer')}; den Tag des Landespatrons erklärt ${h.a('landesfeiertage', 'Landesfeiertage')}.</p>
${h.mini('sa', { p: ['land'], d: { sj: 2027 }, c: 'Schuljahr 2027/28 prüfen' })}`,
  },
  en: {
    slug: 'school-autonomous-days', nav: 'Autonomous school days', card: 'Maximum and best-fitting days per school year',
    title: 'Autonomous school days Austria 2026/27: limit and dates',
    description: 'Autonomous school days in Austria for 2026/27 and 2027/28: how many a school may give, which school days sit between holidays and who decides, by province.',
    h1: 'Autonomous school days in Austria: how many and where they fit',
    intro: 'Choose your province and school year: the calculator shows the maximum number of autonomous days, the breaks, and every school day squeezed between two days off.',
    resume: `Autonomous school days (schulautonome Tage) are days a school may declare free on its own. Under section 2(5) of the School Hours Act the maximum depends on the weekday of 26 October: two if National Day falls on a Sunday, three on a Monday or Saturday, four otherwise. In the 2026/27 school year 26 October is a Monday, so the maximum is ${K.schulautonomMax(2026)}; in 2027/28 it is a Tuesday, giving ${K.schulautonomMax(2027)}. On top of that, every school has a fixed autumn break from 27 to 31 October. Each school decides which days: the school forum at compulsory schools, the school partnership committee at secondary schools. The education authority may add one more day in special cases. There is therefore no binding national list. The calculator shows the school days that sit between two days off and are the natural candidates; in Vienna in 2026/27 these include ${dLong(sj26.fenster[0].von, 'en')}, before the Immaculate Conception, and 7 and 8 January after the Christmas break. Ask your child's school which days it has adopted.`,
    faqs: [
      { q: 'How many autonomous school days are there in 2026/27?', a: `At most ${K.schulautonomMax(2026)}, because 26 October 2026 is a Monday. The education authority may also declare one more day free in special cases. In 2027/28 the maximum is ${K.schulautonomMax(2027)}. In 2025/26, when National Day fell on a Sunday, there were only two.` },
      { q: 'Who sets the autonomous school days?', a: 'The school forum at primary and lower secondary schools, the school partnership committee at secondary schools; the head teacher votes too. Each school decides for itself, so siblings at different schools may have different days off. Ask the school office or check the school\'s website for the dates adopted.' },
      { q: 'Which days are usually chosen?', a: `Mostly school days between a holiday and the weekend, the bridge days. In Vienna in 2026/27 the obvious candidates are ${dLong(sj26.fenster[0].von, 'en')}, 7 and 8 January, and the Fridays after Ascension Day and Corpus Christi. Only what your school has decided is binding.` },
      { q: 'What if a school has no autumn break?', a: 'The education authority may cancel the autumn break for individual schools. The Tuesdays after Easter and after Whitsun are then days off, and the school may give five autonomous days (section 2(5a) of the School Hours Act). Otherwise the autumn break from 27 to 31 October applies at every school.' },
    ],
    body: (h) => `<h2>The rule in the School Hours Act</h2>
<p>${h.src('schzg2', 'Section 2(5) of the School Hours Act')} ties the number to 26 October. On a Sunday at most two days are possible, on a Monday or Saturday three, on any other weekday four. For the next school years:</p>
${h.table(['School year', '26 October', 'Maximum'], [2025, 2026, 2027, 2028, 2029].map((y) => [`${y}/${String(y + 1).slice(2)}`, wdLong(`${y}-10-26`, 'en'), K.schulautonomMax(y)]), 'Maximum autonomous school days by the weekday of National Day', ['l', 'l', 'r'])}
<h2>Where autonomous days fit in 2026/27</h2>
${tabelleSchule(h, 2026, 'W')}
<p>The table is for Vienna; choose your province in the calculator above. Differences come from the patron saint's day and the semester break, which in 2027 starts on ${dLong(sem('W'), 'en')} in Lower Austria and Vienna, on ${dLong(sem('K'), 'en')} in Burgenland, Carinthia, Salzburg, Tyrol and Vorarlberg, and on ${dLong(sem('ST'), 'en')} in Upper Austria and Styria. At the joint request of a province and its education directorate the ministry can move that province's semester break by a week; your education directorate publishes the dates in force.</p>
<h2>Looking ahead to 2027/28</h2>
<p>Up to ${K.schulautonomMax(2027)} days are possible in 2027/28. The best value is ${span(best27.von, best27.bis, 'en')}: ${best27.tage === 1 ? 'one school day' : `${best27.tage} school days`} for ${best27.frei} days off in a row.</p>
${tabelleSchule(h, 2027, 'W')}
<p>Working parents who need to cover autonomous days will find matching bridge days in the ${h.a('home', 'bridge-day planner')}; the patron saint's day is explained on ${h.a('landesfeiertage', 'provincial holidays')}.</p>
${h.mini('sa', { p: ['land'], d: { sj: 2027 }, c: 'Check the 2027/28 school year' })}`,
  },
});

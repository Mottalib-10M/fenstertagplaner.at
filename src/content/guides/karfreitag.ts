/** Karfreitag et persönlicher Feiertag (§ 7a ARG) : date, délai de trois mois, quel jour choisir. Dates : moteur. */
import { defineGuide } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';
import { dLong, dWeek } from '../../lib/tool-specs';

const kf = (y: number) => K.karfreitag(y);
const block = (iso: string) => {
  const hol = new Set([2026, 2027, 2028, 2029].flatMap((y) => K.feiertage(y)).map((f) => K.fromIso(f.date)));
  const free = (x: number) => K.isWeekend(x) || hol.has(x);
  let lo = K.fromIso(iso), hi = lo; while (free(lo - 1)) lo--; while (free(hi + 1)) hi++;
  return hi - lo + 1;
};
const ft27 = K.fenstertage(2027, 'W');

export default defineGuide({
  id: 'karfreitag', group: 'feiertage', order: 14, tool: 'pt', toolArg: { jahr: 2027 },
  related: ['urlaubsanspruch', 'ostern-2027', 'home', 'feiertage-2027'],
  sources: ['arg7a', 'arg33a', 'arg7', 'frg'],
  de: {
    slug: 'karfreitag-persoenlicher-feiertag', nav: 'Karfreitag und persönlicher Feiertag', card: 'Wunschtag nach § 7a ARG mit Meldefrist',
    title: 'Karfreitag 2027 frei? Persönlicher Feiertag und Meldefrist',
    description: 'Karfreitag ist in Österreich seit 2019 kein Feiertag. Mit dem persönlichen Feiertag nach § 7a ARG nehmen Sie ihn trotzdem frei: Meldefrist, Regeln und Rechner.',
    h1: 'Karfreitag und persönlicher Feiertag: bis wann Sie melden müssen',
    intro: 'Wählen Sie Jahr und Wunschtag: Der Rechner zeigt, bis wann Sie den persönlichen Feiertag schriftlich bekannt geben müssen und wie viele Tage Sie damit frei haben.',
    resume: `Der Karfreitag ist in Österreich seit 2019 kein Feiertag mehr. Bis dahin hatten nur Angehörige der evangelischen Kirchen A.B. und H.B., der Altkatholischen und der Evangelisch-methodistischen Kirche an diesem Tag frei; der Europäische Gerichtshof sah darin im Jänner 2019 eine Diskriminierung. Der Gesetzgeber hat die Sonderregel mit BGBl. I Nr. 22/2019 gestrichen und für alle Arbeitnehmerinnen und Arbeitnehmer den persönlichen Feiertag eingeführt, § 7a Arbeitsruhegesetz. Er ist kein zusätzlicher freier Tag: Sie bestimmen einmal pro Urlaubsjahr selbst, an welchem Tag Sie einen Ihrer Urlaubstage nehmen, ohne Zustimmung des Arbeitgebers. Dafür müssen Sie den Tag spätestens drei Monate vorher schriftlich bekannt geben. Für den Karfreitag 2027, den ${dLong(kf(2027), 'de')}, ist das der ${dLong(K.meldefrist(kf(2027)), 'de')}, ein Feiertag; sicherer ist eine Meldung vor Weihnachten. Bittet Sie der Arbeitgeber, doch zu arbeiten, dürfen Sie zustimmen: Dann behalten Sie den Urlaubstag und bekommen für diesen Tag das doppelte Entgelt, das Recht ist für das Jahr aber verbraucht. Der Tag muss nicht der Karfreitag sein; ein Fenstertag oder der Tag des Landespatrons funktioniert genauso.`,
    faqs: [
      { q: 'Ist der Karfreitag 2027 in Österreich ein Feiertag?', a: `Nein. Der ${dLong(kf(2027), 'de')} ist ein normaler Arbeitstag. Schulen haben dann allerdings schon Osterferien, die vom Samstag vor dem Palmsonntag bis Ostermontag dauern. Wer frei haben möchte, nimmt Urlaub oder den persönlichen Feiertag. Für Schulkinder ist der Tag damit ohnehin frei.` },
      { q: 'Bis wann muss ich den persönlichen Feiertag melden?', a: `Spätestens drei Monate vorher, schriftlich. Für den Karfreitag 2027 ist das der ${dLong(K.meldefrist(kf(2027)), 'de')}, für den Karfreitag 2028 der ${dLong(K.meldefrist(kf(2028)), 'de')}. Weil das Gesetz nur „spätestens drei Monate im Vorhinein“ sagt, empfiehlt sich ein Puffer von einigen Tagen und eine Bestätigung, etwa per E-Mail.` },
      { q: 'Kann der Arbeitgeber den persönlichen Feiertag ablehnen?', a: 'Nein, wenn Sie die Frist einhalten und noch Urlaub haben. Er darf Sie nur bitten, doch zu arbeiten. Sagen Sie ja, bekommen Sie für diesen Tag Urlaubsentgelt und Arbeitsentgelt, also doppelt, und behalten den Urlaubstag. Damit ist der persönliche Feiertag für dieses Urlaubsjahr verbraucht.' },
      { q: 'Muss es der Karfreitag sein?', a: `Nein, jeder Tag ist möglich. Am meisten bringt ein Fenstertag: 2027 etwa der ${dLong(ft27[0].urlaubVon, 'de')} nach Christi Himmelfahrt, der Ihnen vier freie Tage am Stück sichert, auch wenn viele Kolleginnen und Kollegen denselben Tag wollen. Die Frist von drei Monaten gilt für jeden gewählten Tag.` },
      { q: 'Gilt der persönliche Feiertag auch im öffentlichen Dienst?', a: 'Für Bundesbedienstete ja: § 1 Abs. 2 Feiertagsruhegesetz 1957 erklärt § 7a Arbeitsruhegesetz für sie sinngemäß anwendbar. Für Landes- und Gemeindebedienstete regeln das die Dienstrechte der Länder. Fragen Sie im Zweifel bei Ihrer Personalstelle nach, welche Regel für Ihr Dienstverhältnis gilt.' },
    ],
    body: (h) => `<h2>Karfreitag und Meldefrist 2027 bis 2029</h2>
${h.table(['Jahr', 'Karfreitag', 'Meldung spätestens', 'Frei am Stück mit 1 Tag'], [2027, 2028, 2029].map((y) => [String(y), dWeek(kf(y), 'de'), dLong(K.meldefrist(kf(y)), 'de'), `${block(kf(y))} Tage`]), 'Karfreitag als persönlicher Feiertag: Datum und Frist', ['l', 'l', 'l', 'r'])}
<p>Mit einem Urlaubstag am Karfreitag sind Sie vier Tage frei, von Karfreitag bis Ostermontag. Wer Schulkinder hat, nutzt ihn oft, weil die Osterferien dann ohnehin laufen.</p>
<h2>Was § 7a Arbeitsruhegesetz genau sagt</h2>
<p>Nach ${h.src('arg7a', '§ 7a Abs. 1 ARG')} kann der Arbeitnehmer den Zeitpunkt des Antritts eines Tages des ihm zustehenden Urlaubs einmal pro Urlaubsjahr einseitig bestimmen. Die Bekanntgabe muss spätestens drei Monate im Vorhinein schriftlich erfolgen. Abs. 2 regelt den Fall, dass der Arbeitgeber um Arbeit an diesem Tag bittet: Der Arbeitnehmer darf zustimmen und erhält dann das doppelte Entgelt, der Urlaubstag bleibt ihm. Die frühere Sonderregel für den Karfreitag in Kollektivverträgen ist nach ${h.src('arg33a', '§ 33a Abs. 28 ARG')} unwirksam.</p>
<h2>Den Tag klug wählen</h2>
<p>Der Rechner bietet neben dem Karfreitag die Fenstertage, den Landespatron und Heiligabend und Silvester an, wenn sie auf einen Werktag fallen. Am sichersten nutzen Sie den persönlichen Feiertag für einen Tag, an dem der Betrieb Urlaub sonst nur ungern genehmigt. Wie viele Urlaubstage Sie insgesamt haben, zeigt ${h.a('urlaubsanspruch', 'Urlaubsanspruch')}; die Osterdaten der nächsten Jahre stehen unter ${h.a('ostern-2027', 'Ostern 2027')}.</p>
${h.mini('bt', { p: ['urlaub'], d: { jahr: 2027, urlaub: 1 }, c: 'Den besten einzelnen Urlaubstag finden' })}`,
  },
  en: {
    slug: 'good-friday-personal-holiday', nav: 'Good Friday and personal holiday', card: 'Your chosen day under section 7a ARG, with deadline',
    title: 'Good Friday 2027 in Austria: personal holiday and deadline',
    description: 'Good Friday has not been a public holiday in Austria since 2019. The personal holiday under section 7a ARG lets you take it off: deadline, rules, calculator.',
    h1: 'Good Friday and the personal holiday in Austria: when to give notice',
    intro: 'Choose the year and the day you want: the calculator shows the date by which you must notify your employer in writing and how many days off you get.',
    resume: `Good Friday has not been a public holiday in Austria since 2019. Until then only members of the Protestant churches of the Augsburg and Helvetic confessions, the Old Catholic Church and the Methodist Church had the day off; in January 2019 the European Court of Justice found this discriminatory. Parliament removed the special rule with Federal Law Gazette I No. 22/2019 and created the personal holiday for all employees, section 7a of the Rest Periods Act. It is not an extra day off: once per leave year you decide on your own which day to take one of your leave days, without your employer's consent. You must give written notice at least three months ahead. For Good Friday 2027, ${dLong(kf(2027), 'en')}, the deadline is ${dLong(K.meldefrist(kf(2027)), 'en')}, itself a holiday, so notifying before Christmas is safer. If your employer asks you to work after all, you may agree: you keep the leave day and are paid double for that day, but the right is used up for the year. The day need not be Good Friday; a bridge day or your patron saint's day works just as well.`,
    faqs: [
      { q: 'Is Good Friday 2027 a public holiday in Austria?', a: `No. ${dLong(kf(2027), 'en')} is an ordinary working day. Schools are already on their Easter break, which runs from the Saturday before Palm Sunday to Easter Monday. If you want the day off, take leave or your personal holiday. For school children the day is off anyway.` },
      { q: 'By when must I give notice of my personal holiday?', a: `At least three months ahead, in writing. For Good Friday 2027 that is ${dLong(K.meldefrist(kf(2027)), 'en')}; for Good Friday 2028, ${dLong(K.meldefrist(kf(2028)), 'en')}. Because the act only says "at least three months in advance", leave a few days' margin and keep a confirmation, by email for example.` },
      { q: 'Can my employer refuse the personal holiday?', a: 'No, as long as you meet the deadline and have leave left. Your employer may only ask you to work after all. If you agree, you receive holiday pay plus pay for the work, double in total, and keep the leave day. The personal holiday is then used up for that leave year.' },
      { q: 'Does it have to be Good Friday?', a: `No, any day works. A bridge day gives the most: in 2027 for instance ${dLong(ft27[0].urlaubVon, 'en')}, after Ascension Day, which secures four days off in a row even if many colleagues want the same day. The three-month notice period applies whichever day you choose.` },
      { q: 'Does the personal holiday apply in the public sector?', a: 'For federal civil servants, yes: section 1(2) of the 1957 Public Holiday Rest Act applies section 7a of the Rest Periods Act to them. For provincial and municipal staff the provincial service codes decide. If in doubt, ask your HR office which rule applies to your post.' },
    ],
    body: (h) => `<h2>Good Friday and the notice deadline, 2027 to 2029</h2>
${h.table(['Year', 'Good Friday', 'Notify by', 'Off in a row with 1 day'], [2027, 2028, 2029].map((y) => [String(y), dWeek(kf(y), 'en'), dLong(K.meldefrist(kf(y)), 'en'), `${block(kf(y))} days`]), 'Good Friday as personal holiday: date and deadline', ['l', 'l', 'l', 'r'])}
<p>One leave day on Good Friday gives four days off, from Good Friday to Easter Monday. Parents of school children often use it, since the Easter break is under way.</p>
<h2>What section 7a of the Rest Periods Act says</h2>
<p>Under ${h.src('arg7a', 'section 7a(1) ARG')} an employee may unilaterally set the start of one day of their leave once per leave year. Written notice must be given at least three months in advance. Subsection 2 covers an employer who asks for work on that day: the employee may agree and is then paid double, keeping the leave day. The old Good Friday rule in collective agreements is void under ${h.src('arg33a', 'section 33a(28) ARG')}.</p>
<h2>Choosing the day well</h2>
<p>Besides Good Friday, the calculator offers the bridge days, the patron saint's day, Christmas Eve and New Year's Eve when they fall on a weekday. The personal holiday is best used for a day your employer would otherwise be reluctant to grant. Your total allowance is on ${h.a('urlaubsanspruch', 'leave entitlement')}; Easter dates for the coming years are on ${h.a('ostern-2027', 'Easter 2027')}.</p>
${h.mini('bt', { p: ['urlaub'], d: { jahr: 2027, urlaub: 1 }, c: 'Find the best single leave day' })}`,
  },
});

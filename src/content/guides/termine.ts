/** Termine : Ostern 2027, Pfingsten 2027, Zeitumstellung (ordonnances autrichiennes). Dates : moteur, sources RIS. */
import { defineGuide, type GuideDef } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';
import { dLong, dWeek, sommerzeit } from '../../lib/tool-specs';

const plus = (iso: string, x: number) => K.toIso(K.fromIso(iso) + x);
const os = (y: number) => K.ostersonntag(y);
const years = [2026, 2027, 2028, 2029, 2030];

/* ---------------------------------------------------------------- Ostern 2027 */
const ostern: GuideDef = defineGuide({
  id: 'ostern-2027', group: 'termine', order: 30, tool: 'os', toolArg: { jahr: 2027 },
  related: ['karfreitag', 'pfingsten-2027', 'feiertage-2027', 'home'],
  sources: ['ostern-ptb', 'arg7', 'schzg2'],
  countdown: { date: os(2027), label: { de: 'Ostersonntag 2027', en: 'Easter Sunday 2027' } },
  de: {
    slug: 'ostern-2027', nav: 'Ostern 2027', card: `Ostersonntag ${dLong(os(2027), 'de')}`,
    title: 'Ostern 2027: Ostersonntag 28. März, Osterferien, Feiertage',
    description: 'Ostern 2027 ist am 28. März. Ostermontag ist Feiertag, Karfreitag nicht. Osterferien der Schulen, alle Ostertermine bis 2060 und die Osterformel erklärt.',
    h1: 'Ostern 2027: Sonntag, 28. März',
    intro: 'Ostersonntag, Ostermontag und die Osterferien 2027 in Österreich, dazu jedes Osterdatum von 2000 bis 2060, berechnet mit der Gaußschen Osterformel.',
    resume: `Ostersonntag ist 2027 der ${dLong(os(2027), 'de')}, ein frühes Osterdatum; frühestmöglich wäre der 22. März. Gesetzlicher Feiertag in Österreich ist der Ostermontag, ${dLong(plus(os(2027), 1), 'de')}. Der Karfreitag, ${dLong(plus(os(2027), -2), 'de')}, ist seit 2019 ein normaler Arbeitstag; wer frei haben will, nimmt Urlaub oder den persönlichen Feiertag. Die Osterferien der Schulen dauern nach dem Schulzeitgesetz vom Samstag vor dem Palmsonntag bis Ostermontag, 2027 also vom ${dLong(plus(os(2027), -8), 'de')} bis ${dLong(plus(os(2027), 1), 'de')}. Ostern ist der erste Sonntag nach dem ersten Frühlingsvollmond; der Vollmond wird dabei nicht astronomisch beobachtet, sondern nach einer festen Tabelle bestimmt, die Carl Friedrich Gauß 1800 in eine Formel gefasst hat. Vom Ostersonntag hängen weitere Feiertage ab: Christi Himmelfahrt 39 Tage später am ${dLong(plus(os(2027), 39), 'de')}, Pfingstmontag am ${dLong(plus(os(2027), 50), 'de')} und Fronleichnam am ${dLong(plus(os(2027), 60), 'de')}. 2028 ist Ostern deutlich später, am ${dLong(os(2028), 'de')}.`,
    faqs: [
      { q: 'Wann ist Ostern 2027?', a: `Ostersonntag ist der ${dLong(os(2027), 'de')}, Ostermontag der ${dLong(plus(os(2027), 1), 'de')}. Karfreitag fällt auf den ${dLong(plus(os(2027), -2), 'de')} und ist in Österreich kein Feiertag. Von Ostern hängen auch Christi Himmelfahrt am 6. Mai, Pfingstmontag am 17. Mai und Fronleichnam am 27. Mai 2027 ab.` },
      { q: 'Wann sind die Osterferien 2027?', a: `Vom Samstag, ${dLong(plus(os(2027), -8), 'de')}, bis Ostermontag, ${dLong(plus(os(2027), 1), 'de')}, in allen Bundesländern gleich. Das Schulzeitgesetz legt das so fest; die Länder übernehmen es in ihren Schulgesetzen. Karfreitag, der 26. März, liegt damit in den Ferien, ist für Eltern aber ein normaler Arbeitstag.` },
      { q: 'Wann ist Ostern 2028?', a: `Am ${dLong(os(2028), 'de')}, gut zweieinhalb Wochen später als 2027. Ostermontag ist dann der ${dLong(plus(os(2028), 1), 'de')}. Christi Himmelfahrt fällt 2028 auf den 25. Mai, Pfingstmontag auf den 5. Juni und Fronleichnam auf den 15. Juni. Die Osterferien beginnen am Samstag, 8. April 2028.` },
      { q: 'Warum fällt Ostern jedes Jahr auf ein anderes Datum?', a: 'Weil es sich nach dem Mond richtet: Ostersonntag ist der erste Sonntag nach dem ersten Vollmond ab Frühlingsbeginn am 21. März. So kann Ostern zwischen dem 22. März und dem 25. April liegen. Die Gaußsche Osterformel rechnet das Datum ohne Mondbeobachtung aus.' },
    ],
    body: (h) => `<h2>Ostertermine 2026 bis 2030</h2>
${h.table(['Jahr', 'Palmsonntag', 'Ostersonntag', 'Ostermontag', 'Osterferien ab'], years.map((y) => [String(y), dLong(plus(os(y), -7), 'de'), dLong(os(y), 'de'), dLong(plus(os(y), 1), 'de'), dLong(plus(os(y), -8), 'de')]), 'Ostern und Osterferien in Österreich, 2026 bis 2030')}
<p>Gerechnet mit der ${h.src('ostern-ptb', 'Gaußschen Osterformel in der Fassung der Physikalisch-Technischen Bundesanstalt')}; zur Kontrolle prüfen wir jedes Jahr von 1600 bis 2600 mit einem zweiten, unabhängigen Verfahren (Meeus). Der Rechner oben zeigt jeden Rechenschritt.</p>
<h2>Ostern und Urlaub</h2>
<p>Weil der Karfreitag kein Feiertag ist, bringt Ostern in Österreich nur ein verlängertes Wochenende bis Ostermontag. Mit vier Urlaubstagen in der Woche danach, ${dLong(plus(os(2027), 2), 'de')} bis ${dLong(plus(os(2027), 5), 'de')}, sind Sie neun Tage frei. Den Karfreitag selbst können Sie als ${h.a('karfreitag', 'persönlichen Feiertag')} festlegen; die Meldefrist dafür endet drei Monate vorher.</p>
${h.mini('bt', { p: ['urlaub'], d: { jahr: 2027, urlaub: 4 }, c: 'Osterurlaub 2027 planen' })}
<p>Die Osterferien regelt ${h.src('schzg2', '§ 2 Abs. 4 Z 6 Schulzeitgesetz')}. Pfingsten folgt sieben Wochen nach Ostern; die Termine stehen unter ${h.a('pfingsten-2027', 'Pfingsten 2027')}.</p>`,
  },
  en: {
    slug: 'easter-2027', nav: 'Easter 2027', card: `Easter Sunday ${dLong(os(2027), 'en')}`,
    title: 'Easter 2027 in Austria: Sunday 28 March, school break',
    description: 'Easter 2027 falls on 28 March. In Austria Easter Monday is a public holiday, Good Friday is not. School Easter break, Easter dates to 2060 and the formula.',
    h1: 'Easter 2027 in Austria: Sunday 28 March',
    intro: "Easter Sunday, Easter Monday and the 2027 school Easter break in Austria, plus every Easter date from 2000 to 2060, computed with Gauss's Easter formula.",
    resume: `Easter Sunday 2027 is ${dLong(os(2027), 'en')}, an early date; the earliest possible is 22 March. In Austria the public holiday is Easter Monday, ${dLong(plus(os(2027), 1), 'en')}. Good Friday, ${dLong(plus(os(2027), -2), 'en')}, has been an ordinary working day since 2019; to get it off you take leave or your personal holiday. Under the School Hours Act the school Easter break runs from the Saturday before Palm Sunday to Easter Monday, so from ${dLong(plus(os(2027), -8), 'en')} to ${dLong(plus(os(2027), 1), 'en')} in 2027. Easter is the first Sunday after the first full moon of spring; the full moon is not observed but taken from a fixed table, which Carl Friedrich Gauss turned into a formula in 1800. Other holidays follow from Easter Sunday: Ascension Day 39 days later on ${dLong(plus(os(2027), 39), 'en')}, Whit Monday on ${dLong(plus(os(2027), 50), 'en')} and Corpus Christi on ${dLong(plus(os(2027), 60), 'en')}. In 2028 Easter is much later, on ${dLong(os(2028), 'en')}.`,
    faqs: [
      { q: 'When is Easter 2027?', a: `Easter Sunday is ${dLong(os(2027), 'en')} and Easter Monday ${dLong(plus(os(2027), 1), 'en')}. Good Friday falls on ${dLong(plus(os(2027), -2), 'en')} and is not a public holiday in Austria. Ascension Day on 6 May, Whit Monday on 17 May and Corpus Christi on 27 May 2027 all depend on Easter too.` },
      { q: 'When is the 2027 school Easter break in Austria?', a: `From Saturday ${dLong(plus(os(2027), -8), 'en')} to Easter Monday, ${dLong(plus(os(2027), 1), 'en')}, the same in every province. The School Hours Act sets it, and the provinces repeat it in their school acts. Good Friday, 26 March, therefore falls in the break but is an ordinary working day for parents.` },
      { q: 'When is Easter 2028?', a: `On ${dLong(os(2028), 'en')}, about two and a half weeks later than in 2027. Easter Monday is then ${dLong(plus(os(2028), 1), 'en')}. In 2028 Ascension Day falls on 25 May, Whit Monday on 5 June and Corpus Christi on 15 June. The Easter break starts on Saturday 8 April 2028.` },
      { q: 'Why does Easter move every year?', a: 'Because it follows the moon: Easter Sunday is the first Sunday after the first full moon on or after the start of spring on 21 March. Easter can therefore fall between 22 March and 25 April. Gauss\'s formula computes the date without observing the moon.' },
    ],
    body: (h) => `<h2>Easter dates 2026 to 2030</h2>
${h.table(['Year', 'Palm Sunday', 'Easter Sunday', 'Easter Monday', 'School break from'], years.map((y) => [String(y), dLong(plus(os(y), -7), 'en'), dLong(os(y), 'en'), dLong(plus(os(y), 1), 'en'), dLong(plus(os(y), -8), 'en')]), 'Easter and school Easter break in Austria, 2026 to 2030')}
<p>Computed with ${h.src('ostern-ptb', "Gauss's Easter formula as published by Germany's metrology institute PTB")}; as a check, every year from 1600 to 2600 is verified against a second, independent method (Meeus). The calculator above shows every step.</p>
<h2>Easter and leave</h2>
<p>Because Good Friday is not a holiday, Easter in Austria only gives a long weekend up to Easter Monday. Four leave days in the following week, ${dLong(plus(os(2027), 2), 'en')} to ${dLong(plus(os(2027), 5), 'en')}, give nine days off. You can fix Good Friday itself as your ${h.a('karfreitag', 'personal holiday')}; notice must be given three months ahead.</p>
${h.mini('bt', { p: ['urlaub'], d: { jahr: 2027, urlaub: 4 }, c: 'Plan Easter leave 2027' })}
<p>The Easter school break is set by ${h.src('schzg2', 'section 2(4)(6) of the School Hours Act')}. Whitsun follows seven weeks after Easter; the dates are on ${h.a('pfingsten-2027', 'Whitsun 2027')}.</p>`,
  },
});

/* ---------------------------------------------------------------- Pfingsten 2027 */
const pfingsten: GuideDef = defineGuide({
  id: 'pfingsten-2027', group: 'termine', order: 31, tool: 'pf', toolArg: { jahr: 2027 },
  related: ['ostern-2027', 'feiertage-2027', 'home', 'kalender-2027'],
  sources: ['arg7', 'schzg2', 'ostern-ptb'],
  de: {
    slug: 'pfingsten-2027', nav: 'Pfingsten 2027', card: `Pfingstmontag ${dLong(plus(os(2027), 50), 'de')}`,
    title: 'Pfingsten 2027: Pfingstmontag am 17. Mai, Pfingstferien',
    description: 'Pfingsten 2027 in Österreich: Pfingstmontag am 17. Mai ist Feiertag. Pfingstferien der Schulen und die Brücken zwischen Christi Himmelfahrt und Fronleichnam.',
    h1: 'Pfingsten 2027: Pfingstmontag, 17. Mai',
    intro: 'Pfingstsonntag, Pfingstmontag und die Pfingstferien 2027, dazu die Pfingsttermine der nächsten Jahre und die Fenstertage im Mai.',
    resume: `Pfingstsonntag ist 2027 der ${dLong(plus(os(2027), 49), 'de')}, sieben Wochen nach Ostern. Gesetzlicher Feiertag in ganz Österreich ist der Pfingstmontag, ${dLong(plus(os(2027), 50), 'de')}. Die Pfingstferien der Schulen dauern nach dem Schulzeitgesetz vom Samstag vor Pfingsten bis Pfingstmontag, also vom ${dLong(plus(os(2027), 48), 'de')} bis ${dLong(plus(os(2027), 50), 'de')}; mehr als ein langes Wochenende ist das nicht. Der Mai 2027 ist trotzdem einer der besten Monate des Jahres für Kurzurlaub. Christi Himmelfahrt fällt auf Donnerstag, ${dLong(plus(os(2027), 39), 'de')}, Fronleichnam auf Donnerstag, ${dLong(plus(os(2027), 60), 'de')}; beide haben einen Fenstertag am Freitag. Dazwischen liegt Pfingstmontag. Wer die Tage zwischen den Feiertagen klug wählt, ist mit wenigen Urlaubstagen mehrere lange Wochenenden hintereinander frei. Mit vier Urlaubstagen von Dienstag bis Freitag nach Pfingstmontag kommen neun freie Tage zusammen. 2028 fällt Pfingstmontag auf den ${dLong(plus(os(2028), 50), 'de')}, Fronleichnam auf den ${dLong(plus(os(2028), 60), 'de')}.`,
    faqs: [
      { q: 'Wann ist Pfingsten 2027?', a: `Pfingstsonntag ist der ${dLong(plus(os(2027), 49), 'de')}, Pfingstmontag der ${dLong(plus(os(2027), 50), 'de')}. Pfingstmontag ist in Österreich gesetzlicher Feiertag. Pfingstsonntag liegt immer 49 Tage nach Ostersonntag; 2027 kommt Pfingsten früh, weil Ostern schon am 28. März ist. 2028 ist Pfingstmontag erst am 5. Juni.` },
      { q: 'Gibt es Pfingstferien in Österreich?', a: `Ja, aber nur kurz: vom Samstag vor Pfingsten bis Pfingstmontag, 2027 vom ${dLong(plus(os(2027), 48), 'de')} bis ${dLong(plus(os(2027), 50), 'de')}. Der Dienstag nach Pfingsten ist nur an Schulen frei, an denen die Schulbehörde die Herbstferien gestrichen hat. In allen Bundesländern gilt dieselbe Regel.` },
      { q: 'Welche Fenstertage gibt es rund um Pfingsten 2027?', a: `Die Freitage nach Christi Himmelfahrt (${dLong(plus(os(2027), 40), 'de')}) und nach Fronleichnam (${dLong(plus(os(2027), 61), 'de')}). Zusammen mit Pfingstmontag ergibt das drei lange Wochenenden innerhalb von drei Wochen. Ein Urlaubstag an jedem der beiden Freitage ergibt jeweils vier freie Tage am Stück; für Schulen bieten sich beide Tage als schulautonome Tage an.` },
    ],
    body: (h) => `<h2>Pfingsten 2026 bis 2030</h2>
${h.table(['Jahr', 'Christi Himmelfahrt', 'Pfingstmontag', 'Fronleichnam'], years.map((y) => [String(y), dLong(plus(os(y), 39), 'de'), dLong(plus(os(y), 50), 'de'), dLong(plus(os(y), 60), 'de')]), 'Die beweglichen Feiertage nach Ostern, 2026 bis 2030')}
<p>Alle drei sind gesetzliche Feiertage nach ${h.src('arg7', '§ 7 Arbeitsruhegesetz')}. Sie folgen dem Ostersonntag im Abstand von 39, 50 und 60 Tagen und fallen deshalb immer auf Donnerstag, Montag und Donnerstag.</p>
<h2>Der Mai 2027 als Brückenmonat</h2>
<p>Ein Urlaubstag am ${dWeek(plus(os(2027), 40), 'de')} und einer am ${dWeek(plus(os(2027), 61), 'de')} ergeben zwei verlängerte Wochenenden zu je vier Tagen. Wer die vier Tage nach Pfingstmontag dazunimmt, kommt mit sechs Urlaubstagen auf drei Blöcke. Der ${h.a('home', 'Fenstertage-Planer')} zeigt die beste Verteilung für Ihre Zahl an Urlaubstagen.</p>
${h.mini('bt', { p: ['urlaub'], d: { jahr: 2027, urlaub: 6 }, c: 'Mai 2027 durchrechnen' })}
<p>Die Pfingstferien der Schulen regelt ${h.src('schzg2', '§ 2 Abs. 4 Z 7 Schulzeitgesetz')}.</p>`,
  },
  en: {
    slug: 'whitsun-2027', nav: 'Whitsun 2027', card: `Whit Monday ${dLong(plus(os(2027), 50), 'en')}`,
    title: 'Whitsun 2027 in Austria: Whit Monday 17 May, school break',
    description: 'Whitsun 2027 in Austria: Whit Monday on 17 May is a public holiday. The school Whitsun break and the bridges between Ascension Day and Corpus Christi.',
    h1: 'Whitsun 2027 in Austria: Whit Monday 17 May',
    intro: 'Whit Sunday, Whit Monday and the 2027 school Whitsun break in Austria, the dates for the coming years and the May bridge days.',
    resume: `Whit Sunday (Pentecost) 2027 is ${dLong(plus(os(2027), 49), 'en')}, seven weeks after Easter. The public holiday across Austria is Whit Monday, ${dLong(plus(os(2027), 50), 'en')}. Under the School Hours Act the school Whitsun break runs from the Saturday before Whitsun to Whit Monday, so from ${dLong(plus(os(2027), 48), 'en')} to ${dLong(plus(os(2027), 50), 'en')}; it is just a long weekend. May 2027 is still one of the best months of the year for short breaks. Ascension Day falls on Thursday ${dLong(plus(os(2027), 39), 'en')} and Corpus Christi on Thursday ${dLong(plus(os(2027), 60), 'en')}, each with a bridge day on the Friday. Whit Monday sits in between. Choosing the days between the holidays well gives several long weekends in a row for very little leave. Four leave days from the Tuesday to the Friday after Whit Monday give nine days off. In 2028 Whit Monday falls on ${dLong(plus(os(2028), 50), 'en')} and Corpus Christi on ${dLong(plus(os(2028), 60), 'en')}.`,
    faqs: [
      { q: 'When is Whitsun 2027?', a: `Whit Sunday is ${dLong(plus(os(2027), 49), 'en')} and Whit Monday ${dLong(plus(os(2027), 50), 'en')}. Whit Monday is a public holiday in Austria. Whit Sunday is always 49 days after Easter Sunday; it comes early in 2027 because Easter is on 28 March. In 2028 Whit Monday is not until 5 June.` },
      { q: 'Is there a Whitsun school break in Austria?', a: `Yes, a short one: from the Saturday before Whitsun to Whit Monday, ${dLong(plus(os(2027), 48), 'en')} to ${dLong(plus(os(2027), 50), 'en')} in 2027. The Tuesday after Whitsun is only off at schools where the authority has cancelled the autumn break. The same rule applies in every province.` },
      { q: 'Which bridge days are there around Whitsun 2027?', a: `The Fridays after Ascension Day (${dLong(plus(os(2027), 40), 'en')}) and after Corpus Christi (${dLong(plus(os(2027), 61), 'en')}). With Whit Monday that makes three long weekends within three weeks. One leave day on each of the two Fridays gives four days off in a row each time; for schools, both are natural autonomous days.` },
    ],
    body: (h) => `<h2>Whitsun 2026 to 2030</h2>
${h.table(['Year', 'Ascension Day', 'Whit Monday', 'Corpus Christi'], years.map((y) => [String(y), dLong(plus(os(y), 39), 'en'), dLong(plus(os(y), 50), 'en'), dLong(plus(os(y), 60), 'en')]), 'The movable holidays after Easter, 2026 to 2030')}
<p>All three are statutory holidays under ${h.src('arg7', 'section 7 of the Rest Periods Act')}. They follow Easter Sunday by 39, 50 and 60 days, so they always fall on a Thursday, a Monday and a Thursday.</p>
<h2>May 2027 as a bridge month</h2>
<p>One leave day on ${dWeek(plus(os(2027), 40), 'en')} and one on ${dWeek(plus(os(2027), 61), 'en')} give two four-day weekends. Adding the four days after Whit Monday makes three breaks for six leave days. The ${h.a('home', 'bridge-day planner')} shows the best spread for your number of leave days.</p>
${h.mini('bt', { p: ['urlaub'], d: { jahr: 2027, urlaub: 6 }, c: 'Work through May 2027' })}
<p>The school Whitsun break is set by ${h.src('schzg2', 'section 2(4)(7) of the School Hours Act')}.</p>`,
  },
});

/* ---------------------------------------------------------------- Zeitumstellung */
const z26 = sommerzeit(2026), z27 = sommerzeit(2027), z28 = sommerzeit(2028);
const zeit: GuideDef = defineGuide({
  id: 'zeitumstellung', group: 'termine', order: 32, tool: 'zu', toolArg: { jahr: 2027 },
  related: ['naechster-feiertag', 'ostern-2027', 'kalender-2027', 'feiertage-2027'],
  sources: ['sz2226', 'sz2731', 'zzg', 'eu-sommerzeit'],
  countdown: { date: z27.beginn, time: '02:00', label: { de: 'Beginn der Sommerzeit 2027', en: 'start of summer time 2027' } },
  de: {
    slug: 'zeitumstellung', nav: 'Zeitumstellung', card: `Nächste Umstellung: ${dLong(z27.beginn, 'de')}`,
    title: 'Zeitumstellung 2026 und 2027 in Österreich: alle Termine',
    description: 'Zeitumstellung in Österreich: Am 25. Oktober 2026 endete die Sommerzeit, am 28. März 2027 werden die Uhren vorgestellt. Alle Termine bis 2031 laut Verordnung.',
    h1: 'Zeitumstellung in Österreich: 2026, 2027 und die Jahre danach',
    intro: 'Wann die Uhren vor- und zurückgestellt werden, nach den Verordnungen der Bundesregierung, mit Countdown bis zur nächsten Umstellung.',
    resume: `Die Sommerzeit 2026 endete in Österreich am ${dWeek(z26.ende, 'de')}, um 3 Uhr MESZ; die Uhren wurden auf 2 Uhr zurückgestellt. Die nächste Umstellung ist am ${dWeek(z27.beginn, 'de')}: Um 2 Uhr MEZ springen die Uhren auf 3 Uhr, die Nacht ist eine Stunde kürzer. Zurück zur Normalzeit geht es am ${dWeek(z27.ende, 'de')}. Die Termine sind nicht nur Brauch, sondern stehen im Bundesgesetzblatt: Die Bundesregierung legt sie nach dem Zeitzählungsgesetz durch Verordnung fest, jeweils für fünf Jahre. Für 2022 bis 2026 gilt BGBl. II Nr. 58/2022, für 2027 bis 2031 BGBl. II Nr. 282/2026. Inhaltlich folgen beide der EU-Richtlinie 2000/84/EG: Beginn am letzten Sonntag im März, Ende am letzten Sonntag im Oktober. Das Zeitzählungsgesetz regelt auch die doppelte Stunde im Herbst: Die Stunde von 2 bis 3 Uhr wird zweimal gezählt, zuerst als 2A, dann als 2B. Die Abschaffung der Zeitumstellung, die das Europäische Parlament 2019 befürwortet hat, ist bisher nicht umgesetzt; bis 2031 ist die Umstellung in Österreich verordnet.`,
    faqs: [
      { q: 'Wann ist die nächste Zeitumstellung?', a: `Am ${dWeek(z27.beginn, 'de')}. Um 2 Uhr werden die Uhren auf 3 Uhr vorgestellt. Die Sommerzeit endet dann am ${dWeek(z27.ende, 'de')}. Die Nacht ist damit eine Stunde kürzer. Im Herbst werden die Uhren um 3 Uhr auf 2 Uhr zurückgestellt.` },
      { q: 'Wann war die Zeitumstellung 2026?', a: `Die Sommerzeit begann am ${dLong(z26.beginn, 'de')} und endete am ${dLong(z26.ende, 'de')}, jeweils in der Nacht von Samstag auf Sonntag. Festgelegt war das in der Verordnung BGBl. II Nr. 58/2022. Für 2027 bis 2031 gilt die neue Verordnung BGBl. II Nr. 282/2026.` },
      { q: 'Wird die Zeitumstellung abgeschafft?', a: 'Nicht in absehbarer Zeit. Die österreichische Verordnung legt die Sommerzeit bereits bis einschließlich 2031 fest. Eine EU-weite Abschaffung wurde 2019 vom Europäischen Parlament unterstützt, die Mitgliedstaaten haben sich aber nicht geeinigt. Ohne gemeinsamen Beschluss bleibt es bei der einheitlichen Umstellung am letzten Sonntag im März und im Oktober.' },
      { q: 'Werden die Uhren vor oder zurück gestellt?', a: 'Im Frühjahr vor (von 2 auf 3 Uhr), im Herbst zurück (von 3 auf 2 Uhr). Eine Merkhilfe: Im Frühling stellt man die Gartenmöbel vor das Haus, im Herbst wieder zurück. Smartphones stellen sich selbst um; Backofen- oder Autouhren müssen Sie von Hand korrigieren.' },
    ],
    body: (h) => `<h2>Termine der Zeitumstellung bis 2031</h2>
${h.table(['Jahr', 'Uhr vor (2 → 3 Uhr)', 'Uhr zurück (3 → 2 Uhr)', 'Verordnung'], [2026, 2027, 2028, 2029, 2030, 2031].map((y) => { const z = sommerzeit(y); return [String(y), dLong(z.beginn, 'de'), dLong(z.ende, 'de'), y <= 2026 ? 'BGBl. II Nr. 58/2022' : 'BGBl. II Nr. 282/2026']; }), 'Beginn und Ende der Sommerzeit in Österreich, laut Verordnung')}
<p>Quellen: ${h.src('sz2226', 'Verordnung für 2022 bis 2026')} und ${h.src('sz2731', 'Verordnung für 2027 bis 2031')}, beide im RIS. Unser Rechner bestimmt die Termine zusätzlich nach der Regel „letzter Sonntag im März bzw. Oktober“ und prüft sie gegen die Verordnungen; für die Jahre bis 2031 stimmen beide überein.</p>
<h2>Was das Gesetz regelt</h2>
<p>Das ${h.src('zzg', 'Zeitzählungsgesetz')} bestimmt die Mitteleuropäische Zeit als Normalzeit und ermächtigt die Bundesregierung, die Sommerzeit zwischen 1. März und 31. Oktober festzulegen; Beginn und Ende müssen auf einen Samstag oder Sonntag fallen. Im Herbst wird die letzte Stunde doppelt gezählt, als 2A und 2B. Der europäische Rahmen ist die ${h.src('eu-sommerzeit', 'Richtlinie 2000/84/EG')}.</p>
<p>${z28.beginn.slice(0, 4)} beginnt die Sommerzeit am ${dLong(z28.beginn, 'de')}, drei Wochen vor Ostern. Wer Termine über die Umstellung hinweg plant, findet die Kalenderwochen im ${h.a('kalender-2027', 'Kalender 2027')}.</p>
${h.mini('zu', { p: ['jahr'], d: { jahr: 2028 }, c: 'Andere Jahre nachsehen' })}`,
  },
  en: {
    slug: 'clock-change', nav: 'Clock change', card: `Next change: ${dLong(z27.beginn, 'en')}`,
    title: 'Clock change Austria 2026 and 2027: every date to 2031',
    description: 'Clocks in Austria: summer time ended on 25 October 2026, and clocks go forward on 28 March 2027. Every date to 2031, as set by ordinance in the Law Gazette.',
    h1: 'Clock changes in Austria: 2026, 2027 and the years after',
    intro: "When the clocks go forward and back in Austria, under the federal government's ordinances, with a countdown to the next change.",
    resume: `Summer time 2026 ended in Austria on ${dWeek(z26.ende, 'en')}, at 3:00 summer time, when clocks went back to 2:00. The next change is on ${dWeek(z27.beginn, 'en')}: at 2:00 Central European Time the clocks jump to 3:00, and the night is an hour shorter. Standard time returns on ${dWeek(z27.ende, 'en')}. These dates are not just custom; they are in the Federal Law Gazette. Under the Time Reckoning Act the federal government sets them by ordinance, five years at a time. Federal Law Gazette II No. 58/2022 covers 2022 to 2026, and No. 282/2026 covers 2027 to 2031. Both follow EU Directive 2000/84/EC: summer time starts on the last Sunday in March and ends on the last Sunday in October. The Time Reckoning Act also settles the repeated hour in autumn: the hour from 2:00 to 3:00 is counted twice, first as 2A, then as 2B. Abolishing the clock change, which the European Parliament backed in 2019, has not happened; in Austria the change is set by ordinance up to 2031.`,
    faqs: [
      { q: 'When is the next clock change in Austria?', a: `On ${dWeek(z27.beginn, 'en')}. At 2:00 the clocks go forward to 3:00. Summer time then ends on ${dWeek(z27.ende, 'en')}. That night is an hour shorter. In autumn the clocks go back from 3:00 to 2:00. Clocks on ovens and in cars need setting by hand.` },
      { q: 'When did the clocks change in 2026?', a: `Summer time began on ${dLong(z26.beginn, 'en')} and ended on ${dLong(z26.ende, 'en')}, both in the night from Saturday to Sunday, as set by ordinance Federal Law Gazette II No. 58/2022. For 2027 to 2031 the new ordinance, Federal Law Gazette II No. 282/2026, applies.` },
      { q: 'Is the clock change being abolished?', a: 'Not in the foreseeable future. The Austrian ordinance already sets summer time up to and including 2031. The European Parliament supported EU-wide abolition in 2019, but the member states have not agreed. Without a joint decision, clocks keep changing on the last Sunday of March and October.' },
      { q: 'Do the clocks go forward or back?', a: 'Forward in spring (from 2:00 to 3:00), back in autumn (from 3:00 to 2:00). The English mnemonic: spring forward, fall back. Phones change by themselves; clocks on ovens or in cars need to be set by hand. The ordinance sets 2:00 as the switching time in spring.' },
    ],
    body: (h) => `<h2>Clock change dates up to 2031</h2>
${h.table(['Year', 'Forward (2:00 → 3:00)', 'Back (3:00 → 2:00)', 'Ordinance'], [2026, 2027, 2028, 2029, 2030, 2031].map((y) => { const z = sommerzeit(y); return [String(y), dLong(z.beginn, 'en'), dLong(z.ende, 'en'), y <= 2026 ? 'BGBl. II No. 58/2022' : 'BGBl. II No. 282/2026']; }), 'Start and end of summer time in Austria, by ordinance')}
<p>Sources: ${h.src('sz2226', 'ordinance for 2022 to 2026')} and ${h.src('sz2731', 'ordinance for 2027 to 2031')}, both on RIS. Our calculator also derives the dates from the "last Sunday in March or October" rule and checks them against the ordinances; for every year up to 2031 the two agree.</p>
<h2>What the law says</h2>
<p>The ${h.src('zzg', 'Time Reckoning Act')} makes Central European Time the standard time and empowers the federal government to set summer time between 1 March and 31 October; start and end must fall on a Saturday or Sunday. In autumn the last hour is counted twice, as 2A and 2B. The European framework is ${h.src('eu-sommerzeit', 'Directive 2000/84/EC')}.</p>
<p>In ${z28.beginn.slice(0, 4)} summer time starts on ${dLong(z28.beginn, 'en')}, three weeks before Easter. If you schedule across the change, the week numbers are in the ${h.a('kalender-2027', 'calendar 2027')}.</p>
${h.mini('zu', { p: ['jahr'], d: { jahr: 2028 }, c: 'Look up other years' })}`,
  },
});

export default [ostern, pfingsten, zeit];

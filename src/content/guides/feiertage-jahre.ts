/** Feiertage 2026, 2027 und 2028 in Österreich : les 13 jours fériés (§ 7 ARG), les Landespatrone, ce qui tombe le week-end. */
import { defineGuide, type GuideDef } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';
import { tabelleJahr, tabellePatrone } from '../../lib/bausteine';
import { dLong, wdLong } from '../../lib/tool-specs';

const list = (xs: string[], l: 'de' | 'en') => xs.join(', ').replace(/, ([^,]*)$/, l === 'de' ? ' und $1' : ' and $1');
const we = (y: number) => K.feiertage(y).filter((f) => K.isWeekend(K.fromIso(f.date)));
const wk = (y: number) => K.feiertage(y).length - we(y).length;
const d = (id: string, y: number) => K.feiertage(y).find((f) => f.id === id)!.date;
const at = (y: number) => K.arbeitstage(y, 'W').reduce((a, b) => a + b, 0);
const ftN = (y: number) => K.fenstertage(y, 'W').length;
const wd = (id: string, y: number, l: 'de' | 'en') => wdLong(d(id, y), l);

/* ---------------------------------------------------------------- 2026 */
const g2026: GuideDef = defineGuide({
  id: 'feiertage-2026', group: 'feiertage', order: 10, tool: 'ft', toolArg: { jahr: 2026, lp: 'frei' },
  related: ['feiertage-2027', 'fenstertage-2026', 'naechster-feiertag', 'landesfeiertage'],
  sources: ['arg7', 'frg', 'arg13a', 'nationalfeiertag', 'schzg2'],
  countdown: { date: '2026-12-08', label: { de: 'Mariä Empfängnis', en: 'the Immaculate Conception' } },
  de: {
    slug: 'feiertage-2026', nav: 'Feiertage 2026', card: `${wk(2026)} Feiertage an Werktagen, ${ftN(2026)} Fenstertage`,
    title: 'Feiertage Österreich 2026: alle 13 Termine mit Wochentag',
    description: 'Feiertage in Österreich 2026: alle 13 gesetzlichen Feiertage mit Datum und Wochentag, die Landespatrone der neun Länder und die Fenstertage bis Jahresende.',
    h1: 'Feiertage in Österreich 2026',
    intro: 'Die 13 gesetzlichen Feiertage 2026 mit Wochentag, dazu die Landespatrone Ihres Bundeslandes und die Arbeitstage. Bis Jahresende folgen noch Mariä Empfängnis, Christtag und Stefanitag.',
    resume: `Österreich hat 2026 dreizehn gesetzliche Feiertage. Sie stehen in § 7 Abs. 2 des Arbeitsruhegesetzes und gleichlautend im Feiertagsruhegesetz 1957 und gelten in allen neun Bundesländern: Neujahr, Heilige Drei Könige, Ostermontag am ${dLong(d('ostermontag', 2026), 'de')}, Staatsfeiertag am 1. Mai, Christi Himmelfahrt am ${dLong(d('himmelfahrt', 2026), 'de')}, Pfingstmontag am ${dLong(d('pfingstmontag', 2026), 'de')}, Fronleichnam am ${dLong(d('fronleichnam', 2026), 'de')}, Mariä Himmelfahrt, Nationalfeiertag, Allerheiligen, Mariä Empfängnis, Christtag und Stefanitag. ${wk(2026)} davon fallen 2026 auf Montag bis Freitag; am Wochenende liegen ${list(we(2026).map((f) => f.name.de), 'de')}, und nachgeholt wird kein Feiertag. Bis Jahresende stehen noch drei Feiertage aus: Mariä Empfängnis am Dienstag, Christtag am Freitag und Stefanitag am Samstag. Der Montag, 7. Dezember, ist der letzte Fenstertag des Jahres. Wien hat 2026 ${at(2026)} Arbeitstage. Dazu kommt in jedem Bundesland der Tag des Landespatrons, der schulfrei ist, aber kein gesetzlicher Feiertag.`,
    faqs: [
      { q: 'Welche Feiertage gibt es 2026 in Österreich noch?', a: 'Nach Ende Oktober noch drei: Mariä Empfängnis am Dienstag, 8. Dezember, Christtag am Freitag, 25. Dezember, und Stefanitag am Samstag, 26. Dezember. Allerheiligen am 1. November fällt 2026 auf einen Sonntag. In Burgenland ist zudem der 11. November schulfrei, in Niederösterreich und Wien der 15. November, der 2026 ein Sonntag ist.' },
      { q: 'Ist der 8. Dezember ein Feiertag, obwohl Geschäfte offen haben?', a: 'Ja. Mariä Empfängnis ist ein gesetzlicher Feiertag. § 13a Arbeitsruhegesetz erlaubt nur, dass Verkaufsstellen an einem werktags fallenden 8. Dezember Beschäftigte einsetzen dürfen. Wer dort arbeitet, darf ohne Angabe von Gründen ablehnen. Für alle anderen Betriebe gilt die normale Feiertagsruhe.' },
      { q: 'Ist der Karfreitag 2026 ein Feiertag?', a: `Nein. Der Karfreitag, 2026 der ${dLong(K.karfreitag(2026), 'de')}, ist seit 2019 in Österreich kein Feiertag mehr, auch nicht für evangelische Arbeitnehmerinnen und Arbeitnehmer. Wer frei haben möchte, kann ihn als persönlichen Feiertag nach § 7a Arbeitsruhegesetz aus dem eigenen Urlaub nehmen.` },
      { q: 'Wie viele Arbeitstage hat 2026?', a: `In Wien und in allen anderen Bundesländern ${at(2026)} Arbeitstage von Montag bis Freitag, wenn der Tag des Landespatrons gearbeitet wird. Wer den Landespatron frei hat, zieht einen Tag ab, sofern er auf einen Werktag fällt. 2026 hat 261 Wochentage, zehn der 13 Feiertage fallen darauf.` },
    ],
    body: (h) => `<h2>Die 13 Feiertage 2026 mit Wochentag</h2>
${tabelleJahr(h, 2026)}
<p>Die Liste ist in ganz Österreich gleich. Sie steht in ${h.src('arg7', '§ 7 Abs. 2 Arbeitsruhegesetz')} und wortgleich im ${h.src('frg', 'Feiertagsruhegesetz 1957')}, das für Bereiche gilt, die das Arbeitsruhegesetz nicht erfasst. Den 26. Oktober legt zusätzlich das ${h.src('nationalfeiertag', 'Nationalfeiertagsgesetz')} fest.</p>
<h2>Landespatrone 2026</h2>
<p>Neben den 13 Feiertagen hat jedes Bundesland einen eigenen Tag, an dem die Schulen geschlossen sind. Für Arbeitnehmerinnen und Arbeitnehmer ist er nur frei, wenn ein Kollektivvertrag, eine Betriebsvereinbarung oder das Dienstrecht es vorsieht. Mehr dazu unter ${h.a('landesfeiertage', 'Landesfeiertage')}.</p>
${tabellePatrone(h, 2026)}
<h2>Was 2026 bis Jahresende noch frei ist</h2>
<p>Nach dem Nationalfeiertag am Montag, 26. Oktober, und den Herbstferien der Schulen vom 27. bis 31. Oktober folgen noch drei Feiertage. Mariä Empfängnis am Dienstag ergibt mit einem Urlaubstag am Montag vier freie Tage. Über Weihnachten liegen Christtag und Stefanitag auf Freitag und Samstag; die Arbeitstage bis Silvester verbinden sie mit Neujahr 2027. Alle Möglichkeiten zeigt die Seite ${h.a('fenstertage-2026', 'Fenstertage 2026')}.</p>
${h.mini('bt', { p: ['urlaub'], d: { jahr: 2026, urlaub: 4 }, c: 'Brücken bis Silvester planen' })}`,
  },
  en: {
    slug: 'public-holidays-2026', nav: 'Public holidays 2026', card: `${wk(2026)} holidays on weekdays, ${ftN(2026)} bridge days`,
    title: 'Public holidays Austria 2026: all 13 dates with weekday',
    description: "Austria's public holidays 2026: all 13 statutory holidays with date and weekday, the patron saints' days of the provinces and the bridge days left this year.",
    h1: 'Public holidays in Austria 2026',
    intro: "The 13 statutory holidays of 2026 with their weekday, the patron saint's day of your province and the working days. The Immaculate Conception, Christmas Day and St Stephen's Day are still to come.",
    resume: `Austria has thirteen statutory public holidays in 2026. They are listed in section 7(2) of the Rest Periods Act, word for word as in the 1957 Public Holiday Rest Act, and apply in all nine provinces: New Year's Day, Epiphany, Easter Monday on ${dLong(d('ostermontag', 2026), 'en')}, Labour Day (Staatsfeiertag) on 1 May, Ascension Day on ${dLong(d('himmelfahrt', 2026), 'en')}, Whit Monday on ${dLong(d('pfingstmontag', 2026), 'en')}, Corpus Christi on ${dLong(d('fronleichnam', 2026), 'en')}, Assumption Day, National Day, All Saints' Day, the Immaculate Conception, Christmas Day and St Stephen's Day. In 2026, ${wk(2026)} of them fall on a weekday; ${list(we(2026).map((f) => f.name.en), 'en')} fall at the weekend, and no holiday is ever moved. Three are still ahead after October: the Immaculate Conception on a Tuesday, Christmas Day on a Friday and St Stephen's Day on a Saturday. Monday 7 December is the last bridge day of the year. Vienna has ${at(2026)} working days in 2026. Each province also has a patron saint's day, which closes schools but is not a statutory holiday.`,
    faqs: [
      { q: 'Which public holidays are left in Austria in 2026?', a: "After October, three: the Immaculate Conception on Tuesday 8 December, Christmas Day on Friday 25 December and St Stephen's Day on Saturday 26 December. All Saints' Day on 1 November falls on a Sunday in 2026. Schools also close on 11 November in Burgenland and on 15 November in Lower Austria and Vienna, a Sunday in 2026." },
      { q: 'Is 8 December a holiday even though shops open?', a: 'Yes. The Immaculate Conception is a statutory holiday. Section 13a of the Rest Periods Act only allows shops to employ staff when 8 December falls on a weekday. Shop staff may refuse to work without giving a reason. Every other business keeps the normal holiday rest.' },
      { q: 'Is Good Friday 2026 a public holiday in Austria?', a: `No. Good Friday, ${dLong(K.karfreitag(2026), 'en')} in 2026, has not been a holiday in Austria since 2019, not even for Protestant employees. Anyone who wants it off can take it as a personal holiday under section 7a of the Rest Periods Act, out of their own leave.` },
      { q: 'How many working days does 2026 have?', a: `${at(2026)} working days from Monday to Friday, in Vienna and in every other province, if the patron saint's day is worked. If you get the patron saint's day off, subtract one when it falls on a weekday. 2026 has 261 weekdays, and ten of the 13 holidays fall on them.` },
    ],
    body: (h) => `<h2>The 13 holidays of 2026 with weekday</h2>
${tabelleJahr(h, 2026)}
<p>The list is identical across Austria. It is set by ${h.src('arg7', 'section 7(2) of the Rest Periods Act')} and repeated in the ${h.src('frg', '1957 Public Holiday Rest Act')}, which covers areas outside the Rest Periods Act. The ${h.src('nationalfeiertag', 'National Day Act')} also fixes 26 October.</p>
<h2>Patron saints' days 2026</h2>
<p>Besides the 13 holidays, each province has a day of its own on which schools close. For employees it is only a day off if a collective agreement, a works agreement or the civil-service code says so. More on ${h.a('landesfeiertage', "provincial holidays")}.</p>
${tabellePatrone(h, 2026)}
<h2>What is still off before the end of 2026</h2>
<p>After National Day on Monday 26 October and the school autumn break from 27 to 31 October, three holidays remain. The Immaculate Conception on a Tuesday gives four days off with one leave day on the Monday. At Christmas, Christmas Day and St Stephen's Day fall on Friday and Saturday; the working days up to New Year's Eve join them to New Year 2027. All the options are on ${h.a('fenstertage-2026', 'bridge days 2026')}.</p>
${h.mini('bt', { p: ['urlaub'], d: { jahr: 2026, urlaub: 4 }, c: 'Plan bridges up to New Year' })}`,
  },
});

/* ---------------------------------------------------------------- 2027 */
const g2027: GuideDef = defineGuide({
  id: 'feiertage-2027', group: 'feiertage', order: 11, tool: 'ft', toolArg: { jahr: 2027, lp: 'frei' },
  related: ['home', 'kalender-2027', 'feiertage-2028', 'ostern-2027'],
  sources: ['arg7', 'frg', 'arg9', 'schzg2'],
  countdown: { date: '2027-01-01', label: { de: 'Neujahr 2027', en: "New Year's Day 2027" } },
  de: {
    slug: 'feiertage-2027', nav: 'Feiertage 2027', card: `${wk(2027)} Feiertage an Werktagen, ${ftN(2027)} Fenstertage`,
    title: 'Feiertage Österreich 2027: Liste mit Wochentag und Brücken',
    description: 'Feiertage in Österreich 2027: die 13 gesetzlichen Feiertage mit Datum und Wochentag, Ostern am 28. März, die Landespatrone und welche aufs Wochenende fallen.',
    h1: 'Feiertage in Österreich 2027',
    intro: 'Alle gesetzlichen Feiertage 2027 mit Wochentag, die Landespatrone Ihres Bundeslandes und wie viele Arbeitstage bleiben. Wählen Sie Ihr Bundesland.',
    resume: `2027 gibt es in Österreich wie jedes Jahr 13 gesetzliche Feiertage nach § 7 Arbeitsruhegesetz, in allen Bundesländern gleich. Neujahr fällt auf einen Freitag, Heilige Drei Könige auf einen Mittwoch. Ostersonntag ist der ${dLong(K.ostersonntag(2027), 'de')}, damit liegt Ostermontag am ${dLong(d('ostermontag', 2027), 'de')}, Christi Himmelfahrt am ${dLong(d('himmelfahrt', 2027), 'de')}, Pfingstmontag am ${dLong(d('pfingstmontag', 2027), 'de')} und Fronleichnam am ${dLong(d('fronleichnam', 2027), 'de')}. Der Nationalfeiertag am 26. Oktober ist ein ${wd('nationalfeiertag', 2027, 'de')}, Allerheiligen ein ${wd('allerheiligen', 2027, 'de')}, Mariä Empfängnis ein ${wd('mariae-empfaengnis', 2027, 'de')}. Auf ein Wochenende fallen ${we(2027).length} Feiertage: ${list(we(2027).map((f) => f.name.de), 'de')}. Damit bleiben ${wk(2027)} Feiertage an Werktagen und ${at(2027)} Arbeitstage. Echte Fenstertage gibt es ${ftN(2027)}: die Freitage nach Christi Himmelfahrt und nach Fronleichnam und den Montag vor dem Nationalfeiertag. Die Schulen haben zusätzlich am Tag des Landespatrons frei, in Kärnten auch am 10. Oktober.`,
    faqs: [
      { q: 'Wann sind Ostermontag und Osterferien 2027?', a: `Ostersonntag ist der ${dLong(K.ostersonntag(2027), 'de')}, Ostermontag als gesetzlicher Feiertag der ${dLong(d('ostermontag', 2027), 'de')}. Ostern fällt damit früh. Die Osterferien der Schulen dauern vom Samstag vor dem Palmsonntag bis Ostermontag, 2027 vom 20. bis 29. März. Die Osterferien gelten in allen neun Bundesländern gleich.` },
      { q: 'Welche Feiertage fallen 2027 aufs Wochenende?', a: `${list(we(2027).map((f) => `${f.name.de} (${wdLong(f.date, 'de')})`), 'de')}. In Österreich wird ein solcher Feiertag nicht auf einen Werktag verschoben; er geht schlicht verloren. Damit bleiben 2027 neun Feiertage an Werktagen; der Planer zeigt, welche davon sich mit Urlaub zu langen Wochenenden verlängern lassen.` },
      { q: 'Wie viele Feiertage hat Österreich 2027?', a: `13 gesetzliche, davon ${wk(2027)} an einem Werktag. Dazu kommt je nach Bundesland der Tag des Landespatrons (in Kärnten zwei Tage), der schulfrei, aber kein gesetzlicher Feiertag ist. Der Karfreitag zählt seit 2019 nicht mehr dazu; an seine Stelle trat der persönliche Feiertag nach § 7a Arbeitsruhegesetz.` },
      { q: 'Bekomme ich am Feiertag mein Gehalt?', a: 'Ja. Nach § 9 Arbeitsruhegesetz behalten Sie für die Arbeit, die wegen des Feiertags ausfällt, Ihr volles Entgelt. Wer am Feiertag arbeiten muss, erhält zusätzlich das Entgelt für die geleistete Arbeit, es sei denn, es wird Zeitausgleich vereinbart. Das gilt auch für Teilzeitkräfte.' },
    ],
    body: (h) => `<h2>Die 13 Feiertage 2027 mit Wochentag</h2>
${tabelleJahr(h, 2027)}
<h2>Landespatrone 2027</h2>
${tabellePatrone(h, 2027)}
<p>Die Landespatrone stehen in den Schulgesetzen der Länder; die Höchstzahl der Tage, die eine Schule zusätzlich frei geben darf, regelt ${h.src('schzg2', '§ 2 Schulzeitgesetz')}. Mehr dazu unter ${h.a('schulautonome-tage', 'schulautonome Tage')}.</p>
<h2>Feiertage 2027 nutzen</h2>
<p>Die beiden Donnerstage im Mai machen den Mai 2027 zum besten Monat für Kurzurlaube: Christi Himmelfahrt und Fronleichnam liegen drei Wochen auseinander, dazwischen Pfingstmontag. Der Herbst folgt mit dem Nationalfeiertag am Dienstag und Allerheiligen am Montag darauf. Welche Kombination für Ihr Urlaubskonto am meisten bringt, rechnet der ${h.a('home', 'Fenstertage-Planer')}.</p>
${h.mini('bt', { p: ['urlaub'], d: { jahr: 2027 }, c: 'Fenstertage 2027 planen' })}
<p>Für Feiertage gibt es nach ${h.src('arg9', '§ 9 Arbeitsruhegesetz')} das volle Entgelt. Wer an einem Feiertag arbeitet, bekommt die Arbeit zusätzlich bezahlt oder vereinbart Zeitausgleich.</p>`,
  },
  en: {
    slug: 'public-holidays-2027', nav: 'Public holidays 2027', card: `${wk(2027)} holidays on weekdays, ${ftN(2027)} bridge days`,
    title: 'Public holidays Austria 2027: full list, weekdays, bridges',
    description: "Austria's public holidays 2027: the 13 statutory holidays with date and weekday, Easter on 28 March, the patron saints' days and which fall at the weekend.",
    h1: 'Public holidays in Austria 2027',
    intro: "Every statutory holiday of 2027 with its weekday, your province's patron saint's day and the working days that remain. Choose your province.",
    resume: `As every year, Austria has 13 statutory public holidays in 2027 under section 7 of the Rest Periods Act, the same in every province. New Year's Day is a Friday and Epiphany a Wednesday. Easter Sunday is ${dLong(K.ostersonntag(2027), 'en')}, so Easter Monday is ${dLong(d('ostermontag', 2027), 'en')}, Ascension Day ${dLong(d('himmelfahrt', 2027), 'en')}, Whit Monday ${dLong(d('pfingstmontag', 2027), 'en')} and Corpus Christi ${dLong(d('fronleichnam', 2027), 'en')}. National Day on 26 October is a ${wd('nationalfeiertag', 2027, 'en')}, All Saints' Day a ${wd('allerheiligen', 2027, 'en')} and the Immaculate Conception a ${wd('mariae-empfaengnis', 2027, 'en')}. ${we(2027).length} holidays fall at the weekend: ${list(we(2027).map((f) => f.name.en), 'en')}. That leaves ${wk(2027)} holidays on weekdays and ${at(2027)} working days. There are ${ftN(2027)} true bridge days: the Fridays after Ascension Day and Corpus Christi, and the Monday before National Day. Schools also close on the patron saint's day, and in Carinthia on 10 October as well.`,
    faqs: [
      { q: 'When are Easter Monday and the Easter break 2027?', a: `Easter Sunday is ${dLong(K.ostersonntag(2027), 'en')} and Easter Monday, the public holiday, ${dLong(d('ostermontag', 2027), 'en')}. That is an early Easter. The school Easter break runs from the Saturday before Palm Sunday to Easter Monday, 20 to 29 March in 2027. The Easter break is the same in all nine provinces.` },
      { q: 'Which holidays fall at the weekend in 2027?', a: `${list(we(2027).map((f) => `${f.name.en} (${wdLong(f.date, 'en')})`), 'en')}. Austria does not move such a holiday to a weekday; it is simply lost. That leaves nine holidays on weekdays in 2027; the planner shows which of them leave can stretch into long weekends.` },
      { q: 'How many public holidays does Austria have in 2027?', a: `13 statutory ones, ${wk(2027)} of them on a weekday. Depending on the province, the patron saint's day comes on top (two days in Carinthia); it closes schools but is not a statutory holiday. Good Friday has not counted since 2019; it was replaced by the personal holiday under section 7a of the Rest Periods Act.` },
      { q: 'Am I paid for public holidays?', a: 'Yes. Under section 9 of the Rest Periods Act you keep your full pay for work lost to a holiday. If you have to work on a holiday, you are also paid for the work done, unless time off in lieu is agreed.' },
    ],
    body: (h) => `<h2>The 13 holidays of 2027 with weekday</h2>
${tabelleJahr(h, 2027)}
<h2>Patron saints' days 2027</h2>
${tabellePatrone(h, 2027)}
<p>Patron saints' days are set in the provincial school acts; the number of extra days a school may give off is set by ${h.src('schzg2', 'section 2 of the School Hours Act')}. More on ${h.a('schulautonome-tage', 'autonomous school days')}.</p>
<h2>Making the most of 2027</h2>
<p>Two Thursdays make May 2027 the best month for short breaks: Ascension Day and Corpus Christi are three weeks apart, with Whit Monday in between. Autumn follows with National Day on a Tuesday and All Saints' Day on the following Monday. The ${h.a('home', 'bridge-day planner')} works out which combination gives the most for your leave.</p>
${h.mini('bt', { p: ['urlaub'], d: { jahr: 2027 }, c: 'Plan the 2027 bridge days' })}
<p>Holidays are paid in full under ${h.src('arg9', 'section 9 of the Rest Periods Act')}. Anyone working on a holiday is paid for the work on top, or agrees time off in lieu.</p>`,
  },
});

/* ---------------------------------------------------------------- 2028 */
const g2028: GuideDef = defineGuide({
  id: 'feiertage-2028', group: 'feiertage', order: 12, tool: 'ft', toolArg: { jahr: 2028, lp: 'frei' },
  related: ['fenstertage-2028', 'kalender-2028', 'feiertage-2027', 'arbeitstage-2027'],
  sources: ['arg7', 'frg', 'schzg2'],
  de: {
    slug: 'feiertage-2028', nav: 'Feiertage 2028', card: `${wk(2028)} Feiertage an Werktagen, ${ftN(2028)} Fenstertage`,
    title: 'Feiertage Österreich 2028: alle Termine, 12 an Werktagen',
    description: 'Feiertage in Österreich 2028: die 13 gesetzlichen Feiertage mit Wochentag, Ostern am 16. April, die Landespatrone und warum 2028 so viele Fenstertage bringt.',
    h1: 'Feiertage in Österreich 2028',
    intro: 'Die gesetzlichen Feiertage 2028 mit Wochentag, die Landespatrone und die Arbeitstage. Fast alle Feiertage fallen 2028 auf einen Werktag.',
    resume: `2028 liegen ${wk(2028)} der 13 gesetzlichen Feiertage auf Montag bis Freitag; nur Neujahr fällt auf einen Samstag. Ostersonntag ist der ${dLong(K.ostersonntag(2028), 'de')}, ein spätes Osterdatum. Daraus folgen Ostermontag am ${dLong(d('ostermontag', 2028), 'de')}, Christi Himmelfahrt am ${dLong(d('himmelfahrt', 2028), 'de')}, Pfingstmontag am ${dLong(d('pfingstmontag', 2028), 'de')} und Fronleichnam am ${dLong(d('fronleichnam', 2028), 'de')}. Der Staatsfeiertag ist ein Montag, Mariä Himmelfahrt ein Dienstag, der Nationalfeiertag ein Donnerstag, Allerheiligen ein Mittwoch, Mariä Empfängnis ein Freitag, Christtag und Stefanitag Montag und Dienstag. Das Jahr ist ein Schaltjahr; trotzdem bleiben wegen der vielen Feiertage an Werktagen nur ${at(2028)} Arbeitstage, vier weniger als 2027. Es gibt ${ftN(2028)} echte Fenstertage, so viele wie selten. Für die Urlaubsplanung heißt das: Wer früh einreicht, bekommt mit wenig Urlaub viele lange Wochenenden. Die Landespatrone fallen 2028 teils auf ein Wochenende, so der 19. März und der 24. September.`,
    faqs: [
      { q: 'Wann sind Ostermontag und Osterferien 2028?', a: `Ostersonntag ist der ${dLong(K.ostersonntag(2028), 'de')}, Ostermontag der ${dLong(d('ostermontag', 2028), 'de')}. Die Osterferien der Schulen beginnen am Samstag, ${dLong(K.toIso(K.fromIso(K.ostersonntag(2028)) - 8), 'de')}. Sie dauern bis Ostermontag und sind in allen Bundesländern gleich. Karfreitag, der 14. April 2028, ist kein Feiertag, fällt aber in die Ferien.` },
      { q: 'Wie viele Arbeitstage hat 2028?', a: `${at(2028)} von Montag bis Freitag. Das Schaltjahr hat zwar einen Tag mehr, aber zwölf Feiertage an Werktagen. Wer am Landespatron frei hat, kommt je nach Bundesland auf einen Tag weniger. Die Zahl gilt in allen neun Bundesländern, weil die gesetzlichen Feiertage überall dieselben sind.` },
      { q: 'Welcher Feiertag fällt 2028 aufs Wochenende?', a: 'Nur Neujahr, ein Samstag. Alle anderen Feiertage fallen auf einen Werktag, und gleich fünf davon erzeugen einen echten Fenstertag. Zum Vergleich: 2027 gehen vier Feiertage ans Wochenende verloren, darunter Christtag und Stefanitag. 2028 ist deshalb ein besonders gutes Jahr für Fenstertage.' },
      { q: 'Wann ist der Nationalfeiertag 2028?', a: `Am ${dLong(d('nationalfeiertag', 2028), 'de')}, einem ${wd('nationalfeiertag', 2028, 'de')}. Der Freitag danach ist ein Fenstertag. Allerheiligen folgt am Mittwoch, 1. November. Mit einem Urlaubstag am 27. Oktober sind Sie vier Tage am Stück frei; mit zwei weiteren am 30. und 31. Oktober werden daraus sieben freie Tage vom 26. Oktober bis 1. November.` },
    ],
    body: (h) => `<h2>Die 13 Feiertage 2028 mit Wochentag</h2>
${tabelleJahr(h, 2028)}
<h2>Landespatrone 2028</h2>
${tabellePatrone(h, 2028)}
<p>Die Schulen sind an diesen Tagen geschlossen. Gesetzliche Feiertage nach ${h.src('arg7', '§ 7 Arbeitsruhegesetz')} sind sie nicht; wer am Arbeitsplatz frei hat, verdankt das dem Kollektivvertrag oder dem Dienstrecht.</p>
<h2>2028 früh planen</h2>
<p>Weil 2028 so günstig ist, wollen viele dieselben Tage frei haben. Den Urlaub vereinbaren Sie mit dem Arbeitgeber; es gibt keine gesetzliche Frist, aber wer zuerst fragt, hat oft die bessere Wahl. Wie viele freie Tage Ihre Urlaubstage 2028 bringen, zeigt ${h.a('fenstertage-2028', 'Fenstertage 2028')}; den Kalender mit Kalenderwochen gibt es unter ${h.a('kalender-2028', 'Kalender 2028')}.</p>
${h.mini('bt', { p: ['urlaub'], d: { jahr: 2028 }, c: 'Fenstertage 2028 planen' })}`,
  },
  en: {
    slug: 'public-holidays-2028', nav: 'Public holidays 2028', card: `${wk(2028)} holidays on weekdays, ${ftN(2028)} bridge days`,
    title: 'Public holidays Austria 2028: all dates, 12 on weekdays',
    description: "Austria's public holidays 2028: the 13 statutory holidays with weekday, Easter on 16 April, the patron saints' days and why 2028 brings so many bridge days.",
    h1: 'Public holidays in Austria 2028',
    intro: "Austria's statutory holidays in 2028 with weekdays, the patron saints' days and the working days. Almost every holiday falls on a weekday in 2028.",
    resume: `In 2028, ${wk(2028)} of Austria's 13 statutory holidays fall between Monday and Friday; only New Year's Day is a Saturday. Easter Sunday is ${dLong(K.ostersonntag(2028), 'en')}, a late Easter. It puts Easter Monday on ${dLong(d('ostermontag', 2028), 'en')}, Ascension Day on ${dLong(d('himmelfahrt', 2028), 'en')}, Whit Monday on ${dLong(d('pfingstmontag', 2028), 'en')} and Corpus Christi on ${dLong(d('fronleichnam', 2028), 'en')}. Labour Day is a Monday, Assumption Day a Tuesday, National Day a Thursday, All Saints' Day a Wednesday, the Immaculate Conception a Friday, and Christmas Day and St Stephen's Day a Monday and Tuesday. It is a leap year, yet with so many holidays on weekdays only ${at(2028)} working days remain, four fewer than in 2027. There are ${ftN(2028)} true bridge days, a rare number. For leave planning that means many long weekends for little leave, if you book early. Some patron saints' days fall at a weekend in 2028, such as 19 March and 24 September.`,
    faqs: [
      { q: 'When are Easter Monday and the Easter break 2028?', a: `Easter Sunday is ${dLong(K.ostersonntag(2028), 'en')} and Easter Monday ${dLong(d('ostermontag', 2028), 'en')}. The school Easter break starts on Saturday ${dLong(K.toIso(K.fromIso(K.ostersonntag(2028)) - 8), 'en')}. It lasts until Easter Monday and is the same in every province. Good Friday, 14 April 2028, is not a holiday but falls within the break.` },
      { q: 'How many working days are there in 2028?', a: `${at(2028)} from Monday to Friday. The leap year has an extra day, but twelve holidays fall on weekdays. With the patron saint's day off, some provinces have one day fewer. The figure applies in all nine provinces, because the statutory holidays are the same everywhere.` },
      { q: 'Which holiday falls at the weekend in 2028?', a: 'Only New Year\'s Day, a Saturday. Every other holiday is on a weekday, and five of them create a true bridge day. By comparison, four holidays are lost to the weekend in 2027, including Christmas Day and St Stephen\'s Day. That makes 2028 a particularly good year for bridge days.' },
      { q: 'When is Austrian National Day 2028?', a: `On ${dLong(d('nationalfeiertag', 2028), 'en')}, a ${wd('nationalfeiertag', 2028, 'en')}. The Friday after is a bridge day, and All Saints' Day follows on Wednesday 1 November. One leave day on 27 October gives four days off in a row; two more on 30 and 31 October turn that into seven days off from 26 October to 1 November.` },
    ],
    body: (h) => `<h2>The 13 holidays of 2028 with weekday</h2>
${tabelleJahr(h, 2028)}
<h2>Patron saints' days 2028</h2>
${tabellePatrone(h, 2028)}
<p>Schools are closed on these days. They are not statutory holidays under ${h.src('arg7', 'section 7 of the Rest Periods Act')}; anyone who gets the day off at work owes it to a collective agreement or the civil-service code.</p>
<h2>Planning 2028 early</h2>
<p>Because 2028 is so favourable, many people will want the same days off. You agree your leave with your employer; there is no legal deadline, but asking first often means choosing first. What your leave days buy in 2028 is on ${h.a('fenstertage-2028', 'bridge days 2028')}; the calendar with week numbers is on ${h.a('kalender-2028', 'calendar 2028')}.</p>
${h.mini('bt', { p: ['urlaub'], d: { jahr: 2028 }, c: 'Plan the 2028 bridge days' })}`,
  },
});

export default [g2026, g2027, g2028];

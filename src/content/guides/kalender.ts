/** Kalender 2027 et 2028 pour l'Autriche : deux pages rédigées séparément (KW, fériés, année scolaire / année bissextile). Dates : moteur. */
import { defineGuide } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';
import { dLong, wdLong, sommerzeit } from '../../lib/tool-specs';

type L = 'de' | 'en';
const T = (l: L, de: string, en: string) => (l === 'de' ? de : en);
const kw1 = (y: number) => K.toIso(K.dayNum(y, 1, 4) - ((K.weekday(K.dayNum(y, 1, 4)) + 6) % 7));
const kwOf = (iso: string) => K.isoWeek(iso).week;
const at = (y: number) => K.arbeitstage(y, 'W').reduce((a, b) => a + b, 0);
const fd = (y: number) => K.feiertage(y);
const wochenende = (y: number) => fd(y).filter((f) => K.isWeekend(K.fromIso(f.date)));
const MON = (l: L) => Array.from({ length: 12 }, (_, i) => new Date(Date.UTC(2028, i, 15)).toLocaleDateString(l === 'de' ? 'de-AT' : 'en-GB', { month: 'long', timeZone: 'UTC' }));

/* ---------- 2027 : l'année des semaines et de l'année scolaire ---------- */
const y7 = 2027, j7 = K.isoWeek('2027-01-01'), we7 = wochenende(y7), sz7 = sommerzeit(y7);
const rows27 = (l: L) => fd(y7).map((f) => [f.name[l], dLong(f.date, l), wdLong(f.date, l), `${T(l, 'KW', 'Week')} ${kwOf(f.date)}`]);

const kalender2027 = defineGuide({
  id: 'kalender-2027', group: 'feiertage', order: 16, tool: 'kalender', toolArg: { jahr: y7 },
  related: ['feiertage-2027', 'arbeitstage-2027', 'kalender-2028', 'home'], sources: ['arg7', 'schzg2', 'sz2731'],
  de: {
    slug: 'kalender-2027', nav: 'Kalender 2027', card: `${K.weeksInYear(y7)} Kalenderwochen, Feiertage und Landespatron`,
    title: 'Kalender 2027 Österreich: mit Kalenderwochen und Feiertagen',
    description: `Kalender 2027 für Österreich mit allen ${K.weeksInYear(y7)} Kalenderwochen, den 13 Feiertagen und dem Landespatron Ihres Bundeslandes. Kostenlos zum Ausdrucken, ohne Anmeldung.`,
    h1: 'Kalender 2027 für Österreich mit Kalenderwochen',
    intro: 'Das Jahr 2027 auf einen Blick: Kalenderwochen, gesetzliche Feiertage und auf Wunsch der Landespatron. Bundesland wählen und drucken.',
    resume: `2027 beginnt an einem Freitag und hat ${K.weeksInYear(y7)} Kalenderwochen. Der 1. Jänner gehört deshalb noch zur KW ${j7.week} des Jahres ${j7.year}; die erste Kalenderwoche 2027 beginnt erst am Montag, ${dLong(kw1(y7), 'de')}, mit Heilige Drei Könige am Mittwoch derselben Woche. Gezählt wird nach ISO 8601: Die Woche beginnt am Montag, KW 1 enthält den ersten Donnerstag des Jahres. Von den 13 gesetzlichen Feiertagen fallen ${we7.length} aufs Wochenende, nämlich ${we7.map((f) => f.name.de).join(', ')}; sie werden in Österreich nicht nachgeholt. Ostersonntag ist früh, am ${dLong(K.ostersonntag(y7), 'de')} in KW ${kwOf(K.ostersonntag(y7))}. Das ergibt ${at(y7)} Arbeitstage von Montag bis Freitag. Die Sommerzeit gilt vom ${dLong(sz7.beginn, 'de')} bis ${dLong(sz7.ende, 'de')}. Im Kalender oben färben Sie Feiertage und, wenn Sie wollen, den Tag Ihres Landespatrons ein und drucken das Jahr aus. Nichts wird heruntergeladen oder gesendet.`,
    faqs: [
      { q: 'Wie viele Kalenderwochen hat 2027?', a: `${K.weeksInYear(y7)}. Weil 2027 an einem Freitag beginnt, zählt der 1. Jänner noch zur letzten Woche von 2026, und KW 1 startet am ${dLong(kw1(y7), 'de')}. 53 Wochen hat ein Jahr nur, wenn es an einem Donnerstag beginnt oder als Schaltjahr an einem Mittwoch; 2026 war ein solches Jahr.` },
      { q: 'In welcher Kalenderwoche ist Weihnachten 2027?', a: `Der Christtag, ${dLong('2027-12-25', 'de')}, ist ein Samstag in KW ${kwOf('2027-12-25')}. Der Stefanitag fällt auf den Sonntag; beide Feiertage gehen damit ans Wochenende verloren. Für Schulkinder beginnen die Weihnachtsferien am Freitag, 24. Dezember, und dauern bis 6. Jänner 2028. Silvester, der 31. Dezember, ist ein Freitag in KW 52.` },
      { q: 'Welche Kalenderwoche hat der Nationalfeiertag 2027?', a: `KW ${kwOf('2027-10-26')}. Der 26. Oktober ist ein Dienstag, der Montag davor ein Fenstertag, und gleich danach beginnen die Herbstferien der Schulen. Wer den Montag, 25. Oktober, freinimmt, hat mit dem Wochenende davor vier Tage am Stück frei; Schulkinder haben von Dienstag bis Sonntag ohnehin frei.` },
    ],
    body: (h) => `<h2>Alle Feiertage 2027 mit Kalenderwoche</h2>
${h.table(['Feiertag', 'Datum', 'Wochentag', 'KW'], rows27('de'), 'Die 13 gesetzlichen Feiertage 2027 mit Kalenderwoche')}
<p>Die Liste folgt ${h.src('arg7', '§ 7 Abs. 2 Arbeitsruhegesetz')}. Im Kalender erscheint der Landespatron heller, weil er schulfrei, aber kein gesetzlicher Feiertag ist.</p>
<h2>Das Schuljahr im Kalender 2027</h2>
<p>Im ersten Halbjahr läuft das Schuljahr 2026/27, im Herbst beginnt 2027/28. Nach dem ${h.src('schzg2', 'Schulzeitgesetz')} beginnen die Semesterferien in Wien und Niederösterreich am ${dLong(K.semesterferien(y7, 'W').von, 'de')}, die Sommerferien in Burgenland, Niederösterreich und Wien am ${dLong(K.hauptferien(y7, 'W'), 'de')} und in den übrigen Ländern eine Woche später. Die Schule beginnt dort am ${dLong(K.schulbeginn(y7, 'W'), 'de')} (KW ${kwOf(K.schulbeginn(y7, 'W'))}), sonst am ${dLong(K.schulbeginn(y7, 'T'), 'de')}. Mögliche freie Schultage zeigt ${h.a('schulautonome-tage', 'schulautonome Tage')}.</p>
${h.mini('kw', { p: ['kw'], d: { jahr: y7, kw: kwOf(K.ostersonntag(y7)) }, c: 'Kalenderwoche nachschlagen' })}`,
  },
  en: {
    slug: 'calendar-2027', nav: 'Calendar 2027', card: `${K.weeksInYear(y7)} weeks, holidays and patron saint's day`,
    title: 'Calendar 2027 Austria: week numbers and public holidays',
    description: `2027 calendar for Austria with all ${K.weeksInYear(y7)} ISO week numbers, the 13 public holidays and your province's patron saint's day. Ready to print, no sign-up needed.`,
    h1: '2027 calendar for Austria with week numbers',
    intro: "All of 2027 at a glance: week numbers, statutory holidays and, if you like, the patron saint's day. Choose your province and print.",
    resume: `2027 starts on a Friday and has ${K.weeksInYear(y7)} weeks. So 1 January still belongs to week ${j7.week} of ${j7.year}; week 1 of 2027 only starts on Monday ${dLong(kw1(y7), 'en')}, with Epiphany on the Wednesday of that week. Weeks are counted under ISO 8601: they start on Monday, and week 1 contains the year's first Thursday. Of the 13 statutory holidays, ${we7.length} fall at a weekend, namely ${we7.map((f) => f.name.en).join(', ')}; Austria does not move them. Easter is early, on ${dLong(K.ostersonntag(y7), 'en')} in week ${kwOf(K.ostersonntag(y7))}. That leaves ${at(y7)} working days from Monday to Friday. Summer time runs from ${dLong(sz7.beginn, 'en')} to ${dLong(sz7.ende, 'en')}. In the calendar above you can colour the holidays and, if you wish, your patron saint's day, then print the year. Nothing is downloaded or sent.`,
    faqs: [
      { q: 'How many weeks does 2027 have?', a: `${K.weeksInYear(y7)}. Because 2027 starts on a Friday, 1 January still counts in the last week of 2026, and week 1 starts on ${dLong(kw1(y7), 'en')}. A year only has 53 weeks if it starts on a Thursday, or is a leap year starting on a Wednesday; 2026 was one.` },
      { q: 'Which week is Christmas 2027 in?', a: `Christmas Day, ${dLong('2027-12-25', 'en')}, is a Saturday in week ${kwOf('2027-12-25')}. St Stephen's Day is the Sunday, so both holidays are lost to the weekend. For school children the Christmas break starts on Friday 24 December and lasts until 6 January 2028.` },
      { q: 'Which week is National Day 2027 in?', a: `Week ${kwOf('2027-10-26')}. 26 October is a Tuesday, the Monday before is a bridge day, and the school autumn break starts right after. Take Monday 25 October off and, with the weekend before, you have four days in a row; school children are off from Tuesday to Sunday anyway.` },
    ],
    body: (h) => `<h2>Every 2027 holiday with its week number</h2>
${h.table(['Holiday', 'Date', 'Weekday', 'Week'], rows27('en'), 'The 13 statutory holidays of 2027 with week number')}
<p>The list follows ${h.src('arg7', 'section 7(2) of the Rest Periods Act')}. The calendar shows the patron saint's day in a lighter colour, since schools close but it is not a statutory holiday.</p>
<h2>The school year in the 2027 calendar</h2>
<p>The first half of the year belongs to the 2026/27 school year, and 2027/28 starts in the autumn. Under the ${h.src('schzg2', 'School Hours Act')} the semester break in Vienna and Lower Austria starts on ${dLong(K.semesterferien(y7, 'W').von, 'en')}, the summer holidays in Burgenland, Lower Austria and Vienna on ${dLong(K.hauptferien(y7, 'W'), 'en')} and a week later in the other provinces. School starts there on ${dLong(K.schulbeginn(y7, 'W'), 'en')} (week ${kwOf(K.schulbeginn(y7, 'W'))}) and elsewhere on ${dLong(K.schulbeginn(y7, 'T'), 'en')}. Possible extra days off are on ${h.a('schulautonome-tage', 'autonomous school days')}.</p>
${h.mini('kw', { p: ['kw'], d: { jahr: y7, kw: kwOf(K.ostersonntag(y7)) }, c: 'Look up a week number' })}`,
  },
});

/* ---------- 2028 : l'année bissextile ---------- */
const y8 = 2028, j8 = K.isoWeek('2028-01-01'), sz8 = sommerzeit(y8), m8 = K.arbeitstage(y8, 'W');
const rows28 = (l: L) => MON(l).map((mn, i) => [mn, String(fd(y8).filter((f) => Number(f.date.slice(5, 7)) === i + 1 && !K.isWeekend(K.fromIso(f.date))).length), String(m8[i])]);

const kalender2028 = defineGuide({
  id: 'kalender-2028', group: 'feiertage', order: 17, tool: 'kalender', toolArg: { jahr: y8 },
  related: ['feiertage-2028', 'fenstertage-2028', 'kalender-2027', 'schulautonome-tage'], sources: ['arg7', 'sz2731'],
  de: {
    slug: 'kalender-2028', nav: 'Kalender 2028', card: 'Schaltjahr mit 366 Tagen, Feiertagen und KW',
    title: 'Kalender 2028 Österreich: Schaltjahr mit KW und Feiertagen',
    description: 'Kalender 2028 für Österreich: Schaltjahr mit 366 Tagen und 29. Februar, alle Kalenderwochen, die 13 Feiertage und Ihr Landespatron. Kostenlos zum Ausdrucken.',
    h1: 'Kalender 2028: das Schaltjahr für Österreich',
    intro: '2028 hat 366 Tage. Der Kalender zeigt Kalenderwochen, gesetzliche Feiertage und auf Wunsch den Landespatron; Bundesland wählen und ausdrucken.',
    resume: `2028 ist ein Schaltjahr: Der Februar hat 29 Tage, der 29. Februar ist ein ${wdLong('2028-02-29', 'de')}. Das Jahr beginnt an einem Samstag, deshalb zählt der 1. Jänner noch zur KW ${j8.week} von ${j8.year}, und KW 1 beginnt am Montag, ${dLong(kw1(y8), 'de')}. Insgesamt hat 2028 ${K.weeksInYear(y8)} Kalenderwochen nach ISO 8601. Für Fenstertage ist 2028 ein ungewöhnlich gutes Jahr: Nur Neujahr fällt aufs Wochenende, die übrigen zwölf Feiertage liegen auf Werktagen. Ostersonntag ist der ${dLong(K.ostersonntag(y8), 'de')}, deutlich später als 2027, Christi Himmelfahrt folgt am ${dLong(K.plusTage(K.ostersonntag(y8), 39), 'de')}. Wien hat 2028 ${at(y8)} Arbeitstage von Montag bis Freitag. Die Uhren werden am ${dLong(sz8.beginn, 'de')} vor- und am ${dLong(sz8.ende, 'de')} zurückgestellt. Der Kalender oben markiert Feiertage und auf Wunsch den Landespatron und lässt sich über „Drucken“ auf Papier bringen.`,
    faqs: [
      { q: 'Ist 2028 ein Schaltjahr?', a: `Ja. 2028 ist durch 4 teilbar und kein Jahrhundertjahr, also hat der Februar 29 Tage. Der 29. Februar 2028 ist ein ${wdLong('2028-02-29', 'de')}; das nächste Schaltjahr ist 2032. Jahrhundertjahre sind nur dann Schaltjahre, wenn sie durch 400 teilbar sind, wie das Jahr 2000.` },
      { q: 'Wann beginnt KW 1 2028?', a: `Am Montag, ${dLong(kw1(y8), 'de')}. Der 1. und 2. Jänner gehören als Wochenende noch zur KW ${j8.week} von ${j8.year}. Nach ISO 8601 enthält KW 1 immer den 4. Jänner. 2028 hat insgesamt 52 Kalenderwochen; die letzte endet am Sonntag, 31. Dezember 2028.` },
      { q: 'Bringt der Schalttag 2028 einen Arbeitstag mehr?', a: `${at(y8)} von Montag bis Freitag, wenn kein Landespatron frei ist. Der Schalttag zählt als zusätzlicher Arbeitstag, weil er auf einen Dienstag fällt. Insgesamt liegen 2028 zwölf der 13 Feiertage auf einem Werktag, nur Neujahr fällt auf einen Samstag. Das drückt die Zahl der Arbeitstage trotz Schalttag.` },
    ],
    body: (h) => `<h2>2028 Monat für Monat</h2>
${h.table(['Monat', 'Feiertage an Werktagen', 'Arbeitstage'], rows28('de'), 'Feiertage an Werktagen und Arbeitstage je Monat 2028, ohne Landespatron', ['l', 'r', 'r'])}
<p>Gezählt nach ${h.src('arg7', '§ 7 Arbeitsruhegesetz')}. Der Dezember 2028 hat mit Mariä Empfängnis, Christtag und Stefanitag drei Feiertage an Werktagen, Mai und Juni je zwei: Staatsfeiertag und Christi Himmelfahrt, Pfingstmontag und Fronleichnam. Welche Brücken sich daraus ergeben, zeigt ${h.a('fenstertage-2028', 'Fenstertage 2028')}.</p>
<h2>Zeitumstellung 2028</h2>
<p>Die Sommerzeit beginnt am ${dLong(sz8.beginn, 'de')} um 2 Uhr und endet am ${dLong(sz8.ende, 'de')} um 3 Uhr, festgelegt in der ${h.src('sz2731', 'Sommerzeitverordnung für 2027 bis 2031')}.</p>
${h.mini('kw', { p: ['kw'], d: { jahr: y8, kw: kwOf('2028-02-29') }, c: 'Kalenderwoche 2028 nachschlagen' })}`,
  },
  en: {
    slug: 'calendar-2028', nav: 'Calendar 2028', card: 'Leap year with 366 days, holidays and weeks',
    title: 'Calendar 2028 Austria: leap year, week numbers, holidays',
    description: "2028 calendar for Austria: a leap year with 366 days and 29 February, every ISO week number, the 13 public holidays and your patron saint's day. Free to print.",
    h1: 'Calendar 2028: the leap year for Austria',
    intro: "2028 has 366 days. The calendar shows week numbers, statutory holidays and, if you like, the patron saint's day; choose your province and print.",
    resume: `2028 is a leap year: February has 29 days, and 29 February is a ${wdLong('2028-02-29', 'en')}. The year starts on a Saturday, so 1 January still belongs to week ${j8.week} of ${j8.year}, and week 1 starts on Monday ${dLong(kw1(y8), 'en')}. In all, 2028 has ${K.weeksInYear(y8)} ISO weeks. For bridge days 2028 is an unusually good year: only New Year's Day falls at a weekend, and the other twelve holidays are on weekdays. Easter Sunday is ${dLong(K.ostersonntag(y8), 'en')}, well after 2027, and Ascension Day follows on ${dLong(K.plusTage(K.ostersonntag(y8), 39), 'en')}. Vienna has ${at(y8)} working days from Monday to Friday in 2028. Clocks go forward on ${dLong(sz8.beginn, 'en')} and back on ${dLong(sz8.ende, 'en')}. The calendar above marks the holidays and, if you wish, the patron saint's day, and "Print" puts it on paper.`,
    faqs: [
      { q: 'Is 2028 a leap year?', a: `Yes. 2028 is divisible by 4 and not a century year, so February has 29 days. 29 February 2028 is a ${wdLong('2028-02-29', 'en')}; the next leap year is 2032. Century years are only leap years when divisible by 400, as 2000 was.` },
      { q: 'When does week 1 of 2028 start?', a: `On Monday ${dLong(kw1(y8), 'en')}. 1 and 2 January, a weekend, still belong to week ${j8.week} of ${j8.year}. Under ISO 8601 week 1 always contains 4 January. 2028 has 52 weeks in all, and the last one ends on Sunday 31 December 2028.` },
      { q: 'Does the 2028 leap day add a working day?', a: `${at(y8)} from Monday to Friday, with no patron saint's day off. The leap day adds a working day, since it falls on a Tuesday. In all, twelve of the 13 holidays fall on weekdays in 2028; only New Year's Day is a Saturday. That pulls the number of working days down despite the leap day.` },
    ],
    body: (h) => `<h2>2028 month by month</h2>
${h.table(['Month', 'Holidays on weekdays', 'Working days'], rows28('en'), 'Weekday holidays and working days per month in 2028, without patron saint', ['l', 'r', 'r'])}
<p>Counted under ${h.src('arg7', 'section 7 of the Rest Periods Act')}. December 2028 has three holidays on weekdays, the Immaculate Conception, Christmas Day and St Stephen's Day, while May and June have two each: Labour Day and Ascension Day, Whit Monday and Corpus Christi. The bridges they create are on ${h.a('fenstertage-2028', 'bridge days 2028')}.</p>
<h2>Clock changes in 2028</h2>
<p>Summer time starts on ${dLong(sz8.beginn, 'en')} at 2 a.m. and ends on ${dLong(sz8.ende, 'en')} at 3 a.m., as set in the ${h.src('sz2731', 'summer-time ordinance for 2027 to 2031')}.</p>
${h.mini('kw', { p: ['kw'], d: { jahr: y8, kw: kwOf('2028-02-29') }, c: 'Look up a 2028 week number' })}`,
  },
});

export default [kalender2027, kalender2028];

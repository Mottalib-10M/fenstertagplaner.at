/** Nächster Feiertag : compte à rebours en direct (outil Naechster), liste des 12 prochains mois. Dates : moteur. */
import { defineGuide } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';
import { dLong, wdLong } from '../../lib/tool-specs';

const AB = K.LESEDATUM;
const next12 = K.naechste(AB, 'W', {}, 13);
const lang = (l: 'de' | 'en') => next12.map((f) => [dLong(f.date, l), wdLong(f.date, l), f.name[l], K.isWeekend(K.fromIso(f.date)) ? (l === 'de' ? 'Wochenende' : 'weekend') : (l === 'de' ? 'Werktag' : 'weekday')]);
const n0 = next12[0], n1 = next12[1];

export default defineGuide({
  id: 'naechster-feiertag', group: 'werkzeuge', order: 4, tool: 'naechster',
  related: ['feiertage-2026', 'feiertage-2027', 'fenstertage-2026', 'kalender-2027'],
  sources: ['arg7', 'frg', 'zzg'],
  de: {
    slug: 'naechster-feiertag', nav: 'Nächster Feiertag', card: 'Countdown bis zum nächsten freien Tag',
    title: 'Nächster Feiertag in Österreich: Countdown und Datum',
    description: 'Wann ist der nächste Feiertag in Österreich? Countdown in Tagen, Stunden und Minuten, dazu die folgenden Feiertage mit Wochentag, auf Wunsch mit Landespatron.',
    h1: 'Wann ist der nächste Feiertag?',
    intro: 'Der Countdown zählt bis Mitternacht vor dem nächsten gesetzlichen Feiertag in Österreich und listet die folgenden. Mit Landespatron, wenn Sie ihn frei haben.',
    resume: `Der nächste gesetzliche Feiertag hängt in Österreich nicht vom Bundesland ab: Alle 13 Feiertage nach § 7 Arbeitsruhegesetz gelten überall. Nur der Tag des Landespatrons unterscheidet sich, und er ist schulfrei, aber kein gesetzlicher Feiertag; im Rechner lässt er sich dazuschalten. Ab dem ${dLong(AB, 'de')} gezählt ist der nächste Feiertag ${n0.name.de} am ${dLong(n0.date, 'de')}, ein ${wdLong(n0.date, 'de')}, danach ${n1.name.de} am ${dLong(n1.date, 'de')}. Der Countdown oben läuft mit der Uhr Ihres Geräts und zählt bis 0 Uhr österreichischer Zeit am Feiertag, also MEZ im Winter und MESZ im Sommer. Wer im Ausland ist, sieht dieselbe Restzeit, umgerechnet in die eigene Zeitzone. Fällt ein Feiertag auf einen Samstag oder Sonntag, zeigt die Liste das an: Er wird in Österreich nicht nachgeholt. Für die Urlaubsplanung sind vor allem Feiertage an einem Dienstag oder Donnerstag interessant, weil der Tag dazwischen zum Fenstertag wird. Die Seite wird bei jeder Veröffentlichung neu gerechnet; der Countdown selbst rechnet in Ihrem Browser immer mit dem heutigen Datum.`,
    faqs: [
      { q: 'Welcher Feiertag ist als nächstes?', a: `Der Countdown oben zeigt es mit dem heutigen Datum Ihres Geräts. Stand ${dLong(AB, 'de')} ist es ${n0.name.de} am ${dLong(n0.date, 'de')}, gefolgt von ${n1.name.de} am ${dLong(n1.date, 'de')}. Die Tabelle darunter nennt die folgenden Feiertage eines ganzen Jahres mit Wochentag.` },
      { q: 'Ist der nächste Feiertag in jedem Bundesland gleich?', a: 'Ja, bei den gesetzlichen Feiertagen. Die 13 Tage des Arbeitsruhegesetzes gelten in ganz Österreich. Wählen Sie im Rechner den Landespatron dazu, erscheint zusätzlich der Tag Ihres Bundeslandes, etwa der 15. November in Wien und Niederösterreich. Schulfrei ist der Landespatron in jedem Fall.' },
      { q: 'Bis wann zählt der Countdown?', a: 'Bis 0 Uhr am Feiertag, in österreichischer gesetzlicher Zeit. Das ist nach dem Zeitzählungsgesetz die Mitteleuropäische Zeit, im Sommer die Sommerzeit. Ihr Gerät rechnet die Restzeit selbst; nichts wird gesendet. Bei Feiertagen im Sommer zählt er nach Sommerzeit, im Winter nach Normalzeit.' },
      { q: 'Haben Geschäfte am nächsten Feiertag offen?', a: 'Grundsätzlich nicht, denn an Feiertagen gilt die Feiertagsruhe. Ausnahmen gibt es etwa für Verkaufsstellen in Bahnhöfen und auf Flughäfen (§ 18 Arbeitsruhegesetz) sowie am 8. Dezember, wenn er auf einen Werktag fällt: Dann dürfen Verkaufsstellen nach § 13a Arbeitsruhegesetz öffnen.' },
    ],
    body: (h) => `<h2>Die nächsten Feiertage ab ${dLong(AB, 'de')}</h2>
${h.table(['Datum', 'Wochentag', 'Feiertag', 'Fällt auf'], lang('de'), `Die nächsten 13 gesetzlichen Feiertage in Österreich, gezählt ab ${dLong(AB, 'de')}`)}
<p>Die Liste folgt ${h.src('arg7', '§ 7 Abs. 2 Arbeitsruhegesetz')} und dem gleichlautenden ${h.src('frg', 'Feiertagsruhegesetz 1957')}. Sie umfasst ein ganzes Jahr, weil jeder Feiertag einmal im Jahr vorkommt. Landespatrone fehlen hier; sie stehen unter ${h.a('landesfeiertage', 'Landesfeiertage')}.</p>
<h2>Vom nächsten Feiertag zum langen Wochenende</h2>
<p>Liegt der nächste Feiertag an einem Dienstag oder Donnerstag, lohnt ein Blick auf den Tag dazwischen: Ein Urlaubstag am Montag oder Freitag ergibt vier freie Tage. Der ${h.a('home', 'Fenstertage-Planer')} findet diese Tage für das ganze Jahr, die Seite ${h.a('fenstertage-2026', 'Fenstertage 2026')} zeigt, was bis Silvester bleibt.</p>
${h.mini('bt', { p: ['jahr', 'urlaub'], d: { jahr: 2027, urlaub: 3 }, c: 'Fenstertage finden' })}
<p>Die Uhrzeit, bis zu der gezählt wird, folgt dem ${h.src('zzg', 'Zeitzählungsgesetz')}: Normalzeit ist die Mitteleuropäische Zeit, im Sommer gilt die um eine Stunde vorverlegte Sommerzeit.</p>`,
  },
  en: {
    slug: 'next-public-holiday', nav: 'Next public holiday', card: 'Countdown to the next day off',
    title: 'Next public holiday in Austria: countdown and date',
    description: "When is the next public holiday in Austria? A live countdown in days, hours and minutes, plus the holidays after it with weekdays and your patron saint's day.",
    h1: 'When is the next public holiday in Austria?',
    intro: "The countdown runs to midnight before Austria's next statutory holiday and lists the ones after it. Add your patron saint's day if you get it off.",
    resume: `In Austria the next statutory holiday does not depend on the province: all 13 holidays under section 7 of the Rest Periods Act apply everywhere. Only the patron saint's day differs, and it closes schools but is not a statutory holiday; you can switch it on in the calculator. Counting from ${dLong(AB, 'en')}, the next holiday is ${n0.name.en} on ${dLong(n0.date, 'en')}, a ${wdLong(n0.date, 'en')}, followed by ${n1.name.en} on ${dLong(n1.date, 'en')}. The countdown above runs on your device clock and counts to midnight Austrian time on the holiday, Central European Time in winter and summer time in summer. If you are abroad you see the same time remaining, converted to your own time zone. When a holiday falls on a Saturday or Sunday the list says so: Austria does not move it. For leave planning the holidays on a Tuesday or Thursday matter most, because the day in between becomes a bridge day. The page is recomputed each time it is published; the countdown itself always uses today's date in your browser.`,
    faqs: [
      { q: 'Which public holiday is next?', a: `The countdown above shows it using today's date on your device. As of ${dLong(AB, 'en')} it is ${n0.name.en} on ${dLong(n0.date, 'en')}, followed by ${n1.name.en} on ${dLong(n1.date, 'en')}. The table below lists the holidays of a full year ahead with their weekdays.` },
      { q: 'Is the next holiday the same in every province?', a: "Yes, for statutory holidays. The 13 days of the Rest Periods Act apply across Austria. If you add the patron saint's day in the calculator, your province's own day appears too, such as 15 November in Vienna and Lower Austria." },
      { q: 'What time does the countdown run to?', a: 'To midnight at the start of the holiday, in Austrian legal time. Under the Time Reckoning Act that is Central European Time, with summer time in summer. Your device works out the time left on its own; nothing is sent.' },
      { q: 'Are shops open on the next public holiday?', a: 'As a rule, no: holiday rest applies. Exceptions include shops in railway stations and airports (section 18 of the Rest Periods Act), and 8 December when it falls on a weekday, when shops may open under section 13a of the Rest Periods Act.' },
    ],
    body: (h) => `<h2>The next public holidays from ${dLong(AB, 'en')}</h2>
${h.table(['Date', 'Weekday', 'Holiday', 'Falls on'], lang('en'), `Austria's next 13 statutory public holidays, counted from ${dLong(AB, 'en')}`)}
<p>The list follows ${h.src('arg7', 'section 7(2) of the Rest Periods Act')} and the identical ${h.src('frg', '1957 Public Holiday Rest Act')}. It covers a full year, since each holiday comes round once a year. Patron saints' days are not included; they are on ${h.a('landesfeiertage', 'provincial holidays')}.</p>
<h2>From the next holiday to a long weekend</h2>
<p>If the next holiday falls on a Tuesday or Thursday, look at the day in between: one leave day on the Monday or Friday gives four days off. The ${h.a('home', 'bridge-day planner')} finds these days for the whole year, and ${h.a('fenstertage-2026', 'bridge days 2026')} shows what is left before New Year.</p>
${h.mini('bt', { p: ['jahr', 'urlaub'], d: { jahr: 2027, urlaub: 3 }, c: 'Find bridge days' })}
<p>The time counted to follows the ${h.src('zzg', 'Time Reckoning Act')}: standard time is Central European Time, and in summer the clocks run one hour ahead.</p>`,
  },
});

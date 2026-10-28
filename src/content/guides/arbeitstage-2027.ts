/** Arbeitstage 2027 en Autriche : par mois, par Land (patron chômé ou non), temps partiel. Chiffres : moteur. */
import { defineGuide } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';
import { tabelleLaender } from '../../lib/bausteine';

const Y = 2027;
const m = K.arbeitstage(Y, 'W'), sum = m.reduce((a, b) => a + b, 0);
const mo = K.werktageMoFr(Y);
const sum26 = K.arbeitstage(2026, 'W').reduce((a, b) => a + b, 0), sum28 = K.arbeitstage(2028, 'W').reduce((a, b) => a + b, 0);
const hl = K.arbeitstage(Y, 'W', { heiligabend: true }).reduce((a, b) => a + b, 0);
const maxI = m.indexOf(Math.max(...m)), minI = m.indexOf(Math.min(...m));
const MON = (l: 'de' | 'en', i: number) => new Date(Date.UTC(Y, i, 15)).toLocaleDateString(l === 'de' ? 'de-AT' : 'en-GB', { month: 'long', timeZone: 'UTC' });
const wkHol = K.feiertage(Y).filter((f) => !K.isWeekend(K.fromIso(f.date))).length;
const kp = K.arbeitstage(Y, 'K', { patron: true }).reduce((a, b) => a + b, 0);

export default defineGuide({
  id: 'arbeitstage-2027', group: 'werkzeuge', order: 5, tool: 'at', toolArg: { jahr: Y },
  related: ['kalender-2027', 'feiertage-2027', 'urlaubsanspruch', 'home'],
  sources: ['arg7', 'arg9', 'schule-k'],
  de: {
    slug: 'arbeitstage-2027', nav: 'Arbeitstage 2027', card: `${sum} Arbeitstage, je Monat und Bundesland`,
    title: `Arbeitstage 2027 Österreich: ${sum} Tage, je Monat gerechnet`,
    description: `Arbeitstage 2027 in Österreich: ${sum} Tage von Montag bis Freitag, je Monat und Bundesland, mit Landespatron, Heiligabend und Teilzeit. Der Rechner zählt für Sie.`,
    h1: 'Arbeitstage 2027 in Österreich',
    intro: 'Wie viele Arbeitstage 2027 hat, je Monat und je Bundesland, für die Fünf-, Vier- oder Dreitagewoche. Landespatron und Heiligabend lassen sich als frei markieren.',
    resume: `2027 hat ${mo} Tage von Montag bis Freitag. ${wkHol} der 13 gesetzlichen Feiertage fallen auf einen dieser Tage, also bleiben ${sum} Arbeitstage. Die Zahl ist in allen neun Bundesländern gleich, solange der Tag des Landespatrons gearbeitet wird. Wer ihn laut Kollektivvertrag oder Dienstrecht frei hat, verliert einen weiteren Arbeitstag, wenn er auf einen Werktag fällt; in Kärnten mit zwei Landestagen sind es dann ${kp}. Sind Heiligabend und Silvester frei, wie in vielen Betrieben, bleiben ${hl}. Die meisten Arbeitstage hat 2027 der ${MON('de', maxI)} mit ${m[maxI]}, die wenigsten der ${MON('de', minI)} mit ${m[minI]}. Zum Vergleich: 2026 waren es ${sum26} Arbeitstage, 2028 werden es nur ${sum28} sein, weil dann zwölf Feiertage auf Werktage fallen. Für Teilzeit rechnet der Rechner die Arbeitstage anteilig um. Die Zahl dient zum Beispiel für Projektpläne, für die Umrechnung eines Jahresgehalts auf den Tagessatz oder für die Frage, wie viele Bürotage im Jahr anfallen.`,
    faqs: [
      { q: 'Wie viele Arbeitstage hat 2027 in Österreich?', a: `${sum} Arbeitstage von Montag bis Freitag. Von den ${mo} Wochentagen gehen ${mo - sum} Feiertage ab. Ist bei Ihnen der Landespatron frei, zählen Sie einen Tag weniger, wenn er auf einen Werktag fällt. Die Zahl ist in allen neun Bundesländern gleich, weil die 13 gesetzlichen Feiertage überall gelten. Samstage zählen hier nicht mit.` },
      { q: 'Welcher Monat hat 2027 die meisten Arbeitstage?', a: `Der ${MON('de', maxI)} mit ${m[maxI]} Arbeitstagen. Am wenigsten hat der ${MON('de', minI)} mit ${m[minI]}. Die Tabelle unter dem Rechner zeigt alle zwölf Monate. Im Mai liegen Christi Himmelfahrt, Pfingstmontag und Fronleichnam auf Werktagen, der Staatsfeiertag dagegen auf einem Samstag. Der März hat 23 Wochentage, von denen nur Ostermontag, der 29. März, wegfällt.` },
      { q: 'Zählt Heiligabend als Arbeitstag?', a: `Gesetzlich ja: Der 24. und der 31. Dezember sind Werktage. Viele Kollektivverträge geben sie ganz oder zum Teil frei. Markieren Sie beide Tage unter „Weitere Angaben“ als frei, dann zeigt der Rechner ${hl} Arbeitstage. Ob Sie frei haben, steht im Kollektivvertrag, in einer Betriebsvereinbarung oder im Arbeitsvertrag.` },
      { q: 'Wie rechne ich Arbeitstage bei Teilzeit?', a: 'Bei festen Arbeitstagen zählen Sie Ihre Wochentage im Kalender und ziehen die Feiertage ab, die auf diese Tage fallen. Als Schätzung genügt es, die Arbeitstage der Fünftagewoche anteilig umzurechnen, das macht der Rechner bei vier oder drei Tagen pro Woche.' },
    ],
    body: (h) => `<h2>Arbeitstage 2027 je Bundesland</h2>
<p>Die 13 gesetzlichen Feiertage gelten nach ${h.src('arg7', '§ 7 Arbeitsruhegesetz')} überall gleich. Unterschiede entstehen nur durch den Landespatron, der schulfrei ist und je nach Kollektivvertrag oder Dienstrecht auch arbeitsfrei. Kärnten hat nach dem ${h.src('schule-k', 'Kärntner Schulgesetz')} zwei solche Tage, den 19. März und den 10. Oktober.</p>
${tabelleLaender(h, Y)}
<h2>Arbeitstage je Monat</h2>
${h.table(['Monat', 'Arbeitstage', 'Kalenderwochen'], m.map((x, i) => [MON('de', i), x, `${K.isoWeek(`${Y}-${String(i + 1).padStart(2, '0')}-01`).week}–${K.isoWeek(K.toIso(K.dayNum(Y, i + 2, 1) - 1)).week}`]), `Arbeitstage je Monat ${Y} in Wien`, ['l', 'r', 'l'])}
<p>Im Mai liegen drei Feiertage an Werktagen; der Staatsfeiertag fällt auf einen Samstag und kostet keinen Arbeitstag. Feiertage werden bezahlt wie gearbeitete Tage (${h.src('arg9', '§ 9 Arbeitsruhegesetz')}); für das Monatsgehalt ändert sich durch sie also nichts, für einen Stundenlohn oder Tagessatz schon.</p>
<h2>Mit den Arbeitstagen planen</h2>
<p>Wer einen Tagessatz aus einem Jahresbetrag ableitet, teilt durch die Arbeitstage abzüglich Urlaub: ${sum} Arbeitstage weniger 25 Urlaubstage ergeben ${sum - 25} Tage. Wie viel Urlaub Ihnen zusteht, rechnet ${h.a('urlaubsanspruch', 'Urlaubsanspruch')}; den Kalender mit allen Kalenderwochen finden Sie unter ${h.a('kalender-2027', 'Kalender 2027')}.</p>
${h.mini('at', { p: ['woche'], c: 'Arbeitstage für Ihr Land' })}`,
  },
  en: {
    slug: 'working-days-2027', nav: 'Working days 2027', card: `${sum} working days, by month and province`,
    title: `Working days 2027 Austria: ${sum} days, month by month`,
    description: `Working days 2027 in Austria: ${sum} days from Monday to Friday, by month and province, with patron saint's day, Christmas Eve and part-time, counted for you.`,
    h1: 'Working days in Austria 2027',
    intro: "How many working days 2027 has in Austria, by month and by province, for a five, four or three-day week. You can mark the patron saint's day and Christmas Eve as days off.",
    resume: `2027 has ${mo} days from Monday to Friday. ${wkHol} of the 13 statutory holidays fall on one of them, leaving ${sum} working days. The figure is the same in all nine provinces as long as the patron saint's day is worked. If your collective agreement or service code gives it off, you lose one more working day when it falls on a weekday; in Carinthia, with two provincial days, the total is then ${kp}. If Christmas Eve and New Year's Eve are off, as they are for many employers, ${hl} remain. The month with the most working days in 2027 is ${MON('en', maxI)} with ${m[maxI]}, the fewest ${MON('en', minI)} with ${m[minI]}. For comparison, 2026 had ${sum26} working days and 2028 will have only ${sum28}, because twelve holidays fall on weekdays that year. For part-time work the calculator scales the figure pro rata. Use it for project schedules, for converting an annual salary into a day rate, or simply to count office days in the year.`,
    faqs: [
      { q: 'How many working days does Austria have in 2027?', a: `${sum} working days from Monday to Friday. Of the ${mo} weekdays, ${mo - sum} are public holidays. If your patron saint's day is off, count one day fewer when it falls on a weekday. The figure is the same in all nine provinces, because the 13 statutory holidays apply everywhere. Saturdays are not counted.` },
      { q: 'Which month has the most working days in 2027?', a: `${MON('en', maxI)}, with ${m[maxI]} working days. ${MON('en', minI)} has the fewest, ${m[minI]}. The table under the calculator shows all twelve months. In May, Ascension Day, Whit Monday and Corpus Christi fall on weekdays, while Labour Day is a Saturday. March has 23 weekdays, of which only Easter Monday, 29 March, drops out.` },
      { q: 'Is Christmas Eve a working day?', a: `By law, yes: 24 and 31 December are working days. Many collective agreements give them off in full or in part. Mark both as off under "More details" and the calculator shows ${hl} working days. Whether you get them off is set by your collective agreement, a works agreement or your contract.` },
      { q: 'How do I count working days for part-time work?', a: 'With fixed working days, count your weekdays in the calendar and subtract the holidays that fall on them. As an estimate, scale the five-day figure pro rata; the calculator does that for four or three days a week. Holidays falling on your usual days off do not reduce your leave or your pay.' },
    ],
    body: (h) => `<h2>Working days 2027 by province</h2>
<p>The 13 statutory holidays apply everywhere under ${h.src('arg7', 'section 7 of the Rest Periods Act')}. Differences only come from the patron saint's day, which closes schools and, depending on the collective agreement or service code, may also be a day off work. Under the ${h.src('schule-k', 'Carinthian Schools Act')} Carinthia has two such days, 19 March and 10 October.</p>
${tabelleLaender(h, Y)}
<h2>Working days by month</h2>
${h.table(['Month', 'Working days', 'Weeks'], m.map((x, i) => [MON('en', i), x, `${K.isoWeek(`${Y}-${String(i + 1).padStart(2, '0')}-01`).week}–${K.isoWeek(K.toIso(K.dayNum(Y, i + 2, 1) - 1)).week}`]), `Working days per month ${Y} in Vienna`, ['l', 'r', 'l'])}
<p>May has three holidays on weekdays; Labour Day falls on a Saturday and costs no working day. Holidays are paid like days worked (${h.src('arg9', 'section 9 of the Rest Periods Act')}), so a monthly salary does not change; an hourly wage or a day rate does.</p>
<h2>Planning with working days</h2>
<p>To derive a day rate from an annual amount, divide by working days minus leave: ${sum} working days less 25 days of leave leaves ${sum - 25}. Your leave is worked out on ${h.a('urlaubsanspruch', 'leave entitlement')}; the calendar with every week number is on ${h.a('kalender-2027', 'calendar 2027')}.</p>
${h.mini('at', { p: ['woche'], c: 'Working days for your province' })}`,
  },
});

/** Urlaubsanspruch en Autriche : UrlG §§ 2–4 (30/36 Werktage, première année, prescription). Chiffres : params + moteur. */
import { defineGuide } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const U = K.P.urlaub;
const tage = (wt: number, w: number) => (wt * w) / U.tageBasis;
const f25 = K.optimiere(2027, 'W', tage(U.werktage, 5)).frei, f30 = K.optimiere(2027, 'W', tage(U.werktageAb25, 5)).frei;
const f25_28 = K.optimiere(2028, 'W', tage(U.werktage, 5)).frei;

export default defineGuide({
  id: 'urlaubsanspruch', group: 'werkzeuge', order: 6, tool: 'ua', toolArg: { jahr: 2027 },
  related: ['home', 'karfreitag', 'arbeitstage-2027', 'fenstertage-2028'],
  sources: ['urlg2', 'urlg3', 'urlg4', 'urlg5', 'arg7a'],
  de: {
    slug: 'urlaubsanspruch', nav: 'Urlaubsanspruch', card: '30 Werktage, auch in Teilzeit umgerechnet',
    title: 'Urlaubsanspruch Österreich 2027: 25 oder 30 Tage, Teilzeit',
    description: 'Urlaubsanspruch in Österreich nach dem Urlaubsgesetz: 30 Werktage, also 25 Arbeitstage in der Fünftagewoche, 36 ab dem 26. Dienstjahr, Teilzeit und erstes Jahr.',
    h1: 'Urlaubsanspruch in Österreich: wie viele Tage Ihnen zustehen',
    intro: 'Arbeitstage pro Woche und Dienstjahre wählen: Der Rechner zeigt Ihren gesetzlichen Urlaub und wie viele freie Tage er mit klug gelegten Fenstertagen bringt.',
    resume: `Nach § 2 des Urlaubsgesetzes stehen Arbeitnehmerinnen und Arbeitnehmern in Österreich jedes Arbeitsjahr ${U.werktage} Werktage bezahlter Urlaub zu, nach Vollendung des 25. Dienstjahres ${U.werktageAb25}. Das Gesetz zählt dabei Montag bis Samstag als Werktage, also sechs pro Woche. In der üblichen Fünftagewoche sind das ${tage(U.werktage, 5)} Arbeitstage, ab dem 26. Dienstjahr ${tage(U.werktageAb25, 5)}: fünf beziehungsweise sechs Wochen. Bei vier Tagen pro Woche ergibt die Umrechnung ${tage(U.werktage, 4)} Tage, bei drei Tagen ${tage(U.werktage, 3)}; frei sind immer fünf Wochen. Im ersten Arbeitsjahr wächst der Anspruch in den ersten sechs Monaten anteilig, danach besteht er in voller Höhe; ab dem zweiten Jahr entsteht er jeweils zu Beginn des Arbeitsjahres. Für die sechste Woche zählen Zeiten bei früheren Arbeitgebern höchstens fünf Jahre, Schulzeiten bis zu zwei weitere. Nicht verbrauchter Urlaub verjährt erst ${U.verjaehrungJahre} Jahre nach dem Ende des Urlaubsjahres. Mit ${tage(U.werktage, 5)} Urlaubstagen, alle auf Brücken gelegt, kommen Sie 2027 in Wien auf ${f25} freie Tage am Stück, 2028 auf ${f25_28}.`,
    faqs: [
      { q: 'Wie viele Urlaubstage habe ich in Österreich?', a: `${U.werktage} Werktage pro Arbeitsjahr, das sind ${tage(U.werktage, 5)} Arbeitstage in der Fünftagewoche. Nach 25 Dienstjahren steigt der Anspruch auf ${U.werktageAb25} Werktage, also ${tage(U.werktageAb25, 5)} Arbeitstage. Kollektivvertrag oder Arbeitsvertrag können mehr vorsehen, aber nicht weniger. In den ersten sechs Monaten eines Arbeitsverhältnisses entsteht der Anspruch nur anteilig, danach voll.` },
      { q: 'Wie viel Urlaub habe ich bei Teilzeit?', a: `Gleich viele Wochen, umgerechnet auf Ihre Arbeitstage: Werktage mal Arbeitstage pro Woche, geteilt durch sechs. Bei vier Tagen sind das ${tage(U.werktage, 4)}, bei drei Tagen ${tage(U.werktage, 3)}, bei zwei Tagen ${tage(U.werktage, 2)} Urlaubstage. Arbeiten Sie an unterschiedlich vielen Tagen, rechnen viele Betriebe in Stunden.` },
      { q: 'Wie viel Urlaub habe ich im ersten Jahr?', a: 'In den ersten sechs Monaten entsteht der Anspruch im Verhältnis zur zurückgelegten Dienstzeit; nach drei Monaten haben Sie also ein Viertel des Jahresurlaubs. Nach sechs Monaten steht Ihnen der ganze Jahresurlaub zu. Ab dem zweiten Arbeitsjahr entsteht der volle Anspruch jeweils am ersten Tag des Arbeitsjahres.' },
      { q: 'Wann verfällt mein Urlaub?', a: `Urlaub verjährt nach § 4 Abs. 5 Urlaubsgesetz ${U.verjaehrungJahre} Jahre nach dem Ende des Urlaubsjahres, in dem er entstanden ist. Urlaub aus dem Arbeitsjahr 2026 kann also bis Ende 2028 verbraucht werden. Elternkarenz verlängert die Frist. Den Zeitpunkt des Urlaubs vereinbaren Sie mit dem Arbeitgeber; einseitig anordnen darf er ihn nicht.` },
      { q: 'Ist der persönliche Feiertag zusätzlicher Urlaub?', a: 'Nein. Der persönliche Feiertag nach § 7a Arbeitsruhegesetz ist ein Tag aus Ihrem normalen Urlaub, dessen Lage Sie ausnahmsweise selbst bestimmen dürfen, wenn Sie ihn drei Monate vorher schriftlich bekannt geben. Einen zusätzlichen freien Tag bringt er also nicht, nur eine sichere Wahl des Datums.' },
    ],
    body: (h) => `<h2>Urlaub nach Arbeitswoche</h2>
<p>Die Tabelle rechnet den Anspruch aus ${h.src('urlg2', '§ 2 Urlaubsgesetz')} auf die üblichen Arbeitswochen um.</p>
${h.table(['Arbeitstage pro Woche', 'bis 25 Dienstjahre', 'ab dem 26. Dienstjahr', 'Wochen frei'], [6, 5, 4, 3, 2, 1].map((w) => [w, h.n(tage(U.werktage, w), 0), h.n(tage(U.werktageAb25, w), 0), `5 / 6`]), 'Gesetzlicher Urlaub in Arbeitstagen nach Arbeitstagen pro Woche', ['r', 'r', 'r', 'r'])}
<h2>Die sechste Urlaubswoche</h2>
<p>Ab dem 26. Dienstjahr gibt es eine Woche mehr. Mitgezählt werden alle Zeiten beim selben Arbeitgeber, wenn die Unterbrechungen jeweils kürzer als drei Monate waren. Zeiten bei anderen Arbeitgebern, sofern sie mindestens sechs Monate dauerten, rechnet ${h.src('urlg3', '§ 3 Urlaubsgesetz')} höchstens mit fünf Jahren an; eine höhere Schule nach der Schulpflicht mit bis zu zwei weiteren Jahren. Viele Kollektivverträge gehen darüber hinaus.</p>
<h2>Urlaub vereinbaren und verbrauchen</h2>
<p>Wann Sie Urlaub nehmen, vereinbaren Sie mit dem Arbeitgeber (${h.src('urlg4', '§ 4 Urlaubsgesetz')}); er soll möglichst im laufenden Urlaubsjahr verbraucht werden. Erkranken Sie während des Urlaubs länger als drei Kalendertage, werden die Krankheitstage nach ${h.src('urlg5', '§ 5 Urlaubsgesetz')} nicht als Urlaub gezählt. Einen einzigen Tag pro Jahr dürfen Sie selbst festlegen: den ${h.a('karfreitag', 'persönlichen Feiertag')} nach ${h.src('arg7a', '§ 7a Arbeitsruhegesetz')}.</p>
<h2>Was der Urlaub an Fenstertagen bringt</h2>
<p>Mit ${tage(U.werktage, 5)} Urlaubstagen kommen Sie 2027 in Wien auf ${f25} freie Tage, wenn alle auf Brücken liegen; mit ${tage(U.werktageAb25, 5)} Tagen auf ${f30}. In der Praxis legt man einen Teil auf Fenstertage und den Rest in den Sommer. Der ${h.a('home', 'Fenstertage-Planer')} zeigt den besten Plan für jede Zahl.</p>
${h.mini('bt', { p: ['urlaub'], d: { jahr: 2027, urlaub: 8 }, c: 'Urlaub auf Fenstertage legen' })}`,
  },
  en: {
    slug: 'annual-leave-austria', nav: 'Leave entitlement', card: '30 working days, converted for part-time',
    title: 'Annual leave in Austria 2027: 25 or 30 days, part-time too',
    description: "Annual leave in Austria under the Leave Act: 30 working days, i.e. 25 on a five-day week, 36 from the 26th year of service; part-time and first year explained.",
    h1: 'Annual leave in Austria: how many days you get',
    intro: 'Choose your working days per week and years of service: the calculator shows your statutory leave and how many days off it buys with well-placed bridge days.',
    resume: `Under section 2 of Austria's Leave Act (Urlaubsgesetz), employees get ${U.werktage} working days of paid leave for each working year, rising to ${U.werktageAb25} once they have completed 25 years of service. The act counts Monday to Saturday as working days, six a week. On the usual five-day week that is ${tage(U.werktage, 5)} days, or ${tage(U.werktageAb25, 5)} from the 26th year: five or six weeks. Four days a week converts to ${tage(U.werktage, 4)} days and three days to ${tage(U.werktage, 3)}; the time off is always five weeks. In the first working year the entitlement builds up pro rata for six months and is then due in full; from the second year it arises in full at the start of each working year. For the sixth week, earlier employers count for at most five years and schooling for up to two more. Unused leave only becomes time-barred ${U.verjaehrungJahre} years after the end of the leave year. With ${tage(U.werktage, 5)} leave days all placed on bridges, you reach ${f25} days off in Vienna in 2027 and ${f25_28} in 2028.`,
    faqs: [
      { q: 'How many days of annual leave do I get in Austria?', a: `${U.werktage} working days per working year, which is ${tage(U.werktage, 5)} days on a five-day week. After 25 years of service it rises to ${U.werktageAb25} working days, ${tage(U.werktageAb25, 5)} on a five-day week. A collective agreement or your contract can give more, never less.` },
      { q: 'How much leave do part-time employees get?', a: `The same number of weeks, converted to your working days: statutory days times your days per week, divided by six. Four days give ${tage(U.werktage, 4)}, three days ${tage(U.werktage, 3)}, two days ${tage(U.werktage, 2)} leave days. If your days vary, many employers count in hours.` },
      { q: 'How much leave do I get in my first year?', a: 'During the first six months the entitlement builds up in proportion to the time worked, so after three months you have a quarter of the annual leave. After six months the full annual leave is due. From the second working year the full entitlement arises on the first day of each working year.' },
      { q: 'When does my leave expire?', a: `Under section 4(5) of the Leave Act, leave becomes time-barred ${U.verjaehrungJahre} years after the end of the leave year in which it arose. Leave from the 2026 working year can therefore be used until the end of 2028. Parental leave extends the period.` },
      { q: 'Is the personal holiday extra leave?', a: 'No. The personal holiday under section 7a of the Rest Periods Act is one day of your normal leave whose timing you may set yourself, provided you give written notice three months ahead. So it brings no extra day off, only a guaranteed choice of date.' },
    ],
    body: (h) => `<h2>Leave by working week</h2>
<p>The table converts the entitlement in ${h.src('urlg2', 'section 2 of the Leave Act')} to the usual working weeks.</p>
${h.table(['Working days per week', 'up to 25 years', 'from year 26', 'Weeks off'], [6, 5, 4, 3, 2, 1].map((w) => [w, h.n(tage(U.werktage, w), 0), h.n(tage(U.werktageAb25, w), 0), `5 / 6`]), 'Statutory leave in working days by days worked per week', ['r', 'r', 'r', 'r'])}
<h2>The sixth week of leave</h2>
<p>From the 26th year of service you get one more week. All periods with the same employer count, provided each break was shorter than three months. Periods with other employers, if each lasted at least six months, count for at most five years under ${h.src('urlg3', 'section 3 of the Leave Act')}; secondary schooling after compulsory education counts for up to two more years. Many collective agreements go further.</p>
<h2>Agreeing and taking leave</h2>
<p>You agree the timing of leave with your employer (${h.src('urlg4', 'section 4 of the Leave Act')}); it should be used within the current leave year where possible. If you are ill for more than three calendar days during your leave, the sick days do not count as leave under ${h.src('urlg5', 'section 5 of the Leave Act')}. One single day a year you may fix yourself: the ${h.a('karfreitag', 'personal holiday')} under ${h.src('arg7a', 'section 7a of the Rest Periods Act')}.</p>
<h2>What your leave buys in bridge days</h2>
<p>With ${tage(U.werktage, 5)} leave days you reach ${f25} days off in Vienna in 2027 if every day goes on a bridge; with ${tage(U.werktageAb25, 5)} days, ${f30}. In practice people put part on bridge days and the rest into the summer. The ${h.a('home', 'bridge-day planner')} shows the best plan for any number.</p>
${h.mini('bt', { p: ['urlaub'], d: { jahr: 2027, urlaub: 8 }, c: 'Put your leave on bridge days' })}`,
  },
});

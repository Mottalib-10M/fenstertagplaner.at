/** Landesfeiertage et Landespatrone : jour par Land, statut exact (école oui, loi ARG non), sources des lois scolaires. */
import { defineGuide } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';
import { tabellePatrone } from '../../lib/bausteine';
import { dLong, wdLong } from '../../lib/tool-specs';

const dt = (y: number, m: number, d: number) => K.toIso(K.dayNum(y, m, d));
const josef27 = dt(2027, 3, 19), leopold27 = dt(2027, 11, 15), florian27 = dt(2027, 5, 4), rupert27 = dt(2027, 9, 24), martin27 = dt(2027, 11, 11), va27 = dt(2027, 10, 10);
const gain = (land: Parameters<typeof K.optimiere>[1]) => K.optimiere(2027, land, 10, { patron: true }).frei - K.optimiere(2027, land, 10).frei;
const GAIN = (l: 'de' | 'en') => {
  const pos = K.LAENDER.filter((x) => gain(x) > 0), zero = K.LAENDER.filter((x) => gain(x) <= 0);
  const names = (xs: typeof pos) => xs.map((x) => `${K.LAND_NAME[x][l]} ${gain(x)}`).join(', ');
  const z = zero.map((x) => K.LAND_NAME[x][l]).join(', ');
  return l === 'de' ? `freie Tage dazu: ${names(pos)}${zero.length ? `; in ${z} ändert er das Ergebnis mit zehn Urlaubstagen nicht` : ''}` : `extra days off: ${names(pos)}${zero.length ? `; in ${z} it does not change the result for ten leave days` : ''}`;
};

export default defineGuide({
  id: 'landesfeiertage', group: 'feiertage', order: 15, tool: 'lp', toolArg: { jahr: 2027, land: 'K' },
  related: ['feiertage-2027', 'schulautonome-tage', 'feiertage-kaernten', 'feiertage-niederoesterreich'],
  sources: ['arg7', 'schzg2', 'schule-b', 'schule-k', 'schule-noe', 'noe-lv7', 'schule-ooe', 'schule-s', 'schule-st', 'schule-t', 'schule-v', 'schule-w'],
  de: {
    slug: 'landesfeiertage', nav: 'Landesfeiertage und Landespatrone', card: 'Schulfrei, aber kein gesetzlicher Feiertag',
    title: 'Landesfeiertage Österreich 2027: Landespatrone je Bundesland',
    description: 'Landesfeiertage in Österreich 2027: der Tag des Landespatrons in jedem Bundesland mit Datum und Wochentag. Schulfrei laut Gesetz, kein gesetzlicher Feiertag.',
    h1: 'Landesfeiertage und Landespatrone in Österreich',
    intro: 'Wann ist in Ihrem Bundesland der Tag des Landespatrons, und wer hat frei? Der Rechner zeigt alle neun Tage mit Wochentag und was der Tag für Ihre Brücken bringt.',
    resume: `Jedes österreichische Bundesland hat einen Landespatron: den heiligen Martin im Burgenland am 11. November, den heiligen Josef am 19. März in Kärnten, der Steiermark, Tirol und Vorarlberg, den heiligen Leopold am 15. November in Niederösterreich und Wien, den heiligen Florian am 4. Mai in Oberösterreich und den heiligen Rupert am 24. September in Salzburg. Kärnten kennt zusätzlich den 10. Oktober, den Tag der Volksabstimmung von 1920. Niederösterreich nennt den 15. November in seiner Landesverfassung ausdrücklich Landesfeiertag. Wichtig für die Planung: Keiner dieser Tage ist ein gesetzlicher Feiertag nach dem Arbeitsruhegesetz. Gesichert schulfrei sind sie, weil § 2 Schulzeitgesetz und die Schulgesetze der Länder den Tag des Landespatrons ausdrücklich nennen. Ob Erwachsene frei haben, hängt am Kollektivvertrag, an einer Betriebsvereinbarung oder am Dienstrecht; im Handel und in vielen Betrieben wird gearbeitet. 2027 fällt der 19. März auf einen ${wdLong(josef27, 'de')}, der 4. Mai auf einen ${wdLong(florian27, 'de')}, der 24. September auf einen ${wdLong(rupert27, 'de')}, der 10. Oktober auf einen ${wdLong(va27, 'de')}, der 11. November auf einen ${wdLong(martin27, 'de')} und der 15. November auf einen ${wdLong(leopold27, 'de')}.`,
    faqs: [
      { q: 'Ist der Landespatron ein Feiertag?', a: 'Nicht im Sinne des Arbeitsruhegesetzes. Die 13 gesetzlichen Feiertage in § 7 ARG gelten bundesweit, ein Landespatron gehört nicht dazu. Schulfrei ist der Tag aber in jedem Bundesland, und viele Kollektivverträge oder Dienstrechte geben ihn frei. Prüfen Sie Ihren Kollektivvertrag.' },
      { q: 'Ist der 15. November in Wien frei?', a: `Für die Schulen ja: Das Wiener Schulgesetz nennt den 15. November als schulfreien Tag. Für Beschäftigte ist er kein gesetzlicher Feiertag. In Niederösterreich ist der Leopolditag Landesfeiertag nach der Landesverfassung, arbeitsrechtlich aber ebenso wenig ein Feiertag. 2027 fällt der 15. November auf einen ${wdLong(leopold27, 'de')}.` },
      { q: 'Haben Schulen in Oberösterreich am 4. Mai frei?', a: `Ja. Das Oö. Schulzeitgesetz nennt den 4. Mai, den Tag des heiligen Florian, als schulfrei. 2027 ist das ein ${wdLong(florian27, 'de')}, zwei Tage vor Christi Himmelfahrt. Wer am Landespatron frei hat und Montag, Mittwoch und den Freitag nach Christi Himmelfahrt dazunimmt, ist mit drei Urlaubstagen vom 1. bis 9. Mai frei, neun Tage.` },
      { q: 'Was ist am 10. Oktober in Kärnten?', a: 'Der Tag der Volksabstimmung erinnert an das Plebiszit vom 10. Oktober 1920, mit dem Südkärnten bei Österreich blieb. Das Kärntner Schulgesetz nennt ihn neben dem 19. März als schulfreien Tag. Ein gesetzlicher Feiertag für Arbeitnehmerinnen und Arbeitnehmer ist er nicht.' },
    ],
    body: (h) => `<h2>Alle Landespatrone 2027</h2>
${tabellePatrone(h, 2027)}
<p>Die Tage stehen in den Schulgesetzen der Länder: ${h.src('schule-b', 'Burgenland')}, ${h.src('schule-k', 'Kärnten')}, ${h.src('schule-noe', 'Niederösterreich')}, ${h.src('schule-ooe', 'Oberösterreich')}, ${h.src('schule-s', 'Salzburg')}, ${h.src('schule-st', 'Steiermark')}, ${h.src('schule-t', 'Tirol')}, ${h.src('schule-v', 'Vorarlberg')} und ${h.src('schule-w', 'Wien')}. Für die Bundesschulen verweist ${h.src('schzg2', '§ 2 Abs. 4 Schulzeitgesetz')} auf den Festtag des Landespatrons und den Landesfeiertag, wenn er im Land arbeitsfrei begangen wird. Salzburg gibt zusätzlich den 25. September frei, wenn er auf einen Samstag fällt.</p>
<h2>Schulfrei, arbeitsfrei, beides?</h2>
<p>Für die Schule gilt der Tag immer. Für den Arbeitsplatz ist entscheidend, was Kollektivvertrag, Betriebsvereinbarung oder Dienstrecht sagen; die Liste der gesetzlichen Feiertage in ${h.src('arg7', '§ 7 ARG')} enthält keinen Landespatron. Eltern stehen daher oft vor einem schulfreien Tag, an dem sie selbst arbeiten. Mit einem Urlaubstag lässt sich das lösen, oder mit dem ${h.a('karfreitag', 'persönlichen Feiertag')}.</p>
<h2>Was der Landespatron an Brücken bringt</h2>
<p>Ist der Tag bei Ihnen frei, verlängert er 2027 manche Brücke. Mit zehn Urlaubstagen gewinnen Sie ${GAIN('de')}. Der Planer rechnet das, wenn Sie unter „Weitere Angaben“ den Landespatron als frei markieren.</p>
${h.mini('bt', { p: ['land', 'urlaub'], d: { jahr: 2027, lp: 'frei' }, c: 'Brücken mit freiem Landespatron' })}`,
  },
  en: {
    slug: 'provincial-holidays', nav: "Provincial holidays and patron saints", card: 'No school, but not a statutory holiday',
    title: "Provincial holidays Austria 2027: patron saints' days",
    description: "Provincial holidays in Austria 2027: the patron saint's day of every province with date and weekday. Schools close by provincial law; not a statutory holiday.",
    h1: "Provincial holidays and patron saints' days in Austria",
    intro: "When is your province's patron saint's day, and who gets it off? The calculator shows all nine days with their weekday and what each adds to your bridges.",
    resume: `Every Austrian province has a patron saint: St Martin in Burgenland on 11 November, St Joseph on 19 March in Carinthia, Styria, Tyrol and Vorarlberg, St Leopold on 15 November in Lower Austria and Vienna, St Florian on 4 May in Upper Austria and St Rupert on 24 September in Salzburg. Carinthia also marks 10 October, the day of the 1920 plebiscite. Lower Austria's constitution expressly calls 15 November its provincial holiday. What matters for planning: none of these days is a statutory holiday under the Rest Periods Act. They are certain school days off, because section 2 of the School Hours Act and the provincial school acts name the patron saint's day expressly. Whether adults get the day off depends on the collective agreement, a works agreement or the civil-service code; shops and many businesses work as usual. In 2027, 19 March falls on a ${wdLong(josef27, 'en')}, 4 May on a ${wdLong(florian27, 'en')}, 24 September on a ${wdLong(rupert27, 'en')}, 10 October on a ${wdLong(va27, 'en')}, 11 November on a ${wdLong(martin27, 'en')} and 15 November on a ${wdLong(leopold27, 'en')}.`,
    faqs: [
      { q: "Is the patron saint's day a public holiday?", a: 'Not under the Rest Periods Act. The 13 statutory holidays in section 7 ARG are national and do not include any patron saint. Schools close in every province, though, and many collective agreements or service codes give the day off. Check your collective agreement.' },
      { q: 'Is 15 November a day off in Vienna?', a: `For schools, yes: the Vienna Schools Act lists 15 November as a day without school. For employees it is not a statutory holiday. In Lower Austria, St Leopold's Day is the provincial holiday under the provincial constitution, but under employment law it is no holiday either. In 2027, 15 November is a ${wdLong(leopold27, 'en')}.` },
      { q: 'Do schools in Upper Austria close on 4 May?', a: `Yes. The Upper Austria School Hours Act lists 4 May, St Florian's Day, as a day without school. In 2027 it is a ${wdLong(florian27, 'en')}, two days before Ascension Day. If you get the day off at work, adding the Monday, the Wednesday and the Friday after Ascension Day gives nine days off from 1 to 9 May for three leave days.` },
      { q: 'What happens on 10 October in Carinthia?', a: 'Plebiscite Day recalls the vote of 10 October 1920 by which southern Carinthia stayed with Austria. The Carinthian Schools Act lists it, alongside 19 March, as a day without school. It is not a statutory holiday for employees. In 2027 it falls on a Sunday.' },
    ],
    body: (h) => `<h2>Every patron saint's day in 2027</h2>
${tabellePatrone(h, 2027)}
<p>The days are set in the provincial school acts: ${h.src('schule-b', 'Burgenland')}, ${h.src('schule-k', 'Carinthia')}, ${h.src('schule-noe', 'Lower Austria')}, ${h.src('schule-ooe', 'Upper Austria')}, ${h.src('schule-s', 'Salzburg')}, ${h.src('schule-st', 'Styria')}, ${h.src('schule-t', 'Tyrol')}, ${h.src('schule-v', 'Vorarlberg')} and ${h.src('schule-w', 'Vienna')}. For federal schools, ${h.src('schzg2', 'section 2(4) of the School Hours Act')} refers to the patron saint's feast and the provincial holiday where it is kept as a day off. Salzburg also closes schools on 25 September when it falls on a Saturday.</p>
<h2>No school, no work, or both?</h2>
<p>The school closure always applies. At work, what counts is your collective agreement, works agreement or service code; the list of statutory holidays in ${h.src('arg7', 'section 7 ARG')} contains no patron saint. Parents therefore often face a school closure on a day they work. A leave day solves it, or the ${h.a('karfreitag', 'personal holiday')}.</p>
<h2>What the patron saint's day adds to your bridges</h2>
<p>If the day is off for you, it lengthens some bridges in 2027. With ten leave days you gain ${GAIN('en')}. The planner includes this when you mark the patron saint's day as off under "More details".</p>
${h.mini('bt', { p: ['land', 'urlaub'], d: { jahr: 2027, lp: 'frei' }, c: 'Bridges with the patron saint off' })}`,
  },
});
void dLong;

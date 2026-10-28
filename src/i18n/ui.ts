import type { Locale } from './routes';
const de = {
  updatedOn: 'Aktualisiert am', editorialPolicy: 'Redaktionsgrundsätze', contactLabel: 'Kontakt', reviewedBy: 'Erstellt von',
  skipToContent: 'Zum Inhalt springen', mainNav: 'Hauptnavigation', breadcrumbLabel: 'Brotkrumen', breadcrumbHome: 'Start', menuOpen: 'Menü öffnen',
  faqTitle: 'Häufige Fragen', relatedCalculators: 'Weiter mit', sourcesTitle: 'Amtliche Quellen dieser Seite', writtenBy: 'Erstellt von',
  asOf: 'Stand', lastUpdated: 'Arbeitsruhegesetz und Schulzeitgesetze geprüft am', footerValidated: 'Quellen: Arbeitsruhegesetz, Feiertagsruhegesetz 1957, Urlaubsgesetz, Schulzeitgesetz 1985 und Landesschulgesetze, Sommerzeitverordnungen, alle im RIS',
  footerBrowser: 'Alles läuft in Ihrem Browser · nichts, was Sie eingeben, wird gesendet oder gespeichert · kein Konto',
  footerDisclaimer: 'Unabhängige Seite von Radif Partners, ohne Verbindung zur Bundesregierung, einer Landesregierung, einer Bildungsdirektion oder einer Interessenvertretung. Für Ihr Arbeitsverhältnis gelten zusätzlich Kollektivvertrag und Betriebsvereinbarung; die Seite ersetzt keine Rechtsberatung.',
  footerPopular: 'Werkzeuge',
  notFound: 'Unter dieser Adresse gibt es keine Seite. Auf der Startseite finden Sie den Fenstertage-Planer, die Feiertage aller neun Bundesländer und den Kalender.',
  readMore: 'Weiterlesen',
  moreOptions: 'Weitere Angaben', copyLink: 'Link kopieren', copied: 'Link kopiert', print: 'Drucken', howComputed: 'So wird gerechnet', openFull: 'Zum vollständigen Werkzeug',
  countdownTo: 'Noch bis', days: 'Tage', hours: 'Std.', minutes: 'Min.', seconds: 'Sek.', tzNote: 'Rechnet mit der Uhr Ihres Geräts, Zeitzone', passed: 'Dieser Termin liegt hinter uns.',
};
const en: typeof de = {
  updatedOn: 'Updated on', editorialPolicy: 'Editorial policy', contactLabel: 'Contact', reviewedBy: 'Prepared by',
  skipToContent: 'Skip to content', mainNav: 'Main navigation', breadcrumbLabel: 'Breadcrumb', breadcrumbHome: 'Home', menuOpen: 'Open menu',
  faqTitle: 'Common questions', relatedCalculators: 'Keep going', sourcesTitle: 'Official sources for this page', writtenBy: 'Prepared by',
  asOf: 'As of', lastUpdated: 'Austrian Rest Periods Act and school hours acts checked on', footerValidated: 'Sources: Rest Periods Act, Public Holiday Rest Act 1957, Leave Act, School Hours Act 1985 and provincial school acts, summer-time ordinances, all on RIS',
  footerBrowser: 'Everything runs in your browser · nothing you type is sent or stored · no account',
  footerDisclaimer: 'Independent site published by Radif Partners, not affiliated with the Austrian federal or provincial governments, any education directorate or any chamber. Collective and works agreements may add to your contract; this site does not replace legal advice.',
  footerPopular: 'Tools',
  notFound: 'Nothing lives at this address. The home page has the bridge-day planner, the public holidays of all nine Austrian provinces and the calendar.',
  readMore: 'Read more',
  moreOptions: 'More details', copyLink: 'Copy share link', copied: 'Link copied', print: 'Print', howComputed: 'How this is calculated', openFull: 'Open the full tool',
  countdownTo: 'Time left until', days: 'days', hours: 'hrs', minutes: 'min', seconds: 'sec', tzNote: 'Uses your device clock, time zone', passed: 'This date has passed.',
};
const ALL = { de, en };
export function t(lang: Locale) { return ALL[lang] ?? de; }

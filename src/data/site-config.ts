/** Configuration centrale du site (générée par new-site.py). */
export const SITE_URL = "https://at-fenstertage.example";
export const SITE_NAMES: Record<string, string> = {"de": "AT Fenstertage", "en": "AT Fenstertage"};
// Partie du nom affichée en couleur dans l'en-tête (RECETTE §10.3), « » pour aucune.
export const BRAND_ACCENT = "Fenstertage";
/** Locale des nombres et des dates : allemand d'Autriche (« Jänner ») et anglais britannique. */
export const NUM_TAGS: Record<string, string> = {"de": "de-AT", "en": "en-GB"};
export const LANG_TAGS: Record<string, string> = {"de": "de-AT", "en": "en-AT"};
export const OG_LOCALES: Record<string, string> = {"de": "de_AT", "en": "en_GB"};
export const LOCALE_TAG = 'de-AT';
export const CURRENCY = 'EUR';
export const YEAR = 2026;
/** Année de création du site — signal d'ancienneté (RECETTE §8.0). */
export const SITE_FOUNDED = '2026';
export const LAST_UPDATED = '2026-10-28';
export const AUTHOR_NAME = 'Radif Partners';
export const AUTHOR_ROLE: Record<string, string> = {"de": "Herausgeber eines unabhängigen Fenstertage-Planers, der Arbeitsruhegesetz, Feiertagsruhegesetz und Schulzeitgesetz für ganz Österreich nachrechnet", "en": "Publisher of an independent Austrian bridge-day planner that works through the Rest Periods Act, the Public Holidays Act and the School Hours Act"};
export const AUTHOR_DESC: Record<string, string> = {"de": "Radif Partners liest § 7 und § 7a Arbeitsruhegesetz, das Feiertagsruhegesetz 1957, die Sommerzeitverordnungen der Bundesregierung und § 2 Schulzeitgesetz im RIS, rechnet Ostern nach der Gaußschen Formel und legt daraus Fenstertage, Arbeitstage, Landespatrone und Kalender für 2026 bis 2028 an. Gerechnet wird im Browser. Wir verkaufen keine Reisen, keine Hotels und keine Kalender.", "en": "Radif Partners reads sections 7 and 7a of Austria's Rest Periods Act, the 1957 Public Holidays Act, the federal summer-time ordinances and section 2 of the School Hours Act on RIS, computes Easter with Gauss's formula and derives bridge days, working days, patron saints' days and calendars for 2026 to 2028. The arithmetic runs in your browser. We sell no trips, no hotels and no calendars."};
/** Sujets sur lesquels l'editeur est competent (schema.org knowsAbout). Ce sont les
 *  themes reellement traites par le site, pas une liste de mots-cles : un sujet
 *  declare ici sans page qui le couvre est une declaration fausse. */
export const KNOWS_ABOUT: Record<string, string[]> = {"de": ["Gesetzliche Feiertage in Österreich (§ 7 ARG)", "Fenstertage und Urlaubsplanung", "Landespatrone der neun Bundesländer", "Sommerzeit und Zeitumstellung in Österreich", "Arbeitstage und Kalenderwochen nach ISO 8601"], "en": ["Statutory public holidays in Austria", "Bridge days and leave planning", "Patron saints' days of the nine Austrian provinces", "Daylight saving time in Austria", "Working days and ISO 8601 week numbers"]};
export const CONTACT_EMAIL = "kontakt@at-fenstertage.example";
export const THEME_COLOR = '#C8102E';
export const LOGO_SYMBOL = 'FT';
export const BING_VERIFY_CODE = '';
export const GOOGLE_VERIFY_CODE = '';
/** Régime : 'none' pour tous les sites (RECETTE §15.6, décision de l'éditeur du 2026-10-06) :
 *  aucun bandeau ; Clarity chargé en mode sans cookie (consentv2 denied) ; GA4 avec cookies si GA4_ID.
 *  'opt-in' / 'notice' ne servent plus qu'aux sites anciens qui les portent encore. */
export const CONSENT_MODE: 'opt-in' | 'notice' | 'none' = 'none';
/** Propriété Google Analytics 4 (décision de l'éditeur du 2026-10-17, RECETTE §15.6) : GA4 normal,
 *  avec cookies _ga / _ga_<ID> (390 jours), sans bandeau, publicité refusée. Créée par
 *  `seo-platform/scripts/create-ga4.ts accounts/372759688` (RECETTE §15.3, étape 15), puis
 *  pages légales régénérées : `python3 scripts/gen-legal-pages.py .`. Vide = pas de GA4. */
export const GA4_ID = '';
/** Projet Microsoft Clarity (compte amradif), chargé sans cookie. Vide = aucune mesure. */
export const CLARITY_ID = '';
export const INDEXNOW_KEY = 'ca62e80fd989bad3de21dcdc608e1556';

/* ------------------------------------------------------------------------- *
 * IDENTITÉ LÉGALE — À COMPLÉTER AVANT LA MISE EN LIGNE
 * Ces champs alimentent la mention légale du pays, la politique de confidentialité,
 * la page contact et le schema Organization. Un champ vide s'affiche en jaune
 * sur le site. Contrôle : `npm run check:legal`.
 * ------------------------------------------------------------------------- */
export interface LegalHosting { name: string; address: string; phone: string; url: string }
export interface LegalIdentity {
  entityName: string; legalForm: string; street: string; postalCode: string; city: string;
  country: string; phone: string; registerLabel: string; registerNumber: string;
  vatLabel: string; vatNumber: string; jurisdiction: string;
  supervisoryAuthority: string; supervisoryAuthorityUrl: string; hosting: LegalHosting;
}
export const LEGAL: LegalIdentity = {
  entityName: 'Radif Partners',  // éditeur de tous les sites du portefeuille (RECETTE §8)
  legalForm: '',  // vide : comme les autres sites du portefeuille
  street: '49 rue du Ressort',
  postalCode: '63000',
  city: 'Clermont-Ferrand',
  country: "Frankreich / France",
  phone: '',                 // ligne de contact publiée
  registerLabel: "SIREN",
  registerNumber: '',
  vatLabel: "UID-Nr.",
  vatNumber: '',             // laisser vide si non assujetti
  jurisdiction: "France",
  supervisoryAuthority: "Commission nationale de l'informatique et des libertés (CNIL)",
  supervisoryAuthorityUrl: "https://www.cnil.fr",
  hosting: { name: 'GitHub, Inc. (GitHub Pages)', address: '88 Colin P Kelly Jr Street, San Francisco, CA 94107, United States', phone: '', url: 'https://pages.github.com' },
};

/** Champs sans lesquels le site ne doit pas être mis en ligne. */
export const LEGAL_REQUIRED: Array<keyof LegalIdentity> = ['entityName', 'street', 'postalCode', 'city']; // legalForm vide à dessein, comme les autres sites du portefeuille

/** Profils publics de l'auteur (schema.org sameAs). Laisser vide si aucun. */
export const AUTHOR_SAME_AS: string[] = [];

/** Rythme de revue éditoriale annoncé sur le site, en mois. */
export const REVIEW_CYCLE_MONTHS = 12;

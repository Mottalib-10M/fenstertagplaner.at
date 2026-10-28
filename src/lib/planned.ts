/** Toutes les pages prévues (id = nom du fichier de src/content/guides, ou id d'une entrée d'un fichier à plusieurs pages).
 *  Les tests acceptent un lien vers ces ids pendant la rédaction ; « toutes les pages existent » échoue tant qu'il en manque. */
export const LAND_IDS = ['feiertage-burgenland', 'feiertage-kaernten', 'feiertage-niederoesterreich', 'feiertage-oberoesterreich', 'feiertage-salzburg', 'feiertage-steiermark', 'feiertage-tirol', 'feiertage-vorarlberg', 'feiertage-wien'];
export const PLANNED_GUIDES = [
  'fenstertage-2026', 'fenstertage-2028', 'arbeitstage-2027', 'urlaubsanspruch', 'schulautonome-tage', 'naechster-feiertag',
  'feiertage-2026', 'feiertage-2027', 'feiertage-2028', 'karfreitag', 'landesfeiertage', 'kalender-2027', 'kalender-2028',
  ...LAND_IDS,
  'ostern-2027', 'pfingsten-2027', 'zeitumstellung',
];
export const PLANNED_IDS = new Set<string>([...PLANNED_GUIDES, 'home', 'method', 'about', 'widget', 'contact', 'editorial', 'privacy', 'terms', 'cookies']);

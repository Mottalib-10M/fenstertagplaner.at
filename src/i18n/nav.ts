import { route, hasRoute, type Locale } from './routes';
import { GUIDES, guideById } from '../lib/pages';
import type { Group } from '../lib/page-types';
export interface NavLink { href: string; label: string } export interface NavCategory { label: string; links: NavLink[] }
const CORE: Record<Locale, Record<string, string>> = {
  de: { home: 'Fenstertage 2027', method: 'Methode', about: 'Über uns', widget: 'Werkzeuge einbinden', contact: 'Kontakt', editorial: 'Redaktionsgrundsätze', privacy: 'Datenschutz', terms: 'Impressum', cookies: 'Cookies' },
  en: { home: 'Bridge days 2027', method: 'Method', about: 'About', widget: 'Embed the tools', contact: 'Contact', editorial: 'Editorial policy', privacy: 'Privacy', terms: 'Legal notice', cookies: 'Cookies' },
};
/** `short` : intitulé du menu du haut (un ou deux mots, RECETTE §10.3) ; `label` : intitulé complet. */
export const GROUPS: Array<{ id: Group; label: Record<Locale, string>; short: Record<Locale, string> }> = [
  { id: 'werkzeuge', label: { de: 'Fenstertage, Urlaub und Schule', en: 'Bridge days, leave and school' }, short: { de: 'Fenstertage', en: 'Bridge days' } },
  { id: 'feiertage', label: { de: 'Feiertage und Kalender', en: 'Holidays and calendars' }, short: { de: 'Feiertage', en: 'Holidays' } },
  { id: 'laender', label: { de: 'Feiertage nach Bundesland', en: 'Holidays by province' }, short: { de: 'Bundesländer', en: 'Provinces' } },
  { id: 'termine', label: { de: 'Termine im Jahr', en: 'Dates of the year' }, short: { de: 'Termine', en: 'Dates' } },
];
export const label = (id: string, lang: Locale) => CORE[lang][id] ?? guideById(id)?.[lang]?.nav ?? id;
const link = (id: string, lang: Locale): NavLink => ({ href: route(id, lang), label: label(id, lang) });
export const inGroup = (g: Group, lang: Locale): NavLink[] => GUIDES.filter((p) => p.group === g && hasRoute(p.id, lang)).map((p) => link(p.id, lang));
export function navCategories(lang: Locale, short = true): NavCategory[] {
  return GROUPS.map((g) => ({ label: (short ? g.short : g.label)[lang], links: g.id === 'werkzeuge' ? [link('home', lang), ...inGroup(g.id, lang)] : inGroup(g.id, lang) })).filter((c) => c.links.length);
}
/** La Méthode n'est pas dans le menu du haut (RECETTE §10.3) : sous le titre et en bas de page. */
export const navDirect = (_lang: Locale): NavLink[] => [];
export const footerColumns = (lang: Locale): NavCategory[] => {
  const site = { label: { de: 'Diese Seite', en: 'This site' }[lang], links: ['home', 'method', 'about', 'contact', 'editorial', 'widget', 'terms', 'privacy', 'cookies'].map((i) => link(i, lang)) };
  return [
    { label: GROUPS[1].label[lang], links: [...inGroup('feiertage', lang), ...inGroup('termine', lang)] },
    { label: GROUPS[2].label[lang], links: inGroup('laender', lang) },
    { label: GROUPS[0].label[lang], links: inGroup('werkzeuge', lang) },
    site,
  ];
};
/** Les outils, à un clic de toute page (RECETTE §18.2). */
export const popularLinks = (lang: Locale): NavLink[] => [link('home', lang), ...inGroup('werkzeuge', lang)];

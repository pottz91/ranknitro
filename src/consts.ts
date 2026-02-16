// Globale Daten für Ranknitro – SEO/GEO Agentur
export const SITE_TITLE = 'Ranknitro';
export const SITE_DESCRIPTION =
	'Ranknitro – SEO & GEO Agentur. Mehr Sichtbarkeit in Suchmaschinen durch strategisches Content-Marketing und technisches SEO.';

/** Startseite: Titel (ca. 50–60 Zeichen) und Meta-Description (max. 155 Zeichen). */
export const HOME_TITLE = 'Ranknitro – SEO & GEO Agentur';
export const HOME_DESCRIPTION =
	'SEO & GEO Agentur für mehr Sichtbarkeit in Google und KI-Systemen. Content-Marketing, technisches SEO und GEO-Strategie.';

/** Blog-Übersicht: Meta-Description (max. 155 Zeichen). */
export const BLOG_DESCRIPTION =
	'SEO, GEO und Suchmaschinen-Marketing: Tipps, Anleitungen und Strategien für bessere Rankings im Ranknitro-Blog.';
/** Basis-URL der Website (mit Trailing-Slash vermeiden; für Schema/Canonicals) */
export const SITE_URL = 'https://ranknitro.de';

/**
 * Endpoint zum Loggen der Cookie-Einwilligung (Einwilligungsnachweis).
 * Netlify: PUBLIC_CONSENT_LOG_URL = /.netlify/functions/consent-log (oder volle URL mit ranknitro.de).
 * Leer lassen = kein Logging.
 */
export const CONSENT_LOG_URL =
	(typeof import.meta.env !== 'undefined' && import.meta.env.PUBLIC_CONSENT_LOG_URL) || '';

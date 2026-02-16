// Globale Daten für Ranknitro – SEO/GEO Agentur
export const SITE_TITLE = 'Ranknitro';
export const SITE_DESCRIPTION =
	'Ranknitro – SEO & GEO Agentur. Mehr Sichtbarkeit in Suchmaschinen durch strategisches Content-Marketing und technisches SEO.';
/** Basis-URL der Website (mit Trailing-Slash vermeiden; für Schema/Canonicals) */
export const SITE_URL = 'https://ranknitro.de';

/**
 * Endpoint zum Loggen der Cookie-Einwilligung (Einwilligungsnachweis).
 * Netlify: PUBLIC_CONSENT_LOG_URL = /.netlify/functions/consent-log (oder volle URL mit ranknitro.de).
 * Leer lassen = kein Logging.
 */
export const CONSENT_LOG_URL =
	(typeof import.meta.env !== 'undefined' && import.meta.env.PUBLIC_CONSENT_LOG_URL) || '';

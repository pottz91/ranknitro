/**
 * Blog-Kategorien (Pillar Pages) – SEMrush-ähnliche Struktur
 * Hauptkategorie: SEO → Subkategorien (Pillar Pages)
 */

export const MAIN_CATEGORY_SLUG = 'seo' as const;
export const MAIN_CATEGORY_LABEL = 'SEO';

export const SUBCATEGORIES = [
	{ slug: 'keyword-recherche', label: 'Keyword Recherche' },
	{ slug: 'local-seo', label: 'Local SEO' },
	{ slug: 'onpage-seo', label: 'OnPage SEO' },
	{ slug: 'offpage-seo', label: 'OffPage SEO' },
	{ slug: 'technisches-seo', label: 'Technisches SEO' },
] as const;

export type SubcategorySlug = (typeof SUBCATEGORIES)[number]['slug'];

export function getSubcategoryBySlug(slug: string): (typeof SUBCATEGORIES)[number] | undefined {
	return SUBCATEGORIES.find((s) => s.slug === slug);
}

export function getAllSubcategorySlugs(): string[] {
	return SUBCATEGORIES.map((s) => s.slug);
}

/** Für Zod-Enum im Content-Schema */
export const SUBCATEGORY_SLUGS = [
	'keyword-recherche',
	'local-seo',
	'onpage-seo',
	'offpage-seo',
	'technisches-seo',
] as const;

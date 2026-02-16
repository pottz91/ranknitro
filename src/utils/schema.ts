/**
 * Schema.org JSON-LD Helfer – zentrale Strukturen für alle Seiten
 */

export type BreadcrumbItem = { name: string; url: string };

export function organizationSchema(siteUrl: string, name: string, description: string) {
	return {
		'@context': 'https://schema.org',
		'@type': 'Organization',
		name,
		url: siteUrl,
		description,
	};
}

export function webSiteSchema(siteUrl: string, name: string, description: string) {
	return {
		'@context': 'https://schema.org',
		'@type': 'WebSite',
		name,
		url: siteUrl,
		description,
		inLanguage: 'de-DE',
		publisher: { '@type': 'Organization', name, url: siteUrl },
	};
}

export function webPageSchema(
	siteUrl: string,
	url: string,
	name: string,
	description: string
) {
	return {
		'@context': 'https://schema.org',
		'@type': 'WebPage',
		url: url.startsWith('http') ? url : new URL(url, siteUrl).href,
		name,
		description,
		inLanguage: 'de-DE',
		isPartOf: { '@type': 'WebSite', url: siteUrl },
	};
}

export function breadcrumbListSchema(siteUrl: string, items: BreadcrumbItem[]) {
	return {
		'@context': 'https://schema.org',
		'@type': 'BreadcrumbList',
		itemListElement: items.map((item, i) => ({
			'@type': 'ListItem',
			position: i + 1,
			name: item.name,
			item: item.url.startsWith('http') ? item.url : new URL(item.url, siteUrl).href,
		})),
	};
}

export function blogSchema(
	siteUrl: string,
	name: string,
	description: string,
	blogUrl: string
) {
	return {
		'@context': 'https://schema.org',
		'@type': 'Blog',
		name,
		description,
		url: blogUrl.startsWith('http') ? blogUrl : new URL(blogUrl, siteUrl).href,
		inLanguage: 'de-DE',
		publisher: { '@type': 'Organization', name, url: siteUrl },
	};
}

export function blogPostingSchema(params: {
	siteUrl: string;
	url: string;
	headline: string;
	description: string;
	datePublished: string;
	dateModified?: string;
	imageUrl?: string;
	authorName: string;
}) {
	const {
		siteUrl,
		url,
		headline,
		description,
		datePublished,
		dateModified,
		imageUrl,
		authorName,
	} = params;
	const fullUrl = url.startsWith('http') ? url : new URL(url, siteUrl).href;
	return {
		'@context': 'https://schema.org',
		'@type': 'BlogPosting',
		mainEntityOfPage: { '@type': 'WebPage', '@id': fullUrl },
		headline,
		description,
		url: fullUrl,
		datePublished,
		...(dateModified && { dateModified }),
		...(imageUrl && { image: imageUrl }),
		author: { '@type': 'Organization', name: authorName, url: siteUrl },
		publisher: { '@type': 'Organization', name: authorName, url: siteUrl },
		inLanguage: 'de-DE',
	};
}

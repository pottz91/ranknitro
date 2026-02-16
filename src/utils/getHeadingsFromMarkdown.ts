/**
 * Liest Überschriften h2–h6 (## bis ######) aus Markdown für TOC. H1 wird nicht aufgelistet.
 * IDs mit github-slugger, kompatibel zu rehype-slug.
 */

import GithubSlugger from 'github-slugger';

export interface TocItem {
	id: string;
	text: string;
	level: number; // 2 = h2 … 6 = h6
}

const headingRe = /^(#{2,6})\s+(.+)$/gm;
const slugger = new GithubSlugger();

export function getHeadingsFromMarkdown(markdown: string): TocItem[] {
	if (!markdown || typeof markdown !== 'string') return [];
	slugger.reset();
	const items: TocItem[] = [];
	let match: RegExpExecArray | null;
	while ((match = headingRe.exec(markdown)) !== null) {
		const level = match[1].length;
		const rawText = match[2].replace(/\s*\{#[\w-]+\}\s*$/, '').trim(); // optionaler {#custom-id} am Ende abtrennen
		const text = rawText.replace(/\\/g, '').trim();
		if (!text) continue;
		const id = slugger.slug(text);
		items.push({ id, text, level });
	}
	return items;
}

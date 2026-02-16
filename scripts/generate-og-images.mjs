/**
 * Erzeugt pro Blog-Beitrag ein PNG (1200×630) in public/og/blog/[slug].png.
 * Einheitlicher Hintergrund + Titel. Vor dem Astro-Build ausführen.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import matter from 'gray-matter';
import { ImageResponse } from '@vercel/og';
import { createElement } from 'react';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const contentDir = path.join(root, 'src', 'content', 'blog');
const outDir = path.join(root, 'public', 'og', 'blog');

if (!fs.existsSync(contentDir)) {
	console.warn('scripts/generate-og-images: src/content/blog nicht gefunden.');
	process.exit(0);
}

fs.mkdirSync(outDir, { recursive: true });

const files = fs.readdirSync(contentDir).filter((f) => /\.(md|mdx)$/i.test(f));

async function generateImage(title, slug) {
	const element = createElement(
		'div',
		{
			style: {
				display: 'flex',
				flexDirection: 'column',
				width: '100%',
				height: '100%',
				background: 'linear-gradient(135deg, #e8e8e8 0%, #f5f5f5 50%, #e0e0e0 100%)',
				alignItems: 'center',
				justifyContent: 'center',
				padding: '48px',
				fontFamily: 'sans-serif',
			},
		},
		createElement(
			'h1',
			{
				style: {
					fontSize: '56px',
					fontWeight: 700,
					color: '#010208',
					textAlign: 'center',
					margin: 0,
					maxWidth: '100%',
					lineHeight: 1.2,
					display: 'flex',
					flexWrap: 'wrap',
					justifyContent: 'center',
				},
			},
			title
		)
	);

	const response = new ImageResponse(element, { width: 1200, height: 630 });
	const buffer = Buffer.from(await response.arrayBuffer());
	const outPath = path.join(outDir, `${slug}.png`);
	fs.writeFileSync(outPath, buffer);
	console.log('  →', outPath);
}

let hasError = false;
for (const file of files) {
	const fullPath = path.join(contentDir, file);
	const raw = fs.readFileSync(fullPath, 'utf-8');
	const { data } = matter(raw);
	const title = data.title || path.basename(file, path.extname(file));
	const slug = data.slug || path.basename(file, path.extname(file));
	try {
		await generateImage(title, slug);
	} catch (err) {
		console.error('Fehler bei', file, err);
		hasError = true;
	}
}

if (hasError) process.exit(1);
console.log('OG-Bilder in public/og/blog/ erzeugt.');

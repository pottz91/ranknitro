import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';
import { SUBCATEGORY_SLUGS } from './data/blog-categories';

const blog = defineCollection({
	// Load Markdown and MDX files in the `src/content/blog/` directory.
	loader: glob({ base: './src/content/blog', pattern: '**/*.{md,mdx}', retainBody: true }),
	// Type-check frontmatter using a schema
	schema: ({ image }) =>
		z.object({
			title: z.string(),
			description: z.string(),
			// Öffentlicher URL-Slug (z. B. "alternative-search-engines") – Artikel unter /blog/[slug]/
			slug: z.string().optional(),
			// Hauptkategorie (z. B. "seo")
			category: z.string().optional(),
			// Pillar/Subkategorie (z. B. "keyword-recherche", "local-seo")
			subcategory: z.enum(SUBCATEGORY_SLUGS).optional(),
			// Transform string to Date object
			pubDate: z.coerce.date(),
			updatedDate: z.coerce.date().optional(),
			heroImage: image().optional(),
		}),
});

export const collections = { blog };

import { glob } from 'astro/loaders';
import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
	// Load Markdown and MDX files in the `src/content/blog/` directory.
	loader: glob({ base: './src/content/blog', pattern: '**/*.{md,mdx}' }),
	// Type-check frontmatter using a schema
	schema: ({ image }) => z.object({
		title: z.string(),
		description: z.string(),
		excerpt: z.string().optional(),
		// Transform string to Date object
		pubDate: z.coerce.date(),
		updatedDate: z.coerce.date().optional(),
		heroImage: image().optional(),
		theme: z.string().optional(),
		tags: z.array(z.string()).default([]),
		// Series metadata
		series: z.string().optional(),
		seriesOrder: z.number().optional(),
		seriesDescription: z.string().optional(),
	}),
});

export const collections = { blog };

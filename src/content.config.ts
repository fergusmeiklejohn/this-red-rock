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
		// Paper reference
		relatedPaper: z.string().optional(),
	}),
});

const papers = defineCollection({
	// Load Markdown files in the `src/content/papers/` directory.
	loader: glob({ base: './src/content/papers', pattern: '**/*.md' }),
	// Type-check frontmatter using a schema
	schema: ({ image }) => z.object({
		title: z.string(),
		abstract: z.string(),
		authors: z.array(z.string()),
		// Transform string to Date object
		pubDate: z.coerce.date(),
		// Link to PDF or external publication
		paperUrl: z.string().optional(),
		// Link to code repository
		codeUrl: z.string().optional(),
		// Related blog series
		relatedSeries: z.string().optional(),
		// Related blog posts (array of blog post IDs)
		relatedPosts: z.array(z.string()).default([]),
		// Keywords for categorization
		keywords: z.array(z.string()).default([]),
		// Citation information
		citation: z.string().optional(),
		// Conference or journal
		venue: z.string().optional(),
		// Optional cover image
		coverImage: image().optional(),
	}),
});

export const collections = { blog, papers };

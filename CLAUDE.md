# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is an Astro-based blog configured for deployment on Cloudflare Pages. The project uses the standard Astro blog template with Cloudflare adapter integration.

## Key Commands

- `npm run dev` - Start development server at localhost:4321
- `npm run build` - Build production site to ./dist/
- `npm run preview` - Build and preview locally with Wrangler Pages
- `npm run deploy` - Build and deploy to Cloudflare Pages
- `npm run cf-typegen` - Generate Cloudflare Worker types

## Architecture

### Content Management
- Blog posts are stored in `src/content/blog/` as Markdown/MDX files
- Content schema is defined in `src/content.config.ts` with frontmatter validation
- Uses Astro's content collections with glob loader for file-based content

### Routing
- `src/pages/blog/[...slug].astro` handles dynamic blog post routing
- Uses `getCollection('blog')` to generate static paths for all posts
- Blog post rendering uses the `BlogPost` layout component

### Cloudflare Integration
- Configured for Cloudflare Pages deployment via `@astrojs/cloudflare` adapter
- Wrangler configuration in `wrangler.jsonc`
- Platform proxy enabled for local development
- Uses Cloudflare's image service for optimization

### Layout Structure
- `src/layouts/BlogPost.astro` - Main blog post layout with hero images, dates, and content styling
- `src/components/` - Reusable components (Header, Footer, BaseHead, etc.)
- Global styling uses CSS custom properties for theming

## Content Schema
Blog posts require:
- `title` (string)
- `description` (string) 
- `pubDate` (date)
- `updatedDate` (optional date)
- `heroImage` (optional image)
# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Next.js 14 SAAS landing page template called "Andromeda Light" built with:
- Next.js 14 App Router
- Tailwind CSS for styling
- MDX for content management
- GSAP for animations
- React components with client/server separation

## Development Commands

```bash
npm install          # Install dependencies
npm run dev          # Start development server (http://localhost:3000)
npm run build        # Create production build
npm run lint         # Run ESLint
npm start            # Start production server
```

## Architecture

### Path Aliases (jsconfig.json)
The project uses path aliases for cleaner imports:
- `@layouts/*` → `layouts/*`
- `@components/*` → `layouts/components/*`
- `@partials/*` → `layouts/partials/*`
- `@shortcodes/*` → `layouts/shortcodes/*`
- `@config/*` → `config/*`
- `@hooks/*` → `hooks/*`
- `@lib/*` → `lib/*`

### Directory Structure

**app/** - Next.js 14 App Router pages
- Uses client-side components (`"use client"`)
- [regular]/ - Dynamic routes for regular pages
- posts/ - Blog post pages with pagination

**layouts/** - Page layout components
- Baseof.js - Legacy base layout with SEO meta (uses Next.js Pages Router patterns)
- Components in components/, partials/, shortcodes/

**content/** - Markdown/MDX content files
- Blog posts in posts/
- Pages like about.md, contact.md, 404.md
- All use frontmatter for metadata

**lib/** - Utility functions
- contentParser.js - Main content parsing (getListPage, getSinglePage, getRegularPage)
- utils/mdxParser.js - MDX compilation with rehype/remark plugins
- gsap.js - GSAP setup with ScrollTrigger

**config/** - Site configuration JSON files
- config.json - Main site settings, metadata, contact info, disqus, GTM
- theme.json - Font and color variables
- menu.json - Navigation structure
- social.json - Social media links

### Content System

Content is stored in markdown files in the `content/` directory and parsed using gray-matter and next-mdx-remote:

1. **getSinglePage(folder)** - Gets all published markdown files from a folder, filters drafts and future-dated posts
2. **getRegularPage(slug)** - Gets a specific page by slug
3. **getListPage(filePath)** - Gets list page (e.g., _index.md)
4. MDX parsing supports custom shortcodes (Button, Accordion, Notice, Tabs, Video, Youtube, etc.)

### Layout Approach

The codebase mixes App Router (app/layout.js) and legacy Pages Router patterns (layouts/Baseof.js). The app/layout.js is the active root layout using client components for Header/Footer. The Baseof.js contains GSAP scroll animations and SEO meta handling but appears to be legacy code.

### Animations

GSAP with ScrollTrigger is used for:
- Fade-in effects on elements with `.fade` class
- Direction-based animations (`.animate.from-left`, `.animate.from-right`)
- Background animations on `.bg-theme` elements

### Configuration

All site configuration is centralized in `config/config.json`:
- Site metadata and branding
- Contact information
- Navigation button settings
- Blog pagination (6 posts per page)
- Disqus comments integration
- Google Tag Manager ID

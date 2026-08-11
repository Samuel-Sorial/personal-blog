# Samuel Sorial's Blog

A static Astro migration of the original Hashnode publication. The site uses TypeScript, Astro Content Collections, locally hosted article images, generated RSS and sitemap files, and no client-side framework or runtime server.

## Local development

Requires a current Node.js LTS release.

```sh
npm install
npm run dev
```

Astro prints the local development URL, normally `http://localhost:4321`.

## Build and preview

```sh
npm run build
npm run preview
```

The static production output is written to `dist/`. No Node.js server, database, Worker, environment variable, or runtime API is required.

## Add a blog post

Create one Markdown or MDX file in `src/content/blog/`. Its filename becomes the root URL slug, so `my-post.md` is published at `/my-post` automatically. No registry or routing edit is needed.

```md
---
title: "My post"
description: "A short summary."
publishDate: 2026-08-11
tags: ["databases"]
draft: false
---

Post content goes here.
```

Optional fields are `updatedDate`, `canonicalUrl`, and `heroImage`. Images may be put in `public/images/` and referenced with `/images/example.png`.

## Project structure

- `src/components/`: shared header, footer, cards, and SEO metadata
- `src/layouts/`: base document and article layouts
- `src/content/blog/`: the typed post collection
- `src/pages/`: generated pages, post routes, tags, and RSS
- `src/styles/`: global responsive styles and article typography
- `public/images/posts/`: migrated article images
- `public/_redirects`: Cloudflare Pages redirects

## Deploy to Cloudflare Pages

1. Push the repository to GitHub.
2. In Cloudflare Dashboard, open **Workers & Pages**, choose **Create application → Pages → Connect to Git**, and authorize/select the repository.
3. Select the production branch (usually `main`). Choose the **Astro** framework preset if offered.
4. Set the build command to `npm run build` and the build output directory to `dist`. No environment variables are required.
5. Save and deploy. Every production-branch push creates a production deployment; pull requests and non-production branches receive isolated preview deployments and URLs.
6. Under the Pages project, open **Custom domains → Set up a custom domain**. Enter the desired domain. If DNS is already on Cloudflare, Cloudflare creates the required record. If the registrar or authoritative DNS is elsewhere, follow the shown target and create the requested CNAME (commonly pointing a subdomain to `<project>.pages.dev`); apex-domain instructions can differ, so use the exact values Cloudflare displays.
7. DNS delegation to Cloudflare is not required merely because Pages hosts the site. Keep the domain at any registrar and add the records at its active DNS provider.
8. Cloudflare provisions and renews HTTPS automatically after DNS validation. Certificate issuance can take a short time after the records resolve.

The production URL is configured as `https://samuelsorial.com` in `astro.config.ts`, the post `canonicalUrl` fields, and `public/robots.txt`. The former `hashnode.dev` hostname is owned and DNS-controlled by Hashnode, so preserving redirects from it depends on the migration options Hashnode provides.

## Migration notes

- All 18 RSS-visible posts and 65 embedded article images were migrated. Root-level article slugs are preserved.
- Hashnode platform navigation, reactions, follow/login controls, recommendations, promotional UI, sharing controls, and platform footer were intentionally excluded.
- Hashnode exposed post bodies through RSS as HTML rather than source Markdown. They remain valid Markdown files containing preserved semantic HTML, which avoids rewriting article text. New posts can use normal Markdown/MDX and Astro's built-in Shiki highlighting.
- The public source exposed no reliable custom About-page body, project page, custom font, avatar, cover-image metadata, or updated dates. Only the published biography was used; no missing content was invented.
- The original publication uses a Hashnode-owned subdomain. Preserving its paths is complete, but preserving that hostname requires Hashnode to provide a redirect; Cloudflare cannot take over its DNS. Keep the old publication online until the new domain is indexed.
- No analytics were migrated or added.

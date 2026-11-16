# Architecture — Portfolio reconstruction ("night valley")

## Confirmed facts

- Existing repo `iwioke/iwioke-portfolio`: Next.js 16 App Router, React 19, TypeScript, Vitest, Playwright, deployed via Vercel (per previous docs).
- Reference implementation (inspected from source): static HTML; CSS with a viewport unit `--u = min(100vw/1600, 100vh/900)`; fonts Unbounded 500/700/800 (display) and Onest 400/500/600 (text); palette `#05060a` night, `#f5efe2` cream, white accent; three.js r128 point-cloud valley; vanilla JS for folders, lightbox, 3D title, reveals.
- Owner decisions: work on a feature branch; exclude all imagery with Cyrillic; prices later ("on request" now); wordmark `iwioke`.

## Assumptions

- Vercel remains the host, so `next/image` optimisation is available.
- `NEXT_PUBLIC_SITE_URL` may be unset; canonical/OG absolute URLs are emitted only when set.

## Design

```
app/
  layout.tsx        fonts (next/font: Unbounded, Onest), metadata, <html lang="en">
  page.tsx          static server-rendered sections (SEO-visible copy)
  globals.css       hand-written CSS ported from the reference spec
  icon.svg, sitemap.ts, robots.ts
components/
  valley.tsx        client: three.js night valley (dynamic import, no SSR)
  title-3d.tsx      client: per-letter 3D wordmark with cursor/tap sink
  works.tsx         client: folders, hash routing, masonry list, lightbox
  page-effects.tsx  client: loader/intro, header solid state, valley dimming, scroll reveals
content/
  site.ts           single source of truth: copy, services/prices, steps, contacts
  works.ts          folders + works (generated image dimensions)
public/media/       optimised JPEGs (max 2000 px)
```

- **No new runtime dependencies besides `three`**; removed `next-intl`, `resend`, `react-hook-form`, `zod`, `@hookform/resolvers`, `motion`, Tailwind/PostCSS.
- Server renders all static copy; client islands only where the reference uses JS.
- Images: `next/image` with explicit dimensions (no layout shift), lazy by default.

## Security & privacy

- No forms, no secrets, no API routes, no analytics. Only `mailto:` and external links with `rel="noopener noreferrer"`.
- Third-party personal data visible in source materials (business card names/phones, client contact blocks, company stamps) is excluded from assets.

## Operations

- Commands: `npm run dev | lint | typecheck | test | build | test:e2e`.
- Deploy: merge `reconstruct-night-valley` → `main` (Vercel).

## Open questions

| Question | Why it matters | Status |
| --- | --- | --- |
| Final prices and currency? | Pricing column | Owner will send later |
| Production domain? | Canonical, OG image URLs | Open — set `NEXT_PUBLIC_SITE_URL` |
| Is an English build of iwiqoVPN available for screenshots? | Reintroducing the app in Works | Open |
| Should SMM work get English versions? | Adds a 4th folder | Open |

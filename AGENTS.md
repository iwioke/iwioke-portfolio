# Project workflow

## Commands

- `npm run dev` — start the local Next.js development server.
- `npm run lint` — run ESLint.
- `npm run typecheck` — run TypeScript validation.
- `npm test` — run Vitest unit and component tests.
- `npm run build` — produce the optimized Next.js build.
- `npm run test:e2e` — run Playwright end-to-end tests.

## Deployment

- Configure `NEXT_PUBLIC_SITE_URL` in Vercel (see `.env.example`) so canonical, Open Graph and sitemap URLs are absolute.
- Never commit real environment values.

## Content & design

- Visual reference: https://elesh-portfolio.netlify.app/ — see `docs/night-valley-reconstruction/` for PRD and architecture.
- All copy, services/prices and contacts live in `content/site.ts`; folders and works in `content/works.ts`.
- New images go to `public/media/` (max 2000 px JPEG) and need an entry in `DIMENSIONS` in `content/works.ts`.
- English only: no Cyrillic in UI copy or project imagery (enforced by `tests/unit/content.test.ts` and e2e).
- Screenshot QA: `npx playwright test` plus manual comparison at 1440×900 and 390×844 against the reference.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

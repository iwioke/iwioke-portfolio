# Project workflow

## Commands

- `npm run dev` — start the local Next.js development server.
- `npm run lint` — run ESLint.
- `npm run typecheck` — run TypeScript validation.
- `npm test` — run Vitest unit and component tests.
- `npm run build` — produce the optimized Next.js build.
- `npm run test:e2e` — run Playwright end-to-end tests.

## Deployment

- Configure the production URL and all contact-form secrets in Vercel environment variables described in `.env.example`.
- Never commit real environment values or delivery-provider keys.

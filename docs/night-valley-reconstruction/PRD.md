# PRD — Portfolio reconstruction ("night valley")

- **Status:** approved for implementation (16 Nov 2026)
- **Owner:** Maxim Matsulevich (iwioke)
- **Branch:** `reconstruct-night-valley`
- **Visual reference:** https://elesh-portfolio.netlify.app/ (design specification, not inspiration)

## 1. Problem

The current portfolio (bilingual Next.js site, light editorial design) does not match the visual direction the owner wants. The owner wants the reference site's design, layout and interactions reproduced as closely as possible, presenting his own identity and work in English only.

## 2. Users

| Segment | Need |
| --- | --- |
| Potential clients (brands, small businesses) | See identity, poster and website work quickly; understand services and how to order |
| Studios / agencies | Judge visual taste and range |
| Recruiters / product teams | See real shipped work and a GitHub trail |

## 3. Goals

1. Reproduce the reference structure, typography, palette, components and motion.
2. Show only authentic work from local materials.
3. 100% English user-facing content; no visible Cyrillic in UI **or project imagery** (owner decision).
4. Primary conversion: message via Telegram / email.

## 4. Scope

### In
- Single page, section order identical to the reference: fixed header → hero (3D wordmark) → works (folders → projects → lightbox) → pricing table → process (4 steps + terms) → contact CTA → footer.
- WebGL "night valley" background with loader, intro, cursor interaction and scroll dimming; graceful no-WebGL fallback.
- Hash-routed folder navigation, `<dialog>` lightbox with keyboard navigation.
- Scroll reveals, hover micro-interactions, `prefers-reduced-motion` support.
- SEO: title, description, Open Graph/Twitter, favicon, canonical (when `NEXT_PUBLIC_SITE_URL` is set), sitemap, robots, JSON-LD.

### Out (removed vs. previous version)
- Russian locale and language switcher (English only).
- Contact form + Resend API route (the reference has no form; contact is via links).
- iwiqoVPN imagery and LM Group SMM carousels/stories (all contain Russian text). iwiqoVPN is referenced in text with its GitHub link.

## 5. Content mapping

| Reference section | Content source |
| --- | --- |
| Logo / hero wordmark | `iwioke` (owner decision) |
| Hero caption | GitHub profile README: graphic & web designer from Minsk; identities, posters, websites, creative development |
| Works folders | 1) Brand identity → LM Group mockups (`Desktop/works/айдентика`, `Desktop/ЛМ ГРУПП`); 2) Websites → LM Group Europe / Kazakhstan, English-locale screenshots captured from the live sites llclmgroup.com and llclmgroup.store; 3) Posters → `Desktop/works/*` (Cyrillic poster Group 28 excluded) |
| Pricing table | Services and price ranges supplied by the owner (16 Nov 2026), in USD |
| Process | Generic, non-committal workflow (no unverified terms such as prepayment %, revision counts or turnaround) |
| Contact | Telegram @iwiokedamn, iwiokework@gmail.com, Instagram @iwiokebaa, GitHub iwioke |

## 6. Requirements

- **Functional:** all anchors scroll smoothly; folder hash routes (`#folder-<key>`) work with back/forward; lightbox opens/closes (Esc, backdrop, ✕), arrows/keys cycle; all external links open safely in a new tab.
- **Non-functional:** responsive 320–2560 px with the reference breakpoints (1080 px, 820 px); no horizontal overflow; no console errors; Lighthouse-friendly image sizes; reduced-motion respected; keyboard accessible.

## 7. Success metrics

- Side-by-side screenshots at 1440×900 and 390×844 match the reference composition.
- Zero Cyrillic characters in rendered HTML.
- `lint`, `typecheck`, unit/component tests, production build and e2e pass.

## 8. Acceptance criteria

1. Section order, header, hero, folders, lightbox, price rows, steps, contact pills and footer visually match the reference.
2. Only owner's real work and contacts are shown; no invented facts, prices or clients.
3. No Russian text anywhere on the page.
4. Build succeeds; no runtime console errors.

## 9. Risks

| Risk | Mitigation |
| --- | --- |
| WebGL cost on low-end mobile | Fewer particles on small/coarse-pointer screens, capped pixel ratio, fallback without WebGL |
| Prices change | Prices are centralised in `content/site.ts` |
| Reduced project variety after excluding Cyrillic imagery | Websites shown via authentic English screenshots of the live sites |

## 10. Next steps

- Optional: English build of iwiqoVPN UI to reintroduce its screenshots; English versions of SMM work.
- Set `NEXT_PUBLIC_SITE_URL` in Vercel for canonical/OG URLs; merge branch to deploy.

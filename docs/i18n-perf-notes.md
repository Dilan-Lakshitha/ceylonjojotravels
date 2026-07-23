# Multilingual layout / SEO performance notes

## Slot architecture (current)
- Design system under `src/app/ui/`: TourCard, DestinationCard, PageHeader, TourStats, PriceBox, Chip, AccordionPanel, HeroBanner
- Slot contracts in `src/styles/_tour-card-slots.scss` — fixed CSS Grid tracks (not English-length min-heights)
- Listings use `.tour-card-grid` / `.dest-card-grid` with `grid-auto-rows: 1fr`

## Before / after focus URLs
- `/en` and `/de` (home packages + destinations)
- `/en/tours` vs `/de/touren` (equal-height TourCard grid)
- `/en/tours/...` and `/de/touren/...` (TourStats + Accordion)
- `/sitemap-index.xml`, `/sitemap-de.xml`, `/robots.txt`

## SEO / GSC hardening
- Sitemap includes all public ROUTE_MAP routes (testimonials, guides, restaurant)
- robots.txt disallows every localized booking segment
- SeoService: booking `noindex,nofollow`; always sets OG/Twitter image; runtime JSON-LD only (static dual graph removed from `index.html`)
- `canonicalSegmentGuard` redirects wrong-lang path segments/slugs to the lang-correct URL

## SSR deploy note
Vercel SPA rewrite (`/(.*) → /index.html`) serves the English shell to many crawlers. Prefer Angular SSR/prerender for localized HTML. Client guards + SeoService still correct canonicals after hydration.

## CLS / LCP checklist
- TourCard image `aspect-ratio: 5/3`; destination media fixed 180px
- Hero title clamp(2) / sub clamp(3) / fixed CTA row
- LCP hero: `fetchpriority=high` + eager; other carousel slides lazy
- No scale-based card hover (translateY only)

## Responsive + language matrix (manual)
Breakpoints: 320, 375, 768, 1024, 1280, 1440, 1920  
Languages: EN, DE, FR, IT, ES, PL, RU  
Pages: home, tours list, tour detail, booking  
Success = same slot geometry across locales (not identical glyph counts).

## How to regenerate SEO artifacts
```bash
npm run seo:generate
```

## Honest score expectations
Bootstrap CDN + Elfsight/GTM + large photography will rarely hit Lighthouse 100 on mobile. Slot contracts target layout parity and CLS stability first.

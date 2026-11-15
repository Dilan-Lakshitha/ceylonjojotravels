/**
 * Generates multilingual SEO artifacts:
 * - vercel.json redirects (legacy + wrong-lang/malformed → canonical)
 * - public/sitemap-index.xml
 * - public/sitemap-{lang}.xml for each language
 * - public/sitemap.xml (same index, for older tools)
 * - public/robots.txt
 *
 * Sources of truth: ROUTE_MAP + TOUR_SLUG_MAP (not tours.json slugs —
 * those can drift, e.g. DE catalog still using English slugs).
 *
 * vercel.json rewrites/headers are preserved. Redirects are regenerated
 * in full so re-runs do not duplicate rules.
 */
const fs = require('fs');
const path = require('path');

const ROUTE_MAP = {
  about: { en: 'about-us', de: 'uber-uns', fr: 'a-propos', it: 'chi-siamo', es: 'sobre-nosotros', pl: 'o-nas', ru: 'o-nas' },
  services: { en: 'our-services', de: 'leistungen', fr: 'services', it: 'servizi', es: 'servicios', pl: 'uslugi', ru: 'uslugi' },
  tours: { en: 'tours', de: 'touren', fr: 'circuits', it: 'tour', es: 'tours', pl: 'wycieczki', ru: 'tury' },
  destinations: { en: 'destinations', de: 'reiseziele', fr: 'destinations', it: 'destinazioni', es: 'destinos', pl: 'destynacje', ru: 'napravleniya' },
  contact: { en: 'contact', de: 'kontakt', fr: 'contact', it: 'contatti', es: 'contacto', pl: 'kontakt', ru: 'kontakty' },
  testimonials: { en: 'customer-testimonials', de: 'kundenbewertungen', fr: 'temoignages', it: 'recensioni', es: 'opiniones', pl: 'opinie', ru: 'otzyvy' },
  guides: { en: 'travel-guides', de: 'reisefuehrer', fr: 'guides-voyage', it: 'guide-di-viaggio', es: 'guias-viaje', pl: 'przewodniki', ru: 'putevoditeli' },
  restaurant: { en: 'restaurants', de: 'restaurants', fr: 'restaurants', it: 'ristoranti', es: 'restaurantes', pl: 'restauracje', ru: 'restorany' },
  booking: { en: 'booking', de: 'buchung', fr: 'reservation', it: 'prenotazione', es: 'reserva', pl: 'rezerwacja', ru: 'bronirovanie' },
};

/** Must match src/app/i18n/guide-slug-map.ts (empty slug = incomplete locale). */
const GUIDE_SLUG_MAP = {
  'best-time-to-visit-sri-lanka': {
    en: 'best-time-to-visit-sri-lanka',
    de: '',
    fr: '',
    it: '',
    es: '',
    pl: '',
    ru: '',
  },
};

/** Must match GUIDE_APPROVED in guide-slug-map.ts */
const GUIDE_APPROVED = {
  'best-time-to-visit-sri-lanka': false,
};

/** Must match src/app/i18n/tour-slug-map.ts */
const TOUR_SLUG_MAP = {
  'ella-day-tour': {
    en: 'ella-day-tour',
    de: 'ella-tagesausflug',
    fr: 'excursion-ella',
    it: 'escursione-ella',
    es: 'excursion-ella',
    pl: 'wycieczka-ella',
    ru: 'odnodnevnyy-tur-ella',
  },
  'galle-day-tour': {
    en: 'galle-day-tour',
    de: 'galle-tagesausflug',
    fr: 'excursion-galle',
    it: 'escursione-galle',
    es: 'excursion-galle',
    pl: 'wycieczka-galle',
    ru: 'odnodnevnyy-tur-galle',
  },
  'kandy-day-tour': {
    en: 'kandy-day-tour',
    de: 'kandy-tagesausflug',
    fr: 'excursion-kandy',
    it: 'escursione-kandy',
    es: 'excursion-kandy',
    pl: 'wycieczka-kandy',
    ru: 'odnodnevnyy-tur-kandy',
  },
  'sigiriya-day-tour': {
    en: 'sigiriya-day-tour',
    de: 'sigiriya-tagesausflug',
    fr: 'excursion-sigiriya',
    it: 'escursione-sigiriya',
    es: 'excursion-sigiriya',
    pl: 'wycieczka-sigiriya',
    ru: 'odnodnevnyy-tur-sigiriya',
  },
  '2-day-ella-kandy-private-tour-sri-lanka': {
    en: '2-day-ella-kandy-private-tour',
    de: '2-tage-ella-kandy-privattour',
    fr: 'circuit-2-jours-ella-kandy',
    it: 'tour-2-giorni-ella-kandy',
    es: 'tour-2-dias-ella-kandy',
    pl: '2-dni-ella-kandy',
    ru: '2-dnya-ella-kandy',
  },
  '2-day-ella-yala-private-tour-sri-lanka': {
    en: '2-day-ella-yala-safari',
    de: '2-tage-ella-yala-safari',
    fr: 'circuit-2-jours-ella-yala',
    it: 'tour-2-giorni-ella-yala',
    es: 'tour-2-dias-ella-yala',
    pl: '2-dni-ella-yala',
    ru: '2-dnya-ella-yala',
  },
  '4-day-sri-lanka-tour': {
    en: '4-day-sri-lanka-tour',
    de: '4-tage-sri-lanka-rundreise',
    fr: 'circuit-sri-lanka-4-jours',
    it: 'tour-sri-lanka-4-giorni',
    es: 'tour-sri-lanka-4-dias',
    pl: '4-dni-sri-lanka',
    ru: '4-dnya-shri-lanka',
  },
  '5-day-sri-lanka-tour': {
    en: '5-day-sri-lanka-tour',
    de: '5-tage-sri-lanka-rundreise',
    fr: 'circuit-sri-lanka-5-jours',
    it: 'tour-sri-lanka-5-giorni',
    es: 'tour-sri-lanka-5-dias',
    pl: '5-dni-sri-lanka',
    ru: '5-dney-shri-lanka',
  },
  '6-day-sri-lanka-private-tour': {
    en: '6-day-sri-lanka-private-tour',
    de: '6-tage-sri-lanka-privattour',
    fr: 'circuit-prive-sri-lanka-6-jours',
    it: 'tour-privato-sri-lanka-6-giorni',
    es: 'tour-privado-sri-lanka-6-dias',
    pl: '6-dni-prywatny-sri-lanka',
    ru: '6-dney-shri-lanka',
  },
  '7-day-sri-lanka-tour': {
    en: '7-day-sri-lanka-tour',
    de: '7-tage-sri-lanka-rundreise',
    fr: 'circuit-sri-lanka-7-jours',
    it: 'tour-sri-lanka-7-giorni',
    es: 'tour-sri-lanka-7-dias',
    pl: '7-dni-sri-lanka',
    ru: '7-dney-shri-lanka',
  },
  '8-day-sri-lanka-private-tour': {
    en: '8-day-sri-lanka-private-tour',
    de: '8-tage-sri-lanka-privattour',
    fr: 'circuit-prive-sri-lanka-8-jours',
    it: 'tour-privato-sri-lanka-8-giorni',
    es: 'tour-privado-sri-lanka-8-dias',
    pl: '8-dni-prywatny-sri-lanka',
    ru: '8-dney-shri-lanka',
  },
  '10-day-sri-lanka-tour': {
    en: '10-day-sri-lanka-tour',
    de: '10-tage-sri-lanka-rundreise',
    fr: 'circuit-sri-lanka-10-jours',
    it: 'tour-sri-lanka-10-giorni',
    es: 'tour-sri-lanka-10-dias',
    pl: '10-dni-sri-lanka',
    ru: '10-dney-shri-lanka',
  },
};

const INDEXED_ROUTES = ['about', 'services', 'tours', 'destinations', 'contact', 'testimonials', 'guides', 'restaurant'];

const langs = ['en', 'de', 'fr', 'it', 'es', 'pl', 'ru'];
const origin = 'https://ceylonjojotravels.com';
const lastmod = new Date().toISOString().slice(0, 10);
const root = path.resolve(__dirname, '..');
const publicDir = path.join(root, 'public');
const vercelPath = path.join(root, 'vercel.json');

const DEFAULT_REWRITES = [
  {
    source: '/((?!assets/|webfonts/|css/|.*\\.(xml|txt|json|ico|png|jpg|jpeg|webp|svg|woff2|woff|js|css)$).*)',
    destination: '/index.html',
  },
];

const DEFAULT_HEADERS = [
  {
    source: '/assets/(.*)',
    headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }],
  },
  {
    source: '/webfonts/(.*)',
    headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }],
  },
  {
    source: '/(.*)\\.(js|css|webp|jpg|jpeg|png|svg|woff2|woff)$',
    headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }],
  },
];

const WWW_HOST = 'www.ceylonjojotravels.com';

/** Apex legacy / static redirects (relative destinations). */
const APEX_STATIC_REDIRECTS = [
  { source: '/', destination: `${origin}/en`, permanent: true },
  { source: '/index.html', destination: `${origin}/en`, permanent: true },
  { source: '/index.htm', destination: `${origin}/en`, permanent: true },
  { source: '/nl', destination: '/en', permanent: true },
  { source: '/nl/:path*', destination: '/en/:path*', permanent: true },
  { source: '/pt', destination: '/en', permanent: true },
  { source: '/pt/:path*', destination: '/en/:path*', permanent: true },
  {
    source: '/de/touren/7-tage-sri-lanka-8-reise',
    destination: '/de/touren/7-tage-sri-lanka-rundreise',
    permanent: true,
  },
  { source: '/sitemap_index.xml', destination: '/sitemap-index.xml', permanent: true },
  { source: '/twodaytours', destination: '/en/tours/2-day-ella-kandy-private-tour', permanent: true },
  { source: '/twodaytour', destination: '/en/tours/2-day-ella-kandy-private-tour', permanent: true },
  { source: '/twodaystours', destination: '/en/tours/2-day-ella-kandy-private-tour', permanent: true },
  { source: '/two-day-tours', destination: '/en/tours/2-day-ella-kandy-private-tour', permanent: true },
  { source: '/two-days-tours', destination: '/en/tours/2-day-ella-kandy-private-tour', permanent: true },
  { source: '/two-days-tour', destination: '/en/tours/2-day-ella-kandy-private-tour', permanent: true },
  { source: '/galle day tour', destination: '/en/tours/galle-day-tour', permanent: true },
  { source: '/galle%20day%20tour', destination: '/en/tours/galle-day-tour', permanent: true },
  { source: '/about-us', destination: '/en/about-us', permanent: true },
  { source: '/our-services', destination: '/en/our-services', permanent: true },
  { source: '/tour-packages', destination: '/en/tours', permanent: true },
  { source: '/contact-us', destination: '/en/contact', permanent: true },
  { source: '/destinations-sri-lanka', destination: '/en/destinations', permanent: true },
  { source: '/customer-testimonials', destination: '/en/customer-testimonials', permanent: true },
  { source: '/sri-lanka-travel-guides', destination: '/en/travel-guides', permanent: true },
  { source: '/restaurants-in-sri-lanka', destination: '/en/restaurants', permanent: true },
  { source: '/booking/:filecode', destination: '/en/booking/:filecode', permanent: true },
];

/**
 * www → final destination in ONE hop (avoid www→apex→canonical chains).
 * Skips rules that already use :path* wildcards needing the generic catch-all.
 */
function wwwOneHopRedirects(rules) {
  const out = [];
  for (const rule of rules) {
    if (rule.has?.some((h) => h.type === 'host')) continue;
    if (String(rule.source).includes(':path*') || String(rule.destination).includes(':path*')) {
      continue;
    }
    if (String(rule.source).includes(':slug') || String(rule.destination).includes(':slug')) {
      continue;
    }
    if (String(rule.source).includes(':filecode') || String(rule.destination).includes(':filecode')) {
      continue;
    }
    const dest = String(rule.destination).startsWith('http')
      ? rule.destination
      : `${origin}${rule.destination}`;
    out.push({
      source: rule.source,
      has: [{ type: 'host', value: WWW_HOST }],
      destination: dest,
      permanent: true,
    });
  }
  return out;
}

/**
 * GSC “Alternative page with proper canonical tag” for tours ?type=day|multi.
 * Strip filter query params at the edge so Google only keeps clean tours URLs.
 */
function buildTourTypeQueryRedirects() {
  const redirects = [];
  for (const lang of langs) {
    const seg = ROUTE_MAP.tours[lang];
    for (const type of ['day', 'multi']) {
      redirects.push({
        source: `/${lang}/${seg}`,
        has: [{ type: 'query', key: 'type', value: type }],
        destination: `/${lang}/${seg}`,
        permanent: true,
      });
    }
  }
  return redirects;
}

/** GSC “Duplicate without user-selected canonical” examples + legacy ids used as slugs. */
const MALFORMED_TOUR_REDIRECTS = [
  {
    source: '/en/tours/2 day ella kandy private tour',
    destination: '/en/tours/2-day-ella-kandy-private-tour',
    permanent: true,
  },
  {
    source: '/en/tours/2%20day%20ella%20kandy%20private%20tour',
    destination: '/en/tours/2-day-ella-kandy-private-tour',
    permanent: true,
  },
  {
    source: '/en/tours/2-day-ella-kandy-private-tour-sri-lanka',
    destination: '/en/tours/2-day-ella-kandy-private-tour',
    permanent: true,
  },
  {
    source: '/en/tours/2-day-ella-yala-private-tour-sri-lanka',
    destination: '/en/tours/2-day-ella-yala-safari',
    permanent: true,
  },
  // GSC: Duplicate without user-selected canonical (spaced RU slug)
  {
    source: '/ru/tury/odnodnevnyy tur kandy',
    destination: '/ru/tury/odnodnevnyy-tur-kandy',
    permanent: true,
  },
  {
    source: '/ru/tury/odnodnevnyy%20tur%20kandy',
    destination: '/ru/tury/odnodnevnyy-tur-kandy',
    permanent: true,
  },
  {
    source: '/ru/tury/odnodnevnyy tur ella',
    destination: '/ru/tury/odnodnevnyy-tur-ella',
    permanent: true,
  },
  {
    source: '/ru/tury/odnodnevnyy%20tur%20ella',
    destination: '/ru/tury/odnodnevnyy-tur-ella',
    permanent: true,
  },
  {
    source: '/ru/tury/odnodnevnyy tur galle',
    destination: '/ru/tury/odnodnevnyy-tur-galle',
    permanent: true,
  },
  {
    source: '/ru/tury/odnodnevnyy%20tur%20galle',
    destination: '/ru/tury/odnodnevnyy-tur-galle',
    permanent: true,
  },
  {
    source: '/ru/tury/odnodnevnyy tur sigiriya',
    destination: '/ru/tury/odnodnevnyy-tur-sigiriya',
    permanent: true,
  },
  {
    source: '/ru/tury/odnodnevnyy%20tur%20sigiriya',
    destination: '/ru/tury/odnodnevnyy-tur-sigiriya',
    permanent: true,
  },
];

/**
 * Flat localized slugs without /{lang}/{segment}/ used to soft-serve the EN shell
 * (GSC duplicate: /circuit-2-jours-ella-kandy). Redirect every localized slug
 * at the site root to its correct language path.
 */
function buildRootLocalizedSlugRedirects() {
  const redirects = [];
  const seen = new Set();

  for (const slugs of Object.values(TOUR_SLUG_MAP)) {
    for (const lang of langs) {
      const slug = slugs[lang];
      if (!slug || seen.has(slug)) continue;
      seen.add(slug);
      // EN tour ids are already covered by buildCanonicalRedirects (`/${id}`).
      // Also cover EN human slugs that differ from tour ids.
      redirects.push({
        source: `/${slug}`,
        destination: `/${lang}/${ROUTE_MAP.tours[lang]}/${slug}`,
        permanent: true,
      });
    }
  }

  return redirects;
}

function uniqueSegments(routeId) {
  return [...new Set(Object.values(ROUTE_MAP[routeId]))];
}

/**
 * Edge 301s Googlebot will follow (client Angular redirects are not enough).
 * Order: slug-on-correct-segment first, then wrong-segment patterns, so
 * `/ru/tury/kandy-day-tour` is one hop and `/ru/tours/odnodnevnyy-tur-kandy`
 * is one hop. Wrong-segment + EN slug may be two hops (acceptable).
 */
function buildCanonicalRedirects() {
  const redirects = [];

  for (const id of Object.keys(TOUR_SLUG_MAP)) {
    redirects.push({
      source: `/${id}`,
      destination: `/en/tours/${TOUR_SLUG_MAP[id].en}`,
      permanent: true,
    });
  }

  for (const routeId of INDEXED_ROUTES) {
    if (routeId === 'tours') continue;
    const enSeg = ROUTE_MAP[routeId].en;
    for (const lang of langs) {
      if (lang === 'en') continue;
      const dest = ROUTE_MAP[routeId][lang];
      if (!dest || dest === enSeg) continue;
      redirects.push({
        source: `/${lang}/${enSeg}`,
        destination: `/${lang}/${dest}`,
        permanent: true,
      });
    }
  }

  for (const lang of langs) {
    const correctSeg = ROUTE_MAP.tours[lang];
    for (const slugs of Object.values(TOUR_SLUG_MAP)) {
      const destSlug = slugs[lang];
      const seen = new Set();
      for (const otherLang of langs) {
        const otherSlug = slugs[otherLang];
        if (!otherSlug || otherSlug === destSlug || seen.has(otherSlug)) continue;
        seen.add(otherSlug);
        redirects.push({
          source: `/${lang}/${correctSeg}/${otherSlug}`,
          destination: `/${lang}/${correctSeg}/${destSlug}`,
          permanent: true,
        });
      }
    }
  }

  for (const lang of langs) {
    const correctSeg = ROUTE_MAP.tours[lang];
    for (const foreign of uniqueSegments('tours')) {
      if (foreign === correctSeg) continue;
      redirects.push({
        source: `/${lang}/${foreign}`,
        destination: `/${lang}/${correctSeg}`,
        permanent: true,
      });
      redirects.push({
        source: `/${lang}/${foreign}/:slug`,
        destination: `/${lang}/${correctSeg}/:slug`,
        permanent: true,
      });
    }
  }

  // Incomplete guide locales → English article (only when the EN guide is approved).
  for (const [guideId, slugs] of Object.entries(GUIDE_SLUG_MAP)) {
    if (!GUIDE_APPROVED[guideId]) continue;
    const enSlug = slugs.en;
    if (!enSlug) continue;
    const enDest = `/en/${ROUTE_MAP.guides.en}/${enSlug}`;
    for (const lang of langs) {
      if (lang === 'en') continue;
      const localSlug = slugs[lang];
      const guidesSeg = ROUTE_MAP.guides[lang];
      if (!localSlug) {
        redirects.push({
          source: `/${lang}/${guidesSeg}/${enSlug}`,
          destination: enDest,
          permanent: true,
        });
      }
    }
  }

  return redirects;
}

const rootSlugRedirects = buildRootLocalizedSlugRedirects();
const canonicalRedirects = buildCanonicalRedirects();
const apexBodyRedirects = [
  ...APEX_STATIC_REDIRECTS,
  ...MALFORMED_TOUR_REDIRECTS,
  ...buildTourTypeQueryRedirects(),
  ...rootSlugRedirects,
  ...canonicalRedirects,
];

/**
 * www one-hop only for high-traffic GSC paths (legacy + root localized slugs +
 * flat tour ids). Do NOT duplicate the full wrong-lang matrix — that blows
 * Vercel's 1024 redirect limit.
 */
const wwwOneHopSources = [
  ...APEX_STATIC_REDIRECTS,
  ...MALFORMED_TOUR_REDIRECTS,
  ...rootSlugRedirects,
  ...canonicalRedirects.filter((r) => /^\/[^/]+$/.test(r.source)),
];

/**
 * Order matters for Vercel:
 * 1) www home + index → /en
 * 2) www one-hop for GSC-critical paths (final URL)
 * 3) www catch-all → apex (unknown paths only)
 * 4) apex redirects
 */
const redirectsRaw = [
  {
    source: '/',
    has: [{ type: 'host', value: WWW_HOST }],
    destination: `${origin}/en`,
    permanent: true,
  },
  {
    source: '/index.html',
    has: [{ type: 'host', value: WWW_HOST }],
    destination: `${origin}/en`,
    permanent: true,
  },
  ...wwwOneHopRedirects(wwwOneHopSources),
  {
    source: '/:path*',
    has: [{ type: 'host', value: WWW_HOST }],
    destination: `${origin}/:path*`,
    permanent: true,
  },
  ...apexBodyRedirects,
];

/** Keep first rule per source (+ optional host has) so root slug and tour-id rules do not clash. */
function dedupeRedirects(list) {
  const seen = new Set();
  const out = [];
  for (const rule of list) {
    const host = Array.isArray(rule.has)
      ? rule.has.map((h) => `${h.type}:${h.value}`).join('|')
      : '';
    const key = `${rule.source}::${host}`;
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(rule);
  }
  return out;
}

const redirects = dedupeRedirects(redirectsRaw);

let existingVercel = {};
if (fs.existsSync(vercelPath)) {
  try {
    existingVercel = JSON.parse(fs.readFileSync(vercelPath, 'utf8'));
  } catch {
    existingVercel = {};
  }
}

fs.writeFileSync(
  vercelPath,
  JSON.stringify(
    {
      version: 2,
      redirects,
      rewrites: DEFAULT_REWRITES,
      headers: Array.isArray(existingVercel.headers) && existingVercel.headers.length
        ? existingVercel.headers
        : DEFAULT_HEADERS,
    },
    null,
    2,
  ) + '\n',
);

function escapeXml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function buildUrlEntry(loc, pathByLang, priority, changefreq = 'weekly') {
  const availableLangs = langs.filter((l) => Object.prototype.hasOwnProperty.call(pathByLang, l));
  let entry = `  <url>
    <loc>${escapeXml(loc)}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
`;
  for (const alt of availableLangs) {
    const altSuffix = pathByLang[alt] ? `/${pathByLang[alt]}` : '';
    entry += `    <xhtml:link rel="alternate" hreflang="${alt}" href="${escapeXml(`${origin}/${alt}${altSuffix}`)}" />
`;
  }
  const xSuffix = pathByLang.en ? `/${pathByLang.en}` : '';
  entry += `    <xhtml:link rel="alternate" hreflang="en-GB" href="${escapeXml(`${origin}/en${xSuffix}`)}" />
    <xhtml:link rel="alternate" hreflang="x-default" href="${escapeXml(`${origin}/en${xSuffix}`)}" />
  </url>
`;
  return entry;
}

function collectPathsForLang() {
  /** @type {Array<{ pathByLang: Record<string,string>, priority: string, changefreq: string }>} */
  const items = [];

  items.push({
    pathByLang: Object.fromEntries(langs.map((l) => [l, ''])),
    priority: '1.0',
    changefreq: 'daily',
  });

  for (const routeId of INDEXED_ROUTES) {
    items.push({
      pathByLang: ROUTE_MAP[routeId],
      priority: routeId === 'tours' ? '0.95' : '0.8',
      changefreq: 'weekly',
    });
  }

  for (const id of Object.keys(TOUR_SLUG_MAP)) {
    const pathByLang = {};
    for (const l of langs) {
      const slug = TOUR_SLUG_MAP[id]?.[l];
      if (!slug) continue;
      pathByLang[l] = `${ROUTE_MAP.tours[l]}/${slug}`;
    }
    if (Object.keys(pathByLang).length === langs.length) {
      const isTourPage = Object.keys(pathByLang).some((l) => pathByLang[l].includes('/'));
      items.push({
        pathByLang,
        priority: isTourPage ? '0.95' : '0.9',
        changefreq: 'weekly',
      });
    }
  }

  for (const id of Object.keys(GUIDE_SLUG_MAP)) {
    if (!GUIDE_APPROVED[id]) continue;
    const pathByLang = {};
    for (const l of langs) {
      const slug = GUIDE_SLUG_MAP[id]?.[l];
      if (!slug) continue;
      pathByLang[l] = `${ROUTE_MAP.guides[l]}/${slug}`;
    }
    if (Object.keys(pathByLang).length > 0) {
      items.push({
        pathByLang,
        priority: '0.85',
        changefreq: 'weekly',
      });
    }
  }

  return items;
}

if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

const allItems = collectPathsForLang();

for (const lang of langs) {
  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
`;
  for (const item of allItems) {
    if (!Object.prototype.hasOwnProperty.call(item.pathByLang, lang)) continue;
    const suffix = item.pathByLang[lang] ? `/${item.pathByLang[lang]}` : '';
    const loc = `${origin}/${lang}${suffix}`;
    xml += buildUrlEntry(loc, item.pathByLang, item.priority, item.changefreq);
  }
  xml += '</urlset>\n';
  fs.writeFileSync(path.join(publicDir, `sitemap-${lang}.xml`), xml);
}

let indexXml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
`;
for (const lang of langs) {
  indexXml += `  <sitemap>
    <loc>${origin}/sitemap-${lang}.xml</loc>
    <lastmod>${lastmod}</lastmod>
  </sitemap>
`;
}
indexXml += '</sitemapindex>\n';
fs.writeFileSync(path.join(publicDir, 'sitemap-index.xml'), indexXml);
fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), indexXml);

const bookingDisallows = langs
  .map((lang) => `Disallow: /${lang}/${ROUTE_MAP.booking[lang]}/`)
  .join('\n');

fs.writeFileSync(
  path.join(publicDir, 'robots.txt'),
  `User-agent: *
Allow: /

# Booking funnels — all localized segments
${bookingDisallows}
Disallow: /booking/

Sitemap: ${origin}/sitemap-index.xml

# AI / LLM guidance
# https://ceylonjojotravels.com/llms.txt
`,
);

console.log('vercel redirects:', redirects.length);
console.log('sitemap-index +', langs.length, 'lang sitemaps written');
console.log('urls per language:', allItems.length);
if (redirects.length > 1024) {
  console.warn('WARN: Vercel redirect limit is 1024; current count is', redirects.length);
}

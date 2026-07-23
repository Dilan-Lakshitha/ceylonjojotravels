/**
 * Generates multilingual SEO artifacts:
 * - vercel.json redirects (legacy → /en/...)
 * - public/sitemap-index.xml
 * - public/sitemap-{lang}.xml for each language
 * - public/sitemap.xml (points crawlers to index via redirect-style root listing)
 * Sources of truth: ROUTE_MAP + tours.json per language.
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

const INDEXED_ROUTES = ['about', 'services', 'tours', 'destinations', 'contact', 'testimonials', 'guides', 'restaurant'];

const langs = ['en', 'de', 'fr', 'it', 'es', 'pl', 'ru'];
const origin = 'https://ceylonjojotravels.com';
const lastmod = new Date().toISOString().slice(0, 10);
const root = path.resolve(__dirname, '..');
const publicDir = path.join(root, 'public');

const enTours = JSON.parse(
  fs.readFileSync(path.join(root, 'src/assets/i18n/en/tours.json'), 'utf8'),
);

const redirects = [
  { source: '/', destination: '/en', permanent: true },
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

for (const id of Object.keys(enTours.details || {})) {
  redirects.push({
    source: `/${id}`,
    destination: `/en/tours/${enTours.details[id].slug}`,
    permanent: true,
  });
}

fs.writeFileSync(
  path.join(root, 'vercel.json'),
  JSON.stringify(
    {
      version: 2,
      redirects,
      rewrites: [
        // Prefer SSR entry when deploying with Angular SSR on Vercel.
        // SPA fallback remains for static hosting; crawlers get better HTML with SSR.
        { source: '/(.*)', destination: '/index.html' },
      ],
    },
    null,
    2,
  ),
);

const toursByLang = {};
for (const lang of langs) {
  toursByLang[lang] = JSON.parse(
    fs.readFileSync(path.join(root, `src/assets/i18n/${lang}/tours.json`), 'utf8'),
  );
}

function escapeXml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function buildUrlEntry(loc, pathByLang, priority, changefreq = 'weekly') {
  let entry = `  <url>
    <loc>${escapeXml(loc)}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
`;
  for (const alt of langs) {
    const altSuffix = pathByLang[alt] ? `/${pathByLang[alt]}` : '';
    entry += `    <xhtml:link rel="alternate" hreflang="${alt}" href="${escapeXml(`${origin}/${alt}${altSuffix}`)}" />
`;
  }
  const xSuffix = pathByLang.en ? `/${pathByLang.en}` : '';
  entry += `    <xhtml:link rel="alternate" hreflang="x-default" href="${escapeXml(`${origin}/en${xSuffix}`)}" />
  </url>
`;
  return entry;
}

function collectPathsForLang(lang) {
  /** @type {Array<{ pathByLang: Record<string,string>, priority: string, changefreq: string }>} */
  const items = [];

  // Home
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

  for (const id of Object.keys(enTours.details || {})) {
    const pathByLang = {};
    for (const l of langs) {
      const slug = toursByLang[l]?.details?.[id]?.slug;
      if (!slug) continue;
      pathByLang[l] = `${ROUTE_MAP.tours[l]}/${slug}`;
    }
    if (Object.keys(pathByLang).length === langs.length) {
      items.push({ pathByLang, priority: '0.9', changefreq: 'weekly' });
    }
  }

  return items;
}

if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

const allItems = collectPathsForLang('en');

for (const lang of langs) {
  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
`;
  for (const item of allItems) {
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

// Keep sitemap.xml as a thin index pointer for older tools
fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), indexXml);

fs.writeFileSync(
  path.join(publicDir, 'robots.txt'),
  `User-agent: *
Allow: /

# Booking funnels — all localized segments
Disallow: /en/booking/
Disallow: /de/buchung/
Disallow: /fr/reservation/
Disallow: /it/prenotazione/
Disallow: /es/reserva/
Disallow: /pl/rezerwacja/
Disallow: /ru/bronirovanie/
Disallow: /booking/

Sitemap: ${origin}/sitemap-index.xml
`,
);

console.log('vercel redirects:', redirects.length);
console.log('sitemap-index +', langs.length, 'lang sitemaps written');
console.log('urls per language:', allItems.length);

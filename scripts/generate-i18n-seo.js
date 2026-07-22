const fs = require('fs');

const ROUTE_MAP = {
  about: { en: 'about-us', de: 'uber-uns', fr: 'a-propos', it: 'chi-siamo', es: 'sobre-nosotros', pl: 'o-nas', ru: 'o-nas' },
  services: { en: 'our-services', de: 'leistungen', fr: 'services', it: 'servizi', es: 'servicios', pl: 'uslugi', ru: 'uslugi' },
  tours: { en: 'tours', de: 'touren', fr: 'circuits', it: 'tour', es: 'tours', pl: 'wycieczki', ru: 'tury' },
  destinations: { en: 'destinations', de: 'reiseziele', fr: 'destinations', it: 'destinazioni', es: 'destinos', pl: 'destynacje', ru: 'napravleniya' },
  contact: { en: 'contact', de: 'kontakt', fr: 'contact', it: 'contatti', es: 'contacto', pl: 'kontakt', ru: 'kontakty' },
  testimonials: { en: 'customer-testimonials', de: 'kundenbewertungen', fr: 'temoignages', it: 'recensioni', es: 'opiniones', pl: 'opinie', ru: 'otzyvy' },
  guides: { en: 'travel-guides', de: 'reisefuehrer', fr: 'guides-voyage', it: 'guide-di-viaggio', es: 'guias-viaje', pl: 'przewodniki', ru: 'putevoditeli' },
  restaurant: { en: 'restaurants', de: 'restaurants', fr: 'restaurants', it: 'ristoranti', es: 'restaurantes', pl: 'restauracje', ru: 'restorany' },
};

const langs = ['en', 'de', 'fr', 'it', 'es', 'pl', 'ru'];
const origin = 'https://ceylonjojotravels.com';
const lastmod = '2026-07-21';
const enTours = JSON.parse(fs.readFileSync('src/assets/i18n/en/tours.json', 'utf8'));

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

for (const id of Object.keys(enTours.details)) {
  redirects.push({
    source: `/${id}`,
    destination: `/en/tours/${enTours.details[id].slug}`,
    permanent: true,
  });
}

fs.writeFileSync(
  'vercel.json',
  JSON.stringify(
    {
      version: 2,
      redirects,
      rewrites: [{ source: '/(.*)', destination: '/index.html' }],
    },
    null,
    2,
  ),
);

const toursByLang = {};
for (const lang of langs) {
  toursByLang[lang] = JSON.parse(fs.readFileSync(`src/assets/i18n/${lang}/tours.json`, 'utf8'));
}

let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">

`;

function addUrl(pathByLang, priority = '0.8') {
  for (const lang of langs) {
    const suffix = pathByLang[lang] ? `/${pathByLang[lang]}` : '';
    const loc = `${origin}/${lang}${suffix}`;
    xml += `  <url>
    <loc>${loc}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${priority}</priority>
`;
    for (const alt of langs) {
      const altSuffix = pathByLang[alt] ? `/${pathByLang[alt]}` : '';
      xml += `    <xhtml:link rel="alternate" hreflang="${alt}" href="${origin}/${alt}${altSuffix}" />
`;
    }
    const xSuffix = pathByLang.en ? `/${pathByLang.en}` : '';
    xml += `    <xhtml:link rel="alternate" hreflang="x-default" href="${origin}/en${xSuffix}" />
  </url>

`;
  }
}

addUrl({ en: '', de: '', fr: '', it: '', es: '', pl: '', ru: '' }, '1.0');

for (const [routeId, segs] of Object.entries(ROUTE_MAP)) {
  addUrl(segs, routeId === 'tours' ? '0.95' : '0.8');
}

for (const id of Object.keys(enTours.details)) {
  const pathByLang = {};
  for (const lang of langs) {
    pathByLang[lang] = `${ROUTE_MAP.tours[lang]}/${toursByLang[lang].details[id].slug}`;
  }
  addUrl(pathByLang, '0.9');
}

xml += '</urlset>\n';
fs.writeFileSync('public/sitemap.xml', xml);
console.log('vercel redirects:', redirects.length);
console.log('sitemap written');

/**
 * Assert localized SEO invariants for every public route × locale.
 *
 * Modes:
 *   node scripts/assert-localized-seo.mjs           # static (seo.json + sitemaps + vercel.json)
 *   node scripts/assert-localized-seo.mjs --live    # also fetch production HTML (Googlebot UA)
 *   node scripts/assert-localized-seo.mjs --base=http://localhost:4200
 *
 * Exit 0 on pass; non-zero with a summary of failures.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const origin = 'https://ceylonjojotravels.com';
const langs = ['en', 'de', 'fr', 'it', 'es', 'pl', 'ru'];
const UA = 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)';

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

function parseExportedMap(constName) {
  const src = fs.readFileSync(path.join(root, 'scripts/generate-i18n-seo.js'), 'utf8');
  const start = src.indexOf(`const ${constName} = `);
  if (start < 0) return null;
  const brace = src.indexOf('{', start);
  let depth = 0;
  for (let i = brace; i < src.length; i++) {
    if (src[i] === '{') depth++;
    else if (src[i] === '}') {
      depth--;
      if (depth === 0) {
        return new Function(`return (${src.slice(brace, i + 1)})`)();
      }
    }
  }
  return null;
}

const TOUR_SLUG_MAP = parseExportedMap('TOUR_SLUG_MAP');
const GUIDE_SLUG_MAP = parseExportedMap('GUIDE_SLUG_MAP') || {};
const GUIDE_APPROVED = parseExportedMap('GUIDE_APPROVED') || {};

const args = process.argv.slice(2);
const live = args.includes('--live');
const baseArg = args.find((a) => a.startsWith('--base='));
const fetchBase = baseArg ? baseArg.slice('--base='.length).replace(/\/$/, '') : live ? origin : null;

const failures = [];
const warn = (msg) => console.warn('WARN:', msg);
const fail = (msg) => {
  failures.push(msg);
  console.error('FAIL:', msg);
};
const len = (s) => [...String(s)].length;

function collectRoutes() {
  /** @type {Array<{ lang: string, path: string, routeId: string, tourId?: string }>} */
  const routes = [];
  for (const lang of langs) {
    routes.push({ lang, path: `/${lang}`, routeId: 'home' });
    for (const [routeId, segs] of Object.entries(ROUTE_MAP)) {
      routes.push({ lang, path: `/${lang}/${segs[lang]}`, routeId });
    }
    for (const [tourId, slugs] of Object.entries(TOUR_SLUG_MAP || {})) {
      routes.push({
        lang,
        path: `/${lang}/${ROUTE_MAP.tours[lang]}/${slugs[lang]}`,
        routeId: 'tours',
        tourId,
      });
    }
    for (const [guideId, slugs] of Object.entries(GUIDE_SLUG_MAP)) {
      if (!GUIDE_APPROVED[guideId]) continue;
      const slug = slugs[lang];
      if (!slug) continue;
      routes.push({
        lang,
        path: `/${lang}/${ROUTE_MAP.guides[lang]}/${slug}`,
        routeId: 'guides',
        guideId,
      });
    }
  }
  return routes;
}

function assertSeoJson() {
  const titles = new Map();
  const descs = new Map();
  for (const lang of langs) {
    const file = path.join(root, 'src/assets/i18n', lang, 'seo.json');
    const data = JSON.parse(fs.readFileSync(file, 'utf8'));
    for (const [key, value] of Object.entries(data)) {
      if (!key.endsWith('.title') && !key.endsWith('.description')) continue;
      const s = String(value);
      if (!s) fail(`${lang} ${key} empty`);
      // Detect mojibake / non-UTF8 unlikely in JSON already parsed
      if (/\uFFFD/.test(s)) fail(`${lang} ${key} replacement char`);
      if (key.endsWith('.title')) {
        if ((key.startsWith('home.') || key.startsWith('tour.')) && len(s) > 60) {
          fail(`${lang} ${key} title len ${len(s)} > 60`);
        }
        const bucket = titles.get(s) || [];
        bucket.push(`${lang}:${key}`);
        titles.set(s, bucket);
      }
      if (key.endsWith('.description') && (key.startsWith('home.') || key.startsWith('tour.'))) {
        if (len(s) < 140 || len(s) > 155) {
          fail(`${lang} ${key} description len ${len(s)} not in 140–155`);
        }
        const bucket = descs.get(s) || [];
        bucket.push(`${lang}:${key}`);
        descs.set(s, bucket);
      }
    }
  }
  for (const [t, keys] of titles) {
    if (keys.length > 1) fail(`duplicate title "${t}" → ${keys.join(', ')}`);
  }
  for (const [d, keys] of descs) {
    if (keys.length > 1) fail(`duplicate description across keys → ${keys.join(', ')}`);
  }
}

function assertSitemaps(routes) {
  const indexPath = path.join(root, 'public/sitemap-index.xml');
  const indexXml = fs.readFileSync(indexPath, 'utf8');
  if (!indexXml.includes('<sitemapindex')) fail('sitemap-index.xml missing sitemapindex');
  for (const lang of langs) {
    if (!indexXml.includes(`sitemap-${lang}.xml`)) fail(`sitemap-index missing sitemap-${lang}.xml`);
  }

  const redirectSources = new Set();
  try {
    const vercel = JSON.parse(fs.readFileSync(path.join(root, 'vercel.json'), 'utf8'));
    for (const r of vercel.redirects || []) {
      if (!r.has) redirectSources.add(r.source.replace(/^\//, ''));
    }
  } catch {
    warn('could not parse vercel.json for redirect cross-check');
  }

  const expected = new Set(routes.map((r) => `${origin}${r.path}`));
  const found = new Set();

  for (const lang of langs) {
    const xml = fs.readFileSync(path.join(root, `public/sitemap-${lang}.xml`), 'utf8');
    if (!xml.includes('xmlns:xhtml')) fail(`sitemap-${lang}.xml missing xhtml namespace`);
    const locs = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
    for (const loc of locs) {
      found.add(loc);
      if (!expected.has(loc)) fail(`sitemap-${lang} unexpected loc ${loc}`);
      const pathOnly = loc.replace(origin + '/', '');
      if (redirectSources.has(pathOnly) && !pathOnly.includes('/')) {
        // root slug in sitemap would be bad
        fail(`sitemap contains root slug that redirects: ${loc}`);
      }
      if (loc.includes('?')) fail(`sitemap contains query URL ${loc}`);
      for (const alt of langs) {
        if (!xml.includes(`hreflang="${alt}"`)) {
          fail(`sitemap-${lang} missing hreflang ${alt}`);
          break;
        }
      }
      if (!xml.includes('hreflang="x-default"')) fail(`sitemap-${lang} missing x-default`);
    }
  }

  for (const loc of expected) {
    if (!found.has(loc)) fail(`route missing from sitemaps: ${loc}`);
  }

  const robots = fs.readFileSync(path.join(root, 'public/robots.txt'), 'utf8');
  if (!robots.includes('Sitemap: https://ceylonjojotravels.com/sitemap-index.xml')) {
    fail('robots.txt missing Sitemap directive');
  }
}

function assertVercelRootSlugs() {
  const vercel = JSON.parse(fs.readFileSync(path.join(root, 'vercel.json'), 'utf8'));
  const sources = new Set((vercel.redirects || []).map((r) => r.source));
  const samples = [
    '/circuit-2-jours-ella-kandy',
    '/5-dni-sri-lanka',
    '/wycieczka-ella',
    '/odnodnevnyy-tur-kandy',
    '/10-dney-shri-lanka',
    '/ella-day-tour',
  ];
  for (const s of samples) {
    if (!sources.has(s)) fail(`vercel.json missing root-slug redirect ${s}`);
  }
  const queryRules = (vercel.redirects || []).filter((r) =>
    (r.has || []).some((h) => h.type === 'query' && h.key === 'type'),
  );
  if (queryRules.length < langs.length * 2) {
    fail(`expected ${langs.length * 2} ?type= redirects, found ${queryRules.length}`);
  }
}

async function assertLiveHtml(routes) {
  if (!fetchBase) return;
  // Sample: all homes + one tour per lang + guides EN
  const sample = [
    ...langs.map((lang) => routes.find((r) => r.lang === lang && r.routeId === 'home')),
    ...langs.map((lang) =>
      routes.find((r) => r.lang === lang && r.tourId === 'ella-day-tour'),
    ),
    routes.find((r) => r.lang === 'en' && r.routeId === 'guides'),
    routes.find((r) => r.lang === 'ru' && r.tourId === 'kandy-day-tour'),
    routes.find((r) => r.lang === 'fr' && r.tourId === '2-day-ella-kandy-private-tour-sri-lanka'),
  ].filter(Boolean);

  for (const route of sample) {
    const url = `${fetchBase}${route.path}`;
    let res;
    try {
      res = await fetch(url, { headers: { 'User-Agent': UA }, redirect: 'manual' });
    } catch (e) {
      fail(`fetch ${url}: ${e.message}`);
      continue;
    }
    if (res.status >= 300 && res.status < 400) {
      fail(`${url} returned redirect ${res.status} (expected 200 canonical)`);
      continue;
    }
    if (res.status !== 200) {
      fail(`${url} status ${res.status}`);
      continue;
    }
    const html = await res.text();
    if (!/charset=utf-8/i.test(res.headers.get('content-type') || '') && !html.includes('charset="utf-8"')) {
      warn(`${url} missing utf-8 content-type`);
    }
    const title = html.match(/<title[^>]*>([^<]*)<\/title>/i)?.[1]?.trim() || '';
    if (!title) fail(`${url} missing <title>`);
    if (/Sri Lanka Tours 2026 \| Private Driver/i.test(title)) {
      fail(`${url} still using CSR shell title`);
    }
    const canonical =
      html.match(/rel=["']canonical["'][^>]*href=["']([^"']+)["']/i)?.[1] ||
      html.match(/href=["']([^"']+)["'][^>]*rel=["']canonical["']/i)?.[1];
    const expectedCanon = `${origin}${route.path}`;
    if (!canonical) fail(`${url} missing canonical`);
    else if (canonical !== expectedCanon) fail(`${url} canonical ${canonical} ≠ ${expectedCanon}`);

    for (const lang of langs) {
      if (!new RegExp(`hreflang=["']${lang}["']`, 'i').test(html)) {
        fail(`${url} missing hreflang=${lang}`);
      }
    }
    if (!/hreflang=["']x-default["']/i.test(html)) fail(`${url} missing hreflang=x-default`);
    if (!/name=["']robots["'][^>]*content=["']index,\s*follow["']/i.test(html)) {
      fail(`${url} missing robots index,follow`);
    }
    const jsonBlocks = [...html.matchAll(/type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)];
    if (!jsonBlocks.length) fail(`${url} missing JSON-LD`);
    for (const m of jsonBlocks) {
      try {
        JSON.parse(m[1]);
      } catch {
        fail(`${url} invalid JSON-LD`);
      }
    }
    if (/Sri Lanka Tours with Private Driver &amp; Custom Travel Packages/i.test(html)) {
      fail(`${url} English noscript/boot H1 leakage`);
    }
    assertHtmlPlaceholders(html, url);
  }
}

/** Fail build if placeholders leak into locale copy, templates, or rendered HTML. */
function assertNoPlaceholders() {
  const scanRoots = [
    path.join(root, 'src/assets/i18n'),
    path.join(root, 'src/app'),
  ];
  const skipDir = (p) =>
    p.includes(`${path.sep}node_modules${path.sep}`) ||
    p.includes(`${path.sep}bootstrap${path.sep}`);

  const fileRe = /\.(html|ts|json)$/i;
  /** Placeholders only — do not match Spanish "todo" (case-sensitive TODO). */
  const hasPlaceholder = (text) =>
    /\[NEED\b/i.test(text) || /\bTODO\b/.test(text) || /\blorem\b/i.test(text);

  function walk(dir) {
    if (!fs.existsSync(dir) || skipDir(dir)) return;
    for (const name of fs.readdirSync(dir)) {
      const full = path.join(dir, name);
      const st = fs.statSync(full);
      if (st.isDirectory()) {
        walk(full);
        continue;
      }
      if (!fileRe.test(name)) continue;
      const text = fs.readFileSync(full, 'utf8');
      if (hasPlaceholder(text)) {
        const line = text.split(/\r?\n/).findIndex((l) => hasPlaceholder(l)) + 1;
        fail(`placeholder in ${path.relative(root, full)}:${line}`);
      }
    }
  }

  for (const dir of scanRoots) walk(dir);

  const distRoot = path.join(root, 'dist');
  if (fs.existsSync(distRoot)) {
    const projectDirs = fs.readdirSync(distRoot);
    const seen = new Set();
    for (const project of projectDirs) {
      const dist = path.join(distRoot, project, 'browser');
      if (!fs.existsSync(dist)) continue;
      const real = fs.realpathSync(dist);
      if (seen.has(real)) continue;
      seen.add(real);
      walk(dist);
      for (const name of fs.readdirSync(dist)) {
        if (!/\.(html|js)$/i.test(name)) continue;
        const text = fs.readFileSync(path.join(dist, name), 'utf8');
        if (text.includes('tc__amount--pending')) {
          fail(`built ${name} still contains price dash placeholder class tc__amount--pending`);
        }
        if (/tc__from[^<]*<\/span>\s*<span[^>]*tc__amount[^>]*>\s*[—–\-]\s*</.test(text)) {
          fail(`built ${name} still renders a dash in a price amount`);
        }
      }
    }
  }
}

function assertHtmlPlaceholders(html, url) {
  if (/\[NEED\b/i.test(html)) fail(`${url} contains [NEED placeholder`);
  if (/\bTODO\b/.test(html)) fail(`${url} contains TODO`);
  if (/\blorem\b/i.test(html)) fail(`${url} contains lorem`);
  if (/tc__amount--pending/.test(html)) {
    fail(`${url} still uses price dash placeholder`);
  }
  if (/class="[^"]*tc__amount[^"]*"[^>]*>\s*[—–\-]\s*</.test(html)) {
    fail(`${url} price field shows placeholder dash`);
  }
}

async function main() {
  if (!TOUR_SLUG_MAP) fail('could not parse TOUR_SLUG_MAP from tour-slug-map.ts');
  const routes = collectRoutes();
  console.log(`Routes under test: ${routes.length}`);
  assertSeoJson();
  assertSitemaps(routes);
  assertVercelRootSlugs();
  assertNoPlaceholders();
  await assertLiveHtml(routes);

  if (failures.length) {
    console.error(`\n${failures.length} SEO assertion(s) failed.`);
    process.exit(1);
  }
  console.log('\nAll SEO assertions passed.');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

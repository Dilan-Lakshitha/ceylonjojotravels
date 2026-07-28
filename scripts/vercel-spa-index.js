/**
 * Angular SSR builds emit index.csr.html (empty app shell) when using
 * RenderMode.Client for unmatched routes. Vercel SPA fallback needs index.html.
 *
 * Prefer keeping a CSR fallback at the site root without overwriting any
 * prerendered route folders (e.g. browser/en/index.html).
 */
const fs = require('node:fs');
const path = require('node:path');

const browserDir = path.join(__dirname, '..', 'dist', 'Travelwebsite', 'browser');
const csrIndex = path.join(browserDir, 'index.csr.html');
const spaIndex = path.join(browserDir, 'index.html');

if (!fs.existsSync(csrIndex)) {
  console.warn('[vercel-spa-index] Skipping: index.csr.html not found at', csrIndex);
  process.exit(0);
}

fs.copyFileSync(csrIndex, spaIndex);
console.log('[vercel-spa-index] Copied index.csr.html → index.html (SPA fallback)');

// Sanity check: prerendered English home should exist after build.
const enIndex = path.join(browserDir, 'en', 'index.html');
if (fs.existsSync(enIndex)) {
  const html = fs.readFileSync(enIndex, 'utf8');
  const hasContent =
    html.includes('CEYLON JOJO') ||
    html.includes('Sigiriya') ||
    html.includes('carousel') ||
    html.includes('site-header');
  console.log(
    hasContent
      ? '[vercel-spa-index] OK: prerendered /en/index.html contains page content'
      : '[vercel-spa-index] WARN: /en/index.html exists but looks like an empty shell',
  );
} else {
  console.warn('[vercel-spa-index] WARN: missing prerendered dist/.../browser/en/index.html');
}

const guidesIndex = path.join(browserDir, 'en', 'travel-guides', 'index.html');
if (fs.existsSync(guidesIndex)) {
  const html = fs.readFileSync(guidesIndex, 'utf8');
  const hasGuides =
    html.includes('Travel Guides') ||
    html.includes('chauffeur') ||
    html.includes('Danula') ||
    html.includes('guides-page');
  console.log(
    hasGuides
      ? '[vercel-spa-index] OK: prerendered /en/travel-guides/index.html contains page content'
      : '[vercel-spa-index] WARN: /en/travel-guides/index.html exists but looks thin',
  );
} else {
  console.warn('[vercel-spa-index] WARN: missing prerendered /en/travel-guides/index.html');
}

const kandyRu = path.join(
  browserDir,
  'ru',
  'tury',
  'odnodnevnyy-tur-kandy',
  'index.html',
);
if (fs.existsSync(kandyRu)) {
  const html = fs.readFileSync(kandyRu, 'utf8');
  const canonicalOk = html.includes('rel="canonical"') && html.includes('odnodnevnyy-tur-kandy');
  const titleOk = !html.includes('Sri Lanka Tours 2026 | Private Driver');
  console.log(
    canonicalOk && titleOk
      ? '[vercel-spa-index] OK: prerendered RU Kandy tour has self-canonical + tour title'
      : '[vercel-spa-index] WARN: RU Kandy tour HTML missing canonical/tour title',
  );
} else {
  console.warn('[vercel-spa-index] WARN: missing prerendered /ru/tury/odnodnevnyy-tur-kandy/index.html');
}

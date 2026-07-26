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

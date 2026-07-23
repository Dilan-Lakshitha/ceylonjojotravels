/**
 * Angular SSR builds emit index.csr.html (no index.html) when nothing is prerendered.
 * Vercel static hosting + SPA rewrites expect index.html, so copy the CSR shell.
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
console.log('[vercel-spa-index] Copied index.csr.html → index.html');

/**
 * Validate vercel.json source patterns against path-to-regexp v6
 * (the syntax Vercel uses for redirects/rewrites/headers).
 */
import fs from 'node:fs';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);

let pathToRegexp;
try {
  ({ pathToRegexp } = require('path-to-regexp'));
} catch {
  console.error('Install path-to-regexp@6.1.0 to validate routes');
  process.exit(1);
}

const vercelPath = new URL('../vercel.json', import.meta.url);
const vercel = JSON.parse(fs.readFileSync(vercelPath, 'utf8'));

function validateSection(name, routes = []) {
  const fails = [];
  for (const route of routes) {
    const source = route.source;
    if (!source) continue;
    try {
      pathToRegexp(source);
    } catch (err) {
      fails.push({ source, error: err.message });
    }
  }
  console.log(`${name}: ${routes.length} routes, ${fails.length} invalid`);
  for (const f of fails) {
    console.log(`  FAIL: ${JSON.stringify(f.source)}`);
    console.log(`        ${f.error}`);
  }
  return fails;
}

const fails = [
  ...validateSection('redirects', vercel.redirects),
  ...validateSection('rewrites', vercel.rewrites),
  ...validateSection('headers', vercel.headers),
];

const candidates = [
  '/((?!assets/|webfonts/).*)',
  '/((?!assets/|webfonts/|css/).*)',
  '/((?!assets/|webfonts/|css/|.*\\.(xml|txt|json|ico|png|jpg|jpeg|webp|svg|woff2|woff|js|css)$).*)',
  '/((?!assets/|webfonts/|css/|.*\\.(?:xml|txt|json|ico|png|jpg|jpeg|webp|svg|woff2|woff|js|css)$).*)',
  '/:path((?!assets/|webfonts/|css/).*)',
  '/((?!assets/|webfonts/|css/)(?!.*\\.(xml|txt|json|ico|png|jpg|jpeg|webp|svg|woff2|woff|js|css)$).*)',
  '/((?!assets/|webfonts/|css/)(?!.*\\.(?:xml|txt|json|ico|png|jpg|jpeg|webp|svg|woff2|woff|js|css)$).*)',
  '/:path((?!assets/|webfonts/|css/|.*\\.xml$|.*\\.txt$|.*\\.json$|.*\\.ico$|.*\\.png$|.*\\.jpg$|.*\\.jpeg$|.*\\.webp$|.*\\.svg$|.*\\.woff2$|.*\\.woff$|.*\\.js$|.*\\.css$).*)',
  '/galle day tour',
  '/(.*)\\.(js|css|webp|jpg|jpeg|png|svg|woff2|woff)$',
  '/(.*)\\.(?:js|css|webp|jpg|jpeg|png|svg|woff2|woff)$',
];

console.log('\nCandidate patterns:');
for (const c of candidates) {
  try {
    pathToRegexp(c);
    console.log('  OK  ', c);
  } catch (err) {
    console.log('  FAIL', c);
    console.log('       ', err.message);
  }
}

process.exit(fails.length ? 1 : 0);

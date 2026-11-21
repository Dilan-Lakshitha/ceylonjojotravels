/**
 * Validate vercel.json the same way Vercel does via @vercel/routing-utils.
 */
import fs from 'node:fs';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const { getTransformedRoutes } = require('@vercel/routing-utils');

const vercel = JSON.parse(
  fs.readFileSync(new URL('../vercel.json', import.meta.url), 'utf8'),
);

const { redirects, rewrites, headers, cleanUrls, trailingSlash, routes } = vercel;

// Same shape Vercel uses when parsing vercel.json (no nowConfig wrapper).
const result = getTransformedRoutes({
  redirects,
  rewrites,
  headers,
  cleanUrls,
  trailingSlash,
  routes,
});

if (result.error) {
  console.error('Vercel routing validation FAILED');
  console.error('code:', result.error.code);
  console.error('message:', result.error.message);
  console.error('link:', result.error.link);
  process.exit(1);
}

console.log('Vercel routing validation OK');
console.log('normalized routes:', (result.routes || []).length);
console.log('redirects preserved:', redirects?.length ?? 0);
console.log('rewrites preserved:', rewrites?.length ?? 0);
console.log('headers preserved:', headers?.length ?? 0);
console.log('catch-all rewrite:', rewrites?.[0]?.source);

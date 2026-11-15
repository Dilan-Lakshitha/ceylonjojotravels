/**
 * Replace legacy teal/navy/slate brand hexes with CSS tokens in app + styles
 * (excludes bootstrap vendor, assets/lib, scripts collage templates, docs).
 */
import { readdirSync, readFileSync, writeFileSync, statSync } from 'fs';
import { join, extname } from 'path';

const roots = ['src/app', 'src/styles'];
const exts = new Set(['.css', '.scss', '.ts', '.html']);
const skipDir = new Set(['bootstrap', 'node_modules']);

const replacements = [
  [/#023a2c/gi, 'var(--color-primary)'],
  [/#03503d/gi, 'var(--color-primary-dark)'],
  [/#155a65/gi, 'var(--color-primary)'],
  [/#0e5a64/gi, 'var(--color-primary)'],
  [/#083d45/gi, 'var(--color-primary-dark)'],
  [/#19a7b5/gi, 'var(--color-copper)'],
  [/#eef7f6/gi, 'var(--color-band)'],
  [/#faf6ef/gi, 'var(--color-bg)'],
  [/#12302f/gi, 'var(--color-text)'],
  [/#5b6b6a/gi, 'var(--color-text-muted)'],
  [/#0f172a/gi, 'var(--color-text)'],
  [/#64748b/gi, 'var(--color-text-muted)'],
  [/#475569/gi, 'var(--color-text-muted)'],
  [/#334155/gi, 'var(--color-text)'],
  [/#94a3b8/gi, 'var(--color-text-muted)'],
  [/#c2410c/gi, 'var(--color-accent)'],
  [/#b91c1c/gi, 'var(--color-highlight)'],
  [/#b33a1a/gi, 'var(--color-accent)'],
  [/#0f7a4a/gi, 'var(--color-whatsapp)'],
  [/#074b20/gi, 'var(--color-whatsapp)'],
  [/#1ebe5d/gi, 'var(--color-whatsapp)'],
  [/#007bff/gi, 'var(--color-copper)'],
  [/rgba\(\s*2\s*,\s*58\s*,\s*44/g, 'rgba(94, 36, 18'],
  [/rgba\(\s*8\s*,\s*61\s*,\s*69/g, 'rgba(43, 27, 20'],
  [/rgba\(\s*14\s*,\s*90\s*,\s*100/g, 'rgba(140, 59, 30'],
  [/rgba\(\s*15\s*,\s*23\s*,\s*42/g, 'rgba(43, 27, 20'],
  [/rgba\(\s*242\s*,\s*165\s*,\s*58/g, 'rgba(232, 169, 59'],
];

function walk(dir, out = []) {
  for (const name of readdirSync(dir)) {
    if (skipDir.has(name)) continue;
    const p = join(dir, name);
    const st = statSync(p);
    if (st.isDirectory()) walk(p, out);
    else if (exts.has(extname(name))) out.push(p);
  }
  return out;
}

const files = roots.flatMap((r) => walk(r));
let changed = 0;
for (const file of files) {
  // Don't rewrite the tokens source itself with var() loops
  if (file.includes('_tokens.scss')) continue;
  let src = readFileSync(file, 'utf8');
  let next = src;
  for (const [re, to] of replacements) next = next.replace(re, to);
  if (next !== src) {
    writeFileSync(file, next);
    changed++;
    console.log('updated', file);
  }
}
console.log('files changed:', changed);

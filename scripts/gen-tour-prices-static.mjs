import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const dir = path.join(root, 'src/assets/data');
const files = fs
  .readdirSync(dir)
  .filter((f) => f.startsWith('US') && f.endsWith('.json'))
  .sort();

const maps = {};
const party2 = {};

for (const f of files) {
  const filePath = path.join(dir, f);
  let buf = fs.readFileSync(filePath);
  const bom = buf[0] === 0xef && buf[1] === 0xbb && buf[2] === 0xbf;
  if (bom) {
    buf = buf.slice(3);
    fs.writeFileSync(filePath, buf);
    console.log('stripped BOM', f);
  }
  const j = JSON.parse(buf.toString('utf8'));
  const code = f.replace(/^US/, '').replace(/\.json$/, '');
  maps[code] = j.price || {};
  party2[code] = j.price?.['2'] ?? 0;
}

const out = `/**
 * Static USD party price maps mirrored from src/assets/data/US*.json.
 * Used for SSR / first paint. Never invent values — regenerate via
 * \`node scripts/gen-tour-prices-static.mjs\` when JSON changes.
 * Key "2" is the party-of-2 total (same field TourPriceService returns).
 */
export const US_TOUR_PRICE_MAPS: Readonly<
  Record<string, Readonly<Record<string, number>>>
> = ${JSON.stringify(maps, null, 2)} as const;

/** Party-of-2 totals from US*.json price["2"]. */
export const US_TOUR_PARTY2_TOTALS: Readonly<Record<string, number>> = ${JSON.stringify(
  party2,
  null,
  2,
)} as const;

export function getStaticUsPriceMap(filecode: string): Record<string, number> {
  const map = US_TOUR_PRICE_MAPS[filecode];
  return map ? { ...map } : {};
}

export function getStaticUsParty2Total(filecode: string): number {
  return US_TOUR_PARTY2_TOTALS[filecode] ?? 0;
}
`;

fs.writeFileSync(path.join(root, 'src/app/Services/tour-prices.static.ts'), out);
console.log('wrote tour-prices.static.ts', Object.keys(party2).length, 'tours');

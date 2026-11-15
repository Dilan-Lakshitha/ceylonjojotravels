import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const langs = ['en', 'de', 'fr', 'it', 'es', 'pl', 'ru'];
const expectedDays = {
  'ella-day-tour': 1,
  'galle-day-tour': 1,
  'kandy-day-tour': 1,
  'sigiriya-day-tour': 1,
  '2-day-ella-kandy-private-tour-sri-lanka': 2,
  '2-day-ella-yala-private-tour-sri-lanka': 2,
  '4-day-sri-lanka-tour': 4,
  '5-day-sri-lanka-tour': 5,
  '6-day-sri-lanka-private-tour': 6,
  '7-day-sri-lanka-tour': 7,
  '8-day-sri-lanka-private-tour': 8,
  '10-day-sri-lanka-tour': 10,
};

const re =
  /(\d+)\s*[-–]?\s*(day|days|tage|tägig|tägige|jours?|giorni|d[ií]as|dni|dnia|дн(?:ей|я|е)?)\b/gi;

const issues = [];
for (const lang of langs) {
  const j = JSON.parse(fs.readFileSync(path.join(root, `src/assets/i18n/${lang}/tours.json`), 'utf8'));
  for (const [id, d] of Object.entries(j.details || {})) {
    const expected = expectedDays[id];
    if (!expected) continue;
    const fields = ['description', 'overview', 'closing'];
    for (const field of fields) {
      const text = String(d[field] || '');
      let m;
      re.lastIndex = 0;
      while ((m = re.exec(text))) {
        const n = parseInt(m[1], 10);
        if (n !== expected && !(expected === 1 && n === 1)) {
          // ignore "20th century", "4x4", hotel stars elsewhere — only overview/desc
          if (n >= 2 && n <= 14) {
            issues.push({
              lang,
              id,
              field,
              expected,
              found: n,
              match: m[0],
              snippet: text.slice(Math.max(0, m.index - 50), m.index + 70).replace(/\s+/g, ' '),
            });
          }
        }
      }
    }
    // Also flag 10-day copy that mentions 8 day in overview specifically
    if (id === '10-day-sri-lanka-tour' && /8\s*[-–]?\s*day/i.test(d.overview || '')) {
      // already caught
    }
  }
}

console.log(JSON.stringify(issues, null, 2));
console.log('TOTAL', issues.length);

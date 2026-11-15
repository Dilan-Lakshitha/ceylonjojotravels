import fs from 'fs';
import path from 'path';

const ROOT = path.resolve('d:/website/ceylon jojo travels/ceylonjojotravels');
const toursJson = JSON.parse(fs.readFileSync(path.join(ROOT, 'src/assets/i18n/en/tours.json'), 'utf8'));
const seoJson = JSON.parse(fs.readFileSync(path.join(ROOT, 'src/assets/i18n/en/seo.json'), 'utf8'));

function collectStrings(obj, out = []) {
  if (obj == null) return out;
  if (typeof obj === 'string') {
    const s = obj.trim();
    if (s.length > 15) out.push(s);
    return out;
  }
  if (Array.isArray(obj)) {
    for (const x of obj) collectStrings(x, out);
    return out;
  }
  if (typeof obj === 'object') {
    for (const v of Object.values(obj)) collectStrings(v, out);
  }
  return out;
}

function normalize(s) {
  return s
    .toLowerCase()
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/[^a-z0-9\s']/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function shingles(text, n = 5) {
  const words = normalize(text).split(' ').filter(Boolean);
  const set = new Set();
  for (let i = 0; i <= words.length - n; i++) set.add(words.slice(i, i + n).join(' '));
  return set;
}

function jaccard(a, b) {
  const A = shingles(a);
  const B = shingles(b);
  let inter = 0;
  for (const x of A) if (B.has(x)) inter++;
  const union = A.size + B.size - inter;
  return union ? (inter / union) * 100 : 0;
}

function extractFromHtml(html) {
  const titleM = html.match(/<title[^>]*>([^<]+)<\/title>/i);
  const metaM = html.match(/<meta[^>]+name=["']description["'][^>]+content=["']([^"']+)["']/i);
  const body = html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  return { title: (titleM?.[1] || '').trim(), metaDescription: (metaM?.[1] || '').trim(), bodyText: body };
}

function findIdenticalSentences(cjText, sdText) {
  const split = (t) =>
    t
      .split(/(?<=[.!?])\s+/)
      .map((s) => s.trim())
      .filter((s) => s.length >= 40);
  const cjS = new Map();
  for (const s of split(cjText)) {
    const n = normalize(s);
    if (n.length >= 20) cjS.set(n, s);
  }
  const matches = [];
  for (const s of split(sdText)) {
    const n = normalize(s);
    if (cjS.has(n)) matches.push(cjS.get(n));
  }
  return matches.slice(0, 8);
}

const pairs = [
  {
    tourId: '2-day-ella-yala-private-tour-sri-lanka',
    cjSlug: '2-day-ella-yala-safari',
    sdUrl: 'https://www.sundowntours.com/2-day-ella-yala-private-tour-sri-lanka',
    sdSlugLegacy: '2-day-ella-yala-private-tour-sri-lanka',
  },
  {
    tourId: '2-day-ella-kandy-private-tour-sri-lanka',
    cjSlug: '2-day-ella-kandy-private-tour',
    sdUrl: 'https://www.sundowntours.com/2-day-ella-kandy-private-tour-sri-lanka',
    sdSlugLegacy: '2-day-ella-kandy-private-tour-sri-lanka',
  },
];

const out = [];
for (const p of pairs) {
  const d = toursJson.details[p.tourId];
  const cjText = collectStrings(d).join(' ');
  const faqQs = (d.faq || []).map((f) => f.question);
  const res = await fetch(p.sdUrl, { headers: { 'User-Agent': 'CJ-SEO-Compare/1.0' } });
  const html = await res.text();
  const sd = extractFromHtml(html);
  const faqHits = faqQs.filter((q) => normalize(html).includes(normalize(q)));
  out.push({
    tourId: p.tourId,
    cjSlug: p.cjSlug,
    sdSlugCanonical: p.sdSlugLegacy,
    sdUrl: p.sdUrl,
    httpStatus: res.status,
    sharedSlugWithCj: p.cjSlug === p.sdSlugLegacy ? 'yes' : 'no (CJ shortened slug; SD legacy path)',
    cjTitle: d.title,
    sdTitle: sd.title,
    cjMeta: seoJson[`tour.${p.tourId}.description`],
    sdMeta: sd.metaDescription,
    approxSimilarityFullPct: Math.round(jaccard(cjText, sd.bodyText) * 10) / 10,
    identicalSentences: findIdenticalSentences(cjText, sd.bodyText),
    faqQuestionsMatchedOnSd: faqHits,
  });
}

console.log(JSON.stringify(out, null, 2));
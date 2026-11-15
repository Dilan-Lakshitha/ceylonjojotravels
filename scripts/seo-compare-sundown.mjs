import fs from 'fs';
import path from 'path';

const ROOT = path.resolve('d:/website/ceylon jojo travels/ceylonjojotravels');
const toursJson = JSON.parse(fs.readFileSync(path.join(ROOT, 'src/assets/i18n/en/tours.json'), 'utf8'));
const seoJson = JSON.parse(fs.readFileSync(path.join(ROOT, 'src/assets/i18n/en/seo.json'), 'utf8'));

const SLUGS = [
  'ella-day-tour',
  'galle-day-tour',
  'kandy-day-tour',
  'sigiriya-day-tour',
  '2-day-ella-yala-safari',
  '2-day-ella-kandy-private-tour',
  '4-day-sri-lanka-tour',
  '5-day-sri-lanka-tour',
  '6-day-sri-lanka-private-tour',
  '7-day-sri-lanka-tour',
  '8-day-sri-lanka-private-tour',
  '10-day-sri-lanka-tour',
];

const ID_BY_SLUG = {
  'ella-day-tour': 'ella-day-tour',
  'galle-day-tour': 'galle-day-tour',
  'kandy-day-tour': 'kandy-day-tour',
  'sigiriya-day-tour': 'sigiriya-day-tour',
  '2-day-ella-yala-safari': '2-day-ella-yala-private-tour-sri-lanka',
  '2-day-ella-kandy-private-tour': '2-day-ella-kandy-private-tour-sri-lanka',
  '4-day-sri-lanka-tour': '4-day-sri-lanka-tour',
  '5-day-sri-lanka-tour': '5-day-sri-lanka-tour',
  '6-day-sri-lanka-private-tour': '6-day-sri-lanka-private-tour',
  '7-day-sri-lanka-tour': '7-day-sri-lanka-tour',
  '8-day-sri-lanka-private-tour': '8-day-sri-lanka-private-tour',
  '10-day-sri-lanka-tour': '10-day-sri-lanka-tour',
};

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
  for (let i = 0; i <= words.length - n; i++) {
    set.add(words.slice(i, i + n).join(' '));
  }
  return set;
}

function jaccard(a, b) {
  const A = shingles(a);
  const B = shingles(b);
  if (!A.size && !B.size) return 0;
  let inter = 0;
  for (const x of A) if (B.has(x)) inter++;
  const union = A.size + B.size - inter;
  return union ? (inter / union) * 100 : 0;
}

function extractFromHtml(html) {
  const titleM = html.match(/<title[^>]*>([^<]+)<\/title>/i);
  const metaM =
    html.match(/<meta[^>]+name=["']description["'][^>]+content=["']([^"']+)["']/i) ||
    html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+name=["']description["']/i);
  const ogTitle = html.match(/<meta[^>]+property=["']og:title["'][^>]+content=["']([^"']+)["']/i);
  const body = html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  return {
    title: (titleM?.[1] || ogTitle?.[1] || '').trim(),
    metaDescription: (metaM?.[1] || '').trim(),
    bodyText: body,
  };
}

function findIdenticalSentences(cjText, sdText, minLen = 40) {
  const split = (t) =>
    t
      .split(/(?<=[.!?])\s+/)
      .map((s) => s.trim())
      .filter((s) => s.length >= minLen);
  const cjS = new Map();
  for (const s of split(cjText)) {
    const n = normalize(s);
    if (n.length >= 20) cjS.set(n, s);
  }
  const matches = [];
  for (const s of split(sdText)) {
    const n = normalize(s);
    if (cjS.has(n)) matches.push({ cj: cjS.get(n), sd: s });
  }
  return matches.slice(0, 8);
}

async function fetchUrl(url) {
  const res = await fetch(url, {
    headers: { 'User-Agent': 'CJ-SEO-Compare/1.0', Accept: 'text/html' },
    redirect: 'follow',
  });
  const text = await res.text();
  return { status: res.status, url: res.url, html: text };
}

function cjTourBundle(tourId) {
  const d = toursJson.details[tourId];
  if (!d) return null;
  const seoKey = `tour.${tourId}.title`;
  const seoTitle = seoJson[`tour.${tourId}.title`] || d.title;
  const seoDesc = seoJson[`tour.${tourId}.description`] || '';
  const intro = d.description || '';
  const allText = collectStrings(d).join(' ');
  const faqText = (d.faq || []).map((x) => `${x.question || ''} ${x.answer || ''}`).join(' ');
  const itineraryText = collectStrings(d.itinerary || d.days || d.dayPlans).join(' ');
  return {
    tourId,
    slug: d.slug,
    title: d.title,
    seoTitle,
    seoDescription: seoDesc,
    intro,
    intro200: intro.slice(0, 200),
    faqText,
    itineraryText,
    fullText: allText,
  };
}

const extraPages = [
  { type: 'homepage', url: 'https://www.sundowntours.com/' },
  { type: 'tours list', url: 'https://www.sundowntours.com/sri-lanka-private-tour' },
];

const results = { cjCatalog: [], comparisons: [], extra: [], errors: [] };

for (const item of [...toursJson.catalog.dayTours, ...toursJson.catalog.multiDayTours]) {
  const bundle = cjTourBundle(item.id);
  results.cjCatalog.push({
    id: item.id,
    slug: item.slug,
    title: item.title,
    metaDescription: seoJson[`tour.${item.id}.description`] || '',
    intro200: (bundle?.intro || '').slice(0, 200),
  });
}

for (const slug of SLUGS) {
  const tourId = ID_BY_SLUG[slug];
  const cj = cjTourBundle(tourId);
  const sdUrl = `https://www.sundowntours.com/${slug}`;
  try {
    const { status, html, url } = await fetchUrl(sdUrl);
    const sd = extractFromHtml(html);
    const identical = findIdenticalSentences(cj.fullText, sd.bodyText);
    const simFull = jaccard(cj.fullText, sd.bodyText);
    const simIntro = jaccard(cj.intro, sd.bodyText.slice(0, 3000));
    const simItinerary = jaccard(cj.itineraryText, sd.bodyText);
    const simFaq = jaccard(cj.faqText, sd.bodyText);
    const titleMatch =
      normalize(cj.seoTitle) === normalize(sd.title) || normalize(cj.title) === normalize(sd.title);
    const metaMatch = normalize(cj.seoDescription) === normalize(sd.metaDescription);

    results.comparisons.push({
      pageType: 'tour detail',
      slug,
      sdUrl: url,
      httpStatus: status,
      sharedSlug: true,
      cjTitle: cj.title,
      sdTitle: sd.title,
      cjMeta: cj.seoDescription,
      sdMeta: sd.metaDescription,
      titleExactOrNear: titleMatch,
      metaExact: metaMatch,
      approxSimilarityFullPct: Math.round(simFull * 10) / 10,
      approxSimilarityIntroPct: Math.round(simIntro * 10) / 10,
      approxSimilarityItineraryPct: Math.round(simItinerary * 10) / 10,
      approxSimilarityFaqPct: Math.round(simFaq * 10) / 10,
      identicalSentences: identical,
      sdIntro200: sd.bodyText.slice(0, 200),
    });
  } catch (e) {
    results.errors.push({ slug, error: String(e) });
  }
}

for (const ep of extraPages) {
  try {
    const { status, html, url } = await fetchUrl(ep.url);
    const sd = extractFromHtml(html);
    const cjTitle = ep.type === 'homepage' ? seoJson['home.title'] : seoJson['tours.title'];
    const cjMeta = ep.type === 'homepage' ? seoJson['home.description'] : seoJson['tours.description'];
    const cjBody =
      ep.type === 'homepage'
        ? 'Private Driver Sri Lanka day tours multi day packages chauffeur guide'
        : collectStrings(toursJson.catalog).join(' ');
    results.extra.push({
      pageType: ep.type,
      sdUrl: url,
      httpStatus: status,
      cjTitle,
      sdTitle: sd.title,
      cjMeta,
      sdMeta: sd.metaDescription,
      sharedSlug: ep.type === 'tours list' ? 'partial (SD: sri-lanka-private-tour)' : 'n/a',
      approxSimilarityPct: Math.round(jaccard(cjBody, sd.bodyText) * 10) / 10,
      titleMatch: normalize(cjTitle) === normalize(sd.title),
      metaMatch: normalize(cjMeta) === normalize(sd.metaDescription),
    });
  } catch (e) {
    results.errors.push({ page: ep.type, error: String(e) });
  }
}

const outPath = path.join(ROOT, 'scripts/seo-compare-output.json');
fs.writeFileSync(outPath, JSON.stringify(results, null, 2));
console.log('Wrote', outPath);
console.log('Tours compared:', results.comparisons.length);
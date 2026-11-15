/**
 * Step 1: Compare Ceylon Jojo EN tour copy vs live Sundown pages.
 * Facts only — no rewrites.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const cj = JSON.parse(fs.readFileSync(path.join(root, 'src/assets/i18n/en/tours.json'), 'utf8'));

const TOURS = [
  {
    id: 'ella-day-tour',
    label: 'Ella day',
    multi: false,
    sdUrl: 'https://www.sundowntours.com/ella-day-tour',
  },
  {
    id: 'galle-day-tour',
    label: 'Galle day',
    multi: false,
    sdUrl: 'https://www.sundowntours.com/galle-day-tour',
  },
  {
    id: 'kandy-day-tour',
    label: 'Kandy day',
    multi: false,
    sdUrl: 'https://www.sundowntours.com/kandy-day-tour',
  },
  {
    id: 'sigiriya-day-tour',
    label: 'Sigiriya day',
    multi: false,
    sdUrl: 'https://www.sundowntours.com/sigiriya-day-tour',
  },
  {
    id: '2-day-ella-yala-private-tour-sri-lanka',
    label: '2-day Ella-Yala',
    multi: true,
    sdUrl: 'https://www.sundowntours.com/2-day-ella-yala-private-tour-sri-lanka',
  },
  {
    id: '2-day-ella-kandy-private-tour-sri-lanka',
    label: '2-day Ella-Kandy',
    multi: true,
    sdUrl: 'https://www.sundowntours.com/2-day-ella-kandy-private-tour-sri-lanka',
  },
  {
    id: '4-day-sri-lanka-tour',
    label: '4-day',
    multi: true,
    sdUrl: 'https://www.sundowntours.com/4-day-sri-lanka-tour',
  },
  {
    id: '5-day-sri-lanka-tour',
    label: '5-day',
    multi: true,
    sdUrl: 'https://www.sundowntours.com/5-day-sri-lanka-tour',
  },
  {
    id: '6-day-sri-lanka-private-tour',
    label: '6-day',
    multi: true,
    sdUrl: 'https://www.sundowntours.com/6-day-sri-lanka-private-tour',
  },
  {
    id: '7-day-sri-lanka-tour',
    label: '7-day',
    multi: true,
    sdUrl: 'https://www.sundowntours.com/7-day-sri-lanka-tour',
  },
  {
    id: '8-day-sri-lanka-private-tour',
    label: '8-day',
    multi: true,
    sdUrl: 'https://www.sundowntours.com/8-day-sri-lanka-private-tour',
  },
  {
    id: '10-day-sri-lanka-tour',
    label: '10-day',
    multi: true,
    sdUrl: 'https://www.sundowntours.com/10-day-sri-lanka-tour',
  },
];

function words(s) {
  return String(s || '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&[a-z]+;/gi, ' ')
    .toLowerCase()
    .replace(/[^a-z0-9'’.\s-]/gi, ' ')
    .split(/\s+/)
    .filter(Boolean);
}

function wordCount(s) {
  return words(s).length;
}

function normalizeSentence(s) {
  return String(s || '')
    .toLowerCase()
    .replace(/['’]/g, "'")
    .replace(/[^a-z0-9'\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function sentencesFromText(text) {
  const raw = String(text || '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  if (!raw) return [];
  return raw
    .split(/(?<=[.!?])\s+|\n+/)
    .map((s) => s.trim())
    .filter((s) => words(s).length >= 12)
    .map((s) => ({ raw: s, norm: normalizeSentence(s) }))
    .filter((s) => s.norm.split(' ').length >= 12);
}

function collectCjSections(detail) {
  const overview = [detail.description, detail.overview].filter(Boolean).join('\n\n');

  const itineraryParts = [];
  for (const day of detail.itinerary || []) {
    if (day.title) itineraryParts.push(day.title);
    if (day.description) itineraryParts.push(day.description);
    for (const act of day.activities || []) {
      if (act.title) itineraryParts.push(act.title);
      if (act.description) itineraryParts.push(act.description);
    }
  }
  const itinerary = itineraryParts.join('\n');

  const faqParts = [];
  for (const f of detail.faq || []) {
    if (f.question) faqParts.push(f.question);
    if (f.answer) faqParts.push(f.answer);
  }
  const faq = faqParts.join('\n');

  // Extra body fields that often mirror SD marketing copy
  const extras = [
    ...(detail.highlights || []),
    ...(detail.includes || []),
    ...(detail.excludes || []),
    detail.closing,
    detail.suitableFor,
  ]
    .filter(Boolean)
    .join('\n');

  return { overview, itinerary, faq, extras, all: [overview, itinerary, faq, extras].join('\n\n') };
}

function stripHtmlToText(html) {
  let h = String(html || '');
  // Prefer main content if present
  const main = h.match(/<main[\s\S]*?<\/main>/i)?.[0];
  if (main) h = main;
  h = h
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<noscript[\s\S]*?<\/noscript>/gi, ' ')
    .replace(/<!--[\s\S]*?-->/g, ' ')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/(p|div|h[1-6]|li|section|article)>/gi, '\n')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/\s+/g, ' ')
    .trim();
  return h;
}

function extractSdSections(html) {
  const text = stripHtmlToText(html);
  // FAQ from JSON-LD if present
  const faqChunks = [];
  const ldBlocks = [...html.matchAll(/<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)];
  for (const m of ldBlocks) {
    try {
      const j = JSON.parse(m[1]);
      const nodes = Array.isArray(j) ? j : j['@graph'] ? j['@graph'] : [j];
      for (const n of nodes) {
        if (n['@type'] === 'FAQPage' && Array.isArray(n.mainEntity)) {
          for (const q of n.mainEntity) {
            faqChunks.push(q.name || '');
            faqChunks.push(q.acceptedAnswer?.text || '');
          }
        }
      }
    } catch {
      /* ignore */
    }
  }
  const faq = faqChunks.filter(Boolean).join('\n');

  // Heuristic: overview = first substantial paragraphs before "Day 1" / itinerary markers
  const daySplit = text.split(/\bDay\s+\d+\b/i);
  const overview = (daySplit[0] || text).slice(0, 4000);
  const itinerary = daySplit.length > 1 ? text.slice((daySplit[0] || '').length) : text;

  return {
    overview,
    itinerary: itinerary || text,
    faq: faq || '',
    all: text,
    status: 200,
  };
}

function findVerbatim(cjText, sdText) {
  const cjSents = sentencesFromText(cjText);
  const sdNormSet = new Set(sentencesFromText(sdText).map((s) => s.norm));
  // Also check if CJ sentence appears as substring of SD full text (punctuation differences)
  const sdFull = normalizeSentence(sdText);
  const hits = [];
  for (const s of cjSents) {
    if (sdNormSet.has(s.norm) || sdFull.includes(s.norm)) {
      hits.push(s.raw);
    }
  }
  // Dedupe
  return [...new Set(hits)];
}

async function fetchSd(url) {
  const res = await fetch(url, {
    headers: {
      'User-Agent': 'CJ-SEO-Compare/1.0 (content differentiation audit)',
      Accept: 'text/html',
    },
    redirect: 'follow',
  });
  const html = await res.text();
  return { status: res.status, finalUrl: res.url, html };
}

const rows = [];
for (const tour of TOURS) {
  const detail = cj.details[tour.id];
  if (!detail) {
    rows.push({ tour: tour.label, error: 'missing in CJ tours.json' });
    continue;
  }
  const cjSec = collectCjSections(detail);
  let sd;
  try {
    const fetched = await fetchSd(tour.sdUrl);
    if (fetched.status >= 400) {
      sd = { overview: '', itinerary: '', faq: '', all: '', status: fetched.status };
    } else {
      sd = { ...extractSdSections(fetched.html), status: fetched.status };
    }
  } catch (e) {
    sd = { overview: '', itinerary: '', faq: '', all: '', status: 0, error: e.message };
  }

  const verbatim = findVerbatim(cjSec.all, sd.all || '');
  const overviewWc = wordCount(cjSec.overview);
  const thin = tour.multi && overviewWc < 250;

  rows.push({
    tour: tour.label,
    id: tour.id,
    multi: tour.multi,
    sdUrl: tour.sdUrl,
    sdStatus: sd.status,
    cjOverviewWc: overviewWc,
    cjItineraryWc: wordCount(cjSec.itinerary),
    cjFaqWc: wordCount(cjSec.faq),
    sdOverviewWc: wordCount(sd.overview),
    sdItineraryWc: wordCount(sd.itinerary),
    sdFaqWc: wordCount(sd.faq),
    verbatimCount: verbatim.length,
    verbatimSamples: verbatim.slice(0, 5),
    thin,
    duplicated: verbatim.length > 0,
    flagRewrite: thin || verbatim.length > 0,
  });
}

const outPath = path.join(root, 'scripts/seo-compare-step1.json');
fs.writeFileSync(outPath, JSON.stringify(rows, null, 2));

console.log(
  '| Tour | CJ overview | CJ itinerary | CJ FAQ | SD overview* | SD itinerary* | SD FAQ | Verbatim 12+ | Thin (<250 multi overview) | Flag |',
);
console.log('|---|---:|---:|---:|---:|---:|---:|---:|:---:|:---:|');
for (const r of rows) {
  if (r.error) {
    console.log(`| ${r.tour} | ERROR: ${r.error} |`);
    continue;
  }
  console.log(
    `| ${r.tour} | ${r.cjOverviewWc} | ${r.cjItineraryWc} | ${r.cjFaqWc} | ${r.sdOverviewWc} | ${r.sdItineraryWc} | ${r.sdFaqWc} | ${r.verbatimCount} | ${r.thin ? 'YES' : 'no'} | ${r.flagRewrite ? 'REWRITE' : 'ok'} |`,
  );
}

console.log('\n### Verbatim samples (first up to 5 per flagged tour)\n');
for (const r of rows) {
  if (!r.verbatimSamples?.length) continue;
  console.log(`**${r.tour}** (${r.verbatimCount} shared):`);
  for (const s of r.verbatimSamples) console.log(`- "${s}"`);
  console.log('');
}

console.log(`\nWrote ${outPath}`);
console.log(
  `Flagged for rewrite: ${rows.filter((r) => r.flagRewrite).map((r) => r.tour).join(', ') || 'none'}`,
);
console.log(
  '*SD overview/itinerary word counts are heuristic splits of page body text (nav/chrome may inflate counts). FAQ prefers JSON-LD when present.',
);

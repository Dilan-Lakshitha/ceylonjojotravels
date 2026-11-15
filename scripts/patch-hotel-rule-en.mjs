import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const toursPath = path.join(__dirname, '../src/assets/i18n/en/tours.json');
const seoPath = path.join(__dirname, '../src/assets/i18n/en/seo.json');
const t = JSON.parse(fs.readFileSync(toursPath, 'utf8'));
const seo = JSON.parse(fs.readFileSync(seoPath, 'utf8'));

const HB = 'Half board accommodation at the hotels listed in the itinerary';
const PAY = 'Pay later after confirmation. Pay at destination.';
const report = [];

function setInclude(detail) {
  detail.excludes = (detail.excludes || []).filter(
    (x) => !/accommodation \(can be arranged upon request\)/i.test(x),
  );
  let includes = [...(detail.includes || [])].filter(
    (x) =>
      !/^your accommodation$/i.test(x) &&
      !/half board accommodation/i.test(x) &&
      !/half-board accommodation/i.test(x),
  );
  const driverIdx = includes.findIndex((x) => /driver/i.test(x));
  if (driverIdx >= 0) includes.splice(driverIdx + 1, 0, HB);
  else includes.splice(Math.min(2, includes.length), 0, HB);
  detail.includes = includes;
}

function patchPayFaq(detail) {
  if (!detail.faq) return;
  for (const f of detail.faq) {
    if (/book and pay|how do i book/i.test(f.question)) {
      f.answer = `Use the booking form on this page. ${PAY}`;
    }
  }
  detail.faq = detail.faq.filter((f) => !/cancel/i.test(f.question));
}

const ids = [
  '4-day-sri-lanka-tour',
  '5-day-sri-lanka-tour',
  '6-day-sri-lanka-private-tour',
  '7-day-sri-lanka-tour',
  '8-day-sri-lanka-private-tour',
  '10-day-sri-lanka-tour',
];

for (const id of ids) {
  const d = t.details[id];
  const beforeIncludes = [...(d.includes || [])];
  const beforeExcludes = [...(d.excludes || [])];
  setInclude(d);
  patchPayFaq(d);
  report.push({
    id,
    includesRemoved: beforeIncludes.filter((x) => !d.includes.includes(x)),
    includesAdded: d.includes.filter((x) => !beforeIncludes.includes(x)),
    excludesRemoved: beforeExcludes.filter((x) => !(d.excludes || []).includes(x)),
  });
}

{
  const d = t.details['5-day-sri-lanka-tour'];
  const faq = d.faq.find((f) => /hotels and meals/i.test(f.question));
  if (faq) {
    report.push({ id: '5-day-faq-hotels', before: faq.answer });
    faq.answer =
      'Yes. Half board accommodation is included at the hotels listed in the itinerary (or similar). Entrance fees, lunch and drinks are listed under Excludes.';
    report[report.length - 1].after = faq.answer;
  }
}

{
  const d = t.details['4-day-sri-lanka-tour'];
  report.push({ id: '4-day-faq0', before: d.faq[0].answer });
  d.faq[0].answer =
    'Private transport, chauffeur guide, half board accommodation at the hotels listed in the itinerary, and the sightseeing listed in the 4 day itinerary. See Included for the full list.';
  report[report.length - 1].after = d.faq[0].answer;
}

{
  const d = t.details['6-day-sri-lanka-private-tour'];
  report.push({ id: '6-day-faq0', before: d.faq[0].answer });
  d.faq[0].answer =
    'Private transport, chauffeur guide, half board accommodation at the hotels listed in the itinerary, and the sightseeing listed in the 6 day itinerary. See Included for the full list.';
  report[report.length - 1].after = d.faq[0].answer;
}

{
  const d = t.details['7-day-sri-lanka-tour'];
  report.push({ id: '7-day-faq0', before: d.faq[0].answer });
  d.faq[0].answer =
    'Private air conditioned transport, a chauffeur guide, half board accommodation at the hotels listed in the itinerary, and the sightseeing listed in the 7 day itinerary. See Included for the full list.';
  report[report.length - 1].after = d.faq[0].answer;
}

{
  const d = t.details['8-day-sri-lanka-private-tour'];
  report.push({ id: '8-day-faq0', before: d.faq[0].answer });
  d.faq[0].answer =
    'Private transport, chauffeur guide, half board accommodation at the hotels listed in the itinerary, and the sightseeing listed in the 8 day itinerary. See Included for the full list.';
  report[report.length - 1].after = d.faq[0].answer;
}

{
  const d = t.details['10-day-sri-lanka-tour'];
  const inc = d.faq.find((f) => /what is included/i.test(f.question));
  report.push({ id: '10-day-faq-included', before: inc.answer });
  inc.answer =
    'Included: air conditioned private vehicle, English speaking professional driver, half board accommodation at the hotels listed in the itinerary, fuel, parking and airport pickup and drop off. Entrance and activity fees, lunch, drinks and personal expenses are excluded.';
  report[report.length - 1].after = inc.answer;

  const beach = d.faq.find((f) => /beach days/i.test(f.question));
  report.push({ id: '10-day-faq-beach', before: beach.answer });
  beach.answer =
    'Days seven and eight are listed as Hikkaduwa beach days in the activities. South coast overnight stays use Somerset Mirissa Hotel (or similar) on half board, with a later night at Kamili Beach Resort (or similar).';
  report[report.length - 1].after = beach.answer;

  report.push({ id: '10-day-d6-title', before: d.itinerary[5].title });
  d.itinerary[5].title = 'Travel from Ella to the south coast, overnight Mirissa';
  report[report.length - 1].after = d.itinerary[5].title;

  const beforeActs = d.itinerary[9].activities.map((a) => a.title?.title || a.title);
  d.itinerary[9].activities = d.itinerary[9].activities.filter(
    (a) => !/peraliya/i.test(JSON.stringify(a)),
  );
  report.push({
    id: '10-day-d10-peraliya',
    before: beforeActs,
    after: d.itinerary[9].activities.map((a) => a.title?.title || a.title),
  });
}

// seo.json: reinforce hotels / half board without night counts; keep titles
const seoEdits = [];
function setSeo(key, value) {
  seoEdits.push({ key, before: seo[key], after: value });
  seo[key] = value;
}

setSeo(
  'tour.4-day-sri-lanka-tour.description',
  '4 day private Sri Lanka itinerary with chauffeur guide: Kandy, Ella, Yala safari and southern coast. Half board hotels included. Airport or hotel pickup.',
);
setSeo(
  'tour.5-day-sri-lanka-tour.description',
  '5 day private tour: Sigiriya, Kandy, Ella, safari and coast with half board hotels and a local chauffeur guide. Flexible pacing for couples and families.',
);
setSeo(
  'tour.6-day-sri-lanka-private-tour.description',
  'Six day private Sri Lanka round tour with chauffeur guide, half board hotels, Yala safari and flexible beach time. Cultural sites plus hill country. WhatsApp.',
);
setSeo(
  'tour.7-day-sri-lanka-tour.description',
  '7 day Sri Lanka tour with private driver: Wilpattu safari, Sigiriya, Kandy, Ella, Galle and beach. Half board hotels included. WhatsApp to reserve your dates.',
);
setSeo(
  'tour.8-day-sri-lanka-private-tour.description',
  'Eight day private round tour with a chauffeur guide: wildlife safari, Ella hill country and south coast beaches. Half board hotels included. Flexible beach nights.',
);
setSeo(
  'tour.10-day-sri-lanka-tour.description',
  '10 day private Sri Lanka circuit: cultural triangle, Kandy, Ella, safari and beaches with driver guide and half board hotels. Message us on WhatsApp to plan.',
);

fs.writeFileSync(toursPath, JSON.stringify(t, null, 2) + '\n');
fs.writeFileSync(seoPath, JSON.stringify(seo, null, 2) + '\n');
fs.writeFileSync(
  path.join(__dirname, 'patch-hotel-rule-en-report.json'),
  JSON.stringify({ report, seoEdits }, null, 2),
);
console.log('patched', ids.length, 'tours; seo edits', seoEdits.length);

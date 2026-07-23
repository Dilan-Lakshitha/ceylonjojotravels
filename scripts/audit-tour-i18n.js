const fs = require('fs');
const path = require('path');

function words(s) {
  return String(s || '')
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;
}

const langs = ['en', 'de', 'fr', 'it', 'es', 'pl', 'ru'];
const root = path.join('src', 'assets', 'i18n');
const data = {};
for (const l of langs) {
  data[l] = JSON.parse(fs.readFileSync(path.join(root, l, 'tours.json'), 'utf8'));
}

console.log('=== MYMEMORY / bad ===');
for (const l of langs) {
  let n = 0;
  JSON.stringify(data[l], (k, v) => {
    if (typeof v === 'string' && /MYMEMORY|QUERY LENGTH/i.test(v)) n++;
    return v;
  });
  console.log(l, n);
}

console.log('\n=== overview word counts ===');
for (const id of Object.keys(data.en.details)) {
  const row = langs
    .map((l) => `${l}:${words(data[l].details[id]?.overview)}`)
    .join(' | ');
  console.log(id);
  console.log(' ', row);
}

console.log('\n=== DE sample overview (6-day) ===');
console.log(data.de.details['6-day-sri-lanka-private-tour'].overview);

console.log('\n=== DE catalog title lengths vs EN ===');
for (const group of ['dayTours', 'multiDayTours']) {
  const enList = data.en.catalog[group] || [];
  const deList = data.de.catalog[group] || [];
  enList.forEach((c, i) => {
    const d = deList[i];
    console.log(
      `${c.id}: EN ${words(c.title)}w / DE ${words(d?.title)}w | "${(d?.title || '').slice(0, 70)}..."`,
    );
  });
}

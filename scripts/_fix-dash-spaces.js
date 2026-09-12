const fs = require('fs');
const path = require('path');
const root = path.join(__dirname, '../src/assets/i18n');

function walk(o, fn) {
  for (const [k, v] of Object.entries(o)) {
    if (typeof v === 'string') o[k] = fn(v);
    else if (v && typeof v === 'object') walk(v, fn);
  }
}

for (const lang of fs.readdirSync(root)) {
  const dir = path.join(root, lang);
  if (!fs.statSync(dir).isDirectory()) continue;
  for (const name of ['seo.json', 'home.json', 'services.json']) {
    const p = path.join(dir, name);
    if (!fs.existsSync(p)) continue;
    const obj = JSON.parse(fs.readFileSync(p, 'utf8'));
    walk(obj, (s) => s.replace(/ ,  /g, ': '));
    fs.writeFileSync(p, JSON.stringify(obj, null, 2) + '\n');
  }
}
console.log('cleaned spaced commas');

const fs = require('fs');
const path = require('path');

function walk(dir, out = []) {
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, ent.name);
    if (ent.isDirectory()) walk(p, out);
    else if (ent.name.endsWith('.html')) out.push(p);
  }
  return out;
}

const files = walk('src/app');
let changed = 0;
for (const file of files) {
  let html = fs.readFileSync(file, 'utf8');
  const next = html.replace(
    /\*transloco="let (\w+); scope: '([^']+)'"/g,
    (_m, v, scope) => `*transloco="let ${v}; scope: '${scope}'; prefix: '${scope}'"`,
  );
  if (next !== html) {
    fs.writeFileSync(file, next);
    changed++;
    console.log('updated', file);
  }
}
console.log('files changed', changed);

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const exts = new Set(['.css', '.scss', '.html', '.ts', '.webmanifest']);
const skip = (p) =>
  p.includes(`${path.sep}node_modules${path.sep}`) ||
  p.includes(`${path.sep}bootstrap${path.sep}`) ||
  p.includes(`${path.sep}dist${path.sep}`) ||
  p.includes(`${path.sep}.git${path.sep}`);

const replacements = [
  [/rgba\(7,\s*27,\s*43,/gi, 'rgba(11, 36, 56,'],
  [/#071[Bb]2[Bb]\b/g, '#0B2438'],
  [/#167[Dd]8[Dd]\b/g, '#14395A'],
  [/#0[Ee]4[Ff]5[Ee]\b/g, '#14395A'],
  [/#B9[Ee]4[Ee]8\b/gi, '#E8B878'],
  [/#EAF6F8\b/gi, '#F8F1E6'],
  [/#EEEEEE\b/gi, '#E8DDCB'],
  [/#F2B138\b/gi, '#D4894F'],
  [/#D99A1F\b/gi, '#BF7439'],
  [/#4[Ff]6672\b/g, '#5B6B78'],
  [/#DCE8EA\b/gi, '#E8DDCB'],
  [/#2A1250\b/gi, '#0B2438'],
  [/#401F71\b/gi, '#14395A'],
  [/#824D74\b/gi, '#14395A'],
  [/#BE7B72\b/gi, '#D4894F'],
  [/#FDAF7B\b/gi, '#E8B878'],
  [/#050E3C\b/gi, '#0B2438'],
  [/#0F1A4A\b/gi, '#14395A'],
  [/#5C0A1A\b/gi, '#B8692F'],
  [/#8B0F1F\b/gi, '#B8692F'],
  [/#B3121F\b/gi, '#D4894F'],
  [/#E8650F\b/gi, '#D4894F'],
  [/#F7B500\b/gi, '#E8B878'],
  [/#DC0000\b/gi, '#D4894F'],
  [/#FF3838\b/gi, '#D4894F'],
];

const changed = [];

function walk(dir) {
  for (const name of fs.readdirSync(dir)) {
    const full = path.join(dir, name);
    if (skip(full)) continue;
    const st = fs.statSync(full);
    if (st.isDirectory()) {
      walk(full);
      continue;
    }
    if (!exts.has(path.extname(name))) continue;
    let text = fs.readFileSync(full, 'utf8');
    let next = text;
    for (const [re, to] of replacements) next = next.replace(re, to);
    if (next !== text) {
      fs.writeFileSync(full, next);
      changed.push(path.relative(root, full));
    }
  }
}

walk(path.join(root, 'src'));
walk(path.join(root, 'public'));
console.log(changed.length ? changed.join('\n') : 'no file changes');

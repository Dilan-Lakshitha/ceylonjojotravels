const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const http = require('http');

const outDir = path.join('docs', 'screenshots');
fs.mkdirSync(outDir, { recursive: true });

const browserCandidates = [
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
  'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
];
const browser = browserCandidates.find((p) => fs.existsSync(p));
if (!browser) {
  console.error('No Chrome/Edge found');
  process.exit(1);
}

function waitUrl(url, tries = 40) {
  return new Promise((resolve, reject) => {
    const tick = (n) => {
      http
        .get(url, (res) => {
          res.resume();
          if (res.statusCode && res.statusCode < 500) resolve();
          else if (n <= 0) reject(new Error('timeout ' + url));
          else setTimeout(() => tick(n - 1), 500);
        })
        .on('error', () => {
          if (n <= 0) reject(new Error('timeout ' + url));
          else setTimeout(() => tick(n - 1), 500);
        });
    };
    tick(tries);
  });
}

function run(args) {
  return new Promise((resolve, reject) => {
    const child = spawn(browser, args, { stdio: 'inherit' });
    child.on('exit', (code) => (code === 0 ? resolve() : reject(new Error('exit ' + code))));
  });
}

async function shot(url, file) {
  const out = path.resolve(outDir, file);
  // Bust cache + give Angular time
  const full = url.includes('?') ? `${url}&t=${Date.now()}` : `${url}?t=${Date.now()}`;
  await run([
    '--headless=new',
    '--disable-gpu',
    '--hide-scrollbars',
    '--window-size=1400,1800',
    '--virtual-time-budget=30000',
    `--screenshot=${out}`,
    full,
  ]);
  console.log('wrote', out, fs.existsSync(out) ? fs.statSync(out).size + ' bytes' : 'MISSING');
}

(async () => {
  await waitUrl('http://127.0.0.1:4200/en');
  await new Promise((r) => setTimeout(r, 4000));
  await shot('http://127.0.0.1:4200/en/tours', 'tours-list-en.png');
  await shot('http://127.0.0.1:4200/de/touren', 'tours-list-de.png');
  await shot('http://127.0.0.1:4200/en', 'home-en.png');
  await shot('http://127.0.0.1:4200/de', 'home-de.png');
  const compare = path.resolve(outDir, 'tourcard-en-de-compare.html');
  await shot('file:///' + compare.replace(/\\/g, '/'), 'tourcard-en-de-compare.png');
})().catch((e) => {
  console.error(e);
  process.exit(1);
});

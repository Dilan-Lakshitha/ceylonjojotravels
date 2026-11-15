import { chromium, devices } from 'playwright';
import { mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dir = dirname(fileURLToPath(import.meta.url));
const out = __dir;
mkdirSync(out, { recursive: true });

const base = 'http://127.0.0.1:53119';
const shots = [
  { name: 'header-en-1440', url: `${base}/en/`, w: 1440, h: 900, sticky: false },
  { name: 'header-en-1440-sticky', url: `${base}/en/`, w: 1440, h: 900, sticky: true },
  { name: 'header-en-768', url: `${base}/en/`, w: 768, h: 1024, sticky: false },
  { name: 'header-en-768-sticky', url: `${base}/en/`, w: 768, h: 1024, sticky: true },
  { name: 'header-en-390', url: `${base}/en/`, w: 390, h: 844, sticky: false },
  { name: 'header-en-390-sticky', url: `${base}/en/`, w: 390, h: 844, sticky: true },
  { name: 'header-de-1440', url: `${base}/de/`, w: 1440, h: 900, sticky: false },
  { name: 'header-de-1440-sticky', url: `${base}/de/`, w: 1440, h: 900, sticky: true },
  { name: 'header-de-768', url: `${base}/de/`, w: 768, h: 1024, sticky: false },
  { name: 'header-de-768-sticky', url: `${base}/de/`, w: 768, h: 1024, sticky: true },
  { name: 'header-de-390', url: `${base}/de/`, w: 390, h: 844, sticky: false },
  { name: 'header-de-390-sticky', url: `${base}/de/`, w: 390, h: 844, sticky: true },
  { name: 'home-en-desktop', url: `${base}/en/`, w: 1440, h: 900, sticky: false },
  { name: 'home-en-mobile', url: `${base}/en/`, w: 390, h: 844, sticky: false },
  { name: 'home-de-desktop', url: `${base}/de/`, w: 1440, h: 900, sticky: false },
  { name: 'home-de-mobile', url: `${base}/de/`, w: 390, h: 844, sticky: false },
  {
    name: 'tour-en-desktop',
    url: `${base}/en/tours/7-day-sri-lanka-tour/`,
    w: 1440,
    h: 900,
    sticky: false,
  },
  {
    name: 'tour-en-mobile',
    url: `${base}/en/tours/7-day-sri-lanka-tour/`,
    w: 390,
    h: 844,
    sticky: false,
  },
  {
    name: 'tour-de-desktop',
    url: `${base}/de/touren/7-tage-sri-lanka-rundreise/`,
    w: 1440,
    h: 900,
    sticky: false,
  },
  {
    name: 'tour-de-mobile',
    url: `${base}/de/touren/7-tage-sri-lanka-rundreise/`,
    w: 390,
    h: 844,
    sticky: false,
  },
];

const browser = await chromium.launch({ headless: true });
for (const s of shots) {
  const page = await browser.newPage({
    viewport: { width: s.w, height: s.h },
    deviceScaleFactor: 1,
  });
  await page.goto(s.url, { waitUntil: 'networkidle', timeout: 60000 });
  await page.waitForTimeout(600);
  if (s.sticky) {
    await page.evaluate(() => window.scrollTo(0, 900));
    await page.waitForTimeout(300);
  }
  const path = join(out, `${s.name}.png`);
  await page.screenshot({ path, fullPage: false });
  console.log('wrote', s.name);
  await page.close();
}
await browser.close();
console.log('done');

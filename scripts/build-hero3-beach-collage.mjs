/**
 * Build carousel slide-3 beach collage (stilt fishing, turtle, snorkel).
 * Run: node scripts/build-hero3-beach-collage.mjs
 */
import { execFileSync } from 'node:child_process';
import { copyFile, mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { chromium } from 'playwright';
import decodeJpeg, { init as initJpegDecode } from '@jsquash/jpeg/decode.js';
import encodeJpeg, { init as initJpegEncode } from '@jsquash/jpeg/encode.js';
import encodeWebp, { init as initWebpEncode } from '@jsquash/webp/encode.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const assetsCursor = path.join(
  'C:/Users/jeams/.cursor/projects/d-Website-jojotravels-ceylonjojotravels/assets',
);
const carouselDir = path.join(root, 'src/assets/img/carousel');
const outDir = path.join(root, 'scripts/.tmp-hero3-collage');
const srcDir = path.join(outDir, 'src');

await mkdir(srcDir, { recursive: true });

const ps = `
$base = '${assetsCursor.replace(/\//g, '\\')}'
$dest = '${srcDir.replace(/\//g, '\\')}'
New-Item -ItemType Directory -Force -Path $dest | Out-Null
$filters = @{
  stilts='*gjvahwfjyvafq808qpra-9bb01265*';
  turtle='*dtebtjzozh7sfof4ci7c-cd26e059*';
  snorkel='*xgagrb88jxwi6xtth2bz-8712f5e9*'
}
foreach ($k in $filters.Keys) {
  $f = Get-ChildItem -LiteralPath $base -Filter $filters[$k] | Select-Object -First 1
  if (-not $f) { throw "Missing $k ($($filters[$k]))" }
  Copy-Item -LiteralPath ("\\\\?\\" + $f.FullName) -Destination (Join-Path $dest ($k + '.png')) -Force
}
`;
execFileSync('powershell.exe', ['-NoProfile', '-Command', ps], { stdio: 'inherit' });

const sources = {
  A: 'stilts.png',
  B: 'turtle.png',
  C: 'snorkel.png',
};

let html = await readFile(path.join(__dirname, 'hero3-beach-collage-template.html'), 'utf8');
for (const [key, file] of Object.entries(sources)) {
  html = html.replace(`FILE_${key}`, pathToFileURL(path.join(srcDir, file)).href);
}
const htmlPath = path.join(outDir, 'collage.html');
await writeFile(htmlPath, html);

const browser = await chromium.launch();
const page = await browser.newPage({
  viewport: { width: 1920, height: 720 },
  deviceScaleFactor: 2,
});
await page.goto(pathToFileURL(htmlPath).href, { waitUntil: 'networkidle' });
await page.waitForTimeout(500);
const broken = await page.locator('img').evaluateAll((imgs) =>
  imgs.map((img) => ({ ok: img.naturalWidth > 0 })),
);
console.log('panel status', broken.map((b) => (b.ok ? 'ok' : 'BROKEN')).join(', '));
if (broken.some((b) => !b.ok)) {
  throw new Error('One or more collage panels failed to load');
}
const jpgBuf = await page.screenshot({
  type: 'jpeg',
  quality: 95,
  clip: { x: 0, y: 0, width: 1920, height: 720 },
});
await browser.close();

const jpegWasmDec = await WebAssembly.compile(
  await readFile(path.join(root, 'node_modules/@jsquash/jpeg/codec/dec/mozjpeg_dec.wasm')),
);
const jpegWasmEnc = await WebAssembly.compile(
  await readFile(path.join(root, 'node_modules/@jsquash/jpeg/codec/enc/mozjpeg_enc.wasm')),
);
const webpEncWasm = await WebAssembly.compile(
  await readFile(path.join(root, 'node_modules/@jsquash/webp/codec/enc/webp_enc.wasm')),
);
await initJpegDecode(jpegWasmDec);
await initJpegEncode(jpegWasmEnc);
await initWebpEncode(webpEncWasm);

function resizeBilinear(imageData, targetW) {
  const { data, width, height } = imageData;
  if (width <= targetW) return imageData;
  const targetH = Math.max(1, Math.round((height * targetW) / width));
  const out = new Uint8ClampedArray(targetW * targetH * 4);
  const xRatio = (width - 1) / Math.max(1, targetW - 1);
  const yRatio = (height - 1) / Math.max(1, targetH - 1);
  for (let y = 0; y < targetH; y++) {
    const sy = y * yRatio;
    const y0 = Math.floor(sy);
    const y1 = Math.min(height - 1, y0 + 1);
    const fy = sy - y0;
    for (let x = 0; x < targetW; x++) {
      const sx = x * xRatio;
      const x0 = Math.floor(sx);
      const x1 = Math.min(width - 1, x0 + 1);
      const fx = sx - x0;
      const di = (y * targetW + x) * 4;
      for (let c = 0; c < 4; c++) {
        const p00 = data[(y0 * width + x0) * 4 + c];
        const p10 = data[(y0 * width + x1) * 4 + c];
        const p01 = data[(y1 * width + x0) * 4 + c];
        const p11 = data[(y1 * width + x1) * 4 + c];
        const top = p00 + (p10 - p00) * fx;
        const bot = p01 + (p11 - p01) * fx;
        out[di + c] = Math.round(top + (bot - top) * fy);
      }
    }
  }
  return { data: out, width: targetW, height: targetH };
}

const full = await decodeJpeg(jpgBuf.buffer.slice(jpgBuf.byteOffset, jpgBuf.byteOffset + jpgBuf.byteLength));
console.log(`decoded master ${full.width}x${full.height}`);
await writeFile(path.join(carouselDir, 'hero-4-beach.jpg'), Buffer.from(await encodeJpeg(full, { quality: 86 })));

const widths = [
  { w: 640, webpQ: 72, jpegQ: 78 },
  { w: 800, webpQ: 72, jpegQ: 78 },
  { w: 960, webpQ: 72, jpegQ: 78 },
  { w: 1280, webpQ: 74, jpegQ: 80 },
  { w: 1600, webpQ: 74, jpegQ: 80 },
  { w: 1920, webpQ: 76, jpegQ: 82 },
];

for (const { w, webpQ, jpegQ } of widths) {
  const resized = resizeBilinear(full, w);
  const webp = await encodeWebp(resized, { quality: webpQ, method: 6 });
  const jpg = await encodeJpeg(resized, { quality: jpegQ });
  await writeFile(path.join(carouselDir, `hero-4-beach-${w}.webp`), Buffer.from(webp));
  await writeFile(path.join(carouselDir, `hero-4-beach-${w}.jpg`), Buffer.from(jpg));
  console.log(`hero-4-beach-${w}.webp ${(webp.byteLength / 1024).toFixed(1)} KiB`);
}

await copyFile(path.join(carouselDir, 'hero-4-beach-1920.webp'), path.join(carouselDir, 'hero-4-beach.webp'));
await writeFile(path.join(outDir, 'hero-4-beach-collage-preview.jpg'), Buffer.from(jpgBuf));
await copyFile(
  path.join(outDir, 'hero-4-beach-collage-preview.jpg'),
  path.join(carouselDir, 'hero-4-beach-collage-preview.jpg'),
);

console.log('Updated hero-4-beach carousel assets (slide 3 collage).');

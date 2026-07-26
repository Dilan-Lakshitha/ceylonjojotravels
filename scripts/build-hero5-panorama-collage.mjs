/**
 * Build carousel slide-5 panorama collage (Sigiriya, tea, Kandy, Galle).
 * Run: node scripts/build-hero5-panorama-collage.mjs
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
const outDir = path.join(root, 'scripts/.tmp-hero5-collage');
const srcDir = path.join(outDir, 'src');

await mkdir(srcDir, { recursive: true });

const ps = `
$base = '${assetsCursor.replace(/\//g, '\\')}'
$dest = '${srcDir.replace(/\//g, '\\')}'
New-Item -ItemType Directory -Force -Path $dest | Out-Null
$filters = @{
  sigiriya='*1-b3344bba*';
  teaCouple='*3-21b5d71e*';
  teaHill='*2-503bcf02*';
  kandy='*4-b544a949*';
  galle='*5-5c4961f3*'
}
foreach ($k in $filters.Keys) {
  $f = Get-ChildItem -LiteralPath $base -Filter $filters[$k] | Select-Object -First 1
  if (-not $f) { throw "Missing $k ($($filters[$k]))" }
  Copy-Item -LiteralPath ("\\\\?\\" + $f.FullName) -Destination (Join-Path $dest ($k + '.png')) -Force
}
`;
execFileSync('powershell.exe', ['-NoProfile', '-Command', ps], { stdio: 'inherit' });

const sources = {
  A: 'sigiriya.png',
  B: 'teaCouple.png',
  C: 'teaHill.png',
  D: 'kandy.png',
  E: 'galle.png',
};

let html = await readFile(path.join(__dirname, 'hero5-panorama-collage-template.html'), 'utf8');
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
await writeFile(path.join(carouselDir, 'hero-3-panorama.jpg'), Buffer.from(await encodeJpeg(full, { quality: 86 })));

const widths = [
  { w: 640, webpQ: 28, jpegQ: 55 },
  { w: 800, webpQ: 28, jpegQ: 55 },
  { w: 960, webpQ: 22, jpegQ: 52 },
  { w: 1280, webpQ: 26, jpegQ: 55 },
  { w: 1600, webpQ: 28, jpegQ: 58 },
  { w: 1920, webpQ: 30, jpegQ: 60 },
];

for (const { w, webpQ, jpegQ } of widths) {
  const resized = resizeBilinear(full, w);
  const webp = await encodeWebp(resized, { quality: webpQ, method: 6 });
  const jpg = await encodeJpeg(resized, { quality: jpegQ });
  await writeFile(path.join(carouselDir, `hero-3-panorama-${w}.webp`), Buffer.from(webp));
  await writeFile(path.join(carouselDir, `hero-3-panorama-${w}.jpg`), Buffer.from(jpg));
  console.log(`hero-3-panorama-${w}.webp ${(webp.byteLength / 1024).toFixed(1)} KiB`);
}

await copyFile(path.join(carouselDir, 'hero-3-panorama-1920.webp'), path.join(carouselDir, 'hero-3-panorama.webp'));
await writeFile(path.join(outDir, 'hero-3-panorama-collage-preview.jpg'), Buffer.from(jpgBuf));
await copyFile(
  path.join(outDir, 'hero-3-panorama-collage-preview.jpg'),
  path.join(carouselDir, 'hero-3-panorama-collage-preview.jpg'),
);

console.log('Updated hero-3-panorama carousel assets (slide 5 collage).');

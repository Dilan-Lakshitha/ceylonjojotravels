/**
 * Build carousel slide-1 collage from the user's source photos (real pixels).
 * Run: node scripts/build-hero1-collage.mjs
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
const outDir = path.join(root, 'scripts/.tmp-hero-collage');
const srcDir = path.join(outDir, 'src');

await mkdir(srcDir, { recursive: true });

/** Long Cursor asset names exceed Windows MAX_PATH — copy via PowerShell \\?\ prefix. */
const ps = `
$base = '${assetsCursor.replace(/\//g, '\\')}'
$dest = '${srcDir.replace(/\//g, '\\')}'
New-Item -ItemType Directory -Force -Path $dest | Out-Null
$filters = @{
  bullock='*34-3f577eec*'; leopard='*8446992822022*'; family='*24-b34f73cf*';
  elephants='*550025563*'; turtle='*19-16b12784*'; sigiriya='*41-38492d81*'; tower='*12-39f6e5c0*'
}
foreach ($k in $filters.Keys) {
  $f = Get-ChildItem -LiteralPath $base -Filter $filters[$k] | Select-Object -First 1
  if (-not $f) { throw "Missing $k" }
  Copy-Item -LiteralPath ("\\\\?\\" + $f.FullName) -Destination (Join-Path $dest ($k + '.png')) -Force
}
`;
execFileSync('powershell.exe', ['-NoProfile', '-Command', ps], { stdio: 'inherit' });

const sources = {
  A: 'bullock.png',
  B: 'leopard.png',
  C: 'family.png',
  D: 'elephants.png',
  E: 'turtle.png',
  F: 'sigiriya.png',
  G: 'tower.png',
};

let html = await readFile(path.join(__dirname, 'hero-collage-template.html'), 'utf8');
for (const [key, file] of Object.entries(sources)) {
  html = html.replace(`FILE_${key}`, pathToFileURL(path.join(srcDir, file)).href);
}
const htmlPath = path.join(outDir, 'collage.html');
await writeFile(htmlPath, html);

const browser = await chromium.launch();
// Capture at 2x so each collage panel has enough pixels for desktop/retina heroes.
const page = await browser.newPage({
  viewport: { width: 1920, height: 720 },
  deviceScaleFactor: 2,
});
await page.goto(pathToFileURL(htmlPath).href, { waitUntil: 'networkidle' });
await page.waitForTimeout(500);
const broken = await page.locator('img').evaluateAll((imgs) =>
  imgs.map((img) => ({ ok: img.naturalWidth > 0, src: img.getAttribute('src') })),
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
console.log(`master capture ~${(jpgBuf.byteLength / 1024).toFixed(0)} KiB (expected ~3840x1440)`);

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

await writeFile(path.join(carouselDir, 'hero-1-experiences.jpg'), Buffer.from(await encodeJpeg(full, { quality: 86 })));

const widths = [
  { w: 640, webpQ: 28, jpegQ: 55 },
  { w: 960, webpQ: 12, jpegQ: 45 },
  { w: 1280, webpQ: 22, jpegQ: 52 },
  { w: 1600, webpQ: 25, jpegQ: 55 },
  { w: 1920, webpQ: 28, jpegQ: 58 },
];

for (const { w, webpQ, jpegQ } of widths) {
  const resized = resizeBilinear(full, w);
  const webp = await encodeWebp(resized, { quality: webpQ, method: 6 });
  const jpg = await encodeJpeg(resized, { quality: jpegQ });
  await writeFile(path.join(carouselDir, `hero-1-experiences-${w}.webp`), Buffer.from(webp));
  await writeFile(path.join(carouselDir, `hero-1-experiences-${w}.jpg`), Buffer.from(jpg));
  console.log(`hero-1-experiences-${w}.webp ${(webp.byteLength / 1024).toFixed(1)} KiB (${resized.width}x${resized.height})`);
}

// Compat aliases used by older preload / scripts
await copyFile(
  path.join(carouselDir, 'hero-1-experiences-1920.webp'),
  path.join(carouselDir, 'hero-1-experiences.webp'),
);
await copyFile(
  path.join(carouselDir, 'hero-1-experiences-1280.webp'),
  path.join(carouselDir, 'hero-1-experiences-1280.webp'),
);
await writeFile(path.join(outDir, 'hero-1-collage-preview.jpg'), Buffer.from(jpgBuf));
await copyFile(
  path.join(outDir, 'hero-1-collage-preview.jpg'),
  path.join(carouselDir, 'hero-1-experiences-collage-preview.jpg'),
);

console.log('Updated hero-1-experiences carousel assets (high-res, all 7 panels OK).');

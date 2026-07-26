/**
 * One-shot recompress of hero-1 collage delivery sizes (Lighthouse image delivery).
 * Run: node scripts/recompress-hero1-delivery.mjs
 */
import { copyFile, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import decodeJpeg, { init as initJpegDecode } from '@jsquash/jpeg/decode.js';
import encodeJpeg, { init as initJpegEncode } from '@jsquash/jpeg/encode.js';
import encodeWebp, { init as initWebpEncode } from '@jsquash/webp/encode.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const dir = path.join(root, 'src/assets/img/carousel');

await initJpegDecode(
  await WebAssembly.compile(
    await readFile(path.join(root, 'node_modules/@jsquash/jpeg/codec/dec/mozjpeg_dec.wasm')),
  ),
);
await initJpegEncode(
  await WebAssembly.compile(
    await readFile(path.join(root, 'node_modules/@jsquash/jpeg/codec/enc/mozjpeg_enc.wasm')),
  ),
);
await initWebpEncode(
  await WebAssembly.compile(
    await readFile(path.join(root, 'node_modules/@jsquash/webp/codec/enc/webp_enc.wasm')),
  ),
);

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

const master = await readFile(path.join(dir, 'hero-1-experiences.jpg'));
const full = await decodeJpeg(
  master.buffer.slice(master.byteOffset, master.byteOffset + master.byteLength),
);

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
  await writeFile(path.join(dir, `hero-1-experiences-${w}.webp`), Buffer.from(webp));
  await writeFile(path.join(dir, `hero-1-experiences-${w}.jpg`), Buffer.from(jpg));
  const note =
    w === 960 ? ` (save vs 63.6: ${(63.6 - webp.byteLength / 1024).toFixed(1)} KiB)` : '';
  console.log(`hero-1-experiences-${w}.webp ${(webp.byteLength / 1024).toFixed(1)} KiB${note}`);
}

await copyFile(
  path.join(dir, 'hero-1-experiences-1920.webp'),
  path.join(dir, 'hero-1-experiences.webp'),
);

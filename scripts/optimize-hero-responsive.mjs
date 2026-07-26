/**
 * Build 640w / 800w hero variants (WebP + JPEG) for carousel slides 2–6.
 * Slide 1 already has responsive variants.
 *
 * Run: node scripts/optimize-hero-responsive.mjs
 */
import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import decodeJpeg, { init as initJpegDecode } from '@jsquash/jpeg/decode.js';
import encodeJpeg, { init as initJpegEncode } from '@jsquash/jpeg/encode.js';
import decodeWebp, { init as initWebpDecode } from '@jsquash/webp/decode.js';
import encodeWebp, { init as initWebpEncode } from '@jsquash/webp/encode.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const dir = path.join(root, 'src/assets/img/carousel');

const jpegWasmDec = await WebAssembly.compile(
  await readFile(path.join(root, 'node_modules/@jsquash/jpeg/codec/dec/mozjpeg_dec.wasm')),
);
const jpegWasmEnc = await WebAssembly.compile(
  await readFile(path.join(root, 'node_modules/@jsquash/jpeg/codec/enc/mozjpeg_enc.wasm')),
);
const webpDecWasm = await WebAssembly.compile(
  await readFile(path.join(root, 'node_modules/@jsquash/webp/codec/dec/webp_dec.wasm')),
);
const webpEncWasm = await WebAssembly.compile(
  await readFile(path.join(root, 'node_modules/@jsquash/webp/codec/enc/webp_enc.wasm')),
);
await initJpegDecode(jpegWasmDec);
await initJpegEncode(jpegWasmEnc);
await initWebpDecode(webpDecWasm);
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

async function decodeSource(base) {
  try {
    const jpg = await readFile(path.join(dir, `${base}.jpg`));
    return decodeJpeg(jpg.buffer.slice(jpg.byteOffset, jpg.byteOffset + jpg.byteLength));
  } catch {
    const webp = await readFile(path.join(dir, `${base}.webp`));
    return decodeWebp(webp.buffer.slice(webp.byteOffset, webp.byteOffset + webp.byteLength));
  }
}

const heroes = [
  { base: 'hero-5-safari', webpQ: 62, jpegQ: 68 },
  { base: 'hero-4-beach', webpQ: 62, jpegQ: 68 },
  { base: 'hero-2-ella', webpQ: 60, jpegQ: 66 },
  { base: 'hero-3-panorama', webpQ: 62, jpegQ: 68 },
  { base: 'hero-6-temple', webpQ: 60, jpegQ: 66 },
];
const widths = [640, 800];

for (const hero of heroes) {
  const full = await decodeSource(hero.base);
  console.log(`${hero.base}: source ${full.width}x${full.height}`);
  for (const w of widths) {
    const resized = resizeBilinear(full, w);
    const webp = await encodeWebp(resized, { quality: hero.webpQ, method: 6 });
    const jpg = await encodeJpeg(resized, { quality: hero.jpegQ });
    await writeFile(path.join(dir, `${hero.base}-${w}.webp`), Buffer.from(webp));
    await writeFile(path.join(dir, `${hero.base}-${w}.jpg`), Buffer.from(jpg));
    console.log(
      `  ${hero.base}-${w}.webp ${(webp.byteLength / 1024).toFixed(1)} KiB | jpg ${(jpg.byteLength / 1024).toFixed(1)} KiB (${resized.width}x${resized.height})`,
    );
  }
}

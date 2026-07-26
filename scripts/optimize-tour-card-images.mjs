/**
 * Generate 400w card thumbs (WebP + JPEG) for homepage / listing tour cards.
 * Reads image paths from src/assets/i18n/en/tours.json catalog.
 *
 * assets/img/foo/bar.jpg  →  assets/img/foo/bar-400.webp + bar-400.jpg
 *
 * Run: node scripts/optimize-tour-card-images.mjs
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
const imgRoot = path.join(root, 'src');
const TARGET_W = 400;
const WEBP_QUALITY = 62;
const JPEG_QUALITY = 68;

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
  if (width <= targetW) {
    return imageData;
  }
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

function cardPaths(assetPath) {
  const match = assetPath.match(/^(.*)\.(jpe?g|png|webp)$/i);
  if (!match) return null;
  return {
    webp: `${match[1]}-400.webp`,
    jpg: `${match[1]}-400.jpg`,
  };
}

const toursJson = JSON.parse(
  await readFile(path.join(root, 'src/assets/i18n/en/tours.json'), 'utf8'),
);
const catalogImages = [
  ...(toursJson.catalog?.dayTours ?? []),
  ...(toursJson.catalog?.multiDayTours ?? []),
]
  .map((t) => t.image)
  .filter(Boolean);

const unique = [...new Set(catalogImages)];
let savedBytes = 0;

for (const assetPath of unique) {
  const outs = cardPaths(assetPath);
  if (!outs) {
    console.warn(`skip (unsupported): ${assetPath}`);
    continue;
  }

  const srcAbs = path.join(imgRoot, assetPath);
  const before = await readFile(srcAbs);
  const bytes = before.buffer.slice(before.byteOffset, before.byteOffset + before.byteLength);
  let imageData;
  try {
    const isWebp = before.length >= 12
      && before[0] === 0x52 && before[1] === 0x49 && before[2] === 0x46 && before[3] === 0x46
      && before[8] === 0x57 && before[9] === 0x45 && before[10] === 0x42 && before[11] === 0x50;
    imageData = isWebp ? await decodeWebp(bytes) : await decodeJpeg(bytes);
  } catch (err) {
    console.warn(`skip (decode failed): ${assetPath}`, err.message ?? err);
    continue;
  }

  const resized = resizeBilinear(imageData, TARGET_W);
  const webp = await encodeWebp(resized, { quality: WEBP_QUALITY, method: 6 });
  const jpg = await encodeJpeg(resized, { quality: JPEG_QUALITY });

  await writeFile(path.join(imgRoot, outs.webp), Buffer.from(webp));
  await writeFile(path.join(imgRoot, outs.jpg), Buffer.from(jpg));

  const beforeKiB = before.byteLength / 1024;
  const afterKiB = webp.byteLength / 1024;
  savedBytes += Math.max(0, before.byteLength - webp.byteLength);
  console.log(
    `${assetPath}\n  → ${outs.webp} ${afterKiB.toFixed(1)} KiB (${imageData.width}x${imageData.height} → ${resized.width}x${resized.height}, was ${beforeKiB.toFixed(1)} KiB)`,
  );
}

console.log(`\nDone. ~${(savedBytes / 1024).toFixed(0)} KiB smaller vs originals (WebP).`);

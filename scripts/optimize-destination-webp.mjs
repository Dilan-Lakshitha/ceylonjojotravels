/**
 * Recompress destination-5 card images (Lighthouse: Improve image delivery).
 * Run: node scripts/optimize-destination-webp.mjs
 */
import { copyFile, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import decodeJpeg, { init as initJpegDecode } from '@jsquash/jpeg/decode.js';
import encodeJpeg, { init as initJpegEncode } from '@jsquash/jpeg/encode.js';
import encodeWebp, { init as initWebpEncode } from '@jsquash/webp/encode.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const imgDir = path.join(root, 'src/assets/img');

const jpegWasmDec = await WebAssembly.compile(
  await readFile(path.join(root, 'node_modules/@jsquash/jpeg/codec/dec/mozjpeg_dec.wasm')),
);
const jpegWasmEnc = await WebAssembly.compile(
  await readFile(path.join(root, 'node_modules/@jsquash/jpeg/codec/enc/mozjpeg_enc.wasm')),
);
const webpWasm = await WebAssembly.compile(
  await readFile(path.join(root, 'node_modules/@jsquash/webp/codec/enc/webp_enc.wasm')),
);
await initJpegDecode(jpegWasmDec);
await initJpegEncode(jpegWasmEnc);
await initWebpEncode(webpWasm);

// Prefer full-res source when present so we don't re-encode an already-compressed 360.jpg.
const sourceCandidates = ['destination-5.jpg', 'destination-5-360.jpg'];
let jpeg;
let sourceName;
for (const name of sourceCandidates) {
  try {
    jpeg = await readFile(path.join(imgDir, name));
    sourceName = name;
    break;
  } catch {
    /* try next */
  }
}
if (!jpeg) {
  throw new Error('No destination-5 JPEG source found');
}

const imageData = await decodeJpeg(jpeg.buffer.slice(jpeg.byteOffset, jpeg.byteOffset + jpeg.byteLength));

// Card display is ~350 CSS px; keep 360×225 raster and compress hard enough for Lighthouse (~4 KiB).
const targetW = 360;
const targetH = 225;
let frame = imageData;
if (imageData.width !== targetW || imageData.height !== targetH) {
  const { data, width, height } = imageData;
  const out = new Uint8ClampedArray(targetW * targetH * 4);
  for (let y = 0; y < targetH; y++) {
    const sy = Math.min(height - 1, Math.floor((y + 0.5) * (height / targetH)));
    for (let x = 0; x < targetW; x++) {
      const sx = Math.min(width - 1, Math.floor((x + 0.5) * (width / targetW)));
      const si = (sy * width + sx) * 4;
      const di = (y * targetW + x) * 4;
      out[di] = data[si];
      out[di + 1] = data[si + 1];
      out[di + 2] = data[si + 2];
      out[di + 3] = data[si + 3];
    }
  }
  frame = { data: out, width: targetW, height: targetH };
}

const webp = await encodeWebp(frame, { quality: 32, method: 6 });
const outJpg = await encodeJpeg(frame, { quality: 62 });

await writeFile(path.join(imgDir, 'destination-5-360.webp'), Buffer.from(webp));
await writeFile(path.join(imgDir, 'destination-5-360.jpg'), Buffer.from(outJpg));
await copyFile(path.join(imgDir, 'destination-5-360.webp'), path.join(imgDir, 'destination-5-350.webp'));
await copyFile(path.join(imgDir, 'destination-5-360.jpg'), path.join(imgDir, 'destination-5-350.jpg'));

console.log(`source: ${sourceName} (${imageData.width}x${imageData.height})`);
console.log(`destination-5-360.webp: ${(webp.byteLength / 1024).toFixed(1)} KiB`);
console.log(`destination-5-360.jpg: ${(outJpg.byteLength / 1024).toFixed(1)} KiB`);

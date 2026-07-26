/**
 * Convert carousel hero JPEGs to WebP using @jsquash WASM codecs.
 * Run: node scripts/optimize-hero-webp.mjs
 */
import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import decodeJpeg, { init as initJpegDecode } from '@jsquash/jpeg/decode.js';
import encodeWebp, { init as initWebpEncode } from '@jsquash/webp/encode.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const carouselDir = path.join(root, 'src/assets/img/carousel');

const jpegWasm = await WebAssembly.compile(
  await readFile(path.join(root, 'node_modules/@jsquash/jpeg/codec/dec/mozjpeg_dec.wasm')),
);
const webpWasm = await WebAssembly.compile(
  await readFile(path.join(root, 'node_modules/@jsquash/webp/codec/enc/webp_enc.wasm')),
);
await initJpegDecode(jpegWasm);
await initWebpEncode(webpWasm);

const jobs = [
  { src: 'hero-1-experiences.jpg', dest: 'hero-1-experiences.webp', quality: 68 },
  { src: 'hero-1-experiences-1280.jpg', dest: 'hero-1-experiences-1280.webp', quality: 66 },
  { src: 'hero-1-experiences-960.jpg', dest: 'hero-1-experiences-960.webp', quality: 68 },
  { src: 'hero-1-experiences-640.jpg', dest: 'hero-1-experiences-640.webp', quality: 70 },
  { src: 'hero-2-ella.jpg', dest: 'hero-2-ella.webp', quality: 70 },
  { src: 'hero-3-panorama.jpg', dest: 'hero-3-panorama.webp', quality: 70 },
  { src: 'hero-4-beach.jpg', dest: 'hero-4-beach.webp', quality: 70 },
  { src: 'hero-5-safari.jpg', dest: 'hero-5-safari.webp', quality: 70 },
  { src: 'hero-6-temple.jpg', dest: 'hero-6-temple.webp', quality: 70 },
];

for (const job of jobs) {
  const srcPath = path.join(carouselDir, job.src);
  const destPath = path.join(carouselDir, job.dest);
  const jpeg = await readFile(srcPath);
  const imageData = await decodeJpeg(jpeg.buffer.slice(jpeg.byteOffset, jpeg.byteOffset + jpeg.byteLength));
  const webp = await encodeWebp(imageData, { quality: job.quality });
  await writeFile(destPath, Buffer.from(webp));
  const pct = ((1 - webp.byteLength / jpeg.byteLength) * 100).toFixed(0);
  console.log(
    `${job.dest}: ${(webp.byteLength / 1024).toFixed(1)} KiB (−${pct}% vs ${job.src})`,
  );
}

/**
 * Optimize homepage About section images (main + two inline).
 * Run: node scripts/optimize-about-images.mjs
 */
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { chromium } from 'playwright';
import decodeJpeg, { init as initJpegDecode } from '@jsquash/jpeg/decode.js';
import encodeJpeg, { init as initJpegEncode } from '@jsquash/jpeg/encode.js';
import encodeWebp, { init as initWebpEncode } from '@jsquash/webp/encode.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const srcDir = path.join(root, 'scripts/.tmp-about/src');
const outDir = path.join(root, 'src/assets/img');

await initJpegDecode(
  await WebAssembly.compile(await readFile(path.join(root, 'node_modules/@jsquash/jpeg/codec/dec/mozjpeg_dec.wasm'))),
);
await initJpegEncode(
  await WebAssembly.compile(await readFile(path.join(root, 'node_modules/@jsquash/jpeg/codec/enc/mozjpeg_enc.wasm'))),
);
await initWebpEncode(
  await WebAssembly.compile(await readFile(path.join(root, 'node_modules/@jsquash/webp/codec/enc/webp_enc.wasm'))),
);

function resizeBilinear(imageData, targetW, targetH) {
  const { data, width, height } = imageData;
  const out = new Uint8ClampedArray(targetW * targetH * 4);
  // cover-style crop to target aspect
  const srcAspect = width / height;
  const dstAspect = targetW / targetH;
  let sw = width;
  let sh = height;
  let sx = 0;
  let sy = 0;
  if (srcAspect > dstAspect) {
    sw = Math.round(height * dstAspect);
    sx = Math.floor((width - sw) / 2);
  } else {
    sh = Math.round(width / dstAspect);
    sy = Math.floor((height - sh) / 2);
  }
  const xRatio = (sw - 1) / Math.max(1, targetW - 1);
  const yRatio = (sh - 1) / Math.max(1, targetH - 1);
  for (let y = 0; y < targetH; y++) {
    const syf = sy + y * yRatio;
    const y0 = Math.floor(syf);
    const y1 = Math.min(sy + sh - 1, y0 + 1);
    const fy = syf - y0;
    for (let x = 0; x < targetW; x++) {
      const sxf = sx + x * xRatio;
      const x0 = Math.floor(sxf);
      const x1 = Math.min(sx + sw - 1, x0 + 1);
      const fx = sxf - x0;
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

async function loadAsJpegImageData(filePath, w, h) {
  // Normalize any format via Playwright screenshot of an img tag
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: w, height: h }, deviceScaleFactor: 1 });
  const html = `<!doctype html><html><body style="margin:0;background:#000">
    <img src="${pathToFileURL(filePath).href}" style="width:${w}px;height:${h}px;object-fit:cover;display:block" />
  </body></html>`;
  const tmpHtml = path.join(root, 'scripts/.tmp-about/frame.html');
  await mkdir(path.dirname(tmpHtml), { recursive: true });
  await writeFile(tmpHtml, html);
  await page.goto(pathToFileURL(tmpHtml).href, { waitUntil: 'networkidle' });
  await page.waitForTimeout(200);
  const jpg = await page.screenshot({ type: 'jpeg', quality: 92, clip: { x: 0, y: 0, width: w, height: h } });
  await browser.close();
  return decodeJpeg(jpg.buffer.slice(jpg.byteOffset, jpg.byteOffset + jpg.byteLength));
}

const jobs = [
  { src: 'main.png', outJpg: 'about-main.jpg', outWebp: 'about-main.webp', w: 800, h: 1000, q: 72 },
  { src: 'about1.png', outJpg: 'about-1.jpg', outWebp: 'about-1.webp', w: 640, h: 427, q: 70 },
  { src: 'about2.png', outJpg: 'about-2.jpg', outWebp: 'about-2.webp', w: 640, h: 427, q: 70 },
];

for (const job of jobs) {
  const srcPath = path.join(srcDir, job.src);
  const image = await loadAsJpegImageData(srcPath, job.w, job.h);
  const jpg = await encodeJpeg(image, { quality: job.q });
  const webp = await encodeWebp(image, { quality: Math.max(28, job.q - 10), method: 6 });
  await writeFile(path.join(outDir, job.outJpg), Buffer.from(jpg));
  await writeFile(path.join(outDir, job.outWebp), Buffer.from(webp));
  console.log(`${job.outWebp}: ${(webp.byteLength / 1024).toFixed(1)} KiB (${job.w}x${job.h})`);
}

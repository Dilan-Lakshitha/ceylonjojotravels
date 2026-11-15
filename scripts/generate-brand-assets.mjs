/**
 * Upscale/composite existing small logo raster into favicons, apple icon,
 * android icons, square logo-112, and 1200x630 OG card.
 * Does not invent a new mark — only places the real logo file on brand colors.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const brandDir = path.join(__dirname, '../src/assets/images/brand');
const srcLogo = path.join(brandDir, 'logo-96.png');
const primary = { r: 14, g: 90, b: 100, alpha: 1 };
const sand = { r: 250, g: 246, b: 239, alpha: 1 };

async function squareIcon(size, outName, bg = sand) {
  const logoSize = Math.round(size * 0.72);
  const logo = await sharp(srcLogo).resize(logoSize, logoSize, { fit: 'contain' }).png().toBuffer();
  await sharp({
    create: { width: size, height: size, channels: 4, background: bg },
  })
    .composite([{ input: logo, gravity: 'centre' }])
    .png()
    .toFile(path.join(brandDir, outName));
}

async function main() {
  if (!fs.existsSync(srcLogo)) throw new Error('Missing ' + srcLogo);

  await squareIcon(16, 'favicon-16.png');
  await squareIcon(32, 'favicon-32.png');
  await squareIcon(112, 'logo-112.png');
  await squareIcon(180, 'apple-touch-icon.png');
  await squareIcon(192, 'android-chrome-192.png');
  await squareIcon(512, 'android-chrome-512.png');

  // ICO: use 32px png as favicon.ico substitute if sharp can't write ico easily
  await sharp(path.join(brandDir, 'favicon-32.png')).toFile(path.join(brandDir, 'favicon.ico'));

  const ogW = 1200;
  const ogH = 630;
  const logoSize = 220;
  const logo = await sharp(srcLogo).resize(logoSize, logoSize, { fit: 'contain' }).png().toBuffer();
  const svgText = Buffer.from(`
    <svg width="${ogW}" height="${ogH}" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="#0E5A64"/>
      <text x="50%" y="72%" text-anchor="middle" fill="#FAF6EF"
        font-family="Georgia, serif" font-size="52" font-weight="700">Ceylon Jojo Travels</text>
      <text x="50%" y="82%" text-anchor="middle" fill="#F2A53A"
        font-family="Arial, sans-serif" font-size="28">Private tours in Sri Lanka</text>
    </svg>
  `);
  await sharp(svgText)
    .composite([{ input: logo, top: 140, left: Math.round((ogW - logoSize) / 2) }])
    .png()
    .toFile(path.join(brandDir, 'og-default.png'));

  console.log('Brand assets written to', brandDir);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

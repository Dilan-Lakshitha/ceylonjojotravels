import sharp from 'sharp';
import { join } from 'path';

const dir = 'src/assets/img/carousel';
const src = join(dir, 'hero-2-ella.jpg');
const widths = [960, 1280, 1600, 1920];

for (const w of widths) {
  await sharp(src)
    .resize(w, null, { withoutEnlargement: true })
    .jpeg({ quality: 82, mozjpeg: true })
    .toFile(join(dir, `hero-2-ella-${w}.jpg`));
  await sharp(src)
    .resize(w, null, { withoutEnlargement: true })
    .webp({ quality: 78 })
    .toFile(join(dir, `hero-2-ella-${w}.webp`));
  await sharp(src)
    .resize(w, null, { withoutEnlargement: true })
    .avif({ quality: 55 })
    .toFile(join(dir, `hero-2-ella-${w}.avif`));
  console.log('done', w);
}

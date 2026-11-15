import sharp from 'sharp';
import { join } from 'path';

const dir = 'src/assets/img/carousel';
const sources = [
  'hero-1-experiences-collage-preview.jpg',
  'hero-3-panorama-collage-preview.jpg',
  'hero-4-beach-collage-preview.jpg',
  'hero-5-safari-collage-preview.jpg',
  'hero-6-temple-collage-preview.jpg',
];

for (const file of sources) {
  const base = file.replace('-collage-preview.jpg', '');
  const src = join(dir, file);
  for (const w of [480, 800]) {
    await sharp(src)
      .resize(w, Math.round(w * 0.75), { fit: 'cover' })
      .webp({ quality: 75 })
      .toFile(join(dir, `${base}-moments-${w}.webp`));
    await sharp(src)
      .resize(w, Math.round(w * 0.75), { fit: 'cover' })
      .jpeg({ quality: 80, mozjpeg: true })
      .toFile(join(dir, `${base}-moments-${w}.jpg`));
  }
  console.log('moments', base);
}

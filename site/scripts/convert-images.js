import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

async function convert() {
  const publicImages = path.resolve('public', 'images');

  // Convert logo
  await sharp(path.join(publicImages, 'logo.jpg'))
    .webp({ quality: 90 })
    .toFile(path.join(publicImages, 'logo.webp'));

  console.log('logo.webp created');

  // Convert foto_1
  await sharp(path.join(publicImages, 'academia-pesos-livres.jpg'))
    .webp({ quality: 85 })
    .toFile(path.join(publicImages, 'academia-pesos-livres.webp'));

  console.log('academia-pesos-livres.webp created');

  const files = fs.readdirSync(publicImages);
  files.forEach(f => {
    const stats = fs.statSync(path.join(publicImages, f));
    console.log(`${f}: ${(stats.size / 1024).toFixed(2)} KB`);
  });
}

convert().catch(err => {
  console.error(err);
  process.exit(1);
});

import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const imagesDir = path.resolve('./public/images');
const files = fs.readdirSync(imagesDir).filter(f => f.endsWith('.jpg') || f.endsWith('.jpeg'));

async function compress() {
  console.log('Compressing heavy JPEG images to lightweight WebP...');
  for (const file of files) {
    const inputPath = path.join(imagesDir, file);
    const baseName = file.replace(/\.(jpg|jpeg)$/, '');
    const outputPath = path.join(imagesDir, `${baseName}.webp`);
    
    const beforeSize = fs.statSync(inputPath).size;
    await sharp(inputPath)
      .resize(1200, null, { withoutEnlargement: true })
      .webp({ quality: 78, effort: 5 })
      .toFile(outputPath);
      
    const afterSize = fs.statSync(outputPath).size;
    const reduction = Math.round(((beforeSize - afterSize) / beforeSize) * 100);
    console.log(`✓ ${file}: ${(beforeSize / 1024).toFixed(0)}KB → ${baseName}.webp: ${(afterSize / 1024).toFixed(0)}KB (-${reduction}%)`);
  }
  console.log('All images optimized!');
}

compress().catch(console.error);

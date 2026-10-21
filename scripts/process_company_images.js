import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const brainDir = 'C:\\Users\\prashant B hiremath\\.gemini\\antigravity-ide\\brain\\c9047051-2ce9-44ba-a08d-9d7467c6b1fc';
const targetDir = path.resolve('public/images');

const files = [
  {
    src: path.join(brainDir, 'bullmonk_global_newsroom_1792613297384.jpg'),
    dest: path.join(targetDir, 'bullmonk_global_newsroom.webp'),
    width: 1200
  },
  {
    src: path.join(brainDir, 'bullmonk_headquarters_facade_1792613319664.jpg'),
    dest: path.join(targetDir, 'bullmonk_headquarters_facade.webp'),
    width: 1200
  },
  {
    src: path.join(brainDir, 'bullmonk_editorial_board_1792613340971.jpg'),
    dest: path.join(targetDir, 'bullmonk_editorial_board.webp'),
    width: 1200
  },
  {
    src: path.join(brainDir, 'bullmonk_secure_data_vault_1792613364580.jpg'),
    dest: path.join(targetDir, 'bullmonk_secure_data_vault.webp'),
    width: 1200
  }
];

async function run() {
  for (const f of files) {
    if (!fs.existsSync(f.src)) {
      console.error(`Source not found: ${f.src}`);
      continue;
    }
    await sharp(f.src)
      .resize(f.width, Math.round(f.width * 9 / 16), { fit: 'cover' })
      .webp({ quality: 80, effort: 5 })
      .toFile(f.dest);
    const stat = fs.statSync(f.dest);
    console.log(`Generated ${f.dest} (${Math.round(stat.size / 1024)} KB)`);
  }
}

run().catch(console.error);

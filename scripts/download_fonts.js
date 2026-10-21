import https from 'https';
import fs from 'fs';
import path from 'path';

const fontsDir = path.resolve('./public/fonts');
if (!fs.existsSync(fontsDir)) {
  fs.mkdirSync(fontsDir, { recursive: true });
}

const fonts = [
  {
    name: 'PlayfairDisplay-Regular.ttf',
    url: 'https://fonts.gstatic.com/s/playfairdisplay/v40/nuFvD-vYSZviVYUb_rj3ij__anPXJzDwcbmjWBN2PKdFvXDXbtbK_l2q.ttf'
  },
  {
    name: 'PlayfairDisplay-Bold.ttf',
    url: 'https://fonts.gstatic.com/s/playfairdisplay/v40/nuFvD-vYSZviVYUb_rj3ij__anPXJzDwcbmjWBN2PKeiunDXbtbK_l2q.ttf'
  },
  {
    name: 'PlusJakartaSans-Regular.ttf',
    url: 'https://fonts.gstatic.com/s/plusjakartasans/v12/LDIbaomQNQcsA88c7O9yZ4KMCoOg4IA6-91aHEjcWuA_qU79TR_QMquoRg.ttf'
  },
  {
    name: 'PlusJakartaSans-Bold.ttf',
    url: 'https://fonts.gstatic.com/s/plusjakartasans/v12/LDIbaomQNQcsA88c7O9yZ4KMCoOg4IA6-91aHEjcWuA_Tkn9TR_QMquoRg.ttf'
  }
];

function downloadFile(item) {
  return new Promise((resolve, reject) => {
    const dest = path.join(fontsDir, item.name);
    const file = fs.createWriteStream(dest);
    https.get(item.url, (res) => {
      if (res.statusCode !== 200) {
        reject(new Error(`Failed to download ${item.name}: status code ${res.statusCode}`));
        return;
      }
      res.pipe(file);
      file.on('finish', () => {
        file.close(() => {
          const stats = fs.statSync(dest);
          console.log(`✓ Downloaded ${item.name} (${stats.size} bytes)`);
          resolve();
        });
      });
    }).on('error', (err) => {
      fs.unlink(dest, () => {});
      reject(err);
    });
  });
}

async function run() {
  console.log('Downloading official TTF font files for Google News Publisher Center...');
  for (const item of fonts) {
    await downloadFile(item);
  }
  console.log('All fonts downloaded into public/fonts/');
}

run().catch(console.error);

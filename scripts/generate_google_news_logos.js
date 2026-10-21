import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const outputDir = path.resolve('./public/images');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

async function generateLogos() {
  console.log('Generating Google News Publisher Logos...');

  // 1. Square Logo (1000 x 1000 px)
  const squareSvg = `
  <svg width="1000" height="1000" viewBox="0 0 1000 1000" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#0F172A" />
        <stop offset="50%" stop-color="#1E293B" />
        <stop offset="100%" stop-color="#080C14" />
      </linearGradient>
      <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#F59E0B" />
        <stop offset="50%" stop-color="#D97706" />
        <stop offset="100%" stop-color="#B45309" />
      </linearGradient>
      <filter id="shadow" x="-10%" y="-10%" width="120%" height="120%">
        <feDropShadow dx="0" dy="16" stdDeviation="24" flood-color="#000" flood-opacity="0.5" />
      </filter>
    </defs>

    <!-- Outer Rounded Square Background -->
    <rect width="1000" height="1000" rx="180" fill="url(#bgGrad)" />

    <!-- Inner Gold Border Ring -->
    <rect x="50" y="50" width="900" height="900" rx="140" fill="none" stroke="url(#goldGrad)" stroke-width="8" stroke-opacity="0.4" />
    <circle cx="500" cy="460" r="280" fill="none" stroke="url(#goldGrad)" stroke-width="4" stroke-opacity="0.3" stroke-dasharray="16 10" />

    <!-- Center Crest Shield -->
    <rect x="260" y="220" width="480" height="480" rx="100" fill="url(#goldGrad)" filter="url(#shadow)" />

    <!-- Monogram BM -->
    <text x="500" y="550" 
          font-family="Georgia, 'Times New Roman', serif" 
          font-size="250" 
          font-weight="900" 
          fill="#FFFFFF" 
          text-anchor="middle"
          letter-spacing="4">BM</text>

    <!-- Brand Name Text -->
    <text x="500" y="790" 
          font-family="'Plus Jakarta Sans', system-ui, sans-serif" 
          font-size="64" 
          font-weight="800" 
          fill="#FFFFFF" 
          text-anchor="middle" 
          letter-spacing="18">BULLMONK</text>

    <!-- Subtitle -->
    <text x="500" y="850" 
          font-family="'JetBrains Mono', monospace" 
          font-size="24" 
          font-weight="700" 
          fill="#D97706" 
          text-anchor="middle" 
          letter-spacing="6">GLOBAL INTELLIGENCE</text>
  </svg>
  `;

  await sharp(Buffer.from(squareSvg))
    .png()
    .toFile(path.join(outputDir, 'google_news_square_1000x1000.png'));
  console.log('✓ Created google_news_square_1000x1000.png');

  // 2. Rectangular Logo (Light Theme, 800 x 200 px - 4:1 ratio)
  // Transparent background, crisp dark text with gold emblem
  const rectLightSvg = `
  <svg width="800" height="200" viewBox="0 0 800 200" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="gold" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#D97706" />
        <stop offset="100%" stop-color="#B45309" />
      </linearGradient>
    </defs>

    <!-- Gold Crest Emblem Left -->
    <g transform="translate(40, 36)">
      <rect width="128" height="128" rx="28" fill="url(#gold)" />
      <text x="64" y="93" 
            font-family="Georgia, 'Times New Roman', serif" 
            font-size="68" 
            font-weight="900" 
            fill="#FFFFFF" 
            text-anchor="middle" 
            letter-spacing="1">BM</text>
    </g>

    <!-- Main Wordmark BULLMONK -->
    <text x="195" y="115" 
          font-family="Georgia, 'Times New Roman', serif" 
          font-size="76" 
          font-weight="800" 
          fill="#0F172A" 
          letter-spacing="8">BULLMONK</text>

    <!-- Tagline (Carefully balanced midline) -->
    <text x="198" y="148" 
          font-family="'Plus Jakarta Sans', system-ui, sans-serif" 
          font-size="16" 
          font-weight="700" 
          fill="#B45309" 
          letter-spacing="4">GLOBAL FINANCIAL INTELLIGENCE &amp; MACRO NEWS</text>
  </svg>
  `;

  await sharp(Buffer.from(rectLightSvg))
    .png()
    .toFile(path.join(outputDir, 'google_news_rectangular_light_800x200.png'));
  console.log('✓ Created google_news_rectangular_light_800x200.png');

  // 3. Rectangular Logo (Dark Theme, 800 x 200 px - 4:1 ratio)
  // Transparent background, crisp white text with gold emblem
  const rectDarkSvg = `
  <svg width="800" height="200" viewBox="0 0 800 200" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="goldDark" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#F59E0B" />
        <stop offset="100%" stop-color="#D97706" />
      </linearGradient>
    </defs>

    <!-- Gold Crest Emblem Left -->
    <g transform="translate(40, 36)">
      <rect width="128" height="128" rx="28" fill="url(#goldDark)" />
      <text x="64" y="93" 
            font-family="Georgia, 'Times New Roman', serif" 
            font-size="68" 
            font-weight="900" 
            fill="#FFFFFF" 
            text-anchor="middle" 
            letter-spacing="1">BM</text>
    </g>

    <!-- Main Wordmark BULLMONK in Pure White -->
    <text x="195" y="115" 
          font-family="Georgia, 'Times New Roman', serif" 
          font-size="76" 
          font-weight="800" 
          fill="#FFFFFF" 
          letter-spacing="8">BULLMONK</text>

    <!-- Tagline in Warm Amber -->
    <text x="198" y="148" 
          font-family="'Plus Jakarta Sans', system-ui, sans-serif" 
          font-size="16" 
          font-weight="700" 
          fill="#F59E0B" 
          letter-spacing="4">GLOBAL FINANCIAL INTELLIGENCE &amp; MACRO NEWS</text>
  </svg>
  `;

  // 3. Rectangular Logo (Dark Theme, 800 x 200 px - 4:1 ratio)
  await sharp(Buffer.from(rectDarkSvg))
    .png()
    .toFile(path.join(outputDir, 'google_news_rectangular_dark_800x200.png'));
  console.log('✓ Created google_news_rectangular_dark_800x200.png');

  // 4. Square Logo 512x512 px alternative
  await sharp(Buffer.from(squareSvg))
    .resize(512, 512)
    .png()
    .toFile(path.join(outputDir, 'google_news_square_512x512.png'));
  console.log('✓ Created google_news_square_512x512.png');

  // 5. Rectangular Logo 400x100 px (Recommended exact 400px width, Light & Dark)
  await sharp(Buffer.from(rectLightSvg))
    .resize(400, 100)
    .png()
    .toFile(path.join(outputDir, 'google_news_rectangular_light_400x100.png'));
  console.log('✓ Created google_news_rectangular_light_400x100.png');

  await sharp(Buffer.from(rectDarkSvg))
    .resize(400, 100)
    .png()
    .toFile(path.join(outputDir, 'google_news_rectangular_dark_400x100.png'));
  console.log('✓ Created google_news_rectangular_dark_400x100.png');

  console.log('All Google News publisher logos generated successfully!');
}

generateLogos().catch(console.error);

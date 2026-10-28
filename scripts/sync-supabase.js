import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
// Load .env credentials natively without external dependencies
if (fs.existsSync('.env')) {
  const envContent = fs.readFileSync('.env', 'utf8');
  for (const line of envContent.split('\n')) {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#') && trimmed.includes('=')) {
      const [key, ...vals] = trimmed.split('=');
      process.env[key.trim()] = vals.join('=').trim();
    }
  }
}

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || 'https://aedelnskedncqmqmocoo.supabase.co';
const SUPABASE_KEY = process.env.VITE_SUPABASE_PUBLISHABLE_KEY || 'sb_publishable_3Q6Jdo45UCWs8Zi-yJesKA_J2DfHTBr';

console.log(`[Supabase Sync] Target: ${SUPABASE_URL}`);
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// Extract article records from TS source files
function parseArticleFiles() {
  const file1 = fs.readFileSync('src/data/newsData.ts', 'utf8');
  const file2 = fs.readFileSync('src/data/trendingDispatches.ts', 'utf8');
  const combined = file1 + '\n' + file2;

  const articles = [];
  const blocks = combined.split(/\{\s*id:\s*"/g).slice(1);

  for (const b of blocks) {
    try {
      const id = b.match(/^([^"]+)"/)?.[1];
      const slug = b.match(/slug:\s*"([^"]+)"/)?.[1] || id;
      const title = b.match(/title:\s*"([^"]+)"/)?.[1];
      const category = b.match(/category:\s*"([^"]+)"/)?.[1] || 'Markets & Finance';
      const region = b.match(/region:\s*"([^"]+)"/)?.[1] || 'Global';
      const deck = b.match(/deck:\s*"([^"]+)"/)?.[1] || '';
      const readTime = b.match(/readTime:\s*"([^"]+)"/)?.[1] || '6 min read';
      const heroImage = b.match(/heroImage:\s*"([^"]+)"/)?.[1] || 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=1200&q=80';
      const imageCaption = b.match(/imageCaption:\s*"([^"]+)"/)?.[1] || 'BULLMONK International Bureau Dispatch';
      const publishedAt = b.match(/publishedAt:\s*"([^"]+)"/)?.[1] || new Date().toISOString();
      const views = parseInt(b.match(/views:\s*([0-9]+)/)?.[1] || '38000', 10);
      const bookmarks = parseInt(b.match(/bookmarks:\s*([0-9]+)/)?.[1] || '2400', 10);

      // Parse author object
      const authorName = b.match(/name:\s*"([^"]+)"/)?.[1] || 'BullMonk Senior Fellow';
      const authorTitle = b.match(/author:[\s\S]*?title:\s*"([^"]+)"/)?.[1] || 'Special Contributor';
      const authorLoc = b.match(/location:\s*"([^"]+)"/)?.[1] || 'Global Bureau';
      const authorEmail = b.match(/email:\s*"([^"]+)"/)?.[1] || 'newsroom@bullmonk.intelligence';
      const authorAvatar = b.match(/avatar:\s*"([^"]+)"/)?.[1] || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=64&q=70';

      // Parse tags
      const tagsMatch = b.match(/tags:\s*\[([\s\S]*?)\]/)?.[1];
      const tags = tagsMatch 
        ? tagsMatch.split(',').map(s => s.replace(/["'\r\n\t]/g, '').trim()).filter(Boolean)
        : [category, region];

      // Parse keyTakeaways
      const takeawaysMatch = b.match(/keyTakeaways:\s*\[([\s\S]*?)\]/)?.[1];
      const keyTakeaways = takeawaysMatch
        ? takeawaysMatch.split('",').map(s => s.replace(/["'\r\n\t\[\]]/g, '').trim()).filter(Boolean)
        : [];

      // Parse content snippet
      let content = '<p>Forensic macroeconomic and geopolitical reporting from BULLMONK international correspondents.</p>';
      const contentMatch = b.match(/content:\s*`([\s\S]*?)`\s*,/);
      if (contentMatch) {
        content = contentMatch[1].trim();
      }

      if (id && title) {
        articles.push({
          id,
          slug,
          title,
          category,
          region,
          deck,
          content,
          key_takeaways: keyTakeaways,
          author: {
            name: authorName,
            title: authorTitle,
            location: authorLoc,
            email: authorEmail,
            avatar: authorAvatar
          },
          published_at: publishedAt,
          read_time: readTime,
          hero_image: heroImage,
          image_caption: imageCaption,
          tags,
          views,
          bookmarks
        });
      }
    } catch (err) {
      console.warn('Skipping block parse error:', err.message);
    }
  }

  // Deduplicate by ID
  const map = new Map();
  for (const art of articles) {
    if (!map.has(art.id)) {
      map.set(art.id, art);
    }
  }
  return Array.from(map.values());
}

async function syncToSupabase() {
  const articles = parseArticleFiles();
  console.log(`[Supabase Sync] Extracted ${articles.length} unique sovereign dispatches to synchronize.`);

  let successCount = 0;
  let errorCount = 0;

  // Upsert in batches of 10 to respect payload limits
  const batchSize = 10;
  for (let i = 0; i < articles.length; i += batchSize) {
    const batch = articles.slice(i, i + batchSize);
    const { data, error } = await supabase
      .from('articles')
      .upsert(batch, { onConflict: 'id' });

    if (error) {
      console.error(`[Supabase Sync] Batch ${i / batchSize + 1} Error:`, error.message);
      // Fallback: try individual inserts
      for (const item of batch) {
        const { error: singleErr } = await supabase.from('articles').upsert(item, { onConflict: 'id' });
        if (singleErr) {
          console.error(`  - Failed on ${item.id}:`, singleErr.message);
          errorCount++;
        } else {
          successCount++;
        }
      }
    } else {
      successCount += batch.length;
      console.log(`[Supabase Sync] Batch ${i / batchSize + 1} synced (${successCount}/${articles.length})`);
    }
  }

  console.log(`\n======================================================`);
  console.log(`[Supabase Sync Complete] Successfully synced: ${successCount} articles. Errors: ${errorCount}`);
  console.log(`Production Domain: https://bullmonk.live/`);
  console.log(`======================================================\n`);
}

syncToSupabase().catch(err => {
  console.error('[Supabase Sync Fatal]:', err);
  process.exit(1);
});

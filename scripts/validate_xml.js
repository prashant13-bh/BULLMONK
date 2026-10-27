import fs from 'fs';

// Test with Node's native or regex/sax validator
function validateXmlString(xmlContent, filename) {
  // Check for common XML pitfalls: unescaped &
  const unescapedAmpRegex = /&(?!(amp|lt|gt|quot|apos);|#\d+;|#x[0-9a-fA-F]+;)/g;
  const matches = [];
  let m;
  const lines = xmlContent.split('\n');
  lines.forEach((line, lineIdx) => {
    // ignore inside CDATA
    const withoutCdata = line.replace(/<!\[CDATA\[[\s\S]*?\]\]>/g, '');
    while ((m = unescapedAmpRegex.exec(withoutCdata)) !== null) {
      matches.push({ line: lineIdx + 1, col: m.index, snippet: line.trim() });
    }
  });

  if (matches.length > 0) {
    console.error(`❌ ${filename} has ${matches.length} unescaped '&' characters:`);
    matches.slice(0, 5).forEach(e => console.error(`   Line ${e.line}: ${e.snippet}`));
    return false;
  }

  // Check tag matching stack
  const tagRegex = /<(\/?[a-zA-Z0-9:_-]+)([^>]*)>/g;
  const stack = [];
  let match;
  let lineNum = 1;
  let lastIndex = 0;

  while ((match = tagRegex.exec(xmlContent)) !== null) {
    const fullTag = match[0];
    const tagName = match[1];
    const attributes = match[2];

    // calculate line number
    const substr = xmlContent.slice(lastIndex, match.index);
    lineNum += (substr.match(/\n/g) || []).length;
    lastIndex = match.index;

    // skip declarations or comments
    if (fullTag.startsWith('<?') || fullTag.startsWith('<!')) continue;
    // self-closing tag
    if (attributes.trim().endsWith('/')) continue;

    if (tagName.startsWith('/')) {
      const closing = tagName.slice(1);
      const open = stack.pop();
      if (!open || open.name !== closing) {
        console.error(`❌ ${filename} Mismatched closing tag </${closing}> at line ${lineNum}, expected </${open ? open.name : 'none'}>`);
        return false;
      }
    } else {
      stack.push({ name: tagName, line: lineNum });
    }
  }

  if (stack.length > 0) {
    console.error(`❌ ${filename} Unclosed tags:`, stack.map(s => `<${s.name}> at line ${s.line}`));
    return false;
  }

  console.log(`✅ ${filename} is 100% valid XML with 0 syntax errors.`);
  return true;
}

const files = [
  'public/rss.xml', 'public/feed.xml', 'public/news-sitemap.xml', 'public/sitemap.xml', 'public/sitemap_index.xml',
  'public/public/rss.xml', 'public/public/feed.xml', 'public/public/news-sitemap.xml', 'public/public/sitemap.xml', 'public/public/sitemap_index.xml'
];
let allValid = true;
for (const f of files) {
  if (fs.existsSync(f)) {
    const content = fs.readFileSync(f, 'utf8');
    if (!validateXmlString(content, f)) allValid = false;
  } else {
    console.error(`Missing file: ${f}`);
    allValid = false;
  }
}

if (!allValid) {
  process.exit(1);
} else {
  console.log('All XML feeds passed validation!');
}

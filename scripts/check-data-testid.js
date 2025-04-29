#!/usr/bin/env node
/**
 * Script: check-data-testid.js
 * Scanează recursiv componentele .tsx și raportează elementele funcționale fără atribut data-testid.
 * Rulează: node scripts/check-data-testid.js [dir]
 */
const fs = require('fs');
const path = require('path');

const TARGET_TAGS = [
  'button', 'input', 'select', 'textarea', 'form', 'li', 'ul', 'ol', 'table', 'tr', 'td', 'th', 'a', 'span', 'div', 'label', 'option', 'fieldset', 'legend', 'section', 'article', 'aside', 'nav', 'main', 'header', 'footer', 'summary', 'details', 'checkbox', 'radio', 'switch'
];

const COMPONENT_DIRS = [
  path.join(__dirname, '../frontend/src/components/primitives'),
  path.join(__dirname, '../frontend/src/components/features'),
];

const tsxFileRegex = /\.tsx$/;
const tagRegex = new RegExp(`<(${TARGET_TAGS.join('|')})(\s+[^>]*?)?>`, 'gi');
const dataTestIdRegex = /data-testid\s*=\s*(["'{])/i;

function scanFile(filePath) {
  const code = fs.readFileSync(filePath, 'utf8');
  const lines = code.split(/\r?\n/);
  let results = [];
  lines.forEach((line, idx) => {
    let match;
    tagRegex.lastIndex = 0; // reset regex state
    while ((match = tagRegex.exec(line)) !== null) {
      const tag = match[1];
      const attrs = match[2] || '';
      if (!dataTestIdRegex.test(attrs)) {
        // ignore decorative-only: if line has aria-hidden or role="presentation"
        if (/aria-hidden|role\s*=\s*["']presentation["']/i.test(attrs)) continue;
        results.push({ file: filePath, line: idx + 1, tag, preview: line.trim() });
      }
    }
  });
  return results;
}

function scanDir(dir) {
  let results = [];
  fs.readdirSync(dir).forEach(f => {
    const full = path.join(dir, f);
    if (fs.statSync(full).isDirectory()) {
      results = results.concat(scanDir(full));
    } else if (tsxFileRegex.test(f)) {
      results = results.concat(scanFile(full));
    }
  });
  return results;
}

function main() {
  let allResults = [];
  for (const dir of COMPONENT_DIRS) {
    if (fs.existsSync(dir)) {
      allResults = allResults.concat(scanDir(dir));
    }
  }
  if (allResults.length === 0) {
    console.log('✔ Toate elementele funcționale au data-testid sau nu s-au găsit componente .tsx fără el.');
    return;
  }
  console.log('⚠️  Elemente funcționale fără data-testid găsite:\n');
  allResults.forEach(r => {
    console.log(`- ${r.file}:${r.line} [<${r.tag}>]  ${r.preview}`);
  });
  process.exitCode = 1;
}

main();

/**
 * Script lint: detectează string-uri hardcodate în UI și texte necentralizate
 * Rulează-l cu: node scripts/lint-ui-texts.js
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const SRC = path.join(ROOT, 'frontend', 'src');
const UI_CONSTANTS = ['constants/ui.ts', 'constants/messages.ts'];
const UI_REGEX = /<([a-zA-Z]+)[^>]*>([^<>{}\n\r]+)<\/\1>/g;
const ALLOWED_FILES = UI_CONSTANTS.map(f => path.join(SRC, f));

function walk(dir) {
  let results = [];
  fs.readdirSync(dir).forEach(function(file) {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file));
    } else if ((file.endsWith('.tsx') || file.endsWith('.ts')) && !ALLOWED_FILES.includes(file)) {
      results.push(file);
    }
  });
  return results;
}

function scanFile(file) {
  const content = fs.readFileSync(file, 'utf8');
  let errors = [];
  let match;
  while ((match = UI_REGEX.exec(content)) !== null) {
    const text = match[2].trim();
    if (text && !/\{.*\}/.test(text) && text.length > 1 && !/^[0-9.,:;!? ]+$/.test(text)) {
      errors.push(`String hardcodat în UI: '${text}' -> ${file}`);
    }
  }
  return errors;
}

let allErrors = [];
for (const file of walk(SRC)) {
  allErrors = allErrors.concat(scanFile(file));
}

if (allErrors.length > 0) {
  console.error('Eroare convenție UI/text centralizat:\n' + allErrors.join('\n'));
  process.exit(1);
} else {
  console.log('✔️ Toate textele UI sunt centralizate.');
}

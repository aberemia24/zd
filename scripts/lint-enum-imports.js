/**
 * Script de lint pentru a verifica importurile enums shared și dublurile locale.
 * Rulează-l cu: node scripts/lint-enum-imports.js
 * Poate fi adăugat și în CI (ex: npm run lint:enums)
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const TARGETS = [
  path.join(ROOT, 'frontend', 'src'),
  path.join(ROOT, 'backend', 'src'),
];

const RELATIVE_ENUM_IMPORT_RE = /from\s+['"](\.\.\/)+(shared|constants)\/enums['"]/g;
const LOCAL_ENUM_RE = /export\s+enum\s+(TransactionType|FrequencyType|CategoryType)/g;

function scanFile(file) {
  const content = fs.readFileSync(file, 'utf8');
  let errors = [];
  if (RELATIVE_ENUM_IMPORT_RE.test(content)) {
    errors.push(`Import relativ interzis către enums în: ${file}`);
  }
  if (LOCAL_ENUM_RE.test(content) && !file.includes('shared/enums.ts')) {
    errors.push(`Dublură locală de enum interzisă în: ${file}`);
  }
  return errors;
}

function walk(dir) {
  let results = [];
  fs.readdirSync(dir).forEach(function(file) {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file));
    } else if (file.endsWith('.ts') || file.endsWith('.tsx')) {
      results.push(file);
    }
  });
  return results;
}

let allErrors = [];
for (const target of TARGETS) {
  for (const file of walk(target)) {
    allErrors = allErrors.concat(scanFile(file));
  }
}

if (allErrors.length > 0) {
  console.error('Eroare convenție enums shared:\n' + allErrors.join('\n'));
  process.exit(1);
} else {
  console.log('✔️ Toate importurile enums shared respectă convenția.');
}

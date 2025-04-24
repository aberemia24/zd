/**
 * Script lint: detectează helperi/mocks folosiți în mai multe teste dar necentralizați
 * Rulează-l cu: node scripts/lint-mocks-helpers.js
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const TEST_DIRS = [
  path.join(ROOT, 'frontend', 'src', 'test'),
  path.join(ROOT, 'backend', 'src', 'test'),
];
const HELPER_FILES = ['helpers.ts', 'mockData.ts'];

function findAllTestFiles(dir) {
  let results = [];
  if (!fs.existsSync(dir)) return results;
  fs.readdirSync(dir).forEach(function(file) {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(findAllTestFiles(file));
    } else if (file.endsWith('.test.ts') || file.endsWith('.test.tsx')) {
      results.push(file);
    }
  });
  return results;
}

function scanTestFile(file) {
  const content = fs.readFileSync(file, 'utf8');
  let errors = [];
  for (const helper of HELPER_FILES) {
    const re = new RegExp(`import.*${helper}`);
    if (!re.test(content) && content.includes(helper.replace('.ts', ''))) {
      errors.push(`Helper/mock '${helper}' folosit dar nu e import centralizat în: ${file}`);
    }
  }
  return errors;
}

let allErrors = [];
for (const dir of TEST_DIRS) {
  for (const file of findAllTestFiles(dir)) {
    allErrors = allErrors.concat(scanTestFile(file));
  }
}

if (allErrors.length > 0) {
  console.error('Eroare convenție centralizare helpers/mocks:\n' + allErrors.join('\n'));
  process.exit(1);
} else {
  console.log('✔️ Toți helperii și mock-urile sunt centralizate corect.');
}

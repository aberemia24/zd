/**
 * Script lint: detectează endpoint-uri, parametri, valori default hardcodate în cod
 * Rulează-l cu: node scripts/lint-api-defaults.js
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const SRC = path.join(ROOT, 'frontend', 'src');
const API_FILES = ['constants/api.ts', 'constants/defaults.ts'];
const ALLOWED_FILES = [
  ...API_FILES.map(f => path.join(SRC, f)),
  path.resolve(ROOT, 'frontend', 'src', 'constants', 'ui.ts'),
  path.resolve(ROOT, 'frontend', 'src', 'constants', 'messages.ts'),
  path.resolve(ROOT, 'frontend', 'src', 'constants', 'labels.ts'),
];

const API_REGEX = /['"]\/(transactions|users|reports|categories)['"]/g;
const DEFAULT_REGEX = /default|implicit|limit|offset|sort|currency|moneda/i;

function walk(dir) {
  let results = [];
  fs.readdirSync(dir).forEach(function(file) {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file));
    } else if ((file.endsWith('.ts') || file.endsWith('.tsx'))) {
      results.push(file);
    }
  });
  return results;
}

function scanFile(file) {
  const filename = path.basename(file).toLowerCase();
  if (["ui.ts","messages.ts","labels.ts"].includes(filename)) return [];
  const normalizedFile = path.normalize(file).toLowerCase();
  const normalizedAllowed = ALLOWED_FILES.map(f => path.normalize(f).toLowerCase());
  if (normalizedAllowed.includes(normalizedFile)) return [];
  const content = fs.readFileSync(file, 'utf8');
  let errors = [];
  let match;
  while ((match = API_REGEX.exec(content)) !== null) {
    // Ignoră dacă endpointul este parte dintr-un identificator (ex: API.ROUTES.TRANSACTIONS)
    const line = content.split('\n').find(l => l.includes(match[0]));
    if (!line || !/API\.|ROUTES|QUERY_PARAMS|PAGINATION|DEFAULTS/.test(line)) {
      errors.push(`Endpoint hardcodat: '${match[0]}' în ${file}`);
    }
  }
  // Caută doar stringuri/numere hardcodate, nu identificatori centralizați
  const lines = content.split('\n');
  for (const [i, line] of lines.entries()) {
    // Ignoră linii care folosesc PAGINATION sau API sau orice identificator centralizat
    if (/PAGINATION|API|DEFAULTS/.test(line)) continue;
    // Ignoră comentariile pure sau orice după //
    const codePart = line.split('//')[0];
    if (!codePart.trim()) continue;
    if (DEFAULT_REGEX.test(codePart) && /['"0-9]/.test(codePart)) {
      errors.push(`Valori default/implicite hardcodate la linia ${i+1} în: ${file} => ${line.trim()}`);
    }
  }
  return errors;
}

let allErrors = [];
for (const file of walk(SRC)) {
  allErrors = allErrors.concat(scanFile(file));
}

if (allErrors.length > 0) {
  console.error('Eroare convenție API/default centralizat:\n' + allErrors.join('\n'));
  process.exit(1);
} else {
  console.log('✔️ Toate endpoint-urile și valorile default sunt centralizate.');
}

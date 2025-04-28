// Script rapid pentru identificarea TUTUROR importurilor către shared/ sau shared-constants cu cale relativă
const fs = require('fs');
const path = require('path');

// Patterns de căutat (shared/ OR shared-constants cu import relativ)
const patterns = [
  "from '../../shared/",
  "from '../../../shared/",
  "from '../shared/",
  'from "../../shared',
  'from "../../../shared',
  'from "../shared',
  "from '../../shared-constants/",
  "from '../../../shared-constants/",
  "from '../shared-constants/",
  'from "../../shared-constants',
  'from "../../../shared-constants',
  'from "../shared-constants',
];

function walkSync(dir, filelist = []) {
  fs.readdirSync(dir).forEach(file => {
    const filepath = path.join(dir, file);
    if (fs.statSync(filepath).isDirectory()) {
      filelist = walkSync(filepath, filelist);
    } else {
      filelist.push(filepath);
    }
  });
  return filelist;
}

function findSharedImports(root) {
  const frontendSrc = path.join(root, 'frontend', 'src');
  const backendSrc = path.join(root, 'backend', 'src');
  let found = [];
  [frontendSrc, backendSrc].forEach(srcDir => {
    if (!fs.existsSync(srcDir)) return;
    walkSync(srcDir).forEach(file => {
      if (file.endsWith('.ts') || file.endsWith('.tsx')) {
        const content = fs.readFileSync(file, 'utf8');
        patterns.forEach(pattern => {
          if (content.includes(pattern)) {
            found.push({ file, pattern });
          }
        });
      }
    });
  });
  return found;
}

const root = path.resolve(__dirname, '..');
const results = findSharedImports(root);
if (results.length > 0) {
  console.log('⚠️  Importuri către shared/ sau shared-constants cu cale relativă găsite:');
  results.forEach(({ file, pattern }) => {
    console.log(`  ${file} → ${pattern}`);
  });
  process.exit(1);
} else {
  console.log('✅ Nicio importare problematică către shared/ sau shared-constants cu cale relativă nu a fost găsită.');
}

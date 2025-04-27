const fs = require('fs');
const path = require('path');

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

function findWrongImports(root, patterns) {
  const frontendSrc = path.join(root, 'frontend', 'src');
  const backendSrc = path.join(root, 'backend', 'src');
  let wrongImports = [];

  [frontendSrc, backendSrc].forEach(srcDir => {
    if (!fs.existsSync(srcDir)) return;
    walkSync(srcDir).forEach(file => {
      if (file.endsWith('.ts') || file.endsWith('.tsx')) {
        const content = fs.readFileSync(file, 'utf8');
        patterns.forEach(pattern => {
          if (content.includes(pattern)) {
            wrongImports.push({ file, pattern });
          }
        });
      }
    });
  });
  return wrongImports;
}

function validateConstantsSync() {
  console.log('Validating shared constants synchronization...');

  const root = path.resolve(__dirname, '..');
  const sharedFolder = path.join(root, 'shared-constants');
  const frontendTsconfig = path.join(root, 'frontend', 'tsconfig.json');
  const backendConstants = path.join(root, 'backend', 'src', 'constants', 'index.ts');

  // Verifică existența shared-constants
  if (!fs.existsSync(sharedFolder)) {
    console.error('❌ Error: shared-constants folder does not exist!');
    process.exit(1);
  }

  // Verifică barrel-ul shared-constants/index.ts
  const sharedIndex = path.join(sharedFolder, 'index.ts');
  if (!fs.existsSync(sharedIndex)) {
    console.error('❌ Error: shared-constants/index.ts (barrel) does not exist!');
    process.exit(1);
  }

  // Verifică importurile în backend
  if (!fs.existsSync(backendConstants)) {
    console.error('❌ Error: backend/src/constants/index.ts does not exist!');
    process.exit(1);
  }
  const backendContent = fs.readFileSync(backendConstants, 'utf8');
  if (!backendContent.includes('shared-constants')) {
    console.error('❌ Error: backend does not import from shared-constants!');
    process.exit(1);
  }

  // Verifică path mapping în frontend/tsconfig.json
  if (!fs.existsSync(frontendTsconfig)) {
    console.error('❌ Error: frontend/tsconfig.json does not exist!');
    process.exit(1);
  }
  const tsconfig = JSON.parse(fs.readFileSync(frontendTsconfig, 'utf8'));
  const paths = tsconfig.compilerOptions && tsconfig.compilerOptions.paths;
  if (!paths || !paths['@shared-constants'] && !paths['@shared-constants/*']) {
    console.error('❌ Error: Path mapping for @shared-constants missing in frontend/tsconfig.json!');
    process.exit(1);
  }

  // Caută importuri greșite (directe din shared sau constants/enums)
  const wrongPatterns = [
    "from '../../../constants/enums'",
    "from '../../constants/enums'",
    "from '../constants/enums'",
    "from '../../../shared/enums'",
    "from '../../shared/enums'",
    "from '../shared/enums'",
    "from '../../../shared'",
    "from '../../shared'",
    "from '../shared'"
  ];
  const wrongImports = findWrongImports(root, wrongPatterns);
  if (wrongImports.length > 0) {
    console.error('❌ Wrong/legacy imports found:');
    wrongImports.forEach(({ file, pattern }) => {
      console.error(`  ${file} → ${pattern}`);
    });
    process.exit(1);
  }

  // Succes
  console.log('✅ Shared constants validation passed!');
}

validateConstantsSync();

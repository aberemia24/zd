// Script de transpilație shared-constants (TS -> JS + d.ts) pentru frontend/node_modules/@shared-constants
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const SRC = path.resolve(__dirname, '../../shared-constants');
const DEST = path.resolve(__dirname, '../node_modules/@shared-constants');

// 1. Șterge vechiul conținut
if (fs.existsSync(DEST)) {
  fs.rmSync(DEST, { recursive: true, force: true });
}

// 2. Rulează tsc cu outDir spre DEST
const tscConfig = path.resolve(SRC, 'tsconfig.json');
const tscCmd = `npx tsc --project "${tscConfig}" --outDir "${DEST}"`;
try {
  execSync(tscCmd, { stdio: 'inherit' });
} catch (e) {
  console.error('Eroare la transpilația shared-constants:', e.message);
  process.exit(1);
}

// 3. Copiază și package.json minimal
const pkgJson = {
  name: "@shared-constants",
  version: "1.0.0",
  main: "index.js",
  types: "index.d.ts"
};
fs.writeFileSync(path.join(DEST, 'package.json'), JSON.stringify(pkgJson, null, 2));

console.log('Transpilație shared-constants completă în node_modules/@shared-constants');

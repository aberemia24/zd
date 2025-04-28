// Script de copiere a shared-constants (transpilat) în frontend/src/shared-constants
const fs = require('fs');
const path = require('path');

const SRC = path.resolve(__dirname, '../../shared-constants');
const DEST = path.resolve(__dirname, '../src/shared-constants');

function copyRecursiveSync(src, dest) {
  if (!fs.existsSync(src)) return;
  if (fs.lstatSync(src).isDirectory()) {
    if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
    for (const item of fs.readdirSync(src)) {
      if (item === 'tsconfig.json' || item === 'dist' || item === 'node_modules') continue; // exclude config/build
      copyRecursiveSync(path.join(src, item), path.join(dest, item));
    }
  } else {
    fs.copyFileSync(src, dest);
  }
}

// Șterge folderul vechi dacă există
if (fs.existsSync(DEST)) {
  fs.rmSync(DEST, { recursive: true, force: true });
}

copyRecursiveSync(SRC, DEST);
console.log('Copiat shared-constants în src/shared-constants');

// Script de copiere a shared-constants ca dependency local pentru frontend
const fs = require('fs');
const path = require('path');

const SRC = path.resolve(__dirname, '../../shared-constants');
const DEST = path.resolve(__dirname, '../node_modules/@shared-constants');

function copyRecursiveSync(src, dest) {
  if (!fs.existsSync(src)) return;
  if (fs.lstatSync(src).isDirectory()) {
    if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
    for (const item of fs.readdirSync(src)) {
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

// Creează package.json minimal pentru recunoaștere corectă
const pkgJson = {
  name: "@shared-constants",
  version: "1.0.0",
  main: "index.ts",
  types: "index.d.ts"
};
fs.writeFileSync(path.join(DEST, 'package.json'), JSON.stringify(pkgJson, null, 2));

console.log('Copiat shared-constants în node_modules/@shared-constants și generat package.json');

#!/usr/bin/env node
const fs = require('fs-extra');
const path = require('path');
const crypto = require('crypto');

const SRC = path.resolve(__dirname, '../shared-constants');
const DEST = path.resolve(__dirname, '../frontend/src/shared-constants');

function hashDir(dir) {
  let hash = crypto.createHash('sha256');
  fs.readdirSync(dir).sort().forEach(file => {
    const filePath = path.join(dir, file);
    if (fs.lstatSync(filePath).isFile()) {
      hash.update(fs.readFileSync(filePath));
    }
    if (fs.lstatSync(filePath).isDirectory()) {
      hash.update(hashDir(filePath));
    }
  });
  return hash.digest('hex');
}

// 1. Șterge complet vechea copie
fs.removeSync(DEST);
// 2. Copiază fresh din shared-constants
fs.copySync(SRC, DEST, { overwrite: true });
console.log('shared-constants sincronizat cu succes!');

// 3. Checksum fail-fast
const srcHash = hashDir(SRC);
const destHash = hashDir(DEST);
if (srcHash !== destHash) {
  throw new Error('Eroare: shared-constants NU este sincronizat corect! Build oprit.');
}

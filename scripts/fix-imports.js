// Script automatizare: înlocuire importuri legacy constants cu @shared-constants
// Rulează cu: node scripts/fix-imports.js

const fs = require('fs');
const path = require('path');

const SRC_DIR = path.join(__dirname, '../frontend/src');
const IGNORE_FILES = ['api.ts', 'api.js'];
const CONSTANTS_FILES = [
  'messages',
  'ui',
  'defaults',
  'enums',
  'index',
  'index.d', // pentru .d.ts
];

function shouldIgnore(file) {
  return IGNORE_FILES.some((f) => file.endsWith(f));
}

function isConstantsImport(importPath) {
  return CONSTANTS_FILES.some((c) =>
    importPath.includes(`constants/${c}`)
  );
}

function replaceImportLine(line) {
  // Înlocuiește orice import către shared-constants cu 'shared-constants' (compatibil CRA/copiere automată)
  // Ex: import { X } from '@shared-constants' => import { X } from 'shared-constants'
  // Ex: import { Y } from '../shared-constants' => import { Y } from 'shared-constants'
  // Ex: import { Z } from '../../shared-constants' => import { Z } from 'shared-constants'
  const anySharedConstantsRegex = /from ['\"](@shared-constants|(\.\.\/)+shared-constants)['\"]/g;
  return line.replace(anySharedConstantsRegex, "from 'shared-constants'");
}

function processFile(filePath) {
  const code = fs.readFileSync(filePath, 'utf8');
  const lines = code.split(/\r?\n/);
  let changed = false;
  const newLines = lines.map((line) => {
    if (line.includes('from') && line.includes('constants/')) {
      const replaced = replaceImportLine(line);
      if (replaced !== line) changed = true;
      return replaced;
    }
    return line;
  });
  if (changed) {
    fs.writeFileSync(filePath, newLines.join('\n'), 'utf8');
    console.log('Updated:', filePath);
  }
}

function walk(dir) {
  fs.readdirSync(dir).forEach((file) => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      walk(fullPath);
    } else if (
      (file.endsWith('.ts') || file.endsWith('.tsx') || file.endsWith('.js') || file.endsWith('.jsx')) &&
      !shouldIgnore(file)
    ) {
      processFile(fullPath);
    }
  });
}

walk(SRC_DIR);

// 2. Curățare fișiere legacy constants
const constantsToClean = [
  path.join(__dirname, '../frontend/src/constants/messages.ts'),
  path.join(__dirname, '../frontend/src/constants/ui.ts'),
  path.join(__dirname, '../frontend/src/constants/defaults.ts'),
  path.join(__dirname, '../frontend/src/constants/enums.ts'),
];

constantsToClean.forEach((filePath) => {
  if (fs.existsSync(filePath)) {
    let comment = '// Mutat în shared-constants';
    if (filePath.endsWith('ui.ts')) comment = '// Mutat în shared-constants/ui.ts';
    if (filePath.endsWith('messages.ts')) comment = '// Mutat în shared-constants/messages.ts';
    if (filePath.endsWith('defaults.ts')) comment = '// Mutat în shared-constants/defaults.ts';
    if (filePath.endsWith('enums.ts')) comment = '// Mutat în shared-constants/enums.ts';
    fs.writeFileSync(filePath, comment + '\n', 'utf8');
    console.log('Curățat:', filePath);
  }
});

console.log('Importurile și fișierele legacy constants au fost actualizate la @shared-constants!');

#!/usr/bin/env node

/**
 * Script pentru validarea sincronizării constants între shared-constants și frontend
 * Verifică că toate constants-urile sunt folosite din @shared-constants
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

console.log('🔍 Validating shared constants synchronization...\n');

// Paths
const sharedConstantsPath = path.join(__dirname, '../shared-constants');
const frontendConstantsPath = path.join(__dirname, '../frontend/src/shared-constants');

// Check if shared-constants exists
if (!fs.existsSync(sharedConstantsPath)) {
  console.error('❌ shared-constants directory not found');
  process.exit(1);
}

// Check if frontend shared-constants exists
if (!fs.existsSync(frontendConstantsPath)) {
  console.error('❌ frontend/src/shared-constants directory not found');
  process.exit(1);
}

console.log('✅ Both shared-constants directories found');

// Check for hardcoded strings in test files
const testFilesPath = path.join(__dirname, '../frontend/src');
const hardcodedPatterns = [
  /['"`]Acesta este un mesaj de alertă['"`]/g,
  /['"`]Alege o opțiune['"`]/g,
  /['"`]Opțiunea \d['"`]/g,
  /['"`]Acest câmp este obligatoriu['"`]/g,
  /['"`]Comentariile tale['"`]/g,
  /['"`]Acceptă termenii['"`]/g
];

function checkForHardcodedStrings(dir) {
  const files = fs.readdirSync(dir, { withFileTypes: true });
  let hardcodedFound = false;

  for (const file of files) {
    const fullPath = path.join(dir, file.name);
    
    if (file.isDirectory()) {
      if (checkForHardcodedStrings(fullPath)) {
        hardcodedFound = true;
      }
    } else if (file.name.endsWith('.test.tsx') || file.name.endsWith('.test.ts')) {
      const content = fs.readFileSync(fullPath, 'utf8');
      
      for (const pattern of hardcodedPatterns) {
        const matches = content.match(pattern);
        if (matches) {
          console.error(`❌ Hardcoded string found in ${fullPath}:`);
          matches.forEach(match => console.error(`   ${match}`));
          hardcodedFound = true;
        }
      }
    }
  }
  
  return hardcodedFound;
}

const hasHardcodedStrings = checkForHardcodedStrings(testFilesPath);

if (hasHardcodedStrings) {
  console.error('\n❌ Validation failed: Hardcoded strings found in test files');
  console.error('Please replace with constants from @shared-constants/ui');
  process.exit(1);
}

console.log('✅ No hardcoded test strings found');
console.log('\n🎯 Shared constants validation: PASSED'); 
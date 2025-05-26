#!/usr/bin/env node

/**
 * Script pentru fix automatizat al string-urilor hardcodate în test files
 * Detectează și înlocuiește automat string-urile hardcodate cu constante din TEST_CONSTANTS
 */

const fs = require('fs');
const path = require('path');

console.log('🔧 Running automated hardcoded strings fixer...\n');

// Mapping pentru replace-uri automate
const REPLACEMENTS = {
  // Alert messages
  "'Acesta este un mesaj de alertă'": 'TEST_CONSTANTS.ALERTS.TEST_MESSAGE',
  '"Acesta este un mesaj de alertă"': 'TEST_CONSTANTS.ALERTS.TEST_MESSAGE',
  "`Acesta este un mesaj de alertă`": 'TEST_CONSTANTS.ALERTS.TEST_MESSAGE',
  
  // Select options
  "'Alege o opțiune'": 'TEST_CONSTANTS.SELECT.PLACEHOLDER',
  '"Alege o opțiune"': 'TEST_CONSTANTS.SELECT.PLACEHOLDER',
  "'Opțiunea 1'": 'TEST_CONSTANTS.SELECT.OPTION_1',
  '"Opțiunea 1"': 'TEST_CONSTANTS.SELECT.OPTION_1',
  "'Opțiunea 2'": 'TEST_CONSTANTS.SELECT.OPTION_2',
  '"Opțiunea 2"': 'TEST_CONSTANTS.SELECT.OPTION_2',
  "'Opțiunea 3'": 'TEST_CONSTANTS.SELECT.OPTION_3',
  '"Opțiunea 3"': 'TEST_CONSTANTS.SELECT.OPTION_3',
  "'Selecție'": 'TEST_CONSTANTS.SELECT.LABEL',
  '"Selecție"': 'TEST_CONSTANTS.SELECT.LABEL',
  
  // Error messages
  "'Acest câmp este obligatoriu'": 'TEST_CONSTANTS.SELECT.REQUIRED_ERROR',
  '"Acest câmp este obligatoriu"': 'TEST_CONSTANTS.SELECT.REQUIRED_ERROR',
  "'Trebuie să acceptați termenii'": 'TEST_CONSTANTS.CHECKBOX.REQUIRED_ERROR',
  '"Trebuie să acceptați termenii"': 'TEST_CONSTANTS.CHECKBOX.REQUIRED_ERROR',
  
  // Textarea
  "'Comentariile tale'": 'TEST_CONSTANTS.TEXTAREA.PLACEHOLDER',
  '"Comentariile tale"': 'TEST_CONSTANTS.TEXTAREA.PLACEHOLDER',
  "'Textarea test'": 'TEST_CONSTANTS.TEXTAREA.LABEL',
  '"Textarea test"': 'TEST_CONSTANTS.TEXTAREA.LABEL',
  
  // Checkbox
  "'Acceptă termenii'": 'TEST_CONSTANTS.CHECKBOX.LABEL',
  '"Acceptă termenii"': 'TEST_CONSTANTS.CHECKBOX.LABEL',
  "'Opțiune bifată'": 'TEST_CONSTANTS.CHECKBOX.CHECKED_LABEL',
  '"Opțiune bifată"': 'TEST_CONSTANTS.CHECKBOX.CHECKED_LABEL',
  
  // Common
  "'Mesaj de test'": 'TEST_CONSTANTS.COMMON.TEST_MESSAGE',
  '"Mesaj de test"': 'TEST_CONSTANTS.COMMON.TEST_MESSAGE',
  "'Se încarcă...'": 'TEST_CONSTANTS.COMMON.LOADING',
  '"Se încarcă..."': 'TEST_CONSTANTS.COMMON.LOADING',
  "'Eroare'": 'TEST_CONSTANTS.COMMON.ERROR_GENERIC',
  '"Eroare"': 'TEST_CONSTANTS.COMMON.ERROR_GENERIC'
};

// Funcție pentru verificarea că importul TEST_CONSTANTS există
function ensureTestConstantsImport(content) {
  const hasTestConstantsImport = content.includes('TEST_CONSTANTS');
  const hasSharedConstantsImport = content.includes("from '@shared-constants'");
  
  if (hasTestConstantsImport || hasSharedConstantsImport) {
    return content; // Import deja există
  }
  
  // Găsește linia cu primul import și adaugă importul
  const lines = content.split('\n');
  let importInserted = false;
  
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes("import") && lines[i].includes("from '@testing-library")) {
      // Inserează importul TEST_CONSTANTS după ultimul testing-library import
      lines.splice(i + 1, 0, "import { TEST_CONSTANTS } from '@shared-constants';");
      importInserted = true;
      break;
    }
  }
  
  if (!importInserted) {
    // Caută primul import și adaugă acolo
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].startsWith("import")) {
        lines.splice(i, 0, "import { TEST_CONSTANTS } from '@shared-constants';");
        break;
      }
    }
  }
  
  return lines.join('\n');
}

// Funcție pentru procesarea unui fișier
function processFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  let updatedContent = content;
  let hasChanges = false;
  
  // Aplică toate replace-urile
  for (const [hardcodedString, constant] of Object.entries(REPLACEMENTS)) {
    if (updatedContent.includes(hardcodedString)) {
      updatedContent = updatedContent.replace(new RegExp(hardcodedString.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), constant);
      hasChanges = true;
      console.log(`  ✅ ${hardcodedString} → ${constant}`);
    }
  }
  
  if (hasChanges) {
    // Asigură-te că importul TEST_CONSTANTS există
    updatedContent = ensureTestConstantsImport(updatedContent);
    
    // Scrie fișierul actualizat
    fs.writeFileSync(filePath, updatedContent);
    console.log(`📁 Updated: ${filePath}\n`);
    return true;
  }
  
  return false;
}

// Funcție pentru scanarea recursivă a directoarelor
function scanDirectory(dir) {
  const files = fs.readdirSync(dir, { withFileTypes: true });
  let totalFilesFixed = 0;
  
  for (const file of files) {
    const fullPath = path.join(dir, file.name);
    
    if (file.isDirectory()) {
      totalFilesFixed += scanDirectory(fullPath);
    } else if (file.name.endsWith('.test.tsx') || file.name.endsWith('.test.ts')) {
      console.log(`🔍 Processing: ${fullPath}`);
      if (processFile(fullPath)) {
        totalFilesFixed++;
      } else {
        console.log(`  ℹ️  No hardcoded strings found\n`);
      }
    }
  }
  
  return totalFilesFixed;
}

// Main execution
const frontendTestsPath = path.join(__dirname, '../frontend/src');

if (!fs.existsSync(frontendTestsPath)) {
  console.error('❌ Frontend tests directory not found');
  process.exit(1);
}

console.log(`📂 Scanning directory: ${frontendTestsPath}\n`);

const totalFixed = scanDirectory(frontendTestsPath);

console.log('🎯 AUTOMATION RESULTS:');
console.log(`✅ Files fixed: ${totalFixed}`);
console.log(`📝 Pattern replacements: ${Object.keys(REPLACEMENTS).length}`);

if (totalFixed > 0) {
  console.log('\n🚀 Next steps:');
  console.log('1. Run: npm run validate:constants');
  console.log('2. Run: npm test');
  console.log('3. Review changes and commit');
} else {
  console.log('\n✨ All test files are already clean!');
}

console.log('\n🔧 Automated string fixing: COMPLETED'); 
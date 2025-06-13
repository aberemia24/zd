#!/usr/bin/env node

import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));

import fs from 'fs';
import path from 'path';

console.log('🔧 Fixing Shared Constants Issues...\n');

// Configurare
const CONFIG = {
  searchDirs: [
    path.join(__dirname, '../frontend/src'),
  ],
  extensions: ['.ts', '.tsx', '.js', '.jsx'],
  replacements: [
    // Hardcoded strings that should use @shared-constants
    {
      pattern: /'Loading\.\.\.'/g,
      replacement: 'LOADING_MESSAGES.GENERIC',
      description: 'Loading string → LOADING_MESSAGES.GENERIC',
      importNeeded: 'LOADING_MESSAGES'
    },
    {
      pattern: /"Loading\.\.\."/g,
      replacement: 'LOADING_MESSAGES.GENERIC',
      description: 'Loading string → LOADING_MESSAGES.GENERIC',
      importNeeded: 'LOADING_MESSAGES'
    },
    {
      pattern: /'Se încarcă\.\.\.'/g,
      replacement: 'LOADING_MESSAGES.GENERIC',
      description: 'Se încarcă string → LOADING_MESSAGES.GENERIC',
      importNeeded: 'LOADING_MESSAGES'
    },
    {
      pattern: /"Se încarcă\.\.\."/g,
      replacement: 'LOADING_MESSAGES.GENERIC',
      description: 'Se încarcă string → LOADING_MESSAGES.GENERIC',
      importNeeded: 'LOADING_MESSAGES'
    },
    {
      pattern: /'No data available'/g,
      replacement: 'EMPTY_STATE_MESSAGES.GENERIC',
      description: 'No data string → EMPTY_STATE_MESSAGES.GENERIC',
      importNeeded: 'EMPTY_STATE_MESSAGES'
    },
    {
      pattern: /"No data available"/g,
      replacement: 'EMPTY_STATE_MESSAGES.GENERIC',
      description: 'No data string → EMPTY_STATE_MESSAGES.GENERIC',
      importNeeded: 'EMPTY_STATE_MESSAGES'
    },
    {
      pattern: /'Export'/g,
      replacement: 'BUTTONS.EXPORT',
      description: 'Export string → BUTTONS.EXPORT',
      importNeeded: 'BUTTONS'
    },
    {
      pattern: /"Export"/g,
      replacement: 'BUTTONS.EXPORT',
      description: 'Export string → BUTTONS.EXPORT',
      importNeeded: 'BUTTONS'
    },
    // URLs that should use API constants
    {
      pattern: /'\/api\/transactions'/g,
      replacement: 'API.ROUTES.TRANSACTIONS',
      description: 'API URL → API.ROUTES.TRANSACTIONS',
      importNeeded: 'API'
    },
    {
      pattern: /"\/api\/transactions"/g,
      replacement: 'API.ROUTES.TRANSACTIONS',
      description: 'API URL → API.ROUTES.TRANSACTIONS',
      importNeeded: 'API'
    },
    // Transaction type labels
    {
      pattern: /'Venit'/g,
      replacement: 'LABELS.INCOME_TYPE',
      description: 'Venit string → LABELS.INCOME_TYPE',
      importNeeded: 'LABELS'
    },
    {
      pattern: /"Venit"/g,
      replacement: 'LABELS.INCOME_TYPE',
      description: 'Venit string → LABELS.INCOME_TYPE',
      importNeeded: 'LABELS'
    },
    {
      pattern: /'Cheltuială'/g,
      replacement: 'LABELS.EXPENSE_TYPE',
      description: 'Cheltuială string → LABELS.EXPENSE_TYPE',
      importNeeded: 'LABELS'
    },
    {
      pattern: /"Cheltuială"/g,
      replacement: 'LABELS.EXPENSE_TYPE',
      description: 'Cheltuială string → LABELS.EXPENSE_TYPE',
      importNeeded: 'LABELS'
    }
  ]
};

function scanDirectory(dir, extensions = ['.ts', '.tsx']) {
  const files = [];
  
  function walkDir(currentPath) {
    if (!fs.existsSync(currentPath)) {
      return;
    }
    
    const items = fs.readdirSync(currentPath);
    
    for (const item of items) {
      const fullPath = path.join(currentPath, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        if (!['node_modules', '.git', 'dist', 'build', '.next'].includes(item)) {
          walkDir(fullPath);
        }
      } else if (stat.isFile()) {
        const ext = path.extname(fullPath);
        if (extensions.includes(ext)) {
          files.push(fullPath);
        }
      }
    }
  }
  
  walkDir(dir);
  return files;
}

function hasSharedConstantsIssues(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    
    for (const { pattern } of CONFIG.replacements) {
      if (pattern.test(content)) {
        return true;
      }
    }
    
    return false;
  } catch (error) {
    return false;
  }
}

function findFilesWithSharedConstantsIssues() {
  console.log('🔍 IDENTIFICARE FIȘIERE CU SHARED CONSTANTS ISSUES');
  console.log('==================================================\n');
  
  const allFiles = [];
  
  for (const searchDir of CONFIG.searchDirs) {
    if (fs.existsSync(searchDir)) {
      const files = scanDirectory(searchDir, CONFIG.extensions);
      allFiles.push(...files);
    }
  }
  
  console.log(`📁 Scanat ${allFiles.length} fișiere...`);
  
  const filesWithIssues = allFiles.filter(hasSharedConstantsIssues);
  
  console.log(`🎯 Găsite ${filesWithIssues.length} fișiere cu shared constants issues:\n`);
  
  filesWithIssues.forEach((file, index) => {
    const relativePath = path.relative(process.cwd(), file);
    console.log(`   ${index + 1}. ${relativePath}`);
  });
  
  return filesWithIssues;
}

function hasImportFor(content, importType) {
  const importPatterns = {
    'LOADING_MESSAGES': /import.*\{[^}]*LOADING_MESSAGES[^}]*\}.*from\s+['"]@shared-constants['"];?/,
    'EMPTY_STATE_MESSAGES': /import.*\{[^}]*EMPTY_STATE_MESSAGES[^}]*\}.*from\s+['"]@shared-constants['"];?/,
    'BUTTONS': /import.*\{[^}]*BUTTONS[^}]*\}.*from\s+['"]@shared-constants['"];?/,
    'LABELS': /import.*\{[^}]*LABELS[^}]*\}.*from\s+['"]@shared-constants['"];?/,
    'API': /import.*\{[^}]*API[^}]*\}.*from\s+['"]@shared-constants['"];?/
  };
  
  return importPatterns[importType] && importPatterns[importType].test(content);
}

function addImport(content, importType) {
  if (hasImportFor(content, importType)) {
    return content;
  }
  
  const lines = content.split('\n');
  let insertIndex = 0;
  
  // Găsește ultima linie de import
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].match(/^import\s+/)) {
      insertIndex = i + 1;
    } else if (lines[i].trim() !== '' && !lines[i].startsWith('//') && !lines[i].startsWith('*')) {
      break;
    }
  }
  
  // Inserează import-ul
  lines.splice(insertIndex, 0, `import { ${importType} } from '@shared-constants';`);
  
  return lines.join('\n');
}

function processFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let hasChanges = false;
    const relativePath = path.relative(process.cwd(), filePath);
    const neededImports = new Set();
    
    console.log(`📁 Procesez: ${relativePath}`);
    
    // Aplica replacements
    for (const { pattern, replacement, description, importNeeded } of CONFIG.replacements) {
      const matches = content.match(pattern);
      if (matches) {
        console.log(`   🔄 ${description}: ${matches.length} înlocuiri`);
        content = content.replace(pattern, replacement);
        neededImports.add(importNeeded);
        hasChanges = true;
      }
    }
    
    // Adaugă imports pentru tipurile necesare
    if (hasChanges) {
      for (const importType of neededImports) {
        content = addImport(content, importType);
      }
      
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`   ✅ Fișier actualizat cu succes`);
    } else {
      console.log(`   ℹ️  Nu au fost găsite pattern-uri de înlocuit`);
    }
    
    console.log('');
    return hasChanges;
    
  } catch (error) {
    console.warn(`   ⚠️  Eroare la procesarea: ${filePath}`);
    console.warn(`      ${error.message}`);
    return false;
  }
}

function processFiles(files) {
  console.log(`\n🔧 Încep procesarea fișierelor...\n`);
  
  let processedCount = 0;
  let modifiedCount = 0;
  const errors = [];
  
  for (const file of files) {
    const wasModified = processFile(file);
    processedCount++;
    
    if (wasModified) {
      modifiedCount++;
    }
  }
  
  return { processedCount, modifiedCount, errors };
}

function main() {
  console.log('🔍 SHARED CONSTANTS FIX AUTOMATION');
  console.log('===================================\n');
  
  const files = findFilesWithSharedConstantsIssues();
  
  if (files.length === 0) {
    console.log('✅ Nu sunt fișiere cu shared constants issues de corectat!\n');
    return;
  }
  
  console.log(`\n📊 SUMAR: ${files.length} fișiere de procesat\n`);
  
  console.log('⚠️  ATENȚIE: Această operație va:');
  console.log('   • Înlocui string-uri hardcodate cu constante din @shared-constants');
  console.log('   • Adăuga import statements pentru UI și API constants');
  console.log('   • Modifica fișierele direct pe disk\n');
  
  const results = processFiles(files);
  
  console.log('🎉 PROCESARE COMPLETĂ');
  console.log('=====================\n');
  console.log(`✅ Fișiere procesate: ${results.processedCount}/${files.length}`);
  console.log(`🔄 Fișiere modificate: ${results.modifiedCount}`);
  
  if (results.errors.length > 0) {
    console.log(`❌ Erori: ${results.errors.length}`);
    results.errors.forEach(error => console.log(`   • ${error}`));
  }
  
  console.log('\n💡 Următorii pași reccomandați:');
  console.log('   1. Rulează npm run validate:shared-constants-usage pentru verificare');
  console.log('   2. Verifică dacă constantele UI și API există în @shared-constants');
  console.log('   3. Rulează npm run build pentru verificare');
  console.log('   4. Commit schimbările cu git commit');
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main();
} 
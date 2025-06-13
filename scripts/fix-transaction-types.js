#!/usr/bin/env node

import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));

import fs from 'fs';
import path from 'path';

console.log('🔧 Fixing Transaction Types Issues...\n');

// Configurare
const CONFIG = {
  searchDirs: [
    path.join(__dirname, '../frontend/src'),
  ],
  extensions: ['.ts', '.tsx', '.js', '.jsx'],
  replacements: [
    {
      pattern: /'income'/g,
      replacement: 'TransactionType.INCOME',
      description: 'income string → TransactionType.INCOME'
    },
    {
      pattern: /"income"/g,
      replacement: 'TransactionType.INCOME',
      description: 'income string → TransactionType.INCOME'
    },
    {
      pattern: /'expense'/g,
      replacement: 'TransactionType.EXPENSE', 
      description: 'expense string → TransactionType.EXPENSE'
    },
    {
      pattern: /"expense"/g,
      replacement: 'TransactionType.EXPENSE', 
      description: 'expense string → TransactionType.EXPENSE'
    },
    {
      pattern: /'saving'/g,
      replacement: 'TransactionType.SAVING',
      description: 'saving string → TransactionType.SAVING'
    },
    {
      pattern: /"saving"/g,
      replacement: 'TransactionType.SAVING',
      description: 'saving string → TransactionType.SAVING'
    }
  ],
  importStatement: "import { TransactionType } from '@shared-constants';"
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

function hasTransactionTypeIssues(filePath) {
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

function findFilesWithTransactionTypeIssues() {
  console.log('🔍 IDENTIFICARE FIȘIERE CU TRANSACTION TYPE ISSUES');
  console.log('===================================================\n');
  
  const allFiles = [];
  
  for (const searchDir of CONFIG.searchDirs) {
    if (fs.existsSync(searchDir)) {
      const files = scanDirectory(searchDir, CONFIG.extensions);
      allFiles.push(...files);
    }
  }
  
  console.log(`📁 Scanat ${allFiles.length} fișiere...`);
  
  const filesWithIssues = allFiles.filter(hasTransactionTypeIssues);
  
  console.log(`🎯 Găsite ${filesWithIssues.length} fișiere cu transaction type issues:\n`);
  
  filesWithIssues.forEach((file, index) => {
    const relativePath = path.relative(process.cwd(), file);
    console.log(`   ${index + 1}. ${relativePath}`);
  });
  
  return filesWithIssues;
}

function hasTransactionTypeImport(content) {
  const importPatterns = [
    /import.*TransactionType.*from\s+['"@]?shared-constants['"];?/,
    /import.*\{[^}]*TransactionType[^}]*\}.*from\s+['"@]?shared-constants['"];?/,
  ];
  
  return importPatterns.some(pattern => pattern.test(content));
}

function addTransactionTypeImport(content) {
  if (hasTransactionTypeImport(content)) {
    return content;
  }
  
  const lines = content.split('\n');
  let insertIndex = 0;
  
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].match(/^import\s+/)) {
      insertIndex = i + 1;
    } else if (lines[i].trim() !== '' && !lines[i].startsWith('//') && !lines[i].startsWith('*')) {
      break;
    }
  }
  
  lines.splice(insertIndex, 0, CONFIG.importStatement);
  
  return lines.join('\n');
}

function processFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let hasChanges = false;
    const relativePath = path.relative(process.cwd(), filePath);
    
    console.log(`📁 Procesez: ${relativePath}`);
    
    for (const { pattern, replacement, description } of CONFIG.replacements) {
      const matches = content.match(pattern);
      if (matches) {
        console.log(`   🔄 ${description}: ${matches.length} înlocuiri`);
        content = content.replace(pattern, replacement);
        hasChanges = true;
      }
    }
    
    if (hasChanges) {
      content = addTransactionTypeImport(content);
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
  console.log('🔍 TRANSACTION TYPES FIX AUTOMATION');
  console.log('====================================\n');
  
  const files = findFilesWithTransactionTypeIssues();
  
  if (files.length === 0) {
    console.log('✅ Nu sunt fișiere cu transaction type issues de corectat!\n');
    return;
  }
  
  console.log(`\n📊 SUMAR: ${files.length} fișiere de procesat\n`);
  
  console.log('⚠️  ATENȚIE: Această operație va:');
  console.log('   • Înlocui string-uri hardcodate cu TransactionType enum');
  console.log('   • Adăuga import statements pentru @shared-constants');
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
  console.log('   1. Rulează npm run validate:transaction-types pentru verificare');
  console.log('   2. Rulează npm run build pentru verificare');
  console.log('   3. Testează aplicația');
  console.log('   4. Commit schimbările cu git commit');
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main();
} 
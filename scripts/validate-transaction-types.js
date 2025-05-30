#!/usr/bin/env node

/**
 * Script pentru verificarea tipurilor de tranzacții hardcodate
 * 
 * Verifică că nu se folosesc string-uri hardcodate pentru transaction types
 * în loc de enum-urile din shared-constants.
 * 
 * Rulare: node scripts/check-transaction-types.js
 */

const fs = require('fs');
const path = require('path');

// Configurare
const CONFIG = {
  // Directoare de căutat
  searchDirs: [
    path.join(__dirname, '../frontend/src'),
    path.join(__dirname, '../shared-constants'),
  ],
  
  // Extensii de fișiere de verificat
  extensions: ['.ts', '.tsx', '.js', '.jsx'],
  
  // Pattern-uri problematice - string-uri hardcodate lowercase
  problematicPatterns: [
    // Direct assignment sau comparison cu lowercase
    /['"](expense|income|saving)['"](?!\s*:\s*['"])/g,
    // Return statements cu lowercase strings
    /return\s+['"](expense|income|saving)['"](?!\s*:\s*['"])/g,
    // Object values cu lowercase (dar nu keys)
    /:\s*['"](expense|income|saving)['"](?!\s*:)/g,
  ],
  
  // Pattern-uri permise - cazuri unde e OK să avem lowercase
  allowedPatterns: [
    // În comentarii
    /\/\/.*['"](expense|income|saving)['"]/,
    /\/\*[\s\S]*['"](expense|income|saving)['"][\s\S]*\*\//,
    // În string-uri de documentație/descriere
    /description\s*:\s*.*['"](expense|income|saving)['"]/,
    /label\s*:\s*.*['"](expense|income|saving)['"]/,
    // În fișiere de test cu setup data
    /\.test\.|\.spec\./,
    // În enum definitions (shared-constants/enums.ts)
    /enum\s+\w+.*\{[\s\S]*['"](EXPENSE|INCOME|SAVING)['"]/,
    // CSS class states (ex: return "saving" pentru CSS)
    /return\s+['"](saving)['"];?\s*\/\/.*state|return\s+['"](saving)['"];?\s*$/,
    // Funcții care returnează CSS states
    /getCellState|getState|getClassName.*return.*['"](saving)['"]/,
    // Conditional states pentru CSS
    /if\s*\(\s*isSaving\s*\)\s*return\s*['"](saving)['"]/,
  ],
  
  // Fișiere de ignorat complet
  excludeFiles: [
    'node_modules',
    'dist',
    'build',
    '.git',
    'coverage',
    'test-results',
    '.next'
  ]
};

// Rezultate
const results = {
  issues: [],
  checkedFiles: 0,
  totalLines: 0
};

/**
 * Verifică dacă un path ar trebui ignorat
 */
function shouldExclude(filePath) {
  return CONFIG.excludeFiles.some(exclude => filePath.includes(exclude));
}

/**
 * Verifică dacă linia conține pattern-uri permise
 */
function isLineAllowed(line, filePath) {
  // Ignoră comentarii
  if (line.trim().startsWith('//') || line.trim().startsWith('*') || line.trim().startsWith('/*')) {
    return true;
  }
  
  // Ignoră fișiere de test
  if (CONFIG.allowedPatterns.some(pattern => 
    typeof pattern === 'string' ? filePath.includes(pattern) : pattern.test(filePath)
  )) {
    return true;
  }
  
  // Verifică pattern-uri permise specifice
  return CONFIG.allowedPatterns.some(pattern => {
    if (typeof pattern === 'string') {
      return line.includes(pattern);
    }
    return pattern.test(line);
  });
}

/**
 * Verifică un fișier pentru transaction types hardcodate
 */
function checkFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split('\n');
    results.checkedFiles++;
    results.totalLines += lines.length;
    
    lines.forEach((line, lineIndex) => {
      // Ignoră liniile permise
      if (isLineAllowed(line, filePath)) {
        return;
      }
      
      // Verifică pattern-uri problematice
      CONFIG.problematicPatterns.forEach(pattern => {
        const matches = [...line.matchAll(pattern)];
        matches.forEach(match => {
          results.issues.push({
            file: path.relative(process.cwd(), filePath),
            line: lineIndex + 1,
            content: line.trim(),
            match: match[1], // capture group
            suggestion: `Folosește TransactionType.${match[1].toUpperCase()} în loc de '${match[1]}'`
          });
        });
      });
    });
    
  } catch (error) {
    console.error(`Eroare la citirea fișierului ${filePath}:`, error.message);
  }
}

/**
 * Scanează recursiv un director
 */
function scanDirectory(dirPath) {
  try {
    const items = fs.readdirSync(dirPath);
    
    items.forEach(item => {
      const fullPath = path.join(dirPath, item);
      
      if (shouldExclude(fullPath)) {
        return;
      }
      
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        scanDirectory(fullPath);
      } else if (stat.isFile()) {
        const ext = path.extname(fullPath);
        if (CONFIG.extensions.includes(ext)) {
          checkFile(fullPath);
        }
      }
    });
  } catch (error) {
    console.error(`Eroare la scanarea directorului ${dirPath}:`, error.message);
  }
}

/**
 * Afișează raportul final
 */
function displayReport() {
  console.log('\n🔍 REZULTATE VERIFICARE TRANSACTION TYPES\n');
  
  console.log(`📊 Statistici:`);
  console.log(`   📁 Fișiere verificate: ${results.checkedFiles}`);
  console.log(`   📝 Linii totale: ${results.totalLines.toLocaleString()}`);
  console.log(`   🚨 Probleme găsite: ${results.issues.length}\n`);
  
  if (results.issues.length === 0) {
    console.log('✅ EXCELENT! Nu au fost găsite transaction types hardcodate.\n');
    console.log('💡 Toate folosirile par să folosească enum-urile corecte din shared-constants.\n');
    return true;
  }
  
  console.log('❌ PROBLEME GĂSITE:\n');
  
  // Grupează problemele după fișier
  const issuesByFile = results.issues.reduce((acc, issue) => {
    if (!acc[issue.file]) {
      acc[issue.file] = [];
    }
    acc[issue.file].push(issue);
    return acc;
  }, {});
  
  Object.entries(issuesByFile).forEach(([file, issues]) => {
    console.log(`📄 ${file}:`);
    issues.forEach(issue => {
      console.log(`   📍 Linia ${issue.line}: '${issue.match}' hardcodat`);
      console.log(`      🔧 ${issue.suggestion}`);
      console.log(`      📖 Cod: ${issue.content}`);
      console.log('');
    });
  });
  
  console.log('\n💡 RECOMANDĂRI:');
  console.log('   1. Înlocuiește string-urile hardcodate cu TransactionType enum');
  console.log('   2. Importă TransactionType din @shared-constants');
  console.log('   3. Folosește TransactionType.EXPENSE în loc de "expense"');
  console.log('   4. Verifică fallback-urile și valorile default\n');
  
  return false;
}

/**
 * Funcția principală
 */
function main() {
  console.log('🚀 Începem verificarea transaction types hardcodate...\n');
  
  // Verifică că directoarele există
  CONFIG.searchDirs.forEach(dir => {
    if (!fs.existsSync(dir)) {
      console.error(`❌ Directorul nu există: ${dir}`);
      process.exit(1);
    }
  });
  
  // Scanează fiecare director
  CONFIG.searchDirs.forEach(dir => {
    console.log(`🔍 Scanez: ${path.relative(process.cwd(), dir)}`);
    scanDirectory(dir);
  });
  
  // Afișează raportul
  const success = displayReport();
  
  // Exit code pentru CI/CD
  process.exit(success ? 0 : 1);
}

// Rulează scriptul dacă este apelat direct
if (require.main === module) {
  main();
}

module.exports = { main, checkFile, scanDirectory }; 
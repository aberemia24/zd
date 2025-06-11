#!/usr/bin/env node

/**
 * Script: validate-transaction-types.js
 * Validează că nu se folosesc string-uri hardcodate pentru transaction types
 * în loc de enum-urile din shared-constants conform regulilor din code-standards.mdc
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Validating transaction types usage...\n');

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
    {
      pattern: /['"](expense|income|saving)['"](?!\s*:\s*['"])/g,
      type: 'HARDCODED_TRANSACTION_TYPE',
      severity: 'HIGH',
      description: 'Hardcoded transaction type instead of enum',
      suggestion: 'Use TransactionType enum from @shared-constants',
      category: 'Type Constants'
    },
    {
      pattern: /return\s+['"](expense|income|saving)['"](?!\s*:\s*['"])/g,
      type: 'HARDCODED_RETURN_TYPE',
      severity: 'HIGH', 
      description: 'Hardcoded transaction type in return statement',
      suggestion: 'Return TransactionType enum value',
      category: 'Return Values'
    },
    {
      pattern: /:\s*['"](expense|income|saving)['"](?!\s*:)/g,
      type: 'HARDCODED_OBJECT_VALUE',
      severity: 'MEDIUM',
      description: 'Hardcoded transaction type in object value',
      suggestion: 'Use TransactionType enum for object values',
      category: 'Object Values'
    }
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
    // Keywords arrays pentru search
    /keywords\s*:\s*\[.*['"](expense|income|saving)['"]/,
    // Progress stage strings (non-transaction related)
    /stage\s*:\s*['"][^'"]*\|\s*['"][^'"]*\|\s*.*['"](saving)['"]/,
    /reportProgress\s*\(\s*['"](saving)['"]/
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
  totalLines: 0,
  scannedFiles: []
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
    results.scannedFiles.push(path.relative(process.cwd(), filePath));
    
    lines.forEach((line, lineIndex) => {
      // Ignoră liniile permise
      if (isLineAllowed(line, filePath)) {
        return;
      }
      
      // Verifică pattern-uri problematice
      CONFIG.problematicPatterns.forEach(patternInfo => {
        patternInfo.pattern.lastIndex = 0; // Reset regex
        const matches = line.match(patternInfo.pattern);
        
        if (matches) {
          matches.forEach(match => {
            const transactionType = match.match(/['"](expense|income|saving)['"]/)?.[1];
            if (transactionType) {
              results.issues.push({
                file: path.relative(process.cwd(), filePath),
                line: lineIndex + 1,
                match: match.trim(),
                lineContent: line.trim(),
                transactionType,
                type: patternInfo.type,
                severity: patternInfo.severity,
                description: patternInfo.description,
                suggestion: `Use TransactionType.${transactionType.toUpperCase()} instead of '${transactionType}'`,
                category: patternInfo.category
              });
            }
          });
        }
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

function analyzeIssues(issues) {
  const bySeverity = {
    HIGH: issues.filter(i => i.severity === 'HIGH'),
    MEDIUM: issues.filter(i => i.severity === 'MEDIUM'),
    LOW: issues.filter(i => i.severity === 'LOW')
  };
  
  const byType = {};
  const byCategory = {};
  const byFile = {};
  const byTransactionType = {};
  
  issues.forEach(issue => {
    // By type
    if (!byType[issue.type]) byType[issue.type] = [];
    byType[issue.type].push(issue);
    
    // By category
    if (!byCategory[issue.category]) byCategory[issue.category] = [];
    byCategory[issue.category].push(issue);
    
    // By file
    if (!byFile[issue.file]) byFile[issue.file] = [];
    byFile[issue.file].push(issue);
    
    // By transaction type
    if (!byTransactionType[issue.transactionType]) byTransactionType[issue.transactionType] = [];
    byTransactionType[issue.transactionType].push(issue);
  });
  
  return { bySeverity, byType, byCategory, byFile, byTransactionType };
}

function displayStatistics(analysis, fileCount, scannedFiles) {
  const totalIssues = Object.values(analysis.bySeverity).flat().length;
  const filesWithIssues = Object.keys(analysis.byFile).length;
  
  console.log('📊 TRANSACTION TYPES VALIDATION STATISTICS');
  console.log('=' .repeat(50));
  console.log(`📁 Files Scanned: ${fileCount}`);
  console.log(`🔍 TypeScript/JS Files: ${scannedFiles.filter(f => f.endsWith('.ts') || f.endsWith('.tsx') || f.endsWith('.js')).length}`);
  console.log(`⚠️  Files with Issues: ${filesWithIssues}`);
  console.log(`🎯 Clean Files: ${fileCount - filesWithIssues}`);
  console.log(`📈 Total Issues: ${totalIssues}`);
  console.log('');
  
  // File distribution
  console.log('📁 FILE DISTRIBUTION');
  console.log('-'.repeat(30));
  const filesByDirectory = {};
  scannedFiles.forEach(file => {
    const dir = path.dirname(file);
    if (!filesByDirectory[dir]) filesByDirectory[dir] = 0;
    filesByDirectory[dir]++;
  });
  
  Object.entries(filesByDirectory)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 10)
    .forEach(([dir, count]) => {
      console.log(`  ${dir}: ${count} files`);
    });
  console.log('');
}

function displaySeverityBreakdown(analysis) {
  console.log('🚨 SEVERITY BREAKDOWN');
  console.log('-'.repeat(30));
  console.log(`🔥 HIGH:    ${analysis.bySeverity.HIGH.length} issues`);
  console.log(`⚠️  MEDIUM:  ${analysis.bySeverity.MEDIUM.length} issues`);
  console.log(`💡 LOW:     ${analysis.bySeverity.LOW.length} issues`);
  console.log('');
}

function displayCategoryAnalysis(analysis) {
  console.log('📋 ISSUE CATEGORIES');
  console.log('-'.repeat(30));
  Object.entries(analysis.byCategory)
    .sort(([,a], [,b]) => b.length - a.length)
    .forEach(([category, issues]) => {
      const highCount = issues.filter(i => i.severity === 'HIGH').length;
      const mediumCount = issues.filter(i => i.severity === 'MEDIUM').length;
      const lowCount = issues.filter(i => i.severity === 'LOW').length;
      
      let severityBadge = '';
      if (highCount > 0) severityBadge += `🔥${highCount}`;
      if (mediumCount > 0) severityBadge += `⚠️${mediumCount}`;
      if (lowCount > 0) severityBadge += `💡${lowCount}`;
      
      console.log(`  ${category}: ${issues.length} issues ${severityBadge}`);
    });
  console.log('');
  
  // Transaction type breakdown
  console.log('💰 TRANSACTION TYPE BREAKDOWN');
  console.log('-'.repeat(30));
  Object.entries(analysis.byTransactionType)
    .sort(([,a], [,b]) => b.length - a.length)
    .forEach(([type, issues]) => {
      const emoji = type === 'expense' ? '💸' : type === 'income' ? '💰' : '💵';
      console.log(`  ${emoji} ${type}: ${issues.length} hardcoded instances`);
    });
  console.log('');
}

function displayTopIssues(analysis) {
  console.log('🔍 TOP TRANSACTION TYPE ISSUES');
  console.log('='.repeat(50));
  
  // Show HIGH severity issues first
  if (analysis.bySeverity.HIGH.length > 0) {
    console.log(`🔥 HIGH PRIORITY ISSUES (${analysis.bySeverity.HIGH.length})`);
    console.log('-'.repeat(40));
    analysis.bySeverity.HIGH.slice(0, 8).forEach(issue => {
      console.log(`📍 ${issue.file}:${issue.line}`);
      console.log(`   Code: ${issue.match}`);
      console.log(`   Issue: ${issue.description}`);
      console.log(`   💡 Fix: ${issue.suggestion}`);
      console.log('');
    });
    
    if (analysis.bySeverity.HIGH.length > 8) {
      console.log(`   📝 ... and ${analysis.bySeverity.HIGH.length - 8} more high priority issues`);
      console.log('');
    }
  }
  
  // Show MEDIUM severity issues
  if (analysis.bySeverity.MEDIUM.length > 0) {
    console.log(`⚠️  MEDIUM PRIORITY ISSUES (${analysis.bySeverity.MEDIUM.length})`);
    console.log('-'.repeat(40));
    analysis.bySeverity.MEDIUM.slice(0, 5).forEach(issue => {
      console.log(`📍 ${issue.file}:${issue.line} - ${issue.match}`);
      console.log(`   💡 ${issue.suggestion}`);
    });
    
    if (analysis.bySeverity.MEDIUM.length > 5) {
      console.log(`   📝 ... and ${analysis.bySeverity.MEDIUM.length - 5} more medium priority issues`);
    }
    console.log('');
  }
}

function displayRecommendations(analysis) {
  console.log('💡 TRANSACTION TYPES RECOMMENDATIONS');
  console.log('='.repeat(50));
  
  const recommendations = [];
  
  if (analysis.bySeverity.HIGH.length > 0) {
    recommendations.push('🔥 CRITICAL: Replace hardcoded transaction types immediately');
    recommendations.push('   • Import TransactionType from @shared-constants/enums');
    recommendations.push('   • Use TransactionType.EXPENSE instead of "expense"');
    recommendations.push('   • Use TransactionType.INCOME instead of "income"');
    recommendations.push('   • Use TransactionType.SAVING instead of "saving"');
  }
  
  if (analysis.byCategory['Type Constants']?.length > 0) {
    recommendations.push('⚠️  CONSTANTS: Standardize all transaction type constants');
    recommendations.push('   • Replace direct string assignments with enum values');
    recommendations.push('   • Update type definitions to use TransactionType enum');
  }
  
  if (analysis.byCategory['Return Values']?.length > 0) {
    recommendations.push('📝 RETURNS: Fix hardcoded return values');
    recommendations.push('   • Return enum values instead of string literals');
    recommendations.push('   • Ensure type safety in return statements');
  }
  
  if (analysis.byCategory['Object Values']?.length > 0) {
    recommendations.push('🎯 OBJECTS: Update object property values');
    recommendations.push('   • Use enum values for object properties');
    recommendations.push('   • Maintain consistency in data structures');
  }
  
  recommendations.push('');
  recommendations.push('📚 IMPLEMENTATION STEPS:');
  recommendations.push('   1. Add import: import { TransactionType } from "@shared-constants/enums"');
  recommendations.push('   2. Replace "expense" with TransactionType.EXPENSE');
  recommendations.push('   3. Replace "income" with TransactionType.INCOME');
  recommendations.push('   4. Replace "saving" with TransactionType.SAVING');
  recommendations.push('   5. Update type definitions and interfaces');
  recommendations.push('   6. Run tests to ensure no breaking changes');
  
  recommendations.forEach(rec => console.log(rec));
  console.log('');
}

/**
 * Afișează raportul final
 */
function main() {
  console.log('🔍 TRANSACTION TYPES VALIDATION');
  console.log('='.repeat(50));
  console.log('Scanning for hardcoded transaction types in codebase...\n');
  
  // Scanează toate directoarele
  CONFIG.searchDirs.forEach(dir => {
    if (fs.existsSync(dir)) {
      scanDirectory(dir);
    }
  });
  
  if (results.issues.length === 0) {
    console.log('✅ EXCELLENT TRANSACTION TYPES USAGE!');
    console.log('='.repeat(50));
    console.log('🎯 Transaction types validation: PASSED');
    console.log('🚀 All transaction types use proper enums');
    console.log(`📁 Scanned ${results.checkedFiles} files`);
    console.log('');
    return;
  }
  
  const analysis = analyzeIssues(results.issues);
  
  // Display comprehensive analysis
  displayStatistics(analysis, results.checkedFiles, results.scannedFiles);
  displaySeverityBreakdown(analysis);
  displayCategoryAnalysis(analysis);
  displayTopIssues(analysis);
  displayRecommendations(analysis);
  
  // Final validation result
  const criticalIssues = analysis.bySeverity.HIGH.length;
  
  console.log('📋 TRANSACTION TYPES SUMMARY');
  console.log('='.repeat(50));
  
  if (criticalIssues === 0) {
    console.log('✅ Transaction types validation: PASSED');
    console.log('🎯 Only minor improvements suggested');
    console.log(`📊 Found ${results.issues.length} issues (${analysis.bySeverity.MEDIUM.length} medium, ${analysis.bySeverity.LOW.length} low priority)`);
  } else {
    console.log('❌ Transaction types validation: FAILED');
    console.log(`🚨 ${criticalIssues} critical hardcoded transaction types need immediate attention`);
    console.log(`📊 Total issues: ${results.issues.length} across ${Object.keys(analysis.byFile).length} files`);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = { 
  checkFile, 
  scanDirectory, 
  analyzeIssues 
}; 
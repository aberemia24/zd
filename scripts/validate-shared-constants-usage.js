#!/usr/bin/env node

/**
 * Script: validate-shared-constants-usage.js
 * Validează că toate import-urile folosesc @shared-constants și nu path-uri directe
 * Raportează import-uri greșite și sugerează remedierea
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Validating @shared-constants usage...\n');

// Paths to scan
const FRONTEND_SRC = path.join(__dirname, '../frontend/src');

// Patterns to detect incorrect imports
const INCORRECT_PATTERNS = [
  // Direct relative imports to shared-constants
  /import\s+.*from\s+['"]\.\.?\/.*shared-constants/g,
  /import\s+.*from\s+['"]\.\.?\/.*\/shared-constants/g,
  // Hardcoded constants that should use shared-constants
  /['"`]Tip tranzacție['"`]/g,
  /['"`]Adaugă tranzacție['"`]/g,
  /['"`]Se încarcă\.\.\.['"`]/g,
  /['"`]Alege['"`]/g,
  /['"`]Venit['"`](?!\s*,)/g, // Evită false pozitives în arrays
  /['"`]Cheltuială['"`](?!\s*,)/g,
  /['"`]Economisire['"`](?!\s*,)/g,
];

// Correct pattern
const CORRECT_PATTERN = /import\s+.*from\s+['"]@shared-constants/g;

function scanFileForPatterns(filePath) {
  if (!filePath.endsWith('.ts') && !filePath.endsWith('.tsx')) {
    return [];
  }

  // Skip shared-constants files themselves - they are the source of truth
  const relativePath = path.relative(process.cwd(), filePath);
  if (relativePath.includes('shared-constants') || relativePath.includes('\\shared-constants\\')) {
    return [];
  }

  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n');
  const issues = [];

  lines.forEach((line, lineIndex) => {
    INCORRECT_PATTERNS.forEach((pattern, patternIndex) => {
      const matches = line.match(pattern);
      if (matches) {
        matches.forEach(match => {
          issues.push({
            file: path.relative(process.cwd(), filePath),
            line: lineIndex + 1,
            issue: match,
            type: patternIndex < 2 ? 'WRONG_IMPORT' : 'HARDCODED_STRING'
          });
        });
      }
    });
  });

  return issues;
}

function scanDirectory(dir) {
  let allIssues = [];
  
  try {
    const items = fs.readdirSync(dir, { withFileTypes: true });
    
    for (const item of items) {
      const fullPath = path.join(dir, item.name);
      
      // Skip node_modules, .git, dist, etc.
      if (item.name.startsWith('.') || item.name === 'node_modules' || item.name === 'dist') {
        continue;
      }
      
      if (item.isDirectory()) {
        allIssues = allIssues.concat(scanDirectory(fullPath));
      } else if (item.isFile()) {
        allIssues = allIssues.concat(scanFileForPatterns(fullPath));
      }
    }
  } catch (error) {
    console.warn(`⚠️  Warning: Could not scan ${dir}: ${error.message}`);
  }
  
  return allIssues;
}

function validateSharedConstantsStructure() {
  const sharedConstantsPath = path.join(__dirname, '../shared-constants');
  const frontendCopyPath = path.join(__dirname, '../frontend/src/shared-constants');
  
  if (!fs.existsSync(sharedConstantsPath)) {
    console.error('❌ shared-constants directory not found at root');
    return false;
  }
  
  if (!fs.existsSync(frontendCopyPath)) {
    console.error('❌ frontend/src/shared-constants not found - run sync script');
    return false;
  }
  
  console.log('✅ Shared constants structure verified');
  return true;
}

function main() {
  if (!validateSharedConstantsStructure()) {
    process.exit(1);
  }
  
  console.log('🔍 Scanning for incorrect @shared-constants usage...\n');
  
  const issues = scanDirectory(FRONTEND_SRC);
  
  if (issues.length === 0) {
    console.log('✅ All @shared-constants usage is correct!');
    console.log('🎯 Validation: PASSED\n');
    return;
  }
  
  // Group issues by type
  const wrongImports = issues.filter(i => i.type === 'WRONG_IMPORT');
  const hardcodedStrings = issues.filter(i => i.type === 'HARDCODED_STRING');
  
  if (wrongImports.length > 0) {
    console.log('❌ WRONG IMPORTS found:');
    wrongImports.forEach(issue => {
      console.log(`   ${issue.file}:${issue.line} - ${issue.issue}`);
    });
    console.log('   💡 Fix: Use "import { ... } from \'@shared-constants\'" instead\n');
  }
  
  if (hardcodedStrings.length > 0) {
    console.log('❌ HARDCODED STRINGS found:');
    hardcodedStrings.forEach(issue => {
      console.log(`   ${issue.file}:${issue.line} - ${issue.issue}`);
    });
    console.log('   💡 Fix: Import from @shared-constants (LABELS, BUTTONS, etc.)\n');
  }
  
  console.log(`🚨 Total issues: ${issues.length}`);
  console.log('❌ Validation: FAILED');
  process.exit(1);
}

if (require.main === module) {
  main();
}

module.exports = { scanFileForPatterns, scanDirectory }; 
#!/usr/bin/env node

/**
 * Script: validate-data-testid-consistency.js
 * Validează consistența data-testid între markup și catalog TEST_IDS
 * Identifică data-testid folosite dar nedefinite și invers
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Validating data-testid consistency...\n');

// Paths to scan
const FRONTEND_SRC = path.join(__dirname, '../frontend/src');
const E2E_TESTS_PATH = path.join(__dirname, '../frontend/tests/e2e');

// Pattern pentru extragerea data-testid din JSX
const DATA_TESTID_PATTERN = /data-testid\s*=\s*["'`]([^"'`]+)["'`]/g;

// Pattern pentru extragerea selectorilor din teste E2E
const SELECTOR_PATTERNS = [
  /getByTestId\s*\(\s*["'`]([^"'`]+)["'`]\s*\)/g,
  /\[data-testid\s*=\s*["'`]([^"'`]+)["'`]\]/g,
  /locator\s*\(\s*["'`]\[data-testid="([^"'`]+)"\]["'`]\s*\)/g,
];

function extractDataTestIds(filePath) {
  if (!filePath.endsWith('.tsx') && !filePath.endsWith('.ts')) {
    return [];
  }

  const content = fs.readFileSync(filePath, 'utf8');
  const testIds = [];
  let match;

  // Extract data-testid from JSX
  DATA_TESTID_PATTERN.lastIndex = 0;
  while ((match = DATA_TESTID_PATTERN.exec(content)) !== null) {
    testIds.push({
      id: match[1],
      file: path.relative(process.cwd(), filePath),
      type: 'DEFINED'
    });
  }

  return testIds;
}

function extractTestSelectors(filePath) {
  if (!filePath.endsWith('.spec.ts') && !filePath.endsWith('.test.ts') && !filePath.endsWith('.test.tsx')) {
    return [];
  }

  const content = fs.readFileSync(filePath, 'utf8');
  const selectors = [];

  SELECTOR_PATTERNS.forEach(pattern => {
    let match;
    pattern.lastIndex = 0;
    while ((match = pattern.exec(content)) !== null) {
      selectors.push({
        id: match[1],
        file: path.relative(process.cwd(), filePath),
        type: 'USED'
      });
    }
  });

  return selectors;
}

function scanDirectory(dir, extractor) {
  let results = [];
  
  try {
    const items = fs.readdirSync(dir, { withFileTypes: true });
    
    for (const item of items) {
      const fullPath = path.join(dir, item.name);
      
      // Skip irrelevant directories
      if (item.name.startsWith('.') || 
          item.name === 'node_modules' || 
          item.name === 'dist' || 
          item.name === 'coverage') {
        continue;
      }
      
      if (item.isDirectory()) {
        results = results.concat(scanDirectory(fullPath, extractor));
      } else if (item.isFile()) {
        results = results.concat(extractor(fullPath));
      }
    }
  } catch (error) {
    console.warn(`⚠️  Warning: Could not scan ${dir}: ${error.message}`);
  }
  
  return results;
}

function findTestIdsInPageObjects() {
  // Look for Page Object Models with TEST_IDS
  const pomFiles = [];
  const supportPath = path.join(E2E_TESTS_PATH, 'support');
  
  if (!fs.existsSync(supportPath)) {
    return [];
  }

  try {
    const items = fs.readdirSync(supportPath, { withFileTypes: true });
    for (const item of items) {
      if (item.isFile() && item.name.endsWith('.ts')) {
        const fullPath = path.join(supportPath, item.name);
        const content = fs.readFileSync(fullPath, 'utf8');
        
        // Look for TEST_IDS object definitions
        const testIdsPattern = /TEST_IDS\s*=\s*\{([^}]+)\}/g;
        const idPattern = /(\w+)\s*:\s*["'`]([^"'`]+)["'`]/g;
        
        let match;
        while ((match = testIdsPattern.exec(content)) !== null) {
          const idsBlock = match[1];
          let idMatch;
          while ((idMatch = idPattern.exec(idsBlock)) !== null) {
            pomFiles.push({
              id: idMatch[2],
              property: idMatch[1],
              file: path.relative(process.cwd(), fullPath),
              type: 'POM_DEFINED'
            });
          }
        }
      }
    }
  } catch (error) {
    console.warn(`⚠️  Warning: Could not scan POM files: ${error.message}`);
  }
  
  return pomFiles;
}

function analyzeConsistency(defined, used, pomDefined) {
  const definedIds = new Set(defined.map(d => d.id));
  const usedIds = new Set(used.map(u => u.id));
  const pomIds = new Set(pomDefined.map(p => p.id));
  
  // Find inconsistencies
  const unusedInMarkup = [...definedIds].filter(id => !usedIds.has(id));
  const undefinedInTests = [...usedIds].filter(id => !definedIds.has(id));
  const unusedInPom = [...pomIds].filter(id => !usedIds.has(id));
  const missingFromPom = [...usedIds].filter(id => !pomIds.has(id) && definedIds.has(id));
  
  return {
    unusedInMarkup,
    undefinedInTests,
    unusedInPom,
    missingFromPom,
    totalDefined: definedIds.size,
    totalUsed: usedIds.size,
    totalPomDefined: pomIds.size
  };
}

function main() {
  console.log('📋 Scanning for data-testid definitions in components...');
  const definedTestIds = scanDirectory(FRONTEND_SRC, extractDataTestIds);
  
  console.log('🧪 Scanning for data-testid usage in tests...');
  const usedTestIds = scanDirectory(E2E_TESTS_PATH, extractTestSelectors);
  
  console.log('📝 Scanning for TEST_IDS in Page Object Models...');
  const pomTestIds = findTestIdsInPageObjects();
  
  console.log('\n📊 Analysis Results:');
  console.log(`   Defined in components: ${definedTestIds.length}`);
  console.log(`   Used in tests: ${usedTestIds.length}`);
  console.log(`   Defined in POMs: ${pomTestIds.length}`);
  
  const analysis = analyzeConsistency(definedTestIds, usedTestIds, pomTestIds);
  
  let hasIssues = false;
  
  if (analysis.undefinedInTests.length > 0) {
    console.log('\n❌ UNDEFINED data-testid used in tests:');
    analysis.undefinedInTests.forEach(id => {
      const usage = usedTestIds.find(u => u.id === id);
      console.log(`   "${id}" used in ${usage.file} but not defined in components`);
    });
    hasIssues = true;
  }
  
  if (analysis.unusedInMarkup.length > 0) {
    console.log('\n⚠️  UNUSED data-testid in components:');
    analysis.unusedInMarkup.forEach(id => {
      const definition = definedTestIds.find(d => d.id === id);
      console.log(`   "${id}" defined in ${definition.file} but never used in tests`);
    });
  }
  
  if (analysis.missingFromPom.length > 0 && pomTestIds.length > 0) {
    console.log('\n💡 SUGGESTION - Add to Page Object Model:');
    analysis.missingFromPom.slice(0, 10).forEach(id => { // Show max 10
      console.log(`   "${id}" used in tests but missing from POM`);
    });
    if (analysis.missingFromPom.length > 10) {
      console.log(`   ... and ${analysis.missingFromPom.length - 10} more`);
    }
  }
  
  if (analysis.unusedInPom.length > 0) {
    console.log('\n🧹 CLEANUP - Unused POM definitions:');
    analysis.unusedInPom.forEach(id => {
      const pomDef = pomTestIds.find(p => p.id === id);
      console.log(`   "${id}" (${pomDef.property}) in ${pomDef.file} - never used`);
    });
  }
  
  if (!hasIssues) {
    console.log('\n✅ All data-testid references are consistent!');
    console.log('🎯 Data-testid validation: PASSED');
  } else {
    console.log('\n❌ Data-testid consistency issues found');
    console.log('🚨 Validation: FAILED');
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = { 
  extractDataTestIds, 
  extractTestSelectors, 
  findTestIdsInPageObjects,
  analyzeConsistency 
}; 
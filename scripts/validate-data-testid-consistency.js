#!/usr/bin/env node

/**
 * Script: validate-data-testid-consistency.js
 * Validează comprehensive consistența data-testid între markup și catalogul TEST_IDS
 * Identifică data-testid folosite dar nedefinite, neufilizate și probleme de naming convention
 */

import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));

import fs from 'fs';
import path from 'path';

console.log('🔍 Data-testid Consistency Validation');
console.log('=====================================\n');

// Paths to scan
const FRONTEND_SRC = path.join(__dirname, '../frontend/src');
const E2E_TESTS_PATH = path.join(__dirname, '../frontend/tests/e2e');

// Pattern pentru extragerea data-testid din JSX
const DATA_TESTID_PATTERN = /data-testid\s*=\s*["'`]([^"'`]+)["'`]/g;

// Pattern pentru extragerea selectorilor din teste E2E
const SELECTOR_PATTERNS = [
  {
    pattern: /getByTestId\s*\(\s*["'`]([^"'`]+)["'`]\s*\)/g,
    type: 'PLAYWRIGHT_GETTESTID',
    description: 'getByTestId() usage'
  },
  {
    pattern: /\[data-testid\s*=\s*["'`]([^"'`]+)["'`]\]/g,
    type: 'CSS_SELECTOR',
    description: '[data-testid="..."] CSS selector'
  },
  {
    pattern: /locator\s*\(\s*["'`]\[data-testid="([^"'`]+)"\]["'`]\s*\)/g,
    type: 'PLAYWRIGHT_LOCATOR',
    description: 'locator("[data-testid="..."]") usage'
  },
  {
    pattern: /'data-testid=([^']+)'/g,
    type: 'ATTRIBUTE_SELECTOR',
    description: 'attribute selector in locator'
  }
];

// Naming convention patterns
const NAMING_PATTERNS = [
  {
    pattern: /^[a-z][a-z0-9]*(-[a-z0-9]+)*$/,
    type: 'KEBAB_CASE',
    description: 'kebab-case (recommended)',
    valid: true
  },
  {
    pattern: /^[a-zA-Z][a-zA-Z0-9]*$/,
    type: 'CAMEL_CASE',
    description: 'camelCase',
    valid: true
  },
  {
    pattern: /^[A-Z][A-Z0-9_]*$/,
    type: 'SCREAMING_SNAKE',
    description: 'SCREAMING_SNAKE_CASE',
    valid: false
  },
  {
    pattern: /^[a-z][a-z0-9]*(_[a-z0-9]+)*$/,
    type: 'SNAKE_CASE',
    description: 'snake_case',
    valid: false
  }
];

// Paths to exclude
const EXCLUDED_PATHS = [
  'test', 'tests', '__tests__', 
  'spec', 'debug', 'storybook',
  'node_modules', 'dist', 'coverage',
  '.test.', '.spec.', '.debug.'
];

let fileStats = {
  totalScanned: 0,
  componentsWithTestIds: 0,
  testFilesWithSelectors: 0,
  pomFilesFound: 0
};

function shouldExcludeFile(filePath) {
  const relativePath = path.relative(process.cwd(), filePath);
  
  return EXCLUDED_PATHS.some(excluded => 
    relativePath.includes(excluded) || 
    relativePath.includes(`/${excluded}/`) ||
    relativePath.includes(`\\${excluded}\\`)
  );
}

function validateNamingConvention(testId) {
  for (const pattern of NAMING_PATTERNS) {
    if (pattern.pattern.test(testId)) {
      return {
        valid: pattern.valid,
        type: pattern.type,
        description: pattern.description
      };
    }
  }
  
  return {
    valid: false,
    type: 'INVALID',
    description: 'Invalid naming convention'
  };
}

function extractDataTestIds(filePath) {
  if (!filePath.endsWith('.tsx') && !filePath.endsWith('.ts') && !filePath.endsWith('.jsx')) {
    return [];
  }

  if (shouldExcludeFile(filePath)) {
    return [];
  }

  fileStats.totalScanned++;

  const content = fs.readFileSync(filePath, 'utf8');
  const testIds = [];
  let match;

  // Extract data-testid from JSX
  DATA_TESTID_PATTERN.lastIndex = 0;
  while ((match = DATA_TESTID_PATTERN.exec(content)) !== null) {
    const testId = match[1];
    const namingInfo = validateNamingConvention(testId);
    
    testIds.push({
      id: testId,
      file: path.relative(process.cwd(), filePath),
      line: content.substr(0, match.index).split('\n').length,
      type: 'DEFINED',
      naming: namingInfo,
      context: content.substr(Math.max(0, match.index - 50), 100).replace(/\n/g, ' ')
    });
  }

  if (testIds.length > 0) {
    fileStats.componentsWithTestIds++;
  }

  return testIds;
}

function extractTestSelectors(filePath) {
  if (!filePath.endsWith('.spec.ts') && !filePath.endsWith('.test.ts') && 
      !filePath.endsWith('.test.tsx') && !filePath.endsWith('.e2e.ts')) {
    return [];
  }

  if (shouldExcludeFile(filePath)) {
    return [];
  }

  const content = fs.readFileSync(filePath, 'utf8');
  const selectors = [];

  SELECTOR_PATTERNS.forEach(patternInfo => {
    let match;
    patternInfo.pattern.lastIndex = 0;
    while ((match = patternInfo.pattern.exec(content)) !== null) {
      const testId = match[1];
      const namingInfo = validateNamingConvention(testId);
      
      selectors.push({
        id: testId,
        file: path.relative(process.cwd(), filePath),
        line: content.substr(0, match.index).split('\n').length,
        type: 'USED',
        selectorType: patternInfo.type,
        selectorDescription: patternInfo.description,
        naming: namingInfo,
        context: content.substr(Math.max(0, match.index - 30), 80).replace(/\n/g, ' ')
      });
    }
  });

  if (selectors.length > 0) {
    fileStats.testFilesWithSelectors++;
  }

  return selectors;
}

function scanDirectory(dir, extractor) {
  let results = [];
  
  if (!fs.existsSync(dir)) {
    console.warn(`⚠️  Directory not found: ${dir}`);
    return results;
  }
  
  try {
    const items = fs.readdirSync(dir, { withFileTypes: true });
    
    for (const item of items) {
      const fullPath = path.join(dir, item.name);
      
      // Skip irrelevant directories
      if (EXCLUDED_PATHS.some(excluded => item.name.includes(excluded))) {
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
    console.warn(`📁 Page Object Models directory not found: ${supportPath}`);
    return [];
  }

  try {
    const items = fs.readdirSync(supportPath, { withFileTypes: true });
    for (const item of items) {
      if (item.isFile() && (item.name.endsWith('.ts') || item.name.endsWith('.js'))) {
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
            const testId = idMatch[2];
            const namingInfo = validateNamingConvention(testId);
            
            pomFiles.push({
              id: testId,
              property: idMatch[1],
              file: path.relative(process.cwd(), fullPath),
              line: content.substr(0, match.index).split('\n').length,
              type: 'POM_DEFINED',
              naming: namingInfo
            });
          }
        }
        
        if (pomFiles.length > 0) {
          fileStats.pomFilesFound++;
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
  
  // Analyze naming issues
  const badNamingDefined = defined.filter(d => !d.naming.valid);
  const badNamingUsed = used.filter(u => !u.naming.valid);
  const badNamingPom = pomDefined.filter(p => !p.naming.valid);
  
  // Analyze duplicates
  const duplicateDefined = findDuplicates(defined);
  const duplicateUsed = findDuplicates(used);
  
  return {
    unusedInMarkup,
    undefinedInTests,
    unusedInPom,
    missingFromPom,
    badNamingDefined,
    badNamingUsed,
    badNamingPom,
    duplicateDefined,
    duplicateUsed,
    totalDefined: definedIds.size,
    totalUsed: usedIds.size,
    totalPomDefined: pomIds.size,
    uniqueDefinedIds: definedIds.size,
    uniqueUsedIds: usedIds.size
  };
}

function findDuplicates(items) {
  const idCounts = {};
  items.forEach(item => {
    if (!idCounts[item.id]) {
      idCounts[item.id] = [];
    }
    idCounts[item.id].push(item);
  });
  
  return Object.values(idCounts).filter(group => group.length > 1);
}

function generateRecommendations(analysis) {
  const recommendations = [];
  
  if (analysis.undefinedInTests.length > 0) {
    recommendations.push({
      priority: 'HIGH',
      type: 'MISSING_DEFINITIONS',
      count: analysis.undefinedInTests.length,
      description: 'Test selectors reference undefined data-testid attributes',
      action: 'Add missing data-testid attributes to components or update test selectors'
    });
  }
  
  if (analysis.unusedInMarkup.length > 0) {
    recommendations.push({
      priority: 'MEDIUM',
      type: 'UNUSED_TESTIDS',
      count: analysis.unusedInMarkup.length,
      description: 'Components have data-testid attributes not used in tests',
      action: 'Create tests that use these selectors or remove unused attributes'
    });
  }
  
  if (analysis.badNamingDefined.length > 0 || analysis.badNamingUsed.length > 0) {
    recommendations.push({
      priority: 'LOW',
      type: 'NAMING_CONVENTION',
      count: analysis.badNamingDefined.length + analysis.badNamingUsed.length,
      description: 'Some data-testid values use inconsistent naming conventions',
      action: 'Standardize to kebab-case or camelCase for consistency'
    });
  }
  
  if (analysis.duplicateDefined.length > 0) {
    recommendations.push({
      priority: 'HIGH',
      type: 'DUPLICATE_DEFINITIONS',
      count: analysis.duplicateDefined.length,
      description: 'Multiple components use the same data-testid value',
      action: 'Make data-testid values unique across components'
    });
  }
  
  return recommendations.sort((a, b) => {
    const priorityOrder = { HIGH: 3, MEDIUM: 2, LOW: 1 };
    return priorityOrder[b.priority] - priorityOrder[a.priority];
  });
}

function main() {
  console.log('📋 Scanning for data-testid definitions in components...');
  const definedTestIds = scanDirectory(FRONTEND_SRC, extractDataTestIds);
  
  console.log('🧪 Scanning for data-testid usage in tests...');
  const usedTestIds = scanDirectory(E2E_TESTS_PATH, extractTestSelectors);
  
  console.log('📝 Scanning for TEST_IDS in Page Object Models...');
  const pomTestIds = findTestIdsInPageObjects();
  
  console.log(`📁 Files scanned: ${fileStats.totalScanned}\n`);
  
  const analysis = analyzeConsistency(definedTestIds, usedTestIds, pomTestIds);
  
  console.log('📊 Data-testid Consistency Results:\n');
  
  console.log('📈 Overview:');
  console.log(`   🏗️  Components with testids: ${fileStats.componentsWithTestIds}`);
  console.log(`   🧪 Test files with selectors: ${fileStats.testFilesWithSelectors}`);
  console.log(`   📝 POM files found: ${fileStats.pomFilesFound}`);
  console.log(`   📁 Total files scanned: ${fileStats.totalScanned}\n`);
  
  console.log('🔍 Usage Statistics:');
  console.log(`   📊 Total defined: ${analysis.totalDefined}`);
  console.log(`   📊 Total used in tests: ${analysis.totalUsed}`);
  console.log(`   📊 Total in POMs: ${analysis.totalPomDefined}`);
  console.log(`   📊 Unique definitions: ${analysis.uniqueDefinedIds}`);
  console.log(`   📊 Unique test usages: ${analysis.uniqueUsedIds}\n`);
  
  let hasIssues = false;
  
  // Critical issues first
  if (analysis.undefinedInTests.length > 0) {
    console.log('🚨 HIGH PRIORITY - UNDEFINED data-testid used in tests:\n');
    analysis.undefinedInTests.slice(0, 10).forEach(id => {
      const usage = usedTestIds.find(u => u.id === id);
      console.log(`❌ "${id}"`);
      console.log(`   📁 Used in: ${usage.file}:${usage.line}`);
      console.log(`   🔍 Selector type: ${usage.selectorDescription}`);
      console.log(`   📝 Context: ...${usage.context}...`);
      console.log('');
    });
    
    if (analysis.undefinedInTests.length > 10) {
      console.log(`   ... and ${analysis.undefinedInTests.length - 10} more undefined test selectors\n`);
    }
    hasIssues = true;
  }
  
  if (analysis.duplicateDefined.length > 0) {
    console.log('🚨 HIGH PRIORITY - DUPLICATE data-testid definitions:\n');
    analysis.duplicateDefined.slice(0, 5).forEach(group => {
      console.log(`❌ "${group[0].id}" (${group.length} duplicates):`);
      group.forEach(item => {
        console.log(`   📁 ${item.file}:${item.line}`);
      });
      console.log('');
    });
    
    if (analysis.duplicateDefined.length > 5) {
      console.log(`   ... and ${analysis.duplicateDefined.length - 5} more duplicate groups\n`);
    }
    hasIssues = true;
  }
  
  // Medium priority issues
  if (analysis.unusedInMarkup.length > 0) {
    console.log('⚠️  MEDIUM PRIORITY - UNUSED data-testid in components:\n');
    console.log(`⚠️  ${analysis.unusedInMarkup.length} data-testid attributes defined but not used in tests`);
    
    if (analysis.unusedInMarkup.length <= 15) {
      analysis.unusedInMarkup.forEach(id => {
        const definition = definedTestIds.find(d => d.id === id);
        console.log(`   • "${id}" in ${definition.file}:${definition.line}`);
      });
    } else {
      console.log(`   📁 Affected files: ${new Set(analysis.unusedInMarkup.map(id => {
        const def = definedTestIds.find(d => d.id === id);
        return def ? def.file : 'unknown';
      })).size}`);
    }
    console.log('');
    hasIssues = true;
  }
  
  // Naming convention issues
  const allBadNaming = [...analysis.badNamingDefined, ...analysis.badNamingUsed, ...analysis.badNamingPom];
  if (allBadNaming.length > 0) {
    console.log('💡 LOW PRIORITY - NAMING CONVENTION issues:\n');
    const namingGroups = {};
    allBadNaming.forEach(item => {
      if (!namingGroups[item.naming.type]) {
        namingGroups[item.naming.type] = [];
      }
      namingGroups[item.naming.type].push(item);
    });
    
    Object.keys(namingGroups).forEach(type => {
      const items = namingGroups[type];
      console.log(`💡 ${type} (${items.length} instances):`);
      console.log(`   📝 ${items[0].naming.description}`);
      
      const examples = items.slice(0, 3);
      examples.forEach(item => {
        console.log(`   • "${item.id}" in ${item.file}`);
      });
      
      if (items.length > 3) {
        console.log(`   ... and ${items.length - 3} more`);
      }
      console.log('');
    });
    hasIssues = true;
  }
  
  // Generate recommendations
  const recommendations = generateRecommendations(analysis);
  
  if (recommendations.length > 0) {
    console.log('🔧 RECOMMENDED ACTIONS:\n');
    recommendations.forEach((rec, index) => {
      const priority = rec.priority === 'HIGH' ? '🔥' : rec.priority === 'MEDIUM' ? '⚠️' : '💡';
      console.log(`${index + 1}. ${priority} ${rec.type} (${rec.count} issues)`);
      console.log(`   📝 ${rec.description}`);
      console.log(`   🔧 ${rec.action}`);
      console.log('');
    });
  }
  
  if (!hasIssues) {
    console.log('✅ Perfect! All data-testid usage is consistent!');
    console.log('🎯 Validation: PASSED');
    console.log('🚀 All test selectors have corresponding component definitions\n');
    return;
  }
  
  console.log(`🚨 Total issues found: ${analysis.undefinedInTests.length + analysis.unusedInMarkup.length + analysis.duplicateDefined.length + allBadNaming.length}`);
  console.log('❌ Validation: FAILED');
  console.log('💡 Focus on high priority issues first.\n');
  
  process.exit(1);
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export {  
  extractDataTestIds, 
  extractTestSelectors, 
  analyzeConsistency, 
  validateNamingConvention 
 }; 
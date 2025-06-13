#!/usr/bin/env node

/**
 * Script: validate-shared-constants-usage.js
 * Validează comprehensive că toate import-urile folosesc @shared-constants și nu path-uri directe
 * Raportează import-uri greșite, hardcoded strings și sugerează remedierea
 */

import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));

import fs from 'fs';
import path from 'path';

console.log('🔍 Validating @shared-constants usage...\n');

// Paths to scan
const FRONTEND_SRC = path.join(__dirname, '../frontend/src');
const BACKEND_SRC = path.join(__dirname, '../backend/src');

// Patterns to detect incorrect imports
const VALIDATION_PATTERNS = [
  {
    pattern: /import\s+.*from\s+['"]\.\.?\/.*shared-constants/g,
    type: 'WRONG_IMPORT',
    severity: 'HIGH',
    description: 'Direct relative imports to shared-constants',
    suggestion: 'Use "import { ... } from \'@shared-constants\'" instead'
  },
  {
    pattern: /import\s+.*from\s+['"]\.\.?\/.*\/shared-constants/g,
    type: 'WRONG_IMPORT',
    severity: 'HIGH', 
    description: 'Nested relative imports to shared-constants',
    suggestion: 'Use "@shared-constants" alias'
  },
  {
    pattern: /['"`]Tip tranzacție['"`]/g,
    type: 'HARDCODED_STRING',
    severity: 'MEDIUM',
    description: 'Hardcoded transaction type labels',
    suggestion: 'Import LABELS.TRANSACTION_TYPE from @shared-constants'
  },
  {
    pattern: /['"`]Adaugă tranzacție['"`]/g,
    type: 'HARDCODED_STRING',
    severity: 'MEDIUM',
    description: 'Hardcoded button text',
    suggestion: 'Import BUTTONS.ADD_TRANSACTION from @shared-constants'
  },
  {
    pattern: /['"`]Se încarcă\.\.\.['"`]/g,
    type: 'HARDCODED_STRING',
    severity: 'MEDIUM',
    description: 'Hardcoded loading messages',
    suggestion: 'Import BUTTONS.LOADING from @shared-constants'
  },
  {
    pattern: /['"`]Alege['"`]/g,
    type: 'HARDCODED_STRING',
    severity: 'LOW',
    description: 'Hardcoded placeholder text',
    suggestion: 'Import PLACEHOLDERS.SELECT from @shared-constants'
  },
  {
    pattern: /['"`]Venit['"`](?!\s*[,\]])/g,
    type: 'HARDCODED_STRING',
    severity: 'MEDIUM',
    description: 'Hardcoded transaction type strings',
    suggestion: 'Import OPTIONS.TRANSACTION_TYPE from @shared-constants'
  },
  {
    pattern: /['"`]Cheltuială['"`](?!\s*[,\]])/g,
    type: 'HARDCODED_STRING', 
    severity: 'MEDIUM',
    description: 'Hardcoded transaction type strings',
    suggestion: 'Import OPTIONS.TRANSACTION_TYPE from @shared-constants'
  },
  {
    pattern: /['"`]Economisire['"`](?!\s*[,\]])/g,
    type: 'HARDCODED_STRING',
    severity: 'MEDIUM',
    description: 'Hardcoded transaction type strings',
    suggestion: 'Import OPTIONS.TRANSACTION_TYPE from @shared-constants'
  },
  {
    pattern: /['"`]\/api\/[^'"`]*['"`]/g,
    type: 'HARDCODED_API',
    severity: 'HIGH',
    description: 'Hardcoded API routes',
    suggestion: 'Import API.ROUTES.* from @shared-constants'
  },
  {
    pattern: /['"`]https?:\/\/(?!www\.w3\.org\/)[^'"`]{5,}['"`]/g,
    type: 'HARDCODED_URL',
    severity: 'MEDIUM',
    description: 'Hardcoded business URLs (excludes XML namespaces and protocol validations)',
    suggestion: 'Consider using constants from @shared-constants'
  }
];

// Paths to exclude (test files, debug utilities, etc.)
const EXCLUDED_PATHS = [
  'test', 'tests', '__tests__', 
  'spec', 'debug', 'storybook',
  '.test.', '.spec.', '.debug.',
  'node_modules', 'dist', 'coverage',
  'shared-constants' // Skip shared-constants source itself
];

let fileStats = {
  totalChecked: 0,
  withIssues: 0,
  clean: 0
};

function shouldExcludeFile(filePath) {
  const relativePath = path.relative(process.cwd(), filePath);
  
  return EXCLUDED_PATHS.some(excluded => 
    relativePath.includes(excluded) || 
    relativePath.includes(`/${excluded}/`) ||
    relativePath.includes(`\\${excluded}\\`)
  );
}

function scanFileForPatterns(filePath) {
  if (!filePath.endsWith('.ts') && !filePath.endsWith('.tsx') && !filePath.endsWith('.js') && !filePath.endsWith('.jsx')) {
    return [];
  }

  // Skip excluded files
  if (shouldExcludeFile(filePath)) {
    return [];
  }

  fileStats.totalChecked++;

  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n');
  const issues = [];

  lines.forEach((line, lineIndex) => {
    // Skip commented lines
    const trimmedLine = line.trim();
    if (trimmedLine.startsWith('//') || trimmedLine.startsWith('*') || trimmedLine.startsWith('/*')) {
      return;
    }

    VALIDATION_PATTERNS.forEach(patternInfo => {
      patternInfo.pattern.lastIndex = 0; // Reset regex
      const matches = line.match(patternInfo.pattern);
      if (matches) {
        matches.forEach(match => {
          issues.push({
            file: path.relative(process.cwd(), filePath),
            line: lineIndex + 1,
            issue: match,
            lineContent: line.trim(),
            type: patternInfo.type,
            severity: patternInfo.severity,
            description: patternInfo.description,
            suggestion: patternInfo.suggestion
          });
        });
      }
    });
  });

  if (issues.length > 0) {
    fileStats.withIssues++;
  } else {
    fileStats.clean++;
  }

  return issues;
}

function scanDirectory(dir) {
  let allIssues = [];
  
  if (!fs.existsSync(dir)) {
    console.warn(`⚠️  Directory not found: ${dir}`);
    return allIssues;
  }
  
  try {
    const items = fs.readdirSync(dir, { withFileTypes: true });
    
    for (const item of items) {
      const fullPath = path.join(dir, item.name);
      
      // Skip excluded directories and files
      if (EXCLUDED_PATHS.some(excluded => item.name.includes(excluded))) {
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
  
  const checks = [];
  
  if (!fs.existsSync(sharedConstantsPath)) {
    checks.push('❌ shared-constants directory not found at root');
  } else {
    checks.push('✅ Root shared-constants directory exists');
  }
  
  if (!fs.existsSync(frontendCopyPath)) {
    checks.push('❌ frontend/src/shared-constants not found - run sync script');
  } else {
    checks.push('✅ Frontend shared-constants copy exists');
  }
  
  // Check if alias is configured
  const tsConfigPath = path.join(__dirname, '../frontend/tsconfig.json');
  if (fs.existsSync(tsConfigPath)) {
    const tsConfig = JSON.parse(fs.readFileSync(tsConfigPath, 'utf8'));
    const hasAlias = tsConfig?.compilerOptions?.paths?.['@shared-constants'];
    if (hasAlias) {
      checks.push('✅ TypeScript alias @shared-constants configured');
    } else {
      checks.push('⚠️  TypeScript alias @shared-constants not found');
    }
  }
  
  checks.forEach(check => console.log(check));
  console.log('');
  
  return !checks.some(check => check.startsWith('❌'));
}

function analyzeIssues(issues) {
  const bySeverity = {
    HIGH: issues.filter(i => i.severity === 'HIGH'),
    MEDIUM: issues.filter(i => i.severity === 'MEDIUM'),
    LOW: issues.filter(i => i.severity === 'LOW')
  };
  
  const byType = {};
  issues.forEach(issue => {
    if (!byType[issue.type]) byType[issue.type] = [];
    byType[issue.type].push(issue);
  });
  
  const byFile = {};
  issues.forEach(issue => {
    if (!byFile[issue.file]) byFile[issue.file] = [];
    byFile[issue.file].push(issue);
  });
  
  return { bySeverity, byType, byFile };
}

function generateFixSuggestions(issues) {
  const suggestions = new Map();
  
  issues.forEach(issue => {
    const key = `${issue.type}_${issue.severity}`;
    if (!suggestions.has(key)) {
      suggestions.set(key, {
        type: issue.type,
        severity: issue.severity,
        description: issue.description,
        suggestion: issue.suggestion,
        count: 0,
        files: new Set()
      });
    }
    
    const entry = suggestions.get(key);
    entry.count++;
    entry.files.add(issue.file);
  });
  
  return Array.from(suggestions.values());
}

function main() {
  console.log('🔍 Shared Constants Usage Validation');
  console.log('=====================================\n');
  
  if (!validateSharedConstantsStructure()) {
    console.log('❌ Structure validation failed. Please fix the issues above.');
    process.exit(1);
  }
  
  console.log('📁 Scanning directories for shared constants usage...');
  
  const frontendIssues = scanDirectory(FRONTEND_SRC);
  const backendIssues = scanDirectory(BACKEND_SRC);
  const allIssues = [...frontendIssues, ...backendIssues];
  
  console.log(`📁 Files checked: ${fileStats.totalChecked}\n`);
  
  if (allIssues.length === 0) {
    console.log('📊 Shared Constants Usage Results:\n');
    console.log('✅ Perfect! All shared constants usage is correct!');
    console.log(`📈 Files Distribution:`);
    console.log(`   ✅ Clean files: ${fileStats.clean}`);
    console.log(`   📁 Total: ${fileStats.totalChecked}`);
    console.log('\n🎯 Validation: PASSED');
    console.log('🚀 All imports use @shared-constants alias correctly\n');
    return;
  }
  
  const analysis = analyzeIssues(allIssues);
  
  console.log('📊 Shared Constants Usage Results:\n');
  
  console.log('📈 File Distribution:');
  console.log(`   🚨 Files with issues: ${fileStats.withIssues}`);
  console.log(`   ✅ Clean files: ${fileStats.clean}`);
  console.log(`   📁 Total: ${fileStats.totalChecked}\n`);
  
  console.log('🔍 Issue Overview:');
  console.log(`   📊 Issues found: ${allIssues.length}`);
  console.log(`   ❌ High severity: ${analysis.bySeverity.HIGH.length}`);
  console.log(`   ⚠️  Medium severity: ${analysis.bySeverity.MEDIUM.length}`);
  console.log(`   💡 Low severity: ${analysis.bySeverity.LOW.length}\n`);
  
  // Report by severity
  if (analysis.bySeverity.HIGH.length > 0) {
    console.log('🚨 HIGH SEVERITY ISSUES:\n');
    const highSeverityByType = {};
    analysis.bySeverity.HIGH.forEach(issue => {
      if (!highSeverityByType[issue.type]) highSeverityByType[issue.type] = [];
      highSeverityByType[issue.type].push(issue);
    });
    
    Object.keys(highSeverityByType).forEach(type => {
      const typeIssues = highSeverityByType[type];
      console.log(`❌ ${type} (${typeIssues.length} issues):`);
      console.log(`   📝 ${typeIssues[0].description}`);
      console.log(`   💡 ${typeIssues[0].suggestion}`);
      
      // Show top 5 examples
      typeIssues.slice(0, 5).forEach(issue => {
        console.log(`      • ${issue.file}:${issue.line} - ${issue.issue}`);
      });
      
      if (typeIssues.length > 5) {
        console.log(`      ... and ${typeIssues.length - 5} more`);
      }
      console.log('');
    });
  }
  
  if (analysis.bySeverity.MEDIUM.length > 0) {
    console.log('⚠️  MEDIUM SEVERITY ISSUES:\n');
    const mediumSeverityByType = {};
    analysis.bySeverity.MEDIUM.forEach(issue => {
      if (!mediumSeverityByType[issue.type]) mediumSeverityByType[issue.type] = [];
      mediumSeverityByType[issue.type].push(issue);
    });
    
    Object.keys(mediumSeverityByType).forEach(type => {
      const typeIssues = mediumSeverityByType[type];
      console.log(`⚠️  ${type} (${typeIssues.length} issues):`);
      console.log(`   📝 ${typeIssues[0].description}`);
      console.log(`   💡 ${typeIssues[0].suggestion}`);
      
      // Show affected files count
      const affectedFiles = new Set(typeIssues.map(i => i.file));
      console.log(`   📁 Affected files: ${affectedFiles.size}`);
      
      if (typeIssues.length <= 10) {
        typeIssues.forEach(issue => {
          console.log(`      • ${issue.file}:${issue.line}`);
        });
      } else {
        console.log(`      • ${typeIssues.length} instances across ${affectedFiles.size} files`);
      }
      console.log('');
    });
  }
  
  // Summary recommendations
  console.log('🔧 RECOMMENDED ACTIONS:\n');
  const suggestions = generateFixSuggestions(allIssues);
  suggestions.sort((a, b) => {
    const severityOrder = { HIGH: 3, MEDIUM: 2, LOW: 1 };
    return severityOrder[b.severity] - severityOrder[a.severity] || b.count - a.count;
  });
  
  suggestions.forEach((suggestion, index) => {
    const priority = suggestion.severity === 'HIGH' ? '🔥' : suggestion.severity === 'MEDIUM' ? '⚠️' : '💡';
    console.log(`${index + 1}. ${priority} ${suggestion.type} (${suggestion.count} instances)`);
    console.log(`   📝 ${suggestion.description}`);
    console.log(`   🔧 ${suggestion.suggestion}`);
    console.log(`   📁 Files affected: ${suggestion.files.size}`);
    console.log('');
  });
  
  console.log(`🚨 Total issues: ${allIssues.length}`);
  console.log('❌ Validation: FAILED');
  console.log('💡 Fix high severity issues first, then medium severity issues.\n');
  
  process.exit(1);
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export {  scanFileForPatterns, scanDirectory, analyzeIssues  }; 
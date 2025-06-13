#!/usr/bin/env node

/**
 * Script: validate-jsx-extensions.js
 * Validează comprehensive că toate fișierele care conțin JSX folosesc extensia .tsx/.jsx
 * Detectează fișiere .ts/.js cu conținut JSX care ar trebui redenumite
 */

import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));

import fs from 'fs';
import path from 'path';

console.log('🔍 JSX Extension Validation');
console.log('============================\n');

// Paths to scan
const FRONTEND_SRC = path.join(__dirname, '../frontend/src');

// JSX patterns to detect
const JSX_PATTERNS = [
  {
    pattern: /<\s*[A-Z][a-zA-Z0-9]*[^>]*>/g,
    type: 'COMPONENT_TAG',
    description: 'React component tags (e.g., <Component>)',
    severity: 'HIGH'
  },
  {
    pattern: /<\s*[a-z][a-zA-Z0-9-]*[^>]*>/g,
    type: 'HTML_TAG',
    description: 'HTML tags in JSX (e.g., <div>, <span>)',
    severity: 'HIGH'
  },
  {
    pattern: /\{[^}]*\}/g,
    type: 'JSX_EXPRESSION',
    description: 'JSX expressions (e.g., {variable})',
    severity: 'MEDIUM',
    // Exclude false positives
    excludePatterns: [
      /import\s*\{[^}]*\}/g,  // Import statements
      /export\s*\{[^}]*\}/g,  // Export statements
      /const\s+\{[^}]*\}\s*=/g, // Destructuring
      /function[^{]*\{/g,     // Function definitions
      /class[^{]*\{/g,        // Class definitions
      /interface[^{]*\{/g,    // Interface definitions
      /type[^{]*\{/g          // Type definitions
    ]
  },
  {
    pattern: /return\s*\(\s*</g,
    type: 'JSX_RETURN',
    description: 'Return statements with JSX',
    severity: 'HIGH'
  },
  {
    pattern: /React\.createElement/g,
    type: 'REACT_CREATEELEMENT',
    description: 'React.createElement calls',
    severity: 'MEDIUM'
  },
  {
    pattern: /jsx:/g,
    type: 'JSX_PRAGMA',
    description: 'JSX pragma comments',
    severity: 'HIGH'
  }
];

// Paths to exclude
const EXCLUDED_PATHS = [
  'test', 'tests', '__tests__', 
  'spec', 'debug', 'storybook',
  'node_modules', 'dist', 'coverage',
  '.test.', '.spec.', '.debug.',
  'vite.config', 'tailwind.config'
];

let fileStats = {
  totalScanned: 0,
  correctExtensions: 0,
  incorrectExtensions: 0,
  jsxDetected: 0,
  noJsxDetected: 0
};

function shouldExcludeFile(filePath) {
  const relativePath = path.relative(process.cwd(), filePath);
  
  return EXCLUDED_PATHS.some(excluded => 
    relativePath.includes(excluded) || 
    relativePath.includes(`/${excluded}/`) ||
    relativePath.includes(`\\${excluded}\\`)
  );
}

function detectJSXInContent(content, filePath) {
  const jsxOccurrences = [];
  const lines = content.split('\n');
  
  JSX_PATTERNS.forEach(patternInfo => {
    let match;
    patternInfo.pattern.lastIndex = 0;
    
    while ((match = patternInfo.pattern.exec(content)) !== null) {
      const lineIndex = content.substr(0, match.index).split('\n').length - 1;
      const line = lines[lineIndex];
      
      // Skip if it's a comment
      const trimmedLine = line.trim();
      if (trimmedLine.startsWith('//') || trimmedLine.startsWith('*') || trimmedLine.startsWith('/*')) {
        continue;
      }
      
      // Apply exclude patterns for JSX_EXPRESSION type
      if (patternInfo.type === 'JSX_EXPRESSION' && patternInfo.excludePatterns) {
        const isExcluded = patternInfo.excludePatterns.some(excludePattern => {
          excludePattern.lastIndex = 0;
          return excludePattern.test(line);
        });
        if (isExcluded) continue;
      }
      
      // Additional validation for HTML_TAG to reduce false positives
      if (patternInfo.type === 'HTML_TAG') {
        // Must be in a JSX context (inside return statement, variable assignment, etc.)
        const beforeMatch = content.substr(Math.max(0, match.index - 100), 100);
        const hasJsxContext = /return\s*\(|=\s*\(|createElement|jsx/i.test(beforeMatch);
        if (!hasJsxContext) continue;
      }
      
      jsxOccurrences.push({
        type: patternInfo.type,
        description: patternInfo.description,
        severity: patternInfo.severity,
        line: lineIndex + 1,
        match: match[0],
        context: line.trim(),
        file: path.relative(process.cwd(), filePath)
      });
    }
  });
  
  return jsxOccurrences;
}

function analyzeFile(filePath) {
  if (!filePath.endsWith('.ts') && !filePath.endsWith('.tsx') && 
      !filePath.endsWith('.js') && !filePath.endsWith('.jsx')) {
    return null;
  }

  if (shouldExcludeFile(filePath)) {
    return null;
  }

  fileStats.totalScanned++;

  const content = fs.readFileSync(filePath, 'utf8');
  const hasJsxExtension = filePath.endsWith('.tsx') || filePath.endsWith('.jsx');
  const jsxOccurrences = detectJSXInContent(content, filePath);
  const hasJsxContent = jsxOccurrences.length > 0;

  const result = {
    file: path.relative(process.cwd(), filePath),
    hasJsxExtension,
    hasJsxContent,
    jsxOccurrences,
    isCorrect: (hasJsxContent && hasJsxExtension) || (!hasJsxContent && !hasJsxExtension),
    issue: null
  };

  if (hasJsxContent && !hasJsxExtension) {
    result.issue = {
      type: 'MISSING_JSX_EXTENSION',
      severity: 'HIGH',
      description: 'File contains JSX but uses .ts/.js extension',
      suggestion: `Rename to ${filePath.replace(/\.(ts|js)$/, '.tsx')}`
    };
    fileStats.incorrectExtensions++;
    fileStats.jsxDetected++;
  } else if (!hasJsxContent && hasJsxExtension) {
    result.issue = {
      type: 'UNNECESSARY_JSX_EXTENSION',
      severity: 'MEDIUM',
      description: 'File uses .tsx/.jsx extension but contains no JSX',
      suggestion: `Consider renaming to ${filePath.replace(/\.(tsx|jsx)$/, '.ts')}`
    };
    fileStats.incorrectExtensions++;
    fileStats.noJsxDetected++;
  } else {
    fileStats.correctExtensions++;
    if (hasJsxContent) {
      fileStats.jsxDetected++;
    } else {
      fileStats.noJsxDetected++;
    }
  }

  return result;
}

function scanDirectory(dir) {
  let results = [];
  
  if (!fs.existsSync(dir)) {
    console.warn(`⚠️  Directory not found: ${dir}`);
    return results;
  }
  
  try {
    const items = fs.readdirSync(dir, { withFileTypes: true });
    
    for (const item of items) {
      const fullPath = path.join(dir, item.name);
      
      if (EXCLUDED_PATHS.some(excluded => item.name.includes(excluded))) {
        continue;
      }
      
      if (item.isDirectory()) {
        results = results.concat(scanDirectory(fullPath));
      } else if (item.isFile()) {
        const result = analyzeFile(fullPath);
        if (result) {
          results.push(result);
        }
      }
    }
  } catch (error) {
    console.warn(`⚠️  Warning: Could not scan ${dir}: ${error.message}`);
  }
  
  return results;
}

function analyzeResults(results) {
  const issues = results.filter(r => r.issue);
  const byType = {};
  const bySeverity = { HIGH: [], MEDIUM: [], LOW: [] };
  
  issues.forEach(result => {
    const issue = result.issue;
    if (!byType[issue.type]) {
      byType[issue.type] = [];
    }
    byType[issue.type].push(result);
    bySeverity[issue.severity].push(result);
  });
  
  return { issues, byType, bySeverity };
}

function generateRenameCommands(issues) {
  const commands = [];
  
  issues.forEach(result => {
    if (result.issue?.type === 'MISSING_JSX_EXTENSION') {
      const oldPath = result.file;
      const newPath = oldPath.replace(/\.(ts|js)$/, '.tsx');
      commands.push({
        type: 'RENAME_TO_TSX',
        old: oldPath,
        new: newPath,
        command: `git mv "${oldPath}" "${newPath}"`
      });
    } else if (result.issue?.type === 'UNNECESSARY_JSX_EXTENSION') {
      const oldPath = result.file;
      const newPath = oldPath.replace(/\.(tsx|jsx)$/, '.ts');
      commands.push({
        type: 'RENAME_TO_TS',
        old: oldPath,
        new: newPath,
        command: `git mv "${oldPath}" "${newPath}"`
      });
    }
  });
  
  return commands;
}

function main() {
  console.log('📁 Scanning for JSX extension consistency...');
  
  const results = scanDirectory(FRONTEND_SRC);
  const analysis = analyzeResults(results);
  
  console.log(`📁 Files scanned: ${fileStats.totalScanned}\n`);
  
  console.log('📊 JSX Extension Validation Results:\n');
  
  console.log('📈 File Distribution:');
  console.log(`   ✅ Correct extensions: ${fileStats.correctExtensions}`);
  console.log(`   ❌ Incorrect extensions: ${fileStats.incorrectExtensions}`);
  console.log(`   📁 Total scanned: ${fileStats.totalScanned}\n`);
  
  console.log('🔍 Content Analysis:');
  console.log(`   🎯 Files with JSX content: ${fileStats.jsxDetected}`);
  console.log(`   📄 Files without JSX: ${fileStats.noJsxDetected}`);
  console.log(`   📊 Total files: ${fileStats.jsxDetected + fileStats.noJsxDetected}\n`);
  
  if (analysis.issues.length === 0) {
    console.log('✅ Perfect! All JSX extensions are correct!');
    console.log('🎯 Validation: PASSED');
    console.log('🚀 All files with JSX use .tsx/.jsx extensions correctly\n');
    return;
  }
  
  console.log(`🔍 Issues Overview:`);
  console.log(`   📊 Total issues: ${analysis.issues.length}`);
  console.log(`   ❌ High severity: ${analysis.bySeverity.HIGH.length}`);
  console.log(`   ⚠️  Medium severity: ${analysis.bySeverity.MEDIUM.length}`);
  console.log(`   💡 Low severity: ${analysis.bySeverity.LOW.length}\n`);
  
  // Report high severity issues
  if (analysis.bySeverity.HIGH.length > 0) {
    console.log('🚨 HIGH SEVERITY - Files with JSX content using wrong extensions:\n');
    
    const missingJsxExt = analysis.byType.MISSING_JSX_EXTENSION || [];
    if (missingJsxExt.length > 0) {
      console.log(`❌ MISSING_JSX_EXTENSION (${missingJsxExt.length} files):`);
      console.log(`   📝 Files contain JSX but use .ts/.js extension`);
      console.log(`   💡 These files must be renamed to .tsx extension`);
      
      missingJsxExt.slice(0, 10).forEach(result => {
        console.log(`      • ${result.file}`);
        console.log(`        🔧 ${result.issue.suggestion}`);
        
        // Show JSX evidence
        const highSeverityJsx = result.jsxOccurrences.filter(j => j.severity === 'HIGH');
        if (highSeverityJsx.length > 0) {
          console.log(`        🎯 JSX found: ${highSeverityJsx[0].description} on line ${highSeverityJsx[0].line}`);
        }
      });
      
      if (missingJsxExt.length > 10) {
        console.log(`      ... and ${missingJsxExt.length - 10} more files`);
      }
      console.log('');
    }
  }
  
  // Report medium severity issues
  if (analysis.bySeverity.MEDIUM.length > 0) {
    console.log('⚠️  MEDIUM SEVERITY - Optimization opportunities:\n');
    
    const unnecessaryJsxExt = analysis.byType.UNNECESSARY_JSX_EXTENSION || [];
    if (unnecessaryJsxExt.length > 0) {
      console.log(`⚠️  UNNECESSARY_JSX_EXTENSION (${unnecessaryJsxExt.length} files):`);
      console.log(`   📝 Files use .tsx/.jsx extension but contain no JSX`);
      console.log(`   💡 Consider renaming to .ts extension for consistency`);
      console.log(`   📁 Affected files: ${unnecessaryJsxExt.length}`);
      
      if (unnecessaryJsxExt.length <= 15) {
        unnecessaryJsxExt.forEach(result => {
          console.log(`      • ${result.file} → ${result.issue.suggestion.split(' ').pop()}`);
        });
      }
      console.log('');
    }
  }
  
  // Generate fix commands
  const renameCommands = generateRenameCommands(analysis.issues);
  
  if (renameCommands.length > 0) {
    console.log('🔧 AUTOMATED FIX COMMANDS:\n');
    
    const toTsx = renameCommands.filter(cmd => cmd.type === 'RENAME_TO_TSX');
    const toTs = renameCommands.filter(cmd => cmd.type === 'RENAME_TO_TS');
    
    if (toTsx.length > 0) {
      console.log(`🔥 HIGH PRIORITY - Rename to .tsx (${toTsx.length} files):`);
      toTsx.slice(0, 8).forEach(cmd => {
        console.log(`   ${cmd.command}`);
      });
      if (toTsx.length > 8) {
        console.log(`   ... and ${toTsx.length - 8} more rename commands`);
      }
      console.log('');
    }
    
    if (toTs.length > 0) {
      console.log(`⚠️  OPTIONAL - Rename to .ts (${toTs.length} files):`);
      toTs.slice(0, 5).forEach(cmd => {
        console.log(`   ${cmd.command}`);
      });
      if (toTs.length > 5) {
        console.log(`   ... and ${toTs.length - 5} more rename commands`);
      }
      console.log('');
    }
    
    console.log('💡 Run these commands in your terminal to fix the issues.');
    console.log('💡 After renaming, update any import statements that reference these files.\n');
  }
  
  // Summary recommendations
  console.log('🎯 RECOMMENDED ACTIONS:\n');
  
  if (analysis.bySeverity.HIGH.length > 0) {
    console.log('1. 🔥 CRITICAL: Fix high severity issues first');
    console.log('   📝 Files with JSX must use .tsx/.jsx extension');
    console.log('   🔧 Use the git mv commands above to rename files safely');
    console.log('   ⚠️  Update import statements after renaming');
    console.log('');
  }
  
  if (analysis.bySeverity.MEDIUM.length > 0) {
    console.log('2. ⚠️  OPTIONAL: Consider fixing medium severity issues');
    console.log('   📝 Unnecessary .tsx extensions can be simplified to .ts');
    console.log('   💡 This improves build performance and consistency');
    console.log('');
  }
  
  console.log(`🚨 Total issues: ${analysis.issues.length}`);
  console.log('❌ Validation: FAILED');
  console.log('💡 Focus on high severity issues to ensure proper JSX compilation.\n');
  
  process.exit(1);
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export {  
  analyzeFile, 
  detectJSXInContent, 
  scanDirectory,
  analyzeResults 
 }; 
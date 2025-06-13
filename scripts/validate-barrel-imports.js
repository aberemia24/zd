#!/usr/bin/env node

/**
 * Script: validate-barrel-imports.js
 * Validează că import-urile folosesc barrel files (index.ts) corect
 * Identifică import-uri directe care ar trebui să folosească barrel exports
 */

import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));

import fs from 'fs';
import path from 'path';

console.log('🔍 Validating barrel imports usage...\n');

// Paths to scan
const FRONTEND_SRC = path.join(__dirname, '../frontend/src');

// Directories with barrel files
const BARREL_DIRECTORIES = [
  'components/primitives',
  'components/features',
  'services/hooks',
  'utils',
  'stores',
  'types'
];

// Pattern pentru detectarea import-urilor directe care ar trebui să folosească barrel
const DIRECT_IMPORT_PATTERN = /import\s+.*from\s+['"]([^'"]+)['"];?/g;

function findBarrelFiles(baseDir) {
  const barrels = new Map();
  
  BARREL_DIRECTORIES.forEach(relativeDir => {
    const fullDir = path.join(baseDir, relativeDir);
    if (fs.existsSync(fullDir)) {
      scanForBarrels(fullDir, relativeDir, barrels);
    }
  });
  
  return barrels;
}

function scanForBarrels(dir, relativePath, barrels) {
  try {
    const items = fs.readdirSync(dir, { withFileTypes: true });
    
    // Check if current directory has index.ts
    const hasIndex = items.some(item => 
      item.isFile() && (item.name === 'index.ts' || item.name === 'index.tsx')
    );
    
    if (hasIndex) {
      barrels.set(relativePath, {
        path: relativePath,
        indexFile: path.join(dir, 'index.ts'),
        exports: getBarrelExports(path.join(dir, 'index.ts'))
      });
    }
    
    // Recurse into subdirectories
    for (const item of items) {
      if (item.isDirectory() && !item.name.startsWith('.')) {
        const subPath = path.join(relativePath, item.name);
        scanForBarrels(path.join(dir, item.name), subPath, barrels);
      }
    }
  } catch (error) {
    console.warn(`⚠️  Warning: Could not scan ${dir}: ${error.message}`);
  }
}

function getBarrelExports(indexPath) {
  if (!fs.existsSync(indexPath)) {
    return [];
  }
  
  try {
    const content = fs.readFileSync(indexPath, 'utf8');
    const exports = [];
    
    // Extract export patterns
    const exportPatterns = [
      /export\s*\*\s*from\s*['"]([^'"]+)['"]/g,
      /export\s*{[^}]+}\s*from\s*['"]([^'"]+)['"]/g,
      /export\s+(?:const|let|var|function|class|enum|interface|type)\s+([a-zA-Z_$][a-zA-Z0-9_$]*)/g
    ];
    
    exportPatterns.forEach(pattern => {
      let match;
      while ((match = pattern.exec(content)) !== null) {
        exports.push(match[1]);
      }
    });
    
    return exports;
  } catch (error) {
    return [];
  }
}

function analyzeImports(filePath, barrels) {
  if (!filePath.endsWith('.ts') && !filePath.endsWith('.tsx')) {
    return [];
  }
  
  // Skip barrel files themselves
  if (filePath.endsWith('/index.ts') || filePath.endsWith('/index.tsx')) {
    return [];
  }
  
  const content = fs.readFileSync(filePath, 'utf8');
  const issues = [];
  const lines = content.split('\n');
  
  lines.forEach((line, lineIndex) => {
    DIRECT_IMPORT_PATTERN.lastIndex = 0;
    let match;
    
    while ((match = DIRECT_IMPORT_PATTERN.exec(line)) !== null) {
      const importPath = match[1];
      
      // Skip external packages and absolute imports
      if (!importPath.startsWith('.') && !importPath.startsWith('/')) {
        continue;
      }
      
      // Skip @shared-constants imports
      if (importPath.includes('@shared-constants')) {
        continue;
      }
      
      // Check if this import could use a barrel
      const issue = checkForBarrelViolation(filePath, importPath, barrels);
      if (issue) {
        issues.push({
          ...issue,
          file: path.relative(process.cwd(), filePath),
          line: lineIndex + 1,
          importStatement: line.trim()
        });
      }
    }
  });
  
  return issues;
}

function checkForBarrelViolation(filePath, importPath, barrels) {
  // Resolve the absolute path of the import
  const fileDir = path.dirname(filePath);
  const resolvedImport = path.resolve(fileDir, importPath);
  const frontendSrcPath = path.resolve(__dirname, '../frontend/src');
  
  // Convert to relative path from src
  const relativePath = path.relative(frontendSrcPath, resolvedImport);
  
  // Check if any barrel directory contains this import
  for (const [barrelPath] of barrels) {
    if (relativePath.startsWith(barrelPath + '/')) {
      // This import is inside a barrel directory
      const expectedBarrelImport = './' + path.relative(fileDir, path.join(frontendSrcPath, barrelPath)).replace(/\\/g, '/');
      
      return {
        type: 'SHOULD_USE_BARREL',
        importPath,
        suggestedBarrel: expectedBarrelImport,
        barrelPath
      };
    }
  }
  
  return null;
}

function scanDirectory(dir, barrels) {
  let allIssues = [];
  
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
        allIssues = allIssues.concat(scanDirectory(fullPath, barrels));
      } else if (item.isFile()) {
        allIssues = allIssues.concat(analyzeImports(fullPath, barrels));
      }
    }
  } catch (error) {
    console.warn(`⚠️  Warning: Could not scan ${dir}: ${error.message}`);
  }
  
  return allIssues;
}

function main() {
  console.log('📋 Finding barrel files...');
  const barrels = findBarrelFiles(FRONTEND_SRC);
  
  console.log(`📊 Found ${barrels.size} barrel files:`);
  for (const path of barrels.keys()) {
    console.log(`   ${path}/index.ts`);
  }
  
  console.log('\n🔍 Scanning for import violations...');
  const issues = scanDirectory(FRONTEND_SRC, barrels);
  
  if (issues.length === 0) {
    console.log('\n✅ All imports are using barrel files correctly!');
    console.log('🎯 Barrel imports validation: PASSED');
    return;
  }
  
  console.log(`\n❌ Found ${issues.length} import violations:`);
  
  // Group by type
  const shouldUseBarrel = issues.filter(i => i.type === 'SHOULD_USE_BARREL');
  
  if (shouldUseBarrel.length > 0) {
    console.log('\n🔄 SHOULD USE BARREL - Direct imports that could use barrel:');
    shouldUseBarrel.forEach(issue => {
      console.log(`   ${issue.file}:${issue.line}`);
      console.log(`     Current: ${issue.importPath}`);
      console.log(`     Suggested: ${issue.suggestedBarrel}`);
      console.log(`     (Uses barrel from ${issue.barrelPath})`);
      console.log('');
    });
  }
  
  console.log('💡 Fix these by updating imports to use barrel files for better maintainability');
  console.log('❌ Barrel imports validation: FAILED');
  process.exit(1);
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export {  
  findBarrelFiles,
  analyzeImports,
  checkForBarrelViolation 
 }; 
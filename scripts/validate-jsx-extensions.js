#!/usr/bin/env node

/**
 * Script: validate-jsx-extensions.js
 * Detectează fișiere .ts care conțin JSX și trebuie să fie .tsx
 * conform regulilor din code-standards.mdc
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Validating JSX file extensions...\n');

// Paths to scan
const FRONTEND_SRC = path.join(__dirname, '../frontend/src');

// JSX patterns to detect (excluding TypeScript generics)
const JSX_PATTERNS = [
  /return\s*\(?\s*<[A-Z][a-zA-Z]*[\s>]/m,        // return (<Component> or return <Component
  /return\s*<[A-Z][a-zA-Z]*[\s>]/m,              // return <Component
  /=\s*<[A-Z][a-zA-Z]*[\s>]/m,                   // = <Component
  />\s*<[A-Z][a-zA-Z]*[\s>]/m,                   // > <Component (nested JSX)
  /jsx\s*:\s*true/i,                             // jsx: true (pragma)
  /React\.createElement/,                         // React.createElement calls
  /\.createElement\(/,                            // createElement calls
  /<\/[A-Z][a-zA-Z]*>/,                          // Closing JSX tags </Component>
  /<[A-Z][a-zA-Z]*\s+[a-zA-Z]+=/,                // JSX with props <Component prop=
];

// Hook patterns that might return JSX
const HOOK_JSX_PATTERNS = [
  /export\s+function\s+use[A-Z]\w*.*return\s*\(?\s*</m,  // export function useHook() { return <
  /const\s+use[A-Z]\w*\s*=.*=>\s*\(?\s*</m,              // const useHook = () => <
];

function shouldExcludeFile(filePath) {
  const relativePath = path.relative(FRONTEND_SRC, filePath);
  
  // Exclude test files, node_modules, dist
  const excludedPaths = [
    'node_modules', 'dist', 'coverage', '.git',
    'test', 'tests', '__tests__', 'spec'
  ];
  
  return excludedPaths.some(excluded => 
    relativePath.includes(excluded) || 
    relativePath.includes(`/${excluded}/`) ||
    relativePath.includes(`\\${excluded}\\`) ||
    relativePath.includes('.test.') ||
    relativePath.includes('.spec.')
  );
}

function detectJSXInFile(filePath) {
  if (!filePath.endsWith('.ts')) {
    return null; // Only check .ts files
  }
  
  if (shouldExcludeFile(filePath)) {
    return null;
  }

  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n');
  
  const jsxDetections = [];
  
  // Check each line for JSX patterns
  lines.forEach((line, lineIndex) => {
    // Skip comments
    const trimmedLine = line.trim();
    if (trimmedLine.startsWith('//') || trimmedLine.startsWith('*') || trimmedLine.startsWith('/*')) {
      return;
    }
    
    // Check for JSX patterns (skip TypeScript generics)
    JSX_PATTERNS.forEach((pattern, patternIndex) => {
      if (pattern.test(line)) {
        // Skip TypeScript generics like <T extends any[]>
        if (line.includes('extends') && line.includes('<') && line.includes('>')) {
          return;
        }
        // Skip function generics like function name<T>()
        if (/function\s+\w+\s*<[A-Z]/.test(line) || /const\s+\w+\s*=\s*<[A-Z]/.test(line)) {
          return;
        }
        
        jsxDetections.push({
          line: lineIndex + 1,
          content: line.trim(),
          pattern: `JSX_PATTERN_${patternIndex + 1}`,
          type: 'JSX_SYNTAX'
        });
      }
    });
    
    // Check for hook patterns that return JSX
    HOOK_JSX_PATTERNS.forEach((pattern, patternIndex) => {
      if (pattern.test(line)) {
        jsxDetections.push({
          line: lineIndex + 1,
          content: line.trim(),
          pattern: `HOOK_JSX_PATTERN_${patternIndex + 1}`,
          type: 'HOOK_RETURNING_JSX'
        });
      }
    });
  });
  
  if (jsxDetections.length > 0) {
    return {
      file: path.relative(process.cwd(), filePath),
      suggestedName: filePath.replace('.ts', '.tsx'),
      detections: jsxDetections
    };
  }
  
  return null;
}

function scanDirectory(dir) {
  let allIssues = [];
  
  try {
    const items = fs.readdirSync(dir, { withFileTypes: true });
    
    for (const item of items) {
      const fullPath = path.join(dir, item.name);
      
      // Skip excluded directories
      if (item.name.startsWith('.') || 
          item.name === 'node_modules' || 
          item.name === 'dist' || 
          item.name === 'coverage') {
        continue;
      }
      
      if (item.isDirectory()) {
        allIssues = allIssues.concat(scanDirectory(fullPath));
      } else if (item.isFile()) {
        const issue = detectJSXInFile(fullPath);
        if (issue) {
          allIssues.push(issue);
        }
      }
    }
  } catch (error) {
    console.warn(`⚠️  Warning: Could not scan ${dir}: ${error.message}`);
  }
  
  return allIssues;
}

function generateFixCommands(issues) {
  const commands = [];
  
  issues.forEach(issue => {
    const oldPath = issue.file;
    const newPath = issue.suggestedName.replace(process.cwd() + path.sep, '');
    
    // Git move command to preserve history
    commands.push(`git mv "${oldPath}" "${newPath}"`);
  });
  
  return commands;
}

function main() {
  console.log('🔍 Scanning for .ts files containing JSX...\n');
  
  const issues = scanDirectory(FRONTEND_SRC);
  
  if (issues.length === 0) {
    console.log('✅ All files with JSX have correct .tsx extensions!');
    console.log('🎯 JSX extension validation: PASSED');
    console.log('📁 File extension compliance: EXCELLENT\n');
    return;
  }
  
  console.log(`❌ Found ${issues.length} .ts files containing JSX that should be .tsx:\n`);
  
  // Report each file with details
  issues.forEach((issue, index) => {
    console.log(`${index + 1}. 📄 ${issue.file}`);
    console.log(`   → Should be: ${path.basename(issue.suggestedName)}`);
    console.log(`   🔍 JSX detected in ${issue.detections.length} location(s):`);
    
    issue.detections.slice(0, 3).forEach(detection => {
      console.log(`     Line ${detection.line}: ${detection.content}`);
      console.log(`     Type: ${detection.type}`);
    });
    
    if (issue.detections.length > 3) {
      console.log(`     ... and ${issue.detections.length - 3} more JSX patterns`);
    }
    console.log('');
  });
  
  // Generate fix commands
  const fixCommands = generateFixCommands(issues);
  console.log('🛠️  SUGGESTED FIX COMMANDS:');
  console.log('   Run these git commands to preserve file history:\n');
  
  fixCommands.forEach(cmd => {
    console.log(`   ${cmd}`);
  });
  
  console.log('\n💡 WHY THIS MATTERS:');
  console.log('   • TypeScript requires .tsx for JSX syntax');
  console.log('   • Build tools depend on correct extensions');
  console.log('   • Code-standards.mdc rule enforcement');
  console.log('   • IDE and tooling work better with correct extensions');
  
  console.log('\n❌ JSX extension validation: FAILED');
  console.log('🚨 Fix file extensions before production deployment');
  process.exit(1);
}

if (require.main === module) {
  main();
}

module.exports = { 
  detectJSXInFile, 
  scanDirectory, 
  generateFixCommands 
}; 
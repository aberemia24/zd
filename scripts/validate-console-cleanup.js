#!/usr/bin/env node

/**
 * Script: validate-console-cleanup.js
 * Detectează și raportează console.log, console.debug și alte statement-uri de debug
 * care trebuie eliminate înainte de production conform regulilor proiectului
 */

import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));

import fs from 'fs';
import path from 'path';

console.log('🔍 Validating console statements cleanup...\n');

// Paths to scan
const FRONTEND_SRC = path.join(__dirname, '../frontend/src');

// Console patterns to detect (excluding error/warn for prod)
const CONSOLE_PATTERNS = [
  {
    pattern: /console\.log\s*\(/g,
    type: 'DEBUG',
    severity: 'HIGH',
    description: 'console.log() statements'
  },
  {
    pattern: /console\.debug\s*\(/g,
    type: 'DEBUG', 
    severity: 'HIGH',
    description: 'console.debug() statements'
  },
  {
    pattern: /console\.info\s*\(/g,
    type: 'INFO',
    severity: 'MEDIUM',
    description: 'console.info() statements'
  },
  {
    pattern: /console\.trace\s*\(/g,
    type: 'DEBUG',
    severity: 'HIGH', 
    description: 'console.trace() statements'
  },
  {
    pattern: /console\.time\s*\(/g,
    type: 'PERFORMANCE',
    severity: 'MEDIUM',
    description: 'console.time() statements'
  },
  {
    pattern: /console\.timeEnd\s*\(/g,
    type: 'PERFORMANCE',
    severity: 'MEDIUM',
    description: 'console.timeEnd() statements'
  }
];

// Paths to exclude (test files, debug utilities, etc.)
const EXCLUDED_PATHS = [
  'test', 'tests', '__tests__', 
  'spec', 'debug', 'storybook',
  '.test.', '.spec.', '.debug.'
];

function shouldExcludeFile(filePath) {
  const relativePath = path.relative(FRONTEND_SRC, filePath);
  
  return EXCLUDED_PATHS.some(excluded => 
    relativePath.includes(excluded) || 
    relativePath.includes(`/${excluded}/`) ||
    relativePath.includes(`\\${excluded}\\`)
  );
}

function scanFileForConsole(filePath) {
  if (!filePath.endsWith('.ts') && !filePath.endsWith('.tsx')) {
    return [];
  }
  
  // Skip test files and debug utilities
  if (shouldExcludeFile(filePath)) {
    return [];
  }

  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n');
  const issues = [];

  lines.forEach((line, lineIndex) => {
    // Skip commented lines
    const trimmedLine = line.trim();
    if (trimmedLine.startsWith('//') || trimmedLine.startsWith('*') || trimmedLine.startsWith('/*')) {
      return;
    }

    CONSOLE_PATTERNS.forEach(patternInfo => {
      patternInfo.pattern.lastIndex = 0; // Reset regex
      const matches = line.match(patternInfo.pattern);
      
      if (matches) {
        matches.forEach(match => {
          issues.push({
            file: path.relative(process.cwd(), filePath),
            line: lineIndex + 1,
            statement: match,
            lineContent: line.trim(),
            type: patternInfo.type,
            severity: patternInfo.severity,
            description: patternInfo.description
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
      if (item.name.startsWith('.') || 
          item.name === 'node_modules' || 
          item.name === 'dist' || 
          item.name === 'coverage') {
        continue;
      }
      
      if (item.isDirectory()) {
        allIssues = allIssues.concat(scanDirectory(fullPath));
      } else if (item.isFile()) {
        allIssues = allIssues.concat(scanFileForConsole(fullPath));
      }
    }
  } catch (error) {
    console.warn(`⚠️  Warning: Could not scan ${dir}: ${error.message}`);
  }
  
  return allIssues;
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
  
  return { bySeverity, byType };
}

function generateCleanupCommands(issues) {
  const commands = [];
  
  // Group by file for efficient cleanup
  const byFile = {};
  issues.forEach(issue => {
    if (!byFile[issue.file]) byFile[issue.file] = [];
    byFile[issue.file].push(issue);
  });
  
  Object.keys(byFile).forEach(file => {
    const fileIssues = byFile[file];
    commands.push({
      file,
      issueCount: fileIssues.length,
      command: `# Manual cleanup needed in ${file} (${fileIssues.length} statements)`
    });
  });
  
  return commands;
}

function main() {
  console.log('🔍 Scanning for console statements in production code...\n');
  
  const issues = scanDirectory(FRONTEND_SRC);
  
  if (issues.length === 0) {
    console.log('✅ No console statements found in production code!');
    console.log('🎯 Console cleanup validation: PASSED');
    console.log('🚀 Code is ready for production deployment\n');
    return;
  }
  
  const analysis = analyzeIssues(issues);
  
  console.log(`❌ Found ${issues.length} console statements in production code:\n`);
  
  // Report by severity
  if (analysis.bySeverity.HIGH.length > 0) {
    console.log(`🚨 HIGH PRIORITY (${analysis.bySeverity.HIGH.length}):`);
    analysis.bySeverity.HIGH.slice(0, 10).forEach(issue => {
      console.log(`   ${issue.file}:${issue.line} - ${issue.statement}`);
      console.log(`     ${issue.lineContent}`);
    });
    if (analysis.bySeverity.HIGH.length > 10) {
      console.log(`     ... and ${analysis.bySeverity.HIGH.length - 10} more high priority items`);
    }
    console.log('');
  }
  
  if (analysis.bySeverity.MEDIUM.length > 0) {
    console.log(`⚠️  MEDIUM PRIORITY (${analysis.bySeverity.MEDIUM.length}):`);
    analysis.bySeverity.MEDIUM.slice(0, 5).forEach(issue => {
      console.log(`   ${issue.file}:${issue.line} - ${issue.statement}`);
    });
    if (analysis.bySeverity.MEDIUM.length > 5) {
      console.log(`     ... and ${analysis.bySeverity.MEDIUM.length - 5} more medium priority items`);
    }
    console.log('');
  }
  
  // Summary by type
  console.log('📊 BREAKDOWN BY TYPE:');
  Object.keys(analysis.byType).forEach(type => {
    console.log(`   ${type}: ${analysis.byType[type].length} statements`);
  });
  
  // Cleanup suggestions
  console.log('\n💡 CLEANUP SUGGESTIONS:');
  console.log('   1. Remove console.log() statements used for debugging');
  console.log('   2. Replace console.info() with proper logging if needed');
  console.log('   3. Remove console.time/timeEnd performance debugging');
  console.log('   4. Keep console.error() and console.warn() for production errors');
  
  const cleanupCommands = generateCleanupCommands(issues);
  if (cleanupCommands.length <= 5) {
    console.log('\n🛠️  FILES TO CLEAN:');
    cleanupCommands.forEach(cmd => {
      console.log(`   ${cmd.command}`);
    });
  } else {
    console.log(`\n🛠️  FILES TO CLEAN: ${cleanupCommands.length} files need manual cleanup`);
  }
  
  console.log('\n❌ Console cleanup validation: FAILED');
  console.log('🚨 Production deployment NOT recommended with console statements');
  process.exit(1);
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export {  
  scanFileForConsole, 
  scanDirectory, 
  analyzeIssues,
  shouldExcludeFile 
 }; 
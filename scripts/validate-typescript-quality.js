#!/usr/bin/env node

/**
 * Script: validate-typescript-quality.js
 * Validează calitatea TypeScript: any/unknown usage, type assertions, explicit typing
 * conform regulilor din code-standards.mdc
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Validating TypeScript code quality...\n');

// Paths to scan
const FRONTEND_SRC = path.join(__dirname, '../frontend/src');

// TypeScript quality patterns to detect
const TS_QUALITY_PATTERNS = [
  {
    pattern: /:\s*any\b/g,
    type: 'ANY_USAGE',
    severity: 'HIGH',
    description: 'Explicit any type usage',
    suggestion: 'Use specific types instead of any'
  },
  {
    pattern: /:\s*unknown\b/g,
    type: 'UNKNOWN_USAGE', 
    severity: 'MEDIUM',
    description: 'Unknown type usage (consider specific types)',
    suggestion: 'Use more specific types when possible'
  },
  {
    pattern: /as\s+any\b/g,
    type: 'TYPE_ASSERTION_ANY',
    severity: 'HIGH',
    description: 'Type assertion to any',
    suggestion: 'Avoid type assertions to any, use proper typing'
  },
  {
    pattern: /as\s+\w+(?:\[\])?(?:\s*\|\s*\w+(?:\[\])?)*(?!\s*;)/g,
    type: 'TYPE_ASSERTION',
    severity: 'MEDIUM', 
    description: 'Type assertion usage',
    suggestion: 'Consider proper typing instead of type assertions'
  },
  {
    pattern: /\/\/\s*@ts-ignore/g,
    type: 'TS_IGNORE',
    severity: 'HIGH',
    description: 'TypeScript ignore comment',
    suggestion: 'Fix the TypeScript error instead of ignoring it'
  },
  {
    pattern: /\/\/\s*@ts-expect-error/g,
    type: 'TS_EXPECT_ERROR',
    severity: 'LOW',
    description: 'TypeScript expect error comment',
    suggestion: 'Consider if this is still needed'
  },
  {
    pattern: /\bFunction\b(?!\()/g,
    type: 'FUNCTION_TYPE',
    severity: 'MEDIUM',
    description: 'Generic Function type usage',
    suggestion: 'Use specific function signatures instead of Function'
  },
  {
    pattern: /\bObject\b(?!\.|\.)/g,
    type: 'OBJECT_TYPE',
    severity: 'MEDIUM',
    description: 'Generic Object type usage', 
    suggestion: 'Use specific object interfaces instead of Object'
  }
];

// Props without explicit types (heuristic)
const UNTYPED_PROPS_PATTERNS = [
  {
    pattern: /const\s+\w+\s*=\s*\(\s*{\s*\w+\s*}\s*\)/g,
    type: 'UNTYPED_DESTRUCTURED_PROPS',
    severity: 'MEDIUM',
    description: 'Destructured props without explicit typing',
    suggestion: 'Add explicit interface for props'
  },
  {
    pattern: /function\s+\w+\s*\(\s*props\s*\)/g,
    type: 'UNTYPED_PROPS_PARAM',
    severity: 'MEDIUM', 
    description: 'Props parameter without explicit typing',
    suggestion: 'Add explicit interface for props parameter'
  }
];

function shouldExcludeFile(filePath) {
  const relativePath = path.relative(FRONTEND_SRC, filePath);
  
  // Include only TypeScript files, exclude test files and generated files
  if (!filePath.endsWith('.ts') && !filePath.endsWith('.tsx')) {
    return true;
  }
  
  const excludedPaths = [
    'node_modules', 'dist', 'coverage', '.git',
    'test', 'tests', '__tests__', 'spec',
    '.d.ts', 'vite-env.d.ts', 'generated'
  ];
  
  return excludedPaths.some(excluded => 
    relativePath.includes(excluded) || 
    relativePath.includes(`/${excluded}/`) ||
    relativePath.includes(`\\${excluded}\\`) ||
    relativePath.includes('.test.') ||
    relativePath.includes('.spec.') ||
    relativePath.endsWith('.d.ts')
  );
}

function analyzeTypeScriptQuality(filePath) {
  if (shouldExcludeFile(filePath)) {
    return [];
  }

  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n');
  const issues = [];

  lines.forEach((line, lineIndex) => {
    // Skip comments and strings
    const trimmedLine = line.trim();
    if (trimmedLine.startsWith('//') || trimmedLine.startsWith('*') || trimmedLine.startsWith('/*')) {
      return;
    }

    // Check TypeScript quality patterns
    [...TS_QUALITY_PATTERNS, ...UNTYPED_PROPS_PATTERNS].forEach(patternInfo => {
      patternInfo.pattern.lastIndex = 0; // Reset regex
      const matches = line.match(patternInfo.pattern);
      
      if (matches) {
        matches.forEach(match => {
          issues.push({
            file: path.relative(process.cwd(), filePath),
            line: lineIndex + 1,
            match: match.trim(),
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
        allIssues = allIssues.concat(analyzeTypeScriptQuality(fullPath));
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

function main() {
  console.log('🔍 Scanning TypeScript quality in production code...\n');
  
  const issues = scanDirectory(FRONTEND_SRC);
  
  if (issues.length === 0) {
    console.log('✅ Excellent TypeScript code quality!');
    console.log('🎯 TypeScript quality validation: PASSED');
    console.log('🚀 Code follows all type safety best practices\n');
    return;
  }
  
  const analysis = analyzeIssues(issues);
  
  console.log(`⚠️  Found ${issues.length} TypeScript quality issues:\n`);
  
  // Report by severity
  if (analysis.bySeverity.HIGH.length > 0) {
    console.log(`🚨 HIGH PRIORITY (${analysis.bySeverity.HIGH.length}):`);
    analysis.bySeverity.HIGH.slice(0, 10).forEach(issue => {
      console.log(`   ${issue.file}:${issue.line} - ${issue.match}`);
      console.log(`     ${issue.description}`);
      console.log(`     💡 ${issue.suggestion}`);
    });
    if (analysis.bySeverity.HIGH.length > 10) {
      console.log(`     ... and ${analysis.bySeverity.HIGH.length - 10} more high priority items`);
    }
    console.log('');
  }
  
  if (analysis.bySeverity.MEDIUM.length > 0) {
    console.log(`⚠️  MEDIUM PRIORITY (${analysis.bySeverity.MEDIUM.length}):`);
    analysis.bySeverity.MEDIUM.slice(0, 5).forEach(issue => {
      console.log(`   ${issue.file}:${issue.line} - ${issue.match}`);
      console.log(`     💡 ${issue.suggestion}`);
    });
    if (analysis.bySeverity.MEDIUM.length > 5) {
      console.log(`     ... and ${analysis.bySeverity.MEDIUM.length - 5} more medium priority items`);
    }
    console.log('');
  }
  
  // Summary by type
  console.log('📊 BREAKDOWN BY TYPE:');
  Object.keys(analysis.byType).forEach(type => {
    console.log(`   ${type}: ${analysis.byType[type].length} occurrences`);
  });
  
  // Best practices reminder
  console.log('\n💡 TYPESCRIPT BEST PRACTICES:');
  console.log('   1. Use specific types instead of any/unknown');
  console.log('   2. Avoid type assertions when possible');
  console.log('   3. Define explicit interfaces for props');
  console.log('   4. Fix TypeScript errors instead of ignoring them');
  console.log('   5. Use specific function/object types');
  
  // Determine pass/fail
  const criticalIssues = analysis.bySeverity.HIGH.length;
  
  if (criticalIssues === 0) {
    console.log('\n✅ TypeScript quality validation: PASSED');
    console.log('🎯 Only minor improvements suggested');
  } else {
    console.log('\n❌ TypeScript quality validation: FAILED');
    console.log(`🚨 ${criticalIssues} critical type safety issues need attention`);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = { 
  analyzeTypeScriptQuality, 
  scanDirectory, 
  analyzeIssues 
}; 
#!/usr/bin/env node

/**
 * Script: validate-typescript-quality.js
 * Validează calitatea TypeScript: any/unknown usage, type assertions, explicit typing
 * conform regulilor din code-standards.mdc
 */

import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));

import fs from 'fs';
import path from 'path';

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
    suggestion: 'Use specific types instead of any',
    category: 'Type Safety'
  },
  {
    pattern: /:\s*unknown\b/g,
    type: 'UNKNOWN_USAGE', 
    severity: 'MEDIUM',
    description: 'Unknown type usage (consider specific types)',
    suggestion: 'Use more specific types when possible',
    category: 'Type Specificity'
  },
  {
    pattern: /as\s+any\b/g,
    type: 'TYPE_ASSERTION_ANY',
    severity: 'HIGH',
    description: 'Type assertion to any',
    suggestion: 'Avoid type assertions to any, use proper typing',
    category: 'Type Safety'
  },
  {
    pattern: /as\s+\w+(?:\[\])?(?:\s*\|\s*\w+(?:\[\])?)*(?!\s*;)/g,
    type: 'TYPE_ASSERTION',
    severity: 'MEDIUM', 
    description: 'Type assertion usage',
    suggestion: 'Consider proper typing instead of type assertions',
    category: 'Type Assertions'
  },
  {
    pattern: /\/\/\s*@ts-ignore/g,
    type: 'TS_IGNORE',
    severity: 'HIGH',
    description: 'TypeScript ignore comment',
    suggestion: 'Fix the TypeScript error instead of ignoring it',
    category: 'Error Suppression'
  },
  {
    pattern: /\/\/\s*@ts-expect-error/g,
    type: 'TS_EXPECT_ERROR',
    severity: 'LOW',
    description: 'TypeScript expect error comment',
    suggestion: 'Consider if this is still needed',
    category: 'Error Suppression'
  },
  {
    pattern: /\bFunction\b(?!\()/g,
    type: 'FUNCTION_TYPE',
    severity: 'MEDIUM',
    description: 'Generic Function type usage',
    suggestion: 'Use specific function signatures instead of Function',
    category: 'Generic Types'
  },
  {
    pattern: /\bObject\b(?!\.|\.)/g,
    type: 'OBJECT_TYPE',
    severity: 'MEDIUM',
    description: 'Generic Object type usage', 
    suggestion: 'Use specific object interfaces instead of Object',
    category: 'Generic Types'
  }
];

// Props without explicit types (heuristic)
const UNTYPED_PROPS_PATTERNS = [
  {
    pattern: /const\s+\w+\s*=\s*\(\s*{\s*\w+\s*}\s*\)/g,
    type: 'UNTYPED_DESTRUCTURED_PROPS',
    severity: 'MEDIUM',
    description: 'Destructured props without explicit typing',
    suggestion: 'Add explicit interface for props',
    category: 'Props Typing'
  },
  {
    pattern: /function\s+\w+\s*\(\s*props\s*\)/g,
    type: 'UNTYPED_PROPS_PARAM',
    severity: 'MEDIUM', 
    description: 'Props parameter without explicit typing',
    suggestion: 'Add explicit interface for props parameter',
    category: 'Props Typing'
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

function shouldExcludeAnyTypes(filePath, issue) {
  // Skip 'any' type checking for acceptable permanent files
  if (issue.type === 'ANY_USAGE' || issue.type === 'TYPE_ASSERTION_ANY') {
    const relativePath = path.relative(FRONTEND_SRC, filePath);
    
    // 🟢 ACCEPTABLE PERMANENT - External library integrations
    const chartFiles = [
      'components/primitives/Charts/BarChart.tsx', 
      'components/primitives/Charts/LineChart.tsx', 
      'components/primitives/Charts/PieChart.tsx'
    ];
    if (chartFiles.some(chart => relativePath.includes(chart))) {
      return true;
    }
    
    // 🟢 ACCEPTABLE PERMANENT - Generic utility functions  
    const utilityFiles = [
      'utils/financial.tsx',  // debounce/throttle generic functions
      'utils/lazyExportUtils.tsx'  // export utilities with generic data
    ];
    if (utilityFiles.some(util => relativePath.includes(util))) {
      return true;
    }
    
    // 🟢 ACCEPTABLE PERMANENT - Test files and edge cases
    if (relativePath.includes('.test.') || relativePath.includes('.spec.') || 
        relativePath.includes('__tests__') || relativePath.includes('/test/')) {
      return true;
    }
  }
  
  return false;
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
          const issue = {
            file: path.relative(process.cwd(), filePath),
            line: lineIndex + 1,
            match: match.trim(),
            lineContent: line.trim(),
            type: patternInfo.type,
            severity: patternInfo.severity,
            description: patternInfo.description,
            suggestion: patternInfo.suggestion,
            category: patternInfo.category
          };
          
          // Skip if this is an acceptable 'any' type usage
          if (!shouldExcludeAnyTypes(filePath, issue)) {
            issues.push(issue);
          }
        });
      }
    });
  });

  return issues;
}

function scanDirectory(dir) {
  let allIssues = [];
  let fileCount = 0;
  let scannedFiles = [];
  
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
        const dirResults = scanDirectory(fullPath);
        allIssues = allIssues.concat(dirResults.issues);
        fileCount += dirResults.fileCount;
        scannedFiles = scannedFiles.concat(dirResults.scannedFiles);
      } else if (item.isFile() && !shouldExcludeFile(fullPath)) {
        const issues = analyzeTypeScriptQuality(fullPath);
        allIssues = allIssues.concat(issues);
        fileCount++;
        scannedFiles.push(path.relative(process.cwd(), fullPath));
      }
    }
  } catch (error) {
    console.warn(`⚠️  Warning: Could not scan ${dir}: ${error.message}`);
  }
  
  return { issues: allIssues, fileCount, scannedFiles };
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
  });
  
  return { bySeverity, byType, byCategory, byFile };
}

function displayStatistics(analysis, fileCount, scannedFiles) {
  const totalIssues = Object.values(analysis.bySeverity).flat().length;
  const filesWithIssues = Object.keys(analysis.byFile).length;
  
  console.log('📊 TYPESCRIPT QUALITY STATISTICS');
  console.log('=' .repeat(50));
  console.log(`📁 Files Scanned: ${fileCount}`);
  console.log(`🔍 TypeScript/React Files: ${scannedFiles.filter(f => f.endsWith('.ts') || f.endsWith('.tsx')).length}`);
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
}

function displayTopIssues(analysis) {
  console.log('🔍 TOP TYPESCRIPT QUALITY ISSUES');
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
  console.log('💡 TYPESCRIPT QUALITY RECOMMENDATIONS');
  console.log('='.repeat(50));
  
  const recommendations = [];
  
  if (analysis.bySeverity.HIGH.length > 0) {
    recommendations.push('🔥 CRITICAL: Fix high-priority type safety issues immediately');
    recommendations.push('   • Replace any types with specific interfaces');
    recommendations.push('   • Remove @ts-ignore comments and fix underlying issues');
    recommendations.push('   • Avoid type assertions to any');
  }
  
  if (analysis.byCategory['Props Typing']?.length > 0) {
    recommendations.push('⚠️  PROPS: Add explicit TypeScript interfaces for component props');
    recommendations.push('   • Create interfaces for all component props');
    recommendations.push('   • Use destructuring with proper typing');
  }
  
  if (analysis.byCategory['Generic Types']?.length > 0) {
    recommendations.push('📝 TYPES: Replace generic types with specific ones');
    recommendations.push('   • Use specific function signatures instead of Function');
    recommendations.push('   • Create interfaces instead of using Object');
  }
  
  if (analysis.byCategory['Type Assertions']?.length > 0) {
    recommendations.push('🎯 ASSERTIONS: Minimize type assertions');
    recommendations.push('   • Use proper typing instead of type casting');
    recommendations.push('   • Add runtime validation where necessary');
  }
  
  recommendations.push('');
  recommendations.push('📚 BEST PRACTICES:');
  recommendations.push('   1. Define explicit interfaces for all props and complex objects');
  recommendations.push('   2. Use type guards for runtime type checking');
  recommendations.push('   3. Prefer unknown over any for better type safety');
  recommendations.push('   4. Use utility types (Pick, Omit, Partial) for type composition');
  recommendations.push('   5. Enable strict TypeScript compiler options');
  
  recommendations.forEach(rec => console.log(rec));
  console.log('');
}

function main() {
  console.log('🔍 TYPESCRIPT QUALITY VALIDATION');
  console.log('='.repeat(50));
  console.log('Scanning TypeScript code for type safety and quality issues...\n');
  
  const scanResults = scanDirectory(FRONTEND_SRC);
  const { issues, fileCount, scannedFiles } = scanResults;
  
  if (issues.length === 0) {
    console.log('✅ EXCELLENT TYPESCRIPT CODE QUALITY!');
    console.log('='.repeat(50));
    console.log('🎯 TypeScript quality validation: PASSED');
    console.log('🚀 Code follows all type safety best practices');
    console.log(`📁 Scanned ${fileCount} TypeScript files`);
    console.log('');
    return;
  }
  
  const analysis = analyzeIssues(issues);
  
  // Display comprehensive analysis
  displayStatistics(analysis, fileCount, scannedFiles);
  displaySeverityBreakdown(analysis);
  displayCategoryAnalysis(analysis);
  displayTopIssues(analysis);
  displayRecommendations(analysis);
  
  // Final validation result
  const criticalIssues = analysis.bySeverity.HIGH.length;
  
  console.log('📋 TYPESCRIPT QUALITY SUMMARY');
  console.log('='.repeat(50));
  
  if (criticalIssues === 0) {
    console.log('✅ TypeScript quality validation: PASSED');
    console.log('🎯 Only minor improvements suggested');
    console.log(`📊 Found ${issues.length} issues (${analysis.bySeverity.MEDIUM.length} medium, ${analysis.bySeverity.LOW.length} low priority)`);
  } else {
    console.log('❌ TypeScript quality validation: FAILED');
    console.log(`🚨 ${criticalIssues} critical type safety issues need immediate attention`);
    console.log(`📊 Total issues: ${issues.length} across ${Object.keys(analysis.byFile).length} files`);
    process.exit(1);
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export {  
  analyzeTypeScriptQuality, 
  scanDirectory, 
  analyzeIssues 
 }; 
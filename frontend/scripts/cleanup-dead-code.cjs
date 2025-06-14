const fs = require('fs');
const path = require('path');

// TypeScript and TSX file extensions
const TS_EXTENSIONS = ['.ts', '.tsx'];

// Get all TypeScript files
function getAllTSFiles(dir = 'src') {
  const files = [];

  function traverse(currentDir) {
    const entries = fs.readdirSync(currentDir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(currentDir, entry.name);

      if (entry.isDirectory()) {
        // Skip node_modules, dist, coverage etc.
        if (!['node_modules', 'dist', 'coverage', '.git'].includes(entry.name)) {
          traverse(fullPath);
        }
      } else if (TS_EXTENSIONS.includes(path.extname(entry.name))) {
        files.push(fullPath);
      }
    }
  }

  traverse(dir);
  return files;
}

// Analyze unused imports in a file
function analyzeUnusedImports(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n');
  const unusedImports = [];

  lines.forEach((line, lineIndex) => {
    const trimmedLine = line.trim();

    // Skip if not an import line or is a type-only import
    if (!trimmedLine.startsWith('import') || trimmedLine.includes('import type')) {
      return;
    }

    // Handle named imports: import { a, b, c } from 'module'
    const namedImportMatch = line.match(/import\s+\{([^}]+)\}\s+from/);
    if (namedImportMatch) {
      const imports = namedImportMatch[1]
        .split(',')
        .map(imp => imp.trim())
        .filter(imp => imp && !imp.includes('type ')); // Skip type imports

      const lineImports = [];

      imports.forEach(importName => {
        // Clean import name (remove 'as' aliases)
        const cleanName = importName.split(' as ')[0].trim();

        // Check if used in file (excluding import lines)
        const codeContent = lines
          .filter((_, idx) => idx !== lineIndex && !lines[idx].trim().startsWith('import'))
          .join('\n');

        const usageRegex = new RegExp(`\\b${cleanName}\\b`);
        if (!usageRegex.test(codeContent)) {
          lineImports.push({
            import: importName,
            line: lineIndex + 1,
            cleanName
          });
        }
      });

      if (lineImports.length > 0) {
        unusedImports.push({
          line: lineIndex + 1,
          imports: lineImports,
          fullLine: line
        });
      }
    }
  });

  return unusedImports;
}

// Fix unused imports in a file
function fixUnusedImports(filePath, unusedImports) {
  const content = fs.readFileSync(filePath, 'utf8');
  let lines = content.split('\n');
  let modified = false;

  // Process from bottom to top to maintain line numbers
  unusedImports.reverse().forEach(({ line: lineNumber, imports: lineImports }) => {
    const lineIndex = lineNumber - 1;
    const line = lines[lineIndex];

    if (!line) return; // Safety check

    const match = line.match(/import\s+\{([^}]+)\}/);
    if (!match) return;

    const allImports = match[1].split(',').map(imp => imp.trim());
    const unusedNames = lineImports.map(item => item.import);

    if (unusedNames.length === allImports.length) {
      // Remove entire import line
      lines.splice(lineIndex, 1);
      modified = true;
    } else {
      // Remove only unused imports
      const keepImports = allImports.filter(imp => !unusedNames.includes(imp));
      const newLine = line.replace(
        /import\s+\{[^}]+\}/,
        `import { ${keepImports.join(', ')} }`
      );
      lines[lineIndex] = newLine;
      modified = true;
    }
  });

  if (modified) {
    fs.writeFileSync(filePath, lines.join('\n'));
  }

  return modified;
}

// Main function
function main() {
  const isFixMode = process.argv.includes('--fix');

  console.log('🧹 Scanning for unused imports...');

  const allFiles = getAllTSFiles();
  console.log(`📁 Found ${allFiles.length} TypeScript files\n`);

  let totalFilesWithIssues = 0;
  let totalUnusedImports = 0;
  let fixedFiles = 0;

  const issuesReport = [];

  for (const file of allFiles) {
    const unusedImports = analyzeUnusedImports(file);

    if (unusedImports.length > 0) {
      totalFilesWithIssues++;
      const fileUnusedCount = unusedImports.reduce((sum, item) => sum + item.imports.length, 0);
      totalUnusedImports += fileUnusedCount;

      issuesReport.push({
        file,
        unusedImports,
        count: fileUnusedCount
      });

      if (isFixMode) {
        const wasModified = fixUnusedImports(file, unusedImports);
        if (wasModified) {
          fixedFiles++;
          console.log(`✅ Fixed ${fileUnusedCount} imports in ${file}`);
        }
      }
    }
  }

  console.log('📊 RESULTS:');
  console.log(`   🔍 Files with unused imports: ${totalFilesWithIssues}`);
  console.log(`   🗑️  Total unused imports: ${totalUnusedImports}\n`);

  if (!isFixMode) {
    console.log('🔍 DETAILED REPORT:\n');

    // Show first 10 files with most issues
    issuesReport
      .sort((a, b) => b.count - a.count)
      .slice(0, 10)
      .forEach(({ file, unusedImports, count }) => {
        console.log(`📄 ${file} (${count} unused imports):`);
        unusedImports.forEach(({ line, imports }) => {
          imports.forEach(({ import: importName, cleanName }) => {
            console.log(`   Line ${line}: ${importName}`);
          });
        });
        console.log('');
      });

    console.log('💡 Run with --fix to automatically remove unused imports');
  } else {
    console.log('🛠️  FIXING...\n');
    console.log(`🎉 DONE! Fixed ${fixedFiles} files, removed ${totalUnusedImports} unused imports\n`);
    console.log('💡 TIP: Run "pnpm run build" to verify everything still works');
  }

  console.log('────────────────────────────────────────────────────────────\n');
}

main();

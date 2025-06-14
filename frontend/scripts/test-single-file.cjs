const fs = require('fs');
const path = require('path');

// Import the main cleanup logic
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

// Test on specific file
const testFile = 'src/pages/LunarGridPage.tsx';

console.log(`🧪 Testing cleanup on: ${testFile}`);

const unusedImports = analyzeUnusedImports(testFile);

console.log('\n📋 DETECTED UNUSED IMPORTS:');
unusedImports.forEach(({ line, imports, fullLine }) => {
  console.log(`\nLine ${line}: ${fullLine}`);
  imports.forEach(({ import: importName, cleanName }) => {
    console.log(`  - Unused: ${importName} (${cleanName})`);
  });
});

const shouldFix = process.argv.includes('--fix');

if (shouldFix) {
  console.log('\n🛠️  APPLYING FIXES...');
  const wasModified = fixUnusedImports(testFile, unusedImports);

  if (wasModified) {
    console.log('✅ File was modified successfully!');
    console.log('💡 Check the file and run "pnpm run build" to verify');
  } else {
    console.log('ℹ️  No changes were needed');
  }
} else {
  console.log('\n💡 Add --fix to apply changes');
}

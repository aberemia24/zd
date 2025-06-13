#!/usr/bin/env node

/**
 * CVA Standards Auto-Fixer
 * Repară automat DOAR pattern-urile COMPLEXE și le convertește la CVA
 * EXCLUDE: simple spacing care sunt OK hardcodate
 */

import fs from 'fs';
import path from 'path';

// Funcție pentru a găsi recursiv fișierele .tsx și .ts
function findTsxFiles(dir, excludePatterns = []) {
  const files = [];
  
  function traverse(currentDir) {
    const items = fs.readdirSync(currentDir);
    
    for (const item of items) {
      const fullPath = path.join(currentDir, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        // Skip node_modules, test directories etc
        if (!['node_modules', 'dist', 'build', '.git'].includes(item)) {
          traverse(fullPath);
        }
      } else if (stat.isFile() && (item.endsWith('.tsx') || item.endsWith('.ts'))) {
        // Skip type definition files and excluded patterns
        if (!item.endsWith('.d.ts')) {
          const relativePath = path.relative(process.cwd(), fullPath).replace(/\\/g, '/');
          
          // Check against exclude patterns
          const shouldExclude = excludePatterns.some(pattern => pattern.test(relativePath));
          
          if (!shouldExclude) {
            files.push(relativePath);
          }
        }
      }
    }
  }
  
  traverse(dir);
  return files;
}

// Fixes automate DOAR pentru pattern-uri complexe care beneficiază de CVA
const AUTO_FIXES = [
  // Complex flex layout patterns
  {
    pattern: /className="([^"]*)\bflex\s+flex-row\s+justify-between\s+items-center\s+gap-([2-6])\b([^"]*)"/g,
    replacement: (match, before, gap, after) => {
      const cleanBefore = before.trim();
      const cleanAfter = after.trim();
      const otherClasses = [cleanBefore, cleanAfter].filter(Boolean).join(' ');
      
      if (otherClasses) {
        return `className={cn("${otherClasses}", flexLayout({ direction: "row", justify: "between", align: "center", gap: ${gap} }))}`;
      } else {
        return `className={flexLayout({ direction: "row", justify: "between", align: "center", gap: ${gap} })}`;
      }
    },
    needsImport: 'flexLayout',
    description: 'Converting complex flex layout to flexLayout CVA'
  },

  // Complex flex with 3+ properties
  {
    pattern: /className="([^"]*)\bflex\s+items-center\s+justify-(\w+)\s+gap-([2-6])\b([^"]*)"/g,
    replacement: (match, before, justify, gap, after) => {
      const cleanBefore = before.trim();
      const cleanAfter = after.trim();
      const otherClasses = [cleanBefore, cleanAfter].filter(Boolean).join(' ');
      
      if (otherClasses) {
        return `className={cn("${otherClasses}", flexLayout({ align: "center", justify: "${justify}", gap: ${gap} }))}`;
      } else {
        return `className={flexLayout({ align: "center", justify: "${justify}", gap: ${gap} })}`;
      }
    },
    needsImport: 'flexLayout',
    description: 'Converting complex flex pattern to flexLayout CVA'
  }
];

class CVAAutoFixer {
  constructor() {
    this.fixedFiles = [];
    this.totalFixes = 0;
    this.excludedFiles = 0;
  }

  async fixAll() {
    console.log('🔧 Auto-fixing CVA Complex Patterns Only...\n');

    try {
      // Exclude patterns
      const excludePatterns = [
        /[Dd]emo\.tsx$/,
        /[Dd]emo\//,
        /[Tt]est\.tsx$/,
        /\.test\./,
        /\.spec\./,
        /\/dev\//,
        /test\//,
        /tests\//
      ];

      const files = findTsxFiles(path.join(process.cwd(), 'frontend/src'), excludePatterns);
      console.log(`📁 Found ${files.length} files to check...`);

      for (const file of files) {
        await this.fixFile(file);
      }

      this.printResults();
    } catch (error) {
      console.error('Error finding files:', error);
      throw error;
    }
  }

  async fixFile(filePath) {
    const fullPath = path.resolve(filePath);
    let content = fs.readFileSync(fullPath, 'utf8');
    let modified = false;
    let fixesInFile = 0;
    const neededImports = new Set();

    // Aplică fiecare fix pentru pattern-uri complexe
    for (const fix of AUTO_FIXES) {
      const originalContent = content;
      
      if (typeof fix.replacement === 'function') {
        content = content.replace(fix.pattern, (...args) => {
          fixesInFile++;
          neededImports.add(fix.needsImport);
          console.log(`   📝 ${fix.description}`);
          return fix.replacement(...args);
        });
      } else {
        content = content.replace(fix.pattern, fix.replacement);
        if (content !== originalContent) {
          const matches = originalContent.match(fix.pattern);
          fixesInFile += matches ? matches.length : 0;
          neededImports.add(fix.needsImport);
          console.log(`   📝 ${fix.description}`);
        }
      }

      if (content !== originalContent) {
        modified = true;
      }
    }

    // Adaugă import-urile necesare
    if (neededImports.size > 0) {
      content = this.addCVAImports(content, Array.from(neededImports));
    }

    // Salvează fișierul dacă a fost modificat
    if (modified) {
      fs.writeFileSync(fullPath, content, 'utf8');
      this.fixedFiles.push({
        file: filePath,
        fixes: fixesInFile
      });
      this.totalFixes += fixesInFile;
      console.log(`✅ Fixed ${filePath} (${fixesInFile} complex patterns)\n`);
    }
  }

  addCVAImports(content, neededImports) {
    // Verifică dacă există deja un import CVA
    const cvaImportRegex = /import\s*{([^}]+)}\s*from\s*["']([^"']*styles\/cva-v2[^"']*)["'];?/;
    const match = content.match(cvaImportRegex);

    if (match) {
      // Există deja import CVA - adaugă componentele lipsă
      const currentImports = match[1].split(',').map(imp => imp.trim());
      const newImports = neededImports.filter(imp => !currentImports.includes(imp));
      
      if (newImports.length > 0) {
        const allImports = [...currentImports, ...newImports].join(',\n  ');
        const newImportStatement = `import { \n  ${allImports}\n} from "${match[2]}";`;
        content = content.replace(match[0], newImportStatement);
      }
    } else {
      // Nu există import CVA - adaugă unul nou
      const cvaImports = neededImports.join(',\n  ');
      const newImport = `import { \n  cn,\n  ${cvaImports}\n} from "../../../styles/cva-v2";\n`;
      
      // Găsește locul potrivit pentru import (după React imports)
      const reactImportRegex = /import\s+.*from\s+['"]react['"];?\n/;
      const reactMatch = content.match(reactImportRegex);
      
      if (reactMatch) {
        const insertIndex = content.indexOf(reactMatch[0]) + reactMatch[0].length;
        content = content.slice(0, insertIndex) + newImport + content.slice(insertIndex);
      } else {
        // Adaugă la început dacă nu găsește React import
        content = newImport + content;
      }
    }

    return content;
  }

  printResults() {
    console.log('📊 CVA Complex Patterns Auto-Fix Results:\n');

    if (this.fixedFiles.length === 0) {
      console.log('✅ No complex patterns found to fix.');
      console.log('💡 Simple spacing patterns are excluded (OK to remain hardcoded).\n');
      return;
    }

    console.log(`🎯 ${this.fixedFiles.length} files with complex patterns fixed:`);
    this.fixedFiles.forEach(({ file, fixes }) => {
      console.log(`   📁 ${file} - ${fixes} complex patterns`);
    });

    console.log(`\n🔧 Total complex pattern fixes: ${this.totalFixes}`);
    console.log('\n✅ Complex patterns auto-fix completed!');
    console.log('💡 Simple spacing (mb-4, space-y-2) left untouched - they are fine!');
    console.log('\n🚀 Run `npm run build` to validate.\n');
  }
}

// Rulează auto-fixer-ul
if (import.meta.url === `file://${process.argv[1]}`) {
  const fixer = new CVAAutoFixer();
  fixer.fixAll().catch(error => {
    console.error('❌ Auto-fixer error:', error);
    process.exit(1);
  });
}

export default CVAAutoFixer; 
#!/usr/bin/env node

/**
 * Script: fix-jsx-extensions.js
 * Automat redenumește fișierele .ts cu conținut JSX în .tsx și actualizează importurile
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🔧 Fixing JSX Extension Issues...\n');

// Configurare
const CONFIG = {
  // Directoare de căutat
  searchDirs: [
    path.join(__dirname, '../frontend/src'),
  ],
  
  // Pattern-uri JSX pentru detectare
  jsxPatterns: [
    /<[A-Z]\w*/g,           // React Component tags: <Component
    /<\/[A-Z]\w*>/g,        // Closing component tags: </Component>
    /<\w+[^>]*>/g,          // HTML/JSX tags: <div>, <span>
    /jsx\s*:/g,             // jsx property
    /React\.createElement/g, // React.createElement calls
    /return\s*\(/g,         // return ( - likely JSX return
  ],
  
  // Pattern-uri pentru false positives (exclude)
  excludePatterns: [
    /\/node_modules\//,
    /\/dist\//,
    /\/build\//,
    /\.d\.ts$/,
    /vite-env\.d\.ts$/,
    /\.test\./,
    /\.spec\./,
  ],
};

/**
 * Scanează recursiv un director pentru fișiere
 */
function scanDirectory(dir, extensions = ['.ts', '.tsx']) {
  const files = [];
  
  function walkDir(currentPath) {
    const items = fs.readdirSync(currentPath);
    
    for (const item of items) {
      const itemPath = path.join(currentPath, item);
      const stat = fs.statSync(itemPath);
      
      if (stat.isDirectory()) {
        walkDir(itemPath);
      } else if (stat.isFile()) {
        const ext = path.extname(item);
        if (extensions.includes(ext)) {
          files.push(itemPath);
        }
      }
    }
  }
  
  walkDir(dir);
  return files;
}

/**
 * Verifică dacă un fișier conține JSX
 */
function containsJSX(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Skip fișiere excluse
    for (const excludePattern of CONFIG.excludePatterns) {
      if (excludePattern.test(filePath)) {
        return false;
      }
    }
    
    // Verifică pattern-uri JSX
    for (const pattern of CONFIG.jsxPatterns) {
      if (pattern.test(content)) {
        // Validare suplimentară pentru false positives
        if (pattern.source.includes('<[A-Z]')) {
          // Verifică că nu e doar un generic type <T>
          const matches = content.match(pattern);
          if (matches && matches.some(match => !match.match(/^<[A-Z]\w*>$/))) {
            return true;
          }
        } else {
          return true;
        }
      }
    }
    
    return false;
  } catch (error) {
    console.warn(`⚠️  Nu pot citi fișierul: ${filePath}`);
    return false;
  }
}

/**
 * Găsește toate fișierele .ts cu JSX
 */
function findTsFilesWithJSX() {
  const allFiles = [];
  
  for (const searchDir of CONFIG.searchDirs) {
    if (fs.existsSync(searchDir)) {
      const files = scanDirectory(searchDir, ['.ts']);
      allFiles.push(...files);
    }
  }
  
  console.log(`📁 Scanat ${allFiles.length} fișiere .ts...`);
  
  const jsxFiles = allFiles.filter(file => containsJSX(file));
  
  console.log(`🎯 Găsite ${jsxFiles.length} fișiere .ts cu conținut JSX:\n`);
  
  // Afișează lista fișierelor
  jsxFiles.forEach((file, index) => {
    const relativePath = path.relative(process.cwd(), file);
    console.log(`   ${index + 1}. ${relativePath}`);
  });
  
  return jsxFiles;
}

/**
 * Găsește toate fișierele care importă un fișier specific
 */
function findImportReferences(targetFile) {
  const allFiles = [];
  
  for (const searchDir of CONFIG.searchDirs) {
    if (fs.existsSync(searchDir)) {
      const files = scanDirectory(searchDir, ['.ts', '.tsx', '.js', '.jsx']);
      allFiles.push(...files);
    }
  }
  
  const targetName = path.basename(targetFile, '.ts');
  const references = [];
  
  for (const file of allFiles) {
    if (file === targetFile) continue;
    
    try {
      const content = fs.readFileSync(file, 'utf8');
      const relativePath = path.relative(path.dirname(file), targetFile);
      const withoutExt = relativePath.replace(/\.ts$/, '');
      
      // Pattern-uri de import care ar putea referi fișierul nostru
      const importPatterns = [
        new RegExp(`from\\s+['"]${withoutExt.replace(/\\/g, '/')}['"]`, 'g'),
        new RegExp(`from\\s+['"]\\..${targetName}['"]`, 'g'),
        new RegExp(`import\\s+.*\\s+from\\s+['"].*..${targetName}['"]`, 'g'),
      ];
      
      for (const pattern of importPatterns) {
        if (pattern.test(content)) {
          references.push({
            file,
            content,
            pattern: pattern.source
          });
          break;
        }
      }
    } catch (error) {
      // Skip files that can't be read
    }
  }
  
  return references;
}

/**
 * Actualizează importurile pentru un fișier redenumit
 */
function updateImports(oldPath, newPath) {
  const references = findImportReferences(oldPath);
  
  if (references.length === 0) {
    return 0;
  }
  
  console.log(`   📝 Actualizez ${references.length} import(uri)...`);
  
  const oldName = path.basename(oldPath, '.ts');
  const newName = path.basename(newPath, '.tsx');
  
  for (const ref of references) {
    try {
      let content = ref.content;
      
      // Replace cu extensia nouă - pattern general
      const oldImportPattern = new RegExp(
        `(from\\s+['"][^'"]*\\/)${oldName}(['"])`,
        'g'
      );
      content = content.replace(oldImportPattern, `$1${newName}$2`);
      
      // Pattern specific pentru import relativ
      const relativePattern = new RegExp(
        `(from\\s+['"]\\..${oldName}(['"])`,
        'g'
      );
      content = content.replace(relativePattern, `$1${newName}$2`);
      
      fs.writeFileSync(ref.file, content, 'utf8');
      
      const relativePath = path.relative(process.cwd(), ref.file);
      console.log(`     ✅ ${relativePath}`);
    } catch (error) {
      console.warn(`     ⚠️  Eroare la actualizarea: ${ref.file}`);
    }
  }
  
  return references.length;
}

/**
 * Redenumește un fișier folosind git mv
 */
function renameFile(oldPath, newPath) {
  try {
    const relativeOldPath = path.relative(process.cwd(), oldPath);
    const relativeNewPath = path.relative(process.cwd(), newPath);
    
    // Folosește git mv pentru a păstra history-ul
    execSync(`git mv "${relativeOldPath}" "${relativeNewPath}"`, {
      stdio: 'pipe'
    });
    
    console.log(`   ✅ Redenumit: ${path.basename(oldPath)} → ${path.basename(newPath)}`);
    return true;
  } catch (error) {
    console.warn(`   ⚠️  Eroare la redenumire: ${oldPath}`);
    console.warn(`      ${error.message}`);
    return false;
  }
}

/**
 * Procesează toate fișierele găsite
 */
function processFiles(files) {
  console.log(`\n🔧 Încep procesarea fișierelor...\n`);
  
  let renamedCount = 0;
  let updatedImports = 0;
  const errors = [];
  
  for (const file of files) {
    const newPath = file.replace(/\.ts$/, '.tsx');
    const relativePath = path.relative(process.cwd(), file);
    
    console.log(`📁 Procesez: ${relativePath}`);
    
    // Actualizează importurile ÎNAINTE de redenumire
    const importCount = updateImports(file, newPath);
    updatedImports += importCount;
    
    // Redenumește fișierul
    const success = renameFile(file, newPath);
    
    if (success) {
      renamedCount++;
    } else {
      errors.push(relativePath);
    }
    
    console.log('');
  }
  
  return { renamedCount, updatedImports, errors };
}

/**
 * Funcția principală
 */
function main() {
  console.log('🔍 IDENTIFICARE FIȘIERE .ts CU JSX');
  console.log('=====================================\n');
  
  // Găsește fișierele
  const jsxFiles = findTsFilesWithJSX();
  
  if (jsxFiles.length === 0) {
    console.log('✅ Nu sunt fișiere .ts cu JSX de redenumit!\n');
    return;
  }
  
  console.log(`\n📊 SUMAR: ${jsxFiles.length} fișiere de procesat\n`);
  
  // Confirmă operația
  console.log('⚠️  ATENȚIE: Această operație va:');
  console.log('   • Redenumi fișierele .ts → .tsx folosind git mv');
  console.log('   • Actualiza importurile în fișierele dependente');
  console.log('   • Păstra git history pentru fiecare fișier\n');
  
  // Procesează fișierele
  const results = processFiles(jsxFiles);
  
  // Afișează rezultatele
  console.log('🎉 PROCESARE COMPLETĂ');
  console.log('=====================\n');
  console.log(`✅ Fișiere redenumite: ${results.renamedCount}/${jsxFiles.length}`);
  console.log(`📝 Importuri actualizate: ${results.updatedImports}`);
  
  if (results.errors.length > 0) {
    console.log(`❌ Erori: ${results.errors.length}`);
    results.errors.forEach(error => console.log(`   • ${error}`));
  }
  
  console.log('\n💡 Următorii pași reccomandați:');
  console.log('   1. Rulează npm run build pentru verificare');
  console.log('   2. Testează aplicația');
  console.log('   3. Commit schimbările cu git commit');
}

// Rulează scriptul
if (require.main === module) {
  main();
} 
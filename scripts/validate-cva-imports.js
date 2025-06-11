const fs = require('fs');
const path = require('path');

// Funcție pentru a găsi recursiv fișierele .tsx și .ts
function findTsxFiles(dir, excludePatterns = []) {
  const files = [];
  
  function traverse(currentDir) {
    const items = fs.readdirSync(currentDir);
    
    for (const item of items) {
      const fullPath = path.join(currentDir, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        if (!['node_modules', 'dist', 'build', '.git'].includes(item)) {
          traverse(fullPath);
        }
      } else if (stat.isFile() && (item.endsWith('.tsx') || item.endsWith('.ts'))) {
        if (!item.endsWith('.d.ts')) {
          const relativePath = path.relative(process.cwd(), fullPath).replace(/\\/g, '/');
          
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

// Anti-patterns de import care trebuie evitate
const IMPORT_ANTI_PATTERNS = {
  unifiedCvaImports: {
    pattern: /import.*from.*unified-cva/g,
    severity: 'error',
    message: 'ANTI-PATTERN: Evită unified-cva monolith - folosește imports modulare din cva-v2',
    suggestion: 'import { component } from "styles/cva-v2/primitives/[component-type]"'
  },
  
  deepImports: {
    pattern: /import.*from.*styles\/cva\/[^/]+\/[^/]+\/[^/]+/g,
    severity: 'warning', 
    message: 'IMPORT DEPTH: Importuri prea adânci - consider index exports',
    suggestion: 'import { component } from "styles/cva-v2/[category]"'
  },
  
  wildcardImports: {
    pattern: /import \* as .* from.*cva/g,
    severity: 'warning',
    message: 'IMPORT EFFICIENCY: Wildcard imports afectează tree-shaking',
    suggestion: 'import { specificComponent } from "styles/cva-v2/..."'
  }
};

// Pattern-uri de import recomandate
const RECOMMENDED_IMPORT_PATTERNS = {
  modularImports: {
    pattern: /import.*from.*styles\/cva-v2\/(primitives|compositions|domain)/g,
    message: '✅ Import modular corect din CVA v2'
  },
  
  indexImports: {
    pattern: /import.*from.*styles\/cva-v2$/g,
    message: '✅ Import prin index principal - bun pentru componente multiple'
  }
};

class CVAImportValidator {
  constructor() {
    this.errors = [];
    this.warnings = [];
    this.recommendations = [];
    this.filesChecked = 0;
    this.importStats = {
      unifiedCva: 0,
      modularV2: 0,
      deepImports: 0,
      wildcardImports: 0
    };
  }

  async validate() {
    console.log('🔍 Validating CVA Import Patterns...\n');
    
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

    // Determine if we're running from frontend/ directory or project root
    const srcPath = fs.existsSync(path.join(process.cwd(), 'src')) 
      ? path.join(process.cwd(), 'src')
      : path.join(process.cwd(), 'frontend/src');
    
    const files = findTsxFiles(srcPath, excludePatterns);
    console.log(`📁 Files checked: ${files.length}\n`);

    for (const file of files) {
      await this.validateFile(file);
    }

    this.printResults();
    return this.errors.length === 0;
  }

  async validateFile(filePath) {
    const fullPath = path.resolve(filePath);
    const content = fs.readFileSync(fullPath, 'utf8');
    
    this.filesChecked++;

    // Check for anti-patterns
    this.checkImportAntiPatterns(content, filePath);
    
    // Check for recommended patterns
    this.checkRecommendedPatterns(content, filePath);
    
    // Analyze import statistics
    this.analyzeImportStats(content);
  }

  checkImportAntiPatterns(content, filePath) {
    for (const [patternName, config] of Object.entries(IMPORT_ANTI_PATTERNS)) {
      const matches = content.match(config.pattern);
      if (matches) {
        const issue = {
          file: filePath,
          pattern: patternName,
          message: config.message,
          suggestion: config.suggestion,
          matches: matches.length,
          examples: matches.slice(0, 2)
        };

        if (config.severity === 'error') {
          this.errors.push(issue);
        } else {
          this.warnings.push(issue);
        }
      }
    }
  }

  checkRecommendedPatterns(content, filePath) {
    for (const [patternName, config] of Object.entries(RECOMMENDED_IMPORT_PATTERNS)) {
      const matches = content.match(config.pattern);
      if (matches) {
        this.recommendations.push({
          file: filePath,
          pattern: patternName,
          message: config.message,
          count: matches.length
        });
      }
    }
  }

  analyzeImportStats(content) {
    // Count different import types
    if (content.match(/import.*from.*unified-cva/g)) {
      this.importStats.unifiedCva++;
    }
    
    if (content.match(/import.*from.*styles\/cva-v2/g)) {
      this.importStats.modularV2++;
    }
    
    if (content.match(/import.*from.*styles\/cva\/[^/]+\/[^/]+\/[^/]+/g)) {
      this.importStats.deepImports++;
    }
    
    if (content.match(/import \* as .* from.*cva/g)) {
      this.importStats.wildcardImports++;
    }
  }

  printResults() {
    console.log(`📊 CVA Import Validation Results:\n`);

    // Import Statistics
    console.log(`📈 Import Statistics:`);
    console.log(`   📁 Files checked: ${this.filesChecked}`);
    console.log(`   🚨 Unified CVA imports: ${this.importStats.unifiedCva} (should be 0)`);
    console.log(`   ✅ Modular v2 imports: ${this.importStats.modularV2}`);
    console.log(`   ⚠️  Deep imports: ${this.importStats.deepImports}`);
    console.log(`   📦 Wildcard imports: ${this.importStats.wildcardImports}\n`);

    // Errors (anti-patterns)
    if (this.errors.length > 0) {
      console.log(`❌ CRITICAL IMPORT ISSUES (${this.errors.length}):`);
      this.errors.forEach((error, index) => {
        console.log(`\n${index + 1}. ${error.file}`);
        console.log(`   🚨 ${error.message}`);
        console.log(`   💡 Suggestion: ${error.suggestion}`);
        console.log(`   📊 ${error.matches} instances found`);
        if (error.examples) {
          console.log(`   📝 Examples:`);
          error.examples.forEach(ex => console.log(`      ${ex.substring(0, 80)}...`));
        }
      });
    }

    // Warnings
    if (this.warnings.length > 0) {
      console.log(`\n⚠️  IMPORT WARNINGS (${this.warnings.length}):`);
      this.warnings.forEach((warning, index) => {
        console.log(`\n${index + 1}. ${warning.file}`);
        console.log(`   ⚠️  ${warning.message}`);
        console.log(`   💡 Suggestion: ${warning.suggestion}`);
      });
    }

    // Recommendations (good patterns found)
    if (this.recommendations.length > 0) {
      console.log(`\n✅ GOOD IMPORT PATTERNS FOUND (${this.recommendations.length}):`);
      this.recommendations.slice(0, 5).forEach((rec, index) => {
        console.log(`   ${index + 1}. ${rec.file}: ${rec.message} (${rec.count}x)`);
      });
      if (this.recommendations.length > 5) {
        console.log(`   ... and ${this.recommendations.length - 5} more files with good patterns`);
      }
    }

    // Migration recommendations
    if (this.importStats.unifiedCva > 0) {
      console.log(`\n🔄 MIGRATION NEEDED:`);
      console.log(`   ${this.importStats.unifiedCva} files still use unified-cva`);
      console.log(`   Run: node scripts/fix-cva-imports.js`);
    }

    if (this.errors.length === 0 && this.warnings.length === 0) {
      console.log('✅ Perfect! All CVA imports follow best practices.\n');
    } else if (this.errors.length > 0) {
      console.log('\n🚨 BUILD STOPPED - Fix critical import issues first!');
    }
  }
}

// Rulează validatorul
if (require.main === module) {
  const validator = new CVAImportValidator();
  validator.validate().then(success => {
    if (!success) {
      process.exit(1);
    }
  }).catch(error => {
    console.error('❌ Import validator error:', error);
    process.exit(1);
  });
}

module.exports = CVAImportValidator; 
#!/usr/bin/env node

/**
 * CVA Design System Validator
 * Verifică respectarea standardelor CVA pentru PATTERN-URI COMPLEXE
 * EXCLUDE: simple spacing (mb-4, space-y-2) care sunt OK hardcodate
 */

const fs = require('fs');
const path = require('path');

// Funcție pentru a găsi recursiv fișierele .tsx și .ts (same as fix script)
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

// DOAR pattern-uri complexe care beneficiază cu adevărat de CVA
const VALIDATION_RULES = {
  // Pattern-uri complexe de layout care ar trebui să folosească CVA
  complexLayoutPatterns: [
    {
      pattern: /className="[^"]*flex\s+flex-row\s+justify-between\s+items-center\s+gap-[2-6][^"]*"/g,
      replacement: 'flexLayout({ direction: "row", justify: "between", align: "center", gap: X })',
      severity: 'error',
      message: 'Folosește flexLayout CVA pentru pattern-uri complexe de layout cu mai multe proprietăți'
    },
    {
      pattern: /className="[^"]*flex\s+items-center\s+justify-\w+\s+gap-[2-6][^"]*"/g,
      replacement: 'flexLayout({ align: "center", justify: "X", gap: X })',
      severity: 'warning',
      message: 'Consider flexLayout CVA pentru pattern-uri flex cu 3+ proprietăți'
    }
  ],

  // Pattern-uri complexe de card header care ar trebui să folosească CVA
  complexCardPatterns: [
    {
      pattern: /className="[^"]*p-4[^"]*border-b[^"]*bg-\w+[^"]*rounded-t-lg[^"]*"/g,
      replacement: 'cardHeader({ variant: "default" })',
      severity: 'error',
      message: 'Folosește cardHeader CVA pentru card headers complexe (4+ proprietăți)'
    },
    {
      pattern: /className="[^"]*p-4[^"]*border-b[^"]*bg-\w+[^"]*rounded[^"]*"/g,
      replacement: 'cardHeader({ variant: "default" })',
      severity: 'warning',
      message: 'Consider cardHeader CVA pentru pattern-uri repetitive de card styling'
    }
  ],

  // Pattern-uri de table complexe
  complexTablePatterns: [
    {
      pattern: /className="[^"]*p-4[^"]*font-medium[^"]*text-\w+[^"]*bg-\w+[^"]*"/g,
      replacement: 'tableHeader({ variant: "default" })',
      severity: 'error',
      message: 'Folosește tableHeader CVA pentru header-uri complexe de table'
    }
  ],

  // 🔥 CRITICAL PATTERNS - Form Layout Combinations
  criticalFormPatterns: [
    {
      pattern: /className="[^"]*space-y-6[^"]*flex[^"]*flex-col[^"]*"/g,
      replacement: 'spaceY({ spacing: 6 }) + flexLayout({ direction: "col" })',
      severity: 'error',
      message: 'CRITICAL: Folosește spaceY + flexLayout pentru form containers complexe'
    },
    {
      pattern: /className="[^"]*space-y-4[^"]*flex[^"]*flex-col[^"]*p-4[^"]*"/g,
      replacement: 'spaceY({ spacing: 4 }) + flexLayout({ direction: "col" }) + spacingMargin({ y: 4 })',
      severity: 'error', 
      message: 'CRITICAL: Separă pattern-ul complex în componente CVA distincte'
    }
  ],

  // 🔥 CRITICAL PATTERNS - Loading State Validation
  criticalLoadingPatterns: [
    {
      pattern: /className="[^"]*absolute[^"]*inset-0[^"]*bg-[^"]*backdrop-blur[^"]*flex[^"]*items-center[^"]*justify-center[^"]*"/g,
      replacement: 'loadingOverlay({ variant: "default" })',
      severity: 'error',
      message: 'CRITICAL: Folosește loadingOverlay pentru loading states în loc de pattern hardcodat'
    },
    {
      pattern: /className="[^"]*fixed[^"]*inset-0[^"]*bg-black\/\d+[^"]*z-\d+[^"]*"/g,
      replacement: 'loadingOverlay({ variant: "modal" })',
      severity: 'error',
      message: 'CRITICAL: Folosește loadingOverlay pentru modal overlays'
    }
  ],

  // 🔥 CRITICAL PATTERNS - Card Header Validation
  criticalCardHeaderPatterns: [
    {
      pattern: /className="[^"]*p-4[^"]*border-b[^"]*bg-gray-50[^"]*font-semibold[^"]*"/g,
      replacement: 'cardHeader({ variant: "default" })',
      severity: 'error',
      message: 'CRITICAL: Folosește cardHeader pentru headers complexe - detectat pattern CategoryEditor'
    },
    {
      pattern: /className="[^"]*px-4[^"]*py-3[^"]*border-b[^"]*bg-[^"]*rounded-t[^"]*"/g,
      replacement: 'cardHeader({ variant: "default" })',
      severity: 'error',
      message: 'CRITICAL: Pattern card header complex detectat - migrează la CVA'
    }
  ],

  // ⚠️ HIGH PATTERNS - Semantic Colors
  highSemanticColorPatterns: [
    {
      pattern: /className="[^"]*text-green-600[^"]*font-semibold[^"]*"/g,
      replacement: 'text-success + font-semibold sau typography CVA',
      severity: 'warning',
      message: 'HIGH: Folosește culori semantice (text-success) pentru date financiare'
    },
    {
      pattern: /className="[^"]*text-red-600[^"]*font-semibold[^"]*"/g,
      replacement: 'text-danger + font-semibold sau typography CVA', 
      severity: 'warning',
      message: 'HIGH: Folosește culori semantice (text-danger) pentru amounts negative'
    },
    {
      pattern: /className="[^"]*bg-blue-500[^"]*text-white[^"]*px-4[^"]*py-2[^"]*"/g,
      replacement: 'button({ variant: "primary" }) sau bg-primary',
      severity: 'warning',
      message: 'HIGH: Folosește semantic colors pentru UI consistency'
    }
  ],

  // ⚠️ HIGH PATTERNS - LunarGrid Specific
  highLunarGridPatterns: [
    {
      pattern: /className="[^"]*grid[^"]*grid-cols-\d+[^"]*gap-4[^"]*p-4[^"]*border[^"]*"/g,
      replacement: 'gridLayout({ cols: X, gap: 4, padding: 4, border: true })',
      severity: 'warning',
      message: 'HIGH: Folosește gridLayout pentru LunarGrid layouts complexe'
    },
    {
      pattern: /className="[^"]*flex[^"]*justify-between[^"]*items-center[^"]*border-b[^"]*py-2[^"]*"/g,
      replacement: 'flexLayout({ justify: "between", align: "center" }) + border + spacing utilities',
      severity: 'warning',
      message: 'HIGH: Pattern transaction row detectat - standardizează cu CVA'
    }
  ],

  // 🔄 CROSS-COMPONENT CONSISTENCY PATTERNS
  crossComponentConsistencyPatterns: [
    {
      pattern: /className="[^"]*flex[^"]*flex-row[^"]*gap-8[^"]*mb-4[^"]*"/g,
      replacement: 'flexLayout({ direction: "row", gap: 8 }) + spacingMargin({ bottom: 4 })',
      severity: 'warning',
      message: 'CONSISTENCY: Pattern folosit în CategoryEditor - standardizează cross-component'
    },
    {
      pattern: /className="[^"]*space-y-4[^"]*p-4[^"]*bg-white[^"]*rounded[^"]*"/g,
      replacement: 'spaceY({ spacing: 4 }) + card({ variant: "default" })',
      severity: 'warning',
      message: 'CONSISTENCY: Pattern card standard - folosește consistent across components'
    },
    {
      pattern: /style=\{\{[^}]*margin[^}]*\}\}/g,
      replacement: 'spacingMargin() CVA variant',
      severity: 'error',
      message: 'CONSISTENCY: NU folosi inline styles pentru spacing - folosește CVA'
    }
  ],

  // 🚨 ANTI-PATTERNS Prevention
  antiPatterns: [
    {
      pattern: /import.*from.*unified-cva/g,
      replacement: 'Import from modular CVA v2 files',
      severity: 'error',
      message: 'ANTI-PATTERN: Evită unified-cva monolith - folosește imports modulare'
    },
    {
      pattern: /className="[^"]*mb-4[^"]*space-y-4[^"]*gap-4[^"]*flex[^"]*"/g,
      replacement: 'Separă în spacingMargin + spaceY + flexLayout', 
      severity: 'error',
      message: 'ANTI-PATTERN: Pattern prea complex - separă în componente CVA distincte'
    }
  ],

  // PATTERN-URI NOI SUPLIMENTARE:
  
  // Pattern-uri complexe de form
  complexFormPatterns: [
    {
      pattern: /className="[^"]*block\s+w-full\s+rounded-md\s+border-\w+\s+px-3\s+py-2[^"]*"/g,
      replacement: 'formInput({ variant: "default", size: "md" })',
      severity: 'error',
      message: 'Folosește formInput CVA pentru input-uri complexe cu multiple proprietăți'
    },
    {
      pattern: /className="[^"]*text-sm\s+font-medium\s+text-\w+\s+mb-2[^"]*"/g,
      replacement: 'formLabel({ variant: "default" })',
      severity: 'warning',
      message: 'Consider formLabel CVA pentru label-uri consistente'
    }
  ],

  // Pattern-uri complexe de modal/overlay
  complexModalPatterns: [
    {
      pattern: /className="[^"]*fixed\s+inset-0\s+z-50\s+bg-black\/50\s+backdrop-blur[^"]*"/g,
      replacement: 'modalOverlay({ variant: "blur" })',
      severity: 'error',
      message: 'Folosește modalOverlay CVA pentru overlay-uri complexe cu backdrop'
    },
    {
      pattern: /className="[^"]*bg-white\s+rounded-lg\s+shadow-xl\s+p-6\s+max-w-\w+[^"]*"/g,
      replacement: 'modalContent({ size: "md", variant: "default" })',
      severity: 'error',
      message: 'Folosește modalContent CVA pentru conținut modal complex'
    }
  ],

  // Pattern-uri complexe de button/interaction
  complexButtonPatterns: [
    {
      pattern: /className="[^"]*inline-flex\s+items-center\s+px-4\s+py-2\s+bg-\w+-\d+\s+text-white\s+rounded-md[^"]*"/g,
      replacement: 'button({ variant: "primary", size: "md" })',
      severity: 'error',
      message: 'Folosește button CVA pentru button-uri complexe cu multiple stiluri'
    },
    {
      pattern: /className="[^"]*flex\s+items-center\s+justify-center\s+w-8\s+h-8\s+rounded-full\s+bg-\w+[^"]*"/g,
      replacement: 'iconButton({ variant: "default", size: "sm" })',
      severity: 'warning',
      message: 'Consider iconButton CVA pentru button-uri icon circulare'
    }
  ],

  // Pattern-uri de culori semantice (NOI!)
  nonSemanticColorPatterns: [
    {
      pattern: /className="[^"]*bg-blue-500[^"]*"/g,
      replacement: 'className="bg-primary" sau CV cu variant semantic',
      severity: 'warning',
      message: 'Folosește culori semantice (bg-primary) în loc de technical colors (bg-blue-500)'
    },
    {
      pattern: /className="[^"]*text-red-500[^"]*"/g,
      replacement: 'className="text-danger" sau CVA cu variant semantic',
      severity: 'warning', 
      message: 'Folosește culori semantice (text-danger) în loc de technical colors (text-red-500)'
    },
    {
      pattern: /className="[^"]*border-gray-300[^"]*"/g,
      replacement: 'className="border-muted" sau CVA cu variant semantic',
      severity: 'info',
      message: 'Consider culori semantice (border-muted) pentru consistență'
    }
  ],

  // Pattern-uri de typography complexe
  complexTypographyPatterns: [
    {
      pattern: /className="[^"]*text-2xl\s+font-bold\s+text-\w+\s+leading-tight[^"]*"/g,
      replacement: 'typography({ variant: "heading", size: "xl" })',
      severity: 'warning',
      message: 'Consider typography CVA pentru heading-uri complexe cu multiple proprietăți'
    },
    {
      pattern: /className="[^"]*text-sm\s+text-\w+\s+font-medium\s+uppercase[^"]*"/g,
      replacement: 'typography({ variant: "caption", transform: "uppercase" })',
      severity: 'warning',
      message: 'Consider typography CVA pentru caption-uri complexe'
    }
  ]
};



class CVAValidator {
  constructor() {
    this.errors = [];
    this.warnings = [];
    this.filesChecked = 0;
    this.excludedFiles = 0;
  }

  async validate() {
    console.log('🔍 Validating CVA Complex Patterns Only...\n');
    
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
    console.log(`📁 Files checked: ${files.length}`);

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

    // Verifică doar pattern-uri complexe
    this.checkComplexPatterns(content, filePath);
  }

  checkComplexPatterns(content, filePath) {
    const allRules = [
      // Original patterns
      ...VALIDATION_RULES.complexLayoutPatterns,
      ...VALIDATION_RULES.complexCardPatterns,
      ...VALIDATION_RULES.complexTablePatterns,
      
      // 🔥 CRITICAL PATTERNS
      ...VALIDATION_RULES.criticalFormPatterns,
      ...VALIDATION_RULES.criticalLoadingPatterns,
      ...VALIDATION_RULES.criticalCardHeaderPatterns,
      
      // ⚠️ HIGH PRIORITY PATTERNS
      ...VALIDATION_RULES.highSemanticColorPatterns,
      ...VALIDATION_RULES.highLunarGridPatterns,
      
      // 🔄 CROSS-COMPONENT CONSISTENCY
      ...VALIDATION_RULES.crossComponentConsistencyPatterns,
      
      // 🚨 ANTI-PATTERNS
      ...VALIDATION_RULES.antiPatterns,
      
      // Additional patterns
      ...VALIDATION_RULES.complexFormPatterns,
      ...VALIDATION_RULES.complexModalPatterns,
      ...VALIDATION_RULES.complexButtonPatterns,
      ...VALIDATION_RULES.nonSemanticColorPatterns,
      ...VALIDATION_RULES.complexTypographyPatterns
    ];

    for (const rule of allRules) {
      const matches = content.match(rule.pattern);
      if (matches) {
        const issue = {
          file: filePath,
          pattern: rule.pattern.toString(),
          replacement: rule.replacement,
          message: rule.message,
          matches: matches.length,
          examples: matches.slice(0, 2) // Primele 2 exemple
        };

        if (rule.severity === 'error') {
          this.errors.push(issue);
        } else {
          this.warnings.push(issue);
        }
      }
    }
  }

  printResults() {
    console.log(`📊 CVA Complex Patterns Validation:`);
    console.log(`📁 Files checked: ${this.filesChecked}\n`);

    if (this.errors.length === 0 && this.warnings.length === 0) {
      console.log('✅ Perfect! Toate pattern-urile complexe folosesc CVA corespunzător.\n');
      console.log('💡 Simple spacing patterns (mb-4, space-y-2) sunt OK hardcodate și excluse din validare.\n');
      return;
    }

    // Afișează erori
    if (this.errors.length > 0) {
      console.log(`❌ COMPLEX PATTERNS NEOPTIMIZATE (${this.errors.length}):`);
      this.errors.forEach((error, index) => {
        console.log(`\n${index + 1}. ${error.file}`);
        console.log(`   💡 ${error.message}`);
        console.log(`   🔧 Înlocuiește cu: ${error.replacement}`);
        console.log(`   📊 ${error.matches} instanțe găsite`);
        if (error.examples) {
          console.log(`   📝 Exemple:`);
          error.examples.forEach(ex => console.log(`      ${ex.substring(0, 60)}...`));
        }
      });
    }

    // Afișează warning-uri
    if (this.warnings.length > 0) {
      console.log(`\n⚠️  PATTERN-URI DE OPTIMIZAT (${this.warnings.length}):`);
      this.warnings.forEach((warning, index) => {
        console.log(`\n${index + 1}. ${warning.file}`);
        console.log(`   💡 ${warning.message}`);
        console.log(`   🔧 Consider: ${warning.replacement}`);
      });
    }

    console.log('\n💡 NOTĂ: Simple spacing (mb-4, space-y-2) sunt excluse - sunt OK hardcodate!');
    
    if (this.errors.length > 0) {
      console.log('\n🚨 BUILD STOPPED - Fix complex patterns first!');
    }
  }
}

// Rulează validatorul
if (require.main === module) {
  const validator = new CVAValidator();
  validator.validate().then(success => {
    if (!success) {
      process.exit(1);
    }
  }).catch(error => {
    console.error('❌ Validator error:', error);
    process.exit(1);
  });
}

module.exports = CVAValidator; 
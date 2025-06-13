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

// Pattern-uri care trebuie să fie consistente cross-component
const CONSISTENCY_PATTERNS = {
  // Card header patterns - trebuie să fie identice în toate componentele
  cardHeaders: {
    standardPatterns: [
      /className="[^"]*p-4[^"]*border-b[^"]*bg-gray-50[^"]*font-semibold[^"]*"/g,
      /className="[^"]*px-4[^"]*py-3[^"]*border-b[^"]*bg-[^"]*rounded-t[^"]*"/g
    ],
    expectedCva: 'cardHeader({ variant: "default" })',
    severity: 'error',
    message: 'Card headers trebuie să folosească același cardHeader CVA în toate componentele'
  },

  // Form spacing patterns
  formSpacing: {
    standardPatterns: [
      /className="[^"]*space-y-6[^"]*"/g,
      /className="[^"]*space-y-4[^"]*"/g,
      /className="[^"]*space-y-8[^"]*"/g
    ],
    expectedCva: 'spaceY({ spacing: X })',
    severity: 'warning',
    message: 'Form spacing trebuie să fie consistent - folosește spaceY CVA'
  },

  // Button patterns - trebuie identice pentru aceeași funcționalitate 
  buttonPatterns: {
    standardPatterns: [
      /className="[^"]*px-4[^"]*py-2[^"]*bg-blue-500[^"]*text-white[^"]*rounded[^"]*"/g,
      /className="[^"]*inline-flex[^"]*items-center[^"]*px-4[^"]*py-2[^"]*bg-[^"]*text-white[^"]*"/g
    ],
    expectedCva: 'button({ variant: "primary", size: "md" })',
    severity: 'error',
    message: 'Butoanele trebuie să folosească același button CVA pentru consistency'
  },

  // Layout patterns folosite în multiple componente
  flexLayoutPatterns: {
    standardPatterns: [
      /className="[^"]*flex[^"]*flex-row[^"]*justify-between[^"]*items-center[^"]*gap-\d+[^"]*"/g,
      /className="[^"]*flex[^"]*justify-between[^"]*items-center[^"]*"/g
    ],
    expectedCva: 'flexLayout({ direction: "row", justify: "between", align: "center", gap: X })',
    severity: 'warning',
    message: 'Layout patterns complexe trebuie standardizate cu flexLayout CVA'
  },

  // Loading states - trebuie identice
  loadingStates: {
    standardPatterns: [
      /className="[^"]*absolute[^"]*inset-0[^"]*bg-[^"]*backdrop-blur[^"]*flex[^"]*items-center[^"]*justify-center[^"]*"/g,
      /className="[^"]*fixed[^"]*inset-0[^"]*bg-black\/\d+[^"]*z-\d+[^"]*"/g
    ],
    expectedCva: 'loadingOverlay({ variant: "default" | "modal" })',
    severity: 'error',
    message: 'Loading states trebuie să folosească loadingOverlay CVA consistent'
  },

  // Table header styles
  tableHeaders: {
    standardPatterns: [
      /className="[^"]*p-4[^"]*font-medium[^"]*text-gray-900[^"]*bg-gray-50[^"]*"/g,
      /className="[^"]*px-4[^"]*py-3[^"]*font-semibold[^"]*text-[^"]*bg-[^"]*"/g
    ],
    expectedCva: 'tableHeader({ variant: "default" })',
    severity: 'warning',
    message: 'Table headers trebuie să folosească tableHeader CVA pentru uniformitate'
  }
};

class ComponentConsistencyValidator {
  constructor() {
    this.patternUsage = new Map(); // Tracks where each pattern is used
    this.inconsistencies = [];
    this.filesChecked = 0;
    this.componentCategories = {
      features: [],
      primitives: [],
      pages: [],
      others: []
    };
  }

  async validate() {
    console.log('🔍 Validating Cross-Component Consistency...\n');
    
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

    this.analyzeConsistency();
    this.printResults();
    return this.inconsistencies.filter(i => i.severity === 'error').length === 0;
  }

  async validateFile(filePath) {
    const fullPath = path.resolve(filePath);
    const content = fs.readFileSync(fullPath, 'utf8');
    
    this.filesChecked++;
    this.categorizeComponent(filePath);

    // Check for consistency patterns
    for (const [patternName, config] of Object.entries(CONSISTENCY_PATTERNS)) {
      this.checkPatternUsage(content, filePath, patternName, config);
    }
  }

  categorizeComponent(filePath) {
    if (filePath.includes('components/features/')) {
      this.componentCategories.features.push(filePath);
    } else if (filePath.includes('components/primitives/')) {
      this.componentCategories.primitives.push(filePath);
    } else if (filePath.includes('pages/')) {
      this.componentCategories.pages.push(filePath);
    } else {
      this.componentCategories.others.push(filePath);
    }
  }

  checkPatternUsage(content, filePath, patternName, config) {
    for (const pattern of config.standardPatterns) {
      const matches = content.match(pattern);
      if (matches) {
        if (!this.patternUsage.has(patternName)) {
          this.patternUsage.set(patternName, {
            config,
            usages: []
          });
        }

        this.patternUsage.get(patternName).usages.push({
          file: filePath,
          matches: matches.length,
          examples: matches.slice(0, 2)
        });
      }
    }
  }

  analyzeConsistency() {
    for (const [patternName, data] of this.patternUsage.entries()) {
      const { config, usages } = data;

      // Dacă pattern-ul e folosit în multiple componente, verifică consistency
      if (usages.length > 1) {
        const componentsAffected = usages.map(u => u.file);
        const totalMatches = usages.reduce((sum, u) => sum + u.matches, 0);

        this.inconsistencies.push({
          patternName,
          severity: config.severity,
          message: config.message,
          expectedCva: config.expectedCva,
          componentsAffected,
          totalInstances: totalMatches,
          usageDetails: usages,
          priority: this.calculatePriority(usages, config.severity)
        });
      }
    }

    // Sortează inconsistențele după prioritate
    this.inconsistencies.sort((a, b) => b.priority - a.priority);
  }

  calculatePriority(usages, severity) {
    const severityWeight = severity === 'error' ? 100 : 50;
    const usageWeight = usages.length * 10;
    const instanceWeight = usages.reduce((sum, u) => sum + u.matches, 0);
    
    return severityWeight + usageWeight + instanceWeight;
  }

  printResults() {
    console.log(`📊 Cross-Component Consistency Results:\n`);

    // Component distribution
    console.log(`📈 Component Distribution:`);
    console.log(`   🏗️  Features: ${this.componentCategories.features.length}`);
    console.log(`   🧱 Primitives: ${this.componentCategories.primitives.length}`);
    console.log(`   📄 Pages: ${this.componentCategories.pages.length}`);
    console.log(`   📁 Others: ${this.componentCategories.others.length}`);
    console.log(`   📁 Total: ${this.filesChecked}\n`);

    // Pattern usage overview
    console.log(`🔍 Pattern Usage Overview:`);
    console.log(`   📊 Patterns tracked: ${Object.keys(CONSISTENCY_PATTERNS).length}`);
    console.log(`   🚨 Inconsistencies found: ${this.inconsistencies.length}`);
    console.log(`   ❌ Critical issues: ${this.inconsistencies.filter(i => i.severity === 'error').length}`);
    console.log(`   ⚠️  Warnings: ${this.inconsistencies.filter(i => i.severity === 'warning').length}\n`);

    // Detailed inconsistency report
    if (this.inconsistencies.length > 0) {
      console.log(`🚨 CONSISTENCY ISSUES (by priority):\n`);
      
      this.inconsistencies.forEach((issue, index) => {
        const icon = issue.severity === 'error' ? '❌' : '⚠️';
        console.log(`${index + 1}. ${icon} ${issue.patternName.toUpperCase()} (Priority: ${issue.priority})`);
        console.log(`   📝 ${issue.message}`);
        console.log(`   🎯 Expected: ${issue.expectedCva}`);
        console.log(`   📊 ${issue.totalInstances} instances across ${issue.componentsAffected.length} components`);
        console.log(`   📁 Components affected:`);
        
        issue.usageDetails.forEach(usage => {
          console.log(`      • ${usage.file} (${usage.matches}x)`);
          if (usage.examples && usage.examples.length > 0) {
            console.log(`        Example: ${usage.examples[0].substring(0, 60)}...`);
          }
        });
        console.log('');
      });

      // Migration suggestions
      console.log(`🔄 MIGRATION PRIORITY:\n`);
      const criticalIssues = this.inconsistencies.filter(i => i.severity === 'error');
      if (criticalIssues.length > 0) {
        console.log(`   🔥 HIGH PRIORITY (Critical):`);
        criticalIssues.slice(0, 3).forEach(issue => {
          console.log(`      1. Fix ${issue.patternName} in ${issue.componentsAffected.length} components`);
          console.log(`         Run: node scripts/fix-cva-standards.js`);
        });
        console.log('');
      }

      const warningIssues = this.inconsistencies.filter(i => i.severity === 'warning');
      if (warningIssues.length > 0) {
        console.log(`   ⚠️  MEDIUM PRIORITY (Warnings):`);
        warningIssues.slice(0, 3).forEach(issue => {
          console.log(`      • ${issue.patternName}: ${issue.componentsAffected.length} components`);
        });
      }
    } else {
      console.log('✅ Excellent! All components follow consistent patterns.\n');
    }

    // Summary
    if (this.inconsistencies.length > 0) {
      const criticalCount = this.inconsistencies.filter(i => i.severity === 'error').length;
      if (criticalCount > 0) {
        console.log(`🚨 ${criticalCount} critical consistency issues need immediate attention!`);
      } else {
        console.log(`⚠️  ${this.inconsistencies.length} consistency warnings found - consider standardizing.`);
      }
    }
  }
}

// Rulează validatorul
if (import.meta.url === `file://${process.argv[1]}`) {
  const validator = new ComponentConsistencyValidator();
  validator.validate().then(success => {
    if (!success) {
      process.exit(1);
    }
  }).catch(error => {
    console.error('❌ Consistency validator error:', error);
    process.exit(1);
  });
}

export default ComponentConsistencyValidator; 
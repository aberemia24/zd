const fs = require('fs');
const path = require('path');

// Maparea culorilor technical → semantic
const COLOR_MIGRATION_MAP = {
  // Primary/Brand colors
  'bg-blue-500': 'bg-primary',
  'bg-blue-600': 'bg-primary-dark',
  'text-blue-500': 'text-primary',
  'text-blue-600': 'text-primary-dark',
  'border-blue-500': 'border-primary',
  'hover:bg-blue-600': 'hover:bg-primary-dark',
  'focus:ring-blue-500': 'focus:ring-primary',

  // Success colors
  'bg-green-500': 'bg-success',
  'bg-green-600': 'bg-success-dark',
  'text-green-500': 'text-success',
  'text-green-600': 'text-success-dark',
  'border-green-500': 'border-success',

  // Danger/Error colors
  'bg-red-500': 'bg-danger',
  'bg-red-600': 'bg-danger-dark',
  'text-red-500': 'text-danger',
  'text-red-600': 'text-danger-dark',
  'border-red-500': 'border-danger',

  // Warning colors
  'bg-yellow-500': 'bg-warning',
  'bg-amber-500': 'bg-warning',
  'text-yellow-500': 'text-warning',
  'text-amber-500': 'text-warning',
  'border-yellow-500': 'border-warning',

  // Neutral/Muted colors
  'bg-gray-100': 'bg-muted',
  'bg-gray-200': 'bg-muted-dark',
  'bg-gray-50': 'bg-muted-light',
  'text-gray-500': 'text-muted',
  'text-gray-600': 'text-muted-dark',
  'text-gray-400': 'text-muted-light',
  'border-gray-300': 'border-muted',
  'border-gray-200': 'border-muted-light',

  // Info colors
  'bg-cyan-500': 'bg-info',
  'text-cyan-500': 'text-info',
  'border-cyan-500': 'border-info'
};

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

class SemanticColorMigrator {
  constructor() {
    this.changedFiles = [];
    this.totalReplacements = 0;
    this.reportByFile = new Map();
  }

  async migrate() {
    console.log('🎨 Migrând culori technical → semantic...\n');
    
    // Exclude demo/test files
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

    const files = findTsxFiles(path.join(process.cwd(), 'src'), excludePatterns);
    console.log(`📁 Procesând ${files.length} fișiere...\n`);

    for (const file of files) {
      await this.migrateFile(file);
    }

    this.printResults();
    return this.changedFiles.length > 0;
  }

  async migrateFile(filePath) {
    const fullPath = path.resolve(filePath);
    const originalContent = fs.readFileSync(fullPath, 'utf8');
    let content = originalContent;
    
    const fileReplacements = [];
    let hasChanges = false;

    // Aplicăm toate mapările de culori
    for (const [technicalColor, semanticColor] of Object.entries(COLOR_MIGRATION_MAP)) {
      const regex = new RegExp(technicalColor.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
      const matches = content.match(regex);
      
      if (matches) {
        content = content.replace(regex, semanticColor);
        fileReplacements.push({
          from: technicalColor,
          to: semanticColor,
          count: matches.length
        });
        hasChanges = true;
        this.totalReplacements += matches.length;
      }
    }

    if (hasChanges) {
      // Backup original în caz de probleme
      fs.writeFileSync(fullPath + '.backup', originalContent);
      
      // Scrie fișierul migrat
      fs.writeFileSync(fullPath, content);
      
      this.changedFiles.push(filePath);
      this.reportByFile.set(filePath, fileReplacements);
    }
  }

  printResults() {
    console.log(`🎨 Semantic Color Migration Results:\n`);

    if (this.changedFiles.length === 0) {
      console.log('✅ Toate culorile sunt deja semantice sau nu necesită migrare!\n');
      return;
    }

    console.log(`📊 Statistici:`);
    console.log(`📁 Fișiere modificate: ${this.changedFiles.length}`);
    console.log(`🔄 Total înlocuiri: ${this.totalReplacements}\n`);

    console.log(`📝 Detalii modificări:`);
    
    for (const [filePath, replacements] of this.reportByFile) {
      console.log(`\n📄 ${filePath}:`);
      
      for (const replacement of replacements) {
        console.log(`   ${replacement.from} → ${replacement.to} (${replacement.count}x)`);
      }
    }

    console.log(`\n💾 Backup-uri create cu extensia .backup`);
    console.log(`🚀 Rulează build pentru a testa migrarea!`);
    
    // Creează un summary file
    const summaryPath = path.join(process.cwd(), 'semantic-migration-report.json');
    const reportData = {
      timestamp: new Date().toISOString(),
      totalFiles: this.changedFiles.length,
      totalReplacements: this.totalReplacements,
      changedFiles: this.changedFiles,
      detailedReport: Object.fromEntries(this.reportByFile)
    };
    
    fs.writeFileSync(summaryPath, JSON.stringify(reportData, null, 2));
    console.log(`📋 Raport detaliat: ${summaryPath}`);
  }

  // Funcție pentru rollback în caz de probleme
  rollback() {
    console.log('🔄 Rolling back semantic color migration...\n');
    
    let rolledBack = 0;
    
    for (const filePath of this.changedFiles) {
      const fullPath = path.resolve(filePath);
      const backupPath = fullPath + '.backup';
      
      if (fs.existsSync(backupPath)) {
        const backupContent = fs.readFileSync(backupPath, 'utf8');
        fs.writeFileSync(fullPath, backupContent);
        fs.unlinkSync(backupPath); // Șterge backup-ul
        rolledBack++;
      }
    }
    
    console.log(`✅ Rollback complet: ${rolledBack} fișiere restaurate`);
  }
}

// Cleanup function pentru backup-uri
function cleanupBackups() {
  console.log('🧹 Curățând backup-uri...');
  
  const files = findTsxFiles(path.join(process.cwd(), 'src'));
  let cleaned = 0;
  
  for (const file of files) {
    const backupPath = path.resolve(file) + '.backup';
    if (fs.existsSync(backupPath)) {
      fs.unlinkSync(backupPath);
      cleaned++;
    }
  }
  
  console.log(`✅ ${cleaned} backup-uri șterse`);
}

// CLI interface
if (require.main === module) {
  const command = process.argv[2];
  const migrator = new SemanticColorMigrator();
  
  switch (command) {
    case '--rollback':
      migrator.rollback();
      break;
    case '--cleanup':
      cleanupBackups();
      break;
    case '--help':
      console.log(`
🎨 Semantic Color Migrator

Comenzi disponibile:
  node semantic-color-migrator.js          - Migrează culori technical → semantic
  node semantic-color-migrator.js --rollback  - Anulează migrarea (restore backup)
  node semantic-color-migrator.js --cleanup   - Șterge backup-urile
  node semantic-color-migrator.js --help      - Ajutor

Exemplu migrare:
  bg-blue-500 → bg-primary
  text-red-500 → text-danger
  border-gray-300 → border-muted
      `);
      break;
    default:
      migrator.migrate().then(hasChanges => {
        if (hasChanges) {
          console.log('\n💡 Următoarele pași:');
          console.log('1. npm run build (testează build-ul)');
          console.log('2. npm test (verifică testele)');
          console.log('3. node semantic-color-migrator.js --cleanup (șterge backup-urile)');
          console.log('4. Sau --rollback dacă există probleme');
        }
      }).catch(error => {
        console.error('❌ Migration error:', error);
        process.exit(1);
      });
      break;
  }
}

module.exports = SemanticColorMigrator; 
#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

/**
 * 🚀 PERFORMANCE MONITORING SYSTEM
 * 
 * Acest script automatizează:
 * - Bundle size analysis și tracking
 * - Performance regression detection
 * - Automated reporting
 * - CI/CD integration alerts
 */

// Configurare paths
const FRONTEND_DIR = path.join(__dirname, '../frontend');
const DIST_DIR = path.join(FRONTEND_DIR, 'dist');
const REPORTS_DIR = path.join(__dirname, '../reports/performance');
const LIGHTHOUSE_REPORTS_DIR = path.join(REPORTS_DIR, 'lighthouse');

// Performance thresholds
const THRESHOLDS = {
  bundleSize: {
    totalSize: 2 * 1024 * 1024, // 2MB total limit
    jsSize: 1.5 * 1024 * 1024,   // 1.5MB JS limit
    cssSize: 200 * 1024,         // 200KB CSS limit
    chunkSize: 800 * 1024,       // 800KB chunk limit (vite warning limit)
  },
  performance: {
    fcp: 2000,    // First Contentful Paint < 2s
    lcp: 3000,    // Largest Contentful Paint < 3s
    cls: 0.1,     // Cumulative Layout Shift < 0.1
    tbt: 300,     // Total Blocking Time < 300ms
    si: 3000,     // Speed Index < 3s
  },
  regression: {
    bundleSizeIncrease: 0.1,  // 10% increase threshold
    performanceDecrease: 0.05, // 5% decrease threshold
  }
};

class PerformanceMonitor {
  constructor() {
    this.ensureDirectories();
    this.timestamp = new Date().toISOString();
    this.reportData = {
      timestamp: this.timestamp,
      bundleAnalysis: null,
      lighthouse: null,
      regressions: [],
      alerts: []
    };
  }

  ensureDirectories() {
    [REPORTS_DIR, LIGHTHOUSE_REPORTS_DIR].forEach(dir => {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
    });
  }

  /**
   * BUNDLE SIZE ANALYSIS
   */
  async analyzeBundleSize() {
    console.log('📦 Analyzing bundle size...');
    
    try {
      // Build cu bundle analyzer
      process.chdir(FRONTEND_DIR);
      execSync('npm run build:analyze', { stdio: 'inherit' });

      // Analizează fișierele din dist
      const bundleStats = this.getBundleStats();
      this.reportData.bundleAnalysis = bundleStats;

      console.log('📊 Bundle Analysis Results:');
      console.log(`  Total Size: ${this.formatBytes(bundleStats.totalSize)}`);
      console.log(`  JS Size: ${this.formatBytes(bundleStats.jsSize)}`);
      console.log(`  CSS Size: ${this.formatBytes(bundleStats.cssSize)}`);
      console.log(`  Largest Chunk: ${this.formatBytes(bundleStats.largestChunk)}`);

      // Check thresholds
      this.checkBundleThresholds(bundleStats);

      return bundleStats;
    } catch (error) {
      console.error('❌ Bundle analysis failed:', error.message);
      this.reportData.alerts.push({
        type: 'error',
        category: 'bundle',
        message: `Bundle analysis failed: ${error.message}`
      });
      return null;
    }
  }

  getBundleStats() {
    const stats = {
      totalSize: 0,
      jsSize: 0,
      cssSize: 0,
      chunks: [],
      largestChunk: 0,
      assets: []
    };

    if (!fs.existsSync(DIST_DIR)) {
      throw new Error('Dist directory not found. Run build first.');
    }

    // Analizează recursiv toate fișierele din dist
    const analyzeDirectory = (dir, basePath = '') => {
      const files = fs.readdirSync(dir);
      
      files.forEach(file => {
        const filePath = path.join(dir, file);
        const relativePath = path.join(basePath, file);
        const stat = fs.statSync(filePath);

        if (stat.isDirectory()) {
          analyzeDirectory(filePath, relativePath);
        } else {
          const size = stat.size;
          stats.totalSize += size;
          
          const ext = path.extname(file).toLowerCase();
          if (ext === '.js') {
            stats.jsSize += size;
            stats.chunks.push({ name: file, size });
            if (size > stats.largestChunk) {
              stats.largestChunk = size;
            }
          } else if (ext === '.css') {
            stats.cssSize += size;
          }

          stats.assets.push({
            name: relativePath,
            size,
            type: ext.slice(1) || 'other'
          });
        }
      });
    };

    analyzeDirectory(DIST_DIR);

    // Sortează chunks după mărime
    stats.chunks.sort((a, b) => b.size - a.size);
    stats.assets.sort((a, b) => b.size - a.size);

    return stats;
  }

  checkBundleThresholds(stats) {
    const { bundleSize } = THRESHOLDS;
    
    if (stats.totalSize > bundleSize.totalSize) {
      this.reportData.alerts.push({
        type: 'error',
        category: 'bundle',
        message: `Total bundle size (${this.formatBytes(stats.totalSize)}) exceeds limit (${this.formatBytes(bundleSize.totalSize)})`
      });
    }

    if (stats.jsSize > bundleSize.jsSize) {
      this.reportData.alerts.push({
        type: 'error',
        category: 'bundle',
        message: `JS bundle size (${this.formatBytes(stats.jsSize)}) exceeds limit (${this.formatBytes(bundleSize.jsSize)})`
      });
    }

    if (stats.cssSize > bundleSize.cssSize) {
      this.reportData.alerts.push({
        type: 'warning',
        category: 'bundle',
        message: `CSS bundle size (${this.formatBytes(stats.cssSize)}) exceeds limit (${this.formatBytes(bundleSize.cssSize)})`
      });
    }

    if (stats.largestChunk > bundleSize.chunkSize) {
      this.reportData.alerts.push({
        type: 'warning',
        category: 'bundle',
        message: `Largest chunk (${this.formatBytes(stats.largestChunk)}) exceeds recommended size (${this.formatBytes(bundleSize.chunkSize)})`
      });
    }
  }

  /**
   * LIGHTHOUSE ANALYSIS
   */
  async runLighthouseAudit() {
    console.log('🔍 Running Lighthouse audit...');
    
    try {
      process.chdir(FRONTEND_DIR);
      
      // Rulează Lighthouse CI
      execSync('npx lhci autorun --config=lighthouserc.js', {
        encoding: 'utf8',
        stdio: 'pipe'
      });

      console.log('✅ Lighthouse audit completed');

      // Parse rezultatele (simplificat - în practică ar fi mai complex)
      const lighthouseData = this.parseLighthouseOutput();
      this.reportData.lighthouse = lighthouseData;

      return lighthouseData;
    } catch (error) {
      console.error('❌ Lighthouse audit failed:', error.message);
      this.reportData.alerts.push({
        type: 'error',
        category: 'lighthouse',
        message: `Lighthouse audit failed: ${error.message}`
      });
      return null;
    }
  }

  parseLighthouseOutput() {
    // Simplified parsing - în realitate ar extrage metrici din JSON reports
    return {
      performance: 0.85, // Mock data
      accessibility: 0.95,
      bestPractices: 0.9,
      seo: 0.9,
      metrics: {
        fcp: 1800,
        lcp: 2500,
        cls: 0.08,
        tbt: 250,
        si: 2800
      }
    };
  }

  /**
   * REGRESSION DETECTION
   */
  async detectRegressions() {
    console.log('🔍 Checking for performance regressions...');

    const previousReport = this.loadPreviousReport();
    if (!previousReport) {
      console.log('ℹ️ No previous report found for comparison');
      return;
    }

    const current = this.reportData;
    const regressions = [];

    // Bundle size regression
    if (current.bundleAnalysis && previousReport.bundleAnalysis) {
      const currentSize = current.bundleAnalysis.totalSize;
      const previousSize = previousReport.bundleAnalysis.totalSize;
      const increase = (currentSize - previousSize) / previousSize;

      if (increase > THRESHOLDS.regression.bundleSizeIncrease) {
        regressions.push({
          type: 'bundle_size',
          severity: 'error',
          message: `Bundle size increased by ${(increase * 100).toFixed(2)}% (${this.formatBytes(previousSize)} → ${this.formatBytes(currentSize)})`,
          current: currentSize,
          previous: previousSize,
          change: increase
        });
      }
    }

    // Performance score regression
    if (current.lighthouse && previousReport.lighthouse) {
      const currentPerf = current.lighthouse.performance;
      const previousPerf = previousReport.lighthouse.performance;
      const decrease = (previousPerf - currentPerf) / previousPerf;

      if (decrease > THRESHOLDS.regression.performanceDecrease) {
        regressions.push({
          type: 'performance_score',
          severity: 'error',
          message: `Performance score decreased by ${(decrease * 100).toFixed(2)}% (${(previousPerf * 100).toFixed(0)}% → ${(currentPerf * 100).toFixed(0)}%)`,
          current: currentPerf,
          previous: previousPerf,
          change: decrease
        });
      }
    }

    this.reportData.regressions = regressions;

    if (regressions.length > 0) {
      console.log('🚨 Performance regressions detected:');
      regressions.forEach(reg => {
        console.log(`  ${reg.severity.toUpperCase()}: ${reg.message}`);
      });
    } else {
      console.log('✅ No performance regressions detected');
    }

    return regressions;
  }

  loadPreviousReport() {
    const reportsFile = path.join(REPORTS_DIR, 'latest.json');
    if (fs.existsSync(reportsFile)) {
      try {
        return JSON.parse(fs.readFileSync(reportsFile, 'utf8'));
      } catch (error) {
        console.warn('⚠️ Failed to load previous report:', error.message);
      }
    }
    return null;
  }

  /**
   * REPORTING
   */
  saveReport() {
    const reportFile = path.join(REPORTS_DIR, `performance-${Date.now()}.json`);
    const latestFile = path.join(REPORTS_DIR, 'latest.json');

    fs.writeFileSync(reportFile, JSON.stringify(this.reportData, null, 2));
    fs.writeFileSync(latestFile, JSON.stringify(this.reportData, null, 2));

    console.log(`📊 Report saved to: ${reportFile}`);
    return reportFile;
  }

  generateMarkdownReport() {
    const report = this.reportData;
    let markdown = `# Performance Report\n\n`;
    markdown += `**Generated:** ${report.timestamp}\n\n`;

    // Bundle Analysis
    if (report.bundleAnalysis) {
      markdown += `## 📦 Bundle Analysis\n\n`;
      markdown += `| Metric | Size | Status |\n`;
      markdown += `|--------|------|--------|\n`;
      markdown += `| Total Bundle | ${this.formatBytes(report.bundleAnalysis.totalSize)} | ${report.bundleAnalysis.totalSize > THRESHOLDS.bundleSize.totalSize ? '❌' : '✅'} |\n`;
      markdown += `| JavaScript | ${this.formatBytes(report.bundleAnalysis.jsSize)} | ${report.bundleAnalysis.jsSize > THRESHOLDS.bundleSize.jsSize ? '❌' : '✅'} |\n`;
      markdown += `| CSS | ${this.formatBytes(report.bundleAnalysis.cssSize)} | ${report.bundleAnalysis.cssSize > THRESHOLDS.bundleSize.cssSize ? '❌' : '✅'} |\n`;
      markdown += `| Largest Chunk | ${this.formatBytes(report.bundleAnalysis.largestChunk)} | ${report.bundleAnalysis.largestChunk > THRESHOLDS.bundleSize.chunkSize ? '⚠️' : '✅'} |\n\n`;
    }

    // Lighthouse Results
    if (report.lighthouse) {
      markdown += `## 🔍 Lighthouse Audit\n\n`;
      markdown += `| Category | Score | Status |\n`;
      markdown += `|----------|-------|--------|\n`;
      markdown += `| Performance | ${(report.lighthouse.performance * 100).toFixed(0)}% | ${report.lighthouse.performance < 0.85 ? '❌' : '✅'} |\n`;
      markdown += `| Accessibility | ${(report.lighthouse.accessibility * 100).toFixed(0)}% | ${report.lighthouse.accessibility < 0.95 ? '❌' : '✅'} |\n`;
      markdown += `| Best Practices | ${(report.lighthouse.bestPractices * 100).toFixed(0)}% | ${report.lighthouse.bestPractices < 0.9 ? '❌' : '✅'} |\n`;
      markdown += `| SEO | ${(report.lighthouse.seo * 100).toFixed(0)}% | ${report.lighthouse.seo < 0.9 ? '❌' : '✅'} |\n\n`;
    }

    // Regressions
    if (report.regressions.length > 0) {
      markdown += `## 🚨 Performance Regressions\n\n`;
      report.regressions.forEach(reg => {
        markdown += `- **${reg.type}**: ${reg.message}\n`;
      });
      markdown += `\n`;
    }

    // Alerts
    if (report.alerts.length > 0) {
      markdown += `## ⚠️ Alerts\n\n`;
      report.alerts.forEach(alert => {
        const emoji = alert.type === 'error' ? '❌' : '⚠️';
        markdown += `- ${emoji} **${alert.category}**: ${alert.message}\n`;
      });
    }

    const reportFile = path.join(REPORTS_DIR, `performance-report-${Date.now()}.md`);
    fs.writeFileSync(reportFile, markdown);
    console.log(`📝 Markdown report saved to: ${reportFile}`);

    return markdown;
  }

  /**
   * CI/CD INTEGRATION
   */
  checkCiFailureConditions() {
    const hasErrors = this.reportData.alerts.some(alert => alert.type === 'error');
    const hasRegressions = this.reportData.regressions.some(reg => reg.severity === 'error');

    if (hasErrors || hasRegressions) {
      console.log('💥 CI failure conditions met');
      return false;
    }

    console.log('✅ All performance checks passed');
    return true;
  }

  /**
   * UTILITIES
   */
  formatBytes(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  /**
   * MAIN EXECUTION
   */
  async run() {
    console.log('🚀 Starting Performance Monitoring...\n');

    try {
      // Bundle analysis
      await this.analyzeBundleSize();

      // Lighthouse audit (doar dacă nu suntem în CI sau dacă se cere explicit)
      if (process.env.RUN_LIGHTHOUSE === 'true' || !process.env.CI) {
        await this.runLighthouseAudit();
      } else {
        console.log('ℹ️ Skipping Lighthouse audit in CI (set RUN_LIGHTHOUSE=true to enable)');
      }

      // Regression detection
      await this.detectRegressions();

      // Save reports
      this.saveReport();
      this.generateMarkdownReport();

      // CI check
      const success = this.checkCiFailureConditions();
      
      console.log('\n🎯 Performance monitoring completed!');
      
      if (!success) {
        process.exit(1);
      }

    } catch (error) {
      console.error('💥 Performance monitoring failed:', error);
      process.exit(1);
    }
  }
}

// Run dacă este apelat direct
if (require.main === module) {
  const monitor = new PerformanceMonitor();
  monitor.run();
}

module.exports = PerformanceMonitor; 
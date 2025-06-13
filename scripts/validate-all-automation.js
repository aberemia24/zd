#!/usr/bin/env node

/**
 * Script: validate-all-automation.js
 * Master script pentru toate validările automate - Faza 5 complete
 * Rulează toate script-urile de validare și sumarizează rezultatele
 */

import { spawn  } from 'child_process';

console.log('🚀 Running complete automation validation suite...\n');

// Script-uri de rulat în ordine (prin npm run)
const VALIDATION_SCRIPTS = [
  {
    name: 'Shared Constants Sync',
    npmScript: 'validate:constants',
    description: 'Verifică sincronizarea shared-constants și string-uri hardcodate'
  },
  {
    name: 'Shared Constants Usage',
    npmScript: 'validate:shared-constants',
    description: 'Validează import-uri @shared-constants și elimină string-uri hardcodate'
  },
  {
    name: 'Data TestID Consistency',
    npmScript: 'validate:data-testid',
    description: 'Verifică consistența data-testid între componente și teste'
  },
  {
    name: 'Barrel Imports',
    npmScript: 'validate:barrel-imports',
    description: 'Validează folosirea corectă a barrel files pentru import-uri'
  },
  // Data TestID Coverage - nu există script check-data-testid.js, probabil se referă la consistența de mai sus
  // {
  //   name: 'Data TestID Coverage',
  //   script: 'check-data-testid.js',
  //   description: 'Verifică coverage-ul data-testid pentru elemente interactive'
  // },
  // ❌ Console Cleanup commented out pentru development - console.log-uri sunt utile pentru debugging
  // {
  //   name: 'Console Cleanup',
  //   npmScript: 'validate:console-cleanup',
  //   description: 'Detectează console.log/debug statements care trebuie eliminate pentru production'
  // },
  {
    name: 'JSX Extensions',
    npmScript: 'validate:jsx-extensions',
    description: 'Verifică că fișierele cu JSX folosesc extensia .tsx conform code-standards'
  },
  {
    name: 'TypeScript Quality',
    npmScript: 'validate:typescript-quality',
    description: 'Validează calitatea TypeScript: any/unknown usage, type assertions'
  },
  {
    name: 'Transaction Types',
    npmScript: 'validate:transaction-types',
    description: 'Verifică că transaction types folosesc enum-uri în loc de string-uri hardcodate'
  },
  {
    name: 'CVA Standards',
    npmScript: 'validate:cva-standards', 
    description: 'Validează pattern-uri CVA complexe și standardizarea componentelor'
  },
  {
    name: 'CVA Imports',
    npmScript: 'validate:cva-imports',
    description: 'Verifică import-uri CVA și anti-patterns în modularitate'
  },
  {
    name: 'Component Consistency',
    npmScript: 'validate:component-consistency',
    description: 'Validează consistența pattern-urilor cross-component'
  }
];

function runScript(scriptInfo) {
  return new Promise((resolve) => {
    const child = spawn('npm', ['run', scriptInfo.npmScript], { 
      stdio: ['pipe', 'pipe', 'pipe'],
      shell: true 
    });
    
    let stdout = '';
    let stderr = '';
    
    child.stdout.on('data', (data) => {
      stdout += data.toString();
    });
    
    child.stderr.on('data', (data) => {
      stderr += data.toString();
    });
    
    child.on('close', (code) => {
      resolve({
        name: scriptInfo.name,
        description: scriptInfo.description,
        exitCode: code,
        stdout: stdout,
        stderr: stderr,
        passed: code === 0
      });
    });
  });
}

function formatResults(results) {
  console.log('📊 AUTOMATION VALIDATION RESULTS\n');
  console.log('═'.repeat(60));
  
  const passed = results.filter(r => r.passed);
  const failed = results.filter(r => !r.passed);
  
  // Summary
  console.log(`✅ PASSED: ${passed.length}/${results.length}`);
  console.log(`❌ FAILED: ${failed.length}/${results.length}`);
  console.log('═'.repeat(60));
  
  // Detailed results
  results.forEach((result, index) => {
    const status = result.passed ? '✅' : '❌';
    console.log(`\n${index + 1}. ${status} ${result.name}`);
    console.log(`   📋 ${result.description}`);
    
    if (!result.passed) {
      console.log(`   🚨 Exit code: ${result.exitCode}`);
      
      // Extract key error lines (not full output to avoid spam)
      const errorLines = result.stdout.split('\n')
        .filter(line => line.includes('❌') || line.includes('🚨') || line.includes('FAILED'))
        .slice(0, 3); // Max 3 error lines per script
      
      if (errorLines.length > 0) {
        console.log('   📄 Key issues:');
        errorLines.forEach(line => {
          console.log(`     ${line.trim()}`);
        });
      }
    }
  });
  
  console.log('\n' + '═'.repeat(60));
  
  if (failed.length === 0) {
    console.log('🎉 ALL AUTOMATION VALIDATIONS PASSED!');
    console.log('🎯 Code quality automation: EXCELLENT');
    return true;
  } else {
    console.log('🚨 AUTOMATION VALIDATIONS FAILED');
    console.log(`💡 Fix ${failed.length} validation issue(s) and re-run`);
    console.log('\n📖 To run individual validations:');
    failed.forEach(f => {
      const scriptName = f.name.toLowerCase().replace(/\s+/g, '-');
      console.log(`   npm run validate:${scriptName === 'shared-constants-sync' ? 'constants' : scriptName.replace('shared-constants-', 'shared-constants').replace('data-testid-', 'data-testid').replace('barrel-', 'barrel-')}`);
    });
    return false;
  }
}

async function main() {
  const startTime = Date.now();
  const results = [];
  
  for (const script of VALIDATION_SCRIPTS) {
    console.log(`🔍 Running: ${script.name}...`);
    const result = await runScript(script);
    results.push(result);
    
    // Show brief status
    const status = result.passed ? '✅ PASS' : '❌ FAIL';
    console.log(`   ${status}\n`);
  }
  
  const endTime = Date.now();
  const duration = ((endTime - startTime) / 1000).toFixed(1);
  
  console.log(`⏱️  Total validation time: ${duration}s\n`);
  
  const allPassed = formatResults(results);
  
  if (!allPassed) {
    process.exit(1);
  }
}

// Auto-run when called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(error => {
    console.error('🚨 Automation validation failed with error:', error);
    process.exit(1);
  });
}

export {  runScript, formatResults  }; 
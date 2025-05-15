/**
 * Script pentru verificarea existenței funcțiilor și metodelor necesare în stores
 * pentru implementarea TanStack Table în LunarGrid.
 * 
 * Rulare: node scripts/verify-functions.js
 */

const requiredTransactionFunctions = [
  'transactions',
  'loading',
  'error',
  'total',
  'fetchTransactions',
  'refresh',
  'saveTransaction',
  'removeTransaction',
  'setQueryParams',
  '_invalidateMonthCache',
  '_getDateInterval',
];

const requiredCategoryFunctions = [
  'categories',
  'loadUserCategories',
  'saveCategories',
  'renameSubcategory',
  'deleteSubcategory',
  'getSubcategoryCount',
];

const requiredAuthFunctions = [
  'user',
  'loading',
  'checkUser',
];

const requiredTypes = [
  'TransactionValidated',
  'CustomCategory',
  'TransactionQueryParamsWithRecurring'
];

const requiredPackages = [
  '@tanstack/react-table',
  '@tanstack/table-core'
];

function verifyFunctions() {
  try {
    console.log('Verificare funcții și metode necesare pentru TanStack Table în LunarGrid...\n');
    
    // Import stores
    console.log('Importare stores...');
    const transactionStore = require('../frontend/src/stores/transactionStore').useTransactionStore;
    const categoryStore = require('../frontend/src/stores/categoryStore').useCategoryStore;
    const authStore = require('../frontend/src/stores/authStore').useAuthStore;
    console.log('✅ Toate store-urile au fost importate cu succes!\n');
    
    // Verificare funcții din transactionStore
    console.log('Verificare funcții din transactionStore...');
    const transactionState = transactionStore.getState();
    const missingTransactionFunctions = requiredTransactionFunctions.filter(
      fn => typeof transactionState[fn] === 'undefined'
    );
    
    if (missingTransactionFunctions.length > 0) {
      console.error('❌ FUNCȚII LIPSĂ ÎN TRANSACTION STORE:', missingTransactionFunctions);
      process.exit(1);
    }
    console.log('✅ Toate funcțiile necesare există în transactionStore!\n');
    
    // Verificare funcții din categoryStore
    console.log('Verificare funcții din categoryStore...');
    const categoryState = categoryStore.getState();
    const missingCategoryFunctions = requiredCategoryFunctions.filter(
      fn => typeof categoryState[fn] === 'undefined'
    );
    
    if (missingCategoryFunctions.length > 0) {
      console.error('❌ FUNCȚII LIPSĂ ÎN CATEGORY STORE:', missingCategoryFunctions);
      process.exit(1);
    }
    console.log('✅ Toate funcțiile necesare există în categoryStore!\n');
    
    // Verificare funcții din authStore
    console.log('Verificare funcții din authStore...');
    const authState = authStore.getState();
    const missingAuthFunctions = requiredAuthFunctions.filter(
      fn => typeof authState[fn] === 'undefined'
    );
    
    if (missingAuthFunctions.length > 0) {
      console.error('❌ FUNCȚII LIPSĂ ÎN AUTH STORE:', missingAuthFunctions);
      process.exit(1);
    }
    console.log('✅ Toate funcțiile necesare există în authStore!\n');
    
    // Verificare dependențe în package.json
    console.log('Verificare dependențe TanStack Table...');
    const packageJson = require('../frontend/package.json');
    const dependencies = { ...packageJson.dependencies, ...packageJson.devDependencies };
    
    const missingPackages = requiredPackages.filter(
      pkg => !Object.keys(dependencies).includes(pkg)
    );
    
    if (missingPackages.length > 0) {
      console.warn('⚠️ PACHETE LIPSĂ ÎN package.json:', missingPackages);
      console.log('Pentru a instala pachetele lipsă, rulați:');
      console.log(`npm install ${missingPackages.join(' ')} --save`);
    } else {
      console.log('✅ Toate pachetele necesare pentru TanStack Table sunt instalate!\n');
    }
    
    // Verificare path mapping pentru @shared-constants în tsconfig.json
    console.log('Verificare configurare path mapping în tsconfig.json...');
    const tsConfig = require('../frontend/tsconfig.json');
    const paths = tsConfig.compilerOptions?.paths || {};
    
    if (!paths['@shared-constants'] && !paths['@shared-constants/*']) {
      console.error('❌ LIPSĂ PATH MAPPING pentru @shared-constants în tsconfig.json!');
      process.exit(1);
    }
    console.log('✅ Path mapping corect configurat pentru @shared-constants!\n');
    
    console.log('✅ TOATE VERIFICĂRILE AU TRECUT CU SUCCES! Implementarea poate continua.');
    
  } catch (error) {
    console.error('Eroare în timpul verificării:', error);
    process.exit(1);
  }
}

verifyFunctions();

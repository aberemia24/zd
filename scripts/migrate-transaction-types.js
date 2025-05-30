#!/usr/bin/env node

/**
 * Script pentru migrarea tipurilor de tranzacții din lowercase în uppercase
 * 
 * Corectează problema cu tranzacțiile vechi salvate cu "expense", "income", "saving"
 * și le convertește în "EXPENSE", "INCOME", "SAVING" conform enum-urilor.
 * 
 * Rulare: node scripts/migrate-transaction-types.js
 */

const { createClient } = require('@supabase/supabase-js');

// Configurare Supabase - folosește variabilele de mediu
const SUPABASE_URL = process.env.SUPABASE_URL || 'https://pzyvibdgpfgohvewdmit.supabase.co';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_ANON_KEY;

if (!SUPABASE_SERVICE_KEY) {
  console.error('❌ SUPABASE_SERVICE_KEY or SUPABASE_ANON_KEY is required');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

// Mapping pentru corectarea tipurilor
const TYPE_MAPPING = {
  'expense': 'EXPENSE',
  'income': 'INCOME', 
  'saving': 'SAVING'
};

/**
 * Verifică câte tranzacții au tipuri lowercase
 */
async function checkIncorrectTypes() {
  console.log('🔍 Verificăm tranzacțiile cu tipuri lowercase...\n');
  
  const results = {};
  
  for (const [oldType, newType] of Object.entries(TYPE_MAPPING)) {
    const { error, count } = await supabase
      .from('transactions')
      .select('id', { count: 'exact', head: true })
      .eq('type', oldType);
      
    if (error) {
      console.error(`❌ Eroare la verificarea tipului '${oldType}':`, error.message);
      continue;
    }
    
    results[oldType] = count || 0;
    if (count > 0) {
      console.log(`📊 Tipul '${oldType}' → '${newType}': ${count} tranzacții`);
    }
  }
  
  const totalIncorrect = Object.values(results).reduce((sum, count) => sum + count, 0);
  console.log(`\n📈 Total tranzacții de corectat: ${totalIncorrect}`);
  
  return { results, totalIncorrect };
}

/**
 * Migrează tipurile de tranzacții
 */
async function migrateTransactionTypes(dryRun = true) {
  const { results, totalIncorrect } = await checkIncorrectTypes();
  
  if (totalIncorrect === 0) {
    console.log('✅ Toate tipurile sunt deja corecte!');
    return;
  }
  
  if (dryRun) {
    console.log('\n🔍 DRY RUN - Nu se fac modificări reale');
    console.log('Pentru a aplica modificările, rulați: node scripts/migrate-transaction-types.js --apply\n');
    return;
  }
  
  console.log('\n🚀 Începem migrarea...\n');
  
  let totalUpdated = 0;
  
  for (const [oldType, newType] of Object.entries(TYPE_MAPPING)) {
    const count = results[oldType];
    if (count === 0) continue;
    
    console.log(`🔄 Migrare ${oldType} → ${newType} (${count} tranzacții)...`);
    
    const { data, error } = await supabase
      .from('transactions')
      .update({ type: newType })
      .eq('type', oldType)
      .select('id');
    
    if (error) {
      console.error(`❌ Eroare la migrarea tipului '${oldType}':`, error.message);
      continue;
    }
    
    const updated = data?.length || 0;
    totalUpdated += updated;
    console.log(`✅ ${updated} tranzacții actualizate pentru tipul ${newType}`);
  }
  
  console.log(`\n🎉 Migrare completă! ${totalUpdated} tranzacții actualizate.`);
}

/**
 * Verifică rezultatul migrării
 */
async function verifyMigration() {
  console.log('\n🔍 Verificăm rezultatul migrării...\n');
  
  // Verifică tipuri corecte (uppercase)
  const correctTypes = Object.values(TYPE_MAPPING);
  for (const type of correctTypes) {
    const { count, error } = await supabase
      .from('transactions')
      .select('id', { count: 'exact', head: true })
      .eq('type', type);
      
    if (error) {
      console.error(`❌ Eroare la verificarea tipului '${type}':`, error.message);
      continue;
    }
    
    console.log(`✅ Tipul '${type}': ${count} tranzacții`);
  }
  
  // Verifică dacă mai sunt tipuri lowercase
  const { results } = await checkIncorrectTypes();
  const remaining = Object.values(results).reduce((sum, count) => sum + count, 0);
  
  if (remaining === 0) {
    console.log('\n🎉 Toate tipurile sunt acum corecte!');
  } else {
    console.log(`\n⚠️  Mai sunt ${remaining} tranzacții cu tipuri incorecte`);
  }
}

/**
 * Funcția principală
 */
async function main() {
  const args = process.argv.slice(2);
  const shouldApply = args.includes('--apply');
  const shouldVerify = args.includes('--verify');
  
  console.log('🔧 MIGRATION SCRIPT - Transaction Types Cleanup\n');
  
  if (shouldVerify) {
    await verifyMigration();
    return;
  }
  
  try {
    await migrateTransactionTypes(!shouldApply);
    
    if (shouldApply) {
      console.log('\nAșteptăm 2 secunde...');
      await new Promise(resolve => setTimeout(resolve, 2000));
      await verifyMigration();
    }
  } catch (error) {
    console.error('❌ Eroare critică:', error.message);
    process.exit(1);
  }
}

// Rulează scriptul dacă este apelat direct
if (require.main === module) {
  main();
}

module.exports = { migrateTransactionTypes, checkIncorrectTypes, verifyMigration }; 
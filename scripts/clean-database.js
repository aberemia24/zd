#!/usr/bin/env node

/**
 * Script pentru curățarea completă a bazei de date
 * 
 * ATENȚIE: Șterge TOATE tranzacțiile din baza de date!
 * 
 * Rulare: node scripts/clean-database.js --confirm
 */

const { createClient } = require('@supabase/supabase-js');

// Configurare Supabase - folosește valorile hardcodate pentru development
const SUPABASE_URL = 'https://pzyvibdgpfgohvewdmit.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB6eXZpYmRncGZnb2h2ZXdkbWl0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDYwMTM4NDgsImV4cCI6MjA2MTU4OTg0OH0.fEV2KYNTqqPF6Lk2lqA8ZS88E7U9aWLEEiH8PmO6LW0';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

/**
 * Verifică câte tranzacții există în baza de date
 */
async function checkTransactionCount() {
  console.log('🔍 Verificăm numărul de tranzacții în baza de date...\n');
  
  const { count, error } = await supabase
    .from('transactions')
    .select('id', { count: 'exact', head: true });
    
  if (error) {
    console.error('❌ Eroare la verificarea tranzacțiilor:', error.message);
    return 0;
  }
  
  console.log(`📊 Total tranzacții în baza de date: ${count || 0}`);
  return count || 0;
}

/**
 * Șterge toate tranzacțiile din baza de date
 */
async function cleanDatabase() {
  const count = await checkTransactionCount();
  
  if (count === 0) {
    console.log('✅ Baza de date este deja curată!');
    return;
  }
  
  console.log('\n🚨 ATENȚIE: Vei șterge TOATE tranzacțiile din baza de date!');
  console.log('🔥 Această operație este IREVERSIBILĂ!\n');
  
  const args = process.argv.slice(2);
  if (!args.includes('--confirm')) {
    console.log('❌ Pentru a confirma ștergerea, rulează:');
    console.log('   node scripts/clean-database.js --confirm\n');
    return;
  }
  
  console.log('🚀 Începem curățarea bazei de date...\n');
  
  const { error } = await supabase
    .from('transactions')
    .delete()
    .neq('id', '00000000-0000-0000-0000-000000000000'); // Șterge toate (folosind o condiție care va match pe toate)
  
  if (error) {
    console.error('❌ Eroare la ștergerea tranzacțiilor:', error.message);
    return;
  }
  
  console.log('✅ Toate tranzacțiile au fost șterse cu succes!');
  
  // Verifică din nou pentru confirmare
  const remainingCount = await checkTransactionCount();
  
  if (remainingCount === 0) {
    console.log('\n🎉 Baza de date a fost curățată complet!');
    console.log('💡 Acum poți adăuga tranzacții noi cu tipurile corecte.');
  } else {
    console.log(`\n⚠️  Mai sunt ${remainingCount} tranzacții în baza de date`);
  }
}

/**
 * Funcția principală
 */
async function main() {
  console.log('🧹 DATABASE CLEANUP SCRIPT\n');
  
  try {
    await cleanDatabase();
  } catch (error) {
    console.error('❌ Eroare critică:', error.message);
    process.exit(1);
  }
}

// Rulează scriptul dacă este apelat direct
if (require.main === module) {
  main();
}

module.exports = { cleanDatabase, checkTransactionCount }; 
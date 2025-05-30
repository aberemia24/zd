/**
 * Script pentru curățarea tranzacțiilor duplicate pentru utilizatorul curent
 * Găsește tranzacții cu aceeași cheie (category-subcategory-date) și păstrează doar cea mai recentă
 */

import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Găsește calea către directorul curent și apoi către frontend
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const frontendDir = path.join(__dirname, '..', 'frontend');

// Încarcă variabilele de mediu din frontend/.env.local
dotenv.config({ path: path.join(frontendDir, '.env.local') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY; // Folosim anon key

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Missing Supabase credentials in .env file');
  console.error('   Need: VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Pentru a accesa datele, trebuie să ne autentificăm ca utilizator
async function authenticateUser() {
  // Încearcă să obții utilizatorul curent din sesiune
  const { data: { user } } = await supabase.auth.getUser();
  
  if (user) {
    console.log(`✅ Authenticated as user: ${user.email} (ID: ${user.id.substring(0, 8)}...)`);
    return user;
  }

  // Dacă nu există sesiune, încearcă autentificare cu credentialele din .env
  const userEmail = process.env.USER_EMAIL;
  const userPassword = process.env.USER_PASSWORD;

  if (userEmail && userPassword) {
    console.log('🔐 Attempting authentication with provided credentials...');
    const { data, error } = await supabase.auth.signInWithPassword({
      email: userEmail,
      password: userPassword,
    });

    if (error) {
      console.error('❌ Authentication failed:', error.message);
      process.exit(1);
    }

    console.log(`✅ Authenticated as user: ${data.user.email} (ID: ${data.user.id.substring(0, 8)}...)`);
    return data.user;
  }

  console.error('❌ No authenticated user found');
  console.error('   Please either:');
  console.error('   1. Be logged in to the application, or');
  console.error('   2. Add USER_EMAIL and USER_PASSWORD to your .env file');
  process.exit(1);
}

async function findDuplicateTransactions(userId) {
  console.log('🔍 Searching for duplicate transactions...');
  
  try {
    // Găsește toate tranzacțiile pentru utilizatorul curent
    const { data: transactions, error } = await supabase
      .from('transactions')
      .select('id, amount, category, subcategory, date, created_at, updated_at, user_id')
      .eq('user_id', userId)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('❌ Error fetching transactions:', error);
      return [];
    }

    console.log(`📊 Found ${transactions.length} total transactions for current user`);

    // Grupează pe cheie (category-subcategory-date) - fără user_id căci e același utilizator
    const groups = new Map();
    
    transactions.forEach(t => {
      const key = `${t.category || ''}-${t.subcategory || ''}-${t.date}`;
      if (!groups.has(key)) {
        groups.set(key, []);
      }
      groups.get(key).push(t);
    });

    // Identifică duplicate-urile
    const duplicates = [];
    let totalDuplicates = 0;

    for (const [key, groupTransactions] of groups) {
      if (groupTransactions.length > 1) {
        // Sortează după updated_at desc, apoi created_at desc pentru a găsi cea mai recentă
        groupTransactions.sort((a, b) => {
          const aTime = new Date(a.updated_at || a.created_at).getTime();
          const bTime = new Date(b.updated_at || b.created_at).getTime();
          return bTime - aTime; // Descending - cea mai recentă primul
        });

        const toKeep = groupTransactions[0]; // Cea mai recentă
        const toDelete = groupTransactions.slice(1); // Restul

        duplicates.push({
          key,
          count: groupTransactions.length,
          toKeep,
          toDelete,
          amounts: groupTransactions.map(t => t.amount),
          ids: groupTransactions.map(t => t.id.substring(0, 8)),
          dates: groupTransactions.map(t => ({
            created: t.created_at,
            updated: t.updated_at
          }))
        });

        totalDuplicates += toDelete.length;
      }
    }

    console.log(`🔍 Found ${duplicates.length} groups with duplicates`);
    console.log(`🗑️  Total transactions to delete: ${totalDuplicates}`);

    return duplicates;
  } catch (error) {
    console.error('❌ Error in findDuplicateTransactions:', error);
    return [];
  }
}

async function cleanupDuplicates(duplicates, dryRun = true) {
  if (dryRun) {
    console.log('\n🧪 DRY RUN - No actual deletions will be performed');
  } else {
    console.log('\n🔥 LIVE RUN - Deletions will be performed!');
  }

  let deletedCount = 0;

  for (const duplicate of duplicates) {
    console.log(`\n📍 Key: ${duplicate.key}`);
    console.log(`   Count: ${duplicate.count} transactions`);
    console.log(`   Amounts: [${duplicate.amounts.join(', ')}]`);
    console.log(`   Keeping: ID ${duplicate.toKeep.id.substring(0, 8)} (amount: ${duplicate.toKeep.amount}, updated: ${duplicate.toKeep.updated_at || duplicate.toKeep.created_at})`);
    console.log(`   Deleting: ${duplicate.toDelete.length} transactions`);

    if (!dryRun) {
      // Șterge tranzacțiile duplicate
      const idsToDelete = duplicate.toDelete.map(t => t.id);
      
      const { error } = await supabase
        .from('transactions')
        .delete()
        .in('id', idsToDelete);

      if (error) {
        console.error(`   ❌ Error deleting transactions for key ${duplicate.key}:`, error);
      } else {
        console.log(`   ✅ Deleted ${idsToDelete.length} transactions`);
        deletedCount += idsToDelete.length;
      }
    } else {
      console.log(`   🧪 Would delete: ${duplicate.toDelete.map(t => t.id.substring(0, 8)).join(', ')}`);
    }
  }

  if (!dryRun) {
    console.log(`\n🎉 Cleanup complete! Deleted ${deletedCount} duplicate transactions.`);
  } else {
    console.log(`\n🧪 Dry run complete! Would delete ${duplicates.reduce((sum, d) => sum + d.toDelete.length, 0)} transactions.`);
  }
}

async function main() {
  const args = process.argv.slice(2);
  const dryRun = !args.includes('--execute');

  console.log('🧹 Duplicate Transaction Cleanup Tool (User Scope)');
  console.log('===================================================');

  if (dryRun) {
    console.log('ℹ️  Running in DRY RUN mode. Use --execute to perform actual cleanup.');
  }

  const user = await authenticateUser();
  const duplicates = await findDuplicateTransactions(user.id);

  if (duplicates.length === 0) {
    console.log('✅ No duplicate transactions found!');
    return;
  }

  // Afișează top 10 cele mai problematice chei
  console.log('\n📊 Top 10 most problematic keys:');
  duplicates
    .sort((a, b) => b.count - a.count)
    .slice(0, 10)
    .forEach((d, i) => {
      console.log(`${i + 1}. ${d.key} (${d.count} transactions, amounts: [${d.amounts.join(', ')}])`);
    });

  await cleanupDuplicates(duplicates, dryRun);

  if (dryRun) {
    console.log('\n💡 To execute the cleanup, run: node scripts/cleanup-duplicate-transactions.js --execute');
  }
}

main().catch(console.error); 
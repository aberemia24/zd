/**
 * Script pentru popularea bazei de date cu tranzacții realiste în Mai 2025
 * Rulare: cd frontend && node scripts/populate-transactions-mai-2025.js
 * 
 * Cerințe: 
 * - ~50 tranzacții în mai 2025
 * - Sume între 5-20.000 lei
 * - 1 singur venit (salariu 20.000 lei)
 * - Restul cheltuieli și investiții realiste
 */

const { createClient } = require('@supabase/supabase-js');

// Configurație
const CONFIG = {
  SUPABASE_URL: 'https://pzyvibdgpfgohvewdmit.supabase.co',
  SUPABASE_ANON_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB6eXZpYmRncGZnb2h2ZXdkbWl0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NjAxMzg0OCwiZXhwIjoyMDYxNTg5ODQ4fQ.cNW7S_E4taD4HRpupo82LPsSrKlGb-2K4C-f7x0fZZ0',
  USER_ID: 'ca4931ec-b3b2-4084-9553-be3ad6f694a2',
  YEAR: 2025,
  MONTH: 5, // Mai
  TARGET_TRANSACTIONS: 50,
  CURRENCY: 'RON'
};

// Inițializare Supabase
const supabase = createClient(CONFIG.SUPABASE_URL, CONFIG.SUPABASE_ANON_KEY);

// Template-uri realiste pentru tranzacții
const TRANSACTION_TEMPLATES = [
  // === VENIT - DOAR 1 TRANZACȚIE ===
  {
    type: 'INCOME',
    category: 'VENITURI',
    subcategory: 'Salarii',
    amount: [20000, 20000],
    descriptions: ['Salariu lunar mai 2025'],
    frequency: 1,
    probability: 1.0 // 100% șanse să apară
  },

  // === CHELTUIELI FRECVENTE - NUTRIȚIE ===
  {
    type: 'EXPENSE',
    category: 'NUTRITIE',
    subcategory: 'Alimente',
    amount: [45, 280],
    descriptions: ['Kaufland - cumpărături', 'Carrefour - alimente', 'Mega Image', 'Lidl - săptămânal', 'Piața centrală - legume'],
    frequency: 8,
    probability: 1.0
  },
  {
    type: 'EXPENSE',
    category: 'NUTRITIE',
    subcategory: 'Restaurante',
    amount: [35, 140],
    descriptions: ['Restaurant Central - prânz', 'McDonald\'s - cină', 'Pizza Hut - weekend', 'Crama Domnească'],
    frequency: 4,
    probability: 0.9
  },
  {
    type: 'EXPENSE',
    category: 'NUTRITIE',
    subcategory: 'Cafea',
    amount: [8, 25],
    descriptions: ['Starbucks', 'Coffee2Go', 'Cafenea locală', 'Espresso', 'Cappuccino la birou'],
    frequency: 5,
    probability: 0.8
  },
  {
    type: 'EXPENSE',
    category: 'NUTRITIE',
    subcategory: 'Comenzi',
    amount: [40, 120],
    descriptions: ['Glovo - pizza seară', 'FoodPanda - burger', 'Tazz - sushi', 'UberEats - KFC'],
    frequency: 3,
    probability: 0.7
  },

  // === TRANSPORT ===
  {
    type: 'EXPENSE',
    category: 'TRANSPORT',
    subcategory: 'Combustibil',
    amount: [180, 420],
    descriptions: ['OMV Petrom - A95', 'Rompetrol - full', 'MOL - benzinărie', 'Lukoil - combustibil'],
    frequency: 4,
    probability: 1.0
  },
  {
    type: 'EXPENSE',
    category: 'TRANSPORT',
    subcategory: 'Transport public',
    amount: [12, 55],
    descriptions: ['Abonament STB lunar', 'Bilet metrou', 'Autobuz urban', 'Card transport'],
    frequency: 2,
    probability: 0.6
  },
  {
    type: 'EXPENSE',
    category: 'TRANSPORT',
    subcategory: 'Parcare',
    amount: [5, 25],
    descriptions: ['Parcare Mall', 'Parcare centru', 'Parcare aeroport', 'Zona rezidențială'],
    frequency: 3,
    probability: 0.5
  },

  // === LOCUINȚĂ ===
  {
    type: 'EXPENSE',
    category: 'LOCUINTA',
    subcategory: 'Întreținere',
    amount: [350, 580],
    descriptions: ['Asociația de proprietari', 'Întreținere blocului mai'],
    frequency: 1,
    probability: 1.0
  },
  {
    type: 'EXPENSE',
    category: 'LOCUINTA',
    subcategory: 'Energie electrică',
    amount: [160, 340],
    descriptions: ['Factură ENEL mai', 'Curent electric'],
    frequency: 1,
    probability: 1.0
  },
  {
    type: 'EXPENSE',
    category: 'LOCUINTA',
    subcategory: 'Gaz',
    amount: [95, 220],
    descriptions: ['E.ON Energie - gaz', 'Factură gaz natural mai'],
    frequency: 1,
    probability: 1.0
  },
  {
    type: 'EXPENSE',
    category: 'LOCUINTA',
    subcategory: 'Internet',
    amount: [55, 95],
    descriptions: ['RDS-RCS internet', 'Orange broadband', 'Telekom fibră'],
    frequency: 1,
    probability: 1.0
  },
  {
    type: 'EXPENSE',
    category: 'LOCUINTA',
    subcategory: 'Produse de curățenie și consumabile',
    amount: [25, 75],
    descriptions: ['Detergent Ariel', 'Produse curățenie Carrefour', 'Consumabile casă'],
    frequency: 2,
    probability: 0.8
  },

  // === ÎMBRĂCĂMINTE ===
  {
    type: 'EXPENSE',
    category: 'INFATISARE',
    subcategory: 'Îmbrăcăminte, încălțăminte și accesorii',
    amount: [120, 480],
    descriptions: ['H&M - tricou primăvară', 'Zara - pantofi', 'C&A - îmbrăcăminte', 'Geacă de sezon'],
    frequency: 2,
    probability: 0.6
  },
  {
    type: 'EXPENSE',
    category: 'INFATISARE',
    subcategory: 'Salon de înfrumusețare',
    amount: [80, 180],
    descriptions: ['Tunsoare și aranjat', 'Manichiură', 'Tratament facial'],
    frequency: 1,
    probability: 0.7
  },

  // === SĂNĂTATE ===
  {
    type: 'EXPENSE',
    category: 'SANATATE',
    subcategory: 'Medicamente | Suplimente alimentare | Vitamine',
    amount: [30, 110],
    descriptions: ['Vitamina D', 'Paracetamol', 'Suplimente Catena', 'Medicament raceală'],
    frequency: 2,
    probability: 0.6
  },
  {
    type: 'EXPENSE',
    category: 'SANATATE',
    subcategory: 'Servicii medicale pentru prevenție',
    amount: [150, 350],
    descriptions: ['Control medical general', 'Analize sangvine', 'Consultație cardiolog'],
    frequency: 1,
    probability: 0.4
  },

  // === TIMP LIBER ===
  {
    type: 'EXPENSE',
    category: 'TIMP_LIBER',
    subcategory: 'Abonamente servicii online',
    amount: [25, 85],
    descriptions: ['Netflix premium', 'Spotify family', 'Adobe Creative', 'YouTube Premium'],
    frequency: 2,
    probability: 0.8
  },
  {
    type: 'EXPENSE',
    category: 'TIMP_LIBER',
    subcategory: 'Cinema | Teatru | Concerte | Muzee',
    amount: [45, 160],
    descriptions: ['Cinema City - film', 'Teatrul Național', 'Concert Sala Palatului', 'Muzeul de Istorie'],
    frequency: 2,
    probability: 0.5
  },
  {
    type: 'EXPENSE',
    category: 'TIMP_LIBER',
    subcategory: 'Cadouri pentru cei dragi',
    amount: [60, 280],
    descriptions: ['Cadou ziua mamei', 'Cadou aniversare prieten', 'Flori și ciocolată'],
    frequency: 1,
    probability: 0.6
  },

  // === EDUCAȚIE ===
  {
    type: 'EXPENSE',
    category: 'EDUCATIE',
    subcategory: 'Cursuri | Traininguri de specializare',
    amount: [250, 850],
    descriptions: ['Curs programare online', 'Training management', 'Certificare IT'],
    frequency: 1,
    probability: 0.3
  },
  {
    type: 'EXPENSE',
    category: 'EDUCATIE',
    subcategory: 'Materiale de studiu | cărți',
    amount: [55, 180],
    descriptions: ['Cărți tehnice Amazon', 'Manual JavaScript', 'Carte dezvoltare personală'],
    frequency: 1,
    probability: 0.4
  },

  // === CĂLĂTORII ===
  {
    type: 'EXPENSE',
    category: 'CALATORII',
    subcategory: 'Bilete pentru mijloace de transport/combustibil',
    amount: [120, 450],
    descriptions: ['Bilet tren Cluj-București', 'Bilet avion Wizz Air', 'Autocar Transilvania'],
    frequency: 1,
    probability: 0.3
  },

  // === INVESTIȚII ===
  {
    type: 'EXPENSE',
    category: 'INVESTITII',
    subcategory: 'Investiție/Afacere 1',
    amount: [500, 1800],
    descriptions: ['Acțiuni BVB', 'ETF VANGUARD', 'Investiție piața de capital'],
    frequency: 2,
    probability: 0.7
  },
  {
    type: 'EXPENSE',
    category: 'INVESTITII',
    subcategory: 'Investiție/Afacere 2',
    amount: [800, 2500],
    descriptions: ['Bitcoin investment', 'Ethereum buy', 'Crypto portfolio'],
    frequency: 1,
    probability: 0.5
  },

  // === ECONOMII ===
  {
    type: 'SAVING',
    category: 'ECONOMII',
    subcategory: 'Fond de urgență',
    amount: [600, 1500],
    descriptions: ['Transfer fond urgență', 'Economii siguranță'],
    frequency: 2,
    probability: 0.8
  },
  {
    type: 'SAVING',
    category: 'ECONOMII',
    subcategory: 'Fond de rezervă',
    amount: [400, 1200],
    descriptions: ['Economii vacanță vară', 'Rezervă financiară'],
    frequency: 1,
    probability: 0.6
  }
];

// Utility functions
function randomAmount(min, max) {
  const amount = Math.random() * (max - min) + min;
  // 70% șanse pentru numere întregi, 30% pentru decimale
  if (Math.random() > 0.3) {
    return Math.round(amount);
  }
  return Math.round(amount * 100) / 100;
}

function randomDate(year, month) {
  const daysInMonth = new Date(year, month, 0).getDate();
  const randomDay = Math.floor(Math.random() * daysInMonth) + 1;
  return `${year}-${month.toString().padStart(2, '0')}-${randomDay.toString().padStart(2, '0')}`;
}

function randomDescription(descriptions) {
  return descriptions[Math.floor(Math.random() * descriptions.length)];
}

// Generare tranzacții realiste
function generateRealisticTransactions() {
  const transactions = [];
  
  console.log('🎯 Generez tranzacții realiste pentru Mai 2025...\n');
  
  TRANSACTION_TEMPLATES.forEach((template, index) => {
    // Verific dacă template-ul ar trebui să apară (probabilitate)
    if (Math.random() > template.probability) {
      console.log(`⏭️  Sărit: ${template.subcategory} (probabilitate ${template.probability})`);
      return;
    }
    
    // Determin câte tranzacții să generez pentru acest template
    const count = Math.min(template.frequency, Math.ceil(template.frequency * Math.random()));
    
    console.log(`📂 ${template.category} > ${template.subcategory}: ${count} tranzacții`);
    
    for (let i = 0; i < count; i++) {
      const amount = randomAmount(template.amount[0], template.amount[1]);
      const transaction = {
        user_id: CONFIG.USER_ID,
        type: template.type,
        amount: amount.toString(),
        category: template.category,
        subcategory: template.subcategory,
        description: randomDescription(template.descriptions),
        date: randomDate(CONFIG.YEAR, CONFIG.MONTH),
        currency: CONFIG.CURRENCY,
        recurring: false,
        frequency: null
      };
      
      transactions.push(transaction);
      console.log(`  ✅ ${amount} lei - ${transaction.description}`);
    }
    console.log('');
  });
  
  // Sortez după dată
  transactions.sort((a, b) => new Date(a.date) - new Date(b.date));
  
  console.log(`📊 Total tranzacții generate: ${transactions.length}`);
  return transactions;
}

// Inserare în Supabase
async function insertTransactions(transactions) {
  console.log('\n💾 Încep inserarea în Supabase...\n');
  
  let successCount = 0;
  let errorCount = 0;
  
  // Inserez în batch-uri de câte 10 pentru performanță
  const batchSize = 10;
  for (let i = 0; i < transactions.length; i += batchSize) {
    const batch = transactions.slice(i, i + batchSize);
    
    console.log(`📦 Batch ${Math.floor(i/batchSize) + 1}/${Math.ceil(transactions.length/batchSize)}: ${batch.length} tranzacții`);
    
    try {
      const { data, error } = await supabase
        .from('transactions')
        .insert(batch);
      
      if (error) {
        console.error(`❌ Eroare batch: ${error.message}`);
        errorCount += batch.length;
      } else {
        console.log(`✅ Batch insertat cu succes!`);
        successCount += batch.length;
      }
    } catch (err) {
      console.error(`💥 Eroare critică batch: ${err.message}`);
      errorCount += batch.length;
    }
    
    // Pauză scurtă între batch-uri
    await new Promise(resolve => setTimeout(resolve, 200));
  }
  
  return { successCount, errorCount };
}

// Funcția principală
async function main() {
  console.log('🚀 POPULARE TRANZACȚII REALISTE - MAI 2025\n');
  console.log(`👤 Utilizator: ${CONFIG.USER_ID}`);
  console.log(`📅 Perioada: Mai ${CONFIG.YEAR}`);
  console.log(`🎯 Obiectiv: ~${CONFIG.TARGET_TRANSACTIONS} tranzacții\n`);
  
  try {
    // Generez tranzacțiile
    const transactions = generateRealisticTransactions();
    
    if (transactions.length === 0) {
      console.log('⚠️  Nu am generat nicio tranzacție!');
      return;
    }
    
    // Le inserez în baza de date
    const { successCount, errorCount } = await insertTransactions(transactions);
    
    // Afișez rezultatele finale
    console.log('\n📊 REZULTATE FINALE:');
    console.log(`✅ Tranzacții adăugate: ${successCount}`);
    console.log(`❌ Erori: ${errorCount}`);
    console.log(`📈 Rata de succes: ${Math.round((successCount / transactions.length) * 100)}%`);
    
    if (successCount > 0) {
      console.log('\n🎉 Popularea s-a finalizat cu succes!');
      console.log('💡 Verifică rezultatele în aplicația Budget pe localhost:3001');
      
      // Statistici detaliate
      console.log('\n📈 STATISTICI:');
      const income = transactions.filter(t => t.type === 'INCOME');
      const expenses = transactions.filter(t => t.type === 'EXPENSE');
      const savings = transactions.filter(t => t.type === 'SAVING');
      
      const totalIncome = income.reduce((sum, t) => sum + parseFloat(t.amount), 0);
      const totalExpenses = expenses.reduce((sum, t) => sum + parseFloat(t.amount), 0);
      const totalSavings = savings.reduce((sum, t) => sum + parseFloat(t.amount), 0);
      
      console.log(`💰 Venituri: ${income.length} tranzacții, ${totalIncome.toLocaleString('ro-RO')} lei`);
      console.log(`💸 Cheltuieli: ${expenses.length} tranzacții, ${totalExpenses.toLocaleString('ro-RO')} lei`);
      console.log(`🏦 Economii: ${savings.length} tranzacții, ${totalSavings.toLocaleString('ro-RO')} lei`);
      console.log(`📊 Balanța: ${(totalIncome - totalExpenses - totalSavings).toLocaleString('ro-RO')} lei`);
    }
    
  } catch (error) {
    console.error('💥 Eroare critică:', error);
    process.exit(1);
  }
}

// Execută scriptul
if (require.main === module) {
  main();
}

module.exports = { generateRealisticTransactions, insertTransactions }; 
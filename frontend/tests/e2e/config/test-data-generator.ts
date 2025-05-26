/**
 * Generator dinamic de date de test pentru E2E tests
 * Extrage toate categoriile și subcategoriile din aplicație
 * și oferă combinații diferite pentru fiecare test
 */

import { CATEGORIES, TransactionType, FrequencyType } from '../../../../shared-constants';
import { TRANSACTION_TYPE_TO_CATEGORIES } from '../../../../shared-constants/category-mapping';

// Tipul pentru date de test generate
export interface TestDataCombo {
  transactionType: TransactionType;
  categoryKey: string;
  categoryDisplay: string;
  subcategoryGroup: string;
  subcategory: string;
  amount: string;
  description: string;
}

// Tipul pentru date complete de formular de transactii
export interface TransactionFormTestData {
  type: TransactionType;
  amount: string;
  category: string;
  subcategory: string;
  date: string;
  recurring: boolean;
  frequency: string;
  description: string;
}

// Clase pentru diferite tipuri de sume
export const AMOUNT_RANGES = {
  SMALL: { min: 5, max: 25, suffix: '.50' },
  MEDIUM: { min: 26, max: 100, suffix: '.75' },
  LARGE: { min: 101, max: 500, suffix: '.00' },
  EXTRA_LARGE: { min: 501, max: 2000, suffix: '.25' }
} as const;

// Array cu descrieri dinamice
export const DYNAMIC_DESCRIPTIONS = [
  'Achiziție de test',
  'Plată pentru servicii',
  'Cumpărături necesare',
  'Investiție planificată',
  'Cheltuială estimată',
  'Tranzacție de verificare',
  'Plată automată',
  'Transfer manual'
] as const;

/**
 * Generează o combinație aleatoare la cerere (lazy generation)
 */
function generateRandomCombo(): TestDataCombo {
  // Alege un tip de tranzacție aleatoriu
  const transactionTypes = Object.values(TransactionType);
  const transactionType = transactionTypes[Math.floor(Math.random() * transactionTypes.length)];
  
  // Alege o categorie permisă pentru acest tip
  const allowedCategories = TRANSACTION_TYPE_TO_CATEGORIES[transactionType];
  const categoryKey = allowedCategories[Math.floor(Math.random() * allowedCategories.length)];
  
  // Obține datele categoriei
  const categoryData = CATEGORIES[categoryKey as keyof typeof CATEGORIES];
  if (!categoryData) {
    throw new Error(`Categoria ${categoryKey} nu există în CATEGORIES`);
  }
  
  // Alege un grup de subcategorii aleatoriu
  const subcategoryGroups = Object.entries(categoryData);
  const [subcategoryGroup, subcategories] = subcategoryGroups[Math.floor(Math.random() * subcategoryGroups.length)];
  
  // Alege o subcategorie aleatorie
  const subcategoriesArray = subcategories as string[];
  const subcategory = subcategoriesArray[Math.floor(Math.random() * subcategoriesArray.length)];
  
  // Alege un tip de sumă aleatoriu
  const amountRangeKeys = Object.keys(AMOUNT_RANGES);
  const rangeKey = amountRangeKeys[Math.floor(Math.random() * amountRangeKeys.length)];
  const range = AMOUNT_RANGES[rangeKey as keyof typeof AMOUNT_RANGES];
  
  const randomAmount = Math.floor(Math.random() * (range.max - range.min + 1)) + range.min;
  const amount = `${randomAmount}${range.suffix}`;
  
  return {
    transactionType,
    categoryKey,
    categoryDisplay: categoryKey,
    subcategoryGroup,
    subcategory,
    amount,
    description: `Test ${categoryKey} - ${subcategory} (${rangeKey.toLowerCase()})`
  };
}

/**
 * Cache pentru combinații generate, cu limită pentru a evita memory leaks
 */
const COMBINATION_CACHE = new Map<string, TestDataCombo>();
const MAX_CACHE_SIZE = 100;

/**
 * Clasa pentru gestionarea datelor de test cu generare lazy
 */
export class TestDataGenerator {
  private static usedCombinations = new Set<string>();
  
  /**
   * Obține o combinație unică de date de test (generare lazy)
   */
  static getNextCombo(): TestDataCombo {
    let combo: TestDataCombo;
    let attempts = 0;
    const maxAttempts = 50;
    
    do {
      combo = generateRandomCombo();
      attempts++;
      
      // Evităm bucla infinită - după 50 de încercări, resetăm cache-ul
      if (attempts >= maxAttempts) {
        this.usedCombinations.clear();
        combo = generateRandomCombo();
        break;
      }
    } while (this.usedCombinations.has(this.comboToString(combo)));
    
    // Adăugăm în cache cu limită de mărime
    if (COMBINATION_CACHE.size >= MAX_CACHE_SIZE) {
      // Elimină prima intrare (FIFO)
      const firstKey = COMBINATION_CACHE.keys().next().value;
      COMBINATION_CACHE.delete(firstKey);
    }
    
    COMBINATION_CACHE.set(this.comboToString(combo), combo);
    this.usedCombinations.add(this.comboToString(combo));
    return combo;
  }
  
  /**
   * Obține o combinație specifică pentru un tip de tranzacție
   */
  static getComboForType(type: TransactionType): TestDataCombo {
    // Încearcă să genereze o combinație pentru tipul specificat
    let attempts = 0;
    let combo: TestDataCombo;
    
    do {
      combo = generateRandomCombo();
      attempts++;
    } while (combo.transactionType !== type && attempts < 20);
    
    if (combo.transactionType !== type) {
      throw new Error(`Nu s-a putut genera o combinație pentru tipul ${type} după ${attempts} încercări`);
    }
    
    // Adaugă în tracking
    this.usedCombinations.add(this.comboToString(combo));
    
    return combo;
  }
  
  /**
   * Obține o combinație pentru o categorie specifică
   */
  static getComboForCategory(categoryKey: string): TestDataCombo {
    // Încearcă să genereze o combinație pentru categoria specificată
    let attempts = 0;
    let combo: TestDataCombo;
    
    do {
      combo = generateRandomCombo();
      attempts++;
    } while (combo.categoryKey !== categoryKey && attempts < 20);
    
    if (combo.categoryKey !== categoryKey) {
      throw new Error(`Nu s-a putut genera o combinație pentru categoria ${categoryKey} după ${attempts} încercări`);
    }
    
    // Adaugă în tracking
    this.usedCombinations.add(this.comboToString(combo));
    
    return combo;
  }
  
  /**
   * Obține mai multe combinații diferite odată
   */
  static getMultipleCombos(count: number): TestDataCombo[] {
    const combos: TestDataCombo[] = [];
    const usedStrings = new Set<string>();
    
    for (let i = 0; i < count; i++) {
      let combo: TestDataCombo;
      let attempts = 0;
      
      do {
        combo = generateRandomCombo();
        attempts++;
      } while (usedStrings.has(this.comboToString(combo)) && attempts < 50);
      
      const comboString = this.comboToString(combo);
      usedStrings.add(comboString);
      this.usedCombinations.add(comboString); // Adaugă și în tracking-ul global
      combos.push(combo);
    }
    
    return combos;
  }
  
  /**
   * Resetează cache-ul pentru a începe din nou
   */
  static reset(): void {
    this.usedCombinations.clear();
    COMBINATION_CACHE.clear();
  }
  
  /**
   * Obține statistici estimate despre combinațiile disponibile
   */
  static getStats() {
    // Calculăm estimări în loc de a genera toate combinațiile
    let totalEstimate = 0;
    const byTransactionType: Record<string, number> = {};
    const byCategory: Record<string, number> = {};
    
    // Estimăm numărul de combinații per tip de tranzacție
    Object.values(TransactionType).forEach(type => {
      const allowedCategories = TRANSACTION_TYPE_TO_CATEGORIES[type];
      let typeTotal = 0;
      
      allowedCategories.forEach(categoryKey => {
        const categoryData = CATEGORIES[categoryKey as keyof typeof CATEGORIES];
        if (categoryData) {
          const subcategoryCount = Object.values(categoryData as unknown as Record<string, string[]>)
            .flat().length;
          const categoryTotal = subcategoryCount * Object.keys(AMOUNT_RANGES).length;
          typeTotal += categoryTotal;
          byCategory[categoryKey] = categoryTotal;
        }
      });
      
      byTransactionType[type] = typeTotal;
      totalEstimate += typeTotal;
    });
    
    return {
      totalCombinations: totalEstimate,
      usedCombinations: this.usedCombinations.size,
      remainingCombinations: totalEstimate - this.usedCombinations.size,
      cacheSize: COMBINATION_CACHE.size,
      byTransactionType,
      byCategory
    };
  }
  
  /**
   * Conversia unei combinații la string pentru comparații
   */
  private static comboToString(combo: TestDataCombo): string {
    return `${combo.transactionType}-${combo.categoryKey}-${combo.subcategory}-${combo.amount}`;
  }
}

/**
 * Utilități pentru LunarGrid testing cu date dinamice
 */
export class LunarGridTestData {
  /**
   * Workflow pentru LunarGrid cu expand all
   */
  static getLunarGridWorkflow() {
    return {
      // Pasul 1: Click pe butonul toggle expand all
      STEP_TOGGLE_EXPAND_ALL: 'toggle-expand-all',
      // Pasul 2: Butonul pentru resetare
      STEP_RESET_EXPANDED: 'reset-expanded',
      // Pasul 3: Așteaptă expandarea completă
      WAIT_FOR_EXPANSION: 2000,
      // Pasul 4: Căută celule vizibile
      CELL_PATTERN: 'editable-cell-*',
      // Pasul 5: Pattern pentru butoane expand individuale
      EXPAND_CATEGORY_PATTERN: 'expand-btn-*'
    };
  }
  /**
   * Obține date test specifice pentru LunarGrid cu categorii care au subcategorii multiple
   */
  static getGridTestData(): {
    primaryCombo: TestDataCombo;
    secondaryCombo: TestDataCombo;
    expectedTotal: string;
  } {
    // Căutăm categorii cu multe subcategorii pentru teste mai robuste
    const categoriesWithManySubcategories = Object.entries(CATEGORIES)
      .filter(([_, categoryData]) => {
        const totalSubcategories = Object.values(categoryData as unknown as Record<string, string[]>).flat().length;
        return totalSubcategories >= 3; // Minim 3 subcategorii
      })
      .map(([key, _]) => key);
    
    if (categoriesWithManySubcategories.length < 2) {
      throw new Error('Nu există suficiente categorii cu subcategorii multiple pentru teste');
    }
    
    // Alegem 2 categorii diferite
    const category1 = categoriesWithManySubcategories[0];
    const category2 = categoriesWithManySubcategories[1];
    
    const primaryCombo = TestDataGenerator.getComboForCategory(category1);
    const secondaryCombo = TestDataGenerator.getComboForCategory(category2);
    
    // Calculăm totalul așteptat
    const total = parseFloat(primaryCombo.amount) + parseFloat(secondaryCombo.amount);
    const expectedTotal = total.toFixed(2);
    
    return {
      primaryCombo,
      secondaryCombo,
      expectedTotal
    };
  }
  
  /**
   * Obține selectors dinamici pentru LunarGrid
   */
  static getDynamicSelectors(combo: TestDataCombo, day: number) {
    return {
      toggleExpandAllButton: 'toggle-expand-all', // Butonul pentru expandare/colapsare toate
      resetExpandedButton: 'reset-expanded', // Butonul pentru resetare expandare
      expandCategoryButton: `expand-btn-${combo.categoryKey}`, // Buton expandare categorie specifică
      cellSelector: `editable-cell-${combo.categoryKey}-${combo.subcategory || 'main'}-${day}`,
      categoryRow: `category-row-${combo.categoryKey.toLowerCase()}`,
      subcategoryCell: `subcategory-${combo.subcategory.replace(/\s+/g, '-').toLowerCase()}`,
      // Selectori pentru navigarea prin grid
      categoryHeader: `category-${combo.categoryKey.toLowerCase()}`,
      subcategoryRow: `subcategory-row-${combo.subcategory.replace(/\s+/g, '-').toLowerCase()}`
    };
  }
}

/**
 * Clase pentru generarea datelor specifice TransactionForm
 */
export class TransactionFormDataGenerator {
  /**
   * Obține date complete pentru completarea formularului de tranzacție
   */
  static getFormData(): TransactionFormTestData {
    const combo = TestDataGenerator.getNextCombo();
    
    // Generează o dată aleatoare în ultimele 30 de zile
    const today = new Date();
    const randomDays = Math.floor(Math.random() * 30);
    const randomDate = new Date(today.getTime() - (randomDays * 24 * 60 * 60 * 1000));
    const dateString = randomDate.toISOString().split('T')[0]; // Format YYYY-MM-DD
    
    // Decide aleatoriu dacă tranzacția e recurentă (30% șanse)
    const isRecurring = Math.random() < 0.3;
    
    // Selectează frecvența aleatorie (doar dacă e recurentă)
    const frequencies = [FrequencyType.DAILY, FrequencyType.WEEKLY, FrequencyType.MONTHLY, FrequencyType.YEARLY];
    const frequency = isRecurring 
      ? frequencies[Math.floor(Math.random() * frequencies.length)]
      : '';
    
    // Generează descriere dinamică sau opțională
    const descriptions = [
      'Tranzacție de test automată',
      'Plată pentru servicii',
      'Achiziție planificată',
      'Transfer regulat',
      'Cheltuială necesară',
      'Investiție programată',
      '', // Uneori fără descriere
      '' // Pentru a avea șanse mai mari să fie goală
    ];
    
    const description = descriptions[Math.floor(Math.random() * descriptions.length)];
    
    return {
      type: combo.transactionType,
      amount: combo.amount,
      category: combo.categoryKey,
      subcategory: combo.subcategory,
      date: dateString,
      recurring: isRecurring,
      frequency: frequency,
      description: description
    };
  }
  
  /**
   * Obține date pentru o tranzacție recurentă (100% șanse)
   */
  static getRecurringFormData(): TransactionFormTestData {
    const data = this.getFormData();
    data.recurring = true;
    
    // Asigură-te că are frecvență
    if (!data.frequency) {
      const frequencies = [FrequencyType.DAILY, FrequencyType.WEEKLY, FrequencyType.MONTHLY, FrequencyType.YEARLY];
      data.frequency = frequencies[Math.floor(Math.random() * frequencies.length)];
    }
    
    return data;
  }
  
  /**
   * Obține date pentru o tranzacție simplă (non-recurentă)
   */
  static getNonRecurringFormData(): TransactionFormTestData {
    const data = this.getFormData();
    data.recurring = false;
    data.frequency = '';
    return data;
  }
  
  /**
   * Obține selectori dinamici pentru formularul de tranzacție
   */
  static getFormSelectors() {
    return {
      form: 'transaction-form',
      typeSelect: 'type-select',
      amountInput: 'amount-input',
      categorySelect: 'category-select',
      subcategorySelect: 'subcategory-select',
      dateInput: 'date-input',
      recurringCheckbox: 'recurring-checkbox',
      frequencySelect: 'frequency-select',
      descriptionInput: 'description-input',
      addButton: 'add-transaction-button',
      cancelButton: 'cancel-btn',
      errorMessage: 'error-message',
      successMessage: 'success-message'
    };
  }
  
  /**
   * Obține etichete pentru logging/debugging
   */
  static getFormLabels(data: TransactionFormTestData): string {
    const recurringText = data.recurring ? ` | Recurent: ${data.frequency}` : ' | Non-recurent';
    const descriptionText = data.description ? ` | "${data.description}"` : ' | Fără descriere';
    
    return `${data.type} | ${data.category} → ${data.subcategory} | ${data.amount} RON | ${data.date}${recurringText}${descriptionText}`;
  }
}

/**
 * Export pentru utilizare în teste
 */
export default TestDataGenerator; 
import { test, expect } from '@playwright/test';
import TestDataGenerator, { LunarGridTestData } from '../../config/test-data-generator';
import { TransactionType } from '../../../../../shared-constants';

test.describe('Test Data Generator', () => {
  test('verifică că generatorul produce date valide', async () => {
    // Resetează generatorul
    TestDataGenerator.reset();
    
    // Testează obținerea de combinații următoare
    console.log('🔄 Teste combinații următoare:');
    for (let i = 0; i < 5; i++) {
      const combo = TestDataGenerator.getNextCombo();
      console.log(`Combinația ${i + 1}:`, {
        tip: combo.transactionType,
        categorie: combo.categoryKey,
        subcategorie: combo.subcategory,
        sumă: combo.amount,
        descriere: combo.description
      });
      
      expect(combo.transactionType).toBeDefined();
      expect(combo.categoryKey).toBeTruthy();
      expect(combo.subcategory).toBeTruthy();
      expect(combo.amount).toMatch(/^\d+\.\d{2}$/);
    }
    
    // Obține statistici simple
    const stats = TestDataGenerator.getStats();
    console.log('📊 Statistici generator:', {
      totalEstimate: stats.totalCombinations,
      usedCombinations: stats.usedCombinations,
      cacheSize: stats.cacheSize
    });
    
    expect(stats.totalCombinations).toBeGreaterThan(0);
    expect(stats.usedCombinations).toBeGreaterThan(0);
  });

  test('verifică combinații pentru tip specific', async () => {
    console.log('\n💰 Test combinații pentru EXPENSE:');
    
    for (let i = 0; i < 3; i++) {
      const combo = TestDataGenerator.getComboForType(TransactionType.EXPENSE);
      console.log(`Cheltuială ${i + 1}:`, {
        categorie: combo.categoryKey,
        subcategorie: combo.subcategory,
        sumă: combo.amount
      });
      
      expect(combo.transactionType).toBe(TransactionType.EXPENSE);
      expect(['INFATISARE', 'EDUCATIE', 'CARIERA', 'SANATATE', 'NUTRITIE', 'LOCUINTA', 'TIMP_LIBER', 'CALATORII', 'TRANSPORT']).toContain(combo.categoryKey);
    }
    
    console.log('\n💵 Test combinații pentru INCOME:');
    
    for (let i = 0; i < 2; i++) {
      const combo = TestDataGenerator.getComboForType(TransactionType.INCOME);
      console.log(`Venit ${i + 1}:`, {
        categorie: combo.categoryKey,
        subcategorie: combo.subcategory,
        sumă: combo.amount
      });
      
      expect(combo.transactionType).toBe(TransactionType.INCOME);
      expect(combo.categoryKey).toBe('VENITURI');
    }
  });

  test('verifică combinații multiple diferite', async () => {
    console.log('\n🎲 Test combinații multiple:');
    
    const combos = TestDataGenerator.getMultipleCombos(4);
    expect(combos).toHaveLength(4);
    
    // Verifică că sunt diferite
    const comboStrings = combos.map(c => `${c.categoryKey}-${c.subcategory}-${c.amount}`);
    const uniqueStrings = new Set(comboStrings);
    
    console.log('Combinații generate:', comboStrings);
    expect(uniqueStrings.size).toBe(comboStrings.length); // Toate trebuie să fie unice
  });

  test('verifică LunarGrid test data', async () => {
    console.log('\n🌙 Test LunarGrid data generator:');
    
    // Resetează generatorul pentru test curat
    TestDataGenerator.reset();
    
    const gridData = LunarGridTestData.getGridTestData();
    
    console.log('Date LunarGrid:', {
      primar: {
        categorie: gridData.primaryCombo.categoryKey,
        subcategorie: gridData.primaryCombo.subcategory,
        sumă: gridData.primaryCombo.amount
      },
      secundar: {
        categorie: gridData.secondaryCombo.categoryKey,
        subcategorie: gridData.secondaryCombo.subcategory,
        sumă: gridData.secondaryCombo.amount
      },
      totalAșteptat: gridData.expectedTotal
    });
    
    expect(gridData.primaryCombo.categoryKey).not.toBe(gridData.secondaryCombo.categoryKey);
    expect(parseFloat(gridData.expectedTotal)).toBeGreaterThan(0);
    
    // Testează și selectorii dinamici
    const selectors = LunarGridTestData.getDynamicSelectors(gridData.primaryCombo, 15);
    console.log('Selectori dinamici:', selectors);
    
    expect(selectors.cellSelector).toContain('editable-cell');
    expect(selectors.expandCategoryButton).toContain('expand-btn');
  });
}); 
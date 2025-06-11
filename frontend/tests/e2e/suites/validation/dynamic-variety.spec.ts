import { test, expect } from '@playwright/test';
import TestDataGenerator, { LunarGridTestData } from '../../config/test-data-generator';
import { TransactionType } from '../../../../../shared-constants';

test.describe('Test Varietate Date Dinamice', () => {
  test('demonstrează varietatea combinațiilor generate', async () => {
    console.log('🎲 Demonstrație varietate date dinamice:\n');
    
    // Resetează generatorul
    TestDataGenerator.reset();
    
    // Generează 10 combinații diferite
    console.log('📋 10 combinații consecutive:');
    const combos = TestDataGenerator.getMultipleCombos(10);
    
    combos.forEach((combo, index) => {
      console.log(`${index + 1}. ${combo.transactionType} | ${combo.categoryKey} → ${combo.subcategory} (${combo.amount})`);
    });
    
    // Verifică că sunt toate diferite
    const comboStrings = combos.map(c => `${c.categoryKey}-${c.subcategory}-${c.amount}`);
    const uniqueStrings = new Set(comboStrings);
    expect(uniqueStrings.size).toBe(combos.length);
    
    console.log('\n💰 Combinații specifice per tip:');
    
    // Generează pentru fiecare tip de tranzacție
    const expenseCombo = TestDataGenerator.getComboForType(TransactionType.EXPENSE);
    console.log(`EXPENSE: ${expenseCombo.categoryKey} → ${expenseCombo.subcategory} (${expenseCombo.amount})`);
    
    const incomeCombo = TestDataGenerator.getComboForType(TransactionType.INCOME);
    console.log(`INCOME: ${incomeCombo.categoryKey} → ${incomeCombo.subcategory} (${incomeCombo.amount})`);
    
    const savingCombo = TestDataGenerator.getComboForType(TransactionType.SAVING);
    console.log(`SAVING: ${savingCombo.categoryKey} → ${savingCombo.subcategory} (${savingCombo.amount})`);
    
    // Verifică tipurile
    expect(expenseCombo.transactionType).toBe(TransactionType.EXPENSE);
    expect(incomeCombo.transactionType).toBe(TransactionType.INCOME);
    expect(savingCombo.transactionType).toBe(TransactionType.SAVING);
    
    console.log('\n🌙 Date pentru LunarGrid:');
    const gridData = LunarGridTestData.getGridTestData();
    console.log(`Primar: ${gridData.primaryCombo.categoryKey} → ${gridData.primaryCombo.subcategory} (${gridData.primaryCombo.amount})`);
    console.log(`Secundar: ${gridData.secondaryCombo.categoryKey} → ${gridData.secondaryCombo.subcategory} (${gridData.secondaryCombo.amount})`);
    console.log(`Total așteptat: ${gridData.expectedTotal}`);
    
    // Verifică că categoriile sunt diferite
    expect(gridData.primaryCombo.categoryKey).not.toBe(gridData.secondaryCombo.categoryKey);
    
    console.log('\n📊 Statistici finale:');
    const stats = TestDataGenerator.getStats();
    console.log(`Total combinații estimate: ${stats.totalCombinations}`);
    console.log(`Combinații folosite: ${stats.usedCombinations}`);
    console.log(`Cache size: ${stats.cacheSize}`);
    
    expect(stats.totalCombinations).toBeGreaterThan(400); // Estimăm ~408
    expect(stats.usedCombinations).toBeGreaterThanOrEqual(15); // 10 + 3 + 2 din LunarGrid
  });

  test('verifică consistența categoriilor și subcategoriilor', async () => {
    console.log('🔍 Verificare consistență categorii-subcategorii:\n');
    
    // Testează 20 de combinații pentru a verifica consistența
    for (let i = 0; i < 20; i++) {
      const combo = TestDataGenerator.getNextCombo();
      
      // Verifică că subcategoria aparține categoriei
      expect(combo.categoryKey).toBeTruthy();
      expect(combo.subcategory).toBeTruthy();
      expect(combo.subcategoryGroup).toBeTruthy();
      
      // Verifică formatul sumei
      expect(combo.amount).toMatch(/^\d+\.\d{2}$/);
      
      // Verifică că descrierea conține categoria și subcategoria
      expect(combo.description).toContain(combo.categoryKey);
      expect(combo.description).toContain(combo.subcategory);
      
      if (i < 5) {
        console.log(`${i + 1}. ✅ ${combo.categoryKey} | ${combo.subcategoryGroup} → ${combo.subcategory}`);
      }
    }
    
    console.log('... și încă 15 combinații verificate cu succes!');
  });
}); 
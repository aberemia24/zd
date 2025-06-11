import { test, expect } from '@playwright/test';
import { TransactionFormDataGenerator } from '../../config/test-data-generator';
import { TransactionType, FrequencyType } from '../../../../../shared-constants';

test.describe('Generator Date TransactionForm - Validare', () => {
  
  test('validează generarea datelor aleatorii', async () => {
    console.log('🧪 Test validare generator date formular');
    
    // Generează 10 seturi de date pentru a vedea varietatea
    for (let i = 1; i <= 10; i++) {
      const formData = TransactionFormDataGenerator.getFormData();
      const labels = TransactionFormDataGenerator.getFormLabels(formData);
      
      console.log(`${i}. ${labels}`);
      
      // Validări de bază
      expect(Object.values(TransactionType)).toContain(formData.type);
      expect(formData.amount).toMatch(/^\d+(\.\d{2})?$/); // Format: număr.zecimale
      expect(formData.category).toBeTruthy();
      expect(formData.subcategory).toBeTruthy();
      expect(formData.date).toMatch(/^\d{4}-\d{2}-\d{2}$/); // Format YYYY-MM-DD
      expect(typeof formData.recurring).toBe('boolean');
      
      if (formData.recurring) {
        expect(Object.values(FrequencyType)).toContain(formData.frequency as FrequencyType);
        expect(formData.frequency).toBeTruthy();
      } else {
        expect(formData.frequency).toBe('');
      }
      
      // Descrierea poate fi goală sau string
      expect(typeof formData.description).toBe('string');
    }
    
    console.log('✅ Toate datele generate sunt valide');
  });

  test('validează generator pentru tranzacții recurente', async () => {
    console.log('🔄 Test generator pentru tranzacții recurente');
    
    for (let i = 1; i <= 5; i++) {
      const formData = TransactionFormDataGenerator.getRecurringFormData();
      const labels = TransactionFormDataGenerator.getFormLabels(formData);
      
      console.log(`${i}. RECURENT: ${labels}`);
      
      // Toate trebuie să fie recurente
      expect(formData.recurring).toBe(true);
      expect(formData.frequency).toBeTruthy();
      expect(Object.values(FrequencyType)).toContain(formData.frequency as FrequencyType);
    }
    
    console.log('✅ Toate tranzacțiile recurente sunt valide');
  });

  test('validează generator pentru tranzacții simple', async () => {
    console.log('📝 Test generator pentru tranzacții simple');
    
    for (let i = 1; i <= 5; i++) {
      const formData = TransactionFormDataGenerator.getNonRecurringFormData();
      const labels = TransactionFormDataGenerator.getFormLabels(formData);
      
      console.log(`${i}. SIMPLU: ${labels}`);
      
      // Toate trebuie să fie non-recurente
      expect(formData.recurring).toBe(false);
      expect(formData.frequency).toBe('');
    }
    
    console.log('✅ Toate tranzacțiile simple sunt valide');
  });

  test('validează selectorii generați', async () => {
    console.log('🎯 Test validare selectori');
    
    const selectors = TransactionFormDataGenerator.getFormSelectors();
    
    console.log('📝 Selectori generați:', selectors);
    
    // Verifică că toți selectorii importanți există
    expect(selectors.form).toBe('transaction-form');
    expect(selectors.typeSelect).toBe('type-select');
    expect(selectors.amountInput).toBe('amount-input');
    expect(selectors.categorySelect).toBe('category-select');
    expect(selectors.subcategorySelect).toBe('subcategory-select');
    expect(selectors.dateInput).toBe('date-input');
    expect(selectors.recurringCheckbox).toBe('recurring-checkbox');
    expect(selectors.frequencySelect).toBe('frequency-select');
    expect(selectors.descriptionInput).toBe('description-input');
    expect(selectors.addButton).toBe('add-transaction-button');
    expect(selectors.cancelButton).toBe('cancel-btn');
    
    console.log('✅ Toți selectorii sunt configurați corect');
  });

  test('demonstrează varietatea tipurilor de tranzacție', async () => {
    console.log('🎲 Demonstrație varietate tipuri tranzacție');
    
    const typeCounts = {
      [TransactionType.INCOME]: 0,
      [TransactionType.EXPENSE]: 0,
      [TransactionType.SAVING]: 0
    };
    
    // Generează 50 de tranzacții pentru a vedea distribuția
    for (let i = 0; i < 50; i++) {
      const formData = TransactionFormDataGenerator.getFormData();
      typeCounts[formData.type]++;
    }
    
    console.log('📊 Distribuție tipuri tranzacții (din 50):', typeCounts);
    
    // Verifică că avem varietate (cel puțin 1 din fiecare tip)
    Object.values(typeCounts).forEach(count => {
      expect(count).toBeGreaterThan(0);
    });
    
    console.log('✅ Varietate confirmată pentru toate tipurile');
  });

  test('demonstrează varietatea frecvențelor', async () => {
    console.log('⏰ Demonstrație varietate frecvențe');
    
    const frequencyCounts: Record<string, number> = {};
    
    // Generează doar tranzacții recurente pentru a testa frecvențele
    for (let i = 0; i < 30; i++) {
      const formData = TransactionFormDataGenerator.getRecurringFormData();
      frequencyCounts[formData.frequency] = (frequencyCounts[formData.frequency] || 0) + 1;
    }
    
    console.log('📊 Distribuție frecvențe (din 30 recurente):', frequencyCounts);
    
    // Verifică că avem frecvențe diferite
    expect(Object.keys(frequencyCounts).length).toBeGreaterThan(1);
    
    console.log('✅ Varietate confirmată pentru frecvențe');
  });
}); 
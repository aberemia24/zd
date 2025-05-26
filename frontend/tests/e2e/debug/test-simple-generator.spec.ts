import { test, expect } from '@playwright/test';
import TestDataGenerator from '../config/test-data-generator';

test.describe('Test Simple Generator', () => {
  test('generează o combinație simplă', async () => {
    // Resetează generatorul
    TestDataGenerator.reset();
    
    console.log('🔄 Generez o combinație simplă...');
    
    try {
      const combo = TestDataGenerator.getNextCombo();
      
      console.log('✅ Combinație generată:', {
        tip: combo.transactionType,
        categorie: combo.categoryKey,
        subcategorie: combo.subcategory,
        sumă: combo.amount
      });
      
      expect(combo.transactionType).toBeDefined();
      expect(combo.categoryKey).toBeTruthy();
      expect(combo.subcategory).toBeTruthy();
      expect(combo.amount).toMatch(/^\d+\.\d{2}$/);
      
    } catch (error) {
      console.error('❌ Eroare la generare:', error);
      throw error;
    }
  });

  test('generează pentru tip specific', async () => {
    console.log('💰 Generez pentru tip EXPENSE...');
    
    try {
      const combo = TestDataGenerator.getComboForType('EXPENSE' as any);
      
      console.log('✅ Combinație EXPENSE:', {
        categorie: combo.categoryKey,
        subcategorie: combo.subcategory,
        sumă: combo.amount
      });
      
      expect(combo.transactionType).toBe('EXPENSE');
      
    } catch (error) {
      console.error('❌ Eroare la generare EXPENSE:', error);
      throw error;
    }
  });
}); 
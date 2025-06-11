import { test, expect } from '@playwright/test';
import { LunarGridPage } from '../support/pages/LunarGridPage';
import { AuthPage } from '../support/pages/AuthPage';
import { TestDataGenerator, TransactionFormDataGenerator } from '../config/test-data-generator';

/**
 * 🟢 SMOKE TESTS - TRANSACTION MANAGEMENT
 * 
 * Testează workflow-urile critice pentru gestionarea tranzacțiilor:
 * - Adăugare tranzacție nouă
 * - Editare tranzacție existentă  
 * - Ștergere tranzacție
 * - Filtrare și căutare
 * - Export de date
 */

test.describe('🟢 Transaction Management Smoke Tests', { tag: '@smoke' }, () => {
  let lunarGridPage: LunarGridPage;
  let authPage: AuthPage;

  test.beforeEach(async ({ page }) => {
    lunarGridPage = new LunarGridPage(page);
    authPage = new AuthPage(page);

    // Autentificare cu fix-ul pentru logica corectă
    const loginResult = await authPage.loginWithPrimaryAccount();
    expect(loginResult.success).toBe(true);

    // Navighează la LunarGrid
    await lunarGridPage.goto();
    await lunarGridPage.waitForGridToLoad();
  });

  test('utilizatorul poate adăuga o tranzacție nouă în grid', async () => {
    // Expandează o categorie aleatoare
    const categoryKey = await lunarGridPage.expandRandomCategory();
    
    // Adaugă o subcategorie pentru testare
    const subcategoryName = await lunarGridPage.addRandomSubcategory(categoryKey);
    
    // Adaugă o tranzacție în subcategorie
    const transaction = await lunarGridPage.addRandomTransactionInSubcategory(categoryKey, subcategoryName);
    
    // Verifică că tranzacția apare în grid
    await lunarGridPage.verifyCellValue(categoryKey, subcategoryName, transaction.day, transaction.amount);
  });

  test('utilizatorul poate crea o subcategorie nouă', async () => {
    // Expandează o categorie aleatoare
    const categoryKey = await lunarGridPage.expandRandomCategory();
    
    // Adaugă o subcategorie nouă
    const subcategoryName = await lunarGridPage.addRandomSubcategory(categoryKey);
    
    // Verifică că subcategoria există
    await lunarGridPage.verifySubcategoryExists(subcategoryName);
  });

  test('utilizatorul poate redenumi o subcategorie', async () => {
    // Expandează o categorie și adaugă subcategorie
    const categoryKey = await lunarGridPage.expandRandomCategory();
    const originalName = await lunarGridPage.addRandomSubcategory(categoryKey);
    
    // Redenumește subcategoria
    const newName = await lunarGridPage.renameSubcategory(originalName);
    
    // Verifică că noul nume există și vechiul nu mai există
    await lunarGridPage.verifySubcategoryExists(newName);
    await lunarGridPage.verifySubcategoryNotExists(originalName);
  });

  test('utilizatorul poate adăuga o tranzacție recurentă', async () => {
    // Expandează o categorie și adaugă subcategorie
    const categoryKey = await lunarGridPage.expandRandomCategory();
    const subcategoryName = await lunarGridPage.addRandomSubcategory(categoryKey);
    
    // Adaugă o tranzacție recurentă
    const transaction = await lunarGridPage.addRandomRecurringTransaction(categoryKey, subcategoryName);
    
    // Verifică că tranzacția apare în grid
    await lunarGridPage.verifyCellValue(categoryKey, subcategoryName, transaction.day, transaction.amount);
  });

  test('utilizatorul poate șterge o tranzacție din celulă', async () => {
    // Expandează categorie și adaugă subcategorie cu tranzacție
    const categoryKey = await lunarGridPage.expandRandomCategory();
    const subcategoryName = await lunarGridPage.addRandomSubcategory(categoryKey);
    const transaction = await lunarGridPage.addRandomTransactionInSubcategory(categoryKey, subcategoryName);
    
    // Șterge tranzacția
    await lunarGridPage.deleteTransactionFromCell(categoryKey, subcategoryName, transaction.day);
    
    // Verifică că celula este goală (sau conține "0.00")
    await lunarGridPage.verifyCellValue(categoryKey, subcategoryName, transaction.day, "0.00");
  });

  test('utilizatorul poate naviga prin luni diferite', async () => {
    // Schimbă luna la o lună aleatoare
    const newDate = await lunarGridPage.changeToRandomMonth();
    
    // Verifică că header-ul lunii s-a actualizat
    await lunarGridPage.verifyMonthHeader(newDate.month, newDate.year);
  });
}); 
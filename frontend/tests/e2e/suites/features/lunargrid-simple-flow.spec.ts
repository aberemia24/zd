import { test, expect } from '@playwright/test';
import { AuthPage } from '../../support/pages/AuthPage';
import { LunarGridPage } from '../../support/pages/LunarGridPage';
import { AccountManager } from '../../support/AccountManager';

test.describe('LunarGrid - Flux Simplu E2E', () => {
  let authPage: AuthPage;
  let lunarGridPage: LunarGridPage;
  
  // Variabile pentru starea testului
  let selectedCategory: string;
  let customSubcategoryName: string;
  let renamedSubcategoryName: string;
  let transactionAmount: string;
  let transactionDescription: string;
  let recurringFrequency: string;

  test.beforeEach(async ({ page }) => {
    authPage = new AuthPage(page);
    lunarGridPage = new LunarGridPage(page);
  });

  test('fluxul complet: login → expand → adaugă subcategorie → redenumește → adaugă tranzacții → șterge → schimbă luna', async ({ page }) => {
    // **PASUL 1: Login** 
    console.log('🔐 Pasul 1: Login cu credențiale existente');
    const testAccount = AccountManager.getPrimaryAccount();
    
    await authPage.goto();
    const loginResult = await authPage.login(testAccount);
    
    expect(loginResult.success).toBe(true);
    console.log('✅ Login reușit');

    // **PASUL 2: Navighează la LunarGrid**
    console.log('🗓️ Pasul 2: Navigare la LunarGrid');
    await lunarGridPage.goto();
    await lunarGridPage.verifyGridIsDisplayed();
    console.log('✅ LunarGrid încărcat cu succes');

    // **PASUL 3: Expandează o categorie aleatorie**
    console.log('📂 Pasul 3: Expandează categorie aleatorie');
    selectedCategory = await lunarGridPage.expandRandomCategory();
    console.log(`✅ Categoria expandată: ${selectedCategory}`);

    // **PASUL 4: Adaugă subcategorie personalizată și confirmă adăugarea**
    console.log('➕ Pasul 4: Adaugă subcategorie personalizată');
    customSubcategoryName = lunarGridPage.generateRandomSubcategoryName();
    
    await lunarGridPage.addSubcategory(selectedCategory, customSubcategoryName);
    await lunarGridPage.verifySubcategoryAdded(customSubcategoryName);
    console.log(`✅ Subcategoria adăugată: ${customSubcategoryName}`);

    // **PASUL 5: Redenumește subcategoria și confirmă redenumirea**
    console.log('✏️ Pasul 5: Redenumește subcategoria');
    renamedSubcategoryName = lunarGridPage.generateRandomSubcategoryName();
    
    await lunarGridPage.renameSubcategory(customSubcategoryName, renamedSubcategoryName);
    await lunarGridPage.verifySubcategoryRenamed(customSubcategoryName, renamedSubcategoryName);
    console.log(`✅ Subcategoria redenumită de la "${customSubcategoryName}" la "${renamedSubcategoryName}"`);

    // **PASUL 6: Adaugă tranzacție prin single-click modal și confirmă adăugarea**
    console.log('💰 Pasul 6: Adaugă tranzacție prin modal');
    transactionAmount = lunarGridPage.generateRandomAmount();
    transactionDescription = lunarGridPage.generateRandomDescription();
    
    // Click pe celulă pentru a deschide modalul
    const testDay = 15; // Zi din mijlocul lunii pentru consistență
    await lunarGridPage.clickCellForTransaction(selectedCategory, renamedSubcategoryName, testDay);
    
    // Adaugă tranzacția
    await lunarGridPage.addTransaction(transactionAmount, transactionDescription);
    
    // Verifică că tranzacția a fost adăugată
    await lunarGridPage.verifyTransactionAdded(selectedCategory, renamedSubcategoryName, testDay, transactionAmount);
    console.log(`✅ Tranzacție adăugată: ${transactionAmount} - ${transactionDescription}`);

    // **PASUL 7: Adaugă tranzacție recurentă cu frecvență aleatorie**
    console.log('🔄 Pasul 7: Adaugă tranzacție recurentă');
    const recurringAmount = lunarGridPage.generateRandomAmount();
    const recurringDescription = lunarGridPage.generateRandomDescription();
    const frequencies = ['monthly', 'weekly', 'yearly'];
    recurringFrequency = frequencies[Math.floor(Math.random() * frequencies.length)];
    
    // Click pe altă celulă
    const recurringDay = 20;
    await lunarGridPage.clickCellForTransaction(selectedCategory, renamedSubcategoryName, recurringDay);
    
    // Adaugă tranzacția recurentă
    await lunarGridPage.addTransaction(recurringAmount, recurringDescription, true, recurringFrequency);
    
    // Verifică că tranzacția recurentă a fost adăugată
    await lunarGridPage.verifyTransactionAdded(selectedCategory, renamedSubcategoryName, recurringDay, recurringAmount);
    console.log(`✅ Tranzacție recurentă adăugată: ${recurringAmount} (${recurringFrequency})`);

    // **PASUL 8: Șterge o tranzacție prin single-click modal și confirmă ștergerea**
    console.log('🗑️ Pasul 8: Șterge tranzacție prin modal');
    
    // Click pe celula cu prima tranzacție pentru a o edita/șterge
    await lunarGridPage.clickCellForTransaction(selectedCategory, renamedSubcategoryName, testDay);
    
    // Șterge tranzacția din modal
    await lunarGridPage.deleteTransactionFromModal();
    
    console.log('✅ Tranzacție ștearsă cu succes');

    // **PASUL 9: Șterge subcategoria personalizată din tabel și confirmă ștergerea**
    console.log('🗂️ Pasul 9: Șterge subcategoria personalizată');
    
    await lunarGridPage.deleteSubcategory(renamedSubcategoryName);
    await lunarGridPage.verifySubcategoryDeleted(renamedSubcategoryName);
    console.log(`✅ Subcategoria "${renamedSubcategoryName}" ștearsă cu succes`);

    // **PASUL 10: Schimbă luna tabelului și confirmă actualizarea header-ului**
    console.log('📅 Pasul 10: Schimbă luna tabelului');
    
    // Lista de luni pentru test
    const months = ['Ianuarie', 'Februarie', 'Martie', 'Aprilie', 'Mai', 'Iunie', 
                   'Iulie', 'August', 'Septembrie', 'Octombrie', 'Noiembrie', 'Decembrie'];
    
    // Selectează o lună diferită de cea curentă
    const currentDate = new Date();
    const currentMonth = months[currentDate.getMonth()];
    const targetMonths = months.filter(month => month !== currentMonth);
    const targetMonth = targetMonths[Math.floor(Math.random() * targetMonths.length)];
    
    await lunarGridPage.changeMonth(targetMonth);
    await lunarGridPage.verifyMonthHeaderUpdate(targetMonth);
    console.log(`✅ Luna schimbată cu succes către: ${targetMonth}`);

    // **PASUL 11: Verificare finală - validează că toate schimbările au fost procesate**
    console.log('✨ Pasul 11: Verificări finale');
    
    // Verifică că grid-ul este încă funcțional după toate operațiunile
    await lunarGridPage.verifyGridIsDisplayed();
    
    // Verifică că subcategoria ștearsă nu mai apare
    const categoriesAfterDelete = await lunarGridPage.getSubcategoriesForCategory(selectedCategory);
    expect(categoriesAfterDelete).not.toContain(renamedSubcategoryName);
    
    console.log('✅ Toate verificările finale au trecut cu succes');
    console.log(`
    📋 REZUMAT FLUX COMPLET:
    - ✅ Login efectuat
    - ✅ Categorie expandată: ${selectedCategory}
    - ✅ Subcategorie adăugată și redenumită: ${customSubcategoryName} → ${renamedSubcategoryName}
    - ✅ Tranzacție normală adăugată: ${transactionAmount}
    - ✅ Tranzacție recurentă adăugată: ${recurringFrequency}
    - ✅ Tranzacție ștearsă
    - ✅ Subcategorie ștearsă
    - ✅ Luna schimbată către: ${targetMonth}
    - ✅ Grid-ul rămâne funcțional
    `);
  });

  test('verificare preliminară - elementele necesare sunt prezente', async ({ page }) => {
    console.log('🔍 Test preliminar: Verifică că toate elementele necesare sunt prezente');
    
    // Login rapid
    const testAccount = AccountManager.getPrimaryAccount();
    await authPage.goto();
    await authPage.login(testAccount);
    
    // Navighează la LunarGrid
    await lunarGridPage.goto();
    
    // Verifică că toate elementele principale sunt prezente
    await expect(lunarGridPage.lunarGridContainer).toBeVisible();
    await expect(lunarGridPage.lunarGridTable).toBeVisible();
    await expect(lunarGridPage.monthSelector).toBeVisible();
    await expect(lunarGridPage.yearInput).toBeVisible();
    
    // Verifică că există cel puțin o categorie disponibilă
    const categories = await lunarGridPage.getVisibleCategories();
    expect(categories.length).toBeGreaterThan(0);
    
    console.log(`✅ Test preliminar trecut - găsite ${categories.length} categorii: ${categories.join(', ')}`);
  });
}); 
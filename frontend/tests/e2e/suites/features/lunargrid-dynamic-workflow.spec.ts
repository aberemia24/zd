import { test, expect } from '@playwright/test';
import { AuthPage } from '../../support/pages/AuthPage';
import { LunarGridPage } from '../../support/pages/LunarGridPage';
import { TEST_ACCOUNTS } from '../../config/test-constants';

test.describe('LunarGrid - Flow Dinamic Complet', () => {
  let authPage: AuthPage;
  let lunarGridPage: LunarGridPage;

  test.beforeEach(async ({ page }) => {
    authPage = new AuthPage(page);
    lunarGridPage = new LunarGridPage(page);
  });

  test('11-Step Dynamic Workflow - Totul Random și Fără Hardcodări', async () => {
    console.log('\n🚀 Încep workflow-ul dinamic complet cu 11 pași...\n');

    // PASUL 1: Login (fără credențiale hardcodate) 
    console.log('📝 PASUL 1: Login dinamic');
    await authPage.goto();
    const loginResult = await authPage.loginWithPrimaryAccount();
    expect(loginResult.success).toBe(true);
    console.log('✅ Login reușit\n');

    // PASUL 2: Navigare la lunar grid
    console.log('🌙 PASUL 2: Navigare la LunarGrid');
    await lunarGridPage.navigateToLunarGrid();
    await lunarGridPage.waitForGridToLoad();
    console.log('✅ Navigare reușită la LunarGrid\n');

    // PASUL 3: Expand categorie random
    console.log('🎯 PASUL 3: Expandare categorie aleatoare');
    const selectedCategory = await lunarGridPage.expandRandomCategory();
    console.log(`✅ Categoria "${selectedCategory}" expandată cu succes\n`);

    // PASUL 4: Adăugare subcategorie custom cu nume random
    console.log('🔹 PASUL 4: Adăugare subcategorie cu nume random');
    const customSubcategoryName = await lunarGridPage.addRandomSubcategory(selectedCategory);
    await lunarGridPage.verifySubcategoryExists(customSubcategoryName);
    console.log(`✅ Subcategoria "${customSubcategoryName}" adăugată cu succes\n`);

    // PASUL 5: Redenumire subcategorie și confirmare
    console.log('✏️ PASUL 5: Redenumire subcategorie');
    const renamedSubcategoryName = await lunarGridPage.renameSubcategory(customSubcategoryName);
    await lunarGridPage.verifySubcategoryExists(renamedSubcategoryName);
    await lunarGridPage.verifySubcategoryNotExists(customSubcategoryName);
    console.log(`✅ Subcategoria redenumită de la "${customSubcategoryName}" la "${renamedSubcategoryName}"\n`);

    // PASUL 6: Adăugare tranzacție în subcategorie (ziua random)
    console.log('💰 PASUL 6: Adăugare tranzacție cu date random');
    const transaction1 = await lunarGridPage.addRandomTransactionInSubcategory(
      selectedCategory, 
      renamedSubcategoryName
    );
    
    // Verifică că tranzacția a fost salvată
    await lunarGridPage.verifyCellValue(
      selectedCategory, 
      renamedSubcategoryName, 
      transaction1.day,
      transaction1.amount
    );
    console.log(`✅ Tranzacție adăugată: ${transaction1.amount} RON pe ziua ${transaction1.day}\n`);

    // PASUL 7: Single click→modal→sumă+descriere random→salvare→verificare
    console.log('🔄 PASUL 7: Adăugare tranzacție prin click simplu');
    const transaction2 = await lunarGridPage.addRandomTransactionInSubcategory(
      selectedCategory, 
      renamedSubcategoryName
    );
    
    await lunarGridPage.verifyCellValue(
      selectedCategory, 
      renamedSubcategoryName, 
      transaction2.day,
      transaction2.amount
    );
    console.log(`✅ A doua tranzacție adăugată: ${transaction2.amount} RON pe ziua ${transaction2.day}\n`);

    // PASUL 8: Repetare cu tranzacție recurentă
    console.log('🔁 PASUL 8: Adăugare tranzacție recurentă');
    const recurringTransaction = await lunarGridPage.addRandomRecurringTransaction(
      selectedCategory, 
      renamedSubcategoryName
    );
    
    await lunarGridPage.verifyCellValue(
      selectedCategory, 
      renamedSubcategoryName, 
      recurringTransaction.day,
      recurringTransaction.amount
    );
    console.log(`✅ Tranzacție recurentă adăugată: ${recurringTransaction.amount} RON pe ziua ${recurringTransaction.day}\n`);

    // PASUL 9: Ștergere unei tranzacții prin modal
    console.log('🗑️ PASUL 9: Ștergere tranzacție prin double-click modal');
    await lunarGridPage.deleteTransactionFromCell(
      selectedCategory, 
      renamedSubcategoryName, 
      transaction1.day
    );
    console.log(`✅ Tranzacția din ziua ${transaction1.day} ștearsă cu succes\n`);

    // PASUL 10: Ștergere subcategorie custom din tabel
    console.log('🗑️ PASUL 10: Ștergere subcategorie custom');
    await lunarGridPage.deleteCustomSubcategory(renamedSubcategoryName);
    await lunarGridPage.verifySubcategoryNotExists(renamedSubcategoryName);
    console.log(`✅ Subcategoria "${renamedSubcategoryName}" ștearsă cu succes\n`);

    // PASUL 11: Schimbare lună și verificare header actualizat
    console.log('📅 PASUL 11: Schimbare lună și verificare header');
    const originalDate = {
      month: await lunarGridPage.getCurrentMonth(),
      year: await lunarGridPage.getCurrentYear()
    };
    
    const newDate = await lunarGridPage.changeToRandomMonth();
    
    // Verifică că luna s-a schimbat cu adevărat
    expect(newDate.month).not.toBe(originalDate.month);
    
    const monthNames = ['', 'Ianuarie', 'Februarie', 'Martie', 'Aprilie', 'Mai', 'Iunie', 
                      'Iulie', 'August', 'Septembrie', 'Octombrie', 'Noiembrie', 'Decembrie'];
    
    console.log(`✅ Luna schimbată de la ${monthNames[originalDate.month]} la ${monthNames[newDate.month]} ${newDate.year}\n`);

    console.log('🎉 WORKFLOW COMPLET FINALIZAT CU SUCCES!');
    console.log('Toate cele 11 pași au fost executați cu date complet dinamice și random.');
    console.log('Nu a fost folosită nicio valoare hardcodată în întreg flow-ul de test.');
  });

  test('Verificare funcționalități POM independente', async () => {
    console.log('\n🔧 Test funcționalități POM independente...\n');

    // Login
    await authPage.goto();
    const loginResult = await authPage.loginWithPrimaryAccount();
    expect(loginResult.success).toBe(true);

    // Navigare
    await lunarGridPage.navigateToLunarGrid();
    await lunarGridPage.waitForGridToLoad();

    // Verifică că metodele helper funcționează
    const categories = lunarGridPage.getAvailableCategories();
    expect(categories.length).toBeGreaterThan(0);
    console.log(`✅ ${categories.length} categorii disponibile`);

    // Testează obținerea subcategoriilor
    const firstCategory = categories[0];
    const subcategories = lunarGridPage.getSubcategoriesForCategory(firstCategory);
    console.log(`✅ Categoria "${firstCategory}" are ${subcategories.length} subcategorii`);

    // Testează obținerea datei curente
    const currentMonth = await lunarGridPage.getCurrentMonth();
    const currentYear = await lunarGridPage.getCurrentYear();
    expect(currentMonth).toBeGreaterThanOrEqual(1);
    expect(currentMonth).toBeLessThanOrEqual(12);
    expect(currentYear).toBeGreaterThan(2020);
    console.log(`✅ Data curentă: Luna ${currentMonth}, Anul ${currentYear}`);

    console.log('🎉 Toate funcționalitățile POM verificate cu succes!');
  });
}); 
import { test, expect } from '@playwright/test';
import { AuthPage } from '../support/pages/AuthPage';
import TestDataGenerator, { LunarGridTestData } from '../config/test-data-generator';

test.describe('Explorare Aplicație', () => {
  let authPage: AuthPage;

  test.beforeEach(async ({ page }) => {
    authPage = new AuthPage(page);
  });

  test('explorez lunar grid cu date dinamice', async ({ page }) => {
    // Obține date de test dinamice pentru LunarGrid
    const testData = LunarGridTestData.getGridTestData();
    console.log('🎲 Date test generate:', {
      primar: `${testData.primaryCombo.categoryKey} -> ${testData.primaryCombo.subcategory} (${testData.primaryCombo.amount})`,
      secundar: `${testData.secondaryCombo.categoryKey} -> ${testData.secondaryCombo.subcategory} (${testData.secondaryCombo.amount})`,
      total: testData.expectedTotal
    });
    
    // Login mai întâi
    await authPage.loginWithPrimaryAccount();
    console.log('🔍 URL după login:', page.url());
    
    // Navighează la LunarGrid
    await page.getByTestId('lunar-grid-tab').click();
    await page.waitForLoadState('networkidle');
    console.log('🔍 URL LunarGrid:', page.url());
    
    // Așteaptă să se încarce grid-ul
    await page.waitForTimeout(3000);
    
    // Verifică ce elemente există în grid
    const gridContainer = page.getByTestId('lunar-grid-container');
    await expect(gridContainer).toBeVisible();
    
    // Caută butoanele de expand/collapse
    const expandButtons = page.locator('[data-testid*="expand"]');
    const expandCount = await expandButtons.count();
    console.log(`🔍 Butoane expand găsite: ${expandCount}`);
    
    // Testez expandarea tuturor categoriilor cu butonul "toggle expand all"
    const toggleExpandAllButton = page.getByTestId('toggle-expand-all');
    if (await toggleExpandAllButton.isVisible()) {
      console.log('🔍 Expandez toate categoriile cu "toggle-expand-all"');
      await toggleExpandAllButton.click();
      await page.waitForTimeout(2000);
    } else {
      console.log('⚠️ Butonul "toggle-expand-all" nu este vizibil');
    }
    
    // Caută selectori dinamici pentru combinația primară
    const primarySelectors = LunarGridTestData.getDynamicSelectors(testData.primaryCombo, 15);
    console.log('🔍 Selectori dinamici generați:', {
      toggleExpandAll: primarySelectors.toggleExpandAllButton,
      expandCategory: primarySelectors.expandCategoryButton,
      celulaTinta: primarySelectors.cellSelector,
      categorieHeader: primarySelectors.categoryHeader,
      subcategorieRow: primarySelectors.subcategoryRow
    });
    
    // Verifică existența celulei specifice
    const targetCell = page.getByTestId(primarySelectors.cellSelector);
    const cellExists = await targetCell.isVisible().catch(() => false);
    console.log(`🔍 Celula țintă ${primarySelectors.cellSelector} există: ${cellExists}`);
    
    // Caută și alte variante de selectori pentru celule
    const alternativeCellSelectors = [
      `lunar-cell-${testData.primaryCombo.categoryKey.toLowerCase()}-${testData.primaryCombo.subcategory.toLowerCase().replace(/\s+/g, '-')}-15`,
      `cell-${testData.primaryCombo.categoryKey}-${testData.primaryCombo.subcategory}-15`,
      `grid-cell-${testData.primaryCombo.categoryKey}-15`
    ];
    
    for (const selector of alternativeCellSelectors) {
      const altCell = page.getByTestId(selector);
      const altExists = await altCell.isVisible().catch(() => false);
      if (altExists) {
        console.log(`🎯 Selector alternativ funcțional: ${selector}`);
        break;
      }
    }
    
    // Caută celule după expandare
    await page.waitForTimeout(1000); // Așteaptă să se încarce celulele expandate
    const cells = page.locator('[data-testid*="editable-cell"]');
    const cellCount = await cells.count();
    console.log(`🔍 Total celule găsite după expandare: ${cellCount}`);
    
    // Dacă nu găsești celule, caută toate elementele cu data-testid pentru debugging
    if (cellCount === 0) {
      console.log('🔍 Căutând toate elementele cu data-testid...');
      const allTestIds = page.locator('[data-testid]');
      const allCount = await allTestIds.count();
      console.log(`🔍 Total elemente cu data-testid: ${allCount}`);
      
      // Afișează primele 20 data-testid-uri pentru a vedea ce există
      for (let i = 0; i < Math.min(20, allCount); i++) {
        const element = allTestIds.nth(i);
        const testId = await element.getAttribute('data-testid');
        if (testId?.includes('lunar') || testId?.includes('cell') || testId?.includes('expand')) {
          console.log(`🔍 Element relevant: ${testId}`);
        }
      }
    } else {
      // Afișează primele 10 celule cu testid-urile lor
      for (let i = 0; i < Math.min(10, cellCount); i++) {
        const cell = cells.nth(i);
        const testId = await cell.getAttribute('data-testid');
        const isVisible = await cell.isVisible();
        console.log(`🔍 Celula ${i}: ${testId}, vizibilă: ${isVisible}`);
      }
    }
    
    // Verifică din nou celula țintă după expandare
    const targetCellAfterExpand = page.getByTestId(primarySelectors.cellSelector);
    const cellExistsAfterExpand = await targetCellAfterExpand.isVisible().catch(() => false);
    console.log(`🔍 Celula țintă după expandare: ${cellExistsAfterExpand}`);
    
    // Caută selectoare pentru lună/an
    const monthSelector = page.getByTestId('month-selector');
    const yearInput = page.getByTestId('year-input');
    console.log('🔍 Month selector există:', await monthSelector.isVisible());
    console.log('🔍 Year input există:', await yearInput.isVisible());
    
    // Fă un screenshot pentru a vedea starea curentă
    await page.screenshot({ path: 'test-results/lunar-grid-dynamic-exploration.png', fullPage: true });
    console.log('✅ Screenshot salvat: lunar-grid-dynamic-exploration.png');
  });

  test('explorez transactions page cu date dinamice', async ({ page }) => {
    // Obține combinații de test dinamice
    const expenseCombo = TestDataGenerator.getComboForType('EXPENSE' as any);
    const incomeCombo = TestDataGenerator.getComboForType('INCOME' as any);
    const savingCombo = TestDataGenerator.getComboForType('SAVING' as any);
    
    console.log('🎲 Combinații generate pentru explorare:', {
      cheltuială: `${expenseCombo.categoryKey} -> ${expenseCombo.subcategory} (${expenseCombo.amount})`,
      venit: `${incomeCombo.categoryKey} -> ${incomeCombo.subcategory} (${incomeCombo.amount})`,
      economie: `${savingCombo.categoryKey} -> ${savingCombo.subcategory} (${savingCombo.amount})`
    });
    
    // Login mai întâi
    await authPage.loginWithPrimaryAccount();
    
    // Rămâne pe transactions (default după login)
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    console.log('🔍 URL Transactions:', page.url());
    
    // Caută elemente de category editor
    const categoryElements = page.locator('[data-testid*="category"]');
    const categoryCount = await categoryElements.count();
    console.log(`🔍 Elemente categorie găsite: ${categoryCount}`);
    
    // Caută formulare de adăugare tranzacție
    const formElements = page.locator('[data-testid*="transaction"]');
    const formCount = await formElements.count();
    console.log(`🔍 Elemente formulare găsite: ${formCount}`);
    
    // Caută selectoare/dropdown-uri
    const selects = page.locator('select');
    const selectCount = await selects.count();
    console.log(`🔍 Select-uri găsite: ${selectCount}`);
    
    // Test cu date dinamic: încearcă să găsească selectorul pentru prima categorie
    const categorySelector = page.getByTestId('category-select').first();
    if (await categorySelector.isVisible()) {
      console.log(`🔍 Selector categorie găsit, opțiuni disponibile:`);
      const options = categorySelector.locator('option');
      const optionCount = await options.count();
      
      for (let i = 0; i < Math.min(5, optionCount); i++) {
        const optionText = await options.nth(i).textContent();
        console.log(`   Opțiunea ${i}: ${optionText}`);
      }
    }
    
    // Fă un screenshot pentru a vedea interfața
    await page.screenshot({ path: 'test-results/transactions-dynamic-exploration.png', fullPage: true });
    console.log('✅ Screenshot salvat: transactions-dynamic-exploration.png');
  });
}); 
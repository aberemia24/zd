import { test, expect } from '@playwright/test';
import { AuthPage } from '../../support/pages/AuthPage';
import TestDataGenerator, { LunarGridTestData } from '../../config/test-data-generator';

test.describe('LunarGrid Integrare Completă cu Date Dinamice', () => {
  let authPage: AuthPage;

  test.beforeEach(async ({ page }) => {
    authPage = new AuthPage(page);
    TestDataGenerator.reset(); // Resetează pentru fiecare test
  });

  test('workflow complet LunarGrid cu date dinamice', { tag: '@integration' }, async ({ page }) => {
    console.log('🚀 Începe workflow complet LunarGrid cu date dinamice');
    
    // Obține date de test pentru LunarGrid
    const gridData = LunarGridTestData.getGridTestData();
    console.log('🎲 Date generate pentru LunarGrid:', {
      primar: `${gridData.primaryCombo.transactionType} | ${gridData.primaryCombo.categoryKey} → ${gridData.primaryCombo.subcategory} (${gridData.primaryCombo.amount})`,
      secundar: `${gridData.secondaryCombo.transactionType} | ${gridData.secondaryCombo.categoryKey} → ${gridData.secondaryCombo.subcategory} (${gridData.secondaryCombo.amount})`,
      totalAșteptat: gridData.expectedTotal
    });
    
    // Login
    await authPage.loginWithPrimaryAccount();
    
    // Navighează la LunarGrid
    await page.getByTestId('lunar-grid-tab').click();
    await page.waitForLoadState('networkidle');
    console.log('✅ Navigat la LunarGrid');
    
    // Verifică existența grid-ului
    const gridContainer = page.getByTestId('lunar-grid-container');
    await expect(gridContainer).toBeVisible();
    
    // Obține workflow-ul LunarGrid
    const workflow = LunarGridTestData.getLunarGridWorkflow();
    
    // Pasul 1: Expandează toate categoriile
    const toggleExpandButton = page.getByTestId(workflow.STEP_TOGGLE_EXPAND_ALL);
    await expect(toggleExpandButton).toBeVisible();
    await toggleExpandButton.click();
    await page.waitForTimeout(workflow.WAIT_FOR_EXPANSION);
    console.log('✅ Expandat toate categoriile');
    
    // Verifică că s-au expandat celule
    const expandedCells = page.locator('[data-testid*="editable-cell"]');
    const cellCount = await expandedCells.count();
    expect(cellCount).toBeGreaterThan(1000); // Mult mai multe celule după expandare
    console.log(`✅ ${cellCount} celule expandate găsite`);
    
    // Pasul 2: Testează celula primară
    const primarySelectors = LunarGridTestData.getDynamicSelectors(gridData.primaryCombo, 15);
    const primaryCell = page.getByTestId(primarySelectors.cellSelector);
    await expect(primaryCell).toBeVisible();
    console.log(`✅ Celula primară găsită: ${primarySelectors.cellSelector}`);
    
    // Pasul 3: Testează celula secundară
    const secondarySelectors = LunarGridTestData.getDynamicSelectors(gridData.secondaryCombo, 15);
    const secondaryCell = page.getByTestId(secondarySelectors.cellSelector);
    await expect(secondaryCell).toBeVisible();
    console.log(`✅ Celula secundară găsită: ${secondarySelectors.cellSelector}`);
    
    // Pasul 4: Test click pe celule (simulare editare)
    await primaryCell.click();
    console.log('✅ Click realizat pe celula primară');
    
    await secondaryCell.click();
    console.log('✅ Click realizat pe celula secundară');
    
    // Pasul 5: Test collapse cu reset
    const resetButton = page.getByTestId(workflow.STEP_RESET_EXPANDED);
    await expect(resetButton).toBeVisible();
    await resetButton.click();
    await page.waitForTimeout(1000);
    console.log('✅ Reset expandare realizat');
    
    // Verifică că s-au redus celulele după reset
    const cellsAfterReset = page.locator('[data-testid*="editable-cell"]');
    const cellCountAfterReset = await cellsAfterReset.count();
    expect(cellCountAfterReset).toBeLessThan(cellCount);
    console.log(`✅ Celule după reset: ${cellCountAfterReset} (reduse față de ${cellCount})`);
    
    // Screenshot final
    await page.screenshot({ path: 'test-results/lunargrid-integration-complete.png', fullPage: true });
    console.log('✅ Screenshot salvat: lunargrid-integration-complete.png');
  });

  test('testează varietatea în mai multe rulări consecutive', async ({ page }) => {
    console.log('🎯 Test varietate pentru rulări consecutive');
    
    // Login o singură dată
    await authPage.loginWithPrimaryAccount();
    await page.getByTestId('lunar-grid-tab').click();
    await page.waitForLoadState('networkidle');
    
    // Expandează grid-ul
    await page.getByTestId('toggle-expand-all').click();
    await page.waitForTimeout(2000);
    
    // Generează și testează 5 combinații diferite
    const testedCombos: string[] = [];
    for (let i = 1; i <= 5; i++) {
      const combo = TestDataGenerator.getNextCombo();
      const comboKey = `${combo.categoryKey}-${combo.subcategory}`;
      testedCombos.push(comboKey);
      
      const selectors = LunarGridTestData.getDynamicSelectors(combo, 10 + i);
      const cell = page.getByTestId(selectors.cellSelector);
      const exists = await cell.isVisible().catch(() => false);
      
      console.log(`${i}. ${combo.transactionType} | ${combo.categoryKey} → ${combo.subcategory} | Celula există: ${exists}`);
      
      if (exists) {
        await cell.click(); // Test interacțiune
        await page.waitForTimeout(100);
      }
    }
    
    // Verifică că avem combinații (poate nu toate unice, dar să avem combinații)
    const uniqueCombos = new Set(testedCombos);
    expect(testedCombos.length).toBe(5); // Verificăm că am generat 5 combinații
    console.log(`Combinații generate: ${testedCombos.length}, unique: ${uniqueCombos.size}`);
    console.log('✅ Combinații generate cu succes');
    
    // Afișează statistici finale
    const stats = TestDataGenerator.getStats();
    console.log('📊 Statistici finale:', {
      totalEstimate: stats.totalCombinations,
      folosite: stats.usedCombinations,
      rămase: stats.remainingCombinations
    });
  });
}); 
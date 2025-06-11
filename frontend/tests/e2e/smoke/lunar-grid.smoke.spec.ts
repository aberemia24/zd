import { test, expect } from '@playwright/test';
import { AuthPage } from '../support/pages/AuthPage';

test.describe('Smoke: LunarGrid Basic Functionality', () => {
  let authPage: AuthPage;

  test.beforeEach(async ({ page }) => {
    authPage = new AuthPage(page);
    // Login rapid pentru toate testele
    await authPage.loginWithPrimaryAccount();
    await page.getByTestId('lunar-grid-tab').click();
    await page.waitForLoadState('networkidle');
  });

  test('LunarGrid se deschide și afișează grid-ul', { tag: '@smoke' }, async ({ page }) => {
    console.log('🔍 Smoke Test: LunarGrid Loading');
    
    // Verifică că container-ul principal există
    await expect(page.getByTestId('lunar-grid-container')).toBeVisible();
    
    // Verifică că tabelul se afișează
    await expect(page.getByTestId('lunar-grid-table')).toBeVisible();
    
    console.log('✅ Smoke Test: LunarGrid Loading - SUCCESS');
  });

  test('expand/collapse categorii funcționează', { tag: '@smoke' }, async ({ page }) => {
    console.log('🔍 Smoke Test: Expand/Collapse');
    
    // Verifică că grid-ul e încărcat
    await expect(page.getByTestId('lunar-grid-container')).toBeVisible();
    
    // Count celule înainte de expandare
    const cellsBefore = await page.locator('[data-testid*="editable-cell"]').count();
    console.log(`📊 Celule înainte: ${cellsBefore}`);
    
    // Expandează toate categoriile
    const expandButton = page.getByTestId('toggle-expand-all');
    if (await expandButton.isVisible()) {
      await expandButton.click();
      await page.waitForTimeout(2000); // Așteaptă animația
      
      // Count celule după expandare
      const cellsAfter = await page.locator('[data-testid*="editable-cell"]').count();
      console.log(`📊 Celule după expandare: ${cellsAfter}`);
      
      // Verifică că s-au adăugat celule (expandare reușită)
      expect(cellsAfter).toBeGreaterThan(cellsBefore);
      
      // Reset expandare
      const resetButton = page.getByTestId('reset-expanded');
      if (await resetButton.isVisible()) {
        await resetButton.click();
        await page.waitForTimeout(1000);
        
        const cellsAfterReset = await page.locator('[data-testid*="editable-cell"]').count();
        console.log(`📊 Celule după reset: ${cellsAfterReset}`);
        
        // Verifică că s-au redus celulele
        expect(cellsAfterReset).toBeLessThan(cellsAfter);
      }
    }
    
    console.log('✅ Smoke Test: Expand/Collapse - SUCCESS');
  });

  test('celulele grid-ului răspund la click', { tag: '@smoke' }, async ({ page }) => {
    console.log('🔍 Smoke Test: Cell Interaction');
    
    // Verifică că grid-ul e încărcat
    await expect(page.getByTestId('lunar-grid-container')).toBeVisible();
    
    // Expandează pentru a avea celule disponibile
    // WORKAROUND: Grid-ul se resetează după edit, deci expandăm din nou
    const expandButton = page.getByTestId('toggle-expand-all');
    if (await expandButton.isVisible()) {
      await expandButton.click();
      await page.waitForTimeout(2000); // Așteaptă animația
      
      // Verifică că expandarea a reușit și avem celule
      const cellCount = await page.locator('[data-testid*="editable-cell"]').count();
      console.log(`📊 Celule după expandare: ${cellCount}`);
      
      if (cellCount === 0) {
        console.log('⚠️ Nu s-au găsit celule după expandare, încercăm din nou...');
        await expandButton.click();
        await page.waitForTimeout(3000);
      }
    }
    
    // Găsește prima celulă editabilă disponibilă
    const firstCell = page.locator('[data-testid*="editable-cell"]').first();
    await expect(firstCell).toBeVisible({ timeout: 10000 });
    
    // Click pe celulă
    await firstCell.click();
    
    // Nu verificăm comportament specific de editare (asta e responsabilitatea testelor de integrare)
    // Doar că click-ul nu aruncă erori și celula rămâne vizibilă
    await expect(firstCell).toBeVisible();
    
    console.log('✅ Smoke Test: Cell Interaction - SUCCESS');
  });
}); 
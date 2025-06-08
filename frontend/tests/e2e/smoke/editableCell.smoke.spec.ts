import { test, expect } from '@playwright/test';
import { AuthPage } from '../support/pages/AuthPage';
import { LunarGridPage } from '../support/pages/LunarGridPage';

test.describe('Smoke: EditableCell Comprehensive Testing', () => {
  let authPage: AuthPage;
  let lunarGridPage: LunarGridPage;

  test.beforeEach(async ({ page }) => {
    authPage = new AuthPage(page);
    lunarGridPage = new LunarGridPage(page);
    
    // Login rapid pentru toate testele
    await authPage.loginWithPrimaryAccount();
    await lunarGridPage.navigateToLunarGrid();
  });

  test('Double-click edit flow cu value formatting verification', { tag: '@smoke' }, async ({ page }) => {
    console.log('🔍 Smoke Test: Double-click Edit Flow');
    
    // Expandează pentru a avea celule disponibile
    const expandButton = page.getByTestId('toggle-expand-all');
    if (await expandButton.isVisible()) {
      await expandButton.click();
      await page.waitForTimeout(2000);
    }
    
    // Găsește prima celulă editabilă
    const firstCell = page.locator('[data-testid*="editable-cell"]').first();
    await expect(firstCell).toBeVisible({ timeout: 10000 });
    
    // Double-click pentru a intra în edit mode
    await firstCell.dblclick();
    
    // Verifică că input-ul de editare apare
    const editInput = page.locator('[data-testid*="editable-cell-input"]').first();
    await expect(editInput).toBeVisible();
    
    // Introduce valoarea test '123.45' 
    await editInput.fill('123.45');
    
    // Press Enter pentru a salva
    await editInput.press('Enter');
    
    // Așteaptă formatarea să se aplice și verifică valoarea formatată
    await page.waitForTimeout(1000);
    
    // Verifică că valoarea s-a formatat corect (poate fi '123,45' în format Romanian)
    const cellContent = await firstCell.textContent();
    console.log(`📊 Valoare formatată: ${cellContent}`);
    
    // Acceptăm atât '123.45' cât și '123,45' ca formate valide
    expect(cellContent?.trim()).toMatch(/123[.,]45/);
    
    console.log('✅ Smoke Test: Double-click Edit Flow - SUCCESS');
  });

  test('Mobile long-press hover actions (600ms) cu touch events', { tag: '@smoke' }, async ({ page }) => {
    console.log('🔍 Smoke Test: Mobile Long-press Hover Actions');
    
    // Expandează pentru a avea celule disponibile
    const expandButton = page.getByTestId('toggle-expand-all');
    if (await expandButton.isVisible()) {
      await expandButton.click();
      await page.waitForTimeout(2000);
    }
    
    // Găsește prima celulă editabilă
    const firstCell = page.locator('[data-testid*="editable-cell"]').first();
    await expect(firstCell).toBeVisible({ timeout: 10000 });
    
    // Simulează touch start event
    await firstCell.dispatchEvent('touchstart');
    
    // Așteaptă 600ms pentru long-press duration conform specificațiilor
    await page.waitForTimeout(600);
    
    // Verifică că hover actions sunt vizibile (edit button cu aria-label)
    const editButton = page.getByRole('button', { name: 'Edit cell inline' });
    await expect(editButton).toBeVisible({ timeout: 2000 });
    
    // Verifică aria-label pentru accessibility
    await expect(editButton).toHaveAttribute('aria-label', 'Edit cell inline');
    
    // Verifică că more button este de asemenea vizibil
    const moreButton = page.getByRole('button', { name: 'Open advanced options modal' });
    await expect(moreButton).toBeVisible();
    
    // Cleanup - touch end event
    await firstCell.dispatchEvent('touchend');
    
    console.log('✅ Smoke Test: Mobile Long-press Hover Actions - SUCCESS');
  });

  test('Keyboard accessibility (F2, Enter, Escape navigation)', { tag: '@smoke' }, async ({ page }) => {
    console.log('🔍 Smoke Test: Keyboard Accessibility Navigation');
    
    // Expandează pentru a avea celule disponibile
    const expandButton = page.getByTestId('toggle-expand-all');
    if (await expandButton.isVisible()) {
      await expandButton.click();
      await page.waitForTimeout(2000);
    }
    
    // Găsește prima celulă editabilă și focusează
    const firstCell = page.locator('[data-testid*="editable-cell"]').first();
    await expect(firstCell).toBeVisible({ timeout: 10000 });
    await firstCell.focus();
    
    // Test F2 pentru start edit când not editing și not readonly
    await page.keyboard.press('F2');
    
    // Verifică că edit input apare
    const editInput = page.locator('[data-testid*="editable-cell-input"]').first();
    await expect(editInput).toBeVisible();
    
    // Test Escape pentru cancel edit
    await page.keyboard.press('Escape');
    
    // Verifică că edit input dispare
    await expect(editInput).not.toBeVisible();
    
    // Focus din nou pe celulă pentru al doilea test
    await firstCell.focus();
    
    // Hover pentru a afișa hover actions (simulează mouse hover)
    await firstCell.hover();
    
    // Test Enter când hover actions sunt afișate
    await page.keyboard.press('Enter');
    
    // Verifică că edit input apare din nou
    await expect(editInput).toBeVisible();
    
    // Introduce valoarea și salvează cu Enter
    await editInput.fill('200');
    await page.keyboard.press('Enter');
    
    // Verifică că valoarea s-a salvat
    await page.waitForTimeout(1000);
    await expect(editInput).not.toBeVisible();
    
    console.log('✅ Smoke Test: Keyboard Accessibility Navigation - SUCCESS');
  });

  test('Touch event simulation și aria-label verification', { tag: '@smoke' }, async ({ page }) => {
    console.log('🔍 Smoke Test: Touch Events & ARIA Labels');
    
    // Expandează pentru a avea celule disponibile
    const expandButton = page.getByTestId('toggle-expand-all');
    if (await expandButton.isVisible()) {
      await expandButton.click();
      await page.waitForTimeout(2000);
    }
    
    // Găsește prima celulă editabilă
    const firstCell = page.locator('[data-testid*="editable-cell"]').first();
    await expect(firstCell).toBeVisible({ timeout: 10000 });
    
    // Verifică aria-label-ul celulei înainte de hover
    const cellAriaLabel = await firstCell.getAttribute('aria-label');
    console.log(`🏷️ Cell aria-label: ${cellAriaLabel}`);
    expect(cellAriaLabel).toContain('cell with value');
    
    // Simulează long-press cu touch events
    await firstCell.dispatchEvent('touchstart', { touches: [{ clientX: 100, clientY: 100 }] });
    await page.waitForTimeout(600); // 600ms pentru long-press
    
    // Verifică că hover actions sunt vizibile
    const editButton = page.getByTestId(`edit-button-${await firstCell.getAttribute('data-testid')?.then(id => id.replace('editable-cell-', ''))}`.replace(/^edit-button-editable-cell-/, 'edit-button-'));
    
    // Caută edit button cu selector mai flexibil
    const editButtonAlt = page.locator('button[aria-label="Edit cell inline"]');
    await expect(editButtonAlt).toBeVisible({ timeout: 3000 });
    
    // Verifică aria labels pentru accessibility compliance
    await expect(editButtonAlt).toHaveAttribute('aria-label', 'Edit cell inline');
    await expect(editButtonAlt).toHaveAttribute('title', 'Edit inline (F2)');
    
    // Verifică more button aria labels
    const moreButton = page.locator('button[aria-label="Open advanced options modal"]');
    await expect(moreButton).toBeVisible();
    await expect(moreButton).toHaveAttribute('aria-label', 'Open advanced options modal');
    await expect(moreButton).toHaveAttribute('title', 'More options');
    
    // Test click pe edit button
    await editButtonAlt.click();
    
    // Verifică că edit input apare
    const editInput = page.locator('[data-testid*="editable-cell-input"]').first();
    await expect(editInput).toBeVisible();
    
    // Cleanup - touch end și escape
    await firstCell.dispatchEvent('touchend');
    await page.keyboard.press('Escape');
    
    console.log('✅ Smoke Test: Touch Events & ARIA Labels - SUCCESS');
  });
}); 
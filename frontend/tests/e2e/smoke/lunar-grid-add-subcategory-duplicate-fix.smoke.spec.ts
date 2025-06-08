import { test, expect } from '@playwright/test';
import { AuthPage } from '../support/pages/AuthPage';
import { AccountManager } from '../support/AccountManager';

test.describe('🟢 LunarGrid - Add Subcategory Button Duplicate Fix', () => {
  test.beforeEach(async ({ page }) => {
    // 🔐 AUTENTIFICARE: Login cu contul principal
    const authPage = new AuthPage(page);
    const primaryAccount = AccountManager.getPrimaryAccount();
    
    await authPage.goto();
    await authPage.login(primaryAccount);
    
    // Navighează la Grid Lunar după autentificare
    await page.getByTestId('lunar-grid-tab').click();
    await expect(page).toHaveURL(/\/lunar-grid/);
    
    // Așteaptă ca grida să se încarce complet
    await expect(page.locator('[data-testid="lunar-grid-table"]')).toBeVisible();
  });

  test('should display only ONE Add Subcategory button per category - Core Fix Test', async ({ page }) => {
    // 🎯 CRITICAL TEST: Verifică că NU se dublează butonul "Adaugă subcategorie"
    
    // Expandează categoria ECONOMII 
    await page.getByTestId('toggle-category-ECONOMII').click();
    
    // Verifică că categoria este extinsă și subcategoriile sunt vizibile
    await expect(page.locator('text=Fond de urgență')).toBeVisible();
    
    // 🔥 MAIN ASSERTION: Verifică că există exact UN buton "Adaugă subcategorie"
    const addSubcategoryButtons = page.locator('[data-testid="add-subcategory-ECONOMII"]');
    await expect(addSubcategoryButtons).toHaveCount(1);
    
    // Verifică că butonul conține textul corect
    await expect(addSubcategoryButtons).toContainText('Adaugă subcategorie');
  });

  test('should maintain single Add Subcategory button across expand/collapse cycles', async ({ page }) => {
    // 🎯 STABILITY TEST: Multiple expand/collapse pentru a testa stabilitatea fix-ului
    
    // ✅ CYCLE 1: Expandează categoria ECONOMII
    await page.getByTestId('toggle-category-ECONOMII').click();
    await expect(page.locator('[data-testid="add-subcategory-ECONOMII"]')).toHaveCount(1);
    
    // Restrânge categoria
    await page.getByTestId('toggle-category-ECONOMII').click();
    await expect(page.locator('text=Fond de urgență')).not.toBeVisible();
    
    // ✅ CYCLE 2: Expandează din nou
    await page.getByTestId('toggle-category-ECONOMII').click();
    await expect(page.locator('[data-testid="add-subcategory-ECONOMII"]')).toHaveCount(1);
    
    // ✅ CYCLE 3: O dată în plus pentru siguranță
    await page.getByTestId('toggle-category-ECONOMII').click();
    await page.getByTestId('toggle-category-ECONOMII').click();
    
    // 🔥 FINAL ASSERTION: Încă UN singur buton după multiple cicluri
    await expect(page.locator('[data-testid="add-subcategory-ECONOMII"]')).toHaveCount(1);
  });

  test('should correctly display Add Subcategory buttons for multiple categories', async ({ page }) => {
    // 🎯 ISOLATION TEST: Verifică că fix-ul nu afectează alte categorii
    
    // Expandează categoria ECONOMII
    await page.getByTestId('toggle-category-ECONOMII').click();
    await expect(page.locator('[data-testid="add-subcategory-ECONOMII"]')).toHaveCount(1);
    
    // Expandează categoria NUTRITIE (dacă nu are limitarea de 5 subcategorii)
    const nutritieToggle = page.getByTestId('toggle-category-NUTRITIE');
    if (await nutritieToggle.isVisible()) {
      await nutritieToggle.click();
      
      // Verifică că NUTRITIE are și ea UN singur buton (dacă nu are limitare)
      const nutritieButton = page.locator('[data-testid="add-subcategory-NUTRITIE"]');
      if (await nutritieButton.count() > 0) {
        await expect(nutritieButton).toHaveCount(1);
      }
    }
    
    // 🔥 FINAL CHECK: ECONOMII încă are exact UN buton
    await expect(page.locator('[data-testid="add-subcategory-ECONOMII"]')).toHaveCount(1);
  });

  // 📝 MINIMAL REGRESSION TEST: Doar verifică că butonul nu se dublează fără teste complexe
  test('should not duplicate button after simple interactions', async ({ page }) => {
    // Expandează/restrânge categoria de mai multe ori
    for (let i = 0; i < 3; i++) {
      await page.getByTestId('toggle-category-ECONOMII').click();
      await page.getByTestId('toggle-category-ECONOMII').click();
    }
    
    // Expandează final și verifică că nu s-a dublat butonul
    await page.getByTestId('toggle-category-ECONOMII').click();
    await expect(page.locator('[data-testid="add-subcategory-ECONOMII"]')).toHaveCount(1);
  });
}); 
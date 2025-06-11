import { test, expect } from '@playwright/test';
import { AuthPage } from '../support/pages/AuthPage';
import { AccountManager } from '../support/AccountManager';

test.describe('Smoke: Critical Authentication', () => {
  test('login cu contul principal funcționează', { tag: '@smoke' }, async ({ page }) => {
    console.log('🔍 Smoke Test: Login principal');
    
    const authPage = new AuthPage(page);
    const primaryAccount = AccountManager.getPrimaryAccount();
    
    // Navighează la login
    await authPage.goto();
    
    // Verifică că pagina de login s-a încărcat
    await expect(page.getByTestId('login-form')).toBeVisible();
    
    // Login cu contul principal
    const result = await authPage.login(primaryAccount);
    
    // Verifică că login-ul a fost reușit
    expect(result.success).toBe(true);
    
    // Verifică că s-a redirectat către aplicația principală
    await expect(page).toHaveURL(/\/(transactions|dashboard)/);
    
    // Verifică că navigation-ul e visible (sign că user e logat)
    await expect(page.getByTestId('transactions-tab')).toBeVisible();
    await expect(page.getByTestId('lunar-grid-tab')).toBeVisible();
    
    console.log('✅ Smoke Test: Login principal - SUCCESS');
  });
  
  test('navigarea între pagini funcționează', { tag: '@smoke' }, async ({ page }) => {
    console.log('🔍 Smoke Test: Basic Navigation');
    
    const authPage = new AuthPage(page);
    const primaryAccount = AccountManager.getPrimaryAccount();
    
    // Login rapid
    await authPage.goto();
    await authPage.login(primaryAccount);
    
    // Test navigare la LunarGrid
    await page.getByTestId('lunar-grid-tab').click();
    await expect(page).toHaveURL(/\/lunar-grid/);
    await expect(page.getByTestId('lunar-grid-container')).toBeVisible();
    
    // Test navigare la Transactions
    await page.getByTestId('transactions-tab').click();
    await expect(page).toHaveURL(/\/transactions/);
    
    // Test navigare la Options
    await page.getByTestId('options-tab').click();
    await expect(page).toHaveURL(/\/options/);
    
    console.log('✅ Smoke Test: Basic Navigation - SUCCESS');
  });
}); 
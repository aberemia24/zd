import { test, expect } from '@playwright/test';
import { AuthPage } from '../../support/pages/AuthPage';
import { AccountManager } from '../../support/AccountManager';

test.describe('TransactionsPage Elements Validation', () => {
  test.beforeEach(async ({ page }) => {
    // Login cu contul principal
    const authPage = new AuthPage(page);
    const primaryAccount = AccountManager.getPrimaryAccount();
    
    await authPage.goto();
    await authPage.login(primaryAccount);
    
    // Navighează la pagina de tranzacții
    await page.goto('/transactions');
    await page.waitForLoadState('networkidle');
  });

  test('verifică existența elementelor principale din TransactionsPage', async ({ page }) => {
    // Verifică containers definite în TransactionsPage
    await expect(page.getByTestId('transaction-filters-container')).toBeVisible();
    await expect(page.getByTestId('export-button-container')).toBeVisible();
    await expect(page.getByTestId('transaction-table-container')).toBeVisible();
    
    console.log('✅ Toate elementele principale din TransactionsPage sunt vizibile');
  });
}); 
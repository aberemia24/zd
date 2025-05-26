import { test, expect } from '@playwright/test';
import { AuthPage } from '../support/pages/AuthPage';
import { AccountManager } from '../support/AccountManager';

test.describe('Debug - Primary Account Login', () => {
  test('testează login cu contul principal direct', async ({ page }) => {
    console.log('🔍 Debug: Testez login cu contul principal');
    
    const authPage = new AuthPage(page);
    const primaryAccount = AccountManager.getPrimaryAccount();
    
    console.log(`📧 Email: ${primaryAccount.email}`);
    console.log(`🔑 Password: ${primaryAccount.password}`);
    
    // Navighează la login
    await authPage.goto();
    
    // Verifică că pagina de login s-a încărcat
    await expect(page.getByTestId('login-form')).toBeVisible();
    console.log('✅ Pagina de login s-a încărcat');
    
    // Completează manual câmpurile
    await page.getByTestId('login-email').fill(primaryAccount.email);
    await page.getByTestId('login-password').fill(primaryAccount.password);
    
    console.log('📝 Câmpuri completate');
    
    // Submit
    await page.getByTestId('login-submit').click();
    console.log('🚀 Submit efectuat');
    
    // Așteaptă puțin să proceseze
    await page.waitForTimeout(2000);
    console.log(`📍 URL după 2s: ${page.url()}`);
    
    // Așteaptă pentru redirect (poate fi mai mult)
    try {
      console.log('⏳ Aștept redirect la transactions...');
      await page.waitForURL('**/transactions', { timeout: 20000 });
      console.log('✅ SUCCESS! Redirectat la transactions!');
    } catch (error) {
      console.log('⚠️ Nu s-a făcut redirect la transactions în 20s');
      
      // Verifică URL-ul curent
      const currentUrl = page.url();
      console.log(`📍 URL curent: ${currentUrl}`);
      
      // Așteaptă încă puțin și verifică din nou
      await page.waitForTimeout(5000);
      const finalUrl = page.url();
      console.log(`📍 URL după 5s extra: ${finalUrl}`);
      
      // Verifică dacă există erori
      const hasError = await page.getByTestId('error-message').isVisible().catch(() => false);
      if (hasError) {
        const errorText = await page.getByTestId('error-message').textContent();
        console.log(`❌ Eroare: ${errorText}`);
      }
      
      // Verifică dacă s-a redirectat cumva
      if (finalUrl.includes('/transactions') || finalUrl.includes('/dashboard')) {
        console.log('✅ Redirect întârziat detectat!');
      } else {
        console.log('❌ Login eșuat - nu s-a făcut redirect');
        // Fă screenshot pentru debug
        await page.screenshot({ path: 'debug-login-result.png' });
      }
    }
  });
}); 
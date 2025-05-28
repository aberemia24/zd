import { Page } from '@playwright/test';
import { URLS, SELECTORS, TIMEOUTS, STABILITY } from '../../config/test-constants';
import { TestAccount, TestResult, PageState } from '../../types/test-types';
import { AccountManager } from '../AccountManager';

/**
 * Page Object pentru pagina de autentificare
 * Gestionează toate acțiunile legate de login/register
 */
export class AuthPage {
  private testAccount?: TestAccount;

  constructor(private page: Page) {
  }

  /**
   * Navighează la pagina de login
   */
  async goto(): Promise<void> {
    await this.page.goto(`${URLS.BASE_URL}${URLS.LOGIN}`);
    await this.page.waitForLoadState('networkidle');
    await this.waitForPageLoad();
  }

  /**
   * Verifică dacă pagina de login s-a încărcat corect
   */
  async waitForPageLoad(): Promise<void> {
    await this.page.waitForSelector(`[data-testid="${SELECTORS.LOGIN_FORM}"]`, {
      timeout: TIMEOUTS.DEFAULT
    });
  }

  /**
   * Efectuează login cu credențiale furnizate
   */
  async login(account: TestAccount): Promise<TestResult> {
    try {
      await this.fillEmail(account.email);
      await this.fillPassword(account.password);
      await this.submitLogin();
      
      const success = await this.waitForLoginResult();
      
      return {
        success,
        message: success ? 'Login successful' : 'Login failed - no redirect detected'
      };
    } catch (error) {
      return {
        success: false,
        message: `Login failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }

  /**
   * Completează câmpul email
   */
  private async fillEmail(email: string): Promise<void> {
    const emailField = this.page.getByTestId(SELECTORS.LOGIN_EMAIL);
    await emailField.waitFor({ timeout: STABILITY.ELEMENT_WAIT_TIME });
    await emailField.fill(email);
  }

  /**
   * Completează câmpul parolă
   */
  private async fillPassword(password: string): Promise<void> {
    const passwordField = this.page.getByTestId(SELECTORS.LOGIN_PASSWORD);
    await passwordField.fill(password);
  }

  /**
   * Trimite formularul de login
   */
  private async submitLogin(): Promise<void> {
    const submitButton = this.page.getByTestId(SELECTORS.LOGIN_SUBMIT);
    await submitButton.click();
  }

  /**
   * Așteaptă rezultatul login-ului - caută elemente concrete din aplicație
   */
  private async waitForLoginResult(): Promise<boolean> {
    try {
      // Așteaptă să dispară formularul de login (semn că s-a făcut submit)
      await this.page.waitForSelector(`[data-testid="${SELECTORS.LOGIN_FORM}"]`, { 
        state: 'hidden', 
        timeout: 5000 
      });

      // Așteaptă elemente care confirmă login-ul reușit
      // Încearcă să găsească NavBar sau orice element din aplicația principală
      const loginSuccess = await Promise.race([
        // Caută navbar cu logout button
        this.page.waitForSelector(`[data-testid="${SELECTORS.NAV_LOGOUT}"]`, { timeout: 15000 }).then(() => true),
        // Sau caută URL-ul de transactions/dashboard
        this.page.waitForURL(`**${URLS.TRANSACTIONS}`, { timeout: 15000 }).then(() => true),
        this.page.waitForURL(`**${URLS.DASHBOARD}`, { timeout: 15000 }).then(() => true),
        // Sau caută un mesaj de succes
        this.page.waitForSelector(`[data-testid="${SELECTORS.SUCCESS_MESSAGE}"]`, { timeout: 15000 }).then(() => true)
      ]).catch(() => false);

      return loginSuccess;
    } catch {
      // Verifică dacă există mesaje de eroare
      const hasError = await this.hasLoginError();
      return !hasError;
    }
  }

  /**
   * Verifică dacă există mesaje de eroare pe pagina de login
   */
  private async hasLoginError(): Promise<boolean> {
    try {
      const errorElement = this.page.getByTestId(SELECTORS.ERROR_MESSAGE);
      return await errorElement.isVisible();
    } catch {
      return false;
    }
  }

  /**
   * Verifică starea curentă a paginii
   */
  async getPageState(): Promise<PageState> {
    const currentUrl = this.page.url();
    
    return {
      isLoggedIn: !currentUrl.includes(URLS.LOGIN),
      currentPage: this.extractPageFromUrl(currentUrl),
      hasErrors: await this.hasLoginError(),
      isLoading: await this.isPageLoading()
    };
  }

  /**
   * Extrage numele paginii din URL
   */
  private extractPageFromUrl(url: string): string {
    if (url.includes(URLS.TRANSACTIONS)) return 'transactions';
    if (url.includes(URLS.LOGIN)) return 'login';
    if (url.includes(URLS.REGISTER)) return 'register';
    return 'dashboard';
  }

  /**
   * Verifică dacă pagina se încarcă
   */
  private async isPageLoading(): Promise<boolean> {
    try {
      const spinner = this.page.getByTestId(SELECTORS.LOADING_SPINNER);
      return await spinner.isVisible();
    } catch {
      return false;
    }
  }

  /**
   * Efectuează logout dacă utilizatorul este autentificat
   */
  async logout(): Promise<void> {
    try {
      const logoutButton = this.page.getByTestId(SELECTORS.NAV_LOGOUT);
      if (await logoutButton.isVisible()) {
        await logoutButton.click();
        await this.page.waitForURL(`**${URLS.LOGIN}`, { timeout: TIMEOUTS.NAVIGATION });
      }
    } catch {
      // Ignore logout errors - poate fi deja delogat
    }
  }

  /**
   * Verifică dacă formularul de login este vizibil
   */
  async isLoginFormVisible(): Promise<boolean> {
    try {
      const form = this.page.getByTestId(SELECTORS.LOGIN_FORM);
      return await form.isVisible();
    } catch {
      return false;
    }
  }

  /**
   * Cleanup după test
   */
  async cleanup(): Promise<void> {
    await this.logout();
  }

  /**
   * Login cu contul de test (simplificat)
   */
  async loginWithTestUser(): Promise<TestResult> {
    if (!this.testAccount) {
      this.testAccount = AccountManager.getTestAccount();
    }
    
    await this.goto();
    return await this.login(this.testAccount);
  }

  /**
   * Login direct cu contul principal
   */
  async loginWithPrimaryAccount(): Promise<TestResult> {
    this.testAccount = AccountManager.getPrimaryAccount();
    await this.goto();
    return await this.login(this.testAccount);
  }

  /**
   * Obține email-ul contului de test curent
   */
  getTestEmail(): string {
    if (!this.testAccount) {
      throw new Error('Nu există cont de test activ');
    }
    return this.testAccount.email;
  }
} 
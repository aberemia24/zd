# Test info

- Name: Debug - Primary Account Login >> testează login cu contul principal direct
- Location: C:\CursorRepos\zd\frontend\tests\e2e\debug\test-primary-account.spec.ts:6:7

# Error details

```
Error: page.goto: Protocol error (Page.navigate): Cannot navigate to invalid URL
Call log:
  - navigating to "/login", waiting until "load"

    at AuthPage.goto (C:\CursorRepos\zd\frontend\tests\e2e\support\pages\AuthPage.ts:20:21)
    at C:\CursorRepos\zd\frontend\tests\e2e\debug\test-primary-account.spec.ts:16:20
```

# Test source

```ts
   1 | import { Page, expect } from '@playwright/test';
   2 | import { URLS, SELECTORS, TIMEOUTS, EXPECTED_TEXTS, STABILITY } from '../../config/test-constants';
   3 | import { TestAccount, TestResult, PageState } from '../../types/test-types';
   4 | import { AccountManager } from '../AccountManager';
   5 |
   6 | /**
   7 |  * Page Object pentru pagina de autentificare
   8 |  * Gestionează toate acțiunile legate de login/register
   9 |  */
   10 | export class AuthPage {
   11 |   private testAccount?: TestAccount;
   12 |
   13 |   constructor(private page: Page) {
   14 |   }
   15 |
   16 |   /**
   17 |    * Navighează la pagina de login
   18 |    */
   19 |   async goto(): Promise<void> {
>  20 |     await this.page.goto(URLS.LOGIN);
      |                     ^ Error: page.goto: Protocol error (Page.navigate): Cannot navigate to invalid URL
   21 |     await this.page.waitForLoadState('networkidle');
   22 |     await this.waitForPageLoad();
   23 |   }
   24 |
   25 |   /**
   26 |    * Verifică dacă pagina de login s-a încărcat corect
   27 |    */
   28 |   async waitForPageLoad(): Promise<void> {
   29 |     await this.page.waitForSelector(`[data-testid="${SELECTORS.LOGIN_FORM}"]`, {
   30 |       timeout: TIMEOUTS.DEFAULT
   31 |     });
   32 |   }
   33 |
   34 |   /**
   35 |    * Efectuează login cu credențiale furnizate
   36 |    */
   37 |   async login(account: TestAccount): Promise<TestResult> {
   38 |     try {
   39 |       await this.fillEmail(account.email);
   40 |       await this.fillPassword(account.password);
   41 |       await this.submitLogin();
   42 |       
   43 |       const success = await this.waitForLoginResult();
   44 |       
   45 |       return {
   46 |         success,
   47 |         message: success ? 'Login successful' : 'Login failed - no redirect detected'
   48 |       };
   49 |     } catch (error) {
   50 |       return {
   51 |         success: false,
   52 |         message: `Login failed: ${error instanceof Error ? error.message : 'Unknown error'}`
   53 |       };
   54 |     }
   55 |   }
   56 |
   57 |   /**
   58 |    * Completează câmpul email
   59 |    */
   60 |   private async fillEmail(email: string): Promise<void> {
   61 |     const emailField = this.page.getByTestId(SELECTORS.LOGIN_EMAIL);
   62 |     await emailField.waitFor({ timeout: STABILITY.ELEMENT_WAIT_TIME });
   63 |     await emailField.fill(email);
   64 |   }
   65 |
   66 |   /**
   67 |    * Completează câmpul parolă
   68 |    */
   69 |   private async fillPassword(password: string): Promise<void> {
   70 |     const passwordField = this.page.getByTestId(SELECTORS.LOGIN_PASSWORD);
   71 |     await passwordField.fill(password);
   72 |   }
   73 |
   74 |   /**
   75 |    * Trimite formularul de login
   76 |    */
   77 |   private async submitLogin(): Promise<void> {
   78 |     const submitButton = this.page.getByTestId(SELECTORS.LOGIN_SUBMIT);
   79 |     await submitButton.click();
   80 |   }
   81 |
   82 |   /**
   83 |    * Așteaptă rezultatul login-ului (redirect sau eroare)
   84 |    */
   85 |   private async waitForLoginResult(): Promise<boolean> {
   86 |     try {
   87 |       // Așteaptă puțin să proceseze login-ul
   88 |       await this.page.waitForTimeout(1000);
   89 |       
   90 |       // Așteaptă redirect la transactions sau dashboard cu timeout mai mare
   91 |       await Promise.race([
   92 |         this.page.waitForURL(`**${URLS.TRANSACTIONS}`, { timeout: TIMEOUTS.LONG }),
   93 |         this.page.waitForURL(`**${URLS.DASHBOARD}`, { timeout: TIMEOUTS.LONG })
   94 |       ]);
   95 |       return true;
   96 |     } catch {
   97 |       // Dacă redirect-ul nu s-a făcut, așteaptă încă puțin
   98 |       await this.page.waitForTimeout(3000);
   99 |       
  100 |       // Verifică din nou URL-ul
  101 |       const currentUrl = this.page.url();
  102 |       if (currentUrl.includes(URLS.TRANSACTIONS) || currentUrl.includes(URLS.DASHBOARD)) {
  103 |         return true; // Redirect întârziat
  104 |       }
  105 |       
  106 |       // Verifică dacă există mesaje de eroare
  107 |       const hasError = await this.hasLoginError();
  108 |       return !hasError; // Dacă nu e eroare, poate fi success fără redirect imediat
  109 |     }
  110 |   }
  111 |
  112 |   /**
  113 |    * Verifică dacă există mesaje de eroare pe pagina de login
  114 |    */
  115 |   private async hasLoginError(): Promise<boolean> {
  116 |     try {
  117 |       const errorElement = this.page.getByTestId(SELECTORS.ERROR_MESSAGE);
  118 |       return await errorElement.isVisible();
  119 |     } catch {
  120 |       return false;
```
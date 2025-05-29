# Test info

- Name: Smoke: Critical Authentication >> navigarea între pagini funcționează
- Location: C:\windsurf repo\budget-app\frontend\tests\e2e\smoke\critical-auth.smoke.spec.ts:34:7

# Error details

```
Error: Timed out 5000ms waiting for expect(locator).toHaveURL(expected)

Locator: locator(':root')
Expected pattern: /\/lunar-grid/
Received string:  "http://localhost:3000/transactions"
Call log:
  - expect.toHaveURL with timeout 5000ms
  - waiting for locator(':root')
    9 × locator resolved to <html lang="ro">…</html>
      - unexpected value "http://localhost:3000/transactions"

    at C:\windsurf repo\budget-app\frontend\tests\e2e\smoke\critical-auth.smoke.spec.ts:46:24
```

# Page snapshot

```yaml
- link "Tranzacții":
  - /url: /transactions
- link "Grid Lunar":
  - /url: /lunar-grid
- link "Enhanced LunarGrid (Phase 4)":
  - /url: /enhanced-lunar-grid
- link "🚀 LunarGrid Enhanced (Modal Architecture)":
  - /url: /lunar-grid-enhanced
- link "Opțiuni":
  - /url: /options
- link "🔍 Profiler Debug":
  - /url: /profiler-debug
- heading "Tranzacții" [level=1]
- form "adăugare tranzacție":
  - heading "Adaugă tranzacție" [level=3]
  - text: "Tip*:"
  - combobox "Tip":
    - option "Alege" [selected]
    - option "Venit"
    - option "Cheltuială"
    - option "Economisire"
  - text: "Sumă*:"
  - spinbutton "Sumă"
  - text: "Categorie*:"
  - combobox "Categorie" [disabled]:
    - option "Alege" [selected]
  - text: Subcategorie
  - combobox "Subcategorie" [disabled]:
    - option "Alege" [selected]
  - text: "Dată*:"
  - textbox "Dată"
  - checkbox
  - text: Recurent? Frecvență
  - combobox "Frecvență" [disabled]:
    - option "Alege" [selected]
    - option "Zilnic"
    - option "Săptămânal"
    - option "Lunar"
    - option "Anual"
  - text: Descriere
  - textbox "Descriere"
  - button "Adaugă" [disabled]
  - button "Anulează"
- combobox:
  - option "Alege tipul" [selected]
  - option "Venit"
  - option "Cheltuială"
  - option "Economisire"
- combobox [disabled]:
  - option "Alege categoria" [selected]
  - option "Venituri"
  - option "Economii"
  - option "Infatisare"
  - option "Educatie"
  - option "Cariera"
  - option "Sanatate"
  - option "Nutritie"
  - option "Locuinta"
  - option "Timp liber"
  - option "Calatorii"
  - option "Transport"
  - option "Investitii"
  - option "Test ➡️"
- combobox [disabled]:
  - option "Alege subcategoria" [selected]
- textbox "Caută..."
- button "Filtre avansate"
- button "Exportă"
- region "Tip Sumă":
  - table:
    - rowgroup:
      - row "Tip Sumă Categorie Subcategorie Descriere Dată Recurent Frecvență":
        - columnheader "Tip"
        - columnheader "Sumă"
        - columnheader "Categorie"
        - columnheader "Subcategorie"
        - columnheader "Descriere"
        - columnheader "Dată"
        - columnheader "Recurent"
        - columnheader "Frecvență"
    - rowgroup:
      - row "INCOME 99999.00 RON VENITURI Salarii - Modificat - Modificat 17.06.2025 Nu":
        - cell "INCOME"
        - cell "99999.00 RON"
        - cell "VENITURI"
        - cell "Salarii - Modificat - Modificat"
        - cell
        - cell "17.06.2025"
        - cell "Nu"
        - cell
      - row "INCOME 23.00 RON VENITURI Dividende 13.06.2025 Nu":
        - cell "INCOME"
        - cell "23.00 RON"
        - cell "VENITURI"
        - cell "Dividende"
        - cell
        - cell "13.06.2025"
        - cell "Nu"
        - cell
      - row "INCOME 123.00 RON VENITURI Salarii - Modificat - Modificat 10.06.2025 Da YEARLY":
        - cell "INCOME"
        - cell "123.00 RON"
        - cell "VENITURI"
        - cell "Salarii - Modificat - Modificat"
        - cell
        - cell "10.06.2025"
        - cell "Da"
        - cell "YEARLY"
      - row "INCOME 32.00 RON VENITURI Salarii - Modificat - Modificat 02.06.2025 Nu":
        - cell "INCOME"
        - cell "32.00 RON"
        - cell "VENITURI"
        - cell "Salarii - Modificat - Modificat"
        - cell
        - cell "02.06.2025"
        - cell "Nu"
        - cell
      - row "EXPENSE 565.00 RON EDUCATIE Taxe școlare | universitare 31.05.2025 Da WEEKLY":
        - cell "EXPENSE"
        - cell "565.00 RON"
        - cell "EDUCATIE"
        - cell "Taxe școlare | universitare"
        - cell
        - cell "31.05.2025"
        - cell "Da"
        - cell "WEEKLY"
      - row "SAVING 121111.00 RON ECONOMII Fond de urgență - Modificat 30.05.2025 Nu":
        - cell "SAVING"
        - cell "121111.00 RON"
        - cell "ECONOMII"
        - cell "Fond de urgență - Modificat"
        - cell
        - cell "30.05.2025"
        - cell "Nu"
        - cell
      - row "SAVING 1234444.00 RON ECONOMII Fond de urgență - Modificat 30.05.2025 Nu":
        - cell "SAVING"
        - cell "1234444.00 RON"
        - cell "ECONOMII"
        - cell "Fond de urgență - Modificat"
        - cell
        - cell "30.05.2025"
        - cell "Nu"
        - cell
      - row "EXPENSE 123.00 RON TIMP_LIBER Muzică | Video sau abonamente 30.05.2025 Nu":
        - cell "EXPENSE"
        - cell "123.00 RON"
        - cell "TIMP_LIBER"
        - cell "Muzică | Video sau abonamente"
        - cell
        - cell "30.05.2025"
        - cell "Nu"
        - cell
      - row "EXPENSE 555.00 RON TIMP_LIBER Cărți sau abonamente cărți - Mod 30.05.2025 Nu":
        - cell "EXPENSE"
        - cell "555.00 RON"
        - cell "TIMP_LIBER"
        - cell "Cărți sau abonamente cărți - Mod"
        - cell
        - cell "30.05.2025"
        - cell "Nu"
        - cell
      - row "SAVING 555.00 RON ECONOMII Fond general 30.05.2025 Nu":
        - cell "SAVING"
        - cell "555.00 RON"
        - cell "ECONOMII"
        - cell "Fond general"
        - cell
        - cell "30.05.2025"
        - cell "Nu"
        - cell
- text: Se afișează 10 din 334 tranzacții
- button "Înainte"
```

# Test source

```ts
   1 | import { test, expect } from '@playwright/test';
   2 | import { AuthPage } from '../support/pages/AuthPage';
   3 | import { AccountManager } from '../support/AccountManager';
   4 |
   5 | test.describe('Smoke: Critical Authentication', () => {
   6 |   test('login cu contul principal funcționează', { tag: '@smoke' }, async ({ page }) => {
   7 |     console.log('🔍 Smoke Test: Login principal');
   8 |     
   9 |     const authPage = new AuthPage(page);
  10 |     const primaryAccount = AccountManager.getPrimaryAccount();
  11 |     
  12 |     // Navighează la login
  13 |     await authPage.goto();
  14 |     
  15 |     // Verifică că pagina de login s-a încărcat
  16 |     await expect(page.getByTestId('login-form')).toBeVisible();
  17 |     
  18 |     // Login cu contul principal
  19 |     const result = await authPage.login(primaryAccount);
  20 |     
  21 |     // Verifică că login-ul a fost reușit
  22 |     expect(result.success).toBe(true);
  23 |     
  24 |     // Verifică că s-a redirectat către aplicația principală
  25 |     await expect(page).toHaveURL(/\/(transactions|dashboard)/);
  26 |     
  27 |     // Verifică că navigation-ul e visible (sign că user e logat)
  28 |     await expect(page.getByTestId('transactions-tab')).toBeVisible();
  29 |     await expect(page.getByTestId('lunar-grid-tab')).toBeVisible();
  30 |     
  31 |     console.log('✅ Smoke Test: Login principal - SUCCESS');
  32 |   });
  33 |   
  34 |   test('navigarea între pagini funcționează', { tag: '@smoke' }, async ({ page }) => {
  35 |     console.log('🔍 Smoke Test: Basic Navigation');
  36 |     
  37 |     const authPage = new AuthPage(page);
  38 |     const primaryAccount = AccountManager.getPrimaryAccount();
  39 |     
  40 |     // Login rapid
  41 |     await authPage.goto();
  42 |     await authPage.login(primaryAccount);
  43 |     
  44 |     // Test navigare la LunarGrid
  45 |     await page.getByTestId('lunar-grid-tab').click();
> 46 |     await expect(page).toHaveURL(/\/lunar-grid/);
     |                        ^ Error: Timed out 5000ms waiting for expect(locator).toHaveURL(expected)
  47 |     await expect(page.getByTestId('lunar-grid-container')).toBeVisible();
  48 |     
  49 |     // Test navigare la Transactions
  50 |     await page.getByTestId('transactions-tab').click();
  51 |     await expect(page).toHaveURL(/\/transactions/);
  52 |     
  53 |     // Test navigare la Options
  54 |     await page.getByTestId('options-tab').click();
  55 |     await expect(page).toHaveURL(/\/options/);
  56 |     
  57 |     console.log('✅ Smoke Test: Basic Navigation - SUCCESS');
  58 |   });
  59 | }); 
```
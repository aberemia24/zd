# Test info

- Name: Smoke: LunarGrid Basic Functionality >> celulele grid-ului răspund la click
- Location: C:\windsurf repo\budget-app\frontend\tests\e2e\smoke\lunar-grid.smoke.spec.ts:67:7

# Error details

```
Error: Timed out 5000ms waiting for expect(locator).toBeVisible()

Locator: getByTestId('lunar-grid-container')
Expected: visible
Received: <element(s) not found>
Call log:
  - expect.toBeVisible with timeout 5000ms
  - waiting for getByTestId('lunar-grid-container')

    at C:\windsurf repo\budget-app\frontend\tests\e2e\smoke\lunar-grid.smoke.spec.ts:71:60
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
      - row "INCOME 23.00 RON VENITURI Dividendew 13.06.2025 Nu":
        - cell "INCOME"
        - cell "23.00 RON"
        - cell "VENITURI"
        - cell "Dividendew"
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
   3 |
   4 | test.describe('Smoke: LunarGrid Basic Functionality', () => {
   5 |   let authPage: AuthPage;
   6 |
   7 |   test.beforeEach(async ({ page }) => {
   8 |     authPage = new AuthPage(page);
   9 |     // Login rapid pentru toate testele
   10 |     await authPage.loginWithPrimaryAccount();
   11 |     await page.getByTestId('lunar-grid-tab').click();
   12 |     await page.waitForLoadState('networkidle');
   13 |   });
   14 |
   15 |   test('LunarGrid se deschide și afișează grid-ul', { tag: '@smoke' }, async ({ page }) => {
   16 |     console.log('🔍 Smoke Test: LunarGrid Loading');
   17 |     
   18 |     // Verifică că container-ul principal există
   19 |     await expect(page.getByTestId('lunar-grid-container')).toBeVisible();
   20 |     
   21 |     // Verifică că tabelul se afișează
   22 |     await expect(page.getByTestId('lunar-grid-table')).toBeVisible();
   23 |     
   24 |     console.log('✅ Smoke Test: LunarGrid Loading - SUCCESS');
   25 |   });
   26 |
   27 |   test('expand/collapse categorii funcționează', { tag: '@smoke' }, async ({ page }) => {
   28 |     console.log('🔍 Smoke Test: Expand/Collapse');
   29 |     
   30 |     // Verifică că grid-ul e încărcat
   31 |     await expect(page.getByTestId('lunar-grid-container')).toBeVisible();
   32 |     
   33 |     // Count celule înainte de expandare
   34 |     const cellsBefore = await page.locator('[data-testid*="editable-cell"]').count();
   35 |     console.log(`📊 Celule înainte: ${cellsBefore}`);
   36 |     
   37 |     // Expandează toate categoriile
   38 |     const expandButton = page.getByTestId('toggle-expand-all');
   39 |     if (await expandButton.isVisible()) {
   40 |       await expandButton.click();
   41 |       await page.waitForTimeout(2000); // Așteaptă animația
   42 |       
   43 |       // Count celule după expandare
   44 |       const cellsAfter = await page.locator('[data-testid*="editable-cell"]').count();
   45 |       console.log(`📊 Celule după expandare: ${cellsAfter}`);
   46 |       
   47 |       // Verifică că s-au adăugat celule (expandare reușită)
   48 |       expect(cellsAfter).toBeGreaterThan(cellsBefore);
   49 |       
   50 |       // Reset expandare
   51 |       const resetButton = page.getByTestId('reset-expanded');
   52 |       if (await resetButton.isVisible()) {
   53 |         await resetButton.click();
   54 |         await page.waitForTimeout(1000);
   55 |         
   56 |         const cellsAfterReset = await page.locator('[data-testid*="editable-cell"]').count();
   57 |         console.log(`📊 Celule după reset: ${cellsAfterReset}`);
   58 |         
   59 |         // Verifică că s-au redus celulele
   60 |         expect(cellsAfterReset).toBeLessThan(cellsAfter);
   61 |       }
   62 |     }
   63 |     
   64 |     console.log('✅ Smoke Test: Expand/Collapse - SUCCESS');
   65 |   });
   66 |
   67 |   test('celulele grid-ului răspund la click', { tag: '@smoke' }, async ({ page }) => {
   68 |     console.log('🔍 Smoke Test: Cell Interaction');
   69 |     
   70 |     // Verifică că grid-ul e încărcat
>  71 |     await expect(page.getByTestId('lunar-grid-container')).toBeVisible();
      |                                                            ^ Error: Timed out 5000ms waiting for expect(locator).toBeVisible()
   72 |     
   73 |     // Expandează pentru a avea celule disponibile
   74 |     // WORKAROUND: Grid-ul se resetează după edit, deci expandăm din nou
   75 |     const expandButton = page.getByTestId('toggle-expand-all');
   76 |     if (await expandButton.isVisible()) {
   77 |       await expandButton.click();
   78 |       await page.waitForTimeout(2000); // Așteaptă animația
   79 |       
   80 |       // Verifică că expandarea a reușit și avem celule
   81 |       const cellCount = await page.locator('[data-testid*="editable-cell"]').count();
   82 |       console.log(`📊 Celule după expandare: ${cellCount}`);
   83 |       
   84 |       if (cellCount === 0) {
   85 |         console.log('⚠️ Nu s-au găsit celule după expandare, încercăm din nou...');
   86 |         await expandButton.click();
   87 |         await page.waitForTimeout(3000);
   88 |       }
   89 |     }
   90 |     
   91 |     // Găsește prima celulă editabilă disponibilă
   92 |     const firstCell = page.locator('[data-testid*="editable-cell"]').first();
   93 |     await expect(firstCell).toBeVisible({ timeout: 10000 });
   94 |     
   95 |     // Click pe celulă
   96 |     await firstCell.click();
   97 |     
   98 |     // Nu verificăm comportament specific de editare (asta e responsabilitatea testelor de integrare)
   99 |     // Doar că click-ul nu aruncă erori și celula rămâne vizibilă
  100 |     await expect(firstCell).toBeVisible();
  101 |     
  102 |     console.log('✅ Smoke Test: Cell Interaction - SUCCESS');
  103 |   });
  104 | }); 
```
# Test info

- Name: Smoke: LunarGrid Basic Functionality >> celulele grid-ului răspund la click
- Location: C:\windsurf repo\budget-app\frontend\tests\e2e\smoke\lunar-grid.smoke.spec.ts:67:7

# Error details

```
Error: Timed out 10000ms waiting for expect(locator).toBeVisible()

Locator: locator('[data-testid*="editable-cell"]').first()
Expected: visible
Received: <element(s) not found>
Call log:
  - expect.toBeVisible with timeout 10000ms
  - waiting for locator('[data-testid*="editable-cell"]').first()

    at C:\windsurf repo\budget-app\frontend\tests\e2e\smoke\lunar-grid.smoke.spec.ts:93:29
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
- heading "Grid Lunar" [level=1]
- combobox:
  - option "Ianuarie"
  - option "Februarie"
  - option "Martie"
  - option "Aprilie"
  - option "Mai" [selected]
  - option "Iunie"
  - option "Iulie"
  - option "August"
  - option "Septembrie"
  - option "Octombrie"
  - option "Noiembrie"
  - option "Decembrie"
- spinbutton: "2025"
- button "Extinde tot"
- button "Resetează"
- table:
  - rowgroup:
    - row "Categorii 1 - Mai 2 - Mai 3 - Mai 4 - Mai 5 - Mai 6 - Mai 7 - Mai 8 - Mai 9 - Mai 10 - Mai 11 - Mai 12 - Mai 13 - Mai 14 - Mai 15 - Mai 16 - Mai 17 - Mai 18 - Mai 19 - Mai 20 - Mai 21 - Mai 22 - Mai 23 - Mai 24 - Mai 25 - Mai 26 - Mai 27 - Mai 28 - Mai 29 - Mai 30 - Mai 31 - Mai Total":
      - cell "Categorii"
      - cell "1 - Mai"
      - cell "2 - Mai"
      - cell "3 - Mai"
      - cell "4 - Mai"
      - cell "5 - Mai"
      - cell "6 - Mai"
      - cell "7 - Mai"
      - cell "8 - Mai"
      - cell "9 - Mai"
      - cell "10 - Mai"
      - cell "11 - Mai"
      - cell "12 - Mai"
      - cell "13 - Mai"
      - cell "14 - Mai"
      - cell "15 - Mai"
      - cell "16 - Mai"
      - cell "17 - Mai"
      - cell "18 - Mai"
      - cell "19 - Mai"
      - cell "20 - Mai"
      - cell "21 - Mai"
      - cell "22 - Mai"
      - cell "23 - Mai"
      - cell "24 - Mai"
      - cell "25 - Mai"
      - cell "26 - Mai"
      - cell "27 - Mai"
      - cell "28 - Mai"
      - cell "29 - Mai"
      - cell "30 - Mai"
      - cell "31 - Mai"
      - cell "Total"
  - rowgroup:
    - row "▶ VENITURI 193,00 660,00 889,00 2.457,00 2.457,00 2.123.188,00 367,00 15.158,00 194,00 907,25 855,75 40,75 23,00 — 3.123,00 320,00 178,00 123,00 22,00 — — 21,50 — 3.332,00 213,00 123.123.123.123,00 — — 5.793,00 2.361,00 — 123.125.285.999,25":
      - cell "▶ VENITURI"
      - cell "193,00"
      - cell "660,00"
      - cell "889,00"
      - cell "2.457,00"
      - cell "2.457,00"
      - cell "2.123.188,00"
      - cell "367,00"
      - cell "15.158,00"
      - cell "194,00"
      - cell "907,25"
      - cell "855,75"
      - cell "40,75"
      - cell "23,00"
      - cell "—"
      - cell "3.123,00"
      - cell "320,00"
      - cell "178,00"
      - cell "123,00"
      - cell "22,00"
      - cell "—"
      - cell "—"
      - cell "21,50"
      - cell "—"
      - cell "3.332,00"
      - cell "213,00"
      - cell "123.123.123.123,00"
      - cell "—"
      - cell "—"
      - cell "5.793,00"
      - cell "2.361,00"
      - cell "—"
      - cell "123.125.285.999,25"
    - row "▶ ECONOMII 9,00 123,00 77.809,00 1.796,25 — 22,00 — — 1.711,25 — — — — 625,25 — — — — — — — — — — — — — 571,50 5.555,00 121.666,00 — 209.888,25":
      - cell "▶ ECONOMII"
      - cell "9,00"
      - cell "123,00"
      - cell "77.809,00"
      - cell "1.796,25"
      - cell "—"
      - cell "22,00"
      - cell "—"
      - cell "—"
      - cell "1.711,25"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "625,25"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "571,50"
      - cell "5.555,00"
      - cell "121.666,00"
      - cell "—"
      - cell "209.888,25"
    - row "▶ INFATISARE 3,00 — — — — — — — — — 1.231,00 1.231.116.912,00 12.312.312,00 123,00 392,00 123.551.231,00 — — — — — — 131,00 — 23,00 — — 32,00 32,00 12,00 — 1.366.982.434,00":
      - cell "▶ INFATISARE"
      - cell "3,00"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "1.231,00"
      - cell "1.231.116.912,00"
      - cell "12.312.312,00"
      - cell "123,00"
      - cell "392,00"
      - cell "123.551.231,00"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "131,00"
      - cell "—"
      - cell "23,00"
      - cell "—"
      - cell "—"
      - cell "32,00"
      - cell "32,00"
      - cell "12,00"
      - cell "—"
      - cell "1.366.982.434,00"
    - row "▶ EDUCATIE — — 344,00 — — — — — 123,00 33,00 — 775,25 999.999,00 — — 9.999,00 — 123,00 — 7.777,00 — — — 312.312,00 — — 12.355.512.312,00 — 156,00 5.652,00 565,00 12.356.850.170,25":
      - cell "▶ EDUCATIE"
      - cell "—"
      - cell "—"
      - cell "344,00"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "123,00"
      - cell "33,00"
      - cell "—"
      - cell "775,25"
      - cell "999.999,00"
      - cell "—"
      - cell "—"
      - cell "9.999,00"
      - cell "—"
      - cell "123,00"
      - cell "—"
      - cell "7.777,00"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "312.312,00"
      - cell "—"
      - cell "—"
      - cell "12.355.512.312,00"
      - cell "—"
      - cell "156,00"
      - cell "5.652,00"
      - cell "565,00"
      - cell "12.356.850.170,25"
    - row "▶ CARIERA — — — — — — — — 1.234,25 — — — — 17,50 — — — — — — — — — — — — — — — 123,00 — 1.374,75":
      - cell "▶ CARIERA"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "1.234,25"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "17,50"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "123,00"
      - cell "—"
      - cell "1.374,75"
    - row "▶ SANATATE — — 33,00 — — — — — — — — 173,00 — — — — — — — — — — — — — — — — — — — 206,00":
      - cell "▶ SANATATE"
      - cell "—"
      - cell "—"
      - cell "33,00"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "173,00"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "206,00"
    - row "▶ NUTRITIE — — — — — — — — — — — — — — — — — — — — — — — — — 23,00 — — — — — 23,00":
      - cell "▶ NUTRITIE"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "23,00"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "23,00"
    - row "▶ LOCUINTA — 3,00 — — — — — — — — — — — — — — — — — — — — — — — 601,63 — — — — — 604,63":
      - cell "▶ LOCUINTA"
      - cell "—"
      - cell "3,00"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "601,63"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "604,63"
    - row "▶ TIMP_LIBER — — — — — — — — — — — — — — — — — — — — — — — — — — — — — 678,00 — 678,00":
      - cell "▶ TIMP_LIBER"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "678,00"
      - cell "—"
      - cell "678,00"
    - row "▶ CALATORII — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — —":
      - cell "▶ CALATORII"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
    - row "▶ TRANSPORT 4.447,00 — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — 4.447,00":
      - cell "▶ TRANSPORT"
      - cell "4.447,00"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "4.447,00"
    - row "▶ INVESTITII 15,00 6,00 1.151,25 — — — — — — — 1.347,25 — — — — — — 30,75 — — — 687,25 — — — — — — — — — 3.237,50":
      - cell "▶ INVESTITII"
      - cell "15,00"
      - cell "6,00"
      - cell "1.151,25"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "1.347,25"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "30,75"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "687,25"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "3.237,50"
    - row "▶ TEST — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — —":
      - cell "▶ TEST"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
    - row "Sold -3.575,00 -3.333,00 -82.678,25 -82.131,50 -79.674,50 2.043.491,50 2.043.214,50 2.058.372,50 2.055.494,00 2.055.507,00 2.053.784,50 -1.229.064.039,00 -1.242.376.327,00 -1.242.377.092,75 -1.242.374.361,75 -1.365.935.271,75 -1.365.935.093,75 -1.365.935.124,50 -1.365.935.102,50 -1.365.942.879,50 -1.365.942.879,50 -1.365.943.545,25 -1.365.943.676,25 -1.366.259.320,25 -1.366.259.130,25 121.756.863.969,75 109.401.351.657,75 109.401.351.070,75 109.401.351.005,75 109.401.223.252,75 109.401.222.687,75 650.159.198.272,25":
      - cell "Sold"
      - cell "-3.575,00"
      - cell "-3.333,00"
      - cell "-82.678,25"
      - cell "-82.131,50"
      - cell "-79.674,50"
      - cell "2.043.491,50"
      - cell "2.043.214,50"
      - cell "2.058.372,50"
      - cell "2.055.494,00"
      - cell "2.055.507,00"
      - cell "2.053.784,50"
      - cell "-1.229.064.039,00"
      - cell "-1.242.376.327,00"
      - cell "-1.242.377.092,75"
      - cell "-1.242.374.361,75"
      - cell "-1.365.935.271,75"
      - cell "-1.365.935.093,75"
      - cell "-1.365.935.124,50"
      - cell "-1.365.935.102,50"
      - cell "-1.365.942.879,50"
      - cell "-1.365.942.879,50"
      - cell "-1.365.943.545,25"
      - cell "-1.365.943.676,25"
      - cell "-1.366.259.320,25"
      - cell "-1.366.259.130,25"
      - cell "121.756.863.969,75"
      - cell "109.401.351.657,75"
      - cell "109.401.351.070,75"
      - cell "109.401.351.005,75"
      - cell "109.401.223.252,75"
      - cell "109.401.222.687,75"
      - cell "650.159.198.272,25"
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
   71 |     await expect(page.getByTestId('lunar-grid-container')).toBeVisible();
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
>  93 |     await expect(firstCell).toBeVisible({ timeout: 10000 });
      |                             ^ Error: Timed out 10000ms waiting for expect(locator).toBeVisible()
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
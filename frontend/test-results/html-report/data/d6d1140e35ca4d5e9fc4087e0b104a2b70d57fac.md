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
    - row "Categorii 1 2 3 4 5 6 7 8 9 10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 25 26 27 28 29 30 31 Total":
      - cell "Categorii"
      - cell "1"
      - cell "2"
      - cell "3"
      - cell "4"
      - cell "5"
      - cell "6"
      - cell "7"
      - cell "8"
      - cell "9"
      - cell "10"
      - cell "11"
      - cell "12"
      - cell "13"
      - cell "14"
      - cell "15"
      - cell "16"
      - cell "17"
      - cell "18"
      - cell "19"
      - cell "20"
      - cell "21"
      - cell "22"
      - cell "23"
      - cell "24"
      - cell "25"
      - cell "26"
      - cell "27"
      - cell "28"
      - cell "29"
      - cell "30"
      - cell "31"
      - cell "Total"
  - rowgroup:
    - row "▶ VENITURI 193,00 660,00 499,00 444.670,00 2.457,00 2.123.188,00 367,00 15.158,00 194,00 907,25 855,75 40,75 23,00 — 3.123,00 320,00 178,00 123,00 22,00 — — 21,50 — 3.332,00 213,00 123.123.123.123,00 — — 5.793,00 2.361,00 — 123.125.727.822,25":
      - cell "▶ VENITURI"
      - cell "193,00"
      - cell "660,00"
      - cell "499,00"
      - cell "444.670,00"
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
      - cell "123.125.727.822,25"
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
    - row "Sold -3.575,00 -3.333,00 -82.288,25 360.471,50 362.928,50 2.486.094,50 2.485.817,50 2.500.975,50 2.498.097,00 2.498.110,00 2.496.387,50 -1.228.621.436,00 -1.241.933.724,00 -1.241.934.489,75 -1.241.931.758,75 -1.365.492.668,75 -1.365.492.490,75 -1.365.492.521,50 -1.365.492.499,50 -1.365.500.276,50 -1.365.500.276,50 -1.365.500.942,25 -1.365.501.073,25 -1.365.816.717,25 -1.365.816.527,25 121.757.306.572,75 109.401.794.260,75 109.401.793.673,75 109.401.793.608,75 109.401.665.855,75 109.401.665.290,75 650.171.591.546,25":
      - cell "Sold"
      - cell "-3.575,00"
      - cell "-3.333,00"
      - cell "-82.288,25"
      - cell "360.471,50"
      - cell "362.928,50"
      - cell "2.486.094,50"
      - cell "2.485.817,50"
      - cell "2.500.975,50"
      - cell "2.498.097,00"
      - cell "2.498.110,00"
      - cell "2.496.387,50"
      - cell "-1.228.621.436,00"
      - cell "-1.241.933.724,00"
      - cell "-1.241.934.489,75"
      - cell "-1.241.931.758,75"
      - cell "-1.365.492.668,75"
      - cell "-1.365.492.490,75"
      - cell "-1.365.492.521,50"
      - cell "-1.365.492.499,50"
      - cell "-1.365.500.276,50"
      - cell "-1.365.500.276,50"
      - cell "-1.365.500.942,25"
      - cell "-1.365.501.073,25"
      - cell "-1.365.816.717,25"
      - cell "-1.365.816.527,25"
      - cell "121.757.306.572,75"
      - cell "109.401.794.260,75"
      - cell "109.401.793.673,75"
      - cell "109.401.793.608,75"
      - cell "109.401.665.855,75"
      - cell "109.401.665.290,75"
      - cell "650.171.591.546,25"
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
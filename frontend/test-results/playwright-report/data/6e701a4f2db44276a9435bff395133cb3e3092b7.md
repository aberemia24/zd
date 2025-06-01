# Test info

- Name: LunarGrid - Flux Simplu E2E >> verificare preliminară - elementele necesare sunt prezente
- Location: C:\windsurf repo\budget-app\frontend\tests\e2e\suites\features\lunargrid-simple-flow.spec.ts:155:7

# Error details

```
Error: Timed out 5000ms waiting for expect(locator).toBeVisible()

Locator: getByTestId('lunar-grid-container')
Expected: visible
Received: <element(s) not found>
Call log:
  - expect.toBeVisible with timeout 5000ms
  - waiting for getByTestId('lunar-grid-container')

    at LunarGridPage.goto (C:\windsurf repo\budget-app\frontend\tests\e2e\support\pages\LunarGridPage.ts:14:87)
    at C:\windsurf repo\budget-app\frontend\tests\e2e\suites\features\lunargrid-simple-flow.spec.ts:164:5
```

# Page snapshot

```yaml
- heading "Autentificare" [level=2]
- text: Email*
- textbox "Email*"
- text: Parolă*
- textbox "Parolă*"
- button "Autentificare" [disabled]
- link "Nu ai cont? Crează unul!":
  - /url: /register
```

# Test source

```ts
   1 | import { Page, expect } from '@playwright/test';
   2 | import { LUNAR_GRID_TEST_DATA } from '../../config/test-constants';
   3 | import { TestDataGenerator, LunarGridTestData } from '../../config/test-data-generator';
   4 | import { CATEGORIES } from '../../../../../shared-constants';
   5 |
   6 | export class LunarGridPage {
   7 |   constructor(private page: Page) {}
   8 |   
   9 |   async goto() {
   10 |     await this.page.goto('/lunar-grid');
   11 |     await this.page.waitForLoadState('networkidle');
   12 |     
   13 |     // Verifică că grid-ul s-a încărcat
>  14 |     await expect(this.page.getByTestId(LUNAR_GRID_TEST_DATA.GRID_ELEMENTS.CONTAINER)).toBeVisible();
      |                                                                                       ^ Error: Timed out 5000ms waiting for expect(locator).toBeVisible()
   15 |   }
   16 |
   17 |   /**
   18 |    * Navigare la tab LunarGrid dinamic
   19 |    */
   20 |   async navigateToLunarGrid() {
   21 |     await this.page.getByTestId(LUNAR_GRID_TEST_DATA.GRID_ELEMENTS.NAV_TAB).click();
   22 |     await this.page.waitForLoadState('networkidle');
   23 |     await expect(this.page.getByTestId(LUNAR_GRID_TEST_DATA.GRID_ELEMENTS.CONTAINER)).toBeVisible();
   24 |   }
   25 |
   26 |   /**
   27 |    * Expandează o categorie aleatoare și returnează numele ei
   28 |    */
   29 |   async expandRandomCategory(): Promise<string> {
   30 |     // Obține toate categoriile disponibile
   31 |     const categoryKeys = Object.keys(CATEGORIES);
   32 |     const randomCategoryKey = categoryKeys[Math.floor(Math.random() * categoryKeys.length)];
   33 |     
   34 |     console.log(`🎯 Expandez categoria: ${randomCategoryKey}`);
   35 |     
   36 |     // Click pe butonul de expandare pentru categoria selectată
   37 |     const expandButton = this.page.getByTestId(`toggle-category-${randomCategoryKey}`);
   38 |     await expect(expandButton).toBeVisible();
   39 |     await expandButton.click();
   40 |     
   41 |     // Așteaptă să se expandeze categoria
   42 |     await this.page.waitForTimeout(1000);
   43 |     
   44 |     return randomCategoryKey;
   45 |   }
   46 |
   47 |   /**
   48 |    * Adaugă o subcategorie nouă cu nume random în categoria specificată
   49 |    */
   50 |   async addRandomSubcategory(categoryKey: string): Promise<string> {
   51 |     // Generează un nume random pentru subcategorie
   52 |     const randomName = `TestSub${Math.floor(Math.random() * 10000)}`;
   53 |     
   54 |     console.log(`🔹 Adaug subcategoria: ${randomName} în categoria ${categoryKey}`);
   55 |     
   56 |     // Click pe butonul de adăugare subcategorie
   57 |     const addButton = this.page.getByTestId(`add-subcategory-${categoryKey}`);
   58 |     await expect(addButton).toBeVisible();
   59 |     await addButton.click();
   60 |     
   61 |     // Completează numele subcategoriei
   62 |     const input = this.page.getByTestId(`new-subcategory-input-${categoryKey}`);
   63 |     await expect(input).toBeVisible();
   64 |     await input.fill(randomName);
   65 |     
   66 |     // Salvează subcategoria
   67 |     const saveButton = this.page.getByTestId(`save-subcategory-${categoryKey}`);
   68 |     await saveButton.click();
   69 |     
   70 |     // Așteaptă să se salveze
   71 |     await this.page.waitForTimeout(1000);
   72 |     
   73 |     return randomName;
   74 |   }
   75 |
   76 |   /**
   77 |    * Redenumește o subcategorie cu un nume nou random
   78 |    */
   79 |   async renameSubcategory(oldName: string): Promise<string> {
   80 |     const newName = `Renamed${Math.floor(Math.random() * 10000)}`;
   81 |     
   82 |     console.log(`✏️ Redenumesc subcategoria de la ${oldName} la ${newName}`);
   83 |     
   84 |     // Click pe butonul de editare
   85 |     const editButton = this.page.getByTestId(`edit-subcategory-btn-${oldName}`);
   86 |     await expect(editButton).toBeVisible();
   87 |     await editButton.click();
   88 |     
   89 |     // Modifică numele în input
   90 |     const input = this.page.getByTestId(`edit-subcategory-input-${oldName}`);
   91 |     await expect(input).toBeVisible();
   92 |     await input.fill(newName);
   93 |     
   94 |     // Salvează modificarea
   95 |     const saveButton = this.page.getByTestId(`save-edit-subcategory-${oldName}`);
   96 |     await saveButton.click();
   97 |     
   98 |     // Așteaptă să se salveze
   99 |     await this.page.waitForTimeout(1000);
  100 |     
  101 |     return newName;
  102 |   }
  103 |
  104 |   /**
  105 |    * Adaugă o tranzacție în subcategorie cu date random
  106 |    */
  107 |   async addRandomTransactionInSubcategory(categoryKey: string, subcategoryName: string): Promise<{ day: number, amount: string, description: string }> {
  108 |     // Generează ziua aleatoare (1-28 pentru siguranță)
  109 |     const randomDay = Math.floor(Math.random() * 28) + 1;
  110 |     
  111 |     // Generează suma aleatoare
  112 |     const randomAmount = (Math.random() * 500 + 10).toFixed(2); // între 10 și 510
  113 |     
  114 |     // Generează descriere aleatoare
```
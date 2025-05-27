# Test info

- Name: CategoryEditor - Test Funcționalități Complete >> redenumește o subcategorie standard
- Location: C:\CursorRepos\zd\frontend\tests\e2e\tests\features\category-editor.spec.ts:171:7

# Error details

```
Error: locator.click: Test timeout of 30000ms exceeded.
Call log:
  - waiting for getByTestId('confirm-rename-Îmbrăcăminte, încălțăminte și accesorii')
    - locator resolved to <button disabled type="button" data-testid="confirm-rename-Îmbrăcăminte, încălțăminte și accesorii" class="inline-flex items-center justify-center font-medium transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-blue-600 text-white hover:bg-blue-700 focus-visible:ring-blue-500 h-8 px-3 text-sm rounded-md min-w-[90px] flex-shrink-0">Gata</button>
  - attempting click action
    2 × waiting for element to be visible, enabled and stable
      - element is not enabled
    - retrying click action
    - waiting 20ms
    2 × waiting for element to be visible, enabled and stable
      - element is not enabled
    - retrying click action
      - waiting 100ms
    52 × waiting for element to be visible, enabled and stable
       - element is not enabled
     - retrying click action
       - waiting 500ms

    at C:\CursorRepos\zd\frontend\tests\e2e\tests\features\category-editor.spec.ts:211:22
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
- heading "Opțiuni" [level=1]
- heading "Gestionare categorii" [level=2]
- paragraph: Personalizați categoriile și subcategoriile pentru a se potrivi nevoilor dvs. specifice de bugetare.
- button "Gestionare categorii"
- heading "Opțiuni de afișare" [level=2]
- paragraph: În curând
- heading "Export date" [level=2]
- paragraph: În curând
- heading "Setări Cont" [level=2]
- paragraph: Deconectează-te de la contul tău.
- button "Logout"
- dialog "Gestionare Subcategorii":
  - heading "Gestionare Subcategorii" [level=2]
  - button "Închide":
    - img
  - heading "Categorii" [level=3]
  - list:
    - listitem:
      - button "VENITURI"
    - listitem:
      - button "ECONOMII"
    - listitem:
      - button "INFATISARE" [pressed]
    - listitem:
      - button "EDUCATIE"
    - listitem:
      - button "CARIERA"
    - listitem:
      - button "SANATATE"
    - listitem:
      - button "NUTRITIE"
    - listitem:
      - button "LOCUINTA"
    - listitem:
      - button "TIMP_LIBER"
    - listitem:
      - button "CALATORII"
    - listitem:
      - button "TRANSPORT"
    - listitem:
      - button "INVESTITII"
    - listitem:
      - button "TEST"
  - heading "Subcategorii pentru INFATISARE" [level=3]
  - list "Subcategorii pentru":
    - listitem:
      - textbox: Îmbrăcăminte, încălțăminte și ac
      - button "Gata" [disabled]
      - button "Anulează"
    - listitem:
      - text: Salon de înfrumusețare
      - button "Redenumește Salon de înfrumusețare": Redenumește
    - listitem:
      - text: Produse cosmetice
      - button "Redenumește Produse cosmetice": Redenumește
    - listitem:
      - text: Operații estetice
      - button "Redenumește Operații estetice": Redenumește
    - listitem:
      - text: Produse de igienă personală
      - button "Redenumește Produse de igienă personală": Redenumește
    - listitem:
      - text: Produse de igienă pentru animale de companie
      - button "Redenumește Produse de igienă pentru animale de companie": Redenumește
    - listitem:
      - text: Curățătorie, călcătorie, croitorie, cizmărie
      - button "Redenumește Curățătorie, călcătorie, croitorie, cizmărie": Redenumește
    - listitem:
      - text: Îmbrăcăminte și accesorii pentru animale de companie
      - button "Redenumește Îmbrăcăminte și accesorii pentru animale de companie": Redenumește
  - textbox "Adaugă subcategorie nouă"
  - button "Adaugă" [disabled]
  - button "Anulează"
```

# Test source

```ts
  111 |     await expect(modal).not.toBeVisible();
  112 |     console.log('✅ Modal închis cu butonul X');
  113 |   });
  114 |
  115 |   test('închide CategoryEditor cu tasta ESC', async ({ page }) => {
  116 |     console.log('⌨️ Test închidere CategoryEditor cu ESC');
  117 |     
  118 |     await authPage.loginWithPrimaryAccount();
  119 |     await page.getByTestId('options-tab').click();
  120 |     await page.waitForLoadState('networkidle');
  121 |     
  122 |     // Deschide editor
  123 |     await page.getByTestId('open-category-editor-btn').click();
  124 |     const modal = page.getByTestId('category-editor-modal');
  125 |     await expect(modal).toBeVisible();
  126 |     
  127 |     // Apasă ESC
  128 |     await page.keyboard.press('Escape');
  129 |     
  130 |     // Verifică că s-a închis
  131 |     await expect(modal).not.toBeVisible();
  132 |     console.log('✅ Modal închis cu tasta ESC');
  133 |   });
  134 |
  135 |   test('selectează o categorie și verifică afișarea subcategoriilor', async ({ page }) => {
  136 |     console.log('📂 Test selectare categorie și afișare subcategorii');
  137 |     
  138 |     await authPage.loginWithPrimaryAccount();
  139 |     await page.getByTestId('options-tab').click();
  140 |     await page.getByTestId('open-category-editor-btn').click();
  141 |     
  142 |     const modal = page.getByTestId('category-editor-modal');
  143 |     await expect(modal).toBeVisible();
  144 |     
  145 |     // Verifică că nu există subcategorii afișate inițial
  146 |     const noSelectionMsg = page.getByTestId('no-cat-msg');
  147 |     await expect(noSelectionMsg).toBeVisible();
  148 |     console.log('✅ Mesaj "Selectați o categorie" afișat inițial');
  149 |     
  150 |     // Selectează o categorie random
  151 |     const randomCategory = getRandomCategory();
  152 |     const categoryButton = page.getByTestId(`cat-select-${randomCategory}`);
  153 |     await expect(categoryButton).toBeVisible();
  154 |     await categoryButton.click();
  155 |     console.log(`✅ Categorie ${randomCategory} selectată (random)`);
  156 |     
  157 |     // Verifică că subcategoriile apar
  158 |     await expect(noSelectionMsg).not.toBeVisible();
  159 |     const subcategoriesWrapper = page.getByTestId('subcategories-scroll-wrapper');
  160 |     await expect(subcategoriesWrapper).toBeVisible();
  161 |     
  162 |     // Verifică că există cel puțin o subcategorie
  163 |     const subcategoryItems = page.locator('[data-testid*="subcat-item-"]');
  164 |     const subcatCount = await subcategoryItems.count();
  165 |     expect(subcatCount).toBeGreaterThan(0);
  166 |     console.log(`✅ ${subcatCount} subcategorii afișate pentru ${randomCategory}`);
  167 |     
  168 |     await page.screenshot({ path: 'test-results/category-selected-subcategories.png', fullPage: true });
  169 |   });
  170 |
  171 |   test('redenumește o subcategorie standard', async ({ page }) => {
  172 |     console.log('✏️ Test redenumire subcategorie standard');
  173 |     
  174 |     await authPage.loginWithPrimaryAccount();
  175 |     await page.getByTestId('options-tab').click();
  176 |     await page.getByTestId('open-category-editor-btn').click();
  177 |     
  178 |     // Selectează o categorie random
  179 |     const randomCategory = getRandomCategory();
  180 |     await page.getByTestId(`cat-select-${randomCategory}`).click();
  181 |     await page.waitForTimeout(1000);
  182 |     console.log(`✅ Categorie ${randomCategory} selectată pentru redenumire`);
  183 |     
  184 |     // Găsește prima subcategorie standard (probabil "Salariu")
  185 |     const subcategoryItems = page.locator('[data-testid*="subcat-item-"]');
  186 |     const firstSubcat = subcategoryItems.first();
  187 |     await firstSubcat.hover(); // Pentru a afișa butoanele
  188 |     
  189 |     // Identifică numele subcategoriei
  190 |     const subcatName = await firstSubcat.locator('span').first().textContent();
  191 |     console.log(`📝 Redenumesc subcategoria: ${subcatName}`);
  192 |     
  193 |     // Click pe butonul de edit
  194 |     const editBtn = firstSubcat.getByTestId(`edit-subcat-btn-${subcatName}`);
  195 |     await editBtn.click();
  196 |     
  197 |     // Verifică că input-ul de redenumire apare
  198 |     const renameInput = page.getByTestId(`rename-input-${subcatName}`);
  199 |     await expect(renameInput).toBeVisible();
  200 |     await expect(renameInput).toBeFocused();
  201 |     console.log('✅ Input de redenumire afișat și focalizat');
  202 |     
  203 |     // Înlocuiește textul cu un nume nou (acum cu limită mărită la 80 caractere)
  204 |     const newName = `${subcatName} - Modificat`;
  205 |     console.log(`📏 Nume original: ${subcatName?.length} chars, Nume nou: ${newName.length} chars`);
  206 |     await renameInput.clear();
  207 |     await renameInput.fill(newName);
  208 |     
  209 |     // Confirmă redenumirea
  210 |     const confirmBtn = page.getByTestId(`confirm-rename-${subcatName}`);
> 211 |     await confirmBtn.click();
      |                      ^ Error: locator.click: Test timeout of 30000ms exceeded.
  212 |     
  213 |     // Verifică că subcategoria a fost redenumită
  214 |     await page.waitForTimeout(1000);
  215 |     const renamedSubcat = page.getByTestId(`subcat-item-${newName}`);
  216 |     await expect(renamedSubcat).toBeVisible();
  217 |     console.log(`✅ Subcategoria redenumită cu succes în: ${newName}`);
  218 |     
  219 |     // TRACK redenumirea pentru cleanup
  220 |     renamedSubcategories.push({
  221 |       category: randomCategory,
  222 |       originalName: subcatName || '',
  223 |       newName: newName
  224 |     });
  225 |     console.log(`📝 Tracking redenumire: ${subcatName} → ${newName} în ${randomCategory}`);
  226 |     
  227 |     await page.screenshot({ path: 'test-results/subcategory-renamed.png', fullPage: true });
  228 |   });
  229 |
  230 |   test('adaugă o subcategorie nouă', async ({ page }) => {
  231 |     console.log('➕ Test adăugare subcategorie nouă');
  232 |     
  233 |     await authPage.loginWithPrimaryAccount();
  234 |     await page.getByTestId('options-tab').click();
  235 |     await page.getByTestId('open-category-editor-btn').click();
  236 |     
  237 |     // Selectează o categorie random
  238 |     const randomCategory = getRandomCategory();
  239 |     await page.getByTestId(`cat-select-${randomCategory}`).click();
  240 |     await page.waitForTimeout(1000);
  241 |     console.log(`✅ Categorie ${randomCategory} selectată pentru adăugare subcategorie`);
  242 |     
  243 |     // Numără subcategoriile existente
  244 |     const subcategoryItems = page.locator('[data-testid*="subcat-item-"]');
  245 |     const initialCount = await subcategoryItems.count();
  246 |     console.log(`📊 Subcategorii inițiale: ${initialCount}`);
  247 |     
  248 |     // Completează input-ul pentru subcategorie nouă
  249 |     const addInput = page.getByTestId('add-subcat-input');
  250 |     await expect(addInput).toBeVisible();
  251 |     
  252 |     const newSubcatName = `${TEST_PREFIX}Subcategorie-${Date.now()}`;
  253 |     await addInput.fill(newSubcatName);
  254 |     console.log(`📝 Nume subcategorie nouă: ${newSubcatName}`);
  255 |     
  256 |     // Click pe butonul Add
  257 |     const addBtn = page.getByTestId('add-subcat-btn');
  258 |     await expect(addBtn).toBeEnabled();
  259 |     await addBtn.click();
  260 |     
  261 |     // Verifică că subcategoria a fost adăugată
  262 |     await page.waitForTimeout(1000);
  263 |     const newSubcatCount = await subcategoryItems.count();
  264 |     expect(newSubcatCount).toBe(initialCount + 1);
  265 |     
  266 |     // Verifică că noua subcategorie apare în listă
  267 |     const newSubcatItem = page.getByTestId(`subcat-item-${newSubcatName}`);
  268 |     await expect(newSubcatItem).toBeVisible();
  269 |     
  270 |     // Verifică că are flag-ul CUSTOM
  271 |     const customFlag = page.getByTestId(`custom-flag-${newSubcatName}`);
  272 |     await expect(customFlag).toBeVisible();
  273 |     
  274 |     console.log('✅ Subcategorie nouă adăugată cu succes și marcată ca CUSTOM');
  275 |     
  276 |     // TRACK subcategoria adăugată pentru verificare în TransactionForm
  277 |     addedSubcategories.push({
  278 |       category: randomCategory,
  279 |       subcategoryName: newSubcatName,
  280 |       transactionType: CATEGORY_TYPE_MAP[randomCategory]
  281 |     });
  282 |     console.log(`📝 Tracking subcategorie adăugată: ${newSubcatName} în ${randomCategory} (${CATEGORY_TYPE_MAP[randomCategory]})`);
  283 |     
  284 |     await page.screenshot({ path: 'test-results/new-subcategory-added.png', fullPage: true });
  285 |   });
  286 |
  287 |   test('redenumește o subcategorie custom', async ({ page }) => {
  288 |     console.log('✏️ Test redenumire subcategorie custom');
  289 |     
  290 |     await authPage.loginWithPrimaryAccount();
  291 |     await page.getByTestId('options-tab').click();
  292 |     await page.getByTestId('open-category-editor-btn').click();
  293 |     
  294 |     // Selectează o categorie random
  295 |     const randomCategory = getRandomCategory();
  296 |     await page.getByTestId(`cat-select-${randomCategory}`).click();
  297 |     await page.waitForTimeout(1000);
  298 |     console.log(`✅ Categorie ${randomCategory} selectată pentru redenumire custom`);
  299 |     
  300 |     // Adaugă mai întâi o subcategorie custom pentru a o redenumi
  301 |     const newSubcatName = `${TEST_PREFIX}Custom-${Date.now()}`;
  302 |     await page.getByTestId('add-subcat-input').fill(newSubcatName);
  303 |     await page.getByTestId('add-subcat-btn').click();
  304 |     await page.waitForTimeout(1000);
  305 |     
  306 |     // Verifică că subcategoria a fost adăugată
  307 |     const customSubcatItem = page.getByTestId(`subcat-item-${newSubcatName}`);
  308 |     await expect(customSubcatItem).toBeVisible();
  309 |     console.log(`✅ Subcategoria ${newSubcatName} adăugată cu succes`);
  310 |     
  311 |     // Acum redenumește subcategoria custom creată
```
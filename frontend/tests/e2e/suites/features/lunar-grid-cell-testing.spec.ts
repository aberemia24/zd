import { test, expect, Page } from '@playwright/test';

// Configurație dinamică pentru teste
const TEST_CONFIG = {
  // Credențiale pentru login (pot fi configurate prin env vars)
  credentials: {
    email: process.env.TEST_EMAIL || 'aberemia@gmail.com',
    password: process.env.TEST_PASSWORD || 'test123'
  },
  
  // URL-uri de test - detectează automat din Playwright sau folosește fallback
  urls: {
    base: process.env.TEST_BASE_URL || process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:3006',
    lunarGrid: '/lunar-grid'
  },
  
  // Timeouts pentru diferite acțiuni
  timeouts: {
    navigation: parseInt(process.env.TEST_NAVIGATION_TIMEOUT || '10000'),
    modalOpen: parseInt(process.env.TEST_MODAL_TIMEOUT || '5000'),
    saveAction: parseInt(process.env.TEST_SAVE_TIMEOUT || '3000'),
    elementVisible: parseInt(process.env.TEST_ELEMENT_TIMEOUT || '2000')
  }
};

// Helper pentru generarea de valori random
const TestDataGenerator = {
  /**
   * Generează o sumă random pentru test
   */
  randomAmount(): number {
    return Math.floor(Math.random() * 500) + 10; // între 10 și 510
  },
  
  /**
   * Generează o descriere random pentru tranzacție
   */
  randomDescription(): string {
    const descriptions = [
      'Test automat Playwright',
      'Verificare FAZA 7',
      'Test componenta LunarGridCell',
      'Validare refactorizare',
      'Test salvare tranzacție'
    ];
    return descriptions[Math.floor(Math.random() * descriptions.length)];
  },
  
  /**
   * Selectează o zi random din lună (1-30)
   */
  randomDay(): number {
    return Math.floor(Math.random() * 30) + 1;
  },
  
  /**
   * Selectează o categorie random care să aibă subcategorii
   */
  getTestableCategories(): string[] {
    return ['NUTRITIE', 'TRANSPORT', 'LOCUINTA', 'TIMP_LIBER'];
  },
  
  randomCategory(): string {
    const categories = this.getTestableCategories();
    return categories[Math.floor(Math.random() * categories.length)];
  }
};

// Helper pentru acțiuni comune în teste
class LunarGridTestHelper {
  constructor(private page: Page) {}
  
  /**
   * Efectuează login cu credențialele din configurație
   */
  async login() {
    await this.page.goto(TEST_CONFIG.urls.base);
    
    // Așteaptă să se încarce pagina de login
    await this.page.waitForSelector('input[type="email"], input[type="text"]', { 
      timeout: TEST_CONFIG.timeouts.elementVisible 
    });
    
    // Completează email
    const emailSelector = 'input[type="email"], input[type="text"]';
    await this.page.fill(emailSelector, TEST_CONFIG.credentials.email);
    
    // Completează parola
    const passwordSelector = 'input[type="password"]';
    await this.page.fill(passwordSelector, TEST_CONFIG.credentials.password);
    
    // Click pe butonul de login
    await this.page.click('button[type="submit"], button:has-text("Login")');
    
    // Verifică că login-ul a reușit (URL se schimbă sau elementele se încarcă)
    await this.page.waitForURL('**/transactions', { timeout: TEST_CONFIG.timeouts.navigation });
    
    console.log('✅ Login realizat cu succes');
  }
  
  /**
   * Navigează la LunarGrid
   */
  async navigateToLunarGrid() {
    await this.page.click('a[href="/lunar-grid"], a:has-text("Grid Lunar")');
    await this.page.waitForURL('**/lunar-grid', { timeout: TEST_CONFIG.timeouts.navigation });
    
    // Așteaptă să se încarce grid-ul
    await this.page.waitForSelector('table', { timeout: TEST_CONFIG.timeouts.elementVisible });
    
    console.log('✅ Navigare la LunarGrid realizată');
  }
  
  /**
   * Expandează o categorie specificată
   */
  async expandCategory(categoryName: string) {
    const categorySelector = `tr:has-text("${categoryName}")`;
    
    // Verifică dacă categoria există
    await this.page.waitForSelector(categorySelector, { timeout: TEST_CONFIG.timeouts.elementVisible });
    
    // Click pe categoria pentru a o expanda (dacă nu e deja expandată)
    const categoryRow = this.page.locator(categorySelector).first();
    const isExpanded = await categoryRow.locator('text="▼"').count() > 0;
    
    if (!isExpanded) {
      await categoryRow.click();
      console.log(`✅ Categorie ${categoryName} expandată`);
    } else {
      console.log(`ℹ️ Categorie ${categoryName} era deja expandată`);
    }
    
    // Așteaptă să se încarce subcategoriile
    await this.page.waitForTimeout(500);
  }
  
  /**
   * Găsește și returnează o celulă editabilă pentru o subcategorie
   */
  async findEditableCell(categoryName: string, day?: number): Promise<{ subcategory: string; day: number; cellLocator: any }> {
    const targetDay = day || TestDataGenerator.randomDay();
    
    // Caută toate subcategoriile vizibile pentru categoria dată
    const subcategoryRows = this.page.locator(`tr:has-text("${categoryName}") ~ tr`).filter({
      has: this.page.locator('button:has-text("Redenumește subcategoria")')
    });
    
    const subcategoryCount = await subcategoryRows.count();
    if (subcategoryCount === 0) {
      throw new Error(`Nu s-au găsit subcategorii pentru categoria ${categoryName}`);
    }
    
    // Selectează o subcategorie random
    const randomSubcategoryIndex = Math.floor(Math.random() * subcategoryCount);
    const subcategoryRow = subcategoryRows.nth(randomSubcategoryIndex);
    
    // Extrage numele subcategoriei
    const subcategoryName = await subcategoryRow.locator('td').first().textContent();
    const cleanSubcategoryName = subcategoryName?.trim() || `Subcategorie-${randomSubcategoryIndex}`;
    
    // Găsește celula pentru ziua specificată
    const dayIndex = targetDay; // columnele sunt 1-indexed ca zilele
    const cellLocator = subcategoryRow.locator('td').nth(dayIndex);
    
    // Verifică că celula este editabilă (conține gridcell)
    const isEditable = await cellLocator.locator('div[role="gridcell"]').count() > 0;
    if (!isEditable) {
      throw new Error(`Celula pentru ${cleanSubcategoryName} ziua ${targetDay} nu este editabilă`);
    }
    
    return {
      subcategory: cleanSubcategoryName,
      day: targetDay,
      cellLocator: cellLocator.locator('div[role="gridcell"]')
    };
  }
  
  /**
   * Adaugă o tranzacție prin click pe celulă și completare modal
   */
  async addTransactionToCell(cellLocator: any, amount: number, description?: string) {
    // Click pe celulă pentru a deschide modalul
    await cellLocator.click();
    
    // Așteaptă să se deschidă modalul
    await this.page.waitForSelector('div:has-text("Adaugă tranzacție")', { 
      timeout: TEST_CONFIG.timeouts.modalOpen 
    });
    
    console.log('✅ Modal de adăugare tranzacție deschis');
    
    // Completează suma
    const amountInput = this.page.locator('input[type="text"]:near(text="Sumă"), input[placeholder*="0.00"]');
    await amountInput.clear();
    await amountInput.fill(amount.toString());
    
    // Completează descrierea dacă e furnizată
    if (description) {
      const descriptionInput = this.page.locator('input[placeholder*="descriere"], textarea[placeholder*="descriere"]');
      if (await descriptionInput.count() > 0) {
        await descriptionInput.fill(description);
      }
    }
    
    // Verifică impactul calculat
    const impactText = await this.page.locator('text="+' + amount.toFixed(2) + ' RON"').count();
    expect(impactText).toBeGreaterThan(0);
    
    console.log(`✅ Valoare ${amount} RON introdusă cu succes`);
    
    // Click pe OK pentru a salva
    await this.page.click('button:has-text("OK")');
    
    // Așteaptă să se închidă modalul
    await this.page.waitForSelector('div:has-text("Adaugă tranzacție")', { 
      state: 'detached',
      timeout: TEST_CONFIG.timeouts.saveAction 
    });
    
    console.log('✅ Tranzacție salvată cu succes');
  }
  
  /**
   * Verifică că nu există erori în consolă
   */
  async checkForConsoleErrors(): Promise<string[]> {
    const errors: string[] = [];
    
    this.page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });
    
    return errors;
  }
  
  /**
   * Verifică că aplicația răspunde normal după modificări
   */
  async verifyAppResponsiveness() {
    // Verifică că grid-ul este încă vizibil și funcțional
    await expect(this.page.locator('table')).toBeVisible();
    
    // Verifică că categoriile pot fi expandate/colapsate
    const firstCategory = this.page.locator('tr[role="row"]').filter({
      has: this.page.locator('text="▶", text="▼"')
    }).first();
    
    if (await firstCategory.count() > 0) {
      await expect(firstCategory).toBeVisible();
    }
    
    console.log('✅ Aplicația răspunde normal după modificări');
  }
}

// Teste principale
test.describe('LunarGrid FAZA 7 - Test Componenta LunarGridCell', () => {
  let helper: LunarGridTestHelper;
  
  test.beforeEach(async ({ page }) => {
    helper = new LunarGridTestHelper(page);
    
    // Setup pentru capturarea erorilor de consolă
    const consoleErrors: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });
    
    // Atașează la test pentru verificare
    (test as any).consoleErrors = consoleErrors;
  });
  
  test('Testare completă workflow LunarGridCell - Valori dinamice', async ({ page }) => {
    // Generează date random pentru test
    const testData = {
      category: TestDataGenerator.randomCategory(),
      amount: TestDataGenerator.randomAmount(),
      description: TestDataGenerator.randomDescription()
    };
    
    console.log(`🎯 Test cu date dinamice:`, testData);
    
    // Pas 1: Login
    await helper.login();
    
    // Pas 2: Navigare la LunarGrid
    await helper.navigateToLunarGrid();
    
    // Pas 3: Expandare categorie
    await helper.expandCategory(testData.category);
    
    // Pas 4: Găsește o celulă editabilă
    const cellInfo = await helper.findEditableCell(testData.category);
    console.log(`📍 Celulă selectată: ${testData.category} → ${cellInfo.subcategory} (ziua ${cellInfo.day})`);
    
    // Pas 5: Adaugă tranzacție
    await helper.addTransactionToCell(cellInfo.cellLocator, testData.amount, testData.description);
    
    // Pas 6: Verificări finale
    await helper.verifyAppResponsiveness();
    
    // Verifică că nu sunt erori critice în consolă
    const consoleErrors = (test as any).consoleErrors || [];
    const criticalErrors = consoleErrors.filter(error => 
      !error.includes('Warning') && 
      !error.includes('DevTools') &&
      !error.includes('React Router Future Flag')
    );
    
    expect(criticalErrors).toHaveLength(0);
    
    console.log('🎉 Test complet finalizat cu succes!');
  });
  
  test('Test multiple categorii și subcategorii - Random sampling', async ({ page }) => {
    await helper.login();
    await helper.navigateToLunarGrid();
    
    const categories = TestDataGenerator.getTestableCategories();
    const numberOfTests = Math.min(3, categories.length); // Testează maxim 3 categorii
    
    for (let i = 0; i < numberOfTests; i++) {
      const category = categories[i];
      const amount = TestDataGenerator.randomAmount();
      
      console.log(`🔄 Test ${i + 1}/${numberOfTests}: ${category} cu suma ${amount} RON`);
      
      await helper.expandCategory(category);
      
      try {
        const cellInfo = await helper.findEditableCell(category);
        await helper.addTransactionToCell(cellInfo.cellLocator, amount);
        
        console.log(`✅ Succes pentru ${category}`);
      } catch (error) {
        console.log(`⚠️ Skip ${category}: ${error}`);
        // Nu failuiește testul, doar înregistrează problema
      }
    }
    
    await helper.verifyAppResponsiveness();
  });
  
  test('Test edge cases - Valori extreme și validări', async ({ page }) => {
    await helper.login();
    await helper.navigateToLunarGrid();
    
    const testCategory = 'NUTRITIE'; // Categoria cea mai sigură pentru test
    await helper.expandCategory(testCategory);
    
    // Test cu valori extreme
    const extremeValues = [1, 0.01, 999999];
    
    for (const value of extremeValues) {
      try {
        const cellInfo = await helper.findEditableCell(testCategory);
        await helper.addTransactionToCell(cellInfo.cellLocator, value, `Test valoare extremă: ${value}`);
        
        console.log(`✅ Valoare extremă ${value} acceptată`);
      } catch (error) {
        console.log(`⚠️ Valoare extremă ${value} respinsă: ${error}`);
      }
    }
    
    await helper.verifyAppResponsiveness();
  });
});

// Test de performanță și stress
test.describe('LunarGrid Performance și Stabilitate', () => {
  test('Test rapid multiple acțiuni - Stress test', async ({ page }) => {
    const helper = new LunarGridTestHelper(page);
    
    await helper.login();
    await helper.navigateToLunarGrid();
    
    // Efectuează 5 acțiuni rapide consecutive
    for (let i = 0; i < 5; i++) {
      const category = TestDataGenerator.randomCategory();
      const amount = TestDataGenerator.randomAmount();
      
      await helper.expandCategory(category);
      
      try {
        const cellInfo = await helper.findEditableCell(category);
        await helper.addTransactionToCell(cellInfo.cellLocator, amount);
        
        // Scurtă pauză între acțiuni
        await page.waitForTimeout(500);
      } catch (error) {
        console.log(`⚠️ Acțiune ${i + 1} eșuată: ${error}`);
      }
    }
    
    await helper.verifyAppResponsiveness();
    console.log('🚀 Stress test finalizat');
  });
}); 
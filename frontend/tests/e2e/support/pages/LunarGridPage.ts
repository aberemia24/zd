import { Page, expect } from '@playwright/test';
import { LUNAR_GRID_TEST_DATA } from '../../config/test-constants';
import { TestDataGenerator, LunarGridTestData } from '../../config/test-data-generator';
import { CATEGORIES } from '../../../../../shared-constants';

export class LunarGridPage {
  constructor(private page: Page) {}
  
  async goto() {
    await this.page.goto('/lunar-grid');
    await this.page.waitForLoadState('networkidle');
    
    // Verifică că grid-ul s-a încărcat
    await expect(this.page.getByTestId(LUNAR_GRID_TEST_DATA.GRID_ELEMENTS.CONTAINER)).toBeVisible();
  }

  /**
   * Navigare la tab LunarGrid dinamic
   */
  async navigateToLunarGrid() {
    await this.page.getByTestId(LUNAR_GRID_TEST_DATA.GRID_ELEMENTS.NAV_TAB).click();
    await this.page.waitForLoadState('networkidle');
    await expect(this.page.getByTestId(LUNAR_GRID_TEST_DATA.GRID_ELEMENTS.CONTAINER)).toBeVisible();
  }

  /**
   * Expandează o categorie aleatoare și returnează numele ei
   */
  async expandRandomCategory(): Promise<string> {
    // Obține toate categoriile disponibile
    const categoryKeys = Object.keys(CATEGORIES);
    const randomCategoryKey = categoryKeys[Math.floor(Math.random() * categoryKeys.length)];
    
    console.log(`🎯 Expandez categoria: ${randomCategoryKey}`);
    
    // Click pe butonul de expandare pentru categoria selectată
    const expandButton = this.page.getByTestId(`toggle-category-${randomCategoryKey}`);
    await expect(expandButton).toBeVisible();
    await expandButton.click();
    
    // Așteaptă să se expandeze categoria
    await this.page.waitForTimeout(1000);
    
    return randomCategoryKey;
  }

  /**
   * Adaugă o subcategorie nouă cu nume random în categoria specificată
   */
  async addRandomSubcategory(categoryKey: string): Promise<string> {
    // Generează un nume random pentru subcategorie
    const randomName = `TestSub${Math.floor(Math.random() * 10000)}`;
    
    console.log(`🔹 Adaug subcategoria: ${randomName} în categoria ${categoryKey}`);
    
    // Click pe butonul de adăugare subcategorie
    const addButton = this.page.getByTestId(`add-subcategory-${categoryKey}`);
    await expect(addButton).toBeVisible();
    await addButton.click();
    
    // Completează numele subcategoriei
    const input = this.page.getByTestId(`new-subcategory-input-${categoryKey}`);
    await expect(input).toBeVisible();
    await input.fill(randomName);
    
    // Salvează subcategoria
    const saveButton = this.page.getByTestId(`save-subcategory-${categoryKey}`);
    await saveButton.click();
    
    // Așteaptă să se salveze
    await this.page.waitForTimeout(1000);
    
    return randomName;
  }

  /**
   * Redenumește o subcategorie cu un nume nou random
   */
  async renameSubcategory(oldName: string): Promise<string> {
    const newName = `Renamed${Math.floor(Math.random() * 10000)}`;
    
    console.log(`✏️ Redenumesc subcategoria de la ${oldName} la ${newName}`);
    
    // Click pe butonul de editare
    const editButton = this.page.getByTestId(`edit-subcategory-btn-${oldName}`);
    await expect(editButton).toBeVisible();
    await editButton.click();
    
    // Modifică numele în input
    const input = this.page.getByTestId(`edit-subcategory-input-${oldName}`);
    await expect(input).toBeVisible();
    await input.fill(newName);
    
    // Salvează modificarea
    const saveButton = this.page.getByTestId(`save-edit-subcategory-${oldName}`);
    await saveButton.click();
    
    // Așteaptă să se salveze
    await this.page.waitForTimeout(1000);
    
    return newName;
  }

  /**
   * Adaugă o tranzacție în subcategorie cu date random
   */
  async addRandomTransactionInSubcategory(categoryKey: string, subcategoryName: string): Promise<{ day: number, amount: string, description: string }> {
    // Generează ziua aleatoare (1-28 pentru siguranță)
    const randomDay = Math.floor(Math.random() * 28) + 1;
    
    // Generează suma aleatoare
    const randomAmount = (Math.random() * 500 + 10).toFixed(2); // între 10 și 510
    
    // Generează descriere aleatoare
    const descriptions = ['Cumpărături test', 'Plată servicii', 'Cheltuială necesară', 'Achiziție planificată'];
    const randomDescription = descriptions[Math.floor(Math.random() * descriptions.length)];
    
    console.log(`💰 Adaug tranzacție: ${randomAmount} RON în ${subcategoryName} pe ziua ${randomDay}`);
    
    // Click pe celula specifică
    const cellTestId = `cell-${categoryKey}-${subcategoryName}-${randomDay}`;
    const cell = this.page.getByTestId(cellTestId);
    await expect(cell).toBeVisible();
    await cell.click();
    
    // Așteaptă popover-ul să apară
    const amountInput = this.page.getByTestId('cell-amount-input');
    await expect(amountInput).toBeVisible();
    
    // Completează suma
    await amountInput.fill(randomAmount);
    
    // Dacă există câmp pentru descriere, îl completăm
    const descriptionInput = this.page.getByTestId('cell-description-input').first();
    if (await descriptionInput.isVisible()) {
      await descriptionInput.fill(randomDescription);
    }
    
    // Salvează tranzacția
    await this.page.getByTestId('cell-save-btn').click();
    
    // Așteaptă să se închidă popover-ul
    await this.page.waitForTimeout(1000);
    
    return { day: randomDay, amount: randomAmount, description: randomDescription };
  }

  /**
   * Adaugă o tranzacție recurentă cu date random
   */
  async addRandomRecurringTransaction(categoryKey: string, subcategoryName: string): Promise<{ day: number, amount: string, description: string }> {
    const randomDay = Math.floor(Math.random() * 28) + 1;
    const randomAmount = (Math.random() * 200 + 50).toFixed(2);
    const recurringDescriptions = ['Abonament lunar', 'Plată recurentă', 'Serviciu periodic', 'Cheltuială fixă'];
    const randomDescription = recurringDescriptions[Math.floor(Math.random() * recurringDescriptions.length)];
    
    console.log(`🔄 Adaug tranzacție recurentă: ${randomAmount} RON în ${subcategoryName} pe ziua ${randomDay}`);
    
    // Click pe celula specifică
    const cellTestId = `cell-${categoryKey}-${subcategoryName}-${randomDay}`;
    const cell = this.page.getByTestId(cellTestId);
    await expect(cell).toBeVisible();
    await cell.click();
    
    // Așteaptă popover-ul
    const amountInput = this.page.getByTestId('cell-amount-input');
    await expect(amountInput).toBeVisible();
    await amountInput.fill(randomAmount);
    
    // Setează ca recurentă (dacă există opțiunea)
    const recurringCheckbox = this.page.getByTestId('cell-recurring-checkbox');
    if (await recurringCheckbox.isVisible()) {
      await recurringCheckbox.check();
    }
    
    // Completează descrierea
    const descriptionInput = this.page.getByTestId('cell-description-input').first();
    if (await descriptionInput.isVisible()) {
      await descriptionInput.fill(randomDescription);
    }
    
    // Salvează
    await this.page.getByTestId('cell-save-btn').click();
    await this.page.waitForTimeout(1000);
    
    return { day: randomDay, amount: randomAmount, description: randomDescription };
  }

  /**
   * Șterge o tranzacție prin double-click și modal
   */
  async deleteTransactionFromCell(categoryKey: string, subcategoryName: string, day: number): Promise<void> {
    console.log(`🗑️ Șterg tranzacția din ${subcategoryName} pe ziua ${day}`);
    
    const cellTestId = `cell-${categoryKey}-${subcategoryName}-${day}`;
    const cell = this.page.getByTestId(cellTestId);
    await expect(cell).toBeVisible();
    
    // Double-click pentru modal detalii
    await cell.dblclick();
    
    // Așteaptă modalul să apară și click pe delete
    const deleteButton = this.page.getByTestId('quick-add-delete-button');
    await expect(deleteButton).toBeVisible();
    await deleteButton.click();
    
    // Confirmă ștergerea dacă există dialog de confirmare
    const confirmButton = this.page.getByText('Confirmă');
    if (await confirmButton.isVisible()) {
      await confirmButton.click();
    }
    
    await this.page.waitForTimeout(1000);
  }

  /**
   * Șterge subcategoria custom din tabel
   */
  async deleteCustomSubcategory(subcategoryName: string): Promise<void> {
    console.log(`🗑️ Șterg subcategoria custom: ${subcategoryName}`);
    
    const deleteButton = this.page.getByTestId(`delete-subcategory-btn-${subcategoryName}`);
    await expect(deleteButton).toBeVisible();
    await deleteButton.click();
    
    // Confirmă ștergerea în modal
    const confirmationModal = this.page.getByTestId('delete-subcategory-confirmation');
    await expect(confirmationModal).toBeVisible();
    
    const confirmButton = confirmationModal.getByText('Confirmă');
    await confirmButton.click();
    
    await this.page.waitForTimeout(1000);
  }

  /**
   * Schimbă luna și verifică header actualizat
   */
  async changeToRandomMonth(): Promise<{ month: number, year: number }> {
    // Generează o lună aleatoare (diferită de cea curentă)
    const currentMonth = await this.getCurrentMonth();
    let newMonth = Math.floor(Math.random() * 12) + 1;
    
    // Asigură că e diferită de luna curentă
    while (newMonth === currentMonth) {
      newMonth = Math.floor(Math.random() * 12) + 1;
    }
    
    console.log(`📅 Schimb luna la: ${newMonth}`);
    
    const monthSelect = this.page.getByTestId(LUNAR_GRID_TEST_DATA.GRID_ELEMENTS.MONTH_SELECTOR);
    await monthSelect.selectOption(newMonth.toString());
    
    await this.page.waitForLoadState('networkidle');
    
    // Verifică că header-ul s-a actualizat
    const currentYear = await this.getCurrentYear();
    await this.verifyMonthHeader(newMonth, currentYear);
    
    return { month: newMonth, year: currentYear };
  }

  /**
   * Helper: Obține luna curentă
   */
  async getCurrentMonth(): Promise<number> {
    const monthSelect = this.page.getByTestId(LUNAR_GRID_TEST_DATA.GRID_ELEMENTS.MONTH_SELECTOR);
    const value = await monthSelect.inputValue();
    return parseInt(value);
  }

  /**
   * Helper: Obține anul curent
   */
  async getCurrentYear(): Promise<number> {
    const yearInput = this.page.getByTestId(LUNAR_GRID_TEST_DATA.GRID_ELEMENTS.YEAR_INPUT);
    const value = await yearInput.inputValue();
    return parseInt(value);
  }

  /**
   * Verifică că header-ul lunii s-a actualizat corect
   */
  async verifyMonthHeader(expectedMonth: number, expectedYear: number): Promise<void> {
    const monthNames = ['', 'Ianuarie', 'Februarie', 'Martie', 'Aprilie', 'Mai', 'Iunie', 
                      'Iulie', 'August', 'Septembrie', 'Octombrie', 'Noiembrie', 'Decembrie'];
    
    const expectedMonthName = monthNames[expectedMonth];
    console.log(`✅ Verific header pentru ${expectedMonthName} ${expectedYear}`);
    
    // Verifică că grid-ul s-a reîncărcat pentru noua lună
    await expect(this.page.getByTestId(LUNAR_GRID_TEST_DATA.GRID_ELEMENTS.CONTAINER)).toBeVisible();
    
    // Verifică că selectorul arată luna corectă
    const monthSelect = this.page.getByTestId(LUNAR_GRID_TEST_DATA.GRID_ELEMENTS.MONTH_SELECTOR);
    await expect(monthSelect).toHaveValue(expectedMonth.toString());
    
    const yearInput = this.page.getByTestId(LUNAR_GRID_TEST_DATA.GRID_ELEMENTS.YEAR_INPUT);
    await expect(yearInput).toHaveValue(expectedYear.toString());
  }

  /**
   * Verifică că o celulă conține valoarea așteptată
   */
  async verifyCellValue(categoryKey: string, subcategoryName: string, day: number, expectedValue: string): Promise<void> {
    const cellTestId = `cell-${categoryKey}-${subcategoryName}-${day}`;
    const cell = this.page.getByTestId(cellTestId);
    await expect(cell).toBeVisible();
    await expect(cell).toContainText(expectedValue);
  }

  /**
   * Verifică că subcategoria există în tabel
   */
  async verifySubcategoryExists(subcategoryName: string): Promise<void> {
    // Caută subcategoria în tabel
    const subcategoryRow = this.page.getByText(subcategoryName);
    await expect(subcategoryRow).toBeVisible();
  }

  /**
   * Verifică că subcategoria nu mai există în tabel
   */
  async verifySubcategoryNotExists(subcategoryName: string): Promise<void> {
    // Verifică că subcategoria nu mai apare în tabel
    const subcategoryRow = this.page.getByText(subcategoryName);
    await expect(subcategoryRow).not.toBeVisible();
  }

  /**
   * Așteaptă încărcarea completă a grid-ului
   */
  async waitForGridToLoad() {
    await this.page.waitForSelector(`[data-testid="${LUNAR_GRID_TEST_DATA.GRID_ELEMENTS.CONTAINER}"]`);
    await this.page.waitForLoadState('networkidle');
    
    // Verifică că cel puțin o categorie este vizibilă  
    const categories = Object.keys(CATEGORIES);
    const firstCategory = categories[0];
    await expect(this.page.getByTestId(`toggle-category-${firstCategory}`)).toBeVisible();
  }

  /**
   * Obține toate categoriile disponibile
   */
  getAvailableCategories(): string[] {
    return Object.keys(CATEGORIES);
  }

  /**
   * Obține subcategoriile pentru o categorie
   */
  getSubcategoriesForCategory(categoryKey: string): string[] {
    const categoryData = CATEGORIES[categoryKey as keyof typeof CATEGORIES];
    if (!categoryData) return [];
    
    const allSubcategories: string[] = [];
    Object.values(categoryData).forEach(group => {
      if (Array.isArray(group)) {
        allSubcategories.push(...group);
      }
    });
    
    return allSubcategories;
  }
} 
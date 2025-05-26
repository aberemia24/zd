import { Page, expect } from '@playwright/test';
import { LUNAR_GRID_TEST_DATA } from '../../config/test-constants';

export class LunarGridPage {
  constructor(private page: Page) {}
  
  async goto() {
    await this.page.goto('/lunar-grid');
    await this.page.waitForLoadState('networkidle');
    
    // Verifică că grid-ul s-a încărcat
    await expect(this.page.getByTestId(LUNAR_GRID_TEST_DATA.GRID_ELEMENTS.CONTAINER)).toBeVisible();
  }
  
  async addTransaction(category: string, day: number, amount: string) {
    // Click pe celulă folosind data-testid pattern LunarGrid real
    // Pentru NUTRITIE folosim subcategoria "Acasa"
    const subcategory = category === 'NUTRITIE' ? 'Acasa' : 'main';
    const cellTestId = `lunar-cell-${category}-${subcategory}-${day}`;
    await this.page.getByTestId(cellTestId).click();
    
    // Așteaptă popover-ul sau modalul
    const amountInput = this.page.getByTestId('cell-amount-input');
    await expect(amountInput).toBeVisible();
    
    // Completează suma
    await amountInput.fill(amount);
    
    // Salvează tranzacția
    await this.page.getByTestId('cell-save-btn').click();
    
    // Așteaptă ca popover-ul să se închidă
    await this.page.waitForTimeout(1000);
  }
  
  async goToNextMonth() {
    const monthSelect = this.page.getByTestId(LUNAR_GRID_TEST_DATA.GRID_ELEMENTS.MONTH_SELECTOR);
    const currentMonth = await monthSelect.inputValue();
    const nextMonth = parseInt(currentMonth) + 1;
    
    if (nextMonth <= 12) {
      await monthSelect.selectOption(nextMonth.toString());
    } else {
      // Treci la ianuarie și actualizează anul
      await monthSelect.selectOption('1');
      const yearInput = this.page.getByTestId(LUNAR_GRID_TEST_DATA.GRID_ELEMENTS.YEAR_INPUT);
      const currentYear = await yearInput.inputValue();
      await yearInput.fill((parseInt(currentYear) + 1).toString());
    }
    
    await this.page.waitForLoadState('networkidle');
    
    // Verifică că grid-ul s-a actualizat
    await expect(this.page.getByTestId(LUNAR_GRID_TEST_DATA.GRID_ELEMENTS.CONTAINER)).toBeVisible();
  }
  
  async goToPreviousMonth() {
    const monthSelect = this.page.getByTestId(LUNAR_GRID_TEST_DATA.GRID_ELEMENTS.MONTH_SELECTOR);
    const currentMonth = await monthSelect.inputValue();
    const prevMonth = parseInt(currentMonth) - 1;
    
    if (prevMonth >= 1) {
      await monthSelect.selectOption(prevMonth.toString());
    } else {
      // Treci la decembrie și actualizează anul
      await monthSelect.selectOption('12');
      const yearInput = this.page.getByTestId(LUNAR_GRID_TEST_DATA.GRID_ELEMENTS.YEAR_INPUT);
      const currentYear = await yearInput.inputValue();
      await yearInput.fill((parseInt(currentYear) - 1).toString());
    }
    
    await this.page.waitForLoadState('networkidle');
    
    // Verifică că grid-ul s-a actualizat
    await expect(this.page.getByTestId(LUNAR_GRID_TEST_DATA.GRID_ELEMENTS.CONTAINER)).toBeVisible();
  }
  
  async getCellValue(category: string, day: number): Promise<string> {
    // Pentru NUTRITIE folosim subcategoria "Acasa"
    const subcategory = category === 'NUTRITIE' ? 'Acasa' : 'main';
    const cellTestId = `lunar-cell-${category}-${subcategory}-${day}`;
    const cell = this.page.getByTestId(cellTestId);
    await expect(cell).toBeVisible();
    return await cell.textContent() || '';
  }
  
  async verifyMonthlyTotal(expectedTotal: string) {
    const totalElement = this.page.getByTestId('monthly-total');
    await expect(totalElement).toBeVisible();
    await expect(totalElement).toHaveText(expectedTotal);
  }
  
  async verifyCategoryTotal(category: string, expectedTotal: string) {
    const categoryTotalTestId = `category-total-${category}`;
    const totalElement = this.page.getByTestId(categoryTotalTestId);
    await expect(totalElement).toBeVisible();
    await expect(totalElement).toHaveText(expectedTotal);
  }
  
  async waitForGridToLoad() {
    // Așteaptă încărcarea completă a grid-ului
    await this.page.waitForSelector(`[data-testid="${LUNAR_GRID_TEST_DATA.GRID_ELEMENTS.CONTAINER}"]`);
    await this.page.waitForLoadState('networkidle');
    
    // Verifică că cel puțin o celulă este vizibilă  
    const testCategory = 'NUTRITIE'; // Categorie hardcodată pentru test simplu
    const subcategory = 'Acasa'; // Subcategorie cunoscută pentru NUTRITIE
    await expect(this.page.getByTestId(`lunar-cell-${testCategory}-${subcategory}-1`)).toBeVisible();
  }
} 
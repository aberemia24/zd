import { Page, expect } from '@playwright/test';

export class CategoryEditorPage {
  constructor(private page: Page) {}

  // Selectori
  get modal() {
    return this.page.getByTestId('category-editor-modal');
  }

  get closeButton() {
    return this.page.getByTestId('close-category-editor');
  }

  get categoriesSection() {
    return this.page.getByTestId('categories-section');
  }

  get subcategoriesSection() {
    return this.page.getByTestId('subcategories-section');
  }

  get noSelectionMessage() {
    return this.page.getByTestId('no-cat-msg');
  }

  get subcategoriesWrapper() {
    return this.page.getByTestId('subcategories-scroll-wrapper');
  }

  get addSubcategoryInput() {
    return this.page.getByTestId('add-subcat-input');
  }

  get addSubcategoryButton() {
    return this.page.getByTestId('add-subcat-btn');
  }

  get deleteConfirmation() {
    return this.page.getByTestId('delete-confirmation');
  }

  get confirmDeleteButton() {
    return this.page.getByTestId('confirm-delete-btn');
  }

  get cancelDeleteButton() {
    return this.page.getByTestId('cancel-delete-btn');
  }

  // Metode pentru acțiuni
  async openFromOptionsPage() {
    await this.page.waitForSelector('[data-testid="transactions-tab"]');

    await this.page.getByTestId('options-tab').click();
    await this.page.waitForLoadState('networkidle');
    await this.page.getByTestId('open-category-editor-btn').click();
    await expect(this.modal).toBeVisible();
  }

  async closeWithButton() {
    await this.closeButton.click();
    await expect(this.modal).not.toBeVisible();
  }

  async closeWithEscape() {
    await this.page.keyboard.press('Escape');
    await expect(this.modal).not.toBeVisible();
  }

  async selectCategory(categoryName: string) {
    const categoryButton = this.page.getByTestId(`cat-select-${categoryName}`);
    await expect(categoryButton).toBeVisible();
    await categoryButton.click();
    await this.page.waitForTimeout(1000);
  }

  async getSubcategoryCount() {
    const subcategoryItems = this.page.locator('[data-testid*="subcat-item-"]');
    return await subcategoryItems.count();
  }

  async addSubcategory(name: string) {
    await this.addSubcategoryInput.fill(name);
    await expect(this.addSubcategoryButton).toBeEnabled();
    await this.addSubcategoryButton.click();
    await this.page.waitForTimeout(1000);
  }

  async renameSubcategory(oldName: string, newName: string) {
    const subcategoryItem = this.page.getByTestId(`subcat-item-${oldName}`);
    await subcategoryItem.hover();
    
    const editButton = this.page.getByTestId(`edit-subcat-btn-${oldName}`);
    await editButton.click();
    
    const renameInput = this.page.getByTestId(`rename-input-${oldName}`);
    await expect(renameInput).toBeVisible();
    await expect(renameInput).toBeFocused();
    
    await renameInput.clear();
    await renameInput.fill(newName);
    
    const confirmButton = this.page.getByTestId(`confirm-rename-${oldName}`);
    await confirmButton.click();
    
    await this.page.waitForTimeout(1000);
  }

  async deleteSubcategory(name: string, confirm: boolean = true) {
    const subcategoryItem = this.page.getByTestId(`subcat-item-${name}`);
    await subcategoryItem.hover();
    
    const deleteButton = this.page.getByTestId(`delete-subcat-btn-${name}`);
    await expect(deleteButton).toBeVisible();
    await deleteButton.click();
    
    await expect(this.deleteConfirmation).toBeVisible();
    
    if (confirm) {
      await this.confirmDeleteButton.click();
    } else {
      await this.cancelDeleteButton.click();
    }
    
    await this.page.waitForTimeout(1000);
  }

  async verifySubcategoryExists(name: string) {
    const subcategoryItem = this.page.getByTestId(`subcat-item-${name}`);
    await expect(subcategoryItem).toBeVisible();
  }

  async verifySubcategoryNotExists(name: string) {
    const subcategoryItem = this.page.getByTestId(`subcat-item-${name}`);
    await expect(subcategoryItem).not.toBeVisible();
  }

  async verifyCustomFlag(name: string) {
    const customFlag = this.page.getByTestId(`custom-flag-${name}`);
    await expect(customFlag).toBeVisible();
  }

  async getFirstSubcategoryName(): Promise<string> {
    const subcategoryItems = this.page.locator('[data-testid*="subcat-item-"]');
    const firstSubcat = subcategoryItems.first();
    const subcatName = await firstSubcat.locator('span').first().textContent();
    return subcatName || '';
  }

  async screenshot(path: string) {
    await this.page.screenshot({ path: `test-results/${path}`, fullPage: true });
  }
} 
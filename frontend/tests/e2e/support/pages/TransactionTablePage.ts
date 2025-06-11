import { Page, Locator, expect } from "@playwright/test";
import { TransactionTableDataGenerator } from "../../config/test-data-generator";

/**
 * Page Object Model pentru TransactionTable
 * Oferă metode pentru interacțiunea cu tabelul de tranzacții
 */
export class TransactionTablePage {
  private page: Page;
  private selectors: ReturnType<typeof TransactionTableDataGenerator.getTableSelectors>;
  private loadingSelectors: ReturnType<typeof TransactionTableDataGenerator.getLoadingSelectors>;
  private emptySelectors: ReturnType<typeof TransactionTableDataGenerator.getEmptyStateSelectors>;

  constructor(page: Page) {
    this.page = page;
    this.selectors = TransactionTableDataGenerator.getTableSelectors();
    this.loadingSelectors = TransactionTableDataGenerator.getLoadingSelectors();
    this.emptySelectors = TransactionTableDataGenerator.getEmptyStateSelectors();
  }

  // Locatori principali
  get table(): Locator {
    return this.page.getByTestId(this.selectors.table);
  }

  get loadingState(): Locator {
    return this.page.getByTestId(this.selectors.tableLoading);
  }

  get loadingText(): Locator {
    return this.page.getByTestId(this.selectors.tableLoadingText);
  }

  get loadingMoreState(): Locator {
    return this.page.getByTestId(this.selectors.tableLoadingMore);
  }

  get loadingMoreText(): Locator {
    return this.page.getByTestId(this.selectors.tableLoadingMoreText);
  }

  get emptyState(): Locator {
    return this.page.getByTestId(this.selectors.tableEmpty);
  }

  get loadingOverlay(): Locator {
    return this.page.getByTestId(this.selectors.tableLoadingOverlay);
  }

  // Metode pentru verificări
  async waitForTableToLoad(): Promise<void> {
    await expect(this.table).toBeVisible();
    // Așteptăm ca loading state să dispară
    await expect(this.loadingState).not.toBeVisible({ timeout: 10000 });
  }

  async waitForLoadingMoreToAppear(): Promise<void> {
    await expect(this.loadingMoreState).toBeVisible();
  }

  async waitForLoadingMoreToDisappear(): Promise<void> {
    await expect(this.loadingMoreState).not.toBeVisible();
  }

  async waitForOverlayToAppear(): Promise<void> {
    await expect(this.loadingOverlay).toBeVisible();
  }

  async waitForOverlayToDisappear(): Promise<void> {
    await expect(this.loadingOverlay).not.toBeVisible();
  }

  async verifyTableIsEmpty(): Promise<void> {
    await expect(this.emptyState).toBeVisible();
  }

  async verifyTableHasData(): Promise<void> {
    await expect(this.table).toBeVisible();
    await expect(this.emptyState).not.toBeVisible();
  }

  // Metode pentru interacțiunea cu rândurile de tranzacții
  getTransactionRow(id: string | number): Locator {
    return this.page.getByTestId(this.selectors.transactionItem(id));
  }

  async verifyTransactionExists(id: string | number): Promise<void> {
    await expect(this.getTransactionRow(id)).toBeVisible();
  }

  async getTransactionCount(): Promise<number> {
    const rows = this.page.locator('[data-testid^="transaction-item-"]');
    return await rows.count();
  }

  // Metode pentru debugging și logging
  async logTableState(): Promise<void> {
    const isTableVisible = await this.table.isVisible();
    const isLoadingVisible = await this.loadingState.isVisible();
    const isEmptyVisible = await this.emptyState.isVisible();
    const transactionCount = await this.getTransactionCount();

    console.log('📊 TransactionTable State:', {
      tableVisible: isTableVisible,
      loadingVisible: isLoadingVisible,
      emptyVisible: isEmptyVisible,
      transactionCount: transactionCount
    });
  }

  // Metode pentru așteptări complexe
  async waitForInitialLoad(): Promise<void> {
    console.log('⏳ Waiting for TransactionTable initial load...');
    
    // Așteptăm să apară tabelul
    await expect(this.table).toBeVisible();
    
    // Dacă există loading state, așteptăm să dispară
    const isLoadingVisible = await this.loadingState.isVisible();
    if (isLoadingVisible) {
      await expect(this.loadingState).not.toBeVisible({ timeout: 15000 });
    }
    
    console.log('✅ TransactionTable loaded successfully');
  }

  async waitForRefresh(): Promise<void> {
    console.log('🔄 Waiting for TransactionTable refresh...');
    
    // Așteptăm overlay-ul să apară și să dispară
    try {
      await this.waitForOverlayToAppear();
      await this.waitForOverlayToDisappear();
      console.log('✅ TransactionTable refreshed successfully');
    } catch (error) {
      console.log('ℹ️ No overlay detected, table might have loaded instantly');
    }
  }
} 
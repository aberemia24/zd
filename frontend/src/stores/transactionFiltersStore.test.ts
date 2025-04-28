import { describe, it, expect, beforeEach } from '@jest/globals';
import { TransactionType, CategoryType, PAGINATION } from '@shared-constants';
import { createTransactionFiltersStore } from './transactionFiltersStore';

// Helper pentru inițializare store izolat la fiecare test
let store: ReturnType<typeof createTransactionFiltersStore>;

beforeEach(() => {
  store = createTransactionFiltersStore();
  store.resetFilters();
});

describe('transactionFiltersStore', () => {
  it('inițializează corect filtrele cu valorile implicite', () => {
    expect(store.filterType).toBeUndefined();
    expect(store.filterCategory).toBeUndefined();
    expect(store.limit).toBe(PAGINATION.DEFAULT_LIMIT);
    expect(store.offset).toBe(PAGINATION.DEFAULT_OFFSET);
    expect(store.sort).toBe(PAGINATION.DEFAULT_SORT);
    expect(store.getCurrentPage()).toBe(1);
  });

  it('permite inițializarea cu valori custom', () => {
    store.setFilterType(TransactionType.EXPENSE);
    store.setFilterCategory(CategoryType.EXPENSE);
    store.setLimit(10);
    store.setOffset(30);
    store.setSort('amount');
    expect(store.filterType).toBe(TransactionType.EXPENSE);
    expect(store.filterCategory).toBe(CategoryType.EXPENSE);
    expect(store.limit).toBe(10);
    expect(store.offset).toBe(30);
    expect(store.sort).toBe('amount');
  });

  it('setează filtrul de tip și resetează offset-ul', () => {
    store.setOffset(40);
    store.setFilterType(TransactionType.INCOME);
    expect(store.filterType).toBe(TransactionType.INCOME);
    expect(store.offset).toBe(0);
  });

  it('setează filtrul de categorie și resetează offset-ul', () => {
    store.setOffset(40);
    store.setFilterCategory(CategoryType.SAVING);
    expect(store.filterCategory).toBe(CategoryType.SAVING);
    expect(store.offset).toBe(0);
  });

  it('resetează toate filtrele la valorile implicite', () => {
    store.setFilterType(TransactionType.EXPENSE);
    store.setFilterCategory(CategoryType.EXPENSE);
    store.setLimit(10);
    store.setOffset(30);
    store.setSort('amount');
    store.resetFilters();
    expect(store.filterType).toBeUndefined();
    expect(store.filterCategory).toBeUndefined();
    expect(store.limit).toBe(PAGINATION.DEFAULT_LIMIT);
    expect(store.offset).toBe(PAGINATION.DEFAULT_OFFSET);
    expect(store.sort).toBe(PAGINATION.DEFAULT_SORT);
  });

  it('navighează corect la pagina următoare și anterioară', () => {
    store.setLimit(20);
    store.setOffset(0);
    store.setTotalItems(100);
    store.nextPage();
    expect(store.offset).toBe(20);
    expect(store.getCurrentPage()).toBe(2);
    store.prevPage();
    expect(store.offset).toBe(0);
    expect(store.getCurrentPage()).toBe(1);
  });

  it('nu permite navigarea înaintea primei pagini', () => {
    store.setOffset(0);
    store.prevPage();
    expect(store.offset).toBe(0);
    expect(store.getCurrentPage()).toBe(1);
  });

  it('nu permite navigarea după ultima pagină', () => {
    store.setLimit(20);
    store.setOffset(80);
    store.setTotalItems(100);
    store.nextPage();
    expect(store.offset).toBe(80);
    expect(store.getCurrentPage()).toBe(5);
  });

  it('navighează la o pagină specifică', () => {
    store.setLimit(20);
    store.setTotalItems(100);
    store.goToPage(4);
    expect(store.offset).toBe(60);
    expect(store.getCurrentPage()).toBe(4);
  });

  it('actualizează sortarea', () => {
    store.setSort('amount');
    expect(store.sort).toBe('amount');
  });

  it('generează query params corecte pentru API', () => {
    store.setFilterType(TransactionType.EXPENSE);
    store.setFilterCategory(CategoryType.EXPENSE);
    store.setLimit(20);
    store.setOffset(40);
    store.setSort('amount');
    expect(store.getQueryParams()).toEqual({
      type: TransactionType.EXPENSE,
      category: CategoryType.EXPENSE,
      limit: 20,
      offset: 40,
      sort: 'amount'
    });
  });

  it('calculează corect currentPage și totalPages', () => {
    store.setLimit(20);
    store.setOffset(40);
    store.setTotalItems(100);
    expect(store.getCurrentPage()).toBe(3);
    expect(store.getTotalPages()).toBe(5);
  });
});

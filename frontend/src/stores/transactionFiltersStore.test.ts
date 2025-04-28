import { describe, it, expect, beforeEach } from '@jest/globals';
import { TransactionType, CategoryType, PAGINATION } from '@shared-constants';
import { useTransactionFiltersStore } from './transactionFiltersStore';

beforeEach(() => {
  useTransactionFiltersStore.getState().resetFilters();
});

describe('transactionFiltersStore', () => {
  it('inițializează corect filtrele cu valorile implicite', () => {
    const store = useTransactionFiltersStore.getState();
    expect(store.filterType).toBeUndefined();
    expect(store.filterCategory).toBeUndefined();
    expect(store.limit).toBe(PAGINATION.DEFAULT_LIMIT);
    expect(store.offset).toBe(PAGINATION.DEFAULT_OFFSET);
    expect(store.sort).toBe(PAGINATION.DEFAULT_SORT);
    expect(store.getCurrentPage()).toBe(1);
  });

  it('permite inițializarea cu valori custom', () => {
    const store = useTransactionFiltersStore.getState();
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
    const store = useTransactionFiltersStore.getState();
    store.setOffset(40);
    store.setFilterType(TransactionType.INCOME);
    expect(store.filterType).toBe(TransactionType.INCOME);
    expect(store.offset).toBe(0);
  });

  it('setează filtrul de categorie și resetează offset-ul', () => {
    const store = useTransactionFiltersStore.getState();
    store.setOffset(40);
    store.setFilterCategory(CategoryType.SAVING);
    expect(store.filterCategory).toBe(CategoryType.SAVING);
    expect(store.offset).toBe(0);
  });

  it('resetează toate filtrele la valorile implicite', () => {
    const store = useTransactionFiltersStore.getState();
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
    const store = useTransactionFiltersStore.getState();
    store.setLimit(20);
    store.setOffset(0);
    store.setTotalItems(100);
    store.nextPage();
    expect(store.offset).toBe(20);
    store.nextPage();
    expect(store.offset).toBe(40);
    store.prevPage();
    expect(store.offset).toBe(20);
    store.goToPage(5);
    expect(store.offset).toBe(80);
  });

  it('nu permite navigarea înaintea primei pagini', () => {
    const store = useTransactionFiltersStore.getState();
    store.setOffset(0);
    store.prevPage();
    expect(store.offset).toBe(0);
    expect(store.getCurrentPage()).toBe(1);
  });

  it('nu permite navigarea după ultima pagină', () => {
    const store = useTransactionFiltersStore.getState();
    store.setLimit(20);
    store.setOffset(80);
    store.setTotalItems(100);
    store.nextPage();
    expect(store.offset).toBe(80);
    expect(store.getCurrentPage()).toBe(5);
  });

  it('navighează la o pagină specifică', () => {
    const store = useTransactionFiltersStore.getState();
    store.setLimit(20);
    store.setTotalItems(100);
    store.goToPage(4);
    expect(store.offset).toBe(60);
    expect(store.getCurrentPage()).toBe(4);
  });

  it('actualizează sortarea', () => {
    const store = useTransactionFiltersStore.getState();
    store.setSort('amount');
    expect(store.sort).toBe('amount');
  });

  it('getQueryParams returnează corect parametrii actuali', () => {
    const store = useTransactionFiltersStore.getState();
    store.setFilterType(TransactionType.INCOME);
    store.setFilterCategory(CategoryType.SAVING);
    store.setLimit(15);
    store.setOffset(45);
    store.setSort('date');
    const params = store.getQueryParams();
    expect(params).toEqual({
      type: TransactionType.INCOME,
      category: CategoryType.SAVING,
      limit: 15,
      offset: 45,
      sort: 'date',
    });
  });

  it('calculează corect currentPage și totalPages', () => {
    const store = useTransactionFiltersStore.getState();
    store.setLimit(20);
    store.setOffset(40);
    store.setTotalItems(100);
    expect(store.getCurrentPage()).toBe(3);
    expect(store.getTotalPages()).toBe(5);
  });
});

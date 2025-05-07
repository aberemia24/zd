import { describe, it, expect, beforeEach, afterEach } from '@jest/globals';
import { act } from 'react';
import { TransactionType, CategoryType, PAGINATION } from '@shared-constants';
import { useTransactionFiltersStore } from './transactionFiltersStore';
import { resetAllStores } from '../test-utils';

// Resetăm store-ul înainte de fiecare test folosind helper-ul din test-utils
beforeEach(() => {
  resetAllStores();
});

// Resetăm store-ul și după fiecare test pentru a preveni side effects
afterEach(() => {
  resetAllStores();
});

describe('transactionFiltersStore', () => {
  it('inițializează corect filtrele cu valorile implicite', () => {
    const store = useTransactionFiltersStore.getState();
    expect(store.filterType).toBe('');
    expect(store.filterCategory).toBe('');
    expect(store.limit).toBe(PAGINATION.DEFAULT_LIMIT);
    expect(store.offset).toBe(PAGINATION.DEFAULT_OFFSET);
    expect(store.sort).toBe(PAGINATION.DEFAULT_SORT);
    expect(store.getCurrentPage()).toBe(1);
  });

  it('permite inițializarea cu valori custom', () => {
    // Folosim act() pentru toate modificările de state
    act(() => {
      const store = useTransactionFiltersStore.getState();
      store.setFilterType(TransactionType.EXPENSE);
      store.setFilterCategory(CategoryType.EXPENSE);
      store.setLimit(10);
      store.setOffset(30);
      store.setSort('amount');
    });

    // Verificăm state-ul după toate modificările
    const store = useTransactionFiltersStore.getState();
    expect(store.filterType).toBe(TransactionType.EXPENSE);
    expect(store.filterCategory).toBe(CategoryType.EXPENSE);
    expect(store.limit).toBe(10);
    expect(store.offset).toBe(30);
    expect(store.sort).toBe('amount');
  });

  it('setează filtrul de tip și resetează offset-ul', () => {
    act(() => {
      const store = useTransactionFiltersStore.getState();
      store.setOffset(40);
      store.setFilterType(TransactionType.INCOME);
    });

    const store = useTransactionFiltersStore.getState();
    expect(store.filterType).toBe(TransactionType.INCOME);
    expect(store.offset).toBe(0); // Offset trebuie să fie reset la 0 când se modifică filtrul
  });

  it('setează filtrul de categorie și resetează offset-ul', () => {
    act(() => {
      const store = useTransactionFiltersStore.getState();
      store.setOffset(40);
      store.setFilterCategory(CategoryType.SAVING);
    });

    const store = useTransactionFiltersStore.getState();
    expect(store.filterCategory).toBe(CategoryType.SAVING);
    expect(store.offset).toBe(0); // Offset trebuie să fie reset la 0 când se modifică filtrul
  });

  it('resetează toate filtrele la valorile implicite', () => {
    act(() => {
      const store = useTransactionFiltersStore.getState();
      store.setFilterType(TransactionType.EXPENSE);
      store.setFilterCategory(CategoryType.EXPENSE);
      store.setLimit(10);
      store.setOffset(30);
      store.setSort('amount');
      store.resetFilters();
    });

    const store = useTransactionFiltersStore.getState();
    expect(store.filterType).toBe('');
    expect(store.filterCategory).toBe('');
    expect(store.limit).toBe(PAGINATION.DEFAULT_LIMIT);
    expect(store.offset).toBe(PAGINATION.DEFAULT_OFFSET);
    expect(store.sort).toBe(PAGINATION.DEFAULT_SORT);
  });

  it('navighează corect la pagina următoare și anterioară', () => {
    act(() => {
      const store = useTransactionFiltersStore.getState();
      store.setLimit(20);
      store.setOffset(0);
      store.setTotalItems(100);
      store.nextPage();
    });

    // Verifică că offset a fost incrementat corect
    let store = useTransactionFiltersStore.getState();
    expect(store.offset).toBe(20);

    act(() => {
      store.nextPage();
    });

    store = useTransactionFiltersStore.getState();
    expect(store.offset).toBe(40);

    act(() => {
      store.prevPage();
    });

    store = useTransactionFiltersStore.getState();
    expect(store.offset).toBe(20);

    act(() => {
      store.goToPage(5);
    });

    store = useTransactionFiltersStore.getState();
    expect(store.offset).toBe(80); // offset = (page-1) * limit = 4 * 20 = 80
  });

  it('nu permite navigarea înaintea primei pagini', () => {
    act(() => {
      const store = useTransactionFiltersStore.getState();
      store.setOffset(0);
      store.prevPage();
    });

    const store = useTransactionFiltersStore.getState();
    expect(store.offset).toBe(0);
    expect(store.getCurrentPage()).toBe(1);
  });

  it('nu permite navigarea după ultima pagină', () => {
    act(() => {
      const store = useTransactionFiltersStore.getState();
      store.setLimit(20);
      store.setOffset(80);
      store.setTotalItems(100);
      store.nextPage();
    });

    const store = useTransactionFiltersStore.getState();
    expect(store.offset).toBe(80); // Rămâne la 80 pentru că suntem deja la ultima pagină
    expect(store.getCurrentPage()).toBe(5);
  });

  it('navighează la o pagină specifică', () => {
    act(() => {
      const store = useTransactionFiltersStore.getState();
      store.setLimit(20);
      store.setTotalItems(100);
      store.goToPage(4);
    });

    const store = useTransactionFiltersStore.getState();
    expect(store.offset).toBe(60); // offset = (page-1) * limit = 3 * 20 = 60
    expect(store.getCurrentPage()).toBe(4);
  });

  it('actualizează sortarea', () => {
    act(() => {
      const store = useTransactionFiltersStore.getState();
      store.setSort('amount');
    });

    const store = useTransactionFiltersStore.getState();
    expect(store.sort).toBe('amount');
  });

  it('getQueryParams returnează corect parametrii actuali', () => {
    act(() => {
      const store = useTransactionFiltersStore.getState();
      store.setFilterType(TransactionType.INCOME);
      store.setFilterCategory(CategoryType.SAVING);
      store.setLimit(15);
      store.setOffset(45);
      store.setSort('date');
    });

    const store = useTransactionFiltersStore.getState();
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
    act(() => {
      const store = useTransactionFiltersStore.getState();
      store.setLimit(20);
      store.setOffset(40);
      store.setTotalItems(100);
    });

    const store = useTransactionFiltersStore.getState();
    expect(store.getCurrentPage()).toBe(3);
    expect(store.getTotalPages()).toBe(5);
  });
});

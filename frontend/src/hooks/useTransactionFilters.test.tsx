import { renderHook, act } from '@testing-library/react';
import { useTransactionFilters } from '.';
import { PAGINATION } from '../constants/defaults';
import { TransactionType, CategoryType } from '../constants/enums';

describe('useTransactionFilters', () => {
  // Test pentru inițializarea cu valori implicite
  it('inițializează filtrele cu valorile implicite', () => {
    const { result } = renderHook(() => useTransactionFilters());
    
    expect(result.current.filterType).toBeUndefined();
    expect(result.current.filterCategory).toBeUndefined();
    expect(result.current.limit).toBe(PAGINATION.DEFAULT_LIMIT);
    expect(result.current.offset).toBe(PAGINATION.DEFAULT_OFFSET);
    expect(result.current.sort).toBe(PAGINATION.DEFAULT_SORT);
    expect(result.current.currentPage).toBe(1);
  });
  
  // Test pentru inițializarea cu valori personalizate
  it('inițializează filtrele cu valorile furnizate', () => {
    const initialFilters = {
      filterType: TransactionType.EXPENSE,
      filterCategory: CategoryType.EXPENSE,
      limit: 20,
      offset: 40,
      sort: 'amount',
    };
    
    const { result } = renderHook(() => useTransactionFilters({
      initialFilters
    }));
    
    expect(result.current.filterType).toBe(TransactionType.EXPENSE);
    expect(result.current.filterCategory).toBe(CategoryType.EXPENSE);
    expect(result.current.limit).toBe(20);
    expect(result.current.offset).toBe(40);
    expect(result.current.sort).toBe('amount');
    expect(result.current.currentPage).toBe(3); // (offset / limit) + 1 => (40 / 20) + 1 = 3
  });
  
  // Test pentru actualizarea unui filtru individual
  it('actualizează filtrul de tip', () => {
    const { result } = renderHook(() => useTransactionFilters());
    
    act(() => {
      result.current.setFilterType(TransactionType.INCOME);
    });
    
    expect(result.current.filterType).toBe(TransactionType.INCOME);
    expect(result.current.offset).toBe(0); // offset resetat la schimbarea filtrului
    expect(result.current.currentPage).toBe(1);
  });
  
  // Test pentru actualizarea filtrului de categorie
  it('actualizează filtrul de categorie', () => {
    const { result } = renderHook(() => useTransactionFilters());
    
    act(() => {
      result.current.setFilterCategory(CategoryType.SAVING);
    });
    
    expect(result.current.filterCategory).toBe(CategoryType.SAVING);
    expect(result.current.offset).toBe(0); // offset resetat la schimbarea filtrului
    expect(result.current.currentPage).toBe(1);
  });
  
  // Test pentru resetarea tuturor filtrelor
  it('resetează toate filtrele', () => {
    const initialFilters = {
      filterType: TransactionType.EXPENSE,
      filterCategory: CategoryType.EXPENSE,
      limit: 20,
      offset: 40,
      sort: 'amount',
    };
    
    const { result } = renderHook(() => useTransactionFilters({
      initialFilters
    }));
    
    act(() => {
      result.current.resetFilters();
    });
    
    expect(result.current.filterType).toBeUndefined();
    expect(result.current.filterCategory).toBeUndefined();
    expect(result.current.limit).toBe(PAGINATION.DEFAULT_LIMIT);
    expect(result.current.offset).toBe(PAGINATION.DEFAULT_OFFSET);
    expect(result.current.sort).toBe(PAGINATION.DEFAULT_SORT);
    expect(result.current.currentPage).toBe(1);
  });
  
  // Test pentru navigare la pagina următoare
  it('navighează la pagina următoare', () => {
    const { result } = renderHook(() => useTransactionFilters({
      totalItems: 100,
      initialFilters: { limit: 20 }
    }));
    
    act(() => {
      result.current.nextPage();
    });
    
    expect(result.current.offset).toBe(20);
    expect(result.current.currentPage).toBe(2);
  });
  
  // Test pentru navigare la pagina anterioară
  it('navighează la pagina anterioară', () => {
    const { result } = renderHook(() => useTransactionFilters({
      totalItems: 100,
      initialFilters: { limit: 20, offset: 40 }
    }));
    
    expect(result.current.currentPage).toBe(3);
    
    act(() => {
      result.current.prevPage();
    });
    
    expect(result.current.offset).toBe(20);
    expect(result.current.currentPage).toBe(2);
  });
  
  // Test pentru navigare la prima pagină
  it('nu permite navigarea înaintea primei pagini', () => {
    const { result } = renderHook(() => useTransactionFilters({
      totalItems: 100
    }));
    
    act(() => {
      result.current.prevPage();
    });
    
    expect(result.current.offset).toBe(0);
    expect(result.current.currentPage).toBe(1);
  });
  
  // Test pentru navigare după ultima pagină
  it('nu permite navigarea după ultima pagină', () => {
    const { result } = renderHook(() => useTransactionFilters({
      totalItems: 100,
      initialFilters: { limit: 20, offset: 80 }
    }));
    
    expect(result.current.currentPage).toBe(5);
    
    act(() => {
      result.current.nextPage();
    });
    
    expect(result.current.offset).toBe(80);
    expect(result.current.currentPage).toBe(5);
  });
  
  // Test pentru navigare la o pagină specifică
  it('navighează la o pagină specifică', () => {
    const { result } = renderHook(() => useTransactionFilters({
      totalItems: 100,
      initialFilters: { limit: 20 }
    }));
    
    act(() => {
      result.current.goToPage(4);
    });
    
    expect(result.current.offset).toBe(60);
    expect(result.current.currentPage).toBe(4);
  });
  
  // Test pentru actualizarea sortării
  it('actualizează sortarea', () => {
    const { result } = renderHook(() => useTransactionFilters());
    
    act(() => {
      result.current.setSort('amount');
    });
    
    expect(result.current.sort).toBe('amount');
  });
  
  // Test pentru generarea query params pentru API
  it('generează query params corecte pentru API', () => {
    const initialFilters = {
      filterType: TransactionType.EXPENSE,
      filterCategory: CategoryType.EXPENSE,
      limit: 20,
      offset: 40,
      sort: 'amount',
    };
    
    const { result } = renderHook(() => useTransactionFilters({
      initialFilters
    }));
    
    expect(result.current.queryParams).toEqual({
      type: TransactionType.EXPENSE,
      category: CategoryType.EXPENSE,
      limit: 20,
      offset: 40,
      sort: 'amount'
    });
  });
});

import { useEffect, useCallback, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useTransactionFiltersStore } from '../stores/transactionFiltersStore';

/**
 * Hook pentru sincronizarea filtrelor tranzacțiilor cu URL-ul
 * Implementează debouncing pentru actualizări URL și gestionarea navigării browser
 */
export const useURLFilters = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const debounceTimeoutRef = useRef<NodeJS.Timeout>();
  
  const {
    loadFromURL,
    getURLSearchParams,
    filterType,
    filterCategory,
    filterSubcategory,
    dateFrom,
    dateTo,
    amountMin,
    amountMax,
    searchText,
    limit,
    offset,
    sort
  } = useTransactionFiltersStore();

  // Load filters from URL on component mount
  useEffect(() => {
    const currentParams = new URLSearchParams(window.location.search);
    loadFromURL(currentParams);
  }, [loadFromURL]);

  // Debounced URL update function
  const updateURL = useCallback(() => {
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    debounceTimeoutRef.current = setTimeout(() => {
      const newParams = getURLSearchParams();
      const currentParamsString = searchParams.toString();
      const newParamsString = newParams.toString();

      // Only update URL if parameters changed
      if (currentParamsString !== newParamsString) {
        setSearchParams(newParams, { replace: true });
      }
    }, 300); // 300ms debounce delay
  }, [getURLSearchParams, searchParams, setSearchParams]);

  // Trigger URL update when filters change
  useEffect(() => {
    updateURL();
    
    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, [
    filterType,
    filterCategory,
    filterSubcategory,
    dateFrom,
    dateTo,
    amountMin,
    amountMax,
    searchText,
    limit,
    offset,
    sort,
    updateURL
  ]);

  // Handle browser back/forward navigation
  useEffect(() => {
    const handlePopState = () => {
      const currentParams = new URLSearchParams(window.location.search);
      loadFromURL(currentParams);
    };

    window.addEventListener('popstate', handlePopState);
    
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [loadFromURL]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, []);

  // Utility function to get current URL with filters
  const getCurrentURL = useCallback(() => {
    const params = getURLSearchParams();
    const baseURL = window.location.origin + window.location.pathname;
    const queryString = params.toString();
    return queryString ? `${baseURL}?${queryString}` : baseURL;
  }, [getURLSearchParams]);

  // Utility function to clear all filters and URL
  const clearFiltersAndURL = useCallback(() => {
    useTransactionFiltersStore.getState().resetFilters();
    setSearchParams(new URLSearchParams(), { replace: true });
  }, [setSearchParams]);

  return {
    getCurrentURL,
    clearFiltersAndURL,
    searchParams
  };
}; 
import { useState, useEffect, useCallback, useRef } from 'react';
import { Transaction } from '../types/Transaction';
import { TransactionService } from '../services/transactionService';
import { TransactionQueryParams } from './useTransactionFilters';
import { isEqual } from 'lodash';

export type UseTransactionDataProps = {
  // Parametrii de query pentru filtrare și paginare
  queryParams: TransactionQueryParams;
  // Flag pentru forțarea refresh-ului
  forceRefresh?: boolean;
  // Serviciu pentru tranzacții (injectat pentru testabilitate)
  transactionService?: TransactionService;
};

/**
 * Hook pentru preluarea și gestionarea datelor despre tranzacții
 * 
 * Responsabilități:
 * - Fetching-ul datelor de la API folosind parametrii de filtrare
 * - Gestionarea stării de loading și a erorilor
 * - Caching basic pentru optimizarea performanței
 */
export const useTransactionData = ({
  queryParams,
  forceRefresh = false,
  transactionService = new TransactionService()
}: UseTransactionDataProps) => {
  // Starea pentru date și metadate
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Referință pentru ultimii parametri de query utilizați
  const lastQueryParamsRef = useRef<TransactionQueryParams | null>(null);
  
  /**
   * Încarcă tranzacțiile de la API
   */
  const fetchTransactions = useCallback(async (refresh: boolean = false) => {
    // Verifică dacă parametrii de query s-au schimbat
    if (
      !refresh && 
      lastQueryParamsRef.current && 
      isEqual(lastQueryParamsRef.current, queryParams)
    ) {
      // Nu reîncărcăm dacă parametrii sunt aceiași și nu se forțează refresh
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      // Actualizează referința la parametrii curenți
      lastQueryParamsRef.current = { ...queryParams };
      
      // Obține datele de la serviciu
      const response = await transactionService.getFilteredTransactions(
        queryParams,
        refresh
      );
      
      // Actualizează starea cu datele primite
      setTransactions(response.data);
      setTotal(response.total);
    } catch (err) {
      console.error('Eroare la încărcarea tranzacțiilor:', err);
      setError(err instanceof Error ? err.message : 'Eroare necunoscută');
      setTransactions([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }, [queryParams, transactionService]);
  
  /**
   * Forțează reîncărcarea datelor
   */
  const refresh = useCallback(() => {
    return fetchTransactions(true);
  }, [fetchTransactions]);
  
  // Efect pentru încărcarea datelor la montare sau când se schimbă query params
  useEffect(() => {
    fetchTransactions(forceRefresh);
  }, [fetchTransactions, forceRefresh]);
  
  return {
    transactions,
    total,
    loading,
    error,
    refresh
  };
};

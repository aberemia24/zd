import { useMemo, useCallback } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '../../stores/authStore';
import { queryKeys, createQueryKeyFactory } from './reactQueryUtils';
import { financialCalculationService } from '../financialCalculation.service';
import type { 
  DailyBalanceParams, 
  MonthlyProjection,
  BalanceProjection
} from '../financialCalculation.service';
import type { TransactionValidated } from '@shared-constants/transaction.schema';

// Creez query keys pentru financial projections
const financialProjectionKeys = createQueryKeyFactory('financial-projections');

export interface UseFinancialProjectionsOptions {
  startingBalance?: number;
  staleTime?: number;
  gcTime?: number;
}

export interface UseFinancialProjectionsResult {
  dailyBalance: number | null;
  monthlyProjection: MonthlyProjection | null;
  isLoading: boolean;
  error: Error | null;
  invalidateCache: (changeDate?: string) => void;
  getDailyBalance: (date: string) => Promise<number>;
  getMonthProjections: (year: number, month: number) => Promise<MonthlyProjection>;
}

/**
 * Hook pentru calculele financiare și proiecțiile de balanță
 * Urmează pattern-ul existent din useMonthlyTransactions cu service integration
 */
export function useFinancialProjections(
  year: number,
  month: number,
  transactions: TransactionValidated[],
  options: UseFinancialProjectionsOptions = {}
): UseFinancialProjectionsResult {
  const { user } = useAuthStore();
  const queryClient = useQueryClient();
  
  const {
    startingBalance = 1000, // Default starting balance - să fie configurable later
    staleTime = 30 * 1000, // 30 secunde cache pentru financial data
    gcTime = 5 * 60 * 1000, // 5 minute garbage collection
  } = options;

  // Service instance memoized pentru performance
  const service = useMemo(() => financialCalculationService, []);

  // Query pentru monthly projection - main data source
  const monthlyProjectionQuery = useQuery({
    queryKey: financialProjectionKeys.monthly(year, month, user?.id),
    queryFn: async () => {
      return service.calculateMonthlyProjection(
        year,
        month,
        transactions,
        startingBalance
      );
    },
    staleTime,
    gcTime,
    enabled: !!user?.id && transactions.length >= 0, // Always enabled, even with 0 transactions
  });

  // Get current date daily balance from monthly projection
  const currentDate = service.formatDateForCalculation(new Date());
  const dailyBalance = useMemo(() => {
    if (!monthlyProjectionQuery.data?.dailyBalances) return null;
    
    const todayProjection = monthlyProjectionQuery.data.dailyBalances.find(
      (day: BalanceProjection) => day.date === currentDate
    );
    
    return todayProjection?.balance || null;
  }, [monthlyProjectionQuery.data, currentDate]);

  // Intelligent cache invalidation function
  const invalidateCache = useCallback((changeDate?: string) => {
    // Invalidate monthly projection pentru current month
    queryClient.invalidateQueries({
      queryKey: financialProjectionKeys.monthly(year, month, user?.id),
      refetchType: 'active'
    });

    // També invalidate related transaction queries pentru consistency
    queryClient.invalidateQueries({
      queryKey: queryKeys.transactions.monthly(year, month, user?.id),
      refetchType: 'active'
    });

    // If changeDate provided, clear cache for affected dates
    if (changeDate) {
      queryClient.invalidateQueries({
        queryKey: financialProjectionKeys.all,
        refetchType: 'active'
      });
    }
  }, [queryClient, year, month, user?.id]);

  // Get daily balance pentru specific date
  const getDailyBalance = useCallback(async (targetDate: string): Promise<number> => {
    if (!user?.id) throw new Error('User not authenticated');

    const params: DailyBalanceParams = {
      transactions,
      startingBalance,
      targetDate
    };

    return service.calculateDailyBalance(params);
  }, [transactions, startingBalance, service, user?.id]);

  // Get month projections cu pre-calculation
  const getMonthProjections = useCallback(async (targetYear: number, targetMonth: number): Promise<MonthlyProjection> => {
    if (!user?.id) throw new Error('User not authenticated');

    return queryClient.fetchQuery({
      queryKey: financialProjectionKeys.monthly(targetYear, targetMonth, user?.id),
      queryFn: () => service.calculateMonthlyProjection(
        targetYear,
        targetMonth,
        transactions,
        startingBalance
      ),
      staleTime,
    });
  }, [queryClient, service, transactions, startingBalance, user?.id, staleTime]);

  return {
    dailyBalance,
    monthlyProjection: monthlyProjectionQuery.data || null,
    isLoading: monthlyProjectionQuery.isLoading || monthlyProjectionQuery.isFetching,
    error: monthlyProjectionQuery.error as Error | null,
    invalidateCache,
    getDailyBalance,
    getMonthProjections
  };
} 
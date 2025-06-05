import { useCallback, useMemo, useState } from "react";
import { useSettingsStore } from "../../stores/settingsStore";
import { useMonthlyTransactions } from "../../services/hooks/useMonthlyTransactions";
import { Transaction } from "../../types/Transaction";
import { TransactionType } from "@shared-constants";
import type { TransactionValidated } from "@shared-constants/transaction.schema";
import {
  DailyBalance,
  AccountDailyBalance,
  UseBalanceCalculatorResult,
  UseBalanceCalculatorConfig,
  BalanceCalculationParams,
  MonthlyBalanceCalculationParams,
  BalanceCalculationError,
  BalanceValidationResult,
  MonthlyTransferConfig,
} from "./useBalanceCalculator.types";

/**
 * Hook principal pentru calculele de sold cu suport multi-account
 * 
 * @param year - Anul pentru care se fac calculele (ex: 2025)
 * @param month - Luna pentru care se fac calculele (1-12)
 * @param config - Configurația opțională pentru hook
 * @returns Obiect cu funcțiile de calcul și starea hook-ului
 * 
 * @example
 * ```typescript
 * const { calculateDailyBalance, isLoading } = useBalanceCalculator(2025, 6, {
 *   enableMonthlyTransfers: true,
 *   cacheTimeout: 30000
 * });
 * 
 * const todayBalance = calculateDailyBalance('2025-06-15');
 * ```
 */
export const useBalanceCalculator = (
  year: number,
  month: number,
  config: UseBalanceCalculatorConfig = {}
): UseBalanceCalculatorResult => {
  const {
    enableMultiAccount = false,
    enableMonthlyTransfers = true,
    cacheTimeout = 30000, // 30 secunde
    defaultAccountId,
    enableProjections = true,
  } = config;

  // Validări pentru parametrii de intrare
  if (!year || year < 1900 || year > 2100) {
    throw new BalanceCalculationError(
      `Anul ${year} nu este valid. Trebuie să fie între 1900 și 2100.`,
      'INVALID_DATE'
    );
  }

  if (!month || month < 1 || month > 12) {
    throw new BalanceCalculationError(
      `Luna ${month} nu este validă. Trebuie să fie între 1 și 12.`,
      'INVALID_DATE'
    );
  }

  // Store dependencies
  const { accounts, defaultAccountId: storeDefaultAccountId, getAccountById } = useSettingsStore();
  
  // Obține tranzacțiile pentru luna curentă
  const { transactions, isLoading: transactionsLoading, error: transactionsError } = useMonthlyTransactions(year, month);
  
  // Pentru transferuri între luni, obține și tranzacțiile din luna anterioară
  const prevMonth = month === 1 ? 12 : month - 1;
  const prevYear = month === 1 ? year - 1 : year;
  const { 
    transactions: prevMonthTransactions, 
    isLoading: prevTransactionsLoading 
  } = useMonthlyTransactions(prevYear, prevMonth, undefined, {
    staleTime: 60 * 1000, // Cache mai lung pentru luna anterioară
  });

  // State local pentru cache și erori
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [cache, setCache] = useState<Map<string, { data: any; timestamp: number }>>(new Map());

  // Determină contul activ
  const activeAccountId = defaultAccountId || storeDefaultAccountId || accounts[0]?.accountId;

  /**
   * Validează formatul unei date în format YYYY-MM-DD
   * @param date - Data de validat
   * @returns true dacă data este validă
   */
  const isValidDateFormat = useCallback((date: string): boolean => {
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(date)) return false;
    
    const dateObj = new Date(date);
    return dateObj instanceof Date && !isNaN(dateObj.getTime()) && 
           dateObj.toISOString().split('T')[0] === date;
  }, []);

  /**
   * Validează formatul unei date în format românesc (DD/MM/YYYY sau DD.MM.YYYY)
   * @param date - Data de validat în format românesc
   * @returns true dacă data este validă
   */
  const isValidRomanianDateFormat = useCallback((date: string): boolean => {
    // Acceptă DD/MM/YYYY sau DD.MM.YYYY
    const dateRegex = /^(\d{1,2})[\/\.](\d{1,2})[\/\.](\d{4})$/;
    const match = date.match(dateRegex);
    
    if (!match) return false;
    
    const [, day, month, year] = match;
    const dayNum = parseInt(day, 10);
    const monthNum = parseInt(month, 10);
    const yearNum = parseInt(year, 10);
    
    // Validare de bază
    if (dayNum < 1 || dayNum > 31) return false;
    if (monthNum < 1 || monthNum > 12) return false;
    if (yearNum < 1900 || yearNum > 2100) return false;
    
    // Verificare cu obiectul Date pentru validare completă
    const dateObj = new Date(yearNum, monthNum - 1, dayNum);
    return dateObj.getFullYear() === yearNum && 
           dateObj.getMonth() === monthNum - 1 && 
           dateObj.getDate() === dayNum;
  }, []);

  /**
   * Convertește o dată din format românesc (DD/MM/YYYY sau DD.MM.YYYY) în format ISO (YYYY-MM-DD)
   * @param romanianDate - Data în format românesc
   * @returns Data în format ISO sau null dacă formatul este invalid
   */
  const convertRomanianToISODate = useCallback((romanianDate: string): string | null => {
    if (!isValidRomanianDateFormat(romanianDate)) return null;
    
    const dateRegex = /^(\d{1,2})[\/\.](\d{1,2})[\/\.](\d{4})$/;
    const match = romanianDate.match(dateRegex);
    
    if (!match) return null;
    
    const [, day, month, year] = match;
    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
  }, [isValidRomanianDateFormat]);

  /**
   * Convertește o dată din format ISO (YYYY-MM-DD) în format românesc (DD/MM/YYYY)
   * @param isoDate - Data în format ISO
   * @returns Data în format românesc sau null dacă formatul este invalid
   */
  const convertISOToRomanianDate = useCallback((isoDate: string): string | null => {
    if (!isValidDateFormat(isoDate)) return null;
    
    const [year, month, day] = isoDate.split('-');
    return `${parseInt(day, 10)}/${parseInt(month, 10)}/${year}`;
  }, [isValidDateFormat]);

  /**
   * Calculează soldul de la sfârșitul unei luni pentru un cont
   * 
   * @param year - Anul lunii
   * @param month - Luna (1-12)
   * @param accountId - ID-ul contului
   * @param monthTransactions - Tranzacțiile din luna respectivă
   * @returns Soldul final din luna respectivă
   */
  const calculateMonthEndBalance = useCallback(
    (year: number, month: number, accountId: string, monthTransactions: TransactionValidated[]): number => {
      const account = getAccountById(accountId);
      if (!account) {
        console.warn(`Contul ${accountId} nu a fost găsit pentru calculul soldului lunar`);
        return 0;
      }

      let balance = account.initialBalance;
      
      // Aplică toate tranzacțiile din luna respectivă
      for (const transaction of monthTransactions) {
        const impact = calculateTransactionImpact(transaction);
        balance += impact.availableImpact;
      }

      return balance;
    },
    [getAccountById]
  );

  /**
   * Obține soldul de transfer de la luna anterioară
   * 
   * @param accountId - ID-ul contului pentru care se calculează transferul
   * @returns Soldul de la sfârșitul lunii anterioare
   * 
   * @example
   * ```typescript
   * const previousBalance = getPreviousMonthEndBalance('main-account');
   * // Returnează soldul din 31 Decembrie 2024 pentru Ianuarie 2025
   * ```
   */
  const getPreviousMonthEndBalance = useCallback(
    (accountId: string): number => {
      if (!enableMonthlyTransfers) {
        const account = getAccountById(accountId);
        return account?.initialBalance || 0;
      }

      // Cache key pentru soldul lunii anterioare
      const cacheKey = `month-end-${prevYear}-${prevMonth}-${accountId}`;
      const cached = cache.get(cacheKey);
      if (cached && Date.now() - cached.timestamp < cacheTimeout * 2) { // Cache mai lung pentru luni anterioare
        return cached.data;
      }

      const endBalance = calculateMonthEndBalance(prevYear, prevMonth, accountId, prevMonthTransactions);
      
      // Cache rezultatul
      setCache(prev => new Map(prev).set(cacheKey, { data: endBalance, timestamp: Date.now() }));
      
      return endBalance;
    },
    [enableMonthlyTransfers, getAccountById, prevYear, prevMonth, prevMonthTransactions, cache, cacheTimeout, calculateMonthEndBalance]
  );

  /**
   * Calculează impactul financiar al unei tranzacții asupra soldurilor
   * Reutilizează logica din financialCalculation.service.ts
   * 
   * @param transaction - Tranzacția pentru care se calculează impactul
   * @returns Obiect cu impactul asupra disponibil, economii și total
   * 
   * @example
   * ```typescript
   * const impact = calculateTransactionImpact({
   *   type: TransactionType.INCOME,
   *   amount: 1000
   * });
   * // { availableImpact: 1000, savingsImpact: 0, totalImpact: 1000 }
   * ```
   */
  const calculateTransactionImpact = useCallback((transaction: TransactionValidated) => {
    const amount = Number(transaction.amount);
    
    if (isNaN(amount)) {
      console.warn(`Suma tranzacției '${transaction.amount}' nu este un număr valid`);
      return { availableImpact: 0, savingsImpact: 0, totalImpact: 0 };
    }

    switch (transaction.type) {
      case TransactionType.INCOME:
        return {
          availableImpact: amount,
          savingsImpact: 0,
          totalImpact: amount,
        };
      case TransactionType.EXPENSE:
        return {
          availableImpact: -amount,
          savingsImpact: 0,
          totalImpact: -amount,
        };
      case TransactionType.SAVING:
        return {
          availableImpact: -amount, // Reduce available money
          savingsImpact: amount,    // Increase savings
          totalImpact: 0,           // Net worth unchanged
        };
      default:
        console.warn(`Tip de tranzacție necunoscut: ${transaction.type}`);
        return {
          availableImpact: 0,
          savingsImpact: 0,
          totalImpact: 0,
        };
    }
  }, []);

  /**
   * Calculează soldul zilnic pentru o dată specifică
   * Suportă atât single account cât și multi-account
   * 
   * @param date - Data în format românesc (DD/MM/YYYY sau DD.MM.YYYY) sau ISO (YYYY-MM-DD)
   * @param accountId - ID-ul contului (opțional, folosește contul implicit)
   * @returns Obiectul DailyBalance sau null în caz de eroare
   * 
   * @throws {BalanceCalculationError} Când contul nu există sau data este invalidă
   * 
   * @example
   * ```typescript
   * const balance = calculateDailyBalance('15/06/2025');
   * if (balance) {
   *   console.log(`Sold total: ${balance.totalBalance} RON`);
   *   console.log(`Disponibil: ${balance.availableBalance} RON`);
   * }
   * ```
   */
  const calculateDailyBalance = useCallback(
    (date: string, accountId?: string): DailyBalance | null => {
      try {
        setError(null);
        
        // Convertește data din format românesc la ISO dacă este necesar
        let isoDate = date;
        if (isValidRomanianDateFormat(date)) {
          const converted = convertRomanianToISODate(date);
          if (!converted) {
            throw new BalanceCalculationError(
              `Nu s-a putut converti data '${date}' din format românesc.`,
              'INVALID_DATE'
            );
          }
          isoDate = converted;
        } else if (!isValidDateFormat(date)) {
          throw new BalanceCalculationError(
            `Formatul datei '${date}' nu este valid. Folosiți DD/MM/YYYY, DD.MM.YYYY sau YYYY-MM-DD.`,
            'INVALID_DATE'
          );
        }
        
        const targetAccountId = accountId || activeAccountId;
        if (!targetAccountId) {
          throw new BalanceCalculationError(
            'Nu există cont activ pentru calcul',
            'ACCOUNT_NOT_FOUND'
          );
        }

        const account = getAccountById(targetAccountId);
        if (!account) {
          throw new BalanceCalculationError(
            `Contul ${targetAccountId} nu a fost găsit`,
            'ACCOUNT_NOT_FOUND'
          );
        }

        if (!account.isActive) {
          throw new BalanceCalculationError(
            `Contul ${targetAccountId} nu este activ`,
            'ACCOUNT_NOT_FOUND'
          );
        }

        // Cache key pentru optimizare (folosește data ISO)
        const cacheKey = `daily-${isoDate}-${targetAccountId}`;
        const cached = cache.get(cacheKey);
        if (cached && Date.now() - cached.timestamp < cacheTimeout) {
          return cached.data;
        }

        // Verificare disponibilitate date
        if (!transactions || transactions.length === 0) {
          console.warn(`Nu există tranzacții disponibile pentru ${year}-${month}`);
        }

        // Filtrează tranzacțiile pentru data și contul specificat (folosește data ISO)
        const dayTransactions = transactions.filter((t: TransactionValidated) => {
          const transactionDate = t.date.split('T')[0];
          return transactionDate === isoDate;
          // Nu verificăm accountId pentru că TransactionValidated nu are acest câmp
        });

        // Calculează tranzacțiile anterioare pentru sold cumulat (folosește data ISO)
        const previousTransactions = transactions.filter((t: TransactionValidated) => {
          const transactionDate = t.date.split('T')[0];
          return transactionDate < isoDate;
          // Nu verificăm accountId pentru că TransactionValidated nu are acest câmp
        });

        // Determină soldul de pornire
        let startingBalance: number;
        if (enableMonthlyTransfers && isoDate.startsWith(`${year}-${month.toString().padStart(2, '0')}`)) {
          // Pentru zilele din luna curentă, folosește soldul de la sfârșitul lunii anterioare
          startingBalance = getPreviousMonthEndBalance(targetAccountId);
        } else {
          // Pentru alte cazuri, folosește soldul inițial al contului
          startingBalance = account.initialBalance;
        }

        // Calculează soldurile
        let availableBalance = startingBalance;
        let savingsBalance = 0;
        let dailyIncome = 0;
        let dailyExpenses = 0;
        let dailySavings = 0;
        let dailyInvestments = 0;

        // Aplică tranzacțiile anterioare
        for (const transaction of previousTransactions) {
          const impact = calculateTransactionImpact(transaction);
          availableBalance += impact.availableImpact;
          savingsBalance += impact.savingsImpact;
        }

        // Aplică tranzacțiile zilei curente
        for (const transaction of dayTransactions) {
          const impact = calculateTransactionImpact(transaction);
          availableBalance += impact.availableImpact;
          savingsBalance += impact.savingsImpact;

          // Calculează breakdown-ul zilnic
          switch (transaction.type) {
            case TransactionType.INCOME:
              dailyIncome += Number(transaction.amount);
              break;
            case TransactionType.EXPENSE:
              dailyExpenses += Number(transaction.amount);
              break;
            case TransactionType.SAVING:
              if (transaction.subcategory?.toLowerCase().includes('investiție')) {
                dailyInvestments += Number(transaction.amount);
              } else {
                dailySavings += Number(transaction.amount);
              }
              break;
          }
        }

        const totalBalance = availableBalance + savingsBalance;
        const isNegative = availableBalance < 0;

        const result: DailyBalance = {
          date: convertISOToRomanianDate(isoDate) || isoDate, // Returnează în format românesc
          availableBalance,
          savingsBalance,
          totalBalance,
          isNegative,
          breakdown: {
            dailyIncome,
            dailyExpenses,
            dailySavings,
            dailyInvestments,
          },
          transactions: dayTransactions as Transaction[], // Cast pentru compatibilitate cu interfața
        };

        // Adaugă suport multi-account dacă este activat
        if (enableMultiAccount) {
          result.accountBalances = getAllAccountsBalance(date);
        }

        // Cache rezultatul
        setCache(prev => new Map(prev).set(cacheKey, { data: result, timestamp: Date.now() }));

        return result;
      } catch (err) {
        const error = err instanceof BalanceCalculationError 
          ? err 
          : new BalanceCalculationError(`Eroare la calculul soldului zilnic: ${err}`, 'CALCULATION_ERROR');
        setError(error);
        return null;
      }
    },
    [
      activeAccountId,
      accounts,
      transactions,
      enableMultiAccount,
      enableMonthlyTransfers,
      cache,
      cacheTimeout,
      getAccountById,
      calculateTransactionImpact,
      getPreviousMonthEndBalance,
      year,
      month,
      isValidDateFormat,
      isValidRomanianDateFormat,
      convertRomanianToISODate,
      convertISOToRomanianDate,
    ]
  );

  /**
   * Obține configurația de transfer pentru o lună
   * 
   * @param accountId - ID-ul contului
   * @returns Configurația de transfer cu soldurile relevante
   */
  const getMonthlyTransferConfig = useCallback(
    (accountId: string): MonthlyTransferConfig => {
      const previousMonthEndBalance = getPreviousMonthEndBalance(accountId);
      const account = getAccountById(accountId);
      const currentMonthStartBalance = account?.initialBalance || 0;
      
      return {
        previousMonthEndBalance,
        currentMonthStartBalance,
        transferDate: `${year}-${month.toString().padStart(2, '0')}-01`,
        accountId,
      };
    },
    [getPreviousMonthEndBalance, getAccountById, year, month]
  );

  /**
   * Calculează soldurile pentru o lună întreagă
   * 
   * @param month - Luna în format MM (ex: "06")
   * @param year - Anul în format YYYY (ex: "2025")  
   * @param accountId - ID-ul contului (opțional)
   * @returns Array cu soldurile zilnice pentru toată luna
   * 
   * @example
   * ```typescript
   * const monthlyBalances = calculateMonthlyBalance('06', '2025');
   * console.log(`Luna are ${monthlyBalances.length} zile`);
   * ```
   */
  const calculateMonthlyBalance = useCallback(
    (month: string, year: string, accountId?: string): DailyBalance[] => {
      try {
        setError(null);
        setIsLoading(true);

        const monthNum = parseInt(month, 10);
        const yearNum = parseInt(year, 10);
        
        if (isNaN(monthNum) || monthNum < 1 || monthNum > 12) {
          throw new BalanceCalculationError(
            `Luna '${month}' nu este validă. Folosiți format MM (01-12).`,
            'INVALID_DATE'
          );
        }
        
        if (isNaN(yearNum) || yearNum < 1900 || yearNum > 2100) {
          throw new BalanceCalculationError(
            `Anul '${year}' nu este valid. Folosiți format YYYY (1900-2100).`,
            'INVALID_DATE'
          );
        }
        
        const daysInMonth = new Date(yearNum, monthNum, 0).getDate();
        const results: DailyBalance[] = [];

        for (let day = 1; day <= daysInMonth; day++) {
          const date = `${year}-${month.padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
          const dailyBalance = calculateDailyBalance(date, accountId);
          
          if (dailyBalance) {
            results.push(dailyBalance);
          }
        }

        return results;
      } catch (err) {
        const error = err instanceof BalanceCalculationError 
          ? err 
          : new BalanceCalculationError(`Eroare la calculul soldurilor lunare: ${err}`, 'CALCULATION_ERROR');
        setError(error);
        return [];
      } finally {
        setIsLoading(false);
      }
    },
    [calculateDailyBalance]
  );

  /**
   * Obține soldul pentru un cont specific la o dată
   * 
   * @param accountId - ID-ul contului pentru care se calculează soldul
   * @param date - Data în format românesc (DD/MM/YYYY sau DD.MM.YYYY) sau ISO (YYYY-MM-DD)
   * @returns Obiectul AccountDailyBalance sau null dacă contul nu există
   * 
   * @example
   * ```typescript
   * const accountBalance = getAccountBalance('savings-account', '15/06/2025');
   * if (accountBalance) {
   *   console.log(`Sold ${accountBalance.accountName}: ${accountBalance.balance} RON`);
   * }
   * ```
   */
  const getAccountBalance = useCallback(
    (accountId: string, date: string): AccountDailyBalance | null => {
      const account = getAccountById(accountId);
      if (!account) {
        console.warn(`Contul ${accountId} nu a fost găsit pentru calculul soldului zilnic`);
        return null;
      }

      if (!account.isActive) {
        console.warn(`Contul ${accountId} nu este activ`);
        return null;
      }

      // Validare format dată (acceptă atât format românesc cât și ISO)
      if (!isValidRomanianDateFormat(date) && !isValidDateFormat(date)) {
        console.error(`Formatul datei '${date}' nu este valid pentru getAccountBalance`);
        return null;
      }

      const dailyBalance = calculateDailyBalance(date, accountId);
      if (!dailyBalance) return null;

      return {
        accountId,
        accountName: account.accountName,
        balance: dailyBalance.totalBalance,
        availableBalance: dailyBalance.availableBalance,
        savingsBalance: dailyBalance.savingsBalance,
        isNegative: dailyBalance.isNegative,
      };
    },
    [getAccountById, calculateDailyBalance, isValidRomanianDateFormat, isValidDateFormat]
  );

  /**
   * Obține soldurile pentru toate conturile active la o dată
   * 
   * @param date - Data în format românesc (DD/MM/YYYY sau DD.MM.YYYY) sau ISO (YYYY-MM-DD)
   * @returns Array cu soldurile pentru toate conturile active
   * 
   * @example
   * ```typescript
   * const allBalances = getAllAccountsBalance('15/06/2025');
   * allBalances.forEach(account => {
   *   console.log(`${account.accountName}: ${account.balance} RON`);
   * });
   * ```
   */
  const getAllAccountsBalance = useCallback(
    (date: string): AccountDailyBalance[] => {
      // Validare format dată (acceptă atât format românesc cât și ISO)
      if (!isValidRomanianDateFormat(date) && !isValidDateFormat(date)) {
        console.error(`Formatul datei '${date}' nu este valid pentru getAllAccountsBalance`);
        return [];
      }

      const activeAccounts = accounts.filter(acc => acc.isActive);
      if (activeAccounts.length === 0) {
        console.warn('Nu există conturi active pentru calculul soldurilor');
        return [];
      }

      return activeAccounts
        .map(account => getAccountBalance(account.accountId, date))
        .filter((balance): balance is AccountDailyBalance => balance !== null);
    },
    [accounts, getAccountBalance, isValidRomanianDateFormat, isValidDateFormat]
  );

  /**
   * Verifică dacă un sold este negativ
   * 
   * @param balance - Obiectul DailyBalance de verificat
   * @returns true dacă soldul disponibil este negativ
   * 
   * @example
   * ```typescript
   * const balance = calculateDailyBalance('2025-06-15');
   * if (balance && isBalanceNegative(balance)) {
   *   console.log('Atenție: Sold negativ!');
   * }
   * ```
   */
  const isBalanceNegative = useCallback((balance: DailyBalance): boolean => {
    if (!balance) {
      console.warn('Obiectul balance este null sau undefined');
      return false;
    }
    return balance.isNegative || balance.availableBalance < 0;
  }, []);

  /**
   * Calculează proiecția soldurilor pentru o perioadă
   * 
   * @param fromDate - Data de început în format românesc (DD/MM/YYYY sau DD.MM.YYYY) sau ISO (YYYY-MM-DD)
   * @param toDate - Data de sfârșit în format românesc (DD/MM/YYYY sau DD.MM.YYYY) sau ISO (YYYY-MM-DD)
   * @param accountId - ID-ul contului (opțional)
   * @returns Array cu proiecția soldurilor zilnice pentru perioada specificată
   * 
   * @example
   * ```typescript
   * const projection = getBalanceProjection('01/06/2025', '30/06/2025');
   * console.log(`Proiecție pentru ${projection.length} zile`);
   * ```
   */
  const getBalanceProjection = useCallback(
    (fromDate: string, toDate: string, accountId?: string): DailyBalance[] => {
      // Convertește datele la format ISO pentru procesare internă
      let isoFromDate = fromDate;
      let isoToDate = toDate;

      if (isValidRomanianDateFormat(fromDate)) {
        const converted = convertRomanianToISODate(fromDate);
        if (!converted) {
          console.error(`Data de început '${fromDate}' nu poate fi convertită din format românesc`);
          return [];
        }
        isoFromDate = converted;
      } else if (!isValidDateFormat(fromDate)) {
        console.error(`Data de început '${fromDate}' nu este validă`);
        return [];
      }

      if (isValidRomanianDateFormat(toDate)) {
        const converted = convertRomanianToISODate(toDate);
        if (!converted) {
          console.error(`Data de sfârșit '${toDate}' nu poate fi convertită din format românesc`);
          return [];
        }
        isoToDate = converted;
      } else if (!isValidDateFormat(toDate)) {
        console.error(`Data de sfârșit '${toDate}' nu este validă`);
        return [];
      }

      const results: DailyBalance[] = [];
      const startDate = new Date(isoFromDate);
      const endDate = new Date(isoToDate);
      
      if (startDate > endDate) {
        console.error('Data de început nu poate fi mai mare decât data de sfârșit');
        return [];
      }

      // Limitare pentru a evita calculele pentru perioade foarte lungi
      const daysDifference = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
      if (daysDifference > 365) {
        console.warn(`Perioada de proiecție (${daysDifference} zile) este foarte lungă și poate afecta performanța`);
      }

      for (let date = new Date(startDate); date <= endDate; date.setDate(date.getDate() + 1)) {
        const dateStr = date.toISOString().split('T')[0];
        const dailyBalance = calculateDailyBalance(dateStr, accountId);
        
        if (dailyBalance) {
          results.push(dailyBalance);
        }
      }

      return results;
    },
    [calculateDailyBalance, isValidRomanianDateFormat, isValidDateFormat, convertRomanianToISODate]
  );

  /**
   * Invalidează cache-ul pentru o perioadă specificată
   * 
   * @param dateRange - Perioada pentru care să se invalideze cache-ul (opțional)
   * @param dateRange.start - Data de început în format românesc (DD/MM/YYYY sau DD.MM.YYYY) sau ISO (YYYY-MM-DD)
   * @param dateRange.end - Data de sfârșit în format românesc (DD/MM/YYYY sau DD.MM.YYYY) sau ISO (YYYY-MM-DD)
   * 
   * @example
   * ```typescript
   * // Invalidează tot cache-ul
   * invalidateCache();
   * 
   * // Invalidează doar pentru o perioadă în format românesc
   * invalidateCache({ start: '01/06/2025', end: '30/06/2025' });
   * ```
   */
  const invalidateCache = useCallback((dateRange?: { start: string; end: string }) => {
    if (dateRange) {
      // Convertește datele la format ISO pentru comparație
      let isoStartDate = dateRange.start;
      let isoEndDate = dateRange.end;

      if (isValidRomanianDateFormat(dateRange.start)) {
        const converted = convertRomanianToISODate(dateRange.start);
        if (!converted) {
          console.error('Data de început pentru invalidare cache nu poate fi convertită din format românesc');
          return;
        }
        isoStartDate = converted;
      } else if (!isValidDateFormat(dateRange.start)) {
        console.error('Perioada de invalidare cache conține data de început cu format invalid');
        return;
      }

      if (isValidRomanianDateFormat(dateRange.end)) {
        const converted = convertRomanianToISODate(dateRange.end);
        if (!converted) {
          console.error('Data de sfârșit pentru invalidare cache nu poate fi convertită din format românesc');
          return;
        }
        isoEndDate = converted;
      } else if (!isValidDateFormat(dateRange.end)) {
        console.error('Perioada de invalidare cache conține data de sfârșit cu format invalid');
        return;
      }

      // Invalidează doar pentru perioada specificată
      const newCache = new Map(cache);
      let deletedCount = 0;
      for (const [key] of newCache) {
        if (key.includes('daily-') || key.includes('month-end-')) {
          const dateFromKey = key.split('-')[1];
          if (dateFromKey >= isoStartDate && dateFromKey <= isoEndDate) {
            newCache.delete(key);
            deletedCount++;
          }
        }
      }
      setCache(newCache);
      console.debug(`Invalidat cache pentru ${deletedCount} intrări în perioada ${dateRange.start} - ${dateRange.end}`);
    } else {
      // Invalidează tot cache-ul
      const currentSize = cache.size;
      setCache(new Map());
      console.debug(`Invalidat complet cache-ul (${currentSize} intrări)`);
    }
  }, [cache, isValidRomanianDateFormat, isValidDateFormat, convertRomanianToISODate]);

  /**
   * Reîmprospătează toate soldurile
   * 
   * @returns Promise care se rezolvă când refresh-ul este complet
   * 
   * @example
   * ```typescript
   * await refreshBalances();
   * console.log('Soldurile au fost reîmprospătate');
   * ```
   */
  const refreshBalances = useCallback(async () => {
    setIsLoading(true);
    try {
      invalidateCache();
      // Trigger recalculation prin accesarea soldului curent
      const today = new Date().toISOString().split('T')[0];
      calculateDailyBalance(today);
      console.debug('Soldurile au fost reîmprospătate cu succes');
    } catch (err) {
      console.error('Eroare la reîmprospătarea soldurilor:', err);
      setError(new BalanceCalculationError(
        `Eroare la reîmprospătarea soldurilor: ${err}`,
        'CALCULATION_ERROR'
      ));
    } finally {
      setIsLoading(false);
    }
  }, [invalidateCache, calculateDailyBalance]);

  // Combină loading states și errors
  const combinedLoading = isLoading || transactionsLoading || prevTransactionsLoading;
  const combinedError = error || transactionsError;

  return {
    calculateDailyBalance,
    calculateMonthlyBalance,
    isLoading: combinedLoading,
    error: combinedError,
    invalidateCache,
    refreshBalances,
    getAccountBalance,
    getAllAccountsBalance,
    isBalanceNegative,
    getBalanceProjection,
  };
}; 
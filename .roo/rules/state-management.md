---
description: 
globs: frontend/src/stores/**
alwaysApply: false
---

<structure>
- Organizați store-urile Zustand pe domenii funcționale (ex: transactions, authentication)
- Structurați fiecare store în secțiuni clare:
  1. State (date principale)
  2. UI state (loading, error, etc.)
  3. Setters (funcții pure de actualizare state)
  4. Actions (operațiuni complexe/asincrone)
  5. Selectors (calcule derivate)
  6. Reset (resetare la starea inițială)
- Exportați hook-ul principal din store:
</structure>
<anti_patterns>

[CRITIC] NU folosiți useEffect(fetch, [queryParams]) dacă fetch-ul modifică parametrii
NU modificați state direct în componente; folosiți acțiunile definite în store
NU creați dependențe circulare între store-uri
NU aplicați logic de business în componente; mutați-o în store-uri sau servicii
NU stocați date derivabile în state; folosiți selectors
typescript// ❌ GREȘIT - Cauzează bucle infinite
useEffect(() => {
  store.fetchTransactions(filter);
}, [filter]);
// ✅ CORECT - Setare state apoi fetch explicit
const handleFilterChange = (newFilter) => {
  setFilter(newFilter);
  store.fetchTransactions(newFilter);
};
Evitare comunicare între componente:
-NU folosi polling cu interval-uri pentru sincronizare între stores
-NU folosi localStorage pentru comunicare între componente/stores
-NU utiliza event-emitteri custom pentru propagare modificări
-Preferă surse unice de adevăr (store-uri Zustand) cu sincronizare explicită
</anti_patterns>
<caching>
- Implementați caching pentru date frecvent accesate
- Folosiți TTL (time-to-live) pentru cache-uri
- Invalidați cache-ul selectiv după operații mutative
- Folosiți structuri de date optimizate pentru lookup
typescript// Exemplu de cache cu TTL și invalidare selectivă
const CACHE_TTL = 15 * 60 * 1000; // 15 minute
// În store:
_cache: {} as Record<string, { data: any, timestamp: number }>,
_getCached: (key: string) => {
  const cached = get()._cache[key];
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data;
  }
  return null;
},
_invalidateCache: (key?: string) => {
  if (key) {
    // Invalidare selectivă
    const cache = { ...get()._cache };
    delete cache[key];
    set({ _cache: cache });
  } else {
    // Invalidare completă
    set({ _cache: {} });
  }
}
</caching>
<selectors>
- Folosiți selectors pentru derivarea datelor din state
- Memoizați selectors pentru operații costisitoare
- Testați selectors separat de restul store-ului
- Selectors trebuie să fie funcții pure
typescript// Selector simplu
getTotalAmount: () => get().transactions.reduce((sum, t) => sum + t.amount, 0),
// Selector memoizat pentru operații costisitoare
getTransactionsByCategory: () => {
  const { transactions } = get();
  return useMemo(() => {
    return transactions.reduce((acc, transaction) => {
      const { category } = transaction;
      if (!acc[category]) acc[category] = [];
      acc[category].push(transaction);
      return acc;
    }, {} as Record<string, Transaction[]>);
  }, [transactions]);
}
</selectors>
<async_pattern>
Folosiți pattern consecvent pentru operații asincrone:
Set loading state
Try-catch pentru operațiunea async
Update state cu rezultat sau error
Reset loading state
Invalidați cache-ul după operații de scriere
typescriptsaveTransaction: async (data: TransactionFormData) => {
  set({ loading: true, error: null });
  try {
    const result = await service.createTransaction(data);
    set((state) => ({ 
      transactions: [...state.transactions, result],
      loading: false 
    }));
    return result;
  } catch (err) {
    set({ error: MESAJE.EROARE_SALVARE, loading: false });
    throw err;
  }
}
</async_pattern>
<supabase>
Pattern selectInsertUpdate pentru upsert problematic:
-Verifică schema și constrângerile Supabase înainte de implementare
-Pentru jsonb, transmite direct obiectul (fără JSON.stringify)
-Când upsert eșuează, folosește pattern select-then-insert/update</supabase>
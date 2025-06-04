# useBalanceCalculator Hook

Hook React pentru calcularea soldurilor zilnice și lunare cu suport pentru multiple conturi și transferuri între luni.

## Caracteristici Principale

- ✅ **Calculul soldurilor zilnice și lunare** cu logică financiară precisă
- ✅ **Format de dată românesc** - acceptă DD/MM/YYYY sau DD.MM.YYYY
- ✅ **Suport multi-account** (pregătit pentru activare)
- ✅ **Transferuri între luni** pentru continuitate financiară
- ✅ **Cache inteligent** cu TTL pentru optimizare performance
- ✅ **Error handling robust** cu tipuri specifice de erori
- ✅ **TypeScript strict mode** pentru siguranță tipurilor
- ✅ **Integrare seamless** cu SettingsStore și useMonthlyTransactions

## Instalare și Import

```typescript
import { useBalanceCalculator } from './hooks/balanceCalculator/useBalanceCalculator';
import type { 
  DailyBalance, 
  AccountDailyBalance, 
  UseBalanceCalculatorConfig 
} from './hooks/balanceCalculator/useBalanceCalculator.types';
```

## Utilizare de Bază

### Calculul Soldului Zilnic

```typescript
const { calculateDailyBalance, isLoading } = useBalanceCalculator(2025, 6, {
  enableMonthlyTransfers: true,
  cacheTimeout: 30000
});

// Format românesc cu slash
const balance = calculateDailyBalance('15/06/2025');

// Format românesc cu punct
const balance2 = calculateDailyBalance('15.06.2025');

// Format ISO (pentru compatibilitate)
const balance3 = calculateDailyBalance('2025-06-15');

if (balance) {
  console.log(`Data: ${balance.date}`); // Output: "15/6/2025"
  console.log(`Sold disponibil: ${balance.availableBalance} RON`);
  console.log(`Sold economii: ${balance.savingsBalance} RON`);
  console.log(`Sold total: ${balance.totalBalance} RON`);
  console.log(`Deficit: ${balance.isNegative ? 'DA' : 'NU'}`);
}
```

### Calculul Soldurilor Lunare

```typescript
const monthlyBalances = calculateMonthlyBalance('06', '2025', 'main-account');

monthlyBalances.forEach(dayBalance => {
  console.log(`${dayBalance.date}: ${dayBalance.totalBalance} RON`);
  // Output: "1/6/2025: 1500 RON", "2/6/2025: 1450 RON", etc.
});
```

### Proiecții Financiare

```typescript
const projection = getBalanceProjection('01/06/2025', '30/06/2025');

console.log(`Proiecție pentru ${projection.length} zile`);
projection.forEach(day => {
  if (day.isNegative) {
    console.warn(`Atenție: Sold negativ pe ${day.date}!`);
  }
});
```

## Formatele de Dată Acceptate

Hook-ul acceptă următoarele formate de dată:

1. **Format românesc cu slash**: `15/06/2025`, `1/6/2025`
2. **Format românesc cu punct**: `15.06.2025`, `1.6.2025`  
3. **Format ISO (pentru compatibilitate)**: `2025-06-15`

**Output:** Toate datele returnate sunt în format românesc `DD/M/YYYY` (fără zerouri în față).

## Configurare Opțională

```typescript
const config: UseBalanceCalculatorConfig = {
  enableMultiAccount: false, // Suport pentru multiple conturi
  enableMonthlyTransfers: true, // Transfer solduri între luni
  cacheTimeout: 30000, // Cache 30 secunde
  defaultAccountId: 'main-account', // Contul implicit
  enableProjections: true // Activează proiecțiile
};

const hook = useBalanceCalculator(2025, 6, config);
```

## Suport Multi-Account

```typescript
// Pentru un cont specific
const accountBalance = getAccountBalance('savings-account', '15/06/2025');
if (accountBalance) {
  console.log(`${accountBalance.accountName}: ${accountBalance.balance} RON`);
}

// Pentru toate conturile active
const allBalances = getAllAccountsBalance('15/06/2025');
allBalances.forEach(account => {
  console.log(`${account.accountName}: ${account.balance} RON`);
});
```

## Cache Management

```typescript
// Invalidează cache-ul complet
invalidateCache();

// Invalidează doar pentru o perioadă (format românesc)
invalidateCache({ 
  start: '01/06/2025', 
  end: '30/06/2025' 
});

// Reîmprospătează toate soldurile
await refreshBalances();
```

## Error Handling

```typescript
const { calculateDailyBalance, error } = useBalanceCalculator(2025, 6);

try {
  const balance = calculateDailyBalance('15/13/2025'); // Lună invalidă
} catch (err) {
  if (err instanceof BalanceCalculationError) {
    console.error(`Cod eroare: ${err.code}`);
    console.error(`Mesaj: ${err.message}`);
  }
}

// Verificare stare error
if (error) {
  console.error('Eroare în hook:', error.message);
}
```

## Exemple de Validare

```typescript
// ✅ Date valide
calculateDailyBalance('15/06/2025'); // Format românesc cu slash
calculateDailyBalance('15.06.2025'); // Format românesc cu punct
calculateDailyBalance('1/6/2025');   // Fără zerouri în față
calculateDailyBalance('2025-06-15'); // Format ISO

// ❌ Date invalide
calculateDailyBalance('2025/06/15'); // Format mixat
calculateDailyBalance('15-06-2025'); // Format mixat
calculateDailyBalance('32/06/2025'); // Zi invalidă
calculateDailyBalance('15/13/2025'); // Lună invalidă
```

## Tipuri de Erori

- `INVALID_DATE`: Format de dată incorect
- `ACCOUNT_NOT_FOUND`: Contul nu există sau nu este activ
- `MISSING_DATA`: Date insuficiente pentru calcul
- `CALCULATION_ERROR`: Eroare generală de calcul

## Performance și Optimizări

- **Cache automat**: Rezultatele sunt cache-uite pentru 30 secunde (configurabil)
- **Lazy loading**: Calculele se fac doar când sunt solicitate
- **Batch processing**: Calculele lunare sunt optimizate pentru perioade mari
- **Memory management**: Cache-ul se curăță automat pentru a preveni memory leaks

## Integrări

Hook-ul se integrează cu:
- `useSettingsStore` pentru configurarea conturilor
- `useMonthlyTransactions` pentru obținerea datelor
- `@shared-constants` pentru tipurile de tranzacții
- `BalanceCalculationError` pentru error handling

## Exemple Avansate

### Analiza Săptămânală

```typescript
const weeklyAnalysis = getBalanceProjection('01/06/2025', '07/06/2025')
  .map(day => ({
    date: day.date,
    income: day.breakdown.dailyIncome,
    expenses: day.breakdown.dailyExpenses,
    savings: day.breakdown.dailySavings,
    netChange: day.breakdown.dailyIncome - day.breakdown.dailyExpenses
  }));

console.log('Analiza săptămânală:', weeklyAnalysis);
```

### Detectarea Soldurilor Negative

```typescript
const monthlyBalances = calculateMonthlyBalance('06', '2025');
const negativeDays = monthlyBalances.filter(day => isBalanceNegative(day));

if (negativeDays.length > 0) {
  console.warn(`Atenție: ${negativeDays.length} zile cu sold negativ!`);
  negativeDays.forEach(day => {
    console.warn(`${day.date}: ${day.availableBalance} RON`);
  });
}
```

### Sumarizare Lunară

```typescript
const monthlyBalances = calculateMonthlyBalance('06', '2025');
const summary = monthlyBalances.reduce((acc, day) => ({
  totalIncome: acc.totalIncome + day.breakdown.dailyIncome,
  totalExpenses: acc.totalExpenses + day.breakdown.dailyExpenses,
  totalSavings: acc.totalSavings + day.breakdown.dailySavings,
  averageBalance: acc.averageBalance + day.totalBalance / monthlyBalances.length
}), { totalIncome: 0, totalExpenses: 0, totalSavings: 0, averageBalance: 0 });

console.log('Sumarizare lunară:', summary);
``` 
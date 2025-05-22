# Ghid de Stil BudgetApp

## Principii Generale

1. **Consistență**: Utilizează aceleași patternuri și convenții în tot codul.
2. **Claritate**: Cod auto-documentat, cu nume descriptive pentru variabile și funcții.
3. **Modularitate**: Componente mici, cu responsabilități clare și specifice.
4. **Reutilizare**: Preferă abstractizarea și reutilizarea codului.
5. **Tipizare Strictă**: Folosește TypeScript cu tipizare explicită.

## Convenții de Denumire

### Fișiere și Directoare
- **Componente React**: PascalCase (ex: `Button.tsx`, `TransactionForm.tsx`)
- **Utilitare/Hooks**: camelCase (ex: `formatDate.ts`, `useTransactionManager.ts`)
- **Teste**: Denumire similară cu fișierul testat + `.test.tsx` (ex: `Button.test.tsx`)
- **Stylesheets**: Același nume ca și componenta (ex: `Button.module.css`)

### Variabile și Funcții
- **Constante globale**: SCREAMING_SNAKE_CASE (ex: `MAX_ITEMS`, `DEFAULT_CURRENCY`)
- **Variabile**: camelCase (ex: `transactionList`, `isLoading`)
- **Funcții**: camelCase, verbe (ex: `formatCurrency()`, `handleSubmit()`)
- **Hooks**: prefix 'use' + camelCase (ex: `useTransactionStore`, `useFormValidation`)

### Componente și Tipuri
- **Componente React**: PascalCase (ex: `Button`, `TransactionTable`)
- **Interfețe/Tipuri**: PascalCase, substantive (ex: `Transaction`, `UserState`)
- **Enums**: PascalCase (ex: `TransactionType`, `Currency`)
- **Props**: interfețe cu sufixul 'Props' (ex: `ButtonProps`, `FormProps`)

## Formatare Cod

### Indentare și Spații
- Indentare: 2 spații
- Spații după cuvinte cheie (`if`, `for`, `while`, etc.)
- Spații între operatori (`=`, `+`, `-`, etc.)
- Maximum 100 caractere per linie

### Blocuri de Cod
```typescript
// Corect
if (condition) {
  doSomething();
}

// Incorect
if(condition){doSomething();}
```

### Import-uri
```typescript
// Grupate și ordonate:
// 1. Librării externe
import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';

// 2. Constante/shared
import { TRANSACTION_TYPES, MESSAGES } from '@shared-constants';

// 3. Componente și hooks
import { Button } from 'components/primitives';
import { useTransactionStore } from 'stores';

// 4. Utilitare și tipuri
import { formatCurrency } from 'utils';
import type { Transaction } from 'types';
```

## JSX și Componente

### Props și Destructuring
```typescript
// Destructuring props
const Button = ({ 
  label, 
  onClick, 
  variant = 'primary',
  disabled = false 
}: ButtonProps) => {
  // ...
};
```

### Condiții în JSX
```typescript
// Pentru condiții simple
{isLoading && <Loader />}

// Pentru condiții cu alternativă
{isLoading ? <Loader /> : <Content />}

// Pentru condiții complexe, extrageți într-o variabilă sau funcție
const renderContent = () => {
  if (isLoading) return <Loader />;
  if (error) return <ErrorMessage error={error} />;
  return <Content data={data} />;
};

return <div>{renderContent()}</div>;
```

### CSS și Stilizare
```typescript
// Folosește getEnhancedComponentClasses pentru toate componentele
const classes = getEnhancedComponentClasses({
  base: 'button',
  variants: {
    primary,
    secondary,
    large
  }
});

return <button className={classes}>{label}</button>;
```

## TypeScript

### Tipuri și Interfețe
```typescript
// Interfețe pentru obiecte cu structură clară
interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

// Tipuri pentru unions, intersections, mapped types
type ButtonVariant = 'primary' | 'secondary' | 'danger';
type FormState<T> = {
  data: T;
  errors: Record<keyof T, string | null>;
  isValid: boolean;
};
```

### Props Typing
```typescript
interface ButtonProps {
  label: string;
  onClick: () => void;
  variant?: ButtonVariant;
  disabled?: boolean;
  withIcon?: boolean;
  testId?: string;
}

const Button = ({ 
  label, 
  onClick, 
  variant = 'primary',
  disabled = false,
  withIcon = false,
  testId = 'button'
}: ButtonProps) => {
  // ...
};
```

## Comentarii și Documentație

### JSDoc pentru Funcții Exportate
```typescript
/**
 * Formatează o sumă monetară conform standardelor locale.
 * @param amount - Suma de formatat
 * @param currency - Codul valutei (implicit: RON)
 * @returns String formatat (ex: "123,45 RON")
 */
export function formatCurrency(amount: number, currency = 'RON'): string {
  // ...
}
```

### Comentarii Inline
```typescript
// Comentariile încep cu majusculă și se termină cu punct.
// Comentează doar logica complexă sau neobișnuită.

// Calcul factură cu taxe incluse și reducere aplicată.
const finalPrice = (basePrice * (1 + TAX_RATE)) * (1 - discount);
```

## Testare

### Denumire Teste
```typescript
describe('Button component', () => {
  it('renders correctly with default props', () => {
    // ...
  });

  it('applies the correct class for primary variant', () => {
    // ...
  });

  it('calls onClick handler when clicked', () => {
    // ...
  });
});
```

### Selectori în Teste
```typescript
// Utilizează întotdeauna data-testid pentru selecție
<button data-testid="submit-button">{label}</button>

// În teste
const button = screen.getByTestId('submit-button');
fireEvent.click(button);
```

## Zustand Store

### Structură și Convenții
```typescript
interface TransactionState {
  transactions: Transaction[];
  isLoading: boolean;
  error: Error | null;
  
  // Acțiuni
  fetchTransactions: () => Promise<void>;
  addTransaction: (transaction: Transaction) => Promise<void>;
  updateTransaction: (id: string, data: Partial<Transaction>) => Promise<void>;
  deleteTransaction: (id: string) => Promise<void>;
}

const useTransactionStore = create<TransactionState>((set, get) => ({
  transactions: [],
  isLoading: false,
  error: null,
  
  fetchTransactions: async () => {
    set({ isLoading: true, error: null });
    try {
      const data = await transactionService.getAll();
      set({ transactions: data, isLoading: false });
    } catch (error) {
      set({ error: error as Error, isLoading: false });
    }
  },
  
  // Alte acțiuni...
}));
``` 
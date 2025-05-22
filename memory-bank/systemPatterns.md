# Patternuri de Sistem BudgetApp

## Patternuri Arhitecturale

### 1. Monorepo cu Shared Constants
- **Descriere**: Arhitectură monorepo cu sursă unică de adevăr pentru constante.
- **Implementare**:
  ```
  /shared-constants/  <- Sursa originală
    /frontend/src/shared-constants/  <- Copie generată
  ```
- **Beneficii**: Eliminarea inconsistențelor, validare automată.

### 2. Feature-First Organization
- **Descriere**: Organizare pe feature-uri în loc de tipuri de fișiere.
- **Implementare**:
  ```
  /components/features/Auth/
  /components/features/TransactionTable/
  ```
- **Beneficii**: Coeziune mai mare, easier navigation.

### 3. Primitive vs Feature Components
- **Descriere**: Separare strictă între componente primitive (reutilizabile) și cele de feature.
- **Implementare**:
  ```
  /components/primitives/Button/
  /components/features/TransactionForm/
  ```
- **Beneficii**: Reutilizare, încapsulare, testare mai ușoară.

## Patternuri de State Management

### 1. Separation of Concerns in Stores
- **Descriere**: Store-uri Zustand specializate pe domenii de funcționalitate.
- **Implementare**:
  ```typescript
  // useAuthStore.ts
  // useTransactionStore.ts
  ```
- **Beneficii**: State izolat, optimizări de re-render.

### 2. React Query pentru Server State
- **Descriere**: Utilizarea React Query pentru tot state-ul derivat din server.
- **Implementare**:
  ```typescript
  const { data, isLoading } = useQuery(['transactions'], fetchTransactions);
  ```
- **Beneficii**: Caching, stale-while-revalidate, invalidare automată.

### 3. Custom Hook Composition
- **Descriere**: Compunere de hooks specializate pentru logica complexă.
- **Implementare**:
  ```typescript
  // De la simplu la complex
  useTransactionItem -> useTransactionList -> useTransactionManager
  ```
- **Beneficii**: Cod modular, testabil, cu responsabilități clare.

## Patternuri UI și Stilizare

### 1. Enhanced Component Classes
- **Descriere**: Abstractizare pentru clasele Tailwind prin getEnhancedComponentClasses.
- **Implementare**:
  ```typescript
  const classes = getEnhancedComponentClasses({
    base: 'btn',
    variants: { primary: true }
  });
  ```
- **Beneficii**: Eliminare clase hardcodate, consistență.

### 2. Prop-Based Visual Effects
- **Descriere**: Definirea efectelor vizuale ca props dedicate.
- **Implementare**:
  ```typescript
  <Button withShadow withGradient />
  ```
- **Beneficii**: API declarativ, consistență, componente curate.

### 3. ComponentMap pentru Definiții de Stil
- **Descriere**: Sistem centralizat pentru definirea stilurilor componentelor.
- **Implementare**:
  ```typescript
  // /styles/componentMap/button.ts
  export const buttonStyles = {
    base: 'px-4 py-2 rounded',
    variants: {
      primary: 'bg-blue-500 text-white',
      secondary: 'bg-gray-200 text-gray-800'
    }
  };
  ```
- **Beneficii**: Single source of truth pentru stiluri, evitarea duplicării.

## Patternuri de Performanță

### 1. Virtualized Lists
- **Descriere**: Virtualizare pentru liste lungi și grids.
- **Implementare**:
  ```typescript
  // LunarGrid cu TanStack Table + virtualizare
  ```
- **Beneficii**: Performanță pentru liste mari, UX îmbunătățit.

### 2. Selective Re-rendering
- **Descriere**: Memoizare selectivă pentru prevenirea re-render-urilor inutile.
- **Implementare**:
  ```typescript
  const memoizedValue = useMemo(() => expensiveCalculation(a, b), [a, b]);
  const MemoizedComponent = React.memo(MyComponent);
  ```
- **Beneficii**: Reducerea timpului de rendering pentru UI complex.

### 3. Optimistic Updates
- **Descriere**: Actualizări optimiste pentru acțiuni utilizator.
- **Implementare**:
  ```typescript
  // React Query mutations cu onMutate pentru optimistic updates
  ```
- **Beneficii**: UX îmbunătățit, aplicație mai responsivă.

## Patternuri de Testare

### 1. Component Testing Hierarchy
- **Descriere**: Testare pe niveluri: unitate, integrare, UI.
- **Implementare**:
  ```typescript
  // Unit: Testarea hooks și utilitarelor
  // Integration: Testare componente izolate
  // UI: Testare feature complete
  ```
- **Beneficii**: Acoperire completă, izolare probleme.

### 2. Data-testid Selectors
- **Descriere**: Utilizarea data-testid pentru selecția elementelor în teste.
- **Implementare**:
  ```typescript
  <button data-testid="submit-transaction">Submit</button>
  ```
- **Beneficii**: Teste rezistente la schimbări de UI, separare concerns.

### 3. Service Mocking
- **Descriere**: Mock-uri doar pentru servicii externe, nu pentru componente.
- **Implementare**:
  ```typescript
  // __mocks__/transactionService.ts
  ```
- **Beneficii**: Teste mai aproape de realitate, mai puțin fragile. 
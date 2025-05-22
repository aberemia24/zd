# Context Tehnologic BudgetApp

## Stack Tehnologic
- **Frontend**:
  - React (hooks și functional components)
  - TypeScript pentru type safety
  - TailwindCSS + sistem custom de design tokens
  - Zustand pentru state management
  - React Query pentru data fetching și caching
  - TanStack Table pentru LunarGrid

- **Backend**:
  - NestJS pentru structura API
  - Supabase pentru autentificare și stocare date
  - PostgreSQL ca bază de date
  - TypeScript pentru type safety

- **Shared Constants**:
  - Sursă unică de adevăr pentru constante
  - Sistem de generare automată pentru frontend

## Patternuri și Practici
1. **Custom Hooks Specializate**:
   - Hooks pentru logica business (ex: useTransactionManager)
   - Hooks pentru caching și invalidare React Query
   - Hooks pentru interacțiunea cu UI (ex: useForm)

2. **State Management**:
   - Zustand pentru global UI state
   - React Query pentru server state
   - State local React doar pentru UI izolat

3. **Design System**:
   - getEnhancedComponentClasses pentru abstracție stiluri
   - componentMap pentru definiții centralizate de stiluri
   - Primitive components vs Feature components

4. **Performanță**:
   - Virtualizare pentru liste lungi
   - Caching și prefetching cu React Query
   - Memoizare cu useCallback, useMemo și React.memo

5. **Testare**:
   - Unit tests cu Jest și React Testing Library
   - Mock-uri doar pentru servicii externe
   - data-testid pentru selecție elemente
   
## Convenții de Cod
- **Naming**:
  - PascalCase pentru componente și tipuri
  - camelCase pentru variabile, funcții și instanțe
  - SCREAMING_SNAKE_CASE pentru constante

- **Import Structure**:
  - Grupare pe categorii: externe, interne, tipuri
  - Barrel files (index.ts) pentru export

- **TypeScript**:
  - Tipuri explicite pentru props
  - Interfețe pentru obiecte complexe
  - Enums pentru valori predefinite

## Dependențe Cheie
- react, react-dom
- zustand
- @tanstack/react-query
- @tanstack/react-table
- tailwindcss
- @supabase/supabase-js
- jest, @testing-library/react 
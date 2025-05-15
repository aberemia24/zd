# Plan de Testare LunarGridTanStack

## Obiective
- Verificarea funcționalității complete a LunarGridTanStack
- Asigurarea integrării corecte cu stores existente
- Validarea performanței pentru seturi mari de date
- Confirmarea respectării regulilor de consistență UI/UX

## Teste Unitare

### 1. Componenta de bază - render inițial
- Verificare render fără date (stare loading/empty)
- Verificare render cu set minim de date
- Verificare render cu set complet de date multi-categorie

### 2. Interacțiuni Utilizator
- Expandare/colapsare categorii individuale
- Expandare/colapsare toate categoriile
- Click pe celulă pentru popover tranzacție
- Double-click pentru edit rapid
- Toggle între tabel virtual/clasic

### 3. Integrare cu Stores
- Verificare integrare cu transactionStore
  - Apelul corect al fetchTransactions
  - Afișare loading și erori
  - Afișare tranzacții din store
- Verificare integrare cu categoryStore
  - Afișare categorii personalizate
  - Reacție la modificări în store

### 4. Virtualizare și Performanță
- Încărcare și render pentru 1000+ tranzacții
- Test de scroll fluid
- Test de memorie pentru virtualizare

## Reguli Speciale de Testare

### Data-testid
Fiecare element funcțional trebuie să aibă data-testid conform regulilor globale:
- Pentru HeaderCell: `lunargrid-header-{column-id}`
- Pentru ExpandButton: `expand-btn-{category}`
- Pentru Cell: `cell-{category}-{subcategory}-{day}`
- Pentru ControlButtons: `{control-name}-btn`

### Mock-uri și Helpers
- Mock-uri dedicate pentru stores folosind pattern-ul recomandat
- Funcții helper pentru setarea stării mock-urilor

### Evitarea Anti-patternurilor
- Niciun string hardcodat în teste - doar constante
- Evitarea useEffect cu dependency array incomplet
- Validarea importurilor doar prin alias-uri

## Exemplu Test de Bază
```tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { EXCEL_GRID } from '@shared-constants';
import { LunarGridTanStack } from '../components/features/LunarGrid/LunarGridTanStack';

// Mock-uri pentru stores
jest.mock('../stores/transactionStore');
jest.mock('../stores/categoryStore');

describe('LunarGridTanStack', () => {
  it('afișează mesajul de încărcare când loading=true', () => {
    // Aranjare
    setMockTransactionState({ loading: true });
    
    // Acțiune
    render(<LunarGridTanStack />);
    
    // Asertare
    expect(screen.getByText(EXCEL_GRID.LOADING)).toBeInTheDocument();
  });
  
  it('afișează expandare/colapsare categorii', () => {
    // Implementare test expandare/colapsare
  });
  
  // Alte teste
});
```

*Acest plan de testare respectă regulile globale și memoria critică d7b6eb4b-0702-4b0a-b074-3915547a2544 referitoare la anti-patternul useEffect + queryParams.*

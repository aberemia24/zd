# Reguli Globale: Budget App

## 1. Surse de adevăr

### 1.1 Constants & enums partajate
- Sursă unică: `shared-constants/`
- Import DOAR prin `@shared-constants`; fără barrel local
- Actualizați `shared-constants/index.ts` după fiecare schimbare
- Rulează `npm run validate:constants` înainte de commit
```ts
import { TransactionType } from '@shared-constants';
```

### 1.2 Texte & mesaje
- Toate textele în `shared-constants/ui.ts` și `shared-constants/messages.ts`
- INTERZISĂ folosirea string-urilor hardcodate în cod
```ts
import { MESAJE, UI } from '@shared-constants';
```

### 1.3 API
- Toate rutele în `shared-constants/api.ts`
```ts
import { API } from '@shared-constants/api';
fetch(API.ROUTES.TRANSACTIONS);
```

## 2. Structură & nomenclatură
- Componente: `primitives/` vs `features/`
- Store-uri Zustand pe domenii în `src/stores/`
- Nomenclatură: SCREAMING_SNAKE_CASE (constants), PascalCase (enum-uri), `use[Domeniu]Store`

## 3. Testare & TDD

### 3.1 data-testid obligatoriu
- Toate elementele interactive trebuie să aibă `data-testid` unic și predictibil
```tsx
<button data-testid="save-btn">Salvează</button>
<input data-testid="amount-input" />
<li data-testid={`transaction-item-${id}`}>...</li>
```

### 3.2 Reguli pentru mock-uri
- Mock-uim **doar** servicii externe (API, date, random) și browser APIs
- **NU** mock-uim stores Zustand sau logică internă
- Folosiți `await act(async () => ...)` pentru operații asincrone

## 4. Componente React
- Tipuri TypeScript explicit definite pentru props
- Destructuring pentru props (`{prop1, prop2}` nu `props.x`)
- React.memo pentru componente pure
- Liste dinamice: `key` unic și stabil obligatoriu
- Evitați ternaries nested; preferați early return

## 5. State Management 

### 5.1 Pattern-uri recomandate
- Limitați logica în store-uri; împărțiți pe domenii
- Folosiți selectors pentru a preveni re-render-uri
- Separați stările pentru moduri incompatibile (editare/ștergere)
- Cache în store-uri: TTL + invalidare selectivă
- Flow de date standard:
  1. UI → store.action()
  2. store → service.operation()
  3. service → API/DB
  4. store → invalidate + refresh

### 5.2 Anti-pattern-uri
- **[CRITIC]** Nu folosiți `useEffect(fetch, [queryParams])` dacă fetch-ul modifică parametrii
```tsx
// ❌ Greșit - cauzează bucle infinite
useEffect(() => {
  fetchData(filter);
}, [filter]);

// ✅ Corect - fetch explicit
const handleFilterChange = (filter) => {
  setFilter(filter);
  fetchWithParams(filter);
};
```
- Nu modificați state în timpul renderizării
- Folosiți useRef pentru valori ce nu afectează render-ul

## 6. Pattern-uri pentru async/UI

### 6.1 Operații asincrone
```tsx
// Pattern standard pentru async
const [loading, setLoading] = useState(false);
const [error, setError] = useState(null);

const handleOperation = async () => {
  setLoading(true);
  setError(null);
  try {
    await someAsyncOperation();
    // Success feedback
  } catch (err) {
    setError(err.message || MESAJE.EROARE_GENERALA);
  } finally {
    setLoading(false);
  }
};
```

### 6.2 Interacțiune UI
- Pattern-uri consistente pentru interacțiune:
  - Click simplu: acțiuni principale
  - Double click: editare rapidă
  - Hover: controale secundare
  - Keyboard shortcuts: Enter=save, Esc=cancel

## 7. Performanță
- Evitați calcule costisitoare în render; folosiți memoizare
- Verificați re-render-uri nejustificate cu `why-did-you-render`

## 8. Ownership & documentare
- Fiecare fișier din `shared-constants` are owner specific
- Orice schimbare: menționată în PR, documentată în `DEV_LOG.md`
- Best practices în `BEST_PRACTICES.md`
- Cod deprecated: mută în `deprecated/` cu motiv și dată

## 9. AI Implementare
- Când implementezi componente, prioritizează:
  1. Import-uri corect grupate (constants, componente, hooks)
  2. Tipuri definite explicit
  3. Data-testid pentru elementele interactive
  4. Error handling și loading states
  5. Respectarea flow-ului de date standard
- Folosește doar componente primitive existente pentru UI-ul de bază

## 10. Checklist rapid
- [ ] Constants noi în `shared-constants/`; barrel up-to-date
- [ ] Importuri doar prin alias `@shared-constants`
- [ ] Fără string-uri hardcodate în cod
- [ ] `data-testid` pentru toate elementele interactive
- [ ] Pattern-uri standard pentru state management și async
- [ ] Validare cu `npm run validate:constants` + tests

_Abaterile trebuie justificate și documentate în PR + DEV_LOG.md._
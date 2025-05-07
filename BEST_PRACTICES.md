# Bune Practici și Convenții - Proiect Budget App

## Convenții Generale

- Orice modificare la constants/ui.ts, messages.ts, enums trebuie anunțată în code review și actualizată în barrel (`constants/index.ts`).
- Fiecare sursă de adevăr (constants, enums, messages) are un owner responsabil și orice modificare trebuie documentată și notificată echipei.
- Importurile pentru constants se fac doar din barrel (`constants/index.ts`), nu direct din fișiere individuale.
- Hooks custom legacy pentru tranzacții au fost eliminate, se folosește doar Zustand pentru state management tranzacții.
- Testele pentru recurență și validare form sunt obligatorii și trebuie să acopere edge cases.

- Limbă: Tot proiectul este exclusiv în limba română.
- TDD: Obligatoriu pentru toate funcționalitățile noi.
- Commit-uri: Mesaje frecvente, atomice, descriptive.
- Branching: Dezvoltare pe branch-uri de feature; `main` doar pentru cod stabil.
- PR-uri: Obligatorii pentru orice integrare.
- Documentație: Actualizare continuă a `README.md`, `BEST_PRACTICES.md`, `DEV_LOG.md`.
- Refactorizare: Incrementală, cu acoperire de teste.
- Fără Breaking Changes fără documentare și consens.

## Testing

### Principii Generale

- Teste unitare și de integrare pentru toate componentele și serviciile.
- Teste exhaustive pentru cazuri pozitive, negative și edge cases.
- Fără hardcodări de date în teste.

### Practici React & Testing Library

- Controlled components testate cu wrapper cu stare locală.
- Folosirea `await waitFor` sau `await act(async () => {...})` pentru actualizări asincrone.
- Testare exhaustivă dropdown-uri (categorie, subcategorie, tip).
- Teste colocate în același folder cu componentele.
- Minimizarea console noise în teste.

### Practici Zustand

- Teste pentru inițializare, setters, acțiuni asincrone și selectors.
- Mock-uri izolate pentru servicii injectate.
- Resetarea store-ului înainte de fiecare test.
- Fără testare directă UI dependentă de Zustand.

## Frontend

### Organizare

- Componente primitive: `frontend/src/components/primitives/`
- Componente de feature: `frontend/src/components/features/`
- Constants centralizați: `frontend/src/constants/`
- Teste colocate în același folder cu componenta.

### Text UI și Mesaje

- Toate textele vizibile în UI sunt în `constants/ui.ts`.
- Toate mesajele de utilizator sunt în `constants/messages.ts`.
- Strict interzisă folosirea string-urilor hardcodate în cod sau teste.

### API Integration

#### Centralizare chei query params tranzacții
- Toate cheile de query parametri pentru tranzacții (type, category, dateFrom, dateTo, limit, offset, sort) sunt definite o singură dată în `shared-constants/queryParams.ts`.
- Importurile se fac EXPLICIT din `@shared-constants/queryParams` (nu din barrel și nu local).
- Motiv: sincronizare automată între frontend și backend, fără duplicare sau risc de desincronizare la refactor.
- Exemplu corect:
  ```typescript
  import { QUERY_PARAMS } from '@shared-constants/queryParams';
  ```
- Orice modificare la aceste chei se anunță și se documentează în `DEV_LOG.md`.

- Endpointuri, parametri, headere definite în `constants/api.ts`.
- Timeout și retry configurabile.

### Tailwind CSS

- Stilizare exclusiv prin TailwindCSS.
- Eliminare stiluri inline.
- Organizare utilitare comune în `utils.css`.

## Constants și Importuri

### Organizare și Importuri Partajate

- Sursa unică de adevăr pentru enums/constants partajate este `shared-constants/` la rădăcina proiectului.
- Importurile pentru enums/constants partajate se fac DOAR prin path mapping `@shared-constants`, nu direct din fișiere sau barrel local.
- Orice import legacy (ex: din `constants/enums.ts`, `shared/`, barrel local) este interzis și va fi blocat automat de scriptul `npm run validate:constants`.
- Barrel-ul `shared-constants/index.ts` trebuie actualizat imediat după orice modificare.
- Orice modificare la enums/constants partajate trebuie anunțată și documentată în `DEV_LOG.md`.
- Exemplu corect de import:
  ```typescript
  import { TransactionType, CategoryType } from '@shared-constants';
  ```
- Auditarea automată a importurilor se face cu `npm run validate:constants` și este obligatorie înainte de orice commit major.

### Checklist future-proof pentru constants shared
- [ ] Toate constantele/enumurile/mesajele partajate se definesc DOAR în `shared-constants/`.
- [ ] Importurile pentru constants shared se fac DOAR prin path mapping `@shared-constants`.
- [ ] Barrel-ul `shared-constants/index.ts` se actualizează la fiecare modificare.
- [ ] Nu există duplicări locale în FE sau BE pentru constants partajate.
- [ ] Orice modificare se documentează clar în code review și în `DEV_LOG.md`.
- [ ] Se rulează periodic scriptul de audit pentru importuri (`npm run validate:constants`).
- [ ] Orice abatere se aprobă și se justifică explicit.

#### Configurare Path Mapping pentru Shared Constants

---

### Best practices pentru testare automată UI (`data-testid`)

- Folosește `data-testid` pe orice element funcțional relevant pentru testare (butoane, inputuri, itemi de listă, mesaje de feedback etc.).
- Alege valori unice și stabile (ex: `save-btn`, `amount-input`, `transaction-item-<id>`).
- Pentru componente custom, propagă prop-ul `data-testid` către elementul nativ.
- Nu depinde de text, clasă sau structură pentru selecție în teste!
- Evită `data-testid` pe elemente strict decorative.
- Documentează excepțiile în code review.

**Exemple:**
```tsx
<button data-testid="save-btn">Salvează</button>
<input data-testid="amount-input" />
<li data-testid={`transaction-item-${id}`}>...</li>
```

- Pentru a asigura funcționarea corectă a importurilor `@shared-constants` în toate mediile (TypeScript, Jest, CRACO):
  - În `tsconfig.json` adaugă la `compilerOptions.paths`:
    ```json
    "@shared-constants": ["../shared-constants/index.ts"],
    "@shared-constants/*": ["../shared-constants/*"]
    ```
  - În `jest.config.js`:
    ```js
    moduleNameMapper: {
      '^@shared-constants$': '<rootDir>/../shared-constants/index.ts',
      '^@shared-constants/(.*)$': '<rootDir>/../shared-constants/$1',
    }
    ```
  - În `craco.config.js` (sau echivalent webpack):
    ```js
    alias: {
      '@shared-constants': path.resolve(__dirname, '../shared-constants'),
    }
    ```
- Verifică periodic ca toate aceste configurații să fie sincronizate și testele să ruleze fără erori de path mapping.
- Orice discrepanță între configurări trebuie remediată imediat și documentată în `DEV_LOG.md`.


## Management Memorii Critice și Deprecated

### Reguli pentru Memorii

- Memorii critice trebuie marcate explicit `[CRITIC]` în titlu.
- Memorii deprecated trebuie mutate într-o secțiune separată sau arhivate.
- Orice memorie deprecated trebuie să aibă link sau referință către soluția nouă validată.
- Se menține o separare clară între memorii active și memorii arhivate.

## Backend (NestJS)

- (Se va completa pe măsură ce avansăm)

## Shared (Tipuri și Validări)

- Tipuri comune definite în `shared/`.
- Validare runtime folosind Zod.
- Sursă unică de adevăr pentru enums în `shared/enums.ts`.

### Monorepo & Shared Packages

- Build configurat pentru generarea `.d.ts` și `.js`.
- Frontend folosește re-export din `frontend/src/constants/enums.ts`.

## State Management - Zustand

- Store-uri în `frontend/src/stores/`, format: `use[DomeniuFuncțional]Store`.
- Structură clară: State, UI State, Setteri, Acțiuni, Selectors, Reset.
- Injection de servicii în store-uri pentru testabilitate.
- Folosirea selectors pentru performanță.
- Middleware Zustand pentru persist și devtools.

## Managementul Dependențelor și Build

- Instalare consistentă folosind `npm ci`.
- Sincronizare versiuni pachete critice (NestJS, Jest, TypeScript etc).
- Curățare periodică a node_modules și build clean.
- Verificare Jest config pentru detectarea corectă a testelor.

## Caching și Optimizare Performanță

- Servicii API folosind caching LRU și invalidare selectivă la operațiuni.
- Configurabil cache time și max entries.

## ⚠️ Anti-pattern: useEffect cu fetchTransactions pe queryParams

### Problemă

Un pattern greșit care duce la infinite loop în React cu Zustand este folosirea:

```tsx
useEffect(() => {
  useTransactionStore.getState().fetchTransactions();
}, [currentQueryParams]);
```

Deoarece fetchTransactions poate actualiza queryParams (sau alte state-uri relevante), acest lucru duce la re-trigger continuu al efectului și la Maximum update depth exceeded.

### Soluție corectă
- Rulează fetchTransactions doar la mount (dep list `[]`) sau folosește debounce/guard explicit pentru a evita buclele.

```tsx
useEffect(() => {
  useTransactionStore.getState().fetchTransactions();
}, []); // Doar la mount
```

- Dacă ai nevoie de fetch la schimbare de parametri, folosește un guard intern în store (ex: comparație deep cu ultimii parametri, caching, etc).

### Recomandare
- Nu folosi niciodată direct useEffect cu dependență pe queryParams pentru fetch-uri din store-uri Zustand fără protecție suplimentară.
- Documentează întotdeauna motivul în code review dacă ai nevoie de un pattern diferit.

## Debugging și Diagnosticare

- Folosirea `npx jest --listTests`, `--detectOpenHandles` pentru troubleshooting.
- Verificare corectitudine importuri relative.
- Evitare importuri circulare între module.
- Remedierea imediată a erorilor și warning-urilor.

## Documentare și Knowledge Management

### Flux de Actualizare Documentație

- Notarea lecțiilor și problemelor rezolvate în `DEV_LOG.md`.
- La final de săptămână sau task major, lecțiile sunt revizuite și promovate în `BEST_PRACTICES.md`.
- `BEST_PRACTICES.md` devine sursa oficială de reguli.
- `DEV_LOG.md` rămâne jurnal brut al progresului.

## Sincronizare Regulamente

- `BEST_PRACTICES.md` este aliniat permanent cu regulile definite în `global_rules.md`.
- Orice regulă nouă sau lecție învățată se reflectă simultan în ambele documente.
- În caz de diferență, regula documentată în `BEST_PRACTICES.md` prevalează.
- Se recomandă revizuirea periodică a sincronizării.

## Lessons Learned

- Barrel exports pot cauza importuri circulare - necesară organizare ierarhică clară.
- Mock-urile pentru clase private trebuie să vizeze doar metodele publice.
- URL constructor în Node necesită bază absolută validă pentru URL-uri relative.
- Control explicit al promisiunilor oferă teste asincrone mai stabile.
- Invalidarea selectivă a cache-ului reduce semnificativ apelurile API.
- Migrarea de la hooks custom la Zustand necesită rescriere completă a testelor.

### Pattern arhitectural: hooks + servicii + caching pentru React CRUD

- Recomandat pentru aplicații cu operațiuni CRUD frecvente:
  - Custom hooks pentru gestionare UI/state (ex: `useTransactionForm`, `useTransactionFilters`, `useTransactionData`)
  - Servicii dedicate pentru business logic și API (ex: `TransactionService`, `TransactionApiClient`)
  - Optimizare cache cu invalidare selectivă, LRU, monitorizare performanță
- Avantaje: separare clară a responsabilităților, testabilitate crescută, performanță mai bună.
- Status: pattern recomandat, nu obligatoriu (vezi și secțiunea 3 din `global_rules.md`).

### Testare valori inițiale în formulare complexe (React)

- Lecție: Asertarea simultană a tuturor valorilor inițiale poate duce la instabilitate în JSDOM/RTL.
- Recomandare:
  - Împarte verificarea în teste focalizate, fiecare testând un singur câmp sau grup mic de câmpuri.
  - Folosește `await waitFor` pentru câmpuri cu timing problematic (date, number, checkbox).
- Status: pattern recomandat pentru stabilitate, nu regulă obligatorie.

---

## Reguli mock-uri (actualizat 2025-05-06)

- Mock-uim **doar**:
  - external services (API calls, fetch, etc.)
  - time/date (ex: Date.now, timers)
  - random values (ex: Math.random)
  - browser APIs (ex: window.localStorage, navigator, clipboard, etc.)
- **Nu** mock-uim stores, hooks Zustand, logică internă sau componente proprii.
- Testele trebuie să reflecte comportamentul real al aplicației din perspectiva utilizatorului.
- Orice excepție trebuie documentată clar în PR și BEST_PRACTICES.md.

**TODO/PLAN:**
- Eliminarea treptată a mock-urilor pentru store-uri Zustand (`__mocks__/stores/`).
- Refactorizarea testelor pentru a folosi store-urile reale și doar mock-uri pentru servicii externe (Supabase, date, random, browser APIs).
- Task planificat incremental, va fi documentat în DEV_LOG.md la fiecare etapă majoră.

---

_Actualizat la: 2025-05-07_

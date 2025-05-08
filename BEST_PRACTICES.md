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

#### Testare robustă cu constants și data-testid
- Orice mesaj de eroare, loading sau feedback din UI și din teste trebuie să provină din constants (`@shared-constants/messages`), nu stringuri hardcodate.
- Toate elementele funcționale (butoane, inputuri, itemi listă, feedback) au `data-testid` unic, stabil și predictibil (vezi regula globală 3.1 și exemplul de mai jos).
- Testele verifică mesaje/indicatori folosind valorile din constants și selectează elementele prin `data-testid`, nu prin text hardcodat.
- Exemplu corect:
```tsx
import { MESAJE } from '@shared-constants/messages';
expect(screen.getByTestId('error-msg')).toHaveTextContent(MESAJE.EROARE_INCARCARE_TRANZACTII);
expect(screen.getByTestId('loading-indicator')).toBeInTheDocument();
```
- Pentru formulare complexe, verifică valorile inițiale pe câmpuri individuale cu `waitFor` (vezi lessons learned).

#### Politica de mocking
- Se mock-uiesc **doar** serviciile externe (API/fetch, date/time, random, browser APIs).
- **Nu** se mock-uiesc stores Zustand, hooks custom sau logică proprie (vezi regula globală mock-uri testare și DEV_LOG.md).
- Orice excepție se documentează clar în PR și BEST_PRACTICES.md.

#### Anti-pattern critic: useEffect(fetch, [queryParams]) cu Zustand
- Este **interzis** să folosești direct `useEffect(() => fetchTransactions(), [queryParams])` cu Zustand, deoarece duce la infinite loop și Maximum update depth exceeded.
- Regula critică este documentată în global_rules.md secțiunea 8.2 și trebuie respectată strict.
- Exemplu greșit (NU folosiți!):
```tsx
useEffect(() => {
  useTransactionStore.getState().fetchTransactions();
}, [queryParams]);
```
- Exemplu corect:
```tsx
useEffect(() => {
  useTransactionStore.getState().fetchTransactions();
}, []); // Doar la mount
```
- Dacă fetch-ul depinde de parametri, folosește un guard intern/caching în store pentru a preveni buclele.
- Orice abatere se documentează explicit în code review și DEV_LOG.md.

#### Motivare
- Aceste reguli asigură testare robustă, mentenanță ușoară, onboarding rapid și QA predictibil.
- Centralizarea mesajelor și constantelor elimină bug-uri și inconsistențe între FE/BE/teste.
- Interzicerea mock-ului pe stores/hooks asigură teste care reflectă comportamentul real al aplicației.
- Respectarea anti-patternului Zustand previne bug-uri greu de diagnosticat și regresii ascunse.

#### Referințe
- [global_rules.md] secțiunea 3, 8.2, 9
- [DEV_LOG.md] pentru schimbări și excepții
- [LESSON] Testare valori inițiale în formulare complexe

### Practici Zustand

#### Prevenirea buclelor infinite în React + Zustand

Pentru a preveni eroarea "Maximum update depth exceeded" în aplicații cu Zustand, următoarele practici sunt esențiale:

1. **Separă setarea parametrilor de fetch-ul de date**:
   ```typescript
   // INCORECT - poate crea buclă infinită
   React.useEffect(() => {
     store.setQueryParams({ month, year });
     store.fetchTransactions(); // Poate declanșa un update care re-declanșează efectul
   }, [month, year, store]);
   
   // CORECT - verifică schimbările reale înainte de a actualiza
   const paramsRef = React.useRef({ month, year });
   React.useEffect(() => {
     if (paramsRef.current.month !== month || paramsRef.current.year !== year) {
       paramsRef.current = { month, year };
       store.setQueryParams({ month, year });
       store.fetchTransactions();
     }
   }, [month, year, store]);
   ```

2. **Evită apelurile directe la store.getState() în efecte**:
   ```typescript
   // INCORECT - poate crea buclă infinită
   setTimeout(() => {
     useStore.getState().setQueryParams({...});
     useStore.getState().fetchTransactions();
   }, 300);
   
   // CORECT - folosește instanta de store din context
   setTimeout(() => {
     transactionStore.refresh(); // Metodă atomică care nu declanșează alte efecte
   }, 300);
   ```

3. **Folosește useRef pentru a evita re-render-uri inutile**:
   ```typescript
   // INCORECT - poate crea buclă infinită
   const [lastUpdate, setLastUpdate] = useState(Date.now());
   // ... în alt efect sau handler
   setLastUpdate(Date.now()); // Poate declanșa re-render care re-declanșează efecte
   
   // CORECT - useRef nu declanșează re-render
   const lastUpdateRef = useRef(Date.now());
   // ... în alt efect sau handler
   lastUpdateRef.current = Date.now(); // Nu declanșează re-render
   ```

4. **Adaugă setTimeout pentru a preveni actualizările în cascadă**:
   ```typescript
   // INCORECT - poate crea buclă infinită dacă refresh() modifică starea
   await transactionStore.saveTransaction(data);
   transactionStore.refresh(); // Poate declanșa un update imediat
   
   // CORECT - întârzie refresh-ul pentru a permite finalizarea update-ului curent
   await transactionStore.saveTransaction(data);
   setTimeout(() => {
     transactionStore.refresh();
   }, 300); // Întârziere mică pentru a preveni actualizările în cascadă
   ```

Aceste practici sunt conforme cu regula critică din memoria d7b6eb4b-0702-4b0a-b074-3915547a2544 și previn bug-urile greu de diagnosticat cauzate de buclele infinite.

#### UX rapid pentru Lunar Grid (Excel-like)

- Implementat conform DEV-5, tranzacțiile pot fi adăugate/editate direct din grid-ul lunar:
  - **Single click** pe celulă: deschide popover cu sumă + recurentă/frecvență
  - **Double click** pe celulă: prompt rapid pentru sumă (editare instantă)
  - **Tastare directă**: cifre tastate merg automat în input, fără a pierde focus (Excel-like)
  - **Keyboard shortcuts**: Enter pentru salvare, Escape pentru anulare
- Best practices obligatorii pentru acest pattern:
  - Forțează refresh cu `transactionStore.refresh()` după operare pentru actualizare instantă
  - Toate textele din `@shared-constants/ui.ts` (zero hardcoded strings)
  - Toate date-testid-urile predictibile pentru celule/popover/butoane
  - Validare strictă pentru tipuri: `as TransactionType`, `as FrequencyType`
  - Try/catch pentru operații asincrone cu handling de erori și logging adecvat
  - Preluare automată context (zi, categorie, subcategorie) din celula editată

#### Persistență autentificare cu Zustand + persist

- Pentru orice state de autentificare, folosiți middleware-ul `persist` din Zustand, cu partialize pentru a salva doar datele relevante (ex: user, nu loading/error).
- Verificați sesiunea la pornirea aplicației cu un efect global (`App.tsx` sau entrypoint).
- Exemplu corect:
  ```ts
  export const useAuthStore = create(
    persist(
      (set) => ({ ... }),
      {
        name: 'auth-storage',
        partialize: (state) => ({ user: state.user }),
      }
    )
  );
  ```
- Nu mock-uiți store-urile Zustand la testare (vezi politica de mocking).
- Orice fetch asincron cu Zustand trebuie să respecte regula anti-pattern (NU folosiți useEffect(fetch, [queryParams]) fără guard intern/caching).
- Sursa unică pentru categorii/subcategorii: doar `shared-constants/categories.ts`, validare la nivel de service și trigger DB.


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

_Actualizat la: 2025-05-08_

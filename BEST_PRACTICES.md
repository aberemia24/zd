# Bune Practici și Convenții Proiect 'Budget App'

Acest document centralizează deciziile și convențiile adoptate pe parcursul dezvoltării.

## Convenții Generale

*   **Limbă:** Întregul proiect (comunicare, cod, comentarii, documentație) va folosi **exclusiv limba română**. (Stabilit: 2025-04-23)
*   **TDD (Test-Driven Development):** Obligatoriu pentru toate componentele și funcționalitățile noi (frontend și backend).
*   **Commit-uri:** Frecvente, atomice și cu mesaje descriptive (ex: `feat: Adaugă validare formular tranzacții`, `fix: Corectează calcul total buget`).
*   **Branching:** Branch `main` doar pentru cod stabil. Dezvoltarea se face pe branch-uri de feature (ex: `feature/rapoarte-lunare`).
*   **Pull Requests (PRs):** Obligatorii pentru integrarea în `main`, chiar și pentru dezvoltare individuală (pentru istoric și context). Code review recomandat.
*   **Documentație:** `README.md` și `DEV_LOG.md` trebuie actualizate constant cu decizii majore, modificări de arhitectură sau probleme întâmpinate.
*   **Refactorizare:** Incrementală și mereu acoperită de teste.
*   **Fără Breaking Changes:** Modificările care afectează compatibilitatea trebuie discutate și documentate.

## Frontend (React & Testing Library)

### Dropdown-uri controlate (categorie/subcategorie/tip)
- Folosește pattern-ul controlled component: valoarea selectată este mereu sincronizată cu starea (form.type, form.category etc.).
- **Testare exhaustivă a filtrării subcategoriilor:**
  - Importă sursa de adevăr (structura categorii/subcategorii) direct din codul sursă.
  - Creează un helper pentru extragerea tuturor subcategoriilor posibile pentru fiecare categorie.
  - În teste, verifică exhaustiv că toate opțiunile și optgroup-urile relevante apar corect în dropdown după selectarea tipului/categoriei.
  - Orice modificare a structurii de categorii va fi reflectată automat și în teste, reducând riscul de bug-uri și mentenanța duplicată.
  - Pattern recomandat: helper pentru extragere, aserțiuni exhaustive, fără hardcoding de opțiuni în test.
- Pentru placeholder (ex: 'Alege'), randarea trebuie condiționată strict de valoarea selectată: opțiunea apare doar dacă value este ''.
- Elimină opțiuni irelevante din dropdown (ex: 'Transfer' la tip) pentru UX clar și validare robustă.
- Pentru testarea interacțiunii, folosește un wrapper cu stare locală în test, nu doar onChange dummy. Astfel, simularea reflectă comportamentul real din aplicație.
- Testează filtrarea dinamică a categoriilor și subcategoriilor în funcție de tipul selectat și compatibilitatea valorilor.
- Verifică și existența optgroup-urilor folosind getByRole('group', { name: ... }) în teste.
- Toate comentariile, denumirile și mesajele de test sunt în limba română.

*   **Modularizare:** Componentele complexe (formulare, tabele) se extrag în module proprii (`src/components/NumeComponenta/`).
*   **Colocare Teste:** Testele unitare/integrare pentru o componentă (`*.test.tsx`) se plasează în același folder cu componenta.
*   **Mocking `fetch`:** Folosește un mock global robust pentru `fetch` (ideal în `src/setupTests.ts` sau un helper dedicat) pentru a izola testele de rețea.
*   **Stabilitate Teste Asincrone:** Orice actualizare de stare care rezultă dintr-o operație asincronă (ex: `fetch`, `setTimeout`) trebuie anticipată în teste folosind `await waitFor(...)` sau `await findBy*()` pentru aserțiuni. Interacțiunile care declanșează actualizări asincrone ar trebui, ideal, învelite în `async act(...)`.
*   **Testare Valori Inițiale (Formulare):** Evită asertarea simultană a multor valori inițiale după render. Împarte verificarea în teste `it(...)` mai mici, focalizate pe un singur câmp sau un grup mic de câmpuri. Folosește `await waitFor` pentru câmpurile predispuse la probleme de timing (date, number, checkbox). (Vezi Memorie ID: 3cb5254f)
*   **Claritate Output Teste:** Minimizează `console.log`/`console.error` inutile în teste. Folosește reporteri Jest suplimentari (`jest-summarizing-reporter`, `jest-html-reporter`) pentru vizualizare mai bună.

## Eliminarea hardcodărilor și patternuri robuste

### Centralizare texte UI (obligatoriu)

- Orice nouă componentă sau test trebuie să respecte patternul de centralizare a textelor UI și a helperilor de test.
- Toate textele vizibile în UI (labeluri, butoane, dropdown-uri, placeholdere, opțiuni) se extrag și se centralizează în constants/ui.ts.
- Nicio componentă nu are voie să folosească string-uri hardcodate pentru UI.
- Orice helper sau mock folosit în mai multe teste trebuie centralizat în test/helpers.ts sau test/mockData.ts.
- Dacă apar noi stringuri sau helpers, centralizează-le imediat.
- Convențiile și lecțiile învățate se documentează imediat în BEST_PRACTICES.md, DEV_LOG.md și în memorie.
- Testele trebuie să fie DRY, robuste și ușor de întreținut.
- Toate textele vizibile în UI (labeluri, butoane, dropdown-uri, placeholdere, opțiuni etc.) trebuie extrase și centralizate în `frontend/src/constants/ui.ts`.
- Este interzisă folosirea string-urilor hardcodate pentru UI în componente.
- Orice componentă nouă sau modificată trebuie să folosească DOAR constantele din `ui.ts` pentru orice text vizibil.
- Dacă ai nevoie de un text nou, îl adaugi mai întâi în `ui.ts`, apoi îl folosești în componentă.
- Orice excepție trebuie documentată și validată de echipă.

**Pattern corect:**
```tsx
import { LABELS, BUTTONS } from '../../constants/ui';
<button>{BUTTONS.ADD}</button>
<label>{LABELS.CATEGORY}</label>
```

**Anti-pattern:**
```tsx
<button>Adaugă</button>
<label>Categorie</label>
```

#### Pattern robust pentru API
- Toate endpointurile, parametrii de query, headerele, timeout-ul și limita de retry sunt definite centralizat în `constants/api.ts`.
- Nu există niciun string hardcodate în codul de fetch/axios; se folosește mereu sursa de adevăr unică.
- Headerele pot fi extinse ușor (ex: Authorization).
- Timeout-ul și retry-ul sunt configurabile dintr-un singur loc.
- Avantaje: mentenanță ușoară, testare predictibilă, extensibilitate rapidă pentru orice schimbare de API.

- **Enumuri**: Toate tipurile, categoriile, frecvențele sunt definite în `constants/enums.ts` și folosite exclusiv prin import.
- **Subcategorii**: Structura completă exportată dintr-un singur fișier, importată direct în componente și teste. Helperi dedicați pentru extragere și filtrare.
- **Texte UI**: Toate labelurile, butoanele, placeholder-ele, headerele de tabel sunt în `constants/ui.ts`.
- **Mesaje**: Toate mesajele de validare, eroare, succes, avertismente, confirmări și prompturi vizibile utilizatorului sunt în `constants/messages.ts`. Nu este permisă folosirea string-urilor hardcodate pentru aceste mesaje în componente. Orice excepție sau convenție nouă se documentează imediat aici și în `DEV_LOG.md`.
- **Valori default**: Paginare, monedă, form state etc. în `constants/defaults.ts`.
- **API**: Toate endpoint-urile, query params, headerele și URL-urile sunt în `constants/api.ts`.
- **Testare**: Testele nu hardcodează opțiuni, folosesc import direct din sursa de adevăr și helperi pentru aserțiuni exhaustive. Orice modificare a structurii se reflectă automat și în teste.
- **Documentare**: Orice convenție nouă sau lecție învățată se documentează imediat în `BEST_PRACTICES.md`, `DEV_LOG.md`, `PLAN.md` și `README.md`.
- **Status**: Fără hardcodări în frontend. Patternul robust este respectat peste tot.

## Backend (NestJS)

*   (De completat pe măsură ce avansăm)

## Shared (Tipuri & Validări)

*   (De completat pe măsură ce avansăm)

## Managementul Dependențelor

*   Folosește `npm ci` pentru instalări consistente bazate pe `package-lock.json`.
*   Actualizează dependențele periodic și controlat.

## 1. Sincronizare versiuni pachete critice (ex: NestJS)
- Toate pachetele `@nestjs/*` (common, core, platform-express, testing etc.) trebuie să fie la aceeași versiune exactă în toate subproiectele pentru a preveni conflicte de tipuri și runtime.
- Orice modificare de versiune trebuie făcută sincronizat peste tot și menționată explicit în README și DEV_LOG.
- Se recomandă adăugarea unei secțiuni de verificare periodică a dependențelor în workflow-ul de dezvoltare.
- Nu folosi niciodată versiuni mixte de NestJS, nici măcar între backend și test/dev.
- Acest principiu se aplică și la alte pachete critice (ex: ts-jest, typescript, jest, mongoose etc.).

## 2. Sursă unică de adevăr pentru enums și implementare monorepo

### Enums comune între frontend și backend
- Toate enums folosite în ambele zone (frontend și backend) trebuie să fie definite o singură dată în directorul shared (ex: `shared/enums.ts`).
- Orice modificare la aceste enums se face doar în shared, iar frontend/backend doar importă.
- Nu se acceptă dubluri sau enums divergente între zone.

### Implementare corectă (monorepo cu Create React App fără eject)
- Enums comune sunt definite fizic doar în `shared/enums.ts`
- În `shared/package.json` configurăm: `"main": "./dist/index.js"` și `"types": "./dist/index.d.ts"`
- În `shared/tsconfig.json` includem toate fișierele TS: `"include": ["**/*.ts"]`
- După orice modificare, rulăm `npm run build` în shared pentru generarea fișierelor .js și .d.ts
- În frontend, folosim re-export prin proxy în `frontend/src/constants/enums.ts`: 
  ```typescript
  // Re-export din shared ca sursă unică de adevăr pentru enums
  export * from '../../../shared/dist/enums';
  ```
- Importurile din componente frontend rămân neschimbate și folosesc calea relativă normală:
  ```typescript
  import { TransactionType } from '../../constants/enums';
  ```

### Beneficii
- Sursa unică de adevăr pentru tipuri critice
- Eliminare inconsistențe între frontend/backend
- Compatibilitate cu toolchain-ul standard (CRA, Jest, TypeScript)
- Mentenanță redusă (modifici doar într-un singur loc)
- Nici o configurare complexă Jest/Webpack necesară

## 3. Importuri între workspace-uri (alte cazuri)
- Folosește importuri relative corecte sau path mapping în tsconfig pentru a evita erori la build și test.
- Dacă folosești monorepo, evită importurile cu prea multe nivele de "../"; folosește path mapping dacă devine greu de urmărit.
- Orice schimbare de structură la shared trebuie sincronizată și testată în toate subproiectele dependente.

## 3. Configurare Jest/ts-jest
- Folosește "preset": "ts-jest" și asigură-te că rootDir și testRegex includ toate testele relevante (ex: "test/.*\\.e2e-spec\\.ts$").
- Rulează periodic `npx jest --listTests` pentru a verifica dacă toate testele sunt detectate.
- Dacă Jest nu găsește teste, verifică configul și căile.
- Dacă Jest rulează, dar nu execută teste, verifică presetul, rootDir, transform și existența fișierelor .js vechi în test/.
- Pentru e2e, folosește testEnvironment: "node".

## 4. Curățare și build
- După orice upgrade major de dependențe, rulează:
  - Șterge node_modules și package-lock.json
  - `npm install`
  - `npm run build`
  - `npm test`
- Nu lăsa fișiere .js vechi în folderele de test (pot cauza erori de runtime sau "ghost tests").

## 5. Dependențe de runtime și test
- Orice warning/error la build/test (ex: lipsă class-validator, class-transformer) trebuie remediat imediat.
- Nu ignora niciun warning la build/test.
- Asigură-te că ai toate tipările (ex: @types/react, @types/jest, @types/testing-library__react) ca devDependencies în workspace-ul potrivit.
- Dacă folosești ValidationPipe, trebuie să ai class-validator și class-transformer instalate, chiar dacă folosești zod pentru validare efectivă.

## 6. Debug & Diagnostic
- Dacă testele nu rulează, folosește:
  - `npx jest --listTests` pentru a vedea ce detectează Jest.
  - `npx jest --runInBand --detectOpenHandles --verbose` pentru debug detaliat.
- Dacă buildul nu merge, verifică importurile relative și existența fișierelor shared.
- Dacă apar erori "Cannot find module ...", corectează rapid calea de import.

## 7. Documentare
- Orice lecție importantă sau problemă rezolvată trebuie documentată în acest fișier, DEV_LOG.md și README.md.
- Orice modificare majoră de infrastructură sau workflow trebuie menționată în README și DEV_LOG.
- Menține un fișier BEST_PRACTICES.md în root cu toate regulile și convențiile de echipă.

## 8. TDD și acoperire cu teste
- Orice feature nou trebuie să aibă teste înainte de implementare (TDD).
- Testele e2e trebuie să acopere toate fluxurile critice.
- Nu considera "gata" un feature până nu are acoperire de test și trec toate testele automat.

## 9. Workflow de lucru în monorepo
- Orice upgrade de dependențe se face întâi pe o ramură separată, cu build și test complet înainte de merge.
- Se rulează `npm audit` și `npm outdated` periodic.
- Se documentează orice lessons learned și workaround-uri.

## 10. Alte observații utile
- IDE-ul poate "vedea" tipări și din alte workspace-uri dacă folosești workspaces npm/yarn, dar nu te baza pe acest comportament: adaugă explicit tipările la frontend/backend după caz.
- Un simplu restart la TypeScript server sau IDE poate face să dispară erori "fantomă" de tipări lipsă, dar cauza reală e lipsa tipărilor ca devDependency.
- Înainte de commit, verifică să nu existe fișiere generate accidental (ex: .js în test/ sau src/).
- Orice problemă de infrastructură trebuie rezolvată imediat, nu "lăsată pe mai târziu".

## 11. Frontend React & Teste (2025-04-22, actualizat 2025-04-24)
- Componentele sunt organizate în două directoare principale:
  - `src/components/primitives/` - componente mici, reutilizabile (Button, Input, Select, Checkbox etc.)
  - `src/components/features/` - componente complexe, specifice aplicației (TransactionForm, TransactionTable, TransactionFilters)
- Testele unitare pentru fiecare componentă trebuie colocate în același folder (`ComponentName.test.tsx`), nu în src/.
- Pentru orice fetch în teste, folosește mock global din `setupTests.ts` pentru consistență și evitare erori `.then` pe undefined.
- Orice update de stare asincronă (ex: submit, fetch) în teste trebuie să fie învelit în `await act(...)` sau `waitFor` pentru a evita warninguri și flaky tests.
- Structura de foldere reflectă modularitatea și separarea responsabilităților (primitive/features).
- Folosește reporteri Jest suplimentari (`jest-summarizing-reporter`, `jest-html-reporter`) pentru claritate și partajare ușoară a rezultatelor testelor.
- Redu la minimum console noise în teste (mock console.log/error dacă e nevoie) pentru rapoarte clare.
- Orice convenție, workaround sau lesson learned se documentează imediat în `BEST_PRACTICES.md`, `DEV_LOG.md` și memorie.

---

### [2025-04-23] Progres major funcționalitate și testare
- Finalizare flux principal adăugare și vizualizare tranzacții (frontend)
- Refactorizare majoră TransactionForm: dropdown-uri filtrate dinamic, eliminare 'Transfer', UX placeholder, testare exhaustivă
- Testele acoperă toate scenariile critice și edge pentru TransactionForm, TransactionTable, TransactionFilters
- Pattern robust: helperi pentru filtrare, sursă de adevăr importată direct, wrapper cu stare locală pentru testare
- Toate convențiile și lecțiile propagate în BEST_PRACTICES.md, DEV_LOG.md, PLAN.md, README.md și memorie
- Ne concentrăm pe funcționalitate, UI-ul rămâne placeholder până la definirea designului final
- Următorul pas: finalizare funcționalitate, apoi reguli clare pentru testare E2E și stilizare

### [2025-04-24] Refactorizare structură componente și configurare Tailwind CSS
- Restructurare completă a directorului de componente în două subdirectoare principale:
  - `components/primitives/`: componente mici, generice, reutilizabile (Button, Input, Select, Checkbox etc.)
  - `components/features/`: componente complexe, specifice aplicației (TransactionForm, TransactionTable, TransactionFilters)
- Toate importurile actualizate pentru a reflecta noua structură de directoare
- Adăugare suport pentru Jest DOM matchers prin:
  - Crearea fișierului `src/types/jest-dom.d.ts`
  - Actualizarea `tsconfig.json` pentru a include tipurile necesare
- Configurare VS Code pentru Tailwind CSS:
  - Instalare extensie Tailwind CSS IntelliSense pentru a elimina avertismentele de directivă @apply/@tailwind
  - Creare fișier `.vscode/settings.json` pentru a configura editorul să recunoască directivele Tailwind
  - Adăugare comentariu `/* tailwindcss */` în fișierele CSS pentru a ajuta IntelliSense

### [2025-04-24] Standardizare Tailwind CSS și componente avansate
- Finalizarea tech story pentru implementarea Tailwind CSS ca sistem de stilizare standard
- Componentele primitive au fost implementate cu clasele Tailwind (Button, Input, Select, etc.)
- Utilizarea claselor Tailwind direct în componente în loc de stiluri inline (ex. App.tsx)
- Implementarea unei componente exemplu de tip Excel-like grid (`ExcelGrid`) pentru UI-uri complexe:
  - Utilizează clasele `excel-cell`, `excel-header` din utils.css
  - Demonstrează layout de tip grid cu culori semantice 
  - Oferă baza pentru funcționalități viitoare de raportare și analiză bugetară
- Orice componentă nouă trebuie să utilizeze clasele Tailwind, nu stiluri inline sau CSS separat
- Respectarea convenției claselor utility-first cu extragerea componentelor comune în utils.css

_Actualizat la: 2025-04-25_

### [2025-04-25] Optimizări cache pentru servicii

#### Pattern-ul service cu invalidare inteligentă a cache-ului
- **Principii de design**
  - Caching optimizat cu invalidare selectivă a cache-ului în funcție de operațiuni (create, update, delete)
  - Politica LRU (Least Recently Used) pentru limitarea memoriei consumate și eliminarea automată a intrărilor vechi
  - Monitorizare performanță prin statistici (hits, misses, ratio) în cadrul serviciilor

- **Implementare TransactionService**
  - La creare de tranzacții: Invalidare doar a paginilor afectate (prima pagină din fiecare categorie de sortare)
  - La actualizare/ștergere: Invalidare doar a paginilor care conțin tranzacția modificată
  - Limită configurabilă a mărimii totale a cache-ului (parametrul `maxCacheEntries`)
  - Timp de expirare configurabil pentru intrările din cache (`cacheTimeMs`)

### [2025-04-25] Testarea componentelor React cu hooks și servicii

#### Pattern de testare pentru componente cu hooks și servicii

- **Principii de testare**
  - Mock-uri pentru hooks și servicii în locul mock-urilor directe pentru APIs (fetch)
  - Testarea comportamentului componentelor, nu a implementării interne
  - Separarea clară a test fixtures, mock-uri și expects pentru a crește lizibilitatea și mentenabilitatea
  - Utilizarea `beforeEach` pentru a reseta mock-urile între teste și pentru a evita interferențele

- **Implementare mock-uri pentru hooks și servicii**
  - Mockați hook-urile direct prin `jest.mock('./cale/la/hooks')` cu implementarea mock a comportamentului
  - Pentru evenimente de form, implementați funcțiile de callback care simulează comportamentul real
  - Definiți tipurile corecte pentru parametrii cum ar fi `onSubmit` pentru a evita erorile TypeScript
  - Izolați testele folosind mock-uri granulare care pot fi configurate pentru fiecare test în parte

- **Exemple de bune practici**
  - Mockați hook-urile pentru a primi parametri și a returna valori controlate în test, nu hardcodate
  - Testează comportamentul general, cum ar fi: afișarea corectă a datelor, comportamentul la încărcare și erori
  - Pentru teste de interacțiune, verificați că handler-ele pentru evenimente sunt apelate cu parametrii corecți
  - Testează starea initială, după acțiuni, și fluxul complet pentru cazurile critice (tranzacții recurente)

- **Pentru componente cu tranzacții recurente**
  - Verificați dacă toggleul de recurentă dezactivează/activează corect selectorul de frecvență
  - Testează validarea: submitul nu ar trebui să funcționeze pentru tranzacții recurente fără frecvență selectată
  - Verificați salvarea corectă a unei tranzacții recurente complete și apelul la funcția de refresh

- **Testare cache**
  - Teste pentru toate scenariile de invalidare (creare, actualizare, ștergere)
  - Teste pentru limită maximă și algoritm LRU
  - Teste pentru expirare cache și statistici
  - Mock-uri adecvate pentru controlul condițiilor de testare

- **Beneficii dovedite**
  - Reducere dramatică a numărului de cereri API pentru scenarii comune (navigare între pagini, filtrare, sortare)
  - Consum controlat de memorie chiar și pentru aplicații cu multe date
  - Scalare naturală pentru aplicații complexe
  - Debugging ușor prin metode de monitorizare (getCacheStats)

- **Caching și testabilitate**
  - Dependency injection completă (apiClient, cacheTimeMs, maxCacheEntries) pentru testare
  - Toate deciziile de cache sunt testabile și configurabile
  - Pattern-ul poate fi aplicat pentru orice serviciu care interacționează cu API-ul

### [2025-04-25] State Management cu Zustand

#### Principii generale pentru store-uri Zustand

- **Organizare și nomenclatură**
  - Store-urile se definesc în fișiere dedicate în directorul `frontend/src/stores/`
  - Numele store-urilor urmează formatul `use[DomeniuFuncțional]Store` (ex: `useTransactionStore`)
  - Fiecare store are propriul său fișier de test colocat (ex: `transactionStore.test.ts`)
  - Interfețele store-urilor sunt exportate pentru a permite reutilizarea și extensia tipurilor

- **Structura store-urilor**
  - Fiecare store trebuie să aibă secțiuni clar delimitate pentru:
    - Stare (data și metadate)
    - Stare UI (loading, error, etc)
    - Setteri simpli (pentru actualizări atomice)
    - Acțiuni complexe (operațiuni asincrone, efecte secundare)
    - Utilități (reset, selectors, etc)
  - Valori implicite pentru state importate din `constants/defaults.ts`
  - Toate enum-urile importate din sursa unică de adevăr (shared via constants/enums.ts)

- **Dependency Injection**
  - Serviciile (ex: TransactionService) sunt injectate în store pentru testabilitate
  - O metodă dedicată `setService` este expusă pentru înlocuirea serviciilor în teste
  - Stores nu instanțiază direct alte store-uri pentru a evita dependențe circulare

- **Anti-patterns de evitat**
  - Aglomerarea unui singur store cu prea multă logică (preferă store-uri mici, dedicate)
  - Definirea tipurilor serviciilor direct în store (importă din sursa originală)
  - Hardcodarea valorilor default (folosește constants/defaults.ts)
  - Accesul direct la store din alt store (poate duce la dependențe circulare)
  - Mutarea logicii de business din servicii în store-uri

#### Pattern-uri pentru testarea store-urilor Zustand

- **Setup test**
  - Folosește `jest.mock()` la nivel de modul pentru servicii
  - Izolează fiecare test cu `beforeEach(() => store.reset())`
  - Injectează servicii mock prin `store.setService(mockService)`
  - Învelește acțiunile care modifică state în `act(() => ...)` pentru teste React

- **Testare acțiuni asincrone**
  - Învelește toate acțiunile asincrone în `await act(async () => { await store.action() })`
  - Mockează serviciile pentru a returna date controlate sau a arunca erori specifice
  - Testează întregul ciclu de viață: loading → success/error → state final

- **Testare selectors**
  - Utilizează `mockState` cu date controlate pentru a testa selectors izolat
  - Verifică comportamentul corect cu date variate (limite, cazuri extreme)
  - Testează memoizarea pentru a confirma re-calcularea doar când se schimbă dependențele

#### Migrare incrementală de la hooks la store-uri

- **Abordare graduală**
  - Menține compatibilitatea cu hooks existente în perioada de tranziție
  - Începe cu migrarea hook-urilor pentru date (useTransactionData) care sunt cel mai apropiate de conceptul de store
  - Continuă cu hook-uri pentru filtre și sortare, apoi formulare
  - Rulează teste pentru ambele implementări în paralel

- **Refactorizare componente**
  - Înlocuiește prop drilling cu accesul direct la store unde are sens
  - Pentru componente pure, continuă să folosești props pentru a menține testabilitatea
  - Împarte componentele complexe în containere (cu acces la store) și componente prezentaționale

- **Performanță**
  - Folosește selectors pentru acces la state pentru a preveni re-renderizări inutile
  - Actualizează doar părțile de state care s-au schimbat efectiv
  - Utilizează devtools Zustand pentru a inspecta actualizările de state

_Actualizat la: 2025-04-25_

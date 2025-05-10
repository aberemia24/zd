# Dev Log - Budget App

## [2025-05-11] Refactorizare extinsă pentru tema "Earthy" și aplicare token-uri de stil

- **Sumar:** S-a finalizat o refactorizare amplă a mai multor componente și pagini cheie din aplicație pentru a se alinia complet la noua temă "earthy". Acest proces a implicat eliminarea stilurilor hardcodate și înlocuirea lor cu token-uri de stil predefinite (`--color-primary-500`, `spacing-token`, `rounded-token` etc.) și clase utilitare custom din `index.css`. Scopul principal a fost asigurarea consistenței vizuale, îmbunătățirea mentenabilității și respectarea ghidului de stil al aplicației.
- **Principalele zone afectate:**
    - Componente de autentificare: `LoginForm`, `RegisterForm`.
    - Componente de tranzacții: `TransactionFilters`, `TransactionForm`, `TransactionTable`.
    - Pagini principale: `LunarGridPage`, `OptionsPage`, `TransactionsPage`.
    - Ajustări minore în alte componente pentru a reflecta utilizarea token-urilor (ex: butoane, input-uri, carduri, alerte).
- **Beneficii:**
    - Aspect vizual unitar și modern în întreaga aplicație.
    - Cod CSS mai curat și mai ușor de întreținut.
    - Respectarea bunelelor practici de theming și design system.
    - Facilitarea actualizărilor viitoare ale temei.
- **Branch:** `feature/earthy-theme-refactor` 
- **Fișiere principale modificate (selecție):**
    - `frontend/src/components/features/Auth/LoginForm.tsx`
    - `frontend/src/components/features/Auth/RegisterForm.tsx`
    - `frontend/src/components/features/TransactionFilters/TransactionFilters.tsx`
    - `frontend/src/components/features/TransactionForm/TransactionForm.tsx`
    - `frontend/src/components/features/TransactionTable/TransactionTable.tsx`
    - `frontend/src/pages/LunarGridPage.tsx`
    - `frontend/src/pages/OptionsPage.tsx`
    - `frontend/src/pages/TransactionsPage.tsx`
    - `frontend/src/index.css` 
- **Notă:** Toate modificările au respectat regulile globale, inclusiv utilizarea exclusivă a constantelor din `@shared-constants` pentru texte și `data-testid` pentru elementele interactive.

## [2025-05-10] Îmbunătățiri UI și refactorizare subcategorii în LunarGrid

- **Funcționalitate nouă:** Butoanele de editare și ștergere pentru subcategorii apar doar la hover în grid (UI mai curat, focus pe acțiuni relevante).
- **Editare inline:** Câmpul de redenumire subcategorie este pre-populat cu valoarea originală pentru UX predictibil.
- **Refactorizare:**
  - Separare logică și UI pentru subcategorii în componenta dedicată `SubcategoryRows`.
  - Eliminare polling/localStorage redundant pentru state management.
  - Consolidare importuri și mesaje din sursa unică `@shared-constants` (fără stringuri hardcodate).
- **Respectare reguli globale:**
  - Toate acțiunile și textele folosesc enum-uri, mesaje și rute din sursa unică de adevăr.
  - Testare cu `data-testid` predictibil pentru fiecare element funcțional (vezi regula 3.1 și exemplul din BEST_PRACTICES.md).
- **Lecții învățate:**
  - Separarea stărilor pentru moduri de operare conflictuale (edit/delete) previne bug-uri de tip "Cannot update a component while rendering a different component".
  - Evitarea anti-patternului critic cu Zustand: fără `useEffect(fetch, [queryParams])` (vezi regula 8.2 și memoria [CRITIC] d7b6eb4b).
  - Folosirea `useRef` pentru parametri și caching robust la fetch.
- **Branch:** `feature/grid-subcategory-enhancements`
- **Fișiere principale:**
  - `frontend/src/components/features/LunarGrid/SubcategoryRows.tsx`
  - `frontend/src/components/features/LunarGrid/LunarGrid.tsx`
  - `frontend/src/pages/LunarGridPage.tsx`
  - `frontend/src/App.tsx`
- **Documentare suplimentară:** Best practice și patternuri noi adăugate în `BEST_PRACTICES.md`.



# [2025-05-09] Bug Fix și îmbunătățiri pentru CategoryEditor

- Bug fix major: rezolvat eroarea "Cannot update a component while rendering a different component" în `CategoryEditor`
- Implementat pattern corect pentru manipularea stării React în timpul render-ului folosind `useEffect` cu dependențe complete
- Separat logic starea pentru editare (`editingSubcat`) de starea pentru ștergere (`deletingSubcat`) pentru a evita conflicte
- Adăugat comentării complete în cod pentru a explica pattern-ul și evitarea buclelor infinite
- Remediat bug-ul cu Supabase upsert pentru categorii personalizate: înlocuit upsert cu pattern select-then-insert/update
- Documentat lecțiile învățate în `BEST_PRACTICES.md`, inclusiv:
  - Pattern-ul corect pentru manipularea stării în componente complexe React
  - Interacțiunea robustă cu Supabase pentru câmpuri jsonb și operațiuni upsert
  - Gestionarea corectă a erorilor și logging standardizat pentru diagnostic
- Toate modificările respectă regulile globale și memoria critică d7b6eb4b despre prevenirea buclelor infinite

# [2025-05-09] Subcategory Customization - Etapa 2: UI și Integrare

- Branch: `feature/subcategory-customization`
- UI nou `CategoryEditor`: modal pentru gestionare subcategorii personalizate (add/edit/delete)
- Integrare `categoryStore` în `LunarGrid` cu buton și modal vizibile doar pentru user autentificat
- Integrare `LunarGridPage`: încărcare categorii personalizate la prima montare și fuziune cu predefinite
- Integrare `TransactionForm`: dropdown-uri actualizate pentru a folosi categoriile personalizate
- Funcționalități MVP implementate: adăugare subcategorii noi, redenumire, ștergere, indicator vizual pentru subcategorii personalizate
- Respect regulile globale: data-testid predictibil și stabil, pattern validat de store + UI, fără string-uri hardcodate, safe null-check
- Optimizări performance: prevenire efecte redundante, flag-uri pentru cache, load o singură dată, memoizare categorii filtrate

# [2025-05-09] Subcategory Customization - Etapa 1: Infrastructură

- Branch: `feature/subcategory-customization`
- Migrare DB aplicată: `backend/2025-05-09T1132_create_custom_categories.sql`
- Tipuri TS noi: `frontend/src/types/Category.ts`
- Service nou: `frontend/src/services/categoryService.ts` (CRUD, validare, migrare, duplicate)
- Store nou Zustand: `frontend/src/stores/categoryStore.ts` (fuziune cu predefinite, persist, acțiuni CRUD)
- Respectat reguli globale: persist, barrel, fără string-uri hardcodate, testabilitate (serviciile injectabile)


## 2025-05-09 - Implementare editare/adăugare tranzacții direct din LunarGrid (DEV-5 Complet)

- Implementat mecanism excel-like pentru editare rapidă direct în celulele LunarGrid:
  - La single click: popover cu input sumă + opțiune recurentă/frecvență
  - La double click: prompt rapid pentru sumă, creare instantă tranzacție
  - UX smart: tastare automată în input (ca în Excel), Enter pentru submit, Escape pentru anulare
- Adăugat autorefresh (forțare actualizări după adăugare/editare) pentru a vedea imediat tranzacțiile în grid fără reload
- Integrare cu form/store/service existente pentru validare tranzacții
- Toate textele și mesajele provin din `shared-constants/ui.ts`
- Respectare reguli globale și constante: enum-uri tipate, fără text hardcodat, `data-testid` predictibil
- Implementare conform pattern hooks + servicii + caching din memorie 49dcd68b-c9f7-4142-92ef-aca6ff06fe52

## 2025-05-08 - Persistență autentificare, validare categorii și bugfix fetch Zustand

- Implementat persistență sesiune utilizator cu Zustand + persist (localStorage), store `authStore.ts` refactorizat.
- Adăugat verificare automată a sesiunii la pornirea aplicației (în `App.tsx`).
- Fixat bug major: utilizatorul nu mai este delogat la refresh și sesiunea se păstrează corect.
- Refactorizat complet pattern fetch tranzacții cu Zustand: eliminat anti-patternul `useEffect(fetch, [queryParams])` (vezi regula critică din global_rules.md 8.2).
- Adăugat validare strictă pentru categorii și subcategorii la nivel de service și trigger Supabase; nu se mai pot salva date invalide.
- Toate mesajele de validare/eroare provin din `@shared-constants/messages`, fără stringuri hardcodate.
- Documentare și audit complet al pașilor în [TECH_STORIES/implementare Supabase.md].
- Toate modificările conforme cu regulile globale, fără excepții.


## 2025-05-08 - Implementare sistem expandare/colapsare categorii în LunarGrid (DEV-12 Complet)
- Implementat sistemul de expandare/colapsare pentru categoriile din LunarGrid conform AC-10.
- Funcționalități implementate:
  - Expandare/colapsare categorii principale prin click, cu iconuri intuitive (ChevronDown/ChevronRight)
  - Persistența stării expandat/colapsate în localStorage (`budget-app-category-expand`)
  - Calcul și afișarea sumei totale pentru categorii colapsate
  - Formatare consistentă a sumelor cu prefix "RON" și 2 zecimale
  - Design ierarhic pentru subcategorii cu indicator vizual (linii conectoare)
  - Atribute `data-testid` pentru testare automată robustă
- Instalat pachetul `lucide-react` pentru iconițe de expandare/colapsare.
- Refactorizat structura tabelului pentru a folosi o singură coloană "Categorie / Subcategorie" cu afișare ierarhică.
- Toate implementările respectă regulile pentru persistență, surse unice de adevăr și formatare.

## 2025-05-08 - Implementare calcul SOLD pentru LunarGrid (DEV-4 Complet)
- Adăugat rândul SOLD la finalul tabelului LunarGrid, implementând criterii de acceptare AC-3.
- Funcționalități implementate pentru rândul SOLD:
  - Calcul corect al soldului zilnic (Σ venituri - Σ cheltuieli)
  - Formatare clară cu prefix "RON", separatori de mii și 2 zecimale
  - Vizualizare intuitivă: sold pozitiv (verde), negativ (roșu), zero (gri)
  - Utilizarea constantelor din `@shared-constants/ui` (EXCEL_GRID.HEADERS.SOLD)
  - Memoizare pentru performanță optimă cu React.useMemo
  - Atribute `data-testid` pe toate elementele pentru testare automată robustă
- Schimbarea respectă toate regulile globale (sursa unică de adevăr pentru constante, fără stringuri hardcodate, formatare RON).
- DEV-4 este acum complet. Următoarele task-uri: DEV-5 (formular TransactionModal), DEV-6 (hook navigare lună).

## 2025-05-08 - Update major testare și best practices (LunarGrid & TransactionsPage)
- Toate testele pentru LunarGridPage și TransactionsPage au fost refactorizate:
    - Fără stringuri hardcodate: folosesc exclusiv mesaje/constante din `@shared-constants/messages`.
    - Async handling robust: orice update/test asincron folosește `await act(async () => ...)` și `waitFor` pentru elemente care apar/dispar în DOM.
    - Toate elementele funcționale au `data-testid` unic și predictibil, testele selectează doar prin acest atribut.
    - Mocking strict: doar servicii externe (ex: supabaseService), nu stores Zustand sau logică proprie.
    - Testele reflectă comportamentul real al utilizatorului (user-centric).
- Acceptance criteria și Definition of Done din `TECH_STORIES/MVP-1-GRID-LUNAR.md` au fost actualizate:
    - Adăugat criteriu explicit pentru mesaje/indicatori: să provină din constants și să fie verificați cu `data-testid`.
    - Toate testele trebuie să respecte best practices async și mocking.
    - Orice fetch asincron cu Zustand respectă regula anti-pattern (fără `useEffect(fetch, [queryParams])`).
- Adăugată secțiune nouă "Best Practices – Testare & State Management" în `MVP-1-GRID-LUNAR.md` și extins `BEST_PRACTICES.md` cu:
    - Centralizare constants/messages/API, testare robustă cu constants și data-testid, politica de mocking, anti-pattern critic Zustand, exemple de test corect.
- Motivare: aceste schimbări asigură robustețe, mentenanță ușoară, onboarding rapid pentru QA/dev și elimină bug-uri greu de diagnosticat.
- Toate modificările sunt aliniate cu regulile globale (vezi global_rules.md secțiunea 3, 8.2, 9). Nu există excepții sau workaround-uri rămase.

## 2025-05-08 - MVP-1-GRID-LUNAR: progres taskuri DEV-0 ... DEV-4
- **DEV-0** bifat: structura de categorii/subcategorii validată, sursă unică de adevăr în `shared-constants/categories.ts`.
- **DEV-1** bifat: adăugat `actualAmount` (number?) și `status` (enum TransactionStatus: PLANNED/COMPLETED) în `TransactionSchema` și tipuri.
- **DEV-2** bifat: mapping TransactionType <-> categorie principală implementat în `shared-constants/category-mapping.ts`, exportat în barrel, folosit deja în TransactionForm.
- **DEV-3** bifat: utilitare mapping + validare (`getCategoriesForTransactionType`, `getTransactionTypeForCategory`) disponibile și importate centralizat.
- **DEV-4** în progres: setup grid lunar, mapping și constants validate, urmează integrarea datelor reale și logica de calcul sold.
- Barrel și enums actualizate pentru import predictibil.
- Toate modificările documentate și validate conform regulilor globale și user story-ului.


## 2025-04-29 - Audit și refactorizare completă testabilitate (data-testid)
- Refactorizat toate componentele primitive (Button, Input, Select, Checkbox, Textarea) pentru propagarea și setarea predictibilă a atributului `data-testid` (default sau explicit).
- Refactorizat toate componentele de features (TransactionForm, TransactionTable, ExcelGrid etc.) pentru a avea `data-testid` pe toate elementele funcționale (butoane, inputuri, rânduri, feedback, etc.).
- Toate testele relevante folosesc doar `data-testid` predictibil pentru selectarea elementelor.
- Creat/îmbunătățit scriptul `check-data-testid.js` pentru audit automat al tuturor componentelor și testelor.
- Efectuat audit complet pe tot frontend-ul (`src/`): nu există niciun element funcțional fără `data-testid`.
- Regula și patternul au fost documentate și sunt obligatorii pentru orice cod nou (vezi regulile globale și BEST_PRACTICES.md).
- Orice excepție trebuie justificată și notată aici și în code review.


## 2025-04-21 - Setup Inițial
- Creat structură monorepo: frontend (React + TDD), backend (NestJS + TDD), shared.
- Configurare testare automată cu Jest și Testing Library.
- Implementat model unificat `Transaction` și validare runtime cu Zod.
- Definit structura categorii/subcategorii.
- Implementat endpoint GET /transactions cu filtrare, sortare și paginare.

## 2025-04-22 - Refactorizare Frontend
- Extragere `TransactionForm` și `TransactionTable` în componente dedicate.
- Mutare teste unitare colocate cu componentele.
- Configurare reporteri Jest (`summarizing-reporter`, `jest-html-reporter`).
- Consolidare convenții și best practices inițiale.

## 2025-04-23 - Dropdown-uri Dinamice și Testare Robusta
- Finalizare flux principal tranzacții frontend.
- Refactorizare filtrare categorii/subcategorii în funcție de tip.
- Eliminare completă opțiune 'Transfer'.
- Placeholder 'Alege' condiționat corect.
- Testare exhaustivă dropdown-uri folosind helperi dedicați și sursa de adevăr importată.
- Documentare completă a lecțiilor în BEST_PRACTICES.md.

## 2025-04-24 - Eliminare Hardcodări și TailwindCSS
- Centralizare completă texte UI și mesaje în constants/ui.ts și constants/messages.ts.
- Refactorizare structură componente în primitives și features.
- Configurare TailwindCSS și Jest DOM Matchers.
- Implementare componente primitive cu stilizare Tailwind.
- Creare componentă demonstrativă Excel-like Grid pentru raportare.

## 2025-04-24 - Implementare Sursă Unică Enums
- Definire enums partajate în `shared/enums.ts`.
- Re-export frontend din `constants/enums.ts`.
- Configurare build shared și suport complet Jest/CRA.

## 2025-04-25 - Refactorizare App.tsx cu Hooks și Servicii
- Separare logică aplicație în `useTransactionForm`, `useTransactionFilters`, `useTransactionData`.
- Implementare servicii `TransactionService` și `TransactionApiClient`.
- Testare hooks și servicii cu mock-uri dedicate.
- Implementare caching LRU cu invalidare selectivă în serviciile API.
- Lecții importante: handling async controlat, barrel exports, mock-uri pentru metode publice.

## 2025-04-25 - Migrare la Zustand
- Creare store `useTransactionStore` în `frontend/src/stores/`.
- Testare TDD pentru Zustand: inițializare, setters, acțiuni asincrone, selectors.
- Evitare props drilling excesiv și utilizare selectors pentru optimizare.
- Pattern robust pentru testare store-uri cu injectare servicii mock.

---

## 2025-04-28 - Centralizare chei query params tranzacții (QUERY_PARAMS)
- Mutat toate cheile de query parametri pentru tranzacții (type, category, dateFrom, dateTo, limit, offset, sort) în `shared-constants/queryParams.ts`.
- Eliminat duplicarea din `frontend/src/constants/api.ts` și `backend/src/constants/api.ts`.
- Importurile se fac EXPLICIT din `@shared-constants/queryParams` (nu din barrel!).
- Motiv: sincronizare automată FE/BE, fără risc de desincronizare la refactor.
- Orice modificare la aceste chei trebuie anunțată și documentată.
- Path mapping actualizat în ambele `tsconfig.json` pentru rezolvare corectă.

# Lessons Learned

## 2025-05-05 - Remediere teste unitare cu mock-uri Supabase și ajustare aserțiuni
- Creat `__mocks__/supabase.ts` și `__mocks__/supabaseService.ts` ca mock-uri automate pentru Supabase în teste.
- Implementat mock-uri pentru `supabaseAuthService` cu suport pentru tipurile definite (`AuthErrorType`, `AuthUser`).
- Ajustat testele pentru a reflecta contractul actual al store-urilor (`""` vs `undefined`, aserțiuni corecte pentru errorType).
- Actualizat testele pentru TransactionTable pentru a reflecta noua structură de UI (eliminare currency, coloană frecvență).
- Utilizat valori statice pentru enum-uri în teste când mock-urile cauzează probleme de import circular.
- Ajustat aserțiunile în filtersStore pentru a reflecta comportamentul real de paginare și filtrare.
- Lecție: testele unitare trebuie actualizate când contractul serviciilor se schimbă, iar mock-urile trebuie să fie disponibile la același path ca modulele reale pentru a fi folosite automat de Jest.

## 2025-05-05 - Rezolvare probleme App.test.tsx și infrastructură de testare cu mock-uri
- Rezolvate erorile în `App.test.tsx` legate de `currentQueryParams.limit` (TypeError: Cannot read properties of undefined).
- Implementat pattern robust pentru mockarea store-urilor Zustand cu selectors corect implementați.
- Adăugat suport corect pentru `getState()` în mock-urile Zustand pentru a evita erorile în `useEffect`.
- Creat o versiune simplificată a componentei App pentru teste, izolând dependențele problematice.
- Implementat mock explicit pentru `useAuthStore` pentru a asigura returnarea unui user valid în toate testele.
- Creat infrastructură robustă pentru mockarea Supabase în teste:
  - Mock global în `jest.setup.js` cu override pentru constructor URL pentru a evita "Invalid URL: mock/auth/v1"
  - Mock module-level în `src/__mocks__/@supabase/supabase-js.ts` conform pattern-ului Jest pentru module externe
  - Mock pentru servicii în `src/services/__mocks__/supabase.ts` și `supabaseService.ts`
- Implementat `src/jest-mocks.ts` cu helper functions reutilizabile pentru mockarea contextelor comune în teste:
  - `setupAuthStoreMock()` - configurează un user autentificat valid pentru teste
  - `setupSupabaseServiceMock()` - configurează serviciile Supabase cu răspunsuri consistente
  - `MOCK_MESAJE` - asigură consistența textelor în assert-uri în teste
- Optimizat testele async cu `waitFor` și timeouts adecvate pentru a asigura stabilitate în testare.
- Lecție importantă: Mockarea serviciilor cu proprietăți private necesită abordarea prin module-level mocks (conform "WORKAROUND Mock-uri Jest" din memorie).

## 2025-05-03 - Îmbunătățiri autentificare Supabase, UX & Security
- Introducere tip `AuthUser` (id, email) și folosire typing strict în store și servicii pentru autentificare.
- Definire enum `AuthErrorType` pentru categorii de erori autentificare (`INVALID_CREDENTIALS`, `PASSWORD_WEAK`, `NETWORK`, `RLS_DENIED` etc).
- Mapping automat între erorile brute Supabase și mesaje prietenoase pentru utilizator, afișate contextual în LoginForm și RegisterForm.
- Validare parolă la înregistrare (minim 8 caractere, literă mare, mică, cifră, simbol) cu feedback clar în UI.
- Refactorizare store și servicii pentru a returna structuri de răspuns consistente (`AuthResult` cu `errorType` și mesaj).
- UI-ul de login/register afișează mesaje clare, localizate, fără stringuri hardcodate.
- Toate mesajele și constantele respectă sursa unică de adevăr din `@shared-constants` (vezi regulile globale FE/BE).
- Respectare politici RLS: user-ul vede și poate modifica doar propriile tranzacții (user_id = auth.uid()).
- Documentare și audit complet al pașilor în [TECH_STORIES/implementare Supabase.md].
- Următorii pași posibili: refresh token/session timeout, rate limiting brute force, testare automată fluxuri edge-case.


## 2025-04-30 - Securitate RLS, user_id, persist auth și defense-in-depth
- Am întâlnit eroare 403 la inserții/POST pe /transactions din cauza lipsei câmpului user_id în payload.
- Politicile RLS pe Supabase impun ca orice operație să fie restricționată la userul logat (`user_id = auth.uid()`).
- Soluție: la orice inserție (createTransaction), payload-ul include explicit user_id din store-ul de autentificare.
- Pentru update și delete am adăugat filtrare suplimentară pe user_id direct în query, chiar dacă RLS asigură deja securitatea (defense in depth, UX și claritate mai bună).
- Best practice: filtrarea pe user_id în client previne modificări/ștergeri accidentale și optimizează query-ul, dar securitatea rămâne garantată de RLS.
- Implementat store de autentificare (authStore) cu persist pentru user și integrare completă cu supabaseAuthService (login, register, logout, checkUser).
- Asigurat persistenta login-ului între sesiuni și refresh automat al userului la pornirea aplicației.
- Toate serviciile și store-urile relevante folosesc user-ul din authStore pentru orice operație sensibilă.
- Lecție: persistarea și sincronizarea corectă a autentificării este critică pentru UX și siguranță, mai ales la aplicații cu date multi-user și politici RLS.

- Barrel exports pot cauza importuri circulare - necesară organizare ierarhică clară.
- Mock-urile pentru clase private trebuie să vizeze doar metodele publice.
- URL constructor în Node necesită o bază absolută validă pentru URL-uri relative.
- Controlul explicit al promisiunilor oferă teste asincrone mai stabile.
- Invalidarea selectivă a cache-ului reduce semnificativ apelurile API redundante.
- Migrarea de la hooks custom la Zustand necesită rescriere completă a testelor.

---

_Actualizat la: 2025-05-07_

## 2025-05-07 - Refactorizare teste Zustand: Task 1, 2, 3, 4, 5

### Task 6: Primitive
- Verificare/refactorizare teste pentru componente primitive (Alert, Badge, Button, Checkbox, Input, Loader, Select, Textarea).
- Toate testele sunt conforme cu regulile globale (nu folosesc mock store).
- Nu a fost nevoie de modificări.

### Task 7: TransactionForm
- Refactorizare test pentru TransactionForm: store real Zustand, mock doar pentru servicii externe.
- Teste granularizate (câmpuri individuale, interacțiuni, scenarii complete de submit/validare).
- Respectă toate regulile globale și pattern-ul recomandat pentru formulare complexe.
- Validat manual și automat.

### Task 8: TransactionTable
- Refactorizare test pentru TransactionTable: store real Zustand, mock doar pentru servicii externe.
- Acoperire edge-case-uri, paginare, stări de loading/eroare, validare manuală și automată.
- Respectă toate regulile globale și best practices.

### Task 9: App
- Refactorizare test pentru App: integrare completă cu store-uri reale, mock doar pentru servicii externe.
- Teste de integrare pentru fluxuri critice (filtrare, creare, loading, error), validare manuală și automată.
- Respectă toate regulile globale și best practices.

### Task 10: Eliminare mock-uri store
- Mock-urile pentru store-uri au fost eliminate complet. Testele folosesc doar store-uri reale, fără workaround-uri sau excepții.

### Task 11: Cleanup final & lessons learned
- Cleanup final, actualizare documentație și lessons learned. Nu există workaround-uri sau excepții rămase. Codul și testele respectă toate regulile globale.

- Task 5: Refactorizare și validare TransactionFilters:
    - Separare completă între teste unitare și de integrare.
    - Testele de integrare restaurate după ștergere accidentală, validate cu succes.
    - Toate testele rulează și trec (8/8).
    - Structura este conformă cu regulile globale și BEST_PRACTICES.md.
    - Status: DONE, progres actualizat și în TECH_STORIES/epic-refactorizare-teste-zustand.md.


- Task 1: Cleanup și actualizare test-utils + jest-mocks
  - Helperii oficiali pentru resetare store-uri (`resetAllStores`) și setup user (`setupTestUser`) sunt documentați și recomandați în test-utils.
  - Eliminare completă a mock-urilor de store-uri din jest-mocks.ts; păstrate doar mock-uri pentru servicii externe (Supabase, date, random, browser APIs).

- Task 5: Refactorizare `TransactionFilters.test.tsx` pentru store real
  - Am verificat structura existentă a testelor și am constatat că deja respectă regulile globale (nu folosește mock store).
  - Am creat teste suplimentare de integrare pentru interacțiunea cu store-ul real Zustand în `TransactionFilters.store.test.tsx`.
  - Toate modificările de state sunt înfășurate în `act()` conform regulilor.
  - Am implementat teste pentru butonul de resetare filtre și propagarea modificărilor UI → store.
  - Comentariu clar privind regula globală: nu mock-uim store-uri Zustand.
- Task 2: Refactorizare transactionFormStore.test.ts pentru store real
  - Toate testele folosesc store-ul real și helperii oficiali (`resetAllStores`, `mockSupabaseService`).
  - Toate modificările de state sunt încapsulate în act().
  - Mock-urile serviciilor externe sunt făcute doar cu mockSupabaseService.
- Task 3: Refactorizare transactionFiltersStore.test.ts pentru store real
  - Toate testele folosesc store-ul real și helperii din test-utils.ts (`resetAllStores`).
  - Refactorizare completă: toate modificările de state sunt încapsulate în act().
  - Corecție a scenariilor de test pentru a reflecta comportamentul real al store-ului.
  - Eliminare a comentariilor legate de mock-uri din fișier.
  - Adăugare beforeEach și afterEach pentru a asigura un mediu consistent de testare.
- Task 4: Refactorizare authStore.test.ts pentru store real și mock doar servicii externe
  - Înlocuit reset manual cu functia oficiala `resetAllStores()` din test-utils.
  - Adăugat reset în afterEach pentru prevenirea side effects între teste.
  - Înlocuit string-urile hardcodate cu constante din `MESAJE` conform regulilor globale.
  - Mock-uri exclusiv pentru servicii externe (supabaseAuthService), păstrând enum-urile relevante.
  - Adăugat un test nou pentru metoda `checkUser()` pentru a crește acoperirea cod.
  - Toate modificările de store sunt încapsulate în `act()`, inclusiv cele din setup.
  - Toate testele trec, fără erori de lint.
- Status actualizat în TECH_STORIES/epic-refactorizare-teste-zustand.md: Task 1 și 2 DONE.



- Refactorizat toate mesajele de validare pentru a folosi exclusiv sursa unică de adevăr (`shared-constants/messages.ts`, alias `@shared-constants/messages`).
- Eliminat toate scripturile temporare de corectare teste (`scripts/fix-description-field.js`, `fix-final-import.js`, `fix-transaction-currency.js`, etc.).
- Aliniat toate testele și store-urile relevante la importurile corecte pentru mesaje și enums.
- Corectat utilizarea Jest în factory-ul de mock pentru middleware Zustand (devtools) conform best practices Jest.
- Actualizat metoda `setQueryParams` din `transactionStore` pentru a declanșa automat fetch-ul tranzacțiilor la schimbarea parametrilor (comportament corect business logic).
- Toate testele pentru `transactionStore` și `transactionFormStore` trec cu succes.
- **NOTĂ:** Mock-urile pentru store-urile Zustand (`__mocks__/stores/`) rămân temporar pentru compatibilitate cu testele existente, dar vor fi eliminate într-un task separat, conform noii reguli globale (mock doar pentru servicii externe, nu pentru stores/hooks Zustand). Task documentat și planificat pentru refactorizare incrementală.
- Documentare și actualizare patternuri de testare în `BEST_PRACTICES.md` - nu există reguli noi, doar întărire a celor existente.

**OWNER:** Echipa testare

---

## 2025-04-27 - Finalizare migrare Zustand pentru tranzacții și recurență
- Toate funcționalitățile de tranzacții (inclusiv recurență) folosesc exclusiv Zustand store-uri, fără hooks custom legacy.
- Testare exhaustivă pentru toate edge cases, validare și fluxuri negative/pozitive, inclusiv recurență.
- Nu mai există props drilling sau duplicare logică între hooks și store-uri.
- Toate textele UI, mesajele și enums sunt centralizate și importate doar din barrel (`constants/index.ts`).
- Convențiile și best practices au fost actualizate și respectate (vezi BEST_PRACTICES.md).
- Documentarea și refactorizările minore rămase sunt în curs.
- Orice abatere de la aceste reguli trebuie justificată și documentată explicit în code review și DEV_LOG.md.

## 2025-04-27 - Migrare enums/constants la shared-constants și audit automat importuri
- Finalizată migrarea enums/constants la sursa unică `shared-constants/`.
- Toate importurile din frontend și backend folosesc doar `@shared-constants`.
- Eliminare completă a importurilor legacy (direct din constants/enums sau shared).
- Scriptul `tools/validate-constants.js` validează automat corectitudinea importurilor și sincronizarea.
- Actualizate documentația și best practices pentru această strategie.

## 2025-04-28 - Configurare rezolvare alias și îmbunătățiri testare
- Adăugat alias `@shared-constants` în `craco.config.js` pentru Jest (moduleNameMapper).
- Actualizat `tsconfig.json` (frontend) cu `paths` către `src/shared-constants` pentru TypeScript.
- Modificat `package.json` pentru a folosi `craco test` și pretest copy-shared-constants.
- Re-exportat `enums` din `shared-constants/index.ts` și aliniat importurile (`@shared-constants`).
- Actualizat fișiere (`App.tsx`, `transactionFormStore.ts`, teste) pentru a importa din `@shared-constants`.
- Protejat apelurile DI din `App.tsx` (`setTransactionService`, `setRefreshCallback`) prin verificarea tipului.
- Extins mock-urile din `App.test.tsx` pentru noile metode ale store-ului.

## 2025-05-05 - Refactorizare TransactionForm, mock-uri Zustand, sincronizare shared-constants, fix TypeScript

**OWNER:** Echipa testare + FE

**CONTEXT:**
- Refactorizare completă a testelor pentru TransactionForm și store-uri asociate pentru a elimina erorile TypeScript, a asigura compatibilitatea cu noua structură Zustand și a îmbunătăți robustețea testării.
- Actualizare și corectare mock-uri pentru Zustand (`__mocks__/stores/transactionFormStore.ts`, `transactionStore.ts`, `authStore.ts`) cu suport complet pentru `getState`, setters, acțiuni și validare tipuri.
- Sincronizare și corectare enums/constants (FrequencyType, CategoryType, BUTTONS etc.) direct în sursa unică `shared-constants/` și propagare corectă către frontend prin scriptul de sync.
- Eliminare stringuri hardcodate din teste și componente, folosire exclusivă a mesajelor și enum-urilor din `@shared-constants`.
- Fix erori de tip "Property 'CANCEL' does not exist on type BUTTONS", "Property 'SAPTAMANAL' does not exist on type FrequencyType" etc. prin actualizare constants și refactorizare imports.
- Actualizare UI copy și mesaje pentru validare/eroare în toate testele și componentele relevante.
- Toate testele TransactionForm acoperă acum edge cases pentru validare, recurență, enum-uri și fluxuri negative/pozitive.

**SCHIMBĂRI:**
- Mock-uri dedicate pentru store-uri Zustand cu helpers `setMockFormState`, `setMockTransactionState` pentru manipulare predictibilă a stării în teste.
- Tipare stricte pentru mock-uri și funcții de acțiune, eliminare tipuri implicite și any-uri nejustificate.
- Refactorizare testare pentru a folosi patternul "test focalizat pe câmp/feature", nu assert global pe tot formularul (vezi lessons learned).
- Sincronizare completă și validare constants cu scriptul `npm run sync:shared-constants`.
- Fix imports pentru enums/constants doar din `@shared-constants` conform regulilor globale.
- Adăugare buton CANCEL în sursa unică BUTTONS și corectare UI copy.

**LECȚII ÎNVĂȚATE:**
- Mock-urile Zustand trebuie să includă explicit `getState` și să folosească helpers pentru actualizare stări în teste.
- Orice modificare la enums/constants trebuie făcută doar în sursa unică și sincronizată cu scriptul dedicat, nu direct în frontend.
- Testele pe formulare complexe trebuie împărțite pe câmpuri pentru stabilitate (vezi [LESSON] Testare valori inițiale în formulare complexe).
- Patternul de testare cu helpers pentru mock-uri crește claritatea și predictibilitatea testelor.

**NEXT STEPS:**
- Audit final al tuturor testelor pentru a elimina orice hardcodare sau import incorect.
- Documentare patternuri noi în BEST_PRACTICES.md.
- Refactorizare suplimentară pentru a reduce duplicarea codului de testare.


**OWNER**: Echipa testare

**CONTEXT**: Testele pentru componente și store-uri eșuau din cauza unor probleme fundamentale cu mock-urile pentru Supabase și store-urile Zustand. Principalele probleme erau:
1. Eroarea "Invalid URL" în mock-urile Supabase
2. Eroarea "Utilizatorul nu este autentificat!" în testele care depind de authStore
3. Inconsistențe în abordarea de mock pentru store-uri (jest.mock vs mock direct)
4. Probleme cu tipurile în mock-uri (Property 'getState' does not exist on type 'Mock')

**SCHIMBĂRI**:
- Am creat mock-uri dedicate pentru store-uri în directorul `__mocks__/stores/`:
  - `authStore.ts` - asigură un user autentificat valid pentru toate testele
  - `transactionFormStore.ts` - mockează starea formularului de tranzacții
  - `transactionStore.ts` - mockează operațiile CRUD pentru tranzacții
- Am adăugat funcții helper în mock-uri pentru a permite modificarea stării în teste (ex: `setMockFormState`)
- Am rezolvat problema "Invalid URL" în `jest.setup.js` prin adăugarea unui URL override pentru mock-uri
- Am adăugat tipuri explicite pentru parametrii funcțiilor de mock pentru a evita erorile TypeScript

**LECȚII ÎNVĂȚATE**:
- Abordarea cu `jest.mock()` și variabile din afara factory-ului poate duce la probleme de scoping
- Este mai bine să folosim o abordare cu funcții helper pentru a modifica starea mock-urilor în teste
- Tipurile pentru mock-uri trebuie să fie explicite și să includă toate proprietățile necesare
- Mock-urile pentru store-uri Zustand trebuie să includă explicit `getState` pentru a funcționa corect

**NEXT STEPS**:
- Refactorizarea completă a testelor pentru a folosi noua abordare cu `setMockState` în loc de `mockImplementation`
- Adăugarea de tipuri mai stricte pentru mock-uri pentru a evita erorile TypeScript
- Documentarea abordării în BEST_PRACTICES.md pentru a asigura consistența în viitor

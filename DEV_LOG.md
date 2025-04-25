# Dev Log / Changelog

## [2025-04-22] Refactorizare modulară frontend, testare și best practices
- Extragere formular tranzacție (`TransactionForm`) și tabel tranzacții (`TransactionTable`) în componente dedicate, cu tipuri și props explicite
- Mutare și colocare teste unitare pentru fiecare componentă în subfolderul corespunzător (`components/TransactionForm/TransactionForm.test.tsx` etc)
- `App.tsx` devine container, fără logică de UI duplicată
- Adăugare și configurare reporteri Jest: `jest-summarizing-reporter` (terminal) și `jest-html-reporter` (HTML)
- Îmbunătățire structură testare: acoperire pozitivă, negativă și edge pentru fiecare componentă
- Observații importante:
  - Pentru orice fetch în teste, trebuie mock global robust (ideal din `setupTests.ts`)
  - Pentru orice update de stare asincron în teste, folosește `await act(...)` sau `waitFor`
  - Console noise trebuie redus pentru claritate în rapoarte
- Toate convențiile și best practices noi au fost adăugate în `BEST_PRACTICES.md` și memorie
- Toate testele unitare și de integrare acoperă cazurile critice pentru UI și API
- Documentație și workflow actualizate conform progresului


## [2025-04-23] Refactorizare avansată TransactionForm, UX dropdown-uri, testare robustă

- Finalizare flux principal adăugare și vizualizare tranzacții (frontend)
- Testare exhaustivă TransactionForm, TransactionTable, TransactionFilters: acoperă toate scenariile critice și edge
- Pattern robust pentru dropdown-uri: helperi pentru filtrare, sursă de adevăr importată direct, wrapper cu stare locală pentru testare
- UI-ul rămâne placeholder, testare E2E și reguli test ID după finalizare funcționalitate
- Toate convențiile și lecțiile propagate în toate fișierele relevante (BEST_PRACTICES.md, DEV_LOG.md, PLAN.md, README.md, memorie)
- Următorul pas: focus pe funcționalitate, apoi stilizare și testare E2E

- Dropdown-urile pentru categorie și subcategorie filtrează dinamic opțiunile în funcție de tipul selectat (Venit, Cheltuială, Economisire).
- Testele pentru TransactionForm validează exhaustiv TOATE subcategoriile posibile pentru fiecare tip/categorie, folosind helper dedicat pentru extragere din sursa de adevăr din cod.
- Structura categorii/subcategorii este exportată explicit din codul sursă și importată direct în teste pentru a evita divergențe și hardcoding.
- S-a introdus un pattern robust pentru testarea dropdown-urilor controlate: helper pentru extragere subcategorii, aserțiuni exhaustive, verificare opțiuni și optgroup-uri.
- Orice modificare a structurii de categorii va fi reflectată automat și în teste, reducând mentenanța și riscul de bug-uri la filtrare.
- Toate testele TransactionForm trec fără erori, acoperind filtrarea dinamică și resetarea valorilor incompatibile.
- Lecțiile și best practices noi au fost documentate și propagate în toate fișierele relevante (BEST_PRACTICES.md, PLAN.md, README.md, memorie).
- Opțiunea 'Transfer' eliminată complet din UI și cod.
- Placeholderul 'Alege' la Tip apare doar dacă nu este selectat nimic, nu mai este opțiune după selectare.
- Testele acoperă: filtrare categorii/subcategorii, scenarii negative, resetare valori incompatibile, existență optgroup-uri, UX placeholder.
- Pentru testarea interacțiunii cu componente controlate, se folosește un wrapper cu stare locală (pattern recomandat pentru React + Testing Library).
- Toate convențiile și comentariile sunt în limba română.
- Toate testele TransactionForm trec fără erori.
- Best practices și lecții documentate pentru dropdown-uri controlate, UX placeholder și testare robustă.
- Toate fișierele relevante (BEST_PRACTICES.md, DEV_LOG.md, PLAN.md, README.md) au fost actualizate cu aceste concluzii și convenții.

## Changelog & Lessons Learned (2025-04-21)

- Toate dependențele NestJS, ts-jest, typescript și alte pachete critice au fost sincronizate la aceeași versiune în toate workspace-urile.
- Importurile între backend și shared au fost corectate pentru compatibilitate monorepo.
- Configurarea Jest/ts-jest a fost adusă la zi pentru a detecta și rula toate testele e2e.
- Adăugate class-validator și class-transformer pentru ValidationPipe.
- Toate testele e2e backend rulează și trec.
- A fost creat și completat fișierul BEST_PRACTICES.md cu toate regulile și lecțiile critice pentru dezvoltare și mentenanță.
- Orice lessons learned, workaround sau convenție nouă se documentează și în BEST_PRACTICES.md.

Acest fișier conține toate modificările, deciziile și pașii importanți din dezvoltarea aplicației de bugetare.

---

## [2025-04-21] Setup inițial
- Creat structura monorepo: frontend (React + TDD), backend (NestJS + TDD), shared (tipuri comune)
- Adăugat convenții stricte de workflow: TDD, commit-uri dese, fără breaking changes fără context
- Configurat testare automată cu Jest și Testing Library
- Rezolvat probleme de compatibilitate cu dependențe și configurare Jest
- Primul test frontend trecut cu succes
- README și memorie actualizate cu toate convențiile și filozofia de dezvoltare

## [2025-04-21] Categorii și subcategorii (TDD)
- Am definit structura de categorii și subcategorii (venituri, economii, cheltuieli) în `shared/categories.json`, cu chei de localizare pentru fiecare subcategorie
- Am scris teste TDD pentru validarea structurii și a cheilor de localizare
- Am rezolvat problema de import JSON în Jest folosind `require` și ajustând configul Jest
- Toate comentariile și documentația sunt în limba română, conform convențiilor

---

## [2025-04-21] Model unificat Transaction, validare runtime și TDD
- Adăugat modelul unificat `Transaction` în `shared/index.ts` (industry standard, compatibil cu YNAB, Mint, Revolut etc)
- Implementat validare runtime cu `zod` (`TransactionSchema` în `shared/transaction.schema.ts`)
- Adăugat teste TDD pentru model și schema zod (cazuri valide și invalide)
- Instalare `zod` în workspace-ul `shared/`
- Actualizat roadmap și README pentru a reflecta progresul
- Toate testele trec. Structura pregătită pentru integrare API bancar și validare date externe



> Orice modificare, decizie arhitecturală, bug fix sau feature nou trebuie adăugată aici cu dată și descriere clară!

---

## [2025-04-21 23:15] GET /transactions: filtrare, paginare, sortare

- Implementat suport pentru următorii query params la endpoint-ul GET `/transactions`:
  - `type` (string, opțional): filtrează după tipul tranzacției (`income`, `expense`, `saving`, `transfer`)
  - `category` (string, opțional): filtrează după categorie
  - `dateFrom` (string, opțional, format YYYY-MM-DD): tranzacții cu data >= acest parametru
  - `dateTo` (string, opțional, format YYYY-MM-DD): tranzacții cu data <= acest parametru
  - `limit` (number, opțional, default 20): câte rezultate să returneze (paginare)
  - `offset` (number, opțional, default 0): de la ce index să înceapă (paginare)
  - `sort` (string, opțional): câmp după care se face sortarea (`amount`, `date`, `id`, `category`, `type`). Prefix `-` pentru descrescător (ex: `sort=-amount`).

- Structura răspunsului pentru GET `/transactions`:
```json
{
  "data": [ /* array de tranzacții */ ],
  "total": 100, // numărul total de tranzacții după filtrare
  "limit": 20,  // limită folosită pentru paginare
  "offset": 0   // offset folosit pentru paginare
}
```

- Toate testele e2e pentru aceste funcționalități au trecut.


## [2025-04-24] Eliminare completă hardcodări frontend

- Toate hardcodările de tip, categorie, frecvență, monedă, texte UI, mesaje, valori default și endpoint-uri au fost eliminate din frontend.
- Enumuri, structuri de categorii/subcategorii, UI, mesaje, valori default și API sunt centralizate în `constants/`.
- Testele folosesc import direct din sursa de adevăr, fără stringuri hardcodate.
- Pattern robust: helperi pentru extragere, aserțiuni exhaustive, orice modificare a structurii se reflectă automat și în teste.
- Status: **FĂRĂ HARDCODĂRI - FINALIZAT**
- Impact: mentenanță mult redusă, testare exhaustivă, consistență și siguranță crescută în evoluția codului.

### [2025-04-24] Decizie: Centralizare completă mesaje vizibile utilizatorului
- Toate mesajele vizibile utilizatorului (erori, succes, avertismente, confirmări, prompturi) sunt centralizate în `frontend/src/constants/messages.ts`.
- Nu se acceptă string-uri hardcodate pentru aceste mesaje în componente.
- Orice dezvoltator care adaugă sau modifică o componentă trebuie să folosească exclusiv constantele definite în acest fișier pentru mesaje către utilizator.
- Orice modificare, excepție sau extensie la această regulă trebuie documentată și implementată imediat.
- Status: **FĂRĂ HARDCODĂRI DE MESAJ VIZIBIL - FINALIZAT**

### [2025-04-24] Decizie: Centralizare completă texte UI
- Toate textele vizibile din UI (labeluri, butoane, dropdown-uri, placeholdere, opțiuni etc.) au fost extrase și centralizate în `frontend/src/constants/ui.ts`.
- S-a verificat că niciuna dintre componente nu mai folosește string-uri hardcodate pentru UI.
- S-a introdus această regulă ca best practice obligatoriu și s-a documentat în `BEST_PRACTICES.md`.
- Orice dezvoltator care adaugă sau modifică o componentă trebuie să respecte acest pattern.

---

### [2025-04-24] Convenții noi pentru testare și UI
- Orice nouă componentă sau test trebuie să respecte patternul de centralizare a textelor UI și a helperilor de test.
- Toate textele vizibile în UI (labeluri, butoane, dropdown-uri, placeholdere, opțiuni) se extrag și se centralizează în constants/ui.ts.
- Nicio componentă nu are voie să folosească string-uri hardcodate pentru UI.
- Orice helper sau mock folosit în mai multe teste trebuie centralizat în test/helpers.ts sau test/mockData.ts.
- Dacă apar noi stringuri sau helpers, centralizează-le imediat.
- Convențiile și lecțiile învățate se documentează imediat în BEST_PRACTICES.md, DEV_LOG.md și în memorie.
- Testele trebuie să fie DRY, robuste și ușor de întreținut.

### [2025-04-24] Refactorizare structură componente și rezolvare avertismente Tailwind

- Restructurare completă a directoarelor de componente pentru organizare clară și scalabilă:
  - `components/primitives/`: componente mici, generice, reutilizabile (Button, Input, Select, Checkbox etc.)
  - `components/features/`: componente complexe, specifice aplicației (TransactionForm, TransactionTable, TransactionFilters)
- Eliminare director vechi `components/[ComponentName]`
- Actualizare importuri în toate fișierele pentru a reflecta noua structură
- Rezolvare erori de tipuri Jest DOM matchers prin:
  - Adăugare fișier `src/types/jest-dom.d.ts` pentru a defini tipurile `toBeInTheDocument`, `toHaveValue`, etc.
  - Actualizare `tsconfig.json` pentru a include tipurile necesare
- Configurare tooling pentru Tailwind CSS:
  - Instalare extensie VSCode Tailwind CSS IntelliSense
  - Adăugare configurare VS Code în `.vscode/settings.json` pentru a elimina avertismentele legate de directivele Tailwind
  - Adăugare comentariu `/* tailwindcss */` în fișierele CSS pentru a ajuta IntelliSense

### [2025-04-24] Finalizare implementare Tailwind CSS și componenta Excel-like

- Finalizat toate punctele din tech story pentru Tailwind CSS
- Actualizat App.tsx pentru a folosi clase Tailwind în loc de stiluri inline
- Verificat că componentele primitive (Button, Input, Select) sunt deja implementate și folosesc clasele Tailwind
- Creat o componentă exemplu de tip Excel-like grid (`ExcelGrid`) care demonstrează capabilitățile Tailwind pentru UI-uri complexe
- Implementat baza pentru funcționalitățile viitoare de raportare și analiză bugetară
- Actualizat documentele TECH_STORIES, BEST_PRACTICES.md și memorii pentru a reflecta progresul

### [2025-04-24] Implementare teste unitare TDD pentru componentele primitive

- Implementate teste unitare complete pentru principalele componente primitive:
  - `Button`: teste pentru variante, disabled, clasele CSS, handlerul onClick
  - `Input`: teste pentru label, eroare, clasele CSS, introducere de text
  - `Select`: teste pentru opțiuni, placeholder, selectare, clasele CSS
  - `Checkbox`: teste pentru bifare/debifare, label, clasele CSS
  - `Textarea`: teste pentru introducere text, label, clasele CSS
  - `Badge`: teste pentru toate culorile (primary, success, error, warning, info), clasele de bază și personalizate
  - `Loader`: teste pentru afișarea corectă a animației, textului și accesibilitate
- Toate testele respectă conventionțiile de limba română pentru descrieri și mesaje
- Instalat și configurat `@testing-library/user-event` pentru testarea interacțiunilor utilizatorului
- Teste colocate cu componentele (în același director) pentru o mai bună organizare
- Acoperire completă a funcționalităților și props-urilor pentru toate componentele primitive
- Toate textele vizibile în UI sunt centralizate în constants/ui.ts, inclusiv textul "Se încarcă..." din Loader
- Corecții în componentele TransactionForm și Select pentru validarea corectă a categoriilor și afișarea placeholderului
- Toate cele 110 teste din aplicație trec cu succes

### [2025-04-24] Implementare sursă unică de adevăr pentru enums
- Implementată soluția definitivă pentru regula "sursă unică de adevăr pentru enums".
- Toate enums comune (TransactionType, CategoryType, FrequencyType) sunt acum definite și menținute exclusiv în `shared/enums.ts`.
- Configurat build corect pentru shared: 
  - `shared/package.json`: `"main": "./dist/index.js"`, `"types": "./dist/index.d.ts"`
  - `shared/tsconfig.json`: `"include": ["**/*.ts"]` pentru compilarea tuturor fișierelor
- Realizat pattern de re-export prin proxy care evită problemele de configurare Jest/CRA:
  - `frontend/src/constants/enums.ts` conține doar: `export * from '../../../shared/dist/enums'`
  - Importurile din componente rămân neschimbate: `import { TransactionType } from '../../constants/enums'`
- Avantaje semnificative:
  - Eliminare totală a inconsistențelor dintre frontend și backend
  - Mentenanță redusă (modificări doar în shared, propagă automat)
  - Zero probleme de configurare Jest/Webpack/React
  - Compatibilitate 100% cu toolchain-ul existent
- Toate testele rulează și trec fără erori.

### [2025-04-25] Refactorizare App.tsx cu Custom Hooks și Pattern-ul Service

#### Arhitectură modulară și separarea responsabilităților
- Finalizată refactorizarea `App.tsx` utilizând arhitectura cu custom hooks și servicii:
  - `useTransactionForm`: Gestionează starea formularului, validarea datelor, reset după submit și mesaje de eroare/succes
  - `useTransactionFilters`: Encapsulează toată logica de filtrare, paginare și sortare
  - `useTransactionData`: Gestionează fetch-ul datelor de la API, caching, loading și erori
  - `TransactionService`: Serviciu pentru logica de business, transformare date și caching optimizat
  - `TransactionApiClient`: Client pentru comunicația cu API-ul, gestionarea erorilor și serializarea datelor

#### Rescrierea testelor pentru App.tsx folosind pattern-ul de hooks și servicii mockate
- Rescrise complet testele pentru `App.tsx` conform cu noua arhitectură:
  - Folosirea mock-urilor pentru hook-uri și servicii în loc de a mocka direct fetch
  - Testarea comportamentului în loc de implementare
  - Consolidarea testelor de recurentă din `App.recur.test.tsx` în suita principală `App.test.tsx`
- Avantaje ale noii abordări de testare:
  - Teste mai robuste, mai reziliente la refactorizări viitoare
  - Izolarea perfectă a componentelor și dependențelor
  - Testabilitate mult mai bună pentru cazurile de eroare și edge cases
  - Acoperire completă a funcționalităților de formulare recurente
  - Respectarea pattern-ului arhitectural de separare a responsabilităților

#### Implemementarea hook-urilor și serviciilor
- Toate hook-urile implementate cu API consistent, folosind `useState`, `useCallback` și `useEffect`
- Dependency injection la toate nivelurile pentru testabilitate maximă 
- Tipuri TypeScript complete pentru toate componentele, hook-urile și serviciile
- Respectarea pattern-ului de barrel exports prin fișiere `index.ts` pentru simplificarea importurilor

#### Teste complete pentru toate componentele noi
- Implementate teste pentru toate hook-urile și serviciile create  
- Corectată problema cu URL constructor pentru a suporta atât URL-uri absolute cât și relative
- Utilizare metode avansate de mockare pentru clase cu proprietăți private 
- Testing pentru scenarii de edge case și eroare
- Executate și verificate peste 30 de teste pentru hooks și servicii

#### Optimizări de cache pentru performanță
- Implementat mecanism de cache LRU (Least Recently Used) în `TransactionService`
- Invalidare selectivă a cache-ului în funcție de tipul operațiunii (create, update, delete)
- Limitare a dimensiunii cache-ului pentru a preveni consumul excesiv de memorie
- Statistici de performanță (cache hits, misses, ratio) pentru monitorizare
- Configurabilitate completă (timp expirare cache, limită maximă intrări)

#### Lecții învățate:

1. **Importuri și Barrel Exports**: La utilizarea pattern-ului de "barrel exports" (export centralizat prin `index.ts`), e important să evităm importurile circulare. Soluția a fost restructurarea importurilor și utilizarea ierarhiei clare de dependențe între hook-uri.

2. **Mockuri pentru Clase**: Pentru testarea serviciilor cu proprietăți private, metoda optimală este folosirea `jest.mock()` la nivel de modul cu implementare de mock pentru metodele publice, nu încercarea de a mocka proprietățile private direct.

3. **URL Constructor în Node/Jest**: Clasa URL din JavaScript necesită o bază absolută validă pentru a funcționa. Pentru a suporta atât URL-uri relative cât și absolute, am implementat o soluție hibridă care detectează tipul URL-ului și aplică logica adecvată.

4. **Testare Async cu Promisiuni**: Pentru testele asincrone, controlul direct al rezolvării promisiunilor din teste oferă rezultate mai predictibile decât a ne baza exclusiv pe mecanismul `async/await` al Jest. Am implementat rezolvarea explicită a promisiunilor pentru teste mai robuste.

5. **Cache Invalidation Selectivă**: În loc să invalidăm tot cache-ul la fiecare operațiune de scriere, am descoperit că invalidarea selectivă bazată pe conținut și ID-uri reduce dramatic numărul de apeluri API redundante.

#### Pași următori:

1. Implementarea testelor pentru App.tsx refactorizat

---

### [2025-04-25] Decizie arhitecturală: un singur store Zustand

- În acest moment există un singur store Zustand (`useTransactionStore`), dedicat tranzacțiilor.
- Fragmentarea pe mai multe store-uri nu este necesară la nivelul actual de funcționalitate.
- Dacă vor apărea noi domenii (ex: utilizatori, rapoarte, setări), arhitectura permite extinderea cu store-uri dedicate, conform best practices.
- Decizia este documentată și în tech story și best practices.
2. Integrarea completă a tuturor componentelor în aplicație
3. Verificarea coerentei și consistenței UI/UX în urma refactorizării

### [2025-04-25] Implementare Zustand pentru state management centralizat

#### Arhitectură implementată
- Implementată soluția Zustand pentru gestionarea centralizată a stării aplicației
- Creat directorul dedicat pentru store-uri: `frontend/src/stores/`
- Implementat primul store pentru tranzacții: `transactionStore.ts`
- Definit tipuri complete TypeScript pentru interfața store-ului
- Test complet TDD pentru store-ul de tranzacții
- Abordare incrementală pentru migrarea de la custom hooks la Zustand

#### Pattern-uri implementate pentru Zustand
- Dependency injection pentru `TransactionService` în store pentru testabilitate
- Valori implicite pentru parametrii de query, respectând convențiile existente de constante
- Acțiuni asincrone encapsulate în store cu gestionarea corectă a stărilor loading/error
- Separare clară între setteri simpli și acțiuni complexe în store
- Metoda `reset` pentru reinițializarea store-ului în scopuri de testare

#### Lecții învățate
- **Importul tipurilor enum**: Zustand trebuie să utilizeze enum-urile din sursa unică de adevăr (shared)
- **Mock-uri pentru servicii în teste Zustand**: Cea mai bună abordare este mock-ul la nivel de modul cu implementare pentru fiecare metodă, nu mock-ul clasei întregi
- **Problema importurilor circulare**: La testare, importul direct al store-ului poate cauza erori; soluția e importul întregului modul și extragerea store-ului din el
- **Sincronizare cu valori default**: Toate valorile implicite trebuie sincronizate cu cele din `constants/defaults.ts`

#### Beneficii identificate ale Zustand
- Sintaxă simplă și directă, mai apropiată de React hooks decât Redux
- Nu necesită Provider la nivel înalt, ceea ce simplifică integrarea
- Middleware modular pentru devtools, persist și alte funcționalități
- Selectors performante pentru optimizare re-renderizări
- Compatibilitate excelentă cu TypeScript și arhitectura existentă

#### Pași următori
1. Migrarea treptată a state-ului din `useTransactionData` în store-ul Zustand
2. Implementarea persistenței pentru store cu localStorage
3. Adăugarea middleware-ului de devtools pentru debugging
4. Extinderea cu selectors optimizate pentru filtrare și sortare

### [2025-04-25] Refactorizare cu Custom Hooks și Pattern-ul Service

---

## Lecții din debugging-ul Zustand (aprilie 2025)
- Caching-ul store-ului trebuie invalidat explicit după orice operație CRUD (save/remove/reset), altfel fetch-ul poate fi blocat de parametrii identici.
- Pentru error handling, folosește mereu mesajele din `constants/messages.ts`, nu stringuri hardcodate sau fallback-uri inutile.
- În testele Zustand, folosește mereu `getState()` proaspăt după acțiuni asincrone pentru a verifica starea actualizată; nu păstra referințe vechi la store.
- Pentru asserts pe starea asincronă, folosește `waitFor` de la `@testing-library/react`, nu expect direct după act.
- Testele trebuie să reseteze store-ul și să reinjecteze mock-urile înainte de fiecare test pentru izolare completă.
- Dacă store-ul nu setează error, verifică dacă cheia din `constants/messages.ts` există și nu are typo.


- Finalizată refactorizarea `App.tsx` utilizând pattern-ul de custom hooks și servicii:
  - `useTransactionForm`: Gestionează starea formularului, validarea și reset la submit
  - `useTransactionFilters`: Gestionează filtrarea și paginarea rezultatelor
  - `useTransactionData`: Encapsulează logica de fetch și interacțiune cu API-ul
  - `TransactionService`: Serviciu pentru operațiuni de business logic/API
  - `TransactionApiClient`: Client pentru comunicație directă cu API-ul backend

- Lecții învățate:
  - **Importuri Circulare**: La utilizarea pattern-ului de "barrel exports" cu index.ts, trebuie avut grijă la referințele circulare între hook-uri. Este recomandat ca fiecare hook să fie independent sau să utilizeze un sistem ierarhic clar de dependențe.
  - **Mock-uri pentru Clase cu Proprietăți Private**: Pentru testele care necesită servicii cu proprietăți private, este mai bine să folosim `jest.mock()` la nivel de modul și să mock-uim metode publice, nu proprietățile private direct.
  - **URL Constructor în Context Node/Jest**: Clasa URL din JavaScript necesită o bază validă (protocol + domeniu) pentru a funcționa corect. Pentru URL-uri relative, este necesară implementarea unei alternative robuste care să poată gestiona atât URL-uri absolute cât și relative.
  - **Testing Async cu Promise Mocking**: Pentru testarea codului asincron, este mai robust să controlăm direct rezolvarea promisiunilor din teste, în loc să ne bazăm pe mecanismul `async/await` al Jest care poate fi imprevizibil în anumite scenarii.

- Pași următori:
  - Implementarea testelor pentru App.tsx refactorizat
  - Optimizare performance pentru cache-ul din TransactionService
  - Documentare completă în BEST_PRACTICES.md a pattern-ului de hook-uri+servicii


### [2025-04-25] Migrare și testare useTransactionFilters la Zustand
- Implementat store Zustand pentru filtre tranzacții cu selectors ca funcții, acțiuni și reset.
- Teste TDD, colocate, robuste, fără hardcodări (import sursă de adevăr).
- Am folosit workaround pentru mock-uri Jest/TypeScript (doar metode publice).
- A fost necesară configurare Jest/ts-jest pentru suport TypeScript modern.

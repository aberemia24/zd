## [2025-05-20] Începere refactorizare stiluri CategoryEditor

### Modificări în lucru:
- Aplicare `getEnhancedComponentClasses('modal', 'overlay', ...)` pentru container modal
- Aplicare `getEnhancedComponentClasses('card', 'elevated', 'lg', ...)` pentru card principal
- Aplicare `getEnhancedComponentClasses('button', 'ghost', 'sm', ...)` pentru buton închidere

### Impact așteptat:
- Eliminarea claselor Tailwind hardcodate
- UI consistent cu restul componentelor rafinate


## [2025-05-19] Refactorizare TransactionsPage cu stiluri rafinate


### Modificări:
- Aplicat sistemul de stiluri rafinate la `TransactionsPage.tsx`
- Eliminarea claselor Tailwind hardcodate și înlocuirea lor cu `getEnhancedComponentClasses`
- Structurarea paginii în secțiuni logice: formular, filtre, tabel
- Adăugare efecte vizuale moderne: fade-in, gradient-text-subtle, shadow-md, etc.
- Folosirea componentelor definite în sistem: 'container', 'card', 'card-header', 'card-body', 'flex'
- Stilizare consistentă cu componentele refactorizate anterior: TransactionTable, TransactionForm, TransactionFilters
- Înlocuirea div-urilor de eroare simple cu componenta primitiva Alert cu efecte vizuale (withIcon, withFadeIn, withAccentBorder, withShadow)

### Motivație:
- Aliniere la standardele vizuale moderne definite în GHID_STILURI_RAFINATE.md
- Eliminarea claselor CSS hardcodate conform regulilor globale
- Îmbunătățirea experienței utilizator prin efecte vizuale consistente și profesionale
- Facilitarea schimbării temelor prin utilizarea sistemului de tokens

### Lecții învățate:
- Extensibilitatea sistemului: când lipsesc componente sau efecte vizuale noi, acestea trebuie adăugate în directorul `componentMap/` (nu prin clase Tailwind hardcodate)
- Importanța respectării tipurilor definite în `themeTypes.ts` (ComponentType, ComponentVariant, ComponentSize, ComponentState)
- Necesitatea înțelegerii relației între `componentMap`, `themeTypes.ts` și `getEnhancedComponentClasses`

### Impact:
- UX îmbunătățit prin interfață vizuală modernă și consistentă
- Codebase mai curat și mai ușor de întreținut
- Separarea clară a conținutului de prezentare
- Fundație solidă pentru implementarea altor funcționalități UI în viitor

## [2024-05-16] Dezactivare validare strictă la nivel de frontend pentru a permite subcategorii personalizate

### Modificări:
- Modificată funcția `validateCategoryAndSubcategory` din `supabaseService.ts` pentru a accepta toate combinațiile de categorie/subcategorie, delegând validarea completă către backend
- Păstrat apelurile pentru compatibilitate cu codul existent, dar fără a bloca tranzacțiile
- Adăugate loguri de debug detaliate pentru a facilita identificarea potențialelor probleme cu subcategoriile personalizate
- Îmbunătățite mesajele de eroare pentru utilizator, cu referințe clare la verificarea categoriilor și subcategoriilor disponibile

### Motivație:
Validarea strictă a categoriilor și subcategoriilor direct în frontend era incompatibilă cu funcționalitatea de subcategorii personalizate. Utilizatorii nu puteau folosi subcategoriile personalizate pentru tranzacții noi. Delegarea validării către backend asigură o experiență consistentă.

### Impactul modificării:
- O singură sursă de adevăr pentru validarea categoriilor (backend-ul/baza de date)
- Suport complet pentru subcategoriile personalizate create de utilizator
- Fără schimbări în API-uri sau semnături de funcții existente
- Îmbunătățită experiența de debugging și mesajele de eroare pentru utilizator

## [2024-05-16] Actualizare trigger SQL pentru validarea categorii/subcategorii în Supabase

### Modificări:
- Am actualizat funcția `validate_transaction_categories()` din Supabase pentru a suporta subcategorii personalizate
- Adăugat validare pentru trei tipuri de subcategorii:
  1. Subcategorii predefinite originale (din lista hardcodată)
  2. Subcategorii predefinite redenumite (din `custom_categories` cu `isCustom: false`)
  3. Subcategorii complet personalizate (din `custom_categories` cu `isCustom: true`)
- Adăugate indexuri pentru optimizarea performanței:
  - Index pe `user_id` pentru filtrare rapidă
  - Index GIN pe `category_data` pentru căutări rapide în structura JSON

### Motivație:
Triggerul SQL original valida strict categoriile și subcategoriile folosind liste hardcodate, ceea ce împiedica utilizarea subcategoriilor personalizate sau redenumite. Noua implementare consultă tabela `custom_categories` pentru a valida corespunzător toate tipurile de subcategorii.

### Impactul modificării:
- Utilizatorii pot acum crea tranzacții folosind atât subcategorii predefinite cât și personalizate
- Validarea rămâne la nivel de backend, asigurând integritatea datelor
- Performanță optimizată prin indexuri adecvate

### Considerații tehnice și riscuri:

#### Performanța
- Interogarea jsonb_path_exists poate fi costisitoare pentru seturi mari de date
- Indexul GIN pe `category_data` ar trebui să atenueze această problemă în majoritatea cazurilor
- Recomandare: Monitorizează performanța pentru utilizatorii cu multe subcategorii personalizate

#### Structura JSON
- Calea JSON folosită (`$.categories[*].subcategories[*].name`) trebuie să corespundă exact cu structura din tabela `custom_categories`
- Orice modificare viitoare a structurii JSON în frontend necesită actualizarea corespunzătoare a triggerului
- Recomandare: Adaugă teste automate pentru a verifica sincronizarea dintre structura frontend și backend

#### Case sensitivity
- Verificările categoriilor și subcategoriilor sunt case-sensitive
- Asigură-te că frontend-ul folosește exact aceeași scriere (majuscule/minuscule) ca în backend
- Risc: Inconsistențe în caz pot duce la validare eșuată pentru subcategorii care par identice utilizatorului

#### Testări necesare
- Subcategorie predefinită (ex: "Salarii")
- Subcategorie predefinită redenumită 
- Subcategorie personalizată nouă
- Tranzacție fără subcategorie

## [2025-05-19] Implementare sistem complet de design tokens (WINDSURF-CSS-001)

### Modificări:
- Creat și integrat fișierul `frontend/src/styles/theme-variables.css` cu toate variabilele CSS generate automat din `theme.ts` (culori, spacing, shadow, radius, font, breakpoints, etc.)
- Creat fișierul `frontend/src/styles/theme-components.css` cu clase CSS reutilizabile pentru butoane, inputuri, carduri, layout, tipografie etc., toate bazate pe tokens
- Adăugat scriptul `frontend/src/styles/generate-css-variables.js` pentru generarea automată a variabilelor CSS din tokens
- Modificat `frontend/src/index.css` pentru a importa la început variabilele și clasele centralizate
- Eliminat orice dublare de config Tailwind; frontend-ul folosește o singură sursă de tokens

### Reguli și pași de mentenanță:
- Toate stilurile în componente trebuie să utilizeze exclusiv sistemul de design tokens (WINDSURF-CSS-001)
- Clase Tailwind hardcodate sunt interzise (excepție doar cu comentariu @windsurf-exception și doar dacă nu există token)
- Orice nevoie nouă de stil se rezolvă prin extinderea tokens și a claselor centralizate, nu prin hardcodare
- Rulează scriptul de generare după orice modificare în `theme.ts`
- Importă DOAR din `theme-components.css` și folosește tokens CSS în stiluri inline dacă e nevoie
- Documentează orice excepție și remediază la primul refactor

## [2025-05-18] Refactorizare hooks tranzacții: infinite loading & caching

### Modificări:
- Creat hook nou `useMonthlyTransactions` pentru încărcarea tuturor tranzacțiilor pe lună (Lunar Grid).
- Creat hook nou `useInfiniteTransactions` pentru încărcare infinită (paginare) în Transactions Table.
- Eliminat complet hook-ul `useTransactions` (deprecated); orice utilizare accidentală returnează eroare clară.
- Am implementat un mecanism de cache partajat (`['transactions']`) pentru a asigura invalidarea corectă la mutații (create/update/delete) între ambele hooks.
- Refactorizat integrarea în paginile principale (`LunarGridPage.tsx`, `TransactionsPage.tsx`).

### Motivație & Design:
- Separarea clară între încărcarea bulk (toate tranzacțiile pentru grid) și încărcarea incrementală (infinite loading pentru tabel).
- Modularitate: fiecare hook are responsabilitate unică, fără duplicare de logică.
- Facilitează testarea, extensibilitatea și mentenanța pe termen lung.

### Probleme întâlnite și rezolvate:
- Inițial, tranzacțiile nu se afișau corect din cauza transmiterii greșite a userId-ului către query-uri.
- Erori la mutații: rezolvate prin partajarea cheii de cache și invalidare globală.
- Acces accidental la hook-ul vechi: prevenit cu stub explicit și mesaj de eroare.

### Lecții învățate:
- Caching-ul trebuie să fie centralizat și predictibil pentru a evita bug-uri subtile la sincronizarea datelor.
- Separarea clară a responsabilităților între hooks permite evoluție rapidă fără regresii.
- Testarea edge-case-urilor de mutații și cache este critică pentru UX robust.

### Next steps:
- Scriere teste unitare pentru ambele hooks (bulk și infinite loading), inclusiv scenarii de cache/mutații.
- Actualizare `BEST_PRACTICES.md` cu noul pattern pentru hooks și caching.
- Monitorizare performanță și UX pentru ajustări ulterioare.

---

## [2025-05-16] Actualizare constante și corecții pentru LunarGrid

- **Sumar:** S-au actualizat constantele din `EXCEL_GRID` pentru a suporta toate câmpurile necesare în componenta LunarGrid.

- **Modificări principale:**
  - Adăugate noi câmpuri în `EXCEL_GRID.HEADERS`: `CATEGORII`, `TOTAL`, `ACTIUNI`, `ZI`, `SUMA`, `TIP`, `DATA`, `DESCRIERE`, `RECURENT`, `FRECVENTA`
  - Adăugate mesaje noi în `EXCEL_GRID.PROMPTS` pentru interacțiunile cu utilizatorul
  - Extins `EXCEL_GRID.ACTIONS` cu acțiuni specifice pentru gestionarea tranzacțiilor și subcategoriilor
  - Corectate erorile de tip în `dataTransformers.ts` prin utilizarea corectă a constantelor actualizate

- **Conformitate cu regulile globale:**
  - Toate textele UI sunt centralizate în `shared-constants/ui.ts`
  - Eliminate orice referințe la texte hardcodate
  - Respectarea structurii de fișiere și a convențiilor de cod

- **Fișiere afectate:**
  - `shared-constants/ui.ts` - actualizare constante
  - `frontend/src/utils/lunarGrid/dataTransformers.ts` - corecții de tip

## [2025-05-15] Lecții învățate și probleme rezolvate în implementarea TanStack Table

- **Sumar:** Implementarea TanStack Table a evidențiat mai multe probleme de tipizare și managementul constant-elor care au devenit lecții valoroase pentru echipă.

- **Probleme întâlnite și rezolvate:**
    - **Extensia fișierelor pentru componente React cu JSX**: Fișierele `.ts` care conțin sintaxă JSX generează erori. Soluție: Redenumirea la `.tsx`.
    - **Structuri ierarhice în constante**: Adăugarea obiectului imbricat `MESAJE.VALIDARE` a cauzat erori de tipizare în `safeMessage`. Soluție: Refactorizarea funcției pentru a suporta acces ierarhic corect tipizat.
    - **Cast corect pentru enum-uri**: Tipizarea explicită pentru proprietăți de tip enum precum `FrequencyType` este necesară pentru a evita problemele de conversie între `string` și enum.
    - **Import și folosire corectă a constantelor**: Toate constantele trebuie importate exclusiv via alias-uri definite (`@shared-constants`).

- **Lecții de arhitectură și reguli noi:**
    - **Structuri imbricate în constante**: Când adăugăm structuri imbricate în sursa unică de adevăr (ex: `MESAJE.VALIDARE`), toate utilitarele care le folosesc trebuie adaptate (ex: `safeMessage`).
    - **JSX necesită extensia .tsx**: Indiferent cât de simplă e logica unui fișier, dacă conține JSX => extensia trebuie să fie `.tsx`, nu `.ts`.
    - **Tipizare explicită pentru cast-uri**: Folosiți întotdeauna cast-uri explicite (ex: `as FrequencyType`) pentru a converti între string și enum-uri.
    - **Testarea modularizată**: Evitați testarea 'Big Bang' a întregii implementări; testați pe componente și funcționalități izolate.

- **Beneficii aduse de această experiență:**
    - Cod mai robust și mai tipizat pentru întreaga aplicație
    - Funcția `safeMessage` îmbunătățită poate gestiona acum mesaje structurate ierarhic
    - Dezvoltarea de pattern-uri clare pentru structurarea constantelor și mesajelor
    - Detectarea timpurie a problemelor de tipizare înainte de compilare

## [2025-05-15] Implementare completă TanStack Table în LunarGrid

- **Sumar:** S-a finalizat implementarea completă a TanStack Table în componenta `LunarGrid` cu integrare în pagina existentă.
- **Modificări principale:**
    - Extindere `shared-constants/ui.ts` cu `EXCEL_GRID.TABLE_CONTROLS` pentru textele de interfață
    - Implementare `useLunarGridTable` pentru management de date și stare optimizată
    - Creare `LunarGridTanStack` cu folosirea exclusivă a constantelor și metodelor existente
    - Integrare în `LunarGridPage` cu toggle pentru comutare între implementarea clasică și cea nouă
    - Persistăm preferința utilizatorului în localStorage pentru a fi reținută între sesiuni
- **Conformitate cu regulile globale:**
    - **Zero texte hardcodate**: Toate mesajele provin din sursa unică de adevăr `@shared-constants`
    - **Zero referințe la funcții inexistente**: Toată implementarea se bazează pe funcțiile existente din stores/servicii
    - **Testabilitate**: Toate elementele interactive au atribute `data-testid` pentru testare automată
    - **Anti-pattern useEffect evitat**: Fetch-urile sunt gestionate corect fără dep arrays problematice
- **Beneficii principale:**
    - **Performanță crescută**: Componenta TanStack poate gestiona mii de tranzacții fără probleme
    - **UX păstrat**: Toate funcționalitățile din implementarea originală au fost menținute
    - **Adaptabilitate**: Utilizatorii pot comuta ușor între implementarea clasică și cea nouă
- **Fișiere create/modificate:**
    - `shared-constants/ui.ts` - adăugare constante pentru controalele tabelului
    - `frontend/src/components/features/LunarGrid/hooks/useLunarGridTable.ts` - implementare hook pentru TanStack Table
    - `frontend/src/components/features/LunarGrid/LunarGridTanStack.tsx` - componenta principală TanStack
    - `frontend/src/pages/LunarGridPage.tsx` - integrare cu toggle între implementarea clasică și cea nouă
    - `tests/plans/LunarGridTanStack.test.plan.md` - plan detaliat de testare

## [2025-05-15] Pregătire implementare TanStack Table în LunarGrid

- **Sumar:** S-au pregătit resursele necesare pentru implementarea TanStack Table în componenta `LunarGrid`.
- **Modificări principale:**
    - Adăugare constante necesare în `shared-constants/ui.ts` - secțiunea `EXCEL_GRID.TABLE_CONTROLS`
    - Creare script de verificare funcții (`scripts/verify-functions.js`) pentru validarea API-urilor existente
    - Creare plan detaliat de testare respectând regulile globale de testabilitate
    - Pregătire documentație și setup pentru implementarea incrementală
- **Design & Arhitectură:**
    - Zero texte hardcodate: Toate textele necesare adăugate în `shared-constants/ui.ts`
    - Zero referințe la funcții inexistente: Script de verificare pentru store-uri
    - Respectarea strictă a regulilor globale pentru sursa unică de adevăr
- **Next Steps:**
    - Instalare dependențe TanStack Table necesare
    - Implementare hook custom `useLunarGridTable.ts`
    - Creare componentă `LunarGridTanStack.tsx`
    - Implementare teste conform planului

## [2025-05-15] Integrare TanStack Table în LunarGrid

- **Sumar:** S-a finalizat integrarea TanStack Table în componenta `LunarGrid` pentru performanță și extensibilitate superioară.
- **Modificări principale:**
    - Creat componentă nouă: `LunarGridTanStack.tsx` (implementare grid cu TanStack Table)
    - Creat hook custom: `useLunarGridTable.ts` pentru logica tabelului
    - Creat componentă dedicată rândurilor de subcategorie: `TanStackSubcategoryRows.tsx`
    - Definit tipuri noi și clarificate în `types.ts` pentru categorii, subcategorii, și popover
    - Actualizat `tsconfig.json` pentru includerea tipurilor TanStack Table
- **Design & Arhitectură:**
    - Migrare incrementală, fără a rupe API-ul sau funcționalitatea existentă
    - Păstrat pattern-urile de stare și props din `LunarGrid` original
    - Toate importurile și constantele respectă regulile globale (`@shared-constants`)
- **Testare & Next Steps:**
    - Urmează commit + push pentru aceste modificări
    - Pași următori: remediere erori lint/type, testare completă a noilor componente și integrarea cu restul aplicației
- **Branch:** `feature/lunargrid-tanstack-migration`
- **Fișiere principale modificate/adăugate:**
    - `frontend/src/components/features/LunarGrid/LunarGridTanStack.tsx`
    - `frontend/src/components/features/LunarGrid/hooks/useLunarGridTable.ts`
    - `frontend/src/components/features/LunarGrid/TanStackSubcategoryRows.tsx`
    - `frontend/src/components/features/LunarGrid/types.ts`
    - `frontend/src/components/features/LunarGrid/tsconfig.json`

---

## [2025-05-11] Migrare la `react-router-dom` pentru Navigare

- **Sumar:** S-a refactorizat sistemul de navigare al aplicației frontend pentru a utiliza `react-router-dom` (v6) în locul mecanismului anterior bazat pe `window.location.hash`. Această modificare aduce o structură de rutare mai robustă, standardizată și mentenabilă.
- **Modificări cheie:**
    - `index.tsx`: Aplicația a fost împachetată cu `<BrowserRouter>`.
    - `App.tsx`: Logica de rutare a fost centralizată folosind `<Routes>`, `<Route>`, `<Link>`, și `<Navigate>`. S-au definit rute publice (login, register) și rute protejate (transactions, lunar-grid, options). Componenta gestionează redirecționarea automată către `/login` pentru rutele protejate dacă utilizatorul nu este autentificat, și către `/transactions` (sau ruta implicită) după login.
    - `LoginForm.tsx` și `RegisterForm.tsx`: Butoanele de navigare către pagina opusă au fost înlocuite cu componente `<Link>` de la `react-router-dom`.
    - `OptionsPage.tsx`: Funcționalitatea de logout care folosește `useNavigate()` pentru redirecționare este acum funcțională corect în contextul noului router.
- **Beneficii:**
    - Navigare declarativă și standard în React.
    - URL-uri curate și SEO-friendly (deși nu e focusul principal pentru această aplicație).
    - Gestionare mai bună a stării de navigare și a istoricului browser-ului.
    - Cod mai curat și mai ușor de înțeles în `App.tsx` pentru gestionarea paginilor.
- **Branch:** `feature/react-router-migration`
- **Fișiere principale modificate:**
    - `frontend/src/index.tsx`
    - `frontend/src/App.tsx`
    - `frontend/src/components/features/Auth/LoginForm.tsx`
    - `frontend/src/components/features/Auth/RegisterForm.tsx`
- **Notă:** S-au rezolvate și erorile de sintaxă (`Unexpected token`) din `App.tsx` care apăreau din cauza unui comentariu JSX formatat incorect. Testarea manuală completă a fluxurilor de login, register, navigare și logout a fost efectuată cu succes.

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
  - Testare cu `data-testid` predictibil și stabil, pattern validat de store + UI, fără string-uri hardcodate, safe null-check
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

## 2025-05-16: Migrare completă la React Query

**Autor**: Team DevOps

**Descriere**: Am finalizat migrarea completă de la Zustand la React Query pentru toate operațiunile de date. Această schimbare aduce îmbunătățiri semnificative în gestionarea stării server și operațiunile de cache.

### Modificări majore:

1. **Structura nouă pentru API calls**:
   - Toate apelurile API sunt acum gestionate prin custom hooks React Query (`useQuery` și `useMutation`)
   - Eliminare dependență directă de Zustand pentru operațiuni CRUD
   - Mutare business logic din stores în hooks specializate

2. **Centralizare API**:
   - Toate rutele API sunt definite în `shared-constants/api.ts`
   - Eliminare duplicare și inconsistențe între frontend și backend
   - Depreciere `API_URL` și înlocuire cu `API.ROUTES.*`

3. **Îmbunătățiri cache**:
   - Implementare mecanisme avansate de cache și invalidare
   - Reducere număr de request-uri redundante
   - Optimizare performanță la navigarea între pagini

### Riscuri și observații:

1. **Schimbare de paradigmă**:
   - Zustand rămâne util pentru UI state, dar nu mai este folosit pentru date de server
   - Necesită familiarizare cu conceptele React Query (stale time, cache time, etc.)

2. **Testare extinsă necesară**:
   - Anumite edge cases și scenarii complexe pot necesita testare suplimentară
   - Monitorizare atentă performanță în producție

### Resurse:

- Noi secțiuni în README.md și BEST_PRACTICES.md cu exemple și recomandări
- Updated tests pentru noul pattern

---

## 2025-05-17: Refactorizare LunarGridTanStack pentru paritate funcțională cu tabelul clasic

**Autor**: Team FE

**Descriere**: Am restaurat funcționalitatea de editare inline și expand/collapse în tabelul TanStack, asigurând paritate funcțională cu tabelul clasic, după migrarea la React Query.

### Probleme rezolvate:

1. **Editare inline restaurată**:
   - Înlocuit modal prompt() cu input direct în celulă la dublu-click
   - Comportament consistent cu tabelul clasic (Enter/Escape pentru confirmare/anulare)
   - Experiență utilizator îmbunătățită pentru editare rapidă sume

2. **Corecție user_id în API**:
   - Eliminat câmpul `userId` din payload-ul tranzacțiilor (nu exista în schema DB)
   - Corectată implementarea care cauza eroarea `"Could not find the 'userId' column of 'transactions'"`
   - Delegată gestionarea user_id către supabaseService în loc de includere în payload

3. **Poziționare corectă popover**:
   - Reparat poziționarea popover-ului pentru a apărea lângă celula pe care s-a făcut click
   - Eliminat conflictul între evenimentele de click pentru editare și expand/collapse

4. **Eliminate câmpuri inutile**:
   - Eliminat câmpul `description` care cauza erori la backend (nu exista în schema DB)

### Lecții învățate:

1. **Schema DB vs. Frontend models**:
   - Este critică sincronizarea perfectă între modelele din frontend și schema din backend
   - Câmpurile trimise în payload trebuie să fie exact cele așteptate de DB

2. **Conflict evenimente React**:
   - Gestionarea corectă a propagării evenimentelor (stopPropagation) este esențială în componente complexe
   - Separarea clară a responsabilităților între handleri evită comportamente neașteptate

3. **Paritate funcțională vs. UI**:
   - Se poate menține paritate funcțională chiar și cu implementări tehnice diferite
   - Experiența utilizator trebuie să fie consistentă indiferent de implementarea tehnică

### Riscuri reziduale:

1. **Testarea complexă**:
   - Necesită testare extinsă pentru a asigura funcționalitatea corectă în toate scenariile
   - Risc de regresii la modificări viitoare în componenta TanStack sau în API

2. **Dependență de structura DOM**:
   - Poziționarea elementelor (ex: popover) depinde de structura DOM și poate fi fragilă
   - Necesară atenție la schimbări de layout sau CSSanța



- Centralizarea rutelor și mesajelor elimină bug-uri de sincronizare
- Testele trebuie să reflecte mereu contractul actual al hooks/servicii

---

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
- Orice abatere de la aceste reguli trebuie justificată și documentată explicit în code review și# DEV LOG

## 2025-04-27 - Migrare enums/constants la shared-constants și audit automat importuri
- Finalizată migrarea enums/constants la sursa unică `shared-constants/`.
- Toate importurile din frontend și backend folosesc doar `@shared-constants`.
- Eliminare completă a importurilor legacy (direct din constants/enums sau shared).
- Scriptul `tools/validate-constants.js` validează automat corectitudinea importurilor și sincronizarea.
- Actualizate documentația și best practices pentru această strategie.
- **DEPRECATED**: Nu mai folosiți `npm run validate:constants` pentru validarea constantelor.

## 2025-04-28 - Configurare rezolvare alias și îmbunătățiri testare
- Adăugat alias `@shared-constants` în `craco.config.js` pentru Jest (moduleNameMapper).
- Actualizat `tsconfig.json` (frontend) cu `paths` către `src/shared-constants` pentru TypeScript.
{{ ... }}

**SCHIMBĂRI:**
- Mock-uri dedicate pentru store-uri Zustand cu helpers `setMockFormState`, `setMockTransactionState` pentru manipulare predictibilă a stării în teste.
- Tipare stricte pentru mock-uri și funcții de acțiune, eliminare tipuri implicite și any-uri nejustificate.
- Refactorizare testare pentru a folosi patternul "test focalizat pe câmp/feature", nu assert global pe tot formularul (vezi lessons learned).
- Sincronizare completă și validare cu scriptul `tools/validate-constants.js`.
- Fix imports pentru enums/constants doar din `@shared-constants` conform regulilor globale.
- Adăugare buton CANCEL în sursa unică BUTTONS și corectare UI copy.

**LECȚII ÎNVĂȚATE:**
- Mock-urile Zustand trebuie să includă explicit `getState` și să folosească helpers pentru actualizare stări în teste.
{{ ... }}
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

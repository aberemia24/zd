# User Story – E1 „Grid lunar + tranzacții simple"

## 1. Identificare

* **ID:** MVP‑1‑GRID‑LUNAR
* **Epic:** E‑1 – Grid lunar + tranzacții simple
* **Versiune vizată:** v1.0‑alpha
* **Prioritate:** Must‑Have
* **Ticket de referință:** [Link la task Jira/Trello]

## 2. Descriere (în limbajul utilizatorului)

> *Ca utilizator final*, când deschid pagina **Planificare**, vreau să văd o grilă similară cu Excel-ul meu de buget personal - cu zilele pe orizontală (inclusiv sfârșit de lună anterioară și început de lună următoare) și categoriile/subcategoriile de buget pe verticală - astfel încât să‑mi pot urmări ușor veniturile, cheltuielile și soldul estimat zi de zi şi să adaug rapid tranzacții noi.

## 3. Criterii de acceptare (AC)

- [ ] **AC-1**: **Randare rapidă** - Grila se afișează complet în < **1 s** la maximum 200 tranzacții în luna curentă (test Lighthouse).
- [ ] **AC-2**: **Structură ierarhică** - Header fix cu zilele **25-30/31** (luna anterioară) + **1-24/30/31** (luna curentă) pe orizontală și categorii principale (Venituri, Economii, Cheltuieli) pe verticală. Subcategoriile sunt vizibile doar la expandare. Celulele fără tranzacții arată „RON 0.00" sau „—".
- [ ] **AC-3**: **Sold calculat corect** - Soldul zilnic = Σ venituri ‑ Σ cheltuieli, rotunjit la 2 zecimale. Sumele totale pentru fiecare categorie și subcategorie sunt calculate automat. Fiecare secțiune (VENITURI, ECONOMII, CHELTUIELI) și fiecare subcategorie are un rând de total. Verificat prin test automat cu set fix de date.
- [ ] **AC-4**: **CRUD simplu** - Dublu‑click pe o celulă deschide un formular „Adaugă/Edit/Șterge". Formularul include opțiuni pentru salvare, anulare și ștergere. După „Salvează", tranzacția apare instant și soldul zilei se actualizează fără reload.
- [ ] **AC-5**: **Navigare lună** - Butoanele « Prev / Next » schimbă luna; URL include param `?month=YYYY‑MM`. La schimbarea lunii se păstrează vizibilitatea totalurilor pentru fiecare categorie. Header-ul global arată clar luna curentă și sumele totale (TOTAL SURPLUS, LICHIDITĂȚI RĂMASE).
- [ ] **AC-6**: **Mobile usability** - Pe ecran <768 px se poate face scroll orizontal și pinch‑zoom; gridul nu iese din viewport. Categoriile/subcategoriile sunt colapsabile pentru a păstra claritatea UI pe ecrane mici.
- [ ] **AC-7**: **Accesibilitate de bază** - Celulele au `role="gridcell"`; headerul `role="columnheader"`; contrast WCAG AA pentru text.
- [ ] **AC-8**: **Vizualizare status** - Celulele cu tranzacții efectuate (status="COMPLETED") au un indicator vizual distinctiv (bifă verde sau border special). Celulele cu tranzacții planificate (status="PLANNED") au un stil diferit (border punctat sau culoare mai deschisă) și un indicator vizual adecvat (ex: iconiță ceas).
- [ ] **AC-9**: **Formatare sume** - Toate sumele sunt formatate cu prefix "RON", separatori de mii și 2 zecimale (ex: "RON 1.234,56"). Soldurile negative apar în roșu, cele pozitive în verde. Valorile zero sunt afișate explicit ca "RON 0.00".
- [ ] **AC-10**: **Expandare/colapsare categorii** - Fiecare categorie principală (Venituri, Cheltuieli, Economii) poate fi expandată pentru a arăta subcategoriile sau colapsată pentru a arăta doar suma totală pe categorie. Când e colapsată, arată suma agregată pentru toate subcategoriile din grupa respectivă.
- [ ] **AC-11**: **Adăugare/editare categorii** - Utilizatorul poate adăuga o nouă subcategorie într-o categorie existentă direct din interfață. Noua subcategorie apare instant în grid cu un rând nou.
- [ ] **AC-12**: **Continuitate între luni** - Grid-ul arată ultimele zile ale lunii anterioare și primele zile ale lunii curente (similar cu Excel-ul original). Acest lucru oferă o viziune continuă asupra lichidităților și evoluției bugetului.
- [ ] **AC-13**: **Mesaje și indicatori** - Orice mesaj de eroare, loading sau feedback din UI și din teste trebuie să provină din constants (`@shared-constants/messages`) și să fie verificat în teste cu `data-testid` predictibil, nu cu stringuri hardcodate.
- [ ] **AC-13**: **Layout multi-secțiune** - Structura grid-ului reflectă exact organizarea din Excel: header global cu totale, secțiuni distincte pentru VENITURI, ECONOMII, CHELTUIELI, fiecare cu propriile subcategorii detaliate și rânduri de totaluri.

## 4. Scop non‑funcțional

- **Performanță:** menținere **60 fps** la scroll pe desktop (`Chrome Canary perf panel`)
- **Compatibilitate browsere:** Chrome ≥ 110, Firefox ≥ 110, Safari ≥ 16 (iOS 15+)
- **Timp de răspuns:** Acțiunile UI (click, dublu-click, hover) răspund în **<100ms**
- **Re-calcul sold:** Actualizarea soldurilor pentru întreaga lună durează **<250ms** după modificarea unei tranzacții
- **Scalabilitate:** Grid-ul trebuie să funcționeze cu până la **30 subcategorii per categorie principală**

## 5. Task‑uri de dezvoltare

- [x] **DEV-0**: Analiza structurii actuale de categorii/subcategorii din `shared-constants/categories.ts` (FE, 0.5d)
    _Structura este completă și corectă, sursa unică de adevăr pentru grid și mapping._
- [x] **DEV-1**: Actualizează `Transaction` type cu `actualAmount?`, `status?` (BE/FE, 0.5d)
    _Câmpuri adăugate în schema Zod și enum TransactionStatus creat pentru workflow planificat/actualizat._
- [x] **DEV-2**: Mapping TransactionType <-> categorie principală (FE, 0.5d)  
    _Implementat în `shared-constants/category-mapping.ts` și exportat în barrel. Folosit deja în TransactionForm._
- [x] **DEV-3**: Utilitare mapping + validare (FE, 0.5d)  
    _Funcții `getCategoriesForTransactionType` și `getTransactionTypeForCategory` disponibile în constants. Import centralizat._
- [x] **DEV-4**: Integrare date reale + calcul sold (FE, 0.5d)  
    _Implementat rândul SOLD în LunarGrid, cu calcul corect al soldului zilnic, formatare RON și culori condiționale. Utilizează constants din EXCEL_GRID și respectă patterns/reguli globale._
- [ ] **DEV-5**: Formular `TransactionModal` reutilizat (Add/Edit) (FE, 1d)
- [ ] **DEV-6**: Hook navigare lună + URL sync (FE, 0.5d)
- [ ] **DEV-7**: Stil responsive + scroll mobil (FE, 1d)
- [ ] **DEV-8**: Optimizare perf (profilare, memo) (FE, 0.5d)
- [ ] **DEV-9**: Integrare TanStack Table pentru headers fixe (FE, 0.5d)
- [ ] **DEV-10**: Implementare stilizare status și formatter sume (FE, 0.5d)
- [ ] **DEV-11**: Implementare mecanisme cache pentru lunile anterioare (FE, 0.5d)
- [x] **DEV-12**: Implementare sistem expandare/colapsare categorii cu stare persistată în localStorage (FE, 1d)  
    _Implementat expandare/colapsare cu UI ierarhic, persistență în localStorage, agregare sume pentru categorii colapsate și format RON._
- [ ] **DEV-13**: UI pentru adăugare/editare categorie/subcategorie integrat cu constante existente (FE, 1d)
- [ ] **DEV-14**: Calcul sumarizare categorii pentru vizualizare colapsată (FE, 0.5d)
- [ ] **DEV-15**: Integrare cu modelul existent de categorii și detectare modificări (FE, 0.5d)
- [ ] **DEV-16**: Implementare header global cu totaluri și navigare între luni (FE, 0.5d)
- [ ] **DEV-17**: Implementare vizualizare continuă între luni (ultimele zile + primele zile) (FE, 1d)
- [ ] **DEV-18**: Formatare sume cu prefix "RON" și handling special pentru valori zero (FE, 0.5d)

## 6. Test Scenarios – Unit Tests (Jest)

> Folosim TDD: fiecare Acceptance Criterion primește cel puțin un test automat în Jest/React‑Testing‑Library.

- [ ] **UT-1**: Gridul afișează 31 coloane pentru lună de 31 zile (`MonthlyGrid.spec.tsx`) - Montează componenta cu provider store mock (mai 2025) și numără elementele cu `role="columnheader"`.
- [ ] **UT-2**: Sold zilnic calcul corect (`balances.util.spec.ts`) - Rulează `recalcMonthBalances()` pe un set fix de tranzacții -> expect ca `balances['2025‑05‑15']` să egaleze suma calculată manual.
- [ ] **UT-3**: Add tranzacție actualizează store + sold (`TransactionModal.spec.tsx`) - Simulează submit; verifică `transactions.length` crește și `dailyBalances` ziua respectivă se modifică.
- [ ] **UT-4**: Navigarea lunii modifică URL și selector (`MonthlyGrid.spec.tsx`) - Click pe buton « Prev » -> `window.location.search` include `month=2025-04`; store selector primește `2025-04`.
- [ ] **UT-5**: Performanță render < 1000 ms (`MonthlyGrid.perf.spec.tsx`) - Montează cu 200 tranzacții și folosește `performance.now()` pentru timing.
- [ ] **UT-6**: Formatarea sumelor corectă (`moneyFormatter.spec.ts`) - Testează formatter cu diverse valori (pozitive, negative, zero) și verifică formatarea corectă.
- [ ] **UT-7**: Stilizare status tranzacție corectă (`TransactionCell.spec.tsx`) - Testează că celulele cu diferite statusuri (PLANNED, COMPLETED) au clasele CSS corecte.
- [ ] **UT-8**: Expandare/colapsare categorii (`CategoryRow.spec.tsx`) - Verifică că click pe iconul expandare/colapsare schimbă starea și afișarea subcategoriilor.
- [ ] **UT-9**: Sumarizare corectă categorii (`categoryUtils.spec.ts`) - Verifică că funcția de calcul sumă totală categorie funcționează corect pentru diverse scenarii.
- [ ] **UT-10**: Adăugare subcategorie nouă (`CategoryEditor.spec.tsx`) - Testează că adăugarea unei noi subcategorii actualizează corect store-ul și UI-ul.
- [ ] **UT-11**: Tooltipuri la hover pe celule (`TransactionCell.spec.tsx`) - Verifică că la hover pe celulele cu tranzacții apar tooltipuri cu informații complete și corecte.
- [ ] **UT-12**: Închidere corectă formulare de tranzacție (`TransactionModal.spec.tsx`) - Verifică că formularele de tranzacție se închid corect după "Salvează" sau "Anulează" și că starea UI este consistentă.
- [ ] **UT-13**: Formatare valori zero (`moneyFormatter.spec.ts`) - Verifică că valorile zero sunt formatate corect ca "RON 0.00" și au stilul vizual adecvat.
- [ ] **UT-14**: Header global cu totale (`MonthlyGridHeader.spec.tsx`) - Verifică că header-ul global afișează corect totalurile pentru lună și se actualizează când se modifică tranzacțiile.
- [ ] **UT-15**: Vizualizare continuă între luni (`MonthlyGrid.spec.tsx`) - Verifică că grid-ul afișează corect ultimele zile ale lunii anterioare și primele zile ale lunii următoare.

## 7. Test Scenarios - E2E (Cypress)

- [ ] **E2E-1**: Flux complet adăugare și navigare - Deschide grid → navigare la luna anterioară → adăugare tranzacție → verificare sold 
- [ ] **E2E-2**: Persistență date la navigare - Adaugă tranzacție → navighează altă lună → revină la luna inițială → verifică prezența
- [ ] **E2E-3**: Expandare/colapsare categorii - Expandează/colapsează fiecare categorie principală → verifică sumele agregate → verifică că subcategoriile apar/dispar corect
- [ ] **E2E-4**: Adăugare nouă subcategorie - Adaugă subcategorie nouă → verifică că apare în grid → adaugă tranzacție în subcategoria nouă
- [ ] **E2E-5**: Vizualizare și navigare între luni - Navigare înainte și înapoi între luni → verifică continuitatea datelor → verifică că soldurile și totalurile se mențin corect

## 7. Best Practices – Testare & State Management

- **Mesaje și UI copy**: Orice mesaj de eroare, feedback sau text UI provine EXCLUSIV din `shared-constants/messages.ts` și se importă prin `@shared-constants/messages` (fără string‑uri hardcodate în componente sau teste).
- **Testare async și user-centrică**:
    - Folosește `await act(async () => ...)` și `waitFor` pentru orice update asincron sau element care apare/dispare din DOM.
    - Toate elementele funcționale (butoane, inputuri, itemi listă, feedback) au `data-testid` unic și predictibil (vezi regula globală 3.1).
    - Testele verifică mesaje/indicatori folosind valorile din constants, nu stringuri hardcodate.
    - Pentru formulare complexe, verifică valorile inițiale pe câmpuri individuale cu `waitFor` (pattern recomandat, vezi lessons learned).
- **Mocking**:
    - Se mock-uiesc DOAR serviciile externe (API/fetch, date/time, random, browser APIs). Nu se mock-uiesc stores Zustand sau logica proprie (vezi regula globală mock-uri testare).
- **Zustand & fetch**:
    - Este INTERZIS fetch-ul direct pe `[queryParams]` cu `useEffect(fetch, [queryParams])` (anti-pattern critic, vezi regula 8.2 din global_rules.md). Se folosește caching intern sau guard logică pentru a preveni bucle infinite.
    - Orice abatere se documentează explicit în code review și DEV_LOG.md.
- **Centralizare API/constants**:
    - Toate rutele, headerele și time-out-urile API sunt definite în `shared-constants/api.ts` și importate DOAR prin `@shared-constants/api`.
    - Este interzisă folosirea sau exportul de `API_URL` (deprecated).
- **Motivație**: Aceste reguli asigură testare robustă, mentenanță ușoară, onboarding rapid și QA predictibil. Orice excepție se documentează și justifică în PR și DEV_LOG.md.

## 8. Wireframe / Mockup

```
┌──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│                    TOTAL SURPLUS - GRILĂ PLANIFICARE LUNARĂ (EXEMPLU)                                                        │
├──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ LICHIDITĂȚI RĂMASE (VENITURI-ECONOMII-CHELTUIELI) │  FEBRUARIE: RON 4,321.04 ... RON 13,779.70  │  MARTIE: RON 10,095.45 ... RON 8,040.34 │
├───────┬──────┬──────┬──────┬──────┬──────┬───────┬──────┬──────┬──────┬──────┬──────┬──────┬──────┬──────┐
│       │ 25   │ 26   │ 27   │ 28   │ 29   │Total  │  1   │  2   │  3   │  4   │  5   │  6   │ ...  │      │
├───────┼──────┼──────┼──────┼──────┼──────┼───────┼──────┼──────┼──────┼──────┼──────┼──────┼──────┼──────┤
│ 📂 VENITURI           │      │      │      │      │      │       │      │      │      │      │      │      │ ...  │      │
│   └ Report anterioară │  —   │  —   │  —   │  —   │  —   │ RON 0 │RON 13,779│  —   │  —   │  —   │  —   │  —   │ ...  │      │
│   └ Salarii           │  —   │  —   │  —   │  —   │RON 5,790│RON 5,790│  —   │  —   │  —   │RON 13,358│  —   │ ...  │      │
│   └ Chirii            │  —   │  —   │  —   │RON 12,968│  —   │RON 12,968│  —   │  —   │  —   │  —   │  —   │ ...  │      │
│   └ [+ Adaugă]        │      │      │      │      │      │       │      │      │      │      │      │      │ ...  │      │
│  Total Venituri       │RON 4,546│RON 11,163│ RON 0 │RON 12,968│RON 5,790│RON 34,467│RON 13,779│ RON 0 │ RON 0 │RON 13,358│RON 600│ ... │      │
├───────┼──────┼──────┼──────┼──────┼──────┼───────┼──────┼──────┼──────┼──────┼──────┼──────┼──────┼──────┤
│ 📂 CHELTUIELI          │      │      │      │      │      │       │      │      │      │      │      │      │ ...  │      │
│   └ FINANCIAR         │      │      │      │      │      │       │      │      │      │      │      │      │ ...  │      │
│     └ Asigurări de via│  —   │  —   │  —   │  —   │  —   │RON 0  │  —   │  —   │  —   │  —   │  —   │RON 1,120│ ...  │      │
│     └ Rate credit1    │  —   │  —   │  —   │  —   │RON 5,730│RON 5,730│  —   │  —   │  —   │RON 2,250│  —   │ ...  │      │
│     └ [+ Adaugă]      │      │      │      │      │      │       │      │      │      │      │      │      │ ...  │      │
├───────┼──────┼──────┼──────┼──────┼──────┼───────┼──────┼──────┼──────┼──────┼──────┼──────┼──────┼──────┤
│ SOLD                  │RON 800│RON 750│RON 650│RON 150│RON 2,350│RON 13,780│RON 13,780│RON 13,500│RON 13,000│RON 12,000│RON 8,000│RON 7,500│ ... │      │
└───────┴──────┴──────┴──────┴──────┴──────┴───────┴──────┴──────┴──────┴──────┴──────┴──────┴──────┴──────┘
```

### ▶️ Preview interactiv (mock React)
Pentru o demonstrație rapidă a comportamentului gridului lunar, vezi componenta:
`frontend/src/components/MonthlyGridPreview.tsx`

```tsx
import MonthlyGridPreview from "@components/MonthlyGridPreview";

// ... în Storybook sau orice pagină demo:
<MonthlyGridPreview />
```

> Recomandare: Rulează local sau în Storybook pentru a explora interactiv gridul (expand/collapse, sumarizare, stilizare sume etc). Poți adapta rapid acest mock pentru demo-uri sau validare UX cu PO/QA.

## 9. Interacțiuni utilizator detaliate

- **Click simplu** pe o celulă - Evidențiază celula și arată tooltip cu detaliile tranzacțiilor din ziua respectivă
- **Dublu-click** pe o celulă - Deschide modal pentru adăugare/editare tranzacție
- **Hover** peste o celulă cu tranzacții - Arată tooltip cu detalii complete (sumă, categorie, subcategorie)
- **Click** pe header de zi - Selectează coloana întreagă pentru vizualizare rapidă
- **Click** pe iconul 📂 (expandare/colapsare) - Expandează sau colapsează categoria și subcategoriile asociate 
- **Click** pe "[+ Adaugă]" - Deschide formular pentru adăugarea unei noi subcategorii în categoria principală respectivă

## 10. Comportament state management

- Când se schimbă luna, store-ul încarcă și memorează datele pentru luna respectivă, plus ultimele zile din luna anterioară și primele zile din luna următoare
- Datele pentru lunile vizualizate anterior sunt păstrate în cache pentru navigare rapidă
- După adăugare/editare tranzacție, se recalculează doar soldurile afectate prin funcția specializată `recalcAffectedDailyBalances()`
- Starea expandare/colapsare categorii este persistată în localStorage pentru a menține preferințele utilizatorului între sesiuni
- Când o categorie este colapsată, se calculează automat suma totală pentru toate subcategoriile incluse folosind funcția `calculateCategoryTotal()`
- Header-ul global cu solduri totale (TOTAL SURPLUS, LICHIDITĂȚI RĂMASE) se actualizează automat când se modifică orice tranzacție
- Toate sumele sunt formatate consistent cu prefix "RON", două zecimale și separatori de mii

## 11. Dependențe & note

* Refolosește **create‑react‑app** actual; nu introducem încă Vite.
* Pentru categorii și subcategorii, folosește ca sursă de adevăr structura din `shared-constants/categories.ts` care conține deja ierarhia completă cu toate categoriile principale și subcategoriile lor.

* **Mapping între TransactionType și categorii principale:**
  * `TransactionType.INCOME` → map la categoria "VENITURI"
  * `TransactionType.EXPENSE` → map la categoriile: INFATISARE, EDUCATIE, CARIERA, SANATATE, NUTRITIE, LOCUINTA, TIMP_LIBER, CALATORII, TRANSPORT
  * `TransactionType.SAVING` → map la categoriile: ECONOMII, INVESTITII
  * Acest mapping trebuie implementat explicit într-un util (`getCategoryForTransactionType` și `getTransactionTypeForCategory`) pentru a asigura consistența în toată aplicația

* **Reguli pentru UI de editare categorii:**
  * Orice modificare la structura de categorii trebuie să fie persistată pentru a fi disponibilă în toate componentele aplicației
  * Când se adaugă/editează o subcategorie din UI, se actualizează atât store-ul local cât și sursa de adevăr din `shared-constants/categories.ts`
  * Sincronizarea BE-FE pentru categorii trebuie să fie bidirecțională

* **Validări necesare:**
  * Verificarea că toate categoriile și subcategoriile cerute de business sunt prezente
  * Consistența mapping-ului TransactionType → categorie principală
  * Păstrarea sursei unice de adevăr pentru categorii/subcategorii

* **TanStack Table** se integrează în DEV-9 pentru headers fixe și scroll performant
* **TanStack Virtual** se va activa ulterior, dacă AC-1 nu este atins cu implementarea inițială
* **Dinero.js** se va introduce în Epic E-5, dar formatterele de sume se pregătesc pentru integrare
* **Dependențe BE**:
  * Endpoint `/api/transactions?month=YYYY-MM` trebuie să accepte parameterul month
  * Schema Transaction trebuie actualizată cu câmpurile `status` și `actualAmount`
  * API pentru adăugare/editare categorii și subcategorii trebuie să actualizeze `shared-constants/categories.ts` sau să ofere un endpoint dedicat pentru sincronizare

## 12. Definition of Done

- [ ] Toate AC‑urile trec manual & automat.
- [ ] Teste jest + Cypress verzi pe CI, folosind doar mesaje/constante din `@shared-constants/messages` și `@shared-constants/api` (fără stringuri hardcodate în assertions).
- [ ] Toate testele respectă best practices async (`act`, `waitFor`), folosesc `data-testid` și nu mock-uiesc stores Zustand sau logica proprie.
- [ ] Orice fetch asincron cu Zustand respectă regula anti-pattern (fără `useEffect(fetch, [queryParams])`).
- [ ] Code review aprobat de alt dev (sau de tine cu checklist).
- [ ] Fără regression pe fluxurile existente (login, listă tranzacții veche).
- [ ] Documentație actualizată în README.md cu nouă funcționalitate și referință la noile reguli de testare/state management.
- [ ] Performance budget respectat (timp de încărcare și calcul).
- [ ] Structura de categorii/subcategorii funcționează corect cu expandare/colapsare.
- [ ] UI pentru adăugare subcategorii noi funcționează fără erori.
- [ ] Compatibilitate completă cu modelul existent de categorii din `shared-constants/categories.ts`.
- [ ] Orice modificare la categorii este reflectată corect în alte componente ale aplicației care folosesc aceste categorii.
- [ ] Gridul este complet funcțional și fără bug-uri pe toate platformele specificate în secțiunea "Compatibilitate browsere".
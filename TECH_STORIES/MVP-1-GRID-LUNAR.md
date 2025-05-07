# User Story – E1 „Grid lunar + tranzacții simple"

## 1. Identificare

* **ID:** MVP‑1‑GRID‑LUNAR
* **Epic:** E‑1 – Grid lunar + tranzacții simple
* **Versiune vizată:** v1.0‑alpha
* **Prioritate:** Must‑Have
* **Ticket de referință:** [Link la task Jira/Trello]

## 2. Descriere (în limbajul utilizatorului)

> *Ca utilizator final*, când deschid pagina **Planificare**, vreau să văd o grilă a lunii curente — cu zilele pe orizontală și categoriile/subcategoriile de buget pe verticală — astfel încât să‑mi pot urmări ușor veniturile, cheltuielile și soldul estimat zi de zi şi să adaug rapid tranzacții noi.

## 3. Criterii de acceptare (AC)

### Criterii de acceptare (AC)

- **AC‑1: Randare rapidă**
  - Grila se afișează complet în < **1 s** la maximum 200 tranzacții în luna curentă (test Lighthouse).
- **AC‑2: Structură ierarhică**
  - Header fix cu zilele **1‑31** pe orizontală și categorii principale (Venituri, Cheltuieli, Economii) pe verticală. Subcategoriile sunt vizibile doar la expandare. Celulele fără tranzacții arată „—”.
- **AC‑3: Sold calculat corect**
  - Soldul zilnic = Σ venituri ‑ Σ cheltuieli, rotunjit la 2 zecimale. Verificat prin test automat cu set fix de date.
- **AC‑4: CRUD simplu**
  - Dublu‑click pe o celulă deschide un formular „Adaugă/Edit/Șterge”. Formularul include opțiuni pentru salvare, anulare și ștergere. După „Salvează”, tranzacția apare instant și soldul zilei se actualizează fără reload.
- **AC‑5: Navigare lună**
  - Butoanele « Prev / Next » schimbă luna; URL include param `?month=YYYY‑MM`.
- **AC‑6: Mobile usability**
  - Pe ecran <768 px se poate face scroll orizontal și pinch‑zoom; gridul nu iese din viewport. Categoriile/subcategoriile sunt colapsabile pentru a păstra claritatea UI pe ecrane mici.
- **AC‑7: Accesibilitate de bază**
  - Celulele au `role="gridcell"`; headerul `role="columnheader"`; contrast WCAG AA pentru text.
- **AC-8: Vizualizare status**
  - Celulele cu tranzacții efectuate (status="COMPLETED") au un indicator vizual distinctiv (bifă verde sau border special). Celulele cu tranzacții planificate (status="PLANNED") au un stil diferit (border punctat sau culoare mai deschisă) și un indicator vizual adecvat (ex: iconiță ceas).
- **AC-9: Formatare sume**
  - Toate sumele sunt formatate cu separatori de mii și 2 zecimale (ex: "1.234,56 RON"). Soldurile negative apar în roșu, cele pozitive în verde.
- **AC-10: Expandare/colapsare categorii**
  - Fiecare categorie principală (Venituri, Cheltuieli, Economii) poate fi expandată pentru a arăta subcategoriile sau colapsată pentru a arăta doar suma totală pe categorie. Când e colapsată, arată suma agregată pentru toate subcategoriile din grupa respectivă.
- **AC-11: Adăugare/editare categorii**
  - Utilizatorul poate adăuga o nouă subcategorie într-o categorie existentă direct din interfață. Noua subcategorie apare instant în grid cu un rând nou.


## 4. Scop non‑funcțional

* **Performanță:** menținere 60 fps la scroll pe desktop (Chrome Canary perf panel)
* **Compatibilitate browsere:** Chrome ≥ 110, Firefox ≥ 110, Safari ≥ 16 (iOS 15+)
* **Timp de răspuns:** Acțiunile UI (click, dublu-click, hover) răspund în <100ms
* **Re-calcul sold:** Actualizarea soldurilor pentru întreaga lună durează <250ms după modificarea unei tranzacții
* **Scalabilitate:** Grid-ul trebuie să funcționeze cu până la 30 subcategorii per categorie principală

## 5. Task‑uri de dezvoltare

| Nr.       | Task                                                                            | Owner   | Estimare |
| --------- | ------------------------------------------------------------------------------- | ------- | -------- |
| **DEV-0** | Analiza structurii actuale de categorii/subcategorii din `shared-constants/categories.ts` | FE | 0.5 d |
| **DEV‑1** | Actualizează `Transaction` type cu `actualAmount?`, `status?`                   | BE / FE | 0.5 d    |
| **DEV‑2** | Adaugă `dailyBalances` şi funcția `recalcMonthBalances()` în `transactionStore` | FE      | 0.5 d    |
| **DEV‑3** | Prot. grid static cu `<table>` şi Tailwind                                      | FE      | 0.5 d    |
| **DEV‑4** | Integrare date reale + calcul sold                                              | FE      | 0.5 d    |
| **DEV‑5** | Formular `TransactionModal` reutilizat (Add/Edit)                               | FE      | 1 d      |
| **DEV‑6** | Hook navigare lună + URL sync                                                   | FE      | 0.5 d    |
| **DEV‑7** | Stil responsive + scroll mobil                                                  | FE      | 1 d      |
| **DEV‑8** | Optimizare perf (profilare, memo)                                               | FE      | 0.5 d    |
| **DEV-9** | Integrare TanStack Table pentru headers fixe                                    | FE      | 0.5 d    |
| **DEV-10** | Implementare stilizare status și formatter sume                                | FE      | 0.5 d    |
| **DEV-11** | Implementare mecanisme cache pentru lunile anterioare                          | FE      | 0.5 d    |
| **DEV-12** | Implementare sistem expandare/colapsare categorii cu stare persistată în localStorage și opțiune de resetare preferințe | FE | 1 d |
| **DEV-13** | UI pentru adăugare/editare categorie/subcategorie integrat cu constante existente | FE      | 1 d      |
| **DEV-14** | Calcul sumarizare categorii pentru vizualizare colapsată                      | FE      | 0.5 d    |
| **DEV-15** | Integrare cu modelul existent de categorii și detectare modificări             | FE      | 0.5 d    |

## 6. Test Scenarios – Unit Tests (Jest)

>  Folosim TDD: fiecare Acceptance Criterion primește cel puțin un test automat în Jest/React‑Testing‑Library.

| ID       | Ce validăm                                        |  Fișier test                            |  Hint cod                                                                                                                            |
| -------- | ------------------------------------------------- | --------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| **UT‑1** | Gridul afișează 31 coloane pentru lună de 31 zile |  `MonthlyGrid.spec.tsx`                 |  Montează componenta cu provider store mock (mai 2025) și numără elementele cu `role="columnheader"`.                                |
| **UT‑2** | Sold zilnic calcul corect                         |  `balances.util.spec.ts`                |  Rulează `recalcMonthBalances()` pe un set fix de tranzacții -> expect ca `balances['2025‑05‑15']` să egaleze suma calculată manual. |
| **UT‑3** | Add tranzacție actualizează store + sold          | `TransactionModal.spec.tsx`             | Simulează submit; verifică `transactions.length` crește și `dailyBalances` ziua respectivă se modifică.                              |
| **UT‑4** | Navigarea lunii modifică URL și selector          |  `MonthlyGrid.spec.tsx`                 | Click pe buton « Prev » -> `window.location.search` include `month=2025-04`; store selector primește `2025-04`.                      |
| **UT‑5** | Performanță render < 1000 ms                      |  `MonthlyGrid.perf.spec.tsx` (opțional) |  Montează cu 200 tranzacții și folosește `performance.now()` pentru timing.                                                          |
| **UT-6** | Formatarea sumelor corectă                        |  `moneyFormatter.spec.ts`               |  Testează formatter cu diverse valori (pozitive, negative, zero) și verifică formatarea corectă.                                    |
| **UT-7** | Stilizare status tranzacție corectă               |  `TransactionCell.spec.tsx`             |  Testează că celulele cu diferite statusuri (PLANNED, COMPLETED) au clasele CSS corecte.                                            |
| **UT-8** | Expandare/colapsare categorii                     |  `CategoryRow.spec.tsx`                 |  Verifică că click pe iconul expandare/colapsare schimbă starea și afișarea subcategoriilor.                                         |
| **UT-9** | Sumarizare corectă categorii                      |  `categoryUtils.spec.ts`                |  Verifică că funcția de calcul sumă totală categorie funcționează corect pentru diverse scenarii.                                   |
| **UT-10** | Adăugare subcategorie nouă                        |  `CategoryEditor.spec.tsx`              |  Testează că adăugarea unei noi subcategorii actualizează corect store-ul și UI-ul.                                                  |
| **UT-11** | Tooltipuri la hover pe celule                    |  `TransactionCell.spec.tsx`             |  Verifică că la hover pe celulele cu tranzacții apar tooltipuri cu informații complete și corecte.                                     |
| **UT-12** | Închidere corectă formulare de tranzacție        |  `TransactionModal.spec.tsx`            |  Verifică că formularele de tranzacție se închid corect după "Salvează" sau "Anulează" și că starea UI este consistentă.              |

## 7. Test Scenarios - E2E (Cypress)

| ID       | Scenariu                                    | Descriere                                                                                |
| -------- | ------------------------------------------- | ---------------------------------------------------------------------------------------- |
| **E2E-1** | Flux complet adăugare și navigare          | Deschide grid → navigare la luna anterioară → adăugare tranzacție → verificare sold     |
| **E2E-2** | Persistență date la navigare               | Adaugă tranzacție → navighează altă lună → revină la luna inițială → verifică prezența  |
| **E2E-3** | Expandare/colapsare categorii              | Expandează/colapsează fiecare categorie principală → verifică sumele agregate → verifică că subcategoriile apar/dispar corect |
| **E2E-4** | Adăugare nouă subcategorie                 | Adaugă subcategorie nouă → verifică că apare în grid → adaugă tranzacție în subcategoria nouă |

## 8. Wireframe / Mockup

```
┌─────────────────────────────────────────────────────────────────────────┐
│ Planificare - Mai 2025                      < Prev  |  Next >           │
├─────┬──────┬──────┬─────┬─────┬──────┬──────┬──────┬──────┬─────┬───────┤
│     │   1  │   2  │  3  │  4  │  5   │  6   │  7   │  8   │ ... │  31   │
├─────┼──────┼──────┼─────┼─────┼──────┼──────┼──────┼──────┼─────┼───────┤
│ 📂 VENITURI │ 1000 │  —   │ —   │ —   │ 2500 │  —   │ 800  │  —   │ ... │  —    │
├─────┼──────┼──────┼─────┼─────┼──────┼──────┼──────┼──────┼─────┼───────┤
│  └ Salarii │ 1000 │  —   │ —   │ —   │ 2500 │  —   │  —   │  —   │ ... │  —    │
├─────┼──────┼──────┼─────┼─────┼──────┼──────┼──────┼──────┼─────┼───────┤
│  └ Dividende │ —  │  —   │ —   │ —   │  —   │  —   │ 800  │  —   │ ... │  —    │
├─────┼──────┼──────┼─────┼─────┼──────┼──────┼──────┼──────┼─────┼───────┤
│  └ [+ Adaugă] │   │      │     │     │      │      │      │      │     │       │
├─────┼──────┼──────┼─────┼─────┼──────┼──────┼──────┼──────┼─────┼───────┤
│ 📂 CHELTUIELI │ 200 │ 50  │ 100 │ —   │ 300  │ 75   │  —   │ 400  │ ... │ 1200  │
├─────┼──────┼──────┼─────┼─────┼──────┼──────┼──────┼──────┼─────┼───────┤
│  └ Utilități │ 200 │  —   │ —  │ —   │  —   │  —   │  —   │ 400  │ ... │  —    │
├─────┼──────┼──────┼─────┼─────┼──────┼──────┼──────┼──────┼─────┼───────┤
│  └ Alimente │  —  │ 50   │ 100 │ —   │ 300  │ 75   │  —   │  —   │ ... │ 200   │
├─────┼──────┼──────┼─────┼─────┼──────┼──────┼──────┼──────┼─────┼───────┤
│  └ [+ Adaugă] │   │      │     │     │      │      │      │      │     │       │
├─────┼──────┼──────┼─────┼─────┼──────┼──────┼──────┼──────┼─────┼───────┤
│ 📂 ECONOMII │  —   │  —   │ —   │ 500 │  —   │  —   │  —   │  —   │ ... │  —    │
├─────┼──────┼──────┼─────┼─────┼──────┼──────┼──────┼──────┼─────┼───────┤
│  └ Rezervă │  —   │  —   │ —   │ 500 │  —   │  —   │  —   │  —   │ ... │  —    │
├─────┼──────┼──────┼─────┼─────┼──────┼──────┼──────┼──────┼─────┼───────┤
│  └ [+ Adaugă] │   │      │     │     │      │      │      │      │     │       │
├─────┼──────┼──────┼─────┼─────┼──────┼──────┼──────┼──────┼─────┼───────┤
│ SOLD│ 800  │ 750  │ 650 │ 150 │ 2350 │ 2275 │ 3075 │ 2675 │ ... │ 1475  │
└─────┴──────┴──────┴─────┴─────┴──────┴──────┴──────┴──────┴─────┴───────┘
```

## 9. Interacțiuni utilizator detaliate

- **Click simplu** pe o celulă - Evidențiază celula și arată tooltip cu detaliile tranzacțiilor din ziua respectivă
- **Dublu-click** pe o celulă - Deschide modal pentru adăugare/editare tranzacție
- **Hover** peste o celulă cu tranzacții - Arată tooltip cu detalii complete (sumă, categorie, subcategorie)
- **Click** pe header de zi - Selectează coloana întreagă pentru vizualizare rapidă
- **Click** pe iconul 📂 (expandare/colapsare) - Expandează sau colapsează categoria și subcategoriile asociate 
- **Click** pe "[+ Adaugă]" - Deschide formular pentru adăugarea unei noi subcategorii în categoria principală respectivă

## 10. Comportament state management

- Când se schimbă luna, store-ul încarcă și memorează datele pentru luna respectivă
- Datele pentru lunile vizualizate anterior sunt păstrate în cache pentru navigare rapidă
- După adăugare/editare tranzacție, se recalculează doar soldurile afectate prin funcția specializată `recalcAffectedDailyBalances()`
- Starea expandare/colapsare categorii este persistată în localStorage pentru a menține preferințele utilizatorului între sesiuni
- Când o categorie este colapsată, se calculează automat suma totală pentru toate subcategoriile incluse folosind funcția `calculateCategoryTotal()`

## 11. Dependențe & note

* Refolosește **create‑react‑app** actual; nu introducem încă Vite.
* Pentru categorii și subcategorii, folosește ca sursă de adevăr structura din `shared-constants/categories.ts` care conține deja ierarhia completă:
  ```typescript
  CATEGORIES = {
    VENITURI: {
      "Surse de venit": ["Salarii", "Dividende", "Chirii", "Tichete de masă", ...],
      "Report": ["Venituri reportate din luna anterioară"]
    },
    ECONOMII: {
      "Categorii de economii": ["Fond de urgență", "Fond de rezervă", "Fond general"]
    },
    // Cheltuieli cu subcategoriile lor
    INFATISARE: { ... },
    EDUCATIE: { ... },
    CARIERA: { ... },
    // ... restul categoriilor
  }
  ```
* Dacă se adaugă/modifică categorii sau subcategorii, acestea vor fi sincronizate cu această structură pentru a menține consistența în toată aplicația
* Orice modificare la structura de categorii trebuie să fie persistată pentru a fi disponibilă în toate componentele aplicației
* Valorile enum TransactionType (INCOME, EXPENSE, SAVING) trebuie mapate corect la categoriile principale (VENITURI, CHELTUIELI, ECONOMII)
* TanStack Table se integrează în DEV-9 pentru headers fixe și scroll performant
* TanStack Virtual se va activa ulterior, dacă AC-1 nu este atins cu implementarea inițială
* Dinero.js se va introduce în Epic E-5, dar formatterele de sume se pregătesc pentru integrare
* **Dependențe BE**:
  * Endpoint `/api/transactions?month=YYYY-MM` trebuie să accepte parameterul month
  * Schema Transaction trebuie actualizată cu câmpurile `status` și `actualAmount`
  * API pentru adăugare/editare categorii și subcategorii trebuie să actualizeze `shared-constants/categories.ts` sau să ofere un endpoint dedicat pentru sincronizare

---

### „Definition of Done"

1. Toate AC‑urile trec manual & automat.
2. Teste jest + Cypress verzi pe CI.
3. Code review aprobat de alt dev (sau de tine cu checklist).
4. Fără regression pe fluxurile existente (login, listă tranzacții veche).
5. Documentație actualizată în README.md cu nouă funcționalitate.
6. Performance budget respectat (timp de încărcare și calcul).
7. Structura de categorii/subcategorii funcționează corect cu expandare/colapsare.
8. UI pentru adăugare subcategorii noi funcționează fără erori.
9. Compatibilitate completă cu modelul existent de categorii din `shared-constants/categories.ts`.
10. Orice modificare la categorii este reflectată corect în alte componente ale aplicației care folosesc aceste categorii.
11. Gridul este complet funcțional și fără bug-uri pe toate platformele specificate în secțiunea "Compatibilitate browsere" (Chrome ≥ 110, Firefox ≥ 110, Safari ≥ 16).

# LunarGridTanStack Paritate cu LunarGrid Clasic

> **Scop:** Aducerea componentei `LunarGridTanStack` la paritate completă de funcționalitate și UX cu `LunarGrid` clasic, pentru a permite eliminarea completă a implementării vechi.

## Checklist Paritate (bifează pe măsură ce implementezi)

### 1. Structură și UI de bază
- [x] Afișare categorii și subcategorii cu expand/collapse (inclusiv butoane Expand All/Collapse All)
  - Persistența și aria/data-testid verificate.
- [x] Rând de sold zilnic la finalul tabelului (cu stiluri corecte)
- [x] Stări de loading, empty, error (folosind textele din shared-constants)

### 2. Interacțiuni pe celule
- [x] Popover pentru adăugare tranzacție (click pe celulă)
- [x] Editare rapidă pe celulă (double click → inline input)
- [x] Validare și feedback pentru inputuri (ex: sumă invalidă)
- [x] Keyboard navigation: Enter = save, Escape = cancel

### 3. Subcategorii
- [x] Adăugare subcategorie (rând special la finalul categoriei)
- [x] Editare subcategorie (input inline la hover)
- [x] Ștergere subcategorie (buton la hover, doar pentru custom)
- [x] Toate acțiunile să fie accesibile cu tastatura

### 4. Business logic și date
- [x] Calcul corect sume pe zile/categorii/subcategorii (inclusiv recurring)
- [x] Determinare automată tip tranzacție după categorie (INCOME/EXPENSE/SAVING)
- [x] Sincronizare cu React Query/Zustand pentru date și cache
- [x] Invalidează cache-ul corect după orice mutație

### 5. Accesibilitate și testabilitate
- [x] Toate elementele interactive au `data-testid` predictibil
- [x] Fără string-uri hardcodate (doar shared-constants)
- [x] Toate textele și mesajele din UI vin din shared-constants/ui sau messages
- [x] Fără loguri de debug în production
- [x] Toate stilurile folosesc tokens/utilitare, nu clase Tailwind hardcodate

### 6. Refactor final
- [x] Eliminare cod mort/duplicat
- [x] Eliminare completă LunarGrid clasic și toggle din LunarGridPage
- [x] Update la documentație și fișierele mari de tracking

---

> **Notă:**
> - Structura subRows este acum 100% robustă: chei unice, fallback pentru subcategorii goale, warning pentru duplicate doar în dev.
> - Pattern-ul de chei: `${category}-${subcategory}` sau `${category}-__empty-<idx>` pentru subcategorii goale.
> - Nu mai există duplicate keys, nici crash la expand/collapse all.
> - Toate textele și datele folosesc sursa unică de adevăr.
> - Paritatea cu gridul clasic este completă, urmează doar optimizări de UX/virtualizare dacă e nevoie. 
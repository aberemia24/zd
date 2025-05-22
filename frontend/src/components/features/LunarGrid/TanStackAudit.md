# Audit TanStack Table - LunarGrid

> **Scop:** Audit detaliat pentru implementarea LunarGridTanStack, cu focus pe pattern-urile și API-ul TanStack Table, pentru a identifica bug-uri, lipsuri și anti-pattern-uri.

---

## 1. Funcționalități native TanStack Table
- [x] Expand/collapse pe rânduri de categorie (folosind row expansion API corect)
- [x] Butoane globale expand/collapse (table.toggleAllRowsExpanded) — **BUG: Crăpă pagina la click!** (✔️ REZOLVAT: pipeline subRows robust, nu mai există crash)
- [x] Custom row la final (Sold) — să nu fie inclus în datele tabelului
- [x] Subrows native (afișare subcategorii ca subrows TanStack, nu doar ca rânduri simple)
- [x] Cell rendering custom (popover, input inline, etc.)
- [ ] Virtualizare (dacă e nevoie la volume mari de date)
- [x] Folosirea corectă a getRowId, getCanExpand, getIsExpanded, toggleExpanded etc.

## 2. Funcționalități business/UX
- [x] Popover pentru tranzacție (click pe celulă)
- [x] Editare rapidă pe celulă (double click → input inline)
- [ ] Subcategorii: adăugare, editare, ștergere (UX identic cu clasic)
- [x] Sold zilnic (un singur rând custom la final)
- [x] Calcul sume corect pe zile/categorii/subcategorii
- [x] Determinare automată tip tranzacție după categorie
- [x] Sincronizare și invalidare cache corectă cu React Query

## 3. Accesibilitate & Testabilitate
- [x] Toate elementele interactive au `data-testid` predictibil
- [x] aria-expanded, aria-label, aria-controls pe elemente relevante
- [x] Fără string-uri hardcodate (doar shared-constants)
- [x] Toate textele și mesajele din UI vin din shared-constants/ui sau messages
- [x] Fără loguri de debug în production
- [x] Toate stilurile folosesc tokens/utilitare, nu clase Tailwind hardcodate

---

## **BUG-uri și TODO-uri prioritare**
- [x] **BUG:** Click pe "Extinde toate categoriile" crăpă complet pagina (✔️ REZOLVAT: pipeline subRows robust, fallback, warning duplicate)
- [x] Verifică dacă expand/collapse pe rânduri de categorie funcționează corect cu row expansion API TanStack
- [x] Asigură-te că nu există două rânduri Sold
- [x] Refactorizează subcategorii ca subrows native TanStack dacă e posibil (pentru UX și performanță)

---

> **Notă:**
> - Structura subRows este acum 100% robustă: chei unice, fallback pentru subcategorii goale, warning pentru duplicate doar în dev.
> - Pattern-ul de chei: `${category}-${subcategory}` sau `${category}-__empty-<idx>` pentru subcategorii goale.
> - Nu mai există duplicate keys, nici crash la expand/collapse all.
> - Toate textele și datele folosesc sursa unică de adevăr.
> - Următorul pas: virtualizare pentru volume mari de date (opțional).

> **Notă:** Actualizează acest audit la fiecare pas major. Folosește-l ca sursă de adevăr pentru debugging și refactor. La final, progresul va fi mutat în documentația principală a proiectului. 
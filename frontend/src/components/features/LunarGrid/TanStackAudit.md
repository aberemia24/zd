# Audit TanStack Table - LunarGrid

> **Scop:** Audit detaliat pentru implementarea LunarGridTanStack, cu focus pe pattern-urile și API-ul TanStack Table, pentru a identifica bug-uri, lipsuri și anti-pattern-uri.

---

## 1. Funcționalități native TanStack Table
- [ ] Expand/collapse pe rânduri de categorie (folosind row expansion API corect)
- [ ] Butoane globale expand/collapse (table.toggleAllRowsExpanded) — **BUG: Crăpă pagina la click!**
- [ ] Custom row la final (Sold) — să nu fie inclus în datele tabelului
- [ ] Subrows native (afișare subcategorii ca subrows TanStack, nu doar ca rânduri simple)
- [ ] Cell rendering custom (popover, input inline, etc.)
- [ ] Virtualizare (dacă e nevoie la volume mari de date)
- [ ] Folosirea corectă a getRowId, getCanExpand, getIsExpanded, toggleExpanded etc.

## 2. Funcționalități business/UX
- [ ] Popover pentru tranzacție (click pe celulă)
- [ ] Editare rapidă pe celulă (double click → input inline)
- [ ] Subcategorii: adăugare, editare, ștergere (UX identic cu clasic)
- [ ] Sold zilnic (un singur rând custom la final)
- [ ] Calcul sume corect pe zile/categorii/subcategorii
- [ ] Determinare automată tip tranzacție după categorie
- [ ] Sincronizare și invalidare cache corectă cu React Query

## 3. Accesibilitate & Testabilitate
- [ ] Toate elementele interactive au `data-testid` predictibil
- [ ] aria-expanded, aria-label, aria-controls pe elemente relevante
- [ ] Fără string-uri hardcodate (doar shared-constants)
- [ ] Toate textele și mesajele din UI vin din shared-constants/ui sau messages
- [ ] Fără loguri de debug în production
- [ ] Toate stilurile folosesc tokens/utilitare, nu clase Tailwind hardcodate

---

## **BUG-uri și TODO-uri prioritare**
- [ ] **BUG:** Click pe "Extinde toate categoriile" crăpă complet pagina (investighează cauza, probabil legată de lipsa subrows sau de structura datelor)
- [ ] Verifică dacă expand/collapse pe rânduri de categorie funcționează corect cu row expansion API TanStack
- [ ] Asigură-te că nu există două rânduri Sold
- [ ] Refactorizează subcategorii ca subrows native TanStack dacă e posibil (pentru UX și performanță)

---

> **Notă:** Actualizează acest audit la fiecare pas major. Folosește-l ca sursă de adevăr pentru debugging și refactor. La final, progresul va fi mutat în documentația principală a proiectului. 
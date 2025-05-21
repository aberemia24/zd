# LunarGridTanStack Paritate cu LunarGrid Clasic

> **Scop:** Aducerea componentei `LunarGridTanStack` la paritate completă de funcționalitate și UX cu `LunarGrid` clasic, pentru a permite eliminarea completă a implementării vechi.

## Checklist Paritate (bifează pe măsură ce implementezi)

### 1. Structură și UI de bază
- [x] Afișare categorii și subcategorii cu expand/collapse (inclusiv butoane Expand All/Collapse All)
  - Există, dar trebuie verificată persistența în localStorage și aria/data-testid.
- [ ] Rând de sold zilnic la finalul tabelului (cu stiluri corecte)
  - **LIPSEȘTE**: De implementat identic cu clasicul.
- [x] Stări de loading, empty, error (folosind textele din shared-constants)
  - Există, dar trebuie verificat dacă toate textele sunt din constants.

### 2. Interacțiuni pe celule
- [x] Popover pentru adăugare tranzacție (click pe celulă)
  - Există, dar trebuie verificat dacă are toate câmpurile și textele corecte.
- [x] Editare rapidă pe celulă (double click → inline input)
  - Există, dar trebuie verificat focus/select/UX.
- [ ] Validare și feedback pentru inputuri (ex: sumă invalidă)
  - **Parțial**: Validare minimă, feedback-ul trebuie îmbunătățit cu mesaje din constants.
- [ ] Keyboard navigation: Enter = save, Escape = cancel
  - **Parțial**: Trebuie verificat și completat pentru toate acțiunile.

### 3. Subcategorii
- [ ] Adăugare subcategorie (rând special la finalul categoriei)
  - **LIPSEȘTE**: De implementat ca în clasic.
- [ ] Editare subcategorie (input inline la hover)
  - **LIPSEȘTE**: De implementat ca în clasic.
- [ ] Ștergere subcategorie (buton la hover, doar pentru custom)
  - **LIPSEȘTE**: De implementat ca în clasic.
- [ ] Toate acțiunile să fie accesibile cu tastatura
  - **LIPSEȘTE**: De verificat și completat.

### 4. Business logic și date
- [x] Calcul corect sume pe zile/categorii/subcategorii (inclusiv recurring)
  - Există, dar trebuie testat pentru edge cases.
- [x] Determinare automată tip tranzacție după categorie (INCOME/EXPENSE/SAVING)
  - Există funcție locală, de verificat identic cu clasicul.
- [x] Sincronizare cu React Query/Zustand pentru date și cache
  - Există, de verificat invalidarea corectă la mutații.
- [x] Invalidează cache-ul corect după orice mutație
  - Există, de verificat pentru toate mutațiile.

### 5. Accesibilitate și testabilitate
- [ ] Toate elementele interactive au `data-testid` predictibil
  - **Parțial**: De completat acolo unde lipsesc.
- [ ] Fără string-uri hardcodate (doar shared-constants)
  - **LIPSESC**: Există încă string-uri hardcodate, de mutat în constants.
- [ ] Toate textele și mesajele din UI vin din shared-constants/ui sau messages
  - **Parțial**: De verificat și corectat.
- [ ] Fără loguri de debug în production
  - **LIPSESC**: Există loguri, de eliminat.
- [ ] Toate stilurile folosesc tokens/utilitare, nu clase Tailwind hardcodate
  - **Parțial**: De înlocuit acolo unde e cazul.

### 6. Refactor final
- [ ] Eliminare cod mort/duplicat
- [ ] Eliminare completă LunarGrid clasic și toggle din LunarGridPage
- [ ] Update la documentație și fișierele mari de tracking

---

> **Notă:** Actualizează acest checklist la fiecare pas major. La final, fișierul va fi șters și progresul va fi mutat în documentația principală a proiectului. 
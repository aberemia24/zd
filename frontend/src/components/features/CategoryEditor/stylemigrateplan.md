# ✅ Plan de Migrare a Stilurilor pentru `CategoryEditor`

## 1. Audit inițial și probleme identificate

### 1.1. Probleme de stil
- [ ] Clase Tailwind hardcodate în JSX (ex: `bg-secondary-50`, `rounded-token`, `btn btn-primary` etc.)
- [ ] Folosire inconsistentă a spațierii și mărimilor
- [ ] Badge-uri și carduri fără sistem de tokens
- [ ] Lipsă utilizare `getEnhancedComponentClasses`

### 1.2. Probleme de text/constante
- [ ] Texte UI hardcodate (ex: "Gestionare Subcategorii", "Redenumește", "custom", etc.)
- [ ] Texte lipsă din `shared-constants/ui.ts` și `shared-constants/messages.ts`
- [ ] Mesaje de eroare hardcodate

## 2. Taskuri de refactorizare incrementală

### 2.1. Refactorizare stiluri (✅ = complet, ⬜ = de făcut)
- [ ] ⬜ Container modal: `getEnhancedComponentClasses('modal', 'overlay', ...)`
- [ ] ⬜ Card principal: `getEnhancedComponentClasses('card', 'elevated', 'lg', ...)`
- [ ] ⬜ Buton închidere: `getEnhancedComponentClasses('button', 'ghost', 'sm', ...)`
- [ ] ⬜ Alert eroare: `getEnhancedComponentClasses('alert', 'error', ... )`
- [ ] ⬜ Container conținut: `getEnhancedComponentClasses('flex', ..., ['gap-6'])`
- [ ] ⬜ Secțiune categorii: `getEnhancedComponentClasses('card-section', ..., ['w-1/3', 'border-r', 'pr-4'])`
- [ ] ⬜ Secțiune subcategorii: `getEnhancedComponentClasses('card-section', ..., ['w-2/3', 'pl-4'])`
- [ ] ⬜ Liste: `getEnhancedComponentClasses('list-container', ...)` și itemi: `getEnhancedComponentClasses('list-item', ...)`
- [ ] ⬜ Badge: `getEnhancedComponentClasses('badge', ...)`
- [ ] ⬜ Toate butoanele: utilizare sistem variant (primary, secondary, danger, etc.)
- [ ] ⬜ Inputuri: `getEnhancedComponentClasses('input', ...)`

### 2.2. Extragere și centralizare texte
- [ ] ⬜ Adaugă în `shared-constants/ui.ts` secțiunea `CATEGORY_EDITOR` cu toate textele UI:
```ts
CATEGORY_EDITOR: {
  TITLE: 'Gestionare Subcategorii',
  CATEGORIES_SECTION_TITLE: 'Categorii',
  SUBCATEGORIES_SECTION_TITLE: 'Subcategorii pentru',
  CUSTOM_BADGE: 'custom',
  RENAME_BUTTON: 'Redenumește',
  DELETE_BUTTON: 'Șterge',
  ADD_PLACEHOLDER: 'Adaugă subcategorie nouă',
  ADD_BUTTON: 'Adaugă',
  NO_SELECTION: 'Selectează o categorie pentru a vedea și edita subcategoriile.',
  DELETE_CONFIRMATION_TITLE: 'Confirmare ștergere',
  DELETE_CONFIRMATION_TEXT: 'Ești sigur că vrei să ștergi subcategoria {subcat} din {cat}?',
  DELETE_WARNING: 'Atenție: Există {count} tranzacții care folosesc această subcategorie.',
  CONFIRM_DELETE_BUTTON: 'Confirmă ștergerea',
  CANCEL_BUTTON: 'Anulează'
}
```
- [ ] ⬜ Adaugă în `shared-constants/messages.ts` secțiunea `CATEGORII` cu toate mesajele de validare/eroare:
```ts
CATEGORII: {
  NUME_GOL: 'Numele nu poate fi gol',
  SUBCATEGORIE_EXISTENTA: 'Există deja o subcategorie cu acest nume',
  EROARE_STERGERE: 'Eroare la ștergerea subcategoriei',
  NU_SE_POT_STERGE_PREDEFINITE: 'Nu se pot șterge subcategoriile predefinite, doar cele personalizate.'
}
```

### 2.3. Refactorizare cod
- [ ] ⬜ Actualizează importurile pentru constante și utilitare
- [ ] ⬜ Înlocuiește toate textele hardcodate cu constante din `CATEGORY_EDITOR` și `CATEGORII`
- [ ] ⬜ Înlocuiește toate clasele Tailwind cu `getEnhancedComponentClasses`
- [ ] ⬜ Asigură-te că toate inputurile și butoanele folosesc tokens și variante corecte
- [ ] ⬜ Refactorizează dialogul de confirmare pentru a folosi sistemul de design și mesaje centralizate

### 2.4. Testare & QA
- [ ] ⬜ Testare vizuală (UI/UX)
- [ ] ⬜ Testare funcțională (adăugare, redenumire, ștergere subcategorie)
- [ ] ⬜ Testare edge cases (validare, mesaje eroare, focus, accesibilitate)
- [ ] ⬜ Testare responsive

### 2.5. Îmbunătățiri opționale
- [ ] ⬜ Animare dialoguri/modal
- [ ] ⬜ ARIA/Focus management
- [ ] ⬜ Separare logică în subcomponente
- [ ] ⬜ Memoizare selectoare și callback-uri pentru performanță

## 3. Fișiere afectate
- [ ] `frontend/src/components/features/CategoryEditor/CategoryEditor.tsx`
- [ ] `shared-constants/ui.ts`
- [ ] `shared-constants/messages.ts`
- [ ] `shared-constants/index.ts` (barrel)

---

> **Notă:** Marchează fiecare task completat cu `[x]` și adaugă detalii suplimentare dacă apar decizii de arhitectură sau workaround-uri. Toate excepțiile trebuie documentate în PR și DEV_LOG.md.
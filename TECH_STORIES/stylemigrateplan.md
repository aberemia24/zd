# ✅ Plan de Migrare a Stilurilor pentru `CategoryEditor`

## 1. Audit inițial și probleme identificate

### 1.1. Probleme de stil
- [ ] Clase Tailwind hardcodate în JSX (ex: `bg-secondary-50`, `rounded-token`, `btn btn-primary` etc.)
- [ ] Folosire inconsistentă a spațierii și mărimilor
- [ ] Badge-uri și carduri fără sistem de tokens
- [ ] Lipsă utilizare `getEnhancedComponentClasses`
- [ ] Inconsistență cu alte componente moderne din proiect

### 1.2. Probleme de text/constante
- [ ] Texte UI hardcodate (ex: "Gestionare Subcategorii", "Redenumește", "custom", etc.)
- [ ] Texte lipsă din `shared-constants/ui.ts` și `shared-constants/messages.ts`
- [ ] Mesaje de eroare hardcodate

### 1.3. Probleme de tip și performanță
- [ ] Multiple state-uri locale care ar putea fi consolidate
- [ ] Lipsă tipizare strictă pentru props și state
- [ ] Potențiale re-renderuri inutile
- [ ] Lipsă memoizare pentru liste și callback-uri

## 2. Audit de consistență cu alte componente refactorizate

Am analizat alte componente recent refactorizate pentru a asigura consistența:

### 2.1 Elemente comune identificate în componente moderne
- [x] Utilizează exclusiv `getEnhancedComponentClasses` pentru stiluri
- [x] Folosesc props de tip `with*` pentru efecte vizuale (ex: `withGlowFocus`, `withFadeIn`)
- [x] Utilizează memoizare strategică prin `React.memo`, `useCallback`, `useMemo`
- [x] Au tipuri TypeScript robuste și explicite
- [x] Folosesc constante din shared-constants pentru texte UI
- [x] Utilizează state-uri de focus/activare pentru efecte vizuale
- [x] Implementează props transiente cu prefix ` pentru flags care nu ajung în DOM
- [x] Organizează codul în secțiuni logice cu comentarii descriptive

### 2.2 Componente analizate
- **TransactionForm**: Folosește efecte vizuale rafinate, state-uri de activare pentru focus
- **LunarGridTanStack**: Optimizează prin memo și callback-uri, tipuri robuste
- **LoginForm/RegisterForm**: Gestionează stări de UI avansate
- **Button/Alert/Badge**: Implementează controlul efectelor vizuale prin props

## 3. Taskuri de refactorizare incrementală

### 3.1. Management stat și tipizare (✅ = complet, ⬜ = de făcut)
- [x] Consolidarea state-urilor conexe (ex: editingCell și deletingCell)
- [x] Definirea interfețelor explicite pentru toate props-urile interne
- [ ] ⬜ Folosirea tipurilor stricte pentru toți parametrii funcțiilor
- [ ] ⬜ Implementarea transient props cu prefix ` unde e cazul
- [ ] ⬜ Tipizarea strictă a event handler-ilor

### 3.2. Refactorizare stiluri
- [ ] ⬜ Container modal: `getEnhancedComponentClasses('modal', 'overlay', ...)` (în curs)
- [ ] ⬜ Card principal: `getEnhancedComponentClasses('card', 'elevated', 'lg', ...)` (în curs)
- [ ] ⬜ Buton închidere: `getEnhancedComponentClasses('button', 'ghost', 'sm', ...)` (în curs)
- [ ] ⬜ Alert eroare: `getEnhancedComponentClasses('alert', 'error', ... )`
- [ ] ⬜ Container conținut: `getEnhancedComponentClasses('flex', ..., ['gap-6'])`
- [x] ✅ Secțiune categorii: `getEnhancedComponentClasses('card-section', ..., ['w-1/3', 'border-r', 'pr-4'])`
- [x] ✅ Secțiune subcategorii: `getEnhancedComponentClasses('card-section', ..., ['w-2/3', 'pl-4'])`
- [x] ✅ Liste: `getEnhancedComponentClasses('list-container', ...)` și itemi: `getEnhancedComponentClasses('list-item', ...)`
- [ ] ⬜ Badge: `getEnhancedComponentClasses('badge', ...)` cu props `withPulse` pentru animație
- [ ] ⬜ Toate butoanele: utilizare sistem variant (primary, secondary, danger, etc.)
- [ ] ⬜ Inputuri: `getEnhancedComponentClasses('input', ...)` cu efecte vizuale

### 3.3. Extragere și centralizare texte
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

### 3.4. Optimizări de performanță
- [ ] ⬜ Memoizare componente de listă cu `React.memo`
- [ ] ⬜ Folosire `useCallback` pentru event handlers
- [ ] ⬜ Implementare `useMemo` pentru transformări de date
- [ ] ⬜ Evitarea re-renderurilor în cascadă
- [ ] ⬜ Verificare cu React DevTools pentru optimizări

### 3.5. Refactorizare cod
- [ ] ⬜ Actualizează importurile pentru constante și utilitare
- [ ] ⬜ Înlocuiește toate textele hardcodate cu constante din `CATEGORY_EDITOR` și `CATEGORII`
- [ ] ⬜ Înlocuiește toate clasele Tailwind cu `getEnhancedComponentClasses`
- [ ] ⬜ Asigură-te că toate inputurile și butoanele folosesc tokens și variante corecte
- [ ] ⬜ Refactorizează dialogul de confirmare pentru a folosi sistemul de design și mesaje centralizate

### 3.6. Testare & QA
- [ ] ⬜ Testare vizuală (UI/UX) 
- [ ] ⬜ Testare funcțională (adăugare, redenumire, ștergere subcategorie)
- [ ] ⬜ Testare edge cases (validare, mesaje eroare, focus, accesibilitate)
- [ ] ⬜ Testare responsive
- [ ] ⬜ Verificarea performanței cu React DevTools

### 3.7. Îmbunătățiri avansate
- [ ] ⬜ Animare dialoguri/modal cu efecte de tranziție
- [ ] ⬜ ARIA/Focus management pentru accesibilitate
- [ ] ⬜ Separare logică în subcomponente reutilizabile
- [ ] ⬜ Implementare hook custom `useCategoryEditorState` pentru gestionarea stării
- [ ] ⬜ Suport pentru keyboard navigation
- [ ] ⬜ Tactile feedback pentru mobile

## 4. Fișiere afectate
- [ ] `frontend/src/components/features/CategoryEditor/CategoryEditor.tsx` (refactorizare principală)
- [ ] `shared-constants/ui.ts` (adăugare texte UI)
- [ ] `shared-constants/messages.ts` (adăugare mesaje eroare)
- [ ] `shared-constants/index.ts` (barrel - verificare exports)
- [ ] Posibil nou fișier: `frontend/src/components/features/CategoryEditor/useCategoryEditorState.ts` (opțional)

---

> **Notă:** Marchează fiecare task completat cu `[x]` și adaugă detalii suplimentare dacă apar decizii de arhitectură sau workaround-uri. Toate excepțiile trebuie documentate în PR și DEV_LOG.md.
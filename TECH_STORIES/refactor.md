# 🛠️ Plan Refactorizare CategoryEditor

> _Analiză pe baza_ `BEST_PRACTICES.md` _și a memoriilor proiectului._

---

## ⚠️ Probleme identificate

### 1. Încălcarea regulilor de hooks React
- **Problemă:** Definirea funcțiilor (ex: `badge`, `handleAdd`) după `if (!open) return null;`
- **Regulă încălcată:** Toate hook-urile și funcțiile definite cu hooks trebuie să fie apelate în aceeași ordine la fiecare randare _(React fundamental rules)_
- **Consecință:** Eroarea `Rendered more hooks than during the previous render`

### 2. Lipsa memoizării corespunzătoare
- **Problemă:** Funcții precum `badge` definite fără `useCallback`
- **Regulă încălcată:** Optimizări de performanță (BEST_PRACTICES.md §3.4)
- **Consecință:** Re-renderuri nenecesare, probleme de performanță

### 3. Inconsistență în folosirea getEnhancedComponentClasses
- **Problemă:** Unele apeluri nu includ type assertions corecte sau parametri suficienți
- **Regulă încălcată:** Sistemul de stiluri rafinate (BEST_PRACTICES.md §60-115)
- **Consecință:** Erori TypeScript, inconsistență vizuală

### 4. Text hardcodat în componente
- **Problemă:** Texte precum `custom`, `Redenumește`, `Șterge` sunt hardcodate, nu extrase din `UI.CATEGORY_EDITOR`
- **Regulă încălcată:** Sursă unică de adevăr pentru texte UI _(Global Rules 1.2)_
- **Consecință:** Dificultate la mentenanță, imposibilitate de traducere/uniformizare

---

## 📋 Pași de refactorizare

### 1️⃣ Corectarea regulilor de hooks
- Mută toate definițiile de funcții (inclusiv badge, handleAdd etc.) **înainte** de `if (!open) return null;`
- Aplică `useCallback` pentru toate funcțiile helper și event handlers
- Adaugă dependențele corecte în array-urile de dependențe pentru `useCallback`

### 2️⃣ Optimizarea performanței
- Memoizează corect funcțiile cu `useCallback`
- Folosește `useMemo` pentru calcule derivate (ex: `selectedCategoryObj`)
- Optimizează re-render-urile prin separarea stării între diferite părți ale UI-ului

### 3️⃣ Corectarea sistemului de stiluri
- Verifică toate apelurile `getEnhancedComponentClasses` să aibă numărul corect de argumente (4-5)
- Adaugă type assertions corecte (`as ComponentType`, etc.)
- Înlocuiește orice clasă Tailwind hardcodată cu componente semantice sau tokens din sistemul de design

### 4️⃣ Centralizarea textelor
- Extrage toate textele hardcodate în constante în `shared-constants/ui.ts` (ex: `UI.CATEGORY_EDITOR.RENAME`, `UI.CATEGORY_EDITOR.DELETE`)
- Actualizează importurile și folosește **doar** aceste constante în componentă

### 5️⃣ Îmbunătățiri generale
- Asigură-te că toate elementele interactive au `data-testid` unic și predictibil _(conform regulilor de testare automată)_
- Optimizează gestionarea erorilor și validarea formularelor (folosește mesaje din `shared-constants/messages.ts`)
- Documentează toate schimbările relevante în `DEV_LOG.md`

---

> _Acest plan va rezolva problemele imediate din componenta CategoryEditor și va asigura conformitatea cu toate regulile și best practices din proiect._
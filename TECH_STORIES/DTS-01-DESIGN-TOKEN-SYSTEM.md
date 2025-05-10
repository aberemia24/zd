# User Story & Tech Story – Design Token System

## User Story
**ID:** DTS-01  
**Titlu:** Implementarea unui sistem de design token pentru consistență vizuală

**Ca** dezvoltator/designer de pe echipa Budget App,  
**Vreau** să am un sistem centralizat de stilizare bazat pe design tokens,  
**Pentru ca** să pot menține o experiență vizuală consistentă în întreaga aplicație și să pot face schimbări de stil în mod eficient.

### Criterii de acceptare
- Toate componentele folosesc stiluri din sistemul de tokens
- Schimbarea unei culori principale se propagă automat în toată aplicația
- Documentația pentru folosirea noului sistem este disponibilă
- Toate testele existente trec cu noile stiluri
- Performance-ul aplicației rămâne la același nivel sau se îmbunătățește

---

## Tech Story
### Analiză Dependințe și Structură Proiect
**Dependințe existente relevante:**
- Tailwind CSS 4.1.4
- TypeScript 5.4.5
- @craco/craco 7.1.0
- Jest 29.7.0
- React 18.2.0

**Structura existentă:**
```
frontend/
├── src/
│   ├── components/
│   │   ├── primitives/      # Butoane, inputuri, etc.
│   │   └── features/        # LunarGrid, TransactionForm, etc.
│   ├── constants/           # UI constants locale
│   ├── styles/              # utils.css 
│   ├── stores/              # Zustand stores
│   └── types/               # TypeScript types
├── shared-constants/        # Constants partajate
├── craco.config.js          # Webpack overrides
└── tailwind.config.js       # Configurație Tailwind
```

### Plan de Implementare
#### 1. Fișiere de creat:
```
frontend/src/styles/
├── theme.ts                  # Definirea design tokens
├── themeUtils.ts             # Utilities pentru accesarea tokens
├── componentThemes.ts        # Stiluri specifice componentelor
└── themeTypes.ts             # Type definitions pentru theme
```
#### 2. Fișiere de modificat:
- `tailwind.config.js`
  - Extinderea culorilor existente cu theme.colors
  - Adăugarea spațierilor custom
  - Configurarea shadow-urilor personalizate
- `frontend/src/styles/utils.css`
  - Refactorizarea claselor existente să folosească tokens
  - Adăugarea noilor clase de utilitate bazate pe tokens

#### 3. Componente primitive (în ordine de prioritate):
- Button/Button.tsx
- Input/Input.tsx
- Select/Select.tsx
- Checkbox/Checkbox.tsx
- Alert/Alert.tsx
- Badge/Badge.tsx

#### 4. Componente feature:
- LunarGrid/LunarGrid.tsx
- TransactionTable/TransactionTable.tsx
- TransactionForm/TransactionForm.tsx
- TransactionFilters/TransactionFilters.tsx

#### 5. Teste:
- Actualizarea snapshot testelor existente
- Adăugarea testelor pentru theme utilities

---

### Riscuri și Soluții
- **Risc 1:** Breaking Changes în Stilurile Existente  
  **Soluție:** Implementare treptată, component cu component. Păstrarea claselor Tailwind existente ca fallback. Testare vizuală înainte de deploy.
- **Risc 2:** Conflict cu Configurația Tailwind Existentă  
  **Soluție:** Namespace pentru noile token-uri (ex: primary-button vs primary). Merge atent cu configurația existentă. Testare în mediu de dezvoltare.
- **Risc 3:** Performance Impact  
  **Soluție:** Purge CSS activat în producție. Monitorizare bundle size. Lazy loading pentru theme utilities.
- **Risc 4:** Probleme cu Jest și JSDOM  
  **Soluție:** Mockuri pentru dynamic imports. Setup specific pentru testing environment.

---

### Ordinea de Implementare
**Semana 1: Setup Infrastructure**
- Crearea fișierelor tema
- Configurarea Tailwind cu tokens
- Documentarea sistemului

**Semana 2: Componente Primitive**
- Refactorizarea Button, Input, Select
- Testare și ajustări
- Actualizarea testelor

**Semana 3: Componente Feature**
- Refactorizarea LunarGrid și TransactionTable
- Testare în contextul real
- Optimizări performance

**Semana 4: Polishing și QA**
- Verificarea consistenței vizuale
- Optimizări finale
- Documentație completă

---

### Criterii de Success
**Consistență:**
- Toate culorile respectă sistemul de tokens
- Hover/focus states consistente în toată aplicația
- Spacing uniform folosind tokens

**Mentenabilitate:**
- O schimbare de brand se face în sub 5 minute
- Adăugarea unei componente noi cu stiluri consistente durează sub 30 minute

**Performance:**
- Bundle size nu crește cu mai mult de 5%
- Load time rămâne la fel

**Developer Experience:**
- Documentație clară și exemple
- TypeScript support pentru autocompletare
- Helper functions pentru cazuri comune

---

## Modificări Minime în Cod
```typescript
// Exemplu de modificare în Button.tsx
// Înainte:
<button className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded">

// După:
<button className={getComponentClasses('button', { variant: 'primary', size: 'md' })}>
```

---

## Testare
- Visual regression tests pentru componente majore
- Unit tests pentru theme utilities
- Integration tests pentru componente complexe (LunarGrid)
- Manual QA pentru consistență vizuală

---

> _Documentul va fi actualizat incremental pe măsură ce implementarea avansează._

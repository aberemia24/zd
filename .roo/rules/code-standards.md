---
description: 
globs: 
alwaysApply: true
---
# Standarde de Cod
<naming_conventions>
- Constants/enums: SCREAMING_SNAKE_CASE (ex: MAX_ITEMS)
- Tipuri/interfețe: PascalCase (ex: Transaction, UserState)
- Componente React: PascalCase (ex: TransactionForm)
- Hooks/store-uri: camelCase cu prefix (ex: useTransactionStore)
- Fișiere componente: PascalCase.tsx (ex: Button.tsx)
- Fișiere utilitare: camelCase.ts (ex: formatDate.ts)
- Fișiere test: ComponentName.test.tsx
</naming_conventions>
<imports_organization>
Grupați importurile în blocuri separate:
React și librării externe
Pachetul `@budget-app/shared-constants`
Componente și hooks
Utilitare și tipuri
Importurile absolute înaintea celor relative
Evitați importurile * (wildcard)
</imports_organization>
<typescript>
- Definiți explicit tipurile pentru props
- Evitați folosirea `any` sau `unknown`
- Folosiți interfețe pentru objects cu structură clară
- Definiți types pentru funcții arrow
- Evitați type assertions (as) când e posibil
</typescript>
<formatting>
- Indentare: 2 spații
- Semicoloane la finalul statement-urilor
- Spațiu după if, for, while și între operatori
- Fiecare statement pe linie proprie
- Maximum 80-100 caractere pe linie
- Utilizați destructuring pentru props și state
</formatting>
<documentation>
- Adăugați JSDoc pentru funcții exportate și tipuri
- Comentați doar logica complexă sau neobișnuită
- Începeți comentariile cu majusculă, terminați cu punct
- Actualizați comentariile când modificați codul
typescript/**
 * Formatează o sumă monetară conform standardelor locale.
 * @param amount - Suma de formatat
 * @param currency - Codul valutei (implicit: RON)
 * @returns String formatat (ex: "123,45 RON")
 */
export function formatCurrency(amount: number, currency = 'RON'): string {
  // ...
}
</documentation>
<jsx_extension>
- Orice fișier care conține sintaxă JSX (inclusiv hooks sau utilitare) trebuie să folosească extensia `.tsx`.
- NICIODATĂ nu folosiți extensia `.ts` pentru fișiere cu JSX, indiferent de tipul fișierului (componentă, hook etc).
- La refactorizare, dacă adăugați JSX într-un fișier `.ts`, redenumiți-l imediat în `.tsx`.
- Semne că trebuie `.tsx`: folosiți taguri JSX (`<div>`, `<Component>`) sau returnați JSX din funcții/hook-uri.

**ESLint Enforcement:**
- ESLint este configurat să detecteze automat încălcările acestor reguli
- Scriptul `validate:jsx-extensions` verifică consistența extensiilor de fișiere
- Pre-commit hooks blochează commit-urile cu extensii incorecte
- CI/CD pipeline execută validări automatizate pentru conformitate
</jsx_extension>
<enum_casting>
- Folosiți întotdeauna cast explicit cu `as EnumType` când convertiți între string și enum.
- Pentru valori condiționale, partea de 'else' trebuie să returneze `undefined` dacă tipul permite.
- Nu folosiți cast implicit sau `as string` pentru enum-uri.
- Exemplu corect:
  ```typescript
  saveTransaction({
    type: type as TransactionType,
    frequency: recurring ? (frequency as FrequencyType) : undefined
  });

<linting_rules>
**ESLint Configuration:**
- `@typescript-eslint/no-explicit-any: "warn"` - Detectează și descurajează folosirea tipurilor `any` explicite
- `@typescript-eslint/no-unused-vars: "warn"` - Identifică variabile, parametri și import-uri neutilizate
- `no-console: ["warn", { "allow": ["warn", "error"] }]` - Previne console.log în producție (permite warn/error)
- `curly: ["error", "all"]` - Forțează folosirea acoladelor pentru toate statement-urile condiționale
- `prefer-const: "warn"` - Încurajează folosirea `const` în loc de `let` când e posibil
- `no-var: "error"` - Interzice folosirea `var` în favoarea `let`/`const`
- `eqeqeq: ["error", "always"]` - Forțează compararea strictă (`===` în loc de `==`)

**Automated Validation:**
- Script: `pnpm run validate:typescript-quality` - verifică calitatea TypeScript
- Script: `pnpm run validate:jsx-extensions` - verifică extensiile de fișiere
- Script: `pnpm run validate:console-cleanup` - detectează console statements rămase
- Pre-commit hooks execută validările automat înainte de commit
- CI/CD pipeline include toate validările pentru pull requests
</linting_rules>
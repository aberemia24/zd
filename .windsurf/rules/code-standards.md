---
trigger: always_on
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
Constants/shared (@shared-constants)
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
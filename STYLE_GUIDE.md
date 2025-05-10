# STYLE_GUIDE.md

## Sistemul de Design Tokens & Stilizare (BudgetApp)

### 1. Principii generale
- Toate stilurile și culorile provin din sistemul centralizat de design tokens (`theme.ts`, `themeTypes.ts`).
- Nu se folosesc valori hardcodate în componente/utilitare – totul se mapează din tokens.
- Orice modificare/adăugare de tokens trebuie documentată aici și în DEV_LOG.md.
- Integrarea cu Tailwind se face prin `tailwind.config.js` (culori, spacing, radius, shadows, fonturi etc.).
- Se folosesc clase utilitare Tailwind cu semantică (`bg-primary-500`, `text-error-600`, etc.).

### 2. Structură și extensibilitate
- Tokens principali: colors, spacing, borderRadius, shadows, typography.
- Fiecare token are tipuri clare în `themeTypes.ts` și valori în `theme.ts`.
- Utilitarele din `themeUtils.ts` oferă acces sigur și generare de clase pentru componente.
- Temele de componente (`componentThemes.ts`) folosesc doar clase bazate pe tokens.

### 3. Reguli pentru modificare/actualizare
- Orice adăugare/modificare de token se face în `themeTypes.ts` și `theme.ts`.
- Se actualizează și `tailwind.config.js` dacă e nevoie de mapare nouă.
- Se adaugă exemplu de utilizare și descriere aici.
- Se notează modificarea în DEV_LOG.md.

### 4. Exemple de utilizare
```tsx
// Button cu tokens
<button className={getComponentClasses('button', 'primary', 'md')}>
  Salvează
</button>

// Utilizare directă Tailwind
<div className="bg-primary-50 text-gray-900 rounded-lg shadow-md p-4">
  ...
</div>
```

### 5. Best practices
- Folosește doar clase generate din tokens.
- Nu modifica direct utility classes în JSX fără să actualizezi tokens.
- Documentează orice excepție aici și în DEV_LOG.md.

---
Ultima actualizare: 2025-05-10

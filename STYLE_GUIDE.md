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

- **Tailwind/PostCSS:** NU folosi @import pentru fișiere ce conțin @layer și @apply (ex: utils.css). Scrie utilitarele custom cu @layer components direct în index.css, după @tailwind components și înainte de @tailwind utilities. Dacă folosești @import pentru astfel de fișiere, buildul va eșua cu eroarea: `@layer components is used but no matching @tailwind components directive is present.`
- @import e permis doar pentru reseturi simple sau variabile, nu pentru utilitare cu @apply/@layer.

- Toate componentele primitive (Button, Input, Select, Checkbox, Alert, Badge, Textarea, Loader, Spinner) folosesc EXCLUSIV tokens din sistemul centralizat pentru stiluri.
- Exemple de tokens: `input-field`, `border-error`, `text-error`, `bg-success-50`, `stroke-primary-500`, `accent-primary` etc.
- Este INTERZISĂ folosirea stringurilor hardcodate pentru stiluri sau a claselor Tailwind generice (ex: border-red-500).
- data-testid trebuie să fie unic, predictibil și stabil pentru fiecare variantă/stare (ex: `input-field-error`, `alert-warning`, `badge-success`).
- Loader/Spinner: animație și culoare din tokens, nu valori hardcodate SVG.
- Orice excepție se documentează explicit în PR și DEV_LOG.md.

- Folosește doar clase generate din tokens.
- Nu modifica direct utility classes în JSX fără să actualizezi tokens.
- Documentează orice excepție aici și în DEV_LOG.md.

---
Ultima actualizare: 2025-05-10

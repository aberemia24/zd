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
- **NOU:** Efectele vizuale (fx-) sunt definite în `componentMap/` și aplicate cu `getEnhancedComponentClasses`.
- **NOU:** Toate componentele folosesc exclusiv `getEnhancedComponentClasses` pentru stilizare (nu Tailwind direct).

### 3. Reguli pentru modificare/actualizare
- Orice adăugare/modificare de token se face în `themeTypes.ts` și `theme.ts`.
- Se actualizează și `tailwind.config.js` dacă e nevoie de mapare nouă.
- Pentru efecte vizuale noi, se adaugă în directorul `componentMap/` fișierul corespunzător.
- Se adaugă exemplu de utilizare și descriere aici.
- Se notează modificarea în DEV_LOG.md.

### 4. Exemple de utilizare

```tsx
// RECOMANDAT: Folosirea getEnhancedComponentClasses (cel mai corect approach)
<button 
  className={getEnhancedComponentClasses('button', 'primary', 'md', undefined, ['shadow', 'gradient'])}
>
  Salvează
</button>

// Utilizare directă Tailwind (conform temei "earthy" și token-urilor)
<div className="bg-secondary-50 text-neutral-900 rounded-token shadow-token p-token">
  {/* Conținutul div-ului */}
</div>
```

#### 4.1 Aplicarea temei "Earthy" cu token-uri și clase utilitare

Refactorizarea recentă a introdus pe scară largă tema "earthy". Aceasta se bazează pe utilizarea consecventă a token-urilor de design (definite în `tailwind.config.js` și aplicate prin clase Tailwind ca `bg-primary-500`, `p-token`, `mb-token-sm` etc.) și a claselor utilitare custom definite în `frontend/src/index.css` (ex: `.btn`, `.input-field`, `.alert`).

**Exemplu 1: Formular (Input și Label)**
```tsx
// Etichetă pentru câmpul de formular
<label htmlFor="email" className="block text-neutral-700 text-sm font-bold mb-token-sm">
  Email
</label>

// Câmp de input standard (folosind o clasă utilitară custom)
<input
  type="email"
  id="email"
  name="email"
  className="input-field focus:ring-primary-500"
  placeholder="exemplu@domeniu.com"
/>

// Câmp de input cu eroare (folosind clase utilitare custom)
<input
  type="password"
  id="password"
  name="password"
  className="input-field input-error focus:ring-error-500"
  placeholder="********"
/>
```

**Exemplu 2: Buton (folosind clase utilitare custom)**
```tsx
// Buton primar
<button type="submit" className="btn btn-primary">
  Autentificare
</button>

// Buton secundar (exemplu)
<button type="button" className="btn btn-secondary">
  Anulează
</button>
```

**Exemplu 3: Card / Container general (aplicare directă token-uri)**
```tsx
// Înainte (stiluri Tailwind generice):
// <div className="bg-white shadow-md rounded-lg p-6 mb-4">

// După (cu token-uri și tema earthy):
<div className="bg-secondary-50 shadow-token rounded-token p-token-lg mb-token">
  <h3 className="text-xl font-semibold text-primary-700 mb-token-md">Titlu Card</h3>
  <p className="text-neutral-600">Conținutul cardului...</p>
</div>
```

**Exemplu 4: Celulă de tabel (aplicare directă token-uri)**
```tsx
// Cap de tabel (TH)
<th className="px-token py-token-sm text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
  Nume Coloană
</th>

// Celulă de date (TD)
<td className="px-token py-token-sm whitespace-nowrap text-sm text-neutral-900">
  Valoare Celulă
</td>
```

**Exemplu 5: Mesaj de Alertă/Notificare**
```tsx
// Alertă de eroare (folosind clase utilitare custom)
<div className="alert alert-error" role="alert">
  A apărut o eroare la procesarea solicitării.
</div>

// Alternativ, fără clase utilitare dedicate (aplicare directă de token-uri):
<div className="mt-token p-token-sm bg-error-100 text-error-700 rounded-token" role="alert">
  A apărut o eroare la procesarea solicitării.
</div>
```

#### 4.2 Utilizarea efectelor vizuale (fx-) în componente

Noul sistem permite aplicarea de efecte vizuale consistente în întreaga aplicație. Acestea sunt definite în directorul `componentMap/` și pot fi aplicate cu `getEnhancedComponentClasses`.

**Exemplu 1: Buton cu efect gradient și shadow**
```tsx
<button 
  className={getEnhancedComponentClasses('button', 'primary', 'md', undefined, ['gradient', 'shadow'])}
>
  Acțiune Principală
</button>
```

**Exemplu 2: Card cu efect fadeIn și shadow**
```tsx
<div 
  className={getEnhancedComponentClasses('card', 'default', 'lg', undefined, ['fadeIn', 'shadow'])}
>
  Conținut Card
</div>
```

**Exemplu 3: Alertă cu efect accentBorder și icon**
```tsx
<div 
  className={getEnhancedComponentClasses('alert', 'error', 'md', undefined, ['accentBorder', 'withIcon'])}
>
  Mesaj de eroare important
</div>
```

**Efecte disponibile:**
- `gradient` - Adaugă gradient conform variantei (primary, success, etc.)
- `shadow` - Adaugă umbră consistentă
- `fadeIn` - Animație de fade-in la apariție
- `accentBorder` - Bordură accentuată pe partea stângă (util pentru alerte, notificări)
- `withIcon` - Spațiu și styling pentru icon (trebuie adăugat separat)
- `elevate` - Efect de ridicare la hover
- `subtle` - Varianta subtilă a culorilor (mai puțin saturată)
- `rounded` - Colțuri rotunjite accentuate

### 5. Best practices

- **Tailwind/PostCSS:** NU folosi `@import` pentru fișiere ce conțin `@layer` și `@apply` (ex: `utils.css`). Scrie utilitarele custom cu `@layer components` direct în `index.css`, după `@tailwind components` și înainte de `@tailwind utilities`. Dacă folosești `@import` pentru astfel de fișiere, buildul va eșua cu eroarea: `@layer components is used but no matching @tailwind components directive is present.` (Vezi MEMORY[717a9187])
- `@import` e permis doar pentru reseturi simple sau variabile, nu pentru utilitare cu `@apply`/`@layer`.
- **Familiarizați-vă cu clasele utilitare custom** definite în `frontend/src/index.css` (ex: `.btn`, `.input-field`, `.card-base`, `.alert`). Acestea sunt create pentru a încapsula token-urile și a asigura consistența. Verificați existența unei clase utilitare înainte de a aplica stiluri complexe direct.

- Toate componentele primitive (Button, Input, Select, Checkbox, Alert, Badge, Textarea, Loader, Spinner) folosesc EXCLUSIV tokens din sistemul centralizat pentru stiluri, fie direct prin clase Tailwind bazate pe token-uri, fie prin clase utilitare custom.
- Exemple de token-uri (reflectate în clase Tailwind): `primary-500` (pentru `bg-primary-500`, `text-primary-500`), `spacing-token` (pentru `p-token`, `m-token`), `rounded-token`, `shadow-token`.
- Este INTERZISĂ folosirea stringurilor hardcodate pentru stiluri sau a claselor Tailwind generice (ex: border-red-500).
- data-testid trebuie să fie unic, predictibil și stabil pentru fiecare variantă/stare (ex: `input-field-error`, `alert-warning`, `badge-success`).
- Loader/Spinner: animație și culoare din tokens, nu valori hardcodate SVG.
- Orice excepție se documentează explicit în PR și DEV_LOG.md.

### 6. Integrarea componentMap cu Tailwind

Sistemul `componentMap` se integrează cu Tailwind prin:

1. **Definiția tokens în `tailwind.config.js`**:
   - Culorile, spațierile, border-radius, etc. sunt definite aici
   - Aceste valori sunt apoi folosite în clasele Tailwind (ex: `bg-primary-500`)

2. **Maparea în directorul `componentMap/`**:
   - Fiecare componentă are un fișier de configurare (ex: `button.ts`, `card.ts`)
   - Configurațiile definesc clasele Tailwind pentru fiecare variantă/stare/dimensiune
   - Fișierul `index.ts` combină toate configurațiile într-un singur obiect `componentMap`

3. **Funcția `getEnhancedComponentClasses`**:
   - Primește tipul componentei, varianta, dimensiunea, starea și efectele
   - Combină clasele Tailwind corespunzătoare din configurațiile componentMap
   - Returnează un string cu toate clasele necesare

4. **Aplicarea în componente**:
   - Componentele folosesc `getEnhancedComponentClasses` pentru a genera clasele
   - Nu se folosesc clase Tailwind hardcodate direct în JSX

**Exemplu de configurare componentMap:**
```tsx
// frontend/src/styles/componentMap/button.ts
export const buttonConfig = {
  base: `font-medium rounded-lg transition-all duration-200 inline-flex items-center justify-center`,
  variants: {
    primary: `bg-primary-500 text-white hover:bg-primary-600 active:bg-primary-700`,
    secondary: `bg-white text-secondary-700 border border-secondary-300 hover:bg-secondary-50`,
    // ... alte variante
  },
  // ... sizes, states
};
```

- Folosește doar clase Tailwind bazate pe token-uri sau clasele utilitare custom.
- Nu modifica direct utility classes în JSX fără să actualizezi token-urile corespunzătoare sau definițiile claselor custom.
- Documentează orice excepție aici și în DEV_LOG.md.

---
Ultima actualizare: 2025-05-22

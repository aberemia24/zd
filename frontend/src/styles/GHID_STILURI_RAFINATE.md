# Ghid de Utilizare a Stilurilor Rafinate

Acest document explică cum să utilizați sistemul de stiluri rafinate implementat în Budget App pentru a crea o interfață modernă, consistentă și accesibilă.

## Concepte fundamentale

Stilurile rafinate sunt organizate în jurul următoarelor concepte:

1. **Modularitate** - Componentele sunt grupate pe categorii funcționale
2. **Design tokens** - Toate culorile, dimensiunile și spațierile folosesc tokens din temă
3. **Efecte vizuale** - Gradienți, umbre și tranziții sunt disponibile ca efecte reutilizabile
4. **Stări complexe** - Fiecare componentă are stări vizuale pentru toate interacțiunile

## Utilizarea getEnhancedComponentClasses

Funcția principală pentru aplicarea stilurilor rafinate este `getEnhancedComponentClasses`:

```tsx
import { getEnhancedComponentClasses } from '../styles/componentMapIntegration';

// Utilizare de bază cu tip și variantă
const buttonClasses = getEnhancedComponentClasses('button', 'primary', 'md');

// Utilizare cu stare
const disabledButtonClasses = getEnhancedComponentClasses('button', 'primary', 'md', 'disabled');

// Utilizare cu efecte speciale
const buttonWithEffects = getEnhancedComponentClasses(
  'button', 
  'primary', 
  'md', 
  undefined, 
  ['shadow-glow']
);
```

## Exemple pe categorii de componente

### 1. Componente de acțiune

```tsx
// Button cu gradient și efect de deplasare
<button 
  className={getEnhancedComponentClasses('button', 'primary', 'md')}
>
  Buton Primar
</button>

// Button group
<div className={getEnhancedComponentClasses('button-group', 'attached')}>
  <button className={getEnhancedComponentClasses('button', 'secondary', 'sm')}>
    Prima opțiune
  </button>
  <button className={getEnhancedComponentClasses('button', 'secondary', 'sm')}>
    A doua opțiune
  </button>
</div>
```

### 2. Componente de formular

```tsx
// Input cu stări
<input 
  className={getEnhancedComponentClasses(
    'input', 
    hasError ? 'error' : 'primary', 
    'md',
    isDisabled ? 'disabled' : undefined
  )}
  disabled={isDisabled}
/>

// Select
<select 
  className={getEnhancedComponentClasses('select', 'primary', 'md')}
>
  <option>Opțiunea 1</option>
  <option>Opțiunea 2</option>
</select>
```

### 3. Componente de feedback

```tsx
// Alert cu gradient
<div className={getEnhancedComponentClasses('alert', 'success', 'md')}>
  Operațiunea a fost finalizată cu succes!
</div>

// Badge cu gradient
<span className={getEnhancedComponentClasses('badge', 'primary-gradient', 'md')}>
  Nou
</span>
```

### 4. Componente de layout

```tsx
// Card interactiv
<div className={getEnhancedComponentClasses('card', 'interactive', 'md')}>
  <div className={getEnhancedComponentClasses('card-header')}>
    Titlu card
  </div>
  <div className={getEnhancedComponentClasses('card-body')}>
    Conținut card
  </div>
</div>
```

### 5. Componente de navigare

```tsx
// Tab-uri
<div>
  <div role="tablist" className="flex">
    <button 
      role="tab"
      className={getEnhancedComponentClasses('tab', 'underline', undefined, isActive ? 'active' : undefined)}
    >
      Tab 1
    </button>
    {/* ... */}
  </div>
  <div className={getEnhancedComponentClasses('tab-panel')}>
    Conținut tab
  </div>
</div>
```

### 6. Componente de date

```tsx
// Tabel cu hover pe rânduri
<div className={getEnhancedComponentClasses('table-container')}>
  <table className={getEnhancedComponentClasses('table', 'hover-rows')}>
    <thead>
      <tr>
        <th className={getEnhancedComponentClasses('table-header')}>Nume</th>
        <th className={getEnhancedComponentClasses('table-header')}>Email</th>
      </tr>
    </thead>
    <tbody>
      <tr className={getEnhancedComponentClasses('table-row')}>
        <td className={getEnhancedComponentClasses('table-cell')}>Ion Popescu</td>
        <td className={getEnhancedComponentClasses('table-cell')}>ion@example.com</td>
      </tr>
      {/* ... */}
    </tbody>
  </table>
</div>
```

### 7. Efecte speciale

```tsx
// Text cu gradient
<h2 className={getEnhancedComponentClasses('fx-gradient-text', 'primary')}>
  Titlu cu gradient
</h2>

// Efect de sticlă
<div className={getEnhancedComponentClasses('fx-glass')}>
  Conținut pe fundal blur
</div>

// Efect de strălucire
<button 
  className={classNames(
    getEnhancedComponentClasses('button', 'primary'),
    getEnhancedComponentClasses('fx-shadow-glow', 'primary')
  )}
>
  Buton cu strălucire
</button>
```

## Recomandări de performanță

1. **Evitați folosirea excesivă a efectelor** - Gradienții și umbrele pot afecta performanța pe dispozitive mai slabe. Folosiți-le cu moderație.

2. **Combinați clasele cu classNames** - Pentru a evita string-uri lungi de clase:
   ```tsx
   import classNames from 'classnames';
   
   const classes = classNames(
     getEnhancedComponentClasses('button', 'primary'),
     className, // clase suplimentare
     isActive && 'active-custom-class'
   );
   ```

3. **Memorați rezultatele** - Pentru componente care se re-renderizează frecvent, considerați memorarea rezultatelor funcției:
   ```tsx
   const buttonClasses = useMemo(() => 
     getEnhancedComponentClasses('button', variant, size, state),
     [variant, size, state]
   );
   ```

## Extinderea sistemului

Pentru a adăuga noi stiluri sau componente:

1. Identificați categoria potrivită (sau creați una nouă)
2. Adăugați noua configurație în fișierul categoriei
3. Verificați că noua componentă respectă modelul de bază/variante/mărimi/stări
4. Actualizați documentația dacă e necesar

## Migrarea componentelor existente

Pentru a migra componente existente la noile stiluri:

1. Importați `getEnhancedComponentClasses` din `componentMapIntegration.ts`
2. Înlocuiți clasele hardcodate cu apeluri la această funcție
3. Păstrați props-urile existente pentru compatibilitate
4. Testați toate stările componentei pentru a vă asigura că stilizarea e consistentă

## Exemplu de migrare

### Înainte:

```tsx
const Button = ({ variant = 'primary', size = 'md', disabled, children }) => (
  <button 
    className={`
      font-medium rounded-lg py-2 px-4 
      ${variant === 'primary' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'}
      ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
    `}
    disabled={disabled}
  >
    {children}
  </button>
);
```

### După:

```tsx
import { getEnhancedComponentClasses } from '../styles/componentMapIntegration';
import classNames from 'classnames';

const Button = ({ 
  variant = 'primary', 
  size = 'md', 
  disabled,
  className, 
  children,
  ...props 
}) => {
  const state = disabled ? 'disabled' : undefined;
  
  return (
    <button 
      className={classNames(
        getEnhancedComponentClasses('button', variant, size, state),
        className
      )}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};
```

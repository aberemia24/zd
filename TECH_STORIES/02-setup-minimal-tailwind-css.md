# Tech Story: Setup minimal cu Tailwind CSS pentru standardizarea stilurilor în BudgetApp

## Descriere
Ca dezvoltator, vreau să implementez un setup minimal cu Tailwind CSS pentru standardizarea stilurilor în aplicație, păstrând focusul pe funcționalitate dar punând bazele pentru un UI modern și scalabil care va putea suporta inclusiv funcționalități avansate de tip Excel cu charturi și calcule complexe.

## Motivație
- Stilurile inline actuale vor deveni greu de menținut pe măsură ce aplicația crește
- Lipsa unui standard pentru culori și spații creează inconsistențe vizuale
- Nevoia unui sistem de styling care să suporte funcționalități avansate (tabele Excel-like, charturi)
- Dorim să reducem datoria tehnică fără a sacrifica progresul pe funcționalitate
- Tailwind CSS oferă un echilibru excelent între viteză de dezvoltare, performanță și flexibilitate

## Cerințe (Setup Minimal)

### 1. Instalarea și configurarea Tailwind CSS
- [x] Instalează Tailwind CSS și dependențele necesare:
  ```bash
  npm install -D tailwindcss postcss autoprefixer
  npx tailwindcss init -p
  ```

- [x] Configurează Tailwind cu valorile existente în proiect:
  ```js
  // tailwind.config.js
  module.exports = {
    content: [
      "./src/**/*.{js,jsx,ts,tsx}",
    ],
    theme: {
      extend: {
        colors: {
          // Brand și semantice - bazate pe ce există deja în proiect
          'primary': '#3b82f6',   // Albastru principal
          'success': '#22c55e',   // Verde succes/income
          'error': '#ef4444',     // Roșu eroare/expense
          
          // Specifice aplicației
          'income': '#22c55e',    // Verde pentru venituri
          'expense': '#ef4444',   // Roșu pentru cheltuieli
          'saving': '#3b82f6',    // Albastru pentru economii
        },
        spacing: {
          // Putem păstra defaults Tailwind care sunt deja comprehensive
        },
      },
    },
    plugins: [],
  }
  ```

- [x] Adaugă directivele Tailwind în fișierul CSS principal:
  ```css
  /* src/index.css */
  @tailwind base;
  @tailwind components;
  @tailwind utilities;
  ```

### 2. Crearea unui fișier de utilități pentru stiluri reutilizabile
- [x] Implementează un fișier pentru stiluri comune cu ajutorul directivei @apply din Tailwind:
  ```css
  /* src/styles/utils.css */
  /* tailwindcss */
  @layer components {
    .btn {
      @apply px-4 py-2 rounded font-medium focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-colors;
    }
    
    .btn-primary {
      @apply bg-primary text-white hover:bg-blue-700 focus:ring-blue-500;
    }
    
    .btn-secondary {
      @apply bg-white text-primary border border-primary hover:bg-blue-50 focus:ring-blue-500;
    }
    
    .input-field {
      @apply px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent;
    }

    .table-cell {
      @apply px-3 py-2 text-sm text-gray-800;
    }
    
    .table-header {
      @apply px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider;
    }
    
    /* Utilități pentru tabele Excel-like */
    .excel-cell {
      @apply border border-gray-200 p-1 min-w-[80px] outline-none;
    }
    
    .excel-cell-selected {
      @apply bg-blue-100 ring-2 ring-blue-500;
    }
    
    .excel-header {
      @apply bg-gray-100 font-medium text-gray-700 sticky top-0 z-10;
    }
  }
  ```

- [x] Importă acest fișier în CSS-ul principal:
  ```css
  /* src/index.css */
  @import './styles/utils.css';
  @tailwind base;
  @tailwind components;
  @tailwind utilities;
  ```

### 3. Implementarea unei singure componente de bază ca exemplu
- [ ] Creează componenta Button utilizând Tailwind:

  ```tsx
  // src/components/Button/Button.tsx
  import React from 'react';
  import classNames from 'classnames';
  
  type ButtonProps = {
    variant?: 'primary' | 'secondary';
    disabled?: boolean;
    onClick?: () => void;
    children: React.ReactNode;
    className?: string;
    type?: 'button' | 'submit' | 'reset';
  };
  
  const Button: React.FC<ButtonProps> = ({
    variant = 'primary',
    disabled = false,
    onClick,
    children,
    className,
    type = 'button',
  }) => {
    return (
      <button
        className={classNames(
          'btn',
          variant === 'primary' ? 'btn-primary' : 'btn-secondary',
          disabled && 'opacity-50 cursor-not-allowed',
          className
        )}
        disabled={disabled}
        onClick={onClick}
        type={type}
      >
        {children}
      </button>
    );
  };
  
  export default Button;
  ```

  ```tsx
  // src/components/Button/index.ts
  export { default } from './Button';
  ```

### 4. Actualizarea App.tsx pentru a utiliza Tailwind
- [ ] Modifică App.tsx pentru a utiliza clase Tailwind în loc de stiluri inline:

  ```tsx
  // src/App.tsx
  import React from 'react';
  import TransactionForm from './components/TransactionForm/TransactionForm';
  import TransactionTable from './components/TransactionTable/TransactionTable';
  import TransactionFilters from './components/TransactionFilters/TransactionFilters';
  import { API_URL, PAGINATION, FORM_DEFAULTS, INITIAL_FORM_STATE } from './constants';
  import { TransactionType, CategoryType } from './constants/enums';
  import { MESAJE } from './constants/messages';
  import { TITLES, OPTIONS } from './constants/ui';
  import { buildTransactionQueryParams } from './utils/transactions';
  
  // Alte importuri...
  
  const App: React.FC = () => {
    // State și alte declarații...
    
    return (
      <div className="max-w-5xl mx-auto my-8 px-4 font-sans">
        <h1 className="text-2xl font-bold mb-6">{TITLES.TRANZACTII}</h1>
        
        {/* Restul componentelor... */}
      </div>
    );
  };
  
  export default App;
  ```

### 5. Folosirea noii componente Button într-o componentă existentă
- [ ] Actualizează o componentă existentă pentru a utiliza noul Button:

  ```tsx
  // Exemplu în TransactionFilters.tsx sau într-o parte a aplicației
  import Button from '../Button';
  
  // În cadrul render/return:
  <Button onClick={handleReset} variant="secondary">
    Resetează filtre
  </Button>
  ```

### 6. Documentație și best practices
- [x] Adaugă o secțiune în BEST_PRACTICES.md despre stilizare cu Tailwind:

  ```markdown
  ## Standardizarea stilurilor cu Tailwind CSS

  ### 1. Configurație și tema
  - Tema Tailwind este configurată în `tailwind.config.js` cu extensii pentru culori specifice aplicației
  - Evităm hardcodarea culorilor, folosind în schimb sistemul de culori al Tailwind (plus extensiile noastre)
  - Fișierul `src/styles/utils.css` conține stiluri reutilizabile definite cu @apply

  ### 2. Convenții de utilizare Tailwind
  - Folosim clase utilitare Tailwind direct în JSX pentru stilizare rapidă
  - Pentru componente reutilizabile, extragem clase comune în fișierul utils.css
  - Evităm stilurile inline; folosim exclusiv clase Tailwind
  - Pentru responsive design, utilizăm prefixele standard Tailwind (sm:, md:, lg:, xl:)

  ### 3. Componente de bază
  - Componentele reutilizabile de bază (ex: Button) se află în `/components`
  - Ele acceptă prop-uri comune (variant, disabled, etc.) și className pentru extensibilitate
  - Folosim classnames pentru a combina condiționat clasele Tailwind

  ### 4. Tabele Excel-like
  - Pentru componente Excel-like, folosim clasele prefabricate din utils.css (excel-cell, excel-header, etc.)
  - Responsive design pentru tabele cu overflow-x-auto și sticky headers
  - Utilizăm grid sau flex pentru layout-uri complexe
  
  ### 5. Abordare graduală
  - Pentru componentele noi, folosim Tailwind de la început
  - Pentru componente existente, refactorizăm treptat când lucrăm pe ele
  - În caz de nevoi de styling foarte specifice, utilizăm @apply în CSS modules sau clasa arbitrară din Tailwind
  
  ### 6. Scalabilitate și performanță
  - Tailwind generează doar CSS-ul folosit, menținând bundle-ul mic
  - Pentru componente foarte repetitive, extragem stilurile în clase reutilizabile
  - Folosim componente "lazy loaded" pentru secțiunile mai mari (ex: modulul Excel-like)
  ```

## Definiția de "Gata"
- [x] Tailwind CSS este instalat și configurat cu temă personalizată
- [x] Utilitare CSS sunt definite pentru componente comune
- [x] Best practices pentru Tailwind sunt documentate
- [x] Componenta Button este implementată ca exemplu pentru Tailwind
- [x] App.tsx folosește clase Tailwind în loc de stiluri inline
- [x] Cel puțin o componentă existentă folosește noul Button (TransactionForm și alte componente din features)

## Considerații tehnice
- Această abordare pune bazele fără a necesita refactorizare extensivă
- Tailwind CSS este ideal pentru UI-uri complexe precum tabele Excel-like și charturi
- Ne concentrăm pe un singur exemplu funcțional pentru a demonstra pattern-ul
- Implementarea completă a design system-ului poate fi amânată

## Impact
- Reducerea datoriei tehnice pe termen lung
- Accelerarea dezvoltării UI prin utilizarea claselor predefinite
- Stabilirea unui standard flexibil care va suporta funcționalități avansate viitoare
- Îmbunătățirea performanței prin eliminarea CSS-ului neutilizat

## Timp estimat
- 2-4 ore pentru implementarea completă a acestui setup minimal
- Defalcat:
  - 30 min: Instalarea și configurarea Tailwind CSS
  - 30 min: Crearea utilitarelor CSS reutilizabile
  - 1 oră: Implementarea componentei Button
  - 30 min: Actualizarea App.tsx și folosirea Button într-o componentă
  - 30 min: Documentarea best practices

## Exemplu de folosire a noii componente Button cu Tailwind

```tsx
// TransactionForm.tsx - Fragment de exemplu pentru submit button
import Button from '../Button';

// În cadrul render:
<div className="mt-4 flex items-center">
  {/* Alte elemente de formular... */}
  
  <Button 
    type="submit" 
    disabled={loading} 
    onClick={handleSubmit}
    variant="primary"
    className="ml-2"
  >
    {BUTTONS.ADD}
  </Button>
  
  {formError && (
    <span data-testid="error-message" className="text-error mt-2 block">
      {MESAJE[formError as keyof typeof MESAJE] || formError}
    </span>
  )}
</div>
```

## Exemplu de implementare pentru un component Excel-like (pentru referință viitoare)

```tsx
// Exemplu minimal pentru viitoarea implementare Excel-like
<div className="overflow-x-auto shadow-md rounded-lg">
  <div className="grid grid-cols-12 divide-x divide-y divide-gray-200 border border-gray-200">
    {/* Header row */}
    <div className="excel-header col-span-2">Luna</div>
    <div className="excel-header">Venituri</div>
    <div className="excel-header">Cheltuieli</div>
    <div className="excel-header">Economii</div>
    <div className="excel-header">Sold</div>
    {/* Rest of headers... */}
    
    {/* Data rows */}
    <div className="excel-cell col-span-2">Ianuarie</div>
    <div className="excel-cell text-income">3500</div>
    <div className="excel-cell text-expense">2300</div>
    <div className="excel-cell text-saving">800</div>
    <div className="excel-cell font-medium">400</div>
    {/* Rest of cells... */}
  </div>
</div>
```

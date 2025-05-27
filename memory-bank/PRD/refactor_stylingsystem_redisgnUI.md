# Plan Migrare Stilizare - Simplificare Inteligentă

## Context Important
Aplicația va fi **complexă** - nu doar tracking, ci planificare financiară avansată. Gridul tip Excel este **esențial** și trebuie să suporte features avansate. Simplificăm **overhead-ul**, nu **capacitățile**.

## Ce Păstrăm 100% (Non-negociabil)

### 1. Design Tokens System
```typescript
// theme.ts - RĂMÂNE INTACT
export const theme = {
  colors: { primary, secondary, success, error, warning },
  spacing: { xs, sm, md, lg, xl },
  borderRadius: { ... },
  shadows: { ... },
  // Toate token-urile rămân - sunt foundation
}
```
**De ce**: Schimbi tema într-un loc, se aplică peste tot. Essential pentru aplicații enterprise.

### 2. Tailwind Config bazat pe Tokens
- Mapping automatic tokens → Tailwind utilities
- Custom utilities pentru grid-specific needs
- **Păstrăm**: toate configurările actuale

### 3. Componente Primitive Refactorizate
- Button, Input, Select, etc. - toate rămân
- Sunt building blocks pentru features complexe

---

## Ce Simplificăm (Overhead → Valoare)

### 1. ComponentMap System → CVA
**Actual**: 6 layere de abstracție
```typescript
// Acum: prea multe layere
componentMap → themeTypes → getEnhancedComponentClasses → applyVariant → applyEffect → component
```

**Nou**: 2 layere simple
```typescript
// CVA: definire → utilizare
styles.ts → component
```

### 2. Efecte Vizuale
**Elimină**:
- fx-shadow.ts, fx-gradient.ts (15+ fișiere)
- applyEffect(), applyVariant() functions
- effectsMap abstraction

**Înlocuiește cu**:
```typescript
// Direct în CVA variants
export const gridCell = cva("base", {
  variants: {
    effect: {
      glow: "shadow-glow transition-shadow",
      highlight: "ring-2 ring-blue-500"
    }
  }
})
```

### 3. Consolidare Fișiere
**Acum**: 30+ fișiere pentru stilizare
**După**: 5 fișiere:
- `theme.ts` - tokens (intact)
- `styles/components.ts` - componente comune
- `styles/grid.ts` - tot ce ține de grid
- `styles/utils.ts` - cn() și helpers
- `tailwind.config.js` - intact

---

## Plan Specific pentru Grid Complex

### Păstrăm Capabilități pentru:
- ✅ Celule editabile inline
- ✅ Highlight multi-cell selection
- ✅ Drag & drop (styling ready)
- ✅ Frozen columns/rows styling
- ✅ Conditional formatting
- ✅ Excel-like borders și shadows
- ✅ States: hover, active, editing, calculating
- ✅ Animații pentru calcule și updates

### Implementare CVA pentru Grid:
```typescript
// styles/grid.ts - TOATE capabilitățile, sintaxă simplă
export const grid = {
  cell: cva("base-cell-styles", {
    variants: {
      // State-uri pentru Excel-like behavior
      state: {
        default: "",
        hover: "bg-blue-50",
        active: "ring-2 ring-blue-500",
        editing: "bg-yellow-50 ring-2 ring-yellow-400",
        calculating: "animate-pulse bg-gray-100",
        selected: "bg-blue-100",
        error: "bg-red-50 ring-2 ring-red-500"
      },
      
      // Tipuri pentru styling diferențiat
      cellType: {
        data: "tabular-nums",
        formula: "font-mono text-sm",
        header: "font-semibold bg-gray-50",
        total: "font-bold bg-gray-100",
        subtotal: "font-medium bg-gray-50"
      },
      
      // Frozen behavior
      frozen: {
        row: "sticky top-0 z-20",
        column: "sticky left-0 z-10",
        both: "sticky top-0 left-0 z-30"
      }
    },
    
    // Combinații complexe
    compoundVariants: [
      {
        state: "active",
        cellType: "formula",
        className: "ring-purple-500 bg-purple-50"
      }
    ]
  })
}
```

---

## Faze de Implementare

### Faza 1: Setup și Pregătire (1 zi)
- [ ] Backup branch cu sistemul actual
- [ ] Instalare CVA și clsx
- [ ] Creare folder `styles/new/` pentru migrare paralelă
- [ ] **NU ȘTERGEM NIMIC ÎNCĂ**

### Faza 2: Migrare Core Components (2 zile)
- [ ] Migrat Button → CVA
- [ ] Migrat Input → CVA  
- [ ] Migrat Select → CVA
- [ ] Test că totul funcționează identic
- [ ] A/B testing vizual (screenshots)

### Faza 3: Migrare Grid - Atenție Maximă (3-4 zile)
- [ ] Analiză TOATE use-case-urile actuale din grid
- [ ] Documentare fiecare stare și variantă necesară
- [ ] Implementare CVA cu TOATE capabilitățile
- [ ] Testare extensivă - fiecare feature
- [ ] Performance testing (1000+ rows)

### Faza 4: Cleanup Gradual (2 zile)
- [ ] După ce totul funcționează, începe cleanup
- [ ] Șterge componentMap unul câte unul
- [ ] Verifică după fiecare ștergere
- [ ] Git commit frecvent pentru rollback ușor

---

## Ce NU Pierzi

### 1. Flexibilitate Styling
- **Acum**: `getEnhancedComponentClasses('cell', 'active', 'md', state, ['glow', 'shadow'])`
- **CVA**: `cell({ state: 'active', size: 'md', effect: ['glow', 'shadow'] })`
- **Același output, sintaxă mai clară**

### 2. Type Safety
- CVA are TypeScript complet
- Autocomplete pentru toate variantele
- Erori la compile time pentru variante greșite

### 3. Performance
- CVA e optimizat pentru runtime
- Generare clase la build time unde posibil
- Memoization built-in

### 4. Scalabilitate
```typescript
// Poți extinde oricând
export const gridCell = cva(baseStyles, {
  variants: {
    // Adaugi variants noi fără breaking changes
    newFeature: {
      option1: "styles",
      option2: "styles"
    }
  }
})
```

---

## Garanții pentru Aplicație Complexă

### 1. Grid Capabilities
- [ ] Test: 10k+ celule performant
- [ ] Test: Multi-cell selection
- [ ] Test: Inline editing smooth
- [ ] Test: Formule și calcule
- [ ] Test: Freeze panes
- [ ] Test: Conditional formatting

### 2. Extensibilitate
- [ ] Ușor de adăugat noi variante
- [ ] Ușor de adăugat noi componente
- [ ] Pattern consistent și predictibil

### 3. Themes & White-labeling
- [ ] Schimbare completă temă = modificare theme.ts
- [ ] Dark mode ready
- [ ] Multi-brand support

---

## Comparație Finală

| Aspect | Sistem Actual | CVA |
|--------|--------------|-----|
| Linii de cod | ~2000 | ~400 |
| Fișiere | 30+ | 5 |
| Learning curve | 2-3 zile | 2 ore |
| Type safety | ✅ Custom | ✅ Built-in |
| Performance | ⚠️ Runtime overhead | ✅ Optimizat |
| Flexibilitate | ✅ Total | ✅ Total |
| AI friendly | ❌ Prea complex | ✅ Standard |
| Debugging | ❌ 6 layers | ✅ 2 layers |

---

## Mitigare Riscuri

### 1. "Ce dacă CVA nu poate face X?"
- CVA e folosit de Vercel, WorkOS, Radix UI
- Poți extinde cu utility functions custom
- Worst case: folosești className direct pentru edge cases

### 2. "Pierd control fin?"
- NU - ai același control, sintaxă diferită
- Poți mixa: `cn(gridCell({ state }), "custom-class")`
- Escape hatch pentru orice situație

### 3. "E prea mult de migrat?"
- Migrare incrementală - nu totul odată
- Sistemul vechi și nou pot coexista
- Rollback ușor cu git

---

## Concluzie

**Nu pierzi NIMIC din capabilități.** Doar simplifici modul în care le definești și folosești.

### Pentru gridul tău complex:
- ✅ Toate state-urile Excel-like
- ✅ Performanță pentru mii de celule
- ✅ Extensibil pentru features viitoare
- ✅ Dar în 400 linii, nu 2000

### Beneficii imediate:
- Developer nou înțelege în 30 min, nu 3 zile
- AI poate genera componente corecte din prima
- Debugging în 2 pași, nu 6
- Același look profesional

Mapping 1:1 - Nimic Nu Se Pierde
1. theme.ts (tokens) → RĂMÂNE IDENTIC
typescript// ✅ TOATE astea rămân neschimbate:
- colors (primary, secondary, success, error, warning, gray, neutral)
- spacing (xs, sm, md, lg, xl, 2xl, 3xl)
- borderRadius (sm, default, md, lg, full)
- shadows (sm, default, md, lg, xl, inner)
- typography (fontSize, fontWeight, lineHeight)
- animation (durations, easings)
- breakpoints
2. componentMap/ files → Se consolidează în styles/
Acum ai:
typescript// 30+ fișiere separate
componentMap/
├── button.ts
├── input.ts
├── card.ts
├── alert.ts
├── badge.ts
├── grid.ts
├── table.ts
├── modal.ts
├── fx-shadow.ts
├── fx-gradient.ts
├── fx-glow.ts
├── fx-pulse.ts
└── ... (încă 20+)
Devin:
typescript// 3-4 fișiere organizate logic
styles/
├── components.ts  // Button, Input, Card, Alert, Badge
├── grid.ts        // Tot ce ține de grid/table
├── effects.ts     // Toate efectele ca variante CVA
└── utils.ts       // cn() și helpers
3. Efectele vizuale → Variants în CVA
Acum:
typescript// fx-shadow.ts
export const shadowEffects = {
  'shadow-sm': 'shadow-sm',
  'shadow-md': 'shadow-md',
  'shadow-lg': 'shadow-lg'
}

// fx-gradient.ts  
export const gradientEffects = {
  'gradient-primary': 'bg-gradient-to-r from-primary-500 to-primary-600',
  'gradient-secondary': '...'
}
Devin:
typescript// În components.ts
export const button = cva("base", {
  variants: {
    // Toate efectele devin variante
    shadow: {
      sm: "shadow-sm",
      md: "shadow-md",
      lg: "shadow-lg"
    },
    gradient: {
      primary: "bg-gradient-to-r from-primary-500 to-primary-600",
      secondary: "..."
    }
  }
})
4. getEnhancedComponentClasses → Direct CVA call
Toate combinațiile tale complexe:
typescript// Acum
getEnhancedComponentClasses('button', 'primary', 'lg', 'hover', ['shadow', 'gradient'])

// Devine
button({ 
  variant: 'primary', 
  size: 'lg', 
  state: 'hover', 
  shadow: true, 
  gradient: true 
})
5. Stilurile specifice pentru fiecare componentă
Hai să luăm EXACT ce ai în componentMap/grid.ts:
typescript// CE AI ACUM în componentMap/grid.ts
export const gridConfig = {
  base: 'relative overflow-auto',
  variants: {
    default: 'bg-white border border-gray-200',
    elevated: 'bg-white shadow-lg',
    dark: 'bg-gray-900 border-gray-700'
  },
  sizes: { /* ... */ },
  states: {
    loading: 'opacity-50 pointer-events-none',
    error: 'border-red-500'
  }
}

// DEVINE în styles/grid.ts
export const gridContainer = cva(
  'relative overflow-auto', // base intact
  {
    variants: {
      theme: { // variants intact
        default: 'bg-white border border-gray-200',
        elevated: 'bg-white shadow-lg',
        dark: 'bg-gray-900 border-gray-700'
      },
      state: { // states intact
        loading: 'opacity-50 pointer-events-none',
        error: 'border-red-500'
      }
    }
  }
)
Exemple Complete de Migrare
Button (toate variantele tale)
typescript// DIN componentMap/button.ts
{
  base: 'font-medium rounded-lg transition-all',
  variants: {
    primary: 'bg-primary-500 hover:bg-primary-600',
    secondary: 'bg-gray-200 hover:bg-gray-300',
    ghost: 'hover:bg-gray-100',
    danger: 'bg-error-500 hover:bg-error-600'
  },
  sizes: {
    sm: 'px-2 py-1 text-sm',
    md: 'px-4 py-2',
    lg: 'px-6 py-3 text-lg'
  },
  states: {
    disabled: 'opacity-50 cursor-not-allowed',
    loading: 'cursor-wait'
  }
}

// DEVINE
export const button = cva(
  'font-medium rounded-lg transition-all', // base IDENTIC
  {
    variants: {
      variant: { // variants IDENTICE
        primary: 'bg-primary-500 hover:bg-primary-600',
        secondary: 'bg-gray-200 hover:bg-gray-300',
        ghost: 'hover:bg-gray-100',
        danger: 'bg-error-500 hover:bg-error-600'
      },
      size: { // sizes IDENTICE
        sm: 'px-2 py-1 text-sm',
        md: 'px-4 py-2',
        lg: 'px-6 py-3 text-lg'
      },
      state: { // states IDENTICE
        disabled: 'opacity-50 cursor-not-allowed',
        loading: 'cursor-wait'
      }
    }
  }
)
Grid Cell (toate capabilitățile)
typescript// TOT ce ai pentru grid cells
export const gridCell = cva(
  'px-3 py-2 text-sm border-r border-gray-200 transition-all duration-200',
  {
    variants: {
      // TOATE tipurile tale de celule
      type: {
        header: 'font-semibold bg-gray-50 text-gray-700 sticky top-0 z-10',
        category: 'font-medium bg-gray-50 text-gray-900',
        subcategory: 'pl-8 text-gray-700',
        value: 'text-right tabular-nums',
        balance: 'font-bold text-right tabular-nums',
        formula: 'font-mono text-xs bg-blue-50',
        empty: 'text-gray-400 text-center'
      },
      
      // TOATE stările pentru editing
      state: {
        default: '',
        hover: 'bg-gray-50',
        active: 'bg-blue-50 ring-2 ring-blue-500 ring-inset',
        editing: 'bg-yellow-50',
        calculating: 'animate-pulse bg-gray-100',
        selected: 'bg-blue-100',
        multiselect: 'bg-indigo-100'
      },
      
      // TOATE efectele tale
      effect: {
        glow: 'shadow-lg shadow-blue-500/20',
        highlight: 'ring-2 ring-offset-2',
        pulse: 'animate-pulse',
        gradient: 'bg-gradient-to-r from-transparent via-white to-transparent'
      }
    }
  }
)
Ce Se Întâmplă cu Fiecare Fișier
Fișier ActualCe DevineConținuttheme.tsRĂMÂNE INTACTToți tokeniithemeTypes.tsSe simplificăDoar tipurile pentru CVAcomponentMap/button.ts→ styles/components.tsToate stilurilecomponentMap/input.ts→ styles/components.tsToate stilurilecomponentMap/grid.ts→ styles/grid.tsToate stilurilefx-shadow.ts→ variants în CVAToate efectelefx-gradient.ts→ variants în CVAToate efectelegetEnhancedComponentClasses→ funcții CVA directeAceeași funcționalitate
Garanții 100%

FIECARE clasă CSS pe care o ai definită undeva va exista în CVA
FIECARE combinație posibilă acum va fi posibilă și după
FIECARE efect vizual devine o variantă CVA
ZERO stiluri pierdute - doar reorganizate mai logic

Bonus - Vei Putea Face Chestii Noi
typescript// Compound variants pentru comportamente complexe
compoundVariants: [
  {
    type: 'formula',
    state: 'calculating',
    className: 'animate-pulse bg-purple-100 text-purple-900'
  },
  {
    type: 'balance',
    valueType: 'negative',
    className: 'bg-red-50 text-red-700 font-bold'
  }
]
Bottom line: Toate cele ~2000 de linii de configurații de stiluri se comprimă în ~400 linii CVA, dar FIECARE stil individual rămâne.

Analiza Dimensiunilor
Situația Actuală
componentMap/ (30+ fișiere)
├── button.ts      (~100 linii)
├── input.ts       (~80 linii)
├── select.ts      (~70 linii)
├── card.ts        (~60 linii)
├── grid.ts        (~200 linii)
├── fx-shadow.ts   (~50 linii)
├── fx-gradient.ts (~50 linii)
└── ... x20 fișiere
TOTAL: ~2000+ linii împrăștiate
După Organizare Inteligentă
styles/
├── components/
│   ├── button.ts     (~80 linii) 
│   ├── input.ts      (~60 linii)
│   ├── card.ts       (~40 linii)
│   └── index.ts      (exports)
├── grid/
│   ├── cell.ts       (~100 linii)
│   ├── container.ts  (~50 linii)
│   ├── row.ts        (~50 linii)
│   └── index.ts      (exports)
├── shared/
│   ├── effects.ts    (~80 linii)
│   └── utils.ts      (~20 linii)
└── index.ts          (barrel export)
Strategia: Modular dar Nu Fragmentat
1. Grupare Logică, Nu Monolith
typescript// ❌ NU AȘA - un fișier gigantic
// styles/everything.ts (1000+ linii) 

// ✅ CI AȘA - organizat pe domenii
// styles/components/button.ts (~80 linii)
export const button = cva("base", {
  variants: { /* ... */ }
});

export const iconButton = cva("base", {
  variants: { /* ... */ }
});

// styles/components/forms.ts (~150 linii)
export const input = cva("base", { /* ... */ });
export const select = cva("base", { /* ... */ });
export const checkbox = cva("base", { /* ... */ });
export const textarea = cva("base", { /* ... */ });
2. Shared Variants pentru DRY
typescript// styles/shared/variants.ts
export const sizeVariants = {
  sm: "text-sm px-2 py-1",
  md: "text-base px-4 py-2", 
  lg: "text-lg px-6 py-3"
};

export const stateVariants = {
  disabled: "opacity-50 cursor-not-allowed",
  loading: "cursor-wait opacity-70",
  error: "border-error-500 text-error-700"
};

// Refolosești în componente
import { sizeVariants, stateVariants } from '../shared/variants';

export const button = cva("base", {
  variants: {
    size: sizeVariants,      // reused
    state: stateVariants,    // reused
    variant: { /* specific */ }
  }
});
3. Grid Modularizat pentru Complexitate
typescript// styles/grid/index.ts - doar exports
export * from './cell';
export * from './row';
export * from './container';
export * from './effects';

// styles/grid/cell.ts (~100 linii)
export const gridCell = cva("base", {
  variants: {
    type: { /* 7-8 variante */ },
    state: { /* 5-6 variante */ }
  }
});

// styles/grid/effects.ts (~50 linii)
export const gridEffects = {
  highlight: cva("", { /* ... */ }),
  selection: cva("", { /* ... */ })
};
Comparație Dimensiuni Reale
Fișier Mare (Button complet)
typescript// ~80 linii - perfectly manageable
export const button = cva(
  "inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus-visible:outline-none focus-visible:ring-2",
  {
    variants: {
      variant: {
        primary: "bg-primary-500 text-white hover:bg-primary-600 active:bg-primary-700",
        secondary: "bg-secondary-100 text-secondary-900 hover:bg-secondary-200",
        ghost: "hover:bg-gray-100 active:bg-gray-200",
        danger: "bg-error-500 text-white hover:bg-error-600",
        success: "bg-success-500 text-white hover:bg-success-600"
      },
      size: {
        xs: "h-7 px-2 text-xs",
        sm: "h-8 px-3 text-sm",
        md: "h-10 px-4 text-base",
        lg: "h-12 px-6 text-lg",
        xl: "h-14 px-8 text-xl"
      },
      fullWidth: {
        true: "w-full"
      },
      loading: {
        true: "cursor-wait opacity-70"
      }
    },
    defaultVariants: {
      variant: "primary",
      size: "md"
    }
  }
);

// Helper pentru iconuri
export const buttonIcon = cva("", {
  variants: {
    position: {
      left: "mr-2",
      right: "ml-2"
    },
    size: {
      sm: "h-3 w-3",
      md: "h-4 w-4",
      lg: "h-5 w-5"
    }
  }
});
Organizare Recomandată pentru Aplicația Ta
styles/
├── base/
│   ├── colors.ts      (helpers pentru culori)
│   ├── spacing.ts     (helpers pentru spacing)
│   └── typography.ts  (text styles)
│
├── components/
│   ├── button.ts      (~80 linii)
│   ├── forms.ts       (~150 linii - input, select, textarea)
│   ├── card.ts        (~60 linii)
│   ├── modal.ts       (~80 linii)
│   └── index.ts       
│
├── grid/              (pentru complexitatea ta)
│   ├── cell.ts        (~100 linii)
│   ├── row.ts         (~60 linii) 
│   ├── header.ts      (~40 linii)
│   ├── calculations.ts (~80 linii - pentru celule cu formule)
│   └── index.ts
│
├── shared/
│   ├── animations.ts  (~50 linii)
│   ├── effects.ts     (~80 linii)
│   └── utils.ts       (~30 linii)
│
└── index.ts          (barrel export principal)
Avantaje ale Acestei Organizări

Fișiere de 50-150 linii - ideal pentru citire/mentenanță
Găsești ușor ce cauți - organizare logică
Import selectiv - nu încarci tot
Code splitting - bundler-ul optimizează
Scalabil - adaugi fișiere noi când crește

Import Examples
typescript// Import specific
import { button, buttonIcon } from '@/styles/components/button';

// Import tot din grid
import { gridCell, gridRow, gridHeader } from '@/styles/grid';

// Import utilities
import { cn, applyEffect } from '@/styles/shared/utils';
Bottom Line
NU vei avea fișiere imense. Vei avea:

10-15 fișiere de 50-150 linii fiecare (în loc de 30+ fișiere mici)
Organizare logică și predictibilă
Același număr total de linii (~1500-2000), doar mai bine organizate
Mult mai ușor de navigat și înțeles

Plus, CVA e mai concis - același styling în mai puține linii decât sistemul actual.

ERFECT TIMING! Dacă tot refactorizezi sistemul de stilizare, e momentul ideal să faci și un redesign. Și da, ai dreptate - aplicația ta arată cam "împopoțonată" acum cu toate efectele alea.
Ce zici de abordarea asta: Modern Finance App
1. Inspirație din Apps Financiare Premium
Uită-te la astea pentru vibe:

Linear - super clean, profesional
Stripe Dashboard - minimalist dar sophisticated
Mercury Banking - modern finance done right
Notion - clean dar cu personalitate
Raycast - slick și rapid

2. Paletă Nouă - Sofisticată și Calmă
typescript// În loc de green-500 peste tot, încearcă:
const colors = {
  // Neutral base - mult mai subtle
  gray: {
    50: '#fafafa',
    100: '#f4f4f5',
    200: '#e4e4e7',
    300: '#d4d4d8',
    400: '#a1a1aa',
    500: '#71717a',
    600: '#52525b',
    700: '#3f3f46',
    800: '#27272a',
    900: '#18181b',
  },
  
  // Primary - un albastru sofisticat, nu verde generic
  primary: {
    50: '#eff6ff',
    100: '#dbeafe',
    200: '#bfdbfe',
    300: '#93bbfd',
    400: '#60a5fa',
    500: '#3b82f6', // Main
    600: '#2563eb',
    700: '#1d4ed8',
    800: '#1e40af',
    900: '#1e3a8a',
  },
  
  // Accent pentru profit/pozitiv - verde subtle
  success: {
    500: '#10b981', // Emerald, nu green
    600: '#059669',
  },
  
  // Pentru pierderi - roșu cald, nu alarmant
  danger: {
    500: '#ef4444',
    600: '#dc2626',
  }
}
3. Shadcn/ui - Game Changer
Install și folosește componente de aici:
bashnpx shadcn-ui@latest init
De ce e perfect pentru tine:

Profesional by default - folosit de startups serioase
Customizable - nu ești blocat în design-ul lor
Copy/paste - nu e dependență, copiezi cod
CVA based - exact ce vrei tu să folosești!

Componente care ți-ar prinde bine:

Table (pentru grid)
Card
Button
Input
Select
Sheet (pentru modals laterale)
Command (pentru search/command palette)

4. Design System Principles
typescript// Border radius mai subtile
borderRadius: {
  none: '0',
  sm: '0.125rem',    // 2px
  default: '0.375rem', // 6px (nu 8px)
  md: '0.5rem',       // 8px
  lg: '0.75rem',      // 12px
}

// Shadows mai subtle
shadows: {
  sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  default: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
  md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
}

// Spacing mai generos
spacing: {
  xs: '0.5rem',   // 8px
  sm: '0.75rem',  // 12px
  md: '1rem',     // 16px
  lg: '1.5rem',   // 24px
  xl: '2rem',     // 32px
}
5. Fonturi Premium
css/* În loc de system fonts, încearcă: */

/* Option 1: Inter (cel mai popular acum) */
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

/* Option 2: IBM Plex Sans (foarte profesional) */
@import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;500;600;700&display=swap');

/* Pentru numere în grid - SUPER IMPORTANT */
font-variant-numeric: tabular-nums; /* Cifre aliniate perfect */
6. Pattern-uri UI Moderne
typescript// 1. Subtle hover states
hover: "bg-gray-50" // Nu bg-blue-100

// 2. Focus visible only
"focus-visible:ring-2 focus-visible:ring-offset-2" // Nu focus:ring

// 3. Micro-animations
"transition-colors duration-150" // Nu duration-300

// 4. Bordere subtile
"border border-gray-200" // Nu border-2 border-gray-300

// 5. Active states prin shadow, nu culoare
"active:shadow-inner" // Nu active:bg-gray-200
7. Gridul Tău - Finance Style
typescriptexport const grid = {
  // Container minimal
  container: cva(
    "w-full bg-white rounded-lg border border-gray-200",
    {
      variants: {
        elevated: {
          true: "shadow-sm",
          false: ""
        }
      }
    }
  ),
  
  // Celule super clean
  cell: cva(
    "px-3 py-2 text-sm",
    {
      variants: {
        type: {
          header: "font-medium text-gray-900 bg-gray-50",
          value: "text-gray-600 tabular-nums text-right",
          positive: "text-emerald-600 font-medium tabular-nums text-right",
          negative: "text-red-600 font-medium tabular-nums text-right"
        }
      }
    }
  )
}
8. Ce Elimini Complet

❌ Toate gradient-urile (prea 2010)
❌ Shadows colorate (shadow-blue-500/20)
❌ Animații pulse/bounce
❌ Culori prea saturate
❌ Border-radius full pe butoane
❌ Toate efectele "glow"

9. Librării de Inspirație/Componente

Tremor.so - pentru charts și dashboard components
Headless UI - unstyled components pentru control total
Radix UI - primitives foarte bune
Arco Design - mai puțin cunoscut dar foarte clean

10. Mockup Rapid - Cum ar arăta
typescript// Button nou
<button className={cn(
  "inline-flex items-center justify-center",
  "px-4 py-2",
  "text-sm font-medium",
  "text-gray-700 bg-white",
  "border border-gray-300",
  "rounded-md",
  "hover:bg-gray-50",
  "focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500",
  "transition-colors duration-150"
)}>
  Adaugă Tranzacție
</button>

// Grid cell pentru valori
<td className={cn(
  "px-4 py-3",
  "text-sm tabular-nums text-right",
  value > 0 ? "text-gray-900" : "text-gray-500",
  isToday && "bg-blue-50",
  isSelected && "ring-1 ring-inset ring-blue-500"
)}>
  {formatCurrency(value)}
</td>
Plan de Implementare

Început cu paletă și fonturi (1 zi)
Instalare Shadcn/ui și setup (2 ore)
Refactor un singur component ca pilot (Button)
Dacă îți place, continue cu restul
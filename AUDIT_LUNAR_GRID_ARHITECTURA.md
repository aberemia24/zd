# 🌙 LUNAR GRID - DOCUMENTAȚIE ARHITECTURĂ

> **Autor**: AI Assistant  
> **Data**: 31 Mai 2025  
> **Versiune**: 1.0  
> **Scope**: Audit complet componenta LunarGrid și pagina asociată

---

## 📋 CUPRINS

1. [Overview](#-overview)
2. [Arhitectura Generală](#-arhitectura-generală)
3. [**DEPENDENCY TREE COMPLET**](#-dependency-tree-complet) ⭐ **NOU**
4. [Componenta Principală](#-componenta-principală)
5. [Hook-uri și State Management](#-hook-uri-și-state-management)
6. [Utilitare și Formatare](#-utilitare-și-formatare)
7. [Styling (CVA System)](#-styling-cva-system)
8. [Types și Interfețe](#-types-și-interfețe)
9. [Pagina LunarGrid](#-pagina-lunargrid)
10. [Dependențe și Integrări](#-dependențe-și-integrări)
11. [Fluxul de Date](#-fluxul-de-date)

---

## 📍 OVERVIEW

**LunarGrid** este o componentă complexă care implementează un grid interactiv similar cu Excel pentru gestionarea tranzacțiilor financiare lunare. Componenta combină funcționalitate avansată de editare inline, navigare keyboard, sistem modal, și integrare cu TanStack Table pentru performanță optimă.

### 🎯 Caracteristici Principale
- **Grid interactiv Excel-like** cu editare inline
- **Gestionare categorii și subcategorii** dinamic
- **Sistem modal** pentru adăugare/editare tranzacții
- **Navigare keyboard** avansată
- **Styling profesional** cu CVA (Class Variance Authority)
- **Performance optimizată** cu React Query și TanStack Table
- **State persistent** cu localStorage

---

## 🏗 ARHITECTURA GENERALĂ

```mermaid
graph TD
    A[LunarGridPage.tsx] --> B[LunarGridTanStack.tsx]
    B --> C[useLunarGridTable]
    B --> D[useKeyboardNavigation]
    B --> E[QuickAddModal]
    B --> F[TransactionModal]
    B --> G[EditableCell]
    B --> H[CellTransactionPopover]
    
    C --> I[formatters.ts]
    C --> J[dataTransformers.ts]
    C --> K[calculations.ts]
    
    B --> L[grid.ts CVA Styles]
    
    M[useMonthlyTransactions] --> C
    N[useCategoryStore] --> B
    O[useAuthStore] --> B
    
    style A fill:#e1f5fe
    style B fill:#f3e5f5
    style C fill:#e8f5e8
    style L fill:#fff3e0
```

---

## 🌳 DEPENDENCY TREE COMPLET

### 📊 **TABEL COMPLET CU TOATE DEPENDENȚELE**

| **Categorie** | **Fișier/Dependență** | **Tip** | **Rol și Funcționalitate** |
|---------------|------------------------|---------|----------------------------|
| **🎯 FRAMEWORK & LIBRARIES** |
| └── React | `React` | External | Framework principal pentru UI components |
| └── React | `useState` | Hook | State management local în componente |
| └── React | `useMemo` | Hook | Memoization pentru optimizare performance |
| └── React | `useCallback` | Hook | Memoization pentru funcții, evită re-renders |
| └── React | `useEffect` | Hook | Side effects și lifecycle management |
| └── React | `memo` | HOC | Prevenire re-renderizări inutile pentru componente |
| └── React | `useRef` | Hook | Referințe DOM și valori persistente |
| └── React | `useTransition` | Hook | React 18 - transițiuni fără blocking UI |
| └── TanStack Table | `flexRender` | Function | Renderizare dinamică celule în TanStack Table |
| └── TanStack Table | `Row` | Type | Tipul pentru rândurile tabelului |
| └── TanStack Table | `useReactTable` | Hook | Hook principal pentru instanța de tabel |
| └── TanStack Table | `getCoreRowModel` | Function | Model de bază pentru rânduri |
| └── TanStack Table | `ColumnDef` | Type | Definire structură coloane |
| └── TanStack Table | `Table` | Type | Tipul pentru instanța tabelului |
| └── TanStack Table | `Column` | Type | Tipul pentru coloane individuale |
| └── React Query | `useQueryClient` | Hook | Access la client pentru cache management |
| └── React Hot Toast | `toast` | Function | Notificări UX pentru succes/eroare |
| └── Lucide React | `Plus` | Icon | Icon pentru adăugare subcategorii |
| └── Lucide React | `Edit` | Icon | Icon pentru editare inline |
| └── Lucide React | `Trash2` | Icon | Icon pentru ștergere tranzacții |
| └── Lucide React | `ChevronRight` | Icon | Icon pentru expandare categorii |
| └── Lucide React | `Maximize2` | Icon | Icon pentru fullscreen mode |
| └── Lucide React | `Minimize2` | Icon | Icon pentru exit fullscreen |
| **🏪 STORES & STATE MANAGEMENT** |
| └── Category Store | `useCategoryStore` | Zustand Hook | Gestionare categorii și subcategorii custom |
| │   ├── `categories` | Property | Array categorii din store |
| │   ├── `saveCategories` | Method | Salvare categorii modificate |
| │   ├── `loadUserCategories` | Method | Încărcare categorii utilizator |
| │   └── `mergeWithDefaults` | Method | Merge categorii custom cu default |
| └── Auth Store | `useAuthStore` | Zustand Hook | Autentificare și context utilizator |
| │   └── `user` | Property | Obiectul utilizator curent |
| └── Transaction Store | `useTransactionStore` | Zustand Hook | Cache local pentru tranzacții |
| **📡 REACT QUERY HOOKS** |
| └── Monthly Transactions | `useMonthlyTransactions` | Custom Hook | Fetch tranzacții pentru luna specifică |
| └── Preloading | `useAdjacentMonthsPreload` | Custom Hook | Preload luni adiacente pentru UX |
| └── Create Mutation | `useCreateTransactionMonthly` | Custom Hook | Creare tranzacții noi cu optimistic updates |
| └── Update Mutation | `useUpdateTransactionMonthly` | Custom Hook | Actualizare tranzacții existente |
| └── Delete Mutation | `useDeleteTransactionMonthly` | Custom Hook | Ștergere tranzacții cu confirmare |
| **🎣 CUSTOM HOOKS (LUNARGRID)** |
| └── Table Hook | `useLunarGridTable` | Custom Hook | Hook principal pentru TanStack Table integration |
| └── Keyboard Navigation | `useKeyboardNavigation` | Custom Hook | Navigare cu săgeți, shortcuts, focus management |
| └── Performance | `usePerformanceOptimization` | Custom Hook | Virtualizare, debouncing, memoization |
| └── Calculations | `useLunarGridCalculations` | Custom Hook | Calcule financiare pentru grid |
| └── Recurring | `useRecurringTransactions` | Custom Hook | Gestionare tranzacții recurente |
| **🛠 UTILS & FORMATTERS** |
| └── Formatters | `formatters.ts` | Utils | |
| │   ├── `formatCurrency` | Function | Formatare sume monetare cu Intl.NumberFormat |
| │   ├── `getBalanceStyleClass` | Function | CSS classes pentru sume pozitive/negative |
| │   ├── `formatMonthYear` | Function | Formatare lună/an în română pentru header |
| │   ├── `formatDate` | Function | Formatare date zz/ll/aaaa |
| │   ├── `formatDayMonth` | Function | Formatare zi pentru coloane |
| │   ├── `isCurrentDay` | Function | Verificare dacă ziua este azi |
| │   ├── `getDayHeaderStyle` | Function | CSS pentru highlight ziua curentă |
| │   └── `getCategoryStyleClass` | Function | CSS pentru styling categorii |
| └── Data Transformers | `dataTransformers.ts` | Utils | |
| │   ├── `getDaysInMonth` | Function | Calculare număr zile în lună |
| │   ├── `generateTableColumns` | Function | Generare dinamică coloane TanStack |
| │   ├── `transformTransactionsToGrid` | Function | Transformare tranzacții în format grid |
| │   └── `groupByCategory` | Function | Grupare tranzacții pe categorii |
| └── Calculations | `calculations.ts` | Utils | |
| │   ├── `calculateDailyBalances` | Function | Calcul balanțe zilnice |
| │   ├── `calculateCategoryTotals` | Function | Calcul totaluri categorii |
| │   ├── `calculateMonthlyProjection` | Function | Proiecții lunare |
| │   └── `validateNumericInput` | Function | Validare input numeric |
| └── Financial Calc | `financialCalculations.ts` | Utils | |
| │   ├── `calculateProjections` | Function | Calcule proiecții complexe |
| │   ├── `analyzeTrends` | Function | Analiză trend-uri financiare |
| │   ├── `calculatePercentages` | Function | Calcule procente |
| │   └── `compareMonths` | Function | Comparații între luni |
| └── Recurring Generator | `recurringTransactionGenerator.ts` | Utils | |
| │   ├── `detectRecurringPatterns` | Function | Detectare pattern-uri recurente |
| │   ├── `generateFutureTransactions` | Function | Generare tranzacții viitoare |
| │   ├── `handleExceptions` | Function | Gestionare excepții (sărbători) |
| │   └── `validateConsistency` | Function | Validare consistență pattern |
| **🎨 CVA STYLING SYSTEM** |
| └── Grid Styles | `grid.ts` | CVA | |
| │   ├── `gridContainer` | CVA Component | Container principal cu variants (default, professional, elevated) |
| │   ├── `gridTable` | CVA Component | Tabel cu density variants (compact, default, comfortable) |
| │   ├── `gridHeader` | CVA Component | Header sticky cu shadow și variants |
| │   ├── `gridHeaderCell` | CVA Component | Celule header cu sticky, sortable, numeric variants |
| │   ├── `gridCategoryRow` | CVA Component | Rânduri categorii cu gradients și hover effects |
| │   ├── `gridSubcategoryRow` | CVA Component | Rânduri subcategorii cu indentare |
| │   ├── `gridTotalRow` | CVA Component | Rânduri totalizatoare cu emphasis |
| │   ├── `gridCell` | CVA Component | Celule standard cu hover, editing, selection states |
| │   ├── `gridExpandIcon` | CVA Component | Icon expandare cu rotație animată |
| │   ├── `gridCellActions` | CVA Component | Container acțiuni celule |
| │   ├── `gridActionButton` | CVA Component | Butoane acțiuni cu variants |
| │   ├── `gridBadge` | CVA Component | Badge-uri cu color variants |
| │   ├── `gridInput` | CVA Component | Input-uri inline cu focus states |
| │   ├── `gridMessage` | CVA Component | Mesaje feedback cu variants |
| │   ├── `gridInteractive` | CVA Component | Zone interactive cu focus |
| │   ├── `gridValueState` | CVA Component | State-uri valori (positive, negative, zero) |
| │   ├── `gridTransactionCell` | CVA Component | Celule specializate tranzacții |
| │   └── `gridSubcategoryState` | CVA Component | State-uri subcategorii |
| └── Data Styles | `data.ts` | CVA | |
| │   ├── `dataTable` | CVA Component | Stiluri compatibilitate tabel |
| │   ├── `tableHeader` | CVA Component | Header compatibilitate |
| │   ├── `tableCell` | CVA Component | Celule compatibilitate |
| │   └── `tableRow` | CVA Component | Rânduri compatibilitate |
| └── Layout Styles | `layout.ts` | CVA | |
| │   ├── `flex` | CVA Component | Layout flexbox cu direction variants |
| │   ├── `modal` | CVA Component | Modal overlay cu backdrop variants |
| │   ├── `modalContent` | CVA Component | Conținut modal cu size variants |
| │   ├── `container` | CVA Component | Container layout cu spacing |
| │   └── `button` | CVA Component | Butoane cu variants (primary, secondary) |
| └── Form Styles | `forms.ts` | CVA | |
| │   └── `button` | CVA Component | Stiluri butoane form |
| └── Shared Utils | `shared/utils.ts` | Utils | |
| │   └── `cn` | Function | Utility pentru combinare clase CSS |
| **📱 UI PRIMITIVE COMPONENTS** |
| └── Button | `Button.tsx` | Component | Butoane reutilizabile cu props |
| └── Badge | `Badge.tsx` | Component | Badge-uri cu variants color |
| └── Select | `Select.tsx` | Component | Dropdown select cu opțiuni |
| └── Input | `Input.tsx` | Component | Input controlat cu validare |
| └── Spinner | `Spinner.tsx` | Component | Loading spinner animat |
| **🏗 LUNARGRID COMPONENTS** |
| └── Main Component | `LunarGridTanStack.tsx` | Component | Componenta principală orchestrare |
| └── Page Container | `LunarGridPage.tsx` | Component | Container pagină cu layout modes |
| └── Cell Popover | `CellTransactionPopover.tsx` | Component | Popover pentru editare celule |
| └── Editable Cell | `EditableCell.tsx` | Component | Celule cu editare inline |
| │   └── Inline Editing | `useInlineCellEdit.tsx` | Hook | Hook pentru logica editării inline |
| └── Quick Modal | `QuickAddModal.tsx` | Component | Modal pentru adăugare rapidă |
| └── Transaction Modal | `TransactionModal.tsx` | Component | Modal complex pentru editare |
| └── Grid Navigation | `useGridNavigation.tsx` | Hook | Navigare între celule cu tastatura |
| └── Performance Opt | `usePerformanceOptimization.tsx` | Hook | Optimizări performance pentru modals |
| **📄 TYPES & INTERFACES** |
| └── Main Types | `types.ts` | Types | |
| │   ├── `LunarGridRowData` | Interface | Structura rândurilor TanStack |
| │   ├── `DayColumnDef` | Type | Extensie ColumnDef cu informații zi |
| │   ├── `TransactionPopoverState` | Interface | State pentru popover editare |
| │   ├── `SubcategoryEditState` | Interface | State pentru editare subcategorii |
| │   ├── `UseLunarGridTableOptions` | Interface | Opțiuni pentru hook tabel |
| │   ├── `UseLunarGridTableResult` | Interface | Rezultat hook tabel |
| │   ├── `CellRendererProps` | Interface | Props pentru renderer celule |
| │   ├── `ColumnConfig` | Interface | Configurare coloane |
| │   └── `TanStackSubcategoryRowsProps` | Interface | Props pentru subcategorii |
| └── Financial Types | `FinancialCalculations.ts` | Types | |
| │   ├── `ProjectionData` | Interface | Date pentru proiecții |
| │   ├── `TrendAnalysis` | Interface | Rezultate analiză trend |
| │   └── `ComparisonResult` | Interface | Rezultate comparații |
| └── Recurring Types | `RecurringTransactions.ts` | Types | |
| │   ├── `RecurringPattern` | Interface | Pattern-uri recurență |
| │   ├── `FrequencyConfig` | Interface | Configurare frecvență |
| │   ├── `ExceptionRule` | Interface | Reguli excepții |
| │   └── `ValidationResult` | Interface | Rezultate validare |
| **🎯 SHARED CONSTANTS** |
| └── Enums | `enums.ts` | Constants | |
| │   ├── `TransactionType` | Enum | INCOME, EXPENSE, SAVING |
| │   ├── `FrequencyType` | Enum | DAILY, WEEKLY, MONTHLY, YEARLY |
| │   └── `CategoryType` | Enum | Tipuri categorii predefinite |
| └── UI Constants | `ui.ts` | Constants | |
| │   ├── `LUNAR_GRID_MESSAGES` | Object | Mesaje specifice grid |
| │   ├── `MESAJE` | Object | Mesaje generale aplicație |
| │   ├── `FLAGS` | Object | Flags pentru stări |
| │   ├── `PLACEHOLDERS` | Object | Text placeholder pentru input-uri |
| │   ├── `UI` | Object | Constante interfață utilizator |
| │   ├── `BUTTONS` | Object | Texte butoane |
| │   ├── `TITLES` | Object | Titluri secțiuni |
| │   ├── `LABELS` | Object | Label-uri form |
| │   ├── `EXCEL_GRID` | Object | Constante specifice grid Excel-like |
| │   └── `LUNAR_GRID_ACTIONS` | Object | Acțiuni specifice LunarGrid |
| **🔧 TRANSACTION MUTATIONS** |
| └── Create Payload | `CreateTransactionHookPayload` | Type | Payload pentru creare tranzacție |
| └── Update Payload | `UpdateTransactionHookPayload` | Type | Payload pentru actualizare tranzacție |
| **🗄 LOCAL STORAGE** |
| └── Expanded State | `lunarGrid-expanded-${year}-${month}` | Storage Key | Persistare stare expandare categorii |
| **🌐 BROWSER APIs** |
| └── Local Storage | `localStorage` | API | Persistare date browser |
| └── Window Timer | `setTimeout/clearTimeout` | API | Debouncing pentru performance |
| └── Event Listeners | `addEventListener/removeEventListener` | API | Keyboard navigation și escape handlers |

### 📊 **STATISTICI DEPENDENCY TREE**

| **Categorie** | **Număr Dependențe** | **Complexitate** |
|---------------|----------------------|------------------|
| Framework & Libraries | 18 | ⭐⭐ |
| Stores & State Management | 8 | ⭐⭐⭐ |
| React Query Hooks | 5 | ⭐⭐⭐ |
| Custom Hooks | 5 | ⭐⭐⭐⭐ |
| Utils & Formatters | 25+ | ⭐⭐⭐⭐ |
| CVA Styling System | 20+ | ⭐⭐⭐⭐⭐ |
| UI Components | 10 | ⭐⭐ |
| LunarGrid Components | 8 | ⭐⭐⭐⭐⭐ |
| Types & Interfaces | 15+ | ⭐⭐⭐ |
| Shared Constants | 15+ | ⭐⭐ |
| **TOTAL** | **~125+ DEPENDENȚE** | **⭐⭐⭐⭐⭐** |

---

## 🎯 COMPONENTA PRINCIPALĂ

### `LunarGridTanStack.tsx` (1,716 linii)

**Rol**: Componenta principală care orchestrează întreaga funcționalitate.

#### 📦 Importuri Principale
```typescript
// Framework și librării core
import React, { useCallback, useState, useMemo, memo, useEffect } from 'react';
import { flexRender, Row } from "@tanstack/react-table";

// Hook-uri custom specifice
import { useLunarGridTable } from "./hooks/useLunarGridTable";
import { useKeyboardNavigation } from "./hooks/useKeyboardNavigation";

// Store management
import { useCategoryStore } from "../../../stores/categoryStore";
import { useAuthStore } from "../../../stores/authStore";

// React Query pentru data fetching
import { useMonthlyTransactions } from '../../../services/hooks/useMonthlyTransactions';

// Shared constants (single source of truth)
import { TransactionType, FrequencyType, LUNAR_GRID_MESSAGES } from "@shared-constants";

// CVA styling system
import { gridContainer, gridTable, gridCell, gridHeader } from "../../../styles/cva/grid";
```

#### 🔧 Funcționalități Cheie

1. **State Management Local**
   ```typescript
   interface PopoverState {
     isOpen: boolean;
     category: string;
     subcategory: string | undefined;
     day: number;
     amount: string;
     type: TransactionType;
     element: HTMLElement | null;
   }

   interface ModalState {
     isOpen: boolean;
     mode: 'add' | 'edit';
     category: string;
     subcategory: string | undefined;
     day: number;
     year: number;
     month: number;
     existingValue?: string | number;
     transactionId?: string | null;
   }
   ```

2. **Persistent Expanded State**
   ```typescript
   const usePersistentExpandedRows = (year: number, month: number) => {
     const storageKey = `lunarGrid-expanded-${year}-${month}`;
     // Salvare/încărcare automată din localStorage
   }
   ```

3. **Gestionare Subcategorii**
   - Adăugare dinamică subcategorii
   - Editare inline nume subcategorii
   - Ștergere cu confirmare

---

## 🎣 HOOK-URI ȘI STATE MANAGEMENT

### 📁 `frontend/src/components/features/LunarGrid/hooks/`

#### `useLunarGridTable.tsx` (616 linii)
**Rol**: Hook principal pentru gestionarea datelor și stării tabelului TanStack.

**Funcționalități**:
- Transformare date din React Query în format TanStack Table
- Gestionare coloane dynamice (zilele lunii)
- Calcule automatizate (totaluri, balanțe)
- Mapare tranzacții pentru access rapid
- Gestionare stări loading/error

**Tipuri Principale**:
```typescript
export type TransformedTableDataRow = {
  id: string;
  category: string;
  subcategory?: string;
  isCategory: boolean;
  total: number;
  subRows?: TransformedTableDataRow[];
} & DailyAmount;

export type TransactionMap = Map<string, string>; // "category-subcategory-day" -> transactionId
```

#### `useKeyboardNavigation.tsx` (397 linii)
**Rol**: Navigare avansată cu tastatura în grid.

**Funcționalități**:
- Navigare cu săgeți (Arrow keys)
- Selecție multiplă cu Shift+Click
- Shortcuts keyboard (Delete, Enter, Escape)
- Focus management între celule
- Undo/Redo pentru acțiuni

#### `usePerformanceOptimization.tsx` (110 linii)
**Rol**: Optimizări de performanță pentru grid-ul mare.

**Funcționalități**:
- Virtualizare rânduri pentru dataset mare
- Debouncing pentru actualizări frecvente
- Memoization pentru calcule costisitoare
- Lazy loading pentru date

### 📁 `frontend/src/hooks/lunarGrid/`

#### `useLunarGridCalculations.ts` (215 linii)
**Rol**: Calcule financiare specifice grid-ului.

**Funcționalități**:
- Calcule balanțe zilnice
- Proiecții financiare
- Calcule categorii/subcategorii
- Totaluri automate

#### `useRecurringTransactions.tsx` (570 linii)
**Rol**: Gestionarea tranzacțiilor recurente.

**Funcționalități**:
- Generare automată tranzacții recurente
- Pattern detection pentru recurență
- Validare și cleanup duplicate
- Sincronizare cu baza de date

---

## 🛠 UTILITARE ȘI FORMATARE

### 📁 `frontend/src/utils/lunarGrid/`

#### `formatters.ts` (234 linii)
**Rol**: Formatare date și valori pentru afișare.

**Funcții Principale**:
```typescript
// Formatare monetară optimizată cu singleton
const currencyFormatter = new Intl.NumberFormat("ro-RO", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export function formatCurrency(amount: number): string;
export function getBalanceStyleClass(amount: number): string;
export function formatMonthYear(month: number, year: number): string;
export function isCurrentDay(day: number, month: number, year: number): boolean;
```

#### `dataTransformers.ts` (225 linii)
**Rol**: Transformare date între formateformat interni și format UI.

**Funcționalități**:
- Transformare tranzacții în format grid
- Grupare pe categorii/subcategorii
- Calcule agregări
- Export/import date

#### `calculations.ts` (241 linii)
**Rol**: Calcule matematice pentru grid.

**Funcționalități**:
- Calcule finansiare complexe
- Algoritmi pentru totaluri
- Validări numerice
- Rotunjiri și aproximări

#### `financialCalculations.ts` (325 linii)
**Rol**: Calcule financiare avansate.

**Funcționalități**:
- Proiecții bugetare
- Analize trend-uri
- Calcule procente
- Comparații lunare

#### `recurringTransactionGenerator.ts` (659 linii)
**Rol**: Generator pentru tranzacții recurente.

**Funcționalități**:
- Detectare pattern-uri recurente
- Generare automată tranzacții viitoare
- Gestionare excepții (sărbători, weekenduri)
- Validare consistență

---

## 🎨 STYLING (CVA SYSTEM)

### 📁 `frontend/src/styles/cva/grid/`

#### `grid.ts` (876 linii)
**Rol**: Sistem complet de styling cu CVA pentru grid Excel-like.

**Componente Principale**:

1. **Container și Layout**
   ```typescript
   export const gridContainer = cva([
     "overflow-auto rounded-lg",
     "transition-all duration-200 ease-in-out"
   ], {
     variants: {
       variant: {
         default: "bg-white shadow-sm border border-gray-200/60",
         professional: [
           "bg-white shadow-lg border border-gray-200/80",
           "hover:shadow-xl transition-shadow duration-300"
         ],
         elevated: "bg-white shadow-xl border border-gray-100 ring-1 ring-gray-100/50"
       },
       size: {
         compact: "h-[500px]",
         default: "h-[790px]",
         large: "h-[1000px]",
         fullscreen: "h-[calc(100vh-120px)] min-h-[400px]"
       }
     }
   });
   ```

2. **Header și Celule**
   ```typescript
   export const gridHeaderCell = cva([
     "px-4 py-3 font-semibold text-gray-700",
     "transition-all duration-150 ease-in-out"
   ], {
     variants: {
       variant: {
         sticky: [
           "sticky left-0 z-40 text-left bg-white",
           "shadow-[2px_0_8px_-2px_rgba(0,0,0,0.15)]"
         ],
         sortable: [
           "cursor-pointer select-none bg-white",
           "hover:bg-gray-50 active:bg-gray-100"
         ]
       }
     }
   });
   ```

3. **Rânduri Categorii și Subcategorii**
   ```typescript
   export const gridCategoryRow = cva([
     "cursor-pointer group",
     "transition-all duration-200 ease-in-out"
   ], {
     variants: {
       variant: {
         professional: [
           "bg-gradient-to-r from-gray-50/90 to-gray-100/60",
           "hover:from-gray-100/90 hover:to-gray-150/60",
           "hover:border-l-blue-400"
         ],
         income: [
           "bg-gradient-to-r from-green-50/90 to-green-100/60",
           "hover:border-l-green-400"
         ],
         expense: [
           "bg-gradient-to-r from-red-50/90 to-red-100/60",
           "hover:border-l-red-400"
         ]
       }
     }
   });
   ```

**Caracteristici Advanced Styling**:
- **Excel-like Experience**: Hover states, focus management, selection feedback
- **Professional Theme**: Gradient backgrounds, shadows, transitions
- **Responsive Design**: Adaptare automată la diferite rezoluții
- **Accessibility**: Focus indicators, keyboard navigation support
- **Performance**: CSS optimizat pentru rendering rapid

---

## 📄 TYPES ȘI INTERFEȚE

### 📁 `frontend/src/components/features/LunarGrid/types.ts` (301 linii)

**Tipuri Principale**:

```typescript
// Structura de bază pentru rândurile tabelului
export interface LunarGridRowData {
  id: string;
  category: string;
  subcategory?: string;
  isCategory: boolean;
  isExpanded?: boolean;
  dailyAmounts: Record<number, number>;
  transactions: TransactionValidated[];
  total?: number;
}

// Extensie pentru coloane cu informații despre zile
export type DayColumnDef = ColumnDef<LunarGridRowData> & {
  day: number;
  isWeekend?: boolean;
  date?: Date;
};

// Stare pentru popover-ul de editare
export interface TransactionPopoverState {
  active: boolean;
  day: number;
  category: string;
  subcategory: string;
  amount: string;
  type: string;
  position: { top: number; left: number } | null;
}
```

### 📁 `frontend/src/types/lunarGrid/`

#### `FinancialCalculations.ts` (60 linii)
**Rol**: Tipuri pentru calcule financiare.

#### `RecurringTransactions.ts` (289 linii)
**Rol**: Tipuri pentru tranzacții recurente și pattern-uri.

---

## 📱 PAGINA LUNARGRID

### `LunarGridPage.tsx` (412 linii)

**Rol**: Pagina container care integrează componenta LunarGrid cu funcționalități suplimentare.

#### 🔧 Funcționalități Principale

1. **Layout Modes**
   ```typescript
   type LayoutMode = 'full-width' | 'fullscreen';
   
   const getLayoutStyles = (mode: LayoutMode): string => {
     switch (mode) {
       case 'full-width':
         return "relative left-1/2 right-1/2 w-screen -ml-[50vw] -mr-[50vw]";
       case 'fullscreen':
         return "fixed inset-0 z-50 bg-white p-4 overflow-auto";
     }
   };
   ```

2. **Navigare între Luni cu Debounce**
   ```typescript
   const setDateWithDebounce = useCallback((newMonth: number, newYear: number) => {
     setMonth(newMonth);
     setYear(newYear);
     
     // Invalidare cache după 300ms
     debounceTimerRef.current = setTimeout(() => {
       queryClient.invalidateQueries({
         queryKey: ["transactions", newYear, newMonth],
       });
     }, 300);
   }, [queryClient]);
   ```

3. **Preloading Inteligent**
   ```typescript
   useAdjacentMonthsPreload(year, month, user?.id, {
     staleTime: 60 * 1000,
     gcTime: 10 * 60 * 1000,
   });
   ```

4. **React 18 Transitions**
   ```typescript
   const [isPending, startTransition] = useTransition();
   
   const goToNextMonth = () => {
     startTransition(() => {
       setDateWithDebounce(newMonth, newYear);
     });
   };
   ```

#### 🎮 UI Components

- **Progressive Enhancement Button**: Toggle între full-width și fullscreen
- **Month/Year Selectors**: Dropdown-uri pentru navegare rapidă
- **Loading States**: Spinner-e și skeleton loading
- **Keyboard Shortcuts**: Escape pentru exit fullscreen

---

## 🔗 DEPENDENȚE ȘI INTEGRĂRI

### 🏪 Store Dependencies

1. **useCategoryStore**
   - Gestionare categorii și subcategorii
   - CRUD operations pentru categorii custom
   - Sincronizare cu backend

2. **useAuthStore**
   - User context pentru filtering tranzacții
   - Permisiuni pentru modificări
   - Session management

3. **useTransactionStore**
   - Cache local pentru tranzacții
   - Optimistic updates
   - Sync cu React Query

### 📡 React Query Integration

```typescript
// Hook principal pentru data fetching
const { transactions, isLoading, error } = useMonthlyTransactions(
  year, 
  month, 
  user?.id,
  { includeAdjacentDays: true }
);

// Mutation hooks pentru CRUD
const createMutation = useCreateTransactionMonthly();
const updateMutation = useUpdateTransactionMonthly();
const deleteMutation = useDeleteTransactionMonthly();
```

### 🎯 TanStack Table Integration

```typescript
const table = useReactTable({
  data: transformedData,
  columns: dynamicColumns,
  getCoreRowModel: getCoreRowModel(),
  // Configurații avansate pentru performance
});
```

### 🎨 Shared Constants Integration

Toate textele, mesajele și constantele provin din `@shared-constants`:

```typescript
import { 
  LUNAR_GRID_MESSAGES, 
  UI, 
  BUTTONS, 
  EXCEL_GRID 
} from "@shared-constants";
```

---

## 🌊 FLUXUL DE DATE

```mermaid
sequenceDiagram
    participant U as User
    participant LP as LunarGridPage
    participant LG as LunarGridTanStack
    participant H as useLunarGridTable
    participant RQ as React Query
    participant API as Backend API
    
    U->>LP: Acces pagină
    LP->>RQ: Request monthly transactions
    RQ->>API: Fetch data
    API->>RQ: Response data
    RQ->>H: Provide transactions
    H->>H: Transform data pentru TanStack
    H->>LG: Return table instance
    LG->>LP: Render grid
    LP->>U: Display interface
    
    U->>LG: Click pe celulă
    LG->>LG: Open modal/popover
    U->>LG: Edit valoare
    LG->>RQ: Mutation (optimistic)
    RQ->>API: Save change
    API->>RQ: Confirm save
    RQ->>H: Update cache
    H->>LG: Re-render
```

### 🔄 Data Flow Patterns

1. **Unidirectional Flow**: Datele curg de la React Query → Hook → Component → UI
2. **Optimistic Updates**: UI se actualizează imediat, sync cu backend în background
3. **Cache Management**: React Query gestionează cache-ul automat cu invalidare inteligentă
4. **Error Boundaries**: Gestionare robustă a erorilor cu fallback UI

---

## 📊 SUMAR FIȘIERE ȘI RESPONSABILITĂȚI

| Fișier | Linii | Responsabilitate | Complexitate |
|--------|-------|------------------|--------------|
| `LunarGridTanStack.tsx` | 1,716 | Componentă principală, orchestrare UI | ⭐⭐⭐⭐⭐ |
| `useLunarGridTable.tsx` | 616 | Data management și TanStack integration | ⭐⭐⭐⭐ |
| `grid.ts` (CVA) | 876 | Styling system complet | ⭐⭐⭐⭐ |
| `recurringTransactionGenerator.ts` | 659 | Generator tranzacții recurente | ⭐⭐⭐⭐ |
| `useRecurringTransactions.tsx` | 570 | Hook pentru recurența | ⭐⭐⭐ |
| `LunarGridPage.tsx` | 412 | Container page cu layout management | ⭐⭐⭐ |
| `useKeyboardNavigation.tsx` | 397 | Navigare keyboard avansată | ⭐⭐⭐ |
| `EditableCell.tsx` | 434 | Editare inline în celule | ⭐⭐⭐ |
| `QuickAddModal.tsx` | 369 | Modal pentru adăugare rapidă | ⭐⭐ |
| `TransactionModal.tsx` | 380 | Modal pentru editare complexă | ⭐⭐ |

---

## 🎯 CONCLUZII

**LunarGrid** reprezintă o implementare sofisticată a unui grid financial interactiv, construită cu:

✅ **Arhitectură modulară** bine separată pe responsabilități  
✅ **Performance optimizată** cu TanStack Table și React Query  
✅ **UX avansat** cu navigare keyboard și editare inline  
✅ **Styling profesional** cu CVA system  
✅ **Type safety** completă cu TypeScript  
✅ **State management** robust cu persistență  
✅ **Integration seamless** cu ecosystem-ul aplicației  

Componenta demonstrează implementarea unor pattern-uri avansate React și oferă o experiență de utilizare comparabilă cu aplicațiile de tip Excel/Spreadsheet.

---

*Document generat de AI Assistant pe baza analizei complete a codului LunarGrid - 31 Mai 2025* 
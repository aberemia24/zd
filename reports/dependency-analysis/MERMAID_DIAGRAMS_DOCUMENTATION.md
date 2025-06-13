# LunarGrid Architecture - Mermaid Diagrams Documentation

## Overview

**Created:** June 13, 2025  
**Status:** ✅ Clean Architecture (Post Circular Dependency Fix)  
**Purpose:** Visual representation of LunarGrid component relationships and data flows

---

## 📊 Diagram 1: High-Level Component Architecture

### Purpose
Shows the main component hierarchy and dependencies in LunarGrid after resolving circular dependencies.

### Key Components

#### **Component Layer (Blue)**
- **LunarGridPage**: Main container component
- **LunarGridTanStack**: Table controller using TanStack Table
- **LunarGridRow**: Individual row renderer
- **EditableCell**: Cell editor with inline/modal editing

#### **Data & Logic Layer (Purple/Pink)**
- **useLunarGridTable**: Main hook orchestrating table logic
- **tableTypes.ts**: ✅ Dedicated type definitions (breaks circular dependency)
- **utils/lunarGrid**: Utility functions for calculations and formatting

#### **State Management (Green)**
- **categoryStore**: Category management
- **authStore**: User authentication
- **useMonthlyTransactions**: React Query hook for data fetching

#### **External Dependencies (Orange)**
- **@tanstack/react-table**: Table library
- **@budget-app/shared-constants**: Centralized constants and types

### Architecture Benefits
- ✅ **Clean separation** of concerns
- ✅ **No circular dependencies**
- ✅ **Proper data flow** from stores to components
- ✅ **Reusable types** in dedicated files

---

## 🔄 Diagram 2: State Management Flow

### Purpose
Illustrates how data flows through the application from user actions to database and back.

### Flow Patterns

#### **User Action Flow**
1. **User Action** → UI Components (TransactionForm/LunarGrid)
2. **Components** → Zustand Stores
3. **Stores** → Services/API calls
4. **Services** → Supabase Database

#### **Data Back Flow**
1. **Supabase** → React Query hooks
2. **Hooks** → Components (automatic re-render)
3. **Components** → UI updates

#### **Cross-Store Communication**
- **Cache Invalidation**: transactionFormStore invalidates useMonthlyTransactions cache
- **Category Updates**: categoryStore triggers LunarGrid re-renders
- **Shared Constants**: All components use centralized constants

### State Management Benefits
- ✅ **Unidirectional data flow**
- ✅ **Automatic cache invalidation**
- ✅ **Centralized state management**
- ✅ **Type-safe store communication**

---

## ⚡ Diagram 3: Event Handling Chains

### Purpose
Maps user interactions to their corresponding event handlers and UI updates.

### Event Chains

#### **Cell Interaction Chain**
1. **Cell Click** → onCellClick → setSelectedCell → Highlight Cell
2. **Cell Double Click** → onCellDoubleClick → startEdit → Show Edit Input
3. **Cell Hover** → onCellHover → showActions → Show Hover Actions

#### **Keyboard Shortcuts**
- **F2**: Direct to edit mode (inline editing)
- **Enter**: Open modal for detailed editing
- **Escape**: Cancel current edit operation

#### **Modal Trigger Flow**
- **Hover Actions** → Click "More" button → Open Modal → Show Transaction Form

### Interaction Benefits
- ✅ **Consistent UX patterns**
- ✅ **Multiple interaction modes** (click, double-click, keyboard)
- ✅ **Progressive disclosure** (hover → actions → modal)
- ✅ **Keyboard accessibility**

---

## 🔧 Diagram 4: Hook Relationships (Clean Architecture)

### Purpose
Shows the composition of React hooks and their dependencies after fixing circular dependencies.

### Hook Composition

#### **Main Hook: useLunarGridTable**
Orchestrates all table functionality by composing:
- **Store Hooks**: useCategoryStore, useAuthStore
- **Data Hooks**: useMonthlyTransactions, useReactTable
- **React Hooks**: useMemo, useCallback, useRef, useEffect

#### **Data Processing Flow**
1. **useMonthlyTransactions** → Fresh data from API
2. **useCategoryStore** → Category definitions
3. **useMemo** → Process and transform data
4. **useReactTable** → Create table instance

#### **Event Handling Flow**
1. **useCallback** → Memoized event handlers
2. **useRef** → DOM references for table container
3. **useReactTable** → Attach handlers to table

### Before/After Comparison

#### **❌ Before (Circular Dependencies)**
- `types.tsx` ↔ `useLunarGridTable.tsx` (circular import)
- `TransactionForm.tsx` ↔ `transactionFormStore.tsx` (circular import)

#### **✅ After (Clean Architecture)**
- `tableTypes.ts` → Dedicated type definitions
- `types/TransactionForm.ts` → Shared form types
- **No circular dependencies**
- **Better tree-shaking**
- **Improved maintainability**

### Hook Benefits
- ✅ **Proper hook composition**
- ✅ **No circular dependencies**
- ✅ **Memoized performance optimizations**
- ✅ **Clean separation of concerns**

---

## 🎨 Visual Language Guide

### Color Coding System

| Color | Component Type | Purpose |
|-------|---------------|---------|
| **Blue** | UI Components | User interface elements |
| **Purple** | Hooks & Logic | Business logic and data processing |
| **Green** | State Management | Zustand stores and state |
| **Orange** | External Dependencies | Third-party libraries |
| **Pink** | Types & Constants | Type definitions and shared constants |
| **Yellow** | User Actions | User interactions and events |
| **Red** | Problems/Issues | Circular dependencies (resolved) |

### Node Shapes & Icons
- **📊** Tables and grids
- **🔧** Hooks and utilities  
- **🗂️** Data stores
- **👤** User-related functionality
- **📡** API and data fetching
- **🖱️** User interactions
- **⌨️** Keyboard events
- **✅** Resolved issues
- **❌** Previous problems

---

## 🚀 Implementation Impact

### Performance Improvements
- **Tree-shaking**: Now properly enabled for all modules
- **Bundle size**: Reduced circular import overhead
- **Memory usage**: Better garbage collection
- **Build time**: Cleaner dependency resolution

### Maintainability Gains
- **Clearer dependencies**: Easy to understand component relationships
- **Better testing**: Components can be tested in isolation
- **Easier refactoring**: No circular dependency constraints
- **Documentation**: Visual guides for new developers

### Architecture Quality
- **SOLID principles**: Better separation of concerns
- **DRY principle**: Shared types eliminate duplication
- **Single responsibility**: Each file has a clear purpose
- **Open/closed**: Easy to extend without modification

---

## 📋 Usage Guidelines

### For Developers
1. **Reference these diagrams** when working on LunarGrid features
2. **Follow the established patterns** shown in the diagrams
3. **Maintain the clean architecture** by avoiding circular dependencies
4. **Update diagrams** when making significant architectural changes

### For Code Reviews
1. **Check new dependencies** against the established patterns
2. **Ensure no new circular dependencies** are introduced
3. **Verify proper hook composition** follows the documented patterns
4. **Validate state management flow** matches the documented approach

### For Architecture Decisions
1. **Use these patterns** as templates for new features
2. **Consider diagram updates** for major architectural changes
3. **Maintain visual consistency** with the established color coding
4. **Document new patterns** following the same format

---

**These diagrams represent the current clean architecture state and should be maintained as the codebase evolves.** 
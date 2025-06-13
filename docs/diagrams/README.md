# 📊 Diagrame - Budget App

Acest director conține diagramele vizuale pentru arhitectura și pattern-urile aplicației.

## 📁 Lista Diagramelor

| **Diagramă**                            | **Task** | **Descriere**                          | **Format** |
| --------------------------------------- | -------- | -------------------------------------- | ---------- |
| `task-1-component-architecture.mermaid` | Task 1   | LunarGrid component architecture       | Mermaid    |
| `task-3-hooks-ecosystem.mermaid`        | Task 3   | Hooks ecosystem și interdependencies   | Mermaid    |
| `state-management-flow.mermaid`         | Task 4   | State management patterns și data flow | Mermaid    |

## 🔧 Cum să vizualizezi diagramele

### VS Code / Cursor

1. Instalează extensia "Mermaid Preview"
2. Deschide fișierul `.mermaid`
3. `Ctrl+Shift+P` → "Mermaid: Preview"

### Online

1. Copiază conținutul fișierului `.mermaid`
2. Deschide [mermaid.live](https://mermaid.live)
3. Paste conținutul

### GitHub

Diagramele Mermaid se renderează automat în GitHub când sunt în fișiere `.md` cu:

````markdown
```mermaid
// conținut diagrama
```
````

```

## 📋 Pattern-uri Documentate

### Component Architecture (`task-1-component-architecture.mermaid`)
- **Scop**: Arhitectura generală a componentelor LunarGrid
- **Conține**: Dependencies între componente, hooks, utils, styles
- **Flow**: De la LunarGridPage la EditableCell
- **Integration**: Zustand stores + React Query

**Legendă:**
- 🔵 **UI Components** (fill:#e1f5fe)
- 🟣 **Main Logic** (fill:#f3e5f5)
- 🟢 **Hooks & Data** (fill:#e8f5e8)
- 🟠 **Styling** (fill:#fff3e0)

---
**Task asociat**: Task 1 - "Complete Pragmatic Code Audit and Mapping"

### Hooks Ecosystem (`task-3-hooks-ecosystem.mermaid`)
- **Scop**: Interdependențele între hook-urile custom
- **Conține**: useLunarGridTable, useInlineCellEdit, useTransactionOperations
- **Dependencies**: React Query, validation, preferences
- **Integration**: Cu componentele principale

**Componente Cheie:**
- **useLunarGridTable**: Main table orchestration
- **useInlineCellEdit**: Inline editing logic
- **useTransactionOperations**: CRUD operations
- **useKeyboardNavigationSimplified**: Navigation engine

---
**Task asociat**: Task 3 - "Analyze Core Hooks Ecosystem"

### State Management Flow (`state-management-flow.mermaid`)
- **Scop**: Vizualizarea pattern-urilor de state management
- **Conține**: Zustand, React Query, useState, useStatePersistence
- **Decision Tree**: Ghid pentru alegerea pattern-ului potrivit
- **Data Flow**: API → UI cu optimistic updates

**Legendă:**
- 🔵 **Local State** (useState/useReducer)
- 🟢 **Global State** (Zustand stores)
- 🟡 **Server State** (React Query)
- 🟣 **Persistent State** (localStorage/URL)

---
**Task asociat**: Task 4 - "Map Essential State Management Patterns"
```

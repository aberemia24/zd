# 🔧 Shared Hooks Directory

Acest director conține hook-uri React reutilizabile care sunt folosite în întreaga aplicație pentru a evita duplicarea de cod și pentru a standardiza comportamentul.

## 📋 Available Hooks

### 🎹 Event Handling System (Task 11)

**Implementat:** 29 Ian 2025 | **Status:** ✅ COMPLET | **Tests:** 9/9 PASSED

| Hook                 | Descriere                                                    | Fișier                                             |
| -------------------- | ------------------------------------------------------------ | -------------------------------------------------- |
| `useKeyboardHandler` | Centralizează keyboard event handling din întreaga aplicație | [useKeyboardHandler.tsx](./useKeyboardHandler.tsx) |
| `useFocusManager`    | Management centralizat al focus-ului cu debugging            | [useFocusManager.tsx](./useFocusManager.tsx)       |

**📚 Documentație Completă:** [EVENT_HANDLING_SYSTEM.md](./EVENT_HANDLING_SYSTEM.md)

### 🔄 Data Management

| Hook               | Descriere                                           | Fișier                                         |
| ------------------ | --------------------------------------------------- | ---------------------------------------------- |
| `useUnifiedExport` | Modern unified implementation pentru export de date | [useUnifiedExport.tsx](./useUnifiedExport.tsx) |

---

## 🚀 Quick Start

### Importare:

```typescript
// ✅ Import direct din index principal
import { useKeyboardHandler, useFocusManager } from "@/hooks";

// ✅ Sau import specific din shared
import { useKeyboardHandler } from "@/hooks/shared/useKeyboardHandler";
```

### Usage Pattern:

```typescript
export const MyComponent: React.FC = () => {
  // Event handling centralizat
  const keyboard = useKeyboardHandler({
    onEnter: handleSubmit,
    onEscape: handleCancel,
    onF2: startEdit,
  }, {
    respectEditing: true,
    debug: process.env.NODE_ENV === 'development'
  });

  // Focus management cu debugging
  const focus = useFocusManager({
    debug: true,
    context: 'MyComponent',
    autoRestore: true
  });

  return (
    <div onKeyDown={keyboard.handleKeyDown}>
      {/* Component content */}
    </div>
  );
};
```

---

## 🧪 Testing

### Rularea Testelor pentru Shared Hooks:

```bash
# Toate testele din shared/
pnpm test src/hooks/shared/

# Test specific
pnpm test useKeyboardHandler.test.tsx

# Cu coverage
pnpm test src/hooks/shared/ --coverage
```

### Results Summary:

```
✅ useKeyboardHandler.test.tsx: 9/9 tests passed
✅ Zero breaking changes în implementare
✅ Backward compatibility cu hook-urile existente
```

---

## 📊 Code Quality

### Principii Respectate:

- **🔍 RESEARCH FIRST:** Toate hook-urile consolidează pattern-uri existente
- **🎯 PRAGMATIC OVER PERFECT:** Soluții simple, robuste, ușor de întreținut
- **🔒 SAFE & INCREMENTAL:** Zero breaking changes, backward compatibility
- **📝 TYPE SAFETY:** TypeScript complet pentru toate hook-urile
- **🧪 TEST COVERAGE:** Unit tests pentru toate funcționalitățile

### Benefits:

- ✅ **Eliminarea duplicării** de cod din întreaga aplicație
- ✅ **Standardizarea** comportamentului între componente
- ✅ **Debug capabilities** centralizate pentru development
- ✅ **Maintainability** îmbunătățită prin centralizare
- ✅ **Type safety** completă cu TypeScript

---

## 🔮 Roadmap

### Next Implementations:

1. **State Management Helpers** (Task 8) - Debug tools pentru Zustand stores
2. **Performance Hooks** - Monitoring și optimization helpers
3. **API Hooks** - Centralizarea pattern-urilor de API calls
4. **UI Interaction Hooks** - Common UI patterns consolidate

### Integration Opportunities:

- **LunarGrid Integration:** Înlocuirea pattern-urilor existente cu hook-urile centralizate
- **Modal System:** Focus trap automation cu useFocusManager
- **Command Palette:** Keyboard shortcuts registration automation

---

## 📚 Documentation

| File                                                               | Purpose                                      |
| ------------------------------------------------------------------ | -------------------------------------------- |
| [EVENT_HANDLING_SYSTEM.md](./EVENT_HANDLING_SYSTEM.md)             | Documentație completă Task 11 implementation |
| [useKeyboardHandler.example.tsx](./useKeyboardHandler.example.tsx) | Exemple practice de utilizare                |
| [useKeyboardHandler.test.tsx](./useKeyboardHandler.test.tsx)       | Unit tests și pattern validation             |

---

**📈 Stats:**

- **Total Hooks:** 3 active, 1 legacy compatibility
- **Test Coverage:** 9/9 tests passed pentru event handling
- **Zero Breaking Changes:** Toate implementările sunt backward compatible
- **Performance Impact:** Zero - hook-urile optimizează performance-ul existent

**🎯 Mission:** Eliminarea duplicării de cod prin consolidarea pattern-urilor comune într-un set de hook-uri reutilizabile, robuste și ușor de întreținut.

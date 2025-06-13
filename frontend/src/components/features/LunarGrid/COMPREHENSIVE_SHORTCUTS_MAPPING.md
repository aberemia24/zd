# 🎹 COMPREHENSIVE KEYBOARD SHORTCUTS MAPPING - SUBTASK 6.2

**Task:** 6.2 - Map and Document Essential Keyboard Shortcuts
**Status:** In Progress
**Date:** 13 Iunie 2025
**Context:** Global vs Component shortcuts separation analysis

---

## 📋 EXECUTIVE SUMMARY

Documentație comprehensivă a arhitecturii shortcuts-urilor în Budget App, evidențiind separarea clară între shortcuts globale (application-level) și component-specific (editing-level) pentru evitarea conflictelor și menținerea simplității.

### 🎯 KEY ARCHITECTURE INSIGHTS

1. **Separation of Concerns ✅**: Global shortcuts (Alt/Ctrl modifiers) vs Component shortcuts (unmodified keys)
2. **Shared Constants Integration ✅**: NAVIGATION.SHORTCUTS completely integrated
3. **Conflict Prevention ✅**: shouldIgnoreShortcut validation + context isolation
4. **Interface Consistency ✅**: All shortcuts follow established patterns

---

## 🌍 GLOBAL SHORTCUTS ARCHITECTURE

### **Source:** `useGlobalKeyboardShortcuts.tsx` (352 linii)

### **Integration:** Complete cu `@budget-app/shared-constants`

#### **📍 Navigation Shortcuts (Alt modifiers)**

```typescript
// ALT + Key pentru application-level navigation
Alt+H → Home ('/') - NAVIGATION.SHORTCUTS.HOME
Alt+T → Transactions ('/transactions')
Alt+L → LunarGrid ('/lunar-grid')
Alt+O → Options ('/options')
```

#### **🎛️ UI Control Shortcuts (Ctrl modifiers)**

```typescript
// CTRL + Key pentru interface control
Ctrl+\ → Toggle Sidebar - NAVIGATION.SHORTCUTS.TOGGLE_SIDEBAR
Ctrl+K → Global Search/Command Palette - NAVIGATION.SHORTCUTS.COMMAND_PALETTE
Ctrl+D → Toggle Dark Mode - NAVIGATION.SHORTCUTS.TOGGLE_DARK_MODE
```

#### **📝 Modal/Accessibility Shortcuts**

```typescript
// Function keys și special combinations
Shift+F10 → Context Menu - NAVIGATION.SHORTCUTS.CONTEXT_MENU
F1 → Help (shows all shortcuts)
Escape → Close modals/cancel actions (handled by components)
```

#### **🚫 Tab Shortcuts (Declared but not implemented)**

```typescript
// Defined în GLOBAL_SHORTCUTS dar nu implementate
Ctrl+T → New Tab (placeholder)
Ctrl+W → Close Tab (placeholder)
Ctrl+Tab → Next Tab (placeholder)
Ctrl+Shift+Tab → Previous Tab (placeholder)
```

---

## 🔧 COMPONENT-SPECIFIC SHORTCUTS

### **Excel-like Grid Navigation** (`useGridNavigation.tsx`)

#### **Arrow Key Navigation**

```typescript
// UNMODIFIED arrow keys pentru cell navigation
ArrowUp → Move focus up (boundary checking)
ArrowDown → Move focus down (boundary checking)
ArrowLeft → Move focus left (boundary checking)
ArrowRight → Move focus right (boundary checking)
```

#### **Editing Activation**

```typescript
// Excel-standard editing shortcuts
Enter → Start edit mode (onCellEdit trigger)
F2 → Start edit mode (Excel compatibility)
```

#### **Click Navigation**

```typescript
// Mouse interaction
Cell Click → Focus cell (handleCellClick)
```

### **Inline Cell Editing** (`EditableCell` component)

#### **Edit Mode Shortcuts** (din EDITABLE_CELL_ANALYSIS.md)

```typescript
// IN EDIT MODE - 25+ props pentru control
F2/Enter → Start editing
Delete → Quick delete (clear cell value)
Escape → Cancel editing
Tab → Navigate to next cell (Excel behavior)
[a-z0-9] → Start editing + replace value
```

#### **Form Validation Shortcuts**

```typescript
// Integration cu useInlineCellEdit
Enter → Save changes (cu validation)
Escape → Cancel changes (restore original)
Blur → Auto-save cu change detection
```

---

## 🔒 CONFLICT PREVENTION MECHANISMS

### **1. Modifier Key Strategy**

```typescript
// GLOBAL SHORTCUTS: Folosesc modifiers
Alt+H, Alt+T, Alt+L, Alt+O (Navigation)
Ctrl+\, Ctrl+K, Ctrl+D (UI Control)

// COMPONENT SHORTCUTS: Fără modifiers
ArrowUp/Down/Left/Right (Grid Navigation)
Enter, F2, Escape, Delete (Cell Editing)
```

### **2. Context Validation** (`shouldIgnoreShortcut`)

```typescript
const shouldIgnoreShortcut = (target: EventTarget | null): boolean => {
  if (!target || !(target instanceof Element)) return false;

  const tagName = target.tagName.toLowerCase();
  const isEditable = target.getAttribute("contenteditable") === "true";
  const isInput = ["input", "textarea", "select"].includes(tagName);

  return isInput || isEditable; // Ignore when editing
};
```

### **3. Event Propagation Management**

```typescript
// GLOBAL LEVEL: preventDefault pentru capture
if (e.ctrlKey && e.key === "k") {
  e.preventDefault(); // Previne browser search
  onGlobalSearch?.();
}

// COMPONENT LEVEL: stopPropagation pentru containment
handleKeyDown: (e) => {
  e.stopPropagation(); // Prevent parent handling
  // Handle component-specific logic
};
```

### **4. Scope Isolation Pattern**

```
Document Level (Global Shortcuts)
  ↓ shouldIgnoreShortcut validation
Grid Container Level (Navigation)
  ↓ Boundary checking & callbacks
Cell Level (Editing)
  ↓ preventDefault & validation
Input Level (Form fields)
```

---

## 📚 SHARED-CONSTANTS INTEGRATION STATUS

### **✅ FULLY INTEGRATED (NAVIGATION.SHORTCUTS)**

```typescript
// Complete integration în useGlobalKeyboardShortcuts.tsx
import { NAVIGATION } from '@budget-app/shared-constants';

SHORTCUTS: {
  TOGGLE_SIDEBAR: 'Ctrl+\\',     // ✅ Used
  COMMAND_PALETTE: 'Ctrl+K',     // ✅ Used
  TOGGLE_DARK_MODE: 'Ctrl+D',    // ✅ Used
  CONTEXT_MENU: 'Shift+F10',     // ✅ Used
  HOME: 'Alt+H',                 // ✅ Used
  // Tab shortcuts defined but not implemented
  NEW_TAB: 'Ctrl+T',            // ⚠️ Placeholder
  CLOSE_TAB: 'Ctrl+W',          // ⚠️ Placeholder
  NEXT_TAB: 'Ctrl+Tab',         // ⚠️ Placeholder
  PREV_TAB: 'Ctrl+Shift+Tab'    // ⚠️ Placeholder
}
```

### **✅ COMPONENT SHORTCUTS (Isolated)**

```typescript
// EditableCell și useGridNavigation
// Deliberately NOT în shared-constants
// Motivație: Component-specific behavior, not app-level constants
```

---

## 🧪 VALIDATION & TESTING PATTERNS

### **Development Logging**

```typescript
// useGlobalKeyboardShortcuts.tsx
if (process.env.NODE_ENV === "development" && handled) {
  console.debug("Global shortcut handled:", {
    key: e.key,
    ctrlKey: e.ctrlKey,
    altKey: e.altKey,
    shiftKey: e.shiftKey,
    location: location.pathname,
  });
}
```

### **Hook Return Interface**

```typescript
// Testing utilities available
const {
  enabled, // Current state
  shortcuts, // Available shortcuts array
  isShortcutActive, // Check if shortcut enabled
  getAvailableShortcuts, // Get filtered list
  GLOBAL_SHORTCUTS, // Constants reference
} = useGlobalKeyboardShortcuts(config);
```

---

## ⚡ PERFORMANCE & EDGE CASES

### **Event Listener Optimization**

```typescript
// Single document event listener cu useCallback
document.addEventListener("keydown", handleKeyDown);

// Cleanup în useEffect dependency array
return () => document.removeEventListener("keydown", handleKeyDown);
```

### **Memory Management**

```typescript
// activeElementRef pentru focus restoration
const activeElementRef = useRef<Element | null>(null);

// Cleanup automată la component unmount
```

### **Edge Cases Handled**

1. **Multiple rapid shortcuts** - event debouncing implicit
2. **Focus restoration** - activeElementRef tracking
3. **Route changes** - dependency pe location.pathname
4. **Component unmounting** - cleanup în useEffect

---

## 🎯 IDENTIFIED GAPS & RECOMMENDATIONS

### **✅ Currently Working Well**

- Global navigation shortcuts (Alt+H/T/L/O)
- UI control shortcuts (Ctrl+\/K/D)
- Context validation (shouldIgnoreShortcut)
- Component-specific editing (F2/Enter/Escape)

### **⚠️ Placeholders for Future Implementation**

- Tab management system (Ctrl+T/W/Tab)
- Advanced context menu features
- Help modal cu complete shortcuts list

### **🔧 Potential Optimizations**

- Lazy loading pentru complex shortcuts
- User-customizable shortcut mapping
- Conflict detection utilities pentru development

---

## 📖 INTEGRATION EXAMPLES

### **Usage în Component**

```typescript
// App.tsx level
const { shortcuts, isShortcutActive } = useGlobalKeyboardShortcuts({
  enabled: true,
  enableNavigation: true,
  enableSidebar: true,
  onToggleSidebar: handleSidebarToggle,
  onGlobalSearch: openCommandPalette,
  onToggleDarkMode: toggleTheme,
});
```

### **Component-Specific Usage**

```typescript
// LunarGrid level
const navigation = useGridNavigation({
  totalRows,
  totalCols,
  onCellFocus: handleCellFocus,
  onCellEdit: handleCellEdit,
  isEnabled: !isGlobalSearchOpen, // Disable când global UI e activ
});
```

---

**Status**: ✅ COMPREHENSIVE MAPPING COMPLETED
**Integration**: 100% cu shared-constants pentru global shortcuts
**Conflict Prevention**: Architecture robustă implemented
**Next**: Continue cu Subtask 6.3 - Focus Management Optimization

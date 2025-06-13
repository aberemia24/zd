# 🎯 FOCUS MANAGEMENT PATTERNS - SUBTASK 6.3

**Task:** 6.3 - Document Critical Focus Management Patterns
**Status:** In Progress
**Date:** 13 Iunie 2025
**Context:** Modal, component și global focus management analysis

---

## 📋 EXECUTIVE SUMMARY

Documentație comprehensivă a pattern-urilor de focus management din Budget App, evidențiind strategiile de focus restoration, trap patterns, și best practices pentru accessibility și UX consistency.

### 🎯 KEY ARCHITECTURAL INSIGHTS

1. **Focus Restoration Pattern ✅**: previousActiveElement ref pattern consistent
2. **Focus Trap Implementation ✅**: useFocusTrap hook cu Tab cycling
3. **Outside Click Detection ✅**: useOutsideClick pattern standardizat
4. **Scroll Lock Integration ✅**: Focus + scroll management synchronized
5. **Keyboard Navigation ✅**: Context-aware focus management

---

## 🏗️ FOCUS MANAGEMENT ARCHITECTURE

### **HIERARCHY LEVELS:**

```
Global Level (Document shortcuts)
  ↓ Context validation
Modal Level (Portal + focus trap)
  ↓ Focus restoration
Component Level (Dropdown/ContextMenu)
  ↓ Outside click detection
Grid Level (Cell navigation)
  ↓ Keyboard navigation
Input Level (Form focus)
```

---

## 🪟 MODAL FOCUS MANAGEMENT

### **Pattern 1: Professional Focus Restoration**

**Sources:** `ConfirmationModal.tsx`, `SimpleModal.tsx`

#### **Implementation:**

```typescript
const previousActiveElement = useRef<HTMLElement | null>(null);

useEffect(() => {
  if (!isOpen) return;

  // SAVE focus pentru restoration
  previousActiveElement.current = document.activeElement as HTMLElement;

  // Cleanup function - restore focus when modal closes
  return () => {
    // RESTORE focus cu null safety
    if (previousActiveElement.current?.focus) {
      previousActiveElement.current.focus();
    }
  };
}, [isOpen]);
```

#### **Key Features:**

- ✅ **Safety checks**: `previousActiveElement.current?.focus`
- ✅ **Timing**: Save pe modal open, restore pe modal close
- ✅ **Type safety**: `as HTMLElement` cast with null checks
- ✅ **Memory management**: Ref cleanup automată

#### **Edge Cases Handled:**

- Element removed din DOM în timp ce modal e deschis
- Multiple modal stacking (focus restoration chain)
- Page navigation cu modal deschis

---

## 🔄 FOCUS TRAP PATTERNS

### **Pattern 2: Tab Cycling Focus Trap**

**Source:** `useModal.tsx` - `useFocusTrap`

#### **Implementation:**

```typescript
export function useFocusTrap(isOpen: boolean, containerRef: React.RefObject<HTMLElement | null>) {
  useEffect(() => {
    if (!isOpen || !containerRef.current) return;

    const container = containerRef.current;

    // QUERY focusable elements
    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
    );

    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

    // AUTO-FOCUS primul element la deschidere
    if (firstElement) {
      firstElement.focus();
    }

    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;

      if (e.shiftKey) {
        // Shift + Tab - wrap la sfârșit
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement?.focus();
        }
      } else {
        // Tab - wrap la început
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement?.focus();
        }
      }
    };

    document.addEventListener("keydown", handleTabKey);
    return () => document.removeEventListener("keydown", handleTabKey);
  }, [isOpen, containerRef]);
}
```

#### **Key Features:**

- ✅ **Comprehensive focusable selector**: button, href, input, select, textarea, tabindex
- ✅ **Tab cycling**: First ↔ Last element wrapping
- ✅ **Auto-focus**: Prima deschidere focus pe primul element
- ✅ **Direction aware**: Shift+Tab vs Tab handling
- ✅ **Prevention**: preventDefault pentru wrapping behavior

#### **Focusable Elements Query:**

```typescript
// STANDARD focusable elements selector
'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

// EXCLUDES: [tabindex="-1"] (explicitly non-focusable)
// INCLUDES: All interactive elements + custom tabindex
```

---

## 👆 OUTSIDE CLICK DETECTION

### **Pattern 3: useOutsideClick Hook**

**Source:** `Dropdown.tsx`

#### **Implementation:**

```typescript
const useOutsideClick = (ref: React.RefObject<HTMLElement | null>, callback: () => void, isActive: boolean) => {
  useEffect(() => {
    if (!isActive) return;

    const handleClickOutside = (event: Event) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        callback();
      }
    };

    const handleTouchStart = (event: TouchEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        callback();
      }
    };

    // DUAL event listeners pentru mouse și touch
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleTouchStart);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleTouchStart);
    };
  }, [ref, callback, isActive]);
};
```

#### **Key Features:**

- ✅ **Multi-input support**: Mouse (mousedown) + Touch (touchstart)
- ✅ **Conditional activation**: isActive parameter pentru control
- ✅ **Containment check**: `ref.current.contains(event.target)`
- ✅ **Type safety**: `event.target as Node` casting
- ✅ **Memory cleanup**: Proper event listener removal

#### **Event Choice Rationale:**

- **`mousedown`** instead of `click`: Prevents interference cu element onClick
- **`touchstart`** instead of `touchend`: Consistent timing cu mousedown
- **Both events**: Full cross-platform compatibility

---

## 🗂️ COMPONENT-SPECIFIC FOCUS PATTERNS

### **Pattern 4: Dropdown Focus Management**

**Source:** `Dropdown.tsx`

#### **Keyboard Navigation Implementation:**

```typescript
// KEYBOARD navigation pentru dropdown menu
useEffect(() => {
  if (!isOpen) return;

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Escape") {
      e.preventDefault();
      handleClose();
      triggerRef.current?.focus(); // RESTORE focus la trigger
    } else if (e.key === "Tab") {
      // Allow tab to move focus away and close dropdown
      handleClose();
    }
  };

  document.addEventListener("keydown", handleKeyDown);
  return () => document.removeEventListener("keydown", handleKeyDown);
}, [isOpen, handleClose]);

// FOCUS management la deschidere
useEffect(() => {
  if (isOpen && menuRef.current) {
    const firstItem = menuRef.current.querySelector('[role="menuitem"]:not([disabled])') as HTMLElement;
    firstItem?.focus();
  }
}, [isOpen]);
```

#### **Focus Behavior:**

- **Open**: Focus primul menu item activ (skip disabled)
- **Escape**: Focus înapoi la trigger button
- **Tab**: Allow navigation away + close dropdown
- **Selection**: Focus înapoi la trigger după selecție

### **Pattern 5: ContextMenu Focus Management**

**Source:** `ContextMenu.tsx`

#### **Implementation:**

```typescript
const [focusedIndex, setFocusedIndex] = useState(0);
const navigableOptions = options.filter((option) => !option.separator && !option.disabled);

// KEYBOARD navigation cu focused index tracking
useEffect(() => {
  if (!state.isVisible) return;

  const handleKeyDown = (event: KeyboardEvent) => {
    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        setFocusedIndex((prev) => (prev < navigableOptions.length - 1 ? prev + 1 : 0));
        break;
      case "ArrowUp":
        event.preventDefault();
        setFocusedIndex((prev) => (prev > 0 ? prev - 1 : navigableOptions.length - 1));
        break;
      case "Home":
        event.preventDefault();
        setFocusedIndex(0);
        break;
      case "End":
        event.preventDefault();
        setFocusedIndex(navigableOptions.length - 1);
        break;
    }
  };
}, [state.isVisible, focusedIndex, navigableOptions]);

// FOCUS management la deschidere
useEffect(() => {
  if (state.isVisible && menuRef.current) {
    setFocusedIndex(0);
    menuRef.current.focus(); // Focus container pentru keyboard nav
  }
}, [state.isVisible]);
```

#### **Advanced Features:**

- ✅ **Index-based navigation**: focusedIndex state management
- ✅ **Filtering**: Skip separators și disabled items
- ✅ **Boundary wrapping**: ArrowDown/Up cycling
- ✅ **Home/End support**: Jump la first/last option
- ✅ **Container focus**: Focus container pentru keyboard capture

---

## 🎮 GRID FOCUS MANAGEMENT

### **Pattern 6: Cell Navigation Focus**

**Sources:** `useGridNavigation.tsx`, `useKeyboardNavigationSimplified.tsx`

#### **Simplified Grid Focus (Current Implementation):**

```typescript
const [focusedCell, setFocusedCell] = useState<GridPosition>({ row: 0, col: 0 });

const focusCell = useCallback(
  (row: number, col: number) => {
    if (!isEnabled) return;
    const position = { row, col };
    setFocusedCell(position);
    setCurrentCell(position);
    onCellFocus(row, col); // Callback pentru UI update
  },
  [onCellFocus, isEnabled],
);

const handleKeyDown = useCallback(
  (e: KeyboardEvent) => {
    if (!isEnabled) return;

    switch (e.key) {
      case "ArrowUp":
        e.preventDefault();
        moveFocus("up");
        break;
      case "ArrowDown":
        e.preventDefault();
        moveFocus("down");
        break;
      case "ArrowLeft":
        e.preventDefault();
        moveFocus("left");
        break;
      case "ArrowRight":
        e.preventDefault();
        moveFocus("right");
        break;
      case "Enter":
      case "F2":
        e.preventDefault();
        startEdit();
        break;
    }
  },
  [moveFocus, startEdit, isEnabled],
);
```

#### **Focus Features:**

- ✅ **State-based focus**: GridPosition tracking
- ✅ **Boundary checking**: Math.min/max constraints
- ✅ **Callback integration**: onCellFocus pentru UI sync
- ✅ **Edit integration**: Enter/F2 transition la edit mode
- ✅ **Enable/disable**: isEnabled flag pentru activation control

#### **Keyboard Navigation V3 (Enhanced):**

```typescript
const [focusedPosition, setFocusedPosition] = useState<CellPosition | null>(null);
const focusedPositionRef = React.useRef(focusedPosition); // Ref pentru current focus

// UPDATE ref whenever focusedPosition changes
useEffect(() => {
  focusedPositionRef.current = focusedPosition;
}, [focusedPosition]);

const handleKeyDown = useCallback(
  (e: KeyboardEvent) => {
    if (!isActive || !focusedPositionRef.current) return;

    // USE ref pentru latest position în event handler
    const currentPos = focusedPositionRef.current;
  },
  [isActive, getNextPosition, onFocusChange],
);
```

#### **Advanced Grid Patterns:**

- ✅ **Ref synchronization**: focusedPositionRef pentru current access
- ✅ **Null safety**: `!focusedPositionRef.current` checks
- ✅ **Position calculation**: getNextPosition cu boundary logic
- ✅ **Deletion support**: Delete/Backspace handling
- ✅ **Escape behavior**: Clear focus cu Escape

---

## 🔧 SCROLL LOCK + FOCUS INTEGRATION

### **Pattern 7: Coordinated Scroll + Focus Management**

**Source:** `ConfirmationModal.tsx`, `LunarGridEventHandler.tsx`

#### **Professional Scroll Lock cu Focus:**

```typescript
useEffect(() => {
  if (!isOpen) return;

  // SAVE focus pentru restoration
  previousActiveElement.current = document.activeElement as HTMLElement;

  // SAVE current scroll positions pentru restoration
  const currentPageScrollY = window.scrollY;
  const currentPageScrollX = window.scrollX;

  // GET scrollbar width pentru layout shift prevention
  const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;

  // SAVE original styles pentru restoration
  const originalOverflow = document.body.style.overflow;
  const originalPaddingRight = document.body.style.paddingRight;

  // APPLY scroll lock cu scrollbar compensation
  document.body.style.overflow = "hidden";
  document.body.style.paddingRight = `${scrollbarWidth}px`;

  return () => {
    // RESTORE original styles
    document.body.style.overflow = originalOverflow;
    document.body.style.paddingRight = originalPaddingRight;

    // RESTORE scroll position precisely
    window.scrollTo(currentPageScrollX, currentPageScrollY);

    // RESTORE focus
    if (previousActiveElement.current?.focus) {
      previousActiveElement.current.focus();
    }
  };
}, [isOpen]);
```

#### **Coordinated Features:**

- ✅ **Layout preservation**: scrollbarWidth calculation prevents shift
- ✅ **Position restoration**: Exact scroll position recovery
- ✅ **Style preservation**: Save/restore original overflow/padding
- ✅ **Focus integration**: Synchronized cu focus restoration
- ✅ **Timing coordination**: Single useEffect pentru atomicity

---

## ⚡ PERFORMANCE & EDGE CASES

### **Memory Management Patterns:**

#### **1. Event Listener Cleanup:**

```typescript
useEffect(() => {
  if (!isActive) return;

  document.addEventListener("keydown", handleKeyDown);
  return () => document.removeEventListener("keydown", handleKeyDown);
}, [isActive, handleKeyDown]);
```

#### **2. Ref Cleanup:**

```typescript
useEffect(() => {
  return () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  };
}, []);
```

#### **3. State Synchronization:**

```typescript
const focusedPositionRef = React.useRef(focusedPosition);
useEffect(() => {
  focusedPositionRef.current = focusedPosition;
}, [focusedPosition]);
```

### **Edge Cases Handled:**

#### **1. Element Removal:**

```typescript
// NULL safety pentru elements removed din DOM
if (previousActiveElement.current?.focus) {
  previousActiveElement.current.focus();
}
```

#### **2. Multiple Modals:**

```typescript
// STACKING modals cu focus restoration chain
// Fiecare modal salvează propriul previousActiveElement
```

#### **3. Rapid State Changes:**

```typescript
// CONDITIONAL activation pentru rapid open/close
if (!isActive || !isOpen) return;
```

#### **4. Cross-Platform Events:**

```typescript
// DUAL event handling pentru desktop + mobile
document.addEventListener("mousedown", handleClickOutside);
document.addEventListener("touchstart", handleTouchStart);
```

---

## 🎯 BEST PRACTICES SUMMARY

### **✅ ESTABLISHED PATTERNS:**

#### **Focus Restoration:**

- Always save `document.activeElement` la modal open
- Use `previousActiveElement.current?.focus` cu null safety
- Timing: Save în useEffect start, restore în cleanup

#### **Focus Traps:**

- Query standard focusable elements selector
- Tab cycling cu preventDefault la boundaries
- Auto-focus primul element la open

#### **Outside Click:**

- Use `mousedown` + `touchstart` pentru cross-platform
- `ref.current.contains(event.target)` pentru containment
- Conditional activation cu isActive parameter

#### **Grid Navigation:**

- State-based focus cu GridPosition tracking
- Ref synchronization pentru event handlers
- Boundary checking cu Math.min/max

#### **Scroll Lock Integration:**

- Calculate scrollbar width pentru layout preservation
- Save original styles pentru restoration
- Coordinate cu focus management în same useEffect

### **⚠️ ANTI-PATTERNS TO AVOID:**

#### **DON'T:**

- `click` events pentru outside detection (conflicts cu onClick)
- Hard-coded focusable selectors (use standard query)
- Focus manipulation fără null safety
- Scroll lock fără scrollbar compensation
- Event listeners fără proper cleanup
- State mutations în event handlers fără refs

### **🔧 OPTIMIZATION OPPORTUNITIES:**

#### **Current Gaps:**

- Focus visible indicators pentru keyboard navigation
- Focus management în complex nested components
- Testing utilities pentru focus behavior validation
- Accessibility audit pentru screen reader compatibility

#### **Potential Improvements:**

- Custom focus visible styles
- Focus management debugging tools
- Automated focus flow testing
- Performance monitoring pentru focus operations

---

**Status**: ✅ COMPREHENSIVE FOCUS PATTERNS DOCUMENTED
**Coverage**: Modal, Component, Grid, Global focus management
**Integration**: Complete cu scroll lock și keyboard navigation
**Next**: Continue cu Subtask 6.4 - Event Propagation Audit

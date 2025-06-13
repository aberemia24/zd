# 🖱️ MOUSE EVENT HANDLING PATTERNS - SUBTASK 6.4

**Task:** 6.4 - Map Primary Mouse Event Handlers
**Status:** In Progress
**Date:** 13 Iunie 2025
**Context:** Mouse interaction patterns și event propagation analysis

---

## 📋 EXECUTIVE SUMMARY

Documentație comprehensivă a pattern-urilor de mouse event handling din Budget App, evidențiând strategiile de click handling, event propagation control, și integration cu touch events pentru cross-platform compatibility.

### 🎯 KEY ARCHITECTURAL INSIGHTS

1. **Event Propagation Control ✅**: Strategii `stopPropagation` și `preventDefault` bien definite
2. **Multi-Input Support ✅**: Mouse + Touch events handled în paralel
3. **Excel-like Interactions ✅**: Double-click edit, single-click select patterns
4. **Context Menu Integration ✅**: Right-click cu `onContextMenu` proper handling
5. **Accessibility Integration ✅**: Mouse events coordinated cu keyboard navigation

---

## 🏗️ MOUSE EVENT ARCHITECTURE

### **HIERARCHY LEVELS:**

```
Document Level (Global mouse capture)
  ↓ Outside click detection
Modal Level (Portal mouse handling)
  ↓ Backdrop click close
Component Level (Interactive elements)
  ↓ Click, double-click, context menu
Cell Level (Grid interaction)
  ↓ Selection, editing, actions
Input Level (Form interaction)
```

---

## 🎯 SINGLE CLICK PATTERNS

### **Pattern 1: Cell Selection Click**

**Source:** `EditableCell.tsx` - `onClick` handler

#### **Implementation:**

```typescript
onClick={(e) => {
  if (e.target !== e.currentTarget) {
    e.stopPropagation();
    return;
  }
  onClick?.(e);
}}
```

#### **Key Features:**

- ✅ **Target validation**: `e.target !== e.currentTarget` check pentru nested clicks
- ✅ **Propagation control**: `stopPropagation` când click e pe child elements
- ✅ **Callback integration**: Optional `onClick` prop forwarding
- ✅ **Event isolation**: Prevent unintended parent triggers

#### **Usage Context:**

- Grid cell selection
- Focus management coordination
- Modal state management integration
- Navigation between cells

---

## 🖱️ DOUBLE CLICK PATTERNS

### **Pattern 2: Excel-like Edit Activation**

**Sources:** `EditableCell.tsx`, `useCellEditing.tsx`

#### **Implementation:**

```typescript
const handleDoubleClickWrapper = useCallback(
  (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    setInteractionState("pressed");
    setTimeout(() => setInteractionState("hover"), 100);

    if (!isReadonly && !internalEditing) {
      if (onStartEdit) {
        onStartEdit();
      } else {
        handleDoubleClick();
      }
    }
  },
  [isReadonly, internalEditing, onStartEdit, handleDoubleClick],
);
```

#### **Advanced Features:**

- ✅ **Visual feedback**: `setInteractionState('pressed')` cu timeout recovery
- ✅ **State validation**: `!isReadonly && !internalEditing` checks
- ✅ **Callback priority**: `onStartEdit` prop over internal `handleDoubleClick`
- ✅ **Event isolation**: `preventDefault` și `stopPropagation` pentru clean behavior
- ✅ **Timing coordination**: 100ms pressed state pentru visual feedback

#### **Excel-like Behavior:**

- Double-click → immediate edit mode
- Visual feedback during interaction
- State validation pentru readonly/editing conflicts
- Clean event handling fără side effects

---

## 👇 MOUSE DOWN/UP PATTERNS

### **Pattern 3: Interaction State Tracking**

**Source:** `useCellState.tsx`

#### **Implementation:**

```typescript
const handleMouseDown = useCallback(() => {
  setInteractionState("pressed");
}, []);

const handleMouseUp = useCallback(() => {
  setInteractionState(isActuallyHovered ? "hover" : "idle");
}, [isActuallyHovered]);
```

#### **State Management Features:**

- ✅ **Press detection**: `mousedown` → `pressed` state immediate
- ✅ **Release coordination**: `mouseup` → context-aware state (`hover`/`idle`)
- ✅ **Hover awareness**: `isActuallyHovered` pentru correct state transition
- ✅ **Visual consistency**: Coordinated cu CSS state selectors

#### **Usage in Cell Props:**

```typescript
const getCellProps = useCallback(
  () => ({
    onMouseDown: stableCellState.handleMouseDown,
    onMouseUp: stableCellState.handleMouseUp,
    onDoubleClick: startEdit,
    // ... other props
  }),
  [stableCellState, startEdit],
);
```

---

## 📱 TOUCH EVENT INTEGRATION

### **Pattern 4: Cross-Platform Mouse + Touch**

**Sources:** `EditableCell.tsx`, `useCellState.tsx`

#### **Touch Events Implementation:**

```typescript
const handleTouchStart = useCallback(() => {
  // Long press detection pentru mobile hover equivalent
  const timer = setTimeout(() => {
    setInternalHovered(true);
    setInteractionState("hover");
  }, 600); // 600ms long press

  setLongPressTimer(timer);
}, []);

const handleTouchEnd = useCallback(() => {
  if (longPressTimer) {
    clearTimeout(longPressTimer);
    setLongPressTimer(null);
  }
}, [longPressTimer]);
```

#### **Mobile-Specific Features:**

- ✅ **Long press detection**: 600ms timeout pentru hover simulation
- ✅ **Timer management**: Proper cleanup în `touchend`
- ✅ **State coordination**: Touch → hover state pentru consistency
- ✅ **Memory management**: `clearTimeout` pentru memory leaks prevention

#### **Cross-Platform Coordination:**

```typescript
// În getCellProps return
onTouchStart: stableCellState.handleTouchStart,
onTouchEnd: stableCellState.handleTouchEnd,
onMouseEnter: stableCellState.handleMouseEnter,
onMouseLeave: stableCellState.handleMouseLeave,
```

---

## 🎛️ CONTEXT MENU PATTERNS

### **Pattern 5: Right-Click Context Menu**

**Source:** `ContextMenu.tsx` - `useContextMenu` hook

#### **Implementation:**

```typescript
const handleContextMenu = useCallback(
  (event: React.MouseEvent, targetRow?: any) => {
    event.preventDefault();
    show(event.clientX, event.clientY, targetRow);
  },
  [show],
);

const show = useCallback((x: number, y: number, targetRow?: any) => {
  setState({
    isVisible: true,
    x,
    y,
    targetRow,
  });
}, []);
```

#### **Context Menu Features:**

- ✅ **Position capture**: `event.clientX/clientY` pentru precise positioning
- ✅ **Default prevention**: `preventDefault` pentru browser context menu block
- ✅ **Target context**: `targetRow` parameter pentru action context
- ✅ **State management**: Clean `isVisible` state transitions

#### **Outside Click Integration:**

```typescript
useEffect(() => {
  const handleClickOutside = (event: MouseEvent) => {
    if (state.isVisible) {
      hide();
    }
  };

  if (state.isVisible) {
    document.addEventListener("mousedown", handleClickOutside);
  }

  return () => {
    document.removeEventListener("mousedown", handleClickOutside);
  };
}, [state.isVisible, hide]);
```

---

## 🔄 EVENT PROPAGATION CONTROL

### **Pattern 6: Strategic stopPropagation Usage**

**Sources:** Multiple components

#### **Selective Propagation Control:**

```typescript
// ✅ CORRECT: Stop propagation pentru nested element clicks
onClick={(e) => {
  if (e.target !== e.currentTarget) {
    e.stopPropagation();
    return;
  }
  onClick?.(e);
}}

// ✅ CORRECT: Stop propagation pentru action buttons
const handleEditButtonClick = useCallback((e: React.MouseEvent) => {
  e.stopPropagation();
  if (onStartEdit) {
    onStartEdit();
  } else {
    startEdit();
  }
}, [onStartEdit, startEdit]);
```

#### **Propagation Strategy:**

- **ALLOW propagation**: Cell selection și grid navigation
- **STOP propagation**: Action buttons și nested interactions
- **PREVENT default**: Context menu și special behaviors
- **COORDINATED handling**: State updates cu event isolation

### **Anti-Pattern Examples (Fixed):**

```typescript
// ❌ PROBLEMATIC: Blanket stopPropagation blocking grid selection
e.stopPropagation(); // Blocked parent cell selection

// ✅ SOLUTION: Conditional stopPropagation based on target
if (e.target !== e.currentTarget) {
  e.stopPropagation();
  return;
}
```

---

## 🎪 MODAL MOUSE HANDLING

### **Pattern 7: Backdrop Click Close**

**Sources:** `Modal.tsx`, `ConfirmationModal.tsx`

#### **Implementation:**

```typescript
const handleBackdropClick = (event: React.MouseEvent) => {
  if (closeOnBackdropClick && event.target === event.currentTarget) {
    onClose();
  }
};

// În JSX
<div
  className={modal({ variant: 'default' })}
  onClick={(e) => e.target === e.currentTarget && onClose()}
>
```

#### **Backdrop Features:**

- ✅ **Target validation**: `event.target === event.currentTarget` pentru backdrop only
- ✅ **Configuration**: `closeOnBackdropClick` prop pentru control
- ✅ **Clean closure**: Call `onClose` fără side effects
- ✅ **Portal coordination**: Works cu React Portal rendering

### **Enhanced Outside Click (Dropdown):**

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

    // DUAL event listeners pentru cross-platform
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleTouchStart);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleTouchStart);
    };
  }, [ref, callback, isActive]);
};
```

---

## 🎮 GRID-SPECIFIC MOUSE PATTERNS

### **Pattern 8: Grid Cell Mouse Coordination**

**Source:** `useGridNavigation.tsx`

#### **Cell Click Handler:**

```typescript
const handleCellClick = useCallback(
  (row: number, col: number) => {
    if (!isEnabled) return;
    focusCell(row, col);
  },
  [focusCell, isEnabled],
);
```

#### **Grid Integration:**

```typescript
// În return object
return {
  // ... other properties
  handleCellClick,
  // Mouse coordination cu keyboard navigation
};
```

#### **Features:**

- ✅ **Enable state**: `isEnabled` validation pentru conditional behavior
- ✅ **Focus coordination**: `focusCell` integration cu keyboard navigation
- ✅ **State synchronization**: Mouse clicks update keyboard focus state
- ✅ **Clean interface**: Simple callback signature pentru grid integration

---

## 🏁 ACTION BUTTON PATTERNS

### **Pattern 9: Hover Action Buttons**

**Source:** `EditableCell.tsx`

#### **Edit Button Implementation:**

```typescript
const handleEditButtonClick = useCallback(
  (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onStartEdit) {
      onStartEdit();
    } else {
      startEdit();
    }
  },
  [onStartEdit, startEdit],
);

const handleMoreButtonClick = useCallback(
  (e: React.MouseEvent) => {
    e.stopPropagation();
    console.log("🅿️ Opening Popover for Cell:", {
      cellId,
      existingTransaction,
    });
    setIsPopoverOpen(true);
    onTogglePopover();
  },
  [onTogglePopover, cellId, existingTransaction],
);
```

#### **Action Button Features:**

- ✅ **Event isolation**: `stopPropagation` pentru prevent cell selection
- ✅ **Callback priority**: External `onStartEdit` over internal `startEdit`
- ✅ **Context logging**: Debug information pentru development
- ✅ **State management**: Local state updates + callback coordination

#### **Hover Conditional Rendering:**

```typescript
{computedState.shouldShowActions && (
  <div className="absolute right-1 top-1 flex gap-1 opacity-90 transition-opacity">
    <button
      onClick={handleEditButtonClick}
      className="p-1 rounded hover:bg-blue-100 text-blue-600"
      title="Edit cell inline"
      aria-label="Edit cell inline"
    >
      <Edit2 size={14} />
    </button>
    <button
      onClick={handleMoreButtonClick}
      className="p-1 rounded hover:bg-gray-100 text-gray-600"
      title="Open advanced options modal"
      aria-label="Open advanced options modal"
    >
      <MoreVertical size={14} />
    </button>
  </div>
)}
```

---

## ⚡ PERFORMANCE PATTERNS

### **Event Handler Optimization:**

#### **1. useCallback Patterns:**

```typescript
// STANDARD pattern pentru event handlers
const handleClick = useCallback(
  (e: React.MouseEvent) => {
    // Event logic here
  },
  [dependencies],
);

// PROP GETTER pattern pentru complex coordination
const getCellProps = useCallback(
  () => ({
    onClick: handleClick,
    onDoubleClick: handleDoubleClick,
    onMouseDown: handleMouseDown,
    onMouseUp: handleMouseUp,
  }),
  [handleClick, handleDoubleClick, handleMouseDown, handleMouseUp],
);
```

#### **2. Event Delegation (Where Appropriate):**

```typescript
// Document-level outside click detection
useEffect(() => {
  if (!isActive) return;

  const handleClickOutside = (event: Event) => {
    // Centralized logic pentru multiple components
  };

  document.addEventListener("mousedown", handleClickOutside);
  return () => document.removeEventListener("mousedown", handleClickOutside);
}, [isActive]);
```

#### **3. State Coordination:**

```typescript
// MINIMAL re-renders through stable references
const stableCellState = useMemo(
  () => ({
    cellState: computedState.cellState,
    interactionState,
    handleMouseEnter,
    handleMouseLeave,
    // ... other stable references
  }),
  [computedState.cellState, interactionState /* dependencies */],
);
```

---

## 🎯 INTERACTION STATE MACHINE

### **State Transitions:**

```
idle → hover (mouseenter)
idle → pressed (mousedown)
pressed → hover (mouseup + still hovering)
pressed → idle (mouseup + not hovering)
hover → idle (mouseleave)
hover → pressed (mousedown)

// Touch coordination:
idle → hover (600ms touchstart hold)
hover → idle (touchend)
```

### **State-Driven Styling:**

```typescript
// CVA integration pentru state-based styling
const cellVariants = cva(/* base styles */, {
  variants: {
    interaction: {
      idle: "/* idle styles */",
      hover: "/* hover styles */",
      pressed: "/* pressed styles */",
      focus: "/* focus styles */"
    }
  }
});
```

---

## 🔧 EVENT HANDLER TESTING

### **Mouse Event Testing Patterns:**

```typescript
// User event testing pentru mouse interactions
test("activează editarea cu double-click", async () => {
  const user = userEvent.setup();

  render(<EditableCell {...props} />);

  const cell = screen.getByTestId("editable-cell-test");

  await user.dblClick(cell);

  expect(mockOnStartEdit).toHaveBeenCalled();
});

// Touch event testing pentru mobile
test("Mobile long-press hover actions (600ms)", async () => {
  const firstCell = page.locator('[data-testid*="editable-cell"]').first();

  await firstCell.dispatchEvent('touchstart');
  await page.waitForTimeout(600);

  const editButton = page.getByRole('button', { name: 'Edit cell inline' });
  await expect(editButton).toBeVisible({ timeout: 2000 });

  await firstCell.dispatchEvent('touchend');
});
```

---

## 🎯 BEST PRACTICES SUMMARY

### **✅ ESTABLISHED PATTERNS:**

#### **Click Handling:**

- Target validation cu `e.target === e.currentTarget` pentru backdrop clicks
- Selective `stopPropagation` based on interaction context
- `preventDefault` pentru context menu și special behaviors

#### **Touch Integration:**

- Dual event listeners: `mousedown` + `touchstart`
- Long-press simulation: 600ms timeout pentru mobile hover
- Proper cleanup cu `clearTimeout` în touch handlers

#### **State Management:**

- `useCallback` pentru all event handlers pentru stability
- `useMemo` pentru complex state calculations
- Ref-based state access pentru event handlers

#### **Accessibility:**

- `aria-label` attributes pentru action buttons
- Keyboard equivalent pentru all mouse interactions
- Focus coordination cu mouse state

### **⚠️ ANTI-PATTERNS TO AVOID:**

#### **DON'T:**

- Blanket `stopPropagation` that blocks intended parent handlers
- Ignore touch events în mobile-responsive components
- Mix mouse state cu keyboard state fără coordination
- Skip `preventDefault` pentru context menu prevention
- Use inline event handlers în components cu frequent re-renders

### **🔧 OPTIMIZATION OPPORTUNITIES:**

#### **Current Gaps:**

- Gesture recognition pentru complex touch interactions
- Mouse wheel handling pentru grid scrolling
- Drag and drop coordination cu existing mouse handlers

#### **Potential Improvements:**

- Unified gesture system pentru mouse + touch + keyboard
- Event delegation pentru performance în large grids
- Custom hook pentru reusable mouse interaction patterns
- Automated testing pentru cross-platform mouse behavior

---

**Status**: ✅ COMPREHENSIVE MOUSE PATTERNS DOCUMENTED
**Coverage**: Click, double-click, context menu, touch, propagation control
**Integration**: Complete cu focus management și keyboard navigation
**Next**: Continue cu Subtask 6.5 - Event Propagation Audit Final

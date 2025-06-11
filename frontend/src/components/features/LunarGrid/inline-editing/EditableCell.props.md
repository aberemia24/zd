# EditableCell.tsx - Complete Props Interface Documentation

**Data backup:** 7 Iunie 2025
**Original fișier:** EditableCell.tsx (957 linii)
**Backup fișier:** EditableCell.backup.tsx

## EXISTING PROPS (PRESERVE ALL 17 PROPS)

### Core Required Props
```typescript
cellId: string;                    // Unique identifier pentru cell
value: string | number;            // Current value (amount/percentage = number, text/date = string)
onSave: (value: string | number) => Promise<void>;  // Save handler
validationType: "amount" | "text" | "percentage" | "date";  // Validation type
```

### Optional State Props
```typescript
isEditing?: boolean;               // External editing state control
error?: string | null;             // External error state
isSaving?: boolean;                // External saving state indication
isSelected?: boolean;              // Cell selection state
isFocused?: boolean;               // Cell focus state
isReadonly?: boolean;              // Prevents editing
```

### UI/UX Props
```typescript
placeholder?: string;              // Placeholder text pentru editing
className?: string;                // Additional CSS classes
"data-testid"?: string;           // Testing identifier
```

### Event Handler Props
```typescript
onFocus?: () => void;             // Focus event handler
onKeyDown?: (e: React.KeyboardEvent) => void;  // Keyboard event handler
onStartEdit?: () => void;         // Edit start handler
onCancel?: () => void;            // Edit cancel handler
onSingleClick?: (e: React.MouseEvent) => void;  // LGI TASK 5: Single click modal handler
```

## NEW PROPS FOR HYBRID PATTERN (3 TOTAL)

### Hover State Management
```typescript
isHovered?: boolean;              // Hover state pentru showing actions
onHoverChange?: (hovered: boolean) => void;  // Hover state change handler
showHoverActions?: boolean;       // Flag pentru displaying [✏️] [⋯] buttons
```

## Props Categories Analysis

### 1. Control Props (Controlled vs Uncontrolled)
**Controlled Mode:** Când `isEditing` prop este provided
- `isEditing` - External control over edit state
- `error` - External error handling
- `isSaving` - External saving indication

**Uncontrolled Mode:** Când `isEditing` este undefined
- Uses internal state din `useInlineCellEdit`
- Self-managed editing lifecycle

### 2. Validation Props
- `validationType` - Determines formatting și validation rules
- `value` type varies based on validationType:
  - `amount`, `percentage` → `number`
  - `text`, `date` → `string`

### 3. Event Props
- **Required events:** `onSave` (core functionality)
- **Optional events:** Toate celelalte pentru custom handling
- **New event:** `onSingleClick` pentru modal integration

### 4. State Indication Props
- `isSelected`, `isFocused` - Visual feedback
- `isReadonly` - Functional restriction
- `isSaving` - Loading indication
- `error` - Error display

## Props Type Safety

### Current TypeScript Interface
```typescript
export interface EditableCellProps {
  // ... toate props-urile de mai sus
}
```

### Extended Interface for Hybrid Pattern
```typescript
export interface EditableCellProps {
  // ... existing props (preserve all)
  
  // NEW: Hybrid Pattern Props
  isHovered?: boolean;
  onHoverChange?: (hovered: boolean) => void;
  showHoverActions?: boolean;
}
```

## Props Validation (Development Mode)

### Current Validation
```typescript
if (process.env.NODE_ENV === "development") {
  if (!cellId || typeof cellId !== "string") {
    console.warn("[EditableCell] cellId este required și trebuie să fie string");
  }
  if (!onSave || typeof onSave !== "function") {
    console.warn("[EditableCell] onSave este required și trebuie să fie function");
  }
  if (!["amount", "text", "percentage", "date"].includes(validationType)) {
    console.warn("[EditableCell] validationType trebuie să fie unul din: amount, text, percentage, date");
  }
}
```

### Extended Validation for Hybrid Pattern
```typescript
// Additional validation pentru new props
if (onHoverChange && typeof onHoverChange !== "function") {
  console.warn("[EditableCell] onHoverChange trebuie să fie function");
}
if (isHovered !== undefined && typeof isHovered !== "boolean") {
  console.warn("[EditableCell] isHovered trebuie să fie boolean");
}
```

## Props Usage Patterns

### Basic Usage
```typescript
<EditableCell
  cellId="cell-1-1"
  value={123.45}
  onSave={handleSave}
  validationType="amount"
/>
```

### Controlled Usage
```typescript
<EditableCell
  cellId="cell-1-1"
  value={123.45}
  onSave={handleSave}
  validationType="amount"
  isEditing={isEditing}
  error={error}
  isSaving={isSaving}
/>
```

### Hybrid Pattern Usage (Future)
```typescript
<EditableCell
  cellId="cell-1-1"
  value={123.45}
  onSave={handleSave}
  validationType="amount"
  isHovered={isHovered}
  onHoverChange={setIsHovered}
  showHoverActions={true}
  onSingleClick={handleModalOpen}
/>
```

## Props Migration Safety

### Safe to Add
- ✅ New optional props cu default values
- ✅ Backwards compatible extensions
- ✅ Additional event handlers

### Dangerous Changes
- ❌ Removing existing props
- ❌ Changing required props to optional
- ❌ Changing prop types
- ❌ Changing default behavior

### Testing Requirements
- **Unit tests:** Verify all props work as expected
- **Integration tests:** Verify parent component compatibility
- **Backwards compatibility:** Verify old usage patterns still work

## Props Performance Considerations

### Optimized Props (useMemo)
- `value` → `displayValue` (formatted)
- `isEditing`, `isSaving`, etc. → `cellState`
- `className` + variants → `cellClasses`

### Event Handler Stability
- Use `useCallback` pentru event handlers când e necesar
- Parent components should memoize handlers pentru preventing re-renders

## Props Documentation Standards

1. **Required props:** Clear type și purpose
2. **Optional props:** Default behavior specified
3. **Event props:** Expected signature și when called
4. **State props:** Controlled vs uncontrolled usage
5. **New props:** Backwards compatibility assured 
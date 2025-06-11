# useCellEditing Hook - Task 2 Implementation

## 🎯 Overview

`useCellEditing` este hook-ul consolidat pentru cell editing în LunarGrid, implementat conform **Task 2** din refactoring-ul arhitectural. Combină funcționalitățile din `useInlineCellEdit` și `useCellState` într-o singură interfață simplificată și comprehensivă.

## ✨ Features

- **API Simplificat**: Interfață clară cu prop getters (`getCellProps`, `getInputProps`)
- **State Management Consolidat**: Gestionează atât editing state cât și visual state
- **Validare Centralizată**: Integrează sistemul de validare centralizat
- **Keyboard Navigation**: Support complet pentru shortcuts (Enter, F2, Escape, Tab)
- **Mobile Support**: Touch interactions și long-press detection
- **TypeScript Strict**: Tipizare completă pentru toate interfețele
- **Performance Optimized**: Memoized callbacks și referințe stabile

## 📋 Interface Definition

### Props Interface

```typescript
export interface UseCellEditingProps {
  /** Identificator unic pentru celulă */
  cellId: string;
  
  /** Valoarea inițială a celulei */
  initialValue: string | number;
  
  /** Callback pentru salvarea valorii (async pentru persistență) */
  onSave: (value: string | number) => Promise<void>;
  
  /** Tipul de validare pentru celulă */
  validationType: "amount" | "text" | "percentage" | "date";
  
  /** Dacă celula este readonly */
  isReadonly?: boolean;
  
  /** Dacă celula este selectată (din TanStack Table) */
  isSelected?: boolean;
  
  /** Dacă celula este focused (din keyboard navigation) */
  isFocused?: boolean;
  
  /** Configurări avansate pentru visual state */
  stateConfig?: {
    smartValidation?: boolean;
    contextualHints?: boolean;
  };
}
```

### Return Interface

```typescript
export interface UseCellEditingReturn {
  // ===== CORE STATE =====
  isEditing: boolean;
  value: string;
  displayValue: string;
  error: string | null;
  isSaving: boolean;
  
  // ===== VISUAL STATE =====
  cellState: CellState;
  interactionState: InteractionState;
  shouldShowActions: boolean;
  shouldShowHints: boolean;
  
  // ===== ACTIONS =====
  startEdit: () => void;
  setValue: (value: string) => void;
  saveEdit: () => Promise<void>;
  cancelEdit: () => void;
  
  // ===== PROP GETTERS =====
  getCellProps: () => CellDisplayProps;
  getInputProps: () => InputEditProps;
}
```

## 🔧 Usage Examples

### Basic Usage

```typescript
import { useCellEditing } from './useCellEditing';

const MyCellComponent = ({ cellData, onSave }) => {
  const cellEditing = useCellEditing({
    cellId: `cell-${cellData.id}`,
    initialValue: cellData.amount,
    onSave: async (value) => {
      await onSave(cellData.id, value);
    },
    validationType: "amount",
    isSelected: cellData.isSelected,
    isFocused: cellData.isFocused,
  });

  if (cellEditing.isEditing) {
    return (
      <input
        {...cellEditing.getInputProps()}
        className="cell-input"
      />
    );
  }

  return (
    <div
      {...cellEditing.getCellProps()}
      className={`cell-display ${cellEditing.cellState}`}
    >
      {cellEditing.displayValue}
      {cellEditing.shouldShowActions && (
        <div className="cell-actions">
          <button onClick={cellEditing.startEdit}>✏️</button>
        </div>
      )}
    </div>
  );
};
```

### Advanced Usage with Custom Validation

```typescript
const AdvancedCell = ({ cellData }) => {
  const cellEditing = useCellEditing({
    cellId: cellData.id,
    initialValue: cellData.value,
    onSave: async (value) => {
      // Custom persistence logic
      const result = await api.updateCell(cellData.id, value);
      if (!result.success) {
        throw new Error(result.error);
      }
    },
    validationType: "percentage",
    isReadonly: cellData.permissions?.readonly,
    stateConfig: {
      smartValidation: true,
      contextualHints: true,
    },
  });

  return (
    <div
      {...cellEditing.getCellProps()}
      className={getClassNames(cellEditing)}
    >
      {cellEditing.isEditing ? (
        <input {...cellEditing.getInputProps()} />
      ) : (
        <>
          <span>{cellEditing.displayValue}</span>
          {cellEditing.error && (
            <div className="error-tooltip">{cellEditing.error}</div>
          )}
          {cellEditing.shouldShowHints && (
            <div className="hints">Press F2 to edit</div>
          )}
        </>
      )}
    </div>
  );
};
```

### Integration with TanStack Table

```typescript
const GridCell = ({ cell, column, row, table }) => {
  const cellEditing = useCellEditing({
    cellId: `${row.id}-${column.id}`,
    initialValue: cell.getValue(),
    onSave: async (newValue) => {
      // TanStack Table meta function
      await table.options.meta?.updateCellData?.(
        row.index,
        column.id,
        newValue
      );
    },
    validationType: column.meta?.validationType ?? "text",
    isSelected: cell.getContext().column.getIsSorted(),
    isFocused: table.getState().focused?.cell === cell.id,
  });

  const cellProps = cellEditing.getCellProps();
  const inputProps = cellEditing.getInputProps();

  return (
    <td {...cellProps} className="table-cell">
      {cellEditing.isEditing ? (
        <input {...inputProps} className="table-input" />
      ) : (
        <span className="table-display">
          {cellEditing.displayValue}
        </span>
      )}
    </td>
  );
};
```

## 🎨 Prop Getters Pattern

Hook-ul implementează pattern-ul "prop getters" pentru a simplifica integrarea:

### getCellProps()

Returnează toate props-urile necesare pentru elementul de display:

```typescript
const cellProps = getCellProps();
// Returns:
{
  'data-cell-id': string;
  'data-cell-state': CellState;
  'data-interaction-state': InteractionState;
  'aria-selected': boolean;
  tabIndex: number;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  onFocus: () => void;
  onBlur: () => void;
  onMouseDown: () => void;
  onMouseUp: () => void;
  onDoubleClick: () => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
  onTouchStart: () => void;
  onTouchEnd: () => void;
}
```

### getInputProps()

Returnează toate props-urile necesare pentru input-ul de editare:

```typescript
const inputProps = getInputProps();
// Returns:
{
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur: () => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
  'aria-label': string;
  'aria-invalid': boolean;
  autoFocus: boolean;
  ref: React.RefObject<HTMLInputElement | null>;
}
```

## 🚀 State Management

### Core State

- **`isEditing`**: Indică dacă celula este în modul de editare
- **`value`**: Valoarea curentă (string pentru input display)
- **`displayValue`**: Valoarea formatată pentru afișare
- **`error`**: Mesajul de eroare de validare
- **`isSaving`**: Indică dacă se efectuează o operațiune de salvare

### Visual State (din useCellState)

- **`cellState`**: Starea vizuală calculată (`normal`, `selected`, `editing`, `error`, `warning`, `saving`, `readonly`)
- **`interactionState`**: Starea de interacțiune (`idle`, `hover`, `focus`, `pressed`)
- **`shouldShowActions`**: Indică dacă să afișeze butoanele de acțiune
- **`shouldShowHints`**: Indică dacă să afișeze hints-urile contextuale

## ⌨️ Keyboard Shortcuts

| Shortcut | Action | Context |
|----------|--------|---------|
| `Enter` | Start editing / Save changes | Display mode / Edit mode |
| `F2` | Start editing | Display mode |
| `Escape` | Cancel editing | Edit mode |
| `Tab` | Save and move to next | Edit mode |
| `Double Click` | Start editing | Display mode |

## 🔍 Validation System

Hook-ul integrează sistemul de validare centralizat:

```typescript
const validationTypes = {
  amount: "Validează sume monetare (numere cu decimale)",
  text: "Validează text (lungime, caractere permise)",
  percentage: "Validează procente (0-100%)",
  date: "Validează date (format ISO sau localizat)"
};
```

### Error Handling

- **Real-time validation**: Erori afișate imediat la salvare
- **Auto-clear**: Erori se șterg când utilizatorul începe să tapeze
- **Async error handling**: Gestionează erori de persistență (network, server)

## 📱 Mobile Support

- **Touch interactions**: Support pentru touch events
- **Long press**: Simulează hover pe mobile (600ms)
- **Auto-focus**: Input se focalizează automat la start editing

## 🔄 Migration from Legacy Hooks

### From useInlineCellEdit

```typescript
// BEFORE (useInlineCellEdit)
const {
  isEditing,
  value,
  error,
  isSaving,
  startEdit,
  setValue,
  saveEdit,
  cancelEdit,
  handleKeyDown,
  handleBlur,
  handleDoubleClick,
  inputRef,
} = useInlineCellEdit({
  cellId,
  initialValue,
  onSave,
  validationType,
  isReadonly,
});

// AFTER (useCellEditing)
const cellEditing = useCellEditing({
  cellId,
  initialValue,
  onSave,
  validationType,
  isReadonly,
  isSelected, // NEW
  isFocused,  // NEW
});

// Use prop getters instead of individual handlers
<div {...cellEditing.getCellProps()}>
  {cellEditing.isEditing ? (
    <input {...cellEditing.getInputProps()} />
  ) : (
    cellEditing.displayValue
  )}
</div>
```

### From useCellState

Visual state este acum integrat automat în `useCellEditing`:

```typescript
// BEFORE (separate useCellState)
const cellState = useCellState({
  isEditing,
  isSelected,
  isFocused,
  hasError: !!error,
});

// AFTER (integrated in useCellEditing)
const cellEditing = useCellEditing(props);
// cellEditing.cellState, cellEditing.shouldShowActions available automatically
```

## 🧪 Testing

Hook-ul include teste comprehensive pentru:

- Core API și interfețe
- Prop getters functionality
- Visual state integration
- Editing workflows (start → edit → save/cancel)
- Keyboard interactions
- Validation și error handling
- Display value formatting
- Performance (<16ms initialization)

Rulează testele cu:

```bash
npm test useCellEditing.test.tsx
```

## 🔮 Future Enhancements

1. **Batch editing**: Support pentru editarea multiplă
2. **Custom formatters**: Formatters personalizați pentru display
3. **Undo/Redo**: History pentru modificări
4. **Auto-save**: Salvare automată periodică
5. **Collaborative editing**: Support pentru editare simultană

## 📊 Performance Metrics

- **Initialization**: <16ms (60 FPS requirement)
- **State updates**: <4ms per update
- **Memory usage**: Minimal due to memoized callbacks
- **Re-renders**: Optimized with useCallback dependencies 
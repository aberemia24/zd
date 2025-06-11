# Style Guide BudgetApp - Web-First Edition

## ⚠️ CRITICAL DEVELOPMENT PRINCIPLES

### SAFE INCREMENTAL IMPLEMENTATION (OBLIGATORIU)
```typescript
// ✅ CORECT: Planning concret înainte de implementare
// 1. Audit componentele existente
// 2. Lista exactă a constantelor necesare  
// 3. Verificare dependencies și import paths
// 4. Impact assessment pentru modificări safe

const NewComponent = ({ ...props }) => {
  // Implementare pas cu pas cu validare continuă
};

// ❌ GREȘIT: Planning în vid, invenții pe loc
const SomeComponent = ({ data }) => {
  // Unde vin constantele? Ce tipuri sunt necesare?
  // Ce dependencies avem? Sigur nu strică ceva?
};
```

### NO OVER-ENGINEERING MANDATE
```typescript
// ✅ CORECT: Robust dar simplu
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('ro-RO', {
    style: 'currency',
    currency: 'RON'
  }).format(amount);
};

// ❌ GREȘIT: Enterprise level complexity
class CurrencyFormatterFactory {
  private static instance: CurrencyFormatterFactory;
  private formatters: Map<string, Intl.NumberFormat>;
  // ... 200 lines of over-engineering
}
```

---

## Web-First Design Principles

### 1. Desktop-Optimized Layout Priority
```css
/* ✅ CORECT: Desktop-first cu progressive adaptation */
.container {
  width: 100%;
  max-width: 1440px;        /* Primary desktop target */
  padding: 2rem;            /* Desktop spacing */
  display: grid;
  grid-template-columns: 240px 1fr 300px; /* Sidebar + Main + Panel */
}

/* Secondary: Tablet adaptation */
@media (max-width: 1024px) {
  .container {
    grid-template-columns: 200px 1fr; /* Collapse panel */
    padding: 1.5rem;
  }
}

/* Fallback: Mobile minimum */
@media (max-width: 768px) {
  .container {
    grid-template-columns: 1fr; /* Single column */
    padding: 1rem;
  }
}

/* ❌ GREȘIT: Mobile-first approach */
.container {
  padding: 1rem;           /* Cramped pe desktop */
  flex-direction: column;  /* Vertical stack default */
}
```

### 2. Keyboard-First Interaction Design
```typescript
// ✅ CORECT: Comprehensive keyboard support
const DataTable = () => {
  const handleKeyDown = (event: KeyboardEvent) => {
    switch (event.key) {
      case 'ArrowUp':
        navigateRow(-1);
        break;
      case 'ArrowDown':
        navigateRow(1);
        break;
      case 'Enter':
        editSelectedRow();
        break;
      case 'Escape':
        cancelEdit();
        break;
      case 'Delete':
        deleteSelected();
        break;
    }
  };

  return (
    <table 
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="grid"
      aria-label="Financial transactions"
    >
      {/* ... */}
    </table>
  );
};

// ❌ GREȘIT: Touch-only interactions
const MobileTable = () => (
  <div onTouchStart={handleTouch}>
    {/* No keyboard support, desktop users frustrated */}
  </div>
);
```

### 3. Right-Click Context Menu Standards
```typescript
// ✅ CORECT: Desktop power user context menus
const TransactionRow = ({ transaction }) => {
  const contextMenuOptions = [
    { label: 'Edit Transaction', shortcut: 'Enter', action: () => edit() },
    { label: 'Duplicate', shortcut: 'Ctrl+D', action: () => duplicate() },
    { label: 'Delete', shortcut: 'Delete', action: () => remove() },
    { separator: true },
    { label: 'Export to CSV', action: () => exportRow() },
    { label: 'Copy Details', shortcut: 'Ctrl+C', action: () => copy() }
  ];

  return (
    <tr onContextMenu={(e) => showContextMenu(e, contextMenuOptions)}>
      {/* ... */}
    </tr>
  );
};

// ❌ GREȘIT: Missing power user features
const BasicRow = ({ data }) => (
  <tr onClick={handleEdit}>
    {/* Forced to click edit button every time */}
  </tr>
);
```

## Convenții de Denumire - Web-First Extensions

### Desktop-Specific Components
```typescript
// Desktop-optimized components cu suffix explicit
interface DataTableDesktopProps {
  onKeyboardNavigation?: (direction: 'up' | 'down' | 'left' | 'right') => void;
  onContextMenu?: (items: ContextMenuItem[]) => void;
  enableBulkSelection?: boolean;
  showColumnResizers?: boolean;
}

// Mobile-adaptation cu suffix explicit pentru fallback
interface DataTableMobileProps {
  onTouchScroll?: (direction: 'vertical' | 'horizontal') => void;
  simplifiedView?: boolean;
}
```

### Keyboard Shortcut Naming
```typescript
// Consistent naming pentru keyboard shortcuts
const DESKTOP_SHORTCUTS = {
  NEW_TRANSACTION: 'Ctrl+N',
  SAVE_CHANGES: 'Ctrl+S',
  EXPORT_DATA: 'Ctrl+E',
  TOGGLE_FILTERS: 'Ctrl+F',
  BULK_SELECT_ALL: 'Ctrl+A',
  CONTEXT_MENU: 'Shift+F10'
} as const;
```

## Performance Standards - Desktop-Optimized

### Large Dataset Handling
```typescript
// ✅ CORECT: Desktop performanță optimizations
const LargeDataTable = () => {
  // Virtualization pentru 10,000+ rows
  const virtualizer = useVirtualizer({
    count: transactions.length,
    getScrollElement: () => tableRef.current,
    estimateSize: () => 48, // Fixed row height for performance
    overscan: 10 // Buffer pentru smooth scrolling
  });

  // Bulk operations batch processing
  const handleBulkDelete = async (selectedIds: string[]) => {
    const BATCH_SIZE = 100; // Process în batches
    for (let i = 0; i < selectedIds.length; i += BATCH_SIZE) {
      const batch = selectedIds.slice(i, i + BATCH_SIZE);
      await deleteBatch(batch);
      updateProgress((i + batch.length) / selectedIds.length);
    }
  };

  return (
    <div ref={tableRef} style={{ height: '600px', overflow: 'auto' }}>
      {virtualizer.getVirtualItems().map(virtualRow => (
        <TableRow 
          key={virtualRow.key}
          index={virtualRow.index}
          style={{ transform: `translateY(${virtualRow.start}px)` }}
        />
      ))}
    </div>
  );
};

// ❌ GREȘIT: Mobile-style pagination pentru desktop
const MobilePagination = () => (
  <div>
    {/* Loading 20 items at a time, excessive clicking for desktop users */}
    <Pagination pageSize={20} />
  </div>
);
```

### Memory Management pentru Long Sessions
```typescript
// ✅ CORECT: Desktop session optimization
const useDesktopSession = () => {
  useEffect(() => {
    // Cleanup pentru long-running desktop sessions
    const cleanupInterval = setInterval(() => {
      // Clear stale cache entries
      queryClient.getQueryCache()
        .getAll()
        .filter(query => Date.now() - query.state.dataUpdatedAt > 30 * 60 * 1000)
        .forEach(query => queryClient.removeQueries(query.queryKey));
    }, 5 * 60 * 1000); // Every 5 minutes

    return () => clearInterval(cleanupInterval);
  }, []);
};
```

## Component Architecture Standards

### Desktop-First Component Structure
```
components/
├── desktop/                 # Desktop-optimized components
│   ├── DataTable/          # Advanced table cu sorting, filtering, bulk operations
│   ├── Sidebar/            # Persistent navigation cu keyboard shortcuts
│   ├── ContextMenu/        # Right-click menus
│   └── KeyboardShortcuts/  # Shortcut overlay și help
├── primitives/             # Cross-platform base components
│   ├── Button/            # Works pe toate platforms dar desktop-first
│   ├── Input/             # Keyboard navigation primary
│   └── Modal/             # Desktop-sized by default
└── mobile/                # Mobile fallback components
    ├── TouchTable/        # Simplified table pentru mobile
    ├── HamburgerMenu/     # Collapse navigation
    └── TouchOptimized/    # Touch-specific components
```

### CVA Variants - Desktop Priority
```typescript
// ✅ CORECT: Desktop variants primary, mobile secondary
const buttonVariants = cva('button', {
  variants: {
    size: {
      sm: 'px-3 py-1.5 text-sm',     // Desktop small
      md: 'px-4 py-2 text-base',     // Desktop default
      lg: 'px-6 py-3 text-lg',       // Desktop large
      xl: 'px-8 py-4 text-xl',       // Desktop extra large
      touch: 'px-6 py-4 text-lg'     // Mobile/touch fallback
    },
    interaction: {
      keyboard: 'focus:ring-2 focus:ring-blue-500',
      mouse: 'hover:bg-blue-600 transition-colors',
      touch: 'active:scale-95'        // Secondary
    }
  },
  defaultVariants: {
    size: 'md',
    interaction: 'keyboard'            // Desktop default
  }
});
```

## Testing Standards - Desktop-First

### Keyboard Navigation Testing
```typescript
// ✅ CORECT: Comprehensive keyboard testing
describe('DataTable Keyboard Navigation', () => {
  it('navigates rows cu arrow keys', async () => {
    render(<DataTable data={mockData} />);
    
    const table = screen.getByRole('grid');
    table.focus();
    
    await user.keyboard('[ArrowDown]');
    expect(screen.getByRole('row', { selected: true }))
      .toHaveAttribute('aria-rowindex', '2');
      
    await user.keyboard('[Enter]');
    expect(screen.getByRole('dialog')).toBeInTheDocument(); // Edit modal
  });

  it('supports bulk selection cu Ctrl+Click', async () => {
    render(<DataTable data={mockData} enableBulkSelection />);
    
    const firstRow = screen.getAllByRole('row')[1];
    const secondRow = screen.getAllByRole('row')[2];
    
    await user.click(firstRow);
    await user.keyboard('{Control>}');
    await user.click(secondRow);
    await user.keyboard('{/Control}');
    
    expect(screen.getAllByRole('row', { selected: true })).toHaveLength(2);
  });
});
```

### Performance Testing
```typescript
// ✅ CORECT: Desktop performance targets
describe('Desktop Performance', () => {
  it('handles 10,000 transactions fără performance degradation', async () => {
    const largeDataset = generateMockTransactions(10000);
    
    const startTime = performance.now();
    render(<DataTable data={largeDataset} />);
    const renderTime = performance.now() - startTime;
    
    expect(renderTime).toBeLessThan(500); // <500ms render time
    
    // Test scroll performance
    const table = screen.getByTestId('virtualized-table');
    fireEvent.scroll(table, { target: { scrollTop: 10000 } });
    
    await waitFor(() => {
      expect(screen.getByText('Row 200')).toBeInTheDocument();
    }, { timeout: 100 }); // Smooth scrolling
  });
});
```

## Error Handling - Desktop Context

### Non-Intrusive Error Display
```typescript
// ✅ CORECT: Desktop-appropriate error handling
const useDesktopErrorHandling = () => {
  const showError = (error: Error) => {
    // Non-blocking notification pentru desktop workflows
    toast.error(error.message, {
      position: 'bottom-right',
      duration: 5000,
      dismissible: true,
      action: {
        label: 'Retry',
        onClick: () => retryLastAction()
      }
    });
    
    // Log pentru debugging fără interrupting workflow
    console.error('Desktop workflow error:', error);
  };
  
  return { showError };
};

// ❌ GREȘIT: Intrusive mobile-style alerts
const showMobileAlert = (error: Error) => {
  alert(error.message); // Blocks entire workflow
};
```

## Accessibility - Desktop Enhanced

### Screen Reader Optimization
```typescript
// ✅ CORECT: Professional desktop screen reader support
const FinancialDataTable = () => (
  <table 
    role="grid"
    aria-label="Financial transactions with sorting and filtering capabilities"
    aria-rowcount={totalRows}
    aria-colcount={columns.length}
  >
    <thead>
      <tr role="row">
        {columns.map((col, index) => (
          <th
            key={col.id}
            role="columnheader"
            aria-sort={getSortState(col.id)}
            aria-colindex={index + 1}
            tabIndex={0}
            onClick={() => handleSort(col.id)}
            onKeyDown={(e) => e.key === 'Enter' && handleSort(col.id)}
          >
            {col.label}
            <SortIcon direction={getSortDirection(col.id)} />
          </th>
        ))}
      </tr>
    </thead>
    <tbody>
      {virtualRows.map(row => (
        <tr
          key={row.id}
          role="row"
          aria-rowindex={row.index + 1}
          aria-selected={isSelected(row.id)}
          tabIndex={0}
        >
          {/* Row content */}
        </tr>
      ))}
    </tbody>
  </table>
);
```

## Documentation Standards

### Component Documentation
```typescript
/**
 * Desktop-optimized data table cu advanced features pentru financial data.
 * 
 * FEATURES:
 * - Keyboard navigation (Arrow keys, Enter, Escape)
 * - Bulk selection (Ctrl+Click, Shift+Click)
 * - Right-click context menus
 * - Column sorting și resizing
 * - Virtualization pentru large datasets (10,000+ rows)
 * 
 * DESKTOP-FIRST: Optimizat pentru 1920x1080+ screens
 * MOBILE FALLBACK: Simplified view pe <768px
 * 
 * @param data - Array of financial transactions
 * @param onSelectionChange - Callback pentru bulk selection
 * @param enableKeyboardShortcuts - Enable advanced keyboard navigation
 * 
 * @example
 * <FinancialDataTable 
 *   data={transactions}
 *   onSelectionChange={handleBulkActions}
 *   enableKeyboardShortcuts
 * />
 */
const FinancialDataTable = ({ data, onSelectionChange, enableKeyboardShortcuts }: Props) => {
  // Implementation
};
```

## SAFE IMPLEMENTATION CHECKLIST

### Pre-Implementation Verification
```typescript
// ✅ ALWAYS run before implementing new features:

// 1. Audit existing components
const existingComponents = [
  'frontend/src/components/primitives/Table/',
  'frontend/src/styles/cva-v2/compositions/data-table.ts',
  'frontend/src/components/features/LunarGrid/'
];

// 2. Check shared constants
const requiredConstants = [
  '@shared-constants/ui.ts',
  '@shared-constants/messages.ts', 
  '@shared-constants/api.ts'
];

// 3. Verify import paths
const imports = [
  'import { dataTable } from "../../../styles/cva-v2"',
  'import { MESSAGES } from "@shared-constants"'
];

// 4. Impact assessment
const affectedComponents = [
  'LunarGrid/LunarGridTanStack.tsx',
  'TransactionTable/TransactionTable.tsx'
];
```

### Incremental Implementation Steps
```typescript
// Step 1: Create safe base implementation
const SafeTableComponent = ({ data }: { data: any[] }) => {
  // Minimal viable implementation
  return <table>{/* Basic structure */}</table>;
};

// Step 2: Add keyboard navigation incrementally
const withKeyboardNav = (WrappedComponent: React.ComponentType) => {
  return (props: any) => {
    const keyboardHandlers = useKeyboardNavigation();
    return <WrappedComponent {...props} {...keyboardHandlers} />;
  };
};

// Step 3: Validate each addition
const validateImplementation = () => {
  // ✅ Existing functionality unchanged
  // ✅ New functionality works
  // ✅ No performance regression
  // ✅ TypeScript errors: 0
};

// Step 4: Integration testing
const integrationTest = () => {
  // ✅ Components integrate properly
  // ✅ Shared constants work correctly  
  // ✅ Build succeeds
  // ✅ No breaking changes
};
```

---

**Document Version**: 2.0 (Web-First Edition)  
**Data Actualizării**: 2025-06-03  
**Review Status**: Updated for Web-First & Safe Implementation  

*Acest style guide stabilește standardele pentru orientarea WEB-FIRST și SAFE INCREMENTAL IMPLEMENTATION în Budget App. Toate componente noi TREBUIE să urmeze aceste principii.* 
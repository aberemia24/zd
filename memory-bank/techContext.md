# TECH CONTEXT

**Ultima actualizare**: 30 Mai 2025  
**Project**: LunarGrid Comprehensive Improvements  
**Status**: Technical Architecture Analysis

---

## 🛠️ **TECHNOLOGY STACK**

### **Core Technologies** (Existing - Maintain)
- **Frontend Framework**: React 18+ cu TypeScript
- **State Management**: Zustand cu persist middleware
- **Styling System**: TailwindCSS + CVA (Class Variance Authority)
- **Data Fetching**: React Query v5 pentru server state
- **Table Library**: TanStack Table v8 pentru grid functionality
- **Build Tool**: Vite cu optimizări pentru production
- **Testing**: Jest + React Testing Library + Playwright

### **Extend Technologies** (Pentru LunarGrid Improvements)
- **Virtual Scrolling**: TanStack Virtual pentru large datasets
- **Form Validation**: Zod cu shared-constants integration
- **Date Handling**: date-fns pentru balance projections
- **Animation**: Framer Motion pentru smooth transitions
- **Keyboard Navigation**: Improved keyboard handling library
- **Performance Monitoring**: React DevTools Profiler integration

---

## 🏗️ **ARCHITECTURAL CONSTRAINTS**

### **Technical Constraints**
- **Browser Support**: Modern browsers (ES2020+), no IE support
- **Mobile Support**: Responsive design pentru tablets și phones
- **Performance**: < 100ms pentru core operations, < 2s pentru complex calculations
- **Bundle Size**: Target < 500KB pentru LunarGrid module

### **Framework Constraints**
- **React Patterns**: Hooks-based architecture, function components only
- **TypeScript**: Strict mode enabled, explicit typing required
- **CVA System**: All new components MUST use CVA pentru styling
- **Shared Constants**: NO hardcoded strings sau styles în components

### **Integration Constraints**
- **Backward Compatibility**: Zero breaking changes pentru existing users
- **Store Architecture**: Maintain Zustand pattern, add new stores doar când necesar
- **API Consistency**: Follow existing REST API patterns cu Supabase
- **Testing Coverage**: Minimum 80% coverage pentru new features

---

## 📊 **EXISTING COMPONENT ANALYSIS**

### **LunarGrid Current Architecture**
```
LunarGridTanStack.tsx (632 lines)
├── useLunarGridTable.tsx (616 lines) - Core business logic
├── EditableCell.tsx (431 lines) - Inline editing system
├── CellTransactionPopover.tsx (216 lines) - Modal system
├── types.ts (301 lines) - Type definitions
└── hooks/
    ├── useKeyboardNavigation.tsx (385 lines)
    ├── usePerformanceOptimization.tsx (110 lines)
    └── modals/hooks/ - Modal management
```

### **Integration Points**
- **CategoryStore**: 432 lines - Category/subcategory management
- **TransactionStore**: Integration cu React Query mutations
- **Shared Constants**: UI texts, validation rules, CVA variants
- **CVA Grid System**: 387 lines styling definitions

### **Performance Characteristics**
- **Current Performance**: Good până la ~500 transactions
- **Bottlenecks**: Re-rendering on category expansion, large dataset filtering
- **Optimization Points**: Cell memoization, virtual scrolling, lazy loading

---

## 🎯 **TECHNICAL REQUIREMENTS FOR IMPROVEMENTS**

### **Category Management Enhancement**
```typescript
// New types needed
interface CategoryManagementSystem {
  maxSubcategoriesPerCategory: 5;
  subcategoryValidation: ZodSchema;
  inlineEditingContext: 'text' | 'amount' | 'date';
  permissionSystem: 'custom' | 'default';
}

// Store extensions needed
interface CategoryStoreExtension {
  validateSubcategoryLimit: (categoryId: string) => boolean;
  getCustomSubcategories: (categoryId: string) => CustomSubcategory[];
  deleteSubcategoryWithMigration: (options: DeleteOptions) => Promise<void>;
}
```

### **Dual Interaction System**
```typescript
// Interaction detection
interface InteractionContext {
  clickType: 'single' | 'double' | 'shift-click';
  editingMode: 'inline' | 'modal-basic' | 'modal-advanced';
  contextType: 'amount' | 'text' | 'date' | 'category';
  validationRules: ZodSchema;
}

// Performance requirements
const INTERACTION_PERFORMANCE = {
  doubleClickDetection: '< 50ms',
  inlineEditingActivation: '< 100ms',
  modalOpenTime: '< 200ms',
  validationFeedback: '< 150ms'
};
```

### **Responsive Layout System**
```typescript
// Layout modes
type LayoutMode = 'normal' | 'full-width' | 'fullscreen';

interface ResponsiveGridSystem {
  mode: LayoutMode;
  breakpoints: TailwindBreakpoints;
  transitions: FramerMotionConfig;
  accessibility: A11yConfiguration;
}

// CVA extensions needed
const gridLayoutVariants = cva(baseGridClasses, {
  variants: {
    mode: {
      normal: 'container mx-auto px-4',
      'full-width': 'w-full px-2',
      fullscreen: 'fixed inset-0 z-50 bg-white'
    },
    size: {
      compact: 'text-sm',
      normal: 'text-base', 
      large: 'text-lg'
    }
  }
});
```

### **Balance System Implementation**
```typescript
// New data models with month continuity
interface BalanceProjection {
  date: Date;
  balanceStart: number;
  transactions: TransactionValidated[];
  balanceEnd: number;
  recurringProjections: RecurringTransaction[];
  isMonthEnd: boolean; // flag pentru detectarea sfârșitului de lună
}

interface MonthlyBalance {
  year: number;
  month: number;
  startBalance: number; // din luna precedentă sau manual pentru prima lună
  endBalance: number; // calculat automat
  isStartBalanceManual: boolean; // true pentru prima lună sau overrides
  lastUpdated: Date;
}

interface BalanceStore {
  bankAccounts: BankAccount[];
  monthlyBalances: Map<string, MonthlyBalance>; // key: "YYYY-MM"
  dailyProjections: Map<string, BalanceProjection>; // key: "YYYY-MM-DD"
  projectionHorizon: number; // days
  
  // Core methods
  calculateDailyBalance: (date: Date) => number;
  projectFutureBalance: (days: number) => BalanceProjection[];
  
  // Month continuity methods
  getMonthStartBalance: (year: number, month: number) => number;
  propagateMonthEndBalance: (year: number, month: number) => void;
  setManualStartBalance: (year: number, month: number, balance: number) => void;
  getBalanceContinuity: (startMonth: Date, months: number) => MonthlyBalance[];
}
```

---

## 🔧 **IMPLEMENTATION STRATEGY**

### **Phase 1: Core Infrastructure**
- **Duration**: 2-3 săptămâni
- **Focus**: Type definitions, store extensions, CVA system updates
- **Deliverables**: Foundation pentru advanced features
- **Risk**: Low - Infrastructure setup

### **Phase 2: Category Management**
- **Duration**: 2-3 săptămâni  
- **Focus**: Direct table operations, validation system, UI components
- **Deliverables**: Complete category management în LunarGrid
- **Risk**: Medium - Integration complexity

### **Phase 3: Interaction System**
- **Duration**: 3-4 săptămâni
- **Focus**: Dual interaction modes, EditableCell refactoring, modal enhancements
- **Deliverables**: Smooth user experience cu multiple interaction paths
- **Risk**: High - Core functionality changes

### **Phase 4: Layout & Balance**
- **Duration**: 2-3 săptămâni
- **Focus**: Responsive layouts, balance calculations, projections
- **Deliverables**: Professional UI cu financial planning features
- **Risk**: Medium - Complex calculations și responsive design

### **Phase 5: Advanced Features**
- **Duration**: 1-2 săptămâni
- **Focus**: Filtering, search, Excel-like features
- **Deliverables**: Power user features și enhanced productivity
- **Risk**: Low - Nice-to-have features

---

## 🛡️ **TECHNOLOGY VALIDATION**

### **Required Dependencies Validation**
```json
{
  "core": {
    "react": "^18.0.0",
    "typescript": "^5.0.0",
    "@tanstack/react-table": "^8.0.0",
    "@tanstack/react-virtual": "^3.0.0",
    "zustand": "^4.0.0"
  },
  "new": {
    "zod": "^3.20.0",
    "date-fns": "^2.29.0",
    "framer-motion": "^10.0.0",
    "@testing-library/user-event": "^14.0.0"
  }
}
```

### **Performance Validation Criteria**
- **Initial Load**: < 2s pentru grid cu 200 transactions
- **Interaction Response**: < 100ms pentru click/double-click detection
- **Large Dataset**: < 5s pentru 1000+ transactions cu virtual scrolling
- **Memory Usage**: < 50MB growth pentru extended usage
- **Mobile Performance**: Smooth 60fps animations pe mid-range devices

### **Browser Compatibility Matrix**
| Feature | Chrome 90+ | Firefox 88+ | Safari 14+ | Edge 90+ |
|---------|------------|-------------|------------|----------|
| Core Grid | ✅ | ✅ | ✅ | ✅ |
| Virtual Scrolling | ✅ | ✅ | ⚠️ Performance | ✅ |
| Touch Interactions | ✅ | ✅ | ✅ | ✅ |
| Keyboard Navigation | ✅ | ✅ | ✅ | ✅ |
| Complex Animations | ✅ | ✅ | ⚠️ Reduced | ✅ |

---

## 🔍 **INTEGRATION IMPACT ANALYSIS**

### **CategoryEditor Integration**
- **Impact**: Medium - Extend existing functionality
- **Changes**: Add limit validation, improve UX messaging
- **Migration**: Zero breaking changes, additive enhancements
- **Testing**: Existing tests remain valid, add new scenarios

### **TransactionTable Integration**  
- **Impact**: High - Category changes affect transaction display
- **Changes**: Update filtering logic, add migration workflows
- **Migration**: Data migration pentru deleted subcategories
- **Testing**: Comprehensive integration testing required

### **Shared Constants Integration**
- **Impact**: Low - Add new constants, no changes la existing ones
- **Changes**: Extend UI texts, add validation rules, new CVA variants
- **Migration**: Additive only, no breaking changes
- **Testing**: Validation testing pentru new constants

### **CVA System Integration**
- **Impact**: Medium - Extend design system
- **Changes**: New variants pentru layout modes, grid enhancements
- **Migration**: Backward compatible variants
- **Testing**: Visual regression testing pentru styling changes

---

## 📋 **TECHNICAL VERIFICATION CHECKLIST**

```
✓ TECHNOLOGY VALIDATION CHECKLIST

Infrastructure Ready
- Development environment configured? [YES/NO]
- Required dependencies available? [YES/NO]
- TypeScript strict mode compatible? [YES/NO]
- CVA system extensible? [YES/NO]

Integration Assessment
- CategoryStore extension possible? [YES/NO]
- EditableCell refactoring feasible? [YES/NO]
- TanStack Table version compatible? [YES/NO]
- Performance targets achievable? [YES/NO]

Testing Infrastructure
- Unit testing framework ready? [YES/NO]
- Integration testing strategy defined? [YES/NO]
- Performance testing tools available? [YES/NO]
- Accessibility testing configured? [YES/NO]

Deployment Readiness  
- Build process optimized? [YES/NO]
- Bundle size targets realistic? [YES/NO]
- Browser compatibility validated? [YES/NO]
- Mobile responsiveness achievable? [YES/NO]

→ If all YES: Technology stack validated și ready pentru implementation
→ If any NO: Resolve technology constraints before proceeding
```

---

**🎯 Status**: Technology analysis complete și ready pentru creative phase 
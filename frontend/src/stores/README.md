# Stores Directory - State Management

```yaml
directory_type: "zustand_stores"
organization: "domain_driven"
ai_friendly: true
pattern: "single_responsibility"
last_updated: "2025-01-29"
```

## 📁 Directory Structure

```
stores/
├── README.md                    # This navigation document
├── useTransactionStore.ts       # ✅ Transaction domain state
├── useCategoryStore.ts          # ✅ Category domain state  
├── useNotificationStore.ts      # ✅ UI notifications state
└── patterns/
    ├── STORE_PATTERNS.md        # State management patterns
    └── TESTING.md               # Store testing guidelines
```

## 🎯 Store Categories

### Domain Stores
**Purpose**: Business entity state management
**Pattern**: Single domain responsibility, normalized data
**Examples**: `useTransactionStore`, `useCategoryStore`

### UI Stores  
**Purpose**: Application UI state management
**Pattern**: Ephemeral state, user interactions
**Examples**: `useNotificationStore`, `useUIStateStore`

## 📐 Store Design Principles

### ✅ **Single Responsibility**
```typescript
// ✅ DO: Single domain focus
const useTransactionStore = create<TransactionState>((set, get) => ({
  transactions: [],
  loading: false,
  addTransaction: (transaction) => { /* ... */ },
  updateTransaction: (id, data) => { /* ... */ }
}));

// ❌ DON'T: Mixed responsibilities  
const useMixedStore = create((set) => ({
  transactions: [],        // Transaction domain
  categories: [],         // Category domain
  uiMode: 'light'        // UI state
}));
```

### ✅ **Normalized Data Structure**
```typescript
// ✅ DO: Normalized by ID
interface TransactionState {
  transactions: Record<string, Transaction>;
  transactionIds: string[];
  loading: boolean;
}

// ❌ DON'T: Denormalized arrays
interface BadTransactionState {
  transactions: Transaction[];  // Hard to update efficiently
}
```

### ✅ **Type Safety**
```typescript
// ✅ DO: Complete TypeScript interfaces
interface TransactionStore {
  transactions: Record<string, Transaction>;
  loading: boolean;
  error: string | null;
  
  // Actions with proper typing
  addTransaction: (transaction: CreateTransactionData) => Promise<void>;
  updateTransaction: (id: string, data: Partial<Transaction>) => Promise<void>;
  deleteTransaction: (id: string) => Promise<void>;
}
```

## 🔧 Store Implementation Patterns

### API Integration Pattern
```typescript
const useTransactionStore = create<TransactionStore>((set, get) => ({
  transactions: {},
  loading: false,
  error: null,
  
  fetchTransactions: async () => {
    set({ loading: true, error: null });
    try {
      const data = await api.getTransactions();
      set({ 
        transactions: normalize(data),
        loading: false 
      });
    } catch (error) {
      set({ 
        error: error.message, 
        loading: false 
      });
    }
  }
}));
```

### Optimistic Updates Pattern
```typescript
const useTransactionStore = create<TransactionStore>((set, get) => ({
  addTransaction: async (data) => {
    const tempId = generateTempId();
    const optimisticTransaction = { ...data, id: tempId };
    
    // Optimistic update
    set(state => ({
      transactions: {
        ...state.transactions,
        [tempId]: optimisticTransaction
      }
    }));
    
    try {
      const serverTransaction = await api.createTransaction(data);
      // Replace optimistic with server data
      set(state => {
        const { [tempId]: removed, ...rest } = state.transactions;
        return {
          transactions: {
            ...rest,
            [serverTransaction.id]: serverTransaction
          }
        };
      });
    } catch (error) {
      // Rollback optimistic update
      set(state => {
        const { [tempId]: removed, ...rest } = state.transactions;
        return { transactions: rest };
      });
      throw error;
    }
  }
}));
```

## 🔍 AI Assistant Guidelines

When working with stores:

1. **CHECK** existing store patterns before creating new ones
2. **FOLLOW** single responsibility principle
3. **USE** normalized data structures for complex entities
4. **IMPLEMENT** proper error handling and loading states
5. **ADD** TypeScript interfaces for all store state
6. **DOCUMENT** complex business logic in store actions
7. **TEST** store actions with proper mocking

## 📊 Store Inventory

### ✅ Production Ready
- `useTransactionStore` - Complete CRUD operations
- `useCategoryStore` - Category management 
- `useNotificationStore` - Toast notifications

### 🔄 Needs Enhancement  
- `usePreferencesStore` - Could be added for user settings
- `useFiltersStore` - Could centralize filter state

## 🧪 Testing Approach

```typescript
// Store testing pattern
describe('useTransactionStore', () => {
  it('should add transaction optimistically', async () => {
    const { result } = renderHook(() => useTransactionStore());
    
    const mockTransaction = { amount: 100, description: 'Test' };
    
    await act(async () => {
      await result.current.addTransaction(mockTransaction);
    });
    
    expect(Object.values(result.current.transactions)).toHaveLength(1);
  });
});
```

---

**Navigation**: See individual store files for specific implementation details
**AI Compatibility**: High - Clear patterns and structured examples 
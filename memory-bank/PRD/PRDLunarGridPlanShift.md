📋 LunarGrid - Product Requirements Document (PRD)
🎯 PRODUCT VISION
LunarGrid = Excel pentru planificare financiară personală

Tool de vizualizare și planificare cash flow lunar
Focus pe "câți bani am în fiecare zi"
Bazat pe estimări și planificare, nu doar tracking


✅ CE PĂSTREZI (Foundation Layer)
1. INFRASTRUCTURE (100% keep)

TanStack Table core
React Query pentru data management
TypeScript architecture
CVA styling system
Zustand stores

2. DATA FLOW (keep cu modifications)

useMonthlyTransactions hook
useLunarGridTable hook (dar simplificat)
Calculation utilities (calculateDailyBalances, etc.)

3. UI COMPONENTS (selective keep)

LunarGridTanStack.tsx - baza tabelului
Styling-ul Professional Blue theme
Layout components (container, grid)


❌ CE ELIMINI (Reduce Complexity)
1. ENHANCED MODAL ARCHITECTURE (90% remove)

❌ ModalRouter
❌ ModalManagerProvider & Context
❌ AdvancedEditModal
❌ RecurringSetupModal (refactor în inline)
❌ BulkOperationsModal
❌ FinancialPreviewModal
✅ Keep doar: QuickAddModal (simplificat)

2. COMPLEX INTERACTIONS

❌ Click delay strategies (200ms timeout)
❌ Complex state management pentru modals
❌ Lazy loading pentru modals (nu mai e necesar)

3. OVER-ENGINEERED PATTERNS

❌ useModalManager și toată infrastructura
❌ Multiple rendering layers
❌ Complex event handling chains


🚀 CE ADAUGI (Core Features)
1. INLINE EDITING SYSTEM
- Double-click → input direct în celulă
- Enter → save
- Escape → cancel
- Tab → next cell
- Validation în real-time
2. EXCEL-LIKE NAVIGATION
- Arrow keys pentru movement
- Ctrl+C/V pentru copy/paste
- Shift+Click pentru range selection
- Cell highlighting și focus states
3. RECURENȚĂ SIMPLIFICATĂ
- Toggle "Recurring" direct în celulă
- Dropdown pentru frecvență
- Auto-propagare în lunile următoare
- Visual indicator pentru recurring transactions
4. CALCUL SOLD CORECT
- Venituri (+) vs Cheltuieli (-)
- Propagare automată modificări
- Running balance pentru fiecare zi
- Economii ca separate category

📐 ARCHITECTURE DIRECTION
FROM: Enterprise Modal System
User → Click → Modal → Form → Save → Update → Refresh
TO: Direct Manipulation
User → Click → Edit in place → Auto-save → Instant update

🎨 UI/UX PRINCIPLES
1. IMMEDIATE FEEDBACK

Modificări instant vizibile
No loading states pentru operații simple
Optimistic updates

2. FAMILIAR PATTERNS

Excel-like shortcuts
Standard grid behaviors
No learning curve

3. VISUAL HIERARCHY

Ziua curentă highlighted
Zile trecute semi-transparent
Weekend-uri diferențiate
Solduri negative în roșu


🔧 TECHNICAL APPROACH
1. STATE MANAGEMENT
- Local state pentru editing
- React Query pentru server sync
- Zustand pentru UI preferences
- No complex contexts
2. PERFORMANCE TARGETS
- Cell edit: < 16ms response
- Save operation: < 100ms
- Grid render: < 50ms
- No forced reflows
3. DATA STRUCTURE
- Flat array pentru transactions
- Computed values pentru totals
- Memoized calculations
- Simple propagation logic

📦 IMPLEMENTATION PHASES
PHASE 1: Core Functionality

Inline editing
Correct balance calculation
Basic keyboard navigation
Remove modal complexity

PHASE 2: Excel Features

Copy/paste
Range selection
Fill down/right
Undo/redo

PHASE 3: Advanced Planning

Recurring transactions
Estimates vs actuals
Multi-month view
Export/import


🎯 SUCCESS METRICS
Performance

Zero forced reflows
Sub-16ms interactions
Instant visual feedback

Usability

< 5 min learning curve
Excel users feel at home
No manual needed

Functionality

100% accurate calculations
Real-time propagation
Data integrity guaranteed


💡 KEY DECISIONS
1. INLINE > MODALS

Modals doar pentru operații complexe (bulk, import)
Tot ce e simplu = inline

2. EXCEL PARADIGM

Copy toate pattern-urile Excel care au sens
Nu reinventa roata

3. PERFORMANCE FIRST

Orice feature nou trebuie să fie sub 16ms
No compromise pe performance

4. PROGRESSIVE ENHANCEMENT

Start simplu, adaugă features gradual
Core functionality primul
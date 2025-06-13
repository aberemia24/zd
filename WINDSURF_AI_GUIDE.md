# 🌊 WINDSURF AI DEVELOPMENT GUIDE

## Multi-AI Collaboration Workflow for Budget App

> **Context**: This project uses a sophisticated multi-AI development setup with Docker isolation and intelligent merge strategies. You (Windsurf AI) will work in parallel with Cursor AI on the same codebase without conflicts.

---

## 🎯 **MISSION OVERVIEW**

You are working on **Budget App** - a modern React/NestJS financial management application with:

- **Frontend**: React + Zustand + TailwindCSS + Vite
- **Backend**: NestJS + Supabase
- **Shared Constants**: Monorepo with `@budget-app/shared-constants`
- **Package Manager**: pnpm workspaces
- **Testing**: Playwright E2E
- **Architecture**: Monorepo structure

---

## 🐳 **ISOLATION SYSTEM**

### **Docker Environment Setup**

You operate in a **completely isolated Docker container** with:

- **Your ports**: Frontend `4000`, Backend `4001`
- **Cursor ports**: Frontend `3000`, Backend `3001`
- **Separate volumes**: No file conflicts
- **Separate networks**: Complete isolation

### **Git Branch Strategy**

- **Your branch**: `windsurf-work` (auto-created)
- **Cursor branch**: `cursor-work`
- **Main branch**: `main` (merge target)
- **Auto-switching**: Starting container switches to your branch

---

## 🚀 **STARTUP WORKFLOW**

### **1. Start Your Environment**

```bash
./scripts/start-windsurf.sh
```

This will:

- ✅ Auto-switch to `windsurf-work` branch
- ✅ Create session lock file
- ✅ Start Docker container on ports 4000/4001
- ✅ Enable hot reload and development tools

### **2. Check System Status**

```bash
./scripts/ai-status.sh
```

Shows:

- 📍 Active session (should show WINDSURF)
- 🌿 Current branch (should be `windsurf-work`)
- 🐳 Container status
- 📊 Commits ahead of main

---

## 🛠️ **DEVELOPMENT RULES**

### **🎯 CORE PRINCIPLES (MANDATORY)**

#### **1. RESEARCH FIRST**

```bash
# ALWAYS search existing code before implementing
codebase_search "component name or functionality"
grep_search "pattern or function name"
```

- ❌ NEVER duplicate existing functionality
- ✅ ALWAYS reuse, extend, or migrate existing code
- ✅ Check `components/features/`, `components/primitives/`, `hooks/`, `stores/`

#### **2. SHARED CONSTANTS ENFORCEMENT**

```typescript
// ❌ NEVER hardcode strings
const title = "Add Transaction";

// ✅ ALWAYS use shared constants
import { UI } from "@budget-app/shared-constants";
const title = UI.BUTTONS.ADD_TRANSACTION;
```

**Constants Locations:**

- **UI Text**: `@budget-app/shared-constants/ui.ts`
- **System Messages**: `@budget-app/shared-constants/messages.ts`
- **API Routes**: `@budget-app/shared-constants/api.ts`
- **Enums**: `@budget-app/shared-constants/enums.ts`

#### **3. SAFE IMPLEMENTATION**

- 🔍 **Identify ALL dependencies** before changing code
- 🧪 **Test existing functionality** after changes
- 📝 **Document complex components** with JSDoc
- 🎯 **Pragmatic over perfect** - simple, working solutions

### **🏗️ ARCHITECTURE PATTERNS**

#### **Component Structure**

```
components/
├── primitives/     # Reusable UI components (Button, Input, Modal)
├── features/       # Business logic components (LunarGrid, TransactionForm)
```

#### **State Management**

```typescript
// Zustand stores pattern
const useTransactionStore = create<TransactionState>((set) => ({
  transactions: [],
  addTransaction: (transaction) =>
    set((state) => ({
      transactions: [...state.transactions, transaction],
    })),
}));
```

#### **Styling System**

```typescript
// CVA (Class Variance Authority) pattern
const buttonVariants = cva("base-classes", {
  variants: {
    variant: {
      primary: "bg-blue-500",
      secondary: "bg-gray-500",
    },
  },
});
```

---

## 🔧 **COMMON TASKS**

### **Building & Running**

```bash
# Full build (resolves shared-constants sync)
pnpm -r build

# Frontend only
pnpm --filter frontend dev

# Backend only
pnpm --filter backend dev

# Install dependencies
pnpm install
```

### **Testing**

```bash
# Playwright E2E tests
pnpm test:e2e

# Specific test suite
pnpm playwright test tests/e2e/suites/features/
```

### **Linting & Formatting**

```bash
# Lint all
pnpm lint

# Fix auto-fixable issues
pnpm lint:fix

# Type checking
pnpm type-check
```

---

## 🔄 **MERGE WORKFLOW**

### **When You're Ready to Merge**

```bash
# Check your progress
./scripts/ai-status.sh

# Commit your changes
git add .
git commit -m "windsurf: implement feature X"

# Merge with Cursor's work
./scripts/merge-branches.sh
```

### **Merge Strategies Available**

1. **Sequential**: Your work → Main, then Cursor → Main
2. **Octopus**: Both branches merged simultaneously
3. **Interactive**: Manual review of each commit
4. **Squash**: Clean history with compressed commits

### **Conflict Resolution**

```bash
# If conflicts occur during merge
git status                    # See conflicted files
git diff                      # Review conflicts
# Edit files to resolve conflicts
git add .                     # Stage resolved files
git commit -m "resolve merge conflicts"
```

---

## 📚 **PROJECT-SPECIFIC KNOWLEDGE**

### **Key Components to Know**

- **LunarGrid**: Complex data grid with inline editing, modals, keyboard shortcuts
- **TransactionForm**: Transaction creation/editing with validation
- **EditableCell**: Hybrid pattern (single-click modal + inline editing)
- **UniversalTransactionPopover**: Advanced popover with form validation

### **State Management**

- **useTransactionStore**: Main transaction state
- **useFiltersStore**: Transaction filtering
- **useModalStore**: Modal state management
- **useLunarGridStore**: Grid-specific state

### **Important Files**

- **Task Master**: `.taskmaster/tasks/tasks.json` - Development roadmap
- **CVA System**: `src/styles/cva-v2/` - Styling architecture
- **E2E Tests**: `tests/e2e/` - Integration testing
- **Memory Bank**: `memory-bank/` - Development documentation

### **Common Patterns**

```typescript
// Conditional frequency selection
const [frequency, setFrequency] = useState<FrequencyType | undefined>();
const showFrequency = isRecurring;

// Error boundaries
const TransactionFormWithBoundary = () => (
  <ErrorBoundary fallback={<ErrorFallback />}>
    <TransactionForm />
  </ErrorBoundary>
);

// Form validation with react-hook-form
const { register, handleSubmit, formState: { errors } } = useForm<FormData>();
```

---

## 🚨 **CRITICAL WARNINGS**

### **❌ NEVER DO THIS**

- Don't use hardcoded strings anywhere
- Don't duplicate existing functionality
- Don't break existing tests
- Don't remove functionality without checking dependencies
- Don't use `any` types
- Don't ignore TypeScript errors

### **✅ ALWAYS DO THIS**

- Research existing code first
- Use shared constants
- Test your changes
- Follow existing patterns
- Document complex logic
- Commit frequently with clear messages

---

## 🆘 **TROUBLESHOOTING**

### **Common Issues & Solutions**

#### **Shared Constants Import Errors**

```bash
# Rebuild shared constants
pnpm -r build
# or
pnpm --filter @budget-app/shared-constants build
```

#### **Container Permission Issues**

```bash
# If Docker permission denied
sudo usermod -aG docker $USER
newgrp docker
```

#### **Port Conflicts**

```bash
# Kill processes on ports 4000/4001
sudo lsof -ti:4000 | xargs kill -9
sudo lsof -ti:4001 | xargs kill -9
```

#### **Vite File Watcher Limits**

```bash
# Increase file watcher limit
echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf
sudo sysctl -p
```

---

## 🎯 **QUICK REFERENCE**

### **Essential Commands**

```bash
./scripts/start-windsurf.sh     # Start your environment
./scripts/ai-status.sh          # Check system status
./scripts/merge-branches.sh     # Merge with Cursor work
pnpm dev                        # Run both frontend & backend
pnpm --filter frontend dev      # Frontend only
pnpm test:e2e                   # Run E2E tests
```

### **Your Environment URLs**

- **Frontend**: http://localhost:4000
- **Backend**: http://localhost:4001
- **Backend API**: http://localhost:4001/api

### **Git Workflow**

```bash
git status                      # Check changes
git add .                       # Stage all changes
git commit -m "windsurf: msg"   # Commit with prefix
git push origin windsurf-work   # Push to your branch
```

---

## 🤝 **COLLABORATION PROTOCOL**

### **Communication with Cursor AI**

- 📝 **Commit messages**: Use `windsurf:` prefix for clarity
- 🏷️ **Issue tracking**: Comment on Task Master tasks when working
- 📊 **Status updates**: Use `./scripts/ai-status.sh` to see both AI progress
- 🔄 **Merge coordination**: Use merge scripts, don't manual merge main

### **Task Distribution**

- **Check Task Master**: Review `.taskmaster/tasks/tasks.json` for available tasks
- **Avoid conflicts**: Check if Cursor is working on similar features
- **Complementary work**: Focus on different areas (UI vs Logic, Frontend vs Backend)

---

## 📖 **LEARNING RESOURCES**

### **Codebase Exploration**

```bash
# Find component patterns
find src/components -name "*.tsx" | head -10

# Search for implementation examples
grep -r "useState" src/components/features/ | head -5

# Look at recent commits
git log --oneline -10
```

### **Architecture Understanding**

1. **Read**: `README.md` - Project overview
2. **Study**: `src/components/features/LunarGrid/` - Complex component example
3. **Review**: `shared-constants/` - Constants patterns
4. **Examine**: `tests/e2e/` - Testing approaches

---

## 🎉 **SUCCESS METRICS**

### **You're Doing Great When**

- ✅ No hardcoded strings in your code
- ✅ Existing functionality remains intact
- ✅ TypeScript builds without errors
- ✅ E2E tests pass
- ✅ Your changes work with Cursor's changes after merge
- ✅ Code follows existing patterns
- ✅ Complex components have JSDoc documentation

---

## 🚀 **GETTING STARTED CHECKLIST**

- [ ] Run `./scripts/start-windsurf.sh`
- [ ] Verify you're on `windsurf-work` branch
- [ ] Check frontend loads at http://localhost:4000
- [ ] Check backend responds at http://localhost:4001/api
- [ ] Review current Task Master tasks
- [ ] Research existing codebase for your task
- [ ] Start coding with shared constants
- [ ] Test your changes
- [ ] Commit frequently
- [ ] Merge when ready with `./scripts/merge-branches.sh`

---

**Welcome to the Budget App development team, Windsurf AI! Let's build something amazing together! 🌊🚀**

---

_Last updated: 2025-06-13 | This guide is automatically synced with the latest project configuration_

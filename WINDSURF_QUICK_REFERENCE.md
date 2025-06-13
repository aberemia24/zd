# 🌊 WINDSURF AI QUICK REFERENCE

_Essential commands and patterns for Budget App development_

---

## 🚀 **STARTUP (First Thing)**

```bash
./scripts/start-windsurf.sh     # Start your environment (ports 4000/4001)
./scripts/ai-status.sh          # Check your status
```

---

## 🎯 **CORE RULES (Never Break These)**

### **1. Research First**

```bash
codebase_search "feature or component name"
grep_search "pattern or function"
```

❌ NEVER duplicate existing code
✅ ALWAYS reuse/extend existing functionality

### **2. Shared Constants Only**

```typescript
// ❌ NEVER
const text = "Add Transaction";

// ✅ ALWAYS
import { UI } from "@budget-app/shared-constants";
const text = UI.BUTTONS.ADD_TRANSACTION;
```

### **3. Safe Implementation**

- 🔍 Check dependencies before changing code
- 🧪 Test existing functionality after changes
- 📝 Document complex components

---

## 📁 **KEY LOCATIONS**

| What       | Where                                                     |
| ---------- | --------------------------------------------------------- |
| UI Text    | `@budget-app/shared-constants/ui.ts`                      |
| Messages   | `@budget-app/shared-constants/messages.ts`                |
| API Routes | `@budget-app/shared-constants/api.ts`                     |
| Enums      | `@budget-app/shared-constants/enums.ts`                   |
| Components | `src/components/features/` & `src/components/primitives/` |
| Stores     | `src/stores/`                                             |
| Hooks      | `src/hooks/`                                              |

---

## 🔧 **COMMON COMMANDS**

```bash
# Development
pnpm dev                           # Both frontend & backend
pnpm --filter frontend dev         # Frontend only (your port: 4000)
pnpm --filter backend dev          # Backend only (your port: 4001)

# Building
pnpm -r build                      # Fix shared constants sync issues

# Testing
pnpm test:e2e                      # E2E tests
pnpm lint                          # Check code quality

# Git
git add .                          # Stage changes
git commit -m "windsurf: message"  # Commit with prefix
git push origin windsurf-work      # Push to your branch
```

---

## 🔄 **MERGE WORKFLOW**

```bash
./scripts/ai-status.sh             # Check your progress
./scripts/merge-branches.sh        # Smart merge with Cursor work
```

**4 Merge Options:**

1. **Sequential** - You → Main → Cursor → Main
2. **Octopus** - Both branches → Main together
3. **Interactive** - Manual review each commit
4. **Squash** - Clean history

---

## 🎨 **CODE PATTERNS**

### **Component Structure**

```typescript
// Standard component with JSDoc for complex ones
/**
 * 🎯 ComponentName - Brief description
 * 🧠 Logic: State management approach
 * 🎨 Styling: CVA variant usage
 * ⚙️ Integration: How it connects
 */
export const ComponentName = ({ prop }: Props) => {
  // Implementation
};
```

### **State Management (Zustand)**

```typescript
const useStore = create<State>((set) => ({
  data: [],
  addItem: (item) =>
    set((state) => ({
      data: [...state.data, item],
    })),
}));
```

### **Styling (CVA Pattern)**

```typescript
const variants = cva("base-classes", {
  variants: {
    variant: { primary: "bg-blue-500" },
  },
});
```

### **Form Patterns**

```typescript
const {
  register,
  handleSubmit,
  formState: { errors },
} = useForm<Data>();
```

---

## 🚨 **TROUBLESHOOTING**

| Problem        | Solution                                   |
| -------------- | ------------------------------------------ |
| Import errors  | `pnpm -r build`                            |
| Port conflicts | `sudo lsof -ti:4000,4001 \| xargs kill -9` |
| Docker issues  | `sudo systemctl restart docker`            |
| File watchers  | Already configured in your container       |

---

## ✅ **SUCCESS CHECKLIST**

- [ ] No hardcoded strings in code
- [ ] Existing tests still pass
- [ ] TypeScript builds without errors
- [ ] Used shared constants only
- [ ] Researched existing code first
- [ ] Documented complex components
- [ ] Committed with `windsurf:` prefix

---

## 🎯 **YOUR ENVIRONMENT**

- **Branch**: `windsurf-work` (auto-switched)
- **Frontend**: http://localhost:4000
- **Backend**: http://localhost:4001/api
- **Container**: `budget-app-windsurf`
- **Network**: `windsurf-network` (isolated)

---

## 🤝 **WORKING WITH CURSOR AI**

- Use `windsurf:` prefix in commit messages
- Check `./scripts/ai-status.sh` to see both AI progress
- Use merge scripts, don't manually merge to main
- Focus on complementary work (different features/areas)

---

## 📚 **LEARN MORE**

- **[Full Guide](WINDSURF_AI_GUIDE.md)** - Complete development guide
- **[Setup Docs](MULTI_AI_SETUP.md)** - Technical setup details
- **[Project README](README.md)** - Project overview

---

**🌊 Ready to build amazing features! Start with `./scripts/start-windsurf.sh` 🚀**

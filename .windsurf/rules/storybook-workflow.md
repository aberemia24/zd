---
trigger: model_decision
description:
globs:
---
# 📚 STORYBOOK WORKFLOW - Budget App

## 🎯 SCOPUL STORYBOOK în BUDGET APP

### **1. Design System Documentation**
- **CVA v2 Components**: Documentarea tuturor componentelor primitive cu toate variantele
- **Carbon Copper Design System**: Tokens, culori, typography, spacing
- **Interactive Props Testing**: Testarea props-urilor în timp real prin UI

### **2. Component Development Isolation**
- **Independent Development**: Dezvoltare componentă fără dependințe de aplicație
- **State Testing**: Verificarea tuturor stărilor componentei (loading, error, success)
- **Edge Cases**: Testarea cazurilor limită și interacțiunilor complexe

### **3. Component Playground vs App Context**
- **Complex Interactions**: Componente cu dropdown, modal, tab, tooltip sunt greu de testat în app
- **Full Control**: În Storybook ai control total asupra props, state, și context
- **Validation Testing**: Testarea validărilor, focus behavior, error states fără setup complex
- **Performance Testing**: Testing de performance fără dependințe de restul aplicației

**Exemple când Storybook > App testing:**
```typescript
✅ Select cu validare complexă + tooltips + focus management
✅ Modal cu multiple states + animations + keyboard navigation  
✅ Dropdown cu search + async data + custom positioning
✅ Table cu sorting + filtering + pagination + infinite scroll
```

### **4. Handoff Design-Development**
- **Visual Specifications**: Specificații precise pentru designeri
- **Responsive Behavior**: Demonstrarea comportamentului responsive
- **Interaction Patterns**: Documentarea pattern-urilor de interacțiune

## 🤖 AI-DRIVEN DEVELOPMENT WORKFLOW

### **Golden Rule pentru AI Development**
```typescript
if (component_created_by_AI) {
  writeStories(); // Vizualizezi și verifici imediat output-ul AI
}
```

### **AI + Storybook = Feedback Loop Perfect**
```bash
# 1. AI creează componenta
# 2. AI scrie stories pentru toate variantele
# 3. Developer verifică vizual în Storybook
# 4. Feedback rapid pentru ajustări
# 5. Iterații rapide până la rezultat perfect
```

### **Stories ca Specificație pentru AI**
- **Input pentru AI**: "Creează stories pentru toate variantele acestei componente"
- **Output verificat**: Vezi imediat dacă AI a înțeles cerințele
- **Documentație automată**: AI generează și documentația prin stories

### **Template pentru AI Story Generation**
```typescript
// Prompt pentru AI:
"Creează stories complete pentru componenta X:
- Default usage
- Toate variantele (primary, secondary, outline)
- Toate size-urile (xs, sm, md, lg)
- Interactive states (disabled, loading, error, focus)
- Financial use cases specific Budget App
- Props controls pentru testing interactiv"
```

## 🎭 STORYBOOK INTERACTIONS & AUTOMATION

### **Addon Interactions - Perfect pentru AI**
```bash
# Instalare (când e necesar)
pnpm install --save-dev @storybook/addon-interactions
```

### **Simple Interactions în Stories**
```typescript
import { userEvent, within } from '@storybook/testing-library';
import { expect } from '@storybook/jest';

export const ButtonClickInteraction: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole('button');
    
    // AI poate genera aceste interacțiuni simple
    await userEvent.click(button);
    await expect(button).toHaveClass('active');
  }
};
```

### **Future Integration cu Playwright**
- **Stories → E2E Tests**: Stories pot deveni baza pentru teste E2E
- **AI Generated Tests**: AI poate genera atât stories cât și teste automate
- **Consistent Testing**: Same interactions în Storybook și E2E tests

## 🏗️ ORGANIZAREA STORIES

### **Structure Pattern**
```
frontend/src/
├── components/primitives/ComponentName/
│   ├── ComponentName.tsx
│   ├── ComponentName.stories.tsx    ← Stories alături de componentă
│   └── index.ts
├── stories/design-tokens/           ← Design system documentation
│   ├── ColorPalette.stories.tsx
│   ├── Typography.stories.tsx
│   └── Spacing.stories.tsx
└── stories/                         ← Demo/Example stories (să se șteargă)
```

### **Naming Convention Stories**
```typescript
// Path în Storybook UI
title: 'CVA-v2/Primitives/ComponentName'
title: 'CVA-v2/Features/FeatureName'  
title: 'Design-System/Tokens/TokenType'

// Story names
export const Default: Story = { ... }
export const AllVariants: Story = { ... }
export const AllSizes: Story = { ... }
export const InteractiveStates: Story = { ... }
export const ResponsiveBehavior: Story = { ... }
```

## 📝 WRITING STORIES BEST PRACTICES

### **1. Story Structure Template**
```typescript
import type { Meta, StoryObj } from '@storybook/react';
import ComponentName from './ComponentName';

/**
 * 🎨 ComponentName - Carbon Copper Design System CVA-v2
 */
const meta: Meta<typeof ComponentName> = {
  title: 'CVA-v2/Primitives/ComponentName',
  component: ComponentName,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Descriere componentă cu use cases și comportament.'
      }
    }
  },
  tags: ['autodocs'],
  argTypes: {
    // Controls pentru props interactive
  }
};

export default meta;
type Story = StoryObj<typeof meta>;
```

### **2. Essential Stories pentru ORICE componentă**
```typescript
// 1. Default usage
export const Default: Story = {
  args: { /* props default */ }
};

// 2. Toate variantele
export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4">
      {/* Render toate variantele */}
    </div>
  )
};

// 3. Toate size-urile (dacă există)
export const AllSizes: Story = { ... };

// 4. Stări interactive (disabled, loading, error)
export const InteractiveStates: Story = { ... };

// 5. Use cases financiare (specific Budget App)
export const FinancialUseCases: Story = { ... };
```

### **3. Controls Configuration**
```typescript
argTypes: {
  variant: {
    control: 'select',
    options: ['primary', 'secondary', 'outline'],
    description: 'Stilul vizual al componentei'
  },
  size: {
    control: 'select',
    options: ['xs', 'sm', 'md', 'lg'],
    description: 'Mărimea componentei'
  },
  disabled: {
    control: 'boolean',
    description: 'Dezactivează componenta'
  }
}
```

## 🔄 DEVELOPMENT WORKFLOW

### **1. Crearea unei noi componente**
```bash
# 1. Creează componenta în primitives/
# 2. Scrie stories alături de componentă
# 3. Testează în Storybook înainte de integrare
# 4. Documentează use cases financiare
```

### **2. Modificarea unei componente existente**
```bash
# 1. Modifică componenta
# 2. Actualizează stories cu noile props/variante
# 3. Verifică că toate stories existente funcționează
# 4. Adaugă stories pentru funcționalitatea nouă
```

### **3. Design System Updates**
```bash
# 1. Actualizează design tokens stories
# 2. Verifică impactul asupra componentelor existente
# 3. Documentează breaking changes în stories
```

## 🧹 CLEANUP DEMO STORIES

### **Fișiere de șters (Storybook demo default)**
```
src/stories/Button.tsx           ← Fake button, nu al nostru
src/stories/Button.stories.ts    ← Demo stories
src/stories/Header.tsx           ← Demo header
src/stories/Header.stories.ts    ← Demo stories
src/stories/Page.tsx             ← Demo page
src/stories/Page.stories.ts      ← Demo stories
src/stories/*.css                ← Demo CSS files
```

### **Fișiere de păstrat**
```
src/stories/design-tokens/       ← Design system documentation
src/stories/Configure.mdx        ← Storybook intro (opțional)
src/stories/assets/              ← Assets pentru demo (opțional)
```

## 🎯 FINTECH SPECIFIC PATTERNS

### **Financial Component Stories**
```typescript
// Exemple pentru componente financiare
export const TransactionStates: Story = {
  render: () => (
    <div className="space-y-4">
      <Component variant="income">+1,234.56 RON</Component>
      <Component variant="expense">-567.89 RON</Component>
      <Component variant="transfer">Transfer: 200.00 RON</Component>
    </div>
  )
};

export const CurrencyFormatting: Story = {
  render: () => (
    <div className="space-y-2">
      <Component amount={1234.56} currency="RON" />
      <Component amount={5678.90} currency="EUR" />
      <Component amount={0} currency="RON" showZero />
    </div>
  )
};
```

### **Performance Testing Stories**
```typescript
// Pentru testarea performance cu date mari
export const LargeDataset: Story = {
  render: () => {
    const transactions = Array.from({ length: 1000 }, (_, i) => ({
      id: i,
      amount: Math.random() * 1000,
      type: ['income', 'expense'][Math.floor(Math.random() * 2)]
    }));
    
    return <Component data={transactions} />;
  }
};
```

## 🚀 COMMANDS

### **Development Commands**
```bash
# Start Storybook
pnpm --filter frontend storybook

# Build Storybook static
pnpm --filter frontend build-storybook

# Storybook cu specific port
pnpm --filter frontend storybook dev -p 6006
```

### **Integration în Workflow**
```bash
# Înainte de commit nou component
1. pnpm --filter frontend storybook
2. Verifică toate stories funcționează
3. Testează responsive behavior
4. Verifică accessibility (în viitor)
```

## 💡 TIPS & TRICKS

### **1. Fast Development**
- Folosește Storybook ca playground pentru componente noi
- Test props rapid fără să navighezi prin aplicație
- Debug style issues în izolare

### **2. Documentation**
- Stories = Living documentation
- Args descriptions = Component API docs
- Use cases = Implementation examples

### **3. Design System Consistency**
- Toate componentele trebuie stories
- Design tokens documentate și actualizate
- Pattern-uri consistent folosite în stories

---

**MOTTO**: "Storybook = Playground + Documentation + Quality Assurance"

## ⚡ COMMANDS & SHORTCUTS

### **Development Commands**
```bash
# Storybook development
pnpm --filter frontend storybook

# Storybook cu addon interactions (viitor)
pnpm --filter frontend storybook:interactions
```

### **Productivity Shortcuts**
```bash
# Quick component + stories creation (AI workflow)
1. AI: Creează componenta
2. AI: Scrie stories complete
3. Check în Storybook
4. Iterează dacă e necesar
```

## 🎯 SUCCESS METRICS

### **Storybook = Playground + Documentation + Quality Assurance**
- ✅ **Visual Feedback Loop**: Vezi imediat ce creează AI-ul
- ✅ **Zero App Dependencies**: Testează componente isolated
- ✅ **Interactive Documentation**: Living documentation pentru echipă  
- ✅ **Quality Gate**: Stories = minim quality standard pentru componente
- ✅ **Future-Ready**: Baza pentru testing automation și design handoff

**Motto: "No component without stories = No blind AI development"**

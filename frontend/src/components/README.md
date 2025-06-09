# Components Directory

```yaml
directory_type: "react_components"
organization: "atomic_design"
ai_friendly: true
last_updated: "2025-01-29"
navigation: true
```

## 📁 Directory Structure

```
components/
├── README.md                    # This navigation document
├── primitives/                  # 🧱 Atomic components
│   ├── Button/
│   │   ├── Button.tsx
│   │   ├── Button.test.tsx
│   │   └── README.md           # Component-specific docs
│   ├── PreferenceToggle/        # ✅ Example extensible component
│   │   ├── PreferenceToggle.tsx
│   │   ├── index.ts
│   │   └── EXTENSIBILITY.md    # Extension patterns
│   └── Toast/
│       └── README.md
└── features/                    # 🏗️ Business logic components
    ├── LunarGrid/
    │   ├── README.md           # LunarGrid system docs
    │   ├── ARCHITECTURE.md     # Technical architecture
    │   └── hooks/
    │       └── EXTENSIBILITY.md # Hook patterns
    └── CategoryEditor/
        └── README.md
```

## 🎯 Component Categories

### Primitives (`primitives/`)
**Purpose**: Reusable atomic components following Design System principles
**Pattern**: Generic, props-driven, no business logic
**Documentation**: Component API, usage examples, variants

### Features (`features/`)  
**Purpose**: Business-specific compound components
**Pattern**: Domain logic, state management, API integration
**Documentation**: Business context, integration patterns, extensibility

## 📐 Documentation Standards

### Component README Template
```markdown
# ComponentName

**Purpose**: Brief component description
**Category**: primitive | feature
**Dependencies**: List of dependencies

## API Reference
[Component props and types]

## Usage Examples
[Code examples]

## Variants & Patterns
[Different use cases]
```

### EXTENSIBILITY Template
```markdown
# ComponentName Extensibility

**Extension Points**: Where component can be extended
**Patterns**: Template code for common extensions
**Examples**: Real implementation examples
```

## 🔍 AI Assistant Guidelines

When working with components:

1. **CHECK** existing component README first
2. **FOLLOW** established patterns in category
3. **UPDATE** documentation when adding features
4. **CREATE** extensibility docs for reusable patterns
5. **MAINTAIN** consistent API design

## 📊 Component Inventory

### ✅ Well-Documented Components
- `PreferenceToggle` - Complete with extensibility patterns
- `LunarGrid` - Comprehensive architecture docs

### 🔄 Needs Documentation
- `Button` - API reference needed
- `Toast` - Usage patterns needed
- `CategoryEditor` - Business context needed

---

**AI Compatibility**: High - Structured navigation and clear patterns 
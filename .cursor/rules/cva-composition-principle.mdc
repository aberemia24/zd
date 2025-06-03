---
description:
globs:
alwaysApply: false
---
# 🎨 CVA Composition Principle

## **Ordinea de prioritate pentru styling changes:**

### **1. PRIMUL RESORT: Composition cu componente existente**
```typescript
// ✅ DO: Combină componente existente
const ComplexComponent = () => (
  <div className={cn(container({ variant: "elevated" }), flex({ direction: "col", gap: "md" }))}>
    <header className={cn(flex({ justify: "between", align: "center" }), "mb-4")}>
      <h1 className={button({ variant: "ghost", size: "lg" })}>Title</h1>
    </header>
  </div>
);

// ❌ DON'T: Creează componentă CVA specifică pentru fiecare combinație
export const complexHeader = cva("flex justify-between items-center mb-4", {
  variants: { /* specific variants */ }
});
```

### **2. AL DOILEA RESORT: Extinde componente existente cu variante noi**
```typescript
// ✅ DO: Extinde componenta existentă
export const modal = cva(baseStyles, {
  variants: {
    // existing variants...
    size: {
      default: "max-w-md",
      large: "max-w-2xl", 
      // ✅ Adaugă variante noi
      fullscreen: "w-screen h-screen",
      confirmation: "max-w-sm"
    }
  }
});

// ❌ DON'T: Creează componentă complet nouă
export const confirmationModal = cva("...", { /* duplicate logic */ });
```

### **3. ULTIMUL RESORT: Creează componente complet noi**
```typescript
// ✅ ONLY when: Logica este complet diferită și nu poate fi extinsă
export const specializedDataGrid = cva("...", {
  // Complet diferit de table/grid generic - justificat
});
```

## **🚨 Reguli de Code Review pentru CVA:**

### **Înainte de a crea o componentă CVA nouă, întreabă:**
1. **Pot folosi composition?** (`cn(existing1, existing2)`)
2. **Pot extinde o componentă existentă?** (adăugând variante)
3. **Este într-adevăr unic și justifică o componentă nouă?**

### **🔍 Red Flags - Evită aceste pattern-uri:**
```typescript
// ❌ Redundanță: Același comportament cu nume diferit
export const pageHeader = cva("flex justify-between items-center mb-6");
export const sectionHeader = cva("flex justify-between items-center mb-4");
// ✅ Fix: Folosește flex({ justify: "between", align: "center" }) + spacing classes

// ❌ Over-specification: Prea multe variante pentru use case limitat
export const buttonWithIconAndTooltipAndBadge = cva("...", {
  variants: { /* 20+ variants */ }
});
// ✅ Fix: button + badge + tooltip prin composition

// ❌ Single-use components: Folosit doar într-un loc
export const loginFormSubmitButton = cva("...");
// ✅ Fix: button({ variant: "primary", size: "lg" })
```

## **🎯 Consolidation Checklist:**

### **Înainte de merge/commit:**
- [ ] Am verificat componente CVA similare existente?
- [ ] Am încercat composition înainte de crearea componentei noi?
- [ ] Componenta nouă este folosită în minim 3 locații diferite?
- [ ] Variante noi pot fi adăugate la componente existente?
- [ ] Am documentat de ce e necesară componenta nouă?

### **Periodic cleanup (lunar):**
- [ ] Audit CVA files pentru componente single-use
- [ ] Identifică pattern-uri care pot fi consolidate
- [ ] Refactorizează către composition unde e posibil
- [ ] Update documentation pentru componente consolidate

## **📝 Documentation Standard:**

### **Pentru componente noi, documentează:**
```typescript
/**
 * SpecializedComponent - Justificare pentru existența acestei componente
 * 
 * RATIONALE: De ce nu putem folosi composition cu X + Y?
 * UNIQUE FEATURES: Ce face această componentă specific diferit?
 * USAGE FREQUENCY: Folosită în N+ locații: [...liste]
 * 
 * @example
 * // Composition alternative explored și rejected:
 * // cn(existing1, existing2) - nu funcționează din cauza...
 */
export const specializedComponent = cva(...)
```

## **🔄 Migration Strategy pentru cleanup:**

### **Pentru componente redundante:**
1. **Identifică toate usage-urile** componentei redundante
2. **Creează wrapper temporar** care folosește componenta consolidată
3. **Migrează usage-urile** progresiv
4. **Șterge componenta redundantă** după migration
5. **Update tests** și documentation

### **Exemple de consolidare tipice:**
```typescript
// Înainte: 5 componente separate
pageHeader, sectionHeader, cardHeader, modalHeader, formHeader

// După: 1 componentă flexibilă
flex({ justify: "between", align: "center" }) + contextual spacing/typography
```

---

**🎯 OBIECTIV:** Menține un sistem CVA curat, reutilizabil și ușor de întreținut prin composition inteligentă în loc de proliferarea componentelor specifice.

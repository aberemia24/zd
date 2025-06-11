---
description: Core project philosophy and development constraints for Budget App development
globs: **/*
alwaysApply: true
---

# 🎯 PRINCIPII ESENȚIALE - BUDGET APP PHILOSOPHY

## **🚨 REGULI FUNDAMENTALE OBLIGATORII**

### **1. ANTI-ENTERPRISE MANDATE**
- **"nu ne intereseaza enterprise level shit"** - ELIMINĂ pattern-uri enterprise
- **Zero tolerance** pentru over-engineering și complexity artificială
- **Focus pe soluții simple** care funcționează, nu showcase tehnic
- **Exemplu interzis**: Complex ARIA announcements, focus trap logic, performance monitoring în production pentru simple CRUD

### **2. SIMPLICITY OVER PERFECTION**
- **"nu vrem chestii complicate"** - Soluții directe și ușor de înțeles
- **Cod care se înțelege** de un developer junior cu AI assistance
- **Better done than perfect, but still done right**
- **Exemplu preferat**: 200 linii cod clar vs 800 linii "profesional"

### **3. TARGET DEVELOPER PROFILE**
- **"developer cu experienta limitata + AI assistance"** - Context obligatoriu
- **Cod readable** pentru AI tools și human developers  
- **Documentation** clară pentru colaborarea AI-human
- **Pattern-uri simple** care se învață rapid

### **4. WEB-FIRST OPTIMIZATION**
- **"aplicatie de web 100%, nu ne intereseaza mobil decat minim"**
- **Desktop web optimization** prioritar
- **Mobile support** doar când e trivial de implementat
- **Nu complica codul** pentru mobile edge cases

### **5. RESEARCH THOROUGHNESS**
- **"research thorough, nu superficial de 2-3 fisiere"**
- **Comprehensive analysis** a TUTUROR fișierelor relevante
- **Zero assumptions** despre funcționalitate existentă
- **Map existing patterns** înainte de implementare nouă

### **6. ZERO FUNCTIONALITY LOSS**
- **"sa nu pierdem functionalitate"** - Tolerance zero pentru feature regression
- **SAFE refactoring** cu verificare completă a dependencies
- **Incremental changes** cu testing la fiecare pas
- **Backup strategy** pentru orice modificare majoră

## **🎯 APLICARE ÎN PRACTICĂ**

### **Pentru Taskmaster Task Generation:**
- **Integrează principiile** în fiecare task generat
- **Flag complexity** care încalcă principiile anti-enterprise  
- **Target junior developer** în toate instrucțiunile
- **Emphasize simplicity** over best practices teoretice

### **Pentru Code Implementation:**
- **Review existing code** înainte de any changes (Research First)
- **Prefer extension** over rewrite când e posibil
- **Simple patterns** over enterprise abstractions
- **Web-optimized solutions** over universal ones

### **Pentru Architecture Decisions:**
- **Pragmatic over perfect** în toate deciziile
- **Maintainability** prioritară pentru team cu experiență limitată
- **Simple state management** over complex patterns
- **Clear data flow** over sophisticated abstractions

### **Pentru Documentation & Testing:**
- **AI-friendly documentation** pentru colaborare eficientă
- **Simple test strategies** care verifică funcționalitatea core
- **Clear examples** over comprehensive theoretical coverage
- **Focus pe use cases reale** din aplicația Budget

## **🚫 RED FLAGS - PATTERN-URI INTERZISE**

### **Enterprise Anti-Patterns:**
- Complex ARIA pentru simple forms
- Performance monitoring în development/production pentru simple apps
- Focus trap logic pentru basic modals  
- "Enhanced" prefixes peste tot
- Triple event handling pentru același action
- Memoization addiction (useMemo pentru strings static)

### **Over-Engineering Signs:**
- Componentă > 300 linii pentru simple editing
- 15+ props pentru basic functionality
- Complex validation pentru 3-field forms
- Smart positioning algorithms pentru centered modals
- Development validation > 10 linii

### **Complexity Without Justification:**
- Abstract factories pentru simple object creation
- Strategy patterns pentru 2-3 simple options
- Observer patterns pentru basic state updates
- Complex generics pentru simple type safety

## **✅ PREFERRED PATTERNS**

### **Simple React Patterns:**
- `useState` + `useEffect` over complex state managers pentru simple state
- Direct prop passing over complex context pentru shallow hierarchies  
- Simple conditional rendering over sophisticated display logic
- Basic event handlers over complex delegation patterns

### **TypeScript Simplicity:**
- Simple interfaces over complex type manipulations
- Direct imports over complex barrel exports
- Basic generics only when obvious benefit
- Explicit types over complex inference

### **Code Organization:**
- Flat component structure când e posibil
- Clear separation of concerns fără over-abstraction
- Simple utility functions over complex helpers
- Direct imports from shared-constants package

## **🎯 IMPLEMENTATION PRIORITY**

**HIGH PRIORITY (implement first):**
- Eliminate enterprise patterns din existing code
- Simplify over-engineered components (ex: EditableCell.tsx)
- Consolidate redundant hooks și utilities
- Clear complex validation logic

**MEDIUM PRIORITY (ongoing):**
- Refactor pentru AI-friendly patterns
- Improve documentation pentru junior + AI workflow
- Optimize pentru web-first experience
- Simplify state management patterns

**LOW PRIORITY (when needed):**
- Mobile considerations (doar când trivial)
- Advanced accessibility features (după core functionality)
- Performance optimizations (doar când measurements justify)
- Enterprise compliance features (doar la cerere explicită)

---

**MOTTO FINAL: "Better done than perfect, but still done right"**

*Aceste principii se aplică la TOATE operațiunile ROO: ask, architect, code, debug, test. Nu sunt sugestii - sunt constraints obligatorii pentru development philosophy-ul Budget App.* 
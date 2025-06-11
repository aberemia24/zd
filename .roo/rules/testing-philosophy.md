---
description: Testing philosophy and strategy for Budget App - focus on happy path and user experience over extensive coverage
globs: **/*test*, **/*spec*, **/testing/**/*
alwaysApply: true
---

# 🎯 TESTING PHILOSOPHY - BUDGET APP

## **🚨 REGULI FUNDAMENTALE TESTARE**

### **1. HAPPY PATH > EDGE CASES**
- **Focus pe scenarii reale** de utilizare, nu theoretical possibilities
- **Skip edge cases** foarte rare (leap year logic, extreme timeouts, etc.)
- **Common error scenarios** da, edge cases academice nu
- **Exemple valide**: Login, CRUD operations, form validation
- **Exemple skip**: Network timeouts extreme, date calculations edge cases

### **2. USER EXPERIENCE FOCUSED TESTING**
- **Behavioral testing** over CSS class testing
- **Teste care reflectă exact** ce vede utilizatorul  
- **Single source of truth**: Shared constants în teste (nu hardcoded strings)
- **Pattern**: Testează outcome-ul, nu implementation details

### **3. STRATEGIC SKIP STRATEGY**
- **100% success rate** > coverage absolută teoretică
- **"136 stable tests > 159 tests cu 13 eșuări constante"**
- **Skip cu documentare** pentru limitări tehnologice (JSDOM focus management)
- **Review regulat** a testelor skip-uite pentru re-enable potential

### **4. PRAGMATIC OVER PERFECT**
- **"Perfect is the Enemy of Good"** în testing
- **Consistency și reliability** > absolute coverage numbers
- **Automation pentru repetitive tasks** (3+ occurrences = script)
- **Strategic decision making**: timp vs valoare adăugată

## 📊 **METRICI PRIORITARE**

### **Success Rate Priority:**
- **Target**: 100% success rate (toate testele trec)
- **Preferință**: Skip test problematic vs accept failed test
- **Monitoring**: Track îmbunătățirile de la task la task
- **Standard**: Menținerea 100% success rate în toate fazele

### **Coverage Pragmatică:**
- **Focus**: Happy path și user journeys principale
- **Skip**: Edge cases fără impact UX real
- **Priority**: E2E pentru user flows > unit tests pentru implementation details
- **Quality**: Teste stabile și reliable > număr mare de teste fragile

## 🔧 **IMPLEMENTATION GUIDELINES**

### **Pentru Task Creation (Taskmaster):**
- **Test strategy** în task description = happy path + common errors
- **Skip explicit** edge cases în task details
- **Target UX scenarios**, nu technical implementation testing
- **Automation script** pentru pattern-uri repetitive de testare

### **Pentru Code Implementation:**
- **JSDOM limitations**: Skip în favor de E2E cu Playwright
- **Network edge cases**: Skip în favor de integration tests
- **Focus management complex**: Skip pentru browser-only testing
- **Date calculations extreme**: Skip în favor de common scenarios

### **Pentru Test Maintenance:**
- **Regular review** a testelor skip-uite (trimestrial)
- **Shared constants obligatorii** în teste (nu hardcoded strings)
- **Automation pentru cleanup** și refactoring repetitiv
- **Documentation clară** pentru fiecare test skip-uit (reason + future plan)

## 🎯 **TESTING WORKFLOW**

### **Before Writing Tests:**
1. **Identifică user scenarios** principale (happy path)
2. **Identifică common error cases** (not edge cases)
3. **Skip decision**: Edge case sau limitare tehnologică?
4. **Plan automation** pentru pattern-uri repetitive

### **During Implementation:**
- **Behavioral focus**: Ce vede user-ul în UI
- **Shared constants**: Import din @budget-app/shared-constants
- **Strategic skip**: Documentează reason și future plan
- **100% success target**: Fix or skip, nu accepta failed tests

### **After Implementation:**
- **Success rate validation**: Toate testele trec
- **Pattern identification**: Script-uri pentru tasks repetitive
- **Documentation update**: Lecții învățate în testing approach
- **Review skip list**: Potential re-enable pentru teste îmbunătățite

## 🚫 **ANTI-PATTERNS INTERZISE**

### **Nu Face:**
- ❌ **Edge cases over-engineering**: Teste pentru scenarii 0.1% probability
- ❌ **CSS class testing**: Teste care verifică clase Tailwind
- ❌ **Implementation details**: Teste pentru state management internal
- ❌ **Hardcoded strings**: String-uri hardcodate în expectations
- ❌ **Fragile tests**: Teste care eșuează din limitări tehnologice
- ❌ **Perfect coverage obsession**: 100% coverage cu teste instabile

### **Preferă:**
- ✅ **User journey testing**: Flow-uri complete de user experience
- ✅ **Happy path focus**: Scenarii pe care user-ii îi vor utiliza
- ✅ **Automation pentru repetitive**: Script-uri pentru tasks comune
- ✅ **Strategic skipping**: Skip cu plan clar pentru alternative
- ✅ **Stable foundation**: Teste care oferă încredere în codebase
- ✅ **Realistic scenarios**: Teste care reflectă utilizarea reală

## 📚 **REFERENCE EXAMPLES**

### **Good Test Strategy:**
```typescript
// ✅ Happy path user journey
describe('Transaction Creation Flow', () => {
  it('should allow user to create a transaction successfully', () => {
    // User fills form correctly
    // User submits
    // System saves and shows success
  });
  
  it('should handle common validation errors', () => {
    // Empty fields, invalid amounts
    // Show clear error messages
  });
});
```

### **Strategic Skip Example:**
```typescript
// ✅ Strategic skip cu documentare
describe.skip('Date Edge Cases - Skipped for E2E Coverage', () => {
  // Reason: Leap year logic edge cases are 0.1% probability
  // Future: Cover în integration tests cu real scenarios
  // Alternative: Playwright E2E pentru date validation flows
});
```

## 🎯 **TASKMASTER INTEGRATION**

**Pentru generarea de task-uri cu testing:**
- **Test strategy** = Happy path + common errors
- **Skip explicit** = Edge cases și limitări tehnologice  
- **Target metrics** = 100% success rate
- **Automation consideration** = Script pentru pattern-uri repetitive

**Philosophy**: Tests should build confidence in the codebase and reflect real user experience, not theoretical completeness. 
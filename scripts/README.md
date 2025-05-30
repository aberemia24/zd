# Scripts Documentation

Această documentație descrie script-urile utilitare disponibile în proiectul Budget App.

## 🔍 Verificări și Validări

### `validate-transaction-types.js`
**Actualizat** - Verifică că nu se folosesc transaction types hardcodate prin cod.

```bash
# Rulare directă
node scripts/validate-transaction-types.js

# Prin npm script
npm run check:transaction-types
```

**Ce verifică:**
- ✅ Detectează string-uri hardcodate: `'expense'`, `'income'`, `'saving'`
- ✅ Verifică fallback-uri problematice în funcții
- ✅ Scanează 183+ fișiere și 29k+ linii de cod
- ✅ Ignoră cazuri legitime (comentarii, CSS class states, teste)

**Exemplu problematic detectat:**
```typescript
// ❌ GREȘIT - va fi detectat
return (foundCategory?.type || "expense") as TransactionType;

// ✅ CORECT - nu va fi detectat
return (foundCategory?.type || TransactionType.EXPENSE) as TransactionType;
```

### `validate-constants.js`
Verifică consistența constantelor din shared-constants.

```bash
npm run validate:constants
```

### `validate-shared-constants-usage.js`
Verifică utilizarea corectă a constantelor shared între frontend și backend.

```bash
npm run validate:shared-constants
```

### `validate-data-testid-consistency.js`
Verifică consistența data-testid-urilor în componente și teste.

```bash
npm run validate:data-testid
```

### `validate-barrel-imports.js`
Verifică importurile barrel și structura modulelor.

```bash
npm run validate:barrel-imports
```

### `validate-console-cleanup.js`
Verifică că nu rămân console.log-uri în cod pentru production.

```bash
npm run validate:console-cleanup
```

### `validate-jsx-extensions.js`
Verifică că fișierele cu JSX folosesc extensia .tsx corectă.

```bash
npm run validate:jsx-extensions
```

### `validate-typescript-quality.js`
Verifică calitatea codului TypeScript.

```bash
npm run validate:typescript-quality
```

### `validate-all-automation.js`
Rulează toate validările automat.

```bash
npm run validate:all
```

## 🔄 Sincronizare

### `sync-shared-constants.js`
Sincronizează constantele din `shared-constants/` în `frontend/src/shared-constants/`.

```bash
# Rulare automată la dev/build
npm run sync-shared-constants
```

## 🎯 Script-uri Combinate

### `check:all`
Rulează toate verificările de calitate:

```bash
npm run check:all
# Echivalent cu:
# npm run check:transaction-types && npm run lint
```

### `validate:all`
Rulează toate validările automat:

```bash
npm run validate:all
# Rulează toate script-urile validate-*
```

### `validate:quick`
Rulează validările esențiale rapid:

```bash
npm run validate:quick
# Echivalent cu:
# npm run validate:constants && npm run validate:shared-constants && npm run validate:console-cleanup
```

## 📋 Rezultate

### ✅ Succes (Exit Code 0)
Script-ul se termină cu succes, nu au fost găsite probleme.

### ❌ Probleme (Exit Code 1)
Script-ul raportează probleme și se termină cu exit code 1 pentru CI/CD.

**Exemplu de output cu probleme:**
```
❌ PROBLEME GĂSITE:

📄 frontend/src/example.tsx:
   📍 Linia 95: 'expense' hardcodat
      🔧 Folosește TransactionType.EXPENSE în loc de 'expense'
      📖 Cod: return (foundCategory?.type || "expense")

💡 RECOMANDĂRI:
   1. Înlocuiește string-urile hardcodate cu TransactionType enum
   2. Importă TransactionType din @shared-constants
   3. Folosește TransactionType.EXPENSE în loc de "expense"
   4. Verifică fallback-urile și valorile default
```

## 🚀 Integrare CI/CD

Script-urile pot fi integrate în pipeline-uri CI/CD:

```yaml
# Example GitHub Actions
- name: Validate transaction types
  run: npm run check:transaction-types

- name: Run all validations
  run: npm run validate:all

- name: Run quick checks
  run: npm run validate:quick
```

## 🔧 Configurare Avansată

Pentru modificarea comportamentului script-urilor, editați configurația din fiecare script:

```javascript
// În validate-transaction-types.js
const CONFIG = {
  searchDirs: [...],           // Directoare de scanat
  extensions: [...],           // Extensii de fișiere
  problematicPatterns: [...],  // Pattern-uri problematice
  allowedPatterns: [...],      // Pattern-uri permise
  excludeFiles: [...]          // Fișiere de ignorat
};
```

---

💡 **Tip:** Adăugați `npm run validate:all` în pre-commit hooks pentru a preveni automat problemele! 
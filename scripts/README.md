# Scripts Documentation

Acest director conține script-uri utilitare pentru proiectul Budget App.

## 📝 Scripts Disponibile

### 1. `validate-constants.js`
**Scop**: Validează sincronizarea constants între shared-constants și frontend

**Comanda**: `npm run validate:constants` (din frontend/)

**Funcții**:
- Verifică existența directorului shared-constants
- Scanează fișierele test pentru string-uri hardcodate
- Detectează pattern-uri specifice care trebuie înlocuite cu constante

**Rezultat**: 
- ✅ PASSED dacă nu sunt găsite string-uri hardcodate
- ❌ FAILED cu detalii despre string-urile găsite

### 2. `fix-hardcoded-strings.js`
**Scop**: Automatizează fix-urile pentru string-uri hardcodate în fișierele test

**Comanda**: `npm run fix:hardcoded-strings` (din frontend/)

**Funcții**:
- Scanează recursiv toate fișierele `*.test.tsx` și `*.test.ts`
- Detectează 31 pattern-uri comune de string-uri hardcodate
- Înlocuiește automat cu constante din `TEST_CONSTANTS`
- Asigură importurile corecte `@shared-constants`

**Pattern-uri detectate**:
- Mesaje alerte: `"Acesta este un mesaj de alertă"` → `TEST_CONSTANTS.ALERTS.TEST_MESSAGE`
- Opțiuni select: `"Alege o opțiune"` → `TEST_CONSTANTS.SELECT.PLACEHOLDER`
- Mesaje eroare: `"Acest câmp este obligatoriu"` → `TEST_CONSTANTS.SELECT.REQUIRED_ERROR`
- Labels checkbox: `"Acceptă termenii"` → `TEST_CONSTANTS.CHECKBOX.LABEL`
- Și multe altele...

**Rezultat**: 
- Raport detaliat cu fișierele modificate
- Numărul de pattern-uri înlocuite
- Pași următori pentru validare

## 🚀 Flux de Lucru Recomandat

```bash
# 1. Rulează fix-urile automate
cd frontend && npm run fix:hardcoded-strings

# 2. Validează rezultatul
npm run validate:constants

# 3. Testează că totul funcționează
npm test

# 4. Commit changes
git add . && git commit -m "fix: eliminate hardcoded strings din tests"
```

## 🔧 Extinderea Script-urilor

Pentru a adăuga noi pattern-uri în `fix-hardcoded-strings.js`:

1. Adaugă constanta în `shared-constants/ui.ts` în secțiunea `TEST_CONSTANTS`
2. Actualizează `REPLACEMENTS` object cu noul pattern
3. Testează script-ul pe un fișier cu string-ul hardcodat

Exemplu:
```javascript
// În REPLACEMENTS object
"'Noul string hardcodat'": 'TEST_CONSTANTS.CATEGORIA.NOUA_CONSTANTA',
``` 
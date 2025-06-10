---
description: 
globs: 
alwaysApply: true
---
# 🎯 TASKMASTER WORKFLOW - REGULI OBLIGATORII

## 📋 VERIFICARE FUNCȚIONALITATE EXISTENTĂ

**OBLIGATORIU:** Înainte de a implementa orice task sau subtask nou, MEREU execută un research comprehensiv pentru a verifica dacă funcționalitatea există deja în proiect.

### Proces de Verificare Obligatoriu:
1. **Codebase Search**: Folosește `codebase_search` și `grep_search` pentru a căuta funcționalitate similară sau identică
2. **Pattern Analysis**: Verifică hook-uri existente, componente, store-uri, utils care ar putea fi reutilizate
3. **Integration Check**: Evaluează dacă funcționalitatea existentă poate fi:
   - Reutilizată direct (fără modificări)
   - Extinsă/îmbunătățită pentru noul use case
   - Migrată către un pattern mai generic/reutilizabil
   - Integrată cu alte componente existente

### Întrebări Standard de Verificare:
- Există componente/hook-uri similare în `components/features` sau `components/primitives`?
- Există pattern-uri în `stores/` care implementează funcționalitate similară?
- Există utils sau hooks care fac ceva asemănător?
- Poate fi funcționalitatea existentă generalizată pentru noul use case?
- Există teste care demonstrează funcționalitatea existentă?

### Acțiuni pe Baza Verificării:
- **Dacă EXISTĂ**: Reutilizează, extinde sau migrează - NU reimplementa
- **Dacă NU EXISTĂ**: Implementează nou dar verifică pattern-urile existente pentru consistență
- **Documentează** întotdeauna ce ai găsit și de ce ai ales abordarea respectivă

## 🛠️ PLANNING PRAGMATIC ȘI SAFE IMPLEMENTATION

### Planning Pragmatic (NU în Vid):
- **MEREU** identifică toate constantele, funcțiile, parametrii, clasele existente înainte de implementation
- **NU** inventa sau presupune - verifică ce există deja în codebase
- **ASIGURĂ-TE** că modificările sunt SAFE și nu afectează negativ restul aplicației
- **NU** elimina funcționalitate existentă fără să verifici dependencies
- **Abordare INCREMENTALĂ** și ATENTĂ pentru toate schimbările

### Best Practices Reale (NU Academic):
- **Industry best practices** = robust, ușor de implementat, util, performant
- **EVITĂ** over-engineering și enterprise-level complexity
- **EVITĂ** soluții academice care complică codebase-ul
- Suntem o aplicație indie făcută de un om cu AI
- **Prioritate**: funcționalitate practică, nu arhitectură perfectă

### Implementare Pragmatică:
- ✅ Soluții simple și eficiente în loc de pattern-uri complexe
- ✅ Code care se înțelege ușor și se menține simplu
- ✅ Performance real, nu optimizări premature
- ✅ Robusteță prin simplitate, nu prin complicație
- ✅ Utilitate practică pentru user, nu showcase tehnic

### Verificare Obligatorie:
- ✅ Toate dependencies și side effects identificate
- ✅ Impact assessment pentru modificări
- ✅ Backup plan pentru rollback dacă ceva se strică
- ✅ Test că funcționalitatea existentă rămâne intactă

## 🔧 REGULI TEHNICE SPECIFICE

### Shared Constants Sync:
- Pentru a rezolva problemele de import cu shared constants, MEREU rulează un build pentru a declanșa scriptul de sincronizare
- Comanda: `pnpm run build` în frontend/

### Memory Bank Files:
- Toate fișierele core Memory Bank se află în `memory-bank/` directory
- NU crea sau modifica aceste fișiere în afara acestui director

## 📚 EXEMPLE DE APLICARE

### Exemplu Recent - Task 10.2 (Keyboard Shortcuts):
- **Research**: A identificat `useKeyboardNavigation` în LunarGrid
- **Rezultat**: Migrare și consolidare în loc de reimplementare
- **Beneficiu**: Evitat duplicarea muncii, menținut backward compatibility

### Exemplu Recent - Task 10.3 (Breadcrumb):
- **Research**: A găsit CVA styling complet + constante UI
- **Rezultat**: Reutilizare și extindere a funcționalității existente
- **Beneficiu**: Implementare rapidă, consistentă cu sistemul

## 🎯 MOTTO

**"Better done than perfect, but still done right"**

Funcționalitate practică > Arhitectură perfectă
Simplitate robustă > Complexitate academică
Reutilizare inteligentă > Reimplementare din zero


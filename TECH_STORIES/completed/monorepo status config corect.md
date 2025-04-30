# Tech Story: Simplificarea strategiei de code sharing pentru constants/enums

## Problema
Actuala configurare de monorepo pentru partajarea constants/enums între frontend și backend introduce complexitate excesivă pentru un proiect dezvoltat de o singură persoană. Acest overhead de configurare și întreținere distrage de la dezvoltarea funcționalităților importante.

## Soluție propusă
Implementarea unei strategii simplificate pentru partajarea codului, bazată pe convenții și sincronizare manuală, păstrând structura de proiect actuală, dar eliminând complexitatea monorepo.

## Detalii implementare

### 1. Fișiere ce trebuie create

#### Crearea structurii `shared-constants` la nivelul root
```
/shared-constants/
├── enums.ts
├── transaction.schema.ts
├── validation.ts
└── index.ts
```

#### Conținut fișiere noi:

**`/shared-constants/index.ts`**
```typescript
// Barrel export pentru toate fișierele shared
export * from './enums';
export * from './transaction.schema';
export * from './validation';
```

**`/shared-constants/enums.ts`**
```typescript
// Copiat din shared/src/enums.ts
export enum TransactionType {
  INCOME = 'income',
  EXPENSE = 'expense',
  SAVING = 'saving',
  TRANSFER = 'transfer'
}

export enum CategoryType {
  INCOME = 'income',
  EXPENSE = 'expense',
  SAVING = 'saving'
}

export enum FrequencyType {
  DAILY = 'zilnic',
  WEEKLY = 'săptămânal',
  MONTHLY = 'lunar',
  YEARLY = 'anual'
}
```

**`/shared-constants/transaction.schema.ts`**
```typescript
// Copiat din shared/src/transaction.schema.ts
import { z } from 'zod';
import { TransactionType, CategoryType, FrequencyType } from './enums';

// Schema Zod pentru validarea tranzacțiilor
export const TransactionSchema = z.object({
  id: z.string().optional(),
  userId: z.string().optional(),
  type: z.nativeEnum(TransactionType),
  amount: z.union([z.string(), z.number()]).transform(val => 
    typeof val === 'string' ? parseFloat(val) : val),
  currency: z.string().default('RON'),
  date: z.string(),
  category: z.string(),
  subcategory: z.string().optional(),
  recurring: z.boolean().optional().default(false),
  frequency: z.nativeEnum(FrequencyType).optional()
}).refine(data => {
  // Dacă e recurent, trebuie să aibă și frecvență
  if (data.recurring && !data.frequency) {
    return false;
  }
  return true;
}, {
  message: "Tranzacțiile recurente trebuie să aibă frecvență specificată",
  path: ["frequency"]
});

export type TransactionValidated = z.infer<typeof TransactionSchema>;
```

**`/shared-constants/validation.ts`**
```typescript
// Reguli de validare comune între frontend și backend
export const VALIDATION_RULES = {
  AMOUNT_MIN: 0.01,
  AMOUNT_MAX: 1000000,
  DATE_REGEX: /^\d{4}-\d{2}-\d{2}$/,
  CATEGORY_MIN_LENGTH: 2,
  CATEGORY_MAX_LENGTH: 50
};
```

### 2. Fișiere ce trebuie modificate

#### Frontend

**`frontend/src/constants/index.ts`**
```typescript
// Importă din shared-constants
export * from '../../../shared-constants/enums';
export * from '../../../shared-constants/validation';
export * from '../../../shared-constants/transaction.schema';

// Importurile locale rămân neschimbate
export * from './defaults';
export * from './messages';
export * from './api';
export * from './ui';
```

**`frontend/src/constants/enums.ts`** (va fi șters ulterior)
```typescript
// DEPRECATED: Acest fișier va fi șters.
// Înlocuiește orice import de aici cu import din constants/index.ts
export * from '../../../shared-constants/enums';
```

**`frontend/src/types/transaction.ts`**
```typescript
// Importurile din shared se modifică pentru a folosi shared-constants
import { TransactionValidated, TransactionSchema } from '../../../shared-constants/transaction.schema';
import { TransactionType, CategoryType, FrequencyType } from '../../../shared-constants/enums';

// Restul fișierului rămâne neschimbat
export type Transaction = {
  _id?: string;
  id?: string;
  // ...
};
```

**`frontend/tsconfig.json`**
```json
{
  "compilerOptions": {
    // Eliminăm path mapping-ul pentru shared
    "paths": {
      // Păstrăm alte path mappings dacă există
    }
  },
  "include": ["src"]
}
```

#### Backend

**`backend/src/constants/index.ts`**
```typescript
// Importă din shared-constants
export * from '../../../shared-constants/enums';
export * from '../../../shared-constants/validation';
export * from '../../../shared-constants/transaction.schema';

// Importurile locale rămân neschimbate
export * from './api';
export * from './defaults';
export * from './messages';
```

**`backend/src/transaction.controller.ts`**
```typescript
import { Body, Controller, Delete, Get, Param, Post, Put, /*...*/ } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { z } from 'zod';
// Modificăm importul
import { TransactionSchema } from '../../shared-constants/transaction.schema';

@Controller('transactions')
export class TransactionController {
  // Restul codului rămâne neschimbat
}
```

**`backend/src/transaction.service.ts`**
```typescript
import { Injectable } from '@nestjs/common';
// Modificăm importul
import { TransactionValidated } from '../../shared-constants/transaction.schema';

@Injectable()
export class TransactionService {
  // Restul codului rămâne neschimbat
}
```

**`backend/tsconfig.json`**
```json
{
  "compilerOptions": {
    // Eliminăm path mapping-ul pentru shared
    "paths": {
      // Păstrăm doar alte path mappings dacă există
    }
  },
  "exclude": [
    // Eliminăm "../shared" din exclude
    "node_modules",
    "dist",
    "**/*.spec.ts",
    "**/*.test.ts",
    "../frontend",
    "../**/__tests__/**",
    "../**/*.test.ts",
    "../**/*.spec.ts"
  ]
}
```

#### Root package.json

**`package.json`**
```json
{
  "name": "budget-app",
  "private": true,
  "workspaces": [
    "frontend",
    "backend"
    // Eliminăm "shared" din workspaces
  ],
  "scripts": {
    "validate:constants": "node ./tools/validate-constants.js",
    "pretest": "npm run validate:constants",
    "lint": "eslint . --ext .js,.jsx,.ts,.tsx",
    "format": "prettier --write .",
    "test": "echo 'Define test scripts in packages'"
  },
  // Restul package.json rămâne neschimbat
}
```

### 3. Fișiere pentru validare

**`/tools/validate-constants.js`**
```javascript
const fs = require('fs');
const path = require('path');

// Verifică dacă fișierele shared-constants există și sunt importate corect
function validateConstantsSync() {
  console.log('Validating shared constants synchronization...');
  
  const sharedFolder = path.resolve(__dirname, '../shared-constants');
  const frontendConstants = path.resolve(__dirname, '../frontend/src/constants/index.ts');
  const backendConstants = path.resolve(__dirname, '../backend/src/constants/index.ts');
  
  // Verifică existența fișierelor
  if (!fs.existsSync(sharedFolder)) {
    console.error('Error: shared-constants folder does not exist!');
    process.exit(1);
  }
  
  if (!fs.existsSync(frontendConstants)) {
    console.error('Error: frontend constants index does not exist!');
    process.exit(1);
  }
  
  if (!fs.existsSync(backendConstants)) {
    console.error('Error: backend constants index does not exist!');
    process.exit(1);
  }
  
  // Verifică importurile în frontend
  const frontendContent = fs.readFileSync(frontendConstants, 'utf8');
  if (!frontendContent.includes('shared-constants/enums')) {
    console.error('Error: frontend does not import shared enums!');
    process.exit(1);
  }
  
  // Verifică importurile în backend
  const backendContent = fs.readFileSync(backendConstants, 'utf8');
  if (!backendContent.includes('shared-constants/enums')) {
    console.error('Error: backend does not import shared enums!');
    process.exit(1);
  }
  
  console.log('✅ Shared constants validation passed!');
}

validateConstantsSync();
```

### 4. Documentație

**`BEST_PRACTICES.md`** (adăugare secțiune nouă)
```markdown
## Code Sharing între Frontend și Backend

### Convenție pentru constants și enums

- Toate constants și enums partajate între frontend și backend se definesc în `/shared-constants/`
- Structura folderului shared-constants:
  - `enums.ts` - enumerări comune (TransactionType, CategoryType, etc.)
  - `transaction.schema.ts` - schema Zod și tipuri derivate
  - `validation.ts` - reguli de validare partajate
  - `index.ts` - barrel pentru exporturi

### Import și utilizare

- CORECT: Import din barrel-ul local pentru simplicitate:
  ```typescript
  import { TransactionType, CategoryType } from '../constants';
  ```

- INCORECT: Import direct din shared-constants (evită path traversal excesiv):
  ```typescript
  import { TransactionType } from '../../../shared-constants/enums';
  ```

### Modificarea enums/constants partajate

1. Modifică direct fișierul în `/shared-constants/`
2. Testează atât frontend, cât și backend pentru a asigura compatibilitatea
3. Documentează modificarea în DEV_LOG.md
4. Rulează `npm run validate:constants` pentru a confirma sincronizarea

### Responsabilitate și ownership

- Orice modificare la enums/constants partajate trebuie să respecte backward compatibility
- Deprecation: Marchează explicit constantele deprecated cu comentarii și păstrează-le temporar
- Anunță orice modificare majoră în commit message
```

### 5. Fișiere ce trebuie șterse

- Întregul folder `shared/` cu toate fișierele incluse
- `frontend/src/constants/enums.ts` (după migrare și testare)
- Orice referință la `shared` din configurații, scripturi și imports

## Plan de implementare

### Pasul 1: Setup inițial
1. Creează folderul `shared-constants` la nivel de root cu structura indicată
2. Copiază conținutul din `shared/src/enums.ts`, `shared/src/transaction.schema.ts` în fișierele noi
3. Creează `shared-constants/index.ts` pentru barrel exports
4. Creează `tools/validate-constants.js` pentru validare

### Pasul 2: Update frontend
1. Actualizează `frontend/src/constants/index.ts` pentru a importa din shared-constants
2. Modifică toate importurile directe din shared pentru a folosi barrel
3. Actualizează tsconfig.json pentru a elimina path mappings pentru shared
4. Testează că totul funcționează: `cd frontend && npm test`

### Pasul 3: Update backend
1. Actualizează `backend/src/constants/index.ts` pentru a importa din shared-constants
2. Modifică toate importurile directe din shared pentru a folosi barrel
3. Actualizează tsconfig.json pentru a elimina path mappings pentru shared
4. Testează că totul funcționează: `cd backend && npm test`

### Pasul 4: Cleanup și finalizare
1. Rulează validarea: `npm run validate:constants`
2. Actualizează root package.json pentru a elimina shared din workspaces
3. Șterge folderul `shared/` și fișierul `frontend/src/constants/enums.ts`
4. Actualizează documentația în BEST_PRACTICES.md
5. Adaugă o intrare în DEV_LOG.md
6. Testează întreaga aplicație

## Riscuri și mitigare
1. **Compilare fracturată:** Testează atât frontend cât și backend după fiecare schimbare
2. **Importuri incomplete:** Folosește scriptul de validare pentru a verifica sincronizarea
3. **Regresii:** Rulează suite-urile de teste complete înainte și după migrare pentru a compara
4. **Incompatibilități:** Păstrează backup-ul folderului shared până când totul este confirmat funcțional

## Estimare: 2 SP (poate fi completat într-o zi de lucru)
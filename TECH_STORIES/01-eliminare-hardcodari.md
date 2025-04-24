# Tech Story: Eliminarea hardcodărilor și crearea unui sistem de constante

## Descriere
Ca dezvoltator, vreau să elimin toate valorile hardcodate din aplicație și să implementez un sistem robust de constante, pentru a îmbunătăți mentenabilitatea, a facilita localizarea și a reduce riscul de erori cauzate de inconsistențe.

## Motivație
- Valorile hardcodate sunt dificil de modificat global și pot duce la inconsistențe
- Textele hardcodate complică procesul de localizare și internaționalizare
- Valorile default repetate în cod creează redundanță și măresc riscul de erori

## Cerințe

### 1. Structură și organizare
- [x] ~~Creează un director dedicat `constants/` în `frontend/src/` cu următoarea structură:~~
  ```
  constants/
  ├── api.ts           # Constante legate de API (URL-uri, parametri)
  ├── defaults.ts      # Valori default (limită, offset, etc.)
  ├── enums.ts         # Enumerări pentru tipuri, frecvențe, etc.
  ├── index.ts         # Punct central de export pentru toate constantele
  ├── messages.ts      # Mesaje de succes/eroare (extinderea fișierului existent)
  ├── ui.ts            # Texte UI (butoane, etichete, placeholder-uri)
  └── validation.ts    # Mesaje și reguli de validare
  ```

> **[2025-04-24]** Structura și fișierele pentru sistemul de constante au fost create cu succes. Urmează extragerea valorilor default și a textelor hardcodate din componente.

### 2. Centralizarea valorilor default
- [x] Identifică și extrage toate valorile default în `defaults.ts`:
  - Valori de paginare (limită, offset)
  - Valori implicite pentru monedă, formate dată, etc.
  - Stare inițială pentru formulare
  - Orice altă valoare default repetitivă

> **[2025-04-25]** Toate valorile default (paginare, monedă, sortare, form state) au fost extrase din App.tsx și centralizate în constants/defaults.ts. Importurile și folosirea acestora sunt acum standardizate.

### 3. Enumerări pentru tipuri și categorii
- [x] Enumerări pentru tipuri de tranzacții și categorii principale extrase și folosite în `enums.ts` (`CategoryType`, `TransactionType`).
- [x] Toate referințele din `TransactionForm` și testele aferente folosesc enumurile corect (chei calculate, fără hardcodări, sincronizare perfectă UI + teste).
  > **[2025-04-24]** Refactorizarea și fixarea TransactionForm cu enumuri și chei calculate a fost finalizată cu succes. Toate erorile de sintaxă și tip au fost eliminate.
- [x] Extragere și folosire enumuri pentru tipuri de frecvență (`DAILY`, `WEEKLY`, etc.) în `enums.ts` + refactorizare în componentele relevante (statusurile nu sunt necesare în frontend deocamdată).
- [x] Refactorizare similară pentru toate componentele care folosesc tipuri/categorii tranzacții (TransactionFilters, TransactionTable, teste etc.).

### 4. Constante pentru API

- [x] Extrage în `api.ts` toate constantele legate de API:
  - URL-uri de bază pentru API
  - Endpoint-uri specifice
  - Nume de query params
  - Nume de headere
  - Timeout-uri și limite de retry
    > [2025-04-24] Task finalizat: endpointuri explicite, query params centralizați, headere extensibile, timeout și retry configurabile. Pattern robust, fără hardcodări, ușor de extins/testat.

### 5. Texte UI
- [x] Extrage toate textele UI în `ui.ts`:
  - Etichete pentru form-uri
  - Texte pentru butoane
  - Placeholder-uri
  - Titluri și subtitluri
  - Texte pentru tabelul de tranzacții
  - Texte pentru filtre

> Toate textele UI vizibile au fost extrase și centralizate în `constants/ui.ts`, inclusiv pentru filtre, tabele, form-uri și butoane. Nicio componentă nu mai conține string-uri hardcodate pentru UI.

### 6. Mesaje utilizator
- [x] Extinde fișierul existent `messages.ts` cu:
  - Toate mesajele de eroare
  - Toate mesajele de succes
  - Toate mesajele de avertizare
  - Prompturi pentru utilizator
> Toate mesajele de eroare, succes, avertizare și prompturi au fost extrase și centralizate în `constants/messages.ts`. Nicio componentă nu mai conține string-uri hardcodate pentru aceste mesaje.

### 7. Refactorizarea codului pentru a utiliza noile constante
- [x] Refactorizează `App.tsx`:
  - Înlocuiește toate valorile hardcodate cu referințe la constante
  - Înlocuiește toate textele hardcodate cu referințe la constante
  > Toate textele vizibile, opțiunile, labelurile, butoanele și valorile default au fost centralizate. Nu mai există string-uri hardcodate pentru UI sau mesaje în App.tsx.

- [x] Refactorizează `TransactionForm.tsx`:
  - Înlocuiește valorile default hardcodate
  - Înlocuiește tipurile și opțiunile hardcodate
  - Înlocuiește mesajele și textele hardcodate
  > Toate labelurile, placeholder-ele, butoanele, opțiunile și mesajele folosesc constante. Nu mai există string-uri hardcodate pentru UI sau mesaje.

- [x] Refactorizează `TransactionTable.tsx`:
  - Înlocuiește headerele de tabel hardcodate
  - Înlocuiește textele de paginare hardcodate
  - Înlocuiește valorile default hardcodate
  > Headerele de tabel, textele de paginare, butoanele și mesajele de stare folosesc constante. Nu mai există string-uri hardcodate pentru UI.

- [x] Refactorizează `TransactionFilters.tsx`:
  - Înlocuiește opțiunile hardcodate
  - Înlocuiește textele etichetelor
  > Toate labelurile, placeholder-ele și opțiunile folosesc constante. Nu există string-uri hardcodate pentru UI.

### 8. Refactorizarea testelor ✅ (FINALIZAT 2025-04-24)

Toate testele au fost refactorizate pentru a utiliza constantele centralizate:
- Aserțiunile folosesc doar constante, nu stringuri hardcodate
- Mockurile utilizează constante pentru URL-uri și parametri
- Valorile de test folosesc constantele default

Status: **FINALIZAT**
Commit: Centralizare completă texte UI, helpers și convenții testare: fără hardcodări, totul DRY, documentat în BEST_PRACTICES.md și DEV_LOG.md

### 9. Curățare și verificare
- [ ] Verifică întreaga bază de cod pentru hardcodări rămase
- [ ] Asigură-te că toate importurile sunt corecte și optimizate
- [ ] Verifică că testele trec după modificări
- [ ] Verifică funcționalitatea aplicației după modificări

## Definiția de "Gata"
- Toate valorile hardcodate au fost înlocuite cu referințe la constante
- Toste testele trec cu succes
- Aplicația funcționează identic cu înainte
- Nu există referințe directe la URL-uri, endpoint-uri, sau valori default în cod
- Structura de constante este bine documentată și ușor de înțeles
- Importurile de constante sunt optimizate pentru tree-shaking

## Considerații tehnice
- Folosește TypeScript pentru a defini tipurile pentru constante și enumerări
- Asigură-te că structura de export faciliteză tree-shaking (evită export * from './file')
- Pentru enumerări, consideră diferitele tipuri (string enums vs. numeric enums) și alege tipul potrivit
- Evaluează dacă unele constante ar trebui să fie configurabile (posibil mutate într-un fișier de configurare)

## Impact
- Reducerea datoriei tehnice
- Îmbunătățirea mentenabilității
- Ușurarea procesului de localizare viitoare
- Reducerea riscului de erori cauzate de inconsistențe

## Timp estimat
- 1-2 zile pentru implementare completă (include refactorizare și testare)

## Exemplu de implementare
### api.ts
```typescript
export const API = {
  BASE_URL: '/transactions',
  ENDPOINTS: {
    GET_ALL: '',
    GET_ONE: (id: string) => `/${id}`,
    CREATE: '',
    UPDATE: (id: string) => `/${id}`,
    DELETE: (id: string) => `/${id}`,
  },
  QUERY_PARAMS: {
    TYPE: 'type',
    CATEGORY: 'category',
    DATE_FROM: 'dateFrom',
    DATE_TO: 'dateTo',
    LIMIT: 'limit',
    OFFSET: 'offset',
    SORT: 'sort',
  },
  DEFAULT_HEADERS: {
    'Content-Type': 'application/json',
  },
};
```

### enums.ts
```typescript
export enum TransactionType {
  INCOME = 'income',
  EXPENSE = 'expense',
  SAVING = 'saving',
}

export enum FrequencyType {
  DAILY = 'zilnic',
  WEEKLY = 'săptămânal',
  MONTHLY = 'lunar',
  YEARLY = 'anual',
}

export enum CategoryType {
  INCOME = 'VENITURI',
  EXPENSE = 'CHELTUIELI',
  SAVING = 'ECONOMII',
}
```

### defaults.ts
```typescript
export const PAGINATION = {
  DEFAULT_LIMIT: 10,
  DEFAULT_OFFSET: 0,
  DEFAULT_SORT: 'date',
};

export const FORM_DEFAULTS = {
  CURRENCY: 'RON',
  DATE_FORMAT: 'YYYY-MM-DD',
};

export const INITIAL_FORM_STATE = {
  type: '',
  amount: '',
  category: '',
  subcategory: '',
  date: '',
  recurring: false,
  frequency: '',
};
```

### ui.ts
```typescript
export const LABELS = {
  TYPE: 'Tip',
  AMOUNT: 'Sumă',
  CATEGORY: 'Categorie',
  SUBCATEGORY: 'Subcategorie',
  DATE: 'Dată',
  RECURRING: 'Recurent',
  FREQUENCY: 'Frecvență',
};

export const PLACEHOLDERS = {
  SELECT: 'Alege',
  AMOUNT: 'Introdu suma',
  DATE: 'Selectează data',
};

export const BUTTONS = {
  ADD: 'Adaugă',
  EDIT: 'Editează',
  DELETE: 'Șterge',
  NEXT_PAGE: 'Înainte',
  PREV_PAGE: 'Înapoi',
};

export const TABLE = {
  HEADERS: {
    TYPE: 'Tip',
    AMOUNT: 'Sumă',
    CURRENCY: 'Monedă',
    CATEGORY: 'Categorie',
    SUBCATEGORY: 'Subcategorie',
    DATE: 'Dată',
    RECURRING: 'Recurent',
    FREQUENCY: 'Frecvență',
  },
  EMPTY: 'Nicio tranzacție',
  LOADING: 'Se încarcă...',
  PAGE_INFO: 'Pagina {current} din {total}',
};
```

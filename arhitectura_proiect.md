# ARHITECTURA PROIECT: Budget App Monorepo

📁 Structură Generală
📁 root/
├── 📁 frontend/                # Aplicația React + React Query + Zustand + TailwindCSS
├── 📁 backend/                 # API NestJS + Supabase
├── 📁 shared-constants/        # Sursa unică pentru constants, enums, tipuri partajate
├── 📄 package.json             # Configurație npm pentru monorepo (workspaces)
├── 📄 README.md                # Documentație generală a proiectului
└── 📄 BEST_PRACTICES.md        # Convenții și bune practici de dezvoltare
📁 shared-constants/

Rol: Sursa unică de adevăr pentru toate constantele, enum-urile și tipurile partajate între frontend și backend.

📁 shared-constants/
├── 📄 index.ts                 # Barrel export pentru toate constantele 
├── 📄 enums.ts                 # Definiții pentru TransactionType, FrequencyType, etc.
├── 📄 defaults.ts              # Valori default pentru aplicație (PAGINATION, FORM_DEFAULTS)
├── 📄 messages.ts              # Toate mesajele de utilizator (MESAJE)
├── 📄 ui.ts                    # Texte UI pentru etichete, butoane, etc.
├── 📄 api.ts                   # Constante legate de API (rute, headere)
├── 📄 validation.ts            # Reguli și mesaje de validare
├── 📄 categories.ts            # Definiții categorii/subcategorii
├── 📄 category-mapping.ts      # Mapare între categorii și tipuri tranzacții
├── 📄 queryParams.ts           # Chei standard pentru parametrii query
└── 📄 transaction.schema.ts    # Schema Zod pentru validare tranzacții

# Dependențe cheie:
index.ts - Exportă toate constantele, folosit pentru importuri în frontend/backend
Toate fișierele frontend/backend care folosesc constante trebuie să le importe prin @shared-constants
Excel_grid.ts - Constante pentru vizualizarea tip grid a datelor financiare
QUERY_KEYS.ts - Chei pentru React Query

📁 frontend/

Rol: Aplicația web React cu React Query pentru server state, Zustand pentru UI state și TailwindCSS pentru stilizare
📁 frontend/src/
📁 frontend/src/
├── 📄 index.tsx                # Punct de intrare aplicație React
├── 📄 App.tsx                  # Componenta root, configurare rutare și React Query Provider
├── 📁 components/              # Componente React organizate ierarhic
│   ├── 📁 primitives/          # Componente de bază, reutilizabile
│   └── 📁 features/            # Componente business specifice
├── 📁 pages/                   # Pagini principale
├── 📁 stores/                  # State management Zustand (doar pentru UI state)
├── 📁 services/                # Servicii pentru API și operațiuni externe
│   ├── 📁 hooks/               # Hooks specializate React Query
│   └── 📁 __mocks__/           # Mockuri pentru testare
├── 📁 utils/                   # Utilitare și funcții de calcul reutilizabile
├── 📁 lunarGrid/               # Module pentru funcționalitatea LunarGrid
│   ├── 📄 index.ts           # Barrel export pentru toate utilitarele LunarGrid
│   ├── 📄 calculations.ts     # Funcții de calcul pentru sume zilnice și solduri cu memorare
│   ├── 📄 formatters.ts       # Funcții de formatare pentru valori monetare și date
│   └── 📄 dataTransformers.ts # Transformări de date pentru structura tabelului
├── 📁 styles/                  # Stiluri, theme tokens și utilitare CSS
│   ├── 📁 componentMap/        # Configurări pentru componente cu getEnhancedComponentClasses
│   ├── 📄 theme.ts             # Definiții tokens de design
│   ├── 📄 themeTypes.ts        # Tipuri pentru sistemul de design
│   ├── 📄 themeUtils.ts        # Utilitare pentru stilizare
│   └── 📄 componentMapIntegration.ts # Integrare componentMap cu sistemul de stiluri
└── 📁 types/                   # Tipuri TypeScript pentru aplicație
📁 frontend/src/components/primitives/
Rol: Componente reutilizabile de bază (UI Kit)
📁 frontend/src/components/primitives/
├── 📁 Button/
│   ├── 📄 Button.tsx           # Componentă button cu variante
│   └── 📄 index.ts             # Re-export simplu
├── 📁 Input/
│   ├── 📄 Input.tsx            # Input text cu state controlat
│   └── 📄 index.ts
├── 📁 Select/
│   ├── 📄 Select.tsx           # Dropdown select cu opțiuni
│   └── 📄 index.ts
├── 📁 Checkbox/
│   ├── 📄 Checkbox.tsx         # Checkbox cu label
│   └── 📄 index.ts
├── 📁 Textarea/
│   ├── 📄 Textarea.tsx         # Text area multi-line
│   └── 📄 index.ts
├── 📁 Alert/
│   ├── 📄 Alert.tsx            # Mesaj alert cu variante
│   └── 📄 index.ts
├── 📁 Badge/
│   ├── 📄 Badge.tsx            # Badge pentru indicatori
│   └── 📄 index.ts
├── 📁 Loader/
│   ├── 📄 Loader.tsx           # Indicator loading
│   └── 📄 index.ts
└── 📄 Spinner.tsx              # Component simplu de loading
Dependențe cheie:

Toate folosesc @shared-constants pentru texte, token-uri de design
Folosesc classNames pentru condiționare clase CSS
Utilizează constante din styles/theme.ts și utilitare din styles/themeUtils.ts
Componentele LunarGrid sunt optimizate cu React.memo și virtualizare TanStack

📁 frontend/src/components/features/
Rol: Componente specifice businessului
📁 frontend/src/components/features/
├── 📁 TransactionForm/
│   ├── 📄 TransactionForm.tsx  # Formular adăugare/editare tranzacții
│   └── 📄 index.ts
├── 📁 TransactionTable/
│   ├── 📄 TransactionTable.tsx # Tabel afișare tranzacții cu infinite loading
│   └── 📄 index.ts
├── 📁 TransactionFilters/
│   ├── 📄 TransactionFilters.tsx # Filtre pentru tranzacții
├── 📁 LunarGrid/
│   ├── 📄 LunarGridTanStack.tsx # Vizualizare grid lunară bazată pe TanStack Table
│   ├── 📄 TanStackSubcategoryRows.tsx # Componente pentru afișarea subcategoriilor în grid (optimizate cu React.memo)
│   ├── 📄 index.ts
│   ├── 📁 hooks/
│   │   └── 📄 useLunarGridTable.tsx # Hook pentru gestionarea stării și logicii tabelului virtualizat
│   └── 📁 types/
│       └── 📄 index.ts # Tipuri și interfețe pentru LunarGrid
│   └── 📄 index.ts
├── 📁 CategoryEditor/
│   ├── 📄 CategoryEditor.tsx   # Editor pentru categorii și subcategorii
│   └── 📄 index.ts
└── 📁 Auth/
    ├── 📄 LoginForm.tsx        # Formular autentificare
    └── 📄 RegisterForm.tsx     # Formular înregistrare
Dependențe cheie:

TransactionForm.tsx → useTransactionFormStore, useTransactionMutations (React Query)
TransactionTable.tsx → useInfiniteTransactions (React Query)
LunarGrid.tsx → useMonthlyTransactions (React Query), useCategoryStore
CategoryEditor.tsx → useCategoryStore
Toate utilizează componente primitive și constante din @shared-constants

📁 frontend/src/pages/
Rol: Pagini principale pentru rutare
📁 frontend/src/pages/
├── 📄 TransactionsPage.tsx     # Pagina principală cu tranzacții și formular
├── 📄 LunarGridPage.tsx        # Pagina grid lunar
└── 📄 OptionsPage.tsx          # Pagina opțiuni și gestionare categorii
Dependențe cheie:

TransactionsPage.tsx → TransactionTable, TransactionForm, TransactionFilters, useInfiniteTransactions
LunarGridPage.tsx → LunarGrid, useMonthlyTransactions
OptionsPage.tsx → CategoryEditor
Toate utilizează useAuthStore pentru verificare autentificare

📁 frontend/src/stores/
Rol: State management cu Zustand (UI state only)
📁 frontend/src/stores/
├── 📄 transactionFormStore.ts  # State formular tranzacții
├── 📄 categoryStore.ts         # Gestiune categorii personalizate 
└── 📄 authStore.ts             # Autentificare și sesiune
Funcții și dependențe cheie:

transactionFormStore.ts:

setFormField(): Actualizează câmpuri formular
validateForm(): Validare date formular
resetForm(): Reset formular
Dependențe: @shared-constants/messages.ts


authStore.ts:

login(), register(), logout(): Funcții autentificare
checkUser(): Verifică sesiune curentă
Dependențe: supabaseAuthService, services/supabaseAuthService.ts


categoryStore.ts:

loadUserCategories(): Încarcă categorii personalizate
mergeWithDefaults(): Fuzionează cu categorii predefinite
renameSubcategory(), deleteSubcategory(): Operații CRUD
Dependențe: categoryService, services/categoryService.ts



📁 frontend/src/services/
Rol: Servicii pentru comunicare API, hooks React Query și operații externe

#### [2025-05] Pattern hooks tranzacții: bulk vs. infinite loading
- Pentru tranzacții există două hooks specializate:
  - `useMonthlyTransactions`: încarcă toate tranzacțiile pe lună (bulk, pentru grid lunar).
  - `useInfiniteTransactions`: infinite loading cu paginare (pentru tabel).
- Ambele folosesc aceeași cheie de cache (`['transactions']`) pentru invalidare globală la orice mutație (add/edit/delete).
- Fiecare hook are responsabilitate unică; duplicarea logicii este interzisă (vezi și `BEST_PRACTICES.md`).
- Orice extensie (filtre, sortări) trebuie să păstreze această separare și cache-ul partajat.
- Exemplu canonical: vezi implementările actuale în `frontend/src/services/hooks/`.

├── 📄 supabase.ts              # Configurare client Supabase
├── 📄 supabaseService.ts       # Operații CRUD pentru tranzacții
├── 📄 supabaseAuthService.ts   # Autentificare prin Supabase
├── 📄 categoryService.ts       # Operații CRUD pentru categorii 
├── 📁 hooks/                   # Hooks specializate React Query
│   ├── 📄 useMonthlyTransactions.ts  # Hook pentru tranzacții lunare (bulk)
│   ├── 📄 useInfiniteTransactions.ts # Hook pentru infinite loading
│   ├── 📄 useTransactionMutations.ts # Hook pentru mutații (create/update/delete)
│   └── 📄 index.ts             # Barrel export pentru hooks
└── 📁 __mocks__/               # Mockuri pentru testare servicii
    ├── 📄 supabase.ts          # Mock pentru Supabase client
    └── 📄 supabaseService.ts   # Mock pentru serviciul Supabase
```

Funcții și dependențe cheie:

supabaseService.ts:

fetchTransactions(): Obține tranzacții cu filtre
createTransaction(), updateTransaction(), deleteTransaction()
Dependențe: supabase.ts, @shared-constants/transaction.schema.ts


supabaseAuthService.ts:

login(), register(), logout(), getCurrentUser()
Dependențe: supabase.ts, @shared-constants/messages.ts


categoryService.ts:

getUserCategories(), saveUserCategories()
handleSubcategoryDeletion(), updateTransactionsForSubcategoryRename()
Dependențe: supabase.ts, types/Category.ts



📁 frontend/src/styles/
Rol: Sistem de design, tema și utilitare CSS
📁 frontend/src/styles/
├── 📄 theme.ts                 # Definiții tokens de design (culori, spațiere)
├── 📄 themeTypes.ts            # Tipuri TypeScript pentru sistemul de design
├── 📄 themeUtils.ts            # Funcții utilitare pentru aplicare temă
├── 📄 componentMapIntegration.ts # Integrare componentMap cu sistemul de stiluri
├── 📁 componentMap/            # Configurații pentru componente
│   ├── 📄 button.ts            # Configurație pentru componenta Button
│   ├── 📄 card.ts              # Configurație pentru componenta Card
│   ├── 📄 input.ts             # Configurație pentru componenta Input
│   ├── 📄 alert.ts             # Configurație pentru componenta Alert
│   ├── 📄 fx-shadow.ts         # Efect vizual shadow
│   ├── 📄 fx-gradient.ts       # Efect vizual gradient
│   ├── 📄 fx-fadeIn.ts         # Efect vizual fadeIn
│   └── 📄 index.ts             # Barrel export pentru toate configurațiile
└── 📄 theme-variables.css      # Variabile CSS generate din theme.ts
```

Funcții și dependențe cheie:

themeUtils.ts: 
getEnhancedComponentClasses(): Generează clase CSS semantice cu suport pentru efecte vizuale
applyVisualEffects(): Aplică efecte vizuale la clase existente
Dependențe: theme.ts, themeTypes.ts



📁 frontend/src/types/
Rol: Tipuri TypeScript pentru aplicație
📁 frontend/src/types/
├── 📄 Transaction.ts           # Tipuri pentru tranzacții și parametri query
└── 📄 Category.ts              # Tipuri pentru categorii personalizate
Tipuri și dependențe cheie:

Transaction.ts:

Transaction: Tipul principal pentru tranzacție
TransactionQueryParams: Parametri pentru filtrare
Dependențe: @shared-constants/enums.ts


Category.ts:

CustomCategory, CustomSubcategory: Tipuri pentru categorii personalizate
CustomCategoriesPayload: Structura pentru salvare în DB
Nu are dependențe externe



📁 backend/
Rol: API pentru backend și integrare cu Supabase
📁 backend/
├── 📁 src/
│   ├── 📄 main.ts               # Punct de intrare NestJS
│   ├── 📄 app.module.ts         # Modul principal aplicație
│   ├── 📁 constants/            # Constante backend (importă din shared-constants)
│   ├── 📁 controllers/          # Controllere API pentru rute HTTP
│   ├── 📁 services/             # Servicii business logic
│   └── 📁 modules/              # Module NestJS specifice
└── 📁 migrations/               # Migrări Supabase SQL
    ├── 📄 20XX-XX-XX_create_transactions.sql
    ├── 📄 20XX-XX-XX_create_custom_categories.sql
    └── 📄 20XX-XX-XX_add_subcategory_validations.sql
```

Diagrama Dependențelor Majore
┌─────────────────┐           ┌─────────────────┐
│ frontend/stores │◄──────────┤ frontend/pages  │
└───────┬─────────┘           └─────────────────┘
        │                             ▲
        │                             │
        ▼                             │
┌─────────────────┐           ┌──────┴──────────┐
│frontend/services│◄──────────┤frontend/features│
└───────┬─────────┘           └─────────────────┘
        │                             ▲
        │                             │
        │                     ┌───────┴─────────┐
        │                     │frontend/primitives
        │                     └─────────────────┘
        │                             ▲
        ▼                             │
┌─────────────────┐                   │
│ supabase/firebase ───────────────────┘
└─────────────────┘          

┌─────────────────┐           ┌─────────────────┐
│ shared-constants │◄─────────┤ frontend & backend
└─────────────────┘           └─────────────────┘
Convenții de Imports Importante

Regula de aur pentru constante partajate:
typescript// CORECT
import { TransactionType, MESAJE } from '@shared-constants';
import { QUERY_PARAMS } from '@shared-constants/queryParams';

// INCORECT (niciodată direct din fișiere locale)
import { TransactionType } from '../constants/enums'; // GREȘIT!

Importuri pentru componente:
typescript// Pentru componente, se importă prin index.ts
import Button from '../primitives/Button';
import TransactionForm from '../features/TransactionForm';

Importuri pentru stores:
typescript// Se importă store-ul complet și se selectează cu hook-ul
import { useTransactionStore } from '../stores/transactionStore';
const transactions = useTransactionStore(state => state.transactions);

Pentru exemple concrete de utilizare și pattern-uri UI, consultați IMPLEMENTATION_DETAILS.md
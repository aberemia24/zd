import { TransactionType, CategoryType, FrequencyType } from './enums';

// 🚀 PHASE 2.1 - Loading Message Templates System
// Template-based system pentru toate mesajele de loading din aplicație
export const LOADING_MESSAGES = {
  GENERIC: 'Se încarcă...',
  WITH_CONTEXT: (context: string) => `Se încarcă ${context}...`,
  DATA: 'Se încarcă datele...',
  MORE: 'Se încarcă mai multe...',
  TRANSACTIONS: 'Se încarcă mai multe tranzacții...',
  NAVIGATION: 'Navigare...',
  SAVING: 'Se salvează...',
  SAVING_TRANSACTION: 'Se salvează tranzacția...',
  SPECIFIC: (item: string) => `Se încarcă ${item}...`,
  DATE_CONTEXT: (month: string, year: string) => `Se încarcă datele pentru ${month} ${year}...`
};

// 🚀 PHASE 2.2 - Empty State Message Templates System  
// Template-based system pentru toate mesajele de stare goală
export const EMPTY_STATE_MESSAGES = {
  NO_ITEMS: (entity: string) => `Nu există ${entity}`,
  NO_DATA_FILTER: (filter: string) => `Nu există date pentru ${filter}`,
  NO_TRANSACTIONS: 'Nu există tranzacții pentru criteriile selectate. Încercați să modificați filtrele sau adăugați o tranzacție nouă.',
  NO_SUBCATEGORIES: 'Nu există tranzacții pentru această categorie',
  GENERIC: 'Nu există date disponibile',
  NO_SELECTION: 'Selectează o categorie pentru a vedea și edita subcategoriile.',
  NO_FILTERS: 'Nu există filtre active',
  EMPTY_TRANSACTION_LIST: 'Nicio tranzacție'
};

// 🚀 PHASE 2.3 - Design Tokens System
// Consolidarea magic numbers și design constants
export const DESIGN_TOKENS = {
  SIZES: {
    SPINNER: { 
      SMALL: 16, 
      MEDIUM: 32, 
      LARGE: 48, 
      XLARGE: 64 
    },
    BREAKPOINTS: {
      SM: 640,
      MD: 768, 
      LG: 1024,
      XL: 1280
    },
    SPACING: {
      GRID_GAP: 16,
      MODAL_PADDING: 24,
      CARD_PADDING: 16
    }
  },
  DATE_RANGES: {
    MIN_YEAR: 2020,
    MAX_YEAR: 2030,
    DEFAULT_RANGE: 10
  },
  TRANSITIONS: {
    DEFAULT: 'transition-all duration-200 ease-in-out',
    FAST: 'transition-all duration-100 ease-in-out',
    SLOW: 'transition-all duration-300 ease-in-out'
  }
};

// Toate textele UI vizibile
export const LABELS = {
  TYPE: 'Tip',
  AMOUNT: 'Sumă',
  CATEGORY: 'Categorie',
  SUBCATEGORY: 'Subcategorie',
  DATE: 'Dată',
  RECURRING: 'Recurent',
  FREQUENCY: 'Frecvență',
  TYPE_FILTER: 'Tip tranzacție:',
  CATEGORY_FILTER: 'Categoria:',
  FORM: 'adăugare tranzacție', // pentru aria-label pe <form>
  DESCRIPTION: 'Descriere',
  
  // Constante pentru pagina de autentificare/înregistrare
  EMAIL: 'Email',
  PAROLA: 'Parolă',
  CONFIRMA_PAROLA: 'Confirmă parola',
  
  // Filtre extinse
  SEARCH_FILTER: 'Caută:',
  DATE_FROM_FILTER: 'De la data:',
  DATE_TO_FILTER: 'Până la data:',
  AMOUNT_MIN_FILTER: 'Suma minimă:',
  AMOUNT_MAX_FILTER: 'Suma maximă:',
};

export const TITLES = {
  TRANZACTII: 'Tranzacții',
  GRID_LUNAR: 'Grid Lunar',
  OPTIUNI: 'Opțiuni',
};

export const PLACEHOLDERS = {
  // ...existing
  ADD_SUBCATEGORY: 'Adaugă subcategorie nouă',
  SELECT: 'Alege',
  AMOUNT: 'Introdu suma',
  DATE: 'Selectează data',
  DESCRIPTION: 'Adaugă o descriere (opțional)',
  CATEGORY_EDITOR_SUBCATEGORY: 'Adaugă subcategorie nouă', // added
  SEARCH: 'Caută...',
  AMOUNT_MIN_FILTER: 'Suma minimă',
  AMOUNT_MAX_FILTER: 'Suma maximă',
  // 🚨 AUDIT FIX - Adăugare placeholders hardcodate din LunarGrid
  EDIT_TRANSACTION: 'Editează...',
  ADD_TRANSACTION: 'Adaugă...',
  SUBCATEGORY_NAME: 'Nume subcategorie...',
  // 🚨 TASK 5.4 - Placeholder pentru amount field în QuickAddModal
  AMOUNT_PLACEHOLDER: '0.00',
};

export const BUTTONS = {
  // ...existing
  RENAME: 'Redenumește',
  ADD: 'Adaugă',
  CANCEL: 'Anulează',
  DONE: 'Gata',
  EDIT: 'Editează',
  DELETE: 'Șterge',
  NEXT_PAGE: 'Înainte',
  PREV_PAGE: 'Înapoi',
  ADD_SUBCATEGORY: 'Adaugă subcategorie',
  MANAGE_CATEGORIES: 'Gestionare categorii',
  EXPORT: 'Exportă',
  
  // Constante pentru autentificare/înregistrare
  LOGIN: 'Autentificare',
  REGISTER: 'Crează cont',
  LOADING: 'Se încarcă...',
  RESET_FILTERS: 'Resetează filtre',
  RESET_ALL_FILTERS: 'Resetează toate',
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
    DESCRIPTION: 'Descriere',
  },
  EMPTY: EMPTY_STATE_MESSAGES.EMPTY_TRANSACTION_LIST,
  LOADING: LOADING_MESSAGES.GENERIC,
  LOADING_MORE: LOADING_MESSAGES.TRANSACTIONS,
  PAGE_INFO: 'Pagina {current} din {total}',
  SHOWING_INFO: 'Se afișează {shown} din {total} tranzacții',
  BOOL: {
    YES: 'Da',
    NO: 'Nu',
  },
  NO_TRANSACTIONS: EMPTY_STATE_MESSAGES.NO_TRANSACTIONS,
  NO_SUBCATEGORIES: EMPTY_STATE_MESSAGES.NO_SUBCATEGORIES,
};

// Texte pentru componenta de încărcare (Loader)
export const LOADER = {
  TEXT: LOADING_MESSAGES.GENERIC
};

// Texte pentru componenta ExcelGrid
export const EXCEL_GRID = {
  HEADERS: {
    LUNA: 'Luna',
    VENITURI: 'Venituri',
    CHELTUIELI: 'Cheltuieli',
    ECONOMII: 'Economii',
    SOLD: 'Sold',
    CATEGORII: 'Categorii',
    TOTAL: 'Total',
    ACTIUNI: 'Acțiuni',
    ZI: 'Zi',
    SUMA: 'Suma',
    TIP: 'Tip',
    DATA: 'Data',
    DESCRIERE: 'Descriere',
    RECURENT: 'Recurent',
    FRECVENTA: 'Frecvență'
  },
  // Numărul de zile pentru fiecare lună (ianuarie = index 0)
  DAYS_IN_MONTH: [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],
  NO_DATA: EMPTY_STATE_MESSAGES.GENERIC,
  LOADING: LOADING_MESSAGES.DATA,
  PROMPTS: {
    ENTER_AMOUNT: 'Introduceți suma:',
    SELECT_CATEGORY: 'Selectați o categorie',
    SELECT_SUBCATEGORY: 'Selectați o subcategorie',
    SELECT_DAY: 'Selectați ziua',
    ENTER_DESCRIPTION: 'Introduceți o descriere (opțional)'
  },
  ACTIONS: {
    ADD_SUBCATEGORY: 'Adaugă subcategorie',
    EDIT_SUBCATEGORY: 'Editează subcategorie',
    DELETE_SUBCATEGORY: 'Șterge subcategorie',
    ADD_TRANSACTION: 'Adaugă tranzacție',
    EDIT_TRANSACTION: 'Editează tranzacție',
    DELETE_TRANSACTION: 'Șterge tranzacție',
    EXPAND_ALL: 'Extinde toate categoriile',
    COLLAPSE_ALL: 'Restrânge toate categoriile',
    SAVE_CHANGES: 'Salvează modificările',
    CANCEL: 'Anulează',
    CONFIRM: 'Confirmă'
  },
  // Constante pentru controalele tabelului TanStack
  TABLE_CONTROLS: {
    EXPAND_ALL: 'Extinde toate categoriile',
    COLLAPSE_ALL: 'Colapsează toate categoriile',
    VIRTUAL_TABLE: 'Tabel optimizat',
    LEGACY_TABLE: 'Tabel clasic',
    VERSION: 'Versiune'
  },
  // 🚨 TASK 5.4 - Constante noi pentru QuickAddModal
  MODAL: {
    // Labels pentru position mode
    FREQUENCY_SHORT: 'Frecv.',
    FINANCIAL_IMPACT_SHORT: 'Impact:',
    FINANCIAL_IMPACT_FULL: 'Impact financiar:',
    // Button text pentru position mode  
    SAVE_SHORT: 'OK',
    // Loading și status messages
    SAVING_MESSAGE: LOADING_MESSAGES.SAVING_TRANSACTION,
    // ARIA labels pentru accessibility
    CLOSE_MODAL_ARIA: 'Închide modalul',
    // Confirmation dialog texte
    DELETE_CONFIRMATION_TITLE: 'Confirmați ștergerea tranzacției',
    DELETE_CONFIRMATION_MESSAGE: 'Sigur doriți să ștergeți această tranzacție? Acțiunea nu poate fi anulată.',
    DELETE_CONFIRM_BUTTON: 'Șterge',
    DELETE_CANCEL_BUTTON: 'Anulează'
  },
  // 🚨 TASK 5.4 - Error messages pentru modal operations
  ERROR_MESSAGES: {
    SAVE_TRANSACTION_GENERIC: 'Eroare la salvarea tranzacției. Încercați din nou.',
    SAVE_TRANSACTION_PREFIX: 'Eroare la salvarea tranzacției: ',
    DELETE_TRANSACTION_GENERIC: 'Eroare la ștergerea tranzacției. Încercați din nou.',
    DELETE_TRANSACTION_PREFIX: 'Eroare la ștergerea tranzacției: '
  },
  // Constante pentru inline editing system
  INLINE_EDITING: {
    EDIT_HINT: 'Apasă F2 pentru editare',
    SAVING: LOADING_MESSAGES.SAVING,
    VALIDATION_ERRORS: {
      EMPTY_VALUE: 'Valoarea nu poate fi goală',
      INVALID_NUMBER: 'Valoarea trebuie să fie un număr valid',
      NEGATIVE_VALUE: 'Valoarea nu poate fi negativă',
      INVALID_PERCENTAGE: 'Procentul trebuie să fie un număr valid',
      PERCENTAGE_RANGE: 'Procentul trebuie să fie între 0 și 100',
      INVALID_DATE: 'Data trebuie să fie în format valid',
      TEXT_TOO_LONG: 'Textul nu poate depăși 255 de caractere'
    },
    SAVE_ERROR: 'Eroare la salvare',
    PLACEHOLDER: {
      AMOUNT: 'Introduceți suma',
      TEXT: 'Introduceți textul',
      PERCENTAGE: 'Introduceți procentul',
      DATE: 'Introduceți data'
    }
  }
};


export const OPTIONS = {
  TYPE: [
    { value: TransactionType.INCOME, label: 'Venit' },
    { value: TransactionType.EXPENSE, label: 'Cheltuială' },
    { value: TransactionType.SAVING, label: 'Economisire' },
  ],
  CATEGORY: [
    { value: CategoryType.INCOME, label: 'Venituri' },
    { value: CategoryType.EXPENSE, label: 'Cheltuieli' },
    { value: CategoryType.SAVING, label: 'Economii' },
  ],
  FREQUENCY: [
    { value: FrequencyType.DAILY, label: 'Zilnic' },
    { value: FrequencyType.WEEKLY, label: 'Săptămânal' },
    { value: FrequencyType.MONTHLY, label: 'Lunar' },
    { value: FrequencyType.YEARLY, label: 'Anual' },
  ],
};

// Texte pentru pagina de opțiuni și gestionare categorii
export const UI = {
  OPTIONS_PAGE_TITLE: 'Opțiuni',
  CATEGORY_MANAGEMENT: 'Gestionare categorii',
  CATEGORY_MANAGEMENT_DESCRIPTION: 'Personalizați categoriile și subcategoriile pentru a se potrivi nevoilor dvs. specifice de bugetare.',
  MANAGE_CATEGORIES: 'Gestionare categorii',
  DISPLAY_OPTIONS: 'Opțiuni de afișare',
  DATA_EXPORT: 'Export date',
  ACCOUNT_SETTINGS: 'Setări Cont',
  ACCOUNT_LOGOUT_DESCRIPTION: 'Deconectează-te de la contul tău.',
  LOGOUT_BUTTON: 'Logout',
  COMING_SOON: 'În curând',
  LOGIN_REQUIRED: 'Trebuie să fiți autentificat pentru a accesa această pagină.',
  ADD_SUBCATEGORY: 'Adaugă subcategorie',
  DELETE_SUBCATEGORY: 'Șterge subcategorie',
  EDIT_SUBCATEGORY: 'Editează subcategorie',
  
  // Secțiune UI pentru CategoryEditor
  CATEGORY_EDITOR: {
    TITLE: 'Gestionare Subcategorii',
    CATEGORIES_SECTION_TITLE: 'Categorii',
    SUBCATEGORIES_SECTION_TITLE: 'Subcategorii pentru',
    CUSTOM_BADGE: 'custom',
    RENAME_BUTTON: 'Redenumește',
    DELETE_BUTTON: 'Șterge',
    ADD_PLACEHOLDER: 'Adaugă subcategorie nouă',
    ADD_BUTTON: 'Adaugă',
    NO_SELECTION: EMPTY_STATE_MESSAGES.NO_SELECTION,
    DELETE_CONFIRMATION_TITLE: 'Confirmare ștergere',
    DELETE_CONFIRMATION_TEXT: 'Ești sigur că vrei să ștergi subcategoria {subcat} din {cat}?',
    DELETE_WARNING: 'Atenție: Există {count} tranzacții care folosesc această subcategorie.',
    CONFIRM_DELETE_BUTTON: 'Confirmă ștergerea',
    CANCEL_BUTTON: 'Anulează'
  },
  FILTERS_ACTIVE: (count: number) => `${count} filtru${count === 1 ? '' : 'e'} activ${count === 1 ? '' : 'e'}`,
  
  // Secțiune UI pentru TransactionFilters
  TRANSACTION_FILTERS: {
    TITLE: 'Filtre',
    SHOW_ADVANCED: 'Filtre avansate',
    HIDE_ADVANCED: 'Ascunde filtre avansate',
    NO_FILTERS: EMPTY_STATE_MESSAGES.NO_FILTERS,
    DATE_RANGE: 'Interval date',
    AMOUNT_RANGE: 'Interval sume',
    TEXT_SEARCH: 'Căutare text',
  },
  
  // 🚨 AUDIT FIX - Adăugare titles hardcodate din LunarGrid
  SUBCATEGORY_ACTIONS: {
    DELETE_CUSTOM_TITLE: 'Șterge subcategoria custom',
    DELETE_ORPHAN_TITLE: 'Șterge tranzacțiile fără subcategorie (date murdare din trecut)',
    RENAME_TITLE: 'Redenumește subcategoria',
  },
  
  LUNAR_GRID_TOOLTIPS: {
    CALCULATED_SUM: 'Suma calculată automată din subcategorii',
    DAILY_BALANCES: 'Balanțe zilnice',
  },
  
  // 🚨 AUDIT FIX - Texte pentru LunarGridPage
  LUNAR_GRID_PAGE: {
    FULLSCREEN_EXIT_HINT: 'Press ESC pentru a ieși din fullscreen',
    NAVIGATION_LOADING: LOADING_MESSAGES.NAVIGATION,
    LOADING_MESSAGE_TEMPLATE: LOADING_MESSAGES.DATE_CONTEXT,
    LAYOUT_MODES: {
      FULL_WIDTH: 'Lățime completă', 
      FULLSCREEN: 'Fullscreen',
    },
    LAYOUT_TOGGLE_TOOLTIP: 'Comută la modul următor ({nextMode})',
    MONTHS: {
      IANUARIE: 'Ianuarie',
      FEBRUARIE: 'Februarie', 
      MARTIE: 'Martie',
      APRILIE: 'Aprilie',
      MAI: 'Mai',
      IUNIE: 'Iunie',
      IULIE: 'Iulie',
      AUGUST: 'August',
      SEPTEMBRIE: 'Septembrie',
      OCTOMBRIE: 'Octombrie',
      NOIEMBRIE: 'Noiembrie',
      DECEMBRIE: 'Decembrie'
    }
  },
};

// Flag pentru subcategoriile custom
export const FLAGS = {
  CUSTOM: 'custom',
};

// Mesaj informativ pentru starea goală a editorului de categorii
export const INFO = {
  CATEGORY_EDITOR_EMPTY: EMPTY_STATE_MESSAGES.NO_SELECTION,
  NO_TRANSACTIONS: EMPTY_STATE_MESSAGES.NO_TRANSACTIONS,
  NO_SUBCATEGORIES: EMPTY_STATE_MESSAGES.NO_SUBCATEGORIES,
};

// Constante pentru LunarGrid
export const LUNAR_GRID = {
  COLLAPSE_ALL: 'Restrânge tot',
  EXPAND_ALL: 'Extinde tot',
  RESET_EXPANSION: 'Resetează',
  LOADING: LOADING_MESSAGES.DATA,
  NO_DATA: EMPTY_STATE_MESSAGES.GENERIC,
  // 🚨 DUPLICATE FIX - Folosesc BALANCE_LABELS.SOLD în loc de string hardcodat
  get TOTAL_BALANCE() { return BALANCE_LABELS.SOLD; },
  // Constante pentru controale individuale
  EXPAND_CATEGORY: 'Extinde',
  COLLAPSE_CATEGORY: 'Restrânge',
  EXPAND_CATEGORY_TITLE: 'Extinde categoria',
  COLLAPSE_CATEGORY_TITLE: 'Restrânge categoria',
  // Constante pentru scroll UX
  SCROLL_HINT: 'Scroll pentru a vedea mai multe date',
  STICKY_HEADER_ACTIVE: 'Header fix activ',
  // Constante pentru redimensionare tabel
  RESIZE: {
    TOGGLE_FULLSCREEN: 'Comută fullscreen',
    EXIT_FULLSCREEN: 'Ieși din fullscreen',
    RESIZE_BUTTON_TITLE: 'Redimensionează tabelul',
    FULLSCREEN_MODE: 'Mod fullscreen activ',
    NORMAL_MODE: 'Mod normal'
  }
};

// Constante pentru teste - eliminate strings hardcodate
export const TEST_CONSTANTS = {
  ALERTS: {
    TEST_MESSAGE: 'Acesta este un mesaj de alertă',
    ERROR_MESSAGE: 'Eroare de procesare',
    SUCCESS_MESSAGE: 'Operație reușită',
    WARNING_MESSAGE: 'Atenție la acțiune',
    INFO_MESSAGE: 'Informație importantă',
    CUSTOM_CLASS_MESSAGE: 'Test clasă personalizată',
    BASE_CLASS_MESSAGE: 'Test clase de bază'
  },
  SELECT: {
    PLACEHOLDER: 'Alege o opțiune',
    OPTION_1: 'Opțiunea 1',
    OPTION_2: 'Opțiunea 2', 
    OPTION_3: 'Opțiunea 3',
    LABEL: 'Selecție',
    REQUIRED_ERROR: 'Acest câmp este obligatoriu'
  },
  TEXTAREA: {
    PLACEHOLDER: 'Comentariile tale',
    REQUIRED_ERROR: 'Acest câmp este obligatoriu',
    LABEL: 'Textarea test',
    TEST_VALUE: 'Acesta este un text de test'
  },
  CHECKBOX: {
    LABEL: 'Acceptă termenii',
    REQUIRED_ERROR: 'Trebuie să acceptați termenii',
    CHECKED_LABEL: 'Opțiune bifată'
  },
  COMMON: {
    TEST_MESSAGE: 'Mesaj de test',
    LOADING: 'Se încarcă...',
    ERROR_GENERIC: 'Eroare'
  }
};

// 🚨 AUDIT FIX - Constante suplimentare pentru LunarGrid
export const LUNAR_GRID_ACTIONS = {
  NO_TRANSACTIONS: 'fără tranzacții',
  ENTER_KEY: 'Enter',
  ESCAPE_KEY: 'Escape',
  // 🎯 LGI-TASK-06: Mesaje pentru keyboard deletion
  DELETE_TRANSACTION_SINGLE: 'Ștergi această tranzacție definitiv?',
  DELETE_TRANSACTION_MULTIPLE: 'Ștergi {count} tranzacții definitiv?',
  DELETE_SUCCESS_SINGLE: 'Tranzacție ștearsă cu succes',
  DELETE_SUCCESS_MULTIPLE: '{count} tranzacții șterse cu succes',
  DELETE_ERROR: 'Eroare la ștergerea tranzacțiilor',
  NO_TRANSACTIONS_TO_DELETE: 'Nu există tranzacții de șters pentru pozițiile selectate',
};

// 🆕 Account Management Constants - pentru sistem conturi multiple
export const ACCOUNT_MANAGEMENT = {
  MAX_ACCOUNTS: 10,
  
  // UI Labels
  LABELS: {
    ACCOUNT_NAME: 'Nume cont',
    ACCOUNT_TYPE: 'Tip cont', 
    INITIAL_BALANCE: 'Sold inițial',
    CURRENT_BALANCE: 'Sold curent',
    ACCOUNT_DESCRIPTION: 'Descriere cont',
    DEFAULT_ACCOUNT: 'Cont principal',
    ACTIVE_STATUS: 'Activ',
  },
  
  // Validation Messages
  VALIDATION: {
    NAME_REQUIRED: 'Numele contului este obligatoriu',
    NAME_TOO_LONG: 'Numele contului nu poate depăși 50 de caractere',
    TYPE_REQUIRED: 'Tipul contului este obligatoriu',
    INITIAL_BALANCE_REQUIRED: 'Soldul inițial este obligatoriu',
    INITIAL_BALANCE_INVALID: 'Soldul inițial trebuie să fie un număr valid',
    MAX_ACCOUNTS_REACHED: `Nu puteți avea mai mult de ${10} conturi`,
    DUPLICATE_NAME: 'Există deja un cont cu acest nume',
    CANNOT_DELETE_LAST: 'Nu puteți șterge ultimul cont activ',
    CANNOT_DELETE_WITH_TRANSACTIONS: 'Nu puteți șterge un cont care are tranzacții',
  },
  
  // Action Messages  
  ACTIONS: {
    ADD_ACCOUNT: 'Adaugă cont nou',
    EDIT_ACCOUNT: 'Editează cont',
    DELETE_ACCOUNT: 'Șterge cont',
    SET_DEFAULT: 'Setează ca principal',
    ACTIVATE_ACCOUNT: 'Activează cont',
    DEACTIVATE_ACCOUNT: 'Dezactivează cont',
  },
  
  // Status Messages
  STATUS: {
    ACCOUNT_CREATED: 'Cont creat cu succes',
    ACCOUNT_UPDATED: 'Cont actualizat cu succes', 
    ACCOUNT_DELETED: 'Cont șters cu succes',
    ACCOUNT_SET_DEFAULT: 'Cont setat ca principal',
  },
};

// 🆕 Balance Display Constants - pentru afișarea soldului și calculări
export const BALANCE_DISPLAY = {
  // Formatting Rules
  CURRENCY: 'RON',
  DECIMAL_PLACES: 2,
  THOUSAND_SEPARATOR: '.',
  DECIMAL_SEPARATOR: ',',
  
  // Labels
  LABELS: {
    AVAILABLE_BALANCE: 'Sold disponibil',
    SAVINGS_BALANCE: 'Sold economii', 
    TOTAL_BALANCE: 'Sold total',
    PROJECTED_BALANCE: 'Sold proiectat',
    DAILY_BALANCE: 'Sold zilnic',
    BALANCE_CHANGE: 'Schimbare sold',
    BALANCE_TREND: 'Tendință sold',
  },
  
  // Colors pentru Transaction Types (CSS classes pentru TailwindCSS)
  COLORS: {
    INCOME: 'text-green-600 bg-green-50 border-green-200',      // Verde pentru venituri
    EXPENSE: 'text-red-600 bg-red-50 border-red-200',         // Roșu pentru cheltuieli  
    SAVING: 'text-blue-600 bg-blue-50 border-blue-200',       // Albastru pentru economii/investiții
    POSITIVE: 'text-green-600',                               // Pentru solduri pozitive
    NEGATIVE: 'text-red-600',                                 // Pentru solduri negative
    NEUTRAL: 'text-gray-600',                                 // Pentru solduri zero/neutrale
  },
  
  // Grid Styles pentru balance rows
  GRID_STYLES: {
    BALANCE_ROW: 'font-semibold bg-gray-50',
    BALANCE_CELL: 'text-right font-mono text-sm',
    BALANCE_TOTAL: 'border-t-2 border-gray-300 font-bold',
    BALANCE_PROJECTION: 'bg-blue-50 border-blue-200',
  },
  
  // Status indicators 
  STATUS: {
    CALCULATED: 'Calculat automat',
    MANUAL_OVERRIDE: 'Suprascris manual',
    PROJECTED: 'Valoare proiectată', 
    CONFIRMED: 'Confirmat',
  },
};

// 🆕 Modal Variants pentru balance system
export const BALANCE_MODALS = {
  // Account Management Modals
  ACCOUNT: {
    CREATE_TITLE: 'Adaugă cont nou',
    EDIT_TITLE: 'Editează cont',
    DELETE_TITLE: 'Șterge cont',
    TRANSFER_TITLE: 'Transfer între conturi',
  },
  
  // Balance Adjustment Modals  
  BALANCE: {
    ADJUST_TITLE: 'Ajustează sold',
    RECONCILE_TITLE: 'Reconciliere sold',
    PROJECTION_TITLE: 'Proiecție sold',
    HISTORY_TITLE: 'Istoric sold',
  },
  
  // Confirmation Messages
  CONFIRMATIONS: {
    DELETE_ACCOUNT: 'Ștergeți contul și toate datele asociate?',
    ADJUST_BALANCE: 'Confirmați ajustarea soldului?',
    TRANSFER_FUNDS: 'Confirmați transferul de fonduri?',
    RECONCILE: 'Confirmați reconcilierea soldului?',
  },
};

// 🚨 DUPLICATE FIX - Consolidez SOLD related constants
export const BALANCE_LABELS = {
  SOLD: 'Sold',                    // ✅ Consolidat din LABELS.SOLD (linia 113)
  TOTAL_BALANCE: 'Sold total',     // ✅ Înlocuiește LUNAR_GRID.TOTAL_BALANCE (linia 331)
  DAILY_BALANCES: 'Balanțe zilnice', // ✅ Existent deja în UI
  BALANCE: 'Balanță',
  AVAILABLE: 'Disponibil',
  SAVINGS: 'Economii',
  INVESTMENTS: 'Investiții',
};

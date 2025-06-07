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
  
  // Transaction type labels
  INCOME_TYPE: 'Venit',
  EXPENSE_TYPE: 'Cheltuială',
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

// 🍞 TOAST NOTIFICATIONS - Notificări temporare
export const TOAST = {
  // Toast actions
  CLOSE: 'Închide notificarea',
  
  // Toast variants and titles
  INFO: {
    TITLE: 'Informație',
    DEFAULT_MESSAGE: 'Informație disponibilă'
  },
  SUCCESS: {
    TITLE: 'Succes',
    DEFAULT_MESSAGE: 'Operația a fost finalizată cu succes'
  },
  WARNING: {
    TITLE: 'Atenție', 
    DEFAULT_MESSAGE: 'Verificați informațiile introduse'
  },
  ERROR: {
    TITLE: 'Eroare',
    DEFAULT_MESSAGE: 'A apărut o eroare neașteptată'
  },
  
  // Common toast messages for Budget App
  TRANSACTION: {
    ADDED: 'Tranzacția a fost adăugată cu succes',
    UPDATED: 'Tranzacția a fost actualizată',
    DELETED: 'Tranzacția a fost ștearsă',
    ERROR_ADDING: 'Eroare la adăugarea tranzacției',
    ERROR_UPDATING: 'Eroare la actualizarea tranzacției',
    ERROR_DELETING: 'Eroare la ștergerea tranzacției'
  },
  CATEGORY: {
    ADDED: 'Categoria a fost adăugată',
    UPDATED: 'Categoria a fost actualizată', 
    DELETED: 'Categoria a fost ștearsă',
    ERROR_ADDING: 'Eroare la adăugarea categoriei',
    ERROR_UPDATING: 'Eroare la actualizarea categoriei',
    ERROR_DELETING: 'Eroare la ștergerea categoriei'
  },
  EXPORT: {
    SUCCESS: 'Exportul a fost finalizat cu succes',
    ERROR: 'Eroare la exportul datelor'
  },
  AUTH: {
    LOGIN_SUCCESS: 'Autentificare reușită',
    LOGIN_ERROR: 'Eroare la autentificare',
    LOGOUT_SUCCESS: 'V-ați deconectat cu succes',
    REGISTER_SUCCESS: 'Contul a fost creat cu succes'
  },
  
  // Settings for toast behavior
  DURATION: {
    SHORT: 3000,    // 3 secunde pentru mesaje simple
    MEDIUM: 5000,   // 5 secunde pentru mesaje normale
    LONG: 7000,     // 7 secunde pentru mesaje importante
    PERSISTENT: 0   // 0 = nu se închide automat
  }
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
    RUNNING_BALANCE: 'Sold curent', // Pentru running balance column
    ACTIONS: 'Acțiuni', // Pentru actions column
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
  
  // 🚀 TASK 8.2 - Desktop-First Table Features
  ADVANCED_FEATURES: {
    // Pagination enhanced
    ITEMS_PER_PAGE: 'Elemente pe pagină:',
    JUMP_TO_PAGE: 'Mergi la pagina:',
    PAGE_SIZE_OPTIONS: 'Opțiuni mărime pagină',
    TOTAL_RECORDS: 'Total înregistrări: {count}',
    SELECTED_RECORDS: '{count} selectate',
    
    // Search and filtering
    SEARCH_PLACEHOLDER: 'Caută în tranzacții...',
    ADVANCED_SEARCH: 'Căutare avansată',
    REGEX_SEARCH: 'Căutare cu expresii regulate',
    CLEAR_FILTERS: 'Șterge filtrele',
    SAVE_FILTER_PRESET: 'Salvează preset filtru',
    LOAD_FILTER_PRESET: 'Încarcă preset filtru',
    
    // Sorting
    SORT_BY: 'Sortează după',
    SECONDARY_SORT: 'Sortare secundară',
    REMOVE_SORT: 'Elimină sortarea',
    MULTI_COLUMN_SORT_HINT: 'Ține Shift + Click pentru sortare pe mai multe coloane',
    
    // Selection and bulk operations
    SELECT_ALL: 'Selectează toate',
    SELECT_PAGE: 'Selectează pagina',
    DESELECT_ALL: 'Deselectează toate',
    BULK_ACTIONS: 'Acțiuni în masă',
    BULK_DELETE: 'Șterge selecțiile',
    BULK_EXPORT: 'Exportă selecțiile',
    BULK_EDIT_CATEGORY: 'Modifică categoria',
    
    // Export functionality
    EXPORT_OPTIONS: 'Opțiuni export',
    EXPORT_CSV: 'Exportă CSV',
    EXPORT_PDF: 'Exportă PDF',
    EXPORT_EXCEL: 'Exportă Excel',
    EXPORT_FILTERED: 'Exportă doar datele filtrate',
    EXPORT_ALL: 'Exportă toate datele',
    
    // Financial calculations
    RUNNING_BALANCE_SHOW: 'Afișează soldul curent',
    RUNNING_BALANCE_HIDE: 'Ascunde soldul curent',
    SUMMARY_FOOTER: 'Sumar financiar',
    TOTAL_INCOME: 'Total venituri',
    TOTAL_EXPENSES: 'Total cheltuieli',
    NET_BALANCE: 'Balanța netă',
    AVERAGE_TRANSACTION: 'Tranzacția medie',
    
    // Keyboard shortcuts
    KEYBOARD_SHORTCUTS: 'Comenzi rapide tastatură',
    NAVIGATION_HINT: 'Folosește săgețile pentru navigare',
    EDIT_HINT: 'Enter pentru editare, Escape pentru anulare',
    SEARCH_HINT: 'Ctrl+F pentru căutare rapidă',
    
    // Context menu
    CONTEXT_MENU: {
      EDIT: 'Editează tranzacția',
      DELETE: 'Șterge tranzacția',
      DUPLICATE: 'Duplică tranzacția',
      VIEW_DETAILS: 'Vezi detalii complete',
      ADD_TO_FAVORITES: 'Adaugă la favorite',
      COPY_VALUES: 'Copiază valorile',
    },
    
    // Desktop optimizations
    FULLSCREEN_MODE: 'Mod ecran complet',
    COMPACT_VIEW: 'Vizualizare compactă',
    COMFORTABLE_VIEW: 'Vizualizare confortabilă',
    COLUMN_VISIBILITY: 'Vizibilitate coloane',
    RESIZE_COLUMNS: 'Redimensionează coloanele',
    FREEZE_COLUMNS: 'Înghețe coloanele',
  },
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
    // TASK 11: Timer delay pentru click detection (în ms)
    CLICK_DETECTION_DELAY: 250,
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
    CUSTOM_BADGE: FLAGS.CUSTOM,
    RENAME_BUTTON: BUTTONS.RENAME,
    DELETE_BUTTON: BUTTONS.DELETE,
    ADD_PLACEHOLDER: PLACEHOLDERS.CATEGORY_EDITOR_SUBCATEGORY,
    ADD_BUTTON: BUTTONS.ADD,
    NO_SELECTION: INFO.CATEGORY_EDITOR_EMPTY,
    DELETE_CONFIRMATION_TITLE: 'Confirmare ștergere',
    DELETE_CONFIRMATION_TEXT: 'Ești sigur că vrei să ștergi subcategoria {subcat} din {cat}?',
    DELETE_WARNING: INFO.DELETE_WARNING_PREFIX + ' {count} ' + INFO.DELETE_WARNING_SUFFIX,
    CONFIRM_DELETE_BUTTON: 'Confirmă ștergerea',
    CANCEL_BUTTON: BUTTONS.CANCEL,
    LIMIT_INFO: INFO.CATEGORY_EDITOR_LIMIT,
    LIMIT_REACHED_MESSAGE: INFO.CATEGORY_EDITOR_LIMIT_MESSAGE,
    COUNT_DISPLAY: INFO.SUBCATEGORY_COUNT_DISPLAY
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

// 🚀 PHASE 2.5 - Emoji și Simboluri UI
export const SYMBOLS = {
  INFO: 'ℹ️',
  WARNING: '⚠️',
  SUCCESS: '✅',
  ERROR: '❌',
  LOADING: '⏳',
  CUSTOM: '🔧',
  LOCK: '🔒',
  UNLOCK: '🔓',
  EDIT: '✏️',
  DELETE: '🗑️',
  ADD: '➕',
  REMOVE: '➖',
  ARROW_UP: '↑',
  ARROW_DOWN: '↓',
  ARROW_LEFT: '←',
  ARROW_RIGHT: '→',
  CHECK: '✓',
  CROSS: '✗',
  STAR: '⭐',
  HEART: '❤️',
  MONEY: '💰',
  CHART: '📊',
  CALENDAR: '📅',
  SETTINGS: '⚙️',
  HELP: '❓',
  SEARCH: '🔍',
  FILTER: '🔽',
  EXPORT: '📤',
  IMPORT: '📥'
};

// 🚀 PHASE 2.7 - Flag Labels pentru Badge-uri
export const FLAGS = {
  CUSTOM: 'custom',
  NEW: 'nou',
  UPDATED: 'actualizat',
  FEATURED: 'recomandat',
  DEPRECATED: 'învechit',
  BETA: 'beta',
  PREMIUM: 'premium',
  FREE: 'gratuit'
};

// 🚀 PHASE 2.6 - Informational Messages și Helper Text
export const INFO = {
  CATEGORY_EDITOR_EMPTY: EMPTY_STATE_MESSAGES.NO_SELECTION,
  CATEGORY_EDITOR_LIMIT: 'Maxim 5 subcategorii custom per categorie',
  CATEGORY_EDITOR_LIMIT_REACHED: (count: number) => `Maxim 5 subcategorii custom per categorie (${count}/5)`,
  CATEGORY_EDITOR_LIMIT_MESSAGE: 'Nu mai poți adăuga subcategorii custom în această categorie.',
  SUBCATEGORY_COUNT_DISPLAY: (count: number) => `(${count}/5)`,
  TRANSACTION_COUNT_BADGE: (count: number) => `${count}`,
  NO_TRANSACTIONS_BADGE: '',
  CUSTOM_SUBCATEGORY_HINT: 'Subcategorie personalizată',
  DELETE_WARNING_PREFIX: 'Atenție: Există',
  DELETE_WARNING_SUFFIX: 'tranzacții care folosesc această subcategorie.',
  VALIDATION_REQUIREMENTS: {
    SUBCATEGORY_LENGTH: 'Numele trebuie să aibă între 1 și 80 de caractere',
    SUBCATEGORY_CHARS: 'Doar litere, cifre, spații și caracterele - | sunt permise',
    SUBCATEGORY_UNIQUE: 'Numele trebuie să fie unic în cadrul categoriei'
  }
};

// 🚀 PHASE 2.4 - ARIA Labels și Accessibility
export const ARIA_LABELS = {
  CLOSE_MODAL: 'Închide modalul',
  CLOSE_DIALOG: 'Închide dialogul', 
  CLOSE_POPUP: 'Închide',
  OPEN_MENU: 'Deschide meniul',
  SELECT_CATEGORY: 'Selectează categoria',
  SELECT_SUBCATEGORY: 'Selectează subcategoria',
  EDIT_TRANSACTION: 'Editează tranzacția',
  DELETE_TRANSACTION: 'Șterge tranzacția',
  ADD_TRANSACTION: 'Adaugă tranzacție nouă',
  SEARCH_TRANSACTIONS: 'Caută în tranzacții',
  FILTER_TRANSACTIONS: 'Filtrează tranzacțiile',
  SORT_COLUMN: 'Sortează coloana',
  EXPAND_ROW: 'Extinde rândul',
  COLLAPSE_ROW: 'Restrânge rândul',
  TOGGLE_THEME: 'Comută tema',
  PREVIOUS_PAGE: 'Pagina anterioară',
  NEXT_PAGE: 'Pagina următoare',
  CATEGORY_EDITOR: {
    CATEGORIES_LIST: 'Lista de categorii',
    SUBCATEGORIES_LIST: 'Lista de subcategorii',
    SELECT_CATEGORY: 'Selectează categoria',
    EDIT_SUBCATEGORY: 'Editează subcategoria',
    DELETE_SUBCATEGORY: 'Șterge subcategoria',
    ADD_SUBCATEGORY: 'Adaugă subcategorie nouă',
    RENAME_INPUT: 'Câmp pentru redenumire subcategorie',
  }
};

export const BUTTONS = {
  // ... existing properties ...
  RENAME: 'Redenumește',
  ADD: 'Adaugă',
  CANCEL: 'Anulează',
  DONE: 'Gata',
  EDIT: 'Editează',
  DELETE: 'Șterge',
  // ... rest of BUTTONS ...
};

// 🚀 PHASE 2.8 - Balance System Constants
export const BALANCE_SYSTEM = {
  // ... existing properties ...
};

// 🚀 PHASE 2.9 - Account Management Constants
export const ACCOUNT_MANAGEMENT = {
  // ... existing properties ...
};

// 🚀 PHASE 2.10 - Balance Display Constants
export const BALANCE_DISPLAY = {
  // ... existing properties ...
};

// 🚀 PHASE 2.11 - Balance Modals Constants
export const BALANCE_MODALS = {
  // ... existing properties ...
};

// 🚀 PHASE 2.12 - Balance Labels Constants
export const BALANCE_LABELS = {
  // ... existing properties ...
};

// 🚀 PHASE 2.13 - Export UI Constants
export const EXPORT_UI = {
  // ... existing properties ...
};

// 🚀 PHASE 2.14 - Tooltip Constants
export const TOOLTIP = {
  // ... existing properties ...
};

// 🚀 PHASE 2.15 - Progress Constants
export const PROGRESS = {
  // ... existing properties ...
};

// 🚀 PHASE 2.16 - Badge Constants
export const BADGE = {
  // ... existing properties ...
};

// 🚀 PHASE 2.17 - Navigation System Constants
export const NAVIGATION = {
  // ... existing properties ...
};

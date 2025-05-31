import { TransactionType, CategoryType, FrequencyType } from './enums';

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
  EMPTY: 'Nicio tranzacție',
  LOADING: 'Se încarcă...',
  LOADING_MORE: 'Se încarcă mai multe tranzacții...',
  PAGE_INFO: 'Pagina {current} din {total}',
  SHOWING_INFO: 'Se afișează {shown} din {total} tranzacții',
  BOOL: {
    YES: 'Da',
    NO: 'Nu',
  },
  NO_TRANSACTIONS: 'Nu există tranzacții pentru criteriile selectate. Încercați să modificați filtrele sau adăugați o tranzacție nouă.',
  NO_SUBCATEGORIES: 'Nu există tranzacții pentru această categorie',
};

// Texte pentru componenta de încărcare (Loader)
export const LOADER = {
  TEXT: 'Se încarcă...'
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
  NO_DATA: 'Nu există date disponibile',
  LOADING: 'Se încarcă datele...',
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
    CONFIRM: 'Confirmă',
    CLOSE: 'Închide'
  },
  // Constante pentru controalele tabelului TanStack
  TABLE_CONTROLS: {
    EXPAND_ALL: 'Extinde toate categoriile',
    COLLAPSE_ALL: 'Colapsează toate categoriile',
    VIRTUAL_TABLE: 'Tabel optimizat',
    LEGACY_TABLE: 'Tabel clasic',
    VERSION: 'Versiune'
  },
  // Constante pentru inline editing system
  INLINE_EDITING: {
    EDIT_HINT: 'Apasă F2 pentru editare',
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
    NO_SELECTION: 'Selectează o categorie pentru a vedea și edita subcategoriile.',
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
    NO_FILTERS: 'Nu există filtre active',
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
    NAVIGATION_LOADING: 'Navigare...',
    LOADING_MESSAGE_TEMPLATE: 'Se încarcă datele pentru {month} {year}...',
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
  CATEGORY_EDITOR_EMPTY: 'Selectează o categorie pentru a vedea și edita subcategoriile.',
  NO_TRANSACTIONS: 'Nu există tranzacții pentru criteriile selectate. Încercați să modificați filtrele sau adăugați o tranzacție nouă.',
  NO_SUBCATEGORIES: 'Nu există tranzacții pentru această categorie',
};

// Constante pentru LunarGrid
export const LUNAR_GRID = {
  COLLAPSE_ALL: 'Restrânge tot',
  EXPAND_ALL: 'Extinde tot',
  RESET_EXPANSION: 'Resetează',
  LOADING: 'Se încarcă datele...',
  NO_DATA: 'Nu există date pentru perioada selectată',
  TOTAL_BALANCE: 'Sold',
  // Constante pentru controale individuale
  EXPAND_CATEGORY: 'Extinde',
  COLLAPSE_CATEGORY: 'Restrânge',
  EXPAND_CATEGORY_TITLE: 'Extinde categoria',
  COLLAPSE_CATEGORY_TITLE: 'Restrânge categoria',
  // Constante pentru scroll UX
  SCROLL_HINT: 'Scroll pentru a vedea mai multe date',
  STICKY_HEADER_ACTIVE: 'Header fix activ'
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
};

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NAVIGATION = exports.BADGE = exports.PROGRESS = exports.TOOLTIP = exports.EXPORT_UI = exports.BALANCE_LABELS = exports.BALANCE_MODALS = exports.BALANCE_DISPLAY = exports.ACCOUNT_MANAGEMENT = exports.LUNAR_GRID_ACTIONS = exports.TEST_CONSTANTS = exports.LUNAR_GRID = exports.INFO = exports.FLAGS = exports.UI = exports.OPTIONS = exports.EXCEL_GRID = exports.LOADER = exports.TABLE = exports.TOAST = exports.BUTTONS = exports.PLACEHOLDERS = exports.TITLES = exports.LABELS = exports.DESIGN_TOKENS = exports.EMPTY_STATE_MESSAGES = exports.LOADING_MESSAGES = void 0;
const enums_1 = require("./enums");
exports.LOADING_MESSAGES = {
    GENERIC: 'Se încarcă...',
    WITH_CONTEXT: (context) => `Se încarcă ${context}...`,
    DATA: 'Se încarcă datele...',
    MORE: 'Se încarcă mai multe...',
    TRANSACTIONS: 'Se încarcă mai multe tranzacții...',
    NAVIGATION: 'Navigare...',
    SAVING: 'Se salvează...',
    SAVING_TRANSACTION: 'Se salvează tranzacția...',
    SPECIFIC: (item) => `Se încarcă ${item}...`,
    DATE_CONTEXT: (month, year) => `Se încarcă datele pentru ${month} ${year}...`
};
exports.EMPTY_STATE_MESSAGES = {
    NO_ITEMS: (entity) => `Nu există ${entity}`,
    NO_DATA_FILTER: (filter) => `Nu există date pentru ${filter}`,
    NO_TRANSACTIONS: 'Nu există tranzacții pentru criteriile selectate. Încercați să modificați filtrele sau adăugați o tranzacție nouă.',
    NO_SUBCATEGORIES: 'Nu există tranzacții pentru această categorie',
    GENERIC: 'Nu există date disponibile',
    NO_SELECTION: 'Selectează o categorie pentru a vedea și edita subcategoriile.',
    NO_FILTERS: 'Nu există filtre active',
    EMPTY_TRANSACTION_LIST: 'Nicio tranzacție'
};
exports.DESIGN_TOKENS = {
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
exports.LABELS = {
    TYPE: 'Tip',
    AMOUNT: 'Sumă',
    CATEGORY: 'Categorie',
    SUBCATEGORY: 'Subcategorie',
    DATE: 'Dată',
    RECURRING: 'Recurent',
    FREQUENCY: 'Frecvență',
    TYPE_FILTER: 'Tip tranzacție:',
    CATEGORY_FILTER: 'Categoria:',
    FORM: 'adăugare tranzacție',
    DESCRIPTION: 'Descriere',
    EMAIL: 'Email',
    PAROLA: 'Parolă',
    CONFIRMA_PAROLA: 'Confirmă parola',
    SEARCH_FILTER: 'Caută:',
    DATE_FROM_FILTER: 'De la data:',
    DATE_TO_FILTER: 'Până la data:',
    AMOUNT_MIN_FILTER: 'Suma minimă:',
    AMOUNT_MAX_FILTER: 'Suma maximă:',
    INCOME_TYPE: 'Venit',
    EXPENSE_TYPE: 'Cheltuială',
};
exports.TITLES = {
    TRANZACTII: 'Tranzacții',
    GRID_LUNAR: 'Grid Lunar',
    OPTIUNI: 'Opțiuni',
};
exports.PLACEHOLDERS = {
    ADD_SUBCATEGORY: 'Adaugă subcategorie nouă',
    SELECT: 'Alege',
    AMOUNT: 'Introdu suma',
    DATE: 'Selectează data',
    DESCRIPTION: 'Adaugă o descriere (opțional)',
    CATEGORY_EDITOR_SUBCATEGORY: 'Adaugă subcategorie nouă',
    SEARCH: 'Caută...',
    AMOUNT_MIN_FILTER: 'Suma minimă',
    AMOUNT_MAX_FILTER: 'Suma maximă',
    EDIT_TRANSACTION: 'Editează...',
    ADD_TRANSACTION: 'Adaugă...',
    SUBCATEGORY_NAME: 'Nume subcategorie...',
    AMOUNT_PLACEHOLDER: '0.00',
};
exports.BUTTONS = {
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
    LOGIN: 'Autentificare',
    REGISTER: 'Crează cont',
    LOADING: 'Se încarcă...',
    RESET_FILTERS: 'Resetează filtre',
    RESET_ALL_FILTERS: 'Resetează toate',
};
exports.TOAST = {
    CLOSE: 'Închide notificarea',
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
    DURATION: {
        SHORT: 3000,
        MEDIUM: 5000,
        LONG: 7000,
        PERSISTENT: 0
    }
};
exports.TABLE = {
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
        RUNNING_BALANCE: 'Sold curent',
        ACTIONS: 'Acțiuni',
    },
    EMPTY: exports.EMPTY_STATE_MESSAGES.EMPTY_TRANSACTION_LIST,
    LOADING: exports.LOADING_MESSAGES.GENERIC,
    LOADING_MORE: exports.LOADING_MESSAGES.TRANSACTIONS,
    PAGE_INFO: 'Pagina {current} din {total}',
    SHOWING_INFO: 'Se afișează {shown} din {total} tranzacții',
    BOOL: {
        YES: 'Da',
        NO: 'Nu',
    },
    NO_TRANSACTIONS: exports.EMPTY_STATE_MESSAGES.NO_TRANSACTIONS,
    NO_SUBCATEGORIES: exports.EMPTY_STATE_MESSAGES.NO_SUBCATEGORIES,
    ADVANCED_FEATURES: {
        ITEMS_PER_PAGE: 'Elemente pe pagină:',
        JUMP_TO_PAGE: 'Mergi la pagina:',
        PAGE_SIZE_OPTIONS: 'Opțiuni mărime pagină',
        TOTAL_RECORDS: 'Total înregistrări: {count}',
        SELECTED_RECORDS: '{count} selectate',
        SEARCH_PLACEHOLDER: 'Caută în tranzacții...',
        ADVANCED_SEARCH: 'Căutare avansată',
        REGEX_SEARCH: 'Căutare cu expresii regulate',
        CLEAR_FILTERS: 'Șterge filtrele',
        SAVE_FILTER_PRESET: 'Salvează preset filtru',
        LOAD_FILTER_PRESET: 'Încarcă preset filtru',
        SORT_BY: 'Sortează după',
        SECONDARY_SORT: 'Sortare secundară',
        REMOVE_SORT: 'Elimină sortarea',
        MULTI_COLUMN_SORT_HINT: 'Ține Shift + Click pentru sortare pe mai multe coloane',
        SELECT_ALL: 'Selectează toate',
        SELECT_PAGE: 'Selectează pagina',
        DESELECT_ALL: 'Deselectează toate',
        BULK_ACTIONS: 'Acțiuni în masă',
        BULK_DELETE: 'Șterge selecțiile',
        BULK_EXPORT: 'Exportă selecțiile',
        BULK_EDIT_CATEGORY: 'Modifică categoria',
        EXPORT_OPTIONS: 'Opțiuni export',
        EXPORT_CSV: 'Exportă CSV',
        EXPORT_PDF: 'Exportă PDF',
        EXPORT_EXCEL: 'Exportă Excel',
        EXPORT_FILTERED: 'Exportă doar datele filtrate',
        EXPORT_ALL: 'Exportă toate datele',
        RUNNING_BALANCE_SHOW: 'Afișează soldul curent',
        RUNNING_BALANCE_HIDE: 'Ascunde soldul curent',
        SUMMARY_FOOTER: 'Sumar financiar',
        TOTAL_INCOME: 'Total venituri',
        TOTAL_EXPENSES: 'Total cheltuieli',
        NET_BALANCE: 'Balanța netă',
        AVERAGE_TRANSACTION: 'Tranzacția medie',
        KEYBOARD_SHORTCUTS: 'Comenzi rapide tastatură',
        NAVIGATION_HINT: 'Folosește săgețile pentru navigare',
        EDIT_HINT: 'Enter pentru editare, Escape pentru anulare',
        SEARCH_HINT: 'Ctrl+F pentru căutare rapidă',
        CONTEXT_MENU: {
            EDIT: 'Editează tranzacția',
            DELETE: 'Șterge tranzacția',
            DUPLICATE: 'Duplică tranzacția',
            VIEW_DETAILS: 'Vezi detalii complete',
            ADD_TO_FAVORITES: 'Adaugă la favorite',
            COPY_VALUES: 'Copiază valorile',
        },
        FULLSCREEN_MODE: 'Mod ecran complet',
        COMPACT_VIEW: 'Vizualizare compactă',
        COMFORTABLE_VIEW: 'Vizualizare confortabilă',
        COLUMN_VISIBILITY: 'Vizibilitate coloane',
        RESIZE_COLUMNS: 'Redimensionează coloanele',
        FREEZE_COLUMNS: 'Înghețe coloanele',
    },
};
exports.LOADER = {
    TEXT: exports.LOADING_MESSAGES.GENERIC
};
exports.EXCEL_GRID = {
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
    DAYS_IN_MONTH: [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],
    NO_DATA: exports.EMPTY_STATE_MESSAGES.GENERIC,
    LOADING: exports.LOADING_MESSAGES.DATA,
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
    TABLE_CONTROLS: {
        EXPAND_ALL: 'Extinde toate categoriile',
        COLLAPSE_ALL: 'Colapsează toate categoriile',
        VIRTUAL_TABLE: 'Tabel optimizat',
        LEGACY_TABLE: 'Tabel clasic',
        VERSION: 'Versiune'
    },
    MODAL: {
        FREQUENCY_SHORT: 'Frecv.',
        FINANCIAL_IMPACT_SHORT: 'Impact:',
        FINANCIAL_IMPACT_FULL: 'Impact financiar:',
        SAVE_SHORT: 'OK',
        SAVING_MESSAGE: exports.LOADING_MESSAGES.SAVING_TRANSACTION,
        CLOSE_MODAL_ARIA: 'Închide modalul',
        DELETE_CONFIRMATION_TITLE: 'Confirmați ștergerea tranzacției',
        DELETE_CONFIRMATION_MESSAGE: 'Sigur doriți să ștergeți această tranzacție? Acțiunea nu poate fi anulată.',
        DELETE_CONFIRM_BUTTON: 'Șterge',
        DELETE_CANCEL_BUTTON: 'Anulează'
    },
    ERROR_MESSAGES: {
        SAVE_TRANSACTION_GENERIC: 'Eroare la salvarea tranzacției. Încercați din nou.',
        SAVE_TRANSACTION_PREFIX: 'Eroare la salvarea tranzacției: ',
        DELETE_TRANSACTION_GENERIC: 'Eroare la ștergerea tranzacției. Încercați din nou.',
        DELETE_TRANSACTION_PREFIX: 'Eroare la ștergerea tranzacției: '
    },
    INLINE_EDITING: {
        EDIT_HINT: 'Apasă F2 pentru editare',
        SAVING: exports.LOADING_MESSAGES.SAVING,
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
exports.OPTIONS = {
    TYPE: [
        { value: enums_1.TransactionType.INCOME, label: 'Venit' },
        { value: enums_1.TransactionType.EXPENSE, label: 'Cheltuială' },
        { value: enums_1.TransactionType.SAVING, label: 'Economisire' },
    ],
    CATEGORY: [
        { value: enums_1.CategoryType.INCOME, label: 'Venituri' },
        { value: enums_1.CategoryType.EXPENSE, label: 'Cheltuieli' },
        { value: enums_1.CategoryType.SAVING, label: 'Economii' },
    ],
    FREQUENCY: [
        { value: enums_1.FrequencyType.DAILY, label: 'Zilnic' },
        { value: enums_1.FrequencyType.WEEKLY, label: 'Săptămânal' },
        { value: enums_1.FrequencyType.MONTHLY, label: 'Lunar' },
        { value: enums_1.FrequencyType.YEARLY, label: 'Anual' },
    ],
};
exports.UI = {
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
    CATEGORY_EDITOR: {
        TITLE: 'Gestionare Subcategorii',
        CATEGORIES_SECTION_TITLE: 'Categorii',
        SUBCATEGORIES_SECTION_TITLE: 'Subcategorii pentru',
        CUSTOM_BADGE: 'custom',
        RENAME_BUTTON: 'Redenumește',
        DELETE_BUTTON: 'Șterge',
        ADD_PLACEHOLDER: 'Adaugă subcategorie nouă',
        ADD_BUTTON: 'Adaugă',
        NO_SELECTION: exports.EMPTY_STATE_MESSAGES.NO_SELECTION,
        DELETE_CONFIRMATION_TITLE: 'Confirmare ștergere',
        DELETE_CONFIRMATION_TEXT: 'Ești sigur că vrei să ștergi subcategoria {subcat} din {cat}?',
        DELETE_WARNING: 'Atenție: Există {count} tranzacții care folosesc această subcategorie.',
        CONFIRM_DELETE_BUTTON: 'Confirmă ștergerea',
        CANCEL_BUTTON: 'Anulează'
    },
    FILTERS_ACTIVE: (count) => `${count} filtru${count === 1 ? '' : 'e'} activ${count === 1 ? '' : 'e'}`,
    TRANSACTION_FILTERS: {
        TITLE: 'Filtre',
        SHOW_ADVANCED: 'Filtre avansate',
        HIDE_ADVANCED: 'Ascunde filtre avansate',
        NO_FILTERS: exports.EMPTY_STATE_MESSAGES.NO_FILTERS,
        DATE_RANGE: 'Interval date',
        AMOUNT_RANGE: 'Interval sume',
        TEXT_SEARCH: 'Căutare text',
    },
    SUBCATEGORY_ACTIONS: {
        DELETE_CUSTOM_TITLE: 'Șterge subcategoria custom',
        DELETE_ORPHAN_TITLE: 'Șterge tranzacțiile fără subcategorie (date murdare din trecut)',
        RENAME_TITLE: 'Redenumește subcategoria',
    },
    LUNAR_GRID_TOOLTIPS: {
        CALCULATED_SUM: 'Suma calculată automată din subcategorii',
        DAILY_BALANCES: 'Balanțe zilnice',
    },
    LUNAR_GRID_PAGE: {
        FULLSCREEN_EXIT_HINT: 'Press ESC pentru a ieși din fullscreen',
        NAVIGATION_LOADING: exports.LOADING_MESSAGES.NAVIGATION,
        LOADING_MESSAGE_TEMPLATE: exports.LOADING_MESSAGES.DATE_CONTEXT,
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
exports.FLAGS = {
    CUSTOM: 'custom',
};
exports.INFO = {
    CATEGORY_EDITOR_EMPTY: exports.EMPTY_STATE_MESSAGES.NO_SELECTION,
    NO_TRANSACTIONS: exports.EMPTY_STATE_MESSAGES.NO_TRANSACTIONS,
    NO_SUBCATEGORIES: exports.EMPTY_STATE_MESSAGES.NO_SUBCATEGORIES,
};
exports.LUNAR_GRID = {
    COLLAPSE_ALL: 'Restrânge tot',
    EXPAND_ALL: 'Extinde tot',
    RESET_EXPANSION: 'Resetează',
    LOADING: exports.LOADING_MESSAGES.DATA,
    NO_DATA: exports.EMPTY_STATE_MESSAGES.GENERIC,
    get TOTAL_BALANCE() { return exports.BALANCE_LABELS.SOLD; },
    EXPAND_CATEGORY: 'Extinde',
    COLLAPSE_CATEGORY: 'Restrânge',
    EXPAND_CATEGORY_TITLE: 'Extinde categoria',
    COLLAPSE_CATEGORY_TITLE: 'Restrânge categoria',
    SCROLL_HINT: 'Scroll pentru a vedea mai multe date',
    STICKY_HEADER_ACTIVE: 'Header fix activ',
    RESIZE: {
        TOGGLE_FULLSCREEN: 'Comută fullscreen',
        EXIT_FULLSCREEN: 'Ieși din fullscreen',
        RESIZE_BUTTON_TITLE: 'Redimensionează tabelul',
        FULLSCREEN_MODE: 'Mod fullscreen activ',
        NORMAL_MODE: 'Mod normal'
    }
};
exports.TEST_CONSTANTS = {
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
exports.LUNAR_GRID_ACTIONS = {
    NO_TRANSACTIONS: 'fără tranzacții',
    ENTER_KEY: 'Enter',
    ESCAPE_KEY: 'Escape',
    DELETE_TRANSACTION_SINGLE: 'Ștergi această tranzacție definitiv?',
    DELETE_TRANSACTION_MULTIPLE: 'Ștergi {count} tranzacții definitiv?',
    DELETE_SUCCESS_SINGLE: 'Tranzacție ștearsă cu succes',
    DELETE_SUCCESS_MULTIPLE: '{count} tranzacții șterse cu succes',
    DELETE_ERROR: 'Eroare la ștergerea tranzacțiilor',
    NO_TRANSACTIONS_TO_DELETE: 'Nu există tranzacții de șters pentru pozițiile selectate',
};
exports.ACCOUNT_MANAGEMENT = {
    MAX_ACCOUNTS: 10,
    LABELS: {
        ACCOUNT_NAME: 'Nume cont',
        ACCOUNT_TYPE: 'Tip cont',
        INITIAL_BALANCE: 'Sold inițial',
        CURRENT_BALANCE: 'Sold curent',
        ACCOUNT_DESCRIPTION: 'Descriere cont',
        DEFAULT_ACCOUNT: 'Cont principal',
        ACTIVE_STATUS: 'Activ',
    },
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
    ACTIONS: {
        ADD_ACCOUNT: 'Adaugă cont nou',
        EDIT_ACCOUNT: 'Editează cont',
        DELETE_ACCOUNT: 'Șterge cont',
        SET_DEFAULT: 'Setează ca principal',
        ACTIVATE_ACCOUNT: 'Activează cont',
        DEACTIVATE_ACCOUNT: 'Dezactivează cont',
    },
    STATUS: {
        ACCOUNT_CREATED: 'Cont creat cu succes',
        ACCOUNT_UPDATED: 'Cont actualizat cu succes',
        ACCOUNT_DELETED: 'Cont șters cu succes',
        ACCOUNT_SET_DEFAULT: 'Cont setat ca principal',
    },
};
exports.BALANCE_DISPLAY = {
    CURRENCY: 'RON',
    DECIMAL_PLACES: 2,
    THOUSAND_SEPARATOR: '.',
    DECIMAL_SEPARATOR: ',',
    LABELS: {
        AVAILABLE_BALANCE: 'Sold disponibil',
        SAVINGS_BALANCE: 'Sold economii',
        TOTAL_BALANCE: 'Sold total',
        PROJECTED_BALANCE: 'Sold proiectat',
        DAILY_BALANCE: 'Sold zilnic',
        BALANCE_CHANGE: 'Schimbare sold',
        BALANCE_TREND: 'Tendință sold',
    },
    COLORS: {
        INCOME: 'text-green-600 bg-green-50 border-green-200',
        EXPENSE: 'text-red-600 bg-red-50 border-red-200',
        SAVING: 'text-blue-600 bg-blue-50 border-blue-200',
        POSITIVE: 'text-green-600',
        NEGATIVE: 'text-red-600',
        NEUTRAL: 'text-gray-600',
    },
    GRID_STYLES: {
        BALANCE_ROW: 'font-semibold bg-gray-50',
        BALANCE_CELL: 'text-right font-mono text-sm',
        BALANCE_TOTAL: 'border-t-2 border-gray-300 font-bold',
        BALANCE_PROJECTION: 'bg-blue-50 border-blue-200',
    },
    STATUS: {
        CALCULATED: 'Calculat automat',
        MANUAL_OVERRIDE: 'Suprascris manual',
        PROJECTED: 'Valoare proiectată',
        CONFIRMED: 'Confirmat',
    },
};
exports.BALANCE_MODALS = {
    ACCOUNT: {
        CREATE_TITLE: 'Adaugă cont nou',
        EDIT_TITLE: 'Editează cont',
        DELETE_TITLE: 'Șterge cont',
        TRANSFER_TITLE: 'Transfer între conturi',
    },
    BALANCE: {
        ADJUST_TITLE: 'Ajustează sold',
        RECONCILE_TITLE: 'Reconciliere sold',
        PROJECTION_TITLE: 'Proiecție sold',
        HISTORY_TITLE: 'Istoric sold',
    },
    CONFIRMATIONS: {
        DELETE_ACCOUNT: 'Ștergeți contul și toate datele asociate?',
        ADJUST_BALANCE: 'Confirmați ajustarea soldului?',
        TRANSFER_FUNDS: 'Confirmați transferul de fonduri?',
        RECONCILE: 'Confirmați reconcilierea soldului?',
    },
};
exports.BALANCE_LABELS = {
    SOLD: 'Sold',
    TOTAL_BALANCE: 'Sold total',
    DAILY_BALANCES: 'Balanțe zilnice',
    BALANCE: 'Balanță',
    AVAILABLE: 'Disponibil',
    SAVINGS: 'Economii',
    INVESTMENTS: 'Investiții',
};
exports.EXPORT_UI = {
    YEAR_LABEL: 'An:',
    MONTH_LABEL: 'Lună:',
    CATEGORY_FILTER_LABEL: 'Categorie:',
    FILENAME_LABEL: 'Numele fișierului:',
    FILENAME_PLACEHOLDER: 'ex: raport-lunar'
};
exports.TOOLTIP = {
    DEFAULT_DELAY: 200,
    PLACEMENTS: {
        TOP: 'Sus',
        BOTTOM: 'Jos',
        LEFT: 'Stânga',
        RIGHT: 'Dreapta'
    },
    VARIANTS: {
        DEFAULT: 'Implicit',
        INFO: 'Informație',
        WARNING: 'Avertisment',
        ERROR: 'Eroare',
        SUCCESS: 'Succes'
    }
};
exports.PROGRESS = {
    LABELS: {
        BUDGET_PROGRESS: 'Progres Buget',
        EXPORT_PROGRESS: 'Progres Export',
        LOADING_PROGRESS: 'Se încarcă...',
        FINANCIAL_GOAL: 'Obiectiv Financiar'
    },
    VARIANTS: {
        DEFAULT: 'Implicit',
        SUCCESS: 'Succes',
        WARNING: 'Avertisment',
        ERROR: 'Eroare',
        FINANCIAL: 'Financiar'
    },
    SIZES: {
        SMALL: 'Mic',
        MEDIUM: 'Mediu',
        LARGE: 'Mare',
        EXTRA_LARGE: 'Extra Mare'
    },
    POSITIONS: {
        TOP: 'Sus',
        BOTTOM: 'Jos',
        INLINE: 'În linie'
    }
};
exports.BADGE = {
    VARIANTS: {
        NEUTRAL: 'Neutru',
        PRIMARY: 'Principal',
        SUCCESS: 'Succes',
        WARNING: 'Avertisment',
        ERROR: 'Eroare',
        INFO: 'Informație'
    },
    FINANCIAL_STATES: {
        OVER_BUDGET: 'Peste Buget',
        UNDER_BUDGET: 'Sub Buget',
        ON_TARGET: 'Pe Țintă',
        INCOME: 'Venit',
        EXPENSE: 'Cheltuială'
    }
};
exports.NAVIGATION = {
    ITEMS: {
        DASHBOARD: 'Tablou de bord',
        TRANSACTIONS: 'Tranzacții',
        LUNAR_GRID: 'Grid Lunar',
        ACCOUNTS: 'Conturi',
        REPORTS: 'Rapoarte',
        OPTIONS: 'Opțiuni',
        SETTINGS: 'Setări'
    },
    SIDEBAR: {
        TOGGLE: 'Comută sidebar',
        EXPAND: 'Extinde sidebar',
        COLLAPSE: 'Restrânge sidebar',
        PERSISTENT: 'Sidebar persistent',
        AUTO_HIDE: 'Ascunde automat'
    },
    BREADCRUMBS: {
        HOME: 'Acasă',
        SEPARATOR: '/',
        BACK_TO: 'Înapoi la',
        CURRENT_PAGE: 'Pagina curentă'
    },
    CONTEXT_MENU: {
        OPEN: 'Deschide meniu contextual',
        CLOSE: 'Închide meniu contextual',
        NEW_TAB: 'Deschide în tab nou',
        BOOKMARK: 'Adaugă la favorite',
        SHARE: 'Partajează'
    },
    TABS: {
        NEW_TAB: 'Tab nou',
        CLOSE_TAB: 'Închide tab',
        CLOSE_ALL: 'Închide toate',
        CLOSE_OTHERS: 'Închide celelalte',
        NEXT_TAB: 'Tab următor',
        PREV_TAB: 'Tab anterior'
    },
    SHORTCUTS: {
        TOGGLE_SIDEBAR: 'Ctrl+\\',
        NEW_TAB: 'Ctrl+T',
        CLOSE_TAB: 'Ctrl+W',
        NEXT_TAB: 'Ctrl+Tab',
        PREV_TAB: 'Ctrl+Shift+Tab',
        CONTEXT_MENU: 'Shift+F10',
        HOME: 'Alt+H',
        BACK: 'Alt+Săgeată stânga',
        FORWARD: 'Alt+Săgeată dreapta',
        COMMAND_PALETTE: 'Ctrl+K',
        TOGGLE_DARK_MODE: 'Ctrl+D'
    },
    COMMAND_PALETTE: {
        TITLE: 'Comandă rapidă',
        PLACEHOLDER: 'Caută acțiuni, pagini, shortcuts...',
        NO_RESULTS: 'Niciun rezultat găsit',
        HELP_TEXT: 'Apasă Escape pentru a închide',
        CATEGORIES: {
            NAVIGATION: 'Navigare',
            ACTIONS: 'Acțiuni',
            SHORTCUTS: 'Comenzi rapide',
            RECENT: 'Recent'
        },
        RESULTS: {
            GO_TO: 'Mergi la',
            EXECUTE: 'Execută',
            OPEN: 'Deschide',
            TOGGLE: 'Comută'
        }
    },
    THEME: {
        TOGGLE_DARK_MODE: 'Comută tema întunecată',
        DARK_MODE: 'Tema întunecată',
        LIGHT_MODE: 'Tema deschisă',
        SYSTEM_PREFERENCE: 'Preferința sistemului',
        TOGGLE_DESCRIPTION: 'Comută între tema deschisă și întunecată'
    },
    MOBILE: {
        HAMBURGER: 'Deschide meniul principal',
        CLOSE_MENU: 'Închide meniul',
        MENU_OVERLAY: 'Overlay meniu mobil'
    },
    ARIA: {
        NAVIGATION: 'Navigare principală',
        BREADCRUMB: 'Navigare breadcrumb',
        TAB_LIST: 'Listă taburi',
        TAB_PANEL: 'Panou tab',
        CURRENT_PAGE: 'Pagina curentă',
        EXTERNAL_LINK: 'Deschide în fereastră nouă',
        CONTEXT_MENU: 'Meniu contextual'
    },
    STORAGE: {
        SIDEBAR_EXPANDED: 'sidebar-expanded',
        TABS_STATE: 'app-tabs-state',
        BREADCRUMB_HISTORY: 'navigation-breadcrumb-history',
        NAVIGATION_STATE: 'navigation-global-state',
        LAST_VISITED_PAGE: 'navigation-last-page',
        USER_PREFERENCES: 'navigation-user-preferences'
    },
    STATE: {
        PERSISTENCE_ENABLED: 'Persistența navigării activată',
        PERSISTENCE_DISABLED: 'Persistența navigării dezactivată',
        STATE_RESTORED: 'Starea navigării a fost restaurată',
        STATE_CLEARED: 'Starea navigării a fost ștearsă',
        SYNC_COMPLETE: 'Sincronizarea componentelor completă',
        SYNC_FAILED: 'Eșec la sincronizarea componentelor'
    }
};
//# sourceMappingURL=ui.js.map
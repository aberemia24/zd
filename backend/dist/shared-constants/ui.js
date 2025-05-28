"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TEST_CONSTANTS = exports.LUNAR_GRID = exports.INFO = exports.FLAGS = exports.UI = exports.OPTIONS = exports.EXCEL_GRID = exports.LOADER = exports.TABLE = exports.BUTTONS = exports.PLACEHOLDERS = exports.TITLES = exports.LABELS = void 0;
const enums_1 = require("./enums");
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
exports.LOADER = {
    TEXT: 'Se încarcă...'
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
    TABLE_CONTROLS: {
        EXPAND_ALL: 'Extinde toate categoriile',
        COLLAPSE_ALL: 'Colapsează toate categoriile',
        VIRTUAL_TABLE: 'Tabel optimizat',
        LEGACY_TABLE: 'Tabel clasic',
        VERSION: 'Versiune'
    },
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
        NO_SELECTION: 'Selectează o categorie pentru a vedea și edita subcategoriile.',
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
        NO_FILTERS: 'Nu există filtre active',
        DATE_RANGE: 'Interval date',
        AMOUNT_RANGE: 'Interval sume',
        TEXT_SEARCH: 'Căutare text',
    },
};
exports.FLAGS = {
    CUSTOM: 'custom',
};
exports.INFO = {
    CATEGORY_EDITOR_EMPTY: 'Selectează o categorie pentru a vedea și edita subcategoriile.',
    NO_TRANSACTIONS: 'Nu există tranzacții pentru criteriile selectate. Încercați să modificați filtrele sau adăugați o tranzacție nouă.',
    NO_SUBCATEGORIES: 'Nu există tranzacții pentru această categorie',
};
exports.LUNAR_GRID = {
    COLLAPSE_ALL: 'Restrânge tot',
    EXPAND_ALL: 'Extinde tot',
    RESET_EXPANSION: 'Resetează',
    LOADING: 'Se încarcă datele...',
    NO_DATA: 'Nu există date pentru perioada selectată',
    TOTAL_BALANCE: 'Sold'
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
//# sourceMappingURL=ui.js.map
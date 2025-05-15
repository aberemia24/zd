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
};

export const TITLES = {
  TRANZACTII: 'Tranzacții',
  GRID_LUNAR: 'Grid Lunar',
  OPTIUNI: 'Opțiuni',
};

export const PLACEHOLDERS = {
  SELECT: 'Alege',
  AMOUNT: 'Introdu suma',
  DATE: 'Selectează data',
};

export const BUTTONS = {
  ADD: 'Adaugă',
  CANCEL: 'Anulează',
  DONE: 'Gata',
  EDIT: 'Editează',
  DELETE: 'Șterge',
  NEXT_PAGE: 'Înainte',
  PREV_PAGE: 'Înapoi',
  ADD_SUBCATEGORY: 'Adaugă subcategorie',
  MANAGE_CATEGORIES: 'Gestionare categorii',
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
  BOOL: {
    YES: 'Da',
    NO: 'Nu',
  },
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
  },
  NO_DATA: 'Nu există date disponibile',
  LOADING: 'Se încarcă datele...',
  PROMPTS: {
    ENTER_AMOUNT: 'Introduceți suma:'
  },
  ACTIONS: {
    ADD_SUBCATEGORY: 'Adaugă subcategorie',
    EDIT_SUBCATEGORY: 'Editează subcategorie',
    DELETE_SUBCATEGORY: 'Șterge subcategorie',
  },
  // Constante pentru controalele tabelului TanStack
  TABLE_CONTROLS: {
    EXPAND_ALL: 'Extinde toate categoriile',
    COLLAPSE_ALL: 'Colapsează toate categoriile',
    VIRTUAL_TABLE: 'Tabel optimizat',
    LEGACY_TABLE: 'Tabel clasic',
    VERSION: 'Versiune'
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
};

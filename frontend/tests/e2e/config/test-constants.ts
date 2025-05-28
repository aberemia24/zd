/**
 * Constante pentru testele E2E
 * Toate valorile hardcodate sunt centralizate aici
 */

// URLs și rute
export const URLS = {
  BASE_URL: 'http://localhost:3000',
  LOGIN: '/login',
  REGISTER: '/register',
  TRANSACTIONS: '/transactions',
  DASHBOARD: '/',
} as const;

// Timeouts
export const TIMEOUTS = {
  DEFAULT: 30000,
  LONG: 60000,
  SHORT: 5000,
  NAVIGATION: 10000,
} as const;

// Selectori de test (data-testid)
export const SELECTORS = {
  // Login page
  LOGIN_EMAIL: 'login-email',
  LOGIN_PASSWORD: 'login-password',
  LOGIN_SUBMIT: 'login-submit',
  LOGIN_FORM: 'login-form',
  
  // Register page
  REGISTER_EMAIL: 'register-email',
  REGISTER_PASSWORD: 'register-password',
  REGISTER_CONFIRM_PASSWORD: 'register-confirm-password',
  REGISTER_SUBMIT: 'register-submit',
  
  // Navigation
  NAV_TRANSACTIONS: 'nav-transactions',
  NAV_DASHBOARD: 'nav-dashboard',
  NAV_LOGOUT: 'nav-logout',
  
  // Transaction forms
  TRANSACTION_FORM: 'transaction-form',
  TRANSACTION_AMOUNT: 'transaction-amount',
  TRANSACTION_TYPE: 'transaction-type',
  TRANSACTION_CATEGORY: 'transaction-category',
  TRANSACTION_SAVE: 'transaction-save',
  
  // Common elements
  LOADING_SPINNER: 'loading-spinner',
  ERROR_MESSAGE: 'error-message',
  SUCCESS_MESSAGE: 'success-message',
} as const;

// Mesaje de așteptare
export const EXPECTED_TEXTS = {
  LOGIN_PAGE_TITLE: 'Autentificare',
  TRANSACTIONS_PAGE_TITLE: 'Tranzacții',
  DASHBOARD_TITLE: 'Dashboard',
  WELCOME_MESSAGE: 'Bine ai venit',
} as const;

// Configurare pentru conturi de test
export const TEST_ACCOUNTS = {
  // Contul principal de test furnizat de utilizator
  PRIMARY: {
    email: 'aberemia@gmail.com',
    password: 'test123',
    type: 'real_account' as const,
    description: 'Cont principal de test'
  },
  
  // Template pentru conturi dinamice (dacă se vor crea)
  DYNAMIC_TEMPLATE: {
    domain: '@example.com',
    passwordPattern: 'Test123!@#',
    type: 'generated' as const,
  }
} as const;

// Configurare pentru screenshot-uri și debugging
export const DEBUG = {
  SCREENSHOTS_ENABLED: true,
  SCREENSHOT_PATH: 'test-results/screenshots',
  VERBOSE_LOGGING: true,
} as const;

// Configurare pentru retry-uri și stabilitate
export const STABILITY = {
  MAX_RETRIES: 3,
  RETRY_DELAY: 1000,
  ELEMENT_WAIT_TIME: 5000,
  PAGE_LOAD_WAIT: 3000,
} as const;

// Date pentru testele LunarGrid - acum folosește generatorul dinamic
export const LUNAR_GRID_TEST_DATA = {
  // Zile standard pentru teste (rămân statice pentru consistență)
  DAYS: {
    EARLY_DAY: 1,
    MID_DAY: 15,
    LATE_DAY: 30,
  },
  GRID_ELEMENTS: {
    CONTAINER: 'lunar-grid-container',
    TABLE: 'lunar-grid-table',
    MONTH_SELECTOR: 'month-selector',
    YEAR_INPUT: 'year-input',
    NAV_TAB: 'lunar-grid-tab',
    // Butoane pentru expandare categorii
    EXPAND_ALL: 'expand-all-btn',
    COLLAPSE_ALL: 'collapse-all-btn',
  },
  // Workflow real pentru teste
  REALISTIC_WORKFLOW: {
    // Pasul 1: Expandează categoriile pentru a vedea subcategoriile  
    EXPAND_CATEGORIES_FIRST: true,
    // Pasul 2: Click pe celula subcategoriei (nu categoria principală)
    USE_SUBCATEGORY_CELLS: true,
    // Pasul 3: Test pattern pentru celule: lunar-cell-{CATEGORY}-{SUBCATEGORY}-{DAY}
    CELL_PATTERN: 'lunar-cell-{category}-{subcategory}-{day}',
  }
} as const;

// DEPRECAT: Datele statice rămân pentru referință, dar nu se mai folosesc
export const DEPRECATED_STATIC_DATA = {
  CATEGORIES: {
    TEST_CATEGORY: 'NUTRITIE',
    SECONDARY_CATEGORY: 'TRANSPORT',
  },
  SUBCATEGORIES: {
    NUTRITIE_ALIMENTE: 'Alimente',
    NUTRITIE_RESTAURANTE: 'Restaurante',
    TRANSPORT_PUBLIC: 'Transport public',
  },
  AMOUNTS: {
    SMALL_AMOUNT: '10.00',
    MEDIUM_AMOUNT: '25.50',
    LARGE_AMOUNT: '100.00',
    EXPECTED_TOTAL: '35.50',
  },
} as const;

// Pagini și navigare
export const PAGES = {
  NAVIGATION: {
    TRANSACTIONS_TAB: 'transactions-tab',
    LUNAR_GRID_TAB: 'lunar-grid-tab',
    OPTIONS_TAB: 'options-tab',
  },
  ELEMENTS: {
    TRANSACTIONS_TITLE: 'transactions-title',
    OPTIONS_TITLE: 'options-title',
  }
} as const; 
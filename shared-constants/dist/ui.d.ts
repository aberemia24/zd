import { CategoryType, FrequencyType, TransactionType } from './enums';
export declare const LOADING_MESSAGES: {
    GENERIC: string;
    WITH_CONTEXT: (context: string) => string;
    DATA: string;
    MORE: string;
    TRANSACTIONS: string;
    NAVIGATION: string;
    SAVING: string;
    SAVING_TRANSACTION: string;
    SPECIFIC: (item: string) => string;
    DATE_CONTEXT: (month: string, year: string) => string;
};
export declare const EMPTY_STATE_MESSAGES: {
    NO_ITEMS: (entity: string) => string;
    NO_DATA_FILTER: (filter: string) => string;
    NO_TRANSACTIONS: string;
    NO_SUBCATEGORIES: string;
    GENERIC: string;
    NO_SELECTION: string;
    NO_FILTERS: string;
    EMPTY_TRANSACTION_LIST: string;
};
export declare const DESIGN_TOKENS: {
    SIZES: {
        SPINNER: {
            SMALL: number;
            MEDIUM: number;
            LARGE: number;
            XLARGE: number;
        };
        BREAKPOINTS: {
            SM: number;
            MD: number;
            LG: number;
            XL: number;
        };
        SPACING: {
            GRID_GAP: number;
            MODAL_PADDING: number;
            CARD_PADDING: number;
        };
    };
    DATE_RANGES: {
        MIN_YEAR: number;
        MAX_YEAR: number;
        DEFAULT_RANGE: number;
    };
    TRANSITIONS: {
        DEFAULT: string;
        FAST: string;
        SLOW: string;
    };
};
export declare const LABELS: {
    TYPE: string;
    AMOUNT: string;
    CATEGORY: string;
    SUBCATEGORY: string;
    DATE: string;
    RECURRING: string;
    FREQUENCY: string;
    TYPE_FILTER: string;
    CATEGORY_FILTER: string;
    FORM: string;
    DESCRIPTION: string;
    EMAIL: string;
    PAROLA: string;
    CONFIRMA_PAROLA: string;
    SEARCH_FILTER: string;
    DATE_FROM_FILTER: string;
    DATE_TO_FILTER: string;
    AMOUNT_MIN_FILTER: string;
    AMOUNT_MAX_FILTER: string;
    INCOME_TYPE: string;
    EXPENSE_TYPE: string;
};
export declare const TITLES: {
    TRANZACTII: string;
    GRID_LUNAR: string;
    OPTIUNI: string;
};
export declare const PLACEHOLDERS: {
    ADD_SUBCATEGORY: string;
    SELECT: string;
    AMOUNT: string;
    DATE: string;
    DESCRIPTION: string;
    CATEGORY_EDITOR_SUBCATEGORY: string;
    SEARCH: string;
    AMOUNT_MIN_FILTER: string;
    AMOUNT_MAX_FILTER: string;
    EDIT_TRANSACTION: string;
    ADD_TRANSACTION: string;
    SUBCATEGORY_NAME: string;
    AMOUNT_PLACEHOLDER: string;
};
export declare const BUTTONS: {
    RENAME: string;
    ADD: string;
    CANCEL: string;
    DONE: string;
    EDIT: string;
    DELETE: string;
    NEXT_PAGE: string;
    PREV_PAGE: string;
    ADD_SUBCATEGORY: string;
    MANAGE_CATEGORIES: string;
    EXPORT: string;
    LOGIN: string;
    REGISTER: string;
    LOADING: string;
    RESET_FILTERS: string;
    RESET_ALL_FILTERS: string;
};
export declare const TOAST: {
    CLOSE: string;
    INFO: {
        TITLE: string;
        DEFAULT_MESSAGE: string;
    };
    SUCCESS: {
        TITLE: string;
        DEFAULT_MESSAGE: string;
    };
    WARNING: {
        TITLE: string;
        DEFAULT_MESSAGE: string;
    };
    ERROR: {
        TITLE: string;
        DEFAULT_MESSAGE: string;
    };
    TRANSACTION: {
        ADDED: string;
        UPDATED: string;
        DELETED: string;
        DELETED_PERMANENT: string;
        RESTORED: string;
        RESTORED_CTRL_Z: string;
        ERROR_ADDING: string;
        ERROR_UPDATING: string;
        ERROR_DELETING: string;
        ERROR_RESTORING: string;
        UNDO: {
            TITLE: string;
            BUTTON_TEXT: string;
            NO_OPERATION: string;
            EXPIRED: string;
            SUCCESS_TOAST: string;
            SUCCESS_CTRL_Z: string;
            ERROR: string;
        };
    };
    CATEGORY: {
        ADDED: string;
        UPDATED: string;
        DELETED: string;
        ERROR_ADDING: string;
        ERROR_UPDATING: string;
        ERROR_DELETING: string;
    };
    EXPORT: {
        SUCCESS: string;
        ERROR: string;
    };
    AUTH: {
        LOGIN_SUCCESS: string;
        LOGIN_ERROR: string;
        LOGOUT_SUCCESS: string;
        REGISTER_SUCCESS: string;
    };
    DURATION: {
        SHORT: number;
        MEDIUM: number;
        LONG: number;
        PERSISTENT: number;
    };
};
export declare const POPOVER_CONSTANTS: {
    ARIA_LABELS: {
        CONTENT: string;
        TRIGGER: string;
        CLOSE: string;
    };
    POSITIONS: {
        TOP: "top";
        RIGHT: "right";
        BOTTOM: "bottom";
        LEFT: "left";
    };
    ALIGNMENTS: {
        START: "start";
        CENTER: "center";
        END: "end";
    };
    DEFAULTS: {
        SIDE_OFFSET: number;
        MAX_WIDTH: string;
        ANIMATION_DURATION: number;
    };
};
export declare const TABLE: {
    HEADERS: {
        TYPE: string;
        AMOUNT: string;
        CURRENCY: string;
        CATEGORY: string;
        SUBCATEGORY: string;
        DATE: string;
        RECURRING: string;
        FREQUENCY: string;
        DESCRIPTION: string;
        RUNNING_BALANCE: string;
        ACTIONS: string;
    };
    EMPTY: string;
    LOADING: string;
    LOADING_MORE: string;
    PAGE_INFO: string;
    SHOWING_INFO: string;
    BOOL: {
        YES: string;
        NO: string;
    };
    NO_TRANSACTIONS: string;
    NO_SUBCATEGORIES: string;
    ADVANCED_FEATURES: {
        ITEMS_PER_PAGE: string;
        JUMP_TO_PAGE: string;
        PAGE_SIZE_OPTIONS: string;
        TOTAL_RECORDS: string;
        SELECTED_RECORDS: string;
        SEARCH_PLACEHOLDER: string;
        ADVANCED_SEARCH: string;
        REGEX_SEARCH: string;
        CLEAR_FILTERS: string;
        SAVE_FILTER_PRESET: string;
        LOAD_FILTER_PRESET: string;
        SORT_BY: string;
        SECONDARY_SORT: string;
        REMOVE_SORT: string;
        MULTI_COLUMN_SORT_HINT: string;
        SELECT_ALL: string;
        SELECT_PAGE: string;
        DESELECT_ALL: string;
        BULK_ACTIONS: string;
        BULK_DELETE: string;
        BULK_EXPORT: string;
        BULK_EDIT_CATEGORY: string;
        EXPORT_OPTIONS: string;
        EXPORT_CSV: string;
        EXPORT_PDF: string;
        EXPORT_EXCEL: string;
        EXPORT_FILTERED: string;
        EXPORT_ALL: string;
        RUNNING_BALANCE_SHOW: string;
        RUNNING_BALANCE_HIDE: string;
        SUMMARY_FOOTER: string;
        TOTAL_INCOME: string;
        TOTAL_EXPENSES: string;
        NET_BALANCE: string;
        AVERAGE_TRANSACTION: string;
        KEYBOARD_SHORTCUTS: string;
        NAVIGATION_HINT: string;
        EDIT_HINT: string;
        SEARCH_HINT: string;
        CONTEXT_MENU: {
            EDIT: string;
            DELETE: string;
            DUPLICATE: string;
            VIEW_DETAILS: string;
            ADD_TO_FAVORITES: string;
            COPY_VALUES: string;
        };
        FULLSCREEN_MODE: string;
        COMPACT_VIEW: string;
        COMFORTABLE_VIEW: string;
        COLUMN_VISIBILITY: string;
        RESIZE_COLUMNS: string;
        FREEZE_COLUMNS: string;
    };
};
export declare const LOADER: {
    TEXT: string;
};
export declare const EXCEL_GRID: {
    HEADERS: {
        LUNA: string;
        VENITURI: string;
        CHELTUIELI: string;
        ECONOMII: string;
        SOLD: string;
        CATEGORII: string;
        TOTAL: string;
        ACTIUNI: string;
        ZI: string;
        SUMA: string;
        TIP: string;
        DATA: string;
        DESCRIERE: string;
        RECURENT: string;
        FRECVENTA: string;
    };
    DAYS_IN_MONTH: number[];
    NO_DATA: string;
    LOADING: string;
    PROMPTS: {
        ENTER_AMOUNT: string;
        SELECT_CATEGORY: string;
        SELECT_SUBCATEGORY: string;
        SELECT_DAY: string;
        ENTER_DESCRIPTION: string;
    };
    ACTIONS: {
        ADD_SUBCATEGORY: string;
        EDIT_SUBCATEGORY: string;
        DELETE_SUBCATEGORY: string;
        ADD_TRANSACTION: string;
        EDIT_TRANSACTION: string;
        DELETE_TRANSACTION: string;
        EXPAND_ALL: string;
        COLLAPSE_ALL: string;
        SAVE_CHANGES: string;
        CANCEL: string;
        CONFIRM: string;
    };
    TABLE_CONTROLS: {
        EXPAND_ALL: string;
        COLLAPSE_ALL: string;
        VIRTUAL_TABLE: string;
        LEGACY_TABLE: string;
        VERSION: string;
    };
    MODAL: {
        FREQUENCY_SHORT: string;
        FINANCIAL_IMPACT_SHORT: string;
        FINANCIAL_IMPACT_FULL: string;
        SAVE_SHORT: string;
        SAVING_MESSAGE: string;
        CLOSE_MODAL_ARIA: string;
        DELETE_CONFIRMATION_TITLE: string;
        DELETE_CONFIRMATION_MESSAGE: string;
        DELETE_CONFIRM_BUTTON: string;
        DELETE_CANCEL_BUTTON: string;
    };
    ERROR_MESSAGES: {
        SAVE_TRANSACTION_GENERIC: string;
        SAVE_TRANSACTION_PREFIX: string;
        DELETE_TRANSACTION_GENERIC: string;
        DELETE_TRANSACTION_PREFIX: string;
    };
    INLINE_EDITING: {
        EDIT_HINT: string;
        SAVING: string;
        CLICK_DETECTION_DELAY: number;
        VALIDATION_ERRORS: {
            EMPTY_VALUE: string;
            INVALID_NUMBER: string;
            NEGATIVE_VALUE: string;
            INVALID_PERCENTAGE: string;
            PERCENTAGE_RANGE: string;
            INVALID_DATE: string;
            TEXT_TOO_LONG: string;
        };
        SAVE_ERROR: string;
        PLACEHOLDER: {
            AMOUNT: string;
            TEXT: string;
            PERCENTAGE: string;
            DATE: string;
        };
    };
};
export declare const OPTIONS: {
    TYPE: {
        value: TransactionType;
        label: string;
    }[];
    CATEGORY: {
        value: CategoryType;
        label: string;
    }[];
    FREQUENCY: {
        value: FrequencyType;
        label: string;
    }[];
};
export declare const UI: {
    OPTIONS_PAGE_TITLE: string;
    CATEGORY_MANAGEMENT: string;
    CATEGORY_MANAGEMENT_DESCRIPTION: string;
    MANAGE_CATEGORIES: string;
    DISPLAY_OPTIONS: string;
    DATA_EXPORT: string;
    ACCOUNT_SETTINGS: string;
    ACCOUNT_LOGOUT_DESCRIPTION: string;
    LOGOUT_BUTTON: string;
    COMING_SOON: string;
    LOGIN_REQUIRED: string;
    ADD_SUBCATEGORY: string;
    DELETE_SUBCATEGORY: string;
    EDIT_SUBCATEGORY: string;
    CATEGORY_EDITOR: {
        TITLE: string;
        CATEGORIES_SECTION_TITLE: string;
        SUBCATEGORIES_SECTION_TITLE: string;
        CUSTOM_BADGE: string;
        RENAME_BUTTON: string;
        DELETE_BUTTON: string;
        ADD_PLACEHOLDER: string;
        ADD_BUTTON: string;
        NO_SELECTION: string;
        DELETE_CONFIRMATION_TITLE: string;
        DELETE_CONFIRMATION_TEXT: string;
        DELETE_WARNING: string;
        CONFIRM_DELETE_BUTTON: string;
        CANCEL_BUTTON: string;
    };
    FILTERS_ACTIVE: (count: number) => string;
    TRANSACTION_FILTERS: {
        TITLE: string;
        SHOW_ADVANCED: string;
        HIDE_ADVANCED: string;
        NO_FILTERS: string;
        DATE_RANGE: string;
        AMOUNT_RANGE: string;
        TEXT_SEARCH: string;
    };
    SUBCATEGORY_ACTIONS: {
        DELETE_CUSTOM_TITLE: string;
        DELETE_ORPHAN_TITLE: string;
        RENAME_TITLE: string;
    };
    LUNAR_GRID_TOOLTIPS: {
        CALCULATED_SUM: string;
        DAILY_BALANCES: string;
    };
    LUNAR_GRID_PAGE: {
        FULLSCREEN_EXIT_HINT: string;
        NAVIGATION_LOADING: string;
        LOADING_MESSAGE_TEMPLATE: (month: string, year: string) => string;
        LAYOUT_MODES: {
            FULL_WIDTH: string;
            FULLSCREEN: string;
        };
        LAYOUT_TOGGLE_TOOLTIP: string;
        MONTHS: {
            IANUARIE: string;
            FEBRUARIE: string;
            MARTIE: string;
            APRILIE: string;
            MAI: string;
            IUNIE: string;
            IULIE: string;
            AUGUST: string;
            SEPTEMBRIE: string;
            OCTOMBRIE: string;
            NOIEMBRIE: string;
            DECEMBRIE: string;
        };
    };
};
export declare const FLAGS: {
    CUSTOM: string;
};
export declare const INFO: {
    CATEGORY_EDITOR_EMPTY: string;
    NO_TRANSACTIONS: string;
    NO_SUBCATEGORIES: string;
};
export declare const LUNAR_GRID: {
    COLLAPSE_ALL: string;
    EXPAND_ALL: string;
    RESET_EXPANSION: string;
    LOADING: string;
    NO_DATA: string;
    readonly TOTAL_BALANCE: string;
    EXPAND_CATEGORY: string;
    COLLAPSE_CATEGORY: string;
    EXPAND_CATEGORY_TITLE: string;
    COLLAPSE_CATEGORY_TITLE: string;
    SCROLL_HINT: string;
    STICKY_HEADER_ACTIVE: string;
    RESIZE: {
        TOGGLE_FULLSCREEN: string;
        EXIT_FULLSCREEN: string;
        RESIZE_BUTTON_TITLE: string;
        FULLSCREEN_MODE: string;
        NORMAL_MODE: string;
    };
};
export declare const TEST_CONSTANTS: {
    ALERTS: {
        TEST_MESSAGE: string;
        ERROR_MESSAGE: string;
        SUCCESS_MESSAGE: string;
        WARNING_MESSAGE: string;
        INFO_MESSAGE: string;
        CUSTOM_CLASS_MESSAGE: string;
        BASE_CLASS_MESSAGE: string;
    };
    SELECT: {
        PLACEHOLDER: string;
        OPTION_1: string;
        OPTION_2: string;
        OPTION_3: string;
        LABEL: string;
        REQUIRED_ERROR: string;
    };
    TEXTAREA: {
        PLACEHOLDER: string;
        REQUIRED_ERROR: string;
        LABEL: string;
        TEST_VALUE: string;
    };
    CHECKBOX: {
        LABEL: string;
        REQUIRED_ERROR: string;
        CHECKED_LABEL: string;
    };
    COMMON: {
        TEST_MESSAGE: string;
        LOADING: string;
        ERROR_GENERIC: string;
    };
};
export declare const LUNAR_GRID_ACTIONS: {
    NO_TRANSACTIONS: string;
    ENTER_KEY: string;
    ESCAPE_KEY: string;
    DELETE_TRANSACTION_SINGLE: string;
    DELETE_TRANSACTION_MULTIPLE: string;
    DELETE_SUCCESS_SINGLE: string;
    DELETE_SUCCESS_MULTIPLE: string;
    DELETE_ERROR: string;
    NO_TRANSACTIONS_TO_DELETE: string;
};
export declare const ACCOUNT_MANAGEMENT: {
    MAX_ACCOUNTS: number;
    LABELS: {
        ACCOUNT_NAME: string;
        ACCOUNT_TYPE: string;
        INITIAL_BALANCE: string;
        CURRENT_BALANCE: string;
        ACCOUNT_DESCRIPTION: string;
        DEFAULT_ACCOUNT: string;
        ACTIVE_STATUS: string;
    };
    VALIDATION: {
        NAME_REQUIRED: string;
        NAME_TOO_LONG: string;
        TYPE_REQUIRED: string;
        INITIAL_BALANCE_REQUIRED: string;
        INITIAL_BALANCE_INVALID: string;
        MAX_ACCOUNTS_REACHED: string;
        DUPLICATE_NAME: string;
        CANNOT_DELETE_LAST: string;
        CANNOT_DELETE_WITH_TRANSACTIONS: string;
    };
    ACTIONS: {
        ADD_ACCOUNT: string;
        EDIT_ACCOUNT: string;
        DELETE_ACCOUNT: string;
        SET_DEFAULT: string;
        ACTIVATE_ACCOUNT: string;
        DEACTIVATE_ACCOUNT: string;
    };
    STATUS: {
        ACCOUNT_CREATED: string;
        ACCOUNT_UPDATED: string;
        ACCOUNT_DELETED: string;
        ACCOUNT_SET_DEFAULT: string;
    };
};
export declare const BALANCE_DISPLAY: {
    CURRENCY: string;
    DECIMAL_PLACES: number;
    THOUSAND_SEPARATOR: string;
    DECIMAL_SEPARATOR: string;
    LABELS: {
        AVAILABLE_BALANCE: string;
        SAVINGS_BALANCE: string;
        TOTAL_BALANCE: string;
        PROJECTED_BALANCE: string;
        DAILY_BALANCE: string;
        BALANCE_CHANGE: string;
        BALANCE_TREND: string;
    };
    COLORS: {
        INCOME: string;
        EXPENSE: string;
        SAVING: string;
        POSITIVE: string;
        NEGATIVE: string;
        NEUTRAL: string;
    };
    GRID_STYLES: {
        BALANCE_ROW: string;
        BALANCE_CELL: string;
        BALANCE_TOTAL: string;
        BALANCE_PROJECTION: string;
    };
    STATUS: {
        CALCULATED: string;
        MANUAL_OVERRIDE: string;
        PROJECTED: string;
        CONFIRMED: string;
    };
};
export declare const BALANCE_MODALS: {
    ACCOUNT: {
        CREATE_TITLE: string;
        EDIT_TITLE: string;
        DELETE_TITLE: string;
        TRANSFER_TITLE: string;
    };
    BALANCE: {
        ADJUST_TITLE: string;
        RECONCILE_TITLE: string;
        PROJECTION_TITLE: string;
        HISTORY_TITLE: string;
    };
    CONFIRMATIONS: {
        DELETE_ACCOUNT: string;
        ADJUST_BALANCE: string;
        TRANSFER_FUNDS: string;
        RECONCILE: string;
    };
};
export declare const BALANCE_LABELS: {
    SOLD: string;
    TOTAL_BALANCE: string;
    DAILY_BALANCES: string;
    BALANCE: string;
    AVAILABLE: string;
    SAVINGS: string;
    INVESTMENTS: string;
};
export declare const EXPORT_UI: {
    YEAR_LABEL: string;
    MONTH_LABEL: string;
    CATEGORY_FILTER_LABEL: string;
    FILENAME_LABEL: string;
    FILENAME_PLACEHOLDER: string;
};
export declare const TOOLTIP: {
    DEFAULT_DELAY: number;
    PLACEMENTS: {
        TOP: string;
        BOTTOM: string;
        LEFT: string;
        RIGHT: string;
    };
    VARIANTS: {
        DEFAULT: string;
        INFO: string;
        WARNING: string;
        ERROR: string;
        SUCCESS: string;
    };
};
export declare const PROGRESS: {
    LABELS: {
        BUDGET_PROGRESS: string;
        EXPORT_PROGRESS: string;
        LOADING_PROGRESS: string;
        FINANCIAL_GOAL: string;
    };
    VARIANTS: {
        DEFAULT: string;
        SUCCESS: string;
        WARNING: string;
        ERROR: string;
        FINANCIAL: string;
    };
    SIZES: {
        SMALL: string;
        MEDIUM: string;
        LARGE: string;
        EXTRA_LARGE: string;
    };
    POSITIONS: {
        TOP: string;
        BOTTOM: string;
        INLINE: string;
    };
};
export declare const BADGE: {
    VARIANTS: {
        NEUTRAL: string;
        PRIMARY: string;
        SUCCESS: string;
        WARNING: string;
        ERROR: string;
        INFO: string;
    };
    FINANCIAL_STATES: {
        OVER_BUDGET: string;
        UNDER_BUDGET: string;
        ON_TARGET: string;
        INCOME: string;
        EXPENSE: string;
    };
};
export declare const NAVIGATION: {
    ITEMS: {
        DASHBOARD: string;
        TRANSACTIONS: string;
        LUNAR_GRID: string;
        ACCOUNTS: string;
        REPORTS: string;
        OPTIONS: string;
        SETTINGS: string;
    };
    SIDEBAR: {
        TOGGLE: string;
        EXPAND: string;
        COLLAPSE: string;
        PERSISTENT: string;
        AUTO_HIDE: string;
    };
    BREADCRUMBS: {
        HOME: string;
        SEPARATOR: string;
        BACK_TO: string;
        CURRENT_PAGE: string;
    };
    CONTEXT_MENU: {
        OPEN: string;
        CLOSE: string;
        NEW_TAB: string;
        BOOKMARK: string;
        SHARE: string;
    };
    TABS: {
        NEW_TAB: string;
        CLOSE_TAB: string;
        CLOSE_ALL: string;
        CLOSE_OTHERS: string;
        NEXT_TAB: string;
        PREV_TAB: string;
    };
    SHORTCUTS: {
        TOGGLE_SIDEBAR: string;
        NEW_TAB: string;
        CLOSE_TAB: string;
        NEXT_TAB: string;
        PREV_TAB: string;
        CONTEXT_MENU: string;
        HOME: string;
        BACK: string;
        FORWARD: string;
        COMMAND_PALETTE: string;
        TOGGLE_DARK_MODE: string;
    };
    COMMAND_PALETTE: {
        TITLE: string;
        PLACEHOLDER: string;
        NO_RESULTS: string;
        HELP_TEXT: string;
        CATEGORIES: {
            NAVIGATION: string;
            ACTIONS: string;
            SHORTCUTS: string;
            RECENT: string;
        };
        RESULTS: {
            GO_TO: string;
            EXECUTE: string;
            OPEN: string;
            TOGGLE: string;
        };
    };
    THEME: {
        TOGGLE_DARK_MODE: string;
        DARK_MODE: string;
        LIGHT_MODE: string;
        SYSTEM_PREFERENCE: string;
        TOGGLE_DESCRIPTION: string;
    };
    MOBILE: {
        HAMBURGER: string;
        CLOSE_MENU: string;
        MENU_OVERLAY: string;
    };
    ARIA: {
        NAVIGATION: string;
        BREADCRUMB: string;
        TAB_LIST: string;
        TAB_PANEL: string;
        CURRENT_PAGE: string;
        EXTERNAL_LINK: string;
        CONTEXT_MENU: string;
    };
    STORAGE: {
        SIDEBAR_EXPANDED: string;
        TABS_STATE: string;
        BREADCRUMB_HISTORY: string;
        NAVIGATION_STATE: string;
        LAST_VISITED_PAGE: string;
        USER_PREFERENCES: string;
    };
    STATE: {
        PERSISTENCE_ENABLED: string;
        PERSISTENCE_DISABLED: string;
        STATE_RESTORED: string;
        STATE_CLEARED: string;
        SYNC_COMPLETE: string;
        SYNC_FAILED: string;
    };
};
export declare const BREADCRUMB_HOME = "Acas\u0103";
export declare const BREADCRUMB_SEPARATOR = "/";
export declare const LUNAR_GRID_PREFERENCES_TITLE = "\uD83D\uDDD3\uFE0F Preferin\u021Be LunarGrid";
export declare const LUNAR_GRID_DELETE_CONFIRM_TITLE = "\u2328\uFE0F Confirmare \u0219tergere cu Delete key";
export declare const LUNAR_GRID_DELETE_CONFIRM_DESCRIPTION = "Controleaz\u0103 dac\u0103 aplica\u021Bia va cere confirmare c\u00E2nd \u0219tergi tranzac\u021Bii folosind tasta Delete \u00EEn grid.";
export declare const LUNAR_GRID_DELETE_CONFIRM_LABEL = "Afi\u0219eaz\u0103 confirmare pentru \u0219tergere cu Delete key";
export declare const LUNAR_GRID_DELETE_CONFIRM_RECOMMENDATION = "\uD83D\uDCA1 Recomandat activat pentru a preveni \u0219tergerea accidental\u0103 a tranzac\u021Biilor importante. C\u00E2nd e dezactivat, Delete key va \u0219terge imediat f\u0103r\u0103 confirmare (stil Excel cu Undo).";
export declare const LUNAR_GRID_DELETE_CONFIRM_ENABLED_SUCCESS = "Confirmarea pentru \u0219tergere a fost activat\u0103";
export declare const LUNAR_GRID_DELETE_CONFIRM_DISABLED_SUCCESS = "Confirmarea pentru \u0219tergere a fost dezactivat\u0103";
//# sourceMappingURL=ui.d.ts.map
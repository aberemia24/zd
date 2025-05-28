import { TransactionType, CategoryType, FrequencyType } from './enums';
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
        CLOSE: string;
    };
    TABLE_CONTROLS: {
        EXPAND_ALL: string;
        COLLAPSE_ALL: string;
        VIRTUAL_TABLE: string;
        LEGACY_TABLE: string;
        VERSION: string;
    };
    INLINE_EDITING: {
        EDIT_HINT: string;
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
    TOTAL_BALANCE: string;
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

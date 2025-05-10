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
};
export declare const TITLES: {
    TRANZACTII: string;
    GRID_LUNAR: string;
    OPTIUNI: string;
};
export declare const PLACEHOLDERS: {
    SELECT: string;
    AMOUNT: string;
    DATE: string;
};
export declare const BUTTONS: {
    ADD: string;
    CANCEL: string;
    DONE: string;
    EDIT: string;
    DELETE: string;
    NEXT_PAGE: string;
    PREV_PAGE: string;
    ADD_SUBCATEGORY: string;
    MANAGE_CATEGORIES: string;
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
    };
    EMPTY: string;
    LOADING: string;
    PAGE_INFO: string;
    BOOL: {
        YES: string;
        NO: string;
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
    };
    NO_DATA: string;
    LOADING: string;
    PROMPTS: {
        ENTER_AMOUNT: string;
    };
    ACTIONS: {
        ADD_SUBCATEGORY: string;
        EDIT_SUBCATEGORY: string;
        DELETE_SUBCATEGORY: string;
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
    COMING_SOON: string;
    LOGIN_REQUIRED: string;
    ADD_SUBCATEGORY: string;
    DELETE_SUBCATEGORY: string;
    EDIT_SUBCATEGORY: string;
};

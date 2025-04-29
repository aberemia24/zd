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
};
export declare const PLACEHOLDERS: {
    SELECT: string;
    AMOUNT: string;
    DATE: string;
};
export declare const BUTTONS: {
    ADD: string;
    EDIT: string;
    DELETE: string;
    NEXT_PAGE: string;
    PREV_PAGE: string;
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

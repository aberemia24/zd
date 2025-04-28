"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OPTIONS = exports.EXCEL_GRID = exports.LOADER = exports.TABLE = exports.BUTTONS = exports.PLACEHOLDERS = exports.TITLES = exports.LABELS = void 0;
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
};
exports.TITLES = {
    TRANZACTII: 'Tranzacții',
};
exports.PLACEHOLDERS = {
    SELECT: 'Alege',
    AMOUNT: 'Introdu suma',
    DATE: 'Selectează data',
};
exports.BUTTONS = {
    ADD: 'Adaugă',
    EDIT: 'Editează',
    DELETE: 'Șterge',
    NEXT_PAGE: 'Înainte',
    PREV_PAGE: 'Înapoi',
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
    },
    EMPTY: 'Nicio tranzacție',
    LOADING: 'Se încarcă...',
    PAGE_INFO: 'Pagina {current} din {total}',
    BOOL: {
        YES: 'Da',
        NO: 'Nu',
    },
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
    },
    NO_DATA: 'Nu există date disponibile',
    LOADING: 'Se încarcă datele...'
};
const enums_1 = require("./enums");
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
//# sourceMappingURL=ui.js.map
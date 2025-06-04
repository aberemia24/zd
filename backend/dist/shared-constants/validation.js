"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VALIDATION_HELPERS = exports.VALIDATION_TYPES = exports.VALIDATION_MESSAGES = exports.VALIDATION = void 0;
exports.VALIDATION = {
    AMOUNT_MIN: 0.01,
    AMOUNT_MAX: 9999999,
    DATE_REGEX: /^\d{4}-\d{2}-\d{2}$/,
    DESCRIPTION_MAX_LENGTH: 100,
    CATEGORY_NAME_MIN_LENGTH: 2,
    CATEGORY_NAME_MAX_LENGTH: 50,
    MAX_CUSTOM_SUBCATEGORIES: 5,
    TEXT_MIN_LENGTH: 1,
    TEXT_MAX_LENGTH: 255,
    PERCENTAGE_MIN: 0,
    PERCENTAGE_MAX: 100,
    NUMERIC_PATTERN: /^\d+(\.\d{1,2})?$/,
    POSITIVE_NUMBER_PATTERN: /^(?!0*(\.0*)?$)\d+(\.\d{1,2})?$/,
    DESCRIPTION_PATTERN: /^[a-zA-Z0-9\sÀ-ÿĂăÂâÎîȘșȚțĂăÂâÎîȘșȚț.,!?\-()&%+:;\n]*$/,
    FORBIDDEN_DESCRIPTION_CHARS: ['<', '>', '{', '}', '[', ']', '`', '|', '\\', '"', "'"],
};
exports.VALIDATION_MESSAGES = {
    INVALID_AMOUNT: 'Suma introdusă nu este validă!',
    AMOUNT_REQUIRED: 'Suma este obligatorie',
    AMOUNT_MUST_BE_NUMBER: 'Suma trebuie să fie un număr valid',
    AMOUNT_MUST_BE_POSITIVE: 'Suma trebuie să fie pozitivă',
    AMOUNT_TOO_SMALL: `Suma trebuie să fie cel puțin ${exports.VALIDATION.AMOUNT_MIN} RON`,
    AMOUNT_TOO_LARGE: `Suma nu poate depăși ${exports.VALIDATION.AMOUNT_MAX.toLocaleString('ro-RO')} RON`,
    INVALID_DATE: 'Formatul datei nu este valid! (YYYY-MM-DD)',
    DATE_REQUIRED: 'Data este obligatorie',
    DESCRIPTION_TOO_LONG: `Descrierea nu poate depăși ${exports.VALIDATION.DESCRIPTION_MAX_LENGTH} de caractere`,
    DESCRIPTION_INVALID_CHARS: 'Descrierea conține caractere interzise (< > { } [ ] ` | \\ " \')',
    DESCRIPTION_VALIDATION_HINT: 'Folosiți doar litere, cifre, spații și punctuația de bază (. , ! ? - ( ) & % + : ;)',
    TEXT_TOO_LONG: `Textul nu poate depăși ${exports.VALIDATION.TEXT_MAX_LENGTH} de caractere`,
    TEXT_TOO_SHORT: `Textul trebuie să aibă minim ${exports.VALIDATION.TEXT_MIN_LENGTH} caractere`,
    CATEGORY_NAME_REQUIRED: 'Numele categoriei este obligatoriu',
    CATEGORY_NAME_TOO_SHORT: `Numele categoriei trebuie să aibă minim ${exports.VALIDATION.CATEGORY_NAME_MIN_LENGTH} caractere`,
    CATEGORY_NAME_TOO_LONG: `Numele categoriei nu poate depăși ${exports.VALIDATION.CATEGORY_NAME_MAX_LENGTH} de caractere`,
    SUBCATEGORY_LIMIT_EXCEEDED: `Nu poți avea mai mult de ${exports.VALIDATION.MAX_CUSTOM_SUBCATEGORIES} subcategorii custom per categorie`,
    SUBCATEGORY_ALREADY_EXISTS: 'Subcategoria există deja în această categorie',
    INVALID_PERCENTAGE: 'Procentul trebuie să fie un număr valid',
    PERCENTAGE_OUT_OF_RANGE: `Procentul trebuie să fie între ${exports.VALIDATION.PERCENTAGE_MIN} și ${exports.VALIDATION.PERCENTAGE_MAX}`,
    REQUIRED_FREQUENCY: 'Selectează frecvența pentru tranzacțiile recurente!',
    REQUIRED_FIELDS: 'Toate câmpurile obligatorii trebuie completate!',
    EMPTY_VALUE: 'Valoarea nu poate fi goală',
    NEGATIVE_VALUE: 'Valoarea nu poate fi negativă',
    INVALID_NUMBER: 'Valoarea trebuie să fie un număr valid',
};
exports.VALIDATION_TYPES = {
    AMOUNT: 'amount',
    TEXT: 'text',
    PERCENTAGE: 'percentage',
    DATE: 'date',
    DESCRIPTION: 'description',
    CATEGORY_NAME: 'category_name',
};
exports.VALIDATION_HELPERS = {
    isValidNumber: (value) => {
        const num = typeof value === 'string' ? parseFloat(value) : value;
        return !isNaN(num) && isFinite(num);
    },
    isValidAmount: (amount) => {
        const num = typeof amount === 'string' ? parseFloat(amount) : amount;
        return exports.VALIDATION_HELPERS.isValidNumber(num) &&
            num >= exports.VALIDATION.AMOUNT_MIN &&
            num <= exports.VALIDATION.AMOUNT_MAX;
    },
    isValidPercentage: (percentage) => {
        const num = typeof percentage === 'string' ? parseFloat(percentage) : percentage;
        return exports.VALIDATION_HELPERS.isValidNumber(num) &&
            num >= exports.VALIDATION.PERCENTAGE_MIN &&
            num <= exports.VALIDATION.PERCENTAGE_MAX;
    },
    isValidDate: (date) => {
        if (!exports.VALIDATION.DATE_REGEX.test(date))
            return false;
        const dateObj = new Date(date);
        return !isNaN(dateObj.getTime());
    },
    formatAmount: (amount) => {
        return new Intl.NumberFormat('ro-RO', {
            style: 'decimal',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }).format(amount);
    },
};
//# sourceMappingURL=validation.js.map
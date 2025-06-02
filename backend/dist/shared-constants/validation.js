"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VALIDATION_MESSAGES = exports.VALIDATION = void 0;
exports.VALIDATION = {
    AMOUNT_MIN: 0.01,
    AMOUNT_MAX: 9999999,
    DATE_REGEX: /^\d{4}-\d{2}-\d{2}$/,
};
exports.VALIDATION_MESSAGES = {
    INVALID_AMOUNT: 'Suma introdusă nu este validă!',
    INVALID_DATE: 'Formatul datei nu este valid! (YYYY-MM-DD)',
    REQUIRED_FIELDS: 'Toate câmpurile obligatorii trebuie completate!',
    REQUIRED_FREQUENCY: 'Selectează frecvența pentru tranzacțiile recurente!'
};
//# sourceMappingURL=validation.js.map
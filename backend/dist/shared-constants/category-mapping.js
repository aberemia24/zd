"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CATEGORY_TO_TRANSACTION_TYPE = exports.TRANSACTION_TYPE_TO_CATEGORIES = void 0;
exports.getCategoriesForTransactionType = getCategoriesForTransactionType;
exports.getTransactionTypeForCategory = getTransactionTypeForCategory;
const enums_1 = require("./enums");
exports.TRANSACTION_TYPE_TO_CATEGORIES = {
    [enums_1.TransactionType.INCOME]: ['VENITURI'],
    [enums_1.TransactionType.SAVING]: ['ECONOMII', 'INVESTITII'],
    [enums_1.TransactionType.EXPENSE]: [
        'INFATISARE',
        'EDUCATIE',
        'CARIERA',
        'SANATATE',
        'NUTRITIE',
        'LOCUINTA',
        'TIMP_LIBER',
        'CALATORII',
        'TRANSPORT',
    ],
};
exports.CATEGORY_TO_TRANSACTION_TYPE = {
    VENITURI: enums_1.TransactionType.INCOME,
    ECONOMII: enums_1.TransactionType.SAVING,
    INVESTITII: enums_1.TransactionType.SAVING,
    INFATISARE: enums_1.TransactionType.EXPENSE,
    EDUCATIE: enums_1.TransactionType.EXPENSE,
    CARIERA: enums_1.TransactionType.EXPENSE,
    SANATATE: enums_1.TransactionType.EXPENSE,
    NUTRITIE: enums_1.TransactionType.EXPENSE,
    LOCUINTA: enums_1.TransactionType.EXPENSE,
    TIMP_LIBER: enums_1.TransactionType.EXPENSE,
    CALATORII: enums_1.TransactionType.EXPENSE,
    TRANSPORT: enums_1.TransactionType.EXPENSE,
};
function getCategoriesForTransactionType(type) {
    return exports.TRANSACTION_TYPE_TO_CATEGORIES[type] || [];
}
function getTransactionTypeForCategory(category) {
    return exports.CATEGORY_TO_TRANSACTION_TYPE[category];
}
//# sourceMappingURL=category-mapping.js.map
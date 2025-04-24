"use strict";
// Enums comune pentru frontend și backend. Aceasta este sursa unică de adevăr!
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoryType = exports.FrequencyType = exports.TransactionType = void 0;
var TransactionType;
(function (TransactionType) {
    TransactionType["INCOME"] = "income";
    TransactionType["EXPENSE"] = "expense";
    TransactionType["SAVING"] = "saving";
})(TransactionType || (exports.TransactionType = TransactionType = {}));
var FrequencyType;
(function (FrequencyType) {
    FrequencyType["DAILY"] = "zilnic";
    FrequencyType["WEEKLY"] = "s\u0103pt\u0103m\u00E2nal";
    FrequencyType["MONTHLY"] = "lunar";
    FrequencyType["YEARLY"] = "anual";
})(FrequencyType || (exports.FrequencyType = FrequencyType = {}));
var CategoryType;
(function (CategoryType) {
    CategoryType["INCOME"] = "VENITURI";
    CategoryType["EXPENSE"] = "CHELTUIELI";
    CategoryType["SAVING"] = "ECONOMII";
})(CategoryType || (exports.CategoryType = CategoryType = {}));

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoryType = exports.FrequencyType = exports.TransactionStatus = exports.TransactionType = void 0;
var TransactionType;
(function (TransactionType) {
    TransactionType["INCOME"] = "INCOME";
    TransactionType["EXPENSE"] = "EXPENSE";
    TransactionType["SAVING"] = "SAVING";
})(TransactionType || (exports.TransactionType = TransactionType = {}));
var TransactionStatus;
(function (TransactionStatus) {
    TransactionStatus["PLANNED"] = "PLANNED";
    TransactionStatus["COMPLETED"] = "COMPLETED";
})(TransactionStatus || (exports.TransactionStatus = TransactionStatus = {}));
var FrequencyType;
(function (FrequencyType) {
    FrequencyType["NONE"] = "NONE";
    FrequencyType["DAILY"] = "DAILY";
    FrequencyType["WEEKLY"] = "WEEKLY";
    FrequencyType["MONTHLY"] = "MONTHLY";
    FrequencyType["YEARLY"] = "YEARLY";
})(FrequencyType || (exports.FrequencyType = FrequencyType = {}));
var CategoryType;
(function (CategoryType) {
    CategoryType["INCOME"] = "INCOME";
    CategoryType["EXPENSE"] = "EXPENSE";
    CategoryType["SAVING"] = "SAVING";
})(CategoryType || (exports.CategoryType = CategoryType = {}));
//# sourceMappingURL=enums.js.map
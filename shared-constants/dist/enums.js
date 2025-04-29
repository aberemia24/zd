"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoryType = exports.FrequencyType = exports.TransactionType = void 0;
// Exportă aici toate enums partajate
var TransactionType;
(function (TransactionType) {
    TransactionType["INCOME"] = "INCOME";
    TransactionType["EXPENSE"] = "EXPENSE";
    TransactionType["SAVING"] = "SAVING";
})(TransactionType = exports.TransactionType || (exports.TransactionType = {}));
var FrequencyType;
(function (FrequencyType) {
    FrequencyType["NONE"] = "NONE";
    FrequencyType["DAILY"] = "DAILY";
    FrequencyType["WEEKLY"] = "WEEKLY";
    FrequencyType["MONTHLY"] = "MONTHLY";
    FrequencyType["YEARLY"] = "YEARLY";
})(FrequencyType = exports.FrequencyType || (exports.FrequencyType = {}));
var CategoryType;
(function (CategoryType) {
    CategoryType["INCOME"] = "INCOME";
    CategoryType["EXPENSE"] = "EXPENSE";
    CategoryType["SAVING"] = "SAVING";
})(CategoryType = exports.CategoryType || (exports.CategoryType = {}));

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BalanceImpactType = exports.AccountType = exports.CategoryType = exports.FrequencyType = exports.TransactionStatus = exports.TransactionType = void 0;
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
var AccountType;
(function (AccountType) {
    AccountType["CHECKING"] = "CHECKING";
    AccountType["SAVINGS"] = "SAVINGS";
    AccountType["INVESTMENT"] = "INVESTMENT";
    AccountType["CASH"] = "CASH";
    AccountType["CREDIT"] = "CREDIT";
})(AccountType || (exports.AccountType = AccountType = {}));
var BalanceImpactType;
(function (BalanceImpactType) {
    BalanceImpactType["AVAILABLE_ONLY"] = "AVAILABLE_ONLY";
    BalanceImpactType["SAVINGS_TRANSFER"] = "SAVINGS_TRANSFER";
    BalanceImpactType["INVESTMENT_TRANSFER"] = "INVESTMENT_TRANSFER";
    BalanceImpactType["NEUTRAL"] = "NEUTRAL";
})(BalanceImpactType || (exports.BalanceImpactType = BalanceImpactType = {}));
//# sourceMappingURL=enums.js.map
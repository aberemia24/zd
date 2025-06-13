// Exportă aici toate enums partajate
export var TransactionType;
(function (TransactionType) {
    TransactionType["INCOME"] = "INCOME";
    TransactionType["EXPENSE"] = "EXPENSE";
    TransactionType["SAVING"] = "SAVING";
})(TransactionType || (TransactionType = {}));
export var TransactionStatus;
(function (TransactionStatus) {
    TransactionStatus["PLANNED"] = "PLANNED";
    TransactionStatus["COMPLETED"] = "COMPLETED";
})(TransactionStatus || (TransactionStatus = {}));
export var FrequencyType;
(function (FrequencyType) {
    FrequencyType["NONE"] = "NONE";
    FrequencyType["DAILY"] = "DAILY";
    FrequencyType["WEEKLY"] = "WEEKLY";
    FrequencyType["MONTHLY"] = "MONTHLY";
    FrequencyType["YEARLY"] = "YEARLY";
})(FrequencyType || (FrequencyType = {}));
export var CategoryType;
(function (CategoryType) {
    CategoryType["INCOME"] = "INCOME";
    CategoryType["EXPENSE"] = "EXPENSE";
    CategoryType["SAVING"] = "SAVING";
})(CategoryType || (CategoryType = {}));
// 🆕 Balance System Enums - pentru sistem conturi multiple și sold zilnic
export var AccountType;
(function (AccountType) {
    AccountType["CHECKING"] = "CHECKING";
    AccountType["SAVINGS"] = "SAVINGS";
    AccountType["INVESTMENT"] = "INVESTMENT";
    AccountType["CASH"] = "CASH";
    AccountType["CREDIT"] = "CREDIT";
})(AccountType || (AccountType = {}));
export var BalanceImpactType;
(function (BalanceImpactType) {
    BalanceImpactType["AVAILABLE_ONLY"] = "AVAILABLE_ONLY";
    BalanceImpactType["SAVINGS_TRANSFER"] = "SAVINGS_TRANSFER";
    BalanceImpactType["INVESTMENT_TRANSFER"] = "INVESTMENT_TRANSFER";
    BalanceImpactType["NEUTRAL"] = "NEUTRAL";
})(BalanceImpactType || (BalanceImpactType = {}));

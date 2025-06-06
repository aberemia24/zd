export declare enum TransactionType {
    INCOME = "INCOME",
    EXPENSE = "EXPENSE",
    SAVING = "SAVING"
}
export declare enum TransactionStatus {
    PLANNED = "PLANNED",
    COMPLETED = "COMPLETED"
}
export declare enum FrequencyType {
    NONE = "NONE",
    DAILY = "DAILY",
    WEEKLY = "WEEKLY",
    MONTHLY = "MONTHLY",
    YEARLY = "YEARLY"
}
export declare enum CategoryType {
    INCOME = "INCOME",
    EXPENSE = "EXPENSE",
    SAVING = "SAVING"
}
export declare enum AccountType {
    CHECKING = "CHECKING",// Cont curent/principal 
    SAVINGS = "SAVINGS",// Cont de economii
    INVESTMENT = "INVESTMENT",// Cont investiții
    CASH = "CASH",// Numerar
    CREDIT = "CREDIT"
}
export declare enum BalanceImpactType {
    AVAILABLE_ONLY = "AVAILABLE_ONLY",// Afectează doar soldul disponibil (cheltuieli, venituri)
    SAVINGS_TRANSFER = "SAVINGS_TRANSFER",// Transfer către economii (reduce disponibil, crește economii)
    INVESTMENT_TRANSFER = "INVESTMENT_TRANSFER",// Transfer către investiții
    NEUTRAL = "NEUTRAL"
}
//# sourceMappingURL=enums.d.ts.map
export declare const TransactionType: {
    readonly INCOME: "income";
    readonly EXPENSE: "expense";
    readonly SAVING: "saving";
};
export type TransactionType = typeof TransactionType[keyof typeof TransactionType];
export declare const FrequencyType: {
    readonly DAILY: "zilnic";
    readonly WEEKLY: "săptămânal";
    readonly MONTHLY: "lunar";
    readonly YEARLY: "anual";
};
export type FrequencyType = typeof FrequencyType[keyof typeof FrequencyType];
export declare const CategoryType: {
    readonly INCOME: "VENITURI";
    readonly EXPENSE: "CHELTUIELI";
    readonly SAVING: "ECONOMII";
};
export type CategoryType = typeof CategoryType[keyof typeof CategoryType];

import { TransactionType } from './enums';
export declare const TRANSACTION_TYPE_TO_CATEGORIES: Record<TransactionType, string[]>;
export declare const CATEGORY_TO_TRANSACTION_TYPE: Record<string, TransactionType>;
export declare function getCategoriesForTransactionType(type: TransactionType): string[];
export declare function getTransactionTypeForCategory(category: string): TransactionType | undefined;

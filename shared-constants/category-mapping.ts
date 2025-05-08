// Utilitare de mapping TransactionType <-> categorie principală
// OWNER: echipa API & FE
// Orice modificare se documentează în DEV_LOG.md și barrel-ul index.ts trebuie actualizat!
import { TransactionType } from './enums';
import { CATEGORIES } from './categories';

// Mapping explicit TransactionType -> categorie principală
export const TRANSACTION_TYPE_TO_CATEGORIES: Record<TransactionType, string[]> = {
  [TransactionType.INCOME]: ['VENITURI'],
  [TransactionType.SAVING]: ['ECONOMII', 'INVESTITII'],
  [TransactionType.EXPENSE]: [
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

// Mapping invers: categorie principală -> TransactionType
export const CATEGORY_TO_TRANSACTION_TYPE: Record<string, TransactionType> = {
  VENITURI: TransactionType.INCOME,
  ECONOMII: TransactionType.SAVING,
  INVESTITII: TransactionType.SAVING,
  INFATISARE: TransactionType.EXPENSE,
  EDUCATIE: TransactionType.EXPENSE,
  CARIERA: TransactionType.EXPENSE,
  SANATATE: TransactionType.EXPENSE,
  NUTRITIE: TransactionType.EXPENSE,
  LOCUINTA: TransactionType.EXPENSE,
  TIMP_LIBER: TransactionType.EXPENSE,
  CALATORII: TransactionType.EXPENSE,
  TRANSPORT: TransactionType.EXPENSE,
};

// Utilitar: returnează lista de categorii principale pentru un TransactionType
export function getCategoriesForTransactionType(type: TransactionType): string[] {
  return TRANSACTION_TYPE_TO_CATEGORIES[type] || [];
}


// Utilitar: returnează TransactionType pentru o categorie principală
export function getTransactionTypeForCategory(category: string): TransactionType | undefined {
  return CATEGORY_TO_TRANSACTION_TYPE[category];
}

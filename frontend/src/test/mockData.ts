// Date de test centralizate pentru toate testele
import { Transaction } from '../types/Transaction';
import { FORM_DEFAULTS } from '../constants/defaults';
import { TransactionType, FrequencyType } from '../constants/enums';

export const MOCK_USER_ID = 'u1';

export const MOCK_TRANSACTION: Transaction = {
  _id: 't1',
  userId: MOCK_USER_ID,
  type: TransactionType.INCOME,
  amount: '100',
  currency: FORM_DEFAULTS.CURRENCY,
  date: '2025-04-22',
  category: 'VENITURI',
  subcategory: '',
  recurring: false,
  frequency: ''
};

export const MOCK_RECURRING_TRANSACTION: Transaction = {
  _id: 't2',
  userId: MOCK_USER_ID,
  type: TransactionType.EXPENSE,
  amount: '200',
  currency: FORM_DEFAULTS.CURRENCY,
  date: '2025-04-23',
  category: 'abonament',
  subcategory: 'Taxe școlare | universitare',
  recurring: true,
  frequency: FrequencyType.MONTHLY
};

// Pattern: listă mock cu tranzacții diverse pentru testare bulk/filter
export const MOCK_TRANSACTIONS_LIST: Transaction[] = [
  MOCK_TRANSACTION,
  MOCK_RECURRING_TRANSACTION,
  {
    _id: 't3',
    userId: MOCK_USER_ID,
    type: TransactionType.EXPENSE,
    amount: '50',
    currency: FORM_DEFAULTS.CURRENCY,
    date: '2025-04-24',
    category: 'UTILITĂȚI',
    subcategory: 'Electricitate',
    recurring: false,
    frequency: ''
  },
  {
    _id: 't4',
    userId: MOCK_USER_ID,
    type: TransactionType.INCOME,
    amount: '500',
    currency: FORM_DEFAULTS.CURRENCY,
    date: '2025-04-25',
    category: 'VENITURI',
    subcategory: 'Salarii',
    recurring: true,
    frequency: FrequencyType.YEARLY
  }
];

// Pattern: importă structura de opțiuni pentru dropdown-uri controlate (sursă de adevăr)
import { OPTIONS, LABELS, BUTTONS, TABLE, PLACEHOLDERS } from '../constants/ui';
export { OPTIONS as MOCK_OPTIONS, LABELS as MOCK_LABELS, BUTTONS as MOCK_BUTTONS, TABLE as MOCK_TABLE, PLACEHOLDERS as MOCK_PLACEHOLDERS };

// Pattern: user minimal pentru testare (dacă există tipul User)
// import { User } from '../types/User';
// export const MOCK_USER: User = { id: MOCK_USER_ID, name: 'Test User', email: 'test@example.com' };

// Centralizare mesaje de eroare utilizate în mai multe teste
export const MOCK_ERROR_MESSAGES = {
  REQUIRED: 'Acest câmp este obligatoriu',
  INVALID_AMOUNT: 'Sumă invalidă',
  SUBCATEGORY_REQUIRED: 'Selectează o subcategorie',
  API_ERROR: 'A apărut o eroare la salvare',
  TEST_ERROR: 'Test error',
  TEST_SUCCESS: 'Test success',
};

// Centralizare statusuri utilizate în teste
export const MOCK_STATUS = {
  SUCCESS: 'success',
  ERROR: 'error',
  LOADING: 'loading',
};


export const LABELS = {
  TYPE: 'Tip',
  AMOUNT: 'Sumă',
  CATEGORY: 'Categorie',
  SUBCATEGORY: 'Subcategorie',
  DATE: 'Dată',
  RECURRING: 'Recurent',
  FREQUENCY: 'Frecvență',
  TYPE_FILTER: 'Tip tranzacție:',
  CATEGORY_FILTER: 'Categoria:',
  FORM: 'adăugare tranzacție', // pentru aria-label pe <form>
};

export const TITLES = {
  TRANZACTII: 'Tranzacții',
};

export const PLACEHOLDERS = {
  SELECT: 'Alege',
  AMOUNT: 'Introdu suma',
  DATE: 'Selectează data',
};

export const BUTTONS = {
  ADD: 'Adaugă',
  EDIT: 'Editează',
  DELETE: 'Șterge',
  NEXT_PAGE: 'Înainte',
  PREV_PAGE: 'Înapoi',
};

export const TABLE = {
  HEADERS: {
    TYPE: 'Tip',
    AMOUNT: 'Sumă',
    CURRENCY: 'Monedă',
    CATEGORY: 'Categorie',
    SUBCATEGORY: 'Subcategorie',
    DATE: 'Dată',
    RECURRING: 'Recurent',
    FREQUENCY: 'Frecvență',
  },
  EMPTY: 'Nicio tranzacție',
  LOADING: 'Se încarcă...',
  PAGE_INFO: 'Pagina {current} din {total}',
  BOOL: {
    YES: 'Da',
    NO: 'Nu',
  },
};

// Opțiuni pentru dropdown-uri (folosite în TransactionForm)
import { TransactionType, CategoryType } from './enums';

export const OPTIONS = {
  TYPE: [
    { value: TransactionType.INCOME, label: 'Venit' },
    { value: TransactionType.EXPENSE, label: 'Cheltuială' },
    { value: TransactionType.SAVING, label: 'Economisire' },
  ],
  CATEGORY: [
    { value: CategoryType.INCOME, label: 'Venituri' },
    { value: CategoryType.EXPENSE, label: 'Cheltuieli' },
    { value: CategoryType.SAVING, label: 'Economii' },
  ],
  FREQUENCY: [
    { value: 'zilnic', label: 'Zilnic' },
    { value: 'săptămânal', label: 'Săptămânal' },
    { value: 'lunar', label: 'Lunar' },
    { value: 'anual', label: 'Anual' },
  ],
};

// Valori default pentru paginare, monedă, formate, etc.
export const PAGINATION = {
  DEFAULT_LIMIT: 10,
  DEFAULT_OFFSET: 0,
  DEFAULT_SORT: 'date',
};

export const FORM_DEFAULTS = {
  CURRENCY: 'RON',
  DATE_FORMAT: 'YYYY-MM-DD',
};

export const INITIAL_FORM_STATE = {
  type: '',
  amount: '',
  category: '',
  subcategory: '',
  date: '',
  recurring: false,
  frequency: '',
  // currency nu este vizibilă în formular, se adaugă în store la transformarea în TransactionFormWithNumberAmount
};


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
};

// Opțiuni pentru dropdown-uri (folosite în TransactionForm)
export const OPTIONS = {
  TYPE: [
    { value: 'income', label: 'Venit' },
    { value: 'expense', label: 'Cheltuială' },
    { value: 'saving', label: 'Economisire' },
  ],
  FREQUENCY: [
    { value: 'zilnic', label: 'Zilnic' },
    { value: 'săptămânal', label: 'Săptămânal' },
    { value: 'lunar', label: 'Lunar' },
    { value: 'anual', label: 'Anual' },
  ],
};

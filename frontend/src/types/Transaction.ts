// Tipul pentru o tranzacție financiară
// Folosit în întreaga aplicație pentru consistență și siguranță la tipare
export type Transaction = {
  _id?: string;
  id?: string;
  userId?: string;
  type: string; // ex: 'income', 'expense', 'saving'
  amount: string; // valoare numerică sub formă de string (pentru input controlat)
  currency: string; // ex: 'RON', 'EUR', 'USD'
  date: string; // format ISO sau local
  category: string;
  subcategory: string;
  recurring?: boolean;
  frequency?: string;
};

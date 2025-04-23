// Componenta principală a aplicației
import React from 'react';
import TransactionForm, { TransactionFormData } from './components/TransactionForm/TransactionForm';
import TransactionTable from './components/TransactionTable/TransactionTable';
import { Transaction } from './types/Transaction';

import { API_URL } from './constants';
import TransactionFilters from './components/TransactionFilters/TransactionFilters';
import { MESAJE } from './constants/messages';
import { buildTransactionQueryParams } from './utils/transactions';

const appContainerStyle: React.CSSProperties = {
  maxWidth: 900,
  margin: '2rem auto',
  fontFamily: 'sans-serif',
};

export 
const App: React.FC = () => {
  console.log('App loaded');
  const [transactions, setTransactions] = React.useState<Transaction[]>([]);
  // Starea formularului de tranzacție (fără câmpul 'currency')
const [form, setForm] = React.useState<TransactionFormData>({
  type: '',
  amount: '',
  category: '',
  subcategory: '',
  date: '',
  recurring: false,
  frequency: '',
});
  const [formError, setFormError] = React.useState('');
  const [formSuccess, setFormSuccess] = React.useState('');
  // State for filtering/pagination
  const [type, setType] = React.useState<string | undefined>(undefined);
  const [category, setCategory] = React.useState<string | undefined>(undefined);
  const [limit, setLimit] = React.useState<number>(10);
  const [offset, setOffset] = React.useState<number>(0);
  const [sort, setSort] = React.useState<string>('date'); // default sort
  const [total, setTotal] = React.useState<number>(0);
  const [loadingFetch, setLoadingFetch] = React.useState(false);
  const [loadingSubmit, setLoadingSubmit] = React.useState(false);
  // Trigger suplimentar pentru reîncărcare tranzacții
  const [reloadTransactions, setReloadTransactions] = React.useState(0);

  React.useEffect(() => {
    console.log("App loaded", { type, category, limit, offset, sort });
    setLoadingFetch(true);
    const queryString = buildTransactionQueryParams({ type, category, limit, offset, sort });
    fetch(`${API_URL}?${queryString}`)
      .then(res => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then(data => {
        if (data && typeof data === 'object') {
          setTransactions(Array.isArray(data.data) ? data.data : []);
          setTotal(typeof data.total === 'number' ? data.total : 0);
          setLimit(typeof data.limit === 'number' ? data.limit : 10); // Use default if invalid
          setOffset(typeof data.offset === 'number' ? data.offset : 0); // Use default if invalid
        } else {
          console.error("Received unexpected data structure:", data);
          setTransactions([]);
          setTotal(0);
        }
      })
      .catch(error => {
        console.error("Fetch error:", error);
        setTransactions([]);
        setTotal(0);
      })
      .finally(() => setLoadingFetch(false));
  }, [type, category, limit, offset, sort, reloadTransactions]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    // La orice modificare, resetăm mesajele de succes/eroare pentru UX și teste stabile
    setFormSuccess('');
    setFormError('');
    const { name, value, type: inputType } = e.target;
    const isCheckbox = e.target instanceof HTMLInputElement && inputType === 'checkbox';
    const checkedValue = isCheckbox ? (e.target as HTMLInputElement).checked : undefined;

    setForm(prev => ({
      ...prev,
      [name]: isCheckbox ? checkedValue : value,
      // Reset frequency dacă recurent devine false
      ...(name === 'recurring' && isCheckbox && !checkedValue && { frequency: '' })
    }));
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.type || !form.amount || !form.category || !form.date) {
      setFormError(MESAJE.CAMPURI_OBLIGATORII);
      setFormSuccess('');
      return;
    }
    if (form.recurring && !form.frequency) {
      setFormError(MESAJE.FRECV_RECURENTA);
      setFormSuccess('');
      return;
    }
    setFormError('');
    setLoadingSubmit(true); // Indicate loading during submit
    // La submit, adaugăm manual 'currency: "RON"' în payload
const payload = { ...form, amount: Number(form.amount), currency: 'RON' };
    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error(MESAJE.EROARE_ADAUGARE);
      setFormSuccess(MESAJE.SUCCES_ADAUGARE);
      setFormError('');
      // Resetare completă a formularului după submit reușit
      setForm({ type: '', amount: '', category: '', subcategory: '', date: '', recurring: false, frequency: '' });
      // Nu ștergem mesajul de succes imediat pentru a permite testelor să-l detecteze
      setOffset(0); // Reîncarcă tranzacțiile de la pagina 1
      setReloadTransactions(rt => rt + 1); // Forțează fetch tranzacții
    } catch (err) {
      console.error("Submit error:", err);
      setFormError(MESAJE.EROARE_ADAUGARE);
      setReloadTransactions(rt => rt + 1); // Forțează fetch tranzacții și la POST eșuat
    } finally {
      // Resetăm loading specific pentru submit, independent de useEffect
      setLoadingSubmit(false);
    }
  };


  const handlePageChange = (newOffset: number) => {
    setOffset(newOffset);
  };

  return (
    <div style={appContainerStyle}>
      <h1>Tranzacții</h1>

      {/* Render Transaction Form */}
      <TransactionForm
        form={form}
        formError={formError}
        formSuccess={formSuccess}
        onChange={handleChange}
        onSubmit={handleFormSubmit}
        loading={loadingSubmit}
      />

      {/* Filtrare tranzacții după tip și categorie */}
      <TransactionFilters
        type={type}
        category={category}
        onTypeChange={setType}
        onCategoryChange={setCategory}
        types={[
          { value: 'income', label: 'Venit' },
          { value: 'expense', label: 'Cheltuială' },
          { value: 'savings', label: 'Economisire' },
        ]}
        categories={[
          { value: 'VENITURI', label: 'VENITURI' },
          { value: 'CHELTUIELI', label: 'CHELTUIELI' },
          { value: 'ECONOMII', label: 'ECONOMII' },
        ]}
      />

      {/* Render Transaction Table */}
      <TransactionTable
        transactions={transactions}
        loading={loadingFetch}
        total={total}
        offset={offset}
        limit={limit}
        onPageChange={handlePageChange}
      />
    </div>
  );
};

export default App;

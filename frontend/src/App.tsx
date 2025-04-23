// Componenta principală a aplicației
import React from 'react';
import TransactionForm, { TransactionFormData } from './components/TransactionForm/TransactionForm';
import TransactionTable from './components/TransactionTable/TransactionTable';

const API_URL = "/transactions";

type Transaction = {
  _id?: string;
  id?: string;
  userId?: string;
  type: string;
  amount: string;
  currency: string;
  date: string;
  category: string;
  subcategory: string;
  recurring?: boolean;
  frequency?: string;
}; // currency rămâne doar pentru tipul de tranzacție, nu și pentru formular

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
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    console.log("App loaded", { type, category, limit, offset, sort });
    setLoading(true);
    const params = new URLSearchParams();
    if (type) params.append('type', type);
    if (category) params.append('category', category);
    params.append('limit', typeof limit !== 'undefined' ? limit.toString() : '10'); // Default limit
    params.append('offset', typeof offset !== 'undefined' ? offset.toString() : '0'); // Default offset
    params.append('sort', typeof sort !== 'undefined' ? sort : 'date'); // Default sort
    fetch(`${API_URL}?${params.toString()}`)
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
      .finally(() => setLoading(false));
  }, [type, category, limit, offset, sort]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type: inputType } = e.target;
    // Check if the target is an HTMLInputElement before accessing 'checked'
    const isCheckbox = e.target instanceof HTMLInputElement && inputType === 'checkbox';
    const checkedValue = isCheckbox ? (e.target as HTMLInputElement).checked : undefined;

    setForm(prev => ({
      ...prev,
      [name]: isCheckbox ? checkedValue : value,
      // Reset frequency if recurring is unchecked
      ...(name === 'recurring' && isCheckbox && !checkedValue && { frequency: '' })
    }));
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.type || !form.amount || !form.category || !form.date) {
      setFormError('Completează toate câmpurile obligatorii');
      return;
    }
    if (form.recurring && !form.frequency) {
      setFormError('Selectează frecvența pentru tranzacție recurentă');
      return;
    }
    setFormError('');
    setFormSuccess('');
    setLoading(true); // Indicate loading during submit
    // La submit, adaugăm manual 'currency: "RON"' în payload
const payload = { ...form, amount: Number(form.amount), currency: 'RON' };
    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error('Eroare la adăugare');
      setFormSuccess('Tranzacție adăugată cu succes');
      setForm({ type: '', amount: '', category: '', subcategory: '', date: '', recurring: false, frequency: '' });
      // setTimeout(() => setFormSuccess(''), 1200); // Commented out for testing
      // Trigger refresh by resetting offset and clearing filters (or just refetch)
      // Simplest way to force useEffect to re-run with current filters:
      // Create a dummy state variable and toggle it.
      // Or, more cleanly, refetch based on current params, maybe reset offset?
      setOffset(0); // Go back to first page to see the new item
      // Optionally clear filters or keep them:
      // setType(undefined);
      // setCategory(undefined);
    } catch (err) {
      console.error("Submit error:", err);
      setFormError('Eroare la adăugare');
    } finally {
      // Resetăm loading specific pentru submit, independent de useEffect
      setLoading(false);
    }
  };

  const handlePageChange = (newOffset: number) => {
    setOffset(newOffset);
  };

  return (
    <div style={{ maxWidth: 900, margin: '2rem auto', fontFamily: 'sans-serif' }}>
      <h1>Tranzacții</h1>

      {/* Render Transaction Form */}
      <TransactionForm
        form={form}
        formError={formError}
        formSuccess={formSuccess}
        onChange={handleChange}
        onSubmit={handleFormSubmit}
        // Consider passing loading state to disable submit button?
      />

      {/* TODO: Add Filtering UI (Type, Category, etc.) */}

      {/* Render Transaction Table */}
      <TransactionTable
        transactions={transactions}
        loading={loading}
        total={total}
        offset={offset}
        limit={limit}
        onPageChange={handlePageChange}
      />
    </div>
  );
};

export default App;

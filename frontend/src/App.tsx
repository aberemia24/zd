// Componenta principală a aplicației
import React from 'react';
import TransactionForm, { TransactionFormData } from './components/TransactionForm/TransactionForm';
import TransactionTable from './components/TransactionTable/TransactionTable';

const API_URL = "http://localhost:3000/transactions";

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
};

const App: React.FC = () => {
  console.log('App loaded');
  const [transactions, setTransactions] = React.useState<Transaction[]>([]);
  const [total, setTotal] = React.useState(0);
  const [limit, setLimit] = React.useState(10);
  const [offset, setOffset] = React.useState(0);
  const [type, setType] = React.useState('');
  const [category, setCategory] = React.useState('');
  const [sort, setSort] = React.useState('date');
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (type) params.append('type', type);
    if (category) params.append('category', category);
    params.append('limit', typeof limit !== 'undefined' ? limit.toString() : '');
    params.append('offset', typeof offset !== 'undefined' ? offset.toString() : '');
    params.append('sort', typeof sort !== 'undefined' ? sort : '');
    fetch(`${API_URL}?${params.toString()}`)
      .then(res => res.json())
      .then(data => {
        setTransactions(data.data);
        setTotal(data.total);
        setLimit(data.limit);
        setOffset(data.offset);
      })
      .finally(() => setLoading(false));
  }, [type, category, limit, offset, sort]);

  const totalPages = Math.ceil(total / limit);
  const currentPage = Math.floor(offset / limit) + 1;

  // State pentru formular
  const [form, setForm] = React.useState({
    type: '',
    amount: '',
    currency: '',
    category: '',
    subcategory: '',
    date: '',
    recurring: false,
    frequency: '',
  });
  const [formError, setFormError] = React.useState('');
  const [formSuccess, setFormSuccess] = React.useState('');
  // Handlers formular
  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    let fieldValue: string | boolean = value;
    if (type === 'checkbox') {
      fieldValue = (e.target as HTMLInputElement).checked;
    }
    setForm(f => ({ ...f, [name]: fieldValue }));
    setFormError('');
    setFormSuccess('');
  };
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Validare minimă
    if (!form.type || !form.amount || !form.currency || !form.category || !form.date) {
      setFormError('Completează toate câmpurile obligatorii');
      return;
    }
    if (form.recurring && !form.frequency) {
      setFormError('Selectează frecvența pentru tranzacție recurentă');
      return;
    }
    setFormError('');
    setFormSuccess('');
    // Trimite POST
    const payload = { ...form, amount: Number(form.amount) };
    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error('Eroare la adăugare');
      setFormSuccess('Tranzacție adăugată cu succes');
      setForm({ type: '', amount: '', currency: '', category: '', subcategory: '', date: '', recurring: false, frequency: '' });
      // Refresh listă
      setTimeout(() => setFormSuccess(''), 1200);
      // Trigger refresh (forțat)
      setOffset(0); setType(''); setCategory(''); setSort('date');
    } catch {
      setFormError('Eroare la adăugare');
    }
  };

  return (
    <div style={{ maxWidth: 900, margin: '2rem auto', fontFamily: 'sans-serif' }}>
      <h1>Tranzacții</h1>
      {/* Formular de adăugare tranzacție */}
      <TransactionForm
        form={form}
        formError={formError}
        formSuccess={formSuccess}
        onChange={handleFormChange}
        onSubmit={handleFormSubmit}
      />
      {/* Filtre, sortare, etc. */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
        <label>
          Tip:
          <select value={type} onChange={e => setType(e.target.value)}>
            <option value=''>Toate</option>
            <option value='income'>Venit</option>
            <option value='expense'>Cheltuială</option>
            <option value='saving'>Economisire</option>
            <option value='transfer'>Transfer</option>
          </select>
        </label>
        <label>
          Categorie:
          <input value={category} onChange={e => setCategory(e.target.value)} placeholder="Ex: food, salary" aria-label="Categorie filtrare" />
        </label>
        <label>
          Sortare:
          <select value={sort} onChange={e => setSort(e.target.value)}>
            <option value='date'>Dată (crescător)</option>
            <option value='-date'>Dată (descrescător)</option>
            <option value='amount'>Sumă (crescător)</option>
            <option value='-amount'>Sumă (descrescător)</option>
          </select>
        </label>
      </div>
      {loading ? <div>Se încarcă...</div> : (
        <TransactionTable
          transactions={transactions || []}
          loading={loading}
          total={total}
          offset={offset}
          limit={limit}
          onPageChange={setOffset}
        />
      )}
      <label style={{ marginLeft: 16 }}>
        / pagină:
        <select value={limit} onChange={e => { setLimit(Number(e.target.value)); setOffset(0); }}>
          <option value={5}>5</option>
          <option value={10}>10</option>
          <option value={20}>20</option>
          <option value={50}>50</option>
        </select>
      </label>
    </div>
  );
};

export default App;

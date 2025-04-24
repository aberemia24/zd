import React from 'react';
import { TransactionType, CategoryType, FrequencyType } from '../../constants/enums';
import { LABELS, PLACEHOLDERS, BUTTONS, OPTIONS } from '../../constants/ui';
import { MESAJE } from '../../constants/messages';

// Tipul datelor pentru formularul de tranzacție
export type TransactionFormData = {
  type: string;
  amount: string;
  category: string;
  subcategory: string;
  date: string;
  recurring: boolean;
  frequency: string;
};

export type TransactionFormProps = {
  form: TransactionFormData;
  formError: string;
  formSuccess: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
  loading?: boolean;
};

// Structura completă pentru categorii și subcategorii, conform listei primite
export const categorii: Record<string, any> = {
  [CategoryType.INCOME]: [
    'Salarii', 'Dividende', 'Chirii', 'Tichete de masă', 'Cadouri', 'Drepturi de autor', 'Pensii', 'Alocații (copil/de handicap etc.)', 'Alte venituri',
    { label: 'Report', options: ['Venituri reportate din luna anterioară.'] }
  ],
  [CategoryType.SAVING]: [
    'Fond de urgență', 'Fond de rezervă', 'Fond general',
    { label: 'Total economii', options: ['Suma totală a economiilor din toate categoriile.'] }
  ],
  [CategoryType.EXPENSE]: [
    { label: 'ÎNFĂȚIȘARE', options: [
      'Îmbrăcăminte, încălțăminte și accesorii', 'Salon de înfrumusețare', 'Produse cosmetice', 'Operații estetice', 'Produse de igienă personală', 'Produse de igienă pentru animale de companie', 'Curățătorie, călcătorie, croitorie, cizmărie', 'Îmbrăcăminte și accesorii pentru animale de companie'
    ] },
    { label: 'EDUCAȚIE', options: [
      'Taxe școlare | universitare', 'Grădiniță | Creșă | Afterschool | Bonă', 'Cursuri | Traininguri de specializare', 'Materiale de studiu | cărți', 'Licențe programe'
    ] },
    { label: 'CARIERĂ', options: [
      'Taxe autorizare | Examene titularizare sau specializare', 'Servicii realizare CV', 'Consultanță juridică | financiară'
    ] },
    { label: 'SĂNĂTATE', options: [
      'Medicamente | Suplimente alimentare | Vitamine', 'Servicii medicale pentru prevenție', 'Operații', 'Terapii de recuperare', 'Abonamente medicale', 'Asigurări de sănătate | medicale', 'Veterinar pentru animale de companie', 'Medicamente pentru animale de companie'
    ] },
    { label: 'NUTRIȚIE', options: [
      'Alimente', 'Restaurante', 'La pachet', 'Comenzi', 'Cafea', 'Mâncare pentru animale de companie'
    ] },
    { label: 'LOCUINȚĂ', options: [
      'Întreținere', 'Apă', 'Gaz', 'Energie electrică', 'Abonamente telefonie', 'Cablu TV', 'Internet', 'Reparații, montaj și amenajări interioare', 'Produse de curățenie și consumabile', 'Servicii de curățenie profesională', 'Mobilier | Decorațiuni', 'Electrice | Electrocasnice | Obiecte de iluminat', 'Asigurări de locuință', 'Impozit pe clădiri și terenuri', 'Chirie', 'Taxă gunoi'
    ] },
    { label: 'TIMP LIBER', options: [
      'Cărți sau abonamente cărți', 'Muzică | Video sau abonamente', 'Reviste | Ziare sau abonamente', 'Filme sau abonamente (Netflix, HBO GO, Disney Plus etc.)', 'Abonamente sală de sport | înot', 'Abonamente servicii online (stocare cloud, MS Office etc.)', 'Cinema | Teatru | Concerte | Muzee', 'Piscine | Ștranduri | Parcuri de distracții | Locuri de joacă', 'Jocuri de societate | Jucării pentru copii', 'Cadouri pentru cei dragi', 'Materiale & cursuri pentru hobby-uri', 'Echipamente sportive | pescuit', 'Pariuri | Loto | Casino', 'Țigări | Vaping'
    ] },
    { label: 'CĂLĂTORII', options: [
      'Acomodare', 'Bilete pentru mijloace de transport/combustibil', 'Taxe de drum | de pod | rovignete', 'Bilete pentru obiective turistice', 'Suveniruri', 'Asigurare de călătorie', 'Hotel pentru animale', 'Închiriere mașină', 'Închiriere echipamente (ski-uri, undițe, șezlonguri etc.)', 'Hrană'
    ] },
    { label: 'TRANSPORT', options: [
      'Transport public', 'Revizii', 'Taxe drumuri', 'Parcare', 'Spălătorie auto', 'Asigurare RCA', 'Asigurare CASCO', 'Accesorii/Consumabile pentru mașină', 'Combustibil', 'Rovigneta', 'Impozit auto', 'Schimbat cauciucuri vară/iarnă', 'Hotel pentru anvelope', 'Reparații auto'
    ] },
    { label: 'INVESTIȚII', options: [
      'Proiecte personalizabile (Completați denumirea exactă)', 'Investiție/Afacere 1', 'Investiție/Afacere 2', 'Investiție/Afacere 3', 'Investiție/Afacere 4', 'Investiție/Afacere 5', 'Investiție/Afacere 6', 'Investiție/Afacere 7', 'Investiție/Afacere 8', 'Investiție/Afacere 9', 'Investiție/Afacere 10', 'Investiție/Afacere 11', 'Investiție/Afacere 12', 'Investiție/Afacere 13'
    ] }
  ]
};

const TransactionForm: React.FC<TransactionFormProps> = ({ form, formError, formSuccess, onChange, onSubmit, loading }) => {
  // Filtrare categorii în funcție de tip
  let categoriiFiltrate: string[] = [];
  if (form.type === TransactionType.INCOME) {
    categoriiFiltrate = [CategoryType.INCOME];
  } else if (form.type === TransactionType.EXPENSE) {
    categoriiFiltrate = [CategoryType.EXPENSE];
  } else if (form.type === TransactionType.SAVING) {
    categoriiFiltrate = [CategoryType.SAVING];
  } else {
    categoriiFiltrate = [];
  }

  // Determină lista de subcategorii pe baza categoriei selectate
  let listaSubcategorii: any[] = [];
  if (form.category && categorii[form.category]) {
    listaSubcategorii = categorii[form.category];
  }

  return (
    <form role="form" aria-label="adăugare tranzacție" onSubmit={onSubmit} style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 24, alignItems: 'flex-end' }}>
      <label>
        {LABELS.TYPE}*:
        <select
          name="type"
          value={form.type}
          onChange={onChange}
          aria-label={LABELS.TYPE}
        >
          {/* Placeholder-ul "Alege" apare doar dacă nu este selectat niciun tip */}
          {form.type === '' ? <option value=''>{PLACEHOLDERS.SELECT}</option> : null}
          {OPTIONS.TYPE.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </label>
      <label>
        {LABELS.AMOUNT}*:
        <input name="amount" type="number" value={form.amount} onChange={onChange} aria-label={LABELS.AMOUNT} placeholder={PLACEHOLDERS.AMOUNT} />
      </label>
      <label>
        {LABELS.CATEGORY}*:
        {/* Dropdown-ul de categorie se adaptează în funcție de tip */}
        <select
          name="category"
          value={form.category}
          onChange={onChange}
          aria-label={LABELS.CATEGORY}
          disabled={(!form.type || categoriiFiltrate.length === 0)}
        >
          <option value=''>{PLACEHOLDERS.SELECT}</option>
          {categoriiFiltrate.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </label>
      <label>
        {LABELS.SUBCATEGORY}:
        <select
          name="subcategory"
          value={form.subcategory}
          onChange={onChange}
          aria-label={LABELS.SUBCATEGORY}
          disabled={!form.category}
        >
          <option value=''>{PLACEHOLDERS.SELECT}</option>
          {listaSubcategorii.map((subcat, idx) => {
            if (typeof subcat === 'string') {
              return <option key={subcat} value={subcat}>{subcat}</option>;
            } else if (typeof subcat === 'object' && subcat.label && Array.isArray(subcat.options)) {
              return (
                <optgroup key={subcat.label} label={subcat.label}>
                  {subcat.options.map((opt: string) => (
                    <option key={subcat.label + '-' + opt} value={opt}>{opt}</option>
                  ))}
                </optgroup>
              );
            }
            return null;
          })}
        </select>
      </label>
      <label>
        {LABELS.DATE}*:
        <input name="date" type="date" value={form.date} onChange={onChange} aria-label={LABELS.DATE} placeholder={PLACEHOLDERS.DATE} />
      </label>
      <label>
        <input name="recurring" type="checkbox" checked={form.recurring} onChange={onChange} aria-label={LABELS.RECURRING} /> {LABELS.RECURRING}?
      </label>
      <label>
        {LABELS.FREQUENCY}:
        <select
          name="frequency"
          value={form.frequency}
          onChange={onChange}
          aria-label={LABELS.FREQUENCY}
          disabled={!form.recurring}
        >
          <option value=''>{PLACEHOLDERS.SELECT}</option>
          {OPTIONS.FREQUENCY.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </label>
      <button type="submit" disabled={!!loading}>{BUTTONS.ADD}</button>
      {formError && (
        <span data-testid="error-message" style={{ color: 'red', display: 'block', marginTop: 8 }}>
          {MESAJE[formError as keyof typeof MESAJE] || formError}
        </span>
      )}
      {formSuccess && (
        <span data-testid="success-message" style={{ color: 'green', display: 'block', marginTop: 8 }}>
          {MESAJE[formSuccess as keyof typeof MESAJE] || formSuccess}
        </span>
      )}
    </form>
  );
};

export default TransactionForm;

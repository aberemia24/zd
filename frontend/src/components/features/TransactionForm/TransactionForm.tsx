import React from 'react';
import Button from '../../primitives/Button';
import Input from '../../primitives/Input';
import Select from '../../primitives/Select';
import Checkbox from '../../primitives/Checkbox';
import { TransactionType, CategoryType, FrequencyType } from '../../../constants/enums';
import { LABELS, PLACEHOLDERS, BUTTONS, OPTIONS } from '../../../constants/ui';
import { MESAJE } from '../../../constants/messages';

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
// TODO: Centralizează structura completă categorii/subcategorii în constants/categories.ts pentru a elimina orice hardcodare rămasă
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
    <form
  role="form"
  aria-label="adăugare tranzacție"
  onSubmit={onSubmit}
  className="flex flex-wrap gap-3 mb-6 items-end"
>
      <Select
        name="type"
        label={LABELS.TYPE + '*:'}
        value={form.type}
        onChange={onChange}
        aria-label={LABELS.TYPE}
        options={OPTIONS.TYPE}
        className="ml-2"
        placeholder={PLACEHOLDERS.SELECT}
      />
      <Input
        name="amount"
        type="number"
        label={LABELS.AMOUNT + '*:'}
        value={form.amount}
        onChange={onChange}
        aria-label={LABELS.AMOUNT}
        placeholder={PLACEHOLDERS.AMOUNT}
        className="ml-2"
      />
      <Select
        name="category"
        label={LABELS.CATEGORY + '*:'}
        value={form.category}
        onChange={onChange}
        aria-label={LABELS.CATEGORY}
        options={categoriiFiltrate
  .filter((cat): cat is string => typeof cat === 'string')
  .map(cat => ({ value: cat, label: cat }))}
        className="ml-2"
        disabled={!form.type || categoriiFiltrate.length === 0}
        placeholder={PLACEHOLDERS.SELECT}
      />
      <Select
        name="subcategory"
        label={LABELS.SUBCATEGORY}
        value={form.subcategory}
        onChange={onChange}
        aria-label={LABELS.SUBCATEGORY}
        options={listaSubcategorii
  .filter((subcat): subcat is string => typeof subcat === 'string')
  .map(subcat => ({ value: subcat, label: subcat }))}
        className="ml-2"
        disabled={!form.category}
        placeholder={PLACEHOLDERS.SELECT}
      />
      <Input
        name="date"
        type="date"
        label={LABELS.DATE + '*:'}
        value={form.date}
        onChange={onChange}
        aria-label={LABELS.DATE}
        placeholder={PLACEHOLDERS.DATE}
        className="ml-2"
      />
      <Checkbox
        name="recurring"
        label={LABELS.RECURRING + '?'}
        checked={form.recurring}
        onChange={onChange}
        aria-label={LABELS.RECURRING}
      />
      <Select
        name="frequency"
        label={LABELS.FREQUENCY}
        value={form.frequency}
        onChange={onChange}
        aria-label={LABELS.FREQUENCY}
        options={OPTIONS.FREQUENCY}
        className="ml-2"
        disabled={!form.recurring}
        placeholder={PLACEHOLDERS.SELECT}
      />
      <Button type="submit" disabled={!!loading} className="ml-2">{BUTTONS.ADD}</Button>
      {formError && (
        <span data-testid="error-message" className="text-error block mt-2">
          {MESAJE[formError as keyof typeof MESAJE] || formError}
        </span>
      )}
      {formSuccess && (
        <span data-testid="success-message" className="text-success block mt-2">
          {MESAJE[formSuccess as keyof typeof MESAJE] || formSuccess}
        </span>
      )}
    </form>
  );
};

export default TransactionForm;

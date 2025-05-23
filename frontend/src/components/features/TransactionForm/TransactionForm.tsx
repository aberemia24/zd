import React, { useCallback } from 'react';
import { ValidatedSubmitButton, Button } from '../../primitives/Button';
import Input from '../../primitives/Input/Input';
import Select from '../../primitives/Select/Select';
import Checkbox from '../../primitives/Checkbox/Checkbox';
import Badge from '../../primitives/Badge/Badge';
import Alert from '../../primitives/Alert/Alert';
import { TransactionType, getCategoriesForTransactionType } from '@shared-constants';
import { LABELS, PLACEHOLDERS, BUTTONS, OPTIONS } from '@shared-constants';
import { MESAJE } from '@shared-constants';
import { useTransactionFormStore } from '../../../stores/transactionFormStore';
import { useCategoryStore } from '../../../stores/categoryStore';
import { cn } from '../../../styles/new/shared/utils';import { formGroup } from '../../../styles/new/components/feedback';import { flex as flexContainer } from '../../../styles/new/components/layout';

/**
 * Returnează un mesaj bazat pe o cheie, suportând și acces la proprietăți imbricate.
 * De exemplu: 'VALIDARE.SUMA_INVALIDA' sau 'LOGIN_ERROR'
 */
function safeMessage(key: string): string {
  try {
    // Folosim tipizare sigură și descompunere structurată pentru acces ierarhic
    const parts = key.split('.');
    
    if (parts.length === 1) {
      // Acces direct la proprietate de prim nivel
      const value = MESAJE[parts[0] as keyof typeof MESAJE];
      if (typeof value === 'string') {
        return value;
      }
    } else if (parts.length === 2 && parts[0] === 'VALIDARE') {
      // Caz special pentru mesaje de validare (singura categorie imbricată acum)
      const validare = MESAJE.VALIDARE;
      const subKey = parts[1] as keyof typeof validare;
      if (validare && subKey in validare) {
        return validare[subKey];
      }
    }
    
    // Dacă nu s-a găsit nimic sau dacă valoarea nu e string, returnăm cheia originală
    return key;
  } catch (error) {
    // În caz de eroare, returnăm cheia originală
    console.error(`Eroare la accesarea mesajului cu cheia: ${key}`, error);
    return key;
  }
}

// Tipul datelor pentru formularul de tranzacție
export type TransactionFormData = {
  type: string;
  amount: string;
  category: string;
  subcategory: string;
  date: string;
  recurring: boolean;
  frequency: string;
  description?: string; // Descriere opțională pentru tranzacție (necesar pentru React Query)
  // currency nu este vizibilă în formular, se folosește valoarea implicită RON în store
};

// Nu mai folosim props pentru form, error, success, onChange, onSubmit, loading. Totul vine din store Zustand.

// Eliminat structura locală categorii/subcategorii. Folosește doar CATEGORIES din @shared-constants.

// Componentă cu props opționale onSave și onCancel
interface TransactionFormProps {
  onSave?: (form: TransactionFormData) => void;
  onCancel?: () => void;
}

const TransactionForm: React.FC<TransactionFormProps> = ({ onSave, onCancel }) => {
  // TOATE HOOK-URILE TREBUIE SĂ FIE ÎNAINTE DE EARLY RETURNS
  
  // Selectăm starea și acțiunile relevante din store
  const storeData = useTransactionFormStore();
  
  // Preluare categorii fuzionate din categoryStore (personalizate + predefinite)
  const categories = useCategoryStore(state => state.categories);

  // Destructuram store data safe
  const { form, error, success, loading, setField, handleSubmit, resetForm } = storeData || {};

  // Handler pentru schimbare câmp
  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    if (!form) return; // Guard defensiv
    
    const { name, value, type } = e.target;
    const isCheckbox = type === 'checkbox';
    const checkedValue = isCheckbox ? (e.target as HTMLInputElement).checked : undefined;
    setField && setField(name as keyof typeof form, isCheckbox ? checkedValue : value);
    // Resetăm frequency dacă debifăm recurring
    if (name === 'recurring' && isCheckbox && checkedValue === false) {
      setField && setField('frequency', '');
    }
    // Resetăm category și subcategory când type se schimbă
    if (name === 'type') {
      setField && setField('category', '');
      setField && setField('subcategory', '');
    }
    // Resetăm subcategorie când category se schimbă
    if (name === 'category') {
      setField && setField('subcategory', '');
    }
  }, [setField, form]);

  // Handler pentru submit: folosește store.handleSubmit și resetForm
  const onSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form || !handleSubmit || !resetForm) return; // Guard defensiv
    
    // Fix: amount number, fără id
    await handleSubmit();
    onSave?.(form);
    resetForm();
  }, [handleSubmit, resetForm, form, onSave]);

  // Filtrare categorii principale în funcție de tip (folosind mapping centralizat)
  const categoriiFiltrate = React.useMemo(() => {
    if (!form || !form.type) return [];
    
    const allowed = getCategoriesForTransactionType(form.type as TransactionType);
    if (!allowed.length) return [];
    
    // Filtrăm categoriile permise din categoriile fuzionate
    return categories.filter(cat => allowed.includes(cat.name));
  }, [form?.type, categories]);

  // Lista de opțiuni pentru dropdown-ul de categorie (grupuri mari)
  const optiuniCategorie = React.useMemo(() => {
    return categoriiFiltrate.map(cat => ({
      value: cat.name,
      // Formatăm label-ul pentru display, adăugăm indicator custom dacă e nevoie
      label: cat.name.charAt(0) + cat.name.slice(1).toLowerCase().replace(/_/g, ' ') + 
             (cat.isCustom ? ' ➡️' : '') // Indicator pentru categorii personalizate
    }));
  }, [categoriiFiltrate]);

  // Lista de opțiuni pentru subcategorie, acum cu suport pentru subcategorii personalizate
  const optiuniSubcategorie = React.useMemo(() => {
    if (!form || !form.category) return [];
    
    // Găsim categoria selectată
    const selectedCategory = categories.find(cat => cat.name === form.category);
    if (!selectedCategory) return [];
    
    // Transformăm subcategoriile în opțiuni pentru dropdown
    return selectedCategory.subcategories.map(subcat => ({
      value: subcat.name,
      // Adăugăm indicator pentru subcategorii personalizate
      label: subcat.name + (subcat.isCustom ? ' ➡️' : ''),
      customStyle: subcat.isCustom ? 'text-accent' : undefined, // Stil special pentru subcategorii personalizate
      // Nu mai avem nevoie de group în noua structură
    }));
  }, [form, categories]);

  // Verificare defensivă pentru store data DUPĂ toate hook-urile
  if (!storeData) {
    return (
      <div className="flex justify-center items-center p-4" data-testid="transaction-form-loading">
        <div>Loading store...</div>
      </div>
    );
  }

  // Guard defensiv DUPĂ toate hook-urile pentru a respecta Rules of Hooks
  // Verifică atât form cât și proprietățile esențiale
  if (!form || typeof form !== 'object' || 
      !('amount' in form) || !('type' in form) || !('category' in form)) {
    return (
      <div className="flex justify-center items-center p-4" data-testid="transaction-form-loading">
        <div>Loading form...</div>
      </div>
    );
  }

  return (
    <form
      aria-label={LABELS.FORM}
      onSubmit={onSubmit}
      className={cn(formGroup({ variant: 'default' }), 'space-y-6')}
      data-testid="transaction-form"
    >
      {/* Bara de titlu cu efect de gradient */}
      <div className={cn(flexContainer({ direction: 'row', justify: 'between', align: 'center' }))}>
        <h3 className="text-lg font-medium text-gray-900">
          {form.type ? 
            `Adaugă ${form.type === TransactionType.INCOME ? 'venit' : 'cheltuială'}` : 
            'Adaugă tranzacție'}
        </h3>
        {/* Indicator status formular */}
        {loading && (
          <Badge variant="warning" size="sm">
            Se procesează...
          </Badge>
        )}
      </div>
      
      {/* Secțiunea de selectare tip tranzacție cu stiluri rafinate */}
      <div className="space-y-4">
        <Select
          name="type"
          label={LABELS.TYPE + '*:'}
          value={form.type}
          onChange={handleChange}
          aria-label={LABELS.TYPE}
          options={OPTIONS.TYPE}
          placeholder={PLACEHOLDERS.SELECT}
          dataTestId="type-select"
          variant="default"
          size="md"
        />
      </div>
      
      {/* Rândul principal de câmpuri cu aranjament grid și stiluri rafinate */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          name="amount"
          type="number"
          label={LABELS.AMOUNT + '*:'}
          value={form.amount}
          onChange={handleChange}
          aria-label={LABELS.AMOUNT}
          error={typeof error === 'object' && error ? (error as Record<string, string>).amount : undefined}
          dataTestId="amount-input"
          variant="default"
          size="md"
        />
        
        <Select
          name="category"
          label={LABELS.CATEGORY + '*:'}
          value={form.category}
          onChange={handleChange}
          aria-label={LABELS.CATEGORY}
          options={optiuniCategorie}
          disabled={!form.type || optiuniCategorie.length === 0}
          placeholder={PLACEHOLDERS.SELECT}
          dataTestId="category-select"
          variant="default"
          size="md"
        />
        
        <Select
          name="subcategory"
          label={LABELS.SUBCATEGORY}
          value={form.subcategory}
          onChange={handleChange}
          aria-label={LABELS.SUBCATEGORY}
          options={optiuniSubcategorie}
          disabled={!form.category || optiuniSubcategorie.length === 0}
          placeholder={PLACEHOLDERS.SELECT}
          dataTestId="subcategory-select"
          variant="default"
          size="md"
        />
        
        <Input
          name="date"
          type="date"
          label={LABELS.DATE + '*:'}
          value={form.date}
          onChange={handleChange}
          aria-label={LABELS.DATE}
          error={typeof error === 'object' && error ? (error as Record<string, string>).date : undefined}
          dataTestId="date-input"
          variant="default"
          size="md"
        />
        
        <div className="flex items-center gap-3">
          <Checkbox
            name="recurring"
            label={LABELS.RECURRING + '?'}
            checked={form.recurring}
            onChange={handleChange}
            dataTestId="recurring-checkbox"
            variant="default"
            size="md"
          />
          
          {form.recurring && (
            <Badge variant="primary" size="sm">
              Recurent
            </Badge>
          )}
        </div>
        
        <Select
          name="frequency"
          label={LABELS.FREQUENCY}
          value={form.frequency}
          onChange={handleChange}
          aria-label={LABELS.FREQUENCY}
          options={OPTIONS.FREQUENCY}
          disabled={!form.recurring}
          placeholder={PLACEHOLDERS.SELECT}
          dataTestId="frequency-select"
          variant="default"
          size="md"
        />
        
        {/* Adăugăm câmp pentru descriere */}
        <div className="col-span-full">
          <Input
            name="description"
            type="text"
            label={LABELS.DESCRIPTION}
            value={form.description || ''}
            onChange={handleChange}
            aria-label={LABELS.DESCRIPTION}
            placeholder={PLACEHOLDERS.DESCRIPTION}
            dataTestId="description-input"
            variant="default"
            size="md"
          />
        </div>
      </div>
      
      {/* Butoane de acțiune cu efecte vizuale moderne */}
      <div className={cn(flexContainer({ direction: 'row', justify: 'between', align: 'center' }))}>
        {/* Verificăm dacă toate câmpurile obligatorii sunt completate */}
        {(() => {
          // Asigurăm validarea strictă a formularului și conversia la boolean
          const isFormValid: boolean = Boolean(
            form.type && 
            form.amount && 
            form.category && 
            form.date && 
            (!form.recurring || (form.recurring && form.frequency))
          );
          
          return (
            <ValidatedSubmitButton
              isFormValid={isFormValid}
              size="md"
              isLoading={Boolean(loading)}
              dataTestId="add-transaction-button"
              aria-label={BUTTONS.ADD}
              submitText={BUTTONS.ADD}
            />
          );
        })()}
        
        <Button
          type="button"
          variant="secondary"
          size="md"
          dataTestId="cancel-btn"
          onClick={() => {
            resetForm();
            onCancel?.();
          }}
        >
          {BUTTONS.CANCEL}
        </Button>
      </div>
      
      {/* Mesaje de eroare și succes cu stiluri rafinate */}
      {error && typeof error === 'string' && (
        <Alert
          type="error" 
          message={safeMessage(error)}
          dataTestId="error-message"
          size="md"
        />
      )}
      
      {success && (
        <Alert
          type="success" 
          message={safeMessage(success)}
          dataTestId="success-message"
          size="md"
        />
      )}
    </form>
  );
};

export default TransactionForm;

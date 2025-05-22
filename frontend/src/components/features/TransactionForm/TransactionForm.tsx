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
import { useThemeEffects } from '../../../hooks';

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
  // Selectăm starea și acțiunile relevante din store
  // Acceptă error ca string sau ca obiect (Record<string, string>) pentru validări pe câmpuri
  const { form, error, success, loading, setField, handleSubmit, resetForm } = useTransactionFormStore() as {
    form: TransactionFormData;
    error: string | Record<string, string>;
    success: string;
    loading: any; // Poate fi string sau boolean în funcție de implementare API
    setField: (name: keyof TransactionFormData, value: any) => void;
    handleSubmit: (e?: React.FormEvent<HTMLFormElement>) => Promise<void>;
    resetForm: () => void;
  };


  // Handler pentru schimbare câmp
  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const isCheckbox = type === 'checkbox';
    const checkedValue = isCheckbox ? (e.target as HTMLInputElement).checked : undefined;
    setField(name as keyof typeof form, isCheckbox ? checkedValue : value);
    // Resetăm frequency dacă debifăm recurring
    if (name === 'recurring' && isCheckbox && checkedValue === false) {
      setField('frequency', '');
    }
    // Resetăm category și subcategory când type se schimbă
    if (name === 'type') {
      setField('category', '');
      setField('subcategory', '');
    }
    // Resetăm subcategorie când category se schimbă
    if (name === 'category') {
      setField('subcategory', '');
    }
  }, [setField]);

  // Handler pentru submit: folosește store.handleSubmit și resetForm
  const onSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    // Fix: amount number, fără id
    await handleSubmit();
    onSave?.(form);
    resetForm();
  }, [handleSubmit, resetForm, form, onSave]);

  // Preluare categorii fuzionate din categoryStore (personalizate + predefinite)
  const categories = useCategoryStore(state => state.categories);

  // Filtrare categorii principale în funcție de tip (folosind mapping centralizat)
  const categoriiFiltrate = React.useMemo(() => {
    if (!form.type) return [];
    
    const allowed = getCategoriesForTransactionType(form.type as TransactionType);
    if (!allowed.length) return [];
    
    // Filtrăm categoriile permise din categoriile fuzionate
    return categories.filter(cat => allowed.includes(cat.name));
  }, [form.type, categories]);

  // Lista de opțiuni pentru dropdown-ul de categorie (grupuri mari)
  const optiuniCategorie = React.useMemo(() => {
    return categoriiFiltrate.map(cat => ({
      value: cat.name,
      // Formatăm label-ul pentru display, adaugăm indicator custom dacă e nevoie
      label: cat.name.charAt(0) + cat.name.slice(1).toLowerCase().replace(/_/g, ' ') + 
             (cat.isCustom ? ' ➡️' : '') // Indicator pentru categorii personalizate
    }));
  }, [categoriiFiltrate]);

  // Lista de opțiuni pentru subcategorie, acum cu suport pentru subcategorii personalizate
  const optiuniSubcategorie = React.useMemo(() => {
    if (!form.category) return [];
    
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
  }, [form.category, categories]);

  // Definiție pentru starea formularului - dacă utilizatorul editează activ un câmp
  const [activatedField, setActivatedField] = React.useState<string | null>(null);
  
  // Handler pentru focus - marchează câmpul drept activat pentru efecte vizuale
  const handleFocus = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
    setActivatedField(e.target.name);
  };
  
  // Handler pentru blur - resetează starea de activare
  const handleBlur = () => {
    setActivatedField(null);
  };
  
  // Utilizăm hook-ul de efecte pentru gestionarea efectelor vizuale
  const { getClasses } = useThemeEffects({
    withShadow: true,
    withFadeIn: true
  });
  
  return (
    <form
      aria-label={LABELS.FORM}
      onSubmit={onSubmit}
      className={getClasses('form-container', undefined, undefined, undefined)}
      data-testid="transaction-form"
    >
      {/* Bara de titlu cu efect de gradient */}
      <div className={getClasses('flex-group', 'between', 'md')}>
        <h3 className={getClasses('form-label', 'secondary', 'md')}>{form.type ? 
          `Adaugă ${form.type === TransactionType.INCOME ? 'venit' : 'cheltuială'}` : 
          'Adaugă tranzacție'}
        </h3>
        {/* Indicator status formular */}
        {loading && (
          <Badge variant="warning" withPulse pill>
            Se procesează...
          </Badge>
        )}
      </div>
      
      {/* Secțiunea de selectare tip tranzacție cu stiluri rafinate */}
      <div className={getClasses('flex-group', 'start', 'md')}>
        <Select
          name="type"
          label={LABELS.TYPE + '*:'}
          value={form.type}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          aria-label={LABELS.TYPE}
          options={OPTIONS.TYPE}
          placeholder={PLACEHOLDERS.SELECT}
          data-testid="type-select"
          withGlowFocus
          withHoverEffect
          withTransition
          className={activatedField === 'type' ? getClasses('input', 'primary', undefined, 'focus') : ''}
        />
      </div>
      
      {/* Rândul principal de câmpuri cu aranjament grid și stiluri rafinate */}
      <div className={getClasses('grid')}>
        <Input
          name="amount"
          type="number"
          label={LABELS.AMOUNT + '*:'}
          value={form.amount}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          aria-label={LABELS.AMOUNT}
          error={typeof error === 'object' ? error.amount : undefined}
          data-testid="amount-input"
          withFloatingLabel
          withGlowFocus={activatedField === 'amount'}
          withTransition
        />
        <Select
          name="category"
          label={LABELS.CATEGORY + '*:'}
          value={form.category}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          aria-label={LABELS.CATEGORY}
          options={optiuniCategorie}
          disabled={!form.type || optiuniCategorie.length === 0}
          placeholder={PLACEHOLDERS.SELECT}
          data-testid="category-select"
          withGlowFocus
          withHoverEffect
          withTransition
          className={activatedField === 'category' ? getClasses('input', 'primary', undefined, 'focus') : ''}
        />
        <Select
          name="subcategory"
          label={LABELS.SUBCATEGORY}
          value={form.subcategory}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          aria-label={LABELS.SUBCATEGORY}
          options={optiuniSubcategorie}
          disabled={!form.category || optiuniSubcategorie.length === 0}
          placeholder={PLACEHOLDERS.SELECT}
          data-testid="subcategory-select"
          withGlowFocus
          withHoverEffect
          withTransition
          className={activatedField === 'subcategory' ? getClasses('input', 'primary', undefined, 'focus') : ''}
        />
        <Input
          name="date"
          type="date"
          label={LABELS.DATE + '*:'}
          value={form.date}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          aria-label={LABELS.DATE}
          error={typeof error === 'object' ? error.date : undefined}
          data-testid="date-input"
          withGlowFocus={activatedField === 'date'}
        />
        <div className={getClasses('flex-group', 'start', 'md')}> 
          <Checkbox
            name="recurring"
            label={LABELS.RECURRING + '?'}
            checked={form.recurring}
            onChange={handleChange}
            data-testid="recurring-checkbox"
            withBorderAnimation
            withScaleEffect
          />
          
          {form.recurring && (
            <Badge variant="primary" withPulse pill>
              Recurent
            </Badge>
          )}
        </div>
        
        <Select
          name="frequency"
          label={LABELS.FREQUENCY}
          value={form.frequency}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          aria-label={LABELS.FREQUENCY}
          options={OPTIONS.FREQUENCY}
          disabled={!form.recurring}
          placeholder={PLACEHOLDERS.SELECT}
          data-testid="frequency-select"
          withGlowFocus
          withHoverEffect
          withTransition
          className={activatedField === 'frequency' ? getClasses('input', 'primary', undefined, 'focus') : ''}
        />
        
        {/* Adăugăm câmp pentru descriere */}
        <Input
          name="description"
          type="text"
          label={LABELS.DESCRIPTION}
          value={form.description || ''}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          aria-label={LABELS.DESCRIPTION}
          placeholder={PLACEHOLDERS.DESCRIPTION}
          data-testid="description-input"
          withFloatingLabel
          withGlowFocus={activatedField === 'description'}
          withTransition
          className={getClasses('col-span-full')}
        />
      </div>
      
      {/* Butoane de acțiune cu efecte vizuale moderne */}
      <div className={getClasses('flex-group', 'between', 'md')}>
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
          
          // Aplicăm efecte vizuale diferite în funcție de starea formularului
          
          // Buton cu stil subtil când e inactiv (ghost) și vizibil când e valid (success)
          return (
            <ValidatedSubmitButton
              isFormValid={isFormValid}
              size="md"
              isLoading={Boolean(loading)}
              data-testid="add-transaction-button"
              aria-label={BUTTONS.ADD}
              submitText={BUTTONS.ADD}
            >
              {isFormValid && (
                <span className={getClasses('indicator', 'primary', 'md', 'active')}></span>
              )}
            </ValidatedSubmitButton>
          );
        })()}
        <Button
          type="button"
          variant="secondary"
          size="md"
          data-testid="cancel-btn"
          onClick={() => {
            resetForm();
            onCancel?.();
          }}
          withShadow
        >
          {BUTTONS.CANCEL}
        </Button>
      </div>
      
      {/* Mesaje de eroare și succes cu stiluri rafinate */}
      {error && typeof error === 'string' && (
        <Alert
          type="error" 
          message={safeMessage(error)}
          data-testid="error-message"
          className={getClasses('spacing', 'section')}
          withFadeIn
          withAccentBorder
          withShadow
          withIcon
        />
      )}
      
      {success && (
        <Alert
          type="success" 
          message={safeMessage(success)}
          data-testid="success-message"
          className={getClasses('spacing', 'section')}
          withFadeIn
          withAccentBorder
          withShadow
          withIcon
        />
      )}
    </form>
  );
};

export default TransactionForm;

import React from 'react';
import { Controller } from 'react-hook-form';
import Input from '../../primitives/Input/Input';
import Select from '../../primitives/Select/Select';
import Checkbox from '../../primitives/Checkbox/Checkbox';
import Textarea from '../../primitives/Textarea/Textarea';
import { Button, ValidatedSubmitButton } from '../../primitives/Button';
import Alert from '../../primitives/Alert/Alert';
import FormGroup from '../../primitives/FormGroup/FormGroup';
import { useTransactionForm, type TransactionFormData } from '../../../hooks/useFormValidation';
import { 
  cn,
  formGroup
} from '../../../styles/cva-v2';
import { TransactionType, OPTIONS } from '@shared-constants';

interface ExampleFormProps {
  onSubmit?: (data: TransactionFormData) => Promise<void>;
  onCancel?: () => void;
  initialData?: Partial<TransactionFormData>;
}

/**
 * Exemplu de formular care demonstrează integrarea React Hook Form cu componentele CVA v2
 * Utilizează validare cu Zod și oferă feedback visual instant
 */
const ExampleForm: React.FC<ExampleFormProps> = ({
  onSubmit,
  onCancel,
  initialData
}) => {
  const {
    control,
    handleFormSubmit,
    getInputProps,
    getSelectProps,
    getCheckboxProps,
    getTextareaProps,
    isFormValid,
    isSubmitting,
    formState: { errors },
    reset,
    watch
  } = useTransactionForm({
    defaultValues: {
      type: '',
      amount: '',
      category: '',
      subcategory: '',
      date: new Date().toISOString().split('T')[0], // Data curentă
      description: '',
      recurring: false,
      frequency: '',
      ...initialData
    },
    onSubmitSuccess: async (data) => {
      console.log('Form submitted successfully:', data);
      await onSubmit?.(data);
      // Resetează formularul după submit reușit
      reset();
    },
    onSubmitError: (error) => {
      console.error('Form submission error:', error);
    }
  });

  // Monitorizează valoarea recurring pentru afișare condițională
  const isRecurring = watch('recurring');

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-carbon-900 dark:text-carbon-100">
          Exemplu React Hook Form + CVA v2
        </h2>
        <p className="text-carbon-600 dark:text-carbon-400 mt-2">
          Demonstrație integrare validare cu feedback visual instant
        </p>
      </div>

      <form 
        onSubmit={handleFormSubmit}
        className={cn(formGroup({ variant: "default" }), "space-y-6")}
        data-testid="example-form"
      >
        {/* Tip tranzacție */}
        <FormGroup>
          <Controller
            name="type"
            control={control}
            render={({ field }) => (
              <Select
                {...field}
                label="Tip tranzacție*"
                options={OPTIONS.TYPE}
                placeholder="Selectează tipul"
                {...getSelectProps('type')}
                data-testid="type-select"
              />
            )}
          />
        </FormGroup>

        {/* Sumă */}
        <FormGroup>
          <Controller
            name="amount"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                type="number"
                label="Sumă*"
                placeholder="0.00"
                step="0.01"
                min="0.01"
                {...getInputProps('amount')}
                data-testid="amount-input"
              />
            )}
          />
        </FormGroup>

        {/* Categorie */}
        <FormGroup>
          <Controller
            name="category"
            control={control}
            render={({ field }) => (
              <Select
                {...field}
                label="Categorie*"
                options={[
                  { value: 'FOOD', label: 'Mâncare' },
                  { value: 'TRANSPORT', label: 'Transport' },
                  { value: 'ENTERTAINMENT', label: 'Divertisment' },
                  { value: 'BILLS', label: 'Facturi' },
                  { value: 'SALARY', label: 'Salariu' },
                ]}
                placeholder="Selectează categoria"
                {...getSelectProps('category')}
                data-testid="category-select"
              />
            )}
          />
        </FormGroup>

        {/* Subcategorie */}
        <FormGroup>
          <Controller
            name="subcategory"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                label="Subcategorie"
                placeholder="Subcategorie opțională"
                {...getInputProps('subcategory')}
                data-testid="subcategory-input"
              />
            )}
          />
        </FormGroup>

        {/* Data */}
        <FormGroup>
          <Controller
            name="date"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                type="date"
                label="Data*"
                {...getInputProps('date')}
                data-testid="date-input"
              />
            )}
          />
        </FormGroup>

        {/* Descriere */}
        <FormGroup>
          <Controller
            name="description"
            control={control}
            render={({ field }) => (
              <Textarea
                {...field}
                label="Descriere"
                placeholder="Detalii opționale..."
                rows={3}
                maxLength={200}
                withCharacterCount
                {...getTextareaProps('description')}
                data-testid="description-textarea"
              />
            )}
          />
        </FormGroup>

        {/* Checkbox recurent */}
        <FormGroup>
          <Controller
            name="recurring"
            control={control}
            render={({ field: { value, onChange, ...field } }) => (
              <Checkbox
                {...field}
                checked={value}
                onChange={onChange}
                label="Tranzacție recurentă"
                {...getCheckboxProps('recurring')}
                data-testid="recurring-checkbox"
              />
            )}
          />
        </FormGroup>

        {/* Frecvență (doar dacă este recurent) */}
        {isRecurring && (
          <FormGroup>
            <Controller
              name="frequency"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  label="Frecvența*"
                  options={[
                    { value: 'DAILY', label: 'Zilnic' },
                    { value: 'WEEKLY', label: 'Săptămânal' },
                    { value: 'MONTHLY', label: 'Lunar' },
                    { value: 'YEARLY', label: 'Anual' },
                  ]}
                  placeholder="Selectează frecvența"
                  {...getSelectProps('frequency')}
                  data-testid="frequency-select"
                />
              )}
            />
          </FormGroup>
        )}

        {/* Afișare erori generale */}
        {Object.keys(errors).length > 0 && (
          <Alert variant="error" data-testid="form-errors">
            <div className="space-y-1">
              <p className="font-medium">Formularul conține erori:</p>
              <ul className="list-disc list-inside text-sm space-y-1">
                {Object.entries(errors).map(([field, error]) => (
                  <li key={field}>
                    <strong>{field}:</strong> {error?.message}
                  </li>
                ))}
              </ul>
            </div>
          </Alert>
        )}

        {/* Butoane */}
        <div className="flex gap-4 pt-4">
          <ValidatedSubmitButton
            isFormValid={isFormValid}
            isLoading={isSubmitting}
            size="md"
            submitText="Salvează"
            loadingText="Se salvează..."
            data-testid="submit-button"
          >
            Salvează
          </ValidatedSubmitButton>

          <Button
            type="button"
            variant="secondary"
            size="md"
            onClick={() => {
              reset();
              onCancel?.();
            }}
            disabled={isSubmitting}
            data-testid="cancel-button"
          >
            Anulează
          </Button>

          <Button
            type="button"
            variant="outline"
            size="md"
            onClick={() => reset()}
            disabled={isSubmitting}
            data-testid="reset-button"
          >
            Resetează
          </Button>
        </div>
      </form>

      {/* Informații despre starea formularului pentru debugging */}
      <div className="mt-8 p-4 bg-carbon-100 dark:bg-carbon-800 rounded-lg">
        <h3 className="text-lg font-medium mb-2">Debug Info:</h3>
        <div className="space-y-1 text-sm">
          <p><strong>Form Valid:</strong> {isFormValid ? 'Da' : 'Nu'}</p>
          <p><strong>Is Submitting:</strong> {isSubmitting ? 'Da' : 'Nu'}</p>
          <p><strong>Errors Count:</strong> {Object.keys(errors).length}</p>
        </div>
      </div>
    </div>
  );
};

export default ExampleForm; 
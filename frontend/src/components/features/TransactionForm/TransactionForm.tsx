import React, { useCallback } from "react";
import { ValidatedSubmitButton, Button } from "../../primitives/Button";
import Input from "../../primitives/Input/Input";
import Select from "../../primitives/Select/Select";
import Checkbox from "../../primitives/Checkbox/Checkbox";
import Badge from "../../primitives/Badge/Badge";
import Alert from "../../primitives/Alert/Alert";
import FormLayout from "../../primitives/FormLayout/FormLayout";
import FieldGrid, { FieldWrapper } from "../../primitives/FieldGrid/FieldGrid";
import {
  TransactionType,
  getCategoriesForTransactionType,
} from "@budget-app/shared-constants";
import { LABELS, PLACEHOLDERS, BUTTONS, OPTIONS, EXCEL_GRID } from "@budget-app/shared-constants";
import { MESAJE } from "@budget-app/shared-constants";
import { useTransactionFormStore } from "../../../stores/transactionFormStore";
import { useCategoryStore } from "../../../stores/categoryStore";
import { 
  cn,
  flexLayout
} from "../../../styles/cva-v2";

/**
 * Returnează un mesaj bazat pe o cheie, suportând și acces la proprietăți imbricate.
 * De exemplu: 'VALIDARE.SUMA_INVALIDA' sau 'LOGIN_ERROR'
 */
function safeMessage(key: string): string {
  try {
    // Folosim tipizare sigură și descompunere structurată pentru acces ierarhic
    const parts = key.split(".");

    if (parts.length === 1) {
      // Acces direct la proprietate de prim nivel
      const value = MESAJE[parts[0] as keyof typeof MESAJE];
      if (typeof value === "string") {
        return value;
      }
    } else if (parts.length === 2 && parts[0] === "VALIDARE") {
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

// Import tipuri din fișierul dedicat (breaks circular dependency)
import type { TransactionFormData, TransactionFormProps } from "../../../types/TransactionForm";

const TransactionFormComponent: React.FC<TransactionFormProps> = ({
  onSave,
  onCancel,
}) => {
  // TOATE HOOK-URILE TREBUIE SĂ FIE ÎNAINTE DE EARLY RETURNS

  // Selectăm starea și acțiunile relevante din store
  const storeData = useTransactionFormStore();

  // Preluare categorii fuzionate din categoryStore (personalizate + predefinite)
  const categories = useCategoryStore((state) => state.categories);

  // Destructuram store data safe
  const { form, error, success, loading, setField, handleSubmit, resetForm } =
    storeData || {};

  // Handler pentru schimbare câmp
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      if (!form) return; // Guard defensiv

      const { name, value, type } = e.target;
      const isCheckbox = type === "checkbox";
      const checkedValue = isCheckbox
        ? (e.target as HTMLInputElement).checked
        : undefined;
      
      // Asigurăm că valoarea nu este undefined pentru setField
      const finalValue = isCheckbox ? (checkedValue ?? false) : value;
      setField &&
        setField(name as keyof typeof form, finalValue);
      // Resetăm frequency dacă debifăm recurring
      if (name === "recurring" && isCheckbox && checkedValue === false) {
        setField && setField("frequency", "");
      }
      // Resetăm category și subcategory când type se schimbă
      if (name === "type") {
        setField && setField("category", "");
        setField && setField("subcategory", "");
      }
      // Resetăm subcategorie când category se schimbă
      if (name === "category") {
        setField && setField("subcategory", "");
      }
    },
    [setField, form],
  );

  // Handler pentru submit: folosește store.handleSubmit și resetForm
  const onSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!form || !handleSubmit || !resetForm) return; // Guard defensiv

      // Fix: amount number, fără id
      await handleSubmit();
      onSave?.(form);
      resetForm();
    },
    [handleSubmit, resetForm, form, onSave],
  );

  // Filtrare categorii principale în funcție de tip (folosind mapping centralizat)
  const categoriiFiltrate = React.useMemo(() => {
    if (!form || !form.type) return [];

    const allowed = getCategoriesForTransactionType(
      form.type as TransactionType,
    );
    if (!allowed.length) return [];

    // Filtrăm categoriile permise din categoriile fuzionate
    return categories.filter((cat) => allowed.includes(cat.name));
  }, [form, categories]);

  // Lista de opțiuni pentru dropdown-ul de categorie (grupuri mari)
  const optiuniCategorie = React.useMemo(() => {
    return categoriiFiltrate.map((cat) => ({
      value: cat.name,
      // Formatăm label-ul pentru display, adăugăm indicator custom dacă e nevoie
      label:
        cat.name.charAt(0) +
        cat.name.slice(1).toLowerCase().replace(/_/g, " ") +
        (cat.isCustom ? " ➡️" : ""), // Indicator pentru categorii personalizate
    }));
  }, [categoriiFiltrate]);

  // Lista de opțiuni pentru subcategorie, acum cu suport pentru subcategorii personalizate
  const optiuniSubcategorie = React.useMemo(() => {
    if (!form || !form.category) return [];

    // Găsim categoria selectată
    const selectedCategory = categories.find(
      (cat) => cat.name === form.category,
    );
    if (!selectedCategory) return [];

    // Transformăm subcategoriile în opțiuni pentru dropdown
    return selectedCategory.subcategories.map((subcat) => ({
      value: subcat.name,
      // Adăugăm indicator pentru subcategorii personalizate
      label: subcat.name + (subcat.isCustom ? " ➡️" : ""),
      customStyle: subcat.isCustom ? "text-accent" : undefined, // Stil special pentru subcategorii personalizate
      // Nu mai avem nevoie de group în noua structură
    }));
  }, [form, categories]);

  // Verificare defensivă pentru store data DUPĂ toate hook-urile
  if (!storeData) {
    return (
      <div
        className={cn(
          flexLayout({ justify: "center", align: "center" }),
          "my-4"
        )}
        data-testid="transaction-form-store-loading"
      >
        <div data-testid="transaction-form-store-loading-text">Loading store...</div>
      </div>
    );
  }

  // Guard defensiv DUPĂ toate hook-urile pentru a respecta Rules of Hooks
  // Verifică atât form cât și proprietățile esențiale
  if (
    !form ||
    typeof form !== "object" ||
    !("amount" in form) ||
    !("type" in form) ||
    !("category" in form)
  ) {
    return (
      <div
        className={cn(
          flexLayout({ justify: "center", align: "center" }),
          "my-4"
        )}
        data-testid="transaction-form-data-loading"
      >
        <div data-testid="transaction-form-data-loading-text">Loading form...</div>
      </div>
    );
  }

  // Prepare form sections
  const formTitle = form.type
    ? `Adaugă ${form.type === TransactionType.INCOME ? "venit" : "cheltuială"}`
    : EXCEL_GRID.ACTIONS.ADD_TRANSACTION;

  const loadingIndicator = loading ? (
    <Badge variant="warning">
      Se procesează...
    </Badge>
  ) : undefined;

  const formActions = (
    <div className="flex gap-2 justify-end">
      <Button
        type="button"
        variant="secondary"
        size="sm"
        data-testid="cancel-btn"
        onClick={() => {
          resetForm();
          onCancel?.();
        }}
        className="px-4"
      >
        {BUTTONS.CANCEL}
      </Button>

      {(() => {
        // Asigurăm validarea strictă a formularului și conversia la boolean
        const isFormValid: boolean = Boolean(
          form.type &&
            form.amount &&
            form.category &&
            form.date &&
            (!form.recurring || (form.recurring && form.frequency)),
        );

        return (
          <ValidatedSubmitButton
            isFormValid={isFormValid}
            size="sm"
            isLoading={Boolean(loading)}
            data-testid="add-transaction-button"
            aria-label={BUTTONS.ADD}
            submitText={BUTTONS.ADD}
            className="px-6"
          >
            {BUTTONS.ADD}
          </ValidatedSubmitButton>
        );
      })()}
    </div>
  );

  const formMessages = (
    <>
      {error && typeof error === "string" && (
        <Alert
          variant="error"
          data-testid="transaction-form-error-message"
        >
          {safeMessage(error)}
        </Alert>
      )}

      {success && (
        <Alert
          variant="success"
          data-testid="success-message"
        >
          {safeMessage(success)}
        </Alert>
      )}
    </>
  );

  return (
    <FormLayout
      title={formTitle}
      loadingIndicator={loadingIndicator}
      actions={formActions}
      messages={formMessages}
      onSubmit={onSubmit}
      testId="transaction-form"
      ariaLabel={LABELS.FORM}
    >
      {/* Compact Form Layout - 3 columns for better space usage */}
      <FieldGrid cols={{ base: 1, sm: 2, md: 3 }} gap={3}>
        {/* Row 1: Type, Amount, Date */}
        <Select
          name="type"
          label={LABELS.TYPE + "*:"}
          value={form.type}
          onChange={handleChange}
          aria-label={LABELS.TYPE}
          options={OPTIONS.TYPE}
          placeholder={PLACEHOLDERS.SELECT}
          data-testid="type-select"
          variant="default"
          size="sm"
        />

        <Input
          name="amount"
          type="number"
          label={LABELS.AMOUNT + "*:"}
          value={form.amount}
          onChange={handleChange}
          aria-label={LABELS.AMOUNT}
          error={
            typeof error === "object" && error
              ? (error as Record<string, string>).amount
              : undefined
          }
          data-testid="amount-input"
          variant="default"
          size="sm"
        />

        <Input
          name="date"
          type="date"
          label={LABELS.DATE + "*:"}
          value={form.date}
          onChange={handleChange}
          aria-label={LABELS.DATE}
          error={
            typeof error === "object" && error
              ? (error as Record<string, string>).date
              : undefined
          }
          data-testid="date-input"
          variant="default"
          size="sm"
        />

        {/* Row 2: Category, Subcategory, Frequency */}
        <Select
          name="category"
          label={LABELS.CATEGORY + "*:"}
          value={form.category}
          onChange={handleChange}
          aria-label={LABELS.CATEGORY}
          options={optiuniCategorie}
          disabled={!form.type || optiuniCategorie.length === 0}
          placeholder={PLACEHOLDERS.SELECT}
          data-testid="category-select"
          variant="default"
          size="sm"
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
          data-testid="subcategory-select"
          variant="default"
          size="sm"
        />

        <Select
          name="frequency"
          label={LABELS.FREQUENCY}
          value={form.frequency}
          onChange={handleChange}
          aria-label={LABELS.FREQUENCY}
          options={OPTIONS.FREQUENCY}
          disabled={!form.recurring}
          placeholder={PLACEHOLDERS.SELECT}
          data-testid="frequency-select"
          variant="default"
          size="sm"
        />

        {/* Row 3: Recurring Checkbox, Description (spans 2 cols) */}
        <div className={flexLayout({ align: "center", gap: 2 })}>
          <Checkbox
            name="recurring"
            label={LABELS.RECURRING + "?"}
            checked={form.recurring}
            onChange={handleChange}
            data-testid="recurring-checkbox"
            variant="default"
            size="sm"
          />
          {form.recurring && (
            <Badge variant="primary">
              ✓
            </Badge>
          )}
        </div>

        <FieldWrapper fullWidth>
          <Input
            name="description"
            type="text"
            label={LABELS.DESCRIPTION}
            value={form.description || ""}
            onChange={handleChange}
            aria-label={LABELS.DESCRIPTION}
            placeholder={PLACEHOLDERS.DESCRIPTION}
            data-testid="description-input"
            variant="default"
            size="sm"
          />
        </FieldWrapper>
      </FieldGrid>
    </FormLayout>
  );
};

// React.memo wrapper pentru optimizarea re-renderurilor - Pattern validat din proiect
const TransactionForm = React.memo(TransactionFormComponent);

export default TransactionForm;

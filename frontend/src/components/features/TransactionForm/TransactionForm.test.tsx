import React from 'react';
import { render, screen, fireEvent, within, waitFor } from '@testing-library/react';
import TransactionForm from './';
import { TransactionFormData, categorii } from './TransactionForm';
import { TransactionType, CategoryType, FrequencyType } from '../../../constants/enums';
import { MOCK_OPTIONS, MOCK_LABELS, MOCK_BUTTONS, MOCK_PLACEHOLDERS, MOCK_ERROR_MESSAGES } from '../../../test/mockData';
import { MESAJE } from '../../../constants/messages';

// Helper pentru a selecta opțiuni în dropdownuri
function selectOption(label: string, value: string) {
  const select = screen.getByLabelText(label, { exact: true });
  fireEvent.change(select, { target: { value } });
}

// Helper pentru a extrage TOATE subcategoriile dintr-o definiție (string[] sau object[] cu optgroup)
function getAllSubcategories(categoryDefinition: any[]): string[] {
  let subcategories: string[] = [];
  categoryDefinition.forEach(item => {
    if (typeof item === 'string') {
      subcategories.push(item);
    } else if (typeof item === 'object' && item.options && Array.isArray(item.options)) {
      subcategories = subcategories.concat(item.options);
    }
  });
  return subcategories;
}

const defaultForm: TransactionFormData = {
  type: '',
  amount: '',
  category: '',
  subcategory: '',
  date: '',
  recurring: false,
  frequency: '',
};

describe('TransactionForm', () => {
  it('afișează toate câmpurile obligatorii', () => {
    render(<TransactionForm form={defaultForm} formError="" formSuccess="" onChange={() => {}} onSubmit={() => {}} />);
    const form = screen.getByRole('form');
    expect(within(form).getByLabelText(MOCK_LABELS.TYPE)).toBeInTheDocument();
    expect(within(form).getByLabelText(MOCK_LABELS.AMOUNT)).toBeInTheDocument();
    expect(within(form).getByLabelText(MOCK_LABELS.CATEGORY)).toBeInTheDocument();
    expect(within(form).getByLabelText(MOCK_LABELS.SUBCATEGORY)).toBeInTheDocument();
    expect(within(form).getByLabelText(MOCK_LABELS.DATE)).toBeInTheDocument();
    expect(within(form).getByLabelText(MOCK_LABELS.RECURRING)).toBeInTheDocument();
    expect(within(form).getByLabelText(MOCK_LABELS.FREQUENCY)).toBeInTheDocument();
  });

  it('nu afișează opțiunea Transfer la Tip', () => {
    render(<TransactionForm form={defaultForm} formError="" formSuccess="" onChange={() => {}} onSubmit={() => {}} />);
    const tipSelect = screen.getByLabelText(MOCK_LABELS.TYPE);
    expect(within(tipSelect).queryByText('Transfer')).not.toBeInTheDocument();
  });

  it('afișează doar placeholderul "Alege" la Tip când nu este selectat nimic', () => {
    // Wrapper cu stare locală pentru simularea schimbării de tip
    function Wrapper() {
      const [form, setForm] = React.useState(defaultForm);
      return (
        <TransactionForm
          form={form}
          formError=""
          formSuccess=""
          onChange={e => setForm(f => ({ ...f, [e.target.name]: e.target.value }))}
          onSubmit={() => {}}
        />
      );
    }
    render(<Wrapper />);
    const tipSelect = screen.getByLabelText(MOCK_LABELS.TYPE);
    // Placeholderul există doar când value este gol
    expect(tipSelect).toHaveValue('');
    expect(within(tipSelect).getByText(MOCK_PLACEHOLDERS.SELECT)).toBeInTheDocument();
    // După selectare, placeholderul nu mai există ca opțiune
    fireEvent.change(tipSelect, { target: { value: TransactionType.INCOME } });
    expect(tipSelect).toHaveValue(TransactionType.INCOME);
    expect(within(tipSelect).queryByText(MOCK_PLACEHOLDERS.SELECT)).not.toBeInTheDocument();
  });

  it('nu permite alegerea categoriei dacă tipul nu este selectat', () => {
    render(<TransactionForm form={defaultForm} formError="" formSuccess="" onChange={() => {}} onSubmit={() => {}} />);
    const categorieSelect = screen.getByLabelText(MOCK_LABELS.CATEGORY) as HTMLSelectElement;
    expect(categorieSelect.disabled).toBe(true);
  });

  it('afișează doar VENITURI la categorie dacă tipul este Venit', () => {
    const formVenit = { ...defaultForm, type: TransactionType.INCOME };
    render(<TransactionForm form={formVenit} formError="" formSuccess="" onChange={() => {}} onSubmit={() => {}} />);
    const categorieSelect = screen.getByLabelText(MOCK_LABELS.CATEGORY);
    expect(within(categorieSelect).getByText(CategoryType.INCOME)).toBeInTheDocument();
    expect(within(categorieSelect).queryByText(CategoryType.EXPENSE)).not.toBeInTheDocument();
    expect(within(categorieSelect).queryByText(CategoryType.SAVING)).not.toBeInTheDocument();
  });

  it('afișează doar CHELTUIELI la categorie dacă tipul este Cheltuială', () => {
    const formChelt = { ...defaultForm, type: TransactionType.EXPENSE };
    render(<TransactionForm form={formChelt} formError="" formSuccess="" onChange={() => {}} onSubmit={() => {}} />);
    const categorieSelect = screen.getByLabelText(MOCK_LABELS.CATEGORY);
    expect(within(categorieSelect).getByText(CategoryType.EXPENSE)).toBeInTheDocument();
    expect(within(categorieSelect).queryByText(CategoryType.INCOME)).not.toBeInTheDocument();
    expect(within(categorieSelect).queryByText(CategoryType.SAVING)).not.toBeInTheDocument();
  });

  it('afișează doar ECONOMII la categorie dacă tipul este Economisire', () => {
    const formEcon = { ...defaultForm, type: TransactionType.SAVING };
    render(<TransactionForm form={formEcon} formError="" formSuccess="" onChange={() => {}} onSubmit={() => {}} />);
    const categorieSelect = screen.getByLabelText(MOCK_LABELS.CATEGORY);
    expect(within(categorieSelect).getByText(CategoryType.SAVING)).toBeInTheDocument();
    expect(within(categorieSelect).queryByText(CategoryType.INCOME)).not.toBeInTheDocument();
    expect(within(categorieSelect).queryByText(CategoryType.EXPENSE)).not.toBeInTheDocument();
  });

  it('nu permite alegerea subcategoriei dacă nu este selectată categoria', () => {
    const formVenit = { ...defaultForm, type: TransactionType.INCOME };
    render(<TransactionForm form={formVenit} formError="" formSuccess="" onChange={() => {}} onSubmit={() => {}} />);
    const subcatSelect = screen.getByLabelText(MOCK_LABELS.SUBCATEGORY) as HTMLSelectElement;
    expect(subcatSelect.disabled).toBe(true);
  });

  it('afișează TOATE subcategoriile corecte pentru VENITURI', () => {
    const formVenit = { ...defaultForm, type: TransactionType.INCOME, category: CategoryType.INCOME };
    render(<TransactionForm form={formVenit} formError="" formSuccess="" onChange={() => {}} onSubmit={() => {}} />);

    const subcatSelect = screen.getByLabelText(MOCK_LABELS.SUBCATEGORY);
    expect(subcatSelect).toBeEnabled(); // Asigurăm că e activat

    const expectedSubcategories = getAllSubcategories(categorii[CategoryType.INCOME]);
    const renderedOptions = Array.from(subcatSelect.querySelectorAll('option'))
                                 .map(opt => opt.value)
                                 .filter(val => val !== ''); // Excludem placeholderul 'Alege'

    // Verificăm numărul total de opțiuni
    expect(renderedOptions.length).toBe(expectedSubcategories.length);

    // Verificăm că fiecare subcategorie așteptată există
    expectedSubcategories.forEach(subcat => {
      // Folosim getByRole pentru a găsi opțiunea după textul vizibil
      // Este mai robust decât a căuta valoarea direct în HTML
      expect(within(subcatSelect).getByRole('option', { name: subcat })).toBeInTheDocument();
    });
  });

  it('afișează TOATE subcategoriile corecte pentru ECONOMII', () => {
    const formEcon = { ...defaultForm, type: TransactionType.SAVING, category: CategoryType.SAVING };
    render(<TransactionForm form={formEcon} formError="" formSuccess="" onChange={() => {}} onSubmit={() => {}} />);
    const subcatSelect = screen.getByLabelText(MOCK_LABELS.SUBCATEGORY);
    expect(subcatSelect).toBeEnabled();

    const expectedSubcategories = getAllSubcategories(categorii[CategoryType.SAVING]);
    const renderedOptions = Array.from(subcatSelect.querySelectorAll('option'))
                                 .map(opt => opt.value)
                                 .filter(val => val !== '');

    expect(renderedOptions.length).toBe(expectedSubcategories.length);
    expectedSubcategories.forEach(subcat => {
      expect(within(subcatSelect).getByRole('option', { name: subcat })).toBeInTheDocument();
    });
  });

  it('afișează TOATE subcategoriile corecte pentru CHELTUIELI', () => {
    const formChelt = { ...defaultForm, type: TransactionType.EXPENSE, category: CategoryType.EXPENSE };
    render(<TransactionForm form={formChelt} formError="" formSuccess="" onChange={() => {}} onSubmit={() => {}} />);
    const subcatSelect = screen.getByLabelText(MOCK_LABELS.SUBCATEGORY);
    expect(subcatSelect).toBeEnabled();

    const expectedSubcategories = getAllSubcategories(categorii[CategoryType.EXPENSE]);
    const renderedOptions = Array.from(subcatSelect.querySelectorAll('option'))
                                 .map(opt => opt.value)
                                 .filter(val => val !== '');

    expect(renderedOptions.length).toBe(expectedSubcategories.length);
    expectedSubcategories.forEach(subcat => {
      expect(within(subcatSelect).getByRole('option', { name: subcat })).toBeInTheDocument();
    });
  });

  it('nu permite selectarea unei categorii incompatibile cu tipul', () => {
    const formVenit = { ...defaultForm, type: TransactionType.INCOME, category: CategoryType.EXPENSE };
    render(<TransactionForm form={formVenit} formError="" formSuccess="" onChange={() => {}} onSubmit={() => {}} />);
    const categorieSelect = screen.getByLabelText(MOCK_LABELS.CATEGORY) as HTMLSelectElement;
    expect(categorieSelect.value).toBe(''); // valoarea se resetează
  });

  it('nu permite selectarea unei subcategorii incompatibile cu categoria', () => {
    const formVenit = { ...defaultForm, type: TransactionType.INCOME, category: CategoryType.INCOME, subcategory: 'Îmbrăcăminte, încălțăminte și accesorii' };
    render(<TransactionForm form={formVenit} formError="" formSuccess="" onChange={() => {}} onSubmit={() => {}} />);
    const subcatSelect = screen.getByLabelText(MOCK_LABELS.SUBCATEGORY) as HTMLSelectElement;
    expect(subcatSelect.value).toBe(''); // valoarea se resetează
  });

  it('shows error and success messages', () => {
    render(
      <TransactionForm
        form={defaultForm}
        formError={MOCK_ERROR_MESSAGES.TEST_ERROR}
        formSuccess={MOCK_ERROR_MESSAGES.TEST_SUCCESS}
        onChange={() => {}}
        onSubmit={() => {}}
      />
    );
    expect(screen.getByText(MOCK_ERROR_MESSAGES.TEST_ERROR)).toBeInTheDocument();
    expect(screen.getByText(MOCK_ERROR_MESSAGES.TEST_SUCCESS)).toBeInTheDocument();
  });

  // --- Tests for Initial Values from Props --- 

  const initialForm: TransactionFormData = {
    type: TransactionType.INCOME,
    amount: '100',
    category: CategoryType.INCOME, // trebuie să corespundă exact valorii din dropdown
    subcategory: 'Salarii', // trebuie să corespundă exact valorii din dropdown
    date: '2025-01-15',
    recurring: true,
    frequency: FrequencyType.MONTHLY,
  };

  it('renders initial type value from props', () => {
    render(<TransactionForm form={initialForm} formError="" formSuccess="" onChange={() => {}} onSubmit={() => {}} />);
    const form = screen.getByRole('form');
    expect(within(form).getByLabelText(MOCK_LABELS.TYPE)).toHaveValue(TransactionType.INCOME);
  });

  it('redă valorile inițiale pentru categorie și subcategorie din props', () => {
    render(<TransactionForm form={initialForm} formError="" formSuccess="" onChange={() => {}} onSubmit={() => {}} />);
    const form = screen.getByRole('form');
    expect(within(form).getByLabelText(MOCK_LABELS.CATEGORY)).toHaveValue(CategoryType.INCOME);
    expect(within(form).getByLabelText(MOCK_LABELS.SUBCATEGORY)).toHaveValue('Salarii');
  });

  it('renders initial amount value from props', async () => {
    render(<TransactionForm form={initialForm} formError="" formSuccess="" onChange={() => {}} onSubmit={() => {}} />);
    const form = screen.getByRole('form');
    await waitFor(() => {
      const amountInput = within(form).getByLabelText(MOCK_LABELS.AMOUNT) as HTMLInputElement;
      expect(amountInput.value).toBe('100');
    });
  });

  it('renders initial date value from props', async () => {
    render(<TransactionForm form={initialForm} formError="" formSuccess="" onChange={() => {}} onSubmit={() => {}} />);
    const form = screen.getByRole('form');
    await waitFor(() => {
      const dateInput = within(form).getByLabelText(MOCK_LABELS.DATE) as HTMLInputElement;
      expect(dateInput.value === '2025-01-15').toBeTruthy();
    });
  });

  it('renders initial recurring state from props', async () => {
    render(<TransactionForm form={initialForm} formError="" formSuccess="" onChange={() => {}} onSubmit={() => {}} />);
    const form = screen.getByRole('form');
    await waitFor(() => {
      expect(within(form).getByLabelText(/Recurent/i)).toBeChecked();
    });
  });

  it('renders initial frequency value from props when recurring is true', async () => {
    render(<TransactionForm form={initialForm} formError="" formSuccess="" onChange={() => {}} onSubmit={() => {}} />);
    const form = screen.getByRole('form');
    await waitFor(() => {
      expect(within(form).getByLabelText(/Frecvență/i)).toHaveValue(FrequencyType.MONTHLY);
    });
  });

  // --- Test for Conditional Rendering --- 
  it('shows frequency field only when recurring is checked', () => {
    const { rerender } = render(<TransactionForm form={defaultForm} formError="" formSuccess="" onChange={() => {}} onSubmit={() => {}} />);
    const form = screen.getByRole('form');
    const frequencyInput = within(form).getByLabelText(/Frecvență/i);
    const recurringCheckbox = within(form).getByLabelText(/Recurent/i);

    // Initially, frequency should be disabled or hidden (assuming disabled based on likely implementation)
    // Let's check for disabled state
    expect(frequencyInput).toBeDisabled();

    // Simulate checking the recurring box by re-rendering with recurring: true
    const recurringForm = { ...defaultForm, recurring: true };
    rerender(<TransactionForm form={recurringForm} formError="" formSuccess="" onChange={() => {}} onSubmit={() => {}} />);

    // Now frequency should be enabled
    // Note: We query again as the element reference might change on rerender
    expect(within(form).getByLabelText(/Frecvență/i)).toBeEnabled();

    // Simulate unchecking the recurring box
    rerender(<TransactionForm form={defaultForm} formError="" formSuccess="" onChange={() => {}} onSubmit={() => {}} />);

    // Frequency should be disabled again
    expect(within(form).getByLabelText(/Frecvență/i)).toBeDisabled();
  });

  it('calls onChange and onSubmit handlers', async () => {
    const handleChange = jest.fn();
    const handleSubmit = jest.fn((e) => e.preventDefault());
    render(
      <TransactionForm
        form={defaultForm}
        formError=""
        formSuccess=""
        onChange={handleChange}
        onSubmit={handleSubmit}
      />
    );
    const form = screen.getByRole('form');
    fireEvent.change(within(form).getByLabelText(MOCK_LABELS.TYPE), { target: { value: TransactionType.INCOME } });
    expect(handleChange).toHaveBeenCalled();
    fireEvent.submit(form);
    expect(handleSubmit).toHaveBeenCalled();
  });
});

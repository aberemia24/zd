import React from 'react';
import { render, screen, fireEvent, within, waitFor } from '@testing-library/react';
import { act } from 'react';

// Import pentru date de test și tipuri
import { MOCK_OPTIONS, MOCK_LABELS, MOCK_BUTTONS, MOCK_PLACEHOLDERS, MOCK_ERROR_MESSAGES } from '../../../test/mockData';
import { Transaction, TransactionQueryParams, TransactionFormWithNumberAmount } from '../../../types/transaction';
import { PaginatedResponse } from '../../../services/transactionApiClient';

// Import-uri din @shared-constants conform regulilor globale (sursa unică de adevăr)
import { TransactionType, CategoryType, FrequencyType } from '@shared-constants';
import { MESAJE } from '@shared-constants';
import { FORM_DEFAULTS } from '@shared-constants';

// Mock-uri doar pentru servicii și store-uri
jest.mock('../../../stores/transactionFormStore');
jest.mock('../../../stores/transactionStore');

// Import pentru componenta testată și dependințele sale
import TransactionForm from './';
import { TransactionFormData } from './TransactionForm';
import { CATEGORIES } from '@shared-constants';

// Import-uri pentru servicii și store-uri care au fost mock-uite
import { useTransactionFormStore } from '../../../stores/transactionFormStore';
import { useTransactionStore } from '../../../stores/transactionStore';

// Tipizare pentru mock-uri
const mockUseTransactionFormStore = useTransactionFormStore as jest.MockedFunction<typeof useTransactionFormStore>;
const mockUseTransactionStore = useTransactionStore as jest.MockedFunction<typeof useTransactionStore>;


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

// Mock pentru funcțiile și starea store-ului
const mockSetField = jest.fn();
const mockResetForm = jest.fn();
const mockHandleSubmit = jest.fn();
const mockRefreshTransactions = jest.fn();

// Definim tipul pentru mock-ul nostru de store, conform arhitecturii aplicației și principiilor din memoria [pattern]
// Adaptăm interfața pentru a suporta atât proprietățile formularului cât și proprietățile store-ului
type MockFormState = {
  // Proprietățile formularului pot fi specificate direct pentru simplitate
  form?: TransactionFormData;
  type?: TransactionType | string; 
  amount?: string;
  category?: CategoryType | string;
  subcategory?: string;
  date?: string;
  recurring?: boolean;
  frequency?: string | FrequencyType;
  
  // Proprietăți de stare
  error?: string;
  success?: string;
  loading?: boolean;
  
  // Metode
  setForm?: jest.Mock;
  setField?: jest.Mock;
  setError?: jest.Mock;
  setSuccess?: jest.Mock;
  setLoading?: jest.Mock;
  resetForm?: jest.Mock;
  validateForm?: jest.Mock;
  handleSubmit?: jest.Mock;
  handleChange?: jest.Mock;
  setSubmitHandler?: jest.Mock;
  
  // Proprietăți adăugate pentru a rezolva eroarea de bucle infinite
  setTransactionService?: jest.Mock;
  setRefreshCallback?: jest.Mock;
  
  // Selectors
  getForm?: jest.Mock;
  getError?: jest.Mock;
  getSuccess?: jest.Mock;
  getLoading?: jest.Mock;
};

// Helper pentru a crea un mock complet pentru TransactionFormStoreState
// Pentru a evita duplicarea codului și asigura compatibilitatea cu orice modificări viitoare
// Helper pentru crearea unui mock de store Zustand complet și flexibil
function createMockTransactionFormState(customState: Partial<MockFormState> = {}) {
  // Extragem proprietățile formularului direct din customState și din form dacă există
  const { 
    type, amount, category, subcategory, date, recurring, frequency, form: customForm, 
    ...restCustomState 
  } = customState;
  
  // Preiau valori directe din customState pentru formularul, prioritizându-le față de cele din customForm
  const formData = {
    ...(customForm || {}),
    ...(type !== undefined && { type }),
    ...(amount !== undefined && { amount }),
    ...(category !== undefined && { category }),
    ...(subcategory !== undefined && { subcategory }),
    ...(date !== undefined && { date }),
    ...(recurring !== undefined && { recurring }),
    ...(frequency !== undefined && { frequency }),
  };
  
  // Creăm formular final combinând default cu cele specificate
  const finalForm = { ...defaultForm, ...formData };
  
  // Creăm state-ul standard cu toate proprietățile necesare
  const baseState = {
    form: finalForm,
    error: '',
    success: '',
    loading: false,
    setForm: jest.fn(),
    setField: mockSetField,
    setError: jest.fn(),
    setSuccess: jest.fn(),
    setLoading: jest.fn(),
    resetForm: mockResetForm,
    validateForm: jest.fn().mockReturnValue(true),
    handleSubmit: mockHandleSubmit,
    handleChange: jest.fn(),
    setSubmitHandler: jest.fn(),
    // Proprietățile adăugate pentru a rezolva eroarea de bucle infinite
    setTransactionService: jest.fn(),
    setRefreshCallback: jest.fn(),
    // Getteri impliciți
    getForm: jest.fn().mockImplementation(() => finalForm),
    getError: jest.fn().mockReturnValue(''),
    getSuccess: jest.fn().mockReturnValue(''),
    getLoading: jest.fn().mockReturnValue(false)
  };
  
  // Suprascrie cu proprietățile personalizate rămase
  return { ...baseState, ...restCustomState };
}

// Setup pentru mock-uri înainte de fiecare test
beforeEach(() => {
  jest.clearAllMocks();
  
  // Mock complet pentru useTransactionFormStore folosind helper-ul
  // Implementare standard pentru toate testele
  mockUseTransactionFormStore.mockImplementation((selector) => {
    // Folosim helper-ul care conține TOATE proprietățile necesare
    const state = createMockTransactionFormState();
    
    // Dacă este apelat cu un selector, returnăm rezultatul selectorului
    if (typeof selector === 'function') {
      return selector(state);
    }
    
    // Altfel, returnăm întregul state
    return state;
  });
  
  // Mock complet pentru useTransactionStore
  mockUseTransactionStore.mockImplementation((selector) => {
    // Creăm un serviciu mock complet
    const mockService = {
  saveTransaction: jest.fn(),
  getFilteredTransactions: jest.fn(),
  removeTransaction: jest.fn(),
  getTransactionById: jest.fn(),
  getCacheStats: jest.fn()
};

const state = {
      // Date
      transactions: [],
      total: 0,
      currentQueryParams: {
        limit: 10,
        offset: 0,
        sort: 'date'
      },
      _lastQueryParams: undefined,
      
      // Stare UI
      loading: false,
      error: null,
      
      // Servicii și dependențe
      transactionService: mockService,
      
      // Acțiuni - setters
      setTransactions: jest.fn(),
      setTotal: jest.fn(),
      setLoading: jest.fn(),
      setError: jest.fn(),
      setQueryParams: jest.fn(),
      setTransactionService: jest.fn(),
      
      // Acțiuni - operațiuni asincrone
      fetchTransactions: jest.fn(),
      refresh: mockRefreshTransactions,
      saveTransaction: jest.fn(),
      removeTransaction: jest.fn(),
      
      // Acțiuni - utilități
      reset: jest.fn()
    };
    
    if (typeof selector === 'function') {
      return selector(state);
    }
    
    return state;
  });
});

describe('TransactionForm', () => {
  it('afișează toate câmpurile obligatorii', () => {
    render(<TransactionForm />);
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
    render(<TransactionForm />);
    const tipSelect = screen.getByLabelText(MOCK_LABELS.TYPE);
    expect(within(tipSelect).queryByText('Transfer')).not.toBeInTheDocument();
  });

  it('afișează doar placeholderul "Alege" la Tip când nu este selectat nimic', async () => {
    // Nu mai trebuie să configurăm mock-ul specific pentru acest test
    // deoarece avem deja configurarea globală în beforeEach

    render(<TransactionForm />);
    const tipSelect = screen.getByLabelText(MOCK_LABELS.TYPE);
    
    // Inițial, există doar opțiunea placeholder și opțiunile reale
    expect(within(tipSelect).getByText(MOCK_PLACEHOLDERS.SELECT)).toBeInTheDocument();
    
    // Simulăm schimbarea tipului
    await act(async () => {
      fireEvent.change(tipSelect, { target: { value: TransactionType.INCOME, name: 'type' } });
    });
    
    // Verificăm că setField a fost apelat cu valorile corecte
    expect(mockSetField).toHaveBeenCalledWith('type', TransactionType.INCOME);
  });

  it('nu permite alegerea categoriei dacă tipul nu este selectat', () => {
    // Configurăm mock-ul pentru a returna un formular fără tip selectat
    mockUseTransactionFormStore.mockImplementation((selector) => {
      // Folosim helper-ul care include toate proprietățile (inclusiv cele noi)
      const state = createMockTransactionFormState({
        // Proprietățile formularului direct
        type: '',
        // Putem suprascrie și alte proprietăți dacă e nevoie
        getError: jest.fn().mockReturnValue(''),
        getSuccess: jest.fn().mockReturnValue(''),
        getLoading: jest.fn().mockReturnValue(false)
      });
      
      if (typeof selector === 'function') {
        return selector(state);
      }
      
      return state;
    });
    
    render(<TransactionForm />);
    
    // Categoria trebuie să fie dezactivată dacă tipul nu este selectat
    const categorySelect = screen.getByLabelText(MOCK_LABELS.CATEGORY);
    expect(categorySelect).toBeDisabled();
  });

  it('afișează doar VENITURI la categorie dacă tipul este Venit', () => {
    // Configurăm mock-ul pentru a returna un formular cu tip Venit
    mockUseTransactionFormStore.mockImplementation((selector) => {
      // Folosim helper-ul care include toate proprietățile (inclusiv cele noi)
      const state = createMockTransactionFormState({
        // Proprietățile formularului direct
        type: TransactionType.INCOME,
        // Putem suprascrie și alte proprietăți dacă e nevoie
        getError: jest.fn().mockReturnValue(''),
        getSuccess: jest.fn().mockReturnValue(''),
        getLoading: jest.fn().mockReturnValue(false)
      });
      
      if (typeof selector === 'function') {
        return selector(state);
      }
      
      return state;
    });
    
    render(<TransactionForm />);
    const categorieSelect = screen.getByLabelText(MOCK_LABELS.CATEGORY);
    expect(within(categorieSelect).getByText(CategoryType.INCOME)).toBeInTheDocument();
    expect(within(categorieSelect).queryByText(CategoryType.EXPENSE)).not.toBeInTheDocument();
    expect(within(categorieSelect).queryByText(CategoryType.SAVING)).not.toBeInTheDocument();
  });

  it('afișează doar CHELTUIELI la categorie dacă tipul este Cheltuială', () => {
    // Configurăm mock-ul pentru a returna un formular cu tip Cheltuială
    mockUseTransactionFormStore.mockImplementation((selector) => {
      // Folosim helper-ul care include toate proprietățile (inclusiv cele noi)
      const state = createMockTransactionFormState({
        // Proprietățile formularului direct
        type: TransactionType.EXPENSE,
        // Putem suprascrie și alte proprietăți dacă e nevoie
        getError: jest.fn().mockReturnValue(''),
        getSuccess: jest.fn().mockReturnValue(''),
        getLoading: jest.fn().mockReturnValue(false)
      });
      
      if (typeof selector === 'function') {
        return selector(state);
      }
      
      return state;
    });
    
    render(<TransactionForm />);
    const categorieSelect = screen.getByLabelText(MOCK_LABELS.CATEGORY);
    expect(within(categorieSelect).getByText(CategoryType.EXPENSE)).toBeInTheDocument();
    expect(within(categorieSelect).queryByText(CategoryType.INCOME)).not.toBeInTheDocument();
    expect(within(categorieSelect).queryByText(CategoryType.SAVING)).not.toBeInTheDocument();
  });

  it('afișează doar ECONOMII la categorie dacă tipul este Economisire', () => {
    // Configurăm mock-ul pentru a returna un formular cu tip Economisire
    mockUseTransactionFormStore.mockImplementation((selector) => {
      // Folosim helper-ul care include toate proprietățile (inclusiv cele noi)
      const state = createMockTransactionFormState({
        // Proprietățile formularului direct
        type: TransactionType.SAVING,
        // Putem suprascrie și alte proprietăți dacă e nevoie
        getError: jest.fn().mockReturnValue(''),
        getSuccess: jest.fn().mockReturnValue(''),
        getLoading: jest.fn().mockReturnValue(false)
      });
      
      if (typeof selector === 'function') {
        return selector(state);
      }
      
      return state;
    });
    
    render(<TransactionForm />);
    const categorieSelect = screen.getByLabelText(MOCK_LABELS.CATEGORY);
    expect(within(categorieSelect).getByText(CategoryType.SAVING)).toBeInTheDocument();
    expect(within(categorieSelect).queryByText(CategoryType.INCOME)).not.toBeInTheDocument();
    expect(within(categorieSelect).queryByText(CategoryType.EXPENSE)).not.toBeInTheDocument();
  });

  it('nu permite alegerea subcategoriei dacă categoria nu este selectată', () => {
    // Configurăm mock-ul pentru a returna un formular cu tip selectat dar fără categorie
    mockUseTransactionFormStore.mockImplementation((selector) => {
      // Folosim helper-ul care include toate proprietățile (inclusiv cele noi)
      const state = createMockTransactionFormState({
        // Proprietățile formularului direct
        type: TransactionType.INCOME,
        // Putem suprascrie și alte proprietăți dacă e nevoie
        getError: jest.fn().mockReturnValue(''),
        getSuccess: jest.fn().mockReturnValue(''),
        getLoading: jest.fn().mockReturnValue(false)
      });
      
      if (typeof selector === 'function') {
        return selector(state);
      }
      
      return state;
    });
    
    render(<TransactionForm />);
    
    // Subcategoria trebuie să fie dezactivată dacă categoria nu este selectată
    const subcategorySelect = screen.getByLabelText(MOCK_LABELS.SUBCATEGORY);
    expect(subcategorySelect).toBeDisabled();
  });

  it('afișează TOATE subcategoriile corecte pentru VENITURI', async () => {
    // Configurăm mock-ul pentru a returna un formular cu tip și categorie pentru venituri
    mockUseTransactionFormStore.mockImplementation((selector) => {
      // Folosim helper-ul care include toate proprietățile (inclusiv cele noi)
      const state = createMockTransactionFormState({
        // Proprietățile formularului direct
        type: TransactionType.INCOME, 
        category: CategoryType.INCOME,
        // Putem suprascrie și alte proprietăți dacă e nevoie
        getError: jest.fn().mockReturnValue(''),
        getSuccess: jest.fn().mockReturnValue(''),
        getLoading: jest.fn().mockReturnValue(false)
      });
      
      if (typeof selector === 'function') {
        return selector(state);
      }
      
      return state;
    });
    
    render(<TransactionForm />);

    // Folosim waitFor pentru a aștepta ca elementele să fie disponibile
    await waitFor(() => {
      const subcatSelect = screen.getByLabelText(MOCK_LABELS.SUBCATEGORY);
      expect(subcatSelect).toBeEnabled(); // Asigurăm că e activat
    });
    
    const subcatSelect = screen.getByLabelText(MOCK_LABELS.SUBCATEGORY);
    const expectedSubcategories = getAllSubcategories(Object.values(CATEGORIES.VENITURI).flat() as string[]);
    const renderedOptions = Array.from(subcatSelect.querySelectorAll('option'))
                                 .map(opt => opt.value)
                                 .filter(val => val !== ''); // Excludem placeholderul 'Alege'

    // Verificăm numărul total de opțiuni
    expect(renderedOptions.length).toBe(expectedSubcategories.length);

    // Verificăm că fiecare subcategorie așteptată există
    for (const subcat of expectedSubcategories) {
      // Folosim getByRole pentru a găsi opțiunea după textul vizibil
      // Este mai robust decât a căuta valoarea direct în HTML
      expect(within(subcatSelect).getByRole('option', { name: subcat })).toBeInTheDocument();
    }
  });

  it('afișează TOATE subcategoriile corecte pentru ECONOMII', async () => {
    // Configurăm mock-ul pentru a returna un formular cu tip și categorie pentru economii
    mockUseTransactionFormStore.mockImplementation((selector) => {
      // Folosim helper-ul care include toate proprietățile (inclusiv cele noi)
      const state = createMockTransactionFormState({
        // Proprietățile formularului direct
        type: TransactionType.SAVING, 
        category: CategoryType.SAVING,
        // Putem suprascrie și alte proprietăți dacă e nevoie
        getError: jest.fn().mockReturnValue(''),
        getSuccess: jest.fn().mockReturnValue(''),
        getLoading: jest.fn().mockReturnValue(false)
      });
      
      if (typeof selector === 'function') {
        return selector(state);
      }
      
      return state;
    });
    
    render(<TransactionForm />);

    // Folosim waitFor pentru a aștepta ca elementele să fie disponibile
    await waitFor(() => {
      const subcatSelect = screen.getByLabelText(MOCK_LABELS.SUBCATEGORY);
      expect(subcatSelect).toBeEnabled(); // Asigurăm că e activat
    });
    
    const subcatSelect = screen.getByLabelText(MOCK_LABELS.SUBCATEGORY);
    const expectedSubcategories = getAllSubcategories(Object.values(CATEGORIES.ECONOMII).flat() as string[]);
    const renderedOptions = Array.from(subcatSelect.querySelectorAll('option'))
                                 .map(opt => opt.value)
                                 .filter(val => val !== '');

    expect(renderedOptions.length).toBe(expectedSubcategories.length);
    for (const subcat of expectedSubcategories) {
      expect(within(subcatSelect).getByRole('option', { name: subcat })).toBeInTheDocument();
    }
  });

  it('afișează TOATE subcategoriile corecte pentru CHELTUIELI', async () => {
    // Configurăm mock-ul pentru a returna un formular cu tip și categorie pentru cheltuieli
    mockUseTransactionFormStore.mockImplementation((selector) => {
      // Folosim helper-ul care include toate proprietățile (inclusiv cele noi)
      const state = createMockTransactionFormState({
        // Proprietățile formularului direct
        type: TransactionType.EXPENSE, 
        category: CategoryType.EXPENSE,
        // Putem suprascrie și alte proprietăți dacă e nevoie
        getError: jest.fn().mockReturnValue(''),
        getSuccess: jest.fn().mockReturnValue(''),
        getLoading: jest.fn().mockReturnValue(false)
      });
      
      if (typeof selector === 'function') {
        return selector(state);
      }
      
      return state;
    });
    
    render(<TransactionForm />);

    // Folosim waitFor pentru a aștepta ca elementele să fie disponibile
    await waitFor(() => {
      const subcatSelect = screen.getByLabelText(MOCK_LABELS.SUBCATEGORY);
      expect(subcatSelect).toBeEnabled(); // Asigurăm că e activat
    });
    
    const subcatSelect = screen.getByLabelText(MOCK_LABELS.SUBCATEGORY);
    const expectedSubcategories = getAllSubcategories(
  Object.values(CATEGORIES)
    .slice(2) // presupunem că primele două sunt VENITURI și ECONOMII
    .flatMap((cat: any) => Object.values(cat).flat())
);
    const renderedOptions = Array.from(subcatSelect.querySelectorAll('option'))
                                 .map(opt => opt.value)
                                 .filter(val => val !== '');

    expect(renderedOptions.length).toBe(expectedSubcategories.length);
    for (const subcat of expectedSubcategories) {
      expect(within(subcatSelect).getByRole('option', { name: subcat })).toBeInTheDocument();
    }
  });

  it('nu permite selectarea unei categorii incompatibile cu tipul', async () => {
    // Configurăm mock-ul pentru a returna un formular cu tip și categorie incompatibile
    mockUseTransactionFormStore.mockImplementation((selector) => {
      // Folosim helper-ul care include toate proprietățile (inclusiv cele noi)
      const state = createMockTransactionFormState({
        // Proprietățile formularului direct
        type: TransactionType.INCOME, 
        category: CategoryType.EXPENSE,
        // Putem suprascrie și alte proprietăți dacă e nevoie
        getError: jest.fn().mockReturnValue(''),
        getSuccess: jest.fn().mockReturnValue(''),
        getLoading: jest.fn().mockReturnValue(false)
      });
      
      if (typeof selector === 'function') {
        return selector(state);
      }
      
      return state;
    });
    
    render(<TransactionForm />);
    
    // Folosim waitFor pentru a aștepta ca elementele să fie disponibile
    await waitFor(() => {
      const categorieSelect = screen.getByLabelText(MOCK_LABELS.CATEGORY) as HTMLSelectElement;
      // Valoarea se resetează în component când tipul și categoria sunt incompatibile
      expect(categorieSelect.value).toBe(''); 
    });
  });

  it('nu permite selectarea unei subcategorii incompatibile cu categoria', async () => {
    // Configurăm mock-ul pentru a returna un formular cu categorie și subcategorie incompatibile
    mockUseTransactionFormStore.mockImplementation((selector) => {
      // Folosim helper-ul care include toate proprietățile (inclusiv cele noi)
      const state = createMockTransactionFormState({
        // Proprietățile formularului direct
        type: TransactionType.INCOME, 
        category: CategoryType.INCOME, 
        subcategory: 'Îmbrăcăminte, încălțăminte și accesorii',
        // Putem suprascrie și alte proprietăți dacă e nevoie
        getError: jest.fn().mockReturnValue(''),
        getSuccess: jest.fn().mockReturnValue(''),
        getLoading: jest.fn().mockReturnValue(false)
      });
      
      if (typeof selector === 'function') {
        return selector(state);
      }
      
      return state;
    });
    
    render(<TransactionForm />);
    
    // Folosim waitFor pentru a aștepta ca elementele să fie disponibile
    await waitFor(() => {
      const subcatSelect = screen.getByLabelText(MOCK_LABELS.SUBCATEGORY) as HTMLSelectElement;
      // Valoarea se resetează în component când categoria și subcategoria sunt incompatibile
      expect(subcatSelect.value).toBe(''); 
    });
  });

  it('afișează eroare dacă recurent fără frecvență și nu permite submit', () => {
    // Configurăm mock store cu eroare pentru frecvență recurentă
    mockUseTransactionFormStore.mockImplementation((selector) => {
      // Folosim helper-ul care include toate proprietățile (inclusiv cele noi)
      const state = createMockTransactionFormState({
        recurring: true, 
        frequency: '',
        error: MESAJE.FRECV_RECURENTA,
        success: '',
        loading: false,
        setForm: jest.fn(),
        setField: mockSetField,
        setError: jest.fn(),
        setSuccess: jest.fn(),
        setLoading: jest.fn(),
        resetForm: mockResetForm,
        validateForm: jest.fn(),
        handleSubmit: mockHandleSubmit,
        handleChange: jest.fn(),
        setSubmitHandler: jest.fn(),
        getForm: jest.fn().mockReturnValue({ ...defaultForm, recurring: true }),
        getError: jest.fn().mockReturnValue(MESAJE.FRECV_RECURENTA),
        getSuccess: jest.fn().mockReturnValue(''),
        getLoading: jest.fn().mockReturnValue(false)
      });
      return typeof selector === 'function' ? selector(state) : state;
    });
    // Redăm componenta și verificăm mesajul de eroare folosind testid
    render(<TransactionForm />);
    const errorNode = screen.getByTestId('error-message');
    expect(errorNode).toHaveTextContent(MESAJE.FRECV_RECURENTA);
    // Nu trebuie să apelăm handleSubmit în acest caz
    expect(mockHandleSubmit).not.toHaveBeenCalled();
  });

  it('permite submit când recurent și frecvență setată', async () => {
    render(<TransactionForm />);
    const form = screen.getByRole('form');
    // Bifăm recurent și selectăm frecvența
    fireEvent.click(within(form).getByLabelText(/Recurent/i));
    fireEvent.change(within(form).getByLabelText(/Frecvență/i), { target: { value: FrequencyType.MONTHLY, name: 'frequency' } });
    // Introducem câmpurile obligatorii
    fireEvent.change(within(form).getByLabelText(MOCK_LABELS.TYPE), { target: { value: TransactionType.INCOME, name: 'type' } });
    fireEvent.change(within(form).getByLabelText(MOCK_LABELS.AMOUNT), { target: { value: '123', name: 'amount' } });
    fireEvent.change(within(form).getByLabelText(MOCK_LABELS.DATE), { target: { value: '2025-05-01', name: 'date' } });
    fireEvent.change(within(form).getByLabelText(MOCK_LABELS.CATEGORY), { target: { value: CategoryType.INCOME, name: 'category' } });
    // Atribuim subcategorie validă
    fireEvent.change(within(form).getByLabelText(MOCK_LABELS.SUBCATEGORY), { target: { value: CATEGORIES.VENITURI['Surse de venit'][0], name: 'subcategory' } });
    // Submit
    await act(async () => fireEvent.submit(form));
    // Verificăm că handleSubmit a fost apelat
    expect(mockHandleSubmit).toHaveBeenCalled();
  });

  it('shows error and success messages', () => {
    // Configurăm mock-ul doar pentru mesajele de eroare și succes
    mockUseTransactionFormStore.mockImplementation((selector) => {
      // Mock complet cu toate proprietățile necesare, inclusiv cele noi adăugate
      const baseState = {
        form: defaultForm,
        error: MOCK_ERROR_MESSAGES.TEST_ERROR,
        success: MOCK_ERROR_MESSAGES.TEST_SUCCESS,
        loading: false,
        setForm: jest.fn(),
        setField: mockSetField,
        setError: jest.fn(),
        setSuccess: jest.fn(),
        setLoading: jest.fn(),
        resetForm: mockResetForm,
        validateForm: jest.fn().mockReturnValue(true),
        handleSubmit: mockHandleSubmit,
        handleChange: jest.fn(),
        setSubmitHandler: jest.fn(),
        // Proprietățile noi adăugate pentru a rezolva eroarea de bucle infinite
        setTransactionService: jest.fn(),
        setRefreshCallback: jest.fn(),
        // Selectori
        getForm: jest.fn().mockReturnValue(defaultForm),
        getError: jest.fn().mockReturnValue(MOCK_ERROR_MESSAGES.TEST_ERROR),
        getSuccess: jest.fn().mockReturnValue(MOCK_ERROR_MESSAGES.TEST_SUCCESS),
        getLoading: jest.fn().mockReturnValue(false)
      };
      
      if (typeof selector === 'function') {
        return selector(baseState);
      }
      
      return baseState;
    });
    
    render(<TransactionForm />);
    
    // Putem folosi fie getByTestId, fie getByRole pentru a găsi elementele
    // Testare cu getByTestId (mai specific)
    const errorByTestId = screen.getByTestId('error-message');
    const successByTestId = screen.getByTestId('success-message');
    
    expect(errorByTestId).toHaveTextContent(MOCK_ERROR_MESSAGES.TEST_ERROR);
    expect(successByTestId).toHaveTextContent(MOCK_ERROR_MESSAGES.TEST_SUCCESS);
    
    // Testare cu getByRole (mai accesibil)
    const errorByRole = screen.getByRole('alert', { name: /error message/i });
    const successByRole = screen.getByRole('alert', { name: /success message/i });
    
    expect(errorByRole).toHaveTextContent(MOCK_ERROR_MESSAGES.TEST_ERROR);
    expect(successByRole).toHaveTextContent(MOCK_ERROR_MESSAGES.TEST_SUCCESS);
  });

  // --- Tests for Initial Values from Store --- 

  const initialForm: TransactionFormData = {
    type: TransactionType.INCOME,
    amount: '100',
    category: CategoryType.INCOME, // trebuie să corespundă exact valorii din dropdown
    subcategory: 'Salarii', // trebuie să corespundă exact valorii din dropdown
    date: '2025-01-15',
    recurring: true,
    frequency: FrequencyType.MONTHLY,
  };

  it('afișează valoarea inițială pentru tip din store', async () => {
    // Configurăm mock-ul pentru a returna un formular cu valori inițiale
    mockUseTransactionFormStore.mockImplementation((selector) => {
      // Folosim helper-ul care include toate proprietățile (inclusiv cele noi)
      const state = createMockTransactionFormState({
        ...initialForm,
        getForm: jest.fn().mockReturnValue(initialForm),
        getError: jest.fn().mockReturnValue(''),
        getSuccess: jest.fn().mockReturnValue(''),
        getLoading: jest.fn().mockReturnValue(false)
      });
      
      if (typeof selector === 'function') {
        return selector(state);
      }
      
      return state;
    });
    
    render(<TransactionForm />);
    const form = screen.getByRole('form');
    
    // Folosim waitFor pentru a aștepta ca elementele să fie disponibile
    await waitFor(() => {
      const typeSelect = within(form).getByLabelText(MOCK_LABELS.TYPE);
      // Verificăm că valoarea selectată este 'income' (valoarea reală din enum)
      expect(typeSelect).toHaveValue(TransactionType.INCOME);
    });
  });

  it('redă valorile inițiale pentru categorie și subcategorie din store', async () => {
    // Configurăm mock-ul pentru a returna un formular cu valori inițiale
    mockUseTransactionFormStore.mockImplementation((selector) => {
      // Folosim helper-ul care include toate proprietățile (inclusiv cele noi)
      const state = createMockTransactionFormState({
        ...initialForm,
        getForm: jest.fn().mockReturnValue(initialForm),
        getError: jest.fn().mockReturnValue(''),
        getSuccess: jest.fn().mockReturnValue(''),
        getLoading: jest.fn().mockReturnValue(false)
      });
      
      if (typeof selector === 'function') {
        return selector(state);
      }
      
      return state;
    });
    
    render(<TransactionForm />);
    const form = screen.getByRole('form');
    
    // Folosim waitFor pentru a aștepta ca elementele să fie disponibile
    await waitFor(() => {
      const categorySelect = within(form).getByLabelText(MOCK_LABELS.CATEGORY);
      // Verificăm că valoarea selectată este 'VENITURI' (valoarea reală din enum)
      expect(categorySelect).toHaveValue(CategoryType.INCOME);
      
      const subcategorySelect = within(form).getByLabelText(MOCK_LABELS.SUBCATEGORY);
      // Verificăm că valoarea selectată este 'Salarii'
      expect(subcategorySelect).toHaveValue('Salarii');
    });
  });

  it('afișează valoarea inițială pentru sumă din store', async () => {
    // Configurăm mock-ul pentru a returna un formular cu valori inițiale
    mockUseTransactionFormStore.mockImplementation((selector) => {
      // Folosim helper-ul care include toate proprietățile (inclusiv cele noi)
      const state = createMockTransactionFormState({
        ...initialForm,
        getForm: jest.fn().mockReturnValue(initialForm),
        getError: jest.fn().mockReturnValue(''),
        getSuccess: jest.fn().mockReturnValue(''),
        getLoading: jest.fn().mockReturnValue(false)
      });
      
      if (typeof selector === 'function') {
        return selector(state);
      }
      
      return state;
    });
    
    render(<TransactionForm />);
    const form = screen.getByRole('form');
    
    // Folosim waitFor pentru câmpuri cu timing problematic conform memoriei
    await waitFor(() => {
      const amountInput = within(form).getByLabelText(MOCK_LABELS.AMOUNT) as HTMLInputElement;
      expect(amountInput.value).toBe('100');
    });
  });

  it('afișează valoarea inițială pentru dată din store', async () => {
    // Configurăm mock-ul pentru a returna un formular cu valori inițiale
    mockUseTransactionFormStore.mockImplementation((selector) => {
      // Folosim helper-ul care include toate proprietățile (inclusiv cele noi)
      const state = createMockTransactionFormState({
        ...initialForm,
        getForm: jest.fn().mockReturnValue(initialForm),
        getError: jest.fn().mockReturnValue(''),
        getSuccess: jest.fn().mockReturnValue(''),
        getLoading: jest.fn().mockReturnValue(false)
      });
      
      if (typeof selector === 'function') {
        return selector(state);
      }
      
      return state;
    });
    
    render(<TransactionForm />);
    const form = screen.getByRole('form');
    
    // Folosim waitFor pentru câmpuri cu timing problematic conform memoriei
    await waitFor(() => {
      const dateInput = within(form).getByLabelText(MOCK_LABELS.DATE) as HTMLInputElement;
      expect(dateInput.value === '2025-01-15').toBeTruthy();
    });
  });

  it('afișează starea inițială pentru recurent din store', async () => {
    // Configurăm mock-ul pentru a returna un formular cu valori inițiale
    mockUseTransactionFormStore.mockImplementation((selector) => {
      // Folosim helper-ul care include toate proprietățile (inclusiv cele noi)
      const state = createMockTransactionFormState({
        ...initialForm,
        getForm: jest.fn().mockReturnValue(initialForm),
        getError: jest.fn().mockReturnValue(''),
        getSuccess: jest.fn().mockReturnValue(''),
        getLoading: jest.fn().mockReturnValue(false)
      });
      
      if (typeof selector === 'function') {
        return selector(state);
      }
      
      return state;
    });
    
    render(<TransactionForm />);
    const form = screen.getByRole('form');
    
    // Folosim waitFor pentru câmpuri cu timing problematic conform memoriei
    await waitFor(() => {
      expect(within(form).getByLabelText(/Recurent/i)).toBeChecked();
    });
  });

  it('afișează valoarea inițială pentru frecvență din store când recurent este bifat', async () => {
    // Configurăm mock-ul pentru a returna un formular cu valori inițiale
    mockUseTransactionFormStore.mockImplementation((selector) => {
      // Folosim helper-ul care include toate proprietățile (inclusiv cele noi)
      const state = createMockTransactionFormState({
        ...initialForm,
        getForm: jest.fn().mockReturnValue(initialForm),
        getError: jest.fn().mockReturnValue(''),
        getSuccess: jest.fn().mockReturnValue(''),
        getLoading: jest.fn().mockReturnValue(false)
      });
      
      if (typeof selector === 'function') {
        return selector(state);
      }
      
      return state;
    });
    
    render(<TransactionForm />);
    const form = screen.getByRole('form');
    
    // Folosim waitFor pentru câmpuri cu timing problematic conform memoriei
    await waitFor(() => {
      expect(within(form).getByLabelText(/Frecvență/i)).toHaveValue(FrequencyType.MONTHLY);
    });
  });

  // --- Test for Conditional Rendering --- 
  it('afișează câmpul de frecvență doar când recurent este bifat', async () => {
    // Configurăm mock-ul pentru a returna un formular fără recurent bifat
    mockUseTransactionFormStore.mockImplementation((selector) => {
      // Folosim helper-ul care include toate proprietățile (inclusiv cele noi)
      const state = createMockTransactionFormState();
      
      if (typeof selector === 'function') {
        return selector(state);
      }
      
      return state;
    });
    
    const { rerender } = render(<TransactionForm />);
    const form = screen.getByRole('form');
    
    // Inițial, frecvența ar trebui să fie dezactivată
    await waitFor(() => {
      const frequencyInput = within(form).getByLabelText(/Frecvență/i);
      expect(frequencyInput).toBeDisabled();
    });

    // Simulăm bifarea câmpului recurent prin actualizarea mock-ului
    const recurringForm = { ...defaultForm, recurring: true };
    mockUseTransactionFormStore.mockImplementation((selector) => {
      // Folosim helper-ul care include toate proprietățile (inclusiv cele noi)
      const state = createMockTransactionFormState({
        // Setăm direct câmpul recurring la true
        recurring: true,
        // Getteri personalizați
        getError: jest.fn().mockReturnValue(''),
        getSuccess: jest.fn().mockReturnValue(''),
        getLoading: jest.fn().mockReturnValue(false)
      });
      
      if (typeof selector === 'function') {
        return selector(state);
      }
      
      return state;
    });
    
    // Forțăm rerender-ul componentei
    rerender(<TransactionForm />);

    // Acum frecvența ar trebui să fie activată
    await waitFor(() => {
      const frequencyInput = within(form).getByLabelText(/Frecvență/i);
      expect(frequencyInput).toBeEnabled();
    });

    // Simulăm debifarea câmpului recurent prin actualizarea mock-ului înapói la defaultForm
    mockUseTransactionFormStore.mockImplementation((selector) => {
      // Folosim helper-ul care include toate proprietățile (inclusiv cele noi)
      const state = createMockTransactionFormState();
      
      if (typeof selector === 'function') {
        return selector(state);
      }
      
      return state;
    });
    
    // Forțăm rerender-ul componentei
    rerender(<TransactionForm />);

    // Frecvența ar trebui să fie dezactivată din nou
    await waitFor(() => {
      const frequencyInput = within(form).getByLabelText(/Frecvență/i);
      expect(frequencyInput).toBeDisabled();
    });
  });

  it('calls handleSubmit when form is submitted', async () => {
    render(<TransactionForm />);
    const form = screen.getByRole('form');
    
    await act(async () => {
      fireEvent.submit(form);
    });
    
    expect(mockHandleSubmit).toHaveBeenCalled();
  });
  
  it('calls setField when input values change', async () => {
    render(<TransactionForm />);
    const form = screen.getByRole('form');
    
    await act(async () => {
      fireEvent.change(within(form).getByLabelText(MOCK_LABELS.TYPE), { target: { value: TransactionType.INCOME, name: 'type' } });
    });
    
    expect(mockSetField).toHaveBeenCalledWith('type', TransactionType.INCOME);
    
    await act(async () => {
      fireEvent.change(within(form).getByLabelText(MOCK_LABELS.AMOUNT), { target: { value: '100', name: 'amount' } });
    });
    
    expect(mockSetField).toHaveBeenCalledWith('amount', '100');
  });
});

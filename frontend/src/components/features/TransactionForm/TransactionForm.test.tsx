import React from 'react';
import { render, screen, fireEvent, within, waitFor } from '@testing-library/react';
import TransactionForm from './';
import { TransactionFormData, categorii } from './TransactionForm';
import { TransactionType, CategoryType, FrequencyType } from '../../../constants/enums';
import { MOCK_OPTIONS, MOCK_LABELS, MOCK_BUTTONS, MOCK_PLACEHOLDERS, MOCK_ERROR_MESSAGES } from '../../../test/mockData';
import { MESAJE } from '../../../constants/messages';
import { act } from 'react';
import { FORM_DEFAULTS } from '../../../constants/defaults';
import { Transaction, TransactionQueryParams, TransactionFormWithNumberAmount } from '../../../types/transaction';
import { PaginatedResponse } from '../../../services/transactionApiClient';

// Mock-uri pentru store-urile Zustand
jest.mock('../../../stores/transactionFormStore');
jest.mock('../../../stores/transactionStore');

import { useTransactionFormStore } from '../../../stores/transactionFormStore';
import { useTransactionStore } from '../../../stores/transactionStore';
import { TransactionService } from '../../../services/transactionService';

// Tipizare pentru mock-uri
const mockUseTransactionFormStore = useTransactionFormStore as jest.MockedFunction<typeof useTransactionFormStore>;
const mockUseTransactionStore = useTransactionStore as jest.MockedFunction<typeof useTransactionStore>;

// Clasă mock pentru TransactionService
class MockTransactionService extends TransactionService {
  constructor() {
    super();
  }
  
  // Override pentru metodele publice
  async getFilteredTransactions(): Promise<PaginatedResponse<Transaction>> {
    return { data: [], total: 0, limit: 10, offset: 0 };
  }
  
  async saveTransaction(): Promise<Transaction> {
    return { 
      id: '1', 
      type: TransactionType.INCOME, 
      amount: '100', 
      currency: FORM_DEFAULTS.CURRENCY,
      date: '2023-01-01',
      category: 'Test',
      subcategory: 'Test'
    };
  }
  
  async removeTransaction(): Promise<void> {
    return;
  }
  
  async getTransactionById(): Promise<Transaction> {
    return { 
      id: '1', 
      type: TransactionType.INCOME, 
      amount: '100', 
      currency: FORM_DEFAULTS.CURRENCY,
      date: '2023-01-01',
      category: 'Test',
      subcategory: 'Test'
    };
  }
  
  getCacheStats() {
    return { entries: 0, hits: 0, misses: 0, ratio: 0 };
  }
}

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

// Setup pentru mock-uri înainte de fiecare test
beforeEach(() => {
  jest.clearAllMocks();
  
  // Mock complet pentru useTransactionFormStore
  mockUseTransactionFormStore.mockImplementation((selector) => {
    // Simulăm comportamentul selectorului Zustand cu toate proprietățile necesare
    const state = {
      form: defaultForm,
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
      getForm: jest.fn().mockReturnValue(defaultForm),
      getError: jest.fn().mockReturnValue(''),
      getSuccess: jest.fn().mockReturnValue(''),
      getLoading: jest.fn().mockReturnValue(false)
    };
    
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
    const mockService = new MockTransactionService();
    
    // Spy pe metodele publice pentru a putea verifica apelurile
    jest.spyOn(mockService, 'saveTransaction');
    jest.spyOn(mockService, 'getFilteredTransactions');
    jest.spyOn(mockService, 'removeTransaction');
    
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
      const state = {
        form: { ...defaultForm, type: '' },
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
        getForm: jest.fn().mockReturnValue({ ...defaultForm, type: '' }),
        getError: jest.fn().mockReturnValue(''),
        getSuccess: jest.fn().mockReturnValue(''),
        getLoading: jest.fn().mockReturnValue(false)
      };
      
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
    const formVenit = { ...defaultForm, type: TransactionType.INCOME };
    
    mockUseTransactionFormStore.mockImplementation((selector) => {
      const state = {
        form: formVenit,
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
        getForm: jest.fn().mockReturnValue(formVenit),
        getError: jest.fn().mockReturnValue(''),
        getSuccess: jest.fn().mockReturnValue(''),
        getLoading: jest.fn().mockReturnValue(false)
      };
      
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
    const formChelt = { ...defaultForm, type: TransactionType.EXPENSE };
    
    mockUseTransactionFormStore.mockImplementation((selector) => {
      const state = {
        form: formChelt,
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
        getForm: jest.fn().mockReturnValue(formChelt),
        getError: jest.fn().mockReturnValue(''),
        getSuccess: jest.fn().mockReturnValue(''),
        getLoading: jest.fn().mockReturnValue(false)
      };
      
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
    const formEcon = { ...defaultForm, type: TransactionType.SAVING };
    
    mockUseTransactionFormStore.mockImplementation((selector) => {
      const state = {
        form: formEcon,
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
        getForm: jest.fn().mockReturnValue(formEcon),
        getError: jest.fn().mockReturnValue(''),
        getSuccess: jest.fn().mockReturnValue(''),
        getLoading: jest.fn().mockReturnValue(false)
      };
      
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
    const formCuTip = {
      ...defaultForm,
      type: TransactionType.INCOME
    };
    
    mockUseTransactionFormStore.mockImplementation((selector) => {
      const state = {
        form: formCuTip,
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
        getForm: jest.fn().mockReturnValue(formCuTip),
        getError: jest.fn().mockReturnValue(''),
        getSuccess: jest.fn().mockReturnValue(''),
        getLoading: jest.fn().mockReturnValue(false)
      };
      
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
    const formVenit = { ...defaultForm, type: TransactionType.INCOME, category: CategoryType.INCOME };
    
    mockUseTransactionFormStore.mockImplementation((selector) => {
      const state = {
        form: formVenit,
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
        getForm: jest.fn().mockReturnValue(formVenit),
        getError: jest.fn().mockReturnValue(''),
        getSuccess: jest.fn().mockReturnValue(''),
        getLoading: jest.fn().mockReturnValue(false)
      };
      
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
    const expectedSubcategories = getAllSubcategories(categorii[CategoryType.INCOME]);
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
    const formEcon = { ...defaultForm, type: TransactionType.SAVING, category: CategoryType.SAVING };
    
    mockUseTransactionFormStore.mockImplementation((selector) => {
      const state = {
        form: formEcon,
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
        getForm: jest.fn().mockReturnValue(formEcon),
        getError: jest.fn().mockReturnValue(''),
        getSuccess: jest.fn().mockReturnValue(''),
        getLoading: jest.fn().mockReturnValue(false)
      };
      
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
    const expectedSubcategories = getAllSubcategories(categorii[CategoryType.SAVING]);
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
    const formChelt = { ...defaultForm, type: TransactionType.EXPENSE, category: CategoryType.EXPENSE };
    
    mockUseTransactionFormStore.mockImplementation((selector) => {
      const state = {
        form: formChelt,
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
        getForm: jest.fn().mockReturnValue(formChelt),
        getError: jest.fn().mockReturnValue(''),
        getSuccess: jest.fn().mockReturnValue(''),
        getLoading: jest.fn().mockReturnValue(false)
      };
      
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
    const expectedSubcategories = getAllSubcategories(categorii[CategoryType.EXPENSE]);
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
    const formVenit = { ...defaultForm, type: TransactionType.INCOME, category: CategoryType.EXPENSE };
    
    mockUseTransactionFormStore.mockImplementation((selector) => {
      const state = {
        form: formVenit,
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
        getForm: jest.fn().mockReturnValue(formVenit),
        getError: jest.fn().mockReturnValue(''),
        getSuccess: jest.fn().mockReturnValue(''),
        getLoading: jest.fn().mockReturnValue(false)
      };
      
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
    const formVenit = { ...defaultForm, type: TransactionType.INCOME, category: CategoryType.INCOME, subcategory: 'Îmbrăcăminte, încălțăminte și accesorii' };
    
    mockUseTransactionFormStore.mockImplementation((selector) => {
      const state = {
        form: formVenit,
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
        getForm: jest.fn().mockReturnValue(formVenit),
        getError: jest.fn().mockReturnValue(''),
        getSuccess: jest.fn().mockReturnValue(''),
        getLoading: jest.fn().mockReturnValue(false)
      };
      
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

  it('shows error and success messages', () => {
    // Configurăm mock-ul doar pentru mesajele de eroare și succes
    mockUseTransactionFormStore.mockImplementation((selector) => {
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
      const state = {
        form: initialForm,
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
        getForm: jest.fn().mockReturnValue(initialForm),
        getError: jest.fn().mockReturnValue(''),
        getSuccess: jest.fn().mockReturnValue(''),
        getLoading: jest.fn().mockReturnValue(false)
      };
      
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
      const state = {
        form: initialForm,
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
        getForm: jest.fn().mockReturnValue(initialForm),
        getError: jest.fn().mockReturnValue(''),
        getSuccess: jest.fn().mockReturnValue(''),
        getLoading: jest.fn().mockReturnValue(false)
      };
      
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
      const state = {
        form: initialForm,
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
        getForm: jest.fn().mockReturnValue(initialForm),
        getError: jest.fn().mockReturnValue(''),
        getSuccess: jest.fn().mockReturnValue(''),
        getLoading: jest.fn().mockReturnValue(false)
      };
      
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
      const state = {
        form: initialForm,
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
        getForm: jest.fn().mockReturnValue(initialForm),
        getError: jest.fn().mockReturnValue(''),
        getSuccess: jest.fn().mockReturnValue(''),
        getLoading: jest.fn().mockReturnValue(false)
      };
      
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
      const state = {
        form: initialForm,
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
        getForm: jest.fn().mockReturnValue(initialForm),
        getError: jest.fn().mockReturnValue(''),
        getSuccess: jest.fn().mockReturnValue(''),
        getLoading: jest.fn().mockReturnValue(false)
      };
      
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
      const state = {
        form: initialForm,
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
        getForm: jest.fn().mockReturnValue(initialForm),
        getError: jest.fn().mockReturnValue(''),
        getSuccess: jest.fn().mockReturnValue(''),
        getLoading: jest.fn().mockReturnValue(false)
      };
      
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
      const state = {
        form: defaultForm,
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
        getForm: jest.fn().mockReturnValue(defaultForm),
        getError: jest.fn().mockReturnValue(''),
        getSuccess: jest.fn().mockReturnValue(''),
        getLoading: jest.fn().mockReturnValue(false)
      };
      
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
      const state = {
        form: recurringForm,
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
        getForm: jest.fn().mockReturnValue(recurringForm),
        getError: jest.fn().mockReturnValue(''),
        getSuccess: jest.fn().mockReturnValue(''),
        getLoading: jest.fn().mockReturnValue(false)
      };
      
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
      const state = {
        form: defaultForm,
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
        getForm: jest.fn().mockReturnValue(defaultForm),
        getError: jest.fn().mockReturnValue(''),
        getSuccess: jest.fn().mockReturnValue(''),
        getLoading: jest.fn().mockReturnValue(false)
      };
      
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

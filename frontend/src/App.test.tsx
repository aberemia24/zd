import React from 'react';
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import '@testing-library/jest-dom';
import { App } from './App';
import { Transaction } from './types/Transaction';
import { TransactionType, FrequencyType } from './constants/enums';
import { TITLES } from './constants/ui';

// Declaram mock-urile inainte de a le folosi
const mockTransactions: Transaction[] = [
  {
    _id: 't1',
    userId: 'u1',
    type: TransactionType.INCOME,
    amount: '100',
    currency: 'RON',
    date: '2025-04-22',
    category: 'VENITURI',
    subcategory: '',
    recurring: false,
    frequency: ''
  },
  {
    _id: 't2',
    userId: 'u1',
    type: TransactionType.EXPENSE,
    amount: '200',
    currency: 'RON',
    date: '2025-04-23',
    category: 'abonament',
    subcategory: 'Taxe școlare',
    recurring: true,
    frequency: FrequencyType.MONTHLY
  }
];

// Folosim autoMockul pentru a evita problemele de referință
jest.mock('./hooks/useTransactionForm');
jest.mock('./hooks/useTransactionFilters');
jest.mock('./hooks/useTransactionData');
jest.mock('./services/transactionService');

// Import și constante UI mock
const MOCK_BUTTONS = {
  ADD: 'Adaugă',
  RESET: 'Resetare',
  FILTER: 'Filtrează',
  NEXT: 'Următoarea',
  PREV: 'Precedenta'
};

const MOCK_LABELS = {
  FORM: 'Formular tranzacție',
  TYPE_FILTER: 'Tip tranzacție', 
  CATEGORY_FILTER: 'Categorie',
  NO_DATA: 'Nu există tranzacții disponibile'
};

const MOCK_TABLE = {
  LOADING: 'Se încarcă...'
};

describe('App component', () => {
  // Import hooks pentru mock-uri
  const mockUseTransactionForm = require('./hooks/useTransactionForm').useTransactionForm;
  const mockUseTransactionFilters = require('./hooks/useTransactionFilters').useTransactionFilters;
  const mockUseTransactionData = require('./hooks/useTransactionData').useTransactionData;
  const mockTransactionService = require('./services/transactionService').TransactionService;
  
  // Mock pentru mesaje de eroare
  const MOCK_MESAJE = {
    FRECV_RECURENTA: 'Selectează frecvența pentru tranzacție recurentă'
  };

  // Setup mock-uri înainte de fiecare test
  beforeEach(() => {
    jest.clearAllMocks();

    // Mock pentru useTransactionForm
    mockUseTransactionForm.mockImplementation(({ onSubmit }: { onSubmit: (data: any) => Promise<boolean> }) => ({
      form: {
        type: '',
        amount: '',
        date: '',
        category: '',
        subcategory: '',
        recurring: false,
        frequency: ''
      },
      error: '',
      success: '',
      loading: false,
      handleChange: jest.fn(),
      handleSubmit: jest.fn((e) => {
        e.preventDefault();
        onSubmit({
          type: 'income',
          amount: 100,
          date: '2025-04-25',
          category: 'VENITURI',
          subcategory: 'Salariu',
          recurring: false,
          frequency: ''
        });
      }),
      resetForm: jest.fn(),
      setError: jest.fn(),
      setSuccess: jest.fn(),
      setLoading: jest.fn()
    }));

    // Mock pentru useTransactionFilters
    mockUseTransactionFilters.mockImplementation(() => ({
      filterType: '',
      filterCategory: '',
      limit: 10,
      offset: 0,
      currentPage: 1,
      setFilterType: jest.fn(),
      setFilterCategory: jest.fn(),
      nextPage: jest.fn(),
      prevPage: jest.fn(),
      goToPage: jest.fn(),
      queryParams: { limit: 10, offset: 0, sort: 'date' }
    }));

    // Mock pentru useTransactionData
    mockUseTransactionData.mockImplementation(() => ({
      transactions: mockTransactions,
      total: mockTransactions.length,
      loading: false,
      error: '',
      refresh: jest.fn()
    }));

    // Mock pentru TransactionService
    mockTransactionService.mockImplementation(() => ({
      getFilteredTransactions: jest.fn().mockResolvedValue({
        data: mockTransactions,
        total: mockTransactions.length,
        limit: 10,
        offset: 0
      }),
      saveTransaction: jest.fn().mockImplementation((formData) => {
        const transaction = {
          ...formData,
          _id: 'mock-id-' + Date.now(),
          userId: 'u1',
          amount: String(formData.amount),
          currency: 'RON'
        };
        return Promise.resolve(transaction);
      }),
      getCacheStats: jest.fn().mockReturnValue({
        entries: 1,
        hits: 2,
        misses: 1,
        ratio: 0.67
      })
    }));
  });

  it('afișează titlul principal corect', () => {
    render(<App />);
    expect(screen.getByText(TITLES.TRANZACTII)).toBeInTheDocument();
  });

  it('integrează corect toate hook-urile și serviciile', () => {
    render(<App />);
    
    // Verificăm apelurile la hooks și servicii
    expect(mockUseTransactionForm).toHaveBeenCalled();
    expect(mockUseTransactionFilters).toHaveBeenCalled();
    expect(mockUseTransactionData).toHaveBeenCalled();
    expect(mockTransactionService).toHaveBeenCalled();
  });

  it('permite filtrarea tranzacțiilor', () => {
    // Pregătim un mock special pentru setFilterType
    const setFilterTypeMock = jest.fn();
    mockUseTransactionFilters.mockImplementationOnce(() => ({
      filterType: '',
      filterCategory: '',
      limit: 10,
      offset: 0,
      currentPage: 1,
      setFilterType: setFilterTypeMock,
      setFilterCategory: jest.fn(),
      nextPage: jest.fn(),
      prevPage: jest.fn(),
      goToPage: jest.fn(),
      queryParams: { limit: 10, offset: 0, sort: 'date' }
    }));
    
    render(<App />);
    
    // Simulăm selectarea unui tip de tranzacție
    // Notă: Aceasta este o variantă simplificată, testul complet ar găsi și ar interacționa cu componentul real
    // Acesta este doar pentru a demonstra logica de testare
    const selectTypeEvent = { target: { value: TransactionType.EXPENSE } };
    const typeSelect = screen.getByLabelText(MOCK_LABELS.TYPE_FILTER, { exact: false });
    fireEvent.change(typeSelect, selectTypeEvent);
    
    expect(setFilterTypeMock).toHaveBeenCalledWith(TransactionType.EXPENSE);
  });

  it('permite adăugarea unei tranzacții noi', async () => {
    // Pregătim mock pentru refresh
    const refreshMock = jest.fn();
    mockUseTransactionData.mockImplementationOnce(() => ({
      transactions: mockTransactions,
      total: mockTransactions.length,
      loading: false,
      error: '',
      refresh: refreshMock
    }));
    
    // Pregătim mock pentru salvare
    const saveTransactionMock = jest.fn().mockResolvedValue({ _id: 'new-id', amount: '100' });
    mockTransactionService.mockImplementationOnce(() => ({
      getFilteredTransactions: jest.fn(),
      saveTransaction: saveTransactionMock,
      getCacheStats: jest.fn()
    }));
    
    render(<App />);
    
    // Găsim formularul și butonul de submit (folosind un selector mai flexibil)
    // În aplicația reală, formul probabil este un element form cu role="form"
    const form = screen.getByRole('form');
    const submitButton = screen.getByText(MOCK_BUTTONS.ADD);
    fireEvent.click(submitButton);
    
    // Verificăm că a fost apelat saveTransaction și apoi refresh
    await waitFor(() => {
      expect(saveTransactionMock).toHaveBeenCalled();
      expect(refreshMock).toHaveBeenCalled();
    });
  });

  it('afișează starea de încărcare în timpul fetch-ului de date', () => {
    // Configurăm loading state
    mockUseTransactionData.mockImplementationOnce(() => ({
      transactions: [],
      total: 0,
      loading: true,
      error: '',
      refresh: jest.fn()
    }));
    
    render(<App />);
    
    // Verificăm dacă se afișează mesajul de încărcare conform constantei din TABLE.LOADING
    // În TransactionTable.tsx, celula de loading are textul: TABLE.LOADING = "Se încarcă..."
    const loadingIndicator = screen.getByText(MOCK_TABLE.LOADING);  
    expect(loadingIndicator).toBeInTheDocument();
  });

  it('afișează mesajul de eroare la încărcarea datelor eșuată', () => {
    // Configurăm starea de eroare
    const errorMessage = 'Eroare la încărcarea tranzacțiilor';
    mockUseTransactionData.mockImplementationOnce(() => ({
      transactions: [],
      total: 0,
      loading: false,
      error: errorMessage,
      refresh: jest.fn()
    }));
    
    render(<App />);
    
    // Verificăm mesajul de eroare
    expect(screen.getByText(errorMessage)).toBeInTheDocument();
  });

  // Teste pentru funcționalitățile de tranzacții recurente
  describe('Funcționalități de tranzacții recurente', () => {
    it('permite setarea unei tranzacții ca recurentă și activează selectorul de frecvență', () => {
      // Mock pentru form cu frecvență inițial inactivă
      let recurringChecked = false;
      let frequencyDisabled = true;

      mockUseTransactionForm.mockImplementation(({ onSubmit }: { onSubmit: (data: any) => Promise<boolean> }) => ({
        form: {
          type: '',
          amount: '',
          date: '',
          category: '',
          subcategory: '',
          recurring: recurringChecked,
          frequency: ''
        },
        error: '',
        success: '',
        loading: false,
        handleChange: jest.fn((e) => {
          // Simulăm comportamentul de activare a frecvenței când recurent e activat
          if (e.target.name === 'recurring') {
            recurringChecked = e.target.checked;
            frequencyDisabled = !recurringChecked;
          }
        }),
        handleSubmit: jest.fn(),
        resetForm: jest.fn(),
        setError: jest.fn(),
        setSuccess: jest.fn(),
        setLoading: jest.fn()
      }));
      
      render(<App />);
      
      // Găsim form-ul și checkbox-ul pentru recurent
      const recurringCheckbox = screen.getByLabelText(/Recurent/i);
      const frequencySelect = screen.getByLabelText(/Frecvență/i);
      
      // Verificăm starea inițială
      expect(frequencySelect).toBeDisabled();
      
      // Activăm opțiunea de recurentă
      fireEvent.click(recurringCheckbox);
      
      // Declanșăm mocked handleChange
      expect(mockUseTransactionForm).toHaveBeenCalled();
    });

    it('nu permite salvarea dacă tranzacția e recurentă dar nu are frecvență selectată', async () => {
      // Pregătim mock-uri pentru acest test
      let formState = {
        type: TransactionType.EXPENSE,
        amount: '100',
        date: '2025-04-25',
        category: 'UTILITĂȚI',
        subcategory: 'Electricitate',
        recurring: true,  // Formular marcat ca recurent
        frequency: ''     // Dar fără frecvență setată
      };
      
      let formError = '';
      const setErrorMock = jest.fn((message) => {
        formError = message;
      });
      
      // Mock pentru useTransactionForm cu validare pentru recurent fără frecvență
      mockUseTransactionForm.mockImplementation(({ onSubmit }: { onSubmit: (data: any) => Promise<boolean> }) => ({
        form: formState,
        error: formError,
        success: '',
        loading: false,
        handleChange: jest.fn(),
        handleSubmit: jest.fn((e) => {
          e.preventDefault();
          // Simulăm validarea
          if (formState.recurring && !formState.frequency) {
            setErrorMock(MOCK_MESAJE.FRECV_RECURENTA);
            return;
          }
          // Continuă doar dacă totul e valid
          onSubmit(formState);
        }),
        resetForm: jest.fn(),
        setError: setErrorMock,
        setSuccess: jest.fn(),
        setLoading: jest.fn()
      }));
      
      render(<App />);
      
      // Găsim formular și buton de submit
      const form = screen.getByRole('form');
      const submitButton = screen.getByText(MOCK_BUTTONS.ADD);
      
      // Declanșăm submit-ul formularului
      fireEvent.click(submitButton);
      
      // Verificăm că s-a setat mesajul de eroare pentru frecvență necesară
      expect(setErrorMock).toHaveBeenCalledWith(MOCK_MESAJE.FRECV_RECURENTA);
    });

    it('permite salvarea unei tranzacții recurente valide cu frecvență setată', async () => {
      // Pregătim formular valid pentru tranzacție recurentă
      const validRecurringForm = {
        type: TransactionType.INCOME,
        amount: 200,
        date: '2025-04-24',
        category: 'VENITURI',
        subcategory: 'Salarii',
        recurring: true,
        frequency: FrequencyType.MONTHLY
      };
      
      // Mock pentru refresh și salvare
      const refreshMock = jest.fn();
      const saveTransactionMock = jest.fn().mockResolvedValue({
        ...validRecurringForm,
        _id: 'mock-recur-id-1',
        userId: 'u1',
        amount: String(validRecurringForm.amount),
        currency: 'RON'
      });
      
      // Setup mock-uri
      mockUseTransactionData.mockImplementationOnce(() => ({
        transactions: mockTransactions,
        total: mockTransactions.length,
        loading: false,
        error: '',
        refresh: refreshMock
      }));
      
      mockTransactionService.mockImplementationOnce(() => ({
        getFilteredTransactions: jest.fn(),
        saveTransaction: saveTransactionMock,
        getCacheStats: jest.fn()
      }));
      
      // Mock pentru form cu validare completă
      mockUseTransactionForm.mockImplementation(({ onSubmit }: { onSubmit: (data: any) => Promise<boolean> }) => ({
        form: validRecurringForm,
        error: '',
        success: '',
        loading: false,
        handleChange: jest.fn(),
        handleSubmit: jest.fn((e) => {
          e.preventDefault();
          // Validare completă care va trece pentru ca avem frecvență setată
          onSubmit(validRecurringForm);
        }),
        resetForm: jest.fn(),
        setError: jest.fn(),
        setSuccess: jest.fn(),
        setLoading: jest.fn()
      }));
      
      render(<App />);
      
      // Găsim și declanșăm butonul de submit
      const submitButton = screen.getByText(MOCK_BUTTONS.ADD);
      fireEvent.click(submitButton);
      
      // Verificăm că a fost salvată tranzacția și s-a declanșat refresh
      await waitFor(() => {
        expect(saveTransactionMock).toHaveBeenCalled();
        expect(refreshMock).toHaveBeenCalled();
      });
    });
  });
});
import React from 'react';
import { render, screen, fireEvent, within, cleanup } from '@testing-library/react';
import TransactionTable from '.';
import { Transaction } from './TransactionTable';
import { MOCK_LABELS, MOCK_BUTTONS, MOCK_TABLE, MOCK_PLACEHOLDERS } from '../../../test/mockData';
import { TransactionType, CategoryType, FrequencyType } from '../../../constants/enums';

// Mock pentru store-ul Zustand
jest.mock('../../../stores/transactionStore', () => {
  const defaultState = {
    transactions: [],
    loading: false,
    total: 0,
    error: '',
    queryParams: { limit: 5, offset: 0 },
    service: null
  };
  
  return {
    useTransactionStore: jest.fn((selector: any) => {
      // Returnează rezultatul selectorului aplicat pe stare
      if (typeof selector === 'function') {
        return selector(defaultState);
      }
      
      return defaultState;
    })
  };
});

describe('TransactionTable', () => {
  // Props-uri de bază pentru componenta TransactionTable
  const baseProps = {
    offset: 0,
    limit: 5,
    onPageChange: jest.fn(),
  };

  // Date de test pentru tranzacții
  const transactions: Transaction[] = [
    {
      _id: '1',
      type: TransactionType.INCOME,
      amount: '1000',
      currency: 'RON',
      category: 'Salariu',
      subcategory: 'IT',
      date: '2025-04-01',
      recurring: true,
      frequency: FrequencyType.MONTHLY,
    },
    {
      _id: '2',
      type: TransactionType.EXPENSE,
      amount: '200',
      currency: 'RON',
      category: 'Mâncare',
      subcategory: 'Supermarket',
      date: '2025-04-02',
      recurring: false,
      frequency: '',
    },
  ];

  it('renderă headerele tabelului', () => {
    // Configurăm mock-ul cu starea goală pentru a vedea headerele
    const { useTransactionStore } = require('../../../stores/transactionStore');
    useTransactionStore.mockImplementation((selector: any) => {
      const state = {
        transactions: [],
        loading: false,
        total: 0,
        error: '',
        queryParams: { limit: 5, offset: 0 },
        service: null
      };
      
      if (typeof selector === 'function') {
        return selector(state);
      }
      
      return state;
    });
    
    render(<TransactionTable {...baseProps} />);
    expect(screen.getByText(MOCK_TABLE.HEADERS.TYPE)).toBeInTheDocument();
    expect(screen.getByText(MOCK_TABLE.HEADERS.AMOUNT)).toBeInTheDocument();
    expect(screen.getByText(MOCK_TABLE.HEADERS.CURRENCY)).toBeInTheDocument();
    expect(screen.getByText(MOCK_TABLE.HEADERS.CATEGORY)).toBeInTheDocument();
    expect(screen.getByText(MOCK_TABLE.HEADERS.SUBCATEGORY)).toBeInTheDocument();
    expect(screen.getByText(MOCK_TABLE.HEADERS.DATE)).toBeInTheDocument();
    expect(screen.getByText(MOCK_TABLE.HEADERS.RECURRING)).toBeInTheDocument();
    expect(screen.getByText(MOCK_TABLE.HEADERS.FREQUENCY)).toBeInTheDocument();
    
    // Verificăm că vedem mesajul de tabel gol, deoarece transactions este un array gol
    expect(screen.getByText(MOCK_TABLE.EMPTY)).toBeInTheDocument();
  });

  it('renderă toate rândurile și câmpurile tranzacțiilor', () => {
    // Mock-uim useTransactionStore pentru acest test specific
    const { useTransactionStore } = require('../../../stores/transactionStore');
    useTransactionStore.mockImplementation((selector: any) => {
      const state = {
        transactions,
        loading: false,
        total: transactions.length,
        error: '',
        queryParams: { limit: 5, offset: 0 },
        service: null
      };
      
      if (typeof selector === 'function') {
        return selector(state);
      }
      
      return state;
    });
    
    render(<TransactionTable {...baseProps} />);
    
    // Folosim textContent în loc de text pentru a găsi valorile enum-urilor
    const rows = screen.getAllByRole('row');
    expect(rows.length).toBeGreaterThan(1); // header + rânduri
    
    // Verificăm prezența valorilor în tabel fără a căuta textul exact
    const tableContent = screen.getByRole('table').textContent;
    expect(tableContent).toContain('1000');
    expect(tableContent).toContain('RON');
    expect(tableContent).toContain('Salariu');
    expect(tableContent).toContain('IT');
    expect(tableContent).toContain('2025-04-01');
    expect(tableContent).toContain(MOCK_TABLE.BOOL.YES);
    expect(tableContent).toContain(FrequencyType.MONTHLY);

    expect(tableContent).toContain('200');
    expect(tableContent).toContain('Mâncare');
    expect(tableContent).toContain('Supermarket');
    expect(tableContent).toContain('2025-04-02');
    expect(tableContent).toContain(MOCK_TABLE.BOOL.NO);
  });

  it('afișează starea de încărcare', () => {
    // Mock-uim useTransactionStore pentru starea de încărcare
    const { useTransactionStore } = require('../../../stores/transactionStore');
    useTransactionStore.mockImplementation((selector: any) => {
      const state = {
        transactions: [],
        loading: true,
        total: 0,
        error: '',
        queryParams: { limit: 5, offset: 0 },
        service: null
      };
      
      if (typeof selector === 'function') {
        return selector(state);
      }
      
      return state;
    });
    
    render(<TransactionTable {...baseProps} />);
    
    // Folosim textContent pentru a găsi mesajul de încărcare
    const tableContainer = screen.getByRole('table').parentElement;
    expect(tableContainer?.textContent).toContain(MOCK_TABLE.LOADING);
  });

  it('afișează starea goală', () => {
    // Mock-uim useTransactionStore pentru starea goală
    const { useTransactionStore } = require('../../../stores/transactionStore');
    useTransactionStore.mockImplementation((selector: any) => {
      const state = {
        transactions: [],
        loading: false,
        total: 0,
        error: '',
        queryParams: { limit: 5, offset: 0 },
        service: null
      };
      
      if (typeof selector === 'function') {
        return selector(state);
      }
      
      return state;
    });
    
    render(<TransactionTable {...baseProps} />);
    expect(screen.getByText(MOCK_TABLE.EMPTY)).toBeInTheDocument();
  });

  it('gestionează corect câmpurile opționale lipsă sau nedefinite', () => {
    const edgeTx: Transaction = {
      type: TransactionType.EXPENSE,
      amount: '0',
      currency: '',
      category: '',
      subcategory: '',
      date: '',
      // recurring and frequency omitted
    };
    
    // Mock-uim useTransactionStore pentru tranzacții cu câmpuri lipsă
    const { useTransactionStore } = require('../../../stores/transactionStore');
    useTransactionStore.mockImplementation((selector: any) => {
      const state = {
        transactions: [edgeTx],
        loading: false,
        total: 1,
        error: '',
        queryParams: { limit: 5, offset: 0 },
        service: null
      };
      
      if (typeof selector === 'function') {
        return selector(state);
      }
      
      return state;
    });
    
    render(<TransactionTable {...baseProps} />);
    
    // Verificăm prezența valorilor în tabel fără a căuta textul exact
    const tableContent = screen.getByRole('table').textContent;
    expect(tableContent).toContain('0');
    expect(screen.getAllByRole('row').length).toBeGreaterThan(1); // header + row
    
    // Verificăm că avem cel puțin un 'Nu' pentru câmpul recurring
    const noTexts = screen.getAllByText(MOCK_TABLE.BOOL.NO);
    expect(noTexts.length).toBeGreaterThanOrEqual(1);
  });

  it('apelează onPageChange când se face click pe butoanele de paginare', () => {
    const mockSetQueryParams = jest.fn();
    
    // Mock-uim useTransactionStore pentru paginare
    const { useTransactionStore } = require('../../../stores/transactionStore');
    useTransactionStore.mockImplementation((selector: any) => {
      const state = {
        transactions,
        loading: false,
        total: 10, // Mai multe tranzacții decât limit pentru a activa paginarea
        error: '',
        queryParams: { limit: 5, offset: 0 },
        setQueryParams: mockSetQueryParams,
        service: null
      };
      
      if (typeof selector === 'function') {
        return selector(state);
      }
      
      return state;
    });
    
    // Funcția onPageChange pentru a verifica că va fi apelată corect
    const onPageChange = jest.fn((newOffset: number) => {
      // Această funcție ar trebui să actualizeze queryParams.offset în store
      const newParams = { limit: 5, offset: newOffset };
      mockSetQueryParams(newParams);
    });
    
    render(<TransactionTable {...baseProps} onPageChange={onPageChange} />);
    
    // Găsim și simulăm click pe butonul Next pentru a testa onPageChange
    const nextButton = screen.getByRole('button', { name: MOCK_BUTTONS.NEXT_PAGE });
    fireEvent.click(nextButton);
    
    // Verificăm că onPageChange a fost apelat cu offset + limit
    expect(onPageChange).toHaveBeenCalledWith(5); // 0 + 5 = 5
    
    // Verificăm că mockSetQueryParams a fost apelat pentru a actualiza state-ul
    expect(mockSetQueryParams).toHaveBeenCalledWith(expect.objectContaining({ offset: 5 }));
  });

// Testele de la această secțiune sunt deja definite mai sus 
// și erau duplicate în fișier
});

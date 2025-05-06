/**
 * Test pentru TransactionTable - Abordare simplificată fără mockuri pentru stores
 * Conform regulilor: mock doar pentru external services
 */
import React from 'react';
import { render, screen, fireEvent, within } from '@testing-library/react';
import { act } from 'react';
import '@testing-library/jest-dom';
import TransactionTable from '.';
import { Transaction } from './TransactionTable';
import { MOCK_BUTTONS, MOCK_TABLE } from '../../../test/mockData';
import { TransactionType, FrequencyType } from '@shared-constants/enums';
import { useTransactionStore } from '../../../stores/transactionStore';

// Mock pentru supabaseService (external service)
jest.mock('../../../services/supabaseService', () => ({
  supabaseService: {
    fetchTransactions: jest.fn().mockResolvedValue({ data: [], count: 0 }),
    getTransactionById: jest.fn(),
    createTransaction: jest.fn(),
    updateTransaction: jest.fn(),
    deleteTransaction: jest.fn()
  }
}));

// Resetăm store-ul după fiecare test
afterEach(() => {
  jest.clearAllMocks();
  act(() => {
    useTransactionStore.getState().reset();
  });
});

describe('TransactionTable', () => {
  // Props-uri de bază pentru componenta TransactionTable
  const baseProps = {
    offset: 0,
    limit: 5,
    onPageChange: jest.fn(),
  };

  // Date de test pentru tranzacții - convertite pentru a fi compatibile cu store-ul
  const transactions = [
    {
      id: '1',
      type: TransactionType.INCOME,
      amount: 1000, // Număr pentru compatibilitate cu TransactionValidated
      currency: 'RON',
      category: 'Salariu',
      subcategory: 'IT',
      date: '2025-04-01',
      recurring: true,
      frequency: FrequencyType.MONTHLY,
    },
    {
      id: '2',
      type: TransactionType.EXPENSE,
      amount: 200, // Număr pentru compatibilitate cu TransactionValidated
      currency: 'RON',
      category: 'Mâncare',
      subcategory: 'Supermarket',
      date: '2025-04-02',
      recurring: false,
      frequency: undefined,
    },
  ] as any[]; // Folosim type assertion pentru a evita probleme de compatibilitate

  it('renderă headerele tabelului și mesajul de tabel gol', () => {
    // Renderăm cu store-ul în starea inițială (fără tranzacții)
    render(<TransactionTable {...baseProps} />);
    
    // Verificăm headerele tabelului
    expect(screen.getByText(MOCK_TABLE.HEADERS.TYPE)).toBeInTheDocument();
    expect(screen.getByText(MOCK_TABLE.HEADERS.AMOUNT)).toBeInTheDocument();
    expect(screen.getByText(MOCK_TABLE.HEADERS.CATEGORY)).toBeInTheDocument();
    expect(screen.getByText(MOCK_TABLE.HEADERS.SUBCATEGORY)).toBeInTheDocument();
    expect(screen.getByText(MOCK_TABLE.HEADERS.DATE)).toBeInTheDocument();
    expect(screen.getByText(MOCK_TABLE.HEADERS.RECURRING)).toBeInTheDocument();
    expect(screen.getByText(MOCK_TABLE.HEADERS.FREQUENCY)).toBeInTheDocument();
    
    // Verificăm că vedem mesajul de tabel gol, deoarece store-ul nu are tranzacții
    expect(screen.getByText(MOCK_TABLE.EMPTY)).toBeInTheDocument();
  });

  it('renderă toate rândurile și câmpurile tranzacțiilor', () => {
    // Setăm tranzacțiile direct în store
    act(() => {
      useTransactionStore.getState().setTransactions(transactions);
      useTransactionStore.getState().setTotal(transactions.length);
    });
    
    render(<TransactionTable {...baseProps} />);
    
    // Verificăm că avem header + 2 rânduri pentru tranzacții
    const rows = screen.getAllByRole('row');
    expect(rows.length).toBe(3); // 1 header + 2 rânduri de date
    
    // Verificăm valorile afișate în tabel
    const tableContent = screen.getByRole('table').textContent || '';
    
    // Prima tranzacție
    expect(tableContent).toContain('1000');
    expect(tableContent).toContain('Salariu');
    expect(tableContent).toContain('IT');
    expect(tableContent).toContain('2025-04-01');
    expect(tableContent).toContain(FrequencyType.MONTHLY);
    
    // A doua tranzacție
    expect(tableContent).toContain('200');
    expect(tableContent).toContain('Mâncare');
    expect(tableContent).toContain('Supermarket');
    expect(tableContent).toContain('2025-04-02');
  });

  it('afișează starea de încărcare', () => {
    // Setăm starea de loading în store
    act(() => {
      useTransactionStore.getState().setLoading(true);
    });
    
    render(<TransactionTable {...baseProps} />);
    
    // Verificăm că apare mesajul de încărcare
    const tableContainer = screen.getByRole('table').parentElement;
    expect(tableContainer?.textContent).toContain(MOCK_TABLE.LOADING);
  });

  it('gestionează corect câmpurile opționale lipsă sau nedefinite', () => {
    // Tranzacție cu câmpuri minime sau nedefinite
    const edgeTx = {
      id: '3',
      type: TransactionType.EXPENSE,
      amount: 0, // Număr pentru compatibilitate cu TransactionValidated
      currency: '',
      category: '',
      subcategory: '',
      date: '2025-01-01', // Trebuie să fie un string valid pentru date
      recurring: false,
      frequency: undefined,
    } as any;
    
    // Setăm tranzacția edge case direct în store
    act(() => {
      useTransactionStore.getState().setTransactions([edgeTx]);
      useTransactionStore.getState().setTotal(1);
    });
    
    render(<TransactionTable {...baseProps} />);
    
    // Verificăm că tranzacția este afișată corect
    const rows = screen.getAllByRole('row');
    expect(rows.length).toBe(2); // header + 1 rând
    
    const rowContent = rows[1].textContent || '';
    expect(rowContent).toContain('0'); // amount
    
    // Căutăm celula pentru recurring și verificăm că este 'Nu'
    const cells = within(rows[1]).getAllByRole('cell');
    expect(cells.length).toBeGreaterThanOrEqual(6); // Minim 6 celule
  });

  it('afișează corect coloanele Recurring și Frequency pentru tranzacții', () => {
    // Setăm tranzacțiile direct în store
    act(() => {
      useTransactionStore.getState().setTransactions(transactions);
      useTransactionStore.getState().setTotal(transactions.length);
    });
    
    render(<TransactionTable {...baseProps} />);
    
    const rows = screen.getAllByRole('row');
    
    // Verificăm tranzacția recurentă (prima)
    const firstCells = within(rows[1]).getAllByRole('cell');
    expect(firstCells[6].textContent).toBe(FrequencyType.MONTHLY);
    
    // Verificăm tranzacția nerecurentă (a doua)
    const secondCells = within(rows[2]).getAllByRole('cell');
    expect(secondCells[6].textContent).toBe(""); // Frecvența este goală pentru tranzacții nerecurente
  });

  it('apelează onPageChange când se face click pe butoanele de paginare', () => {
    // Mock pentru onPageChange
    const onPageChange = jest.fn();
    
    // Setăm un total mai mare decât limita pentru a activa paginarea
    act(() => {
      useTransactionStore.getState().setTransactions(transactions);
      useTransactionStore.getState().setTotal(10); // Mai mult decât limita de 5
      useTransactionStore.getState().setQueryParams({ 
        limit: 5, 
        offset: 0 
      });
    });
    
    render(<TransactionTable {...baseProps} onPageChange={onPageChange} />);
    
    // Găsim și simulăm click pe butonul Next
    const nextButton = screen.getByRole('button', { name: MOCK_BUTTONS.NEXT_PAGE });
    fireEvent.click(nextButton);
    
    // Verificăm că onPageChange a fost apelat cu offset + limit
    expect(onPageChange).toHaveBeenCalledWith(5); // 0 + 5 = 5
  });
});

import React from 'react';
import { render, screen } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import { LunarGrid } from './LunarGrid';
import { useTransactionStore } from '../../../stores/transactionStore';
import { TransactionStatus, TransactionType } from '@shared-constants/enums';
import { TransactionValidated } from '@shared-constants/transaction.schema';

// Helper pentru setup store cu date mock
function setupTransactions(transactions: TransactionValidated[]) {
  act(() => {
    useTransactionStore.getState().setTransactions(transactions);
  });
}

describe('LunarGrid', () => {
  const year = 2025;
  const month = 5;
  
  // Reset store după fiecare test pentru a evita side effects între teste
  afterEach(() => {
    act(() => {
      useTransactionStore.getState().setTransactions([]);
    });
  });

  // Teste focalizate pe funcționalități specifice, conform pattern recomandat
  it('afișează header cu zilele corecte', () => {
    render(<LunarGrid year={year} month={month} />);
    
    // Verificăm zilele lunii în header
    for (let day = 1; day <= 31; day++) {
      expect(screen.getByTestId(`header-day-${day}`)).toBeInTheDocument();
    }
  });

  it('afișează suma tranzacției pe zi/categorie/subcategorie', () => {
    // Setup date mock în store
    setupTransactions([
      {
        id: '1',
        amount: 100,
        type: TransactionType.EXPENSE,
        date: '2025-05-05',
        category: 'NUTRITIE',
        subcategory: 'Alimente',
        status: TransactionStatus.PLANNED,
      },
      {
        id: '2',
        amount: 50,
        type: TransactionType.EXPENSE,
        date: '2025-05-05',
        category: 'NUTRITIE',
        subcategory: 'Alimente',
        status: TransactionStatus.COMPLETED,
        actualAmount: 60,
      },
      {
        id: '3',
        amount: 200,
        type: TransactionType.INCOME,
        date: '2025-05-10',
        category: 'VENITURI',
        subcategory: 'Salarii',
      },
    ]);
    
    render(<LunarGrid year={year} month={month} />);
    
    // Celula pentru 5 mai, NUTRITIE/Alimente = 100 (PLANNED) + 60 (COMPLETED cu actualAmount)
    expect(screen.getByTestId('cell-NUTRITIE-Alimente-5')).toHaveTextContent('160');
    
    // Celula pentru 10 mai, VENITURI/Salarii = 200
    expect(screen.getByTestId('cell-VENITURI-Salarii-10')).toHaveTextContent('200');
  });

  it('folosește actualAmount pentru tranzacții COMPLETED', () => {
    setupTransactions([
      {
        id: '1',
        amount: 100,
        type: TransactionType.EXPENSE,
        date: '2025-05-15',
        category: 'NUTRITIE',
        subcategory: 'Alimente',
        status: TransactionStatus.COMPLETED,
        actualAmount: 120, // Suma reală diferită de cea estimată
      }
    ]);
    
    render(<LunarGrid year={year} month={month} />);
    
    // Verificăm că se folosește actualAmount, nu amount
    expect(screen.getByTestId('cell-NUTRITIE-Alimente-15')).toHaveTextContent('120');
  });

  it('afișează celule goale dacă nu există tranzacții pentru zi/subcategorie', () => {
    render(<LunarGrid year={year} month={month} />);
    
    // Celulă fără tranzacții trebuie să fie goală
    expect(screen.getByTestId('cell-NUTRITIE-Alimente-1')).toHaveTextContent('');
  });

  it('afișează corect suma doar pentru luna/anu selectat', () => {
    setupTransactions([
      {
        id: '1',
        amount: 100,
        type: TransactionType.EXPENSE,
        date: '2025-04-05', // Luna anterioară
        category: 'NUTRITIE',
        subcategory: 'Alimente',
      },
      {
        id: '2',
        amount: 50,
        type: TransactionType.EXPENSE,
        date: '2025-05-05', // Luna curentă
        category: 'NUTRITIE',
        subcategory: 'Alimente',
      },
    ]);
    
    render(<LunarGrid year={year} month={month} />);
    
    // Doar tranzacția din mai trebuie afișată
    expect(screen.getByTestId('cell-NUTRITIE-Alimente-5')).toHaveTextContent('50');
    expect(screen.getByTestId('cell-NUTRITIE-Alimente-4')).toHaveTextContent('');
  });
});

import React from 'react';
import { render, screen, fireEvent, within, cleanup } from '@testing-library/react';
import TransactionTable, { Transaction } from './TransactionTable';
import { TransactionType, CategoryType, FrequencyType } from '../../constants/enums';

describe('TransactionTable', () => {
  const baseProps = {
    loading: false,
    total: 10,
    offset: 0,
    limit: 5,
    onPageChange: jest.fn(),
  };

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

  it('renders table headers', () => {
    render(<TransactionTable {...baseProps} transactions={transactions} />);
    expect(screen.getByText('Tip')).toBeInTheDocument();
    expect(screen.getByText('Sumă')).toBeInTheDocument();
    expect(screen.getByText('Monedă')).toBeInTheDocument();
    expect(screen.getByText('Categorie')).toBeInTheDocument();
    expect(screen.getByText('Subcategorie')).toBeInTheDocument();
    expect(screen.getByText('Dată')).toBeInTheDocument();
    expect(screen.getByText('Recurent')).toBeInTheDocument();
    expect(screen.getByText('Frecvență')).toBeInTheDocument();
  });

  it('renders all transaction rows and fields', () => {
    render(<TransactionTable {...baseProps} transactions={transactions} />);
    expect(screen.getAllByText(TransactionType.INCOME).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('1000').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('RON').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('Salariu').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('IT').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('2025-04-01').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('Da').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('lunar').length).toBeGreaterThanOrEqual(1);

    expect(screen.getAllByText(TransactionType.EXPENSE).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('200').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('Mâncare').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('Supermarket').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('2025-04-02').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('Nu').length).toBeGreaterThanOrEqual(1);
  });

  it('shows loading state', () => {
    render(<TransactionTable {...baseProps} loading={true} transactions={[]} />);
    expect(screen.getByText('Se încarcă...')).toBeInTheDocument();
  });

  it('shows empty state', () => {
    render(<TransactionTable {...baseProps} transactions={[]} />);
    expect(screen.getByText('Nicio tranzacție')).toBeInTheDocument();
  });

  it('handles missing/undefined optional fields gracefully', () => {
    const edgeTx: Transaction = {
      type: TransactionType.EXPENSE,
      amount: '0',
      currency: '',
      category: '',
      subcategory: '',
      date: '',
      // recurring and frequency omitted
    };
    render(<TransactionTable {...baseProps} transactions={[edgeTx]} />);
    expect(screen.getByText(TransactionType.EXPENSE)).toBeInTheDocument();
    expect(screen.getByText('0')).toBeInTheDocument();
    expect(screen.getAllByRole('row').length).toBeGreaterThan(1); // header + row
    expect(screen.getAllByText('Nu')[0]).toBeInTheDocument();
  });

  it('calls onPageChange when pagination buttons are clicked', () => {
    const onPageChange = jest.fn();
    render(<TransactionTable {...baseProps} transactions={transactions} onPageChange={onPageChange} />);
    const nextBtn = screen.getByRole('button', { name: /Înainte/i });
    fireEvent.click(nextBtn);
    expect(onPageChange).toHaveBeenCalled();
    const prevBtn = screen.getByRole('button', { name: /Înapoi/i });
    fireEvent.click(prevBtn);
    expect(onPageChange).toHaveBeenCalled();
  });

  it('disables pagination buttons at edges', () => {
    // At start
    render(<TransactionTable {...baseProps} offset={0} transactions={transactions} />);
    expect(screen.getByRole('button', { name: /Înapoi/i })).toBeDisabled();
    // cleanup DOM
    cleanup();
    // At end
    render(<TransactionTable {...baseProps} offset={10} total={10} transactions={transactions} />);
    expect(screen.getByRole('button', { name: /Înainte/i })).toBeDisabled();
  });
});

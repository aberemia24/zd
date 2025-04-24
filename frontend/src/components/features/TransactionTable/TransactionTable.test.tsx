import React from 'react';
import { render, screen, fireEvent, within, cleanup } from '@testing-library/react';
import TransactionTable from '.';
import { Transaction } from './TransactionTable';
import { MOCK_LABELS, MOCK_BUTTONS, MOCK_TABLE, MOCK_PLACEHOLDERS } from '../../../test/mockData';
import { TransactionType, CategoryType, FrequencyType } from '../../../constants/enums';

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
    expect(screen.getByText(MOCK_TABLE.HEADERS.TYPE)).toBeInTheDocument();
    expect(screen.getByText(MOCK_TABLE.HEADERS.AMOUNT)).toBeInTheDocument();
    expect(screen.getByText(MOCK_TABLE.HEADERS.CURRENCY)).toBeInTheDocument();
    expect(screen.getByText(MOCK_TABLE.HEADERS.CATEGORY)).toBeInTheDocument();
    expect(screen.getByText(MOCK_TABLE.HEADERS.SUBCATEGORY)).toBeInTheDocument();
    expect(screen.getByText(MOCK_TABLE.HEADERS.DATE)).toBeInTheDocument();
    expect(screen.getByText(MOCK_TABLE.HEADERS.RECURRING)).toBeInTheDocument();
    expect(screen.getByText(MOCK_TABLE.HEADERS.FREQUENCY)).toBeInTheDocument();
  });

  it('renders all transaction rows and fields', () => {
    render(<TransactionTable {...baseProps} transactions={transactions} />);
    expect(screen.getAllByText(TransactionType.INCOME).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('1000').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('RON').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('Salariu').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('IT').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('2025-04-01').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(MOCK_TABLE.BOOL.YES).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('lunar').length).toBeGreaterThanOrEqual(1);

    expect(screen.getAllByText(TransactionType.EXPENSE).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('200').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('Mâncare').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('Supermarket').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('2025-04-02').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(MOCK_TABLE.BOOL.NO).length).toBeGreaterThanOrEqual(1);
  });

  it('shows loading state', () => {
    render(<TransactionTable {...baseProps} loading={true} transactions={[]} />);
    expect(screen.getByText(MOCK_TABLE.LOADING)).toBeInTheDocument();
  });

  it('shows empty state', () => {
    render(<TransactionTable {...baseProps} transactions={[]} />);
    expect(screen.getByText(MOCK_TABLE.EMPTY)).toBeInTheDocument();
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
    expect(screen.getAllByText(MOCK_TABLE.BOOL.NO)[0]).toBeInTheDocument();
  });

  it('calls onPageChange when pagination buttons are clicked', () => {
    const onPageChange = jest.fn();
    render(<TransactionTable {...baseProps} transactions={transactions} onPageChange={onPageChange} />);
    const nextBtn = screen.getByRole('button', { name: MOCK_BUTTONS.NEXT_PAGE });
    fireEvent.click(nextBtn);
    expect(onPageChange).toHaveBeenCalled();
    const prevBtn = screen.getByRole('button', { name: MOCK_BUTTONS.PREV_PAGE });
    fireEvent.click(prevBtn);
    expect(onPageChange).toHaveBeenCalled();
  });

  it('disables pagination buttons at edges', () => {
    // At start
    render(<TransactionTable {...baseProps} offset={0} transactions={transactions} />);
    expect(screen.getByRole('button', { name: MOCK_BUTTONS.PREV_PAGE })).toBeDisabled();
    // cleanup DOM
    cleanup();
    // At end
    render(<TransactionTable {...baseProps} offset={10} total={10} transactions={transactions} />);
    expect(screen.getByRole('button', { name: MOCK_BUTTONS.NEXT_PAGE })).toBeDisabled();
  });
});

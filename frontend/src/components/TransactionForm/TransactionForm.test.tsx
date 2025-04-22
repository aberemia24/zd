import React from 'react';
import { render, screen, fireEvent, within, waitFor } from '@testing-library/react';
import TransactionForm, { TransactionFormData } from './TransactionForm';

describe('TransactionForm', () => {
  const defaultForm: TransactionFormData = {
    type: '',
    amount: '',
    currency: '',
    category: '',
    subcategory: '',
    date: '',
    recurring: false,
    frequency: '',
  };

  it('renders all required fields', () => {
    render(<TransactionForm form={defaultForm} formError="" formSuccess="" onChange={() => {}} onSubmit={() => {}} />);
    const form = screen.getByRole('form');
    expect(within(form).getByLabelText(/Tip/i)).toBeInTheDocument();
    expect(within(form).getByLabelText(/Sumă/i)).toBeInTheDocument();
    expect(within(form).getByLabelText(/Monedă/i)).toBeInTheDocument();
    expect(within(form).getByLabelText('Categorie', { exact: true })).toBeInTheDocument();
    expect(within(form).getByLabelText('Subcategorie', { exact: true })).toBeInTheDocument();
    expect(within(form).getByLabelText(/Dată/i)).toBeInTheDocument();
    expect(within(form).getByLabelText(/Recurent/i)).toBeInTheDocument();
    expect(within(form).getByLabelText(/Frecvență/i)).toBeInTheDocument();
  });

  it('shows error and success messages', () => {
    render(
      <TransactionForm
        form={defaultForm}
        formError="Test error"
        formSuccess="Test success"
        onChange={() => {}}
        onSubmit={() => {}}
      />
    );
    expect(screen.getByText('Test error')).toBeInTheDocument();
    expect(screen.getByText('Test success')).toBeInTheDocument();
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
    fireEvent.change(within(form).getByLabelText(/Tip/i), { target: { value: 'income' } });
    expect(handleChange).toHaveBeenCalled();
    fireEvent.submit(form);
    expect(handleSubmit).toHaveBeenCalled();
  });
});

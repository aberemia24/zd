import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import TransactionFilters from './TransactionFilters';

describe('TransactionFilters', () => {
  const types = [
    { value: 'income', label: 'Venit' },
    { value: 'expense', label: 'Cheltuială' },
    { value: 'savings', label: 'Economisire' }
  ];
  const categories = [
    { value: 'salary', label: 'Salariu' },
    { value: 'rent', label: 'Chirie' }
  ];

  it('afișează opțiunile de tip și categorie și permite selectarea', () => {
    const onTypeChange = jest.fn();
    const onCategoryChange = jest.fn();
    render(
      <TransactionFilters
        type="income"
        category="salary"
        onTypeChange={onTypeChange}
        onCategoryChange={onCategoryChange}
        types={types}
        categories={categories}
      />
    );
    expect(screen.getByLabelText(/Tip tranzacție/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Categoria/i)).toBeInTheDocument();
    // Selectează alt tip
    fireEvent.change(screen.getByLabelText(/Tip tranzacție/i), { target: { value: 'expense' } });
    expect(onTypeChange).toHaveBeenCalledWith('expense');
    // Selectează altă categorie
    fireEvent.change(screen.getByLabelText(/Categoria/i), { target: { value: 'rent' } });
    expect(onCategoryChange).toHaveBeenCalledWith('rent');
  });
});

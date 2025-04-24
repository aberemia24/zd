import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import TransactionFilters from './TransactionFilters';
import { TransactionType, CategoryType } from '../../constants/enums';

describe('TransactionFilters', () => {
  const types = [
    { value: TransactionType.INCOME, label: 'Venit' },
    { value: TransactionType.EXPENSE, label: 'Cheltuială' },
    { value: TransactionType.SAVING, label: 'Economisire' }
  ];
  const categories = [
    { value: CategoryType.INCOME, label: 'Venituri' },
    { value: CategoryType.EXPENSE, label: 'Cheltuieli' },
    { value: CategoryType.SAVING, label: 'Economii' }
  ];

  it('afișează opțiunile de tip și categorie și permite selectarea', () => {
    const onTypeChange = jest.fn();
    const onCategoryChange = jest.fn();
    render(
      <TransactionFilters
        type={TransactionType.INCOME}
        category={CategoryType.INCOME}
        onTypeChange={onTypeChange}
        onCategoryChange={onCategoryChange}
        types={types}
        categories={categories}
      />
    );
    expect(screen.getByLabelText(/Tip tranzacție/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Categoria/i)).toBeInTheDocument();
    // Selectează alt tip
    fireEvent.change(screen.getByLabelText(/Tip tranzacție/i), { target: { value: TransactionType.EXPENSE } });
    expect(onTypeChange).toHaveBeenCalledWith(TransactionType.EXPENSE);
    // Selectează altă categorie
    fireEvent.change(screen.getByLabelText(/Categoria/i), { target: { value: CategoryType.EXPENSE } });
    expect(onCategoryChange).toHaveBeenCalledWith(CategoryType.EXPENSE);
  });
});

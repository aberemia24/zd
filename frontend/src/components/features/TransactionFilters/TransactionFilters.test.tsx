import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import TransactionFilters from './';
import { TransactionType, CategoryType } from '../../../constants/enums';
import { MOCK_OPTIONS, MOCK_LABELS, MOCK_BUTTONS, MOCK_TABLE, MOCK_PLACEHOLDERS } from '../../../test/mockData';

describe('TransactionFilters', () => {
  const types = MOCK_OPTIONS.TYPE;
  const categories = MOCK_OPTIONS.CATEGORY;

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
    expect(screen.getByLabelText(MOCK_LABELS.TYPE_FILTER)).toBeInTheDocument();
    expect(screen.getByLabelText(MOCK_LABELS.CATEGORY_FILTER)).toBeInTheDocument();
    // Selectează alt tip
    fireEvent.change(screen.getByLabelText(MOCK_LABELS.TYPE_FILTER), { target: { value: TransactionType.EXPENSE } });
    expect(onTypeChange).toHaveBeenCalledWith(TransactionType.EXPENSE);
    // Selectează altă categorie
    fireEvent.change(screen.getByLabelText(MOCK_LABELS.CATEGORY_FILTER), { target: { value: CategoryType.EXPENSE } });
    expect(onCategoryChange).toHaveBeenCalledWith(CategoryType.EXPENSE);
  });
});

import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

describe('App', () => {
  it('renderizează titlul aplicației', () => {
    render(<App />);
    expect(screen.getByText(/Budget App/i)).toBeInTheDocument();
  });
});

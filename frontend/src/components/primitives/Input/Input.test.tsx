import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Input from './Input';

describe('Input', () => {
  // Test pentru randarea de bază
  it('se randează corect cu atributele de bază', () => {
    render(<Input placeholder="Nume" />);
    expect(screen.getByPlaceholderText('Nume')).toBeInTheDocument();
  });

  // Test pentru label
  it('afișează label-ul corect', () => {
    render(<Input label="Numele tău" />);
    expect(screen.getByText('Numele tău')).toBeInTheDocument();
  });

  // Test pentru erori
  it('afișează mesajul de eroare', () => {
    render(<Input error="Acest câmp este obligatoriu" />);
    expect(screen.getByText('Acest câmp este obligatoriu')).toBeInTheDocument();
  });

  // Test pentru stilizarea corectă a erorii
  it('adaugă clasa corectă pentru borderul de eroare', () => {
    const { container } = render(<Input error="Eroare" />);
    const input = container.querySelector('input');
    expect(input).toHaveClass('border-red-500');
  });

  // Test pentru clase personalizate pe wrapper
  it('acceptă și aplică o clasă personalizată pentru wrapper', () => {
    const { container } = render(<Input wrapperClassName="test-wrapper-class" />);
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper).toHaveClass('test-wrapper-class');
  });

  // Test pentru clase personalizate pe input
  it('acceptă și aplică o clasă personalizată pentru input', () => {
    const { container } = render(<Input className="test-input-class" />);
    const input = container.querySelector('input');
    expect(input).toHaveClass('test-input-class');
  });

  // Test pentru interacțiune
  it('permite introducerea textului', async () => {
    render(<Input />);
    const input = screen.getByRole('textbox');
    await userEvent.type(input, 'Text de test');
    expect(input).toHaveValue('Text de test');
  });

  // Test pentru atribute HTML transmise
  it('permite utilizarea atributelor HTML native', () => {
    render(<Input data-testid="test-input" maxLength={10} />);
    const input = screen.getByTestId('test-input');
    expect(input).toHaveAttribute('maxLength', '10');
  });

  // Test pentru disabled
  it('respectă starea disabled', () => {
    render(<Input disabled />);
    const input = screen.getByRole('textbox');
    expect(input).toBeDisabled();
  });
});

/**
 * Test pentru Textarea - Componentă primitivă fără dependințe de store
 */
import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import Textarea from './Textarea';

describe('Textarea', () => {
  // Test pentru randarea de bază
  it('se randează corect cu atributele de bază', () => {
    render(<Textarea placeholder="Descriere" />);
    expect(screen.getByPlaceholderText('Descriere')).toBeInTheDocument();
  });

  // Test pentru label
  it('afișează label-ul corect', () => {
    render(<Textarea label="Comentariile tale" />);
    expect(screen.getByText('Comentariile tale')).toBeInTheDocument();
  });

  // Test pentru erori
  it('afișează mesajul de eroare', () => {
    render(<Textarea error="Acest câmp este obligatoriu" />);
    expect(screen.getByText('Acest câmp este obligatoriu')).toBeInTheDocument();
  });

  // Test pentru stilizarea corectă a erorii
  it('adaugă clasa corectă pentru borderul de eroare', () => {
    const { container } = render(<Textarea error="Eroare" />);
    const textarea = container.querySelector('textarea');
    expect(textarea).toHaveClass('border-red-500');
  });

  // Test pentru clase personalizate pe wrapper
  it('acceptă și aplică o clasă personalizată pentru wrapper', () => {
    const { container } = render(<Textarea wrapperClassName="test-wrapper-class" />);
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper).toHaveClass('test-wrapper-class');
  });

  // Test pentru clase personalizate pe textarea
  it('acceptă și aplică o clasă personalizată pentru textarea', () => {
    const { container } = render(<Textarea className="test-textarea-class" />);
    const textarea = container.querySelector('textarea');
    expect(textarea).toHaveClass('test-textarea-class');
  });

  // Test pentru interacțiune
  it('permite introducerea textului', async () => {
    render(<Textarea data-testid="test-textarea" />);
    const textarea = screen.getByTestId('test-textarea');
    
    await userEvent.type(textarea, 'Acesta este un text de test');
    expect(textarea).toHaveValue('Acesta este un text de test');
  });

  // Test pentru atribute HTML transmise
  it('permite utilizarea atributelor HTML native', () => {
    render(<Textarea data-testid="test-textarea" maxLength={100} rows={5} />);
    const textarea = screen.getByTestId('test-textarea');
    expect(textarea).toHaveAttribute('maxLength', '100');
    expect(textarea).toHaveAttribute('rows', '5');
  });

  // Test pentru disabled
  it('respectă starea disabled', () => {
    render(<Textarea disabled data-testid="test-textarea" />);
    const textarea = screen.getByTestId('test-textarea');
    expect(textarea).toBeDisabled();
  });

  // Test pentru onChange
  it('apelează handlerul onChange când se introduce text', async () => {
    const handleChange = jest.fn();
    render(<Textarea onChange={handleChange} data-testid="test-textarea" />);
    const textarea = screen.getByTestId('test-textarea');
    
    await userEvent.type(textarea, 'A');
    expect(handleChange).toHaveBeenCalled();
  });
});

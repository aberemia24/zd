/**
 * Test pentru Alert - Componentă primitivă fără dependințe de store
 */
import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Alert from './Alert';

describe('Alert', () => {
  // Test pentru randarea de bază
  it('se randează corect cu mesajul specificat', () => {
    render(<Alert message="Acesta este un mesaj de alertă" />);
    expect(screen.getByText('Acesta este un mesaj de alertă')).toBeInTheDocument();
  });

  // Test pentru rolul de alert pentru accesibilitate
  it('are rolul de alertă pentru accesibilitate', () => {
    render(<Alert message="Mesaj de test" />);
    expect(screen.getByRole('alert')).toBeInTheDocument();
  });

  // Teste pentru diferite tipuri de alerte și clasele lor CSS
  it('aplică clasa corectă pentru tipul success', () => {
    const { container } = render(<Alert type="success" message="Operație reușită" />);
    const alert = container.firstChild as HTMLElement;
    expect(alert).toHaveClass('bg-green-50');
    expect(alert).toHaveClass('border-green-200');
    expect(alert).toHaveClass('text-green-700');
  });

  it('aplică clasa corectă pentru tipul error', () => {
    const { container } = render(<Alert type="error" message="Eroare de procesare" />);
    const alert = container.firstChild as HTMLElement;
    expect(alert).toHaveClass('bg-red-50');
    expect(alert).toHaveClass('border-red-200');
    expect(alert).toHaveClass('text-red-700');
  });

  it('aplică clasa corectă pentru tipul warning', () => {
    const { container } = render(<Alert type="warning" message="Atenție la acțiune" />);
    const alert = container.firstChild as HTMLElement;
    expect(alert).toHaveClass('bg-yellow-50');
    expect(alert).toHaveClass('border-yellow-200');
    expect(alert).toHaveClass('text-yellow-700');
  });

  it('aplică clasa corectă pentru tipul info (default)', () => {
    const { container } = render(<Alert message="Informație importantă" />);
    const alert = container.firstChild as HTMLElement;
    expect(alert).toHaveClass('bg-blue-50');
    expect(alert).toHaveClass('border-blue-200');
    expect(alert).toHaveClass('text-blue-700');
  });

  // Test pentru clase personalizate
  it('acceptă și aplică o clasă personalizată', () => {
    const { container } = render(<Alert message="Test clasă personalizată" className="test-class" />);
    const alert = container.firstChild as HTMLElement;
    expect(alert).toHaveClass('test-class');
  });

  // Test pentru verificarea că clasa de bază este aplicată în toate cazurile
  it('menține clasele de bază indiferent de tip', () => {
    const { container } = render(<Alert message="Test clase de bază" />);
    const alert = container.firstChild as HTMLElement;
    expect(alert).toHaveClass('border');
    expect(alert).toHaveClass('rounded');
    expect(alert).toHaveClass('p-4');
    expect(alert).toHaveClass('my-2');
    expect(alert).toHaveClass('text-center');
  });
});

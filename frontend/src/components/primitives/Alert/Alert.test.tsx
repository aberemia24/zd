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
    expect(alert).toHaveClass('bg-gradient-to-r');
    expect(alert).toHaveClass('from-success-50');
    expect(alert).toHaveClass('border-l-4');
    expect(alert).toHaveClass('border-success-500');
    expect(alert).toHaveClass('text-success-800');
  });

  it('aplică clasa corectă pentru tipul error', () => {
    const { container } = render(<Alert type="error" message="Eroare de procesare" />);
    const alert = container.firstChild as HTMLElement;
    expect(alert).toHaveClass('bg-gradient-to-r');
    expect(alert).toHaveClass('from-error-50');
    expect(alert).toHaveClass('border-l-4');
    expect(alert).toHaveClass('border-error-500');
    expect(alert).toHaveClass('text-error-800');
  });

  it('aplică clasa corectă pentru tipul warning', () => {
    const { container } = render(<Alert type="warning" message="Atenție la acțiune" />);
    const alert = container.firstChild as HTMLElement;
    expect(alert).toHaveClass('bg-gradient-to-r');
    expect(alert).toHaveClass('from-warning-50');
    expect(alert).toHaveClass('border-l-4');
    expect(alert).toHaveClass('border-warning-500');
    expect(alert).toHaveClass('text-warning-800');
  });

  it('aplică clasa corectă pentru tipul info (default)', () => {
    const { container } = render(<Alert message="Informație importantă" />);
    const alert = container.firstChild as HTMLElement;
    expect(alert).toHaveClass('bg-gradient-to-r');
    expect(alert).toHaveClass('from-blue-50');
    expect(alert).toHaveClass('border-l-4');
    expect(alert).toHaveClass('border-blue-500');
    expect(alert).toHaveClass('text-blue-800');
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
    expect(alert).toHaveClass('rounded-lg');
    expect(alert).toHaveClass('p-4');
    expect(alert).toHaveClass('my-2');
    expect(alert).toHaveClass('flex');
    expect(alert).toHaveClass('items-start');
  });
});

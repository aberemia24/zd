/**
 * Test pentru Select - Componentă primitivă fără dependințe de store
 */
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import Select from './Select';

describe('Select', () => {
  // Date de test comune pentru opțiuni
  const opțiuniTest = [
    { value: 'opțiune1', label: 'Opțiunea 1' },
    { value: 'opțiune2', label: 'Opțiunea 2' },
    { value: 'opțiune3', label: 'Opțiunea 3' },
  ];

  // Test pentru randarea de bază
  it('se randează corect cu opțiunile specificate', () => {
    render(<Select options={opțiuniTest} value="" onChange={() => {}} />);
    expect(screen.getByText('Opțiunea 1')).toBeInTheDocument();
    expect(screen.getByText('Opțiunea 2')).toBeInTheDocument();
    expect(screen.getByText('Opțiunea 3')).toBeInTheDocument();
  });

  // Test pentru placeholder
  it('afișează placeholderul corect', () => {
    render(<Select options={opțiuniTest} value="" onChange={() => {}} placeholder="Alege o opțiune" />);
    expect(screen.getByText('Alege o opțiune')).toBeInTheDocument();
  });

  // Test pentru label
  it('afișează label-ul corect', () => {
    render(<Select options={opțiuniTest} value="" onChange={() => {}} label="Selecție" />);
    expect(screen.getByText('Selecție')).toBeInTheDocument();
  });

  // Test pentru erori
  it('afișează mesajul de eroare', () => {
    render(<Select options={opțiuniTest} value="" onChange={() => {}} error="Acest câmp este obligatoriu" />);
    expect(screen.getByText('Acest câmp este obligatoriu')).toBeInTheDocument();
  });

  // Test pentru stilizarea corectă a erorii
  it('adaugă clasa corectă pentru borderul de eroare', () => {
    const { container } = render(<Select options={opțiuniTest} value="" onChange={() => {}} error="Eroare" />);
    const select = container.querySelector('select');
    expect(select).toHaveClass('border-error-500');
  });

  // Test pentru clase personalizate pe wrapper
  it('acceptă și aplică o clasă personalizată pentru wrapper', () => {
    const { container } = render(<Select options={opțiuniTest} value="" onChange={() => {}} wrapperClassName="test-wrapper-class" />);
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper).toHaveClass('test-wrapper-class');
  });

  // Test pentru clase personalizate pe select
  it('acceptă și aplică o clasă personalizată pentru select', () => {
    const { container } = render(<Select options={opțiuniTest} value="" onChange={() => {}} className="test-select-class" />);
    const select = container.querySelector('select');
    expect(select).toHaveClass('test-select-class');
  });

  // Test pentru interacțiune și selectare
  it('permite selectarea unei opțiuni', async () => {
    function Wrapper() {
      const [value, setValue] = React.useState('opțiune1');
      return (
        <Select
          options={opțiuniTest}
          value={value}
          onChange={e => setValue(e.target.value)}
          data-testid="test-select"
        />
      );
    }
    render(<Wrapper />);
    const select = screen.getByTestId('test-select');
    await userEvent.selectOptions(select, 'opțiune2');
    expect(select).toHaveValue('opțiune2');
  });

  // Test pentru atribute HTML transmise
  it('permite utilizarea atributelor HTML native', () => {
    render(<Select options={opțiuniTest} value="opțiune1" onChange={() => {}} data-testid="test-select" required />);
    const select = screen.getByTestId('test-select');
    expect(select).toHaveAttribute('required');
  });

  // Test pentru disabled
  it('respectă starea disabled', () => {
    render(<Select options={opțiuniTest} disabled />);
    const select = screen.getByRole('combobox');
    expect(select).toBeDisabled();
  });
});

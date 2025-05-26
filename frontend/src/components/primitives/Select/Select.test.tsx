/**
 * Test pentru Select - Componentă primitivă fără dependințe de store
 */
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import { TEST_CONSTANTS } from '@shared-constants';
import Select from './Select';

describe('Select', () => {
  // Date de test comune pentru opțiuni
  const opțiuniTest = [
    { value: 'opțiune1', label: TEST_CONSTANTS.SELECT.OPTION_1 },
    { value: 'opțiune2', label: TEST_CONSTANTS.SELECT.OPTION_2 },
    { value: 'opțiune3', label: TEST_CONSTANTS.SELECT.OPTION_3 },
  ];

  // Test pentru randarea de bază
  it('se randează corect cu opțiunile specificate', () => {
    render(<Select options={opțiuniTest} value="" onChange={() => {}} />);
    expect(screen.getByText(TEST_CONSTANTS.SELECT.OPTION_1)).toBeInTheDocument();
    expect(screen.getByText(TEST_CONSTANTS.SELECT.OPTION_2)).toBeInTheDocument();
    expect(screen.getByText(TEST_CONSTANTS.SELECT.OPTION_3)).toBeInTheDocument();
  });

  // Test pentru placeholder
  it('afișează placeholderul corect', () => {
    render(<Select options={opțiuniTest} value="" onChange={() => {}} placeholder={TEST_CONSTANTS.SELECT.PLACEHOLDER} />);
    expect(screen.getByText(TEST_CONSTANTS.SELECT.PLACEHOLDER)).toBeInTheDocument();
  });

  // Test pentru label
  it('afișează label-ul corect', () => {
    render(<Select options={opțiuniTest} value="" onChange={() => {}} label={TEST_CONSTANTS.SELECT.LABEL} />);
    expect(screen.getByText(TEST_CONSTANTS.SELECT.LABEL)).toBeInTheDocument();
  });

  // Test pentru erori
  it('afișează mesajul de eroare', () => {
    render(<Select options={opțiuniTest} value="" onChange={() => {}} error={TEST_CONSTANTS.SELECT.REQUIRED_ERROR} />);
    expect(screen.getByText(TEST_CONSTANTS.SELECT.REQUIRED_ERROR)).toBeInTheDocument();
  });

  // Test pentru funcționalitate - nu clase CSS
  it('funcționează corect când există eroare', () => {
    render(<Select options={opțiuniTest} value="" onChange={() => {}} error={TEST_CONSTANTS.COMMON.ERROR_GENERIC} />);
    const select = screen.getByRole('combobox');
    expect(select).toBeInTheDocument();
    expect(screen.getByText(TEST_CONSTANTS.COMMON.ERROR_GENERIC)).toBeInTheDocument();
  });

  // Test pentru clase personalizate - comportament
  it('funcționează cu clase personalizate', () => {
    render(<Select options={opțiuniTest} value="" onChange={() => {}} wrapperClassName="test-wrapper-class" />);
    expect(screen.getByRole('combobox')).toBeInTheDocument();
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

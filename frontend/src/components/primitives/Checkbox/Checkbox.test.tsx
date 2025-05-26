/**
 * Test pentru Checkbox - Componentă primitivă fără dependințe de store
 */
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import { TEST_CONSTANTS } from '@shared-constants';
import Checkbox from './Checkbox';

describe('Checkbox', () => {
  // Test pentru randarea de bază
  it('se randează corect cu atributele de bază', () => {
    render(<Checkbox data-testid="test-checkbox" />);
    expect(screen.getByTestId('test-checkbox')).toBeInTheDocument();
    expect(screen.getByTestId('test-checkbox')).toHaveAttribute('type', 'checkbox');
  });

  // Test pentru label
  it('afișează label-ul corect', () => {
    render(<Checkbox label={TEST_CONSTANTS.CHECKBOX.LABEL} />);
    expect(screen.getByText(TEST_CONSTANTS.CHECKBOX.LABEL)).toBeInTheDocument();
  });

  // Test pentru erori
  it('afișează mesajul de eroare', () => {
    render(<Checkbox label={TEST_CONSTANTS.CHECKBOX.LABEL} error={TEST_CONSTANTS.CHECKBOX.REQUIRED_ERROR} />);
    expect(screen.getByText(TEST_CONSTANTS.CHECKBOX.REQUIRED_ERROR)).toBeInTheDocument();
  });

  // Test pentru funcționalitate - nu pentru CSS classes
  it('funcționează cu clase personalizate', () => {
    render(<Checkbox wrapperClassName="test-wrapper-class" className="test-checkbox-class" />);
    expect(screen.getByRole('checkbox')).toBeInTheDocument();
  });

  // Test pentru interacțiune - bifarea/debifarea checkbox-ului
  it('permite bifarea și debifarea', async () => {
    const user = userEvent.setup();
    function Wrapper() {
      const [checked, setChecked] = React.useState(false);
      return (
        <Checkbox
          label={TEST_CONSTANTS.CHECKBOX.CHECKED_LABEL}
          checked={checked}
          onChange={(e) => setChecked(e.target.checked)}
        />
      );
    }

    render(<Wrapper />);
    const checkbox = screen.getByRole('checkbox');
    
    expect(checkbox).not.toBeChecked();
    await user.click(checkbox);
    expect(checkbox).toBeChecked();
  });

  // Test pentru valoarea inițială (checked prop)
  it('respectă proprietatea checked pentru starea inițială', () => {
    render(<Checkbox checked data-testid="test-checkbox" onChange={() => {}} />);
    const checkbox = screen.getByTestId('test-checkbox');
    expect(checkbox).toBeChecked();
  });

  // Test pentru disabled
  it('respectă starea disabled', () => {
    render(<Checkbox label={TEST_CONSTANTS.CHECKBOX.LABEL} disabled />);
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toBeDisabled();
  });

  // Test pentru onChange
  it('apelează handlerul onChange când starea se schimbă', async () => {
    const handleChange = vi.fn();
    render(<Checkbox label={TEST_CONSTANTS.CHECKBOX.LABEL} onChange={handleChange} />);
    
    const checkbox = screen.getByRole('checkbox');
    await userEvent.click(checkbox);
    
    expect(handleChange).toHaveBeenCalledTimes(1);
  });
});

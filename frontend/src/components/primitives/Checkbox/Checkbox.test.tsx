/**
 * Test pentru Checkbox - Componentă primitivă fără dependințe de store
 */
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
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
    render(<Checkbox label="Acceptă termenii" />);
    expect(screen.getByText('Acceptă termenii')).toBeInTheDocument();
  });

  // Test pentru erori
  it('afișează mesajul de eroare', () => {
    render(<Checkbox error="Acest câmp este obligatoriu" />);
    expect(screen.getByText('Acest câmp este obligatoriu')).toBeInTheDocument();
  });

  // Test pentru clase personalizate pe wrapper
  it('acceptă și aplică o clasă personalizată pentru wrapper', () => {
    const { container } = render(<Checkbox wrapperClassName="test-wrapper-class" />);
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper).toHaveClass('test-wrapper-class');
  });

  // Test pentru clase personalizate pe checkbox
  it('acceptă și aplică o clasă personalizată pentru checkbox', () => {
    const { container } = render(<Checkbox className="test-checkbox-class" />);
    const checkbox = container.querySelector('input[type="checkbox"]');
    expect(checkbox).toHaveClass('test-checkbox-class');
  });

  // Test pentru interacțiune - bifarea/debifarea checkbox-ului
  it('permite bifarea și debifarea', async () => {
    render(<Checkbox data-testid="test-checkbox" />);
    const checkbox = screen.getByTestId('test-checkbox');
    
    // Inițial este debifat
    expect(checkbox).not.toBeChecked();
    
    // Bifează checkbox-ul
    await userEvent.click(checkbox);
    expect(checkbox).toBeChecked();
    
    // Debifează checkbox-ul
    await userEvent.click(checkbox);
    expect(checkbox).not.toBeChecked();
  });

  // Test pentru valoarea inițială (checked prop)
  it('respectă proprietatea checked pentru starea inițială', () => {
    render(<Checkbox checked data-testid="test-checkbox" onChange={() => {}} />);
    const checkbox = screen.getByTestId('test-checkbox');
    expect(checkbox).toBeChecked();
  });

  // Test pentru disabled
  it('respectă starea disabled', () => {
    render(<Checkbox disabled data-testid="test-checkbox" />);
    const checkbox = screen.getByTestId('test-checkbox');
    expect(checkbox).toBeDisabled();
  });

  // Test pentru onChange
  it('apelează handlerul onChange când starea se schimbă', async () => {
    const handleChange = jest.fn();
    render(<Checkbox onChange={handleChange} data-testid="test-checkbox" />);
    const checkbox = screen.getByTestId('test-checkbox');
    
    await userEvent.click(checkbox);
    expect(handleChange).toHaveBeenCalledTimes(1);
  });
});

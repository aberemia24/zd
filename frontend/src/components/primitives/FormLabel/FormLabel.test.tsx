import React from 'react';
import { render, screen } from '@testing-library/react';
import FormLabel from './FormLabel';

describe('FormLabel', () => {
  it('renders correctly with basic props', () => {
    render(<FormLabel htmlFor="test-input">Test Label</FormLabel>);
    
    const label = screen.getByText('Test Label');
    expect(label).toBeInTheDocument();
    expect(label.tagName).toBe('LABEL');
    expect(label).toHaveAttribute('for', 'test-input');
  });

  it('applies default variant styling', () => {
    render(<FormLabel>Default Label</FormLabel>);
    
    const label = screen.getByText('Default Label');
    expect(label).toHaveClass('text-carbon-900');
    expect(label).toHaveClass('dark:text-carbon-100');
  });

  it('applies error variant styling', () => {
    render(<FormLabel variant="error">Error Label</FormLabel>);
    
    const label = screen.getByText('Error Label');
    expect(label).toHaveClass('text-red-600');
    expect(label).toHaveClass('dark:text-red-400');
  });

  it('applies success variant styling', () => {
    render(<FormLabel variant="success">Success Label</FormLabel>);
    
    const label = screen.getByText('Success Label');
    expect(label).toHaveClass('text-emerald-600');
    expect(label).toHaveClass('dark:text-emerald-400');
  });

  it('applies muted variant styling', () => {
    render(<FormLabel variant="muted">Muted Label</FormLabel>);
    
    const label = screen.getByText('Muted Label');
    expect(label).toHaveClass('text-carbon-500');
    expect(label).toHaveClass('dark:text-carbon-400');
  });

  it('shows required indicator when required=true', () => {
    render(<FormLabel required>Required Label</FormLabel>);
    
    const label = screen.getByText('Required Label');
    expect(label).toHaveClass('after:content-[\'*\']');
    expect(label).toHaveClass('after:ml-0.5');
    expect(label).toHaveClass('after:text-red-600');
  });

  it('does not show required indicator when required=false', () => {
    render(<FormLabel required={false}>Optional Label</FormLabel>);
    
    const label = screen.getByText('Optional Label');
    expect(label).not.toHaveClass('after:content-[\'*\']');
  });

  it('applies custom className', () => {
    render(<FormLabel className="custom-class">Custom Label</FormLabel>);
    
    const label = screen.getByText('Custom Label');
    expect(label).toHaveClass('custom-class');
  });

  it('forwards ref correctly', () => {
    const ref = React.createRef<HTMLLabelElement>();
    render(<FormLabel ref={ref}>Ref Label</FormLabel>);
    
    expect(ref.current).toBeInstanceOf(HTMLLabelElement);
    expect(ref.current?.textContent).toBe('Ref Label');
  });

  it('passes through additional HTML attributes', () => {
    render(
      <FormLabel 
        htmlFor="test-input"
        data-testid="test-label"
        aria-describedby="help-text"
      >
        Accessible Label
      </FormLabel>
    );
    
    const label = screen.getByTestId('test-label');
    expect(label).toHaveAttribute('for', 'test-input');
    expect(label).toHaveAttribute('aria-describedby', 'help-text');
  });

  it('combines required and variant styling correctly', () => {
    render(<FormLabel variant="error" required>Error Required Label</FormLabel>);
    
    const label = screen.getByText('Error Required Label');
    expect(label).toHaveClass('text-red-600');
    expect(label).toHaveClass('dark:text-red-400');
    expect(label).toHaveClass('after:content-[\'*\']');
    expect(label).toHaveClass('after:ml-0.5');
  });
}); 
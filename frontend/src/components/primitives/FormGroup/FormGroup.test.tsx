import React from 'react';
import { render, screen } from '@testing-library/react';
import FormGroup from './FormGroup';

describe('FormGroup', () => {
  it('renders correctly with basic props', () => {
    render(
      <FormGroup data-testid="form-group">
        <div>Form content</div>
      </FormGroup>
    );
    
    const formGroup = screen.getByTestId('form-group');
    expect(formGroup).toBeInTheDocument();
    expect(formGroup.tagName).toBe('DIV');
    expect(screen.getByText('Form content')).toBeInTheDocument();
  });

  it('applies default variant styling', () => {
    render(
      <FormGroup data-testid="form-group">
        <div>Default content</div>
      </FormGroup>
    );
    
    const formGroup = screen.getByTestId('form-group');
    expect(formGroup).toHaveClass('flex');
    expect(formGroup).toHaveClass('flex-col');
    expect(formGroup).toHaveClass('space-y-1.5');
    expect(formGroup).toHaveClass('mb-4');
  });

  it('applies inline variant styling', () => {
    render(
      <FormGroup variant="inline" data-testid="form-group">
        <div>Inline content</div>
      </FormGroup>
    );
    
    const formGroup = screen.getByTestId('form-group');
    expect(formGroup).toHaveClass('sm:flex-row');
    expect(formGroup).toHaveClass('sm:items-center');
    expect(formGroup).toHaveClass('sm:space-y-0');
    expect(formGroup).toHaveClass('sm:space-x-4');
  });

  it('applies grid variant styling', () => {
    render(
      <FormGroup variant="grid" data-testid="form-group">
        <div>Grid content</div>
      </FormGroup>
    );
    
    const formGroup = screen.getByTestId('form-group');
    expect(formGroup).toHaveClass('grid');
    expect(formGroup).toHaveClass('grid-cols-1');
    expect(formGroup).toHaveClass('sm:grid-cols-2');
    expect(formGroup).toHaveClass('lg:grid-cols-3');
    expect(formGroup).toHaveClass('gap-4');
  });

  it('applies custom className', () => {
    render(
      <FormGroup className="custom-class" data-testid="form-group">
        <div>Custom content</div>
      </FormGroup>
    );
    
    const formGroup = screen.getByTestId('form-group');
    expect(formGroup).toHaveClass('custom-class');
  });

  it('forwards ref correctly', () => {
    const ref = React.createRef<HTMLDivElement>();
    render(
      <FormGroup ref={ref}>
        <div>Ref content</div>
      </FormGroup>
    );
    
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
    expect(ref.current?.textContent).toBe('Ref content');
  });

  it('applies ARIA attributes correctly', () => {
    render(
      <FormGroup 
        role="group"
        aria-labelledby="group-label"
        aria-describedby="group-description"
        data-testid="form-group"
      >
        <div>ARIA content</div>
      </FormGroup>
    );
    
    const formGroup = screen.getByTestId('form-group');
    expect(formGroup).toHaveAttribute('role', 'group');
    expect(formGroup).toHaveAttribute('aria-labelledby', 'group-label');
    expect(formGroup).toHaveAttribute('aria-describedby', 'group-description');
  });

  it('passes through additional HTML attributes', () => {
    render(
      <FormGroup 
        data-testid="form-group"
        data-custom="custom-value"
        id="form-group-id"
      >
        <div>Additional attributes content</div>
      </FormGroup>
    );
    
    const formGroup = screen.getByTestId('form-group');
    expect(formGroup).toHaveAttribute('data-custom', 'custom-value');
    expect(formGroup).toHaveAttribute('id', 'form-group-id');
  });

  it('renders multiple children correctly', () => {
    render(
      <FormGroup data-testid="form-group">
        <div>First child</div>
        <div>Second child</div>
        <div>Third child</div>
      </FormGroup>
    );
    
    const formGroup = screen.getByTestId('form-group');
    expect(formGroup).toBeInTheDocument();
    expect(screen.getByText('First child')).toBeInTheDocument();
    expect(screen.getByText('Second child')).toBeInTheDocument();
    expect(screen.getByText('Third child')).toBeInTheDocument();
  });

  it('combines variant and custom className correctly', () => {
    render(
      <FormGroup 
        variant="inline" 
        className="custom-spacing"
        data-testid="form-group"
      >
        <div>Combined styling content</div>
      </FormGroup>
    );
    
    const formGroup = screen.getByTestId('form-group');
    expect(formGroup).toHaveClass('sm:flex-row');
    expect(formGroup).toHaveClass('custom-spacing');
  });
}); 

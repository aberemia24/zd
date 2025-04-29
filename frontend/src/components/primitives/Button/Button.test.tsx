import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Button from './Button';

describe('Button', () => {
  // Test pentru randarea de bază
  it('se randează corect cu conținut text', () => {
    render(<Button data-testid="button-field">Buton Test</Button>);
    expect(screen.getByTestId('button-field')).toBeInTheDocument();
  });

  // Test pentru clasele CSS bazate pe variante
  it('aplică clasa css corectă pentru varianta primară', () => {
    const { container } = render(<Button variant="primary" data-testid="button-field">Buton Primar</Button>);
    const button = container.firstChild as HTMLElement;
    expect(button).toHaveClass('btn-primary');
  });

  it('aplică clasa css corectă pentru varianta secundară', () => {
    const { container } = render(<Button variant="secondary" data-testid="button-field">Buton Secundar</Button>);
    const button = container.firstChild as HTMLElement;
    expect(button).toHaveClass('btn-secondary');
  });

  // Test pentru clasa personalizată
  it('acceptă și aplică o clasă personalizată', () => {
    const { container } = render(<Button className="test-class" data-testid="button-field">Buton cu clasă</Button>);
    const button = container.firstChild as HTMLElement;
    expect(button).toHaveClass('test-class');
  });

  // Test pentru proprietatea disabled
  it('aplică atributul disabled corect', () => {
    render(<Button disabled data-testid="button-field">Buton Dezactivat</Button>);
    expect(screen.getByTestId('button-field')).toBeDisabled();
    expect(screen.getByTestId('button-field')).toHaveClass('opacity-50');
  });

  // Test pentru tipurile de buton
  it('setează tipul butonului corect', () => {
    render(<Button type="submit" data-testid="button-field">Buton Submit</Button>);
    expect(screen.getByTestId('button-field')).toHaveAttribute('type', 'submit');
  });

  // Test pentru handlerul de click
  it('apelează handlerul onClick când butonul este apăsat', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Buton Clicabil</Button>);
    
    fireEvent.click(screen.getByText('Buton Clicabil'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  // Test pentru verificarea că handlerul onClick nu este apelat când butonul este dezactivat
  it('nu apelează onClick când butonul este dezactivat', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick} disabled data-testid="button-field">Buton Dezactivat</Button>);
    
    fireEvent.click(screen.getByTestId('button-field'));
    expect(handleClick).not.toHaveBeenCalled();
  });
});

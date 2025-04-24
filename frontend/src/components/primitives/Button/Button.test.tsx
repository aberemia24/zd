import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Button from './Button';

describe('Button', () => {
  // Test pentru randarea de bază
  it('se randează corect cu conținut text', () => {
    render(<Button>Buton Test</Button>);
    expect(screen.getByText('Buton Test')).toBeInTheDocument();
  });

  // Test pentru clasele CSS bazate pe variante
  it('aplică clasa css corectă pentru varianta primară', () => {
    const { container } = render(<Button variant="primary">Buton Primar</Button>);
    const button = container.firstChild as HTMLElement;
    expect(button).toHaveClass('btn-primary');
  });

  it('aplică clasa css corectă pentru varianta secundară', () => {
    const { container } = render(<Button variant="secondary">Buton Secundar</Button>);
    const button = container.firstChild as HTMLElement;
    expect(button).toHaveClass('btn-secondary');
  });

  // Test pentru clasa personalizată
  it('acceptă și aplică o clasă personalizată', () => {
    const { container } = render(<Button className="test-class">Buton cu clasă</Button>);
    const button = container.firstChild as HTMLElement;
    expect(button).toHaveClass('test-class');
  });

  // Test pentru proprietatea disabled
  it('aplică atributul disabled corect', () => {
    render(<Button disabled>Buton Dezactivat</Button>);
    expect(screen.getByText('Buton Dezactivat')).toBeDisabled();
    expect(screen.getByText('Buton Dezactivat')).toHaveClass('opacity-50');
  });

  // Test pentru tipurile de buton
  it('setează tipul butonului corect', () => {
    render(<Button type="submit">Buton Submit</Button>);
    expect(screen.getByText('Buton Submit')).toHaveAttribute('type', 'submit');
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
    render(<Button onClick={handleClick} disabled>Buton Dezactivat</Button>);
    
    fireEvent.click(screen.getByText('Buton Dezactivat'));
    expect(handleClick).not.toHaveBeenCalled();
  });
});

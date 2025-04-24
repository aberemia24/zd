import React from 'react';
import { render, screen } from '@testing-library/react';
import Loader from './Loader';
import { LOADER } from '../../../constants/ui';

describe('Loader', () => {
  // Test pentru randarea de bază
  it('se randează corect cu textul din constants/ui.ts', () => {
    render(<Loader />);
    // Verificăm că se folosește textul centralizat din constants/ui.ts
    expect(screen.getByTestId('loader-text')).toHaveTextContent(LOADER.TEXT);
  });

  // Test pentru prezența SVG-ului de animație
  it('conține elementul SVG de animație', () => {
    const { container } = render(<Loader />);
    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
    expect(svg).toHaveClass('animate-spin');
  });

  // Test pentru clasele CSS
  it('conține clasele CSS corecte pentru container', () => {
    const { container } = render(<Loader />);
    const loaderContainer = container.firstChild as HTMLElement;
    expect(loaderContainer).toHaveClass('flex');
    expect(loaderContainer).toHaveClass('justify-center');
    expect(loaderContainer).toHaveClass('items-center');
  });

  // Test pentru accesibilitate - prezența elementului text pentru screenreaders
  it('conține text pentru accesibilitate', () => {
    render(<Loader />);
    const textElement = screen.getByTestId('loader-text');
    expect(textElement).toBeInTheDocument();
    expect(textElement).toHaveClass('text-gray-600');
  });

  // Test pentru structura corectă a animației
  it('conține elementele corecte pentru animația de loading', () => {
    const { container } = render(<Loader />);
    const circle = container.querySelector('circle');
    const path = container.querySelector('path');
    
    expect(circle).toBeInTheDocument();
    expect(circle).toHaveClass('opacity-25');
    
    expect(path).toBeInTheDocument();
    expect(path).toHaveClass('opacity-75');
  });
});

/**
 * Test pentru ErrorBoundary - Componentă primitivă fără dependințe de store
 */
import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import ErrorBoundary from './ErrorBoundary';
import { MESAJE } from '@shared-constants';

// Componentă cu eroare pentru a testa ErrorBoundary
function ComponentCuEroare({ shouldThrow = false }: { shouldThrow?: boolean }) {
  if (shouldThrow) {
    throw new Error('Test error message');
  }
  return <div data-testid="component-fara-eroare">Conținut fără erori</div>;
}

// Mock pentru console.error pentru a preveni logarea în teste
const originalConsoleError = console.error;
beforeAll(() => {
  console.error = jest.fn();
});

afterAll(() => {
  console.error = originalConsoleError;
});

describe('ErrorBoundary', () => {
  it('renderează copiii când nu există erori', () => {
    render(
      <ErrorBoundary>
        <ComponentCuEroare />
      </ErrorBoundary>
    );
    
    expect(screen.getByTestId('component-fara-eroare')).toBeInTheDocument();
  });

  it('afișează mesajul de eroare când o componentă copil aruncă o eroare', () => {
    // Suprimăm eroarea console pentru acest test
    const errorSpy = jest.spyOn(console, 'error');
    errorSpy.mockImplementation(() => {});

    // Renderăm ErrorBoundary cu o componentă ce aruncă o eroare
    render(
      <ErrorBoundary>
        <ComponentCuEroare shouldThrow={true} />
      </ErrorBoundary>
    );

    // Verificăm că UI-ul de eroare este afișat
    expect(screen.getByText(MESAJE.EROARE_TITLU)).toBeInTheDocument();
    expect(screen.getByText('Test error message')).toBeInTheDocument();

    // Curățăm spy-ul
    errorSpy.mockRestore();
  });

  it('afișează mesajul de eroare generală când mesajul de eroare lipsește', () => {
    // Suprimăm eroarea console pentru acest test
    const errorSpy = jest.spyOn(console, 'error');
    errorSpy.mockImplementation(() => {});

    // Mockăm getDerivedStateFromError pentru a simula un error fără mesaj
    const originalGetDerivedStateFromError = ErrorBoundary.getDerivedStateFromError;
    // Folosim un obiect Error gol, dar cu mesaj null pentru a simula lipsa mesajului
    const errorFaraMesaj = new Error();
    // @ts-ignore - în mod deliberat eliminăm mesajul pentru a testa cazul limită
    errorFaraMesaj.message = null;
    ErrorBoundary.getDerivedStateFromError = () => ({ hasError: true, error: errorFaraMesaj });

    // Renderăm ErrorBoundary cu o componentă ce aruncă o eroare
    render(
      <ErrorBoundary>
        <ComponentCuEroare shouldThrow={true} />
      </ErrorBoundary>
    );

    // Verificăm că mesajul generic de eroare este afișat
    expect(screen.getByText(MESAJE.EROARE_GENERALA)).toBeInTheDocument();

    // Restaurăm funcția originală
    ErrorBoundary.getDerivedStateFromError = originalGetDerivedStateFromError;
    errorSpy.mockRestore();
  });

  it('apelează console.error când o eroare este prinsă', () => {
    // Creăm un spy pentru console.error
    const errorSpy = jest.spyOn(console, 'error');
    errorSpy.mockImplementation(() => {});

    // Renderăm ErrorBoundary cu o componentă ce aruncă o eroare
    render(
      <ErrorBoundary>
        <ComponentCuEroare shouldThrow={true} />
      </ErrorBoundary>
    );

    // Verificăm că console.error a fost apelat
    expect(errorSpy).toHaveBeenCalled();

    // Curățăm spy-ul
    errorSpy.mockRestore();
  });

  it('are stilizare UI corectă pentru starea de eroare', () => {
    // Suprimăm eroarea console pentru acest test
    const errorSpy = jest.spyOn(console, 'error');
    errorSpy.mockImplementation(() => {});

    // Renderăm ErrorBoundary cu o componentă ce aruncă o eroare
    const { container } = render(
      <ErrorBoundary>
        <ComponentCuEroare shouldThrow={true} />
      </ErrorBoundary>
    );

    // Verificăm că containerul de eroare are clasele Tailwind corecte
    const errorContainer = container.firstChild as HTMLElement;
    expect(errorContainer).toHaveClass('bg-red-50');
    expect(errorContainer).toHaveClass('border');
    expect(errorContainer).toHaveClass('border-red-200');
    expect(errorContainer).toHaveClass('rounded');

    // Verificăm că titlul are stilizarea corectă
    const errorTitle = screen.getByText(MESAJE.EROARE_TITLU);
    expect(errorTitle).toHaveClass('text-lg');
    expect(errorTitle).toHaveClass('font-bold');
    expect(errorTitle).toHaveClass('text-red-700');

    // Curățăm spy-ul
    errorSpy.mockRestore();
  });
});

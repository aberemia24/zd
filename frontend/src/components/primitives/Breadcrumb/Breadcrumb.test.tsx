import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Breadcrumb, { useBreadcrumb, type BreadcrumbItem } from './Breadcrumb';

// Mock pentru NAVIGATION constants
jest.mock('@budget-app/shared-constants', () => ({
  NAVIGATION: {
    BREADCRUMBS: {
      HOME: 'Acasă',
      SEPARATOR: '/',
      BACK_TO: 'Înapoi la',
      CURRENT_PAGE: 'Pagina curentă'
    },
    ARIA: {
      BREADCRUMB: 'Navigare breadcrumb'
    }
  }
}));

// Wrapper pentru router
const RouterWrapper: React.FC<{ 
  children: React.ReactNode;
  initialEntries?: string[];
}> = ({ children, initialEntries = ['/'] }) => (
  <MemoryRouter initialEntries={initialEntries}>
    {children}
  </MemoryRouter>
);

// Test data
const mockBreadcrumbItems: BreadcrumbItem[] = [
  { id: 'home', label: 'Acasă', href: '/', icon: '🏠' },
  { id: 'transactions', label: 'Tranzacții', href: '/transactions' },
  { id: 'details', label: 'Detalii', href: '/transactions/123' },
  { id: 'current', label: 'Pagina curentă' } // fără href = current page
];

describe('Breadcrumb Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // =============================================================================
  // BASIC RENDERING TESTS
  // =============================================================================

  it('renderează corect cu items basic', () => {
    render(
      <RouterWrapper>
        <Breadcrumb items={mockBreadcrumbItems} testId="breadcrumb-test" />
      </RouterWrapper>
    );

    expect(screen.getByTestId('breadcrumb-test')).toBeInTheDocument();
    expect(screen.getByLabelText('Navigare breadcrumb')).toBeInTheDocument();
    
    // Verifică că toate items sunt prezente
    mockBreadcrumbItems.forEach(item => {
      expect(screen.getByText(item.label)).toBeInTheDocument();
    });
  });

  it('renderează separatori între items', () => {
    render(
      <RouterWrapper>
        <Breadcrumb 
          items={mockBreadcrumbItems} 
          separatorType="chevron"
          testId="breadcrumb-test" 
        />
      </RouterWrapper>
    );

    // Ar trebui să avem 3 separatori pentru 4 items
    const separators = screen.getAllByTestId(/breadcrumb-test-separator-/);
    expect(separators).toHaveLength(3);
  });

  it('nu renderează nimic dacă nu există items', () => {
    render(
      <RouterWrapper>
        <Breadcrumb items={[]} testId="breadcrumb-test" />
      </RouterWrapper>
    );

    expect(screen.queryByTestId('breadcrumb-test')).not.toBeInTheDocument();
  });

  // =============================================================================
  // SEPARATOR TYPES TESTS  
  // =============================================================================

  it('renderează separator chevron (default)', () => {
    render(
      <RouterWrapper>
        <Breadcrumb 
          items={mockBreadcrumbItems.slice(0, 2)} 
          testId="breadcrumb-test" 
        />
      </RouterWrapper>
    );

    const separator = screen.getByTestId('breadcrumb-test-separator-0');
    expect(separator).toHaveClass('before:content-[\'›\']');
  });

  it('renderează separator slash', () => {
    render(
      <RouterWrapper>
        <Breadcrumb 
          items={mockBreadcrumbItems.slice(0, 2)} 
          separatorType="slash"
          testId="breadcrumb-test" 
        />
      </RouterWrapper>
    );

    const separator = screen.getByTestId('breadcrumb-test-separator-0');
    expect(separator).toHaveClass('before:content-[\'/\']');
  });

  it('renderează separator arrow', () => {
    render(
      <RouterWrapper>
        <Breadcrumb 
          items={mockBreadcrumbItems.slice(0, 2)} 
          separatorType="arrow"
          testId="breadcrumb-test" 
        />
      </RouterWrapper>
    );

    const separator = screen.getByTestId('breadcrumb-test-separator-0');
    expect(separator).toHaveClass('before:content-[\'→\']');
  });

  // =============================================================================
  // NAVIGATION TESTS
  // =============================================================================

  it('renderează links pentru items cu href', () => {
    render(
      <RouterWrapper>
        <Breadcrumb items={mockBreadcrumbItems} testId="breadcrumb-test" />
      </RouterWrapper>
    );

    // Primele 3 items ar trebui să fie link-uri
    const homeLink = screen.getByTestId('breadcrumb-test-item-0');
    const transactionsLink = screen.getByTestId('breadcrumb-test-item-1');
    const detailsLink = screen.getByTestId('breadcrumb-test-item-2');
    
    expect(homeLink.tagName).toBe('A');
    expect(transactionsLink.tagName).toBe('A');
    expect(detailsLink.tagName).toBe('A');

    // Ultimul item nu ar trebui să fie link
    const currentItem = screen.getByTestId('breadcrumb-test-item-3');
    expect(currentItem.tagName).toBe('SPAN');
  });

  it('apelează onItemClick când se face click pe item', () => {
    const mockOnClick = jest.fn();
    
    render(
      <RouterWrapper>
        <Breadcrumb 
          items={mockBreadcrumbItems} 
          onItemClick={mockOnClick}
          testId="breadcrumb-test" 
        />
      </RouterWrapper>
    );

    const homeLink = screen.getByTestId('breadcrumb-test-item-0');
    fireEvent.click(homeLink);

    expect(mockOnClick).toHaveBeenCalledWith(mockBreadcrumbItems[0], 0);
  });

  // =============================================================================
  // AUTO PATH TESTS
  // =============================================================================

  it('generează automat breadcrumbs din path-ul curent', () => {
    render(
      <RouterWrapper initialEntries={['/transactions/123/details']}>
        <Breadcrumb 
          autoPath={true} 
          testId="breadcrumb-test"
        />
      </RouterWrapper>
    );

    expect(screen.getByText('Acasă')).toBeInTheDocument();
    expect(screen.getByText('Transactions')).toBeInTheDocument();
    expect(screen.getByText('123')).toBeInTheDocument();
    expect(screen.getByText('Details')).toBeInTheDocument();
  });

  it('folosește pathLabels custom pentru autoPath', () => {
    const pathLabels = {
      '/transactions': 'Tranzacții Personalizate',
      '123': 'Tranzacția #123',
      '/transactions/123/details': 'Detalii Complete'
    };

    render(
      <RouterWrapper initialEntries={['/transactions/123/details']}>
        <Breadcrumb 
          autoPath={true}
          pathLabels={pathLabels}
          testId="breadcrumb-test"
        />
      </RouterWrapper>
    );

    expect(screen.getByText('Tranzacții Personalizate')).toBeInTheDocument();
    expect(screen.getByText('Tranzacția #123')).toBeInTheDocument();
    expect(screen.getByText('Detalii Complete')).toBeInTheDocument();
  });

  // =============================================================================
  // MAX ITEMS TESTS
  // =============================================================================

  it('limitează numărul de items afișate cu maxItems', () => {
    const manyItems: BreadcrumbItem[] = [
      { id: '1', label: 'Item 1', href: '/1' },
      { id: '2', label: 'Item 2', href: '/2' },
      { id: '3', label: 'Item 3', href: '/3' },
      { id: '4', label: 'Item 4', href: '/4' },
      { id: '5', label: 'Item 5', href: '/5' },
      { id: '6', label: 'Item 6' }
    ];

    render(
      <RouterWrapper>
        <Breadcrumb 
          items={manyItems}
          maxItems={4}
          testId="breadcrumb-test"
        />
      </RouterWrapper>
    );

    // Ar trebui să avem: Item 1, ..., Item 5, Item 6
    expect(screen.getByText('Item 1')).toBeInTheDocument();
    expect(screen.getByTestId('breadcrumb-test-ellipsis')).toBeInTheDocument();
    expect(screen.getByText('Item 5')).toBeInTheDocument();
    expect(screen.getByText('Item 6')).toBeInTheDocument();
    
    // Items din mijloc nu ar trebui să fie prezente
    expect(screen.queryByText('Item 2')).not.toBeInTheDocument();
    expect(screen.queryByText('Item 3')).not.toBeInTheDocument();
    expect(screen.queryByText('Item 4')).not.toBeInTheDocument();
  });

  // =============================================================================
  // ACCESSIBILITY TESTS
  // =============================================================================

  it('are ARIA labels corecte', () => {
    render(
      <RouterWrapper>
        <Breadcrumb items={mockBreadcrumbItems} testId="breadcrumb-test" />
      </RouterWrapper>
    );

    const nav = screen.getByRole('navigation');
    expect(nav).toHaveAttribute('aria-label', 'Navigare breadcrumb');

    // Ultimul item ar trebui să aibă aria-current="page"
    const lastItem = screen.getByTestId('breadcrumb-test-item-3');
    expect(lastItem).toHaveAttribute('aria-current', 'page');
  });

  it('are focus states pentru keyboard navigation', () => {
    render(
      <RouterWrapper>
        <Breadcrumb items={mockBreadcrumbItems} testId="breadcrumb-test" />
      </RouterWrapper>
    );

    const homeLink = screen.getByTestId('breadcrumb-test-item-0');
    expect(homeLink).toHaveClass('focus-visible:ring-2');
    expect(homeLink).toHaveClass('focus-visible:ring-copper-500');
  });

  // =============================================================================
  // ICONS TESTS
  // =============================================================================

  it('renderează iconuri pentru items', () => {
    render(
      <RouterWrapper>
        <Breadcrumb items={mockBreadcrumbItems} testId="breadcrumb-test" />
      </RouterWrapper>
    );

    // Home item ar trebui să aibă iconul 🏠
    const homeItem = screen.getByTestId('breadcrumb-test-item-0');
    expect(homeItem).toHaveTextContent('🏠');
  });

  // =============================================================================
  // VARIANTS TESTS
  // =============================================================================

  it('suportă variant compact', () => {
    render(
      <RouterWrapper>
        <Breadcrumb 
          items={mockBreadcrumbItems} 
          variant="compact"
          testId="breadcrumb-test" 
        />
      </RouterWrapper>
    );

    const breadcrumb = screen.getByTestId('breadcrumb-test');
         expect(breadcrumb).toHaveClass('space-x-1');
     expect(breadcrumb).toHaveClass('text-xs');
  });
});

// =============================================================================
// HOOK TESTS
// =============================================================================

describe('useBreadcrumb Hook', () => {
  // Test component pentru hook
  const TestHookComponent: React.FC<{ pathLabels?: Record<string, string> }> = ({ pathLabels }) => {
    const { breadcrumbs, currentPage, pathDepth } = useBreadcrumb(pathLabels);
    
    return (
      <div>
        <div data-testid="breadcrumbs-count">{breadcrumbs.length}</div>
        <div data-testid="current-page">{currentPage}</div>
        <div data-testid="path-depth">{pathDepth}</div>
        {breadcrumbs.map((item, index) => (
          <div key={index} data-testid={`breadcrumb-${index}`}>
            {item.label}
          </div>
        ))}
      </div>
    );
  };

  it('generează breadcrumbs din path-ul curent', () => {
    render(
      <RouterWrapper initialEntries={['/transactions/123']}>
        <TestHookComponent />
      </RouterWrapper>
    );

    expect(screen.getByTestId('breadcrumbs-count')).toHaveTextContent('3');
    expect(screen.getByTestId('current-page')).toHaveTextContent('123');
    expect(screen.getByTestId('path-depth')).toHaveTextContent('3');
    
    expect(screen.getByTestId('breadcrumb-0')).toHaveTextContent('Acasă');
    expect(screen.getByTestId('breadcrumb-1')).toHaveTextContent('Transactions');
    expect(screen.getByTestId('breadcrumb-2')).toHaveTextContent('123');
  });

  it('folosește pathLabels custom', () => {
    const pathLabels = {
      '/transactions': 'Toate Tranzacțiile',
      '123': 'Tranzacția Specifică'
    };

    render(
      <RouterWrapper initialEntries={['/transactions/123']}>
        <TestHookComponent pathLabels={pathLabels} />
      </RouterWrapper>
    );

    expect(screen.getByTestId('breadcrumb-1')).toHaveTextContent('Toate Tranzacțiile');
    expect(screen.getByTestId('breadcrumb-2')).toHaveTextContent('Tranzacția Specifică');
  });

  it('funcționează pentru root path', () => {
    render(
      <RouterWrapper initialEntries={['/']}>
        <TestHookComponent />
      </RouterWrapper>
    );

    expect(screen.getByTestId('breadcrumbs-count')).toHaveTextContent('1');
    expect(screen.getByTestId('current-page')).toHaveTextContent('Acasă');
    expect(screen.getByTestId('path-depth')).toHaveTextContent('1');
  });
}); 

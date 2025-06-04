import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Sidebar, { SidebarItem, type SidebarProps } from './Sidebar';

// Mock pentru localStorage
const mockLocalStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
};

Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage,
});

// Mock pentru window.history
const mockPushState = jest.fn();
Object.defineProperty(window, 'history', {
  value: { pushState: mockPushState },
});

// Wrapper pentru router
const RouterWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <BrowserRouter>{children}</BrowserRouter>
);

describe('Sidebar Component', () => {
  beforeEach(() => {
    mockLocalStorage.getItem.mockClear();
    mockLocalStorage.setItem.mockClear();
    mockPushState.mockClear();
    jest.clearAllMocks();
  });

  describe('Desktop Sidebar', () => {
    it('renders sidebar with correct default state', () => {
      render(
        <RouterWrapper>
          <Sidebar testId="test-sidebar">
            <div>Test Content</div>
          </Sidebar>
        </RouterWrapper>
      );

      expect(screen.getByTestId('test-sidebar')).toBeInTheDocument();
      expect(screen.getByText('Budget App')).toBeInTheDocument();
      expect(screen.getByText('Test Content')).toBeInTheDocument();
    });

    it('toggles sidebar state when toggle button is clicked', async () => {
      const onToggleMock = jest.fn();
      
      render(
        <RouterWrapper>
          <Sidebar testId="test-sidebar" onToggle={onToggleMock}>
            <div>Test Content</div>
          </Sidebar>
        </RouterWrapper>
      );

      const toggleButton = screen.getByTestId('test-sidebar-toggle-button');
      fireEvent.click(toggleButton);

      await waitFor(() => {
        expect(onToggleMock).toHaveBeenCalledWith(false);
      });
    });

    it('persists sidebar state in localStorage', async () => {
      mockLocalStorage.getItem.mockReturnValue('true');
      
      render(
        <RouterWrapper>
          <Sidebar testId="test-sidebar">
            <div>Test Content</div>
          </Sidebar>
        </RouterWrapper>
      );

      const toggleButton = screen.getByTestId('test-sidebar-toggle-button');
      fireEvent.click(toggleButton);

      await waitFor(() => {
        expect(mockLocalStorage.setItem).toHaveBeenCalledWith('sidebar-expanded', 'false');
      });
    });

    it('loads saved state from localStorage', () => {
      mockLocalStorage.getItem.mockReturnValue('false');
      
      render(
        <RouterWrapper>
          <Sidebar testId="test-sidebar">
            <div>Test Content</div>
          </Sidebar>
        </RouterWrapper>
      );

      expect(mockLocalStorage.getItem).toHaveBeenCalledWith('sidebar-expanded');
    });

    it('applies custom className correctly', () => {
      render(
        <RouterWrapper>
          <Sidebar testId="test-sidebar" className="custom-class">
            <div>Test Content</div>
          </Sidebar>
        </RouterWrapper>
      );

      const sidebar = screen.getByTestId('test-sidebar');
      expect(sidebar).toHaveClass('custom-class');
    });
  });

  describe('Mobile Sidebar', () => {
    it('renders mobile sidebar with overlay', () => {
      render(
        <RouterWrapper>
          <Sidebar 
            testId="test-sidebar" 
            variant="mobile" 
            showOverlay={true}
          >
            <div>Test Content</div>
          </Sidebar>
        </RouterWrapper>
      );

      expect(screen.getByTestId('test-sidebar')).toBeInTheDocument();
      expect(screen.getByTestId('test-sidebar-overlay')).toBeInTheDocument();
      expect(screen.getByTestId('test-sidebar-close-button')).toBeInTheDocument();
    });

    it('calls onOverlayClick when overlay is clicked', () => {
      const onOverlayClickMock = jest.fn();
      
      render(
        <RouterWrapper>
          <Sidebar 
            testId="test-sidebar" 
            variant="mobile" 
            showOverlay={true}
            onOverlayClick={onOverlayClickMock}
          >
            <div>Test Content</div>
          </Sidebar>
        </RouterWrapper>
      );

      const overlay = screen.getByTestId('test-sidebar-overlay');
      fireEvent.click(overlay);

      expect(onOverlayClickMock).toHaveBeenCalled();
    });

    it('calls onOverlayClick when close button is clicked', () => {
      const onOverlayClickMock = jest.fn();
      
      render(
        <RouterWrapper>
          <Sidebar 
            testId="test-sidebar" 
            variant="mobile" 
            showOverlay={true}
            onOverlayClick={onOverlayClickMock}
          >
            <div>Test Content</div>
          </Sidebar>
        </RouterWrapper>
      );

      const closeButton = screen.getByTestId('test-sidebar-close-button');
      fireEvent.click(closeButton);

      expect(onOverlayClickMock).toHaveBeenCalled();
    });

    it('does not render overlay when showOverlay is false', () => {
      render(
        <RouterWrapper>
          <Sidebar 
            testId="test-sidebar" 
            variant="mobile" 
            showOverlay={false}
          >
            <div>Test Content</div>
          </Sidebar>
        </RouterWrapper>
      );

      expect(screen.queryByTestId('test-sidebar-overlay')).not.toBeInTheDocument();
    });
  });
});

describe('SidebarItem Component', () => {
  beforeEach(() => {
    mockPushState.mockClear();
  });

  it('renders sidebar item with text content', () => {
    render(
      <RouterWrapper>
        <SidebarItem testId="test-item">
          Test Item
        </SidebarItem>
      </RouterWrapper>
    );

    expect(screen.getByTestId('test-item')).toBeInTheDocument();
    expect(screen.getByText('Test Item')).toBeInTheDocument();
  });

  it('renders sidebar item with icon', () => {
    const TestIcon = () => <span data-testid="test-icon">Icon</span>;
    
    render(
      <RouterWrapper>
        <SidebarItem testId="test-item" icon={<TestIcon />}>
          Test Item with Icon
        </SidebarItem>
      </RouterWrapper>
    );

    expect(screen.getByTestId('test-icon')).toBeInTheDocument();
    expect(screen.getByText('Test Item with Icon')).toBeInTheDocument();
  });

  it('navigates when item with "to" prop is clicked', () => {
    render(
      <RouterWrapper>
        <SidebarItem testId="test-item" to="/test-route">
          Navigation Item
        </SidebarItem>
      </RouterWrapper>
    );

    const item = screen.getByTestId('test-item');
    fireEvent.click(item);

    expect(mockPushState).toHaveBeenCalledWith({}, '', '/test-route');
  });

  it('calls onClick callback when clicked', () => {
    const onClickMock = jest.fn();
    
    render(
      <RouterWrapper>
        <SidebarItem testId="test-item" onClick={onClickMock}>
          Clickable Item
        </SidebarItem>
      </RouterWrapper>
    );

    const item = screen.getByTestId('test-item');
    fireEvent.click(item);

    expect(onClickMock).toHaveBeenCalled();
  });

  it('applies active variant when isActive is true', () => {
    render(
      <RouterWrapper>
        <SidebarItem testId="test-item" isActive={true}>
          Active Item
        </SidebarItem>
      </RouterWrapper>
    );

    const item = screen.getByTestId('test-item');
    // Verificăm că are clasele pentru variantă activă
    expect(item).toHaveClass('text-copper-600', 'bg-copper-50');
  });

  it('applies custom className correctly', () => {
    render(
      <RouterWrapper>
        <SidebarItem testId="test-item" className="custom-item-class">
          Custom Class Item
        </SidebarItem>
      </RouterWrapper>
    );

    const item = screen.getByTestId('test-item');
    expect(item).toHaveClass('custom-item-class');
  });

  it('renders as anchor tag when "to" prop is provided', () => {
    render(
      <RouterWrapper>
        <SidebarItem testId="test-item" to="/test-route">
          Link Item
        </SidebarItem>
      </RouterWrapper>
    );

    const item = screen.getByTestId('test-item');
    expect(item.tagName.toLowerCase()).toBe('a');
    expect(item).toHaveAttribute('href', '/test-route');
  });

  it('renders as button when no "to" prop is provided', () => {
    render(
      <RouterWrapper>
        <SidebarItem testId="test-item">
          Button Item
        </SidebarItem>
      </RouterWrapper>
    );

    const item = screen.getByTestId('test-item');
    expect(item.tagName.toLowerCase()).toBe('button');
  });

  it('handles different sizes correctly', () => {
    render(
      <RouterWrapper>
        <SidebarItem testId="test-item" size="lg">
          Large Item
        </SidebarItem>
      </RouterWrapper>
    );

    const item = screen.getByTestId('test-item');
    expect(item).toHaveClass('px-6', 'py-3', 'text-lg');
  });
}); 
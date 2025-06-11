import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ContextMenu, useContextMenu } from './ContextMenu';
import type { ContextMenuOption, ContextMenuState } from '../../../types/financial';

// Mock pentru Portal
jest.mock('react-dom', () => ({
  ...jest.requireActual('react-dom'),
  createPortal: (node: React.ReactNode) => node,
}));

// Mock pentru ResizeObserver
global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

// Component helper pentru teste
const TestContextMenuWrapper: React.FC<{
  options: ContextMenuOption[];
  initialState?: Partial<ContextMenuState>;
  onClose?: () => void;
}> = ({ options, initialState = {}, onClose = jest.fn() }) => {
  const state: ContextMenuState = {
    isVisible: true,
    x: 100,
    y: 100,
    ...initialState
  };

  return (
    <ContextMenu
      options={options}
      state={state}
      onClose={onClose}
      testId="test-context-menu"
    />
  );
};

// Component pentru testarea hook-ului
const TestContextMenuHook: React.FC<{
  onRender?: (hookResult: ReturnType<typeof useContextMenu>) => void;
}> = ({ onRender }) => {
  const hookResult = useContextMenu();

  React.useEffect(() => {
    onRender?.(hookResult);
  }, [hookResult, onRender]);

  return (
    <div
      onContextMenu={(e) => hookResult.handleContextMenu(e, { id: 'test-data' })}
      data-testid="trigger-element"
    >
      Context menu trigger
    </div>
  );
};

describe('ContextMenu Component', () => {
  const mockOptions: ContextMenuOption[] = [
    {
      id: 'edit',
      label: 'Editează',
      onClick: jest.fn(),
      shortcut: 'Ctrl+E'
    },
    {
      id: 'delete',
      label: 'Șterge',
      onClick: jest.fn(),
      shortcut: 'Del'
    },
    {
      id: 'separator',
      label: '',
      separator: true,
      onClick: jest.fn()
    },
    {
      id: 'copy',
      label: 'Copiază',
      onClick: jest.fn(),
      disabled: true
    }
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('renders context menu with options', () => {
      render(<TestContextMenuWrapper options={mockOptions} />);

      expect(screen.getByTestId('test-context-menu')).toBeInTheDocument();
      expect(screen.getByText('Editează')).toBeInTheDocument();
      expect(screen.getByText('Șterge')).toBeInTheDocument();
      expect(screen.getByText('Copiază')).toBeInTheDocument();
    });

    it('renders shortcuts correctly', () => {
      render(<TestContextMenuWrapper options={mockOptions} />);

      expect(screen.getByText('Ctrl+E')).toBeInTheDocument();
      expect(screen.getByText('Del')).toBeInTheDocument();
    });

    it('renders separators correctly', () => {
      render(<TestContextMenuWrapper options={mockOptions} />);

      const separator = screen.getByTestId('test-context-menu-separator');
      expect(separator).toBeInTheDocument();
      expect(separator).toHaveAttribute('role', 'separator');
    });

    it('does not render when invisible', () => {
      render(
        <TestContextMenuWrapper 
          options={mockOptions} 
          initialState={{ isVisible: false, x: 0, y: 0 }}
        />
      );

      expect(screen.queryByTestId('test-context-menu')).not.toBeInTheDocument();
    });

    it('positions correctly based on state', () => {
      render(
        <TestContextMenuWrapper 
          options={mockOptions}
          initialState={{ isVisible: true, x: 250, y: 150 }}
        />
      );

      const menu = screen.getByTestId('test-context-menu');
      expect(menu).toHaveStyle({
        left: '250px',
        top: '150px'
      });
    });
  });

  describe('Interactions', () => {
    it('calls onClick when menu item is clicked', async () => {
      const user = userEvent.setup();
      render(<TestContextMenuWrapper options={mockOptions} />);

      await user.click(screen.getByText('Editează'));

      expect(mockOptions[0].onClick).toHaveBeenCalledTimes(1);
    });

    it('does not call onClick for disabled items', async () => {
      const user = userEvent.setup();
      render(<TestContextMenuWrapper options={mockOptions} />);

      const disabledItem = screen.getByText('Copiază');
      await user.click(disabledItem);

      expect(mockOptions[3].onClick).not.toHaveBeenCalled();
    });

    it('calls onClose when item is clicked', async () => {
      const user = userEvent.setup();
      const onCloseMock = jest.fn();
      render(<TestContextMenuWrapper options={mockOptions} onClose={onCloseMock} />);

      await user.click(screen.getByText('Editează'));

      expect(onCloseMock).toHaveBeenCalledTimes(1);
    });

    it('calls onClose when clicking outside', async () => {
      const user = userEvent.setup();
      const onCloseMock = jest.fn();
      
      render(
        <div>
          <TestContextMenuWrapper options={mockOptions} onClose={onCloseMock} />
          <div data-testid="outside-element">Outside</div>
        </div>
      );

      await user.click(screen.getByTestId('outside-element'));

      expect(onCloseMock).toHaveBeenCalledTimes(1);
    });

    it('prevents event propagation on menu clicks', async () => {
      const user = userEvent.setup();
      const onCloseMock = jest.fn();
      const outsideClickHandler = jest.fn();

      render(
        <div onClick={outsideClickHandler}>
          <TestContextMenuWrapper options={mockOptions} onClose={onCloseMock} />
        </div>
      );

      await user.click(screen.getByTestId('test-context-menu'));

      expect(outsideClickHandler).not.toHaveBeenCalled();
    });
  });

  describe('Keyboard Navigation', () => {
    it('focuses first item when menu opens', async () => {
      render(<TestContextMenuWrapper options={mockOptions} />);

      await waitFor(() => {
        expect(screen.getByTestId('test-context-menu-item-edit')).toHaveFocus();
      });
    });

    it('navigates with arrow keys', async () => {
      const user = userEvent.setup();
      render(<TestContextMenuWrapper options={mockOptions} />);

      // Wait for initial focus
      await waitFor(() => {
        expect(screen.getByTestId('test-context-menu-item-edit')).toHaveFocus();
      });

      // ArrowDown should move to next item
      await user.keyboard('{ArrowDown}');
      expect(screen.getByTestId('test-context-menu-item-delete')).toHaveFocus();

      // ArrowUp should move back
      await user.keyboard('{ArrowUp}');
      expect(screen.getByTestId('test-context-menu-item-edit')).toHaveFocus();
    });

    it('wraps navigation at boundaries', async () => {
      const user = userEvent.setup();
      render(<TestContextMenuWrapper options={mockOptions} />);

      // Focus last item first
      await user.keyboard('{End}');
      expect(screen.getByTestId('test-context-menu-item-copy')).toHaveFocus();

      // ArrowDown should wrap to first
      await user.keyboard('{ArrowDown}');
      expect(screen.getByTestId('test-context-menu-item-edit')).toHaveFocus();
    });

    it('activates item with Enter key', async () => {
      const user = userEvent.setup();
      render(<TestContextMenuWrapper options={mockOptions} />);

      await waitFor(() => {
        expect(screen.getByTestId('test-context-menu-item-edit')).toHaveFocus();
      });

      await user.keyboard('{Enter}');
      expect(mockOptions[0].onClick).toHaveBeenCalledTimes(1);
    });

    it('activates item with Space key', async () => {
      const user = userEvent.setup();
      render(<TestContextMenuWrapper options={mockOptions} />);

      await waitFor(() => {
        expect(screen.getByTestId('test-context-menu-item-edit')).toHaveFocus();
      });

      await user.keyboard(' ');
      expect(mockOptions[0].onClick).toHaveBeenCalledTimes(1);
    });

    it('closes menu with Escape key', async () => {
      const user = userEvent.setup();
      const onCloseMock = jest.fn();
      render(<TestContextMenuWrapper options={mockOptions} onClose={onCloseMock} />);

      await user.keyboard('{Escape}');
      expect(onCloseMock).toHaveBeenCalledTimes(1);
    });
  });

  describe('Accessibility', () => {
    it('has correct ARIA attributes', () => {
      render(<TestContextMenuWrapper options={mockOptions} />);

      const menu = screen.getByTestId('test-context-menu');
      expect(menu).toHaveAttribute('role', 'menu');
      expect(menu).toHaveAttribute('aria-orientation', 'vertical');
      expect(menu).toHaveAttribute('aria-label');
    });

    it('has correct ARIA labels for menu items', () => {
      render(<TestContextMenuWrapper options={mockOptions} />);

      const editItem = screen.getByTestId('test-context-menu-item-edit');
      expect(editItem).toHaveAttribute('role', 'menuitem');
      expect(editItem).toHaveAttribute('aria-label', 'Editează');
    });

    it('marks disabled items correctly', () => {
      render(<TestContextMenuWrapper options={mockOptions} />);

      const disabledItem = screen.getByTestId('test-context-menu-item-copy');
      expect(disabledItem).toBeDisabled();
    });
  });

  describe('useContextMenu Hook', () => {
    it('provides correct initial state', () => {
      let hookResult: ReturnType<typeof useContextMenu>;
      
      render(
        <TestContextMenuHook
          onRender={(result) => { hookResult = result; }}
        />
      );

      expect(hookResult!.state).toEqual({
        isVisible: false,
        x: 0,
        y: 0
      });
    });

    it('shows context menu on right click', async () => {
      const user = userEvent.setup();
      let hookResult: ReturnType<typeof useContextMenu>;
      
      render(
        <TestContextMenuHook
          onRender={(result) => { hookResult = result; }}
        />
      );

      const trigger = screen.getByTestId('trigger-element');
      await user.pointer([{ target: trigger }, { keys: '[MouseRight]', target: trigger }]);

      expect(hookResult!.state.isVisible).toBe(true);
      expect(hookResult!.state.x).toBeGreaterThan(0);
      expect(hookResult!.state.y).toBeGreaterThan(0);
    });

    it('hides context menu when hide is called', async () => {
      let hookResult: ReturnType<typeof useContextMenu>;
      
      render(
        <TestContextMenuHook
          onRender={(result) => { hookResult = result; }}
        />
      );

      // Show first
      hookResult!.show(100, 200);
      expect(hookResult!.state.isVisible).toBe(true);

      // Then hide
      hookResult!.hide();
      expect(hookResult!.state.isVisible).toBe(false);
    });
  });

  describe('Edge Cases', () => {
    it('handles empty options array', () => {
      render(<TestContextMenuWrapper options={[]} />);

      const menu = screen.getByTestId('test-context-menu');
      expect(menu).toBeInTheDocument();
      expect(menu).toBeEmptyDOMElement();
    });

    it('handles rapid show/hide calls', () => {
      let hookResult: ReturnType<typeof useContextMenu>;
      
      render(
        <TestContextMenuHook
          onRender={(result) => { hookResult = result; }}
        />
      );

      // Rapid calls should not break
      hookResult!.show(100, 100);
      hookResult!.hide();
      hookResult!.show(200, 200);
      hookResult!.hide();

      expect(hookResult!.state.isVisible).toBe(false);
    });
  });
}); 

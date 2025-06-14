import { act, renderHook } from '@testing-library/react';
import { useKeyboardHandler } from './useKeyboardHandler';

describe('useKeyboardHandler', () => {
  beforeEach(() => {
    // Clear any existing event listeners
    document.removeEventListener('keydown', expect.any(Function));
  });

  test('hook se inițializează corect cu setări default', () => {
    const mockHandlers = {
      onEnter: jest.fn(),
      onEscape: jest.fn()
    };

    const { result } = renderHook(() => useKeyboardHandler(mockHandlers));

    expect(result.current.enabled).toBe(true);
    expect(result.current.context).toBe('useKeyboardHandler');
    expect(typeof result.current.handleKeyDown).toBe('function');
    expect(typeof result.current.utilities.createCellEditingHandlers).toBe('function');
    expect(typeof result.current.utilities.createNavigationHandlers).toBe('function');
  });

  test('handleKeyDown apelează handler-ul corect pentru Enter', () => {
    const mockOnEnter = jest.fn();
    const mockHandlers = {
      onEnter: mockOnEnter
    };

    const { result } = renderHook(() => useKeyboardHandler(mockHandlers));

    act(() => {
      const event = new KeyboardEvent('keydown', { key: 'Enter' });
      result.current.handleKeyDown(event);
    });

    expect(mockOnEnter).toHaveBeenCalledWith(expect.any(KeyboardEvent));
  });

  test('hook nu procesează eventi când enabled=false', () => {
    const mockOnEnter = jest.fn();
    const mockHandlers = {
      onEnter: mockOnEnter
    };

    const { result } = renderHook(() => useKeyboardHandler(mockHandlers, { enabled: false }));

    act(() => {
      const event = new KeyboardEvent('keydown', { key: 'Enter' });
      result.current.handleKeyDown(event);
    });

    expect(mockOnEnter).not.toHaveBeenCalled();
  });

  test('hook ignoră eventi când target este input', () => {
    const mockOnEnter = jest.fn();
    const mockHandlers = {
      onEnter: mockOnEnter
    };

    const { result } = renderHook(() => useKeyboardHandler(mockHandlers));

    // Creează un input element mock
    const inputElement = document.createElement('input');
    document.body.appendChild(inputElement);

    act(() => {
      const event = new KeyboardEvent('keydown', { key: 'Enter' });
      Object.defineProperty(event, 'target', {
        value: inputElement,
        writable: false
      });
      result.current.handleKeyDown(event);
    });

    expect(mockOnEnter).not.toHaveBeenCalled();

    // Cleanup
    document.body.removeChild(inputElement);
  });

  test('createCellEditingHandlers returnează handlers corecți', () => {
    const mockStartEdit = jest.fn();
    const mockDeleteContent = jest.fn();

    const { result } = renderHook(() => useKeyboardHandler({}));

    const cellHandlers = result.current.utilities.createCellEditingHandlers(
      mockStartEdit,
      mockDeleteContent,
      false // not readonly
    );

    expect(typeof cellHandlers.onF2).toBe('function');
    expect(typeof cellHandlers.onEnter).toBe('function');
    expect(typeof cellHandlers.onDelete).toBe('function');
    expect(typeof cellHandlers.onAlphaNumeric).toBe('function');

    // Test F2 handler
    const mockEvent = { preventDefault: jest.fn() } as unknown as KeyboardEvent;
    cellHandlers.onF2(mockEvent);
    expect(mockStartEdit).toHaveBeenCalled();
    expect(mockEvent.preventDefault).toHaveBeenCalled();
  });

  test('createNavigationHandlers returnează handlers corecți', () => {
    const mockMoveUp = jest.fn();
    const mockMoveDown = jest.fn();
    const mockMoveLeft = jest.fn();
    const mockMoveRight = jest.fn();
    const mockSelect = jest.fn();

    const { result } = renderHook(() => useKeyboardHandler({}));

    const navHandlers = result.current.utilities.createNavigationHandlers(
      mockMoveUp,
      mockMoveDown,
      mockMoveLeft,
      mockMoveRight,
      mockSelect
    );

    expect(typeof navHandlers.onArrowUp).toBe('function');
    expect(typeof navHandlers.onArrowDown).toBe('function');
    expect(typeof navHandlers.onArrowLeft).toBe('function');
    expect(typeof navHandlers.onArrowRight).toBe('function');
    expect(typeof navHandlers.onEnter).toBe('function');

    // Test arrow up handler
    const mockEvent = { preventDefault: jest.fn() } as unknown as KeyboardEvent;
    navHandlers.onArrowUp(mockEvent);
    expect(mockMoveUp).toHaveBeenCalled();
    expect(mockEvent.preventDefault).toHaveBeenCalled();
  });

  test('hook procesează alpha-numeric keys corect', () => {
    const mockOnAlphaNumeric = jest.fn();
    const mockHandlers = {
      onAlphaNumeric: mockOnAlphaNumeric
    };

    const { result } = renderHook(() => useKeyboardHandler(mockHandlers));

    act(() => {
      const event = new KeyboardEvent('keydown', { key: 'a' });
      result.current.handleKeyDown(event);
    });

    expect(mockOnAlphaNumeric).toHaveBeenCalledWith(expect.any(KeyboardEvent), 'a');
  });

  test('hook procesează modifier combinations corect', () => {
    const mockOnCtrlEnter = jest.fn();
    const mockHandlers = {
      onCtrlEnter: mockOnCtrlEnter
    };

    const { result } = renderHook(() => useKeyboardHandler(mockHandlers));

    act(() => {
      const event = new KeyboardEvent('keydown', { key: 'Enter', ctrlKey: true });
      result.current.handleKeyDown(event);
    });

    expect(mockOnCtrlEnter).toHaveBeenCalledWith(expect.any(KeyboardEvent));
  });

  test('hook se curăță corect la unmount', () => {
    const mockHandlers = {
      onEnter: jest.fn()
    };

    const removeEventListenerSpy = jest.spyOn(document, 'removeEventListener');

    const { unmount } = renderHook(() => useKeyboardHandler(mockHandlers));

    unmount();

    expect(removeEventListenerSpy).toHaveBeenCalledWith('keydown', expect.any(Function));

    removeEventListenerSpy.mockRestore();
  });
});

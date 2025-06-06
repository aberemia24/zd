import React from 'react';
import { renderHook, act } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import useGlobalKeyboardShortcuts, { GLOBAL_SHORTCUTS } from './useGlobalKeyboardShortcuts';

// Mock pentru useNavigate
const mockNavigate = jest.fn();
const mockLocation = { pathname: '/' };

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
  useLocation: () => mockLocation,
}));

// Wrapper pentru router
const RouterWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <BrowserRouter>{children}</BrowserRouter>
);

describe('useGlobalKeyboardShortcuts', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
    jest.clearAllMocks();
  });

  afterEach(() => {
    // Cleanup event listeners
    document.removeEventListener('keydown', jest.fn());
  });

  test('hook se inițializează cu configurație default', () => {
    const { result } = renderHook(() => useGlobalKeyboardShortcuts(), {
      wrapper: RouterWrapper,
    });

    expect(result.current.enabled).toBe(true);
    expect(result.current.shortcuts).toHaveLength(9); // 4 navigation + 2 sidebar + 3 modal
    expect(result.current.GLOBAL_SHORTCUTS).toEqual(GLOBAL_SHORTCUTS);
  });

  test('configurația poate fi personalizată', () => {
    const { result } = renderHook(() => useGlobalKeyboardShortcuts({
      enabled: false,
      enableNavigation: false,
      enableSidebar: true,
      enableModal: true,
    }), {
      wrapper: RouterWrapper,
    });

    expect(result.current.enabled).toBe(false);
    expect(result.current.shortcuts).toHaveLength(5); // 0 navigation + 2 sidebar + 3 modal
  });

  test('navigation shortcuts funcționează cu Alt+key', () => {
    const { result } = renderHook(() => useGlobalKeyboardShortcuts(), {
      wrapper: RouterWrapper,
    });

    act(() => {
      // Simulează Alt+H pentru home
      const event = new KeyboardEvent('keydown', {
        key: 'h',
        altKey: true,
        bubbles: true,
      });
      document.dispatchEvent(event);
    });

    expect(mockNavigate).toHaveBeenCalledWith('/');

    act(() => {
      // Simulează Alt+T pentru transactions
      const event = new KeyboardEvent('keydown', {
        key: 't',
        altKey: true,
        bubbles: true,
      });
      document.dispatchEvent(event);
    });

    expect(mockNavigate).toHaveBeenCalledWith('/transactions');
  });

  test('UI shortcuts cu callback-uri funcționează', () => {
    const mockToggleSidebar = jest.fn();
    const mockGlobalSearch = jest.fn();
    const mockContextMenu = jest.fn();

    const { result } = renderHook(() => useGlobalKeyboardShortcuts({
      onToggleSidebar: mockToggleSidebar,
      onGlobalSearch: mockGlobalSearch,
      onOpenContextMenu: mockContextMenu,
    }), {
      wrapper: RouterWrapper,
    });

    act(() => {
      // Simulează Ctrl+\ pentru toggle sidebar
      const event = new KeyboardEvent('keydown', {
        key: '\\',
        ctrlKey: true,
        bubbles: true,
      });
      Object.defineProperty(event, 'preventDefault', {
        value: jest.fn(),
      });
      document.dispatchEvent(event);
    });

    expect(mockToggleSidebar).toHaveBeenCalled();

    act(() => {
      // Simulează Ctrl+K pentru global search
      const event = new KeyboardEvent('keydown', {
        key: 'k',
        ctrlKey: true,
        bubbles: true,
      });
      Object.defineProperty(event, 'preventDefault', {
        value: jest.fn(),
      });
      document.dispatchEvent(event);
    });

    expect(mockGlobalSearch).toHaveBeenCalled();
  });

  test('shortcuts sunt ignorate în timpul editării', () => {
    const mockToggleSidebar = jest.fn();
    
    // Creăm un input element
    const input = document.createElement('input');
    document.body.appendChild(input);
    input.focus();

    const { result } = renderHook(() => useGlobalKeyboardShortcuts({
      onToggleSidebar: mockToggleSidebar,
    }), {
      wrapper: RouterWrapper,
    });

    act(() => {
      // Simulează Ctrl+\ în timp ce input-ul are focus
      const event = new KeyboardEvent('keydown', {
        key: '\\',
        ctrlKey: true,
        bubbles: true,
      });
      Object.defineProperty(event, 'target', {
        value: input,
      });
      document.dispatchEvent(event);
    });

    // Nu ar trebui să fie apelat în timpul editării
    expect(mockToggleSidebar).not.toHaveBeenCalled();

    // Cleanup
    document.body.removeChild(input);
  });

  test('F1 afișează help (console.log)', () => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

    const { result } = renderHook(() => useGlobalKeyboardShortcuts(), {
      wrapper: RouterWrapper,
    });

    act(() => {
      const event = new KeyboardEvent('keydown', {
        key: 'F1',
        bubbles: true,
      });
      Object.defineProperty(event, 'preventDefault', {
        value: jest.fn(),
      });
      document.dispatchEvent(event);
    });

    expect(consoleSpy).toHaveBeenCalledWith('Help shortcuts:', GLOBAL_SHORTCUTS);

    consoleSpy.mockRestore();
  });

  test('getAvailableShortcuts returnează shortcuts-urile corecte', () => {
    const { result } = renderHook(() => useGlobalKeyboardShortcuts({
      enableNavigation: true,
      enableSidebar: false,
      enableModal: true,
    }), {
      wrapper: RouterWrapper,
    });

    const shortcuts = result.current.getAvailableShortcuts();
    
    // Ar trebui să aibă 4 navigation + 3 modal = 7 total
    expect(shortcuts).toHaveLength(7);
    expect(shortcuts.some(s => s.key === 'Alt+H')).toBe(true); // Navigation
    expect(shortcuts.some(s => s.key === 'F1')).toBe(true); // Modal
    expect(shortcuts.some(s => s.key === 'Ctrl+\\')).toBe(false); // Sidebar disabled
  });

  test('isShortcutActive verifică corect disponibilitatea', () => {
    const { result } = renderHook(() => useGlobalKeyboardShortcuts({
      enabled: true,
    }), {
      wrapper: RouterWrapper,
    });

    expect(result.current.isShortcutActive('HOME')).toBe(true);
    expect(result.current.isShortcutActive('INVALID_KEY')).toBe(false);
  });

  test('hook-ul se dezactivează când enabled=false', () => {
    const mockToggleSidebar = jest.fn();

    const { result } = renderHook(() => useGlobalKeyboardShortcuts({
      enabled: false,
      onToggleSidebar: mockToggleSidebar,
    }), {
      wrapper: RouterWrapper,
    });

    act(() => {
      const event = new KeyboardEvent('keydown', {
        key: '\\',
        ctrlKey: true,
        bubbles: true,
      });
      document.dispatchEvent(event);
    });

    expect(mockToggleSidebar).not.toHaveBeenCalled();
  });
}); 

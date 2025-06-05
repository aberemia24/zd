import React, { useEffect, useRef, useState, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { cn } from '../../../styles/cva-v2';
import { dropdown, dropdownItem } from '../../../styles/cva/components/feedback';
import { NAVIGATION } from '@shared-constants';
import type { ContextMenuOption, ContextMenuState, FinancialTableRow } from '../../../types/financial';

/**
 * Props pentru componenta ContextMenu
 * Reutilizează tipurile existente din financial.ts
 */
export interface ContextMenuProps {
  /** Lista de opțiuni pentru context menu */
  options: ContextMenuOption[];
  /** Starea context menu-ului (poziție, vizibilitate) */
  state: ContextMenuState;
  /** Callback pentru închiderea context menu-ului */
  onClose: () => void;
  /** CSS classes adiționale */
  className?: string;
  /** Data test ID pentru testare */
  testId?: string;
  /** Container element pentru portal (default: document.body) */
  container?: HTMLElement;
  /** Offset pentru poziționare (default: { x: 0, y: 0 }) */
  offset?: { x: number; y: number };
}

/**
 * Hook pentru poziționarea inteligentă a context menu-ului
 */
const useContextMenuPosition = (
  state: ContextMenuState,
  menuRef: React.RefObject<HTMLDivElement | null>,
  offset: { x: number; y: number } = { x: 0, y: 0 }
) => {
  const [position, setPosition] = useState({ x: state.x, y: state.y });

  useEffect(() => {
    if (!state.isVisible || !menuRef.current) return;

    const menu = menuRef.current;
    const rect = menu.getBoundingClientRect();
    const viewport = {
      width: window.innerWidth,
      height: window.innerHeight
    };

    let { x, y } = state;
    x += offset.x;
    y += offset.y;

    // Ajustează poziția pentru a evita ieșirea din viewport
    if (x + rect.width > viewport.width) {
      x = viewport.width - rect.width - 8; // 8px margin
    }
    if (y + rect.height > viewport.height) {
      y = viewport.height - rect.height - 8; // 8px margin
    }

    // Asigură-te că nu iese din partea stângă/sus
    x = Math.max(8, x);
    y = Math.max(8, y);

    setPosition({ x, y });
  }, [state.isVisible, state.x, state.y, offset.x, offset.y]);

  return position;
};

/**
 * Hook pentru gestionarea click-urilor în afara context menu-ului
 */
const useOutsideClick = (
  ref: React.RefObject<HTMLDivElement | null>,
  onClose: () => void,
  isVisible: boolean
) => {
  useEffect(() => {
    if (!isVisible) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        onClose();
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [ref, onClose, isVisible]);
};

/**
 * Componentă pentru o opțiune din context menu
 */
const ContextMenuItem: React.FC<{
  option: ContextMenuOption;
  testId?: string;
  onClose: () => void;
}> = ({ option, testId, onClose }) => {
     const handleClick = useCallback(
     (e: React.MouseEvent) => {
       e.preventDefault();
       e.stopPropagation();
       
       if (option.disabled) return;
       
       // Execută acțiunea cu data din context menu state
       // Nota: targetRow va fi injectat în options de către consumator
       if (option.onClick) {
         option.onClick({} as any); // Type assertion temporară pentru compatibilitate
       }
       
       onClose();
     },
     [option, onClose]
   );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        handleClick(e as unknown as React.MouseEvent<HTMLButtonElement>);
      }
    },
    [handleClick]
  );

  // Separator
  if (option.separator) {
    return (
      <div
        className="border-t border-carbon-200 dark:border-carbon-700 my-1"
        role="separator"
        data-testid={testId ? `${testId}-separator` : undefined}
      />
    );
  }

  const variant = option.id.includes('delete') ? 'danger' : 'default';

  return (
    <button
      className={cn(
        dropdownItem({ variant, disabled: option.disabled }),
        "w-full text-left flex items-center space-x-2"
      )}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      disabled={option.disabled}
      role="menuitem"
      data-testid={testId ? `${testId}-item-${option.id}` : undefined}
      aria-label={option.label}
    >
      {/* Icon */}
      {option.icon && (
        <span className="flex-shrink-0 w-4 h-4" aria-hidden="true">
          <option.icon />
        </span>
      )}
      
      {/* Label */}
      <span className="flex-1">{option.label}</span>
      
      {/* Shortcut */}
      {option.shortcut && (
        <span className="text-xs text-carbon-500 dark:text-carbon-400 font-mono">
          {option.shortcut}
        </span>
      )}
    </button>
  );
};

/**
 * Componenta principală ContextMenu
 */
export const ContextMenu: React.FC<ContextMenuProps> = ({
  options,
  state,
  onClose,
  className,
  testId = 'context-menu',
  container = document.body,
  offset = { x: 0, y: 0 }
}) => {
  const menuRef = useRef<HTMLDivElement>(null);
  const position = useContextMenuPosition(state, menuRef, offset);
  
  useOutsideClick(menuRef, onClose, state.isVisible);

  // Focus management
  useEffect(() => {
    if (state.isVisible && menuRef.current) {
      const firstItem = menuRef.current.querySelector('[role="menuitem"]:not([disabled])') as HTMLElement;
      firstItem?.focus();
    }
  }, [state.isVisible]);

  // Keyboard navigation
  useEffect(() => {
    if (!state.isVisible) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      const menuItems = menuRef.current?.querySelectorAll('[role="menuitem"]:not([disabled])') as NodeListOf<HTMLElement>;
      if (!menuItems || menuItems.length === 0) return;

      const currentIndex = Array.from(menuItems).findIndex(item => item === document.activeElement);

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          const nextIndex = currentIndex < menuItems.length - 1 ? currentIndex + 1 : 0;
          menuItems[nextIndex]?.focus();
          break;
        case 'ArrowUp':
          e.preventDefault();
          const prevIndex = currentIndex > 0 ? currentIndex - 1 : menuItems.length - 1;
          menuItems[prevIndex]?.focus();
          break;
        case 'Home':
          e.preventDefault();
          menuItems[0]?.focus();
          break;
        case 'End':
          e.preventDefault();
          menuItems[menuItems.length - 1]?.focus();
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [state.isVisible]);

  if (!state.isVisible) return null;

  const menuElement = (
    <div
      ref={menuRef}
      className={cn(
        dropdown({ size: 'md' }),
        'fixed z-50',
        className
      )}
      style={{
        left: position.x,
        top: position.y,
      }}
      role="menu"
      aria-label={NAVIGATION.ARIA.CONTEXT_MENU || 'Context menu'}
      aria-orientation="vertical"
      data-testid={testId}
    >
      {options.map((option, index) => (
        <ContextMenuItem
          key={option.id || index}
          option={option}
          testId={testId}
          onClose={onClose}
        />
      ))}
    </div>
  );

  return createPortal(menuElement, container);
};

/**
 * Hook pentru utilizarea facilă a context menu-ului
 */
export const useContextMenu = () => {
  const [state, setState] = useState<ContextMenuState>({
    isVisible: false,
    x: 0,
    y: 0
  });

  const show = useCallback((x: number, y: number, targetRow?: FinancialTableRow) => {
    setState({
      isVisible: true,
      x,
      y,
      targetRow
    });
  }, []);

  const hide = useCallback(() => {
    setState(prev => ({
      ...prev,
      isVisible: false
    }));
  }, []);

  const handleContextMenu = useCallback((
    e: React.MouseEvent,
    targetRow?: FinancialTableRow
  ) => {
    e.preventDefault();
    e.stopPropagation();
    show(e.clientX, e.clientY, targetRow);
  }, [show]);

  return {
    state,
    show,
    hide,
    handleContextMenu
  };
};

export default ContextMenu; 
// src/components/ContextMenu/ContextMenu.stories.tsx
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { cn } from '../../../styles/cva-v2';
import type { ContextMenuOption, ContextMenuState } from '../../../types/financial';

// =============================================================================
// TYPES & INTERFACES
// =============================================================================

export interface ContextMenuProps {
  options: ContextMenuOption[];
  state: ContextMenuState;
  onClose: () => void;
  offset?: { x: number; y: number };
  className?: string;
}

// =============================================================================
// CONTEXT MENU HOOK
// =============================================================================

export const useContextMenu = () => {
  const [state, setState] = useState<ContextMenuState>({
    isVisible: false,
    x: 0,
    y: 0
  });

  const show = useCallback((x: number, y: number, targetRow?: any) => {
    setState({
      isVisible: true,
      x,
      y,
      targetRow
    });
  }, []);

  const hide = useCallback(() => {
    setState({
      isVisible: false,
      x: 0,
      y: 0
    });
  }, []);

  const handleContextMenu = useCallback((event: React.MouseEvent, targetRow?: any) => {
    event.preventDefault();
    show(event.clientX, event.clientY, targetRow);
  }, [show]);

  // Close on outside click or escape
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (state.isVisible) {
        hide();
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && state.isVisible) {
        hide();
      }
    };

    if (state.isVisible) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [state.isVisible, hide]);

  return {
    state,
    show,
    hide,
    handleContextMenu
  };
};

// =============================================================================
// CONTEXT MENU COMPONENT
// =============================================================================

export const ContextMenu: React.FC<ContextMenuProps> = ({
  options,
  state,
  onClose,
  offset = { x: 0, y: 0 },
  className
}) => {
  const menuRef = useRef<HTMLDivElement>(null);
  const [focusedIndex, setFocusedIndex] = useState(0);

  // Position calculation with boundary detection
  const calculatePosition = useCallback(() => {
    if (!menuRef.current || !state.isVisible) return { left: 0, top: 0 };

    const menu = menuRef.current;
    const { x, y } = state;
    const { x: offsetX, y: offsetY } = offset;

    const menuRect = menu.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    let left = x + offsetX;
    let top = y + offsetY;

    // Boundary detection - adjust if menu would go off screen
    if (left + menuRect.width > viewportWidth) {
      left = Math.max(10, x - menuRect.width - offsetX);
    }

    if (top + menuRect.height > viewportHeight) {
      top = Math.max(10, y - menuRect.height - offsetY);
    }

    return { left, top };
  }, [state, offset]);

  // Filter out separators for keyboard navigation
  const navigableOptions = options.filter(option => !option.separator && !option.disabled);

  // Keyboard navigation
  useEffect(() => {
    if (!state.isVisible) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      switch (event.key) {
        case 'ArrowDown':
          event.preventDefault();
          setFocusedIndex(prev => 
            prev < navigableOptions.length - 1 ? prev + 1 : 0
          );
          break;
        case 'ArrowUp':
          event.preventDefault();
          setFocusedIndex(prev => 
            prev > 0 ? prev - 1 : navigableOptions.length - 1
          );
          break;
                 case 'Enter':
           event.preventDefault();
           if (navigableOptions[focusedIndex]) {
             navigableOptions[focusedIndex].onClick(state.targetRow!);
             onClose();
           }
           break;
        case 'Escape':
          event.preventDefault();
          onClose();
          break;
        case 'Home':
          event.preventDefault();
          setFocusedIndex(0);
          break;
        case 'End':
          event.preventDefault();
          setFocusedIndex(navigableOptions.length - 1);
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [state.isVisible, focusedIndex, navigableOptions, onClose, state.targetRow]);

  // Focus management
  useEffect(() => {
    if (state.isVisible && menuRef.current) {
      setFocusedIndex(0);
      // Focus the menu container for keyboard navigation
      menuRef.current.focus();
    }
  }, [state.isVisible]);

  if (!state.isVisible) {
    return null;
  }

  const position = calculatePosition();

  return (
    <div
      ref={menuRef}
      data-testid="test-context-menu"
      className={cn(
        "fixed z-50 min-w-[180px] rounded-md border bg-card p-1 shadow-lg",
        "animate-in fade-in-0 zoom-in-95",
        className
      )}
      style={{
        left: position.left,
        top: position.top,
      }}
      tabIndex={-1}
      onClick={(e) => e.stopPropagation()}
    >
      {options.map((option, index) => {
        if (option.separator) {
          return (
            <div
              key={option.id || `separator-${index}`}
              className="my-1 h-px bg-border"
            />
          );
        }

        const navigableIndex = navigableOptions.findIndex(nav => nav.id === option.id);
        const isFocused = navigableIndex === focusedIndex;

        return (
          <button
            key={option.id}
            data-testid={`test-context-menu-item-${option.id}`}
            className={cn(
              "relative flex w-full cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none",
              "transition-colors focus:bg-accent focus:text-accent-foreground",
              option.disabled 
                ? "pointer-events-none opacity-50" 
                : "hover:bg-accent hover:text-accent-foreground",
              isFocused && "bg-accent text-accent-foreground"
            )}
                         onClick={() => {
               if (!option.disabled) {
                 option.onClick(state.targetRow!);
                 onClose();
               }
             }}
            disabled={option.disabled}
          >
                         {option.icon && React.createElement(option.icon as React.ComponentType<{ className?: string }>, { className: "mr-2 h-4 w-4" })}
            <span className="flex-1 text-left">{option.label}</span>
            {option.shortcut && (
              <span className="ml-auto text-xs tracking-widest opacity-60">
                {option.shortcut}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};

// Default export
export default ContextMenu;

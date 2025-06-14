import React, { useState, useRef, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { cn, dropdown, dropdownItem, navigationItem } from '../../../styles/cva-v2';

/**
 * 🎨 DROPDOWN COMPONENT - CVA v2
 * Component pentru nested navigation menus
 */

export interface DropdownItem {
  id: string;
  label: string;
  href?: string;
  icon?: React.ComponentType<{ className?: string }>;
  shortcut?: string;
  disabled?: boolean;
  separator?: boolean;
  children?: DropdownItem[];
  onClick?: (item: DropdownItem) => void;
}

export interface DropdownProps {
  /** Trigger element content */
  trigger?: React.ReactNode;
  /** Dropdown menu items */
  items: DropdownItem[];
  /** Trigger button label */
  label?: string;
  /** Trigger button variant */
  variant?: 'default' | 'ghost' | 'active';
  /** Trigger button size */
  size?: 'sm' | 'md' | 'lg';
  /** CSS classes pentru trigger */
  className?: string;
  /** CSS classes pentru dropdown menu */
  menuClassName?: string;
  /** Disabled state */
  disabled?: boolean;
  /** Data test ID */
  testId?: string;
  /** Callback when dropdown opens/closes */
  onOpenChange?: (open: boolean) => void;
  /** Portal container */
  container?: HTMLElement;
  /** Alignment for dropdown positioning */
  align?: 'start' | 'center' | 'end';
  /** Side for dropdown positioning */
  side?: 'top' | 'bottom' | 'left' | 'right';
}

/**
 * Hook pentru dropdown positioning
 */
const useDropdownPosition = (
  isOpen: boolean,
  triggerRef: React.RefObject<HTMLElement | null>,
  menuRef: React.RefObject<HTMLElement | null>,
  align: DropdownProps['align'] = 'start',
  side: DropdownProps['side'] = 'bottom'
) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (!isOpen || !triggerRef.current || !menuRef.current) return;

    const updatePosition = () => {
      const triggerRect = triggerRef.current!.getBoundingClientRect();
      const menuRect = menuRef.current!.getBoundingClientRect();
      const viewport = {
        width: window.innerWidth,
        height: window.innerHeight,
      };

      let x = triggerRect.left;
      let y = triggerRect.bottom;

      // Horizontal alignment
      if (align === 'center') {
        x = triggerRect.left + (triggerRect.width - menuRect.width) / 2;
      } else if (align === 'end') {
        x = triggerRect.right - menuRect.width;
      }

      // Vertical positioning
      if (side === 'top') {
        y = triggerRect.top - menuRect.height;
      } else if (side === 'left') {
        x = triggerRect.left - menuRect.width;
        y = triggerRect.top;
      } else if (side === 'right') {
        x = triggerRect.right;
        y = triggerRect.top;
      }

      // Viewport boundary detection
      if (x + menuRect.width > viewport.width) {
        x = viewport.width - menuRect.width - 8;
      }
      if (x < 8) {
        x = 8;
      }
      if (y + menuRect.height > viewport.height && side === 'bottom') {
        y = triggerRect.top - menuRect.height;
      }
      if (y < 8) {
        y = 8;
      }

      setPosition({ x, y });
    };

    updatePosition();
    window.addEventListener('scroll', updatePosition);
    window.addEventListener('resize', updatePosition);

    return () => {
      window.removeEventListener('scroll', updatePosition);
      window.removeEventListener('resize', updatePosition);
    };
  }, [isOpen, align, side]);

  return position;
};

/**
 * Hook pentru outside click detection
 */
const useOutsideClick = (
  ref: React.RefObject<HTMLElement | null>,
  callback: () => void,
  isActive: boolean
) => {
  useEffect(() => {
    if (!isActive) return;

    const handleClickOutside = (event: Event) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        callback();
      }
    };

    const handleTouchStart = (event: TouchEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        callback();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleTouchStart);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleTouchStart);
    };
  }, [ref, callback, isActive]);
};

/**
 * Componenta pentru un item din dropdown
 */
const DropdownMenuItem: React.FC<{
  item: DropdownItem;
  onClose: () => void;
  testId?: string;
  level?: number;
}> = ({ item, onClose, testId, level = 0 }) => {
  const [showSubmenu, setShowSubmenu] = useState(false);
  const submenuRef = useRef<HTMLDivElement>(null);
  const itemRef = useRef<HTMLButtonElement>(null);

  const hasChildren = item.children && item.children.length > 0;
  const isDisabled = item.disabled;

  const handleClick = useCallback(() => {
    if (isDisabled) return;

    if (hasChildren) {
      setShowSubmenu(!showSubmenu);
    } else {
      item.onClick?.(item);
      if (item.href) {
        window.location.href = item.href;
      }
      onClose();
    }
  }, [item, isDisabled, hasChildren, showSubmenu, onClose]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (isDisabled) return;
    
    switch (e.key) {
      case 'Enter':
      case ' ':
        e.preventDefault();
        handleClick();
        break;
      case 'ArrowRight':
        if (hasChildren) {
          e.preventDefault();
          setShowSubmenu(true);
        }
        break;
      case 'ArrowLeft':
        if (level > 0) {
          e.preventDefault();
          setShowSubmenu(false);
        }
        break;
      case 'Escape':
        e.preventDefault();
        if (showSubmenu) {
          setShowSubmenu(false);
        } else {
          onClose();
        }
        break;
    }
  }, [isDisabled, handleClick, hasChildren, level, showSubmenu, onClose]);

  if (item.separator) {
    return <div className="border-t border-carbon-200 dark:border-carbon-700 my-1" />;
  }

  return (
    <div className="relative">
      <button
        ref={itemRef}
        className={cn(
          dropdownItem({ 
            variant: isDisabled ? 'default' : 'default',
            disabled: isDisabled 
          }),
          "w-full text-left flex items-center justify-between space-x-2",
          level > 0 && "pl-8"
        )}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        disabled={isDisabled}
        role="menuitem"
        aria-haspopup={hasChildren ? 'menu' : undefined}
        aria-expanded={hasChildren ? showSubmenu : undefined}
        data-testid={testId ? `${testId}-item-${item.id}` : undefined}
      >
        <div className="flex items-center space-x-2 flex-1">
          {/* Icon */}
          {item.icon && (
            <span className="flex-shrink-0 w-4 h-4" aria-hidden="true">
              <item.icon className="w-4 h-4" />
            </span>
          )}
          
          {/* Label */}
          <span className="flex-1">{item.label}</span>
        </div>

        <div className="flex items-center space-x-2">
          {/* Shortcut */}
          {item.shortcut && (
            <span className="text-xs text-carbon-500 dark:text-carbon-400 font-mono">
              {item.shortcut}
            </span>
          )}
          
          {/* Submenu indicator */}
          {hasChildren && (
            <ChevronRight className="w-4 h-4 text-carbon-500 dark:text-carbon-400" />
          )}
        </div>
      </button>

      {/* Submenu */}
      {hasChildren && showSubmenu && (
        <div
          ref={submenuRef}
          className={cn(
            dropdown({ size: 'md' }),
            'absolute left-full top-0 ml-1 z-50'
          )}
          role="menu"
          aria-label={`Submenu pentru ${item.label}`}
        >
          {item.children!.map((child, index) => (
            <DropdownMenuItem
              key={child.id || index}
              item={child}
              onClose={onClose}
              testId={testId}
              level={level + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
};

/**
 * Componenta principală Dropdown
 */
export const Dropdown: React.FC<DropdownProps> = ({
  trigger,
  items,
  label = 'Menu',
  variant = 'default',
  size = 'md',
  className,
  menuClassName,
  disabled = false,
  testId = 'dropdown',
  onOpenChange,
  container = document.body,
  align = 'start',
  side = 'bottom'
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  
  const position = useDropdownPosition(isOpen, triggerRef, menuRef, align, side);

  const handleToggle = useCallback(() => {
    if (disabled) return;
    const newState = !isOpen;
    setIsOpen(newState);
    onOpenChange?.(newState);
  }, [disabled, isOpen, onOpenChange]);

  const handleClose = useCallback(() => {
    setIsOpen(false);
    onOpenChange?.(false);
  }, [onOpenChange]);

  useOutsideClick(menuRef, handleClose, isOpen);

  // Keyboard navigation pentru dropdown menu
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        handleClose();
        triggerRef.current?.focus();
      } else if (e.key === 'Tab') {
        // Allow tab to move focus away and close dropdown
        handleClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, handleClose]);

  // Focus management
  useEffect(() => {
    if (isOpen && menuRef.current) {
      const firstItem = menuRef.current.querySelector('[role="menuitem"]:not([disabled])') as HTMLElement;
      firstItem?.focus();
    }
  }, [isOpen]);

  const defaultTrigger = (
    <button
      ref={triggerRef}
      className={cn(
        navigationItem({ variant: isOpen ? 'active' : variant, size }),
        'flex items-center space-x-2',
        disabled && 'opacity-50 cursor-not-allowed',
        className
      )}
      onClick={handleToggle}
      disabled={disabled}
      aria-haspopup="menu"
      aria-expanded={isOpen}
      aria-label={label}
      data-testid={`${testId}-trigger`}
    >
      {typeof trigger === 'string' ? (
        <>
          <span>{trigger}</span>
          <ChevronDown className={cn(
            'w-4 h-4 transition-transform duration-200',
            isOpen && 'rotate-180'
          )} />
        </>
      ) : trigger ? trigger : (
        <>
          <span>{label}</span>
          <ChevronDown className={cn(
            'w-4 h-4 transition-transform duration-200',
            isOpen && 'rotate-180'
          )} />
        </>
      )}
    </button>
  );

  const menuElement = isOpen ? (
    <div
      ref={menuRef}
      className={cn(
        dropdown({ size: 'md' }),
        'fixed z-50',
        menuClassName
      )}
      style={{
        left: position.x,
        top: position.y,
      }}
      role="menu"
      aria-label={`${label} menu`}
      aria-orientation="vertical"
      data-testid={`${testId}-menu`}
    >
      {items.map((item, index) => (
        <DropdownMenuItem
          key={item.id || index}
          item={item}
          onClose={handleClose}
          testId={testId}
        />
      ))}
    </div>
  ) : null;

  return (
    <>
      {defaultTrigger}
      {menuElement && createPortal(menuElement, container)}
    </>
  );
};

/**
 * Hook pentru dropdown state management
 */
export const useDropdown = (initialOpen = false) => {
  const [isOpen, setIsOpen] = useState(initialOpen);

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);
  const toggle = useCallback(() => setIsOpen(prev => !prev), []);

  return {
    isOpen,
    open,
    close,
    toggle,
    setIsOpen
  };
};

export default Dropdown; 

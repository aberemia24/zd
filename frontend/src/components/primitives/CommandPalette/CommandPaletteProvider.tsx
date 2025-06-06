import React, { useCallback, useEffect } from 'react';
import { CommandPalette, useCommandPalette, CommandAction } from './CommandPalette';
import { useGlobalKeyboardShortcuts } from '../../../hooks/useGlobalKeyboardShortcuts';

/**
 * 🎨 COMMAND PALETTE PROVIDER
 * Provider pentru integrarea Command Palette cu global keyboard shortcuts
 */

export interface CommandPaletteProviderProps {
  children: React.ReactNode;
  /** Custom actions pentru command palette */
  customActions?: CommandAction[];
  /** Callback pentru sidebar toggle din command palette */
  onSidebarToggle?: () => void;
  /** Callback pentru new tab din command palette */
  onNewTab?: () => void;
  /** Callback pentru show help din command palette */
  onShowHelp?: () => void;
  /** Callback pentru toggle dark mode din command palette */
  onToggleDarkMode?: () => void;
}

export const CommandPaletteProvider: React.FC<CommandPaletteProviderProps> = ({
  children,
  customActions = [],
  onSidebarToggle,
  onNewTab,
  onShowHelp,
  onToggleDarkMode
}) => {
  const { isOpen, open, close } = useCommandPalette();
  
  // Event listeners pentru custom events din command palette
  useEffect(() => {
    const handleSidebarToggle = () => {
      onSidebarToggle?.();
    };
    
    const handleNewTab = () => {
      onNewTab?.();
    };
    
    const handleShowHelp = () => {
      onShowHelp?.();
    };
    
    const handleToggleDarkMode = () => {
      onToggleDarkMode?.();
    };
    
    window.addEventListener('command-palette-sidebar-toggle', handleSidebarToggle);
    window.addEventListener('command-palette-new-tab', handleNewTab);
    window.addEventListener('command-palette-show-help', handleShowHelp);
    window.addEventListener('command-palette-dark-mode-toggle', handleToggleDarkMode);
    
    return () => {
      window.removeEventListener('command-palette-sidebar-toggle', handleSidebarToggle);
      window.removeEventListener('command-palette-new-tab', handleNewTab);
      window.removeEventListener('command-palette-show-help', handleShowHelp);
      window.removeEventListener('command-palette-dark-mode-toggle', handleToggleDarkMode);
    };
  }, [onSidebarToggle, onNewTab, onShowHelp, onToggleDarkMode]);
  
  // Integrare cu useGlobalKeyboardShortcuts pentru Ctrl+K
  const globalShortcuts = useGlobalKeyboardShortcuts({
    onGlobalSearch: open,
    onToggleSidebar: onSidebarToggle,
  });
  
  return (
    <>
      {children}
      <CommandPalette
        isOpen={isOpen}
        onClose={close}
        customActions={customActions}
      />
    </>
  );
};

export default CommandPaletteProvider; 

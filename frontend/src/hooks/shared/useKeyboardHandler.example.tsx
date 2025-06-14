import React, { useState } from 'react';
import { useKeyboardHandler } from './useKeyboardHandler';

/**
 * 📋 EXEMPLU DE UTILIZARE pentru useKeyboardHandler
 *
 * Demonstrează cum să folosești hook-ul pentru consolidarea evenimentelor de keyboard
 * în loc să reimplementezi pattern-urile din nou în fiecare componentă.
 */

export const KeyboardHandlerExample: React.FC = () => {
  const [message, setMessage] = useState('Press keys to see events...');
  const [lastKey, setLastKey] = useState('');

  // ✅ EXEMPLU 1: Cell editing pattern (consolidează EditableCell logic)
  const cellEditingHandlers = useKeyboardHandler({
    onF2: (e) => {
      setMessage('F2 pressed - Starting edit mode');
      setLastKey('F2');
    },
    onEnter: (e) => {
      setMessage('Enter pressed - Starting edit mode');
      setLastKey('Enter');
    },
    onDelete: (e) => {
      setMessage('Delete pressed - Clearing content');
      setLastKey('Delete');
    },
    onEscape: (e) => {
      setMessage('Escape pressed - Cancel operation');
      setLastKey('Escape');
    },
    onAlphaNumeric: (e, char) => {
      setMessage(`Typed '${char}' - Starting edit with character`);
      setLastKey(char);
    }
  }, {
    context: 'CellEditingExample',
    debug: true
  });

  // ✅ EXEMPLU 2: Navigation pattern (consolidează useKeyboardNavigationSimplified)
  const navigationHandlers = useKeyboardHandler({
    onArrowUp: (e) => {
      setMessage('Arrow Up - Move focus up');
      setLastKey('ArrowUp');
    },
    onArrowDown: (e) => {
      setMessage('Arrow Down - Move focus down');
      setLastKey('ArrowDown');
    },
    onArrowLeft: (e) => {
      setMessage('Arrow Left - Move focus left');
      setLastKey('ArrowLeft');
    },
    onArrowRight: (e) => {
      setMessage('Arrow Right - Move focus right');
      setLastKey('ArrowRight');
    },
    onCtrlEnter: (e) => {
      setMessage('Ctrl+Enter - Execute action');
      setLastKey('Ctrl+Enter');
    }
  }, {
    context: 'NavigationExample',
    debug: true,
    enabled: false // Switch between examples
  });

  // ✅ EXEMPLU 3: Using utility helpers
  const { utilities } = useKeyboardHandler({}, { enabled: false });

  const cellEditingUtilityHandlers = utilities.createCellEditingHandlers(
    () => setMessage('Utility: Start editing'),
    () => setMessage('Utility: Delete content'),
    false // not readonly
  );

  const navigationUtilityHandlers = utilities.createNavigationHandlers(
    () => setMessage('Utility: Move up'),
    () => setMessage('Utility: Move down'),
    () => setMessage('Utility: Move left'),
    () => setMessage('Utility: Move right'),
    () => setMessage('Utility: Select')
  );

  return (
    <div style={{ padding: '20px', fontFamily: 'monospace' }}>
      <h2>🎹 useKeyboardHandler Examples</h2>

      <div style={{ background: '#f0f0f0', padding: '15px', margin: '10px 0' }}>
        <h3>Status:</h3>
        <p><strong>Message:</strong> {message}</p>
        <p><strong>Last Key:</strong> {lastKey}</p>
      </div>

      <div style={{ background: '#e8f4fd', padding: '15px', margin: '10px 0' }}>
        <h3>📝 Active Example: Cell Editing Pattern</h3>
        <p>Try these keys:</p>
        <ul>
          <li><kbd>F2</kbd> - Start edit mode</li>
          <li><kbd>Enter</kbd> - Start edit mode</li>
          <li><kbd>Delete</kbd> - Clear content</li>
          <li><kbd>Escape</kbd> - Cancel</li>
          <li><kbd>A-Z, 0-9</kbd> - Start typing to edit</li>
        </ul>
      </div>

      <div style={{ background: '#fff3cd', padding: '15px', margin: '10px 0' }}>
        <h3>🧭 Example: Navigation Pattern (disabled)</h3>
        <p>Switch enabled flag to test navigation:</p>
        <ul>
          <li><kbd>Arrow Keys</kbd> - Move focus</li>
          <li><kbd>Ctrl+Enter</kbd> - Execute action</li>
        </ul>
      </div>

      <div style={{ background: '#d1ecf1', padding: '15px', margin: '10px 0' }}>
        <h3>🛠️ Utility Helpers</h3>
        <p>Use utilities.createCellEditingHandlers() and utilities.createNavigationHandlers()
           for quick setup of common patterns.</p>
      </div>

      <div style={{ background: '#f8d7da', padding: '15px', margin: '10px 0' }}>
        <h3>✅ Benefits of Centralized Handler</h3>
        <ul>
          <li>✅ Consolidează duplicate patterns din EditableCell, useInlineCellEdit</li>
          <li>✅ Respectă regula "respectEditing" (ignoră când user editează în input)</li>
          <li>✅ Debug logging centralizat pentru development</li>
          <li>✅ Utility helpers pentru common use cases</li>
          <li>✅ TypeScript type safety complet</li>
          <li>✅ Event cleanup automat</li>
        </ul>
      </div>

      <div style={{ fontSize: '12px', color: '#666', marginTop: '20px' }}>
        <p><strong>Note:</strong> Check browser console for debug logs when interacting with keys.</p>
        <p><strong>Integration:</strong> This hook consolidates patterns from useGlobalKeyboardShortcuts,
           useKeyboardNavigationSimplified, EditableCell.handleKeyDownWrapper, and useInlineCellEdit.handleKeyDown.</p>
      </div>
    </div>
  );
};

export default KeyboardHandlerExample;

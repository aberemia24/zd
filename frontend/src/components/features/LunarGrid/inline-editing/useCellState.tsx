import { useState, useCallback, useMemo } from 'react';

// ===== CELL STATE TYPES =====
export type CellState = 'normal' | 'selected' | 'editing' | 'error' | 'warning' | 'saving' | 'readonly';
export type InteractionState = 'idle' | 'hover' | 'focus' | 'pressed';

export interface CellStateConfig {
  isReadonly?: boolean;
  isSaving?: boolean;
  isEditing?: boolean;
  isSelected?: boolean;
  isFocused?: boolean;
  isHovered?: boolean;
  hasError?: boolean;
  hasWarning?: boolean;
  smartValidation?: boolean;
  contextualHints?: boolean;
}

export interface CellStateReturn {
  // Computed states
  cellState: CellState;
  interactionState: InteractionState;
  shouldShowActions: boolean;
  shouldShowHints: boolean;
  
  // State setters
  setInteractionState: (state: InteractionState) => void;
  setHovered: (hovered: boolean) => void;
  
  // Event handlers
  handleMouseEnter: () => void;
  handleMouseLeave: () => void;
  handleFocus: () => void;
  handleBlur: () => void;
  handleMouseDown: () => void;
  handleMouseUp: () => void;
  
  // Mobile support
  handleTouchStart: () => void;
  handleTouchEnd: () => void;
}

// ===== ENHANCED CELL STATE HOOK =====
export const useCellState = (config: CellStateConfig): CellStateReturn => {
  // Internal state
  const [interactionState, setInteractionState] = useState<InteractionState>('idle');
  const [internalHovered, setInternalHovered] = useState(false);
  const [longPressTimer, setLongPressTimer] = useState<NodeJS.Timeout | null>(null);
  
  // Determine effective hover state - ensure it's always boolean
  const isActuallyHovered = Boolean(config.isHovered !== undefined ? config.isHovered : internalHovered);
  
  // ===== COMPUTED STATE LOGIC =====
  const computedState = useMemo(() => {
    // Determine primary cell state with precedence order
    let cellState: CellState = 'normal';
    
    if (config.isReadonly) {
      cellState = 'readonly';
    } else if (config.isSaving) {
      cellState = 'saving';
    } else if (config.hasError) {
      cellState = 'error';
    } else if (config.hasWarning && config.smartValidation) {
      cellState = 'warning';
    } else if (config.isEditing) {
      cellState = 'editing';
    } else if (config.isSelected || config.isFocused) {
      cellState = 'selected';
    }
    
    // Determine when to show action buttons
    const shouldShowActions = (config.isSelected || config.isFocused || isActuallyHovered) 
      && !config.isEditing 
      && !config.isReadonly 
      && !config.isSaving;
    
    // Determine when to show contextual hints
    const shouldShowHints = config.contextualHints 
      && (config.isSelected || config.isFocused) 
      && !config.isEditing 
      && !config.isReadonly 
      && !shouldShowActions;
    
    return {
      cellState,
      shouldShowActions,
      shouldShowHints,
    };
  }, [
    config.isReadonly,
    config.isSaving,
    config.hasError,
    config.hasWarning,
    config.smartValidation,
    config.isEditing,
    config.isSelected,
    config.isFocused,
    isActuallyHovered,
    config.contextualHints,
  ]);
  
  // ===== EVENT HANDLERS =====
  
  const handleMouseEnter = useCallback(() => {
    setInternalHovered(true);
    setInteractionState('hover');
  }, []);
  
  const handleMouseLeave = useCallback(() => {
    setInternalHovered(false);
    setInteractionState('idle');
  }, []);
  
  const handleFocus = useCallback(() => {
    setInteractionState('focus');
  }, []);
  
  const handleBlur = useCallback(() => {
    setInteractionState('idle');
  }, []);
  
  const handleMouseDown = useCallback(() => {
    setInteractionState('pressed');
  }, []);
  
  const handleMouseUp = useCallback(() => {
    setInteractionState(isActuallyHovered ? 'hover' : 'idle');
  }, [isActuallyHovered]);
  
  // ===== MOBILE SUPPORT =====
  
  const handleTouchStart = useCallback(() => {
    // Long press detection for mobile hover equivalent
    const timer = setTimeout(() => {
      setInternalHovered(true);
      setInteractionState('hover');
    }, 600); // 600ms long press
    
    setLongPressTimer(timer);
  }, []);
  
  const handleTouchEnd = useCallback(() => {
    if (longPressTimer) {
      clearTimeout(longPressTimer);
      setLongPressTimer(null);
    }
  }, [longPressTimer]);
  
  // Cleanup on unmount
  const setHovered = useCallback((hovered: boolean) => {
    setInternalHovered(hovered);
  }, []);
  
  return {
    // Computed states
    cellState: computedState.cellState,
    interactionState,
    shouldShowActions: Boolean(computedState.shouldShowActions),
    shouldShowHints: Boolean(computedState.shouldShowHints),
    
    // State setters
    setInteractionState,
    setHovered,
    
    // Event handlers
    handleMouseEnter,
    handleMouseLeave,
    handleFocus,
    handleBlur,
    handleMouseDown,
    handleMouseUp,
    
    // Mobile support
    handleTouchStart,
    handleTouchEnd,
  };
}; 
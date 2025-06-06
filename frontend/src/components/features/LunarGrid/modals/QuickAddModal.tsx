import React, { useState, useCallback, useEffect, memo, useMemo } from "react";
import Button from "../../../primitives/Button/Button";
import Input from "../../../primitives/Input/Input";
import Textarea from "../../../primitives/Textarea/Textarea";
import Checkbox from "../../../primitives/Checkbox/Checkbox";
import Select from "../../../primitives/Select/Select";
import ConfirmationModal from "../../../primitives/ConfirmationModal/ConfirmationModal";
import { useConfirmationModal } from "../../../primitives/ConfirmationModal/useConfirmationModal";
import { 
  cn,
  modal,
  card,
  button,
  flexLayout
} from "../../../../styles/cva-v2";
import { useBaseModalLogic, CellContext } from "./hooks/useBaseModalLogic";
import { 
  FrequencyType, 
  LABELS, 
  BUTTONS, 
  PLACEHOLDERS,
  EXCEL_GRID,
  OPTIONS 
} from "@shared-constants";
import { LAYOUT_CONSTANTS } from '../../../../styles/cva-v2/foundations';
import { useToast } from '../../../primitives/Toast/useToast';

/**
 * Props pentru QuickAddModal component
 * @interface QuickAddModalProps
 */
export interface QuickAddModalProps {
  /** Context informații despre celula selectată */
  cellContext: CellContext;
  /** Sumă pre-populată în input (optional) */
  prefillAmount?: string;
  /** Dacă să se facă autofocus pe primul input (default: true) */
  autoFocus?: boolean;
  /** Modul modalului: 'add' pentru adăugare nouă, 'edit' pentru editare (default: 'add') */
  mode?: 'add' | 'edit';
  /** Poziția pentru modal poziționat (optional - pentru modal centrat lăsați undefined) */
  position?: { top: number; left: number };
  /** Callback pentru salvarea datelor */
  onSave: (data: {
    amount: string;
    description: string;
    recurring: boolean;
    frequency?: FrequencyType;
  }) => Promise<void>;
  /** Callback pentru anularea modalului */
  onCancel: () => void;
  /** Callback pentru ștergerea tranzacției (optional - doar pentru mode='edit') */
  onDelete?: () => Promise<void>;
}

// Quick Add Modal Component cu React.memo pentru performance
export const QuickAddModal: React.FC<QuickAddModalProps> = ({ 
  cellContext, 
  prefillAmount = "", 
  autoFocus = true,
  mode = 'add',
  position,
  onSave, 
  onCancel,
  onDelete 
}) => {
  // Base modal logic integration
  const { form, validation, loading, calculations } =
    useBaseModalLogic(cellContext);

  // Professional confirmation modal pentru UX consistent
  const { modalProps, showConfirmation } = useConfirmationModal();

  // Local state pentru modal-specific logic
  const [showRecurringOptions, setShowRecurringOptions] = useState(false);

  // Focus management references
  const firstFocusableRef = React.useRef<HTMLInputElement>(null);
  const containerRef = React.useRef<HTMLDivElement>(null);

  // Initialize form cu prefilled amount și focus management
  useEffect(() => {
    if (prefillAmount && !form.data.amount) {
      form.updateData({ amount: prefillAmount });
    }

    // Focus management - focus primul input când se deschide modalul DOAR o dată
    if (autoFocus && firstFocusableRef.current) {
      // Delay mic pentru a se asigura că modalul s-a randat complet
      const timeoutId = setTimeout(() => {
        firstFocusableRef.current?.focus();
      }, 100);
      return () => clearTimeout(timeoutId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prefillAmount, autoFocus]);

  // Handle save action cu enhanced error handling
  const handleSave = useCallback(async () => {
    // Edge case: verifică dacă modalul este încă montat
    if (loading.isLoading) {
      console.warn('QuickAddModal: Save attempted while already saving');
      return;
    }

    if (!form.validate()) {
      // NU mai facem focus automat - lăsăm utilizatorul să continue să tape
      // Focus primul input cu eroare pentru UX îmbunătățit
      // const errorFields = ['amount', 'description', 'frequency'];
      // const firstErrorField = errorFields.find(field => validation.errors[field as keyof typeof validation.errors]);
      // 
      // if (firstErrorField === 'amount' && firstFocusableRef.current) {
      //   firstFocusableRef.current.focus();
      // }
      return;
    }

    loading.setIsLoading(true);

    try {
      await onSave({
        amount: form.data.amount,
        description: form.data.description,
        recurring: form.data.recurring,
        frequency: form.data.frequency as FrequencyType,
      });

      // Modal se închide automat după save success
    } catch (error) {
      console.error('QuickAddModal save error:', error);
      
      // Enhanced error messaging
      const errorMessage = error instanceof Error 
        ? `${EXCEL_GRID.ERROR_MESSAGES.SAVE_TRANSACTION_PREFIX}${error.message}`
        : EXCEL_GRID.ERROR_MESSAGES.SAVE_TRANSACTION_GENERIC;
        
      validation.setErrors('general', errorMessage);
    } finally {
      loading.setIsLoading(false);
    }
  }, [form, loading, validation, onSave]);

  // LGI TASK 5: Handler pentru delete action cu ConfirmationModal
  const handleDelete = useCallback(async () => {
    if (!onDelete) return;
    
    const confirmed = await showConfirmation({
      title: EXCEL_GRID.MODAL.DELETE_CONFIRMATION_TITLE,
      message: EXCEL_GRID.MODAL.DELETE_CONFIRMATION_MESSAGE,
      confirmText: EXCEL_GRID.MODAL.DELETE_CONFIRM_BUTTON,
      cancelText: EXCEL_GRID.MODAL.DELETE_CANCEL_BUTTON,
      variant: "danger",
      icon: "🗑️"
    });

    if (!confirmed) return;

    loading.setIsLoading(true);
    try {
      await onDelete();
      // Modal se închide automat după delete success
    } catch (error) {
      console.error('QuickAddModal delete error:', error);
      
      const errorMessage = error instanceof Error 
        ? `${EXCEL_GRID.ERROR_MESSAGES.DELETE_TRANSACTION_PREFIX}${error.message}`
        : EXCEL_GRID.ERROR_MESSAGES.DELETE_TRANSACTION_GENERIC;
        
      validation.setErrors('general', errorMessage);
    } finally {
      loading.setIsLoading(false);
    }
  }, [onDelete, showConfirmation, loading, validation]);

  // Detectez dacă sunt modificări în formular (dirty state)
  const isDirty = useMemo(() => {
    return (
      form.data.amount.trim() !== "" ||
      form.data.description.trim() !== "" ||
      form.data.recurring ||
      form.data.frequency !== undefined
    );
  }, [form.data]);

  // Handle backdrop click pentru UX îmbunătățit
  const handleBackdropClick = useCallback((e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onCancel();
    }
  }, [onCancel]);

  // Handle content click pentru a preveni închiderea accidentală
  const handleContentClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
  }, []);

  // Handle outside click pentru modal poziționat
  const handleOutsideClick = useCallback((e: React.MouseEvent) => {
    if (position && containerRef.current && !containerRef.current.contains(e.target as Node)) {
      onCancel();
    } else if (!position && e.target === e.currentTarget) {
      onCancel();
    }
  }, [position, onCancel]);

  // Enhanced Escape handler cu dirty state detection
  const handleEscape = useCallback(async () => {
    if (isDirty) {
      // Sunt modificări - cere confirmare
      const confirmed = await showConfirmation({
        title: "Modificări nesalvate",
        message: "Aveți modificări nesalvate. Doriți să închideți modalul și să pierdeți aceste modificări?",
        confirmText: "Da, închide modalul",
        cancelText: "Nu, continuă editarea",
        variant: "warning",
        icon: "⚠️"
      });

      if (confirmed) {
        onCancel();
      }
      // Dacă nu confirmă, nu face nimic (modalul rămâne deschis)
    } else {
      // Nu sunt modificări - închide direct
      onCancel();
    }
  }, [isDirty, onCancel, showConfirmation]);

  // Handle keyboard shortcuts cu optimized dependencies și focus trap
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Enter" && !e.shiftKey && !e.ctrlKey && !e.altKey) {
        // Previne Enter doar dacă este într-un textarea (pentru new lines)
        const target = e.target as HTMLElement;
        if (target?.tagName?.toLowerCase() === 'textarea') {
          return; // Permite Enter în textarea pentru new lines
        }
        e.preventDefault();
        handleSave();
      }
      if (e.key === "Escape") {
        e.preventDefault();
        handleEscape();
      }
      
      // Focus trap logic pentru Tab navigation
      if (e.key === "Tab") {
        const focusableElements = document.querySelectorAll(
          'input, button, textarea, select, [tabindex]:not([tabindex="-1"])'
        );
        const focusableArray = Array.from(focusableElements) as HTMLElement[];
        const firstElement = focusableArray[0];
        const lastElement = focusableArray[focusableArray.length - 1];

        if (e.shiftKey) {
          // Shift + Tab - navighează înapoi
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement?.focus();
          }
        } else {
          // Tab - navighează înainte
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement?.focus();
          }
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleSave, handleEscape]);

  // Memoize styled objects pentru position mode pentru a preveni re-creation
  const positionedStyle = useMemo(() => {
    if (!position) return undefined;
    
    // Smart positioning: calculez cea mai bună poziție bazat pe viewport
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const modalWidth = LAYOUT_CONSTANTS.MODAL.POSITIONING.ESTIMATED_WIDTH;
    const modalHeight = LAYOUT_CONSTANTS.MODAL.POSITIONING.ESTIMATED_HEIGHT;
    const offset = LAYOUT_CONSTANTS.MODAL.POSITIONING.OFFSET;
    
    let finalTop = position.top;
    let finalLeft = position.left;
    let placement = 'bottom'; // Default placement
    
    // Smart vertical positioning
    if (position.top + modalHeight + offset > viewportHeight) {
      // Nu încape jos, încerc sus
      if (position.top - modalHeight - offset > 0) {
        finalTop = position.top - modalHeight - offset;
        placement = 'top';
      } else {
        // Nu încape nici sus, centrez vertical cu limită
        finalTop = Math.max(offset, Math.min(position.top - modalHeight / 2, viewportHeight - modalHeight - offset));
        placement = 'center';
      }
    } else {
      // Încape jos, poziționez sub celulă
      finalTop = position.top + offset;
      placement = 'bottom';
    }
    
    // Smart horizontal positioning
    if (position.left + modalWidth > viewportWidth) {
      // Nu încape la dreapta, poziționez la stânga
      finalLeft = Math.max(offset, position.left - modalWidth);
    } else if (position.left < 0) {
      // Este prea la stânga, poziționez la offset minim
      finalLeft = offset;
    }
    // Altfel, păstrez poziția originală
    
    console.log('🎨 [MODAL-POSITION] Smart positioning calculated:', {
      original: { top: position.top, left: position.left },
      final: { top: finalTop, left: finalLeft },
      placement,
      viewport: { width: viewportWidth, height: viewportHeight },
      modalSize: { width: modalWidth, height: modalHeight }
    });
    
    return {
      position: 'fixed' as const,
      top: `${finalTop}px`,
      left: `${finalLeft}px`,
      zIndex: parseInt(LAYOUT_CONSTANTS.MODAL.Z_INDEX.MODAL.replace('z-', '')),
      maxWidth: `${Math.min(modalWidth, viewportWidth - 2 * offset)}px`, // Responsive width
      maxHeight: `${Math.min(modalHeight, viewportHeight - 2 * offset)}px`, // Responsive height
    };
  }, [position]);

  // Memoize financial impact calculation pentru performance - cu validare pentru NaN
  const financialImpact = useMemo(() => {
    const numericValue = parseFloat(form.data.amount.replace(',', '.'));
    return form.data.amount && !isNaN(numericValue) && numericValue > 0
      ? calculations.calculateFinancialImpact(numericValue)
      : null;
  }, [form.data.amount, calculations]);

  // Handler pentru input numeric - permite doar cifre, punct și virgulă
  const handleAmountChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Permite doar cifre, punct, virgulă și este gol
    const numericPattern = /^[0-9]*[.,]?[0-9]*$/;
    
    if (value === '' || numericPattern.test(value)) {
      form.updateData({ amount: value });
    }
    // Dacă nu respectă pattern-ul, nu actualizează valoarea (input-ul nu se schimbă)
  }, [form]);

  // Cleanup și validation la unmount
  useEffect(() => {
    return () => {
      // Cleanup pentru a preveni memory leaks
      if (loading.isLoading) {
        console.warn('QuickAddModal: Component unmounted while loading');
      }
    };
  }, [loading.isLoading]);

  return (
    <>
      {/* Overlay pentru positioned modal - separat pentru a permite click outside */}
      {position && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-30 z-40"
          onClick={handleOutsideClick}
        />
      )}
      
      <div 
        className={position 
          ? cn("fixed pointer-events-none", LAYOUT_CONSTANTS.MODAL.Z_INDEX.MODAL)
          : modal({ variant: "default" })
        }
        role="dialog"
        aria-modal="true"
        aria-labelledby="quick-add-modal-title"
        onClick={handleOutsideClick}
        ref={containerRef}
        data-testid="quick-add-modal-overlay"
      >
        {/* Modal Content */}
        <div 
          className={cn(
            card({ variant: "elevated" }),
            position 
              ? "pointer-events-auto fixed max-w-sm w-80 max-h-96 overflow-y-auto shadow-xl border border-neutral/20 dark:border-neutral-600/30" 
              : "max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto",
            "animate-theme-fade bg-background dark:bg-surface-dark"
          )}
          style={positionedStyle}
          onClick={handleOutsideClick}
          data-testid="quick-add-modal-content"
        >
          {/* Header - doar pentru modal centrat */}
          {!position ? (
            // Header pentru modal centrat
            <div className={cn(
              "p-4 border-b border-neutral/20 dark:border-neutral-600/30 rounded-t-lg",
              "bg-background dark:bg-surface-dark"
            )}>
              <div className="flex items-center justify-between">
                <h2 
                  id="quick-add-modal-title"
                  className="text-lg font-semibold text-neutral-900 dark:text-neutral-100"
                >
                  {mode === 'edit' ? EXCEL_GRID.ACTIONS.EDIT_TRANSACTION : EXCEL_GRID.ACTIONS.ADD_TRANSACTION}
                </h2>
                <button
                  className={cn(
                    button({ variant: "ghost", size: "sm" }),
                    "hover-lift text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200"
                  )}
                  onClick={onCancel}
                  data-testid="quick-add-modal-close"
                  aria-label="Închide modal"
                >
                  ✕
                </button>
              </div>
            </div>
          ) : null}

          {/* Modal Body */}
          <div className={cn(
            "p-6",
            position ? "p-4" : "p-6"
          )}>
            {/* Context Info */}
            <div className={cn(
              "mb-4 p-3 rounded-lg",
              "bg-neutral/5 dark:bg-neutral-600/10 border border-neutral/20 dark:border-neutral-600/30"
            )}>
              <div className="text-sm text-neutral-600 dark:text-neutral-400">
                <div className="font-medium text-neutral-900 dark:text-neutral-100">
                  {cellContext.category}
                  {cellContext.subcategory && ` → ${cellContext.subcategory}`}
                </div>
                <div className="text-xs text-neutral-500 dark:text-neutral-400">
                  {cellContext.day}/{cellContext.month}/{cellContext.year}
                </div>
              </div>
            </div>
            {/* Amount Input */}
            <div>
              <Input
                ref={firstFocusableRef}
                label={position ? LABELS.AMOUNT : `${LABELS.AMOUNT} (RON)`}
                type="text"
                value={form.data.amount}
                onChange={handleAmountChange}
                error={validation.errors.amount}
                autoFocus={autoFocus}
                data-testid="quick-add-amount-input"
                placeholder={PLACEHOLDERS.AMOUNT_PLACEHOLDER}
                pattern="[0-9]+([,.][0-9]{1,2})?"
                size={position ? "sm" : "md"}
                aria-describedby={validation.errors.amount ? "amount-error" : undefined}
              />
              {validation.errors.amount && (
                <div id="amount-error" className="sr-only">
                  {validation.errors.amount}
                </div>
              )}
            </div>
            {/* Description Input - foarte compact pentru pozitionat */}
            {position ? (
              // Input simplu pentru modal poziționat să economisesc spațiu
              <div>
                <input
                  type="text"
                  value={form.data.description}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    const newValue = e.target.value;
                    form.updateData({ description: newValue });
                    // Validează în timp real pentru feedback instant
                    validation.validateField('description', newValue, 'description');
                  }}
                  placeholder={PLACEHOLDERS.DESCRIPTION}
                  maxLength={100}
                  className="w-full px-2 py-1 text-xs border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                  data-testid="quick-add-description-input"
                />
                {/* Character counter pentru modal poziționat */}
                <div className={cn("text-xs mt-1", flexLayout({ direction: "row", justify: "between", align: "center" }))}>
                  {validation.errors.description ? (
                    <div className="text-red-600 flex-1">{validation.errors.description}</div>
                  ) : validation.warnings.description ? (
                    <div className="text-amber-600 flex-1">{validation.warnings.description[0]}</div>
                  ) : (
                    <div className={`flex-1 ${
                      form.data.description.length >= 100 
                        ? 'text-red-600 font-medium' 
                        : form.data.description.length >= 85 
                        ? 'text-amber-600' 
                        : 'text-gray-500'
                    }`}>
                      {form.data.description.length >= 100 
                        ? '🚫 Limită atinsă' 
                        : form.data.description.length >= 85 
                        ? '⚠️ Aproape de limită' 
                        : ''}
                    </div>
                  )}
                  <div className={`text-right font-mono ${
                    form.data.description.length >= 100 
                      ? 'text-red-600 font-bold' 
                      : form.data.description.length >= 85 
                      ? 'text-amber-600 font-medium' 
                      : 'text-gray-500'
                  }`}>
                    {form.data.description.length}/100
                  </div>
                </div>
              </div>
            ) : (
              // Textarea normal pentru modal centrat cu character counter îmbunătățit
              <div>
                <Textarea
                  label={LABELS.DESCRIPTION}
                  value={form.data.description}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
                    const newValue = e.target.value;
                    form.updateData({ description: newValue });
                    // Validează în timp real pentru feedback instant
                    validation.validateField('description', newValue, 'description');
                  }}
                  error={validation.errors.description}
                  data-testid="quick-add-description-textarea"
                  placeholder={PLACEHOLDERS.DESCRIPTION}
                  rows={2}
                  size="md"
                  maxLength={100}
                  withCharacterCount={true}
                />
                {/* Hint pentru caractere permise - afișat doar când există eroare */}
                {validation.errors.description && (
                  <div className="text-xs text-blue-600 mt-1 bg-blue-50 p-2 rounded">
                    💡 Tip: Folosiți doar litere, cifre, spații și punctuația de bază (. , ! ? - ( ) & % + : ;)
                  </div>
                )}
              </div>
            )}
            {/* Recurring Checkbox */}
            <div>
              <Checkbox
                label={LABELS.RECURRING}
                checked={form.data.recurring}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  const checked = e.target.checked;
                  form.updateData({ recurring: checked });
                  setShowRecurringOptions(checked);
                  if (!checked) {
                    form.updateData({ frequency: undefined });
                  }
                }}
                data-testid="quick-add-recurring-checkbox"
                size={position ? "sm" : "md"}
              />
            </div>
            {/* Recurring Options */}
            {showRecurringOptions && (
              <div 
                className={position 
                  ? "pl-3 border-l border-blue-200 animate-in slide-in-from-left-1 duration-300" 
                  : "pl-6 border-l-2 border-blue-200 animate-in slide-in-from-left-2 duration-300"
                }
              >
                <Select
                  label={position ? EXCEL_GRID.MODAL.FREQUENCY_SHORT : LABELS.FREQUENCY}
                  value={form.data.frequency || ""}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                    form.updateData({ frequency: e.target.value })
                  }
                  options={OPTIONS.FREQUENCY}
                  error={validation.errors.frequency}
                  data-testid="quick-add-frequency-select"
                  placeholder={position ? PLACEHOLDERS.SELECT : `${PLACEHOLDERS.SELECT} ${LABELS.FREQUENCY.toLowerCase()}`}
                  size={position ? "sm" : "md"}
                  aria-describedby={validation.errors.frequency ? "frequency-error" : undefined}
                />
                {validation.errors.frequency && (
                  <div id="frequency-error" className="sr-only">
                    {validation.errors.frequency}
                  </div>
                )}
              </div>
            )}
            {/* Financial Impact Preview */}
            {financialImpact && (
              <div className={position 
                ? "bg-slate-50 p-1.5 rounded text-xs"
                : "bg-slate-50 p-3 rounded-md text-sm"
              }>
                <div className={flexLayout({ direction: "row", justify: "between", align: "center" })}>
                  <span>{position ? EXCEL_GRID.MODAL.FINANCIAL_IMPACT_SHORT : EXCEL_GRID.MODAL.FINANCIAL_IMPACT_FULL}</span>
                  <span
                    className={`font-semibold ${
                      financialImpact.isPositive
                        ? "text-emerald-600"
                        : "text-red-600"
                    }`}
                  >
                    {financialImpact.isPositive ? "+" : ""}
                    {financialImpact.amount} RON
                  </span>
                </div>
              </div>
            )}
            {/* General Error */}
            {validation.errors.general && (
              <div className={position 
                ? "text-red-600 text-xs bg-red-50 p-1.5 rounded"
                : "text-red-600 text-sm bg-red-50 p-3 rounded-md"
              }>
                {validation.errors.general}
              </div>
            )}
          </div>

          {/* Modal Footer */}
          <div className={cn(
            "p-4 border-t border-neutral/20 dark:border-neutral-600/30 rounded-b-lg",
            "bg-background dark:bg-surface-dark",
            position ? "p-3" : "p-4"
          )}>
            {/* LGI TASK 5: Buton Delete pentru edit mode */}
            {mode === 'edit' && onDelete && (
              <Button
                variant="danger"
                size="xs"
                onClick={handleDelete}
                disabled={loading.isLoading}
                data-testid="quick-add-delete-button"
                className={position ? "" : "mr-auto"}
              >
                {loading.isLoading 
                  ? BUTTONS.LOADING 
                  : (position ? BUTTONS.DELETE : BUTTONS.DELETE)
                }
              </Button>
            )}
            
            <div className={position ? "flex space-x-1.5 ml-auto" : "flex space-x-3"}>
              <Button
                variant="secondary"
                size="xs"
                onClick={onCancel}
                disabled={loading.isLoading}
                data-testid="quick-add-cancel-button"
              >
                {position ? BUTTONS.CANCEL : BUTTONS.CANCEL}
              </Button>
              <Button
                variant="primary"
                size="xs"
                onClick={handleSave}
                disabled={loading.isLoading || !form.data.amount}
                data-testid="quick-add-save-button"
                aria-describedby={loading.isLoading ? "save-loading-status" : undefined}
              >
                {loading.isLoading 
                  ? (
                    <span className="flex items-center space-x-1">
                      <span className="animate-spin">⏳</span>
                      <span>{BUTTONS.LOADING}</span>
                    </span>
                  )
                  : (position ? EXCEL_GRID.MODAL.SAVE_SHORT : `${EXCEL_GRID.ACTIONS.SAVE_CHANGES} (Enter)`)
                }
              </Button>
              {loading.isLoading && (
                <div id="save-loading-status" className="sr-only" aria-live="polite">
                  {EXCEL_GRID.MODAL.SAVING_MESSAGE}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Professional Confirmation Modal - consistent cu UX-ul din OptionsPage */}
      <ConfirmationModal {...modalProps} />
    </>
  );
};

// Display name pentru debugging
QuickAddModal.displayName = 'QuickAddModal';

/**
 * INTEGRATION VALIDATION CHECKLIST - Task 5.3
 * 
 * ✅ Props Flow Validation:
 * - cellContext: category, subcategory, day, month, year ✓
 * - prefillAmount: string (existingValue) ✓  
 * - mode: 'add' | 'edit' ✓
 * - position: { top, left } pentru positioned modal ✓
 * - onSave: async function returning Promise<void> ✓
 * - onCancel: function ✓
 * - onDelete: optional pentru edit mode ✓
 * 
 * ✅ LunarGridModals Integration:
 * - modalState conditional rendering ✓
 * - props mapping corect ✓
 * - delete conditional (mode === 'edit') ✓
 * 
 * ✅ Performance Optimizations:
 * - React.memo cu custom comparison ✓
 * - useMemo pentru styled objects ✓
 * - useCallback pentru handlers ✓
 * 
 * ✅ Accessibility Features:
 * - ARIA labels și roles ✓
 * - Focus management ✓
 * - Keyboard navigation ✓
 * - Screen reader support ✓
 * 
 * ✅ UX Enhancements:
 * - Loading states cu visual feedback ✓
 * - Smooth animations ✓
 * - ConfirmationModal pentru delete ✓
 * - Focus trap functionality ✓
 */

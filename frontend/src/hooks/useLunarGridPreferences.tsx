import { useCallback } from 'react';
import toast from 'react-hot-toast';
import { useLocalStoragePersistence } from './useStatePersistence';
import { STORAGE_KEYS, PREFERENCE_DEFAULTS } from '@budget-app/shared-constants';
import * as UI from '@budget-app/shared-constants/ui';

/**
 * Tipuri pentru LunarGrid preferences
 */
export interface LunarGridPreferences {
  /** Dacă să se afișeze confirmarea pentru ștergere cu Delete key */
  deleteConfirmationEnabled: boolean;
  
  // FUTURE EXTENSIBILITY - ușor de adăugat:
  // /** Delay pentru auto-save în milisecunde */
  // autoSaveDelay?: number;
  // /** Dacă să se afișeze liniile grid-ului */
  // showGridLines?: boolean;
  // /** Mod compact pentru mai multe date pe ecran */
  // compactMode?: boolean;
  // /** Dacă keyboard shortcuts sunt activate */
  // keyboardShortcutsEnabled?: boolean;
}

/**
 * Hook pentru gestionarea preferințelor LunarGrid
 * 
 * @example
 * ```tsx
 * const { preferences, toggleDeleteConfirmation, resetToDefaults } = useLunarGridPreferences();
 * 
 * // Verifică dacă confirmarea e activată
 * if (preferences.deleteConfirmationEnabled) {
 *   showConfirmation();
 * }
 * 
 * // Toggle confirmarea cu feedback
 * <button onClick={toggleDeleteConfirmation}>
 *   {preferences.deleteConfirmationEnabled ? 'Dezactivează' : 'Activează'} confirmarea
 * </button>
 * ```
 */
export const useLunarGridPreferences = () => {
  // Persistența pentru delete confirmation
  const {
    value: deleteConfirmationEnabled,
    setValue: setDeleteConfirmationEnabled,
    clearValue: clearDeleteConfirmation,
    isLoaded: isDeleteConfirmLoaded,
    error: deleteConfirmError
  } = useLocalStoragePersistence<boolean>({
    key: STORAGE_KEYS.LUNAR_GRID_DELETE_CONFIRM,
    defaultValue: PREFERENCE_DEFAULTS.DELETE_CONFIRMATION_ENABLED,
    serialize: (value: boolean) => value ? 'true' : 'false',
    deserialize: (value: string) => value !== 'false', // Orice altceva decât 'false' = true
    debug: process.env.NODE_ENV === 'development'
  });

  /**
   * Preferences object consolidat
   */
  const preferences: LunarGridPreferences = {
    deleteConfirmationEnabled
  };

  /**
   * Toggle delete confirmation cu feedback automat
   */
  const toggleDeleteConfirmation = useCallback(() => {
    const newValue = !deleteConfirmationEnabled;
    setDeleteConfirmationEnabled(newValue);
    
    // Feedback automat pentru user
    const message = newValue 
      ? UI.LUNAR_GRID_DELETE_CONFIRM_ENABLED_SUCCESS
      : UI.LUNAR_GRID_DELETE_CONFIRM_DISABLED_SUCCESS;
    
    toast.success(message);
  }, [deleteConfirmationEnabled, setDeleteConfirmationEnabled]);

  /**
   * Setează delete confirmation cu feedback opțional
   */
  const setDeleteConfirmation = useCallback((enabled: boolean, showFeedback = true) => {
    setDeleteConfirmationEnabled(enabled);
    
    if (showFeedback) {
      const message = enabled 
        ? UI.LUNAR_GRID_DELETE_CONFIRM_ENABLED_SUCCESS
        : UI.LUNAR_GRID_DELETE_CONFIRM_DISABLED_SUCCESS;
      
      toast.success(message);
    }
  }, [setDeleteConfirmationEnabled]);

  /**
   * Reset toate preferințele la valorile default
   */
  const resetToDefaults = useCallback(() => {
    clearDeleteConfirmation();
    toast.success('Preferințele LunarGrid au fost resetate la valorile implicite');
  }, [clearDeleteConfirmation]);

  /**
   * Verifică dacă toate preferințele sunt încărcate
   */
  const isLoaded = isDeleteConfirmLoaded;

  /**
   * Verifică dacă există erori
   */
  const hasErrors = !!deleteConfirmError;

  /**
   * Toate erorile consolidate
   */
  const errors = [deleteConfirmError].filter(Boolean);

  return {
    // State
    preferences,
    isLoaded,
    hasErrors,
    errors,

    // Actions - Delete Confirmation
    toggleDeleteConfirmation,
    setDeleteConfirmation,

    // Utility
    resetToDefaults
  };
};

/**
 * Hook pentru verificarea rapidă a delete confirmation 
 * (pentru folosire în componente care doar citesc valoarea)
 */
export const useDeleteConfirmationEnabled = (): boolean => {
  const { preferences } = useLunarGridPreferences();
  return preferences.deleteConfirmationEnabled;
};

export default useLunarGridPreferences; 
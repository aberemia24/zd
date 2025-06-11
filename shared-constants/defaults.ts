// Valorile implicite pentru aplicație
export const PAGINATION = {
  DEFAULT_LIMIT: 10,
  DEFAULT_OFFSET: 0,
  DEFAULT_SORT: 'date',
};

export const FORM_DEFAULTS = {
  CURRENCY: 'RON',
  DATE_FORMAT: 'YYYY-MM-DD',
};

export const INITIAL_FORM_STATE = {
  type: '',
  amount: '',
  category: '',
  subcategory: '',
  date: '',
  recurring: false,
  frequency: '',
  description: '',
};

// Feature flags pentru componente LunarGrid
export const LUNAR_GRID_FEATURE_FLAGS = {
  // Comutare între arhitectura monolitică și orchestrator
  USE_STATE_MANAGER: true, // false = monolithic pattern, true = orchestrator pattern
  
  // Alte feature flags pentru dezvoltare graduală
  USE_ENHANCED_KEYBOARD_NAV: true,
  USE_PERFORMANCE_OPTIMIZATIONS: true,
  USE_DEBUG_MODE: false,
};

// LocalStorage Keys
export const STORAGE_KEYS = {
  // Theme and UI preferences
  DARK_MODE: 'darkMode',
  SIDEBAR_EXPANDED: 'sidebar-expanded',
  
  // LunarGrid preferences  
  LUNAR_GRID_DELETE_CONFIRM: 'lunar-grid-delete-confirm',
  LUNAR_GRID_LAST_CATEGORY_UPDATE: 'budget-app-last-category-update',
  
  // FUTURE LUNARGRID PREFERENCES - ușor de adăugat:
  // LUNAR_GRID_AUTO_SAVE_DELAY: 'lunar-grid-auto-save-delay',
  // LUNAR_GRID_SHOW_GRID_LINES: 'lunar-grid-show-grid-lines', 
  // LUNAR_GRID_COMPACT_MODE: 'lunar-grid-compact-mode',
  // LUNAR_GRID_KEYBOARD_SHORTCUTS: 'lunar-grid-keyboard-shortcuts',
  
  // Component state persistence
  TABS_ACTIVE: 'tabs-active',
  EXPANDED_ROWS: 'expanded-rows'
} as const;

// Default values for preferences
export const PREFERENCE_DEFAULTS = {
  // LunarGrid preferences
  DELETE_CONFIRMATION_ENABLED: true,
  
  // FUTURE DEFAULTS - exemplu de extensibilitate:
  // AUTO_SAVE_DELAY: 1000, // ms
  // SHOW_GRID_LINES: true,
  // COMPACT_MODE: false,
  // KEYBOARD_SHORTCUTS_ENABLED: true,
  
  // UI preferences
  SIDEBAR_EXPANDED: true,
  DARK_MODE: false
} as const;

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
    // Component state persistence
    TABS_ACTIVE: 'tabs-active',
    EXPANDED_ROWS: 'expanded-rows'
};
// Default values for preferences
export const PREFERENCE_DEFAULTS = {
    // LunarGrid preferences
    DELETE_CONFIRMATION_ENABLED: true,
    // UI preferences
    SIDEBAR_EXPANDED: true,
    DARK_MODE: false
};

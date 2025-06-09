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

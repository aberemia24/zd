// Exportăm fișierele pentru a fi disponibile în întreaga aplicație
export * from './themeTypes';
export * from './themeUtils';
export * from './componentMap';

// Export fișiere specifice de componentMap
import tableConfig from './componentMap/table';
import categoryConfig from './componentMap/category';

export {
  tableConfig,
  categoryConfig
}; 
/**
 * CVA STYLING SYSTEM - Main exports
 * 
 * Sistem de stilizare modern bazat pe Class Variance Authority
 * Înlocuiește sistemul componentMap cu:
 * - Professional Blue Palette
 * - CVA pentru type safety și performance  
 * - Logical domain grouping
 * - 100% capability preservation
 */

// Components domain (forms, feedback, layout)
export * from './components';

// Grid domain (grid-specific components și effects)
// export * from './grid'; // TBD

// Data domain (display components, category styling)
// export * from './data'; // TBD  

// Shared utilities (cn function, effects, helpers)
export * from './shared';

/**
 * Quick access to common components
 * For convenience și backward compatibility
 */
export { 
  button, 
  input, 
  select, 
  textarea, 
  checkbox, 
  label,
  type ButtonProps,
  type InputProps,
  type SelectProps,
  type TextareaProps,
  type CheckboxProps,
  type LabelProps
} from './components/forms';

export { cn } from './shared/utils'; 
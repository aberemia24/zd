// themeUtils.ts - CLEANED UP after CVA migration
import theme from './theme';
import type { ComponentVariant, ComponentSize, ComponentClasses, ComponentState, ComponentType } from './themeTypes';

/**
 * @deprecated This entire file is deprecated after CVA migration completion.
 * Use CVA system from styles/new/ instead.
 * This file is kept only for minimal backward compatibility during transition period.
 */

// Export theme for legacy compatibility
export default theme;
export { theme };

// Re-export types for backward compatibility
export type { ComponentVariant, ComponentSize, ComponentClasses, ComponentState, ComponentType };

/**
 * @deprecated All component styling functions have been replaced by CVA system.
 * Use components from styles/new/ instead.
 * This stub is kept for backward compatibility only.
 */
export function getComponentClasses(): ComponentClasses {  console.warn('[DEPRECATED] getComponentClasses has been replaced by CVA system. Use components from styles/new/ instead.');  return '';}

/**
 * @deprecated Color utilities have been replaced by Tailwind classes.
 * Use Tailwind color classes directly instead.
 */
export function getColorClass(): string {
  console.warn('[DEPRECATED] getColorClass has been replaced by Tailwind classes. Use text-*, bg-*, border-* classes directly.');
  return '';
}

/**
 * @deprecated Theme value access has been replaced by CSS variables.
 * Access theme values through CSS variables or theme.ts directly.
 */
export function getThemeValue(): unknown {
  console.warn('[DEPRECATED] getThemeValue has been replaced by CSS variables. Access theme through CSS variables or theme.ts directly.');
  return undefined;
}

/**
 * @deprecated Responsive utilities have been replaced by Tailwind responsive classes.
 * Use sm:, md:, lg:, xl: prefixes directly instead.
 */
export function responsive(): string {
  console.warn('[DEPRECATED] responsive utility has been replaced by Tailwind responsive classes. Use sm:, md:, lg:, xl: prefixes directly.');
  return '';
}
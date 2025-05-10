// Utilitare pentru accesarea design tokens în cod și componente
import theme from './theme';
import type { ComponentVariant, ComponentSize, ComponentClasses, Theme } from './themeTypes';

// Obține valoare din theme folosind path (ex: 'colors.primary.500')
export function getThemeValue(path: string): any {
  return path.split('.').reduce((obj, key) => (obj && obj[key] !== undefined ? obj[key] : undefined), theme);
}

// Generează clase pentru componente (type-safe, semantic)
export function getComponentClasses(
  componentType: 'button' | 'input',
  variant: ComponentVariant = 'primary',
  size: ComponentSize = 'md'
): ComponentClasses {
  const componentMap = {
    button: {
      base: 'font-medium rounded-md transition-colors duration-200 inline-flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed',
      variants: {
        primary: 'bg-primary-500 text-white hover:bg-primary-600 focus:ring-2 focus:ring-primary-300',
        secondary: 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 focus:ring-2 focus:ring-primary-300',
        success: 'bg-success-500 text-white hover:bg-success-600 focus:ring-2 focus:ring-success-300',
        danger: 'bg-error-500 text-white hover:bg-error-600 focus:ring-2 focus:ring-error-300',
        ghost: 'text-primary-600 hover:bg-primary-50 focus:ring-2 focus:ring-primary-300',
      },
      sizes: {
        xs: 'px-2 py-1 text-xs',
        sm: 'px-3 py-1.5 text-sm',
        md: 'px-4 py-2 text-sm',
        lg: 'px-5 py-2.5 text-base',
        xl: 'px-6 py-3 text-lg',
      },
    },
    input: {
      base: 'w-full border rounded-md px-3 py-2 transition-colors duration-200 disabled:bg-gray-100 disabled:cursor-not-allowed',
      variants: {
        primary: 'border-gray-300 focus:border-primary-500 focus:ring-1 focus:ring-primary-300',
        success: 'border-success-300 focus:border-success-500 focus:ring-1 focus:ring-success-300',
        danger: 'border-error-300 focus:border-error-500 focus:ring-1 focus:ring-error-300',
      },
      sizes: {
        sm: 'px-2.5 py-1.5 text-sm',
        md: 'px-3 py-2 text-sm',
        lg: 'px-4 py-2.5 text-base',
      },
    },
  };
  const component = componentMap[componentType];
  if (!component) return '';
  const variantClass = (component.variants as Record<string, string>)[variant] || component.variants.primary;
  const sizeClass = (component.sizes as Record<string, string>)[size] || component.sizes.md;
  const classes = [
    component.base,
    variantClass,
    sizeClass,
  ];
  return classes.filter(Boolean).join(' ');
}

// Helper pentru clasa de culoare (folositor pentru sume, semantic)
export function getColorClass(type: 'text' | 'bg' | 'border', color: keyof Theme['colors'], shade?: keyof typeof theme.colors['primary']): string {
  const prefix = {
    text: 'text',
    bg: 'bg',
    border: 'border',
  }[type];
  return shade ? `${prefix}-${color}-${shade}` : `${prefix}-${color}`;
}

// Helper pentru formatare responsive
export function responsive(config: Record<string, string>): string {
  return Object.entries(config)
    .map(([breakpoint, value]) => (breakpoint === 'base' ? value : `${breakpoint}:${value}`))
    .join(' ');
}

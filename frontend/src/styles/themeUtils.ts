// Utilitare pentru accesarea design tokens în cod și componente
import theme from './theme';
import type { ComponentVariant, ComponentSize, ComponentClasses, Theme } from './themeTypes';

// Obține valoare din theme folosind path (ex: 'colors.primary.500')
// Acces ierarhic sigur la valori din theme (fără index signature pe Theme)
export function getThemeValue(path: string): unknown {
  const parts = path.split('.');
  let value: unknown = theme;
  for (const key of parts) {
    if (value && typeof value === 'object' && key in value) {
      // @ts-expect-error: acces nested controlat
      value = value[key];
    } else {
      return undefined;
    }
  }
  return value;
}

// Generează clase pentru componente (type-safe, semantic)
// Suport extins pentru toate componentele și stările
export function getComponentClasses(
  componentType: string,
  variant?: string,
  size?: string,
  state?: string
): ComponentClasses {
  // Permite accesarea rapidă pentru layout semantic
  if (componentType === 'formRow') return theme.layout.formRow;
  if (componentType === 'buttonGroup') return theme.layout.buttonGroup;
  const c = theme.components;
  switch (componentType) {
    case 'button':
      return [
        c.button?.base,
        variant ? c.button?.variants?.[variant] : undefined,
        size ? c.button?.sizes?.[size] : undefined,
        state ? c.button?.states?.[state] : undefined,
      ].filter(Boolean).join(' ') || '';
    case 'input':
      return [
        c.input?.base,
        variant && c.input?.variants?.[variant],
        size && c.input?.sizes?.[size],
        state && c.input?.states?.[state],
      ].filter(Boolean).join(' ');
    case 'textarea':
      return [
        c.input?.base,
        variant && c.input?.variants?.[variant],
        size && c.input?.sizes?.[size],
        state && c.input?.states?.[state],
      ].filter(Boolean).join(' ');
    case 'select':
      return [
        c.input?.base,
        variant && c.input?.variants?.[variant],
        size && c.input?.sizes?.[size],
        state && c.input?.states?.[state],
      ].filter(Boolean).join(' ');
    case 'checkbox':
      return [
        c.checkbox?.base,
        state ? c.checkbox?.[state] : undefined,
      ].filter(Boolean).join(' ') || '';
    case 'checkbox-label':
      return c.checkbox?.label || '';
    case 'form-group':
      return c.formGroup || '';
    case 'form-label':
      return c.formLabel || '';
    case 'form-error':
      return c.formError || '';
    case 'badge':
      return c.badge?.base || '';
    case 'badge-variant':
      return variant ? c.badge?.variants?.[variant] || '' : '';
    case 'alert':
      return c.alert?.base || '';
    case 'alert-variant':
      return variant ? c.alert?.variants?.[variant] || '' : '';
    case 'loader-container':
      return c.loader?.container || '';
    case 'loader-svg':
      return c.loader?.svg || '';
    case 'loader-circle':
      return c.loader?.circle || '';
    case 'loader-path':
      return c.loader?.path || '';
    case 'loader-text':
      return c.loader?.text || '';
    default:
      return '';
  }
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

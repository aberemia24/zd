/**
 * Integrare componentMap cu sistemul de stiluri existent
 * Acest fișier face legătura între noile stiluri rafinate și getComponentClasses
 */
import { componentMap, ComponentStyleConfig, ComponentMap } from './componentMap';
import type { ComponentVariant, ComponentSize, ComponentState, ComponentType } from './themeTypes';
import classNames from 'classnames';

/**
 * Versiune îmbunătățită a funcției getComponentClasses care folosește stilurile rafinate
 * @param componentType - Tipul componentei (button, input, select, etc.)
 * @param variant - Varianta de stilizare (primary, secondary, success, etc.)
 * @param size - Dimensiunea (xs, sm, md, lg, xl)
 * @param state - Starea (default, hover, active, focus, disabled, loading, error, success)
 * @param effects - Efecte vizuale opționale (shadow, gradient, translate)
 * @returns String cu clasele CSS concatenate
 */
export function getEnhancedComponentClasses(
  componentType: ComponentType,
  variant?: ComponentVariant,
  size?: ComponentSize,
  state?: ComponentState,
  effects?: string[]
): string {
  const config = componentMap[componentType as string];
  if (!config) {
    console.warn(`Nu există configurație pentru tipul de componentă: ${componentType}`);
    return '';
  }

  // Adună toate clasele aplicabile
  const classes: string[] = [];
  
  // Clasele de bază pentru componenta respectivă
  if (config.base) {
    classes.push(config.base);
  }
  
  // Clasele pentru varianta specificată
  if (variant && config.variants && config.variants[variant as string]) {
    classes.push(config.variants[variant as string]);
  }
  
  // Clasele pentru dimensiunea specificată
  if (size && config.sizes && config.sizes[size as string]) {
    classes.push(config.sizes[size as string]);
  }
  
  // Clasele pentru starea specificată
  if (state && config.states && config.states[state as string]) {
    const stateValue = config.states[state as string];
    if (typeof stateValue === 'string') {
      classes.push(stateValue);
    } else if (typeof stateValue === 'object' && variant) {
      // Pentru state care sunt obiecte cu variante specifice
      const variantClass = stateValue[variant as string];
      if (variantClass) {
        classes.push(variantClass);
      }
    }
  }

  // Efectele vizuale
  if (effects && effects.length > 0) {
    effects.forEach(effect => {
      const effectType = `fx-${effect}`;
      if (componentMap[effectType] && componentMap[effectType].base) {
        classes.push(componentMap[effectType].base);
        
        // Aplicăm și varianta de efect dacă există
        if (variant && componentMap[effectType].variants && componentMap[effectType].variants[variant as string]) {
          classes.push(componentMap[effectType].variants[variant as string]);
        }
      }
    });
  }

  // Filtrăm valorile undefined sau goale și le unim cu spații
  return classes.filter(Boolean).join(' ');
}

/**
 * Funcție de compatibilitate care înlocuiește vechea funcție getComponentClasses
 * Folosește configurațiile din componentMap nou cu stiluri rafinate
 */
export function getCompatComponentClasses(
  componentType: ComponentType | string,
  variant?: ComponentVariant | string,
  size?: ComponentSize | string,
  state?: ComponentState | string
): string {
  return getEnhancedComponentClasses(
    componentType as ComponentType,
    variant as ComponentVariant,
    size as ComponentSize,
    state as ComponentState
  );
}

/**
 * Aplicare efecte vizuale la o clasă existentă
 * @param baseClasses - Clasele de bază
 * @param effects - Lista de efecte de aplicat
 * @param variant - Varianta de stilizare pentru efecte
 */
export function applyVisualEffects(
  baseClasses: string,
  effects: string[],
  variant?: ComponentVariant
): string {
  if (!effects || effects.length === 0) {
    return baseClasses;
  }

  const effectClasses = effects.map(effect => {
    const effectType = `fx-${effect}`;
    const classes = [];
    
    if (componentMap[effectType] && componentMap[effectType].base) {
      classes.push(componentMap[effectType].base);
      
      if (variant && componentMap[effectType].variants && componentMap[effectType].variants[variant as string]) {
        classes.push(componentMap[effectType].variants[variant as string]);
      }
    }
    
    return classes.join(' ');
  });

  return classNames(baseClasses, ...effectClasses);
}

// Export aceste funcții ca helper-e pentru toate componentele primitive
export default {
  getEnhancedComponentClasses,
  getCompatComponentClasses,
  applyVisualEffects
};

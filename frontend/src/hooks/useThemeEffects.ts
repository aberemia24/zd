import { useMemo } from 'react';
import { getEnhancedComponentClasses } from '../styles/themeUtils';
import type { ComponentSize, ComponentState, ComponentType, ComponentVariant } from '../styles/themeTypes';

/**
 * Interfață pentru efectele vizuale disponibile în sistemul de design
 */
export interface ThemeEffects {
  withShadow?: boolean;
  withGradient?: boolean;
  withTranslate?: boolean;
  withGlowFocus?: boolean;
  withFloatingLabel?: boolean;
  withHoverEffect?: boolean;
  withSmoothTransition?: boolean;
  withMinimalistStyle?: boolean;
  withRound?: boolean;
  withFadeIn?: boolean;
  withSlideIn?: boolean;
  withTransition?: boolean;
  withBorderAnimation?: boolean;
  withScaleEffect?: boolean;
  withPulse?: boolean;
  withGlow?: boolean;
  withTextHighlight?: boolean;
  withAccentBorder?: boolean;
}

/**
 * Interfață pentru rezultatele hook-ului
 */
export interface UseThemeEffectsResult {
  /**
   * Obține clasele CSS pentru componenta specificată
   * @param componentType Tipul componentei (button, input, etc.)
   * @param variant Varianta componentei (primary, secondary, etc.)
   * @param size Dimensiunea componentei (sm, md, lg)
   * @param state Starea componentei (disabled, loading, etc.)
   * @returns String cu clasele CSS optimizate
   */
  getClasses: (
    componentType: string | ComponentType,
    variant?: ComponentVariant,
    size?: ComponentSize,
    state?: ComponentState
  ) => string;
  
  /**
   * Verifică dacă un efect este activ
   * @param effectName Numele efectului de verificat
   * @returns Boolean care indică dacă efectul este activ
   */
  hasEffect: (effectName: keyof ThemeEffects) => boolean;
  
  /**
   * Lista de efecte active transformate în array de string-uri
   * pentru utilizare directă cu getEnhancedComponentClasses
   */
  effectsList: string[];

  /**
   * Aplică o variantă specifică unei clase de bază
   * @param baseClass Clasa de bază
   * @param variant Varianta de aplicat
   * @returns String cu clasa combinată cu varianta
   */
  applyVariant: (baseClass: string, variant?: string) => string;

  /**
   * Aplică efecte vizuale unei clase
   * @param baseClass Clasa de bază
   * @param effects Lista de efecte de aplicat
   * @returns String cu clasa combinată cu efectele
   */
  applyEffect: (baseClass: string, ...effects: string[]) => string;
}

/**
 * Hook pentru gestionarea uniformă a efectelor vizuale în componente
 * Oferă un mod optimizat de a aplica și verifica efectele vizuale
 * 
 * @param effects Obiect cu efectele vizuale dorite
 * @returns Utilitare pentru aplicarea efectelor în componente
 * 
 * @example
 * const { getClasses, hasEffect } = useThemeEffects({
 *   withShadow: true,
 *   withGradient: true
 * });
 * 
 * // În JSX:
 * <button className={getClasses('button', 'primary', 'md')}>
 *   {hasEffect('withGradient') && <GradientOverlay />}
 *   Buton cu efecte
 * </button>
 */
export function useThemeEffects(effects: ThemeEffects = {}): UseThemeEffectsResult {
  // Mapare între proprietățile din ThemeEffects și clasele CSS efective
  const effectsMap: Record<keyof ThemeEffects, string> = {
    withShadow: 'shadow-glow',
    withGradient: 'gradient-text',
    withTranslate: 'sliding-gradient',
    withGlowFocus: 'focus-glow',
    withFloatingLabel: 'floating-label',
    withHoverEffect: 'hover-scale',
    withSmoothTransition: 'smooth-transition',
    withMinimalistStyle: 'minimalist',
    withRound: 'rounded-full',
    withFadeIn: 'fadeIn',
    withSlideIn: 'slideIn',
    withTransition: 'smooth-transition',
    withBorderAnimation: 'border-animation',
    withScaleEffect: 'scale-effect',
    withPulse: 'pulse-animation',
    withGlow: 'badge-glow',
    withTextHighlight: 'text-highlight',
    withAccentBorder: 'accent-border'
  };

  // Calculăm lista de efecte active o singură dată
  const effectsList = useMemo(() => {
    return Object.entries(effects)
      .filter(([_, value]) => Boolean(value))
      .map(([key]) => effectsMap[key as keyof ThemeEffects])
      .filter(Boolean);
  }, [effects]);

  // Verifică dacă un efect specific este activ
  const hasEffect = (effectName: keyof ThemeEffects): boolean => {
    return Boolean(effects[effectName]);
  };

  // Obține clasele CSS pentru componenta specificată
  const getClasses = (
    componentType: string | ComponentType,
    variant?: ComponentVariant,
    size?: ComponentSize,
    state?: ComponentState
  ): string => {
    return getEnhancedComponentClasses(
      componentType as ComponentType,
      variant,
      size,
      state,
      effectsList
    );
  };

  // Aplică o variantă specifică unei clase de bază
  const applyVariant = (baseClass: string, variant?: string): string => {
    if (!variant) return baseClass;
    return `${baseClass} ${baseClass}-${variant}`;
  };

  // Aplică efecte vizuale unei clase
  const applyEffect = (baseClass: string, ...effectNames: string[]): string => {
    if (!effectNames.length) return baseClass;
    
    const effectClasses = effectNames
      .filter(effect => hasEffect(effect as keyof ThemeEffects))
      .map(effect => effectsMap[effect as keyof ThemeEffects])
      .filter(Boolean)
      .join(' ');
    
    return effectClasses ? `${baseClass} ${effectClasses}` : baseClass;
  };

  return {
    getClasses,
    hasEffect,
    effectsList,
    applyVariant,
    applyEffect
  };
}

export default useThemeEffects; 
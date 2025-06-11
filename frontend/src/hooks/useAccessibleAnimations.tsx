import { useState, useEffect, useCallback } from 'react';

/**
 * 🎭 useAccessibleAnimations Hook
 * Gestionează animațiile cu respect pentru preferințele de accessibility
 */

interface AnimationPreferences {
  prefersReducedMotion: boolean;
  prefersHighContrast: boolean;
  prefersColorScheme: 'light' | 'dark' | 'no-preference';
}

interface UseAccessibleAnimationsOptions {
  defaultDuration?: number;
  reducedMotionDuration?: number;
  enableAutoDetection?: boolean;
}

interface AnimationConfig {
  duration: number;
  shouldAnimate: boolean;
  variant: 'default' | 'reduced-motion' | 'high-contrast';
  classes: string[];
}

export const useAccessibleAnimations = (
  options: UseAccessibleAnimationsOptions = {}
) => {
  const {
    defaultDuration = 300,
    reducedMotionDuration = 0,
    enableAutoDetection = true
  } = options;

  const [preferences, setPreferences] = useState<AnimationPreferences>({
    prefersReducedMotion: false,
    prefersHighContrast: false,
    prefersColorScheme: 'no-preference'
  });

  // Detectează preferințele utilizatorului
  useEffect(() => {
    if (!enableAutoDetection || typeof window === 'undefined') return;

    const detectPreferences = () => {
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const prefersHighContrast = window.matchMedia('(prefers-contrast: high)').matches;
      const prefersColorScheme = window.matchMedia('(prefers-color-scheme: dark)').matches 
        ? 'dark' 
        : window.matchMedia('(prefers-color-scheme: light)').matches 
          ? 'light' 
          : 'no-preference';

      setPreferences({
        prefersReducedMotion,
        prefersHighContrast,
        prefersColorScheme
      });
    };

    // Detectare inițială
    detectPreferences();

    // Listeners pentru schimbări
    const mediaQueries = [
      window.matchMedia('(prefers-reduced-motion: reduce)'),
      window.matchMedia('(prefers-contrast: high)'),
      window.matchMedia('(prefers-color-scheme: dark)'),
      window.matchMedia('(prefers-color-scheme: light)')
    ];

    const handleChange = () => detectPreferences();
    
    mediaQueries.forEach(mq => {
      if (mq.addEventListener) {
        mq.addEventListener('change', handleChange);
      } else {
        // Fallback pentru browsere mai vechi
        mq.addListener(handleChange);
      }
    });

    return () => {
      mediaQueries.forEach(mq => {
        if (mq.removeEventListener) {
          mq.removeEventListener('change', handleChange);
        } else {
          mq.removeListener(handleChange);
        }
      });
    };
  }, [enableAutoDetection]);

  // Generează configurația pentru animații
  const getAnimationConfig = useCallback((
    animationType: 'fade' | 'scale' | 'slide' | 'spin' | 'bounce' = 'fade'
  ): AnimationConfig => {
    const shouldAnimate = !preferences.prefersReducedMotion;
    const duration = shouldAnimate ? defaultDuration : reducedMotionDuration;
    
    let variant: AnimationConfig['variant'] = 'default';
    if (preferences.prefersReducedMotion) {
      variant = 'reduced-motion';
    } else if (preferences.prefersHighContrast) {
      variant = 'high-contrast';
    }

    const baseClasses = [
      'transition-all',
      shouldAnimate ? `duration-${duration}` : 'duration-0',
      'ease-in-out'
    ];

    const motionClasses = shouldAnimate ? [
      'motion-safe:transition-all',
      `motion-safe:duration-${duration}`,
      'motion-safe:ease-in-out'
    ] : [
      'motion-reduce:transition-none',
      'motion-reduce:duration-0'
    ];

    const animationClasses = shouldAnimate ? (() => {
      switch (animationType) {
        case 'fade':
          return [
            'data-[state=open]:animate-in',
            'data-[state=open]:fade-in-0',
            'data-[state=closed]:animate-out',
            'data-[state=closed]:fade-out-0'
          ];
        case 'scale':
          return [
            'data-[state=open]:animate-in',
            'data-[state=open]:zoom-in-95',
            'data-[state=open]:fade-in-0',
            'data-[state=closed]:animate-out',
            'data-[state=closed]:zoom-out-95',
            'data-[state=closed]:fade-out-0'
          ];
        case 'slide':
          return [
            'data-[state=open]:animate-in',
            'data-[state=open]:slide-in-from-bottom-4',
            'data-[state=closed]:animate-out',
            'data-[state=closed]:slide-out-to-bottom-4'
          ];
        case 'spin':
          return ['animate-spin'];
        case 'bounce':
          return ['animate-bounce'];
        default:
          return [];
      }
    })() : [];

    return {
      duration,
      shouldAnimate,
      variant,
      classes: [...baseClasses, ...motionClasses, ...animationClasses]
    };
  }, [preferences, defaultDuration, reducedMotionDuration]);

  // Generează clase pentru focus ring cu accessibility
  const getFocusClasses = useCallback((
    variant: 'default' | 'subtle' | 'strong' | 'high-contrast' = 'default'
  ): string[] => {
    const baseClasses = [
      'focus-visible:outline-none',
      'transition-all',
      'duration-200',
      'ease-in-out'
    ];

    if (preferences.prefersHighContrast || variant === 'high-contrast') {
      return [
        ...baseClasses,
        'focus-visible:ring-2',
        'focus-visible:ring-black',
        'focus-visible:ring-offset-2',
        'dark:focus-visible:ring-white',
        'focus-visible:bg-yellow-200',
        'dark:focus-visible:bg-yellow-800'
      ];
    }

    switch (variant) {
      case 'subtle':
        return [
          ...baseClasses,
          'focus-visible:ring-1',
          'focus-visible:ring-copper-500/30',
          'focus-visible:ring-offset-1',
          'dark:focus-visible:ring-copper-400/30'
        ];
      case 'strong':
        return [
          ...baseClasses,
          'focus-visible:ring-4',
          'focus-visible:ring-copper-500',
          'focus-visible:ring-offset-4',
          'dark:focus-visible:ring-copper-400',
          ...(preferences.prefersReducedMotion ? [] : ['motion-safe:focus-visible:scale-110'])
        ];
      default:
        return [
          ...baseClasses,
          'focus-visible:ring-2',
          'focus-visible:ring-copper-500/50',
          'focus-visible:ring-offset-2',
          'dark:focus-visible:ring-copper-400/50',
          ...(preferences.prefersReducedMotion ? [] : ['motion-safe:focus-visible:scale-105'])
        ];
    }
  }, [preferences]);

  // Utility pentru delay-uri adaptive
  const getAdaptiveDelay = useCallback((baseDelay: number): number => {
    return preferences.prefersReducedMotion ? 0 : baseDelay;
  }, [preferences]);

  // Utility pentru verificarea suportului animațiilor
  const supportsAnimations = useCallback((): boolean => {
    if (typeof window === 'undefined') return false;
    return !preferences.prefersReducedMotion && 
           'animate' in document.documentElement.style;
  }, [preferences]);

  return {
    preferences,
    getAnimationConfig,
    getFocusClasses,
    getAdaptiveDelay,
    supportsAnimations,
    // Shortcuts pentru configurații comune
    fadeConfig: getAnimationConfig('fade'),
    scaleConfig: getAnimationConfig('scale'),
    slideConfig: getAnimationConfig('slide'),
    spinConfig: getAnimationConfig('spin'),
    bounceConfig: getAnimationConfig('bounce'),
    // Focus variants
    defaultFocus: getFocusClasses('default'),
    subtleFocus: getFocusClasses('subtle'),
    strongFocus: getFocusClasses('strong'),
    highContrastFocus: getFocusClasses('high-contrast')
  };
};

export default useAccessibleAnimations; 

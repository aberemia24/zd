import { renderHook, act } from '@testing-library/react';
import useAccessibleAnimations from './useAccessibleAnimations';

// Mock pentru window.matchMedia
const mockMatchMedia = (matches: boolean) => ({
  matches,
  media: '',
  onchange: null,
  addListener: jest.fn(),
  removeListener: jest.fn(),
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
  dispatchEvent: jest.fn(),
});

describe('useAccessibleAnimations Hook', () => {
  beforeEach(() => {
    // Reset window.matchMedia mock
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: jest.fn().mockImplementation(() => mockMatchMedia(false)),
    });
  });

  describe('Basic Functionality', () => {
    it('should return default configuration', () => {
      const { result } = renderHook(() => useAccessibleAnimations());

      expect(result.current.preferences).toEqual({
        prefersReducedMotion: false,
        prefersHighContrast: false,
        prefersColorScheme: 'no-preference'
      });
      expect(result.current.supportsAnimations()).toBe(true);
    });

    it('should provide animation configs', () => {
      const { result } = renderHook(() => useAccessibleAnimations());

      expect(result.current.fadeConfig).toHaveProperty('duration', 300);
      expect(result.current.fadeConfig).toHaveProperty('shouldAnimate', true);
      expect(result.current.fadeConfig).toHaveProperty('variant', 'default');
      expect(result.current.fadeConfig.classes).toContain('transition-all');
    });

    it('should provide focus classes', () => {
      const { result } = renderHook(() => useAccessibleAnimations());

      expect(result.current.defaultFocus).toContain('focus-visible:outline-none');
      expect(result.current.defaultFocus).toContain('focus-visible:ring-2');
      expect(result.current.subtleFocus).toContain('focus-visible:ring-1');
      expect(result.current.strongFocus).toContain('focus-visible:ring-4');
    });
  });

  describe('Reduced Motion Detection', () => {
    it('should detect prefers-reduced-motion', () => {
      window.matchMedia = jest.fn().mockImplementation((query) => {
        if (query === '(prefers-reduced-motion: reduce)') {
          return mockMatchMedia(true);
        }
        return mockMatchMedia(false);
      });

      const { result } = renderHook(() => useAccessibleAnimations());

      expect(result.current.preferences.prefersReducedMotion).toBe(true);
      expect(result.current.supportsAnimations()).toBe(false);
    });

    it('should adapt animation config for reduced motion', () => {
      window.matchMedia = jest.fn().mockImplementation((query) => {
        if (query === '(prefers-reduced-motion: reduce)') {
          return mockMatchMedia(true);
        }
        return mockMatchMedia(false);
      });

      const { result } = renderHook(() => useAccessibleAnimations());

      expect(result.current.fadeConfig.duration).toBe(0);
      expect(result.current.fadeConfig.shouldAnimate).toBe(false);
      expect(result.current.fadeConfig.variant).toBe('reduced-motion');
      expect(result.current.fadeConfig.classes).toContain('duration-0');
    });

    it('should return zero delay for reduced motion', () => {
      window.matchMedia = jest.fn().mockImplementation((query) => {
        if (query === '(prefers-reduced-motion: reduce)') {
          return mockMatchMedia(true);
        }
        return mockMatchMedia(false);
      });

      const { result } = renderHook(() => useAccessibleAnimations());

      expect(result.current.getAdaptiveDelay(500)).toBe(0);
    });
  });

  describe('High Contrast Detection', () => {
    it('should detect prefers-high-contrast', () => {
      window.matchMedia = jest.fn().mockImplementation((query) => {
        if (query === '(prefers-contrast: high)') {
          return mockMatchMedia(true);
        }
        return mockMatchMedia(false);
      });

      const { result } = renderHook(() => useAccessibleAnimations());

      expect(result.current.preferences.prefersHighContrast).toBe(true);
    });

    it('should provide high contrast focus classes', () => {
      window.matchMedia = jest.fn().mockImplementation((query) => {
        if (query === '(prefers-contrast: high)') {
          return mockMatchMedia(true);
        }
        return mockMatchMedia(false);
      });

      const { result } = renderHook(() => useAccessibleAnimations());

      expect(result.current.highContrastFocus).toContain('focus-visible:ring-black');
      expect(result.current.highContrastFocus).toContain('dark:focus-visible:ring-white');
      expect(result.current.highContrastFocus).toContain('focus-visible:bg-yellow-200');
    });
  });

  describe('Color Scheme Detection', () => {
    it('should detect dark color scheme', () => {
      window.matchMedia = jest.fn().mockImplementation((query) => {
        if (query === '(prefers-color-scheme: dark)') {
          return mockMatchMedia(true);
        }
        return mockMatchMedia(false);
      });

      const { result } = renderHook(() => useAccessibleAnimations());

      expect(result.current.preferences.prefersColorScheme).toBe('dark');
    });

    it('should detect light color scheme', () => {
      window.matchMedia = jest.fn().mockImplementation((query) => {
        if (query === '(prefers-color-scheme: light)') {
          return mockMatchMedia(true);
        }
        if (query === '(prefers-color-scheme: dark)') {
          return mockMatchMedia(false);
        }
        return mockMatchMedia(false);
      });

      const { result } = renderHook(() => useAccessibleAnimations());

      expect(result.current.preferences.prefersColorScheme).toBe('light');
    });
  });

  describe('Animation Types', () => {
    it('should generate fade animation config', () => {
      const { result } = renderHook(() => useAccessibleAnimations());

      const config = result.current.getAnimationConfig('fade');
      expect(config.classes).toContain('data-[state=open]:fade-in-0');
      expect(config.classes).toContain('data-[state=closed]:fade-out-0');
    });

    it('should generate scale animation config', () => {
      const { result } = renderHook(() => useAccessibleAnimations());

      const config = result.current.getAnimationConfig('scale');
      expect(config.classes).toContain('data-[state=open]:zoom-in-95');
      expect(config.classes).toContain('data-[state=closed]:zoom-out-95');
    });

    it('should generate slide animation config', () => {
      const { result } = renderHook(() => useAccessibleAnimations());

      const config = result.current.getAnimationConfig('slide');
      expect(config.classes).toContain('data-[state=open]:slide-in-from-bottom-4');
      expect(config.classes).toContain('data-[state=closed]:slide-out-to-bottom-4');
    });

    it('should generate spin animation config', () => {
      const { result } = renderHook(() => useAccessibleAnimations());

      const config = result.current.getAnimationConfig('spin');
      expect(config.classes).toContain('animate-spin');
    });

    it('should generate bounce animation config', () => {
      const { result } = renderHook(() => useAccessibleAnimations());

      const config = result.current.getAnimationConfig('bounce');
      expect(config.classes).toContain('animate-bounce');
    });
  });

  describe('Focus Variants', () => {
    it('should generate subtle focus classes', () => {
      const { result } = renderHook(() => useAccessibleAnimations());

      const classes = result.current.getFocusClasses('subtle');
      expect(classes).toContain('focus-visible:ring-1');
      expect(classes).toContain('focus-visible:ring-copper-500/30');
    });

    it('should generate strong focus classes', () => {
      const { result } = renderHook(() => useAccessibleAnimations());

      const classes = result.current.getFocusClasses('strong');
      expect(classes).toContain('focus-visible:ring-4');
      expect(classes).toContain('focus-visible:ring-copper-500');
      expect(classes).toContain('motion-safe:focus-visible:scale-110');
    });

    it('should generate high contrast focus classes', () => {
      const { result } = renderHook(() => useAccessibleAnimations());

      const classes = result.current.getFocusClasses('high-contrast');
      expect(classes).toContain('focus-visible:ring-black');
      expect(classes).toContain('dark:focus-visible:ring-white');
      expect(classes).toContain('focus-visible:bg-yellow-200');
    });
  });

  describe('Custom Options', () => {
    it('should use custom duration', () => {
      const { result } = renderHook(() => 
        useAccessibleAnimations({ defaultDuration: 500 })
      );

      expect(result.current.fadeConfig.duration).toBe(500);
    });

    it('should use custom reduced motion duration', () => {
      window.matchMedia = jest.fn().mockImplementation((query) => {
        if (query === '(prefers-reduced-motion: reduce)') {
          return mockMatchMedia(true);
        }
        return mockMatchMedia(false);
      });

      const { result } = renderHook(() => 
        useAccessibleAnimations({ reducedMotionDuration: 100 })
      );

      expect(result.current.fadeConfig.duration).toBe(100);
    });

    it('should disable auto detection', () => {
      const { result } = renderHook(() => 
        useAccessibleAnimations({ enableAutoDetection: false })
      );

      // Should use default values when auto detection is disabled
      expect(result.current.preferences.prefersReducedMotion).toBe(false);
      expect(result.current.preferences.prefersHighContrast).toBe(false);
    });
  });

  describe('Utility Functions', () => {
    it('should return adaptive delay', () => {
      const { result } = renderHook(() => useAccessibleAnimations());

      expect(result.current.getAdaptiveDelay(300)).toBe(300);
    });

    it('should check animation support', () => {
      const { result } = renderHook(() => useAccessibleAnimations());

      expect(typeof result.current.supportsAnimations()).toBe('boolean');
    });
  });

  describe('SSR Compatibility', () => {
    it('should handle undefined window', () => {
      const originalWindow = global.window;
      // @ts-ignore
      delete global.window;

      const { result } = renderHook(() => 
        useAccessibleAnimations({ enableAutoDetection: true })
      );

      expect(result.current.preferences).toEqual({
        prefersReducedMotion: false,
        prefersHighContrast: false,
        prefersColorScheme: 'no-preference'
      });

      global.window = originalWindow;
    });
  });
}); 

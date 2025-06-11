import { useEffect, useCallback } from 'react';
import { useSettingsStore } from '../stores/settingsStore';
import { darkModeUtils } from '../styles/cva-v2/core/utils';

/**
 * Hook pentru gestionarea Dark Mode în Budget App
 * 🌙 Integrat cu Carbon Copper Design System
 * 
 * Features:
 * - Sincronizare cu settingsStore (Zustand)
 * - Persistență în localStorage
 * - Detectare preferință sistem
 * - Smooth transitions cu TailwindCSS
 * - Suport pentru darkModeUtils din CVA v2
 */
export const useDarkMode = () => {
  const { appSettings, updateAppSettings } = useSettingsStore();
  const isDark = appSettings.darkMode;

  /**
   * Inițializare dark mode la primul mount
   * Prioritate: localStorage > settings store > system preference
   */
  useEffect(() => {
    const initializeDarkMode = () => {
      try {
        // 1. Verifică localStorage pentru preferința salvată
        const storedDarkMode = localStorage.getItem('darkMode');
        let shouldBeDark = isDark;

        if (storedDarkMode !== null) {
          // Folosește valoarea din localStorage
          shouldBeDark = storedDarkMode === 'true';
        } else {
          // Fallback la system preference
          const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
          shouldBeDark = systemPrefersDark;
        }

        // Sincronizează toate sursele de adevăr
        if (shouldBeDark !== isDark) {
          updateAppSettings({ darkMode: shouldBeDark });
        }

        // Aplică tema în DOM
        if (shouldBeDark) {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }

        // Salvează în localStorage pentru consistență
        localStorage.setItem('darkMode', shouldBeDark.toString());

        console.log('🌙 Dark Mode initialized:', shouldBeDark);
      } catch (error) {
        console.warn('Failed to initialize dark mode:', error);
      }
    };

    initializeDarkMode();
  }, []); // Run only once on mount

  /**
   * Sincronizează schimbările din store cu DOM și localStorage
   */
  useEffect(() => {
    try {
      if (isDark) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      
      localStorage.setItem('darkMode', isDark.toString());
    } catch (error) {
      console.warn('Failed to sync dark mode:', error);
    }
  }, [isDark]);

  /**
   * Toggle dark mode cu smooth transition
   */
  const toggleDarkMode = useCallback(() => {
    try {
      const newDarkMode = !isDark;
      
      // Update store (aceasta va trigga useEffect-ul de mai sus)
      updateAppSettings({ darkMode: newDarkMode });
      
      console.log('🌙 Dark Mode toggled to:', newDarkMode);
      
      return newDarkMode;
    } catch (error) {
      console.error('Failed to toggle dark mode:', error);
      return isDark;
    }
  }, [isDark, updateAppSettings]);

  /**
   * Set dark mode explicit (pentru componente care au toggle switches)
   */
  const setDarkMode = useCallback((value: boolean) => {
    try {
      if (value !== isDark) {
        updateAppSettings({ darkMode: value });
        console.log('🌙 Dark Mode set to:', value);
      }
    } catch (error) {
      console.error('Failed to set dark mode:', error);
    }
  }, [isDark, updateAppSettings]);

  /**
   * Listener pentru schimbări de system preference
   */
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleSystemThemeChange = (e: MediaQueryListEvent) => {
      // Aplică doar dacă utilizatorul nu și-a setat o preferință explicită
      const hasExplicitPreference = localStorage.getItem('darkMode') !== null;
      
      if (!hasExplicitPreference) {
        const systemPrefersDark = e.matches;
        setDarkMode(systemPrefersDark);
        console.log('🌙 System preference changed to:', systemPrefersDark);
      }
    };

    // Adaugă listener pentru schimbări de sistem
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleSystemThemeChange);
    } else {
      // Fallback pentru browsere mai vechi
      mediaQuery.addListener(handleSystemThemeChange);
    }

    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener('change', handleSystemThemeChange);
      } else {
        mediaQuery.removeListener(handleSystemThemeChange);
      }
    };
  }, [setDarkMode]);

  /**
   * Utility functions expuse pentru componente
   */
  const utils = {
    /**
     * Verifică dacă dark mode este activ
     */
    isDarkMode: useCallback(() => isDark, [isDark]),
    
    /**
     * Obține clasa CSS pentru tema curentă
     */
    getThemeClass: useCallback(() => isDark ? 'dark' : 'light', [isDark]),
    
    /**
     * Obține culorile pentru tema curentă din Carbon Copper palette
     */
    getThemeColors: useCallback(() => {
      return isDark ? {
        primary: '#F97316',        // Copper 400 - lighter pentru dark backgrounds
        secondary: '#78716C',      // Carbon 400 - lighter pentru contrast
        accent: '#FB923C',         // Copper 300 - accent pentru dark mode
        success: '#10B981',        // Emerald 500 - visibility optimizată
        warning: '#F59E0B',        // Amber 500 - contrast pentru dark
        error: '#EF4444',          // Ruby 500 pentru dark readability
        neutral: '#D6D3D1',        // Carbon 300 pentru dark text
        background: '#0A0908',     // Carbon 950 - sophisticated dark background
        surface: '#1C1917',        // Carbon 800 - card/surface background
        border: '#292524',         // Carbon 700 - border pentru dark mode
      } : {
        primary: '#EA580C',        // Copper 500 - main copper
        secondary: '#57534E',      // Carbon 500 - medium carbon
        accent: '#EA580C',         // Copper accent
        success: '#059669',        // Emerald 600 - main success
        warning: '#D97706',        // Amber 600 - main warning
        error: '#DC2626',          // Ruby 600 - main error
        neutral: '#78716C',        // Carbon 400 - neutral text
        background: '#FAFAF9',     // Carbon 50 - warm white background
        surface: '#FFFFFF',        // Pure white pentru cards
        border: '#E7E5E4',         // Carbon 200 - light borders
      };
    }, [isDark]),

    /**
     * Reset la system preference (șterge localStorage)
     */
    resetToSystemPreference: useCallback(() => {
      try {
        localStorage.removeItem('darkMode');
        const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        setDarkMode(systemPrefersDark);
        console.log('🌙 Reset to system preference:', systemPrefersDark);
      } catch (error) {
        console.error('Failed to reset to system preference:', error);
      }
    }, [setDarkMode]),
  };

  return {
    isDark,
    toggleDarkMode,
    setDarkMode,
    ...utils,
  };
};

export default useDarkMode; 

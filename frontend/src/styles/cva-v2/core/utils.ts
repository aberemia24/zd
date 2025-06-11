import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * 🎨 CORE UTILITIES - Carbon Copper Design System
 * Utilities fundamentale pentru CVA și class management
 */

/**
 * Combină clasele CSS în mod sigur folosind clsx și tailwind-merge
 * Soluționează conflictele dintre clasele TailwindCSS
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Utilities pentru culorile din Carbon Copper palette
 */
export const colorUtils = {
  getBgColor: (type: 'primary' | 'secondary' | 'accent' | 'success' | 'warning' | 'neutral' = 'neutral') => {
    const colors = {
      primary: 'bg-copper-500 dark:bg-copper-400',
      secondary: 'bg-carbon-500 dark:bg-carbon-400', 
      accent: 'bg-copper-100 dark:bg-copper-200',
      success: 'bg-emerald-600 dark:bg-emerald-400',
      warning: 'bg-amber-500 dark:bg-amber-400',
      neutral: 'bg-carbon-200 dark:bg-carbon-700'
    };
    return colors[type];
  },
  
  getTextColor: (type: 'primary' | 'secondary' | 'accent' | 'success' | 'warning' | 'neutral' = 'neutral') => {
    const colors = {
      primary: 'text-copper-600 dark:text-copper-300',
      secondary: 'text-carbon-900 dark:text-carbon-100',
      accent: 'text-copper-800 dark:text-copper-200', 
      success: 'text-emerald-600 dark:text-emerald-300',
      warning: 'text-amber-600 dark:text-amber-300',
      neutral: 'text-carbon-700 dark:text-carbon-300'
    };
    return colors[type];
  }
};

/**
 * Utilities pentru dark mode - Carbon Copper theme
 */
export const darkModeUtils = {
  getThemeClasses: (isDark: boolean) => ({
    background: isDark ? 'bg-carbon-950' : 'bg-carbon-50',
    surface: isDark ? 'bg-carbon-900' : 'bg-white', 
    text: isDark ? 'text-carbon-100' : 'text-carbon-900',
    border: isDark ? 'border-carbon-700' : 'border-carbon-200'
  }),
  
  applyTheme: (element: HTMLElement, isDark: boolean) => {
    const classes = darkModeUtils.getThemeClasses(isDark);
    element.className = cn(element.className, Object.values(classes).join(' '));
  }
}; 

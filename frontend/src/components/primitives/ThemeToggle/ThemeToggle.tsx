import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { 
  cn,
  themeToggle, 
  type ThemeToggleProps 
} from '../../../styles/cva-v2';
import { useDarkMode } from '../../../hooks/useDarkMode';

interface ThemeToggleComponentProps extends ThemeToggleProps {
  className?: string;
  showLabel?: boolean;
  label?: string;
  displayType?: 'icon' | 'switch'; // Propriul nostru tip de display
}

/**
 * Theme Toggle Component - Sophisticated Dark Mode Switch
 * 🌙 Integrat cu Carbon Copper Design System CVA v2
 * 
 * Features:
 * - Icon si switch display types
 * - Multiple CVA variants (default, outline, minimal)
 * - Smooth animations și transitions
 * - Accessibility support (ARIA labels)
 * - Professional Carbon Copper styling
 * - Integrated cu useDarkMode hook
 */
const ThemeToggle: React.FC<ThemeToggleComponentProps> = ({
  variant = 'default',
  size = 'md',
  state,
  className,
  showLabel = false,
  label,
  displayType = 'icon',
  ...props
}) => {
  const { isDark, toggleDarkMode } = useDarkMode();
  
  // Determine state based on dark mode
  const currentState = state || (isDark ? 'dark' : 'light');

  // Icon display type - buton cu icon
  if (displayType === 'icon') {
    return (
      <button
        onClick={toggleDarkMode}
        className={cn(
          themeToggle({ variant, size, state: currentState }),
          "group relative",
          className
        )}
        aria-label={isDark ? 'Comută la tema deschisă' : 'Comută la tema întunecată'}
        title={isDark ? 'Comută la tema deschisă' : 'Comută la tema întunecată'}
        {...props}
      >
        {/* Sun Icon - afișat în dark mode */}
        <Sun 
          className={cn(
            "absolute inset-0 m-auto transition-all duration-300 ease-in-out",
            isDark 
              ? "opacity-100 rotate-0 scale-100" 
              : "opacity-0 rotate-90 scale-0"
          )}
          size={size === 'sm' ? 16 : size === 'lg' ? 24 : 20}
        />
        
        {/* Moon Icon - afișat în light mode */}
        <Moon 
          className={cn(
            "absolute inset-0 m-auto transition-all duration-300 ease-in-out",
            isDark 
              ? "opacity-0 -rotate-90 scale-0" 
              : "opacity-100 rotate-0 scale-100"
          )}
          size={size === 'sm' ? 16 : size === 'lg' ? 24 : 20}
        />
        
        {/* Label opțional */}
        {showLabel && (
          <span className="sr-only">
            {label || (isDark ? 'Tema întunecată activă' : 'Tema deschisă activă')}
          </span>
        )}
      </button>
    );
  }

  // Switch display type - toggle switch
  if (displayType === 'switch') {
    const switchHeight = size === 'sm' ? 6 : size === 'lg' ? 10 : 8;
    const switchWidth = switchHeight * 2;
    const thumbSize = switchHeight - 2;
    
    return (
      <div className="flex items-center gap-3">
        {showLabel && (
          <label 
            htmlFor="theme-toggle-switch"
            className="text-sm font-medium text-carbon-900 dark:text-carbon-100"
          >
            {label || 'Tema întunecată'}
          </label>
        )}
        
        <button
          id="theme-toggle-switch"
          onClick={toggleDarkMode}
          className={cn(
            "relative rounded-full transition-all duration-300 ease-in-out",
            "focus:outline-none focus:ring-2 focus:ring-offset-2",
            "focus:ring-copper-500 dark:focus:ring-copper-400",
            isDark 
              ? "bg-copper-500 dark:bg-copper-400" 
              : "bg-carbon-300 dark:bg-carbon-600",
            className
          )}
          style={{ width: `${switchWidth * 0.25}rem`, height: `${switchHeight * 0.25}rem` }}
          data-state={isDark ? 'checked' : 'unchecked'}
          aria-label={isDark ? 'Dezactivează tema întunecată' : 'Activează tema întunecată'}
          role="switch"
          aria-checked={isDark}
          {...props}
        >
          {/* Switch thumb */}
          <div 
            className={cn(
              "absolute top-0.5 bg-white dark:bg-carbon-100 rounded-full",
              "transition-all duration-300 ease-in-out shadow-sm",
              "flex items-center justify-center",
              isDark ? `left-[${switchWidth * 0.25 - thumbSize * 0.25 - 0.125}rem]` : "left-0.5"
            )}
            style={{ 
              width: `${thumbSize * 0.25}rem`, 
              height: `${thumbSize * 0.25}rem`,
              left: isDark ? `${switchWidth * 0.25 - thumbSize * 0.25 - 0.125}rem` : '0.125rem'
            }}
          >
            {/* Mini icons în thumb */}
            <Sun 
              className={cn(
                "absolute transition-all duration-200 text-amber-500",
                isDark ? "opacity-0 scale-0" : "opacity-60 scale-75"
              )}
              size={size === 'sm' ? 8 : size === 'lg' ? 12 : 10}
            />
            <Moon 
              className={cn(
                "absolute transition-all duration-200 text-carbon-600",
                isDark ? "opacity-60 scale-75" : "opacity-0 scale-0"
              )}
              size={size === 'sm' ? 8 : size === 'lg' ? 12 : 10}
            />
          </div>
        </button>
      </div>
    );
  }

  return null;
};

export default ThemeToggle; 

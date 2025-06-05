import { useState, useCallback, useEffect } from 'react';

/**
 * Interface pentru state-ul de redimensionare tabel
 */
export interface TableResizeState {
  isFullscreen: boolean;
}

/**
 * Hook pentru gestionarea redimensionării tabelului și modul fullscreen
 * Gestionează: state fullscreen, escape key handling, body overflow management
 */
export const useTableResize = () => {
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  // Toggle fullscreen mode
  const toggleFullscreen = useCallback(() => {
    setIsFullscreen(prev => !prev);
  }, []);

  // Exit fullscreen mode (folosit pentru escape key)
  const exitFullscreen = useCallback(() => {
    setIsFullscreen(false);
  }, []);

  // Handle escape key pentru a ieși din fullscreen
  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isFullscreen) {
        exitFullscreen();
      }
    };

    // Adaugă event listener doar când în fullscreen
    if (isFullscreen) {
      document.addEventListener('keydown', handleEscapeKey);
    }

    // Cleanup
    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [isFullscreen, exitFullscreen]);

  // Gestionează body overflow pentru a preveni scroll-ul în background
  useEffect(() => {
    if (isFullscreen) {
      // Previne scroll-ul în background când în fullscreen
      document.body.style.overflow = 'hidden';
    } else {
      // Restore scroll-ul normal
      document.body.style.overflow = '';
    }

    // Cleanup la unmount
    return () => {
      document.body.style.overflow = '';
    };
  }, [isFullscreen]);

  return {
    isFullscreen,
    toggleFullscreen,
    exitFullscreen,
  };
}; 
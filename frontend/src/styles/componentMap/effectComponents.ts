/**
 * Sistem de efecte vizuale și tranziții
 * Această componentă definește efecte vizuale reutilizabile care pot fi aplicate
 * pe orice component din aplicație prin sistemul de stiluri rafinate.
 * 
 * Responsabil: echipa FE
 * Creat: 2025-05-20
 */

import type { ComponentStyleConfig } from './index';

/**
 * Definirea efectelor vizuale pentru animații modale, fade și tranziții
 */
export const effectComponents: Record<string, ComponentStyleConfig> = {
  // Efecte de tranziție pentru modale
  'fx-modal-transition': {
    base: 'transition-opacity transition-visibility duration-300 ease-in-out',
    variants: {
      visible: 'opacity-100 visible',
      hidden: 'opacity-0 invisible'
    }
  },
  
  // Efecte de fade pentru carduri și alte elemente
  'fx-fade': {
    base: 'transition-opacity transition-transform duration-300 ease-in-out',
    variants: {
      in: 'opacity-100 translate-y-0',
      out: 'opacity-0 -translate-y-5'
    }
  },
  
  // Efecte pentru mobile și tactile
  'fx-mobile-touch': {
    base: 'transition-transform duration-100 ease-in-out',
    variants: {
      active: 'scale-97',
      focus: 'outline-focus outline-offset-2'
    }
  },
  
  // Animații pentru intrare/ieșire
  'fx-slide': {
    base: 'transition-transform duration-300 ease-in-out',
    variants: {
      inRight: 'translate-x-0',
      outRight: 'translate-x-full',
      inLeft: 'translate-x-0',
      outLeft: '-translate-x-full',
      inTop: 'translate-y-0',
      outTop: '-translate-y-full',
      inBottom: 'translate-y-0',
      outBottom: 'translate-y-full'
    }
  },

  // Container cu efect de animate
  'animate-container': {
    base: 'overflow-hidden transition-all duration-300 ease-in-out',
    variants: {
      expanded: 'max-h-screen opacity-100',
      collapsed: 'max-h-0 opacity-0'
    }
  }
};

export default effectComponents;

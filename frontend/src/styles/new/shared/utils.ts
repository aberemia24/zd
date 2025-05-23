import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Utility function pentru combinarea claselor CVA cu Tailwind CSS
 * Combină clsx pentru conditional classes cu twMerge pentru deduplication
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Re-export pentru compatibilitate cu sistemul existent
 */
export { clsx };

/**
 * Helper pentru debug - poate fi eliminat în production
 */
export function debugClasses(classes: string) {
  if (process.env.NODE_ENV === 'development') {
    console.log('Generated classes:', classes);
  }
  return classes;
} 
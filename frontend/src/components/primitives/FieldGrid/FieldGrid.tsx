import React from 'react';
import { cn } from '../../../styles/cva-v2';

export interface FieldGridProps {
  /** Field items to display in grid */
  children: React.ReactNode;
  /** Number of columns on different screen sizes */
  cols?: {
    base?: 1 | 2 | 3 | 4;
    sm?: 1 | 2 | 3 | 4;
    md?: 1 | 2 | 3 | 4;
    lg?: 1 | 2 | 3 | 4;
  };
  /** Gap between fields */
  gap?: 2 | 3 | 4 | 5 | 6 | 8;
  /** Additional CSS classes */
  className?: string;
  /** Data test ID */
  testId?: string;
}

/**
 * 🎨 FIELD GRID COMPONENT - Responsive Form Fields Layout
 * 
 * Component generic pentru organizarea câmpurilor de formular
 * într-un grid responsive. Suportă diverse configurații de coloane
 * pentru diferite screen sizes.
 * 
 * Features:
 * - Responsive grid cu configurare flexibilă
 * - Gap customizabil între fields
 * - Full-width fields cu col-span-full
 * - Mobile-first design
 */
const FieldGrid: React.FC<FieldGridProps> = ({
  children,
  cols = { base: 1, md: 2 },
  gap = 4,
  className,
  testId = 'field-grid'
}) => {
  // Build responsive grid classes
  const gridClasses = [
    'grid',
    `gap-${gap}`,
    cols.base && `grid-cols-${cols.base}`,
    cols.sm && `sm:grid-cols-${cols.sm}`,
    cols.md && `md:grid-cols-${cols.md}`,
    cols.lg && `lg:grid-cols-${cols.lg}`,
  ].filter(Boolean).join(' ');

  return (
    <div
      className={cn(gridClasses, className)}
      data-testid={testId}
    >
      {children}
    </div>
  );
};

/**
 * 🎨 FIELD WRAPPER - Pentru fields care span multiple coloane
 */
export interface FieldWrapperProps {
  /** Content to wrap */
  children: React.ReactNode;
  /** Span toate coloanele disponibile */
  fullWidth?: boolean;
  /** Span specific number of columns */
  span?: 2 | 3 | 4;
  /** Additional CSS classes */
  className?: string;
}

export const FieldWrapper: React.FC<FieldWrapperProps> = ({
  children,
  fullWidth = false,
  span,
  className
}) => {
  const spanClasses = fullWidth 
    ? 'col-span-full' 
    : span 
    ? `col-span-${span}` 
    : '';

  return (
    <div className={cn(spanClasses, className)}>
      {children}
    </div>
  );
};

export default FieldGrid; 
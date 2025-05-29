import React, { memo } from 'react';
import { cn } from '../../../styles/cva/shared/utils';

interface GridCellProps {
  value: string | number;
  onClick?: (e: React.MouseEvent) => void;
  onDoubleClick?: (e: React.MouseEvent) => void;
  colorClass?: string;
  isCategory?: boolean;
  isSubcategory?: boolean;
  title?: string;
  testId?: string;
}

/**
 * Componentă celulă optimizată care afișează o valoare simplă
 * Memoizată pentru a preveni re-renderuri când datele nu se schimbă
 */
const GridCell: React.FC<GridCellProps> = ({ 
  value, 
  onClick, 
  onDoubleClick,
  colorClass = '',
  isCategory = false,
  isSubcategory = false,
  title = '',
  testId = ''
}) => {
  // Determină clasa CSS și cursorul în funcție de tipul celulei
  const cellClasses = cn(
    'p-2 transition-colors duration-150',
    colorClass,
    {
      'cursor-pointer hover:bg-blue-50': !isCategory && (onClick || onDoubleClick),
      'font-medium': isCategory,
      'pl-6': isSubcategory,
    }
  );

  // Valoarea afișată formatată ca string
  const displayValue = value === 0 || value === '' ? '—' : value;

  return (
    <div
      className={cellClasses}
      onClick={onClick}
      onDoubleClick={onDoubleClick}
      title={title}
      data-testid={testId}
    >
      {displayValue}
    </div>
  );
};

// Funcție de comparare personalizată pentru memoizare
const areEqual = (prevProps: GridCellProps, nextProps: GridCellProps) => {
  return (
    prevProps.value === nextProps.value &&
    prevProps.colorClass === nextProps.colorClass &&
    prevProps.isCategory === nextProps.isCategory &&
    prevProps.isSubcategory === nextProps.isSubcategory &&
    // Comparăm referințele pentru handler-urile de evenimente - acestea ar trebui
    // să fie stabile prin useCallback în componenta părinte
    prevProps.onClick === nextProps.onClick &&
    prevProps.onDoubleClick === nextProps.onDoubleClick
  );
};

// Exportăm versiunea memoizată a componentei
export default memo(GridCell, areEqual);

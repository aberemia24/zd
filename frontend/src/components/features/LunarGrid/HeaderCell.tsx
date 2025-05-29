import React, { memo } from 'react';
import { cn } from '../../../styles/cva/shared/utils';
import { tableHeader } from '../../../styles/cva/data';

interface HeaderCellProps {
  content: React.ReactNode;
  isSticky?: boolean;
  align?: 'left' | 'center' | 'right';
  width?: number;
  className?: string;
}

/**
 * Componentă pentru celulele de header din tabel
 * Memoizată pentru a preveni re-render-uri inutile
 */
const HeaderCell: React.FC<HeaderCellProps> = ({
  content,
  isSticky = false,
  align = 'right',
  width,
  className,
}) => {
  const style = width ? { width: `${width}px` } : undefined;
  
  // Folosim cn pentru generarea claselor CSS consistente
  const cellClasses = cn(
    tableHeader(),
    {
      'sticky left-0 z-20 text-left': isSticky,
      'text-left': align === 'left',
      'text-center': align === 'center',
      'text-right': align === 'right',
    },
    className
  );

  return (
    <th
      className={cellClasses}
      style={style}
    >
      {content}
    </th>
  );
};

// Funcția de comparare pentru memoizare
const areEqual = (prevProps: HeaderCellProps, nextProps: HeaderCellProps) => {
  // Conținutul header-ului este rar schimbat, dar verificăm totuși
  if (typeof prevProps.content !== typeof nextProps.content) return false;
  
  // Pentru string și numere, facem comparație directă
  if (
    typeof prevProps.content === 'string' || 
    typeof prevProps.content === 'number'
  ) {
    if (prevProps.content !== nextProps.content) return false;
  }
  
  // Comparăm restul proprietăților
  return (
    prevProps.isSticky === nextProps.isSticky &&
    prevProps.align === nextProps.align &&
    prevProps.width === nextProps.width &&
    prevProps.className === nextProps.className
  );
};

// Exportăm versiunea memoizată
export default memo(HeaderCell, areEqual);

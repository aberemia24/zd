import React, { useMemo, useCallback } from 'react';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, MoreHorizontal } from 'lucide-react';
import { cn } from '../../../styles/cva-v2';
import { button } from '../../../styles/cva-v2';
import { dataTablePagination } from '../../../styles/cva-v2/compositions/data-table';
import Select from '../Select/Select';
import { TABLE } from '@budget-app/shared-constants';

/**
 * 🎨 PAGINATION COMPONENT - CVA v2
 * Standalone pagination component pentru navigarea prin seturi mari de date
 */

export interface PaginationProps {
  /** Current page (1-indexed) */
  currentPage: number;
  /** Total number of items */
  totalItems: number;
  /** Items per page */
  pageSize: number;
  /** Callback when page changes */
  onPageChange: (page: number) => void;
  /** Callback when page size changes */
  onPageSizeChange?: (pageSize: number) => void;
  /** Available page size options */
  pageSizeOptions?: number[];
  /** Show page size selector */
  showPageSizeSelector?: boolean;
  /** Show total count */
  showTotalCount?: boolean;
  /** Show first/last page buttons */
  showFirstLast?: boolean;
  /** Number of page numbers to show around current page */
  siblingCount?: number;
  /** Maximum number of page buttons to show */
  maxVisiblePages?: number;
  /** Size variant */
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  /** CSS classes */
  className?: string;
  /** Disabled state */
  disabled?: boolean;
  /** Data test ID */
  testId?: string;
  /** Loading state */
  loading?: boolean;
  /** Custom labels */
  labels?: {
    previous?: string;
    next?: string;
    first?: string;
    last?: string;
    page?: string;
    of?: string;
    totalItems?: string;
    itemsPerPage?: string;
    showing?: string;
    to?: string;
  };
}

/**
 * Calculate pagination range with ellipsis
 */
const usePaginationRange = (
  currentPage: number,
  totalPages: number,
  siblingCount: number = 1,
  maxVisible: number = 7
) => {
  return useMemo(() => {
    if (totalPages <= maxVisible) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
    const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPages);

    const shouldShowLeftDots = leftSiblingIndex > 2;
    const shouldShowRightDots = rightSiblingIndex < totalPages - 2;

    const firstPageIndex = 1;
    const lastPageIndex = totalPages;

    if (!shouldShowLeftDots && shouldShowRightDots) {
      const leftItemCount = 3 + 2 * siblingCount;
      const leftRange = Array.from({ length: leftItemCount }, (_, i) => i + 1);
      return [...leftRange, '...', totalPages];
    }

    if (shouldShowLeftDots && !shouldShowRightDots) {
      const rightItemCount = 3 + 2 * siblingCount;
      const rightRange = Array.from(
        { length: rightItemCount },
        (_, i) => totalPages - rightItemCount + i + 1
      );
      return [firstPageIndex, '...', ...rightRange];
    }

    if (shouldShowLeftDots && shouldShowRightDots) {
      const middleRange = Array.from(
        { length: rightSiblingIndex - leftSiblingIndex + 1 },
        (_, i) => leftSiblingIndex + i
      );
      return [firstPageIndex, '...', ...middleRange, '...', lastPageIndex];
    }

    return [];
  }, [currentPage, totalPages, siblingCount, maxVisible]);
};

/**
 * Pagination Button Component
 */
const PaginationButton: React.FC<{
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  active?: boolean;
  size?: PaginationProps['size'];
  testId?: string;
  'aria-label'?: string;
}> = ({ 
  children, 
  onClick, 
  disabled = false, 
  active = false, 
  size = 'md',
  testId,
  'aria-label': ariaLabel 
}) => {
  const sizeMap = {
    xs: 'xs',
    sm: 'sm',
    md: 'sm',
    lg: 'md',
    xl: 'lg'
  } as const;

  return (
    <button
      className={cn(
        button({ 
          variant: active ? 'primary' : 'ghost', 
          size: sizeMap[size] 
        }),
        'min-w-[32px] h-8',
        disabled && 'opacity-50 cursor-not-allowed'
      )}
      onClick={onClick}
      disabled={disabled}
      data-testid={testId}
      aria-label={ariaLabel}
      aria-current={active ? 'page' : undefined}
    >
      {children}
    </button>
  );
};

/**
 * Componenta principală Pagination
 */
export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalItems,
  pageSize,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [10, 20, 50, 100],
  showPageSizeSelector = true,
  showTotalCount = true,
  showFirstLast = true,
  siblingCount = 1,
  maxVisiblePages = 7,
  size = 'md',
  className,
  disabled = false,
  testId = 'pagination',
  loading = false,
  labels = {}
}) => {
  const totalPages = Math.ceil(totalItems / pageSize);
  const paginationRange = usePaginationRange(currentPage, totalPages, siblingCount, maxVisiblePages);
  
  const startItem = ((currentPage - 1) * pageSize) + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);

  const defaultLabels = {
    previous: 'Anterior',
    next: 'Următor',
    first: 'Prima',
    last: 'Ultima',
    page: 'Pagina',
    of: 'din',
    totalItems: TABLE.ADVANCED_FEATURES?.TOTAL_RECORDS || 'Total înregistrări: {count}',
    itemsPerPage: TABLE.ADVANCED_FEATURES?.ITEMS_PER_PAGE || 'Elemente pe pagină:',
    showing: 'Afișare',
    to: 'la',
    ...labels
  };

  const handlePageChange = useCallback((page: number) => {
    if (disabled || loading || page < 1 || page > totalPages || page === currentPage) {
      return;
    }
    onPageChange(page);
  }, [disabled, loading, totalPages, currentPage, onPageChange]);

  const handlePageSizeChange = useCallback((newPageSize: string) => {
    if (disabled || loading || !onPageSizeChange) return;
    
    const numericPageSize = parseInt(newPageSize, 10);
    if (!isNaN(numericPageSize) && numericPageSize > 0) {
      onPageSizeChange(numericPageSize);
      // Reset to first page when changing page size
      const newTotalPages = Math.ceil(totalItems / numericPageSize);
      if (currentPage > newTotalPages) {
        onPageChange(1);
      }
    }
  }, [disabled, loading, onPageSizeChange, totalItems, currentPage, onPageChange]);

  // Don't render if no items or single page without page size options
  if (totalItems === 0 || (totalPages <= 1 && !showPageSizeSelector)) {
    return null;
  }

  return (
    <div 
      className={cn(dataTablePagination({ size }), className)}
      data-testid={testId}
      role="navigation"
      aria-label="Pagination Navigation"
    >
      {/* Left side: Items info */}
      <div className="flex items-center gap-4">
        {showTotalCount && (
          <div className="text-sm text-text-secondary">
            {totalItems > 0 ? (
              <>
                {defaultLabels.showing} {startItem} {defaultLabels.to} {endItem} {defaultLabels.of} {totalItems}
              </>
            ) : (
              <>0 {defaultLabels.of} 0</>
            )}
          </div>
        )}

        {showPageSizeSelector && onPageSizeChange && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-text-secondary whitespace-nowrap">
              {defaultLabels.itemsPerPage}
            </span>
            <Select
              value={pageSize.toString()}
              options={pageSizeOptions.map(option => ({
                value: option.toString(),
                label: option.toString()
              }))}
              onChange={(e) => handlePageSizeChange(e.target.value)}
              disabled={disabled || loading}
              size={size === 'xs' ? 'sm' : size === 'xl' ? 'lg' : 'md'}
              className="w-20"
              data-testid={`${testId}-page-size`}
            />
          </div>
        )}
      </div>

      {/* Right side: Navigation */}
      {totalPages > 1 && (
        <div className="flex items-center gap-1">
          {/* First page */}
          {showFirstLast && (
            <PaginationButton
              onClick={() => handlePageChange(1)}
              disabled={disabled || loading || currentPage === 1}
              size={size}
              testId={`${testId}-first`}
              aria-label={defaultLabels.first}
            >
              <ChevronsLeft className="w-4 h-4" />
            </PaginationButton>
          )}

          {/* Previous page */}
          <PaginationButton
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={disabled || loading || currentPage === 1}
            size={size}
            testId={`${testId}-previous`}
            aria-label={defaultLabels.previous}
          >
            <ChevronLeft className="w-4 h-4" />
          </PaginationButton>

          {/* Page numbers */}
          {paginationRange.map((page, index) => {
            if (page === '...') {
              return (
                <span
                  key={`ellipsis-${index}`}
                  className="flex items-center justify-center w-8 h-8 text-text-secondary"
                  data-testid={`${testId}-ellipsis-${index}`}
                >
                  <MoreHorizontal className="w-4 h-4" />
                </span>
              );
            }

            const pageNumber = page as number;
            return (
              <PaginationButton
                key={pageNumber}
                onClick={() => handlePageChange(pageNumber)}
                disabled={disabled || loading}
                active={pageNumber === currentPage}
                size={size}
                testId={`${testId}-page-${pageNumber}`}
                aria-label={`${defaultLabels.page} ${pageNumber}`}
              >
                {pageNumber}
              </PaginationButton>
            );
          })}

          {/* Next page */}
          <PaginationButton
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={disabled || loading || currentPage === totalPages}
            size={size}
            testId={`${testId}-next`}
            aria-label={defaultLabels.next}
          >
            <ChevronRight className="w-4 h-4" />
          </PaginationButton>

          {/* Last page */}
          {showFirstLast && (
            <PaginationButton
              onClick={() => handlePageChange(totalPages)}
              disabled={disabled || loading || currentPage === totalPages}
              size={size}
              testId={`${testId}-last`}
              aria-label={defaultLabels.last}
            >
              <ChevronsRight className="w-4 h-4" />
            </PaginationButton>
          )}
        </div>
      )}
    </div>
  );
};

/**
 * Hook pentru pagination state management
 */
export const usePagination = (
  totalItems: number,
  initialPageSize: number = 10,
  initialPage: number = 1
) => {
  const [currentPage, setCurrentPage] = React.useState(initialPage);
  const [pageSize, setPageSize] = React.useState(initialPageSize);

  const totalPages = Math.ceil(totalItems / pageSize);

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  const handlePageSizeChange = useCallback((newPageSize: number) => {
    setPageSize(newPageSize);
    // Reset to first page when changing page size
    const newTotalPages = Math.ceil(totalItems / newPageSize);
    if (currentPage > newTotalPages) {
      setCurrentPage(1);
    }
  }, [totalItems, currentPage]);

  const reset = useCallback(() => {
    setCurrentPage(1);
    setPageSize(initialPageSize);
  }, [initialPageSize]);

  const goToPage = useCallback((page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  }, [totalPages]);

  const nextPage = useCallback(() => {
    if (currentPage < totalPages) {
      setCurrentPage(prev => prev + 1);
    }
  }, [currentPage, totalPages]);

  const previousPage = useCallback(() => {
    if (currentPage > 1) {
      setCurrentPage(prev => prev - 1);
    }
  }, [currentPage]);

  return {
    currentPage,
    pageSize,
    totalPages,
    totalItems,
    onPageChange: handlePageChange,
    onPageSizeChange: handlePageSizeChange,
    reset,
    goToPage,
    nextPage,
    previousPage,
    hasNextPage: currentPage < totalPages,
    hasPreviousPage: currentPage > 1,
    startItem: ((currentPage - 1) * pageSize) + 1,
    endItem: Math.min(currentPage * pageSize, totalItems)
  };
};

export default Pagination; 

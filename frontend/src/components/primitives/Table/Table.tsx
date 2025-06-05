import React from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  flexRender,
  type ColumnDef,
  type SortingState,
  type ColumnFiltersState,
  type PaginationState,
  type HeaderGroup,
  type Header,
  type Row,
  type Table as TanStackTable,
} from '@tanstack/react-table';
import { ChevronUp, ChevronDown, ChevronsUpDown } from 'lucide-react';

import {
  cn,
  dataTableContainer,
  dataTableHeader,
  dataTable,
  dataTableHead,
  dataTableHeaderCell,
  sortIndicator,
  dataTableBody,
  dataTableRow,
  dataTableCell,
  dataTableEmptyState,
  dataTableToolbar,
  dataTablePagination,
  button,
  type DataTableContainerProps,
  type DataTableHeaderCellProps,
  type DataTableRowProps,
  type DataTableCellProps,
} from '../../../styles/cva-v2';

// =============================================================================
// INTERFACES & TYPES
// =============================================================================

export interface TableColumn<TData> {
  // Proprietăți din ColumnDef
  id?: string;
  header?: string | ((context: unknown) => React.ReactNode);
  accessorKey?: string;
  accessorFn?: (row: TData) => unknown;
  cell?: (context: unknown) => React.ReactNode;
  footer?: string | ((context: unknown) => React.ReactNode);
  
  // Proprietăți Carbon Design System specifice
  enableSorting?: boolean;
  enableFiltering?: boolean;
  align?: 'left' | 'center' | 'right';
  numeric?: boolean;
  
  // Proprietăți suplimentare pentru TanStack Table
  enableResizing?: boolean;
  enableGrouping?: boolean;
  enableHiding?: boolean;
  size?: number;
  minSize?: number;
  maxSize?: number;
}

export interface TableProps<TData> {
  data: TData[];
  columns: TableColumn<TData>[];
  
  // Carbon Table features
  title?: string;
  description?: string;
  enableSorting?: boolean;
  enableFiltering?: boolean;
  enablePagination?: boolean;
  enableSelection?: boolean;
  enableExpansion?: boolean;
  
  // Styling options from DataTableContainerProps
  size?: DataTableContainerProps['size'];
  zebra?: DataTableContainerProps['zebra'];
  border?: DataTableContainerProps['border'];
  interactive?: DataTableContainerProps['interactive'];
  stickyHeader?: boolean;
  emptyStateMessage?: string;
  className?: string;
  
  // Event handlers
  onRowClick?: (row: TData) => void;
  onRowSelect?: (selectedRows: TData[]) => void;
  
  // Controlled state
  sorting?: SortingState;
  onSortingChange?: React.Dispatch<React.SetStateAction<SortingState>>;
  columnFilters?: ColumnFiltersState;
  onColumnFiltersChange?: React.Dispatch<React.SetStateAction<ColumnFiltersState>>;
  pagination?: PaginationState;
  onPaginationChange?: React.Dispatch<React.SetStateAction<PaginationState>>;
  
  // Performance
  dataTestId?: string;
  rowSelection?: Record<string, boolean>;
  onRowSelectionChange?: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
}

// =============================================================================
// HEADER COMPONENT
// =============================================================================

interface TableHeaderProps {
  title?: string;
  description?: string;
  size?: DataTableContainerProps['size'];
}

const TableHeader: React.FC<TableHeaderProps> = ({ title, description, size }) => {
  if (!title && !description) return null;

  return (
    <div className={cn(dataTableHeader({ size }))}>
      {title && (
        <h3 className="text-lg font-semibold text-text-primary mb-1">
          {title}
        </h3>
      )}
      {description && (
        <p className="text-sm text-text-secondary">
          {description}
        </p>
      )}
    </div>
  );
};

// =============================================================================
// SORT ICON COMPONENT
// =============================================================================

interface SortIconProps {
  direction: 'asc' | 'desc' | false;
}

const SortIcon: React.FC<SortIconProps> = ({ direction }) => {
  const iconClass = "w-4 h-4";
  
  if (direction === 'asc') {
    return <ChevronUp className={iconClass} />;
  }
  
  if (direction === 'desc') {
    return <ChevronDown className={iconClass} />;
  }
  
  return <ChevronsUpDown className={iconClass} />;
};

// =============================================================================
// TABLE COMPONENT
// =============================================================================

function Table<TData>({
  data,
  columns,
  title,
  description,
  enableSorting = true,
  enableFiltering = false,
  enablePagination = false,
  enableSelection = false,
  stickyHeader = false,
  emptyStateMessage = "Nu sunt date disponibile",
  className,
  onRowClick,
  sorting: controlledSorting,
  onSortingChange: setControlledSorting,
  columnFilters: controlledColumnFilters,
  onColumnFiltersChange: setControlledColumnFilters,
  pagination: controlledPagination,
  onPaginationChange: setControlledPagination,
  rowSelection: controlledRowSelection,
  onRowSelectionChange: setControlledRowSelection,
  dataTestId,
  size = 'md',
  zebra = false,
  border = 'subtle',
  interactive = true,
}: TableProps<TData>) {
  // Internal state for uncontrolled usage
  const [internalSorting, setInternalSorting] = React.useState<SortingState>([]);
  const [internalColumnFilters, setInternalColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [internalPagination, setInternalPagination] = React.useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [internalRowSelection, setInternalRowSelection] = React.useState<Record<string, boolean>>({});

  // Use controlled state if provided, otherwise use internal state
  const sorting = controlledSorting ?? internalSorting;
  const setSorting = setControlledSorting ?? setInternalSorting;
  const columnFilters = controlledColumnFilters ?? internalColumnFilters;
  const setColumnFilters = setControlledColumnFilters ?? setInternalColumnFilters;
  const pagination = controlledPagination ?? internalPagination;
  const setPagination = setControlledPagination ?? setInternalPagination;
  const rowSelection = controlledRowSelection ?? internalRowSelection;
  const setRowSelection = setControlledRowSelection ?? setInternalRowSelection;

  const table: TanStackTable<TData> = useReactTable({
    data,
    columns: columns as ColumnDef<TData>[],
    getCoreRowModel: getCoreRowModel(),
    ...(enableSorting && {
      getSortedRowModel: getSortedRowModel(),
      onSortingChange: setSorting,
    }),
    ...(enableFiltering && {
      getFilteredRowModel: getFilteredRowModel(),
      onColumnFiltersChange: setColumnFilters,
    }),
    ...(enablePagination && {
      getPaginationRowModel: getPaginationRowModel(),
      onPaginationChange: setPagination,
    }),
    ...(enableSelection && {
      onRowSelectionChange: setRowSelection,
    }),
    state: {
      ...(enableSorting && { sorting }),
      ...(enableFiltering && { columnFilters }),
      ...(enablePagination && { pagination }),
      ...(enableSelection && { rowSelection }),
    },
  });

  return (
    <div 
      className={cn(dataTableContainer({ size, zebra, border, interactive }), className)}
      data-testid={dataTestId}
    >
      {/* Header */}
      <TableHeader title={title} description={description} size={size} />
      
      {/* Table */}
      <div className="overflow-auto">
        <table className={cn(dataTable())}>
          <thead className={cn(dataTableHead({ sticky: stickyHeader }))}>
            {table.getHeaderGroups().map((headerGroup: HeaderGroup<TData>) => (
              <tr key={headerGroup.id} className={cn(dataTableRow())}>
                {headerGroup.headers.map((header: Header<TData, unknown>) => {
                  const column = header.column.columnDef as TableColumn<TData>;
                  const canSort = enableSorting && header.column.getCanSort();
                  const sortDirection = header.column.getIsSorted();
                  
                  return (
                    <th
                      key={header.id}
                      className={cn(dataTableHeaderCell({
                        sortable: canSort,
                        sorted: sortDirection || 'none',
                        align: column.align || 'left',
                        size,
                      }))}
                      onClick={canSort ? header.column.getToggleSortingHandler() : undefined}
                      style={{ width: header.getSize() }}
                    >
                      <div className="flex items-center gap-2">
                        {flexRender(header.column.columnDef.header, header.getContext())}
                        {canSort && (
                          <span className={cn(sortIndicator({ direction: sortDirection || 'none' }))}>
                            <SortIcon direction={sortDirection} />
                          </span>
                        )}
                      </div>
                    </th>
                  );
                })}
              </tr>
            ))}
          </thead>
          
          <tbody className={cn(dataTableBody())}>
            {table.getRowModel().rows.length === 0 ? (
              <tr>
                <td 
                  colSpan={columns.length} 
                  className={cn(dataTableEmptyState({ size }))}
                >
                  {emptyStateMessage}
                </td>
              </tr>
            ) : (
              table.getRowModel().rows.map((row: Row<TData>) => {
                const isSelected = enableSelection && row.getIsSelected();
                const isInteractive = interactive || !!onRowClick;
                
                return (
                  <tr
                    key={row.id}
                    className={cn(dataTableRow({
                      interactive: isInteractive,
                      selected: isSelected,
                    }))}
                    onClick={onRowClick ? () => onRowClick(row.original) : undefined}
                    data-testid={`${dataTestId}-row-${row.id}`}
                  >
                    {row.getVisibleCells().map((cell) => {
                      const column = cell.column.columnDef as TableColumn<TData>;
                      
                      return (
                        <td
                          key={cell.id}
                          className={cn(dataTableCell({
                            align: column.align || 'left',
                            size,
                            numeric: column.numeric || false,
                          }))}
                        >
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </td>
                      );
                    })}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
      
      {/* Pagination */}
      {enablePagination && (
        <div className={cn(dataTablePagination({ size }))}>
          <div className="flex items-center gap-2">
            <span className="text-sm text-text-secondary">
              Afișare {table.getRowModel().rows.length} din {table.getFilteredRowModel().rows.length} înregistrări
            </span>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              className={cn(button({ variant: 'ghost', size: 'sm' }))}
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              Anterior
            </button>
            
            <span className="text-sm text-text-secondary">
              Pagina {table.getState().pagination.pageIndex + 1} din {table.getPageCount()}
            </span>
            
            <button
              className={cn(button({ variant: 'ghost', size: 'sm' }))}
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              Următor
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Table; 
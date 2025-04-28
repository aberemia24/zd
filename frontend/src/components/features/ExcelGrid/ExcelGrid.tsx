import React from 'react';
import { EXCEL_GRID } from '@shared-constants';

// Structura pentru datele lunare
export type MonthlyData = {
  luna: string;
  venituri: number;
  cheltuieli: number;
  economii: number;
  sold: number;
};

export type ExcelGridProps = {
  data: MonthlyData[];
  loading?: boolean;
  className?: string;
};

/**
 * Componentă Excel-like pentru afișarea datelor financiare lunare
 * Folosește clase Tailwind din utils.css pentru stilizare consistentă
 */
const ExcelGrid: React.FC<ExcelGridProps> = ({
  data = [],
  loading = false,
  className = '',
}) => {
  // Folosim textele centralizate din constants/ui.ts
  const headers = EXCEL_GRID.HEADERS;

  if (loading) {
    return <div className="text-center py-8" data-testid="excel-grid-loading">{EXCEL_GRID.LOADING}</div>;
  }

  if (data.length === 0) {
    return <div className="text-center py-8" data-testid="excel-grid-no-data">{EXCEL_GRID.NO_DATA}</div>;
  }

  return (
    <div className={`overflow-x-auto shadow-md rounded-lg ${className}`}>
      <div className="grid grid-cols-12 divide-x divide-y divide-gray-200 border border-gray-200">
        {/* Header row */}
        <div className="excel-header col-span-2">{headers.LUNA}</div>
        <div className="excel-header col-span-2">{headers.VENITURI}</div>
        <div className="excel-header col-span-2">{headers.CHELTUIELI}</div>
        <div className="excel-header col-span-2">{headers.ECONOMII}</div>
        <div className="excel-header col-span-4">{headers.SOLD}</div>

        {/* Data rows */}
        {data.map((item, index) => (
          <React.Fragment key={index}>
            <div className="excel-cell col-span-2">{item.luna}</div>
            <div className="excel-cell col-span-2 text-income">{item.venituri}</div>
            <div className="excel-cell col-span-2 text-expense">{item.cheltuieli}</div>
            <div className="excel-cell col-span-2 text-saving">{item.economii}</div>
            <div className="excel-cell col-span-4 font-medium">{item.sold}</div>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default ExcelGrid;

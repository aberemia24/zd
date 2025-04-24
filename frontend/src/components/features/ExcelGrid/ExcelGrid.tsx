import React from 'react';

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
  // La cardul următor vom importa aceste texte din constants/ui.ts
  // când vom avea nevoie de ele în UI real
  const headers = {
    LUNA: 'Luna',
    VENITURI: 'Venituri',
    CHELTUIELI: 'Cheltuieli',
    ECONOMII: 'Economii',
    SOLD: 'Sold',
  };

  if (loading) {
    return <div className="text-center py-8">Se încarcă datele...</div>;
  }

  if (data.length === 0) {
    return <div className="text-center py-8">Nu există date disponibile</div>;
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

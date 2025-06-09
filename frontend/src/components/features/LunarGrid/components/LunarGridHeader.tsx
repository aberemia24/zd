import React from 'react';
import { Maximize2, Minimize2 } from 'lucide-react';

// Shared constants și UI
import { LUNAR_GRID } from "@budget-app/shared-constants";

// Componente
import Button from "../../../primitives/Button/Button";

// CVA styling imports - MIGRATED TO CVA-V2
import { 
  cn,
  textProfessional,
} from "../../../../styles/cva-v2";

// Utilitare
import { formatMonthYear } from "../../../../utils/lunarGrid";

export interface LunarGridHeaderProps {
  // Month/year state
  year: number;
  month: number;
  onYearChange?: (year: number) => void;
  onMonthChange?: (month: number) => void;
  monthOptions?: Array<{ value: string; label: string }>;
  
  // Expand/collapse functionality
  isAllRowsExpanded: boolean;
  onToggleExpandAll: () => void;
  onResetExpanded: () => void;
  
  // Fullscreen functionality
  isFullscreen?: boolean;
  onToggleFullscreen?: () => void;
  
  // Grid title
  title?: string;
}

const LunarGridHeader: React.FC<LunarGridHeaderProps> = ({
  year,
  month,
  onYearChange,
  onMonthChange,
  monthOptions,
  isAllRowsExpanded,
  onToggleExpandAll,
  onResetExpanded,
  isFullscreen = false,
  onToggleFullscreen,
  title = "Grid Lunar"
}) => {
  return (
    <th 
      colSpan={100} // Large enough to span all columns
      className="bg-white border-b-0 p-4"
    >
      <div className="grid grid-cols-3 items-center gap-4">
        {/* Partea stânga: Butoane control grid */}
        <div className="flex items-center gap-3 justify-start">
          <h2 className={cn(
            textProfessional({ variant: "heading", contrast: "high" }),
            "text-lg font-bold"
          )}>
            {title}
          </h2>
          
          {/* Butoane extinde/resetează din toolbar */}
          <Button
            variant="secondary"
            size="sm"
            onClick={onToggleExpandAll}
            data-testid="toggle-expand-all"
          >
            {isAllRowsExpanded ? LUNAR_GRID.COLLAPSE_ALL : LUNAR_GRID.EXPAND_ALL}
          </Button>
          
          <Button
            variant="secondary"
            size="sm"
            onClick={onResetExpanded}
            data-testid="reset-expanded"
          >
            {LUNAR_GRID.RESET_EXPANSION}
          </Button>
        </div>

        {/* Partea centrală: Luna și anul cu mărimea originală */}
        <div className="flex justify-center">
          <h2 className="text-3xl font-bold text-gray-900 tracking-tight select-none cursor-default">
            {formatMonthYear(month, year)}
          </h2>
        </div>

        {/* Partea dreaptă: Controale navigare + Fullscreen */}
        <div className="flex items-center gap-3 justify-end">
          {/* Select pentru lună */}
          {monthOptions && onMonthChange && (
            <select
              value={month.toString()}
              onChange={(e) => onMonthChange(parseInt(e.target.value, 10))}
              className={cn(
                "px-3 py-2 border border-gray-300 rounded-md",
                "bg-white text-sm font-medium",
                "focus:outline-none focus:ring-2 focus:ring-primary-500"
              )}
              data-testid="month-selector"
            >
              {monthOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          )}
          
          {/* Input pentru an */}
          {onYearChange && (
            <input
              type="number"
              value={year.toString()}
              onChange={(e) => {
                const newYear = parseInt(e.target.value, 10);
                if (!isNaN(newYear) && newYear > 1900 && newYear < 2100) {
                  onYearChange(newYear);
                }
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  e.currentTarget.blur(); // Remove focus from input
                }
              }}
              min="1900"
              max="2100"
              className={cn(
                "w-20 px-2 py-2 border border-gray-300 rounded-md",
                "bg-white text-sm font-medium text-center",
                "focus:outline-none focus:ring-2 focus:ring-primary-500"
              )}
              data-testid="lunargrid-year-input"
            />
          )}
          
          {/* Buton fullscreen */}
          {onToggleFullscreen && (
            <div
              onClick={onToggleFullscreen}
              className={cn(
                "cursor-pointer select-none",
                "p-2 rounded-lg",
                "hover:bg-primary-50 active:bg-primary-100",
                "transition-all duration-150",
                "flex items-center justify-center",
                isFullscreen ? "bg-primary-100 text-primary-700" : "text-primary-600 hover:text-primary-800"
              )}
              title="Toggle fullscreen"
              data-testid="layout-mode-toggle"
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onToggleFullscreen();
                }
              }}
            >
              {isFullscreen ? (
                <Minimize2 size={24} strokeWidth={2} />
              ) : (
                <Maximize2 size={24} strokeWidth={2} />
              )}
            </div>
          )}
        </div>
      </div>
    </th>
  );
};

// Add display name for debugging
LunarGridHeader.displayName = 'LunarGridHeader';

export default LunarGridHeader; 
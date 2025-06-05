import React, { useState, useMemo, useCallback } from "react";
import Button from "../../primitives/Button/Button";
import Input from "../../primitives/Input/Input";
import Select from "../../primitives/Select/Select";
import { 
  cn,
  headingProfessional,
  labelProfessional,
  captionProfessional,
  spacingMargin,
  spaceY,
  flexLayout
} from "../../../styles/cva-v2";
import type { ExportFormat } from "../../../utils/ExportManager";
import { BUTTONS, EXPORT_MESSAGES } from "@shared-constants";
import { EXPORT_UI } from "@shared-constants/ui";

import { useCategoryStore } from "../../../stores/categoryStore";

export interface ExportState {
  isExporting: boolean;
  progress: number;
  error: string | null;
  status?: string;
}

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onExport: (
    format: ExportFormat,
    options: {
      filename?: string;
      title?: string;
      dateRange?: { from: string; to: string };
    },
  ) => Promise<void>;
  exportState: ExportState;
  transactionCount: number;
}

const EXPORT_FORMATS: Array<{
  value: ExportFormat;
  label: string;
  description: string;
}> = [
  {
    value: "csv",
    label: "CSV",
    description: "Comma-separated values - compatibil cu Excel",
  },
  {
    value: "pdf",
    label: "PDF",
    description: "Document formatat pentru vizualizare și printare",
  },
  {
    value: "excel",
    label: "Excel",
    description: "Fișier Excel (.xlsx) cu formatare avansată",
  },
];

/**
 * Modal pentru configurarea opțiunilor de export
 * Permite selecția formatului și configurarea parametrilor  
 * Migrated la CVA styling system pentru consistență
 * OPTIMIZED cu React.memo pentru performance
 */
const ExportModalComponent: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  onExport,
  exportState,
  transactionCount,
}) => {
  const [format, setFormat] = useState<ExportFormat>("csv");
  const [title, setTitle] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState<number | null>(null);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [customFilename, setCustomFilename] = useState("");

  // Generate options in correct format for Select component - MEMOIZED pentru performance
  const yearOptions = useMemo(() => 
    Array.from({ length: 10 }, (_, i) => ({
      value: (i + 2024).toString(),
      label: (i + 2024).toString()
    })), []
  );
  
  const monthOptions = useMemo(() => 
    Array.from({ length: 12 }, (_, i) => ({
      value: (i + 1).toString(),
      label: (i + 1).toString()
    })), []
  );

  const categories = useCategoryStore((state) => state.categories);
  const categoryOptions = useMemo(() => 
    categories.map((category) => ({
      value: category.name,
      label: category.name
    })), [categories]
  );

  // Închide modalul la apăsarea pe overlay - OPTIMIZED cu useCallback
  const handleOverlayClick = useCallback((e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  }, [onClose]);

  // Gestionează exportul - OPTIMIZED cu useCallback
  const handleExport = useCallback(() => {
    const options: Parameters<typeof onExport>[1] = {};

    if (customFilename.trim()) {
      options.filename = customFilename.trim();
    }

    if (title.trim()) {
      options.title = title.trim();
    }

    if (dateFrom && dateTo) {
      options.dateRange = { from: dateFrom, to: dateTo };
    }

    onExport(format, options);
  }, [format, customFilename, title, dateFrom, dateTo, onExport]);

  const handleYearChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    setYear(Number(e.target.value));
  }, []);

  const handleMonthChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    setMonth(Number(e.target.value));
  }, []);

  const handleCategoryChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCategory(e.target.value);
  }, []);

  // Returnează null dacă modalul nu este deschis
  if (!isOpen) return null;

  return (
    <div
      className={cn(
        "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50",
      )}
      onClick={handleOverlayClick}
      data-testid="export-modal-overlay"
    >
      <div
        className={cn(
          "bg-white dark:bg-surface-dark rounded-lg p-6 w-full max-w-md mx-4 relative shadow-lg",
          "transform transition-all duration-300 ease-out",
        )}
        data-testid="export-modal"
      >
        {/* Header */}
        <div className={cn(
          flexLayout({ justify: "between", align: "center" }),
          spacingMargin({ bottom: 6 })
        )}>
          <h3 className={headingProfessional({ level: "h3" })}>
            Export Tranzacții
          </h3>
          <button
            onClick={onClose}
            className={cn(
              "text-carbon-400 hover:text-carbon-600 dark:text-carbon-400 dark:hover:text-carbon-200",
              "transition-colors duration-150",
              "focus:outline-none focus:ring-2 focus:ring-copper-500 focus:ring-offset-1",
              "rounded-md p-1",
            )}
            data-testid="export-modal-close"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Progress Bar - afișat doar în timpul exportului */}
        {exportState.isExporting && (
          <div className={spacingMargin({ bottom: 6 })}>
            <p className={captionProfessional({ size: "sm" })}>
              {exportState.status ||
                EXPORT_MESSAGES.IN_PROGRES.replace(
                  "{progress}",
                  exportState.progress.toString(),
                )}
            </p>
            <div className={cn(
              "w-full bg-gray-200 dark:bg-neutral-600 rounded-full h-2 shadow-sm",
              spacingMargin({ bottom: 4 })
            )}>
              <div
                className="bg-primary-500 dark:bg-primary-400 h-2 rounded-full transition-all duration-300"
                style={{ width: `${exportState.progress}%` }}
              />
            </div>
          </div>
        )}

        {/* Error Display */}
        {exportState.error && (
          <div className={cn(
            "p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md",
            spacingMargin({ bottom: 6 })
          )}>
            <p className={captionProfessional({ size: "sm", variant: "danger" })}>
              {exportState.error}
            </p>
          </div>
        )}

        {/* Informații despre export */}
        <div className={cn(
          "p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-md",
          spacingMargin({ bottom: 6 })
        )}>
          <p className={captionProfessional({ size: "sm", variant: "primary" })}>
            Se vor exporta {transactionCount} tranzacții.
          </p>
        </div>

        {/* Form de configurare export */}
        <div className={cn(
          spaceY({ spacing: 4 }),
          spacingMargin({ bottom: 6 })
        )}>
          {/* Format Selection */}
          <div>
            <label className={labelProfessional({ size: "sm" })}>
              Format export:
            </label>
            <Select
              value={format}
              onChange={(e) => setFormat(e.target.value as ExportFormat)}
              options={EXPORT_FORMATS}
              disabled={exportState.isExporting}
              data-testid="export-format-select"
            />
          </div>

          {/* Year Selection */}
          <div>
            <label className={labelProfessional({ size: "sm" })}>
              {EXPORT_UI.YEAR_LABEL}
            </label>
            <Select
              value={year.toString()}
              onChange={handleYearChange}
              options={yearOptions}
              disabled={exportState.isExporting}
              data-testid="export-year-select"
            />
          </div>

          {/* Month Selection */}
          <div>
            <label className={labelProfessional({ size: "sm" })}>
              {EXPORT_UI.MONTH_LABEL}
            </label>
            <Select
              value={month?.toString() || ""}
              onChange={handleMonthChange}
              options={monthOptions}
              placeholder="Toate lunile"
              disabled={exportState.isExporting}
              data-testid="export-month-select"
            />
          </div>

          {/* Category Selection */}
          <div>
            <label className={labelProfessional({ size: "sm" })}>
              {EXPORT_UI.CATEGORY_FILTER_LABEL}
            </label>
            <Select
              value={selectedCategory}
              onChange={handleCategoryChange}
              options={categoryOptions}
              placeholder="Toate categoriile"
              disabled={exportState.isExporting}
              data-testid="export-category-select"
            />
          </div>

          {/* Custom Filename */}
          <div>
            <label className={labelProfessional({ size: "sm" })}>
              {EXPORT_UI.FILENAME_LABEL}
            </label>
            <Input
              type="text"
              value={customFilename}
              onChange={(e) => setCustomFilename(e.target.value)}
              placeholder={EXPORT_UI.FILENAME_PLACEHOLDER}
              disabled={exportState.isExporting}
              data-testid="export-filename-input"
            />
          </div>

          {/* Date Range */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelProfessional({ size: "sm" })}>
                De la data:
              </label>
              <Input
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                disabled={exportState.isExporting}
                data-testid="export-date-from"
              />
            </div>
            <div>
              <label className={labelProfessional({ size: "sm" })}>
                Până la data:
              </label>
              <Input
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                disabled={exportState.isExporting}
                data-testid="export-date-to"
              />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className={flexLayout({ justify: "end", gap: 2 })}>
          <Button
            variant="ghost"
            onClick={onClose}
            disabled={exportState.isExporting}
            data-testid="export-cancel-button"
          >
            {BUTTONS.CANCEL}
          </Button>
          <Button
            variant="primary"
            onClick={handleExport}
            disabled={exportState.isExporting}
            data-testid="export-confirm-button"
          >
            {exportState.isExporting ? "Se exportă..." : BUTTONS.EXPORT}
          </Button>
        </div>
      </div>
    </div>
  );
};

// React.memo wrapper pentru optimizarea re-renderurilor - Pattern validat din proiect
export const ExportModal = React.memo(ExportModalComponent, (prevProps, nextProps) => {
  // Custom comparison pentru props critice la performance
  return (
    prevProps.isOpen === nextProps.isOpen &&
    prevProps.transactionCount === nextProps.transactionCount &&
    prevProps.exportState.isExporting === nextProps.exportState.isExporting &&
    prevProps.exportState.progress === nextProps.exportState.progress &&
    prevProps.exportState.error === nextProps.exportState.error &&
    prevProps.exportState.status === nextProps.exportState.status
    // onClose și onExport sunt callback-uri și se vor schimba în mod normal
  );
});

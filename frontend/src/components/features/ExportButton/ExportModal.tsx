import React, { useState, useCallback, useMemo } from "react";
import Input from "../../primitives/Input/Input";
import Select from "../../primitives/Select/Select";
import Button from "../../primitives/Button/Button";
import Badge from "../../primitives/Badge/Badge";
import Alert from "../../primitives/Alert/Alert";
import FormLayout from "../../primitives/FormLayout/FormLayout";
import FieldGrid, { FieldWrapper } from "../../primitives/FieldGrid/FieldGrid";
import { useCategoryStore } from "../../../stores/categoryStore";
import { ExportFormat } from "../../../types/financial";
import { EXPORT_UI, EXPORT_MESSAGES } from "@budget-app/shared-constants";
import { 
  cn,
  flexLayout
} from "../../../styles/cva-v2";

// =============================================================================
// TYPES & INTERFACES
// =============================================================================

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

// =============================================================================
// CONSTANTS
// =============================================================================

const EXPORT_FORMATS = [
  { value: "csv", label: "CSV (Comma Separated)" },
  { value: "excel", label: "Excel (XLSX)" },
  { value: "json", label: "JSON (Pentru dezvoltatori)" },
];

// =============================================================================
// MAIN COMPONENT
// =============================================================================

const ExportModalComponent: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  onExport,
  exportState,
  transactionCount,
}) => {
  // =============================================================================
  // LOCAL STATE
  // =============================================================================

  const [format, setFormat] = useState<ExportFormat>("csv");
  const [title, setTitle] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState<number | null>(null);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [customFilename, setCustomFilename] = useState("");

  // =============================================================================
  // COMPUTED VALUES
  // =============================================================================

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

  // =============================================================================
  // EVENT HANDLERS
  // =============================================================================

  const handleOverlayClick = useCallback((e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  }, [onClose]);

  const handleYearChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    setYear(parseInt(e.target.value));
  }, []);

  const handleMonthChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    setMonth(e.target.value ? parseInt(e.target.value) : null);
  }, []);

  const handleCategoryChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCategory(e.target.value);
  }, []);

  const handleExport = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
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

    await onExport(format, options);
  }, [format, customFilename, title, dateFrom, dateTo, onExport]);

  // =============================================================================
  // EARLY RETURNS
  // =============================================================================

  if (!isOpen) return null;

  // =============================================================================
  // FORM CONFIGURATION
  // =============================================================================

  const formTitle = "Export Tranzacții";
  
  const loadingIndicator = exportState.isExporting ? (
    <Badge variant="warning">
      Exportând... {exportState.progress}%
    </Badge>
  ) : undefined;

  const formActions = (
    <>
      <Button
        type="button"
        variant="secondary"
        size="md"
        onClick={onClose}
        disabled={exportState.isExporting}
        className="w-full sm:w-auto"
      >
        Anulează
      </Button>

      <Button
        type="submit"
        variant="primary"
        size="md"
        disabled={exportState.isExporting}
        className="w-full sm:w-auto"
      >
        {exportState.isExporting ? `Export în progres...` : `Exportă ${transactionCount} tranzacții`}
      </Button>
    </>
  );

  const formMessages = (
    <>
      {exportState.error && (
        <Alert variant="error">
          {exportState.error}
        </Alert>
      )}

      {exportState.isExporting && exportState.status && (
        <Alert variant="default">
          {exportState.status}
        </Alert>
      )}

      {!exportState.isExporting && !exportState.error && (
        <Alert variant="default">
          Se vor exporta {transactionCount} tranzacții.
        </Alert>
      )}
    </>
  );

  // =============================================================================
  // RENDER
  // =============================================================================

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={handleOverlayClick}
      data-testid="export-modal-overlay"
    >
      <div
        className="bg-white dark:bg-carbon-900 rounded-lg w-full max-w-2xl mx-4 relative shadow-lg transform transition-all duration-300 ease-out"
        data-testid="export-modal"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className={cn(
            "absolute top-4 right-4 z-10",
            "text-carbon-400 hover:text-carbon-600 dark:text-carbon-400 dark:hover:text-carbon-200",
            "transition-colors duration-150",
            "focus:outline-none focus:ring-2 focus:ring-copper-500 focus:ring-offset-1",
            "rounded-md p-2"
          )}
          data-testid="export-modal-close"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Progress Bar - afișat doar în timpul exportului */}
        {exportState.isExporting && (
          <div className="p-6 pb-0">
            <div className="w-full bg-gray-200 dark:bg-neutral-600 rounded-full h-3 shadow-sm">
              <div
                className="bg-copper-500 dark:bg-copper-400 h-3 rounded-full transition-all duration-300"
                style={{ width: `${exportState.progress}%` }}
              />
            </div>
          </div>
        )}

        <FormLayout
          title={formTitle}
          loadingIndicator={loadingIndicator}
          actions={formActions}
          messages={formMessages}
          onSubmit={handleExport}
          testId="export-form"
          ariaLabel="Formular export tranzacții"
          className="border-0 shadow-none bg-transparent"
        >
          {/* Export Configuration */}
          <FieldGrid cols={{ base: 1, md: 2 }} gap={4}>
            {/* Format Selection */}
            <Select
              name="format"
              label="Format export*:"
              value={format}
              onChange={(e) => setFormat(e.target.value as ExportFormat)}
              options={EXPORT_FORMATS}
              disabled={exportState.isExporting}
              data-testid="export-format-select"
              variant="default"
              size="md"
            />

            {/* Custom Filename */}
            <Input
              name="customFilename"
              type="text"
              label={EXPORT_UI.FILENAME_LABEL}
              value={customFilename}
              onChange={(e) => setCustomFilename(e.target.value)}
              placeholder={EXPORT_UI.FILENAME_PLACEHOLDER}
              disabled={exportState.isExporting}
              data-testid="export-filename-input"
              variant="default"
              size="md"
            />
          </FieldGrid>

          {/* Time Period Selection */}
          <div className="space-y-1">
            <h4 className="text-md font-medium text-carbon-800 dark:text-carbon-200">
              Perioada de timp
            </h4>
            <p className="text-sm text-carbon-600 dark:text-carbon-400">
              Selectați intervalul temporal pentru export
            </p>
          </div>

          <FieldGrid cols={{ base: 1, md: 3 }} gap={4}>
            {/* Year Selection */}
            <Select
              name="year"
              label={EXPORT_UI.YEAR_LABEL}
              value={year.toString()}
              onChange={handleYearChange}
              options={yearOptions}
              disabled={exportState.isExporting}
              data-testid="export-year-select"
              variant="default"
              size="md"
            />

            {/* Month Selection */}
            <Select
              name="month"
              label={EXPORT_UI.MONTH_LABEL}
              value={month?.toString() || ""}
              onChange={handleMonthChange}
              options={monthOptions}
              placeholder="Toate lunile"
              disabled={exportState.isExporting}
              data-testid="export-month-select"
              variant="default"
              size="md"
            />

            {/* Category Selection */}
            <Select
              name="category"
              label={EXPORT_UI.CATEGORY_FILTER_LABEL}
              value={selectedCategory}
              onChange={handleCategoryChange}
              options={categoryOptions}
              placeholder="Toate categoriile"
              disabled={exportState.isExporting}
              data-testid="export-category-select"
              variant="default"
              size="md"
            />
          </FieldGrid>

          {/* Custom Date Range */}
          <div className="space-y-1">
            <h4 className="text-md font-medium text-carbon-800 dark:text-carbon-200">
              Interval personalizat
            </h4>
            <p className="text-sm text-carbon-600 dark:text-carbon-400">
              Opțional - specificați un interval exact de date
            </p>
          </div>

          <FieldGrid cols={{ base: 1, md: 2 }} gap={4}>
            <Input
              name="dateFrom"
              type="date"
              label="De la data:"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              disabled={exportState.isExporting}
              data-testid="export-date-from"
              variant="default"
              size="md"
            />

            <Input
              name="dateTo"
              type="date"
              label="Până la data:"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              disabled={exportState.isExporting}
              data-testid="export-date-to"
              variant="default"
              size="md"
            />
          </FieldGrid>

          {/* Optional Title */}
          <FieldWrapper fullWidth>
            <Input
              name="title"
              type="text"
              label="Titlu raport (opțional):"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="ex: Raport cheltuieli Q1 2024"
              disabled={exportState.isExporting}
              data-testid="export-title-input"
              variant="default"
              size="md"
            />
          </FieldWrapper>
        </FormLayout>
      </div>
    </div>
  );
};

// Memoized export pentru optimizare
const ExportModal = React.memo(ExportModalComponent);

export default ExportModal;

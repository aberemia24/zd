import React, { useState } from "react";
import { useExport } from "../../../hooks/useExport";
import Button from "../../primitives/Button/Button";
import ExportModal from "./ExportModal";
import type { Transaction } from "../../../types/Transaction";
import type { ExportFormat } from "../../../utils/ExportManager";
import { BUTTONS } from "@shared-constants/ui";

interface ExportButtonProps {
  transactions: Transaction[];
  disabled?: boolean;
  className?: string;
}

/**
 * Componentă pentru exportul tranzacțiilor în diverse formate
 * Oferă UI pentru selecția formatului și opțiunilor de export
 */
const ExportButtonComponent: React.FC<ExportButtonProps> = ({
  transactions,
  disabled = false,
  className = "",
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { exportData, state, resetState } = useExport();

  const handleExportClick = () => {
    setIsModalOpen(true);
    resetState();
  };

  const handleExport = async (
    format: ExportFormat,
    options: {
      filename?: string;
      title?: string;
      dateRange?: { from: string; to: string };
    },
  ) => {
    try {
      await exportData(transactions, format, options);
      setIsModalOpen(false);
    } catch (error) {
      // Error is handled by useExport hook
      console.error("Export failed:", error);
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    resetState();
  };

  const isDisabled = disabled || transactions.length === 0 || state.isExporting;

  return (
    <>
      <Button
        onClick={handleExportClick}
        disabled={isDisabled}
        className={className}
        variant="secondary"
        size="md"
        dataTestId="export-button"
      >
        {state.isExporting ? "Se exportă..." : BUTTONS.EXPORT}
      </Button>

      {isModalOpen && (
        <ExportModal
          isOpen={isModalOpen}
          onClose={handleModalClose}
          onExport={handleExport}
          exportState={state}
          transactionCount={transactions.length}
        />
      )}
    </>
  );
};

// React.memo wrapper pentru optimizarea re-renderurilor - Pattern validat din proiect
export const ExportButton = React.memo(ExportButtonComponent);

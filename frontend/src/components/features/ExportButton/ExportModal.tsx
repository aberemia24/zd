import React, { useState } from 'react';
import Button from '../../primitives/Button/Button';
import Input from '../../primitives/Input/Input';
import Select from '../../primitives/Select/Select';
import { useThemeEffects } from '../../../hooks/useThemeEffects';
import type { ExportFormat } from '../../../utils/ExportManager';
import { BUTTONS } from '@shared-constants/ui';
import { EXPORT_MESSAGES } from '@shared-constants/messages';

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
    }
  ) => Promise<void>;
  exportState: ExportState;
  transactionCount: number;
}

const EXPORT_FORMATS: Array<{ value: ExportFormat; label: string; description: string }> = [
  { 
    value: 'csv', 
    label: 'CSV', 
    description: 'Comma-separated values - compatibil cu Excel' 
  },
  { 
    value: 'pdf', 
    label: 'PDF', 
    description: 'Document formatat pentru vizualizare și printare' 
  },
  { 
    value: 'excel', 
    label: 'Excel', 
    description: 'Fișier Excel (.xlsx) cu formatare avansată' 
  }
];

/**
 * Modal pentru configurarea opțiunilor de export
 * Permite selecția formatului și configurarea parametrilor
 */
export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  onExport,
  exportState,
  transactionCount
}) => {
  const [format, setFormat] = useState<ExportFormat>('csv');
  const [filename, setFilename] = useState('');
  const [title, setTitle] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  const { getClasses } = useThemeEffects();

  // Închide modalul la apăsarea pe overlay
  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // Gestionează exportul
  const handleExport = () => {
    const options: Parameters<typeof onExport>[1] = {};
    
    if (filename.trim()) {
      options.filename = filename.trim();
    }
    
    if (title.trim()) {
      options.title = title.trim();
    }
    
    if (dateFrom && dateTo) {
      options.dateRange = { from: dateFrom, to: dateTo };
    }

    onExport(format, options);
  };

  // Generează numele implicit al fișierului
  const getDefaultFilename = () => {
    const today = new Date().toISOString().split('T')[0];
    return `tranzactii-${today}`;
  };

  // Returnează null dacă modalul nu este deschis
  if (!isOpen) return null;

  const overlayClasses = getClasses('modal-overlay');
  const modalClasses = getClasses('modal');
  const progressClasses = getClasses('progress-bar');
  const progressBarClasses = getClasses('progress-fill');

  return (
    <div 
      className={`${overlayClasses} fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50`}
      onClick={handleOverlayClick}
      data-testid="export-modal-overlay"
    >
      <div className={`${modalClasses} bg-white rounded-lg p-6 w-full max-w-md mx-4 relative shadow-lg`} data-testid="export-modal">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold text-gray-900">
            Export Tranzacții
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            data-testid="export-modal-close"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Progress Bar - afișat doar în timpul exportului */}
        {exportState.isExporting && (
          <div className="mb-6">
            <p className="text-sm text-gray-600 mb-2">
              {exportState.status || EXPORT_MESSAGES.IN_PROGRES.replace('{progress}', exportState.progress.toString())}
            </p>
            <div className={`${progressClasses} w-full bg-gray-200 rounded-full h-2 mb-4 shadow-sm`}>
              <div 
                className={`${progressBarClasses} bg-blue-600 h-2 rounded-full transition-all duration-300 bg-gradient-to-r from-blue-500 to-blue-600`}
                style={{ width: `${exportState.progress}%` }}
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {exportState.progress}% complet
            </p>
          </div>
        )}

        {/* Formă pentru configurarea exportului */}
        <div className="space-y-4">
          {/* Selecția formatului */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Format
            </label>
            <Select
              value={format}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFormat(e.target.value as ExportFormat)}
              options={EXPORT_FORMATS.map(fmt => ({
                value: fmt.value,
                label: fmt.label
              }))}
              placeholder="Selectează format"
              disabled={exportState.isExporting}
              dataTestId="export-format-select"
            />
            <p className="text-xs text-gray-500 mt-1">
              {EXPORT_FORMATS.find(fmt => fmt.value === format)?.description}
            </p>
          </div>

          {/* Numele fișierului */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nume fișier
            </label>
            <Input
              type="text"
              value={filename}
              onChange={(e) => setFilename(e.target.value)}
              placeholder={getDefaultFilename()}
              disabled={exportState.isExporting}
              dataTestId="export-filename-input"
            />
            <p className="text-xs text-gray-500 mt-1">
              Lăsați gol pentru nume automat
            </p>
          </div>

          {/* Titlul raportului */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Titlu raport
            </label>
            <Input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Raport Tranzacții"
              disabled={exportState.isExporting}
              dataTestId="export-title-input"
            />
          </div>

          {/* Intervalul de date (opțional) */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                De la data
              </label>
              <Input
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                disabled={exportState.isExporting}
                dataTestId="export-date-from"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Până la data
              </label>
              <Input
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                disabled={exportState.isExporting}
                dataTestId="export-date-to"
              />
            </div>
          </div>

          {/* Info despre tranzacțiile care vor fi exportate */}
          <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
            <p className="text-sm text-blue-800">
              Se vor exporta {transactionCount} tranzacții
            </p>
          </div>

          {/* Mesajul de eroare */}
          {exportState.error && (
            <div className="bg-red-50 border border-red-200 rounded-md p-3">
              <p className="text-sm text-red-800">
                {exportState.error}
              </p>
            </div>
          )}
        </div>

        {/* Footer cu butoane */}
        <div className="flex gap-3 mt-6 pt-4 border-t border-gray-200">
          <Button
            onClick={onClose}
            variant="secondary"
            size="md"
            disabled={exportState.isExporting}
            className="flex-1"
            dataTestId="export-modal-cancel"
          >
            {BUTTONS.CANCEL}
          </Button>
          <Button
            onClick={handleExport}
            variant="primary"
            size="md"
            disabled={exportState.isExporting || transactionCount === 0}
            className="flex-1"
            withShadow
            dataTestId="export-modal-confirm"
          >
            {exportState.isExporting ? 'Se exportă...' : BUTTONS.EXPORT}
          </Button>
        </div>
      </div>
    </div>
  );
}; 
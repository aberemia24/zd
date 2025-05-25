import React, { useState, useCallback, useEffect } from 'react';
import Button from '../../../primitives/Button/Button';
import Input from '../../../primitives/Input/Input';
import Textarea from '../../../primitives/Textarea/Textarea';
import Checkbox from '../../../primitives/Checkbox/Checkbox';
import Select from '../../../primitives/Select/Select';
import Badge from '../../../primitives/Badge/Badge';
import Spinner from '../../../primitives/Spinner/Spinner';
import { 
  transactionModalOverlay,
  transactionModalContent,
  transactionModalHeader,
  transactionModalTitle,
  transactionModalBody,
  transactionModalFooter,
  transactionModalCloseButton
} from '../../../../styles/cva/components/modal';
import { useBaseModalLogic, CellContext } from './hooks/useBaseModalLogic';
import { FrequencyType } from '@shared-constants';

// Cell selection interface
export interface CellSelection {
  category: string;
  subcategory?: string;
  day: number;
  month: number;
  year: number;
  currentAmount?: number;
}

// Bulk operation types
export type BulkOperationType = 'create' | 'edit' | 'delete' | 'copy';

// Bulk operation data
export interface BulkOperationData {
  operation: BulkOperationType;
  selections: CellSelection[];
  commonData?: {
    amount?: string;
    description?: string;
    recurring?: boolean;
    frequency?: FrequencyType;
  };
  deleteConfirmation?: boolean;
}

// Progress state pentru long operations
export interface OperationProgress {
  total: number;
  completed: number;
  failed: number;
  current?: string;
  isRunning: boolean;
}

// Bulk Operations Modal Props
export interface BulkOperationsModalProps {
  cellContext: CellContext;
  operation: BulkOperationType;
  selectedCells: CellSelection[];
  onSave: (data: BulkOperationData) => Promise<void>;
  onCancel: () => void;
}

// Bulk Operations Modal Component
export const BulkOperationsModal: React.FC<BulkOperationsModalProps> = ({
  cellContext,
  operation,
  selectedCells,
  onSave,
  onCancel
}) => {
  // Base modal logic integration
  const { form, validation, loading, calculations } = useBaseModalLogic(cellContext);
  
  // Local state pentru bulk operations
  const [activeTab, setActiveTab] = useState<'configure' | 'preview' | 'progress'>('configure');
  const [bulkData, setBulkData] = useState({
    applyToAll: true,
    preserveExisting: false,
    skipErrors: true
  });
  const [operationProgress, setOperationProgress] = useState<OperationProgress>({
    total: 0,
    completed: 0,
    failed: 0,
    isRunning: false
  });
  const [previewData, setPreviewData] = useState<any[]>([]);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);

  // Initialize based pe operation type
  useEffect(() => {
    if (operation === 'delete') {
      setActiveTab('configure');
      // Pentru delete nu avem nevoie de form data
    } else {
      // Pentru create/edit/copy, initialize cu defaults
      form.updateData({
        amount: '0.00',
        description: '',
        recurring: false
      });
    }
  }, [operation, form]);

  // Operation type options
  const operationLabels = {
    create: 'Crează Tranzacții Multiple',
    edit: 'Editează Tranzacții în Lot',
    delete: 'Șterge Tranzacții Selectate',
    copy: 'Copiază Tranzacții'
  };

  // Bulk options pentru different operations
  const bulkOptions = [
    { 
      key: 'applyToAll', 
      label: 'Aplică aceleași valori la toate selecțiile',
      description: 'Toate celulele vor avea aceleași date'
    },
    { 
      key: 'preserveExisting', 
      label: 'Păstrează valorile existente dacă există',
      description: 'Nu suprascrie tranzacțiile existente'
    },
    { 
      key: 'skipErrors', 
      label: 'Ignoră erorile și continuă',
      description: 'Continuă operația chiar dacă unele celule eșuează'
    }
  ];

  // Generate preview data
  const generatePreviewData = useCallback(() => {
    const preview = selectedCells.map((cell, index) => {
      const amount = form.data.amount ? Number(form.data.amount) : (cell.currentAmount || 0);
      const description = form.data.description || `Tranzacție ${index + 1}`;
      
      return {
        id: `preview-${index}`,
        cell: cell,
        data: {
          amount: amount,
          description: description,
          recurring: form.data.recurring,
          frequency: form.data.frequency
        },
        status: operation === 'delete' ? 'pending-delete' : 'pending-create',
        estimatedResult: operation === 'delete' ? 'deleted' : 'created'
      };
    });
    
    setPreviewData(preview);
  }, [selectedCells, form.data, operation]);

  // Update preview when form data changes
  useEffect(() => {
    if (activeTab === 'preview') {
      generatePreviewData();
    }
  }, [activeTab, generatePreviewData]);

  // Handle bulk operation execution
  const handleExecute = useCallback(async () => {
    if (operation === 'delete' && !showDeleteConfirmation) {
      setShowDeleteConfirmation(true);
      return;
    }

    // Validate pentru non-delete operations
    if (operation !== 'delete' && !form.validate()) {
      return;
    }

    // Setup progress tracking
    setOperationProgress({
      total: selectedCells.length,
      completed: 0,
      failed: 0,
      isRunning: true
    });
    setActiveTab('progress');
    loading.setIsLoading(true);
    
    try {
      const operationData: BulkOperationData = {
        operation: operation,
        selections: selectedCells,
        commonData: operation !== 'delete' ? {
          amount: form.data.amount,
          description: form.data.description,
          recurring: form.data.recurring,
          frequency: form.data.frequency as FrequencyType
        } : undefined,
        deleteConfirmation: operation === 'delete'
      };

      await onSave(operationData);
      
      // Success - modal se închide automat
    } catch (error) {
      validation.setErrors({
        general: `Eroare la executarea operației ${operation}. Încercați din nou.`
      });
      setActiveTab('configure');
      
      // Reset progress
      setOperationProgress(prev => ({
        ...prev,
        isRunning: false
      }));
    } finally {
      loading.setIsLoading(false);
      setShowDeleteConfirmation(false);
    }
  }, [operation, form, validation, loading, selectedCells, onSave, showDeleteConfirmation]);

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter' && e.ctrlKey) {
        e.preventDefault();
        handleExecute();
      }
      if (e.key === 'Escape') {
        e.preventDefault();
        if (showDeleteConfirmation) {
          setShowDeleteConfirmation(false);
        } else {
          onCancel();
        }
      }
      if (e.key === 'p' && e.ctrlKey) {
        e.preventDefault();
        if (activeTab !== 'progress') {
          setActiveTab(activeTab === 'configure' ? 'preview' : 'configure');
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleExecute, onCancel, activeTab, showDeleteConfirmation]);

  // Calculate total financial impact
  const totalFinancialImpact = form.data.amount && operation !== 'delete'
    ? calculations.formatMoney(Number(form.data.amount) * selectedCells.length)
    : null;

  // Format cell display
  const formatCellDisplay = (cell: CellSelection): string => {
    return `${cell.category}${cell.subcategory ? ` → ${cell.subcategory}` : ''} (${cell.day}/${cell.month}/${cell.year})`;
  };

  return (
    <div className={transactionModalOverlay({ blur: true })}>
      <div className={transactionModalContent({ mode: 'bulk-operations' })}>
        {/* Modal Header */}
        <div className={transactionModalHeader({ variant: 'primary' })}>
          <div>
            <h2 className={transactionModalTitle({ variant: 'primary' })}>
              {operationLabels[operation]}
            </h2>
            <div className="text-sm text-blue-700 mt-1">
              {selectedCells.length} celule selectate
            </div>
          </div>
          <button
            className={transactionModalCloseButton()}
            onClick={onCancel}
            data-testid="bulk-operations-modal-close"
          >
            ✕
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="px-6 py-2 border-b border-blue-200 bg-blue-50">
          <div className="flex space-x-4">
            <button
              className={`px-3 py-1 text-sm font-medium transition-colors ${
                activeTab === 'configure'
                  ? 'text-blue-900 border-b-2 border-blue-600'
                  : 'text-blue-600 hover:text-blue-800'
              }`}
              onClick={() => setActiveTab('configure')}
              data-testid="configure-tab"
              disabled={operationProgress.isRunning}
            >
              Configurează
            </button>
            {operation !== 'delete' && (
              <button
                className={`px-3 py-1 text-sm font-medium transition-colors ${
                  activeTab === 'preview'
                    ? 'text-blue-900 border-b-2 border-blue-600'
                    : 'text-blue-600 hover:text-blue-800'
                }`}
                onClick={() => setActiveTab('preview')}
                data-testid="preview-tab"
                disabled={operationProgress.isRunning}
              >
                Preview ({selectedCells.length})
              </button>
            )}
            {operationProgress.isRunning && (
              <button
                className="px-3 py-1 text-sm font-medium text-blue-900 border-b-2 border-blue-600"
                data-testid="progress-tab"
              >
                Progres
              </button>
            )}
          </div>
        </div>

        {/* Modal Body cu Tab Content */}
        <div className={transactionModalBody()}>
          {activeTab === 'configure' && (
            <>
              {/* Selected Cells Summary */}
              <div className="text-sm text-slate-600 bg-blue-50 p-3 rounded-md">
                <strong>Operație:</strong> {operationLabels[operation]}
                <br />
                <strong>Celule selectate:</strong> {selectedCells.length}
                <br />
                <div className="mt-2 max-h-24 overflow-y-auto">
                  {selectedCells.slice(0, 3).map((cell, index) => (
                    <div key={index} className="text-xs">
                      • {formatCellDisplay(cell)}
                    </div>
                  ))}
                  {selectedCells.length > 3 && (
                    <div className="text-xs text-blue-600">
                      + încă {selectedCells.length - 3} celule...
                    </div>
                  )}
                </div>
              </div>

              {/* Operation-specific configuration */}
              {operation !== 'delete' && (
                <>
                  {/* Amount Input */}
                  <div>
                    <Input
                      label="Sumă (RON)"
                      type="number"
                      step="0.01"
                      value={form.data.amount}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                        form.updateData({ amount: e.target.value })
                      }
                      error={validation.errors.amount}
                      data-testid="bulk-amount-input"
                      placeholder="0.00"
                    />
                  </div>

                  {/* Description Input */}
                  <div>
                    <Textarea
                      label="Descriere (opțional)"
                      value={form.data.description}
                      onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => 
                        form.updateData({ description: e.target.value })
                      }
                      error={validation.errors.description}
                      data-testid="bulk-description-input"
                      placeholder="Descriere pentru toate tranzacțiile..."
                      rows={2}
                    />
                  </div>

                  {/* Recurring Options */}
                  <div>
                    <Checkbox
                      label="Tranzacții recurente"
                      checked={form.data.recurring}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        const checked = e.target.checked;
                        form.updateData({ recurring: checked });
                        if (!checked) {
                          form.updateData({ frequency: undefined });
                        }
                      }}
                      data-testid="bulk-recurring-checkbox"
                    />
                  </div>

                  {/* Frequency Selection */}
                  {form.data.recurring && (
                    <div className="pl-6 border-l-2 border-blue-200">
                      <Select
                        label="Frecvență"
                        value={form.data.frequency || ''}
                        onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                          form.updateData({ frequency: e.target.value })
                        }
                        options={[
                          { value: 'DAILY', label: 'Zilnic' },
                          { value: 'WEEKLY', label: 'Săptămânal' },
                          { value: 'MONTHLY', label: 'Lunar' },
                          { value: 'YEARLY', label: 'Anual' }
                        ]}
                        error={validation.errors.frequency}
                        data-testid="bulk-frequency-select"
                        placeholder="Selectează frecvența"
                      />
                    </div>
                  )}

                  {/* Financial Impact */}
                  {totalFinancialImpact && (
                    <div className="bg-slate-50 p-4 rounded-md text-sm space-y-2">
                      <h4 className="font-semibold text-slate-800">Impact Financiar Total</h4>
                      <div className="flex justify-between">
                        <span>Sumă per tranzacție:</span>
                        <span className="font-medium">{calculations.formatMoney(Number(form.data.amount))} RON</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Număr de tranzacții:</span>
                        <span className="font-medium">{selectedCells.length}</span>
                      </div>
                      <div className="flex justify-between border-t pt-2">
                        <span className="font-semibold">Total impact:</span>
                        <span className="font-semibold text-blue-600">{totalFinancialImpact} RON</span>
                      </div>
                    </div>
                  )}
                </>
              )}

              {/* Bulk Options */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-3">
                  Opțiuni pentru Operațiile în Lot
                </label>
                <div className="space-y-3">
                  {bulkOptions.map((option) => (
                    <div key={option.key} className="flex items-start space-x-3">
                      <Checkbox
                        checked={(bulkData as any)[option.key]}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                          setBulkData(prev => ({ ...prev, [option.key]: e.target.checked }))
                        }
                        data-testid={`bulk-option-${option.key}`}
                      />
                      <div className="flex-1">
                        <div className="text-sm font-medium text-slate-700">
                          {option.label}
                        </div>
                        <div className="text-xs text-slate-500">
                          {option.description}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* General Error */}
              {validation.errors.general && (
                <div className="text-red-600 text-sm bg-red-50 p-3 rounded-md">
                  {validation.errors.general}
                </div>
              )}
            </>
          )}

          {activeTab === 'preview' && operation !== 'delete' && (
            <div className="space-y-4">
              <h4 className="font-semibold text-slate-800">
                Preview Operație: {selectedCells.length} tranzacții
              </h4>
              
              {previewData.length === 0 ? (
                <div className="text-center py-8 text-slate-500">
                  Nu există date pentru preview. Configurați operația în primul tab.
                </div>
              ) : (
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {previewData.map((item, index) => (
                    <div 
                      key={item.id}
                      className="bg-slate-50 p-3 rounded-md border-l-4 border-blue-200"
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="font-medium text-slate-800">
                            {formatCellDisplay(item.cell)}
                          </div>
                          <div className="text-sm text-slate-600 mt-1">
                            Sumă: {calculations.formatMoney(item.data.amount)} RON
                            {item.data.description && ` • ${item.data.description}`}
                            {item.data.recurring && ` • Recurent (${item.data.frequency})`}
                          </div>
                        </div>
                        <Badge 
                          variant="primary"
                          className="text-xs"
                        >
                          {item.estimatedResult === 'created' ? 'Creat' : 'Actualizat'}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'progress' && operationProgress.isRunning && (
            <div className="space-y-6">
              <div className="text-center">
                <Spinner size="lg" className="mx-auto mb-4" />
                <h4 className="font-semibold text-slate-800 mb-2">
                  Executare Operație în Progres...
                </h4>
                <p className="text-slate-600">
                  {operationProgress.current || 'Procesare tranzacții...'}
                </p>
              </div>
              
              {/* Progress Bar */}
              <div className="w-full bg-slate-200 rounded-full h-3">
                <div 
                  className="bg-blue-600 h-3 rounded-full transition-all duration-300"
                  style={{ 
                    width: `${(operationProgress.completed / operationProgress.total) * 100}%` 
                  }}
                />
              </div>
              
              {/* Progress Stats */}
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-slate-800">
                    {operationProgress.total}
                  </div>
                  <div className="text-sm text-slate-600">Total</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-emerald-600">
                    {operationProgress.completed}
                  </div>
                  <div className="text-sm text-slate-600">Completate</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-red-600">
                    {operationProgress.failed}
                  </div>
                  <div className="text-sm text-slate-600">Eșuate</div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Delete Confirmation Modal */}
        {showDeleteConfirmation && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-10">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-md">
              <h3 className="text-lg font-semibold text-red-800 mb-4">
                Confirmă Ștergerea în Lot
              </h3>
              <p className="text-slate-600 mb-6">
                Ești sigur că vrei să ștergi <strong>{selectedCells.length} tranzacții</strong>? 
                Această acțiune nu poate fi anulată.
              </p>
              <div className="flex justify-end space-x-3">
                <Button
                  variant="secondary"
                  onClick={() => setShowDeleteConfirmation(false)}
                  disabled={loading.isLoading}
                >
                  Anulează
                </Button>
                <Button
                  variant="danger"
                  onClick={handleExecute}
                  disabled={loading.isLoading}
                >
                  {loading.isLoading ? 'Șterge...' : 'Șterge Toate'}
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Modal Footer */}
        <div className={transactionModalFooter()}>
          <div className="flex justify-between w-full">
            <div>
              {operation === 'delete' && !operationProgress.isRunning && (
                <Button
                  variant="danger"
                  onClick={() => setShowDeleteConfirmation(true)}
                  disabled={loading.isLoading}
                  data-testid="bulk-delete-button"
                >
                  Șterge Toate ({selectedCells.length})
                </Button>
              )}
            </div>
            <div className="flex space-x-3">
              <Button
                variant="secondary"
                onClick={onCancel}
                disabled={loading.isLoading || operationProgress.isRunning}
                data-testid="bulk-operations-cancel-button"
              >
                Anulează
              </Button>
              {operation !== 'delete' && !operationProgress.isRunning && (
                <Button
                  variant="primary"
                  onClick={handleExecute}
                  disabled={loading.isLoading || !form.data.amount}
                  data-testid="bulk-operations-execute-button"
                >
                  {loading.isLoading ? 'Execută...' : `Execută ${operationLabels[operation]} (Ctrl+Enter)`}
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}; 
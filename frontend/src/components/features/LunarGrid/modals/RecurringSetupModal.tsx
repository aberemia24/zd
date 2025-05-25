import React, { useState, useCallback, useEffect } from 'react';
import Button from '../../../primitives/Button/Button';
import Input from '../../../primitives/Input/Input';
import Textarea from '../../../primitives/Textarea/Textarea';
import Select from '../../../primitives/Select/Select';
import Badge from '../../../primitives/Badge/Badge';
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

// Extending ValidationErrors pentru recurring fields
interface ExtendedValidationErrors {
  amount?: string;
  description?: string;
  frequency?: string;
  endDate?: string;
  general?: string;
  templateName?: string;
  interval?: string;
  endCount?: string;
}

// Recurring template interface
export interface RecurringTemplate {
  id?: string;
  name: string;
  amount: number;
  description: string;
  frequency: FrequencyType;
  interval: number;
  endType: 'never' | 'date' | 'count';
  endDate?: string;
  endCount?: number;
  conflictStrategy: 'skip' | 'adjust' | 'create';
  isActive: boolean;
  category: string;
  subcategory?: string;
  type: 'income' | 'expense';
}

// Generated transaction preview
export interface GeneratedTransaction {
  date: string;
  amount: number;
  description: string;
  status: 'scheduled' | 'conflict' | 'adjusted';
}

// Recurring Setup Modal Props
export interface RecurringSetupModalProps {
  cellContext: CellContext;
  existingTemplate?: RecurringTemplate;
  prefillAmount?: string;
  onSave: (template: RecurringTemplate) => Promise<void>;
  onCancel: () => void;
}

// Recurring Setup Modal Component
export const RecurringSetupModal: React.FC<RecurringSetupModalProps> = ({
  cellContext,
  existingTemplate,
  prefillAmount = '',
  onSave,
  onCancel
}) => {
    // Base modal logic integration  const { form, validation, loading, calculations } = useBaseModalLogic(cellContext);
  
  // Extended validation state
  const [errors, setErrors] = useState<ExtendedValidationErrors>({});
  
  // Local state pentru recurring-specific logic
  const [templateName, setTemplateName] = useState('');
  const [interval, setInterval] = useState(1);
  const [endType, setEndType] = useState<'never' | 'date' | 'count'>('never');
  const [endDate, setEndDate] = useState('');
  const [endCount, setEndCount] = useState(12);
  const [conflictStrategy, setConflictStrategy] = useState<'skip' | 'adjust' | 'create'>('skip');
  const [showPreview, setShowPreview] = useState(false);
  const [generatedTransactions, setGeneratedTransactions] = useState<GeneratedTransaction[]>([]);
  
  // Initialize form cu existing template sau defaults
  useEffect(() => {
    if (existingTemplate) {
      form.updateData({
        amount: existingTemplate.amount.toString(),
        description: existingTemplate.description,
        recurring: true,
        frequency: existingTemplate.frequency
      });
      setTemplateName(existingTemplate.name);
      setInterval(existingTemplate.interval);
      setEndType(existingTemplate.endType);
      setEndDate(existingTemplate.endDate || '');
      setEndCount(existingTemplate.endCount || 12);
      setConflictStrategy(existingTemplate.conflictStrategy);
    } else {
      // Defaults pentru new template
      if (prefillAmount) {
        form.updateData({ amount: prefillAmount });
      }
      form.updateData({ recurring: true, frequency: 'MONTHLY' });
      setTemplateName(`${cellContext.category} - Recurent`);
    }
  }, [existingTemplate, prefillAmount, form, cellContext.category]);

  // Frequency options cu custom interval support
  const frequencyOptions = [
    { value: 'DAILY', label: 'Zilnic' },
    { value: 'WEEKLY', label: 'Săptămânal' },
    { value: 'MONTHLY', label: 'Lunar' },
    { value: 'YEARLY', label: 'Anual' }
  ];

  // End type options
  const endTypeOptions = [
    { value: 'never', label: 'Nu se termină niciodată' },
    { value: 'date', label: 'Până la o dată specifică' },
    { value: 'count', label: 'Număr fix de tranzacții' }
  ];

  // Conflict strategy options
  const conflictStrategyOptions = [
    { value: 'skip', label: 'Omite tranzacția' },
    { value: 'adjust', label: 'Ajustează data' },
    { value: 'create', label: 'Creează oricum' }
  ];

  // Generate preview transactions
  const generatePreviewTransactions = useCallback(() => {
    if (!form.data.amount || !form.data.frequency) return [];

    const transactions: GeneratedTransaction[] = [];
    const startDate = new Date(cellContext.year, cellContext.month - 1, cellContext.day);
    const amount = Number(form.data.amount);
    
    let currentDate = new Date(startDate);
    let count = 0;
    const maxPreview = endType === 'count' ? Math.min(endCount, 12) : 12;

    while (count < maxPreview) {
      // Check pentru end conditions
      if (endType === 'date' && endDate) {
        const endDateTime = new Date(endDate);
        if (currentDate > endDateTime) break;
      }
      if (endType === 'count' && count >= endCount) break;

      // Generate transaction
      const transaction: GeneratedTransaction = {
        date: currentDate.toISOString().split('T')[0],
        amount: amount,
        description: form.data.description || `${templateName} - ${count + 1}`,
        status: 'scheduled'
      };

      // Check pentru conflicts (simplified logic)
      if (Math.random() > 0.8) { // 20% conflict chance pentru demo
        transaction.status = conflictStrategy === 'skip' ? 'conflict' 
                          : conflictStrategy === 'adjust' ? 'adjusted' 
                          : 'scheduled';
      }

      transactions.push(transaction);
      
      // Calculate next date based pe frequency și interval
      switch (form.data.frequency) {
        case 'DAILY':
          currentDate.setDate(currentDate.getDate() + interval);
          break;
        case 'WEEKLY':
          currentDate.setDate(currentDate.getDate() + (7 * interval));
          break;
        case 'MONTHLY':
          currentDate.setMonth(currentDate.getMonth() + interval);
          break;
        case 'YEARLY':
          currentDate.setFullYear(currentDate.getFullYear() + interval);
          break;
      }
      
      count++;
    }

    return transactions;
  }, [form.data.amount, form.data.frequency, form.data.description, templateName, 
      cellContext, interval, endType, endDate, endCount, conflictStrategy]);

  // Update preview when parameters change
  useEffect(() => {
    if (showPreview) {
      const transactions = generatePreviewTransactions();
      setGeneratedTransactions(transactions);
    }
  }, [showPreview, generatePreviewTransactions]);

  // Validate recurring setup
  const validateRecurringSetup = useCallback((): boolean => {
    const newErrors: ExtendedValidationErrors = {};

    if (!templateName.trim()) {
      newErrors.templateName = 'Numele template-ului este obligatoriu';
    }

    if (interval < 1 || interval > 365) {
      newErrors.interval = 'Intervalul trebuie să fie între 1 și 365';
    }

    if (endType === 'date' && endDate) {
      const endDateTime = new Date(endDate);
      const startDate = new Date(cellContext.year, cellContext.month - 1, cellContext.day);
      if (endDateTime <= startDate) {
        newErrors.endDate = 'Data de sfârșit trebuie să fie după data de început';
      }
    }

    if (endType === 'count' && (endCount < 1 || endCount > 1000)) {
      newErrors.endCount = 'Numărul de tranzacții trebuie să fie între 1 și 1000';
    }

    setErrors({ ...errors, ...newErrors });
    return Object.keys(newErrors).length === 0;
  }, [templateName, interval, endType, endDate, endCount, cellContext, errors]);

  // Handle save action
  const handleSave = useCallback(async () => {
    if (!form.validate() || !validateRecurringSetup()) {
      return;
    }

    loading.setIsLoading(true);
    
    try {
      const template: RecurringTemplate = {
        id: existingTemplate?.id,
        name: templateName,
        amount: Number(form.data.amount),
        description: form.data.description,
        frequency: form.data.frequency as FrequencyType,
        interval: interval,
        endType: endType,
        endDate: endType === 'date' ? endDate : undefined,
        endCount: endType === 'count' ? endCount : undefined,
        conflictStrategy: conflictStrategy,
        isActive: true,
        category: cellContext.category,
        subcategory: cellContext.subcategory,
        type: 'expense' // Default, could be determined from amount sign
      };

      await onSave(template);
      
      // Modal se închide automat după save success
    } catch (error) {
      setErrors({
        ...errors,
        general: 'Eroare la salvarea template-ului recurent. Încercați din nou.'
      });
    } finally {
      loading.setIsLoading(false);
    }
  }, [form, validateRecurringSetup, loading, onSave, templateName, 
      interval, endType, endDate, endCount, conflictStrategy, cellContext, existingTemplate, errors]);

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter' && e.ctrlKey) {
        e.preventDefault();
        handleSave();
      }
      if (e.key === 'Escape') {
        e.preventDefault();
        onCancel();
      }
      if (e.key === 'p' && e.ctrlKey) {
        e.preventDefault();
        setShowPreview(!showPreview);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleSave, onCancel, showPreview]);

  // Calculate financial impact preview
  const totalFinancialImpact = form.data.amount && endType === 'count'
    ? calculations.formatMoney(Number(form.data.amount) * endCount)
    : null;

  // Format frequency display
  const formatFrequencyDisplay = (freq: string, int: number): string => {
    const freqMap: Record<string, string> = {
      'DAILY': int === 1 ? 'zilnic' : `la ${int} zile`,
      'WEEKLY': int === 1 ? 'săptămânal' : `la ${int} săptămâni`,
      'MONTHLY': int === 1 ? 'lunar' : `la ${int} luni`,
      'YEARLY': int === 1 ? 'anual' : `la ${int} ani`
    };
    return freqMap[freq] || freq;
  };

  return (
    <div className={transactionModalOverlay({ blur: true })}>
      <div className={transactionModalContent({ mode: 'recurring-setup' })}>
        {/* Modal Header */}
        <div className={transactionModalHeader({ variant: 'primary' })}>
          <h2 className={transactionModalTitle({ variant: 'primary' })}>
            {existingTemplate ? 'Editează Template Recurent' : 'Configurează Tranzacție Recurentă'}
          </h2>
          <button
            className={transactionModalCloseButton()}
            onClick={onCancel}
            data-testid="recurring-setup-modal-close"
          >
            ✕
          </button>
        </div>

        {/* Modal Body */}
        <div className={transactionModalBody()}>
          {/* Context Info */}
          <div className="text-sm text-slate-600 bg-blue-50 p-3 rounded-md">
            <strong>{cellContext.category}</strong>
            {cellContext.subcategory && ` → ${cellContext.subcategory}`}
            <br />
            <span>
              Start: {cellContext.day}/{cellContext.month}/{cellContext.year}
            </span>
          </div>

          {/* Template Name */}
          <div>
            <Input
              label="Nume Template"
              value={templateName}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                setTemplateName(e.target.value)
              }
              error={errors.templateName}
              data-testid="template-name-input"
              placeholder="ex: Salariu lunar, Chirie, etc."
            />
          </div>

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
              error={form.validation?.errors?.amount}
              data-testid="recurring-amount-input"
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
              error={form.validation?.errors?.description}
              data-testid="recurring-description-input"
              placeholder="Descriere pentru toate tranzacțiile generate..."
              rows={2}
            />
          </div>

          {/* Frequency Configuration */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Select
                label="Frecvență"
                value={form.data.frequency || ''}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                  form.updateData({ frequency: e.target.value })
                }
                options={frequencyOptions}
                error={form.validation?.errors?.frequency}
                data-testid="recurring-frequency-select"
                placeholder="Selectează frecvența"
              />
            </div>
            <div>
              <Input
                label="Interval"
                type="number"
                min="1"
                max="365"
                value={interval.toString()}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                  setInterval(Number(e.target.value))
                }
                error={errors.interval}
                data-testid="recurring-interval-input"
                placeholder="1"
              />
            </div>
          </div>

          {/* Frequency Preview */}
          {form.data.frequency && (
            <div className="text-sm text-blue-700 bg-blue-50 p-2 rounded">
              Se repetă: <strong>{formatFrequencyDisplay(form.data.frequency, interval)}</strong>
            </div>
          )}

          {/* End Configuration */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Când se termină?
            </label>
            <div className="space-y-3">
              {endTypeOptions.map((option) => (
                <label key={option.value} className="flex items-center">
                  <input
                    type="radio"
                    name="endType"
                    value={option.value}
                    checked={endType === option.value}
                    onChange={(e) => setEndType(e.target.value as any)}
                    className="mr-2"
                    data-testid={`end-type-${option.value}`}
                  />
                  <span className="text-sm text-slate-700">{option.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* End Date Input */}
          {endType === 'date' && (
            <div>
              <Input
                label="Data de sfârșit"
                type="date"
                value={endDate}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                  setEndDate(e.target.value)
                }
                error={errors.endDate}
                data-testid="recurring-end-date-input"
              />
            </div>
          )}

          {/* End Count Input */}
          {endType === 'count' && (
            <div>
              <Input
                label="Număr de tranzacții"
                type="number"
                min="1"
                max="1000"
                value={endCount.toString()}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                  setEndCount(Number(e.target.value))
                }
                error={errors.endCount}
                data-testid="recurring-end-count-input"
                placeholder="12"
              />
            </div>
          )}

          {/* Conflict Strategy */}
          <div>
            <Select
              label="Strategie pentru conflicte"
              value={conflictStrategy}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                setConflictStrategy(e.target.value as any)
              }
              options={conflictStrategyOptions}
              data-testid="conflict-strategy-select"
            />
            <div className="text-xs text-slate-500 mt-1">
              Ce se întâmplă când data calculată coincide cu o tranzacție existentă
            </div>
          </div>

          {/* Financial Summary */}
          {totalFinancialImpact && (
            <div className="bg-slate-50 p-4 rounded-md text-sm space-y-2">
              <h4 className="font-semibold text-slate-800">Rezumat Financiar</h4>
              <div className="flex justify-between">
                <span>Sumă per tranzacție:</span>
                <span className="font-medium">{calculations.formatMoney(Number(form.data.amount))} RON</span>
              </div>
              <div className="flex justify-between">
                <span>Număr de tranzacții:</span>
                <span className="font-medium">{endCount}</span>
              </div>
              <div className="flex justify-between border-t pt-2">
                <span className="font-semibold">Total impact:</span>
                <span className="font-semibold text-blue-600">{totalFinancialImpact} RON</span>
              </div>
            </div>
          )}

          {/* Preview Toggle */}
          <div>
            <Button
              variant="secondary"
              onClick={() => setShowPreview(!showPreview)}
              data-testid="toggle-preview-button"
              disabled={!form.data.amount || !form.data.frequency}
            >
              {showPreview ? 'Ascunde Preview' : 'Afișează Preview (Ctrl+P)'}
            </Button>
          </div>

          {/* Generated Transactions Preview */}
          {showPreview && (
            <div className="bg-slate-50 p-4 rounded-md">
              <h4 className="font-semibold text-slate-800 mb-3">
                Preview Tranzacții Generate (primele {Math.min(generatedTransactions.length, 12)})
              </h4>
              {generatedTransactions.length === 0 ? (
                <div className="text-center py-4 text-slate-500">
                  Nu se pot genera tranzacții cu parametrii actuali.
                </div>
              ) : (
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {generatedTransactions.map((transaction, index) => (
                    <div 
                      key={index}
                      className="flex justify-between items-center bg-white p-2 rounded text-sm"
                    >
                      <div className="flex-1">
                        <div className="font-medium">
                          {new Date(transaction.date).toLocaleDateString('ro-RO')}
                        </div>
                        <div className="text-slate-600 text-xs truncate">
                          {transaction.description}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="font-medium">
                          {calculations.formatMoney(transaction.amount)} RON
                        </span>
                        <Badge 
                          variant={
                            transaction.status === 'scheduled' ? 'secondary' :
                            transaction.status === 'conflict' ? 'warning' :
                            'primary'
                          }
                          className="text-xs"
                        >
                          {transaction.status === 'scheduled' ? 'OK' :
                           transaction.status === 'conflict' ? 'Conflict' :
                           'Ajustat'}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* General Error */}
          {errors.general && (
            <div className="text-red-600 text-sm bg-red-50 p-3 rounded-md">
              {errors.general}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className={transactionModalFooter()}>
          <Button
            variant="secondary"
            onClick={onCancel}
            disabled={loading.isLoading}
            data-testid="recurring-setup-cancel-button"
          >
            Anulează
          </Button>
          <Button
            variant="primary"
            onClick={handleSave}
            disabled={loading.isLoading || !form.data.amount || !templateName.trim()}
            data-testid="recurring-setup-save-button"
          >
            {loading.isLoading ? 'Salvează...' : 'Creează Template (Ctrl+Enter)'}
          </Button>
        </div>
      </div>
    </div>
  );
}; 
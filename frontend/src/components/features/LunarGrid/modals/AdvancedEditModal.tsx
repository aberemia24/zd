import React, { useState, useCallback, useEffect } from 'react';
import Button from '../../../primitives/Button/Button';
import Input from '../../../primitives/Input/Input';
import Textarea from '../../../primitives/Textarea/Textarea';
import Checkbox from '../../../primitives/Checkbox/Checkbox';
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

// Transaction interface pentru editing
export interface Transaction {
  id: string;
  amount: number;
  description: string;
  type: 'income' | 'expense';
  date: string;
  category: string;
  subcategory?: string;
  recurring: boolean;
  frequency?: FrequencyType;
  createdAt: string;
  updatedAt: string;
}

// Transaction history entry
export interface TransactionHistoryEntry {
  id: string;
  field: string;
  oldValue: any;
  newValue: any;
  timestamp: string;
  userId?: string;
}

// Advanced Edit Modal Props
export interface AdvancedEditModalProps {
  cellContext: CellContext;
  transaction: Transaction;
  showHistory?: boolean;
  onSave: (data: {
    id: string;
    amount: string;
    description: string;
    type: 'income' | 'expense';
    recurring: boolean;
    frequency?: FrequencyType;
    category?: string;
    subcategory?: string;
  }) => Promise<void>;
  onDelete?: (transactionId: string) => Promise<void>;
  onCancel: () => void;
}

// Advanced Edit Modal Component
export const AdvancedEditModal: React.FC<AdvancedEditModalProps> = ({
  cellContext,
  transaction,
  showHistory = true,
  onSave,
  onDelete,
  onCancel
}) => {
  // Base modal logic integration
  const { form, validation, loading, calculations } = useBaseModalLogic(cellContext);
  
  // Local state pentru advanced features
  const [activeTab, setActiveTab] = useState<'edit' | 'history'>('edit');
  const [transactionHistory, setTransactionHistory] = useState<TransactionHistoryEntry[]>([]);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  
  // Initialize form cu transaction data doar la primul render
  useEffect(() => {
    if (transaction && !form.data.amount) {
      form.updateData({
        amount: transaction.amount.toString(),
        description: transaction.description,
        recurring: transaction.recurring,
        frequency: transaction.frequency
      });
    }
  }, [transaction]); // Eliminat form din dependințe pentru a preveni bucla infinită

  // Mock transaction history (în realitate ar veni din API)
  useEffect(() => {
    const mockHistory: TransactionHistoryEntry[] = [
      {
        id: '1',
        field: 'amount',
        oldValue: 100,
        newValue: transaction.amount,
        timestamp: new Date(Date.now() - 86400000).toISOString(),
        userId: 'user-1'
      },
      {
        id: '2',
        field: 'description',
        oldValue: 'Old description',
        newValue: transaction.description,
        timestamp: new Date(Date.now() - 172800000).toISOString(),
        userId: 'user-1'
      }
    ];
    setTransactionHistory(mockHistory);
  }, [transaction]);

  // Handle save action cu advanced validation
  const handleSave = useCallback(async () => {
    if (!form.validate()) {
      return;
    }

    loading.setIsLoading(true);
    
    try {
      await onSave({
        id: transaction.id,
        amount: form.data.amount,
        description: form.data.description,
        type: transaction.type,
        recurring: form.data.recurring,
        frequency: form.data.frequency as FrequencyType,
        category: cellContext.category,
        subcategory: cellContext.subcategory
      });
      
      // Modal se închide automat după save success
    } catch (error) {
      validation.setErrors({
        general: 'Eroare la actualizarea tranzacției. Încercați din nou.'
      });
    } finally {
      loading.setIsLoading(false);
    }
  }, [form, loading, validation, onSave, transaction.id, transaction.type, cellContext]);

  // Handle delete action cu confirmation
  const handleDelete = useCallback(async () => {
    if (!onDelete) return;
    
    loading.setIsLoading(true);
    
    try {
      await onDelete(transaction.id);
      // Modal se închide automat după delete success
    } catch (error) {
      validation.setErrors({
        general: 'Eroare la ștergerea tranzacției. Încercați din nou.'
      });
      setShowDeleteConfirm(false);
    } finally {
      loading.setIsLoading(false);
    }
  }, [onDelete, transaction.id, loading, validation]);

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter' && e.ctrlKey) {
        e.preventDefault();
        handleSave();
      }
      if (e.key === 'Escape') {
        e.preventDefault();
        if (showDeleteConfirm) {
          setShowDeleteConfirm(false);
        } else {
          onCancel();
        }
      }
      if (e.key === 'Delete' && e.ctrlKey && onDelete) {
        e.preventDefault();
        setShowDeleteConfirm(true);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleSave, onCancel, showDeleteConfirm, onDelete]);

  // Calculate financial impact pentru before/after comparison
  const originalImpact = calculations.calculateFinancialImpact(transaction.amount);
  const newImpact = form.data.amount 
    ? calculations.calculateFinancialImpact(Number(form.data.amount))
    : null;

  // Format transaction history entries
  const formatHistoryValue = (value: any): string => {
    if (typeof value === 'number') {
      return calculations.formatMoney(value) + ' RON';
    }
    return String(value);
  };

  // Format timestamp pentru history
  const formatTimestamp = (timestamp: string): string => {
    return new Intl.DateTimeFormat('ro-RO', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(timestamp));
  };

  // Type options pentru transaction
  const typeOptions = [
    { value: 'income', label: 'Venit' },
    { value: 'expense', label: 'Cheltuială' }
  ];

  // Frequency options pentru recurring
  const frequencyOptions = [
    { value: 'DAILY', label: 'Zilnic' },
    { value: 'WEEKLY', label: 'Săptămânal' },
    { value: 'MONTHLY', label: 'Lunar' },
    { value: 'YEARLY', label: 'Anual' }
  ];

  return (
    <div className={transactionModalOverlay({ blur: true })}>
      <div className={transactionModalContent({ mode: 'advanced-edit' })}>
        {/* Modal Header cu Transaction Info */}
        <div className={transactionModalHeader({ variant: 'primary' })}>
          <div>
            <h2 className={transactionModalTitle({ variant: 'primary' })}>
              Editează Tranzacția
            </h2>
            <div className="text-sm text-blue-700 mt-1">
              ID: {transaction.id} • Creată: {formatTimestamp(transaction.createdAt)}
            </div>
          </div>
          <button
            className={transactionModalCloseButton()}
            onClick={onCancel}
            data-testid="advanced-edit-modal-close"
          >
            ✕
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="px-6 py-2 border-b border-blue-200 bg-blue-50">
          <div className="flex space-x-4">
            <button
              className={`px-3 py-1 text-sm font-medium transition-colors ${
                activeTab === 'edit'
                  ? 'text-blue-900 border-b-2 border-blue-600'
                  : 'text-blue-600 hover:text-blue-800'
              }`}
              onClick={() => setActiveTab('edit')}
              data-testid="edit-tab"
            >
              Editează
            </button>
            {showHistory && (
              <button
                className={`px-3 py-1 text-sm font-medium transition-colors ${
                  activeTab === 'history'
                    ? 'text-blue-900 border-b-2 border-blue-600'
                    : 'text-blue-600 hover:text-blue-800'
                }`}
                onClick={() => setActiveTab('history')}
                data-testid="history-tab"
              >
                Istoric ({transactionHistory.length})
              </button>
            )}
          </div>
        </div>

        {/* Modal Body cu Tab Content */}
        <div className={transactionModalBody()}>
          {activeTab === 'edit' && (
            <>
              {/* Context Info */}
              <div className="text-sm text-slate-600 bg-blue-50 p-3 rounded-md">
                <strong>{cellContext.category}</strong>
                {cellContext.subcategory && ` → ${cellContext.subcategory}`}
                <br />
                <span>
                  {cellContext.day}/{cellContext.month}/{cellContext.year}
                </span>
                <Badge 
                  variant={transaction.type === 'income' ? 'success' : 'error'}
                  className="ml-2"
                >
                  {transaction.type === 'income' ? 'Venit' : 'Cheltuială'}
                </Badge>
              </div>

              {/* Amount Input */}
              <div>
                              <Input                label="Sumă (RON)"                type="text"                pattern="[0-9]+([,.][0-9]{1,2})?"
                  value={form.data.amount}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                    form.updateData({ amount: e.target.value })
                  }
                  error={validation.errors.amount}
                  data-testid="advanced-edit-amount-input"
                  placeholder="0.00"
                />
              </div>

              {/* Description Input */}
              <div>
                <Textarea
                  label="Descriere"
                  value={form.data.description}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => 
                    form.updateData({ description: e.target.value })
                  }
                  error={validation.errors.description}
                  data-testid="advanced-edit-description-input"
                  placeholder="Detalii despre tranzacție..."
                  rows={3}
                />
              </div>

              {/* Recurring Configuration */}
              <div>
                <Checkbox
                  label="Tranzacție recurentă"
                  checked={form.data.recurring}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    const checked = e.target.checked;
                    form.updateData({ recurring: checked });
                    if (!checked) {
                      form.updateData({ frequency: undefined });
                    }
                  }}
                  data-testid="advanced-edit-recurring-checkbox"
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
                    options={frequencyOptions}
                    error={validation.errors.frequency}
                    data-testid="advanced-edit-frequency-select"
                    placeholder="Selectează frecvența"
                  />
                </div>
              )}

              {/* Financial Impact Comparison */}
              {newImpact && (
                <div className="bg-slate-50 p-4 rounded-md text-sm space-y-3">
                  <h4 className="font-semibold text-slate-800">Comparație Impact Financiar</h4>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600">Valoare originală:</span>
                    <span className={`font-semibold ${
                      originalImpact.isPositive ? 'text-emerald-600' : 'text-red-600'
                    }`}>
                      {originalImpact.isPositive ? '+' : ''}{originalImpact.amount} RON
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600">Valoare nouă:</span>
                    <span className={`font-semibold ${
                      newImpact.isPositive ? 'text-emerald-600' : 'text-red-600'
                    }`}>
                      {newImpact.isPositive ? '+' : ''}{newImpact.amount} RON
                    </span>
                  </div>
                  
                  {Number(form.data.amount) !== transaction.amount && (
                    <div className="flex justify-between items-center pt-2 border-t border-slate-200">
                      <span className="text-slate-800 font-medium">Diferență:</span>
                      <span className={`font-semibold ${
                        Number(form.data.amount) > transaction.amount 
                          ? 'text-emerald-600' : 'text-red-600'
                      }`}>
                        {Number(form.data.amount) > transaction.amount ? '+' : ''}
                        {calculations.formatMoney(Number(form.data.amount) - transaction.amount)} RON
                      </span>
                    </div>
                  )}
                </div>
              )}

              {/* General Error */}
              {validation.errors.general && (
                <div className="text-red-600 text-sm bg-red-50 p-3 rounded-md">
                  {validation.errors.general}
                </div>
              )}
            </>
          )}

          {activeTab === 'history' && (
            <div className="space-y-4">
              <h4 className="font-semibold text-slate-800">Istoric Modificări</h4>
              
              {transactionHistory.length === 0 ? (
                <div className="text-center py-8 text-slate-500">
                  Nu există modificări înregistrate pentru această tranzacție.
                </div>
              ) : (
                <div className="space-y-3">
                  {transactionHistory.map((entry) => (
                    <div 
                      key={entry.id}
                      className="bg-slate-50 p-3 rounded-md border-l-4 border-blue-200"
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="font-medium text-slate-800 capitalize">
                            {entry.field} actualizat
                          </div>
                          <div className="text-sm text-slate-600 mt-1">
                            <span className="line-through text-red-600">
                              {formatHistoryValue(entry.oldValue)}
                            </span>
                            {' → '}
                            <span className="text-emerald-600">
                              {formatHistoryValue(entry.newValue)}
                            </span>
                          </div>
                        </div>
                        <div className="text-xs text-slate-500 ml-4">
                          {formatTimestamp(entry.timestamp)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-10">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-md">
              <h3 className="text-lg font-semibold text-red-800 mb-4">
                Confirmă Ștergerea
              </h3>
              <p className="text-slate-600 mb-6">
                Ești sigur că vrei să ștergi această tranzacție? Această acțiune nu poate fi anulată.
              </p>
              <div className="flex justify-end space-x-3">
                <Button
                  variant="secondary"
                  onClick={() => setShowDeleteConfirm(false)}
                  disabled={loading.isLoading}
                >
                  Anulează
                </Button>
                <Button
                  variant="danger"
                  onClick={handleDelete}
                  disabled={loading.isLoading}
                >
                  {loading.isLoading ? 'Șterge...' : 'Șterge Definitiv'}
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Modal Footer */}
        <div className={transactionModalFooter()}>
          <div className="flex justify-between w-full">
            <div>
              {onDelete && (
                <Button
                  variant="danger"
                  onClick={() => setShowDeleteConfirm(true)}
                  disabled={loading.isLoading}
                  data-testid="advanced-edit-delete-button"
                >
                  Șterge (Ctrl+Del)
                </Button>
              )}
            </div>
            <div className="flex space-x-3">
              <Button
                variant="secondary"
                onClick={onCancel}
                disabled={loading.isLoading}
                data-testid="advanced-edit-cancel-button"
              >
                Anulează
              </Button>
              <Button
                variant="primary"
                onClick={handleSave}
                disabled={loading.isLoading || !form.data.amount}
                data-testid="advanced-edit-save-button"
              >
                {loading.isLoading ? 'Salvează...' : 'Salvează Modificările (Ctrl+Enter)'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}; 
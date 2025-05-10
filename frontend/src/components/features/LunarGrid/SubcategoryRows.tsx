import React, { useState } from 'react';
import { Edit, Trash2 } from 'lucide-react';
import CellTransactionPopover from './CellTransactionPopover';
import { TransactionValidated, TransactionType, MESAJE, BUTTONS } from '@shared-constants';
import { useCategoryStore } from '../../../stores/categoryStore';

export interface SubcategoryRowsProps {
  categoryKey: string;
  subcategories: readonly string[];
  transactions: TransactionValidated[];
  days: number[];
  popover: null | {
    category: string;
    subcategory: string;
    day: number;
    anchorRect: DOMRect | null;
    initialAmount: string;
    type: string;
  };
  handleCellClick: (
    e: React.MouseEvent<HTMLTableCellElement>,
    category: string,
    subcategory: string,
    day: number,
    amount: string,
    type: string
  ) => void;
  handleCellDoubleClick: (
    e: React.MouseEvent<HTMLTableCellElement>,
    category: string,
    subcategory: string,
    day: number,
    currentAmount: string
  ) => void;
  handleSavePopover: (data: { amount: string; recurring: boolean; frequency: string }) => Promise<void>;
  handleClosePopover: () => void;
  handleEditSubcategory: (category: string, subcategory: string) => void;
  handleDeleteSubcategory: (category: string, subcategory: string) => void;
  isCustomSubcategory: (category: string, subcategory: string) => boolean;
  user: any;
  addingCategory?: string | null;
  onStartAddSubcategory?: (category: string) => void;
  onAddSubcategory?: (category: string, newName: string) => Promise<void> | void;
  onCancelAddSubcategory?: () => void;
}

export const SubcategoryRows: React.FC<SubcategoryRowsProps> = ({
  categoryKey,
  subcategories,
  transactions,
  days,
  popover,
  handleCellClick,
  handleCellDoubleClick,
  handleSavePopover,
  handleClosePopover,
  handleEditSubcategory,
  handleDeleteSubcategory,
  isCustomSubcategory,
  user,
  addingCategory,
  onStartAddSubcategory,
  onAddSubcategory,
  onCancelAddSubcategory
}) => {
  const { renameSubcategory } = useCategoryStore();
  const [newSubcatName, setNewSubcatName] = useState('');
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState('');

  return (
    <>
      {subcategories.map((subcat) => (
        editingKey === subcat ? (
          <tr key={`edit-${subcat}`} className="border-t border-gray-200">
            <td className="sticky left-0 bg-white z-10 px-4 py-2 pl-8">
              <div className="flex items-center w-full">
                <input
                  className="w-full border border-gray-300 px-2 py-1 rounded"
                  value={renameValue}
                  onChange={e => setRenameValue(e.target.value)}
                  onKeyDown={async e => {
                    if (e.key === 'Enter') {
                      await renameSubcategory(user.id || user, categoryKey, subcat, renameValue.trim());
                      setEditingKey(null);
                    }
                    if (e.key === 'Escape') setEditingKey(null);
                  }}
                  autoFocus
                  data-testid={`edit-subcat-input-${subcat}`}
                />
                <button
                  className="ml-2 text-green-600 hover:text-green-800"
                  onClick={async () => {
                    await renameSubcategory(user.id || user, categoryKey, subcat, renameValue.trim());
                    setEditingKey(null);
                  }}
                  data-testid={`confirm-rename-${subcat}`}
                >{BUTTONS.DONE}</button>
                <button
                  className="ml-2 text-red-600 hover:text-red-800"
                  onClick={() => setEditingKey(null)}
                  data-testid={`cancel-rename-${subcat}`}
                >{BUTTONS.CANCEL}</button>
              </div>
            </td>
            {days.map((day) => (
              <td key={day} />
            ))}
          </tr>
        ) : (
          <tr
            key={`${categoryKey}-${subcat}`}
            className="group hover:bg-gray-100 border-t border-gray-200"
            data-testid={`subcategory-row-${categoryKey}-${subcat}`}
          >
            <td
              className="sticky left-0 bg-white z-10 px-4 py-2 pl-8"
              data-testid={`subcat-${subcat}`}
            >
              <div className="flex items-center space-x-2">
                <div className="w-4 h-0 border-t border-gray-400 mr-2" />
                <span data-testid={`subcat-label-${subcat}`}>{subcat}{' '}
                  {isCustomSubcategory(categoryKey, subcat) && (
                    <span className="text-blue-600 text-sm ml-1">➡️</span>
                  )}
                </span>
              </div>
              {user && (
                <div className="absolute right-0 top-1/2 -translate-y-1/2 mr-2 hidden [.group:hover_&]:!flex gap-2">
                  {isCustomSubcategory(categoryKey, subcat) ? (
                    <>
                      <button
                        className="p-1 text-gray-500 hover:text-blue-600 focus:outline-none"
                        onClick={e => { e.stopPropagation(); setEditingKey(subcat); setRenameValue(subcat); }}
                        title="Editează subcategorie"
                        data-testid={`edit-subcat-${categoryKey}-${subcat}`}
                      >
                        <Edit size={14} />
                      </button>
                      <button
                        className="p-1 text-gray-500 hover:text-red-600 focus:outline-none"
                        onClick={e => { e.stopPropagation(); if (window.confirm(MESAJE.CONFIRMARE_STERGERE)) handleDeleteSubcategory(categoryKey, subcat); }}
                        title="Șterge subcategorie"
                        data-testid={`delete-subcat-${categoryKey}-${subcat}`}
                      >
                        <Trash2 size={14} />
                      </button>
                    </>
                  ) : (
                    <button
                      className="p-1 text-gray-400 hover:text-blue-600 focus:outline-none"
                      onClick={e => { e.stopPropagation(); setEditingKey(subcat); setRenameValue(subcat); }}
                      title="Redenumește subcategoria"
                      data-testid={`rename-subcat-${categoryKey}-${subcat}`}
                    >
                      <Edit size={14} />
                    </button>
                  )}
                </div>
              )}
            </td>
            {days.map((day) => {
              const sum = transactions
                .filter((t) => t.category === categoryKey && t.subcategory === subcat && new Date(t.date).getDate() === day)
                .reduce((acc, t) => acc + (t.status === 'COMPLETED' && typeof t.actualAmount === 'number' ? t.actualAmount : t.amount), 0);
              return (
                <td
                  key={day}
                  className={`px-4 py-2 text-right ${sum !== 0 ? (sum > 0 ? 'text-green-600 font-medium' : 'text-red-600 font-medium') : 'text-gray-500'}`}
                  data-testid={`cell-${categoryKey}-${subcat}-${day}`}
                  tabIndex={0}
                  onClick={(e) => handleCellClick(e, categoryKey, subcat, day, sum !== 0 ? String(sum) : '', '')}
                  onDoubleClick={(e) => handleCellDoubleClick(e, categoryKey, subcat, day, sum !== 0 ? String(sum) : '')}
                >
                  {sum !== 0 ? sum.toLocaleString('ro-RO', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '—'}
                  {popover && popover.category === categoryKey && popover.subcategory === subcat && popover.day === day && (
                    <div
                      style={{ position: 'absolute', left: popover.anchorRect?.left || 0, top: (popover.anchorRect?.top || 0) + 40, zIndex: 100 }}
                      data-testid={`popover-cell-${categoryKey}-${subcat}-${day}`}
                    >
                      <CellTransactionPopover
                        initialAmount={popover.initialAmount}
                        day={popover.day}
                        month={popover.day}
                        year={popover.day}
                        category={popover.category}
                        subcategory={popover.subcategory}
                        type={popover.type}
                        onSave={handleSavePopover}
                        onCancel={handleClosePopover}
                      />
                    </div>
                  )}
                </td>
              );
            })}
          </tr>
        )
      ))}
      {!addingCategory && onStartAddSubcategory && (
        <tr key="start-add-row" className="border-t border-gray-200">
          <td className="sticky left-0 bg-white z-10 px-4 py-2 pl-8">
            <button
              className="text-blue-600 hover:text-blue-800"
              onClick={() => onStartAddSubcategory(categoryKey)}
              data-testid={`start-add-${categoryKey}`}
            >
              Adaugă subcategorie
            </button>
          </td>
          {days.map((day) => (
            <td key={`empty-${day}`} />
          ))}
        </tr>
      )}
      {addingCategory === categoryKey && (
        <tr key="add-row" className="border-t border-gray-200">
          <td className="sticky left-0 bg-white z-10 px-4 py-2 pl-8">
            <div className="flex items-center w-full">
              <input
                className="w-full border border-gray-300 px-2 py-1 rounded"
                placeholder="Nume subcategorie"
                data-testid="add-subcat-input"
                value={newSubcatName}
                onChange={(e) => setNewSubcatName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') onAddSubcategory?.(categoryKey, newSubcatName);
                  if (e.key === 'Escape') onCancelAddSubcategory?.();
                }}
              />
              <button
                className="ml-2 text-green-600 hover:text-green-800"
                onClick={() => onAddSubcategory?.(categoryKey, newSubcatName)}
                data-testid={`confirm-add-${categoryKey}`}
              >
                Done
              </button>
              <button
                className="ml-2 text-red-600 hover:text-red-800"
                onClick={() => onCancelAddSubcategory?.()}
                data-testid={`cancel-add-${categoryKey}`}
              >
                Cancel
              </button>
            </div>
          </td>
          {days.map((day) => (
            <td key={day} />
          ))}
        </tr>
      )}
    </>
  );
};

import React from 'react';
import { Edit, Trash2 } from 'lucide-react';
import CellTransactionPopover from './CellTransactionPopover';
import { TransactionValidated, TransactionType } from '@shared-constants';
import { FrequencyType } from '@shared-constants/enums';
import { MESAJE } from '@shared-constants/messages';

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
  user
}) => {
  return (
    <>
      {subcategories.map((subcat) => (
        <tr
          key={`${categoryKey}-${subcat}`}
          className="hover:bg-gray-100 border-t border-gray-200"
          data-testid={`subcategory-row-${categoryKey}-${subcat}`}
        >
          <td
            className="sticky left-0 bg-white z-10 px-4 py-2 pl-8 flex items-center justify-between"
            data-testid={`subcat-${subcat}`}
          >
            <div className="flex items-center">
              <div className="w-4 h-0 border-t border-gray-400 mr-2" />
              <span data-testid={`subcat-label-${subcat}`}>
                {subcat}{' '}
                {isCustomSubcategory(categoryKey, subcat) && (
                  <span className="text-blue-600 text-sm ml-1">➡️</span>
                )}
              </span>
            </div>
            {user && isCustomSubcategory(categoryKey, subcat) && (
              <div className="flex gap-2 ml-auto">
                <button
                  className="p-1 text-gray-500 hover:text-blue-600 focus:outline-none"
                  onClick={(e) => { e.stopPropagation(); handleEditSubcategory(categoryKey, subcat); }}
                  title="Edit"
                  data-testid={`edit-subcat-${categoryKey}-${subcat}`}
                >
                  <Edit size={14} />
                </button>
                <button
                  className="p-1 text-gray-500 hover:text-red-600 focus:outline-none"
                  onClick={(e) => { 
                    e.stopPropagation(); 
                    if (window.confirm(MESAJE.SUBCATEGORY_DELETE_CONFIRM)) {
                      handleDeleteSubcategory(categoryKey, subcat);
                    }
                  }}
                  title="Delete"
                  data-testid={`delete-subcat-${categoryKey}-${subcat}`}
                >
                  <Trash2 size={14} />
                </button>
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
      ))}
    </>
  );
};

// Modal pentru gestionarea subcategoriilor: add/edit/delete/migrare, badge count, validare
// Owner: echipa FE
// Migrated la CVA styling system pentru consistență
import React, { useEffect, ChangeEvent, KeyboardEvent, useMemo, useCallback } from 'react';
import { BUTTONS, PLACEHOLDERS, UI, INFO, FLAGS } from '@shared-constants/ui';
import { MESAJE } from '@shared-constants/messages';
import Button from '../../primitives/Button/Button';
import Input from '../../primitives/Input/Input';
import Badge from '../../primitives/Badge/Badge';
import Alert from '../../primitives/Alert/Alert';
import { cn } from '../../../styles/cva/shared/utils';
import { modal } from '../../../styles/cva/components/layout';
import { card, flex } from '../../../styles/cva/components/layout';
import { useCategoryEditorState } from './useCategoryEditorState';

interface Props {
  open: boolean;
  onClose: () => void;
  userId: string;
  initialCategory?: string;
  initialSubcategory?: string;
  initialMode?: 'edit' | 'delete' | 'add';
}

export const CategoryEditor: React.FC<Props> = ({ 
  open, 
  onClose, 
  userId, 
  initialCategory, 
  initialSubcategory,
  initialMode = 'add'
}) => {
  // Utilizăm hook-ul personalizat pentru gestionarea stării
  const {
    selectedCategory,
    subcatAction,
    renameValue,
    newSubcat,
    error,
    categories,
    getSubcategoryCount,
    setSelectedCategory,
    setSubcatAction,
    setRenameValue,
    setNewSubcat,
    setError,
    handleAdd,
    handleRename,
    handleDelete,
    isValidDeleteRequest
  } = useCategoryEditorState({
    open,
    userId,
    initialCategory,
    initialSubcategory,
    initialMode
  });
  
  // Memoizăm starea modală pentru tranziții fluide
  const modalState = useMemo(() => ({
    visible: open,
    animationClass: open ? 'modal-visible' : 'modal-hidden'
  }), [open]);

  // validare subcategorie - memoizată pentru a evita recrearea la fiecare render
  const isValidSubcat = useCallback((txt: string): boolean => 
    txt.trim().length > 0 &&
    txt.trim().length <= 80 &&
    /^[a-zA-Z0-9ăâîșțĂÂÎȘȚ \-|]+$/.test(txt.trim()),
  []);

  // Adaugă event listener pentru tasta Escape
  useEffect(() => {
    if (!open) return;
    
    const handleEsc = (event: KeyboardEvent): void => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    
    document.addEventListener('keydown', handleEsc as unknown as EventListener);
    return () => document.removeEventListener('keydown', handleEsc as unknown as EventListener);
  }, [open, onClose]);

  // Nu renderizăm nimic dacă modalul nu este deschis
  if (!open) return null;

  // Badge pentru număr de tranzacții în subcategorie
  const badge = (cat: string, subcat: string): React.ReactElement | null => {
    const count = getSubcategoryCount(cat, subcat);
    return count > 0 ? (
      <Badge 
        variant="secondary"
        size="sm"
        dataTestId={`subcat-count-${cat}-${subcat}`}
      >
        {count}
      </Badge>
    ) : null;
  };

  // Componenta pentru confirmarea ștergerii
  const DeleteConfirmation = ({ cat, subcat, onConfirm, onCancel }: {
    cat: string;
    subcat: string;
    onConfirm: () => void;
    onCancel: () => void;
  }): React.ReactElement => {
    const message = `Sigur doriți să ștergeți subcategoria ${subcat} din categoria ${cat}? Această acțiune nu poate fi anulată.`;
    
    return (
      <div 
        className={cn(
          card({ variant: 'elevated', size: 'sm' }),
          'bg-yellow-50 border-yellow-200 border-l-4 border-l-yellow-500',
          'p-4 rounded-lg'
        )}
        data-testid="delete-confirmation"
        tabIndex={0}
        role="dialog"
        aria-labelledby="delete-confirmation-title"
      >
        <h3 
          id="delete-confirmation-title" 
          className="text-lg font-semibold text-yellow-800 mb-2"
        >
          {UI.CATEGORY_EDITOR.DELETE_CONFIRMATION_TITLE}
        </h3>
        <p className="text-sm text-yellow-700 mb-4">{message}</p>
        <div className={cn(flex({ direction: 'row', gap: 'md', justify: 'end' }))}>
                    <Button             variant="danger"            size="sm"            onClick={onConfirm}            dataTestId="confirm-delete-btn"          >            {BUTTONS.DELETE}          </Button>
          <Button 
            variant="secondary"
            size="sm"
            onClick={onCancel}
            dataTestId="cancel-delete-btn"
          >
            {BUTTONS.CANCEL}
          </Button>
        </div>
      </div>
    );
  };

  return (
    <div 
      className={cn(
        modal({ overlay: 'default' }),
        'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50',
        modalState.visible ? 'opacity-100 visible' : 'opacity-0 invisible',
        'transition-all duration-300 ease-in-out'
      )}
      role="dialog"
      aria-modal="true"
      aria-labelledby="category-editor-title"
      data-testid="category-editor-modal"
    >
      <div 
        className={cn(
          'bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-hidden',
          modalState.visible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4',
          'transition-all duration-300 ease-in-out transform'
        )}
      >
        <div className="flex justify-between items-center p-6 border-b border-gray-200 bg-gray-50">
          <h2 
            id="category-editor-title" 
            className="text-xl font-bold text-gray-900"
          >
            {UI.CATEGORY_EDITOR.TITLE}
          </h2>
          <button 
            onClick={onClose} 
            className={cn(
              'text-gray-400 hover:text-gray-600',
              'transition-colors duration-150',
              'p-2 rounded-md hover:bg-gray-100',
              'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-1'
            )}
            aria-label="Închide"
            data-testid="close-category-editor"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {error && (
            <Alert 
              type="error" 
              dataTestId="error-message"
              message={error}
              className="mb-4"
            />
          )}
          <div className={cn(flex({ direction: 'row', gap: 'xl', justify: 'between' }), 'h-full')}>
            <div className={cn(card({ variant: 'default', size: 'md' }), 'flex-1')} data-testid="categories-section">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">{UI.CATEGORY_EDITOR.CATEGORIES_SECTION_TITLE}</h3>
              <div
                style={{ maxHeight: 300 }}
                className="overflow-y-auto border border-gray-200 rounded-lg"
                data-testid="categories-scroll-wrapper"
              >
                <ul className="divide-y divide-gray-200">
                  {categories.map(cat => (
                    <li 
                      key={cat.name} 
                      className={cn(
                        'p-3 hover:bg-gray-50 transition-colors duration-150',
                        selectedCategory === cat.name && 'bg-primary-50 border-r-2 border-r-primary-500'
                      )}
                      data-testid={`category-item-${cat.name}`}
                    >
                      <button 
                        onClick={() => {
                          setSelectedCategory(cat.name);
                          setError(null);
                          setNewSubcat('');
                        }}
                        aria-pressed={selectedCategory === cat.name}
                        aria-controls="subcategories-section"
                        data-testid={`cat-select-${cat.name}`}
                        className={cn(
                          'w-full text-left text-sm font-medium transition-colors duration-150',
                          selectedCategory === cat.name 
                            ? 'text-primary-700' 
                            : 'text-gray-700 hover:text-gray-900'
                        )}
                      >
                        {cat.name}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className={cn(card({ variant: 'default', size: 'md' }), 'flex-1')} data-testid="subcategories-section" id="subcategories-section">
              {/* Dialog de confirmare ștergere, arată doar când subcatAction.type === 'delete' */}
              {subcatAction?.type === 'delete' && (
                <DeleteConfirmation
                  cat={subcatAction.cat}
                  subcat={subcatAction.subcat}
                  onConfirm={async () => {
                    try {
                      if (isValidDeleteRequest(subcatAction.cat, subcatAction.subcat)) {
                        await handleDelete(subcatAction.cat, subcatAction.subcat);
                      }
                    } catch (error) {
                      setError(MESAJE.CATEGORII.EROARE_STERGERE);
                    }
                  }}
                  onCancel={() => setSubcatAction(null)}
                />
              )}
              {selectedCategory ? (
                <>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    {UI.CATEGORY_EDITOR.SUBCATEGORIES_SECTION_TITLE}{' '}
                    <span className="text-primary-600 font-normal">
                      {selectedCategory}
                    </span>
                  </h3>
                  <div
                    style={{ maxHeight: 300 }}
                    className="overflow-y-auto border border-gray-200 rounded-lg mb-4"
                    data-testid="subcategories-scroll-wrapper"
                  >
                    <ul 
                      className="divide-y divide-gray-200"
                      aria-label={UI.CATEGORY_EDITOR.SUBCATEGORIES_SECTION_TITLE}
                    >
                      {categories.find(cat => cat.name === selectedCategory)?.subcategories.map(sc => (
                        <li 
                          key={sc.name} 
                          className="p-3 hover:bg-gray-50 transition-colors duration-150 group"
                          data-testid={`subcat-item-${sc.name}`}
                        >
                          {subcatAction?.type === 'edit' && subcatAction.cat === selectedCategory && subcatAction.subcat === sc.name ? (
                            <div className={cn(flex({ direction: 'row', gap: 'sm', align: 'center' }))}>
                              <Input
                                type="text"
                                value={renameValue}
                                onChange={(e: ChangeEvent<HTMLInputElement>) => setRenameValue(e.target.value)}
                                onKeyDown={(e: KeyboardEvent<HTMLInputElement>) => {
                                  if (e.key === 'Enter' && isValidSubcat(renameValue)) handleRename(selectedCategory, sc.name, renameValue);
                                  if (e.key === 'Escape') { setSubcatAction(null); setRenameValue(''); }
                                }}
                                autoFocus
                                className="flex-grow"
                                dataTestId={`rename-input-${sc.name}`}
                                maxLength={32}
                              />
                              <Button
                                variant="primary"
                                size="sm"
                                disabled={!isValidSubcat(renameValue)}
                                dataTestId={`confirm-rename-${sc.name}`}
                                type="button"
                                onClick={() => handleRename(selectedCategory, sc.name, renameValue)}
                                className="min-w-[90px] flex-shrink-0"
                              >
                                {BUTTONS.DONE}
                              </Button>
                              <Button
                                variant="secondary"
                                size="sm"
                                dataTestId={`cancel-rename-${sc.name}`}
                                type="button"
                                onClick={() => { setSubcatAction(null); setRenameValue(''); }}
                                className="min-w-[90px] flex-shrink-0"
                              >
                                {BUTTONS.CANCEL}
                              </Button>
                            </div>
                          ) : (
                            <div className={cn(flex({ direction: 'row', justify: 'between', align: 'center' }))}>
                              <span className="text-sm text-gray-700 font-medium">{sc.name}</span>
                              <div className={cn(
                                flex({ direction: 'row', gap: 'sm', align: 'center' }),
                                'opacity-0 group-hover:opacity-100 transition-opacity duration-150'
                              )}>
                                {sc.isCustom && (
                                  <Badge 
                                    variant="success"
                                    size="xs"
                                    dataTestId={`custom-flag-${sc.name}`}
                                  >
                                    {FLAGS.CUSTOM}
                                  </Badge>
                                )}
                                {badge(selectedCategory, sc.name)}
                                <Button
                                  variant="primary"
                                  size="xs"
                                  onClick={() => { setSubcatAction({ type: 'edit', cat: selectedCategory, subcat: sc.name }); setRenameValue(sc.name); }}
                                  dataTestId={`edit-subcat-btn-${sc.name}`}
                                  aria-label={`${UI.CATEGORY_EDITOR.RENAME_BUTTON} ${sc.name}`}
                                >
                                  {UI.CATEGORY_EDITOR.RENAME_BUTTON}
                                </Button>
                                {/* Butonul de ștergere apare DOAR pentru subcategoriile personalizate (custom) */}
                                {sc.isCustom && (
                                  <Button 
                                    variant="danger"
                                    size="xs"
                                    onClick={() => setSubcatAction({ type: 'delete', cat: selectedCategory, subcat: sc.name })}
                                    dataTestId={`delete-subcat-btn-${sc.name}`}
                                    aria-label={`${UI.CATEGORY_EDITOR.DELETE_BUTTON} ${sc.name}`}
                                  >
                                    {UI.CATEGORY_EDITOR.DELETE_BUTTON}
                                  </Button>
                                )}
                              </div>
                            </div>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className={cn(
                    card({ variant: 'elevated', size: 'sm' }),
                    'bg-gray-50 border border-gray-200 p-4'
                  )}>
                    <div className={cn(flex({ direction: 'row', gap: 'sm', align: 'center' }))}>
                      <Input
                        type="text"
                        value={newSubcat}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => setNewSubcat(e.target.value)}
                        onKeyDown={(e: KeyboardEvent<HTMLInputElement>) => {
                          if (e.key === 'Enter' && isValidSubcat(newSubcat)) {
                            const selectedCat = categories.find(cat => cat.name === selectedCategory);
                            if (selectedCat) handleAdd(selectedCat);
                          }
                          if (e.key === 'Escape') setNewSubcat('');
                        }}
                        placeholder={PLACEHOLDERS.CATEGORY_EDITOR_SUBCATEGORY}
                        className="flex-grow"
                        dataTestId="add-subcat-input"
                        maxLength={32}
                      />
                      <Button
                        variant="primary"
                        size="sm"
                        disabled={!isValidSubcat(newSubcat)}
                        dataTestId="add-subcat-btn"
                        type="button"
                        onClick={() => {
                          const selectedCat = categories.find(cat => cat.name === selectedCategory);
                          if (selectedCat && isValidSubcat(newSubcat)) handleAdd(selectedCat);
                        }}
                        className="min-w-[90px]"
                      >
                        {BUTTONS.ADD}
                      </Button>
                      <Button
                        variant="secondary"
                        size="sm"
                        dataTestId="cancel-add-subcat-btn"
                        type="button"
                        onClick={() => setNewSubcat('')}
                        className="min-w-[90px]"
                      >
                        {BUTTONS.CANCEL}
                      </Button>
                    </div>
                  </div>
                </>
              ) : (
                <Alert 
                  type="info" 
                  dataTestId="no-cat-msg"
                  message={INFO.CATEGORY_EDITOR_EMPTY}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryEditor;

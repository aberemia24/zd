// Modal pentru gestionarea subcategoriilor: add/edit/delete/migrare, badge count, validare
// Owner: echipa FE
import React, { useState, useEffect, ChangeEvent, KeyboardEvent, useMemo, useCallback } from 'react';
import { useCategoryStore } from '../../../stores/categoryStore';
import { CustomCategory, CustomSubcategory } from '../../../types/Category';
import { BUTTONS, PLACEHOLDERS, UI, INFO, FLAGS } from '@shared-constants/ui';
import { MESAJE } from '@shared-constants/messages';
import classNames from 'classnames';
import Button from '../../primitives/Button/Button';
import Input from '../../primitives/Input/Input';
import Badge from '../../primitives/Badge/Badge';
import Alert from '../../primitives/Alert/Alert';
import { useThemeEffects } from '../../../hooks';
import { useCategoryEditorState, SubcatAction, SubcatActionType } from './useCategoryEditorState';

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

  // Utilizăm hook-ul de efecte pentru gestionarea efectelor vizuale
  const { getClasses, hasEffect } = useThemeEffects({
    withFadeIn: true,
    withShadow: true,
    withTransition: true,
    withGlowFocus: true,
    withScaleEffect: true,
    withAccentBorder: true
  });
  
  // Memoizăm starea modală pentru tranziții fluide
  const modalState = useMemo(() => ({
    visible: open,
    animationClass: open ? 'modal-visible' : 'modal-hidden'
  }), [open]);

  // validare subcategorie - memoizată pentru a evita recrearea la fiecare render
  const isValidSubcat = useCallback((txt: string): boolean => 
    txt.trim().length > 0 &&
    txt.trim().length <= 32 &&
    /^[a-zA-Z0-9ăâîșțĂÂÎȘȚ \-]+$/.test(txt.trim()),
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
  const badge = (cat: string, subcat: string): JSX.Element | null => {
    const count = getSubcategoryCount(cat, subcat);
    return count > 0 ? (
      <Badge 
        variant="secondary"
        size="sm"
        dataTestId={`subcat-count-${cat}-${subcat}`}
        withShadow
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
  }): JSX.Element => {
    const message = `Sigur doriți să ștergeți subcategoria ${subcat} din categoria ${cat}? Această acțiune nu poate fi anulată.`;
    
    return (
      <div 
        className={getClasses('category-dialog', 'warning')}
        data-testid="delete-confirmation"
        tabIndex={0}
        role="dialog"
        aria-labelledby="delete-confirmation-title"
      >
        <h3 id="delete-confirmation-title" className={getClasses('category-header', 'accent')}>{UI.CATEGORY_EDITOR.DELETE_CONFIRMATION_TITLE}</h3>
        <p className={getClasses('text')}>{message}</p>
        <div className={getClasses('flex-group', 'compact')}>
          <Button 
            variant="error"
            size="sm"
            onClick={onConfirm}
            dataTestId="confirm-delete-btn"
            withShadow
          >
            {BUTTONS.DELETE}
          </Button>
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
      className={classNames(
        getClasses('modal-overlay'),
        modalState.visible ? 'opacity-100 visible' : 'opacity-0 invisible',
        'transition-all duration-300 ease-in-out'
      )}
      role="dialog"
      aria-modal="true"
      aria-labelledby="category-editor-title"
      data-testid="category-editor-modal"
    >
      <div 
        className={classNames(
          getClasses('modal-container'),
          modalState.visible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4',
          'transition-all duration-300 ease-in-out transform'
        )}
      >
        <div className={getClasses('modal-header')}>
          <h2 
            id="category-editor-title" 
            className={getClasses('modal-title')}
          >
            {UI.CATEGORY_EDITOR.TITLE}
          </h2>
          <button 
            onClick={onClose} 
            className={getClasses('modal-close-button')}
            aria-label="Închide"
            data-testid="close-category-editor"
          >
            &times;
          </button>
        </div>
        <div className={getClasses('modal-body')}>
          {error && (
            <Alert 
              type="error" 
              dataTestId="error-message"
              withFadeIn
              message={error}
            />
          )}
          <div className={getClasses('flex-group', 'between', 'lg')}>
            <div className={getClasses('card-section')} data-testid="categories-section">
              <h3 className={getClasses('category-header', 'section')}>{UI.CATEGORY_EDITOR.CATEGORIES_SECTION_TITLE}</h3>
              <div
                style={{ maxHeight: 300 }}
                className={getClasses('category-container', 'default')}
                data-testid="categories-scroll-wrapper"
              >
                <ul className={getClasses('category-list', 'compact')}>
                  {categories.map(cat => (
                    <li 
                      key={cat.name} 
                      className={getClasses('category-item', 'compact', undefined, selectedCategory === cat.name ? 'selected' : undefined)}
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
                        className={getClasses('button', 'ghost')}
                      >
                        {cat.name}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className={getClasses('card-section')} data-testid="subcategories-section" id="subcategories-section">
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
                  <h3 className={getClasses('category-header', 'section')}>
                    {UI.CATEGORY_EDITOR.SUBCATEGORIES_SECTION_TITLE}{' '}
                    <span className={getClasses('text', 'accent')}>
                      {selectedCategory}
                    </span>
                  </h3>
                  <div
                    style={{ maxHeight: 300 }}
                    className={getClasses('category-container', 'default')}
                    data-testid="subcategories-scroll-wrapper"
                  >
                    <ul 
                      className={getClasses('category-list', 'compact')}
                      aria-label={UI.CATEGORY_EDITOR.SUBCATEGORIES_SECTION_TITLE}
                    >
                      {categories.find(cat => cat.name === selectedCategory)?.subcategories.map(sc => (
                        <li 
                          key={sc.name} 
                          className={classNames(
                            getClasses('category-item', 'compact'),
                            'grid grid-cols-[1fr,auto] gap-2'
                          )}
                          data-testid={`subcat-item-${sc.name}`}
                        >
                          {subcatAction?.type === 'edit' && subcatAction.cat === selectedCategory && subcatAction.subcat === sc.name ? (
                            <div className={getClasses('flex-group', 'between', 'sm')}>
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
                                withGlowFocus
                              />
                              <Button
                                variant="primary"
                                size="sm"
                                disabled={!isValidSubcat(renameValue)}
                                dataTestId={`confirm-rename-${sc.name}`}
                                type="button"
                                onClick={() => handleRename(selectedCategory, sc.name, renameValue)}
                                withShadow
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
                            <>
                              <span className={getClasses('subcategory-name')}>{sc.name}</span>
                              <div className={getClasses('flex-group', 'center', 'sm')}>
                                {sc.isCustom && (
                                  <Badge 
                                    variant="success"
                                    size="xs"
                                    dataTestId={`custom-flag-${sc.name}`}
                                    withPulse
                                  >
                                    {FLAGS.CUSTOM}
                                  </Badge>
                                )}
                                {badge(selectedCategory, sc.name)}
                                <Button
                                  variant="accent"
                                  size="xs"
                                  onClick={() => { setSubcatAction({ type: 'edit', cat: selectedCategory, subcat: sc.name }); setRenameValue(sc.name); }}
                                  dataTestId={`edit-subcat-btn-${sc.name}`}
                                  aria-label={`${UI.CATEGORY_EDITOR.RENAME_BUTTON} ${sc.name}`}
                                  withTranslate
                                >
                                  {UI.CATEGORY_EDITOR.RENAME_BUTTON}
                                </Button>
                                {/* Butonul de ștergere apare DOAR pentru subcategoriile personalizate (custom) */}
                                {sc.isCustom && (
                                  <Button 
                                    variant="error"
                                    size="xs"
                                    onClick={() => setSubcatAction({ type: 'delete', cat: selectedCategory, subcat: sc.name })}
                                    dataTestId={`delete-subcat-btn-${sc.name}`}
                                    aria-label={`${UI.CATEGORY_EDITOR.DELETE_BUTTON} ${sc.name}`}
                                    withTranslate
                                  >
                                    {UI.CATEGORY_EDITOR.DELETE_BUTTON}
                                  </Button>
                                )}
                              </div>
                            </>
                          )}
                        </li>
                      ))}
                    </ul>
                    <div className={getClasses('category-add-form', 'default')}>
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
                        withGlowFocus
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
                        withShadow
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
                  withFadeIn
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

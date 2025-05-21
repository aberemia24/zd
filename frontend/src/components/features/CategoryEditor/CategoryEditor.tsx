// Modal pentru gestionarea subcategoriilor: add/edit/delete/migrare, badge count, validare
// Owner: echipa FE
//
// NOTĂ: Acest component folosește exclusiv sistemul de stiluri rafinate prin getEnhancedComponentClasses
// și nu mai depinde de fișierul CSS direct. Tranziții și animații sunt acum gestionate prin
// componentele de efecte vizuale definite în /styles/componentMap/effectComponents.ts
import React, { useState, useEffect, ChangeEvent, KeyboardEvent, useMemo } from 'react';
import { useCategoryStore } from '../../../stores/categoryStore';
import { CustomCategory, CustomSubcategory } from '../../../types/Category';
import { BUTTONS, PLACEHOLDERS, UI, INFO, FLAGS, EXCEL_GRID } from '@shared-constants/ui';
import { MESAJE } from '@shared-constants/messages';
import { getEnhancedComponentClasses } from '../../../styles/themeUtils';
import type { ComponentType, ComponentVariant, ComponentSize, ComponentState } from '../../../styles/themeTypes';
import { SubcatAction, SubcatActionType } from './useCategoryEditorState';
import classNames from 'classnames';
import { Button } from '../../primitives/Button';

interface Props {
  open: boolean;
  onClose: () => void;
  userId: string;
  initialCategory?: string;
  initialSubcategory?: string;
  initialMode?: 'edit' | 'delete' | 'add';
}

// Constante pentru tipurile de componente, variante și dimensiuni folosite frecvent
const COMPONENT_TYPES = {
  BUTTON: 'button' as ComponentType,
  INPUT: 'input' as ComponentType,
  BADGE: 'badge' as ComponentType,
  ALERT: 'alert' as ComponentType,
  FLEX_GROUP: 'flex-group' as ComponentType,
  LIST_CONTAINER: 'list-container' as ComponentType,
  LIST_ITEM: 'list-item' as ComponentType,
  CARD_SECTION: 'card-section' as ComponentType,
  SECTION_HEADER: 'section-header' as ComponentType,
  TEXT: 'text' as ComponentType,
  
  // Componente modale rafinate
  MODAL_OVERLAY: 'modal-overlay' as ComponentType,
  MODAL_CONTAINER: 'modal-container' as ComponentType,
  MODAL_HEADER: 'modal-header' as ComponentType,
  MODAL_TITLE: 'modal-title' as ComponentType,
  MODAL_CLOSE_BUTTON: 'modal-close-button' as ComponentType,
  MODAL_BODY: 'modal-body' as ComponentType,
  MODAL_FOOTER: 'modal-footer' as ComponentType
};

const COMPONENT_VARIANTS = {
  PRIMARY: 'primary' as ComponentVariant,
  SECONDARY: 'secondary' as ComponentVariant,
  ACCENT: 'accent' as ComponentVariant,
  ERROR: 'error' as ComponentVariant,
  SUCCESS: 'success' as ComponentVariant,
  INFO: 'info' as ComponentVariant,
  COMPACT: 'compact' as ComponentVariant,
  DEFAULT: 'default' as ComponentVariant,
  CENTER: 'center' as ComponentVariant,
  WIDE: 'wide' as ComponentVariant,
  LOOSE: 'loose' as ComponentVariant
};

const COMPONENT_SIZES = {
  XS: 'xs' as ComponentSize,
  SM: 'sm' as ComponentSize,
  MD: 'md' as ComponentSize,
  LG: 'lg' as ComponentSize
};

const COMPONENT_STATES = {
  HOVER: 'hover' as ComponentState,
  ACTIVE: 'active' as ComponentState,
  PULSE: 'pulse' as ComponentState
};

// Constante pentru efectele vizuale și animații
const EFFECTS = {
  MODAL_TRANSITION: 'fx-modal-transition' as ComponentType,
  FADE: 'fx-fade' as ComponentType,
  MOBILE_TOUCH: 'fx-mobile-touch' as ComponentType,
  SLIDE: 'fx-slide' as ComponentType,
  ANIMATE_CONTAINER: 'animate-container' as ComponentType
};

// Constante pentru variantele de efecte vizuale
const EFFECT_VARIANTS = {
  VISIBLE: 'visible' as ComponentVariant,
  HIDDEN: 'hidden' as ComponentVariant,
  FADE_IN: 'in' as ComponentVariant,
  FADE_OUT: 'out' as ComponentVariant,
  EXPANDED: 'expanded' as ComponentVariant,
  COLLAPSED: 'collapsed' as ComponentVariant
};

export const CategoryEditor: React.FC<Props> = ({ 
  open, 
  onClose, 
  userId, 
  initialCategory, 
  initialSubcategory,
  initialMode = 'add'
}) => {
  const { categories, saveCategories, renameSubcategory, deleteSubcategory: _deleteSubcategory, getSubcategoryCount } = useCategoryStore();
  
  const [selectedCategory, setSelectedCategory] = useState<string | null>(initialCategory || null);
  const [subcatAction, setSubcatAction] = useState<SubcatAction | null>(
    initialCategory && initialSubcategory && (initialMode === 'edit' || initialMode === 'delete')
      ? { type: initialMode as SubcatActionType, cat: initialCategory, subcat: initialSubcategory }
      : null
  );
  const [renameValue, setRenameValue] = useState<string>(initialSubcategory || '');
  const [newSubcat, setNewSubcat] = useState('');
  const [error, setError] = useState<string | null>(null);
  
  // Focus pe input în modul add
  useEffect(() => {
    if (open && initialMode === 'add') {
      setTimeout(() => {
        const addInput = document.querySelector('[data-testid="add-subcat-input"]');
        if (addInput instanceof HTMLInputElement) addInput.focus();
      }, 100);
    }
  }, [open, initialMode]);

  // Memoizez clase pentru tranzitii și efecte vizuale
  const modalClasses = useMemo(() => {
    // Obțin clasa pentru efectul de tranziție modală
    const modalTransitionClasses = getEnhancedComponentClasses(
      EFFECTS.MODAL_TRANSITION,
      open ? EFFECT_VARIANTS.VISIBLE : EFFECT_VARIANTS.HIDDEN
    );
    
    // Obțin clasa pentru efectul de fade pentru card
    const cardFadeClasses = getEnhancedComponentClasses(
      EFFECTS.FADE,
      open ? EFFECT_VARIANTS.FADE_IN : EFFECT_VARIANTS.FADE_OUT
    );
    
    return {
      modal: modalTransitionClasses,
      card: cardFadeClasses
    };
  }, [open]);
  
  useEffect(() => {
    if (!open) return;
    const handleEsc = (event: Event) => {
      const e = event as unknown as KeyboardEvent;
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [open, onClose]);

  if (!open) return null;

  // Badge pentru număr de tranzacții în subcategorie
  const badge = (cat: string, subcat: string): JSX.Element | null => {
    const count = getSubcategoryCount(cat, subcat);
    return count > 0 ? (
      <span
        className={getEnhancedComponentClasses(
          COMPONENT_TYPES.BADGE, 
          COMPONENT_VARIANTS.SECONDARY, 
          COMPONENT_SIZES.SM, 
          undefined
        )}
        data-testid={`subcat-count-${cat}-${subcat}`}
      >
        {count}
      </span>
    ) : null;
  };

  // Adăugare subcategorie nouă
  const handleAdd = async (cat: CustomCategory): Promise<void> => {
    setError(null);
    
    if (!newSubcat.trim()) return setError(MESAJE.CATEGORII.NUME_GOL);
    if (cat.subcategories.some((sc: CustomSubcategory) => 
        sc.name.toLowerCase() === newSubcat.trim().toLowerCase())) {
      return setError(MESAJE.CATEGORII.SUBCATEGORIE_EXISTENTA);
    }
    
    const updated = categories.map((c: CustomCategory) => c.name === cat.name ? {
      ...c,
      subcategories: [...c.subcategories, { name: newSubcat.trim(), isCustom: true }]
    } : c);
    
    await saveCategories(userId, updated);
    setNewSubcat('');
    setError(null);
  };

  // Redenumire subcategorie
  const handleRename = async (cat: string, oldName: string, newName: string): Promise<void> => {
    setError(null);
    
    if (!newName.trim()) return setError(MESAJE.CATEGORII.NUME_GOL);
    if (categories.find((c: CustomCategory) => c.name === cat)?.subcategories.some((sc: CustomSubcategory) => 
        sc.name.toLowerCase() === newName.trim().toLowerCase())) {
      return setError(MESAJE.CATEGORII.SUBCATEGORIE_EXISTENTA);
    }
    
    await renameSubcategory(userId, cat, oldName, newName.trim());
    setSubcatAction(null);
    setError(null);
  };

  interface DeleteConfirmationProps {
    cat: string;
    subcat: string;
    onConfirm: () => void;
    onCancel: () => void;
  }

  const DeleteConfirmation = ({ cat, subcat, onConfirm, onCancel }: DeleteConfirmationProps): JSX.Element => {
    const message = `Sigur doriți să ștergeți subcategoria ${subcat} din categoria ${cat}? Această acțiune nu poate fi anulată.`;
    
    return (
      <div 
        className={getEnhancedComponentClasses('alert' as ComponentType, 'warning' as ComponentVariant, 'md' as ComponentSize)}
        data-testid="delete-confirmation"
        tabIndex={0}
        role="dialog"
        aria-labelledby="delete-confirmation-title"
      >
        <h3 id="delete-confirmation-title" className={getEnhancedComponentClasses('section-header')}>{UI.CATEGORY_EDITOR.DELETE_CONFIRMATION_TITLE}</h3>
        <p>{message}</p>
        <div className={getEnhancedComponentClasses('flex-group' as ComponentType, 'compact' as ComponentVariant, 'md' as ComponentSize, undefined)}>
          <button 
            onClick={onConfirm} 
            className={getEnhancedComponentClasses(
              COMPONENT_TYPES.BUTTON, 
              COMPONENT_VARIANTS.ERROR, 
              COMPONENT_SIZES.SM
            )} 
            data-testid="confirm-delete-btn"
          >
            {BUTTONS.DELETE}
          </button>
          <button 
            onClick={onCancel} 
            className={getEnhancedComponentClasses(
              COMPONENT_TYPES.BUTTON, 
              COMPONENT_VARIANTS.SECONDARY, 
              COMPONENT_SIZES.SM
            )} 
            data-testid="cancel-delete-btn"
          >
            {BUTTONS.CANCEL}
          </button>
        </div>
      </div>
    );
  };

  // Validare ștergere subcategorie
  const isValidDeleteRequest = (cat: string, subcat: string): boolean => {
    setError(null);
    
    if (!cat) {
      setError(MESAJE.CATEGORII.EROARE_STERGERE);
      return false;
    }
    
    const categoryObj = categories.find(c => c.name === cat);
    if (!categoryObj) {
      setError(MESAJE.CATEGORII.EROARE_STERGERE);
      return false;
    }
    
    const subcatObj = categoryObj.subcategories.find(sc => sc.name === subcat);
    if (!subcatObj) {
      setError(MESAJE.CATEGORII.EROARE_STERGERE);
      return false;
    }
    
    if (!subcatObj.isCustom) {
      setError(MESAJE.CATEGORII.NU_SE_POT_STERGE_PREDEFINITE);
      return false;
    }
    
    return true;
  };

  // validare subcategorie
  const isValidSubcat = (txt: string) =>
    txt.trim().length > 0 &&
    txt.trim().length <= 32 &&
    /^[a-zA-Z0-9ăâîșțĂÂÎȘȚ \-]+$/.test(txt.trim());

  return (
    <div 
      className={classNames(
        getEnhancedComponentClasses(COMPONENT_TYPES.MODAL_OVERLAY),
        modalClasses.modal
      )}
      role="dialog"
      aria-modal="true"
      aria-labelledby="category-editor-title"
      data-testid="category-editor-modal"
    >
      <div 
        className={classNames(
          getEnhancedComponentClasses(COMPONENT_TYPES.MODAL_CONTAINER, COMPONENT_VARIANTS.WIDE, COMPONENT_SIZES.LG),
          modalClasses.card
        )}
      >
        <div className={getEnhancedComponentClasses(COMPONENT_TYPES.MODAL_HEADER, COMPONENT_VARIANTS.DEFAULT)}>
          <h2 
            id="category-editor-title" 
            className={getEnhancedComponentClasses(COMPONENT_TYPES.MODAL_TITLE)}
          >
            {UI.CATEGORY_EDITOR.TITLE}
          </h2>
          <button 
            onClick={onClose} 
            className={getEnhancedComponentClasses(COMPONENT_TYPES.MODAL_CLOSE_BUTTON)} 
            aria-label={EXCEL_GRID.ACTIONS.CLOSE}
            data-testid="close-category-editor"
          >
            &times;
          </button>
        </div>
        <div className={getEnhancedComponentClasses(COMPONENT_TYPES.MODAL_BODY, COMPONENT_VARIANTS.DEFAULT)}>
          {error && (
            <div 
              className={getEnhancedComponentClasses(
                COMPONENT_TYPES.ALERT, 
                COMPONENT_VARIANTS.ERROR, 
                COMPONENT_SIZES.SM, 
                undefined
              )} 
              data-testid="error-message"
              role="alert"
            >
              {error}
            </div>
          )}
          <div className={getEnhancedComponentClasses(COMPONENT_TYPES.FLEX_GROUP, COMPONENT_VARIANTS.DEFAULT)}>
            <div className={getEnhancedComponentClasses(COMPONENT_TYPES.CARD_SECTION)} data-testid="categories-section">
              <h3 className={getEnhancedComponentClasses(COMPONENT_TYPES.SECTION_HEADER)}>{UI.CATEGORY_EDITOR.CATEGORIES_SECTION_TITLE}</h3>
              <div
                style={{ maxHeight: 300 }}
                className={getEnhancedComponentClasses('card-section', undefined, undefined, undefined, ['withScroll']) + ' overflow-y-auto'}
                data-testid="categories-scroll-wrapper"
              >
                <ul className={getEnhancedComponentClasses(COMPONENT_TYPES.LIST_CONTAINER, COMPONENT_VARIANTS.COMPACT)}>
                  {categories.map(cat => (
                    <li 
                      key={cat.name} 
                      className={getEnhancedComponentClasses(
                        COMPONENT_TYPES.LIST_ITEM, 
                        COMPONENT_VARIANTS.COMPACT, 
                        undefined, 
                        selectedCategory===cat.name ? COMPONENT_STATES.ACTIVE : undefined
                      )} 
                      data-testid={`category-item-${cat.name}`}
                    >
                      <button 
                        onClick={()=>{
                          setSelectedCategory(cat.name);
                          setError(null);
                          setNewSubcat('');
                        }}
                        aria-pressed={selectedCategory===cat.name}
                        aria-controls="subcategories-section"
                        data-testid={`cat-select-${cat.name}`}
                      >
                        {cat.name}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className={getEnhancedComponentClasses(COMPONENT_TYPES.CARD_SECTION)} data-testid="subcategories-section">
              {/* Dialog de confirmare ștergere, arată doar când subcatAction.type === 'delete' */}
              {subcatAction?.type === 'delete' && (
                <DeleteConfirmation
                  cat={subcatAction.cat}
                  subcat={subcatAction.subcat}
                  onConfirm={async () => {
                    try {
                      if (isValidDeleteRequest(subcatAction.cat, subcatAction.subcat)) {
                        await _deleteSubcategory(userId, subcatAction.cat, subcatAction.subcat, "delete");
                        setSubcatAction(null);
                        setError(null);
                      }
                    } catch (error) {
                      console.error('Eroare la ștergerea subcategoriei:', error);
                      setError(MESAJE.CATEGORII.EROARE_STERGERE);
                    }
                  }}
                  onCancel={() => setSubcatAction(null)}
                />
              )}
              {selectedCategory ? (
                <>
                  <h3 className={getEnhancedComponentClasses(COMPONENT_TYPES.SECTION_HEADER)}>
                    {UI.CATEGORY_EDITOR.SUBCATEGORIES_SECTION_TITLE}{' '}
                    <span className={getEnhancedComponentClasses(
                      COMPONENT_TYPES.TEXT, 
                      COMPONENT_VARIANTS.ACCENT, 
                      undefined, 
                      undefined
                    )}>
                      {selectedCategory}
                    </span>
                  </h3>
                  <div
                    style={{ maxHeight: 300 }}
                    className={getEnhancedComponentClasses('card-section', undefined, undefined, undefined, ['withScroll']) + ' overflow-y-auto'}
                    data-testid="subcategories-scroll-wrapper"
                  >
                    <ul 
                      className={getEnhancedComponentClasses(COMPONENT_TYPES.LIST_CONTAINER, COMPONENT_VARIANTS.COMPACT)}
                      aria-label={UI.CATEGORY_EDITOR.SUBCATEGORIES_SECTION_TITLE}
                    >
                      {categories.find((cat: CustomCategory)=>cat.name===selectedCategory)?.subcategories.map((sc: CustomSubcategory) => (
                        <li 
                          key={sc.name} 
                          className={getEnhancedComponentClasses(COMPONENT_TYPES.LIST_ITEM, COMPONENT_VARIANTS.COMPACT)} 
                          data-testid={`subcat-item-${sc.name}`}
                        >
                          {subcatAction?.type === 'edit' && subcatAction.cat === selectedCategory && subcatAction.subcat === sc.name ? (
                            <div className="flex w-full items-center gap-1">
                              <input
                                type="text"
                                value={renameValue}
                                onChange={(e: ChangeEvent<HTMLInputElement>) => setRenameValue(e.target.value)}
                                onKeyDown={(e: KeyboardEvent<HTMLInputElement>) => {
                                  if (e.key === 'Enter' && isValidSubcat(renameValue)) handleRename(selectedCategory, sc.name, renameValue);
                                  if (e.key === 'Escape') { setSubcatAction(null); setRenameValue(''); }
                                }}
                                autoFocus
                                className={getEnhancedComponentClasses(
                                  COMPONENT_TYPES.INPUT,
                                  undefined,
                                  COMPONENT_SIZES.MD
                                ) + ' flex-[10] rounded-md'}
                                data-testid={`rename-input-${sc.name}`}
                                maxLength={32}
                              />
                              <Button
                                variant={COMPONENT_VARIANTS.PRIMARY}
                                size={COMPONENT_SIZES.MD}
                                disabled={!isValidSubcat(renameValue)}
                                dataTestId={`confirm-rename-${sc.name}`}
                                type="button"
                                onClick={() => handleRename(selectedCategory, sc.name, renameValue)}
                                withShadow
                                className="min-w-[90px] flex-shrink-0 rounded-md"
                              >
                                {BUTTONS.DONE}
                              </Button>
                              <Button
                                variant={COMPONENT_VARIANTS.SECONDARY}
                                size={COMPONENT_SIZES.MD}
                                dataTestId={`cancel-rename-${sc.name}`}
                                type="button"
                                onClick={() => { setSubcatAction(null); setRenameValue(''); }}
                                className="min-w-[90px] flex-shrink-0 rounded-md"
                              >
                                {BUTTONS.CANCEL}
                              </Button>
                            </div>
                          ) : (
                            <>
                              <span>{sc.name}</span>
                              {sc.isCustom && (
                                <span
                                  className={getEnhancedComponentClasses(
                                    COMPONENT_TYPES.BADGE, 
                                    COMPONENT_VARIANTS.SUCCESS, 
                                    COMPONENT_SIZES.XS, 
                                    COMPONENT_STATES.PULSE
                                  )}
                                  data-testid={`custom-flag-${sc.name}`}
                                >
                                  {FLAGS.CUSTOM}
                                </span>
                              )}
                              {badge(selectedCategory, sc.name)}
                              <button
                                onClick={() => { setSubcatAction({ type: 'edit', cat: selectedCategory, subcat: sc.name }); setRenameValue(sc.name); }}
                                className={getEnhancedComponentClasses(
                                  COMPONENT_TYPES.BUTTON, 
                                  COMPONENT_VARIANTS.ACCENT, 
                                  COMPONENT_SIZES.XS, 
                                  COMPONENT_STATES.HOVER
                                )}
                                data-testid={`edit-subcat-btn-${sc.name}`}
                                aria-label={`${UI.CATEGORY_EDITOR.RENAME_BUTTON} ${sc.name}`}
                              >{UI.CATEGORY_EDITOR.RENAME_BUTTON}</button>
                              {/* Butonul de ștergere apare DOAR pentru subcategoriile personalizate (custom) */}
                              {sc.isCustom && (
                                <button 
                                  onClick={() => setSubcatAction({ type: 'delete', cat: selectedCategory, subcat: sc.name })}
                                  className={getEnhancedComponentClasses(
                                    COMPONENT_TYPES.BUTTON, 
                                    COMPONENT_VARIANTS.ERROR, 
                                    COMPONENT_SIZES.XS, 
                                    COMPONENT_STATES.HOVER
                                  )}
                                  data-testid={`delete-subcat-btn-${sc.name}`}
                                  aria-label={`${UI.CATEGORY_EDITOR.DELETE_BUTTON} ${sc.name}`}
                                >
                                  {UI.CATEGORY_EDITOR.DELETE_BUTTON}
                                </button>
                              )}
                            </>
                          )}
                        </li>
                      ))}
                    </ul>
                    <div className="flex w-full items-center gap-1">
                      <input
                        type="text"
                        value={newSubcat}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => setNewSubcat(e.target.value)}
                        onKeyDown={(e: KeyboardEvent<HTMLInputElement>) => {
                          if (e.key === 'Enter' && isValidSubcat(newSubcat)) handleAdd(categories.find(cat => cat.name === selectedCategory)!);
                          if (e.key === 'Escape') setNewSubcat('');
                        }}
                        placeholder={PLACEHOLDERS.CATEGORY_EDITOR_SUBCATEGORY}
                        className={getEnhancedComponentClasses(
                          COMPONENT_TYPES.INPUT,
                          undefined,
                          COMPONENT_SIZES.MD
                        ) + ' flex-[10] rounded-md'}
                        data-testid="add-subcat-input"
                        maxLength={32}
                      />
                      <Button
                        variant={COMPONENT_VARIANTS.PRIMARY}
                        size={COMPONENT_SIZES.MD}
                        disabled={!isValidSubcat(newSubcat)}
                        dataTestId="add-subcat-btn"
                        type="button"
                        onClick={() => {
                          const selectedCat = categories.find(cat => cat.name === selectedCategory);
                          if (selectedCat && isValidSubcat(newSubcat)) handleAdd(selectedCat);
                        }}
                        withShadow
                        className="min-w-[90px] flex-shrink-0 rounded-md"
                      >
                        {BUTTONS.ADD}
                      </Button>
                      <Button
                        variant={COMPONENT_VARIANTS.SECONDARY}
                        size={COMPONENT_SIZES.MD}
                        dataTestId="cancel-add-subcat-btn"
                        type="button"
                        onClick={() => setNewSubcat('')}
                        className="min-w-[90px] flex-shrink-0 rounded-md"
                      >
                        {BUTTONS.CANCEL}
                      </Button>
                    </div>
                  </div>
                </>
              ) : (
                <div 
                  className={getEnhancedComponentClasses(
                    COMPONENT_TYPES.ALERT, 
                    COMPONENT_VARIANTS.INFO, 
                    COMPONENT_SIZES.SM, 
                    undefined
                  )} 
                  data-testid="no-cat-msg"
                  role="status"
                >
                  {INFO.CATEGORY_EDITOR_EMPTY}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryEditor;

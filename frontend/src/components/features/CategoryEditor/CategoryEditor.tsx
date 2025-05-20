// Modal pentru gestionarea subcategoriilor: add/edit/delete/migrare, badge count, validare
// Owner: echipa FE
import React, { useState, useEffect, useCallback, useMemo, ChangeEvent, KeyboardEvent } from 'react';
import { useCategoryStore } from '../../../stores/categoryStore';
import { CustomCategory, CustomSubcategory } from '../../../types/Category';
import { BUTTONS, PLACEHOLDERS, UI, INFO, FLAGS, EXCEL_GRID } from '@shared-constants/ui';
import { MESAJE } from '@shared-constants/messages';
import { getEnhancedComponentClasses } from '../../../styles/themeUtils';
import type { ComponentType, ComponentVariant, ComponentSize, ComponentState } from '../../../styles/themeTypes';

interface Props {
  open: boolean;
  onClose: () => void;
  userId: string;
  // Proprietăți noi pentru deschidere directă în modul editare, ștergere sau adăugare
  initialCategory?: string;
  initialSubcategory?: string;
  // Mode pentru deschidere mod: edit, delete sau add
  initialMode?: 'edit' | 'delete' | 'add';
}

export const CategoryEditor: React.FC<Props> = ({ 
  open, 
  onClose, 
  userId, 
  initialCategory, 
  initialSubcategory,
  initialMode = 'add' // Valoare implicită: mod de adăugare
}) => {
  const { categories, saveCategories, renameSubcategory, deleteSubcategory: _deleteSubcategory, getSubcategoryCount } = useCategoryStore();
  
  // Folosim proprietățile inițiale pentru a preselecta categoria și subcategoria dacă sunt furnizate
  const [selectedCategory, setSelectedCategory] = useState<string | null>(
    initialCategory || null
  );
  
  // Stare unificată pentru acțiunea pe subcategorie (editare sau ștergere).
  type SubcatActionType = 'edit' | 'delete';
  interface SubcatAction { type: SubcatActionType; cat: string; subcat: string; }
  const [subcatAction, setSubcatAction] = useState<SubcatAction | null>(
    initialCategory && initialSubcategory
      ? { type: initialMode as SubcatActionType, cat: initialCategory, subcat: initialSubcategory }
      : null
  );
  const [renameValue, setRenameValue] = useState<string>(initialSubcategory || '');
  
  const [newSubcat, setNewSubcat] = useState('');
  const [error, setError] = useState<string | null>(null);
  
  // Efect pentru inițializarea corectă a modului de editare sau ștergere
  useEffect(() => {
    if (open && initialCategory && initialSubcategory) {
      // Preselecție categorie.
      setSelectedCategory(initialCategory);
      // Inițializare stare unificată pe baza valorii initialMode.
      if (initialMode === 'edit' || initialMode === 'delete') {
        setSubcatAction({ type: initialMode as SubcatActionType, cat: initialCategory, subcat: initialSubcategory });
        setRenameValue(initialMode === 'edit' ? initialSubcategory : '');
      } else if (initialMode === 'add') {
        setSubcatAction(null);
        setTimeout(() => {
          const addInput = document.querySelector('[data-testid="add-subcat-input"]');
          if (addInput instanceof HTMLInputElement) {
            addInput.focus();
          }
        }, 100);
      }
    }
  }, [open, initialCategory, initialSubcategory, initialMode]);

  if (!open) return null;

  // Helper pentru badge count
  const badge = (cat: string, subcat: string) => {
    const count = getSubcategoryCount(cat, subcat);
    return count > 0 ? (
      <span
        className={getEnhancedComponentClasses('badge' as ComponentType, 'secondary' as ComponentVariant, 'sm' as ComponentSize, undefined)}
        data-testid={`subcat-count-${cat}-${subcat}`}
      >
        {count}
      </span>
    ) : null;
  };

  // Adăugare subcategorie nouă
  const handleAdd = async (cat: CustomCategory): Promise<void> => {
    // Resetarea stării de eroare când începe o acțiune nouă
    setError(null);
    
    if (!newSubcat.trim()) return setError(MESAJE.CATEGORII.NUME_GOL);
    if (cat.subcategories.some((sc: CustomSubcategory) => sc.name.toLowerCase() === newSubcat.trim().toLowerCase())) return setError(MESAJE.CATEGORII.SUBCATEGORIE_EXISTENTA);
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
    // Resetarea stării de eroare la începutul unei noi operațiuni
    setError(null);
    
    if (!newName.trim()) return setError(MESAJE.CATEGORII.NUME_GOL);
    if (categories.find((c: CustomCategory) => c.name === cat)?.subcategories.some((sc: CustomSubcategory) => sc.name.toLowerCase() === newName.trim().toLowerCase())) return setError(MESAJE.CATEGORII.SUBCATEGORIE_EXISTENTA);
    await renameSubcategory(userId, cat, oldName, newName.trim());
    setSubcatAction(null);
    setError(null);
  };

  // Definirea interfeței explicite pentru proprietățile componentei DeleteConfirmation.
  interface DeleteConfirmationProps {
    cat: string;
    subcat: string;
    onConfirm: () => void;
    onCancel: () => void;
  }

  // Componentă internă pentru confirmarea ștergerii subcategoriei
  const DeleteConfirmation: React.FC<DeleteConfirmationProps> = ({ cat, subcat, onConfirm, onCancel }) => {
    // Folosim useEffect pentru verificări și manipularea stării
    // Prevenim astfel eroarea "Cannot update a component while rendering a different component"
    // Acest pattern respectă memoria critică despre infinite loops și Maximum update depth exceeded
    useEffect(() => {
      // Verificare de siguranță: confirmăm că este o subcategorie personalizată
      const categoryObj = categories.find(c => c.name === cat);
      const subcatObj = categoryObj?.subcategories.find(sc => sc.name === subcat);
      
      // Dacă nu este custom, închide dialogul de ștergere și afișează eroare
      if (subcatObj && !subcatObj.isCustom) {
        setError(MESAJE.CATEGORII.NU_SE_POT_STERGE_PREDEFINITE);
        onCancel();
      }
    }, [cat, subcat, categories, onCancel]); // Dependăm de toate datele folosite în efect
    
    // Count pentru a arăta câte tranzacții vor fi afectate
    const count = getSubcategoryCount(cat, subcat);
    
    return (
      <div className={getEnhancedComponentClasses('alert' as ComponentType, 'error' as ComponentVariant, 'sm' as ComponentSize, undefined)} data-testid={`delete-confirm-${cat}-${subcat}`}>
        <h3 className={getEnhancedComponentClasses('section-header' as ComponentType, undefined, undefined, undefined)}>{UI.CATEGORY_EDITOR.DELETE_CONFIRMATION_TITLE}</h3>
        <p className={getEnhancedComponentClasses('spacing' as ComponentType, 'small' as ComponentVariant, undefined, undefined)}>{UI.CATEGORY_EDITOR.DELETE_CONFIRMATION_TEXT.replace('{subcat}', subcat).replace('{cat}', cat)}</p>
        
        {count > 0 && (
          <p className={`${getEnhancedComponentClasses('spacing' as ComponentType, 'small' as ComponentVariant, undefined, undefined)} ${getEnhancedComponentClasses('form-error-message' as ComponentType, undefined, undefined, undefined)}`} data-testid={`delete-warning-${cat}-${subcat}`}>
            {UI.CATEGORY_EDITOR.DELETE_WARNING.replace('{count}', count.toString())}
          </p>
        )}
        
        <div className={getEnhancedComponentClasses('flex-group' as ComponentType, 'compact' as ComponentVariant, 'md' as ComponentSize, undefined)}>
          <button
            onClick={onConfirm}
            className={getEnhancedComponentClasses('button' as ComponentType, 'error' as ComponentVariant, 'sm' as ComponentSize, undefined)}
            data-testid={`confirm-delete-${cat}-${subcat}`}
          >
            {UI.CATEGORY_EDITOR.CONFIRM_DELETE_BUTTON}
          </button>
          <button
            onClick={onCancel}
            className={getEnhancedComponentClasses('button' as ComponentType, 'secondary' as ComponentVariant, 'sm' as ComponentSize, undefined)}
            data-testid={`cancel-delete-${cat}-${subcat}`}
          >
            {UI.CATEGORY_EDITOR.CANCEL_BUTTON}
          </button>
        </div>
      </div>
    );
  };

  // Funcție helper pentru navigare cu tastatura (accesibilitate)
  const handleKeyboardNavigation = (e: KeyboardEvent<HTMLElement>, action: () => void) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      action();
    }
  };
  
  // Ștergere subcategorie cu confirmare modal în loc de window.confirm()
  const handleDelete = useCallback(async (cat: string, subcat: string) => {
    try {
      // Resetăm eroarea la începutul operațiunii
      setError(null);
      
      // Verificare de siguranță: categoria există?
      if (!cat) {
        setError(MESAJE.CATEGORII.EROARE_STERGERE);
        return;
      }
      
      // Verificare de siguranță: avem subcategoria în lista curentă?
      const categoryObj = categories.find(c => c.name === cat);
      if (!categoryObj) {
        setError(MESAJE.CATEGORII.EROARE_STERGERE);
        return;
      }
      
      const subcatObj = categoryObj.subcategories.find(sc => sc.name === subcat);
      if (!subcatObj) {
        setError(MESAJE.CATEGORII.EROARE_STERGERE);
        return;
      }
      
      // Verificare de siguranță: putem șterge doar subcategorii personalizate
      if (!subcatObj.isCustom) {
        setError(MESAJE.CATEGORII.NU_SE_POT_STERGE_PREDEFINITE);
        return;
      }
      
      // Dacă toate verificările au trecut, arătăm dialogul de confirmare
      setSubcatAction({ type: 'delete', cat, subcat });
    } catch (error) {
      // Gestionăm orice eroare neașteptată
      console.error('Eroare la procesarea ștergerii:', error);
      setError(MESAJE.CATEGORII.EROARE_STERGERE);
    }
  }, [categories, setError, setSubcatAction]);

  return (
    <div className={getEnhancedComponentClasses('modal' as ComponentType)} data-testid="category-editor-modal">
      <div className={getEnhancedComponentClasses('card', 'elevated', 'lg')}>
        <button className={getEnhancedComponentClasses('button' as ComponentType, 'ghost' as ComponentVariant, 'sm' as ComponentSize, undefined)} onClick={onClose} data-testid="close-editor">{EXCEL_GRID.ACTIONS.CLOSE}</button>
        <h2 className={getEnhancedComponentClasses('section-header' as ComponentType, undefined, undefined, undefined)}>{UI.CATEGORY_EDITOR.TITLE}</h2>
        {error && <div className={getEnhancedComponentClasses('alert' as ComponentType, 'error' as ComponentVariant, 'sm' as ComponentSize, undefined)} data-testid="error-msg">{error}</div>}
        <div className={getEnhancedComponentClasses('flex', undefined, undefined, undefined, ['gap-6'])}>
          <div className={getEnhancedComponentClasses('card-section' as unknown as ComponentType)} data-testid="categories-section">
            <h3 className={getEnhancedComponentClasses('section-header')}>{UI.CATEGORY_EDITOR.CATEGORIES_SECTION_TITLE}</h3>
            <ul className={getEnhancedComponentClasses('list-container' as unknown as ComponentType)}>
              {categories.map(cat => (
                <li key={cat.name} className={getEnhancedComponentClasses('list-item' as unknown as ComponentType, undefined, undefined, selectedCategory===cat.name ? 'active' as ComponentState : undefined)} data-testid={`category-item-${cat.name}`}>
                  <button 
                    onClick={()=>{
                      setSelectedCategory(cat.name);
                      // Resetăm erorile când utilizatorul schimbă categoria
                      setError(null);
                      // Resetăm inputul pentru subcategorie nouă pentru experiență mai bună
                      setNewSubcat('');
                    }}
                    aria-selected={selectedCategory===cat.name}
                    aria-controls="subcategories-section"
                    data-testid={`cat-select-${cat.name}`}
                  >
                    {cat.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>
          <div className={getEnhancedComponentClasses('card-section' as unknown as ComponentType)} data-testid="subcategories-section">
            {/* Dialog de confirmare ștergere, arată doar când deleteMode=true și avem deletingSubcat setat */}
            {subcatAction?.type === 'delete' && (
              <DeleteConfirmation
                cat={subcatAction.cat}
                subcat={subcatAction.subcat}
                onConfirm={() => { handleDelete(subcatAction.cat, subcatAction.subcat); setSubcatAction(null); }}
                onCancel={() => setSubcatAction(null)}
              />
            )}
            
            {selectedCategory ? (
              <>
                <h3 className={getEnhancedComponentClasses('section-header' as ComponentType, undefined, undefined, undefined)}>{UI.CATEGORY_EDITOR.SUBCATEGORIES_SECTION_TITLE}{' '}<span className={getEnhancedComponentClasses('text' as ComponentType, 'accent' as ComponentVariant, undefined, undefined)}>{selectedCategory}</span></h3>
                <ul className={getEnhancedComponentClasses('list-container' as unknown as ComponentType)}
                  role="list"
                  aria-label={UI.CATEGORY_EDITOR.SUBCATEGORIES_SECTION_TITLE}>
                
                  {categories.find((cat: CustomCategory)=>cat.name===selectedCategory)?.subcategories.map((sc: CustomSubcategory) => (
                    <li key={sc.name} className={getEnhancedComponentClasses('list-item' as unknown as ComponentType)} data-testid={`subcat-item-${sc.name}`}>
                      {subcatAction?.type === 'edit' && subcatAction.cat === selectedCategory && subcatAction.subcat === sc.name ? (
                        <div className={getEnhancedComponentClasses('input-group' as ComponentType, 'inline' as ComponentVariant, 'md' as ComponentSize, undefined)}>
                          <input
                            type="text"
                            value={renameValue}
                            onChange={(e: ChangeEvent<HTMLInputElement>) => setRenameValue(e.target.value)}
                            onKeyDown={(e: KeyboardEvent<HTMLInputElement>) => {
                              if (e.key === 'Enter') { handleRename(selectedCategory, sc.name, renameValue.trim()); setSubcatAction(null); }
                              if (e.key === 'Escape') setSubcatAction(null);
                            }}
                            className={getEnhancedComponentClasses('input' as ComponentType, undefined, 'sm' as ComponentSize)}
                            autoFocus
                            data-testid={`edit-subcat-input-${sc.name}`}
                          />
                          <button
                            onClick={() => { handleRename(selectedCategory, sc.name, renameValue.trim()); setSubcatAction(null); }}
                            className={getEnhancedComponentClasses('button' as ComponentType, 'success' as ComponentVariant, 'xs' as ComponentSize, 'hover' as ComponentState)}
                            data-testid={`confirm-rename-${sc.name}`}
                          >{BUTTONS.DONE}</button>
                          <button
                            onClick={() => setSubcatAction(null)}
                            className={getEnhancedComponentClasses('button' as ComponentType, 'secondary' as ComponentVariant, 'xs' as ComponentSize, 'hover' as ComponentState)}
                            data-testid={`cancel-rename-${sc.name}`}
                          >{BUTTONS.CANCEL}</button>
                        </div>
                      ) : (
                        <>
                          <span>{sc.name}</span>
                          {sc.isCustom && (
                            <span
                              className={getEnhancedComponentClasses('badge' as ComponentType, 'success' as ComponentVariant, 'xs' as ComponentSize, 'pulse' as ComponentState)}
                              data-testid={`custom-flag-${sc.name}`}
                            >
                              {FLAGS.CUSTOM}
                            </span>
                          )}
                          {badge(selectedCategory, sc.name)}
                          <button
                            onClick={() => { setSubcatAction({ type: 'edit', cat: selectedCategory, subcat: sc.name }); setRenameValue(sc.name); }}
                            onKeyDown={(e) => handleKeyboardNavigation(e, () => { setSubcatAction({ type: 'edit', cat: selectedCategory, subcat: sc.name }); setRenameValue(sc.name); })}
                            className={getEnhancedComponentClasses('button' as ComponentType, 'accent' as ComponentVariant, 'xs' as ComponentSize, 'hover' as ComponentState)}
                            data-testid={`edit-subcat-btn-${sc.name}`}
                            aria-label={`${UI.CATEGORY_EDITOR.RENAME_BUTTON} ${sc.name}`}
                          >{UI.CATEGORY_EDITOR.RENAME_BUTTON}</button>
                          {/* Butonul de ștergere apare DOAR pentru subcategoriile personalizate (custom) */}
                          {sc.isCustom && (
                            <button 
                              onClick={()=>handleDelete(selectedCategory, sc.name)}
                              onKeyDown={(e) => handleKeyboardNavigation(e, () => handleDelete(selectedCategory, sc.name))}
                              className={getEnhancedComponentClasses('button' as ComponentType, 'error' as ComponentVariant, 'xs' as ComponentSize, 'hover' as ComponentState)}
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
                <div className={getEnhancedComponentClasses('flex-group' as ComponentType, 'compact' as ComponentVariant, 'md' as ComponentSize, undefined)}>
                  <input
                    type="text"
                    value={newSubcat}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setNewSubcat(e.target.value)}
                    onKeyDown={(e: KeyboardEvent<HTMLInputElement>) => {
                      if (e.key === 'Enter') handleAdd(categories.find(cat => cat.name === selectedCategory)!);
                      if (e.key === 'Escape') setNewSubcat('');
                    }}
                    placeholder={PLACEHOLDERS.CATEGORY_EDITOR_SUBCATEGORY}
                    className={getEnhancedComponentClasses('input' as ComponentType, undefined, 'sm' as ComponentSize)}
                    data-testid="add-subcat-input"
                  />
                  <button onClick={()=>handleAdd(categories.find(cat=>cat.name===selectedCategory)!)} className={getEnhancedComponentClasses('button' as ComponentType, 'primary' as ComponentVariant, 'sm' as ComponentSize)} data-testid="add-subcat-btn">{BUTTONS.ADD}</button>
                </div>
              </>
            ) : (
              <div className={getEnhancedComponentClasses('alert' as ComponentType, 'info' as ComponentVariant, 'sm' as ComponentSize, undefined)} data-testid="no-cat-msg">{INFO.CATEGORY_EDITOR_EMPTY}</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryEditor;

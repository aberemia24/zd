// Modal pentru gestionarea subcategoriilor: add/edit/delete/migrare, badge count, validare
// Owner: echipa FE
import React, { useState, useEffect, ChangeEvent, KeyboardEvent } from 'react';
import { useCategoryStore } from '../../../stores/categoryStore';
import { CustomCategory, CustomSubcategory } from '../../../types/Category';
import { BUTTONS } from '@shared-constants';
import { getEnhancedComponentClasses } from '../../../styles/themeUtils';
import type { ComponentType, ComponentVariant, ComponentSize } from '../../../styles/themeTypes';

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
  const { categories, saveCategories, renameSubcategory, deleteSubcategory, getSubcategoryCount } = useCategoryStore();
  
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
    return count > 0 ? <span className="ml-2 px-2 py-0.5 bg-secondary-200 text-secondary-700 text-xs rounded-token" data-testid={`subcat-count-${cat}-${subcat}`}>{count}</span> : null;
  };

  // Adăugare subcategorie nouă
  const handleAdd = async (cat: CustomCategory): Promise<void> => {
    if (!newSubcat.trim()) return setError('Numele nu poate fi gol');
    if (cat.subcategories.some((sc: CustomSubcategory) => sc.name.toLowerCase() === newSubcat.trim().toLowerCase())) return setError('Există deja o subcategorie cu acest nume');
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
    if (!newName.trim()) return setError('Numele nu poate fi gol');
    if (categories.find((c: CustomCategory) => c.name === cat)?.subcategories.some((sc: CustomSubcategory) => sc.name.toLowerCase() === newName.trim().toLowerCase())) return setError('Există deja o subcategorie cu acest nume');
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
        setError('Nu se pot șterge subcategoriile predefinite, doar cele personalizate.');
        onCancel();
      }
    }, [cat, subcat, categories]); // Dependăm de toate datele folosite în efect
    
    // Count pentru a arăta câte tranzacții vor fi afectate
    const count = getSubcategoryCount(cat, subcat);
    
    return (
      <div className="p-token bg-error-50 border border-error-200 rounded-token mb-token" data-testid={`delete-confirm-${cat}-${subcat}`}>
        <h3 className="text-lg font-semibold text-error-700 mb-token">Confirmare ștergere</h3>
        <p className="mb-2">Ești sigur că vrei să ștergi subcategoria <strong>{subcat}</strong> din <strong>{cat}</strong>?</p>
        
        {count > 0 && (
          <p className="mb-2 text-error-600" data-testid={`delete-warning-${cat}-${subcat}`}>
            Atenție: Există <strong>{count}</strong> tranzacții care folosesc această subcategorie. 
            Acestea vor fi mutate în categoria principală.
          </p>
        )}
        
        <div className="flex gap-2 mt-token">
          <button 
            onClick={onConfirm}
            className="btn btn-error"
            data-testid={`confirm-delete-${cat}-${subcat}`}
          >
            Confirmă ștergerea
          </button>
          <button 
            onClick={onCancel}
            className="btn btn-secondary"
            data-testid={`cancel-delete-${cat}-${subcat}`}
          >
            Anulează
          </button>
        </div>
      </div>
    );
  };

  // Ștergere subcategorie cu confirmare modal în loc de window.confirm()
  const handleDelete = async (cat: string, subcat: string): Promise<void> => {
    // IMPORTANT: Setam subcategoria pentru ștergere în variabila separată
    // și ne asigurăm că modul de editare este dezactivat
    
    // Verificare de siguranță: putem șterge doar subcategorii personalizate
    const categoryObj = categories.find(c => c.name === cat);
    const subcatObj = categoryObj?.subcategories.find(sc => sc.name === subcat);
    
    if (!subcatObj?.isCustom) {
      setError('Nu se pot șterge subcategoriile predefinite, doar cele personalizate.');
      return;
    }
    
    setSubcatAction({ type: 'delete', cat, subcat });
  };

  return (
    <div className={getEnhancedComponentClasses('modal' as ComponentType, 'overlay' as ComponentVariant)} data-testid="category-editor-modal">
      <div className={getEnhancedComponentClasses('card' as ComponentType, 'elevated' as ComponentVariant, 'lg' as ComponentSize)}>
        <button className={getEnhancedComponentClasses('button' as ComponentType, 'ghost' as ComponentVariant, 'sm' as ComponentSize)} onClick={onClose} data-testid="close-editor">✕</button>
        <h2 className="text-xl font-bold mb-token text-headings">Gestionare Subcategorii</h2>
        {error && <div className="text-error mb-token" data-testid="error-msg">{error}</div>}
        <div className="flex gap-6">
          <div className="w-1/3 border-r border-secondary-200 pr-4">
            <h3 className="font-semibold mb-token text-headings-secondary">Categorii</h3>
            <ul>
              {categories.map(cat => (
                <li key={cat.name} className={"mb-2 "+(selectedCategory===cat.name?"font-bold text-accent":"text-secondary-700 hover:text-accent")}>
                  <button onClick={()=>setSelectedCategory(cat.name)} data-testid={`cat-select-${cat.name}`}>{cat.name}</button>
                </li>
              ))}
            </ul>
          </div>
          <div className="flex-1">
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
                <h3 className="font-semibold mb-token text-headings-secondary">Subcategorii pentru <span className="text-accent">{selectedCategory}</span></h3>
                <ul>
                  {categories.find((cat: CustomCategory)=>cat.name===selectedCategory)?.subcategories.map((sc: CustomSubcategory) => (
                    <li key={sc.name} className="flex items-center gap-2 mb-1">
                      {subcatAction?.type === 'edit' && subcatAction.cat === selectedCategory && subcatAction.subcat === sc.name ? (
                        <div className="flex gap-2 items-center">
                          <input
                            type="text"
                            value={renameValue}
                            onChange={(e: ChangeEvent<HTMLInputElement>) => setRenameValue(e.target.value)}
                            onKeyDown={(e: KeyboardEvent<HTMLInputElement>) => {
                              if (e.key === 'Enter') { handleRename(selectedCategory, sc.name, renameValue.trim()); setSubcatAction(null); }
                              if (e.key === 'Escape') setSubcatAction(null);
                            }}
                            className="input-field input-sm"
                            autoFocus
                            data-testid={`edit-subcat-input-${sc.name}`}
                          />
                          <button
                            onClick={() => { handleRename(selectedCategory, sc.name, renameValue.trim()); setSubcatAction(null); }}
                            className="text-xs text-success-600 hover:text-success-700"
                            data-testid={`confirm-rename-${sc.name}`}
                          >{BUTTONS.DONE}</button>
                          <button
                            onClick={() => setSubcatAction(null)}
                            className="text-xs text-secondary-500 hover:text-secondary-600"
                            data-testid={`cancel-rename-${sc.name}`}
                          >{BUTTONS.CANCEL}</button>
                        </div>
                      ) : (
                        <>
                          <span>{sc.name}</span>
                          {sc.isCustom && <span className="ml-1 text-success-600 text-xs" data-testid={`custom-flag-${sc.name}`}>custom</span>}
                          {badge(selectedCategory, sc.name)}
                          <button
                            onClick={() => { setSubcatAction({ type: 'edit', cat: selectedCategory, subcat: sc.name }); setRenameValue(sc.name); }}
                            className="ml-2 text-accent text-xs hover:text-accent-hover"
                            data-testid={`edit-subcat-btn-${sc.name}`}
                          >Redenumește</button>
                          {/* Butonul de ștergere apare DOAR pentru subcategoriile personalizate (custom) */}
                          {sc.isCustom && (
                            <button 
                              onClick={()=>handleDelete(selectedCategory, sc.name)} 
                              className="ml-1 text-error-600 text-xs hover:text-error-700" 
                              data-testid={`delete-subcat-btn-${sc.name}`}
                            >
                              Șterge
                            </button>
                          )}
                        </>
                      )}
                    </li>
                  ))}
                </ul>
                <div className="flex items-center gap-2 mt-token">
                  <input
                    type="text"
                    value={newSubcat}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setNewSubcat(e.target.value)}
                    onKeyDown={(e: KeyboardEvent<HTMLInputElement>) => {
                      if (e.key === 'Enter') handleAdd(categories.find(cat => cat.name === selectedCategory)!);
                      if (e.key === 'Escape') setNewSubcat('');
                    }}
                    placeholder="Adaugă subcategorie nouă"
                    className="input-field flex-1"
                    data-testid="add-subcat-input"
                  />
                  <button onClick={()=>handleAdd(categories.find(cat=>cat.name===selectedCategory)!)} className="btn btn-primary" data-testid="add-subcat-btn">Adaugă</button>
                </div>
              </>
            ) : (
              <div className="text-secondary-500">Selectează o categorie pentru a vedea și edita subcategoriile.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryEditor;

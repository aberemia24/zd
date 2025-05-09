// Modal pentru gestionarea subcategoriilor: add/edit/delete/migrare, badge count, validare
// Owner: echipa FE
import React, { useState } from 'react';
import { useCategoryStore } from '../../../stores/categoryStore';
import { CustomCategory, CustomSubcategory } from '../../../types/Category';

interface Props {
  open: boolean;
  onClose: () => void;
  userId: string;
  // Proprietăți noi pentru deschidere directă în modul editare sau ștergere
  initialCategory?: string; 
  initialSubcategory?: string;
  // Mode pentru a deschide direct în modul de editare sau ștergere
  initialMode?: 'edit' | 'delete';
}

export const CategoryEditor: React.FC<Props> = ({ 
  open, 
  onClose, 
  userId, 
  initialCategory, 
  initialSubcategory,
  initialMode = 'edit' // Valoare implicită: mod de editare
}) => {
  const { categories, saveCategories, renameSubcategory, deleteSubcategory, getSubcategoryCount } = useCategoryStore();
  
  // Folosim proprietățile inițiale pentru a preselecta categoria și subcategoria dacă sunt furnizate
  const [selectedCategory, setSelectedCategory] = useState<string | null>(
    initialCategory || null
  );
  
  // Stare pentru subcategoria care este în curs de editare/redenumire
  const [editingSubcat, setEditingSubcat] = useState<{cat: string, subcat: string} | null>(
    initialCategory && initialSubcategory && initialMode === 'edit' ? 
      { cat: initialCategory, subcat: initialSubcategory } : 
      null
  );
  
  // Stare SEPARATĂ pentru subcategoria care este în curs de ștergere
  // Această separare previne conflictul între dialog ștergere și input editare
  const [deletingSubcat, setDeletingSubcat] = useState<{cat: string, subcat: string} | null>(
    initialCategory && initialSubcategory && initialMode === 'delete' ? 
      { cat: initialCategory, subcat: initialSubcategory } : 
      null
  );
  
  // State pentru modul de ștergere (pentru a arăta direct dialogul de confirmare ștergere)
  const [deleteMode, setDeleteMode] = useState<boolean>(
    initialMode === 'delete' && !!initialCategory && !!initialSubcategory
  );
  
  const [newSubcat, setNewSubcat] = useState('');
  const [error, setError] = useState<string | null>(null);
  
  // Efect pentru inițializarea corectă a modului de editare sau ștergere
  React.useEffect(() => {
    if (open && initialCategory && initialSubcategory) {
      // Pre-selectăm categoria în orice caz
      setSelectedCategory(initialCategory);
      
      // Gestionăm modul în funcție de initialMode
      if (initialMode === 'edit') {
        setEditingSubcat({ cat: initialCategory, subcat: initialSubcategory });
        setDeletingSubcat(null);
        setDeleteMode(false);
      } else if (initialMode === 'delete') {
        setDeleteMode(true);
        // IMPORTANT: Separație clară între modurile de editare și ștergere
        setEditingSubcat(null); // Dezactivare mod editare
        setDeletingSubcat({ cat: initialCategory, subcat: initialSubcategory }); // Activare mod ștergere
      }
    }
  }, [open, initialCategory, initialSubcategory, initialMode]);

  if (!open) return null;

  // Helper pentru badge count
  const badge = (cat: string, subcat: string) => {
    const count = getSubcategoryCount(cat, subcat);
    return count > 0 ? <span className="ml-2 px-2 py-0.5 bg-gray-200 text-xs rounded" data-testid={`subcat-count-${cat}-${subcat}`}>{count}</span> : null;
  };

  // Adăugare subcategorie nouă
  const handleAdd = async (cat: CustomCategory) => {
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
  const handleRename = async (cat: string, oldName: string, newName: string) => {
    if (!newName.trim()) return setError('Numele nu poate fi gol');
    if (categories.find((c: CustomCategory) => c.name === cat)?.subcategories.some((sc: CustomSubcategory) => sc.name.toLowerCase() === newName.trim().toLowerCase())) return setError('Există deja o subcategorie cu acest nume');
    await renameSubcategory(userId, cat, oldName, newName.trim());
    setEditingSubcat(null);
    setError(null);
  };

  // Componentă internă pentru confirmarea ștergerii subcategoriei
  const DeleteConfirmation = ({ cat, subcat }: { cat: string, subcat: string }) => {
    // Folosim useEffect pentru verificări și manipularea stării
    // Prevenim astfel eroarea "Cannot update a component while rendering a different component"
    // Acest pattern respectă memoria critică despre infinite loops și Maximum update depth exceeded
    React.useEffect(() => {
      // Verificare de siguranță: confirmăm că este o subcategorie personalizată
      const categoryObj = categories.find(c => c.name === cat);
      const subcatObj = categoryObj?.subcategories.find(sc => sc.name === subcat);
      
      // Dacă nu este custom, închide dialogul de ștergere și afișează eroare
      if (subcatObj && !subcatObj.isCustom) {
        setError('Nu se pot șterge subcategoriile predefinite, doar cele personalizate.');
        setDeleteMode(false);
        setDeletingSubcat(null);
      }
    }, [cat, subcat, categories]); // Dependăm de toate datele folosite în efect
    
    // Count pentru a arăta câte tranzacții vor fi afectate
    const count = getSubcategoryCount(cat, subcat);
    
    const handleConfirmDelete = async () => {
      try {
        await deleteSubcategory(userId, cat, subcat, 'delete');
        // Resetăm starea după ștergere
        setDeleteMode(false);
        // Resetăm explicit starea de ștergere și editare pentru a preveni orice conflict
        setDeletingSubcat(null);
        setEditingSubcat(null);
        
        if (initialMode === 'delete') {
          // Închide modalul complet dacă a fost deschis direct pentru ștergere
          onClose();
        }
        setError(null);
      } catch (err) {
        setError('Eroare la ștergerea subcategoriei');
        console.error('Error deleting subcategory:', err);
      }
    };
    
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg mb-4" data-testid={`delete-confirm-${cat}-${subcat}`}>
        <h3 className="text-lg font-semibold text-red-700 mb-2">Confirmare ștergere</h3>
        <p className="mb-2">Ești sigur că vrei să ștergi subcategoria <strong>{subcat}</strong> din <strong>{cat}</strong>?</p>
        
        {count > 0 && (
          <p className="mb-2 text-red-600" data-testid={`delete-warning-${cat}-${subcat}`}>
            Atenție: Există <strong>{count}</strong> tranzacții care folosesc această subcategorie. 
            Acestea vor fi mutate în categoria principală.
          </p>
        )}
        
        <div className="flex gap-2 mt-4">
          <button 
            onClick={handleConfirmDelete}
            className="bg-red-600 text-white px-4 py-1 rounded hover:bg-red-700"
            data-testid={`confirm-delete-${cat}-${subcat}`}
          >
            Confirmă ștergerea
          </button>
          <button 
            onClick={() => {
              // Resetare completă a stării de ștergere
              setDeleteMode(false);
              setDeletingSubcat(null);
              
              if (initialMode === 'delete') {
                onClose();
              }
            }}
            className="border border-gray-300 px-4 py-1 rounded hover:bg-gray-100"
            data-testid={`cancel-delete-${cat}-${subcat}`}
          >
            Anulează
          </button>
        </div>
      </div>
    );
  };
  
  // Ștergere subcategorie cu confirmare modal în loc de window.confirm()
  const handleDelete = async (cat: string, subcat: string) => {
    // IMPORTANT: Setam subcategoria pentru ștergere în variabila separată
    // și ne asigurăm că modul de editare este dezactivat
    
    // Verificare de siguranță: putem șterge doar subcategorii personalizate
    const categoryObj = categories.find(c => c.name === cat);
    const subcatObj = categoryObj?.subcategories.find(sc => sc.name === subcat);
    
    if (!subcatObj?.isCustom) {
      setError('Nu se pot șterge subcategoriile predefinite, doar cele personalizate.');
      return;
    }
    
    setEditingSubcat(null); // Dezactivăm explicit modul de editare
    setDeletingSubcat({ cat, subcat }); // Setam subcategoria pentru dialog ștergere
    setDeleteMode(true);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50" data-testid="category-editor-modal">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-2xl relative">
        <button className="absolute top-2 right-2" onClick={onClose} data-testid="close-editor">✕</button>
        <h2 className="text-xl font-bold mb-4">Gestionare Subcategorii</h2>
        {error && <div className="text-red-500 mb-2" data-testid="error-msg">{error}</div>}
        <div className="flex gap-6">
          <div className="w-1/3 border-r pr-4">
            <h3 className="font-semibold mb-2">Categorii</h3>
            <ul>
              {categories.map(cat => (
                <li key={cat.name} className={"mb-2 "+(selectedCategory===cat.name?"font-bold text-blue-600":"")}>
                  <button onClick={()=>setSelectedCategory(cat.name)} data-testid={`cat-select-${cat.name}`}>{cat.name}</button>
                </li>
              ))}
            </ul>
          </div>
          <div className="flex-1">
            {/* Dialog de confirmare ștergere, arată doar când deleteMode=true și avem deletingSubcat setat */}
            {deleteMode && deletingSubcat && (
              <DeleteConfirmation cat={deletingSubcat.cat} subcat={deletingSubcat.subcat} />
            )}
            
            {selectedCategory ? (
              <>
                <h3 className="font-semibold mb-2">Subcategorii pentru <span className="text-blue-600">{selectedCategory}</span></h3>
                <ul>
                  {categories.find((cat: CustomCategory)=>cat.name===selectedCategory)?.subcategories.map((sc: CustomSubcategory) => (
                    <li key={sc.name} className="flex items-center gap-2 mb-1">
                      {editingSubcat?.cat===selectedCategory && editingSubcat.subcat===sc.name ? (
                        <>
                          <input
                            type="text"
                            defaultValue={sc.name}
                            onBlur={e=>handleRename(selectedCategory, sc.name, e.target.value)}
                            className="border px-2 py-1 rounded"
                            autoFocus
                            data-testid={`edit-subcat-input-${sc.name}`}
                          />
                          <button onClick={()=>setEditingSubcat(null)} className="text-xs text-gray-500">Anulează</button>
                        </>
                      ) : (
                        <>
                          <span>{sc.name}</span>
                          {sc.isCustom && <span className="ml-1 text-green-600 text-xs" data-testid={`custom-flag-${sc.name}`}>custom</span>}
                          {badge(selectedCategory, sc.name)}
                          <button onClick={()=>setEditingSubcat({cat:selectedCategory,subcat:sc.name})} className="ml-2 text-blue-600 text-xs" data-testid={`edit-subcat-btn-${sc.name}`}>Redenumește</button>
                          {/* Butonul de ștergere apare DOAR pentru subcategoriile personalizate (custom) */}
                          {sc.isCustom && (
                            <button 
                              onClick={()=>handleDelete(selectedCategory, sc.name)} 
                              className="ml-1 text-red-600 text-xs" 
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
                <div className="flex items-center gap-2 mt-4">
                  <input
                    type="text"
                    value={newSubcat}
                    onChange={e=>setNewSubcat(e.target.value)}
                    placeholder="Adaugă subcategorie nouă"
                    className="border px-2 py-1 rounded flex-1"
                    data-testid="add-subcat-input"
                  />
                  <button onClick={()=>handleAdd(categories.find(cat=>cat.name===selectedCategory)!)} className="bg-blue-600 text-white px-3 py-1 rounded" data-testid="add-subcat-btn">Adaugă</button>
                </div>
              </>
            ) : (
              <div className="text-gray-500">Selectează o categorie pentru a vedea și edita subcategoriile.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryEditor;

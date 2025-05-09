// Modal pentru gestionarea subcategoriilor: add/edit/delete/migrare, badge count, validare
// Owner: echipa FE
import React, { useState } from 'react';
import { useCategoryStore } from '../../../stores/categoryStore';
import { CustomCategory, CustomSubcategory } from '../../../types/Category';

interface Props {
  open: boolean;
  onClose: () => void;
  userId: string;
}

export const CategoryEditor: React.FC<Props> = ({ open, onClose, userId }) => {
  const { categories, saveCategories, renameSubcategory, deleteSubcategory, getSubcategoryCount } = useCategoryStore();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [editingSubcat, setEditingSubcat] = useState<{cat: string, subcat: string} | null>(null);
  const [newSubcat, setNewSubcat] = useState('');
  const [error, setError] = useState<string | null>(null);

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

  // Ștergere subcategorie (simplificat, fără migrare pentru MVP skeleton)
  const handleDelete = async (cat: string, subcat: string) => {
    if (!window.confirm('Sigur vrei să ștergi această subcategorie?')) return;
    await deleteSubcategory(userId, cat, subcat, 'delete');
    setError(null);
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
                          <button onClick={()=>handleDelete(selectedCategory, sc.name)} className="ml-1 text-red-600 text-xs" data-testid={`delete-subcat-btn-${sc.name}`}>Șterge</button>
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

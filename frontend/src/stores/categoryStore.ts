// Zustand store pentru gestionarea categoriilor personalizate (fuziune cu predefinite, acțiuni CRUD)
// Owner: echipa FE
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CustomCategoriesPayload, CustomCategory } from '../types/Category';
import { categoryService } from '../services/categoryService';
import { useTransactionStore } from './transactionStore';

interface CategoryStoreState {
  categories: CustomCategory[];
  version: number;
  loading: boolean;
  error: string | null;
  loadUserCategories: (userId: string) => Promise<void>;
  saveCategories: (userId: string, categories: CustomCategory[]) => Promise<void>;
  renameSubcategory: (userId: string, category: string, oldName: string, newName: string) => Promise<boolean>;
  deleteSubcategory: (userId: string, category: string, subcategory: string, action: 'migrate' | 'delete', target?: string) => Promise<boolean>;
  mergeWithDefaults: (defaults: CustomCategory[]) => void;
  // Pentru badge statistici
  getSubcategoryCount: (category: string, subcategory: string) => number;
}

export const useCategoryStore = create<CategoryStoreState>()(
  persist(
    (set, get) => ({
      categories: [],
      version: 1,
      loading: false,
      error: null,

      async loadUserCategories(userId) {
        if (!userId) {
          console.warn('[categoryStore] loadUserCategories: utilizator neautentificat');
          return;
        }
        
        set({ loading: true, error: null });
        
        try {
          const data = await categoryService.getUserCategories(userId);
          
          // Validare - ne asigurăm că data.categories este întotdeauna un array
          if (data && Array.isArray(data.categories)) {
            set({ 
              categories: data.categories, 
              version: data.version || 1, 
              loading: false,
              error: null
            });
            console.log(`[categoryStore] ${data.categories.length} categorii încărcate cu succes`);
          } else {
            // Initializăm cu array gol dacă nu avem date valide
            set({ 
              categories: [], 
              version: 1, 
              loading: false,
              error: null
            });
            console.log('[categoryStore] Nici o categorie nu a fost găsită, se începe cu lista goală');
          }
        } catch (err) {
          console.error('[categoryStore] Eroare la încărcarea categoriilor:', err);
          set({ 
            loading: false, 
            error: 'Nu s-au putut încărca categoriile. Verifică conexiunea.' 
          });
        }
      },

      async saveCategories(userId, categories) {
        set({ loading: true, error: null });
        const ok = await categoryService.saveUserCategories(userId, { categories, version: get().version + 1 });
        if (ok) {
          set({ categories, version: get().version + 1, loading: false });
        } else {
          set({ loading: false, error: 'Eroare la salvarea categoriilor.' });
        }
      },

      async renameSubcategory(userId, category, oldName, newName) {
        // Update store + backend + tranzacții
        const cats = get().categories.map(cat =>
          cat.name === category
            ? {
                ...cat,
                subcategories: cat.subcategories.map(sc =>
                  sc.name === oldName ? { ...sc, name: newName } : sc
                ),
              }
            : cat
        );
        await categoryService.saveUserCategories(userId, { categories: cats, version: get().version + 1 });
        await categoryService.updateTransactionsForSubcategoryRename(userId, category, oldName, newName);
        set({ categories: cats, version: get().version + 1 });
        return true;
      },

      async deleteSubcategory(userId, category, subcategory, action, target) {
        // Update store + backend + tranzacții
        const cats = get().categories.map(cat =>
          cat.name === category
            ? {
                ...cat,
                subcategories: cat.subcategories.filter(sc => sc.name !== subcategory),
              }
            : cat
        );
        await categoryService.saveUserCategories(userId, { categories: cats, version: get().version + 1 });
        await categoryService.handleSubcategoryDeletion(userId, category, subcategory, action, target);
        set({ categories: cats, version: get().version + 1 });
        return true;
      },

      mergeWithDefaults(defaults) {
        // Fuzionează categoriile predefinite cu cele custom, prioritate pentru custom
        const custom = get().categories;
        const merged = defaults.map(def => {
          const found = custom.find(cat => cat.name === def.name);
          if (found) {
            // Prioritate subcategorii custom
            const customSubs = found.subcategories.map(sc => sc.name);
            return {
              ...def,
              subcategories: [
                ...found.subcategories,
                ...def.subcategories.filter(
                  sc => !customSubs.includes(sc.name)
                ),
              ],
              isCustom: found.isCustom,
            };
          }
          return def;
        });
        // Adaugă categoriile complet custom
        const onlyCustom = custom.filter(cat => !defaults.some(def => def.name === cat.name));
        set({ categories: [...merged, ...onlyCustom] });
      },

      getSubcategoryCount(category, subcategory) {
        // Obținem tranzacțiile din store-ul de tranzacții
        // Folosim getState() pentru a evita re-render-uri inutile - acest pattern respectă regulile
        // din memoria critică despre Maximum update depth exceeded
        const transactions = useTransactionStore.getState().transactions;
        
        // Filtrăm și numărăm tranzacțiile care folosesc această subcategorie
        const count = transactions.filter(
          trx => trx.category === category && trx.subcategory === subcategory
        ).length;
        
        return count;
      },
    }),
    {
      name: 'category-store',
      partialize: (state) => ({ categories: state.categories, version: state.version }),
    }
  )
);

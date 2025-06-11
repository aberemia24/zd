// Zustand store pentru gestionarea categoriilor personalizate (fuziune cu predefinite, acțiuni CRUD)
// Owner: echipa FE
import { create } from "zustand";
import { persist, devtools } from "zustand/middleware";
import { CustomCategoriesPayload, CustomCategory, CustomSubcategory } from "../types/Category";
import { categoryService } from "../services/categoryService";
import { supabaseService } from "../services/supabaseService";
import {
  BaseStoreState,
  storeLogger,
  createDevtoolsOptions,
  createAsyncAction,
  createPersistConfig,
} from "./storeUtils";

interface CategoryStoreState extends BaseStoreState {
  categories: CustomCategory[];
  version: number;

  // Async actions
  loadUserCategories: (userId: string) => Promise<void | null>;
  saveCategories: (
    userId: string,
    categories: CustomCategory[],
  ) => Promise<void | null>;
  renameSubcategory: (
    userId: string,
    category: string,
    oldName: string,
    newName: string,
  ) => Promise<boolean | null>;
  deleteSubcategory: (
    userId: string,
    category: string,
    subcategory: string,
    action: "migrate" | "delete",
    target?: string,
  ) => Promise<boolean | null>;

  // Sync actions
  mergeWithDefaults: (defaults: CustomCategory[]) => void;
  getSubcategoryCount: (category: string, subcategory: string) => number;
  setCategories: (categories: CustomCategory[]) => void;
  incrementVersion: () => void;
}

const STORE_NAME = "CategoryStore";

export const useCategoryStore = create<CategoryStoreState>()(
  devtools(
    persist(
      (set, get) => {
        // Helper pentru logging standardizat
        const logAction = (action: string, data?: Record<string, unknown>) => {
          storeLogger.info(STORE_NAME, action, data);
        };

        // Helper pentru setări standardizate
        const setLoading = (loading: boolean) => {
          set({ loading, lastUpdated: new Date() }, false, "setLoading");
        };

        const setError = (error: string | null) => {
          set({ error, lastUpdated: new Date() }, false, "setError");
          if (error) {
            storeLogger.error(STORE_NAME, "Error set", error);
          }
        };

        // Creăm acțiuni async standardizate
        const createCategoryAction = <T extends unknown[], R = void>(
          actionName: string,
          action: (...args: T) => Promise<R>,
        ) =>
          createAsyncAction(
            STORE_NAME,
            actionName,
            action,
            setLoading,
            setError,
          );

        return {
          // State inițial cu BaseStoreState
          loading: false,
          error: null,
          lastUpdated: new Date(),

          // Category state
          categories: [],
          version: 1,

          // Async actions cu error handling standardizat
          loadUserCategories: createCategoryAction(
            "loadUserCategories",
            async (userId: string) => {
              if (!userId) {
                const errorMsg = "User ID is required for loading categories";
                storeLogger.warn(STORE_NAME, errorMsg);
                throw new Error(errorMsg);
              }

              const data = await categoryService.getUserCategories(userId);

              // Validare - ne asigurăm că data.categories este întotdeauna un array
              if (data && Array.isArray(data.categories)) {
                set(
                  {
                    categories: data.categories,
                    version: data.version || 1,
                    error: null,
                    lastUpdated: new Date(),
                  },
                  false,
                  "loadUserCategories_success",
                );

                logAction("Categories loaded successfully", {
                  count: data.categories.length,
                  version: data.version,
                });
              } else {
                // Initializăm cu array gol dacă nu avem date valide
                set(
                  {
                    categories: [],
                    version: 1,
                    error: null,
                    lastUpdated: new Date(),
                  },
                  false,
                  "loadUserCategories_empty",
                );

                logAction("No categories found, starting with empty list");
              }
            },
          ),

          saveCategories: createCategoryAction(
            "saveCategories",
            async (userId: string, categories: CustomCategory[]) => {
              const newVersion = get().version + 1;
              const success = await categoryService.saveUserCategories(userId, {
                categories,
                version: newVersion,
              });

              if (success) {
                set(
                  {
                    categories,
                    version: newVersion,
                    error: null,
                    lastUpdated: new Date(),
                  },
                  false,
                  "saveCategories_success",
                );

                logAction("Categories saved successfully", {
                  count: categories.length,
                  version: newVersion,
                });
              } else {
                throw new Error("Failed to save categories to backend");
              }
            },
          ),

          renameSubcategory: createCategoryAction(
            "renameSubcategory",
            async (
              userId: string,
              category: string,
              oldName: string,
              newName: string,
            ) => {
              // Update store + backend + tranzacții
              const updatedCategories = get().categories.map(
                (cat: CustomCategory) =>
                  cat.name === category
                    ? {
                        ...cat,
                        subcategories: cat.subcategories.map((sc) =>
                          sc.name === oldName ? { ...sc, name: newName } : sc,
                        ),
                      }
                    : cat,
              );

              const newVersion = get().version + 1;

              // Save to backend
              await categoryService.saveUserCategories(userId, {
                categories: updatedCategories,
                version: newVersion,
              });

              // Update transactions
              await categoryService.updateTransactionsForSubcategoryRename(
                userId,
                category,
                oldName,
                newName,
              );

              // Update store
              set(
                {
                  categories: updatedCategories,
                  version: newVersion,
                  lastUpdated: new Date(),
                },
                false,
                "renameSubcategory_success",
              );

              logAction("Subcategory renamed successfully", {
                category,
                oldName,
                newName,
              });

              return true;
            },
          ),

          deleteSubcategory: createCategoryAction(
            "deleteSubcategory",
            async (
              userId: string,
              category: string,
              subcategory: string,
              action: "migrate" | "delete",
              target?: string,
            ) => {
              // Update store + backend + tranzacții
              const updatedCategories = get().categories.map(
                (cat: CustomCategory) =>
                  cat.name === category
                    ? {
                        ...cat,
                        subcategories: cat.subcategories.filter(
                          (sc) => sc.name !== subcategory,
                        ),
                      }
                    : cat,
              );

              const newVersion = get().version + 1;

              // Save to backend
              await categoryService.saveUserCategories(userId, {
                categories: updatedCategories,
                version: newVersion,
              });

              // Handle transaction migration/deletion
              await categoryService.handleSubcategoryDeletion(
                userId,
                category,
                subcategory,
                action,
                target,
              );

              // Update store
              set(
                {
                  categories: updatedCategories,
                  version: newVersion,
                  lastUpdated: new Date(),
                },
                false,
                "deleteSubcategory_success",
              );

              logAction("Subcategory deleted successfully", {
                category,
                subcategory,
                action,
                target,
              });

              return true;
            },
          ),

          // Sync actions
          mergeWithDefaults: (defaults: CustomCategory[]) => {
            // Fuzionează categoriile predefinite cu cele custom, prioritate pentru custom
            const custom = get().categories;
            const merged = defaults.map((def: CustomCategory) => {
              const found = custom.find(
                (cat: CustomCategory) => cat.name === def.name,
              );
              if (found) {
                // Prioritate subcategorii custom
                const customSubs = found.subcategories.map(
                  (sc: CustomSubcategory) => sc.name,
                );
                return {
                  ...def,
                  subcategories: [
                    ...found.subcategories,
                    ...def.subcategories.filter(
                      (sc: CustomSubcategory) => !customSubs.includes(sc.name),
                    ),
                  ],
                  isCustom: found.isCustom,
                };
              }
              return def;
            });

            // Adaugă categoriile complet custom
            const onlyCustom = custom.filter(
              (cat: CustomCategory) =>
                !defaults.some((def: CustomCategory) => def.name === cat.name),
            );
            const finalCategories = [...merged, ...onlyCustom];

            set(
              {
                categories: finalCategories,
                lastUpdated: new Date(),
              },
              false,
              "mergeWithDefaults",
            );

            logAction("Categories merged with defaults", {
              defaultsCount: defaults.length,
              customCount: custom.length,
              mergedCount: finalCategories.length,
            });
          },

          getSubcategoryCount: (category: string, subcategory: string) => {
            // NOTĂ: Această metodă a fost actualizată pentru a elimina dependența de useTransactionStore.transactions
            // care a fost deprecat în favoarea React Query.
            //
            // Acum, aceasta este o metodă temporară care va returna mereu 0. Pentru o implementare
            // completă, s-ar putea face un apel direct la baza de date prin supabaseService sau
            // s-ar putea folosi React Query / useTransactions pentru a obține count-ul real.
            //
            // Recomandare: Dacă aveți nevoie de numărătoare exactă, implementați un endpoint dedicat
            // pentru counting în backend sau folosiți un hook dedicat React Query pentru statistici.

            logAction("getSubcategoryCount called (deprecated method)", {
              category,
              subcategory,
            });
            return 0; // Valoare temporară până la implementarea completă
          },

          setCategories: (categories: CustomCategory[]) => {
            set(
              {
                categories,
                lastUpdated: new Date(),
              },
              false,
              "setCategories",
            );
            logAction("Categories set manually", { count: categories.length });
          },

          incrementVersion: () => {
            const newVersion = get().version + 1;
            set(
              {
                version: newVersion,
                lastUpdated: new Date(),
              },
              false,
              "incrementVersion",
            );
            logAction("Version incremented", { version: newVersion });
          },

          // Base store actions
          setLoading,
          setError,
          clearError: () => {
            set({ error: null, lastUpdated: new Date() }, false, "clearError");
            logAction("Error cleared");
          },
          reset: () => {
            set(
              {
                loading: false,
                error: null,
                categories: [],
                version: 1,
                lastUpdated: new Date(),
              },
              false,
              "reset",
            );
            logAction("Store reset");
          },
        };
      },
      createPersistConfig("category", (state: CategoryStoreState) => ({
        categories: state.categories,
        version: state.version,
      })),
    ),
    createDevtoolsOptions(STORE_NAME),
  ),
);

// Selectori optimizați pentru performance
export const useCategoriesData = () =>
  useCategoryStore((state) => ({
    categories: state.categories,
    version: state.version,
    loading: state.loading,
    error: state.error,
  }));

export const useCategoryActions = () =>
  useCategoryStore((state) => ({
    loadUserCategories: state.loadUserCategories,
    saveCategories: state.saveCategories,
    renameSubcategory: state.renameSubcategory,
    deleteSubcategory: state.deleteSubcategory,
    mergeWithDefaults: state.mergeWithDefaults,
  }));

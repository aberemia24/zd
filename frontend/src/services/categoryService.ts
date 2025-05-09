// Serviciu pentru gestionarea categoriilor și subcategoriilor personalizate (CRUD + utilitare)
// Owner: echipa FE
import { createClient } from '@supabase/supabase-js';
import { CustomCategoriesPayload, CustomCategory, CustomSubcategory } from '../types/Category';

// TODO: Mută config/cheie în env separat
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

const TABLE = 'custom_categories';

export const categoryService = {
  async getUserCategories(userId: string): Promise<CustomCategoriesPayload | null> {
    const { data, error } = await supabase
      .from(TABLE)
      .select('category_data, version')
      .eq('user_id', userId)
      .single();
    if (error) return null;
    if (!data) return null;
    return { ...data.category_data, version: data.version };
  },

  async saveUserCategories(userId: string, categoryData: CustomCategoriesPayload): Promise<boolean> {
    const { error } = await supabase
      .from(TABLE)
      .upsert([
        {
          user_id: userId,
          category_data: categoryData,
          updated_at: new Date().toISOString(),
          version: categoryData.version ?? 1,
        },
      ], { onConflict: 'user_id' });
    return !error;
  },

  async updateTransactionsForSubcategoryRename(userId: string, category: string, oldName: string, newName: string): Promise<boolean> {
    // Exemplu: update în batch pentru tranzacțiile cu subcategoria veche
    const { error } = await supabase
      .from('transactions')
      .update({ subcategory: newName })
      .eq('user_id', userId)
      .eq('category', category)
      .eq('subcategory', oldName);
    return !error;
  },

  async handleSubcategoryDeletion(userId: string, category: string, subcategory: string, action: 'migrate' | 'delete', target?: string): Promise<boolean> {
    if (action === 'migrate' && target) {
      // Migrare tranzacții către altă subcategorie
      const { error } = await supabase
        .from('transactions')
        .update({ subcategory: target })
        .eq('user_id', userId)
        .eq('category', category)
        .eq('subcategory', subcategory);
      return !error;
    } else if (action === 'delete') {
      // Ștergere tranzacții cu subcategoria ștearsă
      const { error } = await supabase
        .from('transactions')
        .delete()
        .eq('user_id', userId)
        .eq('category', category)
        .eq('subcategory', subcategory);
      return !error;
    }
    return false;
  },

  async getAvailableSubcategoriesForMigration(userId: string, category: string, excludeSubcategory: string): Promise<string[]> {
    // Extrage subcategoriile disponibile pentru migrare (excluzând pe cea ștearsă)
    const userCats = await this.getUserCategories(userId);
    if (!userCats) return [];
    const cat = userCats.categories.find(c => c.name === category);
    if (!cat) return [];
    return cat.subcategories
      .map(sc => sc.name)
      .filter(name => name !== excludeSubcategory);
  },

  async checkForDuplicateSubcategory(userId: string, category: string, subcategoryName: string): Promise<boolean> {
    // Verifică dacă există deja o subcategorie cu acest nume în categoria dată
    const userCats = await this.getUserCategories(userId);
    if (!userCats) return false;
    const cat = userCats.categories.find(c => c.name === category);
    if (!cat) return false;
    return cat.subcategories.some(sc => sc.name.toLowerCase() === subcategoryName.toLowerCase());
  },
};

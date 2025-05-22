// Serviciu pentru operațiuni CRUD și pagination pe tranzacții folosind Supabase
// OWNER: echipa API & FE
// Orice modificare la acest serviciu trebuie documentată în DEV_LOG.md

import { supabase } from './supabase';
import { TransactionValidated, CreateTransaction } from '@shared-constants/transaction.schema';
import { CATEGORIES } from '@shared-constants/categories';
import { MESAJE } from '@shared-constants/messages';

export interface Pagination {
  limit?: number;
  offset?: number;
  sort?: 'date' | 'amount' | 'created_at';
  order?: 'asc' | 'desc';
}

export interface TransactionPage {
  data: TransactionValidated[];
  count: number;
}

export interface ActiveSubcategory {
  category: string;
  subcategory: string;
  count: number;
}

const TABLE = 'transactions';

export const supabaseService = {
  // Fetch tranzacții cu paginare și filtrare opțională
  async fetchTransactions(
    userId: string | undefined, // Am actualizat tipul pentru a permite undefined
    pagination: Pagination = {},
    filters: Partial<Pick<TransactionValidated, 'type' | 'category' | 'recurring'>> & {
      subcategory?: string; // Adăugat filtru pentru subcategorie
      dateFrom?: string; // Data de început pentru interval (format ISO: YYYY-MM-DD)
      dateTo?: string;   // Data de sfârșit pentru interval (format ISO: YYYY-MM-DD)
      minAmount?: number; // Suma minimă pentru filtrare
      maxAmount?: number; // Suma maximă pentru filtrare
      search?: string;    // Text pentru căutare în descriere/categorie/subcategorie
    } = {}
  ): Promise<TransactionPage> {
    let query = supabase
      .from(TABLE)
      .select('*', { count: 'exact' });

    // Câmpuri pe care se face search - modifică aici dacă adaugi/elimini coloane în DB
    const searchFields = ['category', 'subcategory']; // adaugă 'description' dacă există în DB

    // Filtrare după user_id doar dacă există userId (pentru mod demo, fără login, nu filtrăm)
    if (userId) {
      query = query.eq('user_id', userId);
    }

    if (filters.type) query = query.eq('type', filters.type);
    if (filters.category) query = query.eq('category', filters.category);
    if (filters.subcategory) query = query.eq('subcategory', filters.subcategory);
    if (filters.recurring !== undefined) query = query.eq('recurring', filters.recurring);
    
    // Filtrare după interval de date
    if (filters.dateFrom) query = query.gte('date', filters.dateFrom);
    if (filters.dateTo) query = query.lte('date', filters.dateTo);

    // Filtrare după interval de sume
    if (filters.minAmount !== undefined) query = query.gte('amount', filters.minAmount);
    if (filters.maxAmount !== undefined) query = query.lte('amount', filters.maxAmount);
    
    // Căutare text în câmpurile configurate (ILIKE pentru case-insensitive)
    if (filters.search) {
      const safeSearch = filters.search.trim().replace(/'/g, "''");
      // Construiește dinamic query-ul .or doar cu câmpurile existente
      const orQuery = searchFields.map(f => `${f}.ilike.*${safeSearch}*`).join(',');
      query = query.or(orQuery);
    }

    if (pagination.sort) query = query.order(pagination.sort, { ascending: pagination.order === 'asc' });
    if (pagination.limit !== undefined && pagination.offset !== undefined) {
      query = query.range(pagination.offset, pagination.offset + pagination.limit - 1);
    }

    const { data, count, error } = await query;
    if (error) throw error;
    return { data: data as TransactionValidated[], count: count || 0 };
  },

  // Fetch subcategorii active - cele care au cel puțin o tranzacție
  // Metodă nouă pentru a obține doar subcategoriile active din tranzacții
  async fetchActiveSubcategories(
    userId: string | undefined,
    category?: string,
    type?: string
  ): Promise<ActiveSubcategory[]> {
    try {
      // Folosim un logging pentru debugging
      console.log(`[fetchActiveSubcategories] Încep căutarea subcategoriilor active cu: userId=${userId}, category=${category}, type=${type}`);
      
      // Selectăm toate tranzacțiile pentru a le grupa local
      let query = supabase
        .from(TABLE)
        .select('category, subcategory')
        .not('subcategory', 'is', null);
      
      // Aplicăm filtrele primite
      if (userId) {
        query = query.eq('user_id', userId);
      }
      
      if (category) {
        query = query.eq('category', category);
      }
      
      if (type) {
        query = query.eq('type', type);
      }
      
      // Executăm interogarea
      const { data, error } = await query;
      
      if (error) {
        console.error('Eroare la încărcarea subcategoriilor active:', error);
        return [];
      }
      
      if (!data || !Array.isArray(data)) {
        console.warn('Nu am primit date pentru subcategorii active');
        return [];
      }
      
      console.log(`[fetchActiveSubcategories] Am găsit ${data.length} tranzacții cu subcategorii`);
      
      // Grupăm rezultatele local pentru a obține contoare
      const groupedData: Record<string, ActiveSubcategory> = {};
      
      // Parcurgem toate tranzacțiile și construim un map pentru a număra subcategoriile
      data.forEach(item => {
        // Verificăm dacă avem subcategorie validă
        if (!item.subcategory) return;
        
        const key = `${item.category}|${item.subcategory}`;
        
        if (!groupedData[key]) {
          groupedData[key] = {
            category: item.category,
            subcategory: item.subcategory,
            count: 1
          };
        } else {
          groupedData[key].count++;
        }
      });
      
      // Logăm datele pentru debugging
      console.log(`[fetchActiveSubcategories] Am grupat în ${Object.keys(groupedData).length} subcategorii active`);
      
      // Transformăm obiectul în array
      const result = Object.values(groupedData);
      
      // Sortăm rezultatele după categorie și subcategorie
      return result.sort((a, b) => {
        if (a.category !== b.category) {
          return a.category.localeCompare(b.category);
        }
        return a.subcategory.localeCompare(b.subcategory);
      });
    } catch (error) {
      console.error('Eroare la fetchActiveSubcategories:', error);
      return [];
    }
  },

  // Helper pentru validarea categoriei și subcategoriei - MODIFICAT pentru a accepta subcategorii personalizate
  validateCategoryAndSubcategory(category: string | undefined, subcategory: string | null | undefined): boolean {
    // Logging pentru debugging îmbunătățit
    console.debug(`[validateCategoryAndSubcategory] Validare: category=${category}, subcategory=${subcategory}`);
    
    // 0. Verificăm dacă categoria este definită
    if (!category) {
      console.error(`Categoria este obligatorie!`);
      return false;
    }
    
    // 1. Verificăm dacă categoria există în CATEGORIES
    if (!Object.keys(CATEGORIES).includes(category)) {
      console.warn(`Categorie "${category}" nu există în lista predefinită. Poate fi o categorie personalizată.`);
      // Nu mai returnam false, permitem categorii personalizate
    }
    
    // 2. Acceptăm toate subcategoriile cu logging explicit pentru debugging
    if (subcategory) {
      console.debug(`[DEBUG] Subcategorie "${subcategory}" acceptată pentru categoria "${category}" (validare delegată backend-ului).`);
    }
    
    // Delegăm validarea completă către backend
    return true;
  },

  // Creează tranzacție nouă
  async createTransaction(payload: CreateTransaction): Promise<TransactionValidated> {
    // Importă store-ul aici pentru a evita circularitatea la importuri
    const { useAuthStore } = await import('../stores/authStore');
    const user = useAuthStore.getState().user;
    if (!user || !user.id) throw new Error(MESAJE.EROARE_NECUNOSCUTA || 'Utilizatorul nu este autentificat!');
    
    // Validăm categoria și subcategoria - DEZACTIVAT, doar logăm pentru debugging
    // Am păstrat apelul pentru compatibilitate cu codul existent
    this.validateCategoryAndSubcategory(payload.category, payload.subcategory || null);
    
    const payloadWithUser = { ...payload, user_id: user.id };
    const { data, error } = await supabase
      .from(TABLE)
      .insert([payloadWithUser])
      .select()
      .single();
      
    if (error) {
      console.error('Error creating transaction:', error);
      
      // Folosim mesajele din constante pentru erori cu mesaj îmbunătățit
      if (error.message?.includes('category') || error.message?.includes('subcategory')) {
        // Folosim mesajul standard din MESAJE pentru a menține consistența UI
        const errorMessage = MESAJE.EROARE_CATEGORIE_SUBCATEGORIE_INVALIDA || 
          'Categoria sau subcategoria nu este validă. Verificați categoriile disponibile în aplicație.';
        throw new Error(errorMessage);
      }
      
      throw error;
    }
    
    return data as TransactionValidated;
  },

  // Update tranzacție existentă
  async updateTransaction(id: string, payload: Partial<CreateTransaction>): Promise<TransactionValidated> {
    const { useAuthStore } = await import('../stores/authStore');
    const user = useAuthStore.getState().user;
    if (!user || !user.id) throw new Error(MESAJE.EROARE_NECUNOSCUTA || 'Utilizatorul nu este autentificat!');
    
    // Validăm categoria și subcategoria dacă sunt furnizate - DEZACTIVAT, doar logăm pentru debugging
    // Am păstrat apelurile pentru compatibilitate cu codul existent
    if (payload.category !== undefined) {
      this.validateCategoryAndSubcategory(payload.category, payload.subcategory || null);
    }
    
    const { data, error } = await supabase
      .from(TABLE)
      .update(payload)
      .eq('id', id)
      .eq('user_id', user.id)
      .select()
      .single();
      
    if (error) {
      console.error('Error updating transaction:', error);
      
      // Folosim mesajele din constante pentru erori cu mesaj îmbunătățit
      if (error.message?.includes('category') || error.message?.includes('subcategory')) {
        // Folosim mesajul standard din MESAJE pentru a menține consistența UI
        const errorMessage = MESAJE.EROARE_CATEGORIE_SUBCATEGORIE_INVALIDA || 
          'Categoria sau subcategoria nu este validă. Verificați categoriile disponibile în aplicație.';
        throw new Error(errorMessage);
      }
      
      throw error;
    }
    
    return data as TransactionValidated;
  },

  // Șterge tranzacție
  async deleteTransaction(id: string): Promise<void> {
    const { useAuthStore } = await import('../stores/authStore');
    const user = useAuthStore.getState().user;
    if (!user || !user.id) throw new Error(MESAJE.EROARE_NECUNOSCUTA || 'Utilizatorul nu este autentificat!');
    const { error } = await supabase
      .from(TABLE)
      .delete()
      .eq('id', id)
      .eq('user_id', user.id);
    if (error) throw error;
  },

  // Obține categoriile personalizate ale utilizatorului
  async fetchUserCategories(userId: string): Promise<any[]> {
    if (!userId) {
      throw new Error(MESAJE.EROARE_NECUNOSCUTA || 'ID utilizator necesar');
    }
    
    try {
      // Obținem categoriile personalizate din tabelul 'user_categories'
      const { data: customCategories, error } = await supabase
        .from('user_categories')
        .select('*')
        .eq('user_id', userId);
        
      if (error) {
        throw error;
      }
      
      // Combinăm categoriile predefinite cu cele personalizate
      // Structura poate varia în funcție de implementarea specifică
      const mergedCategories = { ...CATEGORIES };
      
      // Aici putem adăuga logica de combinare a categoriilor personalizate
      // În funcție de implementarea specifică
      
      return customCategories || [];
    } catch (error) {
      console.error('Eroare la încărcarea categoriilor utilizatorului:', error);
      // Returnăm categoriile implicite ca fallback
      return [];
    }
  }
};
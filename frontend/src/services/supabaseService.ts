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

const TABLE = 'transactions';

export const supabaseService = {
  // Fetch tranzacții cu paginare și filtrare opțională
  async fetchTransactions(
    userId: string,
    pagination: Pagination = {},
    filters: Partial<Pick<TransactionValidated, 'type' | 'category' | 'recurring'>> & {
      dateFrom?: string; // Data de început pentru interval (format ISO: YYYY-MM-DD)
      dateTo?: string;   // Data de sfârșit pentru interval (format ISO: YYYY-MM-DD)
    } = {}
  ): Promise<TransactionPage> {
    let query = supabase
      .from(TABLE)
      .select('*', { count: 'exact' });

    // Filtrare după user_id doar dacă există userId (pentru mod demo, fără login, nu filtrăm)
    if (userId) {
      query = query.eq('user_id', userId);
    }

    if (filters.type) query = query.eq('type', filters.type);
    if (filters.category) query = query.eq('category', filters.category);
    if (filters.recurring !== undefined) query = query.eq('recurring', filters.recurring);
    
    // Filtrare după interval de date
    if (filters.dateFrom) query = query.gte('date', filters.dateFrom);
    if (filters.dateTo) query = query.lte('date', filters.dateTo);

    if (pagination.sort) query = query.order(pagination.sort, { ascending: pagination.order === 'asc' });
    if (pagination.limit !== undefined && pagination.offset !== undefined) {
      query = query.range(pagination.offset, pagination.offset + pagination.limit - 1);
    }

    const { data, count, error } = await query;
    if (error) throw error;
    return { data: data as TransactionValidated[], count: count || 0 };
  },

  // Helper pentru validarea categoriei și subcategoriei
  validateCategoryAndSubcategory(category: string | undefined, subcategory: string | null | undefined): boolean {
    // 0. Verificăm dacă categoria este definită
    if (!category) {
      console.error(`Categoria este obligatorie!`);
      return false;
    }
    
    // 1. Verificăm dacă categoria există în CATEGORIES
    if (!Object.keys(CATEGORIES).includes(category)) {
      console.error(`Categorie invalidă: ${category}. Categorii permise: ${Object.keys(CATEGORIES).join(', ')}`);
      return false;
    }
    
    // 2. Dacă subcategoria este null/undefined, o considerăm validă (temporar)
    if (!subcategory) return true;
    
    // 3. Verificăm dacă subcategoria există în lista de subcategorii pentru categoria dată
    const categoryData = CATEGORIES[category as keyof typeof CATEGORIES];
    
    // Parcurgem grupurile de subcategorii și verificăm dacă subcategoria există în vreunul dintre ele
    return Object.values(categoryData).some(subcategories => 
      subcategories.includes(subcategory)
    );
  },

  // Creează tranzacție nouă
  async createTransaction(payload: CreateTransaction): Promise<TransactionValidated> {
    // Importă store-ul aici pentru a evita circularitatea la importuri
    const { useAuthStore } = await import('../stores/authStore');
    const user = useAuthStore.getState().user;
    if (!user || !user.id) throw new Error('Utilizatorul nu este autentificat!');
    
    // Validăm categoria și subcategoria - important pentru consistența datelor
    if (!this.validateCategoryAndSubcategory(payload.category, payload.subcategory || null)) {
      throw new Error('Categoria sau subcategoria nu este validă. Verificați categoriile disponibile în aplicație.');
    }
    
    const payloadWithUser = { ...payload, user_id: user.id };
    const { data, error } = await supabase
      .from(TABLE)
      .insert([payloadWithUser])
      .select()
      .single();
    if (error) throw error;
    return data as TransactionValidated;
  },

  // Update tranzacție existentă
  async updateTransaction(id: string, payload: Partial<CreateTransaction>): Promise<TransactionValidated> {
    const { useAuthStore } = await import('../stores/authStore');
    const user = useAuthStore.getState().user;
    if (!user || !user.id) throw new Error('Utilizatorul nu este autentificat!');
    
    // Validăm categoria și subcategoria doar dacă sunt incluse în payload
    if (payload.category !== undefined) {
      const subcategory = payload.subcategory !== undefined ? payload.subcategory : null;
      
      // Dacă subcategoria nu este în payload, trebuie să obținem subcategoria existentă
      if (subcategory === null) {
        const { data: existingData } = await supabase
          .from(TABLE)
          .select('subcategory')
          .eq('id', id)
          .eq('user_id', user.id)
          .single();
          
        if (existingData) {
          if (!this.validateCategoryAndSubcategory(payload.category, existingData.subcategory || null)) {
            throw new Error('Categoria nu este compatibilă cu subcategoria existentă. Verificați categoriile disponibile în aplicație.');
          }
        }
      } else if (!this.validateCategoryAndSubcategory(payload.category, subcategory)) {
        throw new Error('Categoria sau subcategoria nu este validă. Verificați categoriile disponibile în aplicație.');
      }
    } else if (payload.subcategory !== undefined) {
      // Subcategoria se schimbă, dar categoria rămâne aceeași - trebuie să obținem categoria existentă
      const { data: existingData } = await supabase
        .from(TABLE)
        .select('category')
        .eq('id', id)
        .eq('user_id', user.id)
        .single();
        
      if (existingData && !this.validateCategoryAndSubcategory(existingData.category, payload.subcategory || null)) {
        throw new Error('Subcategoria nu este validă pentru categoria existentă. Verificați subcategoriile disponibile pentru această categorie.');
      }
    }
    
    const { data, error } = await supabase
      .from(TABLE)
      .update(payload)
      .eq('id', id)
      .eq('user_id', user.id)
      .select()
      .single();
    if (error) throw error;
    return data as TransactionValidated;
  },

  // Șterge tranzacție
  async deleteTransaction(id: string): Promise<void> {
    const { useAuthStore } = await import('../stores/authStore');
    const user = useAuthStore.getState().user;
    if (!user || !user.id) throw new Error('Utilizatorul nu este autentificat!');
    const { error } = await supabase
      .from(TABLE)
      .delete()
      .eq('id', id)
      .eq('user_id', user.id);
    if (error) throw error;
  }
};

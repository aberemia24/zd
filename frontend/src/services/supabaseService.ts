// Serviciu pentru operațiuni CRUD și pagination pe tranzacții folosind Supabase
// OWNER: echipa API & FE
// Orice modificare la acest serviciu trebuie documentată în DEV_LOG.md

import { supabase } from './supabase';
import { TransactionValidated, CreateTransaction } from '@shared-constants/transaction.schema';

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
    filters: Partial<Pick<TransactionValidated, 'type' | 'category' | 'recurring'>> = {}
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

    if (pagination.sort) query = query.order(pagination.sort, { ascending: pagination.order === 'asc' });
    if (pagination.limit !== undefined && pagination.offset !== undefined) {
      query = query.range(pagination.offset, pagination.offset + pagination.limit - 1);
    }

    const { data, count, error } = await query;
    if (error) throw error;
    return { data: data as TransactionValidated[], count: count || 0 };
  },

  // Creează tranzacție nouă
  async createTransaction(payload: CreateTransaction): Promise<TransactionValidated> {
    // Importă store-ul aici pentru a evita circularitatea la importuri
    const { useAuthStore } = await import('../stores/authStore');
    const user = useAuthStore.getState().user;
    if (!user || !user.id) throw new Error('Utilizatorul nu este autentificat!');
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

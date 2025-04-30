# Tech Story: Integrarea Supabase în Budget App


Task Breakdown: Integrare Supabase în Budget App
1. Setup & Configurare inițială
[x] Instalează @supabase/supabase-js și adaugă variabilele de mediu.
[x] Creează services/supabase.ts – client singleton, cu validare env.
2. Schema & SQL (doar documentație/migrare, nu cod direct)
[ ] Adaugă scriptul SQL pentru tabelul transactions, indexare și RLS în documentație (sau ca migration script).
[ ] Asigură-te că schema transaction.schema.ts reflectă structura Supabase.
3. Servicii & Business Logic
[x] Creează services/supabaseService.ts cu toate metodele CRUD, agregări, pagination (cursor/offset), după exemplul din story.
[ ] Refactorizează/creează services/transactionService.ts cu caching local avansat (LRU/LFU), invalidare selectivă, stats persistente.
4. Store-uri Zustand
[ ] Creează/actualizează stores/authStore.ts pentru autentificare cu Supabase.
[x] Refactorizează stores/transactionStore.ts pentru a folosi noul TransactionService (doar schimbare de import/inițializare).
5. UI & Componente
[ ] Creează componentele de autentificare (LoginForm, RegisterForm, etc.) cu hooks/store-uri noi.
[x] Verifică integrarea cu componentele existente (TransactionForm, TransactionTable) – nu ar trebui să fie nevoie de modificări majore.
6. Testare & Validare
[ ] Adaugă/migreză teste pentru noile servicii și store-uri (mock SupabaseService).
[ ] Testează fluxurile principale (login, fetch, create, update, delete, pagination, edge cases).
[ ] Rulează npm run validate:constants și asigură-te că importurile sunt conforme.
7. Documentare & Knowledge Transfer
[ ] Actualizează [DEV_LOG.md] cu pașii de migrare și deciziile luate.
[ ] Adaugă lecțiile relevante în [BEST_PRACTICES.md] după finalizare.

**Notă:** Integrarea actuală funcționează în mod demo fără user_id (fără autentificare). Taskurile de auth și UI auth rămân deschise.
Propunere de prim pas concret
Pasul 1: Setup Supabase client și variabile de mediu

Instalează @supabase/supabase-js
Creează frontend/src/services/supabase.ts cu inițializarea clientului (inclusiv validare pentru env-uri lipsă)
Vrei să începem cu acest pas? Dacă da, confirmă și voi face modificările necesare în cod și package. Dacă preferi altă ordine sau vrei să sari direct la servicii/store-uri, spune-mi!

Feedback submitted
Generating


## Contextul Tehnic

Aplicația Budget App este o aplicație de tip monorepo cu:
- Frontend: React + Zustand + TailwindCSS + Jest
- Backend: NestJS (utilizat doar pentru mock-uri în prezent)
- Shared Constants: Structură partajată pentru TypeScript types, enums și constante

Arhitectura actuală folosește:
- Store-uri Zustand pentru state management (`transactionStore`, `transactionFormStore`)
- Servicii pentru logica de business (`TransactionService`, `TransactionApiClient`)
- Componente React structurate în primitive și features (`TransactionForm`, `TransactionTable`)

## Volumul de Date Estimat

Pentru o aplicație de planificare financiară pe termen lung, trebuie să avem în vedere:
- **50-100 tranzacții/lună** per utilizator (incluzând extrase de cont, cheltuieli cash și altele)
- **600-1200 tranzacții/an**
- **3000-6000 tranzacții după 5 ani** 
- **6000-12000 tranzacții după 10 ani**

Acest volum impune cerințe stricte de performanță, indexare, paginare eficientă și strategii de caching robuste.

## Obiective

1. Înlocuirea backend-ului NestJS cu Supabase
2. Implementarea autentificării cu Supabase Auth
3. Păstrarea arhitecturii existente și a separării clare între servicii și UI
4. Migrarea datelor fără a afecta UI-ul sau experiența utilizatorului
5. Implementarea unei strategii de caching robuste pentru volume extrem de mari de date
6. Optimizarea performanței pentru utilizare pe termen lung (5-10 ani)

## Arhitectura Propusă

```
Frontend
  ├── components/             # Neschimbat
  ├── stores/                 # Zustand stores (modificări minime)
  │   ├── transactionStore.ts # Modificat pentru a folosi SupabaseService
  │   ├── authStore.ts        # Nou pentru gestionarea autentificării
  │   └── ...
  ├── services/               # Servicii refactorizate
  │   ├── supabase.ts         # Client Supabase singleton
  │   ├── supabaseService.ts  # Înlocuiește TransactionApiClient
  │   ├── transactionService.ts # Simplificat, cu caching optimizat
  │   └── ...
  └── ...

shared-constants
  ├── enums.ts                # Neschimbat
  ├── transaction.schema.ts   # Aliniat cu schema Supabase
  └── ...
```

## Pași de Implementare Detaliați

### 1. Configurare Supabase

```bash
# Instalare dependințe Supabase
npm install @supabase/supabase-js
```

Creează un client Supabase singleton:

```typescript
// frontend/src/services/supabase.ts
import { createClient } from '@supabase/supabase-js';
import type { SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || process.env.REACT_APP_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || process.env.REACT_APP_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Supabase configuration missing. Please check environment variables.');
}

export const supabase: SupabaseClient = createClient(supabaseUrl, supabaseAnonKey);
```

### 2. Schema SQL pentru Supabase Optimizată pentru Volume Mari

```sql
-- Execută aceste SQL în Supabase SQL Editor
CREATE TABLE transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users NOT NULL,
  type TEXT NOT NULL,
  amount NUMERIC NOT NULL,
  currency TEXT NOT NULL DEFAULT 'RON',
  date DATE NOT NULL,
  category TEXT,
  subcategory TEXT,
  recurring BOOLEAN DEFAULT FALSE,
  frequency TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Row Level Security pentru securitate
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

-- Politici RLS
CREATE POLICY "Users can CRUD own transactions" 
  ON transactions 
  USING (auth.uid() = user_id) 
  WITH CHECK (auth.uid() = user_id);

-- Trigger pentru updated_at
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$ LANGUAGE plpgsql;

CREATE TRIGGER set_timestamp
BEFORE UPDATE ON transactions
FOR EACH ROW
EXECUTE FUNCTION update_modified_column();

-- Indecși pentru volume mari de date și performanță optimă în scenarii de filtrare frecvente

-- Index pentru filtrarea după user_id (cel mai frecvent utilizat în RLS)
CREATE INDEX idx_transactions_user_id ON transactions(user_id);

-- Index compus pentru filtrarea tipică după user+type
CREATE INDEX idx_transactions_user_type ON transactions(user_id, type);

-- Index compus pentru filtrarea după user+category
CREATE INDEX idx_transactions_user_category ON transactions(user_id, category);

-- Index pentru filtrarea după date (queries pentru interval de timp sunt foarte frecvente)
CREATE INDEX idx_transactions_user_date ON transactions(user_id, date);

-- Index pentru sortare descendentă după dată (cazul cel mai comun)
CREATE INDEX idx_transactions_date_desc ON transactions(user_id, date DESC);

-- Index pentru sumarul după lună (pentru analiza lunară, frecventă în aplicație)
CREATE INDEX idx_transactions_month_year ON transactions(
  user_id, 
  EXTRACT(YEAR FROM date), 
  EXTRACT(MONTH FROM date)
);

-- Partition table după ani pentru performanță cu volume mari (opțional, pentru migrare viitoare)
-- Aceasta permite izolarea datelor vechi de cele noi
-- NOTA: Implementarea partitionării necesită o strategie de migrare ulterioară
-- Este comentată acum, dar ar putea fi implementată când volumul de date crește semnificativ

/*
CREATE TABLE transactions_partition (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users NOT NULL,
  type TEXT NOT NULL,
  amount NUMERIC NOT NULL,
  currency TEXT NOT NULL DEFAULT 'RON',
  date DATE NOT NULL,
  category TEXT,
  subcategory TEXT,
  recurring BOOLEAN DEFAULT FALSE,
  frequency TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
) PARTITION BY RANGE (EXTRACT(YEAR FROM date));

-- Creează partiții pentru anii curenți și viitori
CREATE TABLE transactions_y2023 PARTITION OF transactions_partition 
  FOR VALUES FROM (2023) TO (2024);
CREATE TABLE transactions_y2024 PARTITION OF transactions_partition 
  FOR VALUES FROM (2024) TO (2025);
CREATE TABLE transactions_y2025 PARTITION OF transactions_partition 
  FOR VALUES FROM (2025) TO (2026);
*/
```

### 3. Implementarea SupabaseService Optimizat pentru Volume Mari

```typescript
// frontend/src/services/supabaseService.ts
import { supabase } from './supabase';
import { Transaction, TransactionQueryParams } from '../types/transaction';
import { PaginatedResponse } from './transactionApiClient'; // Păstrează tipurile existente

export class SupabaseService {
  /**
   * Obține tranzacțiile filtrate de la Supabase
   * - Optimizat pentru volume mari (6000-12000 tranzacții)
   * - Implementează cursor-based pagination pentru performanță superioară
   */
  async getTransactions(
    queryParams?: TransactionQueryParams
  ): Promise<PaginatedResponse<Transaction>> {
    // Extrage parametrii de query sau folosește valori implicite
    const {
      type,
      category,
      startDate,
      endDate,
      limit = 20,
      offset = 0, // Păstrat pentru compatibilitate, dar preferăm cursor
      cursor, // Nou: cursor pentru paginare eficientă
      sort = 'date', // Păstrează parametrul de sortare existent
      search, // Nou: suport pentru căutare text
    } = queryParams || {};

    // Construiește query-ul de bază
    let query = supabase
      .from('transactions')
      .select('*', { count: 'exact' });

    // Aplică filtrele
    if (type) query = query.eq('type', type);
    if (category) query = query.eq('category', category);
    
    // Filtrare interval de date
    if (startDate) query = query.gte('date', startDate);
    if (endDate) query = query.lte('date', endDate);
    
    // Căutare text
    if (search) {
      // Pattern PostgreSQL pentru căutare în multiple coloane
      query = query.or(
        `category.ilike.%${search}%,subcategory.ilike.%${search}%`
      );
    }

    // Determină direcția de sortare și câmpul
    const isDescending = sort.startsWith('-');
    const sortField = isDescending ? sort.substring(1) : sort;

    // Ordonare pentru paginare consistentă
    query = query.order(sortField, { ascending: !isDescending });
    
    // Pentru paginare consistentă, întotdeauna ordonăm secundar după ID 
    // (critică pentru cursor pagination și pentru a evita inconsistențe)
    if (sortField !== 'id') {
      query = query.order('id', { ascending: !isDescending });
    }

    // Implementare cursor-based pagination când cursor este furnizat
    // Aceasta este semnificativ mai eficientă pentru seturi mari de date
    if (cursor) {
      const [cursorValue, cursorId] = cursor.split('|');
      
      if (sortField === 'date') {
        if (isDescending) {
          // Pentru sortare descrescătoare după dată
          query = query.or(`date.lt.${cursorValue},and(date.eq.${cursorValue},id.lt.${cursorId})`);
        } else {
          // Pentru sortare crescătoare după dată
          query = query.or(`date.gt.${cursorValue},and(date.eq.${cursorValue},id.gt.${cursorId})`);
        }
      } else {
        // Logică similară pentru alte câmpuri de sortare
        const operator = isDescending ? 'lt' : 'gt';
        query = query.filter(`${sortField}`, operator, cursorValue);
      }
    } else {
      // Fallback la offset pagination când nu avem cursor (comportament legacy)
      query = query.range(offset, offset + limit - 1);
    }
    
    // Limitează numărul de rezultate returnate
    query = query.limit(limit);

    // Execută query-ul
    const { data, error, count } = await query;

    if (error) {
      console.error('Supabase error fetching transactions:', error);
      throw new Error(`Error fetching transactions: ${error.message}`);
    }

    // Generează cursor pentru următoarea pagină dacă avem suficiente rezultate
    let nextCursor = null;
    if (data && data.length === limit) {
      const lastItem = data[data.length - 1];
      nextCursor = `${lastItem[sortField]}|${lastItem.id}`;
    }

    // Formatează răspunsul conform structurii existente PaginatedResponse
    // Adăugând și informații pentru cursor pagination
    return {
      data: data || [],
      total: count || 0,
      limit,
      offset, // Păstrat pentru compatibilitate
      cursor: nextCursor,
    };
  }

  /**
   * Obține o tranzacție după id
   */
  async getTransaction(id: string): Promise<Transaction> {
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error(`Error fetching transaction with id ${id}:`, error);
      throw new Error(`Error fetching transaction: ${error.message}`);
    }

    return data as Transaction;
  }

  /**
   * Obține mai multe tranzacții după id-uri (batch fetching)
   * - Optimizare pentru reducerea numărului de request-uri
   */
  async getTransactionsByIds(ids: string[]): Promise<Transaction[]> {
    if (!ids.length) return [];
    
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .in('id', ids);

    if (error) {
      console.error(`Error fetching transactions by ids:`, error);
      throw new Error(`Error fetching transactions: ${error.message}`);
    }

    return data as Transaction[];
  }

  /**
   * Obține agregări pentru tranzacții (sume, count-uri, etc.)
   * - Optimizare pentru dashboards și rapoarte
   */
  async getTransactionAggregations(params: {
    groupBy: 'month' | 'year' | 'category' | 'type';
    type?: string;
    category?: string;
    startDate?: string;
    endDate?: string;
  }): Promise<any[]> {
    const { groupBy, type, category, startDate, endDate } = params;
    
    // Construiește query-ul corespunzător
    let query;
    
    if (groupBy === 'month') {
      // Agregare după lună (folosind funcții PostgreSQL)
      query = supabase.rpc('aggregate_transactions_by_month', {
        p_start_date: startDate,
        p_end_date: endDate,
        p_type: type,
        p_category: category
      });
    } else if (groupBy === 'category') {
      // Agregare după categorie
      query = supabase.rpc('aggregate_transactions_by_category', {
        p_start_date: startDate,
        p_end_date: endDate,
        p_type: type
      });
    } else {
      // Implementează alte tipuri de agregări...
      throw new Error(`Aggregation type ${groupBy} not implemented`);
    }
    
    const { data, error } = await query;
    
    if (error) {
      console.error(`Error fetching aggregations:`, error);
      throw new Error(`Error fetching aggregations: ${error.message}`);
    }
    
    return data;
  }

  /**
   * Creează o nouă tranzacție
   */
  async createTransaction(transaction: Partial<Transaction>): Promise<Transaction> {
    // Asigură-te că user_id este setat
    const currentUser = supabase.auth.getUser();
    const transactionWithUserId = {
      ...transaction,
      user_id: (await currentUser).data.user?.id,
    };

    const { data, error } = await supabase
      .from('transactions')
      .insert(transactionWithUserId)
      .select()
      .single();

    if (error) {
      console.error('Error creating transaction:', error);
      throw new Error(`Error creating transaction: ${error.message}`);
    }

    return data as Transaction;
  }

  /**
   * Creează mai multe tranzacții într-un singur request (bulk insert)
   * - Optimizare pentru importuri și operații în bulk
   */
  async createTransactions(transactions: Partial<Transaction>[]): Promise<Transaction[]> {
    if (!transactions.length) return [];
    
    // Asigură-te că user_id este setat pentru toate tranzacțiile
    const currentUser = supabase.auth.getUser();
    const userId = (await currentUser).data.user?.id;
    
    const transactionsWithUserId = transactions.map(tx => ({
      ...tx,
      user_id: userId,
    }));

    const { data, error } = await supabase
      .from('transactions')
      .insert(transactionsWithUserId)
      .select();

    if (error) {
      console.error('Error creating transactions in bulk:', error);
      throw new Error(`Error creating transactions: ${error.message}`);
    }

    return data as Transaction[];
  }

  /**
   * Actualizează o tranzacție existentă
   */
  async updateTransaction(id: string, transaction: Partial<Transaction>): Promise<Transaction> {
    const { data, error } = await supabase
      .from('transactions')
      .update(transaction)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error(`Error updating transaction with id ${id}:`, error);
      throw new Error(`Error updating transaction: ${error.message}`);
    }

    return data as Transaction;
  }

  /**
   * Șterge o tranzacție
   */
  async deleteTransaction(id: string): Promise<void> {
    const { error } = await supabase
      .from('transactions')
      .delete()
      .eq('id', id);

    if (error) {
      console.error(`Error deleting transaction with id ${id}:`, error);
      throw new Error(`Error deleting transaction: ${error.message}`);
    }
  }
  
  /**
   * Șterge mai multe tranzacții într-un singur request
   * - Optimizare pentru operații în bulk
   */
  async deleteTransactions(ids: string[]): Promise<void> {
    if (!ids.length) return;
    
    const { error } = await supabase
      .from('transactions')
      .delete()
      .in('id', ids);

    if (error) {
      console.error(`Error deleting transactions:`, error);
      throw new Error(`Error deleting transactions: ${error.message}`);
    }
  }
}
```

### 4. Implementarea Strategiei de Caching Robuste pentru Volume Extrem de Mari

Pentru o aplicație de planificare financiară pe termen lung cu potențial 6000-12000 tranzacții după 10 ani, este necesară o strategie de caching avansată:

```typescript
// frontend/src/services/transactionService.ts
import { SupabaseService } from './supabaseService';
import { Transaction, TransactionQueryParams, TransactionFormWithNumberAmount } from '../types/transaction';
import { PaginatedResponse } from './transactionApiClient';
import { FORM_DEFAULTS } from '@shared-constants';

export class TransactionService {
  private apiClient: SupabaseService;
  private cache: Map<string, {
    data: PaginatedResponse<Transaction>,
    timestamp: number,
    hits: number // Tracking pentru LFU (Least Frequently Used)
  }> = new Map();
  private cacheTimeMs: number = 300000; // 5 minute
  private maxCacheEntries: number = 250; // Crescut pentru volume mari
  private cacheHits: number = 0;
  private cacheMisses: number = 0;
  private persistentStorageKey: string = 'transaction_cache_stats';
  
  constructor(apiClient?: SupabaseService) {
    this.apiClient = apiClient || new SupabaseService();
    this.loadCacheStats();
  }
  
  /**
   * Salvează statistici de cache pentru monitorizare și optimizări
   */
  private saveCacheStats(): void {
    try {
      const stats = {
        hits: this.cacheHits,
        misses: this.cacheMisses,
        timestamp: Date.now()
      };
      localStorage.setItem(this.persistentStorageKey, JSON.stringify(stats));
    } catch (e) {
      // Ignoră erorile de localStorage (mod incognito, etc.)
    }
  }
  
  /**
   * Încarcă statistici de cache din storage
   */
  private loadCacheStats(): void {
    try {
      const statsStr = localStorage.getItem(this.persistentStorageKey);
      if (statsStr) {
        const stats = JSON.parse(statsStr);
        this.cacheHits = stats.hits || 0;
        this.cacheMisses = stats.misses || 0;
      }
    } catch (e) {
      // Ignoră erorile
    }
  }
  
  /**
   * Generează o cheie unică pentru cache bazată pe parametrii de query
   */
  private getCacheKey(queryParams?: TransactionQueryParams): string {
    return JSON.stringify(queryParams || {});
  }
  
  /**
   * Obține tranzacțiile filtrate cu caching avansat
   * - Optimizat pentru volume extrem de mari (6000-12000 tranzacții)
   * - Implementează LRU + LFU hibrid pentru eficiență maximă
   */
  async getFilteredTransactions(
    queryParams?: TransactionQueryParams,
    forceRefresh: boolean = false
  ): Promise<PaginatedResponse<Transaction>> {
    const cacheKey = this.getCacheKey(queryParams);
    const now = Date.now();
    
    // Verifică cache-ul dacă forceRefresh este false
    if (!forceRefresh) {
      const cached = this.cache.get(cacheKey);
      if (cached && now - cached.timestamp < this.cacheTimeMs) {
        // Actualizează statistici cache hit
        this.cacheHits++;
        
        // Actualizează numărul de hits pentru această intrare (LFU)
        this.cache.set(cacheKey, {
          ...cached,
          hits: cached.hits + 1,
          timestamp: now // Actualizează și timestamp (LRU)
        });
        
        this.saveCacheStats();
        return cached.data;
      }
    }
    
    // Cache miss sau force refresh
    this.cacheMisses++;
    
    // Aduce date proaspete
    const data = await this.apiClient.getTransactions(queryParams);
    
    // Salvează în cache
    this.cache.set(cacheKey, { 
      data, 
      timestamp: now,
      hits: 1 
    });
    
    // Managementul dimensiunii cache-ului
    this.enforceCacheSize();
    
    // Salvează statistici actualizate
    this.saveCacheStats();
    
    return data;
  }
  
  /**
   * Limitează dimensiunea cache-ului folosind o strategie hibridă LRU/LFU
   * - Crucial pentru performanță predictibilă cu volume mari de date
   */
  private enforceCacheSize(): void {
    if (this.cache.size <= this.maxCacheEntries) return;
    
    // Sortăm intrările după o combinație de frecvență și recență
    const entries = Array.from(this.cache.entries()).map(([key, entry]) => ({
      key,
      entry,
      // Scor hibrid: hits / (now - timestamp)
      // Valori mai mari înseamnă mai valoros (frecvent și recent)
      score: entry.hits / (Date.now() - entry.timestamp + 1)
    }));
    
    // Sortăm crescător după scor (cele mai puțin valoroase prime)
    entries.sort((a, b) => a.score - b.score);
    
    // Ștergem intrările cu cel mai mic scor până revenim la 80% din capacitate
    const targetSize = Math.floor(this.maxCacheEntries * 0.8);
    const entriesToRemove = entries.slice(0, entries.length - targetSize);
    
    for (const { key } of entriesToRemove) {
      this.cache.delete(key);
    }
  }
  
  /**
   * Obține o tranzacție după id
   */
  async getTransactionById(id: string): Promise<Transaction> {
    return this.apiClient.getTransaction(id);
  }
  
  /**
   * Invalidează cache-ul pentru operațiuni care modifică date
   * - Strategie avansată, context-aware pentru volume mari
   */
  private invalidateCache(
    operationType?: 'create' | 'update' | 'delete', 
    affectedId?: string, 
    affectedFilters?: Partial<TransactionQueryParams>
  ): void {
    // Implementare avansată bazată pe tipul operației și context
    switch (operationType) {
      case 'update':
        if (affectedId) {
          // Invalidează doar cache-urile care ar putea conține această tranzacție
          this.invalidateCacheEntriesContainingId(affectedId);
        } else if (affectedFilters) {
          // Invalidează doar cache-urile care se potrivesc cu filtrele afectate
          this.invalidateCacheEntriesMatchingFilters(affectedFilters);
        } else {
          // Fallback: Invalidează doar primele pagini (cele mai accesate)
          this.invalidateFirstPages();
        }
        break;
        
      case 'delete':
        if (affectedId) {
          // Invalidează cache-urile care conțin această tranzacție
          this.invalidateCacheEntriesContainingId(affectedId);
        } else {
          // Invalidează tot cache-ul
          this.cache.clear();
        }
        break;
        
      case 'create':
        // Pentru creări, invalidează doar filtrele recente și primele pagini
        this.invalidateRecentAndFirstPages();
        break;
        
      default:
        // Invalidează tot pentru alte operații
        this.cache.clear();
    }
  }
  
  /**
   * Invalidează intrările de cache care conțin tranzacția specificată
   * - Minimizează invalidările inutile pentru volume mari
   */
  private invalidateCacheEntriesContainingId(id: string): void {
    for (const [key, entry] of this.cache.entries()) {
      if (entry.data.data.some(t => t.id === id || t._id === id)) {
        this.cache.delete(key);
      }
    }
  }
  
  /**
   * Invalidează prima pagină din fiecare set de filtre
   * - Strategie eficientă pentru volume mari (majoritatea utilizatorilor văd prima pagină)
   */
  private invalidateFirstPages(): void {
    for (const [key, _] of this.cache.entries()) {
      try {
        const params = JSON.parse(key);
        if (params.offset === 0 || params.offset <= 10) {
          this.cache.delete(key);
        }
      } catch {
        // Ignoră erorile de parsing
      }
    }
  }
  
  /**
   * Invalidează cache-uri pentru filtrele și paginile cele mai recent accesate
   * - Se concentrează pe date recente care au probabilitate mare de re-access
   */
  private invalidateRecentAndFirstPages(): void {
    const now = Date.now();
    const recentThreshold = now - (60 * 60 * 1000); // 1 oră
    
    for (const [key, entry] of this.cache.entries()) {
      try {
        // Invalidează intrările recente sau primele pagini
        if (entry.timestamp > recentThreshold || JSON.parse(key).offset === 0) {
          this.cache.delete(key);
        }
      } catch {
        // Ignoră erorile de parsing
      }
    }
  }
  
  /**
   * Invalidează cache-urile care se potrivesc cu filtrele specificate
   * - Util pentru operațiuni în bulk sau filtre specifice
   */
  private invalidateCacheEntriesMatchingFilters(filters: Partial<TransactionQueryParams>): void {
    const filterEntries = Object.entries(filters).filter(([_, v]) => v !== undefined);
    
    if (filterEntries.length === 0) {
      this.invalidateFirstPages(); // Fallback la strategia de bază
      return;
    }
    
    for (const [key, _] of this.cache.entries()) {
      try {
        const params = JSON.parse(key);
        const matchesFilters = filterEntries.every(([filterKey, filterValue]) => 
          params[filterKey] === filterValue
        );
        
        if (matchesFilters) {
          this.cache.delete(key);
        }
      } catch {
        // Ignoră erorile de parsing
      }
    }
  }
  
  /**
   * Salvează o tranzacție (creare sau actualizare)
   */
  async saveTransaction(formData: TransactionFormWithNumberAmount, id?: string): Promise<Transaction> {
    // Transformă în formatul API - conversie amount număr->string și adăugare currency
    const apiData = {
      ...formData,
      amount: String(formData.amount),
      currency: formData.currency || FORM_DEFAULTS.CURRENCY,
    };
    
    let result: Transaction;
    
    if (id) {
      // Actualizare
      result = await this.apiClient.updateTransaction(id, apiData);
      // Invalidare cache selectivă pentru performanță optimă
      this.invalidateCache('update', id, {
        type: formData.type,
        category: formData.category
      });
    } else {
      // Creare
      result = await this.apiClient.createTransaction(apiData);
      // Invalidare cache selectivă pentru noua tranzacție
      this.invalidateCache('create', undefined, {
        type: formData.type,
        category: formData.category
      });
    }
    
    return result;
  }
  
  /**
   * Șterge o tranzacție
   */
  async removeTransaction(id: string): Promise<void> {
    // Obținem tranzacția înainte de ștergere pentru a avea informații pentru invalidare inteligentă
    const transaction = await this.getTransactionById(id).catch(() => null);
    
    await this.apiClient.deleteTransaction(id);
    
    // Invalidare cache selectivă
    if (transaction) {
      this.invalidateCache('delete', id, {
        type: transaction.type,
        category: transaction.category
      });
    } else {
      // Fallback dacă nu putem obține informații despre tranzacție
      this.invalidateCache('delete', id);
    }
  }
  
  /**
   * Obține statistici despre cache
   * - Util pentru debugging și optimizare
   */
  getCacheStats(): { 
    entries: number, 
    hits: number, 
    misses: number, 
    ratio: number,
    estimatedMemoryKb: number
  } {
    // Estimăm memoria folosită (aproximare grosieră)
    let totalEntrySize = 0;
    for (const [key, entry] of this.cache.entries()) {
      // Estimare: key + data length aproximată
      const keySize = key.length * 2; // UTF-16 chars
      const dataSize = entry.data.data.length * 500; // ~500 bytes per transaction
      totalEntrySize += keySize + dataSize;
    }
    
    const estimatedMemoryKb = Math.round(totalEntrySize / 1024);
    
    return {
      entries: this.cache.size,
      hits: this.cacheHits,
      misses: this.cacheMisses,
      ratio: this.cacheHits / (this.cacheHits + this.cacheMisses || 1),
      estimatedMemoryKb
    };
  }
  
  /**
   * Curăță cache-ul
   * - Util pentru troubleshooting sau pentru a forța refresh de date
   */
  clearCache(): void {
    this.cache.clear();
  }
}
```

### 5. Implementarea AuthStore pentru Autentificare

```typescript
// frontend/src/stores/authStore.ts
import { create } from 'zustand';
import { supabase } from '../services/supabase';
import type { User, Session } from '@supabase/supabase-js';

interface AuthState {
  // State
  user: User | null;
  session: Session | null;
  loading: boolean;
  error: string | null;
  
  // Actions
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  
  // Initialization
  initialize: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  session: null,
  loading: true,
  error: null,
  
  initialize: async () => {
    try {
      set({ loading: true, error: null });
      
      // Încearcă să recupereze sesiunea curentă
      const { data } = await supabase.auth.getSession();
      
      if (data.session) {
        set({
          user: data.session.user,
          session: data.session,
          loading: false
        });
      } else {
        set({
          user: null,
          session: null,
          loading: false
        });
      }
      
      // Configurează listener pentru schimbarea autentificării
      supabase.auth.onAuthStateChange((event, session) => {
        if (event === 'SIGNED_IN' && session) {
          set({
            user: session.user,
            session,
            loading: false
          });
        } else if (event === 'SIGNED_OUT') {
          set({
            user: null,
            session: null,
            loading: false
          });
        }
      });
    } catch (err) {
      const error = err instanceof Error ? err.message : 'Authentication error';
      set({ error, loading: false });
    }
  },
  
  signIn: async (email: string, password: string) => {
    try {
      set({ loading: true, error: null });
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) throw error;
      
      set({
        user: data.user,
        session: data.session,
        loading: false
      });
    } catch (err) {
      const error = err instanceof Error ? err.message : 'Sign in error';
      set({ error, loading: false });
    }
  },
  
  signUp: async (email: string, password: string) => {
    try {
      set({ loading: true, error: null });
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password
      });
      
      if (error) throw error;
      
      set({
        // Confirmarea email-ului ar putea fi necesară, așa că nu setăm user/session
        // până când nu avem confirmarea
        loading: false
      });
    } catch (err) {
      const error = err instanceof Error ? err.message : 'Sign up error';
      set({ error, loading: false });
    }
  },
  
  signOut: async () => {
    try {
      set({ loading: true, error: null });
      
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      set({
        user: null,
        session: null,
        loading: false
      });
    } catch (err) {
      const error = err instanceof Error ? err.message : 'Sign out error';
      set({ error, loading: false });
    }
  },
  
  resetPassword: async (email: string) => {
    try {
      set({ loading: true, error: null });
      
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin + '/reset-password',
      });
      
      if (error) throw error;
      
      set({ loading: false });
    } catch (err) {
      const error = err instanceof Error ? err.message : 'Password reset error';
      set({ error, loading: false });
    }
  }
}));
```

### 6. Modificarea minimă a transactionStore

```typescript
// frontend/src/stores/transactionStore.ts
import { create } from 'zustand';
import { TransactionService } from '../services/transactionService';
import { Transaction, TransactionQueryParams, TransactionFormWithNumberAmount } from '../types/transaction';
import { PAGINATION, MESAJE } from '@shared-constants';

// Doar modificarea importului spre noul TransactionService care acum folosește Supabase
// Restul store-ului rămâne identic pentru a menține compatibilitatea

export interface TransactionState {
  // State - rămâne neschimbat
  transactions: Transaction[];
  total: number;
  currentQueryParams: TransactionQueryParams;
  _lastQueryParams?: TransactionQueryParams;
  loading: boolean;
  error: string | null;
  transactionService: TransactionService;
  
  // Actions - metode rămân neschimbate
  setTransactions: (transactions: Transaction[]) => void;
  setTotal: (total: number) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setQueryParams: (params: TransactionQueryParams) => void;
  setTransactionService: (service: TransactionService) => void;
  fetchTransactions: (forceRefresh?: boolean) => Promise<void>;
  refresh: () => Promise<void>;
  saveTransaction: (data: TransactionFormWithNumberAmount, id?: string) => Promise<Transaction>;
  removeTransaction: (id: string) => Promise<void>;
  reset: () => void;
}

export const useTransactionStore = create<TransactionState>((set, get) => ({
  // ... implementarea existentă rămâne identică
  // Doar inițializăm TransactionService cu noua implementare ce folosește Supabase
}));
```

### 7. Crearea Componentelor de Autentificare (Login/Register)

```typescript
// frontend/src/components/features/Auth/LoginForm.tsx
import React, { useState } from 'react';
import Button from '../../primitives/Button';
import Input from '../../primitives/Input';
import Alert from '../../primitives/Alert';
import { useAuthStore } from '../../../stores/authStore';

const LoginForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const { signIn, loading, error } = useAuthStore();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await signIn(email, password);
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4" data-testid="login-form">
      <Input
        label="Email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        data-testid="email-input"
      />
      <Input
        label="Parolă"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        data-testid="password-input"
      />
      
      {error && <Alert type="error" message={error} />}
      
      <Button type="submit" disabled={loading} data-testid="login-button">
        {loading ? 'Autentificare...' : 'Autentificare'}
      </Button>
    </form>
  );
};

export default LoginForm;
```

```typescript
// frontend/src/components/features/Auth/RegisterForm.tsx
import React, { useState } from 'react';
import Button from '../../primitives/Button';
import Input from '../../primitives/Input';
import Alert from '../../primitives/Alert';
import { useAuthStore } from '../../../stores/authStore';

const RegisterForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [formError, setFormError] = useState('');
  
  const { signUp, loading, error } = useAuthStore();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setFormError('');
    
    if (password !== confirmPassword) {
      setFormError('Parolele nu coincid');
      return;
    }
    
    await signUp(email, password);
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4" data-testid="register-form">
      <Input
        label="Email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        data-testid="email-input"
      />
      <Input
        label="Parolă"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        data-testid="password-input"
      />
      <Input
        label="Confirmă parola"
        type="password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        required
        data-testid="confirm-password-input"
      />
      
      {(formError || error) && <Alert type="error" message={formError || error} />}
      
      <Button type="submit" disabled={loading} data-testid="register-button">
        {loading ? 'Înregistrare...' : 'Înregistrare'}
      </Button>
    </form>
  );
};

export default RegisterForm;
```

### 8. Adăugarea Protecției la Nivel de Rută

```typescript
// frontend/src/App.tsx
import React, { useEffect } from 'react';
import { useAuthStore } from './stores/authStore';
import LoginForm from './components/features/Auth/LoginForm';
import RegisterForm from './components/features/Auth/RegisterForm';
import TransactionForm from './components/features/TransactionForm/TransactionForm';
import TransactionTable from './components/features/TransactionTable/TransactionTable';
import TransactionFilters from './components/features/TransactionFilters/TransactionFilters';
import { TITLES } from '@shared-constants';
import { useTransactionStore } from './stores/transactionStore';
import { useTransactionFiltersStore } from './stores/transactionFiltersStore';

export const App: React.FC = () => {
  const { user, loading: authLoading, initialize } = useAuthStore();
  
  // Inițializează autentificarea la încărcarea aplicației
  useEffect(() => {
    initialize();
  }, [initialize]);
  
  // Transactionstore și filter store - rămân neschimbate
  const currentQueryParams = useTransactionStore((state) => state.currentQueryParams);
  const setQueryParams = useTransactionStore((state) => state.setQueryParams);
  const limit = currentQueryParams.limit || 10;
  const offset = currentQueryParams.offset || 0;
  const filterType = useTransactionFiltersStore(s => s.filterType) || '';
  const filterCategory = useTransactionFiltersStore(s => s.filterCategory) || '';
  const setFilterType = useTransactionFiltersStore(s => s.setFilterType);
  const setFilterCategory = useTransactionFiltersStore(s => s.setFilterCategory);
  
  // Fetch transactions când utilizatorul este logat
  useEffect(() => {
    if (user) {
      useTransactionStore.getState().fetchTransactions();
    }
  }, [user]);
  
  // Funcții pentru navigare - neschimbate
  const handlePageChange = React.useCallback((newOffset: number) => {
    setQueryParams({
      ...currentQueryParams,
      offset: newOffset
    });
  }, [currentQueryParams, setQueryParams]);
  
  // Afișează loading state în timpul autentificării
  if (authLoading) {
    return <div className="flex justify-center items-center h-screen">Se încarcă...</div>;
  }
  
  // Afișează formular de login dacă utilizatorul nu este autentificat
  if (!user) {
    return (
      <div className="max-w-md mx-auto my-8">
        <h1 className="text-2xl font-bold mb-6">Autentificare</h1>
        <LoginForm />
        <div className="mt-4 text-center">
          <p>Nu ai cont? <a href="/register" className="text-primary">Înregistrează-te</a></p>
        </div>
      </div>
    );
  }
  
  // Afișează aplicația pentru utilizatorii autentificați
  return (
    <div className="max-w-[900px] mx-auto my-8 font-sans">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">{TITLES.TRANZACTII}</h1>
        <Button 
          variant="secondary" 
          onClick={() => useAuthStore.getState().signOut()}
          data-testid="logout-button"
        >
          Deconectare
        </Button>
      </div>

      <TransactionForm />

      <TransactionFilters
        type={filterType}
        category={filterCategory}
        onTypeChange={setFilterType}
        onCategoryChange={setFilterCategory}
      />

      <TransactionTable offset={offset} limit={limit} onPageChange={handlePageChange} />

      {/* Restul UI-ului rămâne identic */}
    </div>
  );
};

export default App;
```

### 9. Actualizare Environment Variables

Creează/actualizează fișierele `.env`:

```bash
# .env.local
REACT_APP_SUPABASE_URL=https://your-project.supabase.co
REACT_APP_SUPABASE_ANON_KEY=your-anon-key-from-supabase
```

### 10. Testare - Actualizare Mock-uri

```typescript
// frontend/src/test/mocks/supabaseMock.ts
export const mockSupabase = {
  auth: {
    getSession: jest.fn().mockResolvedValue({ data: { session: null } }),
    getUser: jest.fn().mockResolvedValue({ data: { user: { id: 'mock-user-id' } } }),
    signInWithPassword: jest.fn(),
    signUp: jest.fn(),
    signOut: jest.fn(),
    resetPasswordForEmail: jest.fn(),
    onAuthStateChange: jest.fn(),
  },
  from: jest.fn().mockReturnValue({
    select: jest.fn().mockReturnThis(),
    insert: jest.fn().mockReturnThis(),
    update: jest.fn().mockReturnThis(),
    delete: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
    order: jest.fn().mockReturnThis(),
    range: jest.fn().mockReturnThis(),
    single: jest.fn().mockReturnThis(),
  }),
};

// Mock-uiește importul
jest.mock('../services/supabase', () => ({
  supabase: mockSupabase,
}));
```

## Strategii Avansate pentru Volume Extrem de Mari

### Optimizări pentru 6000-12000 Tranzacții și Implementări de Performanță

1. **Indexare Avansată în Supabase**
   - Indecși compuși pentru filtrele cele mai frecvente (user+type, user+date, etc.)
   - Indecși specializați pentru rapoarte (ex: agregări după lună/an)
   - Partitionarea tabelei după ani pentru performanță cu date istorice
   - Strategie incrementală: adaugă indecși noi bazați pe pattern-urile de utilizare

2. **Cursor-Based Pagination vs. Offset Pagination**
   - Implementarea paginării bazate pe cursor pentru performanță superioară:
   ```typescript
   // În SupabaseService, paginare prin cursor în loc de offset
   async getTransactions(queryParams?: TransactionQueryParams): Promise<PaginatedResponse<Transaction>> {
     const { cursor, limit = 20, type, category } = queryParams || {};
     
     let query = supabase.from('transactions').select('*', { count: 'exact' });
     
     // Filtrare
     if (type) query = query.eq('type', type);
     if (category) query = query.eq('category', category);
     
     // Ordonare după ID (sau altă coloană distinctă)
     query = query.order('date', { ascending: false }).order('id', { ascending: false });
     
     // Paginare pe bază de cursor în loc de offset
     if (cursor) {
       const [cursorDate, cursorId] = cursor.split('_');
       query = query.or(`date.lt.${cursorDate},and(date.eq.${cursorDate},id.lt.${cursorId})`);
     }
     
     // Număr fix de rezultate
     query = query.limit(limit);
     
     const { data, error, count } = await query;
     
     // Generăm cursor pentru pagina următoare
     const nextCursor = data?.length && data.length === limit
       ? `${data[data.length - 1].date}_${data[data.length - 1].id}`
       : null;
     
     return {
       data: data || [],
       total: count || 0,
       limit,
       nextCursor
     };
   }
   ```

3. **Caching Robust Hibrid (LRU + LFU)**
   - Strategia implementată în secțiunea 4 combină:
     - Least Recently Used (LRU) pentru recență
     - Least Frequently Used (LFU) pentru frecvență
     - Timp-TTL pentru prospețimea datelor
   - Invalidare selectivă și inteligentă bazată pe context
   - Dimensiune cache adaptivă bazată pe volumul de date

4. **Virtualizare pentru Tabele Mari**
   - Implementează react-window sau react-virtualized pentru randarea eficientă a listelor mari:
   ```typescript
   // frontend/src/components/features/TransactionTable/TransactionTable.tsx
   import { FixedSizeList as List } from 'react-window';
   
   // În interiorul funcției render:
   return (
     <div className="h-[600px] w-full">
       <List
         height={600}
         width="100%"
         itemCount={transactions.length}
         itemSize={50}
       >
         {({ index, style }) => (
           <div style={style} className="flex">
             {/* Renderare eficientă doar a elementelor vizibile */}
             <div>{transactions[index].date}</div>
             <div>{transactions[index].amount}</div>
             {/* ... */}
           </div>
         )}
       </List>
     </div>
   );
   ```

5. **Strategii de Filtrare și Căutare Avansate**
   - Implementează debouncing pentru filtrări în timp real:
   ```typescript
   import { debounce } from 'lodash';
   
   // În componenta de filtrare:
   const debouncedSearch = debounce((term: string) => {
     setQueryParams({ ...queryParams, search: term });
   }, 300);
   ```
   
   - Caching dedicat pentru operații de căutare:
   ```typescript
   // În serviciu cache separat pentru căutare (diferit de cache-ul principal)
   const searchCache = new Map<string, Transaction[]>();
   ```

6. **Optimization pentru Date Statistice**
   - Pre-calculează agregări comune (sume lunare, anuale) și cache local:
   ```typescript
   // Exemplu de agregare locală pentru dashboard
   const monthlyTotals = useMemo(() => {
     const totals: Record<string, Record<string, number>> = {};
     
     for (const tx of transactions) {
       const monthYear = format(new Date(tx.date), 'yyyy-MM');
       if (!totals[monthYear]) totals[monthYear] = { income: 0, expense: 0 };
       
       if (tx.type === 'INCOME') 
         totals[monthYear].income += Number(tx.amount);
       else if (tx.type === 'EXPENSE')
         totals[monthYear].expense += Number(tx.amount);
     }
     
     return totals;
   }, [transactions]);
   ```

7. **Persistent Caching pentru Sesiuni Lungi**
   - Implementarea persistenței în localStorage pentru cache critical:
   ```typescript
   // În TransactionService
   private persistCache(): void {
     try {
       const cacheToPersist = Array.from(this.cache.entries())
         .filter(([_, entry]) => entry.hits > 5) // Persistă doar intrările frecvent folosite
         .slice(0, 20); // Limitează numărul de intrări persistate
         
       localStorage.setItem(
         'persistent_cache',
         JSON.stringify(cacheToPersist)
       );
     } catch (e) {
       // Ignore localStorage errors
     }
   }
   
   private loadPersistedCache(): void {
     try {
       const persistedCache = localStorage.getItem('persistent_cache');
       if (persistedCache) {
         const entries = JSON.parse(persistedCache);
         for (const [key, entry] of entries) {
           this.cache.set(key, {
             ...entry,
             timestamp: Date.now() - (60 * 1000) // Setează timestamp-ul recent, dar nu foarte recent
           });
         }
       }
     } catch (e) {
       // Ignore localStorage errors
     }
   }
   ```

## Considerații de Securitate

1. **Row Level Security (RLS) în Supabase**
   - Asigură-te că toate tabelele au RLS activat
   - Testează policies pentru a verifica că utilizatorii nu pot accesa date care nu le aparțin

2. **Autentificare și Sesiuni**
   - Implementează auto-refresh pentru tokeni
   - Folosește stocarea token-ului în memory (nu localStorage) pentru sesiuni scurte
   - Pentru sesiuni lungi, folosește opțiunea persistSession din Supabase

3. **Validare de Date**
   - Păstrează validările Zod existente pentru a asigura integritatea datelor
   - Adaugă validări suplimentare pe tabelele Supabase prin constraints

## Potențiale Probleme și Soluții

1. **Problema**: Migrarea datelor existente
   - **Soluție**: Implementează un script de migrare care rulează la prima autentificare și transferă datele locale în Supabase

2. **Problema**: RLS blochează accesul la date
   - **Soluție**: Verifică consolă pentru erori 403/401 și asigură-te că policies sunt configurate corect

3. **Problema**: TypeScript errors cu Supabase response types
   - **Soluție**: Folosește tipurile definite în proiect (Transaction) și explicit cast-ing unde e necesar

4. **Problema**: Erori de referințe circulare în `AuthStore` și `TransactionStore`
   - **Soluție**: Folosește eventuri custom sau callback-uri în loc de referințe directe între store-uri

## Verificare Finală

După implementare, verifică următoarele:
- Autentificarea funcționează (login, register, logout)
- Datele sunt stocate și recuperate corect din Supabase
- UI-ul rămâne consistent și funcțional
- Testele trec (după actualizarea mock-urilor)
- Nu există erori în consolă
- RLS funcționează corect pentru separarea datelor între utilizatori
- Caching-ul funcționează și oferă performanță bună pentru volumele de date actuale și preconizate

Prin urmarea acestui tech story detaliat, vei putea integra Supabase în aplicația existentă păstrând arhitectura actuală și cu un system de caching optimizat pentru volume mari de tranzacții financiare pe termen lung.
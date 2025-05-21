import { useQuery } from '@tanstack/react-query';
import { supabaseService, ActiveSubcategory } from '../supabaseService';
import { useAuthStore } from '../../stores/authStore';
import { useMemo } from 'react';

export interface UseActiveSubcategoriesParams {
  category?: string;
  type?: string;
  enabled?: boolean;
}

/**
 * Hook pentru obținerea subcategoriilor active (care au cel puțin o tranzacție)
 * 
 * Folosește React Query pentru caching și revalidare automată
 * Returnează subcategoriile care au tranzacții asociate, pentru a afișa
 * doar opțiuni relevante în filtre
 * 
 * @param params Parametri opționali (category, type) pentru filtrare
 * @returns Rezultatul query-ului cu subcategoriile active și metadate
 */
export function useActiveSubcategories({
  category,
  type,
  enabled = true
}: UseActiveSubcategoriesParams = {}) {
  // Obținem userId din store-ul de autentificare
  const { user } = useAuthStore();
  const userId = user?.id;
  
  // Definim cheia de query pentru React Query
  const queryKey = ['activeSubcategories', userId, category, type];
  
  // Executăm query-ul pentru subcategoriile active
  const query = useQuery<ActiveSubcategory[], Error>({
    queryKey,
    queryFn: async () => {
      return supabaseService.fetchActiveSubcategories(userId, category, type);
    },
    gcTime: 5 * 60 * 1000, // 5 minute
    staleTime: 30 * 1000,  // 30 secunde
    enabled: enabled && !!userId, // Activăm query-ul doar dacă userId este disponibil și enabled=true
  });
  
  // Memoizăm lista formatată a subcategoriilor
  const formattedSubcategories = useMemo(() => {
    if (!query.data) return [];
    
    // Transformăm datele în formatul necesar pentru componenta Select
    return query.data.map(item => ({
      value: item.subcategory,
      label: item.subcategory.charAt(0) + item.subcategory.slice(1).toLowerCase().replace(/_/g, ' ') + 
             ` (${item.count})`, // Adăugăm numărul de tranzacții între paranteze
      count: item.count,
      category: item.category
    }));
  }, [query.data]);
  
  // Filtrăm doar subcategoriile din categoria selectată (dacă există una)
  const filteredSubcategories = useMemo(() => {
    if (!category) return formattedSubcategories;
    
    return formattedSubcategories.filter(item => item.category === category);
  }, [formattedSubcategories, category]);
  
  return {
    subcategories: filteredSubcategories,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
    // Adăugăm informații utile pentru componente
    isEmpty: query.data?.length === 0,
    isSuccess: query.isSuccess
  };
} 
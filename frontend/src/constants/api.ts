// Centralizare completă a constantelor pentru API
export const API = {
  BASE_URL: '/transactions',
  ENDPOINTS: {
    GET_ALL: '/', // GET toate tranzacțiile
    GET_ONE: (id: string) => `/${id}`, // GET tranzacție după id
    CREATE: '/', // POST creare tranzacție
    UPDATE: (id: string) => `/${id}`, // PUT/PATCH update tranzacție
    DELETE: (id: string) => `/${id}`, // DELETE tranzacție
  },
  QUERY_PARAMS: {
    TYPE: 'type',
    CATEGORY: 'category',
    DATE_FROM: 'dateFrom',
    DATE_TO: 'dateTo',
    LIMIT: 'limit',
    OFFSET: 'offset',
    SORT: 'sort',
  },
  DEFAULT_HEADERS: {
    'Content-Type': 'application/json',
    // 'Authorization': 'Bearer ...', // de activat dacă va fi nevoie de auth
  },
  TIMEOUT_MS: 10000, // Timeout implicit pentru fetch/axios (ms)
  RETRY_LIMIT: 2, // Număr maxim de retry la requesturi eșuate
};

// Export explicit pentru compatibilitate cu codul existent
export const API_URL = API.BASE_URL;

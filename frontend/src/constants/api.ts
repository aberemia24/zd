export const API = {
  BASE_URL: '/transactions',
  ENDPOINTS: {
    GET_ALL: '',
    GET_ONE: (id: string) => `/${id}`,
    CREATE: '',
    UPDATE: (id: string) => `/${id}`,
    DELETE: (id: string) => `/${id}`,
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
  },
};
// Export explicit pentru compatibilitate cu codul existent
export const API_URL = API.BASE_URL;

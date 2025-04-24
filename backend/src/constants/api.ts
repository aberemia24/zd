// Toate constantele legate de API (rute, query params, headere, timeout-uri)

export const API = {
  ROUTES: {
    TRANSACTIONS: '/transactions',
    // Adaugă aici alte rute principale
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
  HEADERS: {
    CONTENT_TYPE: 'Content-Type',
    AUTHORIZATION: 'Authorization',
  },
  TIMEOUT: 10000, // ms
  RETRY_LIMIT: 3,
};

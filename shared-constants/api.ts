// Constante API partajate între frontend și backend
// OWNER: echipa API & FE
// Orice modificare se documentează în DEV_LOG.md

export const API = {
  ROUTES: {
    TRANSACTIONS: '/transactions',
    // Adaugă aici alte rute principale partajate
  },
  HEADERS: {
    CONTENT_TYPE: 'Content-Type',
    AUTHORIZATION: 'Authorization',
  },
  TIMEOUT: 10000, // ms
  RETRY_LIMIT: 3,
} as const;

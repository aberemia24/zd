// Constante API partajate între frontend și backend
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
  // Parametri pentru timeouts și retries
  TIMEOUT: 10000, // ms
  RETRY_LIMIT: 3,
  
  // Configurație Supabase (configurarea env se face în servicii)
  SUPABASE: {
    URL: 'https://pzyvibdgpfgohvewdmit.supabase.co',
    // ANON_KEY se va configura în servicii din variabile de mediu
  },
} as const;

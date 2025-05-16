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
  // Parametri pentru timeouts și retries
  TIMEOUT: 10000, // ms
  RETRY_LIMIT: 3,
  
  // Configurație Supabase (folosită în script-uri și servicii)
  SUPABASE: {
    URL: process.env.SUPABASE_URL || 'https://pzyvibdgpfgohvewdmit.supabase.co',
    ANON_KEY: process.env.SUPABASE_ANON_KEY,
  },
} as const;

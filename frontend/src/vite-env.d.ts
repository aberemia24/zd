/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL: string;
  readonly VITE_SUPABASE_ANON_KEY: string;
  readonly NODE_ENV: string;
  // Mai mulți environment variables...
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

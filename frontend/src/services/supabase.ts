import { createClient, SupabaseClient } from "@supabase/supabase-js";

// Interfață pentru Vite environment variables
interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL: string;
  readonly VITE_SUPABASE_ANON_KEY: string;
  readonly NODE_ENV: string;
  // Adaugă alte variabile de environment dacă sunt necesare
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

// Configurare Supabase
// Setează valorile în .env.local ca VITE_SUPABASE_URL și VITE_SUPABASE_ANON_KEY

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "";
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "";

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    "[Supabase] Configurare lipsă: setează VITE_SUPABASE_URL și VITE_SUPABASE_ANON_KEY în .env.local",
  );
}

if (!supabaseUrl) {
  console.error("supabaseUrl este obligatoriu în configurare");
}

if (!supabaseAnonKey) {
  console.error("supabaseAnonKey este obligatoriu în configurare");
}

export const supabase: SupabaseClient = createClient(
  supabaseUrl,
  supabaseAnonKey,
);

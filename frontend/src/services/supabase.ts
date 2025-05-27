import { createClient, SupabaseClient } from "@supabase/supabase-js";

// Configurare Supabase
// Setează valorile în .env.local ca VITE_SUPABASE_URL și VITE_SUPABASE_ANON_KEY

const supabaseUrl = (import.meta as any).env.VITE_SUPABASE_URL || "";
const supabaseAnonKey = (import.meta as any).env.VITE_SUPABASE_ANON_KEY || "";

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

import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Se încearcă citirea din variabile de mediu (vite sau CRA)
// Setup corect pentru Create React App (CRA):
// Setează valorile în .env.local ca REACT_APP_SUPABASE_URL și REACT_APP_SUPABASE_ANON_KEY
// Nu comita aceste valori în repo public!
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || '';
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  // Mesaj clar pentru debugging/configurare CI
  // Nu arunca eroare hard, dar loghează vizibil
  // (poate fi util pentru testare/mocking)
  // eslint-disable-next-line no-console
  console.error('[Supabase] Configurare lipsă: setează VITE_SUPABASE_URL și VITE_SUPABASE_ANON_KEY în .env.local');
}

export const supabase: SupabaseClient = createClient(supabaseUrl, supabaseAnonKey);

-- Budget App: Schema Supabase pentru tranzacții
-- Acest script definește structura tabelului, securitatea, indexarea și strategia de scalare pentru volume mari.
-- Poate fi rulat direct în SQL Editor din Supabase.

-- 1. Tabelul principal pentru tranzacții
CREATE TABLE IF NOT EXISTS transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users NOT NULL, -- Legătură cu utilizatorul autenticat
  type TEXT NOT NULL,                          -- Tip tranzacție (ex: income, expense)
  amount NUMERIC NOT NULL,                     -- Suma tranzacției
  currency TEXT NOT NULL DEFAULT 'RON',        -- Moneda (default RON)
  date DATE NOT NULL,                          -- Data tranzacției
  category TEXT,                               -- Categoria principală
  subcategory TEXT,                            -- Subcategoria
  recurring BOOLEAN DEFAULT FALSE,             -- Flag pentru recurență
  frequency TEXT,                              -- Frecvența recurenței (ex: monthly)
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 2. Securitate: Row Level Security (RLS)
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

-- Policy: utilizatorii pot CRUD doar propriile tranzacții
CREATE POLICY IF NOT EXISTS "Users can CRUD own transactions" 
  ON transactions 
  USING (auth.uid() = user_id) 
  WITH CHECK (auth.uid() = user_id);

-- 3. Trigger pentru actualizarea automată a updated_at
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_timestamp ON transactions;
CREATE TRIGGER set_timestamp
BEFORE UPDATE ON transactions
FOR EACH ROW
EXECUTE FUNCTION update_modified_column();

-- 4. Indexare pentru performanță la volume mari
-- Index pentru filtrare rapidă după user_id (cel mai frecvent)
CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON transactions(user_id);
-- Index compus pentru filtrare după user+type
CREATE INDEX IF NOT EXISTS idx_transactions_user_type ON transactions(user_id, type);
-- Index compus pentru filtrare după user+category
CREATE INDEX IF NOT EXISTS idx_transactions_user_category ON transactions(user_id, category);
-- Index pentru filtrare după date (intervale)
CREATE INDEX IF NOT EXISTS idx_transactions_user_date ON transactions(user_id, date);
-- Index pentru sortare descendentă după dată
CREATE INDEX IF NOT EXISTS idx_transactions_date_desc ON transactions(user_id, date DESC);
-- Index pentru sumar lunar (dashboard/rapoarte)
CREATE INDEX IF NOT EXISTS idx_transactions_month_year ON transactions(
  user_id, 
  EXTRACT(YEAR FROM date), 
  EXTRACT(MONTH FROM date)
);
-- [Nice to have] Index suplimentar pentru tranzacții recurente, dacă filtrezi des după acest flag
CREATE INDEX IF NOT EXISTS idx_transactions_user_recurring ON transactions(user_id, recurring);

-- 5. Partitionare (opțional, pentru volume foarte mari)
-- Partitionarea permite izolarea datelor vechi de cele noi pentru performanță
-- (Se recomandă doar după depășirea a ~1 milion de rânduri)
/*
CREATE TABLE transactions_partition (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users NOT NULL,
  type TEXT NOT NULL,
  amount NUMERIC NOT NULL,
  currency TEXT NOT NULL DEFAULT 'RON',
  date DATE NOT NULL,
  category TEXT,
  subcategory TEXT,
  recurring BOOLEAN DEFAULT FALSE,
  frequency TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
) PARTITION BY RANGE (EXTRACT(YEAR FROM date));

-- Creează partiții pentru anii curenți și viitori
CREATE TABLE transactions_y2023 PARTITION OF transactions_partition 
  FOR VALUES FROM (2023) TO (2024);
CREATE TABLE transactions_y2024 PARTITION OF transactions_partition 
  FOR VALUES FROM (2024) TO (2025);
CREATE TABLE transactions_y2025 PARTITION OF transactions_partition 
  FOR VALUES FROM (2025) TO (2026);
*/

-- END OF SCRIPT --
-- Pentru orice modificare a schemei, documentează și actualizează acest fișier.
-- Dacă ai nevoie de agregări complexe, poți adăuga funcții/rpc suplimentare.

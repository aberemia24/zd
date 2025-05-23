-- Adaugă coloana description la tabela transactions
-- Data: 2025-12-19
-- Task: Support pentru descriere la tranzacții

-- Adăugăm coloana description (opțională)
ALTER TABLE transactions 
ADD COLUMN IF NOT EXISTS description TEXT;

-- Comentăm modificarea
COMMENT ON COLUMN transactions.description IS 'Descriere opțională pentru tranzacție (ex: "Plată chirie", "Salariu")';

-- Creăm un index pentru căutare în descripții dacă va fi necesar
CREATE INDEX IF NOT EXISTS idx_transactions_description 
ON transactions USING gin(to_tsvector('romanian', description))
WHERE description IS NOT NULL;

-- Verificăm că modificarea a fost aplicată
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'transactions' 
AND column_name = 'description'; 
# 📊 DOCUMENTAȚIE BAZA DE DATE - BUZUNARUL

## 🏢 Informații Generale Proiect

**Nume Proiect:** Buzunarul  
**Platform:** Supabase  
**Region:** Europa Centrală (eu-central-1)  
**Status:** ACTIVE_HEALTHY ✅  
**Database Engine:** PostgreSQL 15.8.1  
**Host:** db.pzyvibdgpfgohvewdmit.supabase.co  
**Project ID:** pzyvibdgpfgohvewdmit  
**Organizație:** ZD  

---

## 📈 Statistici Generale

| Metrică | Valoare |
|---------|---------|
| **Total Tranzacții** | 172 |
| **Utilizatori Unici** | 2 |
| **Perioada Date** | 1 Ian 2025 - 5 Iul 2025 |
| **Total Venituri** | 39,766 RON |
| **Total Cheltuieli** | 4,711,176.41 RON |
| **Total Economii** | 63,380.84 RON |

---

## 🗂️ SCHEMA BAZEI DE DATE

### Schema `public` (Tabele de Aplicație)

#### 1. 💳 Tabela `transactions`

**Descriere:** Tabela principală pentru stocarea tranzacțiilor financiare ale utilizatorilor.

**Statistici:**
- **Dimensiune:** 560 kB
- **Înregistrări Active:** 172
- **Înregistrări Moarte:** 49
- **RLS Activat:** ✅

**Structura Coloanelor:**

| Coloană | Tip | Opțiuni | Descriere |
|---------|-----|---------|-----------|
| `id` | UUID | PRIMARY KEY, NOT NULL, DEFAULT gen_random_uuid() | Identificator unic |
| `user_id` | UUID | NOT NULL, FK → auth.users.id | Referință la utilizator |
| `type` | TEXT | NOT NULL | Tipul tranzacției: INCOME, EXPENSE, SAVING |
| `amount` | NUMERIC | NOT NULL | Suma tranzacției |
| `currency` | TEXT | NOT NULL, DEFAULT 'RON' | Codul valutei |
| `date` | DATE | NOT NULL | Data tranzacției |
| `category` | TEXT | NULLABLE | Categoria principală |
| `subcategory` | TEXT | NULLABLE | Subcategoria tranzacției |
| `recurring` | BOOLEAN | DEFAULT false | Tranzacție recurentă |
| `frequency` | TEXT | NULLABLE | Frecvența recurenței |
| `description` | TEXT | NULLABLE | Descriere opțională |
| `status` | TEXT | DEFAULT 'COMPLETED', CHECK | Status: PLANNED sau COMPLETED |
| `created_at` | TIMESTAMPTZ | DEFAULT now() | Data creării |
| `updated_at` | TIMESTAMPTZ | DEFAULT now() | Data ultimei actualizări |

**Indexuri Optimizate:**
- `transactions_pkey` - Primary key pe `id`
- `idx_transactions_user_id` - Acces rapid pe utilizator
- `idx_transactions_date_desc` - Sortare cronologică descendentă
- `idx_transactions_month_year` - Grupare pe lună/an
- `idx_transactions_user_category` - Filtrare pe categorie
- `idx_transactions_user_type` - Filtrare pe tip tranzacție
- `idx_transactions_user_recurring` - Tranzacții recurente
- `idx_transactions_description` - Index GIN cu text search română

**Top Categorii de Tranzacții:**
1. **EDUCATIE/Taxe școlare** - 13 tranzacții (avg: 42,930 RON)
2. **NUTRITIE/Alimente** - 13 tranzacții (avg: 151 RON)
3. **SANATATE/Medicamente** - 11 tranzacții (avg: 268,925 RON)
4. **INFATISARE/Salon** - 9 tranzacții (avg: 854 RON)
5. **VENITURI/Dividende** - 8 tranzacții (avg: 123 RON)

---

#### 2. 🎨 Tabela `custom_categories`

**Descriere:** Gestionarea categoriilor personalizate pentru fiecare utilizator.

**Statistici:**
- **Dimensiune:** 552 kB
- **Înregistrări:** 1
- **RLS Activat:** ✅

**Structura Coloanelor:**

| Coloană | Tip | Opțiuni | Descriere |
|---------|-----|---------|-----------|
| `id` | UUID | PRIMARY KEY, DEFAULT uuid_generate_v4() | Identificator unic |
| `user_id` | UUID | NOT NULL, FK → auth.users.id | Referință la utilizator |
| `category_data` | JSONB | NOT NULL, CHECK jsonb_typeof = 'object' | Date categorii în format JSON |
| `version` | INTEGER | DEFAULT 1 | Versiunea schemei |
| `created_at` | TIMESTAMPTZ | DEFAULT now() | Data creării |
| `updated_at` | TIMESTAMPTZ | DEFAULT now() | Data ultimei actualizări |

**Indexuri:**
- `custom_categories_pkey` - Primary key
- `idx_custom_categories_user_id` - Acces pe utilizator
- `idx_custom_categories_category_data` - Index GIN pentru JSONB

**Structura JSONB `category_data`:**
```json
{
  "version": 309,
  "categories": [
    {
      "name": "VENITURI",
      "isCustom": false,
      "subcategories": [
        {
          "name": "Salarii",
          "isCustom": false
        }
      ]
    }
  ]
}
```

**Categorii Disponibile:**
- **VENITURI** (16 subcategorii)
- **ECONOMII** (7 subcategorii)
- **INFATISARE** (13 subcategorii)
- **EDUCATIE** (10 subcategorii)
- **CARIERA** (6 subcategorii)
- **SANATATE** (8 subcategorii)
- **NUTRITIE** (7 subcategorii)
- **LOCUINTA** (16 subcategorii)
- **TIMP_LIBER** (14 subcategorii)
- **CALATORII** (10 subcategorii)
- **TRANSPORT** (14 subcategorii)
- **INVESTITII** (5 subcategorii)

---

### Schema `auth` (Sistem Autentificare Supabase)

**Tabele Standard Supabase Auth:**
- `users` - Utilizatori înregistrați
- `sessions` - Sesiuni active
- `refresh_tokens` - Token-uri de refresh
- `identities` - Identități externe (OAuth)
- `audit_log_entries` - Log audit autentificare
- `instances`, `flow_state`, `mfa_*`, `saml_*`, `sso_*` - Funcționalități avansate

---

## 🔒 SECURITATE (Row Level Security)

### Policies pentru `transactions`:

1. **User can select own transactions**
   - Tip: SELECT
   - Condiție: `(user_id = auth.uid())`

2. **User can insert own transactions**
   - Tip: INSERT
   - Verificare: `(user_id = auth.uid())`

3. **User can update own transactions**
   - Tip: UPDATE
   - Condiție: `(user_id = auth.uid())`

4. **User can delete own transactions**
   - Tip: DELETE
   - Condiție: `(user_id = auth.uid())`

5. **users_can_crud_own_transactions**
   - Tip: ALL
   - Condiție: `(auth.uid() = user_id)`

### Policies pentru `custom_categories`:

1. **Users can only access their own categories**
   - Tip: ALL
   - Condiție: `(auth.uid() = user_id)`

---

## 🔧 EXTENSII POSTGRESQL INSTALATE

### Extensii Active:
- **pgcrypto** (1.3) - Funcții criptografice
- **pgjwt** (0.2.0) - JSON Web Token API
- **pg_stat_statements** (1.10) - Statistici performanță query-uri
- **uuid-ossp** (1.1) - Generare UUID
- **pg_graphql** (1.5.11) - Suport GraphQL
- **supabase_vault** (0.3.1) - Vault pentru secrete

### Extensii Disponibile (Neinstalate):
- **postgis** - Suport pentru date geospațiale
- **pg_cron** - Scheduler pentru job-uri
- **timescaledb** - Optimizare time-series
- **vector** - Suport pentru vectori AI
- **http** - Client HTTP în PostgreSQL

---

## 📊 PERFORMANȚA ȘI OPTIMIZAREA

### Indexuri Strategice:

**Pentru `transactions`:**
- **Temporal**: `idx_transactions_date_desc`, `idx_transactions_month_year`
- **Categorizare**: `idx_transactions_user_category`, `idx_transactions_user_type`
- **Search**: `idx_transactions_description` (GIN cu română)
- **Filtrare**: `idx_transactions_user_recurring`

**Pentru `custom_categories`:**
- **JSONB**: `idx_custom_categories_category_data` (GIN)

### Verificări de Integritate:
- **Status transactions**: CHECK (`status IN ('PLANNED', 'COMPLETED')`)
- **JSONB structure**: CHECK (`jsonb_typeof(category_data) = 'object'`)

---

## 🛠️ RECOMANDĂRI DEZVOLTARE

### Îmbunătățiri Sugerate:

1. **Backup Strategy**
   - Configurare backup automat zilnic
   - Point-in-time recovery

2. **Monitoring**
   - Activare pg_stat_statements pentru analiza performanței
   - Alerting pentru query-uri lente

3. **Optimizări**
   - Consideră partiționarea pe `date` pentru `transactions`
   - Archive pentru date mai vechi de 1 an

4. **Securitate**
   - Periodic review RLS policies
   - Audit log pentru modificări critice

### Extensii Utile de Adăugat:
- **pg_cron** - Pentru taskuri recurente (ex: generare rapoarte)
- **postgis** - Dacă planificați funcții de localizare
- **timescaledb** - Pentru analize time-series avansate

---

## 📝 CHANGELOG SCHEMA

**Ultima Actualizare:** 8 iunie 2025  
**Versiune Custom Categories:** 309  

### Modificări Recente:
- Adăugare subcategorii personalizate în multiple categorii
- Optimizare indexuri pentru performanță
- Implementare RLS policies complete

---

**📅 Generat:** Ianuarie 2025  
**🔄 Status:** Documentație actualizată și completă  
**✅ Verificat:** Toate tabelele, indexurile și policies verificate 
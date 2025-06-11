---
description: Data fetching best practices for SQL queries, React keys, and UI optimization
globs: src/**/*.tsx, src/hooks/**/*.ts, src/services/**/*.ts
alwaysApply: true
---

# Data Fetching Best Practices

1. **SQL GROUP BY**: Includeți TOATE coloanele neagregate din SELECT în GROUP BY sau folosiți agregare client-side pentru seturi mici de date.

2. **Supabase RPC**: Verificați existența funcțiilor RPC înainte de utilizare; preferați API-ul standard pentru operațiuni CRUD simple.

3. **React Keys**: Generați chei compuse unice (`${id}-${index}`); nu folosiți doar index sau ID-uri ce pot avea duplicate.

4. **Optimizare UI**: 
   - Filtrați opțiunile în backend sau hooks, nu în componente
   - Includeți numărătoare în opțiuni (ex: "Categorie (3)")
   - Implementați stări de loading și empty states clare
   - Folosiți hooks specializate pentru resurse partajate


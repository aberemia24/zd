# Optimizarea încărcării datelor în LunarGrid prin implementarea unui hook specializat useMonthlyTransactions

## Context

În prezent, atât componenta LunarGrid (vizualizare tabel lunar), cât și pagina de Tranzacții folosesc același hook `useTransactions` bazat pe `useInfiniteQuery`. Această abordare este potrivită pentru pagina de Tranzacții (paginare infinită), dar suboptimală pentru LunarGrid, unde este nevoie de toate tranzacțiile dintr-o lună într-o singură cerere. Există și un wrapper intermediar `useLunarGridTransactions` care adaugă complexitate fără beneficii reale.

## Obiective

- Implementarea unui hook specializat pentru încărcarea completă a datelor lunare
- Eliminarea wrapper-ului `useLunarGridTransactions`
- Menținerea infinite scrolling pentru pagina de Tranzacții
- Integrarea noului hook direct în `LunarGrid` și `useLunarGridTable`

## Soluție tehnică

1. **Crearea hook-ului specializat `useMonthlyTransactions`**
   - Fișier nou: `frontend/src/services/hooks/useMonthlyTransactions.ts`
   - Folosește `useQuery` pentru a încărca toate tranzacțiile din luna selectată (sau cu opțiunea de a include zile adiacente).
   - Query-ul este activ doar dacă există `userId`.
   - Returnează tranzacțiile, statusul de încărcare, eroarea și totalul.

2. **Eliminarea wrapper-ului `useLunarGridTransactions`**
   - Ștergere completă a fișierului `frontend/src/components/features/LunarGrid/hooks/useLunarGridTransactions.ts`.
   - Componentele relevante vor folosi direct noul hook.

3. **Actualizarea `useLunarGridTable.tsx`**
   - Import direct al noului hook.
   - Înlocuirea logicii de fetch cu `useMonthlyTransactions`.
   - Restul pipeline-ului de procesare date rămâne neschimbat.

4. **Actualizarea componentei `LunarGrid`**
   - Import direct al noului hook.
   - Utilizare hook pentru încărcarea datelor lunare.
   - Tratare erori cu `useEffect`.

5. **Actualizarea componentei `LunarGridTanStack`**
   - Dacă folosește direct `useLunarGridTable`, nu necesită modificare.
   - Dacă folosea vechiul wrapper, se înlocuiește cu noul hook.

6. **Crearea utilitarelor comune pentru mutații (opțional)**
   - Fișier nou: `frontend/src/services/hooks/transactionMutations.ts`
   - Hook-uri pentru create/update/delete tranzacții, cu invalidarea cache-ului la succes.

7. **Actualizarea componentelor pentru a folosi noile mutații (opțional)**
   - Separă responsabilitățile și optimizează codul pentru mentenanță.

## Acceptanță

- Hook-ul specializat pentru încărcarea lunară este implementat și funcțional
- Wrapper-ul intermediar a fost eliminat
- LunarGrid încarcă toate datele lunare într-o singură cerere
- Pagina de Tranzacții continuă să folosească paginare infinită
- Mutațiile funcționează corect și cache-ul este invalidat
- Toate regulile și best practices React/TypeScript au fost respectate

## Note de implementare

- S-a creat un hook nou, specializat, pentru încărcarea datelor lunare.
- Wrapper-ul intermediar a fost eliminat pentru simplitate arhitecturală.
- Noul hook a fost integrat direct în componentele relevante.
- Opțional, mutațiile au fost extrase în hook-uri reutilizabile pentru claritate și testabilitate.

## Beneficii

- Separarea clară a responsabilităților între infinite scrolling (pagina Tranzacții) și fetch complet (LunarGrid).
- Performanță optimizată pentru fiecare caz de utilizare.
- Cod mai simplu, mai ușor de întreținut și testat.

## Status

Implementat și validat conform criteriilor de acceptanță.

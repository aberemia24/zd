# Dev Log / Changelog

## Changelog & Lessons Learned (2025-04-21)

- Toate dependențele NestJS, ts-jest, typescript și alte pachete critice au fost sincronizate la aceeași versiune în toate workspace-urile.
- Importurile între backend și shared au fost corectate pentru compatibilitate monorepo.
- Configurarea Jest/ts-jest a fost adusă la zi pentru a detecta și rula toate testele e2e.
- Adăugate class-validator și class-transformer pentru ValidationPipe.
- Toate testele e2e backend rulează și trec.
- A fost creat și completat fișierul BEST_PRACTICES.md cu toate regulile și lecțiile critice pentru dezvoltare și mentenanță.
- Orice lessons learned, workaround sau convenție nouă se documentează și în BEST_PRACTICES.md.

Acest fișier conține toate modificările, deciziile și pașii importanți din dezvoltarea aplicației de bugetare.

---

## [2025-04-21] Setup inițial
- Creat structura monorepo: frontend (React + TDD), backend (NestJS + TDD), shared (tipuri comune)
- Adăugat convenții stricte de workflow: TDD, commit-uri dese, fără breaking changes fără context
- Configurat testare automată cu Jest și Testing Library
- Rezolvat probleme de compatibilitate cu dependențe și configurare Jest
- Primul test frontend trecut cu succes
- README și memorie actualizate cu toate convențiile și filozofia de dezvoltare

## [2025-04-21] Categorii și subcategorii (TDD)
- Am definit structura de categorii și subcategorii (venituri, economii, cheltuieli) în `shared/categories.json`, cu chei de localizare pentru fiecare subcategorie
- Am scris teste TDD pentru validarea structurii și a cheilor de localizare
- Am rezolvat problema de import JSON în Jest folosind `require` și ajustând configul Jest
- Toate comentariile și documentația sunt în limba română, conform convențiilor

---

## [2025-04-21] Model unificat Transaction, validare runtime și TDD
- Adăugat modelul unificat `Transaction` în `shared/index.ts` (industry standard, compatibil cu YNAB, Mint, Revolut etc)
- Implementat validare runtime cu `zod` (`TransactionSchema` în `shared/transaction.schema.ts`)
- Adăugat teste TDD pentru model și schema zod (cazuri valide și invalide)
- Instalare `zod` în workspace-ul `shared/`
- Actualizat roadmap și README pentru a reflecta progresul
- Toate testele trec. Structura pregătită pentru integrare API bancar și validare date externe



> Orice modificare, decizie arhitecturală, bug fix sau feature nou trebuie adăugată aici cu dată și descriere clară!

---

## [2025-04-21 23:15] GET /transactions: filtrare, paginare, sortare

- Implementat suport pentru următorii query params la endpoint-ul GET `/transactions`:
  - `type` (string, opțional): filtrează după tipul tranzacției (`income`, `expense`, `saving`, `transfer`)
  - `category` (string, opțional): filtrează după categorie
  - `dateFrom` (string, opțional, format YYYY-MM-DD): tranzacții cu data >= acest parametru
  - `dateTo` (string, opțional, format YYYY-MM-DD): tranzacții cu data <= acest parametru
  - `limit` (number, opțional, default 20): câte rezultate să returneze (paginare)
  - `offset` (number, opțional, default 0): de la ce index să înceapă (paginare)
  - `sort` (string, opțional): câmp după care se face sortarea (`amount`, `date`, `id`, `category`, `type`). Prefix `-` pentru descrescător (ex: `sort=-amount`).

- Structura răspunsului pentru GET `/transactions`:
```json
{
  "data": [ /* array de tranzacții */ ],
  "total": 100, // numărul total de tranzacții după filtrare
  "limit": 20,  // limită folosită pentru paginare
  "offset": 0   // offset folosit pentru paginare
}
```

- Toate testele e2e pentru aceste funcționalități au trecut.


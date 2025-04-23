# Dev Log / Changelog

## [2025-04-22] Refactorizare modulară frontend, testare și best practices
- Extragere formular tranzacție (`TransactionForm`) și tabel tranzacții (`TransactionTable`) în componente dedicate, cu tipuri și props explicite
- Mutare și colocare teste unitare pentru fiecare componentă în subfolderul corespunzător (`components/TransactionForm/TransactionForm.test.tsx` etc)
- `App.tsx` devine container, fără logică de UI duplicată
- Adăugare și configurare reporteri Jest: `jest-summarizing-reporter` (terminal) și `jest-html-reporter` (HTML)
- Îmbunătățire structură testare: acoperire pozitivă, negativă și edge pentru fiecare componentă
- Observații importante:
  - Pentru orice fetch în teste, trebuie mock global robust (ideal din `setupTests.ts`)
  - Pentru orice update de stare asincron în teste, folosește `await act(...)` sau `waitFor`
  - Console noise trebuie redus pentru claritate în rapoarte
- Toate convențiile și best practices noi au fost adăugate în `BEST_PRACTICES.md` și memorie
- Toate testele unitare și de integrare acoperă cazurile critice pentru UI și API
- Documentație și workflow actualizate conform progresului


## [2025-04-23] Refactorizare avansată TransactionForm, UX dropdown-uri, testare robustă
- Dropdown-urile pentru categorie și subcategorie filtrează dinamic opțiunile în funcție de tipul selectat (Venit, Cheltuială, Economisire).
- Testele pentru TransactionForm validează exhaustiv TOATE subcategoriile posibile pentru fiecare tip/categorie, folosind helper dedicat pentru extragere din sursa de adevăr din cod.
- Structura categorii/subcategorii este exportată explicit din codul sursă și importată direct în teste pentru a evita divergențe și hardcoding.
- S-a introdus un pattern robust pentru testarea dropdown-urilor controlate: helper pentru extragere subcategorii, aserțiuni exhaustive, verificare opțiuni și optgroup-uri.
- Orice modificare a structurii de categorii va fi reflectată automat și în teste, reducând mentenanța și riscul de bug-uri la filtrare.
- Toate testele TransactionForm trec fără erori, acoperind filtrarea dinamică și resetarea valorilor incompatibile.
- Lecțiile și best practices noi au fost documentate și propagate în toate fișierele relevante (BEST_PRACTICES.md, PLAN.md, README.md, memorie).
- Opțiunea 'Transfer' eliminată complet din UI și cod.
- Placeholderul 'Alege' la Tip apare doar dacă nu este selectat nimic, nu mai este opțiune după selectare.
- Testele acoperă: filtrare categorii/subcategorii, scenarii negative, resetare valori incompatibile, existență optgroup-uri, UX placeholder.
- Pentru testarea interacțiunii cu componente controlate, se folosește un wrapper cu stare locală (pattern recomandat pentru React + Testing Library).
- Toate convențiile și comentariile sunt în limba română.
- Toate testele TransactionForm trec fără erori.
- Best practices și lecții documentate pentru dropdown-uri controlate, UX placeholder și testare robustă.
- Toate fișierele relevante (BEST_PRACTICES.md, DEV_LOG.md, PLAN.md, README.md) au fost actualizate cu aceste concluzii și convenții.

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


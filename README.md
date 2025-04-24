# Budget App Monorepo

## 📚 Scop
Aplicație de bugetare modernă, modulară, ușor de extins pe web, Android și iOS. Inspirată dintr-un Excel complex, dar cu reguli stricte de calitate și scalabilitate.

## 📁 Structură directoare
- `frontend/` – React (TypeScript), i18next, localizare, fără texte hardcodate
- `backend/` – NestJS (TypeScript), MongoDB, Firebase Auth, error handling cu chei de localizare
- `shared/` – Tipuri TypeScript și validări comune

## 🧑‍💻 Stack tehnologic
- **Frontend:** React, i18next, TypeScript, React Testing Library, Jest
- **Backend:** NestJS, MongoDB (Atlas), Firebase Auth, Jest
- **Shared:** TypeScript, validări comune (ex: zod/joi)
- **Tooling:** ESLint, Prettier, husky, commitlint, .env pentru config, npm workspaces
- **zod** pentru validare runtime a modelelor de date

## 🧩 Convenții și filozofie
- **TDD:** Test Driven Development peste tot (testele se scriu înainte de cod)
- **Dropdown-urile pentru categorii/subcategorii sunt filtrate dinamic după tipul selectat (Venit, Cheltuială, Economisire).**
- **Testarea filtrării este exhaustivă, folosind helper dedicat pentru extragere subcategorii și sursa de adevăr importată direct din cod. Orice modificare a structurii este reflectată automat și în teste.**
- **Opțiunea 'Transfer' nu mai există la tip.**
- **Placeholderul 'Alege' la Tip este strict placeholder, nu opțiune după selectare.**
- **Testele pentru componente controlate folosesc wrapper cu stare locală pentru simularea interacțiunii reale (React + Testing Library).**
- **Toate convențiile și comentariile sunt în limba română.**
- **Fără hardcoding:** Toate textele (UI, validări, erori, accesibilitate) sunt chei de localizare. Nicio valoare hardcodată în cod!
- **Localizare:** i18next, limba principală română, dar totul pregătit pentru multi-limbă
- **Structură modulară:** Fiecare funcționalitate în module separate (bugete, utilizatori, rapoarte etc)
- **Error handling:** Backend-ul returnează doar coduri și chei de localizare, frontend-ul afișează mesajul tradus
- **Accesibilitate:** Toate label-urile, aria-labels, tooltips etc. sunt chei de localizare
- **Config:** Toate setările și cheile în fișiere `.env` sau config JSON/YAML
- **CI/CD:** (opțional, pe viitor) – GitHub Actions pentru build și test automat
- **Versionare API:** `/api/v1/...` pentru viitoare compatibilitate
- **Documentație:** README detaliat, convenții de commit, workflow de testare

## Eliminarea hardcodărilor (2025-04-24)

- Toate tipurile, categoriile, frecvențele, monedele, textele UI, mesajele, valorile default și endpoint-urile API sunt definite și folosite exclusiv din fișierele din `constants/`.
- Structura de subcategorii este sursă de adevăr unică, importată direct în componente și teste.
- Testele folosesc helperi și importuri directe pentru aserțiuni exhaustive, fără stringuri hardcodate.
- Orice modificare a structurii se reflectă automat și în UI și în teste.
- Avantaje: mentenanță ușoară, consistență, testare robustă, evoluție sigură a codului.
- Status: **FĂRĂ HARDCODĂRI - FINALIZAT**

## API

### GET /transactions

Returnează lista de tranzacții cu suport pentru filtrare, paginare și sortare.

#### Query params acceptați:
- `type` (string, opțional): filtrează după tipul tranzacției (`income`, `expense`, `saving`, `transfer`)
- `category` (string, opțional): filtrează după categorie
- `dateFrom` (string, opțional, format YYYY-MM-DD): tranzacții cu data >= acest parametru
- `dateTo` (string, opțional, format YYYY-MM-DD): tranzacții cu data <= acest parametru
- `limit` (number, opțional, default 20): câte rezultate să returneze (paginare)
- `offset` (number, opțional, default 0): de la ce index să înceapă (paginare)
- `sort` (string, opțional): câmp după care se face sortarea (`amount`, `date`, `id`, `category`, `type`). Prefix `-` pentru descrescător (ex: `sort=-amount`).

#### Structura răspunsului:
```json
{
  "data": [ /* array de tranzacții */ ],
  "total": 100, // numărul total de tranzacții după filtrare
  "limit": 20,  // limită folosită pentru paginare
  "offset": 0   // offset folosit pentru paginare
}
```

## Cum rulezi testele end-to-end

- Asigură-te că toate dependențele critice (NestJS, ts-jest, typescript etc.) sunt la aceeași versiune în toate workspace-urile.
- Vezi și BEST_PRACTICES.md pentru reguli și proceduri de lucru.

## 🔒 Securitate
- Autentificare cu Firebase Auth
- Date sensibile/config în `.env` (niciodată în repo)
- Validare și sanitizare input pe backend

## 🛠️ Setup rapid
1. Clonează repo-ul și instalează dependențele la root:
   ```bash
   npm install
   ```
2. Rulează scripturile de start pentru frontend și backend
3. Adaptează fișierele `.env` după nevoie

## 📝 Alte reguli
- Refactorizare ușoară, convenții stricte de commit (Conventional Commits)
- Teste pentru fiecare modul, inclusiv pentru localizare (chei lipsă)
- Toate datele, mesaje și reguli să fie ușor de modificat fără a schimba codul sursă

---

> Pentru orice modificare a convențiilor, actualizează și acest README!

---

### [2025-04-23] Progres funcționalitate și testare
- Finalizare flux principal tranzacții, testare exhaustivă TransactionForm, TransactionTable, TransactionFilters
- Pattern robust dropdown-uri: helperi, sursă de adevăr importată direct, wrapper cu stare locală
- UI-ul rămâne placeholder până la design final, focus pe funcționalitate, reguli test ID și E2E după
- Toate convențiile și lecțiile propagate în toate fișierele relevante (BEST_PRACTICES.md, DEV_LOG.md, PLAN.md, README.md, memorie)
- Următorul pas: focus pe funcționalitate, apoi stilizare și testare E2E


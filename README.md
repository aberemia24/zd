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

## 🧩 Convenții și filozofie
- **TDD:** Test Driven Development peste tot (testele se scriu înainte de cod)
- **Fără hardcoding:** Toate textele (UI, validări, erori, accesibilitate) sunt chei de localizare. Nicio valoare hardcodată în cod!
- **Localizare:** i18next, limba principală română, dar totul pregătit pentru multi-limbă
- **Structură modulară:** Fiecare funcționalitate în module separate (bugete, utilizatori, rapoarte etc)
- **Error handling:** Backend-ul returnează doar coduri și chei de localizare, frontend-ul afișează mesajul tradus
- **Accesibilitate:** Toate label-urile, aria-labels, tooltips etc. sunt chei de localizare
- **Config:** Toate setările și cheile în fișiere `.env` sau config JSON/YAML
- **CI/CD:** (opțional, pe viitor) – GitHub Actions pentru build și test automat
- **Versionare API:** `/api/v1/...` pentru viitoare compatibilitate
- **Documentație:** README detaliat, convenții de commit, workflow de testare

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

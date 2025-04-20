# Budget App Monorepo

Structură de bază pentru aplicația de bugetare (frontend + backend + shared).

## Structură directoare
- `frontend/` - Aplicația React (i18next, localizare)
- `backend/` - API NestJS (MongoDB, Firebase Auth)
- `shared/`  - Tipuri TypeScript, validări comune

## Setup rapid
1. Instalează dependențele la root și în fiecare subfolder
2. Rulează scripturile de start pentru frontend și backend

## Convenții
- Toate textele și mesajele (inclusiv erorile) sunt chei de localizare
- Fără hardcoding, totul configurabil
- TDD, CI/CD, ESLint + Prettier peste tot

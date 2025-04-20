# PLAN DE DEZVOLTARE: Budget App

## 1. Viziune și Scop
- Transformarea Excel-ului „Buget Finanțe Personale Complex - ZeroDatorii 2024” într-o aplicație web și mobilă modernă.
- Planificare financiară detaliată, pe termen scurt, mediu și lung (zilnic, lunar, anual).
- Orice utilizator va putea vedea în orice zi câți bani are și câți va avea până la finalul lunii, cu alerte pentru zilele cu buget negativ.

---

## 2. Funcționalități de bază (MVP)
- Autentificare (Firebase Auth)
- Dashboard cu situația curentă (sold, venituri, cheltuieli, economii)
- Adăugare/gestionare venituri, cheltuieli, economii (cu recurență, pe categorii/subcategorii)
- Planificare și vizualizare pe zile/luni/an
- Rapoarte: surplus/deficit, progres economii, depășiri de buget
- Alerte pentru zile cu buget negativ sau apropiat de zero
- Personalizare categorii și subcategorii
- Două planuri: Free și Premium (structură simplificată la început)

---

## 3. Arhitectură și organizare
- Monorepo: frontend (React, i18next, TDD), backend (NestJS, MongoDB, TDD), shared (tipuri, validări)
- Structură modulară: fiecare funcționalitate (ex: planificare, rapoarte, economii) în module distincte
- Constants/config separate: categorii, subcategorii, reguli, limbi, etc.
- README și DEV_LOG actualizate constant
- Comentarii clare și documentație la fiecare feature nou
- Fără hardcoding – totul configurabil și localizabil

---

## 4. Flux de lucru și best practices
- TDD peste tot: fiecare feature începe cu teste
- Commit-uri dese, mesaje descriptive, fără breaking changes fără context
- Branch main doar pentru cod stabil
- Branch-uri de feature pentru orice funcționalitate nouă
- Pull request-uri și code review (chiar dacă e solo, pentru istoric și context)
- Actualizare constantă a DEV_LOG.md și README.md
- Organizare clară a folderelor și codului
- Refactorizare doar incremental, cu teste și context

---

## 5. Iterații propuse (roadmap inițial)
1. Setup complet proiect, TDD, categorii/config, autentificare
2. Dashboard și model de date (venituri, cheltuieli, economii)
3. Adăugare și vizualizare tranzacții pe zile/luni/an
4. Rapoarte și alerte
5. Personalizare categorii/subcategorii
6. Planuri Free/Premium (feature gating simplu)
7. Feedback utilizator, accesibilitate, polish UI
8. Pregătire pentru mobil (React Native)

---

## 6. Ce urmează?
- Pasul 1: Definim și implementăm modelul de date pentru venituri, cheltuieli, economii (inclusiv recurență, categorii, subcategorii).
- Pasul 2: Setup endpoint-uri backend pentru aceste modele și testele lor.
- Pasul 3: Setup UI de bază pentru dashboard și adăugare tranzacții (cu TDD).
- Pasul 4: Integrare frontend-backend pentru fluxul de bază.

---

> Orice modificare de strategie, arhitectură sau roadmap trebuie reflectată și aici!

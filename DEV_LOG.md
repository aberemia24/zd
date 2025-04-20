# Dev Log / Changelog

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

> Orice modificare, decizie arhitecturală, bug fix sau feature nou trebuie adăugată aici cu dată și descriere clară!

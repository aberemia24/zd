# Bune Practici și Convenții - Proiect Budget App

## Convenții Generale

- Limbă: Tot proiectul este exclusiv în limba română.
- TDD: Obligatoriu pentru toate funcționalitățile noi.
- Commit-uri: Mesaje frecvente, atomice, descriptive.
- Branching: Dezvoltare pe branch-uri de feature; `main` doar pentru cod stabil.
- PR-uri: Obligatorii pentru orice integrare.
- Documentație: Actualizare continuă a `README.md`, `BEST_PRACTICES.md`, `DEV_LOG.md`.
- Refactorizare: Incrementală, cu acoperire de teste.
- Fără Breaking Changes fără documentare și consens.

## Testing

### Principii Generale

- Teste unitare și de integrare pentru toate componentele și serviciile.
- Teste exhaustive pentru cazuri pozitive, negative și edge cases.
- Fără hardcodări de date în teste.

### Practici React & Testing Library

- Controlled components testate cu wrapper cu stare locală.
- Folosirea `await waitFor` sau `await act(async () => {...})` pentru actualizări asincrone.
- Testare exhaustivă dropdown-uri (categorie, subcategorie, tip).
- Teste colocate în același folder cu componentele.
- Minimizarea console noise în teste.

### Practici Zustand

- Teste pentru inițializare, setters, acțiuni asincrone și selectors.
- Mock-uri izolate pentru servicii injectate.
- Resetarea store-ului înainte de fiecare test.
- Fără testare directă UI dependentă de Zustand.

## Frontend

### Organizare

- Componente primitive: `frontend/src/components/primitives/`
- Componente de feature: `frontend/src/components/features/`
- Constants centralizați: `frontend/src/constants/`
- Teste colocate în același folder cu componenta.

### Text UI și Mesaje

- Toate textele vizibile în UI sunt în `constants/ui.ts`.
- Toate mesajele de utilizator sunt în `constants/messages.ts`.
- Strict interzisă folosirea string-urilor hardcodate în cod sau teste.

### API Integration

- Endpointuri, parametri, headere definite în `constants/api.ts`.
- Timeout și retry configurabile.

### Tailwind CSS

- Stilizare exclusiv prin TailwindCSS.
- Eliminare stiluri inline.
- Organizare utilitare comune în `utils.css`.

## Constants și Importuri

### Organizare și Barrel Exports

- Toate constantele (`ui.ts`, `messages.ts`, `defaults.ts`, `api.ts`) trebuie re-exportate prin barrel (`constants/index.ts`).
- Importurile în codul principal și teste trebuie să fie doar prin barrel, nu direct din fișiere.
- Barrel-ul (`constants/index.ts`) trebuie actualizat imediat după orice adăugare sau ștergere de constante.
- Fără path mapping custom (`@constants/...`) decât dacă se adoptă o arhitectură de monorepo extins.

## Management Memorii Critice și Deprecated

### Reguli pentru Memorii

- Memorii critice trebuie marcate explicit `[CRITIC]` în titlu.
- Memorii deprecated trebuie mutate într-o secțiune separată sau arhivate.
- Orice memorie deprecated trebuie să aibă link sau referință către soluția nouă validată.
- Se menține o separare clară între memorii active și memorii arhivate.

## Backend (NestJS)

- (Se va completa pe măsură ce avansăm)

## Shared (Tipuri și Validări)

- Tipuri comune definite în `shared/`.
- Validare runtime folosind Zod.
- Sursă unică de adevăr pentru enums în `shared/enums.ts`.

### Monorepo & Shared Packages

- Build configurat pentru generarea `.d.ts` și `.js`.
- Frontend folosește re-export din `frontend/src/constants/enums.ts`.

## State Management - Zustand

- Store-uri în `frontend/src/stores/`, format: `use[DomeniuFuncțional]Store`.
- Structură clară: State, UI State, Setteri, Acțiuni, Selectors, Reset.
- Injection de servicii în store-uri pentru testabilitate.
- Folosirea selectors pentru performanță.
- Middleware Zustand pentru persist și devtools.

## Managementul Dependențelor și Build

- Instalare consistentă folosind `npm ci`.
- Sincronizare versiuni pachete critice (NestJS, Jest, TypeScript etc).
- Curățare periodică a node_modules și build clean.
- Verificare Jest config pentru detectarea corectă a testelor.

## Caching și Optimizare Performanță

- Servicii API folosind caching LRU și invalidare selectivă la operațiuni.
- Configurabil cache time și max entries.
- Statistici de caching disponibile pentru debugging.

## Debugging și Diagnosticare

- Folosirea `npx jest --listTests`, `--detectOpenHandles` pentru troubleshooting.
- Verificare corectitudine importuri relative.
- Evitare importuri circulare între module.
- Remedierea imediată a erorilor și warning-urilor.

## Documentare și Knowledge Management

### Flux de Actualizare Documentație

- Notarea lecțiilor și problemelor rezolvate în `DEV_LOG.md`.
- La final de săptămână sau task major, lecțiile sunt revizuite și promovate în `BEST_PRACTICES.md`.
- `BEST_PRACTICES.md` devine sursa oficială de reguli.
- `DEV_LOG.md` rămâne jurnal brut al progresului.

## Sincronizare Regulamente

- `BEST_PRACTICES.md` este aliniat permanent cu regulile definite în `global_rules.md`.
- Orice regulă nouă sau lecție învățată se reflectă simultan în ambele documente.
- În caz de diferență, regula documentată în `BEST_PRACTICES.md` prevalează.
- Se recomandă revizuirea periodică a sincronizării.

## Lessons Learned

- Barrel exports pot cauza importuri circulare - necesară organizare ierarhică clară.
- Mock-urile pentru clase private trebuie să vizeze doar metodele publice.
- URL constructor în Node necesită bază absolută validă pentru URL-uri relative.
- Control explicit al promisiunilor oferă teste asincrone mai stabile.
- Invalidarea selectivă a cache-ului reduce semnificativ apelurile API.
- Migrarea de la hooks custom la Zustand necesită rescriere completă a testelor.

---

_Actualizat la: 2025-04-26_

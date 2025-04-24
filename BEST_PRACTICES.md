# Bune Practici și Convenții Proiect 'Budget App'

Acest document centralizează deciziile și convențiile adoptate pe parcursul dezvoltării.

## Convenții Generale

*   **Limbă:** Întregul proiect (comunicare, cod, comentarii, documentație) va folosi **exclusiv limba română**. (Stabilit: 2025-04-23)
*   **TDD (Test-Driven Development):** Obligatoriu pentru toate componentele și funcționalitățile noi (frontend și backend).
*   **Commit-uri:** Frecvente, atomice și cu mesaje descriptive (ex: `feat: Adaugă validare formular tranzacții`, `fix: Corectează calcul total buget`).
*   **Branching:** Branch `main` doar pentru cod stabil. Dezvoltarea se face pe branch-uri de feature (ex: `feature/rapoarte-lunare`).
*   **Pull Requests (PRs):** Obligatorii pentru integrarea în `main`, chiar și pentru dezvoltare individuală (pentru istoric și context). Code review recomandat.
*   **Documentație:** `README.md` și `DEV_LOG.md` trebuie actualizate constant cu decizii majore, modificări de arhitectură sau probleme întâmpinate.
*   **Refactorizare:** Incrementală și mereu acoperită de teste.
*   **Fără Breaking Changes:** Modificările care afectează compatibilitatea trebuie discutate și documentate.

## Frontend (React & Testing Library)

### Dropdown-uri controlate (categorie/subcategorie/tip)
- Folosește pattern-ul controlled component: valoarea selectată este mereu sincronizată cu starea (form.type, form.category etc.).
- **Testare exhaustivă a filtrării subcategoriilor:**
  - Importă sursa de adevăr (structura categorii/subcategorii) direct din codul sursă.
  - Creează un helper pentru extragerea tuturor subcategoriilor posibile pentru fiecare categorie.
  - În teste, verifică exhaustiv că toate opțiunile și optgroup-urile relevante apar corect în dropdown după selectarea tipului/categoriei.
  - Orice modificare a structurii de categorii va fi reflectată automat și în teste, reducând riscul de bug-uri și mentenanța duplicată.
  - Pattern recomandat: helper pentru extragere, aserțiuni exhaustive, fără hardcoding de opțiuni în test.
- Pentru placeholder (ex: 'Alege'), randarea trebuie condiționată strict de valoarea selectată: opțiunea apare doar dacă value este ''.
- Elimină opțiuni irelevante din dropdown (ex: 'Transfer' la tip) pentru UX clar și validare robustă.
- Pentru testarea interacțiunii, folosește un wrapper cu stare locală în test, nu doar onChange dummy. Astfel, simularea reflectă comportamentul real din aplicație.
- Testează filtrarea dinamică a categoriilor și subcategoriilor în funcție de tipul selectat și compatibilitatea valorilor.
- Verifică și existența optgroup-urilor folosind getByRole('group', { name: ... }) în teste.
- Toate comentariile, denumirile și mesajele de test sunt în limba română.

*   **Modularizare:** Componentele complexe (formulare, tabele) se extrag în module proprii (`src/components/NumeComponenta/`).
*   **Colocare Teste:** Testele unitare/integrare pentru o componentă (`*.test.tsx`) se plasează în același folder cu componenta.
*   **Mocking `fetch`:** Folosește un mock global robust pentru `fetch` (ideal în `src/setupTests.ts` sau un helper dedicat) pentru a izola testele de rețea.
*   **Stabilitate Teste Asincrone:** Orice actualizare de stare care rezultă dintr-o operație asincronă (ex: `fetch`, `setTimeout`) trebuie anticipată în teste folosind `await waitFor(...)` sau `await findBy*()` pentru aserțiuni. Interacțiunile care declanșează actualizări asincrone ar trebui, ideal, învelite în `async act(...)`.
*   **Testare Valori Inițiale (Formulare):** Evită asertarea simultană a multor valori inițiale după render. Împarte verificarea în teste `it(...)` mai mici, focalizate pe un singur câmp sau un grup mic de câmpuri. Folosește `await waitFor` pentru câmpurile predispuse la probleme de timing (date, number, checkbox). (Vezi Memorie ID: 3cb5254f)
*   **Claritate Output Teste:** Minimizează `console.log`/`console.error` inutile în teste. Folosește reporteri Jest suplimentari (`jest-summarizing-reporter`, `jest-html-reporter`) pentru vizualizare mai bună.

## Eliminarea hardcodărilor și patternuri robuste

### Centralizare texte UI (obligatoriu)
- Toate textele vizibile în UI (labeluri, butoane, dropdown-uri, placeholdere, opțiuni etc.) trebuie extrase și centralizate în `frontend/src/constants/ui.ts`.
- Este interzisă folosirea string-urilor hardcodate pentru UI în componente.
- Orice componentă nouă sau modificată trebuie să folosească DOAR constantele din `ui.ts` pentru orice text vizibil.
- Dacă ai nevoie de un text nou, îl adaugi mai întâi în `ui.ts`, apoi îl folosești în componentă.
- Orice excepție trebuie documentată și validată de echipă.

**Pattern corect:**
```tsx
import { LABELS, BUTTONS } from '../../constants/ui';
<button>{BUTTONS.ADD}</button>
<label>{LABELS.CATEGORY}</label>
```

**Anti-pattern:**
```tsx
<button>Adaugă</button>
<label>Categorie</label>
```

#### Pattern robust pentru API
- Toate endpointurile, parametrii de query, headerele, timeout-ul și limita de retry sunt definite centralizat în `constants/api.ts`.
- Nu există niciun string hardcodate în codul de fetch/axios; se folosește mereu sursa de adevăr unică.
- Headerele pot fi extinse ușor (ex: Authorization).
- Timeout-ul și retry-ul sunt configurabile dintr-un singur loc.
- Avantaje: mentenanță ușoară, testare predictibilă, extensibilitate rapidă pentru orice schimbare de API.

- **Enumuri**: Toate tipurile, categoriile, frecvențele sunt definite în `constants/enums.ts` și folosite exclusiv prin import.
- **Subcategorii**: Structura completă exportată dintr-un singur fișier, importată direct în componente și teste. Helperi dedicați pentru extragere și filtrare.
- **Texte UI**: Toate labelurile, butoanele, placeholder-ele, headerele de tabel sunt în `constants/ui.ts`.
- **Mesaje**: Toate mesajele de validare, eroare, succes, avertismente, confirmări și prompturi vizibile utilizatorului sunt în `constants/messages.ts`. Nu este permisă folosirea string-urilor hardcodate pentru aceste mesaje în componente. Orice excepție sau convenție nouă se documentează imediat aici și în `DEV_LOG.md`.
- **Valori default**: Paginare, monedă, form state etc. în `constants/defaults.ts`.
- **API**: Toate endpoint-urile, query params, headerele și URL-urile sunt în `constants/api.ts`.
- **Testare**: Testele nu hardcodează opțiuni, folosesc import direct din sursa de adevăr și helperi pentru aserțiuni exhaustive. Orice modificare a structurii se reflectă automat și în teste.
- **Documentare**: Orice convenție nouă sau lecție învățată se documentează imediat în `BEST_PRACTICES.md`, `DEV_LOG.md`, `PLAN.md` și `README.md`.
- **Status**: Fără hardcodări în frontend. Patternul robust este respectat peste tot.

## Backend (NestJS)

*   (De completat pe măsură ce avansăm)

## Shared (Tipuri & Validări)

*   (De completat pe măsură ce avansăm)

## Managementul Dependențelor

*   Folosește `npm ci` pentru instalări consistente bazate pe `package-lock.json`.
*   Actualizează dependențele periodic și controlat.

## 1. Sincronizare versiuni pachete critice (ex: NestJS)
- Toate pachetele `@nestjs/*` (common, core, platform-express, testing etc.) trebuie să fie la aceeași versiune exactă în toate subproiectele pentru a preveni conflicte de tipuri și runtime.
- Orice modificare de versiune trebuie făcută sincronizat peste tot și menționată explicit în README și DEV_LOG.
- Se recomandă adăugarea unei secțiuni de verificare periodică a dependențelor în workflow-ul de dezvoltare.
- Nu folosi niciodată versiuni mixte de NestJS, nici măcar între backend și test/dev.
- Acest principiu se aplică și la alte pachete critice (ex: ts-jest, typescript, jest, mongoose etc.).

## 2. Importuri între workspace-uri
- Folosește importuri relative corecte sau path mapping în tsconfig pentru a evita erori la build și test.
- Dacă folosești monorepo, evită importurile cu prea multe nivele de "../"; folosește path mapping dacă devine greu de urmărit.
- Orice schimbare de structură la shared trebuie sincronizată și testată în toate subproiectele dependente.

## 3. Configurare Jest/ts-jest
- Folosește "preset": "ts-jest" și asigură-te că rootDir și testRegex includ toate testele relevante (ex: "test/.*\\.e2e-spec\\.ts$").
- Rulează periodic `npx jest --listTests` pentru a verifica dacă toate testele sunt detectate.
- Dacă Jest nu găsește teste, verifică configul și căile.
- Dacă Jest rulează, dar nu execută teste, verifică presetul, rootDir, transform și existența fișierelor .js vechi în test/.
- Pentru e2e, folosește testEnvironment: "node".

## 4. Curățare și build
- După orice upgrade major de dependențe, rulează:
  - Șterge node_modules și package-lock.json
  - `npm install`
  - `npm run build`
  - `npm test`
- Nu lăsa fișiere .js vechi în folderele de test (pot cauza erori de runtime sau "ghost tests").

## 5. Dependențe de runtime și test
- Orice warning/error la build/test (ex: lipsă class-validator, class-transformer) trebuie remediat imediat.
- Nu ignora niciun warning la build/test.
- Asigură-te că ai toate tipările (ex: @types/react, @types/jest, @types/testing-library__react) ca devDependencies în workspace-ul potrivit.
- Dacă folosești ValidationPipe, trebuie să ai class-validator și class-transformer instalate, chiar dacă folosești zod pentru validare efectivă.

## 6. Debug & Diagnostic
- Dacă testele nu rulează, folosește:
  - `npx jest --listTests` pentru a vedea ce detectează Jest.
  - `npx jest --runInBand --detectOpenHandles --verbose` pentru debug detaliat.
- Dacă buildul nu merge, verifică importurile relative și existența fișierelor shared.
- Dacă apar erori "Cannot find module ...", corectează rapid calea de import.

## 7. Documentare
- Orice lecție importantă sau problemă rezolvată trebuie documentată în acest fișier, DEV_LOG.md și README.md.
- Orice modificare majoră de infrastructură sau workflow trebuie menționată în README și DEV_LOG.
- Menține un fișier BEST_PRACTICES.md în root cu toate regulile și convențiile de echipă.

## 8. TDD și acoperire cu teste
- Orice feature nou trebuie să aibă teste înainte de implementare (TDD).
- Testele e2e trebuie să acopere toate fluxurile critice.
- Nu considera "gata" un feature până nu are acoperire de test și trec toate testele automat.

## 9. Workflow de lucru în monorepo
- Orice upgrade de dependențe se face întâi pe o ramură separată, cu build și test complet înainte de merge.
- Se rulează `npm audit` și `npm outdated` periodic.
- Se documentează orice lessons learned și workaround-uri.

## 10. Alte observații utile
- IDE-ul poate "vedea" tipări și din alte workspace-uri dacă folosești workspaces npm/yarn, dar nu te baza pe acest comportament: adaugă explicit tipările la frontend/backend după caz.
- Un simplu restart la TypeScript server sau IDE poate face să dispară erori "fantomă" de tipări lipsă, dar cauza reală e lipsa tipărilor ca devDependency.
- Înainte de commit, verifică să nu existe fișiere generate accidental (ex: .js în test/ sau src/).
- Orice problemă de infrastructură trebuie rezolvată imediat, nu "lăsată pe mai târziu".

## 11. Frontend React & Teste (2025-04-22)
- Orice componentă complexă (ex: formulare, tabele) trebuie extrasă ca modul separat în `src/components/ComponentName/ComponentName.tsx`.
- Testele unitare pentru fiecare componentă trebuie colocate în același folder (`ComponentName.test.tsx`), nu în src/.
- Pentru orice fetch în teste, folosește mock global din `setupTests.ts` pentru consistență și evitare erori `.then` pe undefined.
- Orice update de stare asincronă (ex: submit, fetch) în teste trebuie să fie învelit în `await act(...)` sau `waitFor` pentru a evita warninguri și flaky tests.
- Structura de foldere trebuie să reflecte modularitatea și separarea responsabilităților (form, table, filters etc).
- Folosește reporteri Jest suplimentari (`jest-summarizing-reporter`, `jest-html-reporter`) pentru claritate și partajare ușoară a rezultatelor testelor.
- Redu la minimum console noise în teste (mock console.log/error dacă e nevoie) pentru rapoarte clare.
- Orice convenție, workaround sau lesson learned se documentează imediat în `BEST_PRACTICES.md`, `DEV_LOG.md` și memorie.

---

### [2025-04-23] Progres major funcționalitate și testare
- Finalizare flux principal adăugare și vizualizare tranzacții (frontend)
- Refactorizare majoră TransactionForm: dropdown-uri filtrate dinamic, eliminare 'Transfer', UX placeholder, testare exhaustivă
- Testele acoperă toate scenariile critice și edge pentru TransactionForm, TransactionTable, TransactionFilters
- Pattern robust: helperi pentru filtrare, sursă de adevăr importată direct, wrapper cu stare locală pentru testare
- Toate convențiile și lecțiile propagate în BEST_PRACTICES.md, DEV_LOG.md, PLAN.md, README.md și memorie
- Ne concentrăm pe funcționalitate, UI-ul rămâne placeholder până la definirea designului final
- Următorul pas: finalizare funcționalitate, apoi reguli clare pentru testare E2E și stilizare

_Actualizat la: 2025-04-23_

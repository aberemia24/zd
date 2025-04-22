# Best Practices & Lessons Learned

Acest fișier conține reguli, convenții și lecții învățate din dezvoltarea monorepo-ului "Budget App" (NestJS, React, TDD, etc).

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

_Actualizat la: 2025-04-22_

# Tech Story: Integrare sustenabilă code-sharing enums/constants cu Yarn/NPM Workspaces

---

## Context și motivație
Actualmente, partajarea enums/constants între frontend și backend se face prin importuri relative sau proxy-uri, ceea ce nu este compatibil cu Create React App (CRA) și nu respectă pe deplin best practices de portabilitate, mentenanță și scalabilitate. Pentru a elimina duplicarea, a asigura sincronizarea automată și a permite code-sharing robust, este necesară organizarea monorepo-ului folosind Yarn/NPM Workspaces și treatamentul `shared` ca pachet local.

---

## Obiective
- Să permită importul direct al enums/constants din `shared` în frontend și backend, fără hack-uri sau duplicări manuale.
- Să respecte convențiile de barrel, sursă de adevăr, ownership și notificare la modificări.
- Să păstreze compatibilitatea cu toolchain-ul actual (CRA, Jest, TypeScript, Node/NestJS).
- Să faciliteze extensia cu noi pachete (ex: utils, types, cli) fără breaking changes.

---

## Pași de implementare
1. **Configurare monorepo cu Yarn/NPM Workspaces**
   - Marchează `budget-app` ca monorepo (`private: true`).
   - Adaugă secțiunea `workspaces` în `package.json` root:
     ```json
     {
       "private": true,
       "workspaces": ["frontend", "backend", "shared"]
     }
     ```
   - Rulează `yarn` sau `npm install` în root pentru a crea symlink-urile necesare.

2. **Configurare package pentru shared**
   - În `shared/package.json`:
     ```json
     {
       "name": "@abere/shared",
       "version": "1.0.0",
       "main": "dist/index.js",
       "types": "dist/index.d.ts"
     }
     ```
   - Asigură build-ul automat (ex: cu `tsc` sau `tsup`) pentru a genera `dist/index.js` și `.d.ts`.

3. **Refactorizare enums/constants**
   - Mută/expune enums și orice constants partajate în `shared/src/enums.ts` (sau `shared/src/constants.ts`).
   - În `shared/src/index.ts`:
     ```ts
     export * from './enums';
     // export * from './constants'; // dacă ai și alte constante partajate
     ```

4. **Importuri frontend/backend**
   - În frontend și backend, importă direct:
     ```ts
     import { CategoryType, TransactionType } from '@abere/shared';
     ```
   - În barrel-ul frontend (`constants/index.ts`), reexportă dacă vrei să păstrezi patternul local:
     ```ts
     export * from '@abere/shared';
     ```

5. **Actualizare scripts și CI**
   - Adaugă scripturi de build pentru `shared` (ex: `yarn workspace @abere/shared build`).
   - Asigură-te că buildul shared rulează înainte de buildul frontend/backend.

6. **Best practices și ownership**
   - Orice modificare la enums/constants partajate trebuie anunțată în code review și documentată în DEV_LOG.md.
   - Barrel-ul principal (`shared/src/index.ts`) trebuie actualizat la fiecare modificare.
   - Testele și codul nu trebuie să importe enums/constants direct din fișiere individuale, ci doar din pachetul `@abere/shared` sau barrel-ul local.

---

## Criterii de acceptare
- Nu există duplicare de enums/constants între frontend și backend.
- Importurile din frontend nu mai dau erori de tip „Module not found: ... falls outside of src”.
- Buildul și testele trec fără erori pe toate pachetele.
- Convențiile de import, barrel, ownership și notificare sunt respectate (vezi BEST_PRACTICES.md).
- Orice contributor poate adăuga enums/constants partajate fără a rupe buildul sau convențiile.

---

## Riscuri și mitigare
- **CRA nu permite importuri din afara src:** rezolvat prin workspace și symlink în node_modules.
- **Sync între pachete:** rezolvat prin workspaces și build scripts.
- **Tooling (Jest, TypeScript):** asigură corectnessul tipurilor și rezolvarea modulelor prin configurări dedicate (`moduleNameMapper`, `paths`).

---

## Documentare
- Actualizează README.md, BEST_PRACTICES.md și DEV_LOG.md cu noul pattern de import și ownership.
- Adaugă exemple de import și update la barrel în documentație.

---

**Status:** PLANIFICAT  
**Responsabil:** [Owner enums/constants/shared]  
**Deadline recomandat:** ASAP pentru a elimina workaround-urile și a pregăti terenul pentru extensii viitoare.

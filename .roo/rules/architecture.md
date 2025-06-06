---
description: 
globs: 
alwaysApply: true
---
<structure>
- Budget App folosește arhitectură monorepo: frontend/, backend/, shared-constants/
- Frontend: React + Zustand + TailwindCSS
- Backend: NestJS + Supabase
- Shared-constants: Pachetul `@budget-app/shared-constants` este sursa unică pentru constante, enums și mesaje, gestionat prin pnpm workspaces.
</structure>
<source_of_truth>
- **Pachet unic**: Toate constantele, enum-urile și mesajele sunt DOAR în pachetul `@budget-app/shared-constants`.
- **Fără sincronizare manuală**: Datorită `pnpm workspaces`, nu mai există copii automate sau scripturi de sincronizare. Modificările sunt reflectate instantaneu.
- **Import direct**: Importurile se fac direct din pachet: `import { ... } from '@budget-app/shared-constants';`.
- **Fără alias-uri**: Nu se mai folosesc alias-uri custom (`@shared-constants`).
- **Fără validare manuală**: Structura de workspace și TypeScript asigură consistența, eliminând nevoia de scripturi ca `validate:constants`.
</source_of_truth>
<text_and_messages>
INTERZIS string-uri hardcodate în cod
Toate textele UI în `@budget-app/shared-constants/ui.ts`
Toate mesajele de sistem în `@budget-app/shared-constants/messages.ts`
Testele verifică mesajele folosind constantele, nu string-uri
</text_and_messages>
<api_routes>
Toate rutele definite în `@budget-app/shared-constants/api.ts`
API_URL este deprecated și interzis
Folosiți API.ROUTES.* în schimb
</api_routes>
<directory_structure>
components/primitives/: Componente de bază reutilizabile
components/features/: Componente specifice businessului
stores/: State management Zustand
services/: Comunicare cu API
pages/: Componente pentru rutare
shared-constants/ (Pachet: `@budget-app/shared-constants`):
defaults.ts: Valori implicite
enums.ts: Tipuri de date
messages.ts: Mesaje sistem
ui.ts: Texte UI
api.ts: Configurare API
</directory_structure>
<logging_and_ux>
- Elimină toate logurile de debugging (console.log, debug etc.) înainte de production.
- Folosește pattern-ul robust: păstrează datele vechi la fetch/filtrare (useRef/useMemo) pentru UX fluid, fără blink sau re-mount.
- Testează cu loguri temporare, dar elimină-le după validare.
</logging_and_ux>
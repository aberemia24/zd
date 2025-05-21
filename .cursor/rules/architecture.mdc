---
description: 
globs: 
alwaysApply: true
---
<structure>
- Budget App folosește arhitectură monorepo: frontend/, backend/, shared-constants/
- Frontend: React + Zustand + TailwindCSS
- Backend: NestJS + Supabase
- Shared-constants: Sursa unică pentru constante, enums și mesaje
</structure>
<source_of_truth>
- Toate constantele, enum-urile și mesajele sunt DOAR în `shared-constants/`
- Copiile din `frontend/src/shared-constants/` sunt generate automat
- Importuri DOAR prin alias `@shared-constants`
- Actualizați `shared-constants/index.ts` după orice modificare
- Validați cu `npm run validate:constants` înainte de commit
</source_of_truth>
<text_and_messages>
INTERZIS string-uri hardcodate în cod
Toate textele UI în shared-constants/ui.ts
Toate mesajele de sistem în shared-constants/messages.ts
Testele verifică mesajele folosind constantele, nu string-uri
</text_and_messages>
<api_routes>
Toate rutele definite în shared-constants/api.ts
API_URL este deprecated și interzis
Folosiți API.ROUTES.* în schimb
</api_routes>
<directory_structure>
components/primitives/: Componente de bază reutilizabile
components/features/: Componente specifice businessului
stores/: State management Zustand
services/: Comunicare cu API
pages/: Componente pentru rutare
shared-constants/:
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
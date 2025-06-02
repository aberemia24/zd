---
description: 
globs: 
alwaysApply: true
---
<property_creation>
- Înainte de a adăuga o proprietate nouă într-un component:
  1. Verifică dacă există deja în `shared-constants/ui.ts` (pentru UI)
  2. Verifică dacă există deja în `shared-constants/messages.ts` (pentru mesaje)
  3. Dacă nu există, adaugă proprietatea în locația corectă din `shared-constants/` 
  4. Importă apoi constanta din locația centralizată
- NICIODATĂ nu adăuga text hardcodat în UI sau mesaje
- NICIODATĂ nu duplica constante între frontend și backend
</property_creation>
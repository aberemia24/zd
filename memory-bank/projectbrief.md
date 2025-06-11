# Project Brief BudgetApp

## Descriere Generală
BudgetApp este o aplicație de gestiune financiară personală dezvoltată cu o arhitectură monorepo (frontend, backend, shared-constants). Aplicația permite utilizatorilor să-și gestioneze cheltuielile, veniturile, categoriile și să vizualizeze date financiare prin grile și rapoarte intuitive.

## Arhitectură Tehnică
- **Frontend**: React + Zustand + TailwindCSS
- **Backend**: NestJS + Supabase
- **Shared Constants**: Sursă unică pentru constante, enums și mesaje

## Funcționalități Cheie
1. **Autentificare Securizată**: Login, register, resetare parolă cu Supabase
2. **Management Categorii**: Categorii și subcategorii personalizabile
3. **Managementul Tranzacțiilor**: Adăugare, editare, ștergere, filtrare avansată
4. **Vizualizare Date**: Grid lunar performant cu editare inline (LunarGrid)
5. **Design System Robust**: Componente reutilizabile, tokens, abstracții pentru stilizare

## Standarde de Dezvoltare
- Toate constantele și mesajele sunt definite în shared-constants/
- Utilizare hooks specializate pentru logica de business
- Separarea strictă între componente primitive și cele de feature
- Implementare sistem de stilizare prin abstractizări (getEnhancedComponentClasses)
- React Query pentru data fetching și Zustand pentru state management

## Status Curent
Proiectul este avansat, cu 5 din 8 taskuri principale finalizate. Focusul actual este pe testare, audit documentație și planificarea optimizărilor viitoare.

## Obiective pe Termen Scurt
1. Finalizarea testelor și QA
2. Auditarea și actualizarea documentației
3. Implementarea unor optimizări pentru experiența utilizatorului

## Obiective pe Termen Lung
1. Exportul rapoartelor
2. Persistența filtrelor în URL
3. Refactorizare incrementală pentru adoptarea noilor patternuri 
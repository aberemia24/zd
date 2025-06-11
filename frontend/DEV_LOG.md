# DEV_LOG.md

## [2025-05-19] Refactorizare TransactionForm: validare și layout semantic

- Am corectat pattern-ul de error handling pentru TransactionForm: acum permite atât string cât și Record<string, string> (pentru validări pe câmpuri).
- Inputurile folosesc error={typeof error === 'object' ? error.amount : undefined}.
- Mesajele globale de eroare folosesc safeMessage(error) doar dacă error este string.
- Am migrat complet layout-ul la design tokens semantic: getComponentClasses('formRow') pentru inputuri, getComponentClasses('buttonGroup') pentru butoane.
- Nu se mai folosesc clase Tailwind hardcodate pentru spacing între elemente de formular.
- Toate mesajele de validare și eroare sunt centralizate în shared-constants/messages.ts și accesate prin safeMessage.
- Am actualizat BEST_PRACTICES.md cu aceste reguli noi.

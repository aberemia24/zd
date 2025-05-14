---
trigger: model_decision
description: Activează regula când apare cod React cu importuri “zustand”, hook-uri   `use…Store`, `store.getState` sau un `useEffect` care face fetch și poate   declanșa bucle în store. Ignoră dacă nu e context React/Zustand.
---

id: zustand_anti_patterns
title: Anti-pattern-uri React + Zustand
activation: model_decision
severity: warning
tags: [zustand, react, anti-pattern]
---

## 4. Migrare hooks → Zustand
Hooks custom rămân până la paritate funcțională. Pentru fiecare migrare:
1. Adaugă store cu API echivalent.  
2. Scrie teste.  
3. Înlocuiește hook-ul în UI.  
4. Șterge vechiul cod și documentează în `DEV_LOG.md`.

---

## 5. Patterns & anti-patterns

### 5.1 [CRITIC] Bucle infinite cu `useEffect(fetch, [queryParams])`
- **NU** folosi `useEffect(fetch, [queryParams])` dacă *fetch* modifică parametrii.  
  Corect: rulează fetch **o singură dată** la *mount* sau folosește caching / deep-compare.

### 5.2 Bune practici suplimentare
- Limitează logica într-un singur **store**; sparge-o pe domenii.
- Folosește **selectors** pentru a preveni re-render-uri.
- Activează și testează middleware-urile **persist** + **devtools**.
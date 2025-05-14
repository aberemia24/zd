---
trigger: model_decision
description:  Activează regula când discuția cere optimizare de performanță, semnalează   rerender-uri excesive sau lentoare React; oferă checklist pentru a reduce   calcule costisitoare și re-render-uri.
---

## 6. Checklist performanță

- Evită calculul costisitor direct în `render`; mută-l în selectors, `useMemo`
  sau `useCallback`.
- Grupează actualizările de state conexe pentru a minimaliza re-render-urile.
- Folosește `why-did-you-render` (dev-only) ca să depistezi componentele care
  se re-randază inutil.
- Verifică **deps** la `useEffect` / `useCallback`; liste incomplete creează
  re-executări nejustificate.
- Utilizează *React Profiler* (Chrome DevTools) pentru flame-chart-uri și timp
  de commit.
- Memorează obiecte/array-uri mari transmise prin props (`useMemo` sau
  `useRef`) ca să nu schimbe referința la fiecare randare.
- În liste mari, folosește `react-window` sau `react-virtualized` pentru
  **virtualizare**.
- Deferă API-calls grele la idle (`requestIdleCallback`) sau *background
  worker* unde este posibil.
# Plan Implementare "Lunar Grid" & Extensii

Scop: să evoluăm modulul TanStack *Lunar Grid* dintr-un tabel static la un instrument complet de planificare financiară pe termen scurt/mediu/lung, respectând principiile de calitate (memoriile globale) și evitând regresii de performanță.

Documentul prezintă **ordinea logică** a etapelor, propuneri concrete de implementare și o analiză succintă *avantaje / dezavantaje* pentru fiecare pas. Nu introduce un calendar; echipa își va calibra efortul după capacitate.

---
## 0. Stabilitate de bază
| Pas | Propunere | Avantaje | Dezavantaje |
|-----|-----------|----------|-------------|
| 0.1 | **Bug‐fix**: celula *sold overall* nu afișează valoarea. → Audită calculul agregat; adaugă test unit + Playwright. | Recapătă încrederea UI; test root cause. | Efort mic, dar blocant. |
| 0.2 | **Refactor mic**: extrage funcții pure de calcul sold în `lunarGridUtils.ts` pentru a fi testabile. | Cod testabil; minimizează side-effects. | Necesită ajustări importuri. |

---
## 1. Optimizări UI „low-hanging fruits”
| Pas | Propunere | Avantaje | Dezavantaje |
|-----|-----------|----------|-------------|
| 1.1 | **Expand/Collapse individual** (Toggle rowModel per categorie). | Control fin; UX așteptat. | Necesită gestionare state per row → potențial creștere memory. |
| 1.2 | **Sticky** coloană subcategorii & header dată `1 – Iunie`. | Navigare ușoară, context vizual. | Stiluri CSS complexe → browser-compat. |
| 1.3 | **Wide / Full-screen** toggle (`useFullscreen` + Tailwind utilities). | Spațiu de lucru major; ușor de implementat. | Se cere gestionare breakpoints mobile. |

---
## 2. CRUD Subcategorii în Grid (limita 5)
> Reutilizează acțiunile din `categoryStore`; extrage mutații pure în `categoryMutations.ts` (FE) + validare BE.

| Pas | Propunere | Avantaje | Dezavantaje |
|-----|-----------|----------|-------------|
| 2.1 | **Add** buton inline sub ultima subcategorie; afișează error dacă >=5. | Flow intuitiv; inline feedback. | Necesită update layout row. |
| 2.2 | **Rename** subcategorie (dblclick pe label → input). | Edit rapid; nu părăsești contextul. | Edge-case focus/escape. |
| 2.3 | **Delete** (icon trash → confirm). | Curățenie rapidă. | Migrare tranzacții existente? (need rule). |
| 2.X | **Limită 5** validată FE + BE (Supabase RLS / trigger). | Consistență cross-platform. | Trigger SQL suplimentar. |

---
## 3. Transaction Editing Experience
| Pas | Propunere | Avantaje | Dezavantaje |
|-----|-----------|----------|-------------|
| 3.1 | **Modal** la click simplu (amount, descriere, recurență). | Validează form; accesibilitate. | Overhead UI; poate părea lent. |
| 3.2 | **Edit inline** la dblclick; Enter → save, Esc → cancel. | Rapid; similar Excel. | Gestionare conflict cu modal click. |
| 3.3 | **Delete / clear** cu Backspace + confirm toast. | Familiar. | Risc ştergere accidentală. |
| 3.4 | **Colorizare**: venit = verde, cheltuială = roșu; sold pozitiv = verde/negativ = roșu. | Claritate vizuală imediată. | Persoane cu daltonism – asigură pattern icons. |

---
## 4. Motor „Balance Forward” (Sold Zilnic)
| Pas | Propunere | Avantaje | Dezavantaje |
|-----|-----------|----------|-------------|
| 4.1 | Algoritm O(n·d) care calculează `balance[i] = balance[i-1] + income[i] - expense[i]`. | Bază pentru proiecții; simplu. | Pentru n > 365 × ani multipli, poate deveni încet → optimizare vm. |
| 4.2 | Invalidare TanStack Query la inserare/ștergere tranzacții; memo selectors. | Sincronizare live; evită fetch redundant. | Config fin în `queryClient`. |
| 4.3 | Highlight zi curentă / fade zile trecute. | Context timp real. | Depinde de locale & timezone. |

---
## 5. Motor Recurrence & Concepte Financiare
| Pas | Propunere | Avantaje | Dezavantaje |
|-----|-----------|----------|-------------|
| 5.1 | **Recurrence Engine**: rule DSL (`daily|weekly|monthly|yearly|custom(n)`) + hard cap (ex. 36 luni în viitor). | Automatizează estimări; scalabil. | Complexitate business; risc generare masivă date. |
| 5.2 | **Economii / Investiții** ca tip dedicat cu logică diferită (nu afectează sold „cash” dar afectează net-worth). | Realism financiar. | UI suplimentar; necesită raportare distinctă. |
| 5.3 | **Sold Inițial** setat o singură dată/lună; propagat forward. | Punct de start corect. | Necesită migrare date existente. |

---
## 6. Modul „Daily View” & Analytics
| Pas | Propunere | Avantaje | Dezavantaje |
|-----|-----------|----------|-------------|
| 6.1 | Pagina *Today*: checklist cheltuieli estim vs realizat (`done` strike-through). | Angeajează utilizatorul zilnic. | Sinc bidirecțional cu grid — risc bucle. |
| 6.2 | KPI: „Cheltuieli reale vs estimate (%)” la sfârşit de lună. | Feedback comportamental. | Necesită agregări suplimentare. |

---
## 7. Îmbunătățiri suplimentare (Backlog)
1. **Filtru & search** pe grid (TanStack `globalFilter`).
2. **Virtualizare** rânduri/coloane (react-virtual) → performanță.
3. **Export Manager** integrat în UI (CSV/XLSX).
4. **A11y & i18n** (aria-sort, aria-expanded, traduceri). 
5. **Multi-account & multi-currency** – arhitectură pregătită.

---
### Note Arhitecturale
* Urmăm pattern Hooks + Service + Cache (vezi memorie 49dcd68b). 
* Respectăm regula de centralizare constante API (`@shared-constants/api`).
* Evităm anti-patternul `useEffect([queryParams]) + fetchTransactions` (memorie d7b6eb4b).
* Pentru grid mare → profilăm cu React-Devtools, evităm rerender prin `memo` & `columnVirtualization`.

---
**Concluzie**: ordinea propusă atacă întâi stabilitatea și UX rapid, apoi extinde capabilități CRUD, editează tranzacții, introduce engine-urile de calcul și abia după aceea analytics avansat. Fiecare etapă este independentă și poate fi livrată incremental, asigurând testare și feedback continuu.

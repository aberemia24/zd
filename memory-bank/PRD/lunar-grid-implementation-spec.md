# Specificație Tehnică "Lunar Grid 2.0"

> **Audience**: dezvoltatori FE/BE, QA, DevOps.
> **Scope**: detalii de implementare pentru fiecare etapă din planul "Lunar Grid". Include modificări UI, store, API, DB, testare, metrici perf & risc.

---
## 0. Stabilitate de bază
### 0.1 Bug Sold Overall
| Aspect | Detalii |
|--------|---------|
| Reproducer | În grid, coloana `Sold` (total categorii) rămâne goală. Se întâmplă doar după load inițial, nu după tranzacție nouă. |
| Cauză probabilă | `getSumForCell()` ignoră rândul `overall` din cauza filtrului `subcategory != null`. |
| Fix | 1) Adaugă constantă `OVERALL_ROW_ID = "overall"`. 2) În `getSumForCell`, dacă `categoryKey === OVERALL_ROW_ID`, agregă toate tranzacțiile zilei indiferent de categorie. |
| Refactor | Mută logica de agregare zilnică în `lunarGridUtils.ts → getDailyTotals(transactions)` pentru testare izolată (`jest/lunarGridUtils.test.ts`). |
| Tests | • Unit: calcule corecte pentru 0, 1, n tranzacții. • Playwright: după login → grid → assert `.sold-cell` not empty. |

### 0.2 Util Functions
* `calculateBalances(transactions, startBalance)`
  * Time-series reduce; returnă array `[ { day: 1, balance: 1000 }, … ]`.
* Exportat din `@grid-utils/balance` pentru reuse în daily-view și rapoarte.

---
## 1. Optimizări UI "Quick Wins"
### 1.1 Expand/Collapse individual
| Detaliu | Implementare |
|---------|--------------|
| State | `const [expanded, setExpanded] = useState<Record<string, boolean>>({});` pus în componenta `LunarGridPage` și pasat ca `state` extern către TanStack Table (`table.setRowExpansion(expanded)`). |
| Toggle | Celulă custom în coloana categorie: `row.getIsExpanded()` + `row.getToggleExpandedHandler()`. |
| Persistență | Salvăm în `localStorage` key `lunarGrid.expanded` la `useEffect` debounce 300 ms; re-hidratăm onMount. |
| Perf | Row memoization: `React.memo(CategoryRow, (prev, next) => prev.expanded === next.expanded)`. |

### 1.2 Sticky Coloană + Header
* **CSS**: `<th className="sticky left-0 z-20 bg-white">`; adaugă umbră pe scroll (`shadow-lg` via `useScrollPosition`).
* **Compatibilitate**: test Edge/Firefox; fallback pentru browsere vechi: fixează lățimea și wrapper `overflow-x`.

### 1.3 Wide / Full-Screen
* Hook `useFullscreen(ref)` (lib `react-use`).
* UI: buton în toolbar grid `icon-maximize`; Tailwind classes `fixed inset-0 z-50 bg-white p-4 overflow-auto`.
* Escape / click-outside → exit. Add `KeyboardEvent key="f"` shortcut.

---
## 2. CRUD Subcategorii în Grid (Limita 5)
### 2.0 Context
* Store deja are acțiuni async; extragem top-level utilități **pure & UI-agnostic**.

#### 2.1 Nou Modul – `categoryMutations.ts`
```ts
export async function addSubcategory(userId: string, cat: string, name: string) {
  const { getSubcategoryCount, saveCategories } = useCategoryStore.getState();
  if (getSubcategoryCount(cat, name) >= 5) return { ok: false, error: "LIMIT_REACHED" };
  // Compose new array & save
  const categories = produce(useCategoryStore.getState().categories, draft => {
    const c = draft.find(c => c.name === cat)!;
    c.subcategories.push({ name, isCustom: true });
  });
  await saveCategories(userId, categories);
  return { ok: true };
}
```
Analog `renameSubcategory`, `deleteSubcategory`.

#### 2.2 UI Hook – `useSubcategoryGridActions.ts`
* `const { mutate: addMut } = useMutation(addSubcategory, { onSuccess: invalidate("categories") })`.
* După succes → re-calculează grid columns (`table.setColumnVisibility`).

#### 2.3 Grid UI
* **Add**: ultimul rând din grup categorie -> `<button +>` condiționat de `count<5`.
* **Rename**: `contentEditable` cell + `onBlur` commit.
* **Delete**: `IconButton` col hidden până la hover.

#### 2.4 Backend
* Table `custom_categories` -> trigger `check_subcategory_limit()` BEFORE INSERT/UPDATE; raise exception dacă JSONB `array_length(subcategories) > 5`.
* Update RLS policy: `user_id = auth.uid()`.

#### 2.5 Tests
* Jest store tests pentru limită 5.
* Playwright scenario: adaugă 5 subcat, a 6-a trebuie să arate toast „Limită atinsă”.

---
## 3. Transaction Editing Experience
### 3.1 Modal vs Inline
| Funcție | Modal | Inline |
|---------|-------|--------|
| Trigger | click simplu | dblclick |
| Validare | Yup schema (`amount>0`, `desc length<=120`) | On blur |
| UX | câmpuri extinse, set recurență | rapid, 1 câmp |

#### 3.2 Componentă `TransactionModal.tsx`
* Reuse `TransactionForm`; pass `onSave`. On submit -> optimistic mutation (`useMutation`).
* Keyboard: Enter = submit, Esc = close.

#### 3.3 Inline Editing
* Cell renderer wraps `<input type="number" className="w-full" />`.
* On `onKeyDown` `Enter` → call `updateTransaction`; `Escape` → revert state.

#### 3.4 Delete/Clear
* Key listener global: dacă focus în cell și `Delete` pressed → `confirmDialog` then call `deleteTransaction` mutation.

#### 3.5 Colorizare condițională
```ts
const color = txn.type === "income" ? "text-green-600" : "text-red-600";
```
* Add Tailwind variants for daltonism: pattern-fill stripes.

---
## 4. Balance Forward Engine
### 4.1 Algoritm
```ts
function buildBalances(days: number, seed: number, txns: Tx[]) {
  const balances: number[] = Array(days).fill(seed);
  for (const t of txns) {
    const idx = dayjs(t.date).date() - 1;
    for (let i = idx; i < days; i++) {
      balances[i] += t.type === "income" ? t.amount : -t.amount;
    }
  }
  return balances;
}
```
* Memoised via `useMemo([transactions, seed, month])`.
* Perf: complexity O(d·m) unde d<=31, m<=n_txns; acceptabil.

### 4.2 Store
* `balanceStore` cu selector `useBalanceForDay(day)`; recalculat on `transactions.version`.

### 4.3 UI Integration
* Nouă coloană `Sold` = `balances[day]` formatat `formatCurrency`.
* Highlight <0 cu `bg-red-50`.

---
## 5. Recurrence Engine & Financial Concepts
### 5.1 DSL Recurrence
```txt
<freq> [interval] [count]
# examples
monthly 1 12   # once per month, 12 times
custom 3 10    # every 3 days, 10 occurrences
```
* Parser util `parseRecurrence(str)` → `{ type, interval, count }`.

### 5.2 DB Schema
| Field | Type | Note |
|-------|------|------|
| id | uuid | PK |
| user_id | uuid | RLS |
| template_tx | jsonb | prototype txn |
| rule | varchar | DSL |
| next_fire | date | index |

* Cron Supabase Edge Function `process_recurrence()` rule hourly → materialize next occurrence up to cap (36 months).

### 5.3 FE Handling
* În `TransactionModal`, dacă `recurring` checkbox on → create template not individual transactions.
* Grid fetch combinat: `select * from transactions_view` unde view uneşte reale + „planned” generate.

### 5.4 Economii / Investiții / Sold iniţial
* Enum `TransactionType = income | expense | saving | invest`.
* Sold iniţial: nouă tabelă `opening_balance (user_id, month, amount)`; fallback 0.
* Saving/invest: nu se scad din cash? setăm flag `affects_cash`.

---
## 6. Modul Daily View & Analytics
### 6.1 Pagina Today
* Route `/today` (guarded auth).
* UI: listă tranzacții estimate azi; checkbox „făcut”; toggle status → mutation `markDone(id)` (patch `status="done"`).
* Când marcat done: grid invalidează row; balance recalculat prin `buildBalances`.

### 6.2 KPI
* Query Supabase: `select sum(amount) filter (where status='done') / sum(amount) as ratio from transactions where month=… and type='expense'`.
* Card în dashboard: >100 % roșu, <80 % verde.
* Cron edge refresh la `invalidateQueries(["kpi", month])` daily.

---
## 7. Backlog Extras (schematic)
* **Filtru/Search** – use `globalFilterFn: fuzzy` cu `@tanstack/match-sorter-utils`.
* **Virtualizare** – `useReactTable` `rowVirtualizer` (import `@tanstack/react-virtual`).
* **Export Manager** – UI button + progress toast; folosește deja `ExportManager.exportTransactions`.
* **A11y & i18n** – add `aria-live`, `react-intl`, store locale în `settingsStore`.
* **Multi-currency** – schema `transactions` să aibă `currency` + rates table; conversion util.

---
### Test Strategy (to cover all)
* Unit (Jest) – utils, store actions.
* Component (RTL) – grid row, modal, subcategory CRUD.
* Integration (MSW) – optimistic mutations, recurrence engine.
* E2E (Playwright) – critical flows: add subcat, add txn, balance update, today checklist.

---
### Observabilitate & Perf
* Custom hook `usePerformanceMark("grid_render")` – logs render time.
* Supabase logs monitor (edge-function errors).
* Alerts: dacă `recur_engine` cron rule >5s, send Slack.

---
> Documentul poate fi importat în Notion/Jira ca Epic breakdown; fiecare tabel **Pas** → task/story cu Acceptance Criteria enumerate mai sus.

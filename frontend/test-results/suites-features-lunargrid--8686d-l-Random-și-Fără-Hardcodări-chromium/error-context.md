# Test info

- Name: LunarGrid - Flow Dinamic Complet >> 11-Step Dynamic Workflow - Totul Random și Fără Hardcodări
- Location: C:\windsurf repo\budget-app\frontend\tests\e2e\suites\features\lunargrid-dynamic-workflow.spec.ts:15:7

# Error details

```
Error: Timed out 5000ms waiting for expect(locator).toBeVisible()

Locator: getByTestId('cell-TRANSPORT-Renamed6367-25')
Expected: visible
Received: <element(s) not found>
Call log:
  - expect.toBeVisible with timeout 5000ms
  - waiting for getByTestId('cell-TRANSPORT-Renamed6367-25')

    at LunarGridPage.addRandomTransactionInSubcategory (C:\windsurf repo\budget-app\frontend\tests\e2e\support\pages\LunarGridPage.ts:123:24)
    at C:\windsurf repo\budget-app\frontend\tests\e2e\suites\features\lunargrid-dynamic-workflow.spec.ts:51:46
```

# Page snapshot

```yaml
- link "Tranzacții":
  - /url: /transactions
- link "Grid Lunar":
  - /url: /lunar-grid
- link "Enhanced LunarGrid (Phase 4)":
  - /url: /enhanced-lunar-grid
- link "🚀 LunarGrid Enhanced (Modal Architecture)":
  - /url: /lunar-grid-enhanced
- link "Opțiuni":
  - /url: /options
- heading "Grid Lunar" [level=1]
- button "Lățime completă"
- combobox:
  - option "Ianuarie"
  - option "Februarie"
  - option "Martie"
  - option "Aprilie"
  - option "Mai"
  - option "Iunie" [selected]
  - option "Iulie"
  - option "August"
  - option "Septembrie"
  - option "Octombrie"
  - option "Noiembrie"
  - option "Decembrie"
- spinbutton: "2025"
- button "Extinde tot"
- button "Resetează"
- heading "Iunie - 2025" [level=2]
- table:
  - rowgroup:
    - row "Categorii 1 2 3 4 5 6 7 8 9 10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 25 26 27 28 29 30 Total":
      - cell "Categorii"
      - cell "1"
      - cell "2"
      - cell "3"
      - cell "4"
      - cell "5"
      - cell "6"
      - cell "7"
      - cell "8"
      - cell "9"
      - cell "10"
      - cell "11"
      - cell "12"
      - cell "13"
      - cell "14"
      - cell "15"
      - cell "16"
      - cell "17"
      - cell "18"
      - cell "19"
      - cell "20"
      - cell "21"
      - cell "22"
      - cell "23"
      - cell "24"
      - cell "25"
      - cell "26"
      - cell "27"
      - cell "28"
      - cell "29"
      - cell "30"
      - cell "Total"
    - row "Balanțe zilnice 100,25 200,50 300,75 1,23M 0,50 1.000 1.000,25 — — 123 — — 23 — — — 100,0K — — — — — — — — 123B 12,4B 555 11,4K 123K 135B":
      - cell "Balanțe zilnice"
      - cell "100,25"
      - cell "200,50"
      - cell "300,75"
      - cell "1,23M"
      - cell "0,50"
      - cell "1.000"
      - cell "1.000,25"
      - cell "—"
      - cell "—"
      - cell "123"
      - cell "—"
      - cell "—"
      - cell "23"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "100,0K"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "123B"
      - cell "12,4B"
      - cell "555"
      - cell "11,4K"
      - cell "123K"
      - cell "135B"
  - rowgroup:
    - row "▶ VENITURI 100,25 200,50 300,75 1,23M 0,50 1.000 1.000,25 — — 123 — — 23 — — — 100,0K — — — — — — — — 123B — — 5.678 243 123B":
      - cell "▶ VENITURI"
      - cell "100,25"
      - cell "200,50"
      - cell "300,75"
      - cell "1,23M"
      - cell "0,50"
      - cell "1.000"
      - cell "1.000,25"
      - cell "—"
      - cell "—"
      - cell "123"
      - cell "—"
      - cell "—"
      - cell "23"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "100,0K"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "123B"
      - cell "—"
      - cell "—"
      - cell "5.678"
      - cell "243"
      - cell "123B"
    - row "▶ ECONOMII — — — — — — — — — — — — — — — — — — — — — — — — — — — 555 5.555 122K 128K":
      - cell "▶ ECONOMII"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "555"
      - cell "5.555"
      - cell "122K"
      - cell "128K"
    - row "▶ INFATISARE — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — —":
      - cell "▶ INFATISARE"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
    - row "▶ EDUCATIE — — — — — — — — — — — — — — — — — — — — — — — — — — 12,4B — 123 — 12,4B":
      - cell "▶ EDUCATIE"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "12,4B"
      - cell "—"
      - cell "123"
      - cell "—"
      - cell "12,4B"
    - row "▶ CARIERA — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — —":
      - cell "▶ CARIERA"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
    - row "▶ SANATATE — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — —":
      - cell "▶ SANATATE"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
    - row "▶ NUTRITIE — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — —":
      - cell "▶ NUTRITIE"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
    - row "▶ LOCUINTA — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — —":
      - cell "▶ LOCUINTA"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
    - row "▶ TIMP_LIBER — — — — — — — — — — — — — — — — — — — — — — — — — — — — — 678 678":
      - cell "▶ TIMP_LIBER"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "678"
      - cell "678"
    - row "▶ CALATORII — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — —":
      - cell "▶ CALATORII"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
    - row "▼ TRANSPORT — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — —":
      - cell "▼ TRANSPORT"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
    - row "Transport public amount cell with value amount cell with value amount cell with value amount cell with value amount cell with value amount cell with value amount cell with value amount cell with value amount cell with value amount cell with value amount cell with value amount cell with value amount cell with value amount cell with value amount cell with value amount cell with value amount cell with value amount cell with value amount cell with value amount cell with value amount cell with value amount cell with value amount cell with value amount cell with value amount cell with value amount cell with value amount cell with value amount cell with value amount cell with value amount cell with value —":
      - cell "Transport public":
        - text: Transport public
        - button "Redenumește subcategoria"
      - cell "amount cell with value":
        - gridcell "amount cell with value"
      - cell "amount cell with value":
        - gridcell "amount cell with value"
      - cell "amount cell with value":
        - gridcell "amount cell with value"
      - cell "amount cell with value":
        - gridcell "amount cell with value"
      - cell "amount cell with value":
        - gridcell "amount cell with value"
      - cell "amount cell with value":
        - gridcell "amount cell with value"
      - cell "amount cell with value":
        - gridcell "amount cell with value"
      - cell "amount cell with value":
        - gridcell "amount cell with value"
      - cell "amount cell with value":
        - gridcell "amount cell with value"
      - cell "amount cell with value":
        - gridcell "amount cell with value"
      - cell "amount cell with value":
        - gridcell "amount cell with value"
      - cell "amount cell with value":
        - gridcell "amount cell with value"
      - cell "amount cell with value":
        - gridcell "amount cell with value"
      - cell "amount cell with value":
        - gridcell "amount cell with value"
      - cell "amount cell with value":
        - gridcell "amount cell with value"
      - cell "amount cell with value":
        - gridcell "amount cell with value"
      - cell "amount cell with value":
        - gridcell "amount cell with value"
      - cell "amount cell with value":
        - gridcell "amount cell with value"
      - cell "amount cell with value":
        - gridcell "amount cell with value"
      - cell "amount cell with value":
        - gridcell "amount cell with value"
      - cell "amount cell with value":
        - gridcell "amount cell with value"
      - cell "amount cell with value":
        - gridcell "amount cell with value"
      - cell "amount cell with value":
        - gridcell "amount cell with value"
      - cell "amount cell with value":
        - gridcell "amount cell with value"
      - cell "amount cell with value":
        - gridcell "amount cell with value"
      - cell "amount cell with value":
        - gridcell "amount cell with value"
      - cell "amount cell with value":
        - gridcell "amount cell with value"
      - cell "amount cell with value":
        - gridcell "amount cell with value"
      - cell "amount cell with value":
        - gridcell "amount cell with value"
      - cell "amount cell with value":
        - gridcell "amount cell with value"
      - cell "—"
    - row "Revizii amount cell with value amount cell with value amount cell with value amount cell with value amount cell with value amount cell with value amount cell with value amount cell with value amount cell with value amount cell with value amount cell with value amount cell with value amount cell with value amount cell with value amount cell with value amount cell with value amount cell with value amount cell with value amount cell with value amount cell with value amount cell with value amount cell with value amount cell with value amount cell with value amount cell with value amount cell with value amount cell with value amount cell with value amount cell with value amount cell with value —":
      - cell "Revizii":
        - text: Revizii
        - button "Redenumește subcategoria"
      - cell "amount cell with value":
        - gridcell "amount cell with value"
      - cell "amount cell with value":
        - gridcell "amount cell with value"
      - cell "amount cell with value":
        - gridcell "amount cell with value"
      - cell "amount cell with value":
        - gridcell "amount cell with value"
      - cell "amount cell with value":
        - gridcell "amount cell with value"
      - cell "amount cell with value":
        - gridcell "amount cell with value"
      - cell "amount cell with value":
        - gridcell "amount cell with value"
      - cell "amount cell with value":
        - gridcell "amount cell with value"
      - cell "amount cell with value":
        - gridcell "amount cell with value"
      - cell "amount cell with value":
        - gridcell "amount cell with value"
      - cell "amount cell with value":
        - gridcell "amount cell with value"
      - cell "amount cell with value":
        - gridcell "amount cell with value"
      - cell "amount cell with value":
        - gridcell "amount cell with value"
      - cell "amount cell with value":
        - gridcell "amount cell with value"
      - cell "amount cell with value":
        - gridcell "amount cell with value"
      - cell "amount cell with value":
        - gridcell "amount cell with value"
      - cell "amount cell with value":
        - gridcell "amount cell with value"
      - cell "amount cell with value":
        - gridcell "amount cell with value"
      - cell "amount cell with value":
        - gridcell "amount cell with value"
      - cell "amount cell with value":
        - gridcell "amount cell with value"
      - cell "amount cell with value":
        - gridcell "amount cell with value"
      - cell "amount cell with value":
        - gridcell "amount cell with value"
      - cell "amount cell with value":
        - gridcell "amount cell with value"
      - cell "amount cell with value":
        - gridcell "amount cell with value"
      - cell "amount cell with value":
        - gridcell "amount cell with value"
      - cell "amount cell with value":
        - gridcell "amount cell with value"
      - cell "amount cell with value":
        - gridcell "amount cell with value"
      - cell "amount cell with value":
        - gridcell "amount cell with value"
      - cell "amount cell with value":
        - gridcell "amount cell with value"
      - cell "amount cell with value":
        - gridcell "amount cell with value"
      - cell "—"
    - row "Spălătorie auto amount cell with value amount cell with value amount cell with value amount cell with value amount cell with value amount cell with value amount cell with value amount cell with value amount cell with value amount cell with value amount cell with value amount cell with value amount cell with value amount cell with value amount cell with value amount cell with value amount cell with value amount cell with value amount cell with value amount cell with value amount cell with value amount cell with value amount cell with value amount cell with value amount cell with value amount cell with value amount cell with value amount cell with value amount cell with value amount cell with value —":
      - cell "Spălătorie auto":
        - text: Spălătorie auto
        - button "Redenumește subcategoria"
      - cell "amount cell with value":
        - gridcell "amount cell with value"
      - cell "amount cell with value":
        - gridcell "amount cell with value"
      - cell "amount cell with value":
        - gridcell "amount cell with value"
      - cell "amount cell with value":
        - gridcell "amount cell with value"
      - cell "amount cell with value":
        - gridcell "amount cell with value"
      - cell "amount cell with value":
        - gridcell "amount cell with value"
      - cell "amount cell with value":
        - gridcell "amount cell with value"
      - cell "amount cell with value":
        - gridcell "amount cell with value"
      - cell "amount cell with value":
        - gridcell "amount cell with value"
      - cell "amount cell with value":
        - gridcell "amount cell with value"
      - cell "amount cell with value":
        - gridcell "amount cell with value"
      - cell "amount cell with value":
        - gridcell "amount cell with value"
      - cell "amount cell with value":
        - gridcell "amount cell with value"
      - cell "amount cell with value":
        - gridcell "amount cell with value"
      - cell "amount cell with value":
        - gridcell "amount cell with value"
      - cell "amount cell with value":
        - gridcell "amount cell with value"
      - cell "amount cell with value":
        - gridcell "amount cell with value"
      - cell "amount cell with value":
        - gridcell "amount cell with value"
      - cell "amount cell with value":
        - gridcell "amount cell with value"
      - cell "amount cell with value":
        - gridcell "amount cell with value"
      - cell "amount cell with value":
        - gridcell "amount cell with value"
      - cell "amount cell with value":
        - gridcell "amount cell with value"
      - cell "amount cell with value":
        - gridcell "amount cell with value"
      - cell "amount cell with value":
        - gridcell "amount cell with value"
      - cell "amount cell with value":
        - gridcell "amount cell with value"
      - cell "amount cell with value":
        - gridcell "amount cell with value"
      - cell "amount cell with value":
        - gridcell "amount cell with value"
      - cell "amount cell with value":
        - gridcell "amount cell with value"
      - cell "amount cell with value":
        - gridcell "amount cell with value"
      - cell "amount cell with value":
        - gridcell "amount cell with value"
      - cell "—"
    - row "Accesorii/Consumabile pentru mașină amount cell with value amount cell with value amount cell with value amount cell with value amount cell with value amount cell with value amount cell with value amount cell with value amount cell with value amount cell with value amount cell with value amount cell with value amount cell with value amount cell with value amount cell with value amount cell with value amount cell with value amount cell with value amount cell with value amount cell with value amount cell with value amount cell with value amount cell with value amount cell with value amount cell with value amount cell with value amount cell with value amount cell with value amount cell with value amount cell with value —":
      - cell "Accesorii/Consumabile pentru mașină":
        - text: Accesorii/Consumabile pentru mașină
        - button "Redenumește subcategoria"
      - cell "amount cell with value":
        - gridcell "amount cell with value"
      - cell "amount cell with value":
        - gridcell "amount cell with value"
      - cell "amount cell with value":
        - gridcell "amount cell with value"
      - cell "amount cell with value":
        - gridcell "amount cell with value"
      - cell "amount cell with value":
        - gridcell "amount cell with value"
      - cell "amount cell with value":
        - gridcell "amount cell with value"
      - cell "amount cell with value":
        - gridcell "amount cell with value"
      - cell "amount cell with value":
        - gridcell "amount cell with value"
      - cell "amount cell with value":
        - gridcell "amount cell with value"
      - cell "amount cell with value":
        - gridcell "amount cell with value"
      - cell "amount cell with value":
        - gridcell "amount cell with value"
      - cell "amount cell with value":
        - gridcell "amount cell with value"
      - cell "amount cell with value":
        - gridcell "amount cell with value"
      - cell "amount cell with value":
        - gridcell "amount cell with value"
      - cell "amount cell with value":
        - gridcell "amount cell with value"
      - cell "amount cell with value":
        - gridcell "amount cell with value"
      - cell "amount cell with value":
        - gridcell "amount cell with value"
      - cell "amount cell with value":
        - gridcell "amount cell with value"
      - cell "amount cell with value":
        - gridcell "amount cell with value"
      - cell "amount cell with value":
        - gridcell "amount cell with value"
      - cell "amount cell with value":
        - gridcell "amount cell with value"
      - cell "amount cell with value":
        - gridcell "amount cell with value"
      - cell "amount cell with value":
        - gridcell "amount cell with value"
      - cell "amount cell with value":
        - gridcell "amount cell with value"
      - cell "amount cell with value":
        - gridcell "amount cell with value"
      - cell "amount cell with value":
        - gridcell "amount cell with value"
      - cell "amount cell with value":
        - gridcell "amount cell with value"
      - cell "amount cell with value":
        - gridcell "amount cell with value"
      - cell "amount cell with value":
        - gridcell "amount cell with value"
      - cell "amount cell with value":
        - gridcell "amount cell with value"
      - cell "—"
    - row "Combustibil amount cell with value amount cell with value amount cell with value amount cell with value amount cell with value amount cell with value amount cell with value amount cell with value amount cell with value amount cell with value amount cell with value amount cell with value amount cell with value amount cell with value amount cell with value amount cell with value amount cell with value amount cell with value amount cell with value amount cell with value amount cell with value amount cell with value amount cell with value amount cell with value amount cell with value amount cell with value amount cell with value amount cell with value amount cell with value amount cell with value —":
      - cell "Combustibil":
        - text: Combustibil
        - button "Redenumește subcategoria"
      - cell "amount cell with value":
        - gridcell "amount cell with value"
      - cell "amount cell with value":
        - gridcell "amount cell with value"
      - cell "amount cell with value":
        - gridcell "amount cell with value"
      - cell "amount cell with value":
        - gridcell "amount cell with value"
      - cell "amount cell with value":
        - gridcell "amount cell with value"
      - cell "amount cell with value":
        - gridcell "amount cell with value"
      - cell "amount cell with value":
        - gridcell "amount cell with value"
      - cell "amount cell with value":
        - gridcell "amount cell with value"
      - cell "amount cell with value":
        - gridcell "amount cell with value"
      - cell "amount cell with value":
        - gridcell "amount cell with value"
      - cell "amount cell with value":
        - gridcell "amount cell with value"
      - cell "amount cell with value":
        - gridcell "amount cell with value"
      - cell "amount cell with value":
        - gridcell "amount cell with value"
      - cell "amount cell with value":
        - gridcell "amount cell with value"
      - cell "amount cell with value":
        - gridcell "amount cell with value"
      - cell "amount cell with value":
        - gridcell "amount cell with value"
      - cell "amount cell with value":
        - gridcell "amount cell with value"
      - cell "amount cell with value":
        - gridcell "amount cell with value"
      - cell "amount cell with value":
        - gridcell "amount cell with value"
      - cell "amount cell with value":
        - gridcell "amount cell with value"
      - cell "amount cell with value":
        - gridcell "amount cell with value"
      - cell "amount cell with value":
        - gridcell "amount cell with value"
      - cell "amount cell with value":
        - gridcell "amount cell with value"
      - cell "amount cell with value":
        - gridcell "amount cell with value"
      - cell "amount cell with value":
        - gridcell "amount cell with value"
      - cell "amount cell with value":
        - gridcell "amount cell with value"
      - cell "amount cell with value":
        - gridcell "amount cell with value"
      - cell "amount cell with value":
        - gridcell "amount cell with value"
      - cell "amount cell with value":
        - gridcell "amount cell with value"
      - cell "amount cell with value":
        - gridcell "amount cell with value"
      - cell "—"
    - row "Schimbat cauciucuri vară/iarnă amount cell with value amount cell with value amount cell with value amount cell with value amount cell with value amount cell with value amount cell with value amount cell with value amount cell with value amount cell with value amount cell with value amount cell with value amount cell with value amount cell with value amount cell with value amount cell with value amount cell with value amount cell with value amount cell with value amount cell with value amount cell with value amount cell with value amount cell with value amount cell with value amount cell with value amount cell with value amount cell with value amount cell with value amount cell with value amount cell with value —":
      - cell "Schimbat cauciucuri vară/iarnă":
        - text: Schimbat cauciucuri vară/iarnă
        - button "Redenumește subcategoria"
      - cell "amount cell with value":
        - gridcell "amount cell with value"
      - cell "amount cell with value":
        - gridcell "amount cell with value"
      - cell "amount cell with value":
        - gridcell "amount cell with value"
      - cell "amount cell with value":
        - gridcell "amount cell with value"
      - cell "amount cell with value":
        - gridcell "amount cell with value"
      - cell "amount cell with value":
        - gridcell "amount cell with value"
      - cell "amount cell with value":
        - gridcell "amount cell with value"
      - cell "amount cell with value":
        - gridcell "amount cell with value"
      - cell "amount cell with value":
        - gridcell "amount cell with value"
      - cell "amount cell with value":
        - gridcell "amount cell with value"
      - cell "amount cell with value":
        - gridcell "amount cell with value"
      - cell "amount cell with value":
        - gridcell "amount cell with value"
      - cell "amount cell with value":
        - gridcell "amount cell with value"
      - cell "amount cell with value":
        - gridcell "amount cell with value"
      - cell "amount cell with value":
        - gridcell "amount cell with value"
      - cell "amount cell with value":
        - gridcell "amount cell with value"
      - cell "amount cell with value":
        - gridcell "amount cell with value"
      - cell "amount cell with value":
        - gridcell "amount cell with value"
      - cell "amount cell with value":
        - gridcell "amount cell with value"
      - cell "amount cell with value":
        - gridcell "amount cell with value"
      - cell "amount cell with value":
        - gridcell "amount cell with value"
      - cell "amount cell with value":
        - gridcell "amount cell with value"
      - cell "amount cell with value":
        - gridcell "amount cell with value"
      - cell "amount cell with value":
        - gridcell "amount cell with value"
      - cell "amount cell with value":
        - gridcell "amount cell with value"
      - cell "amount cell with value":
        - gridcell "amount cell with value"
      - cell "amount cell with value":
        - gridcell "amount cell with value"
      - cell "amount cell with value":
        - gridcell "amount cell with value"
      - cell "amount cell with value":
        - gridcell "amount cell with value"
      - cell "amount cell with value":
        - gridcell "amount cell with value"
      - cell "—"
    - row "Hotel pentru anvelope amount cell with value amount cell with value amount cell with value amount cell with value amount cell with value amount cell with value amount cell with value amount cell with value amount cell with value amount cell with value amount cell with value amount cell with value amount cell with value amount cell with value amount cell with value amount cell with value amount cell with value amount cell with value amount cell with value amount cell with value amount cell with value amount cell with value amount cell with value amount cell with value amount cell with value amount cell with value amount cell with value amount cell with value amount cell with value amount cell with value —":
      - cell "Hotel pentru anvelope":
        - text: Hotel pentru anvelope
        - button "Redenumește subcategoria"
      - cell "amount cell with value":
        - gridcell "amount cell with value"
      - cell "amount cell with value":
        - gridcell "amount cell with value"
      - cell "amount cell with value":
        - gridcell "amount cell with value"
      - cell "amount cell with value":
        - gridcell "amount cell with value"
      - cell "amount cell with value":
        - gridcell "amount cell with value"
      - cell "amount cell with value":
        - gridcell "amount cell with value"
      - cell "amount cell with value":
        - gridcell "amount cell with value"
      - cell "amount cell with value":
        - gridcell "amount cell with value"
      - cell "amount cell with value":
        - gridcell "amount cell with value"
      - cell "amount cell with value":
        - gridcell "amount cell with value"
      - cell "amount cell with value":
        - gridcell "amount cell with value"
      - cell "amount cell with value":
        - gridcell "amount cell with value"
      - cell "amount cell with value":
        - gridcell "amount cell with value"
      - cell "amount cell with value":
        - gridcell "amount cell with value"
      - cell "amount cell with value":
        - gridcell "amount cell with value"
      - cell "amount cell with value":
        - gridcell "amount cell with value"
      - cell "amount cell with value":
        - gridcell "amount cell with value"
      - cell "amount cell with value":
        - gridcell "amount cell with value"
      - cell "amount cell with value":
        - gridcell "amount cell with value"
      - cell "amount cell with value":
        - gridcell "amount cell with value"
      - cell "amount cell with value":
        - gridcell "amount cell with value"
      - cell "amount cell with value":
        - gridcell "amount cell with value"
      - cell "amount cell with value":
        - gridcell "amount cell with value"
      - cell "amount cell with value":
        - gridcell "amount cell with value"
      - cell "amount cell with value":
        - gridcell "amount cell with value"
      - cell "amount cell with value":
        - gridcell "amount cell with value"
      - cell "amount cell with value":
        - gridcell "amount cell with value"
      - cell "amount cell with value":
        - gridcell "amount cell with value"
      - cell "amount cell with value":
        - gridcell "amount cell with value"
      - cell "amount cell with value":
        - gridcell "amount cell with value"
      - cell "—"
    - row "Reparații auto amount cell with value amount cell with value amount cell with value amount cell with value amount cell with value amount cell with value amount cell with value amount cell with value amount cell with value amount cell with value amount cell with value amount cell with value amount cell with value amount cell with value amount cell with value amount cell with value amount cell with value amount cell with value amount cell with value amount cell with value amount cell with value amount cell with value amount cell with value amount cell with value amount cell with value amount cell with value amount cell with value amount cell with value amount cell with value amount cell with value —":
      - cell "Reparații auto":
        - text: Reparații auto
        - button "Redenumește subcategoria"
      - cell "amount cell with value":
        - gridcell "amount cell with value"
      - cell "amount cell with value":
        - gridcell "amount cell with value"
      - cell "amount cell with value":
        - gridcell "amount cell with value"
      - cell "amount cell with value":
        - gridcell "amount cell with value"
      - cell "amount cell with value":
        - gridcell "amount cell with value"
      - cell "amount cell with value":
        - gridcell "amount cell with value"
      - cell "amount cell with value":
        - gridcell "amount cell with value"
      - cell "amount cell with value":
        - gridcell "amount cell with value"
      - cell "amount cell with value":
        - gridcell "amount cell with value"
      - cell "amount cell with value":
        - gridcell "amount cell with value"
      - cell "amount cell with value":
        - gridcell "amount cell with value"
      - cell "amount cell with value":
        - gridcell "amount cell with value"
      - cell "amount cell with value":
        - gridcell "amount cell with value"
      - cell "amount cell with value":
        - gridcell "amount cell with value"
      - cell "amount cell with value":
        - gridcell "amount cell with value"
      - cell "amount cell with value":
        - gridcell "amount cell with value"
      - cell "amount cell with value":
        - gridcell "amount cell with value"
      - cell "amount cell with value":
        - gridcell "amount cell with value"
      - cell "amount cell with value":
        - gridcell "amount cell with value"
      - cell "amount cell with value":
        - gridcell "amount cell with value"
      - cell "amount cell with value":
        - gridcell "amount cell with value"
      - cell "amount cell with value":
        - gridcell "amount cell with value"
      - cell "amount cell with value":
        - gridcell "amount cell with value"
      - cell "amount cell with value":
        - gridcell "amount cell with value"
      - cell "amount cell with value":
        - gridcell "amount cell with value"
      - cell "amount cell with value":
        - gridcell "amount cell with value"
      - cell "amount cell with value":
        - gridcell "amount cell with value"
      - cell "amount cell with value":
        - gridcell "amount cell with value"
      - cell "amount cell with value":
        - gridcell "amount cell with value"
      - cell "amount cell with value":
        - gridcell "amount cell with value"
      - cell "—"
    - row "Taxe drumuri amount cell with value amount cell with value amount cell with value amount cell with value amount cell with value amount cell with value amount cell with value amount cell with value amount cell with value amount cell with value amount cell with value amount cell with value amount cell with value amount cell with value amount cell with value amount cell with value amount cell with value amount cell with value amount cell with value amount cell with value amount cell with value amount cell with value amount cell with value amount cell with value amount cell with value amount cell with value amount cell with value amount cell with value amount cell with value amount cell with value —":
      - cell "Taxe drumuri":
        - text: Taxe drumuri
        - button "Redenumește subcategoria"
      - cell "amount cell with value":
        - gridcell "amount cell with value"
      - cell "amount cell with value":
        - gridcell "amount cell with value"
      - cell "amount cell with value":
        - gridcell "amount cell with value"
      - cell "amount cell with value":
        - gridcell "amount cell with value"
      - cell "amount cell with value":
        - gridcell "amount cell with value"
      - cell "amount cell with value":
        - gridcell "amount cell with value"
      - cell "amount cell with value":
        - gridcell "amount cell with value"
      - cell "amount cell with value":
        - gridcell "amount cell with value"
      - cell "amount cell with value":
        - gridcell "amount cell with value"
      - cell "amount cell with value":
        - gridcell "amount cell with value"
      - cell "amount cell with value":
        - gridcell "amount cell with value"
      - cell "amount cell with value":
        - gridcell "amount cell with value"
      - cell "amount cell with value":
        - gridcell "amount cell with value"
      - cell "amount cell with value":
        - gridcell "amount cell with value"
      - cell "amount cell with value":
        - gridcell "amount cell with value"
      - cell "amount cell with value":
        - gridcell "amount cell with value"
      - cell "amount cell with value":
        - gridcell "amount cell with value"
      - cell "amount cell with value":
        - gridcell "amount cell with value"
      - cell "amount cell with value":
        - gridcell "amount cell with value"
      - cell "amount cell with value":
        - gridcell "amount cell with value"
      - cell "amount cell with value":
        - gridcell "amount cell with value"
      - cell "amount cell with value":
        - gridcell "amount cell with value"
      - cell "amount cell with value":
        - gridcell "amount cell with value"
      - cell "amount cell with value":
        - gridcell "amount cell with value"
      - cell "amount cell with value":
        - gridcell "amount cell with value"
      - cell "amount cell with value":
        - gridcell "amount cell with value"
      - cell "amount cell with value":
        - gridcell "amount cell with value"
      - cell "amount cell with value":
        - gridcell "amount cell with value"
      - cell "amount cell with value":
        - gridcell "amount cell with value"
      - cell "amount cell with value":
        - gridcell "amount cell with value"
      - cell "—"
    - row "Parcare amount cell with value amount cell with value amount cell with value amount cell with value amount cell with value amount cell with value amount cell with value amount cell with value amount cell with value amount cell with value amount cell with value amount cell with value amount cell with value amount cell with value amount cell with value amount cell with value amount cell with value amount cell with value amount cell with value amount cell with value amount cell with value amount cell with value amount cell with value amount cell with value amount cell with value amount cell with value amount cell with value amount cell with value amount cell with value amount cell with value —":
      - cell "Parcare":
        - text: Parcare
        - button "Redenumește subcategoria"
      - cell "amount cell with value":
        - gridcell "amount cell with value"
      - cell "amount cell with value":
        - gridcell "amount cell with value"
      - cell "amount cell with value":
        - gridcell "amount cell with value"
      - cell "amount cell with value":
        - gridcell "amount cell with value"
      - cell "amount cell with value":
        - gridcell "amount cell with value"
      - cell "amount cell with value":
        - gridcell "amount cell with value"
      - cell "amount cell with value":
        - gridcell "amount cell with value"
      - cell "amount cell with value":
        - gridcell "amount cell with value"
      - cell "amount cell with value":
        - gridcell "amount cell with value"
      - cell "amount cell with value":
        - gridcell "amount cell with value"
      - cell "amount cell with value":
        - gridcell "amount cell with value"
      - cell "amount cell with value":
        - gridcell "amount cell with value"
      - cell "amount cell with value":
        - gridcell "amount cell with value"
      - cell "amount cell with value":
        - gridcell "amount cell with value"
      - cell "amount cell with value":
        - gridcell "amount cell with value"
      - cell "amount cell with value":
        - gridcell "amount cell with value"
      - cell "amount cell with value":
        - gridcell "amount cell with value"
      - cell "amount cell with value":
        - gridcell "amount cell with value"
      - cell "amount cell with value":
        - gridcell "amount cell with value"
      - cell "amount cell with value":
        - gridcell "amount cell with value"
      - cell "amount cell with value":
        - gridcell "amount cell with value"
      - cell "amount cell with value":
        - gridcell "amount cell with value"
      - cell "amount cell with value":
        - gridcell "amount cell with value"
      - cell "amount cell with value":
        - gridcell "amount cell with value"
      - cell "amount cell with value":
        - gridcell "amount cell with value"
      - cell "amount cell with value":
        - gridcell "amount cell with value"
      - cell "amount cell with value":
        - gridcell "amount cell with value"
      - cell "amount cell with value":
        - gridcell "amount cell with value"
      - cell "amount cell with value":
        - gridcell "amount cell with value"
      - cell "amount cell with value":
        - gridcell "amount cell with value"
      - cell "—"
    - row "Asigurare RCA amount cell with value amount cell with value amount cell with value amount cell with value amount cell with value amount cell with value amount cell with value amount cell with value amount cell with value amount cell with value amount cell with value amount cell with value amount cell with value amount cell with value amount cell with value amount cell with value amount cell with value amount cell with value amount cell with value amount cell with value amount cell with value amount cell with value amount cell with value amount cell with value amount cell with value amount cell with value amount cell with value amount cell with value amount cell with value amount cell with value —":
      - cell "Asigurare RCA":
        - text: Asigurare RCA
        - button "Redenumește subcategoria"
      - cell "amount cell with value":
        - gridcell "amount cell with value"
      - cell "amount cell with value":
        - gridcell "amount cell with value"
      - cell "amount cell with value":
        - gridcell "amount cell with value"
      - cell "amount cell with value":
        - gridcell "amount cell with value"
      - cell "amount cell with value":
        - gridcell "amount cell with value"
      - cell "amount cell with value":
        - gridcell "amount cell with value"
      - cell "amount cell with value":
        - gridcell "amount cell with value"
      - cell "amount cell with value":
        - gridcell "amount cell with value"
      - cell "amount cell with value":
        - gridcell "amount cell with value"
      - cell "amount cell with value":
        - gridcell "amount cell with value"
      - cell "amount cell with value":
        - gridcell "amount cell with value"
      - cell "amount cell with value":
        - gridcell "amount cell with value"
      - cell "amount cell with value":
        - gridcell "amount cell with value"
      - cell "amount cell with value":
        - gridcell "amount cell with value"
      - cell "amount cell with value":
        - gridcell "amount cell with value"
      - cell "amount cell with value":
        - gridcell "amount cell with value"
      - cell "amount cell with value":
        - gridcell "amount cell with value"
      - cell "amount cell with value":
        - gridcell "amount cell with value"
      - cell "amount cell with value":
        - gridcell "amount cell with value"
      - cell "amount cell with value":
        - gridcell "amount cell with value"
      - cell "amount cell with value":
        - gridcell "amount cell with value"
      - cell "amount cell with value":
        - gridcell "amount cell with value"
      - cell "amount cell with value":
        - gridcell "amount cell with value"
      - cell "amount cell with value":
        - gridcell "amount cell with value"
      - cell "amount cell with value":
        - gridcell "amount cell with value"
      - cell "amount cell with value":
        - gridcell "amount cell with value"
      - cell "amount cell with value":
        - gridcell "amount cell with value"
      - cell "amount cell with value":
        - gridcell "amount cell with value"
      - cell "amount cell with value":
        - gridcell "amount cell with value"
      - cell "amount cell with value":
        - gridcell "amount cell with value"
      - cell "—"
    - row "Asigurare CASCO amount cell with value amount cell with value amount cell with value amount cell with value amount cell with value amount cell with value amount cell with value amount cell with value amount cell with value amount cell with value amount cell with value amount cell with value amount cell with value amount cell with value amount cell with value amount cell with value amount cell with value amount cell with value amount cell with value amount cell with value amount cell with value amount cell with value amount cell with value amount cell with value amount cell with value amount cell with value amount cell with value amount cell with value amount cell with value amount cell with value —":
      - cell "Asigurare CASCO":
        - text: Asigurare CASCO
        - button "Redenumește subcategoria"
      - cell "amount cell with value":
        - gridcell "amount cell with value"
      - cell "amount cell with value":
        - gridcell "amount cell with value"
      - cell "amount cell with value":
        - gridcell "amount cell with value"
      - cell "amount cell with value":
        - gridcell "amount cell with value"
      - cell "amount cell with value":
        - gridcell "amount cell with value"
      - cell "amount cell with value":
        - gridcell "amount cell with value"
      - cell "amount cell with value":
        - gridcell "amount cell with value"
      - cell "amount cell with value":
        - gridcell "amount cell with value"
      - cell "amount cell with value":
        - gridcell "amount cell with value"
      - cell "amount cell with value":
        - gridcell "amount cell with value"
      - cell "amount cell with value":
        - gridcell "amount cell with value"
      - cell "amount cell with value":
        - gridcell "amount cell with value"
      - cell "amount cell with value":
        - gridcell "amount cell with value"
      - cell "amount cell with value":
        - gridcell "amount cell with value"
      - cell "amount cell with value":
        - gridcell "amount cell with value"
      - cell "amount cell with value":
        - gridcell "amount cell with value"
      - cell "amount cell with value":
        - gridcell "amount cell with value"
      - cell "amount cell with value":
        - gridcell "amount cell with value"
      - cell "amount cell with value":
        - gridcell "amount cell with value"
      - cell "amount cell with value":
        - gridcell "amount cell with value"
      - cell "amount cell with value":
        - gridcell "amount cell with value"
      - cell "amount cell with value":
        - gridcell "amount cell with value"
      - cell "amount cell with value":
        - gridcell "amount cell with value"
      - cell "amount cell with value":
        - gridcell "amount cell with value"
      - cell "amount cell with value":
        - gridcell "amount cell with value"
      - cell "amount cell with value":
        - gridcell "amount cell with value"
      - cell "amount cell with value":
        - gridcell "amount cell with value"
      - cell "amount cell with value":
        - gridcell "amount cell with value"
      - cell "amount cell with value":
        - gridcell "amount cell with value"
      - cell "amount cell with value":
        - gridcell "amount cell with value"
      - cell "—"
    - row "Rovigneta amount cell with value amount cell with value amount cell with value amount cell with value amount cell with value amount cell with value amount cell with value amount cell with value amount cell with value amount cell with value amount cell with value amount cell with value amount cell with value amount cell with value amount cell with value amount cell with value amount cell with value amount cell with value amount cell with value amount cell with value amount cell with value amount cell with value amount cell with value amount cell with value amount cell with value amount cell with value amount cell with value amount cell with value amount cell with value amount cell with value —":
      - cell "Rovigneta":
        - text: Rovigneta
        - button "Redenumește subcategoria"
      - cell "amount cell with value":
        - gridcell "amount cell with value"
      - cell "amount cell with value":
        - gridcell "amount cell with value"
      - cell "amount cell with value":
        - gridcell "amount cell with value"
      - cell "amount cell with value":
        - gridcell "amount cell with value"
      - cell "amount cell with value":
        - gridcell "amount cell with value"
      - cell "amount cell with value":
        - gridcell "amount cell with value"
      - cell "amount cell with value":
        - gridcell "amount cell with value"
      - cell "amount cell with value":
        - gridcell "amount cell with value"
      - cell "amount cell with value":
        - gridcell "amount cell with value"
      - cell "amount cell with value":
        - gridcell "amount cell with value"
      - cell "amount cell with value":
        - gridcell "amount cell with value"
      - cell "amount cell with value":
        - gridcell "amount cell with value"
      - cell "amount cell with value":
        - gridcell "amount cell with value"
      - cell "amount cell with value":
        - gridcell "amount cell with value"
      - cell "amount cell with value":
        - gridcell "amount cell with value"
      - cell "amount cell with value":
        - gridcell "amount cell with value"
      - cell "amount cell with value":
        - gridcell "amount cell with value"
      - cell "amount cell with value":
        - gridcell "amount cell with value"
      - cell "amount cell with value":
        - gridcell "amount cell with value"
      - cell "amount cell with value":
        - gridcell "amount cell with value"
      - cell "amount cell with value":
        - gridcell "amount cell with value"
      - cell "amount cell with value":
        - gridcell "amount cell with value"
      - cell "amount cell with value":
        - gridcell "amount cell with value"
      - cell "amount cell with value":
        - gridcell "amount cell with value"
      - cell "amount cell with value":
        - gridcell "amount cell with value"
      - cell "amount cell with value":
        - gridcell "amount cell with value"
      - cell "amount cell with value":
        - gridcell "amount cell with value"
      - cell "amount cell with value":
        - gridcell "amount cell with value"
      - cell "amount cell with value":
        - gridcell "amount cell with value"
      - cell "amount cell with value":
        - gridcell "amount cell with value"
      - cell "—"
    - row "Impozit auto amount cell with value amount cell with value amount cell with value amount cell with value amount cell with value amount cell with value amount cell with value amount cell with value amount cell with value amount cell with value amount cell with value amount cell with value amount cell with value amount cell with value amount cell with value amount cell with value amount cell with value amount cell with value amount cell with value amount cell with value amount cell with value amount cell with value amount cell with value amount cell with value amount cell with value amount cell with value amount cell with value amount cell with value amount cell with value amount cell with value —":
      - cell "Impozit auto":
        - text: Impozit auto
        - button "Redenumește subcategoria"
      - cell "amount cell with value":
        - gridcell "amount cell with value"
      - cell "amount cell with value":
        - gridcell "amount cell with value"
      - cell "amount cell with value":
        - gridcell "amount cell with value"
      - cell "amount cell with value":
        - gridcell "amount cell with value"
      - cell "amount cell with value":
        - gridcell "amount cell with value"
      - cell "amount cell with value":
        - gridcell "amount cell with value"
      - cell "amount cell with value":
        - gridcell "amount cell with value"
      - cell "amount cell with value":
        - gridcell "amount cell with value"
      - cell "amount cell with value":
        - gridcell "amount cell with value"
      - cell "amount cell with value":
        - gridcell "amount cell with value"
      - cell "amount cell with value":
        - gridcell "amount cell with value"
      - cell "amount cell with value":
        - gridcell "amount cell with value"
      - cell "amount cell with value":
        - gridcell "amount cell with value"
      - cell "amount cell with value":
        - gridcell "amount cell with value"
      - cell "amount cell with value":
        - gridcell "amount cell with value"
      - cell "amount cell with value":
        - gridcell "amount cell with value"
      - cell "amount cell with value":
        - gridcell "amount cell with value"
      - cell "amount cell with value":
        - gridcell "amount cell with value"
      - cell "amount cell with value":
        - gridcell "amount cell with value"
      - cell "amount cell with value":
        - gridcell "amount cell with value"
      - cell "amount cell with value":
        - gridcell "amount cell with value"
      - cell "amount cell with value":
        - gridcell "amount cell with value"
      - cell "amount cell with value":
        - gridcell "amount cell with value"
      - cell "amount cell with value":
        - gridcell "amount cell with value"
      - cell "amount cell with value":
        - gridcell "amount cell with value"
      - cell "amount cell with value":
        - gridcell "amount cell with value"
      - cell "amount cell with value":
        - gridcell "amount cell with value"
      - cell "amount cell with value":
        - gridcell "amount cell with value"
      - cell "amount cell with value":
        - gridcell "amount cell with value"
      - cell "amount cell with value":
        - gridcell "amount cell with value"
      - cell "—"
    - row "Renamed6367 custom amount cell with value amount cell with value amount cell with value amount cell with value amount cell with value amount cell with value amount cell with value amount cell with value amount cell with value amount cell with value amount cell with value amount cell with value amount cell with value amount cell with value amount cell with value amount cell with value amount cell with value amount cell with value amount cell with value amount cell with value amount cell with value amount cell with value amount cell with value amount cell with value amount cell with value amount cell with value amount cell with value amount cell with value amount cell with value amount cell with value —":
      - cell "Renamed6367 custom":
        - text: Renamed6367 custom
        - button "Redenumește subcategoria"
        - button "Șterge subcategoria custom"
      - cell "amount cell with value":
        - gridcell "amount cell with value"
      - cell "amount cell with value":
        - gridcell "amount cell with value"
      - cell "amount cell with value":
        - gridcell "amount cell with value"
      - cell "amount cell with value":
        - gridcell "amount cell with value"
      - cell "amount cell with value":
        - gridcell "amount cell with value"
      - cell "amount cell with value":
        - gridcell "amount cell with value"
      - cell "amount cell with value":
        - gridcell "amount cell with value"
      - cell "amount cell with value":
        - gridcell "amount cell with value"
      - cell "amount cell with value":
        - gridcell "amount cell with value"
      - cell "amount cell with value":
        - gridcell "amount cell with value"
      - cell "amount cell with value":
        - gridcell "amount cell with value"
      - cell "amount cell with value":
        - gridcell "amount cell with value"
      - cell "amount cell with value":
        - gridcell "amount cell with value"
      - cell "amount cell with value":
        - gridcell "amount cell with value"
      - cell "amount cell with value":
        - gridcell "amount cell with value"
      - cell "amount cell with value":
        - gridcell "amount cell with value"
      - cell "amount cell with value":
        - gridcell "amount cell with value"
      - cell "amount cell with value":
        - gridcell "amount cell with value"
      - cell "amount cell with value":
        - gridcell "amount cell with value"
      - cell "amount cell with value":
        - gridcell "amount cell with value"
      - cell "amount cell with value":
        - gridcell "amount cell with value"
      - cell "amount cell with value":
        - gridcell "amount cell with value"
      - cell "amount cell with value":
        - gridcell "amount cell with value"
      - cell "amount cell with value":
        - gridcell "amount cell with value"
      - cell "amount cell with value":
        - gridcell "amount cell with value"
      - cell "amount cell with value":
        - gridcell "amount cell with value"
      - cell "amount cell with value":
        - gridcell "amount cell with value"
      - cell "amount cell with value":
        - gridcell "amount cell with value"
      - cell "amount cell with value":
        - gridcell "amount cell with value"
      - cell "amount cell with value":
        - gridcell "amount cell with value"
      - cell "—"
    - row "Adaugă subcategorie":
      - cell "Adaugă subcategorie":
        - button "Adaugă subcategorie"
      - cell
      - cell
      - cell
      - cell
      - cell
      - cell
      - cell
      - cell
      - cell
      - cell
      - cell
      - cell
      - cell
      - cell
      - cell
      - cell
      - cell
      - cell
      - cell
      - cell
      - cell
      - cell
      - cell
      - cell
      - cell
      - cell
      - cell
      - cell
      - cell
      - cell
      - cell
    - row "▶ INVESTITII — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — —":
      - cell "▶ INVESTITII"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
      - cell "—"
```

# Test source

```ts
   23 |     await expect(this.page.getByTestId(LUNAR_GRID_TEST_DATA.GRID_ELEMENTS.CONTAINER)).toBeVisible();
   24 |   }
   25 |
   26 |   /**
   27 |    * Expandează o categorie aleatoare și returnează numele ei
   28 |    */
   29 |   async expandRandomCategory(): Promise<string> {
   30 |     // Obține toate categoriile disponibile
   31 |     const categoryKeys = Object.keys(CATEGORIES);
   32 |     const randomCategoryKey = categoryKeys[Math.floor(Math.random() * categoryKeys.length)];
   33 |     
   34 |     console.log(`🎯 Expandez categoria: ${randomCategoryKey}`);
   35 |     
   36 |     // Click pe butonul de expandare pentru categoria selectată
   37 |     const expandButton = this.page.getByTestId(`toggle-category-${randomCategoryKey}`);
   38 |     await expect(expandButton).toBeVisible();
   39 |     await expandButton.click();
   40 |     
   41 |     // Așteaptă să se expandeze categoria
   42 |     await this.page.waitForTimeout(1000);
   43 |     
   44 |     return randomCategoryKey;
   45 |   }
   46 |
   47 |   /**
   48 |    * Adaugă o subcategorie nouă cu nume random în categoria specificată
   49 |    */
   50 |   async addRandomSubcategory(categoryKey: string): Promise<string> {
   51 |     // Generează un nume random pentru subcategorie
   52 |     const randomName = `TestSub${Math.floor(Math.random() * 10000)}`;
   53 |     
   54 |     console.log(`🔹 Adaug subcategoria: ${randomName} în categoria ${categoryKey}`);
   55 |     
   56 |     // Click pe butonul de adăugare subcategorie
   57 |     const addButton = this.page.getByTestId(`add-subcategory-${categoryKey}`);
   58 |     await expect(addButton).toBeVisible();
   59 |     await addButton.click();
   60 |     
   61 |     // Completează numele subcategoriei
   62 |     const input = this.page.getByTestId(`new-subcategory-input-${categoryKey}`);
   63 |     await expect(input).toBeVisible();
   64 |     await input.fill(randomName);
   65 |     
   66 |     // Salvează subcategoria
   67 |     const saveButton = this.page.getByTestId(`save-subcategory-${categoryKey}`);
   68 |     await saveButton.click();
   69 |     
   70 |     // Așteaptă să se salveze
   71 |     await this.page.waitForTimeout(1000);
   72 |     
   73 |     return randomName;
   74 |   }
   75 |
   76 |   /**
   77 |    * Redenumește o subcategorie cu un nume nou random
   78 |    */
   79 |   async renameSubcategory(oldName: string): Promise<string> {
   80 |     const newName = `Renamed${Math.floor(Math.random() * 10000)}`;
   81 |     
   82 |     console.log(`✏️ Redenumesc subcategoria de la ${oldName} la ${newName}`);
   83 |     
   84 |     // Click pe butonul de editare
   85 |     const editButton = this.page.getByTestId(`edit-subcategory-btn-${oldName}`);
   86 |     await expect(editButton).toBeVisible();
   87 |     await editButton.click();
   88 |     
   89 |     // Modifică numele în input
   90 |     const input = this.page.getByTestId(`edit-subcategory-input-${oldName}`);
   91 |     await expect(input).toBeVisible();
   92 |     await input.fill(newName);
   93 |     
   94 |     // Salvează modificarea
   95 |     const saveButton = this.page.getByTestId(`save-edit-subcategory-${oldName}`);
   96 |     await saveButton.click();
   97 |     
   98 |     // Așteaptă să se salveze
   99 |     await this.page.waitForTimeout(1000);
  100 |     
  101 |     return newName;
  102 |   }
  103 |
  104 |   /**
  105 |    * Adaugă o tranzacție în subcategorie cu date random
  106 |    */
  107 |   async addRandomTransactionInSubcategory(categoryKey: string, subcategoryName: string): Promise<{ day: number, amount: string, description: string }> {
  108 |     // Generează ziua aleatoare (1-28 pentru siguranță)
  109 |     const randomDay = Math.floor(Math.random() * 28) + 1;
  110 |     
  111 |     // Generează suma aleatoare
  112 |     const randomAmount = (Math.random() * 500 + 10).toFixed(2); // între 10 și 510
  113 |     
  114 |     // Generează descriere aleatoare
  115 |     const descriptions = ['Cumpărături test', 'Plată servicii', 'Cheltuială necesară', 'Achiziție planificată'];
  116 |     const randomDescription = descriptions[Math.floor(Math.random() * descriptions.length)];
  117 |     
  118 |     console.log(`💰 Adaug tranzacție: ${randomAmount} RON în ${subcategoryName} pe ziua ${randomDay}`);
  119 |     
  120 |     // Click pe celula specifică
  121 |     const cellTestId = `cell-${categoryKey}-${subcategoryName}-${randomDay}`;
  122 |     const cell = this.page.getByTestId(cellTestId);
> 123 |     await expect(cell).toBeVisible();
      |                        ^ Error: Timed out 5000ms waiting for expect(locator).toBeVisible()
  124 |     await cell.click();
  125 |     
  126 |     // Așteaptă popover-ul să apară
  127 |     const amountInput = this.page.getByTestId('cell-amount-input');
  128 |     await expect(amountInput).toBeVisible();
  129 |     
  130 |     // Completează suma
  131 |     await amountInput.fill(randomAmount);
  132 |     
  133 |     // Dacă există câmp pentru descriere, îl completăm
  134 |     const descriptionInput = this.page.getByTestId('cell-description-input').first();
  135 |     if (await descriptionInput.isVisible()) {
  136 |       await descriptionInput.fill(randomDescription);
  137 |     }
  138 |     
  139 |     // Salvează tranzacția
  140 |     await this.page.getByTestId('cell-save-btn').click();
  141 |     
  142 |     // Așteaptă să se închidă popover-ul
  143 |     await this.page.waitForTimeout(1000);
  144 |     
  145 |     return { day: randomDay, amount: randomAmount, description: randomDescription };
  146 |   }
  147 |
  148 |   /**
  149 |    * Adaugă o tranzacție recurentă cu date random
  150 |    */
  151 |   async addRandomRecurringTransaction(categoryKey: string, subcategoryName: string): Promise<{ day: number, amount: string, description: string }> {
  152 |     const randomDay = Math.floor(Math.random() * 28) + 1;
  153 |     const randomAmount = (Math.random() * 200 + 50).toFixed(2);
  154 |     const recurringDescriptions = ['Abonament lunar', 'Plată recurentă', 'Serviciu periodic', 'Cheltuială fixă'];
  155 |     const randomDescription = recurringDescriptions[Math.floor(Math.random() * recurringDescriptions.length)];
  156 |     
  157 |     console.log(`🔄 Adaug tranzacție recurentă: ${randomAmount} RON în ${subcategoryName} pe ziua ${randomDay}`);
  158 |     
  159 |     // Click pe celula specifică
  160 |     const cellTestId = `cell-${categoryKey}-${subcategoryName}-${randomDay}`;
  161 |     const cell = this.page.getByTestId(cellTestId);
  162 |     await expect(cell).toBeVisible();
  163 |     await cell.click();
  164 |     
  165 |     // Așteaptă popover-ul
  166 |     const amountInput = this.page.getByTestId('cell-amount-input');
  167 |     await expect(amountInput).toBeVisible();
  168 |     await amountInput.fill(randomAmount);
  169 |     
  170 |     // Setează ca recurentă (dacă există opțiunea)
  171 |     const recurringCheckbox = this.page.getByTestId('cell-recurring-checkbox');
  172 |     if (await recurringCheckbox.isVisible()) {
  173 |       await recurringCheckbox.check();
  174 |     }
  175 |     
  176 |     // Completează descrierea
  177 |     const descriptionInput = this.page.getByTestId('cell-description-input').first();
  178 |     if (await descriptionInput.isVisible()) {
  179 |       await descriptionInput.fill(randomDescription);
  180 |     }
  181 |     
  182 |     // Salvează
  183 |     await this.page.getByTestId('cell-save-btn').click();
  184 |     await this.page.waitForTimeout(1000);
  185 |     
  186 |     return { day: randomDay, amount: randomAmount, description: randomDescription };
  187 |   }
  188 |
  189 |   /**
  190 |    * Șterge o tranzacție prin double-click și modal
  191 |    */
  192 |   async deleteTransactionFromCell(categoryKey: string, subcategoryName: string, day: number): Promise<void> {
  193 |     console.log(`🗑️ Șterg tranzacția din ${subcategoryName} pe ziua ${day}`);
  194 |     
  195 |     const cellTestId = `cell-${categoryKey}-${subcategoryName}-${day}`;
  196 |     const cell = this.page.getByTestId(cellTestId);
  197 |     await expect(cell).toBeVisible();
  198 |     
  199 |     // Double-click pentru modal detalii
  200 |     await cell.dblclick();
  201 |     
  202 |     // Așteaptă modalul să apară și click pe delete
  203 |     const deleteButton = this.page.getByTestId('quick-add-delete-button');
  204 |     await expect(deleteButton).toBeVisible();
  205 |     await deleteButton.click();
  206 |     
  207 |     // Confirmă ștergerea dacă există dialog de confirmare
  208 |     const confirmButton = this.page.getByText('Confirmă');
  209 |     if (await confirmButton.isVisible()) {
  210 |       await confirmButton.click();
  211 |     }
  212 |     
  213 |     await this.page.waitForTimeout(1000);
  214 |   }
  215 |
  216 |   /**
  217 |    * Șterge subcategoria custom din tabel
  218 |    */
  219 |   async deleteCustomSubcategory(subcategoryName: string): Promise<void> {
  220 |     console.log(`🗑️ Șterg subcategoria custom: ${subcategoryName}`);
  221 |     
  222 |     const deleteButton = this.page.getByTestId(`delete-subcategory-btn-${subcategoryName}`);
  223 |     await expect(deleteButton).toBeVisible();
```
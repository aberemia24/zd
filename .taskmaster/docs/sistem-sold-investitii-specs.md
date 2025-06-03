# 💰 SISTEM SOLD ȘI INVESTIȚII - SPECIFICAȚII COMPLETE

*Data: 29 Ianuarie 2025*
*Context: Discussie post Task #2*
*Status: CLARIFICAT*

## 📋 SUMAR EXECUTIV

Definirea completă a sistemului de sold zilnic cu tratare specială pentru investiții și economisiri. Sistemul permite planificarea financiară cu vizibilitate asupra soldului real din cont vs activele accumulate.

---

## 🎯 FUNCȚIONALITATE PRINCIPALĂ

### **SOLD ZILNIC CUMULATIV:**
```
Sold Initial (configurabil) 
↓
+ Venituri zilnice
- Cheltuieli pure (roșu)
- Investiții (albastru) ← ies din cont dar rămân active
- Economisiri (verde) ← ies din cont dar rămân în posesie
= Sold rămas în cont la sfârșitul zilei
```

### **FLOW FINANCIAR:**
1. **Ziua 1**: Utilizatorul setează sold inițial (ex: 5000 RON)
2. **Ziua 5**: Investiție -1000 RON → Sold cont: 4000 RON
3. **Ziua 10**: Economisire -500 RON → Sold cont: 3500 RON
4. **Ziua 15**: Cheltuială pură -200 RON → Sold cont: 3300 RON

---

## 🎨 VIZUALIZARE ȘI CULORI

### **CULORI CATEGORII (EXISTENTE):**
- 🔴 **Cheltuieli pure**: Roșu (consumate definitiv)
- 🔵 **Investiții**: Albastru (active păstrate) - DEJA IMPLEMENTAT
- 🟢 **Economisiri**: Verde (bani păstrați)
- 🟢 **Venituri**: Verde

### **DECIZIE CONFIRMATĂ:**
✅ Păstrăm culorile existente (albastru investiții)
✅ Nu modificăm sistemul de culori actual

---

## 📊 RAPOARTE ȘI ANALIZĂ

### **SEPARARE ÎN RAPOARTE:**
```
📈 CHELTUIELI PURE vs ACTIVE ACCUMULATE

Cheltuieli Pure (consumate):
- Mâncare: 800 RON
- Facturi: 600 RON
- Transport: 300 RON
Total: 1700 RON

Active Accumulate (păstrate):
- Investiții: 2000 RON
- Economisiri: 1500 RON
Total: 3500 RON

Net Cash Flow: -5200 RON
Sold rămas în cont: 4800 RON
```

### **BENEFICII RAPORTARE:**
- Vizibilitate asupra banilor "pierduți" vs "investiți"
- Planning mai bun pentru cash flow
- Înțelegere clară a sănătății financiare

---

## 🔄 TRATAREA RECUPERĂRII INVESTIȚIILOR

### **PRINCIPIU CONFIRMAT:**
❌ **NU există sistem automat de recuperare**
✅ **Utilizatorul adaugă manual ca VENITURI când scoate din investiții**

### **EXEMPLU FLOW:**
1. **Luna 1**: Investiție crypto -1000 RON (albastru)
2. **Luna 3**: Vinde crypto → adaugă manual +1200 RON (verde, ca venit)
3. **Rezultat**: Profit 200 RON vizibil în rapoarte

### **AVANTAJE ABORDARE MANUALĂ:**
- Control total asupra utilizatorului
- Flexibilitate pentru investiții parțiale
- Tracking clar al profiturilor/pierderilor
- Simplicitate implementare

---

## ⚙️ IMPLEMENTARE TEHNICĂ

### **COMPONENTE NECESARE:**
1. **Settings modul**: Sold inițial + data start
2. **Calculator sold**: Logică cumulativă zilnică
3. **Display sold**: Coloană nouă în grid
4. **Alerting**: Sold negativ warnings
5. **Transfer luni**: Automat sold final → sold inițial luna următoare

### **INTEGRĂRI EXISTENTE:**
- ✅ Categorii cu culori (albastru investiții DEJA implementat)
- ✅ CVA system pentru styling
- ✅ Shared-constants pentru texte
- ✅ Store-uri pentru state management

---

## 🚨 EDGE CASES IDENTIFICATE

### **SOLD NEGATIV:**
- ✅ Permis + alertă vizuală
- ⚠️ Warning styling (roșu, bold)
- 💡 Sugestii optimizare planning

### **TRANSFER ÎNTRE LUNI:**
- ✅ Automat: ultima zi luna curentă → prima zi luna următoare
- 📅 Configurat via Settings per grid
- 🔄 Update automat la schimbarea lunii

### **CONTURI MULTIPLE:**
- 📝 Temporar în Settings/Options
- ➕ Adăugare pe modelul CategoryEditor
- 🧮 Suma totală devine sold în grid
- 🎯 Limite configurabile per cont

---

## 📋 TASK-URI URMĂTOARE IDENTIFICATE

### **TASK NOU PRIORITAR:**
**"Sistem Sold Inițial și Calculator Zilnic"**
- Settings pentru sold inițial
- Calculator logică cumulativă
- Display coloană sold în grid
- Alerting sold negativ
- Transfer automat între luni

### **TASK VIITOR:**
**"Manager Conturi Multiple"**
- Interfață pe modelul CategoryEditor
- Tracking conturi separate, poti adauga mai multe conturi, inclusiv cash etc. poate punem o limita eventual. 
La final toate aceste onturi se aduna iar suma lor devine soldul in grid. 
- Suma totală în grid

┌─────────────────────────────────┐
│ 💰 Configurare Sold Inițial    │
├─────────────────────────────────┤
│ Sold cont principal: [5000] RON │
│ Data început:       [  1  ] ▼   │
│ Luna/An:           [Ian 2025] ▼ │
│                                 │
│ [Salvează] [Anulează]          │
└─────────────────────────────────┘

┌─────────────────────────────────────────┐
│ 💳 Gestionare Conturi                  │
├─────────────────────────────────────────┤
│ ✅ Cont Curent BCR     | 3,500.00 RON   │
│ ✅ Cash Portofel      |   500.00 RON   │
│ ✅ Economii ING       | 10,000.00 RON  │
│ ❌ Card Revolut       |     0.00 RON   │
│                                         │
│ Total sold disponibil: 14,000.00 RON   │
│                                         │
│ [+ Adaugă Cont] [Exportă Lista]        │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│ 📅 Configurare Sold Luna Ian 2025      │
├─────────────────────────────────────────┤
│ Sold total conturi: 14,000.00 RON      │ <- Din conturi
│ Data începere:     [15] ▼ Ianuarie     │ <- Configurabil  
│                                         │
│ ✅ Transfer automat din Dec 2024        │
│ Sold anterior:     13,450.00 RON       │
│                                         │
│ [Confirmă] [Resetează la conturi]      │
└─────────────────────────────────────────┘

                     15   16   17   18   19   20  ...
Venituri            +0  +3000  +0    +0   +0   +0  ...
Cheltuieli         -200  -150 -300  -100 -500 -50  ...
Sold disponibil   13800 16650 16350 16250 15750 15700 ...
                  🟢    🟢    🟢    🟢    🟢    🟢


                     28   29   30   31
Sold disponibil    -150  -200 -300  -500
                   🔴⚠️  🔴⚠️  🔴⚠️  🔴⚠️
                   
Tooltip: "Atenție: Sold negativ! Verifică tranzacțiile."


ACCOUNT_MANAGEMENT: {
  TITLE: 'Gestionare Conturi',
  ADD_ACCOUNT: 'Adaugă Cont Nou',
  EDIT_ACCOUNT: 'Editează Cont', 
  DELETE_ACCOUNT: 'Șterge Cont',
  ACCOUNT_TYPES: {
    BANK: 'Cont bancar',
    CASH: 'Numerar',
    INVESTMENT: 'Investiții', 
    OTHER: 'Altele'
  },
  TOTAL_BALANCE: 'Total sold disponibil',
  MAX_ACCOUNTS_REACHED: 'Maxim 10 conturi permise'
},

MONTHLY_BALANCE: {
  SETUP_TITLE: 'Configurare Sold Luna',
  START_DATE: 'Data începere planificare',
  INITIAL_BALANCE: 'Sold inițial',
  AUTO_TRANSFER: 'Transfer automat din luna anterioară',
  CONFIRM_SETUP: 'Confirmă configurarea',
  DAILY_BALANCE_ROW: 'Sold disponibil'
},
Constante necesare (să adaug în shared-constants):

BALANCE_WARNINGS: {
  NEGATIVE_BALANCE: 'Atenție: Sold negativ!',
  LOW_BALANCE: 'Atenție: Sold scăzut!',
  CHECK_TRANSACTIONS: 'Verifică tranzacțiile.'
}


 PROBLEMA IDENTIFICATĂ:
Investițiile = Banii "ies" din cont DAR rămân ca active
Economisirile = Banii "ies" din cont DAR rămân în posesie
Cheltuielile pure = Banii "ies" și sunt consumați definitiv
💡 PROPUNERE SOLUȚIE HIBRIDĂ:
✅ INCLUDEM în calculul soldului (banii chiar ies din cont)
- Sold ziua 1: 5000 RON
- Investiție ziua 5: -1000 RON → Sold rămas: 4000 RON
- Economisire ziua 10: -500 RON → Sold rămas: 3500 RON

2. Pentru Categorii și Vizualizare:
📊 MARCĂM SPECIAL cu tipuri distincte:
- 🔴 Cheltuieli pure (mâncare, facturi, etc.)
- 🟡 Investiții (crypto, acțiuni, etc.) 
- 🟢 Economisiri (depozite, cash reserves, etc.)

3. Pentru Flexibilitate:
⚙️ OPȚIUNI în Settings:
□ Include investițiile în calculul soldului
□ Include economisirile în calculul soldului
□ Afișează doar "cheltuielile pure" în overview


 Vrei să vezi separat "cheltuieli pure" vs "active accumulate"?
Recuperare: Vrei opțiunea să "recuperezi" investițiile/economisirile mai târziu?
Categorii default: Vrei categorii pre-populate pentru investiții comune?
Ce părere ai despre această abordare? Să dezvoltăm mai mult partea de categorii sau să ne concentrăm pe calculul soldului?
da , avem deja culori diferite sunt cu albastru investitiile, poate mai discutam si asta dar poate ramande asa for now.

in rapoarte ar fi bine sa fie diferite, da

nu vreau sa recuperez nimic, poate sa le pune la venituri cand le scoate din investitii,

1. Culori și Vizualizare:
🔵 Investiții = ALBASTRU (deja implementat)
🔴 Cheltuieli = ROȘU (deja implementat)
🟢 Venituri = VERDE (deja implementat)

2. Calculul Soldului:
Sold zilnic = Sold inițial + Σ(Venituri) - Σ(Cheltuieli) - Σ(Investiții)
- Investiț

CLARIFICĂRI CONFIRMATE:
💰 Tratarea Investițiilor:
✅ Scad din sold zilnic (banii chiar ies din cont)
✅ Albastru în grid (deja implementat)
✅ Separate în rapoarte ca "active accumulate"
❌ Fără recuperare automată - manual ca venituri
📊 Rapoarte:
🔴 Cheltuieli pure vs 🔵 Active accumulate (investiții + economisiri)
📈 Vizibilitate clară bani "pierduți" vs "investiți"
⚙️ Funcționalități:
✅ Sold negativ permis + alertă vizuală
🔄 Transfer automat între luni
📅 Data start configurabilă
🏦 Conturi multiple (temporar în Settings)


# Task ID: 10
# Title: Sistem Sold Inițial și Calcul Continuu
# Status: pending
# Dependencies: 1, 2
# Priority: high
# Description: Implementare sistem complet de sold cu calcul zilnic cumulativ, gestionare conturi multiple, transfer automat între luni și tratare specială pentru investiții/economisiri
# Details:
Sistem complet de sold care include: sold inițial configurabil per cont, calcul automat zilnic cumulativ, transfer automat sold final → sold inițial luna următoare, data start configurabilă, gestionare conturi multiple cu sumă totală, alerting pentru sold negativ, și tratare diferențiată pentru investiții (albastru) și economisiri (verde) care scad din sold dar sunt separate în rapoarte.

# Test Strategy:
Test propagare sold zilnic, recalcul la modificări tranzacții, transfer automat între luni, alerting sold negativ, funcționalitate conturi multiple, și separare corectă investiții/economisiri în rapoarte.

# Subtasks:
## 10.1. Creează shared-constants pentru sold [pending]
### Dependencies: None
### Description: Adăugare constante UI pentru sistemul de sold în shared-constants/ui.ts
### Details:
În shared-constants/ui.ts, după LUNAR_GRID, adaugă BALANCE_SYSTEM cu: INITIAL_BALANCE, DAILY_BALANCE, STARTING_DATE, ACCOUNT_NAME, ADD_ACCOUNT, TOTAL_BALANCE, BALANCE_WARNING, CONFIGURE_BALANCE, NEGATIVE_BALANCE_ALERT

## 10.2. Adaugă enums pentru balance [pending]
### Dependencies: None
### Description: Creează enums pentru tipuri de alertă și conturi în shared-constants/enums.ts
### Details:
În shared-constants/enums.ts adaugă: BalanceAlertType (NEGATIVE, LOW, NORMAL) și AccountType (CHECKING, SAVINGS, CASH, CREDIT)

## 10.3. Creează types pentru balance system [pending]
### Dependencies: None
### Description: Implementare types TypeScript pentru sistemul de sold în frontend/src/types/balance.ts
### Details:
Creează types: Account, DailyBalance, BalanceCalculation, BalanceSettings cu toate proprietățile necesare pentru gestionarea soldului și conturilor

## 10.4. Creează balance store [pending]
### Dependencies: None
### Description: Implementare Zustand store pentru gestionarea stării sistemului de sold
### Details:
Creează frontend/src/stores/balanceStore.ts cu: state pentru accounts/settings/dailyBalances, actions pentru CRUD accounts, calculare sold, helpers pentru total balance și reset, persistență cu zustand/persist

## 10.5. Creează balance calculator hook [pending]
### Dependencies: None
### Description: Implementare hook pentru calcularea soldului zilnic cu logică de categorii speciale
### Details:
Creează frontend/src/hooks/useBalanceCalculator.ts care calculează sold zilnic: sold inițial + venituri - cheltuieli - investiții(albastru) - economisiri(verde), cu alerting pentru sold negativ

## 10.6. Adaugă coloană balance în grid [pending]
### Dependencies: None
### Description: Integrare coloană sold în grid-ul principal LunarGrid cu formatare și culori
### Details:
În useLunarGridTable.ts: import useBalanceCalculator, adaugă columnHelper.accessor pentru balance cu formatare monetară, culori roșu bold pentru negativ, text-center pentru afișare

## 10.7. Integrează în LunarGrid principal [pending]
### Dependencies: None
### Description: Adăugare alertă vizuală pentru sold negativ în componenta principală LunarGrid
### Details:
În LunarGridTanStack.tsx: import useBalanceCalculator, adaugă alertă vizuală înainte de tabel pentru hasNegativeBalance cu styling roșu, iconiță atenționare și mesaj din constants

## 10.8. Settings modul pentru configurare sold inițial [pending]
### Dependencies: None
### Description: Implementare interfață în Settings pentru configurarea soldului inițial per cont și data de start a lunii
### Details:
Adăugare în Settings/Options: câmpuri pentru sold inițial per cont, selector data start luna (nu obligatoriu ziua 1), salvare în localStorage/storage persistent

## 10.9. Gestionare conturi multiple în Settings [pending]
### Dependencies: None
### Description: Implementare editor conturi multiple pe modelul CategoryEditor cu limite și validări
### Details:
Component similar CategoryEditor pentru adăugare/editare/ștergere conturi, validări nume unic, limite rezonabile număr conturi, interfață intuitivă

## 10.10. Transfer automat sold între luni [pending]
### Dependencies: None
### Description: Implementare transfer automat sold final ultima zi → sold inițial prima zi luna următoare
### Details:
Logică automată: la schimbarea lunii, soldul final din ultima zi a lunii precedente devine sold inițial pentru prima zi a lunii curente, respectând data start configurată

## 10.11. Integrare sistem sold cu rapoarte existente [pending]
### Dependencies: None
### Description: Modificare rapoarte pentru separarea cheltuielilor pure de activele accumulate (investiții + economisiri)
### Details:
Update rapoarte să separe: cheltuieli pure (categorii normale) vs active accumulate (investiții + economisiri), păstrare funcționalitate existentă, adăugare secțiuni noi pentru claritate


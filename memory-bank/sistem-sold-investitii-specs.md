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
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
- Tracking conturi separate
- Suma totală în grid

Să continuăm cu task-urile existente sau să prioritizăm acest sistem de sold? 
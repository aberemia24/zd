# LunarGrid Master Plan - Planificare Financiară Avansată

## Viziunea Aplicației

### Schimbarea paradigmei
🔄 **DE LA**: Tracking financiar retrospectiv (ce s-a întâmplat)  
🔄 **LA**: Planificare financiară predictivă (ce se va întâmpla)

### Obiectivul principal
**Să știi în fiecare zi câți bani vei avea** - nu doar câți ai cheltuit, ci câți vei avea în viitor pe baza planificării tale.
NU ESTE INTENTIONAT PENTRU MOBILE USE, WEB USE ONLY sa fie cat mai bun acolo. 

### Workflow-ul utilizatorului țintă
1. **Introducerea veniturilor**: toate veniturile cunoscute (salarii, chirii, venituri ocazionale)
2. **Estimarea cheltuielilor**: toate cheltuielile planificate pentru luna/anul respectiv
3. **Planificarea economiilor**: ce economii doresc să facă din banii rămași
4. **Vizualizarea soldurilor**: în fiecare zi să vadă soldurile prezente și viitoare

---

## Analiza Situației Curente

### ✅ Ce funcționează deja
- Tabelul cu categorii colapsabile și subcategorii
- Afișarea tranzacțiilor corespunzătoare subcategoriilor și datelor
- Total pe categorii/zi
- Butoane expand/collapse pentru toate categoriile
- Schimbarea lunii
- Header cu zilele lunii
- Sincronizare cu alte componente (modificările se reflectă peste tot)

### ❌ Probleme critice identificate
- **Calculul soldului este incorect**: adună toate sumele indiferent de tip (venit/cheltuială)
- Lipsa diferențierii între venituri (+) și cheltuieli (-)
- Nu se propagă modificările către zilele următoare
- Lipsa tratării corecte a economiilor
- categoriile nu se pot expanda individual

### 🔧 Limitări actuale UX
- Nu poți expanda/collapsa categorii individual
- Coloana subcategoriilor nu e sticky (se pierde la scroll orizontal)
- Nu poți adăuga/șterge/edita subcategorii direct din tabel
- Lipsa modurilor de afișare (normal/wide/fullscreen)

---

## Planul de Implementare Detaliat

### FAZA 1: Fundamentele Corecte (CRITICĂ) - 5-7 zile

#### 1.1 Calculul corect al soldului zilnic
**Problema**: Algoritm incorect de calcul care nu diferențiază tipurile de tranzacții
**Soluția**: 
```typescript

};

```

**Fișiere afectate**:
- `frontend/src/hooks/useLunarGridCalculations.ts` (nou)
- `frontend/src/components/features/LunarGrid/LunarGridTanStack.tsx`

#### 1.2 Navegarea avansată în tabel
**Problema**: Funcționalitate limitată de navigare și vizualizare
**Soluția**:
- Expand/collapse individual pentru categorii folosind TanStack row expansion API
- Sticky columns folosind TanStack built-in functionality
- Moduri de afișare prin CSS classes și state management


#### 2.1 Managementul subcategoriilor în tabel
**Funcționalități noi**:
- Buton "+" sub ultima subcategorie pentru adăugare rapidă
- Limitare la 5 subcategorii cu validare vizuală
- Ștergere cu confirmarea și verificare dependențe
- Redenumire inline cu validare

**Implementare**:
```typescript
// Component pentru managementul subcategoriilor
const SubcategoryManager = ({ categoryId, subcategories, onAdd, onDelete, onRename }) => {
  const canAddMore = subcategories.length < 5;
  
  return (
    <div className="subcategory-list">
      {subcategories.map(sub => (
        <SubcategoryRow key={sub.id} subcategory={sub} onDelete={onDelete} onRename={onRename} />
      ))}
      {canAddMore && <AddSubcategoryButton onClick={onAdd} />}
      {!canAddMore && <MaxLimitMessage />}
    </div>
  );
};
```

#### 2.2 Interacțiunea cu celulele
**Single Click Modal**:
**Double Click Inline Edit**
#### 2.3 Îmbunătățiri design
**Header complet cu context temporal*


### FAZA 3: Features Avansate (AVANSATĂ) - 10-15 zile

#### 3.1 Recurența și planificarea automată
#### 3.2 Navigarea cu tastatura (Excel-like)
**Implementare sistem de selecție celule**:
#### 3.3 Multi-selecție și operațiuni bulk
**Implementare selecție range**:
`
### FAZA 4: Integrarea cu Modulele Existente (INTEGRARE) - 3-5 zile

#### 4.1 Sincronizarea cu tracking-ul zilnic

#### 5.1 Virtualization pentru performanță




---



### Hook-uri specializate noi

### Integrarea cu React Query


## Rafinări Suplimentare și Detalii de Implementare

### Definirea Constantelor și Enumerărilor

Fișierul `shared-constants/lunarGrid.ts` va conține toate definițiile centralizate:

### Strategia Detaliată pentru Economii

#### Concepte de Bază pentru Economii
- **Economiile sunt bani alocați** pentru scopuri viitoare (vacanțe, fond de urgență, etc.)
- **Nu sunt bani "pierduți"** ci sunt încă proprietatea utilizatorului
- **Nu sunt disponibili imediat** pentru cheltuieli curente
- **Se calculează separat** în soldurile zilnice

#### Implementare Logică Economii


#### Afișarea Economiilor în Grid
- **Rând separat de economii**: La sfârșitul grid-ului, un rând special care arată totalul economiilor pe zi
- **Culoare distinctă**: Economiile vor avea o culoare neutră (albastru/gri) pentru a le diferenția
- **Tooltip explicativ**: "Acestea sunt economii planificate, nu sunt disponibile pentru cheltuieli curente"

### Obiective și Metrici de Performanță

#### Ținte de Performanță
```typescript
const PERFORMANCE_TARGETS = {
  INITIAL_LOAD: 300, // milisecunde pentru încărcarea inițială
  CELL_INTERACTION: 50, // milisecunde pentru click pe celulă
  FILTER_APPLY: 100, // milisecunde pentru aplicarea filtrelor
  MONTH_CHANGE: 200, // milisecunde pentru schimbarea lunii
  RECURRING_GENERATION: 500, // milisecunde pentru generarea tranzacțiilor recurente
  CALCULATION_REFRESH: 150 // milisecunde pentru recalcularea soldurilor
};
```

#### Strategii de Optimizare Implementate
1. **Memoizare inteligentă**: Calculele de solduri vor fi memorizate și recalculate doar când se schimbă datele relevante
2. **Debouncing**: Modificările frecvente (ca editarea inline) vor fi decelerate pentru a reduce încărcarea
3. **Lazy loading**: Datele pentru lunile viitoare vor fi încărcate doar când sunt necesare
4. **Virtualizare adaptivă**: Pentru grid-uri mari (>50 rânduri) se va activa virtualizarea automată
5. **Batching updates**: Mai multe modificări vor fi grupate într-o singură actualizare pentru a evita re-renderizările excesive

#### Măsurarea și Monitorizarea

### Avantajele Acestor Rafinări

#### Pentru Dezvoltatori
- **Consistență**: Toate definițiile sunt centralizate și unitare
- **Mentenabilitate**: Schimbările se fac într-un singur loc
- **Debuggabilitate**: Performanța poate fi monitorizată și optimizată

#### Pentru Utilizatori
- **Claritate vizuală**: Informațiile sunt prezentate clar și consistent
- **Diferențiere logică**: Economiile sunt separate de banii disponibili
- **Experiență fluidă**: Aplicația funcționează rapid și fără întârzieri
- **Feedback vizual**: Indicatorii și culorile ajută la înțelegerea rapidă a datelor

---

## Timeline și Prioritizare

### Roadmap recomandat
1. **Săptămâna 1-2**: Calculul corect al soldului și navigarea de bază
2. **Săptămâna 3-4**: Managementul subcategoriilor și interacțiunea cu celulele
3. **Săptămâna 5-7**: Features avansate de navigare și operațiuni bulk
4. **Săptămâna 8**: Integrarea cu modulele existente
5. **Săptămâna 9**: Optimizări și mobile support

### Criteriile de succes
- ✅ Calculele soldurilor sunt 100% corecte în toate scenariile
- ✅ Utilizatorul poate naviga fluid prin tabel cu mouse și tastatură
- ✅ Adăugarea/editarea tranzacțiilor este rapidă și intuitivă
- ✅ Tranzacțiile recurente se propagă corect
- ✅ Aplicația rămâne performantă cu volume mari de date
- ✅ Designul inspiră încredere și profesionalism

---

## Riscuri și Mitigări

### Riscuri tehnice identificate
1. **Complexitatea calculelor**: Logica de solduri cumulative poate deveni complexă
   - *Mitigare*: Teste extensive și validări matematice
2. **Performanța**: Multe celule și calcule în timp real
   - *Mitigare*: Virtualization și optimizări
3. **Sincronizarea**: Integrarea cu modulele existente
   - *Mitigare*: Design API-ului cu backwards compatibility

### Riscuri UX identificate
1. **Learning curve**: Features noi complex de învățat
   - *Mitigare*: Onboarding progresiv și tooltips utile
2. **Mobile experience**: Grid-ul poate fi dificil pe mobile
   - *Mitigare*: Design responsive și gesturi intuitive

---

## Considerații Speciale

### Performanța și Scalabilitatea
- **Virtualization**: Pentru lunile cu multe subcategorii (>50)
- **Debounced updates**: Pentru a nu suprasolicita API-ul
- **Memoizare**: Pentru calculele complexe de solduri
- **Lazy loading**: Pentru datele din lunile viitoare

### UX și Accesibilitate
- **Keyboard navigation**: Suport complet pentru utilizatorii care preferă tastatura
- **Screen readers**: Atribute ARIA pentru accesibilitate
- **Mobile-first**: Design responsive cu gesturi touch intuitive
- **Error handling**: Feedback clar pentru utilizatori la erori

### Integrarea cu Ecosistemul Existent
- **Shared constants**: Toate constantele în shared-constants/lunarGrid.ts
- **React Query**: Consistency cu pattern-urile existente
- **Design system**: Utilizarea componentelor primitive existente
- **State management**: Integrare cu Zustand stores existente

---

*Acest master plan servește ca ghid complet pentru transformarea LunarGrid într-un instrument profesional de planificare financiară predictivă.* 
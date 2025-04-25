# Tech User Story: Implementarea Managementului Stării cu Zustand

## Status: În IMPLEMENTARE (25.04.2025)
- [x] Setup și structură inițială
- [x] Implementare store tranzacții
- [x] Testare store tranzacții
- [ ] Migrare funcționalități din hooks în store
- [ ] Integrare în componente
- [ ] Testare integrare și performanță

## Titlu
Implementarea unui sistem centralizat de gestionare a stării aplicației utilizând Zustand pentru BudgetApp

## Context și Motivație
Aplicația BudgetApp are în prezent o arhitectură bazată pe custom hooks pentru gestionarea stării, care funcționează bine pentru complexitatea actuală, dar care va deveni dificil de menținut pe măsură ce aplicația crește. Pentru a facilita extinderea cu funcționalități de planificare bugetară avansată, vizualizări multiple și proiecții financiare, este necesară adoptarea unei soluții centralizate de state management.

## Obiective
- Implementarea Zustand ca soluție de state management
- Migrarea stării din custom hooks în store-uri Zustand
- Păstrarea avantajelor arhitecturii existente, inclusiv testabilitatea
- Adoptarea unei abordări incrementale, începând cu un store pentru tranzacții

## Cerințe tehnice
### 1. Setup și structură inițială
#### 1.1 Configurarea dependențelor
- Adăugarea Zustand ca dependență în proiect
- Configurarea tipurilor TypeScript pentru Zustand
- Asigurarea compatibilității cu configurarea actuală Jest pentru teste

#### 1.2 Crearea structurii de foldere
- Crearea unui folder dedicat pentru store-uri (`src/stores`)
- Organizarea pe domenii funcționale
- Stabilirea unei structuri care permite extindere ușoară

### 2. Implementarea store-ului pentru tranzacții
#### 2.1 Definirea stării și acțiunilor
- Modelarea stării pentru tranzacții, inclusiv lista de tranzacții și metadate
- Definirea acțiunilor principale (CRUD pentru tranzacții)
- Implementarea selectors pentru filtrare și derivarea stării

#### 2.2 Middleware și persistență
- Configurarea middleware-ului devtools pentru debugging
- Implementarea persistenței locale pentru recuperarea stării între sesiuni
- Definirea strategiei de invalidare cache și sincronizare

### 3. Migrarea funcționalităților din hooks în store
#### 3.1 Migrarea useTransactionData
- Transferarea logicii de fetching și caching în store
- Adaptarea interfeței pentru a menține compatibilitatea cu componentele existente
- Simplificarea hook-ului pentru a utiliza store-ul

#### 3.2 Migrarea useTransactionFilters
- Mutarea logicii de filtrare și paginare în store
- Implementarea selectors pentru derivarea listelor filtrate
- Menținerea unui API compatibil pentru tranziție graduală

#### 3.3 Migrarea useTransactionForm
- Transferarea stării formularului în store
- Adaptarea validării și procesării formularului
- Simplificarea hook-ului pentru a se concentra pe interacțiune

### 4. Integrarea în componente
#### 4.1 Adaptarea componentelor container
- Refactorizarea App.tsx pentru a utiliza Zustand
- Simplificarea transmiterii props-urilor între componente
- Eliminarea props drilling unde este posibil

#### 4.2 Optimizarea renderizărilor
- Implementarea strategiilor de memoizare pentru evitarea re-renderizărilor inutile
- Utilizarea selectivă a store-ului pentru a încărca doar datele necesare
- Monitorizarea performanței renderizărilor

## Abordare TDD
### 1. Teste pentru store-ul de tranzacții
#### 1.1 Teste pentru starea inițială
- Verificarea structurii inițiale a store-ului
- Validarea valorilor default
- Asigurarea că tipurile TypeScript sunt corecte

```typescript
// Exemplu de structură de test (fără implementare)
describe('transactionsStore', () => {
  it('are starea inițială corectă', () => {
    // Verifică structura și valorile default
  });
});
```

#### 1.2 Teste pentru acțiuni de bază (CRUD)
- Testarea adăugării unei tranzacții noi
- Testarea actualizării unei tranzacții existente
- Testarea ștergerii unei tranzacții
- Validarea integrității datelor după operațiuni

```typescript
describe('acțiuni CRUD pentru tranzacții', () => {
  it('adaugă corect o tranzacție nouă', () => {
    // Verifică că starea se actualizează corect după adăugare
  });

  it('actualizează corect o tranzacție existentă', () => {
    // Verifică modificarea corectă a unei tranzacții
  });

  it('șterge corect o tranzacție după ID', () => {
    // Verifică eliminarea tranzacției și păstrarea restului
  });
});
```

#### 1.3 Teste pentru filtrare și selectors
- Testarea funcționalității de filtrare după diverse criterii
- Verificarea paginării și sortării
- Testarea calculelor derivate (sume, statistici)

```typescript
describe('filtrare și selectors', () => {
  it('filtrează corect tranzacțiile după tip', () => {
    // Adaugă mai multe tranzacții și verifică filtrarea
  });

  it('paginează corect rezultatele', () => {
    // Verifică că paginarea funcționează ca în implementarea anterioară
  });

  it('calculează corect sumele și statisticile', () => {
    // Verifică calculele derivate din tranzacții
  });
});
```

#### 1.4 Teste pentru middleware și persistență
- Testarea persistenței stării între sesiuni
- Verificarea funcționalității devtools
- Testarea scenariilor de invalidare cache

```typescript
describe('persistență și middleware', () => {
  it('persistă corect starea între sesiuni', () => {
    // Simulează reîncărcarea aplicației și verifică recuperarea stării
  });

  it('invalidează cache-ul la schimbări majore', () => {
    // Verifică strategia de invalidare cache
  });
});
```

### 2. Teste pentru integrarea cu componentele
#### 2.1 Teste pentru compatibilitatea cu componente existente
- Verificarea că componentele existente continuă să funcționeze
- Testarea interoperabilității între hooks vechi și store-uri noi
- Validarea comportamentului în faza de tranziție

```typescript
describe('compatibilitate cu componente existente', () => {
  it('TransactionTable afișează corect datele din store', () => {
    // Renderează componenta cu store populat și verifică afișarea
  });

  it('TransactionForm salvează date în store', () => {
    // Interacționează cu formularul și verifică actualizarea store-ului
  });
});
```

#### 2.2 Teste pentru scenarii complexe de utilizare
- Testarea fluxurilor complete (adăugare, filtrare, vizualizare)
- Verificarea comportamentului cu volume mari de date
- Testarea funcționalităților specifice planificării bugetare

```typescript
describe('scenarii complexe de utilizare', () => {
  it('completează un flux complet de adăugare și filtrare', () => {
    // Simulează adăugarea unei tranzacții, apoi filtrarea și vizualizarea
  });

  it('gestionează corect volume mari de date', () => {
    // Populează cu sute de tranzacții și verifică performanța
  });
});
```

## Ordine logică de implementare

### Setup și configurare ✅
- ✅ Instalare dependențe
- ✅ Configurare structură foldere
- ✅ Adăugare tipuri TypeScript

### Dezvoltare store de bază pentru tranzacții ✅
- ✅ Scriere teste pentru starea inițială și acțiunile CRUD
- ✅ Implementare store conform testelor
- ✅ Centralizare mesaje în constants/messages.ts
- ✅ Adăugare middleware și persistență (implementat: persist + devtools pentru store-ul de tranzacții)

### Migrare funcționalități din hooks ⏹
- ✅ Începere cu useTransactionData (cel mai apropiat de conceptul de store)
- ✅ Migrare și testare useTransactionFilters în Zustand (store dedicat)
- ⏹ Finalizare cu useTransactionForm

#### Lecții și pattern-uri extrase din migrarea useTransactionFilters la Zustand
- Am folosit TDD strict: întâi test, apoi implementare, cu teste colocate și robuste.
- Toate valorile implicite și enums au fost importate din sursa de adevăr (`constants/defaults.ts`, `constants/enums.ts`).
- Store-ul folosește selectors (ca funcții) pentru performanță și testabilitate.
- Testele acoperă cazuri de inițializare, setare, paginare, reset și edge cases.
- Pentru mock-uri și testare, am respectat workaround-ul pentru Jest cu TypeScript (doar metode publice, nu proprietăți private, vezi memorii).
- A fost necesară configurarea corectă Jest/ts-jest pentru a permite testarea TypeScript modern (inclusiv tipuri avansate).
- Pattern-ul hooks→store Zustand permite eliminarea props drilling și centralizarea logicii de filtrare/paginare.


### Refactorizare componente pentru utilizarea store-ului ⏹
- ⏹ Adaptare App.tsx pentru utilizarea noului store
- ⏹ Refactorizare componentelor copil pentru a citi din store
- ⏹ Eliminarea props drilling unde este posibil
- ⏹ Optimizare renderizări și interacțiuni

### Testare integrare și performanță ⏹
- ⏹ Rulare teste end-to-end
- ⏹ Verificare compatibilitate
- ⏹ Optimizări bazate pe rezultate

## Criterii de acceptare
### Funcționalitate
- Toate funcționalitățile existente continuă să opereze corect
- Starea aplicației este gestionată eficient și centralizat
- Datele persistă între sesiuni conform așteptărilor

### Calitate cod
- Tipări TypeScript complete și precise
- Acoperire bună cu teste (minim 80%)
- Respectarea pattern-urilor și convențiilor stabilite

### Performanță
- Fără degradare vizibilă a performanței față de versiunea anterioară
- Optimizări pentru renderizări selective
- Gestionare eficientă a memoriei

### Extensibilitate
- Structură care facilitează adăugarea de noi funcționalități
- Documentație clară pentru extinderea store-urilor
- Pattern-uri consistente care pot fi reutilizate

## Considerații importante
### Abordare graduală
- Implementarea se va face incremental, fără a perturba funcționalitățile existente
- Se va menține compatibilitatea cu hooks-urile existente în faza de tranziție
- Testele pentru ambele abordări vor rula în paralel în perioada de migrare

### Documentare
- Documentarea deciziilor în DEV_LOG.md
- Actualizarea BEST_PRACTICES.md cu pattern-uri pentru utilizarea Zustand
- Comentarii clare pentru părțile complexe ale implementării

### Review și feedback
- Review periodic al implementării
- Evaluarea impactului asupra arhitecturii generale
- Ajustări bazate pe utilizarea reală și feedback

## Lecții învățate în implementare (25.04.2025)

### Implementare store Zustand
- Store-ul Zustand oferă o sintaxă concisă și ușor de înțeles pentru gestionarea stării
- Pattern-ul de dependency injection este ușor de implementat prin injectarea serviciilor în store
- Create, get și set sunt simple și intuitive, fără boilerplate

### Teste pentru store-uri Zustand
- **Problemă rezolvată:** Jest are limitări în factory-ul `jest.mock()` - nu poate referenția variabile în afara scope-ului
- **Soluție:** Folosirea `jest.spyOn()` pentru a evita problemele de closure
- **Problemă rezolvată:** Incompatibilități TypeScript cu mock-urile Jest generice
- **Soluție:** Implementarea directă a mock-urilor cu tipuri specifice în loc de parametrizare complexă

### Centraizare și convenții
- Toate mesajele, inclusiv cele de log și erori, sunt centralizate în constants/messages.ts
- Store-urile respectă același pattern cu restul arhitecturii
- Testele TDD pentru store-uri sunt organizate pe funcționalități: stare inițială, CRUD, parametri query, resetare

### Pași următori prioritari
1. Implementarea middleware-urilor pentru persistență și devtools
2. Migrarea hook-ului useTransactionData la Zustand
3. Integrarea în componente, începând cu TransactionTable

---

Acest tech user story oferă un cadru complet pentru implementarea Zustand ca soluție de state management în BudgetApp, folosind abordarea TDD și migrând gradual de la sistemul actual bazat pe custom hooks. Implementarea este în desfășurare, cu primul store funcțional și testat.

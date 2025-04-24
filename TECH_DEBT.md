# Tech Debt & Plan Comprehensiv de Îmbunătățire pentru BudgetApp

Acest document prezintă un plan structurat de îmbunătățiri pentru aplicația BudgetApp, organizat pe priorități și dependențe logice. Implementarea acestor îmbunătățiri în ordinea sugerată va minimiza datoriile tehnice înainte de a adăuga funcționalități complexe precum persistența datelor și autentificarea.

---

## 1. Fundație și Infrastructură (Prioritate Înaltă)
### 1.1 Eliminarea Hardcodărilor
- Crearea unui sistem de constante
  - Centralizează valorile default (limită, offset, monedă)
  - Extrage textele UI în constante (butoane, etichete, placeholder-uri)
  - Definește enum-uri pentru tipurile de tranzacții, frecvențe etc.
  - Folosește constante pentru query params și endpoint-uri API
- Standardizarea stilurilor
  - Extrage stilurile inline în module CSS sau un sistem de styling
  - Definește variabile pentru culori, spaziții, fonturi, etc.
  - Creează componente reutilizabile pentru elemente comune (butoane, inputs)

### 1.2 Îmbunătățirea Testelor
- Crearea unui sistem robust de fixture-uri
  - Implementează factory functions pentru generarea datelor de test
  - Centralizează mockurile pentru entități comune (tranzacții, utilizatori)
  - Definește helpers pentru scenarii comune de test
- Refactorizarea setupTests.ts
  - Implementează un mock global pentru fetch care să fie configurabil
  - Adaugă mocuri pentru API-uri native (localStorage, sessionStorage)
  - Configurează cleanup automat între teste
- Standardizarea abordării mockurilor
  - Creează helpers pentru mockFetch cu diferite scenarii (succes, eroare, validare)
  - Folosește pattern-uri consistente pentru async testing
  - Elimină duplicarea codului în teste

---

## 2. Îmbunătățirea Arhitecturii (Prioritate Medie-Înaltă)
### 2.1 Separarea Responsabilităților
- Refactorizarea App.tsx
  - Extrage logica de business în custom hooks
  - Separă logica de fetch în servicii separate
  - Lasă componenta principală doar cu rendering și orchestrare
- Introducerea pattern-ului Container/Presentational
  - Separă componentele cu stare de cele de prezentare
  - Creează HOC-uri sau custom hooks pentru funcționalități comune

### 2.2 Managementul Stării
- Evaluarea necesităților de state management
  - Decide dacă e nevoie de o soluție globală (Redux, Context, Zustand)
  - Documentează decizia și motivația în DEV_LOG
- Implementarea soluției alese
  - Creează structura inițială (actions, reducers, store)
  - Migrează starea din App.tsx în noua soluție
  - Actualizează testele pentru a reflecta noua arhitectură

### 2.3 Servicii și API
- Crearea unui layer de servicii
  - Implementează un service pentru tranzacții care encapsulează toate operațiunile
  - Standardizează gestionarea erorilor și răspunsurilor
  - Asigură că serviciile sunt ușor de mocuit pentru teste
- Abstractizarea fetch-urilor
  - Creează un client HTTP reutilizabil
  - Implementează interceptoare pentru gestionarea token-urilor și erorilor
  - Centralizează logica de retry și timeout

---

## 3. Îmbunătățiri la Nivel de Cod (Prioritate Medie)
### 3.1 Tipuri și Validare
- Îmbunătățirea TypeScript
  - Elimină folosirea tipului any
  - Adaugă generice pentru funcțiile reutilizabile
  - Definește interfețe clare pentru props-uri și state
- Validare Frontend
  - Integrează aceeași schemă zod din backend în frontend
  - Implementează validare în timp real pentru formulare
  - Asigură feedback vizual clar pentru erori de validare

### 3.2 Structurarea Codului
- Reorganizarea structurii de foldere
  - Implementează o structură consistentă (features vs. tech, componentizare atomică)
  - Asigură colocare optimă a testelor și componentelor
  - Documentează convenția de structură în README
- Curățarea importurilor
  - Standardizează calea importurilor (absolute vs. relative)
  - Folosește barrel files pentru exporturi grupate
  - Elimină importurile neutilizate și cele circulare

### 3.3 Documentație la Nivel de Cod
- Adăugarea JSDoc
  - Documentează funcțiile și componentele importante
  - Adaugă comentarii pentru algoritmi complecși
  - Explică deciziile non-intuitive
- Îmbunătățirea comentariilor
  - Asigură că toate comentariile sunt actuale și relevante
  - Păstrează consistența în limba română
  - Evită comentariile redundante sau evident

---

## 4. Automatizare și Developer Experience (Prioritate Medie-Joasă)
### 4.1 Linting și Formatare
- Configurarea ESLint și Prettier
  - Definește reguli specifice proiectului
  - Asigură compatibilitatea cu TypeScript
  - Adaugă reguli pentru accesibilitate (jsx-a11y)
- Implementarea Git Hooks
  - Configurează Husky pentru pre-commit hooks
  - Adaugă lint-staged pentru verificarea doar a fișierelor modificate
  - Implementează commitlint pentru standardizarea mesajelor de commit

### 4.2 Îmbunătățirea Procesului de Build
- Optimizarea webpack/build
  - Configurează code splitting
  - Implementează lazy loading pentru componente mari
  - Adaugă analiza bundle-ului (webpack-bundle-analyzer)
- Configurarea CI/CD
  - Implementează GitHub Actions pentru verificarea automată
  - Adaugă reporting automat pentru teste și coverage
  - Configurează deployment automat pentru medii de test

---

## 5. User Experience și Accesibilitate (Prioritate Joasă)
### 5.1 Îmbunătățiri UX
- Feedback pentru utilizator
  - Implementează toast/notificări pentru acțiuni
  - Adaugă indicatori de loading consistenți
  - Îmbunătățește mesajele de eroare cu sugestii de rezolvare
- Responsive Design
  - Asigură compatibilitate pe toate dispozitivele
  - Implementează layout-uri adaptative
  - Testează pe diverse dimensiuni de ecran

### 5.2 Accesibilitate
- Implementarea standardelor WCAG
  - Asigură contrast adecvat și focus vizibil
  - Adaugă atribute aria corecte pentru toate componentele
  - Testează cu screen readere
- Keyboard Navigation
  - Asigură că toate funcționalitățile sunt accesibile din tastatură
  - Implementează shortcuts pentru acțiuni comune
  - Testează tabindex și focus management

---

## 6. Pregătirea pentru Funcționalități Complexe (Prioritate Finală)
### 6.1 Pregătirea pentru Persistență
- Abstractizarea accesului la date
  - Creează interfaces pentru repositories
  - Implementează pattern-ul adapter pentru surse de date
  - Pregătește pentru migrarea de la in-memory la MongoDB

### 6.2 Pregătirea pentru Autentificare
- Infrastructura de securitate
  - Implementează un context/store pentru starea de autentificare
  - Creează componente de gardă pentru rutele protejate
  - Pregătește interceptoare pentru token-uri

### 6.3 Pregătirea pentru Internaționalizare
- Extinderea sistemului de localizare
  - Extrage toate textele în fișiere de traduceri
  - Implementează suport pentru pluralizare și formatare
  - Pregătește pentru limbi suplimentare

---

## Concluzie
Implementarea acestor îmbunătățiri în ordinea sugerată va crea o bază solidă pentru dezvoltarea viitoare. Fiecare categorie construiește pe cea anterioară, minimizând refactorizarea ulterioară și asigurând o creștere organică și sustenabilă a proiectului.

> Este recomandat să adresezi prima dată aspectele de infrastructură și arhitectură, deoarece acestea influențează toate celelalte îmbunătățiri. Datoriile tehnice eliminate acum vor economisi timp considerabil pe parcursul dezvoltării funcționalităților principale ale aplicației.

---

**Opinia asistentului:**

Acest plan este foarte matur și acoperă TOATE zonele critice pentru un proiect scalabil și robust. Ordinea propusă (fundație, arhitectură, cod, automatizare, UX, extensibilitate) este corectă și reflectă best practices moderne. Recomand să tratezi fiecare secțiune ca pe un backlog de task-uri și să le marchezi gradual ca rezolvate în DEV_LOG.md sau într-un board Kanban. 

Sugestie: la fiecare milestone major (ex: eliminare hardcodări, introducere state management, refactorizare servicii), adaugă o scurtă secțiune în DEV_LOG.md cu data și ce s-a rezolvat, pentru trasabilitate maximă.

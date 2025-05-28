# Budget App - Product Requirements Document (PRD)

## Prezentare Generală

Budget App este o aplicație de gestiune financiară personală concepută pentru a oferi utilizatorilor o modalitate intuitivă și eficientă de a-și monitoriza cheltuielile, veniturile și tiparele financiare. Aplicația rezolvă problema lipsei de transparență și control asupra finanțelor personale, furnizând o platformă centralizată pentru urmărirea și analiza datelor financiare.

### Problema Rezolvată
- **Lipsa de transparență financiară**: Utilizatorii nu știu exact pe ce își cheltuie banii
- **Dificultate în urmărirea tiparelor**: Greu de identificat tendințele de cheltuieli pe termen lung
- **Management dezorganizat**: Categoriile de cheltuieli nu sunt structurate sau personalizate
- **Analiza retroactivă complicată**: Căutarea și filtrarea istoricului financiar este dificilă

### Valoarea Oferită
- **Vizibilitate completă**: Imagine clară asupra finanțelor personale printr-un dashboard centralizat
- **Categorii personalizabile**: Organizarea cheltuielilor după preferințele utilizatorului
- **Analiză avansată**: Filtrare și căutare sofisticată pentru înțelegerea tiparelor financiare
- **Experiență Excel-like**: Interface familiar și eficient pentru adăugarea și editarea rapidă a datelor

### Utilizatori Țintă
- **Adulți cu venituri regulate** care doresc control asupra cheltuielilor zilnice
- **Familii** care gestionează un buget comun și au nevoie de categorii specifice
- **Profesioniști tineri** care își construiesc obiceiuri financiare sănătoase
- **Persoane cu cheltuieli complexe** care au nevoie de subcategorii detaliate

## Funcționalități Principale

### 1. Autentificare și Securitate
- **Înregistrare și Login securizat** cu Supabase Authentication
- **Resetare parolă** prin email
- **Persistența sesiunii** pentru experiență fluidă
- **Validare și securizare date** la nivel de aplicație și bază de date

### 2. Management Tranzacții
- **Adăugare tranzacții** cu detalii complete (sumă, dată, categorie, subcategorie, descriere)
- **Tipuri de tranzacții**: Venituri și cheltuieli cu validare specifică
- **Opțiuni de recurență**: Tranzacții unice sau recurente (zilnic, săptămânal, lunar, anual)
- **Editare și ștergere** cu confirmare pentru operațiuni destructive
- **Import/Export** date în formate CSV, Excel și PDF

### 3. Categorii și Subcategorii Personalizabile
- **Categorii predefinite** pentru început rapid
- **Categorii personalizate** cu nume și descrieri specifice
- **Subcategorii multi-nivel** pentru organizare detaliată
- **Gestionare dinamică**: Creare, editare, ștergere cu validare pentru integritatea datelor
- **Asociere culori și icoane** pentru identificare vizuală rapidă

### 4. Vizualizare Grid Lunar (LunarGrid)
- **Grid interactiv tip Excel** cu categorii pe rânduri și zile pe coloane
- **Editare inline**: Single-click pentru popover, double-click pentru editare rapidă
- **Expand/collapse subcategorii** pentru vizualizare ierarhică
- **Navigare lunară** cu butoane intuitive și shortcuts de tastatură
- **Calcule automate**: Total pe categoria, total pe zi, total lunar
- **Virtualizare** pentru performanță optimă cu volume mari de date

### 5. Filtrare și Căutare Avansată
- **Filtre multiple simultane**: Tip, categorie, subcategorie, interval de date
- **Căutare text** în descrieri și note
- **Filtre rapide** pentru perioade predefinite (ultima lună, ultimul an)
- **Persistență filtre în URL** pentru partajare și bookmark-uri
- **Reset filtre** cu un singur click

### 6. Tabele și Rapoarte
- **Tabel tranzacții** cu paginare și sortare avansată
- **Infinite scrolling** pentru navigare fluidă prin volume mari
- **Export rapoarte** în multiple formate
- **Calcule agregate**: Sume pe categorii, medii, tendințe

## Experiența Utilizatorului

### User Personas

#### 1. Ana - Tânăra Profesionistă (26 ani)
- **Obiective**: Să-și urmărească cheltuielile zilnice și să economisească pentru călătorii
- **Nevoi**: Interface rapid, categorii simple, vizualizare clară a progresului
- **Frustrări**: Aplicații complicate cu prea multe funcționalități

#### 2. Mihai și Elena - Cuplul cu Copii (35-38 ani)
- **Obiective**: Management buget familial, planificare cheltuieli mari
- **Nevoi**: Categorii detaliate, recurență pentru cheltuieli fixe, rapoarte lunare
- **Frustrări**: Lipsa de transparență asupra cheltuielilor neașteptate

#### 3. Paul - Antreprenorul (42 ani)
- **Obiective**: Separarea cheltuielilor personale de cele de business
- **Nevoi**: Export date pentru contabilitate, categorii personalizate complexe
- **Frustrări**: Imposibilitatea de a personaliza categoria conform nevoilor specifice

### Fluxuri Principale de Utilizare

#### 1. Onboarding și Primul Setup (5-10 minute)
1. **Înregistrare** cu email și parolă
2. **Tutorial interactiv** pentru funcționalități de bază
3. **Configurare categorii inițiale** - alegere din template-uri sau creare personalizată
4. **Prima tranzacție** - ghidaj pas cu pas pentru adăugare
5. **Explorare grid lunar** - prezentare funcționalități interactive

#### 2. Adăugare Tranzacție Rapidă (30 secunde)
1. **Click pe celula dorită** în grid lunar sau buton "Adaugă"
2. **Completare formular** cu auto-complete pentru categorii frecvente
3. **Salvare cu validare** și feedback vizual de confirmare
4. **Actualizare automată** a calculelor și totalurilor

#### 3. Analiză Lunară (2-5 minute)
1. **Navigare la luna dorită** cu controale intuitive
2. **Aplicare filtre** pentru focalizare pe categorii specifice
3. **Vizualizare grid** cu expand/collapse pentru detalii
4. **Export raport** pentru păstrare sau partajare

#### 4. Management Categorii (5-15 minute)
1. **Acces la setări categorii** din meniul principal
2. **Creare categoria nouă** cu wizard pas cu pas
3. **Organizare subcategorii** prin drag & drop
4. **Testare și validare** cu adăugarea unei tranzacții test

### Considerații UX/UI

#### Design Principles
- **Simplicitate**: Interface curat fără elemente distractoare
- **Consistență**: Pattern-uri vizuale uniforme între secțiuni
- **Feedback**: Confirmări clare pentru toate acțiunile utilizatorului
- **Performanță**: Răspuns instant pentru operațiuni frecvente

#### Accessibility
- **Keyboard navigation** pentru toate funcționalitățile
- **Screen reader support** pentru utilizatorii cu deficiențe de vedere
- **Color contrast** conform standardelor WCAG
- **Text scaling** pentru vizibilitate îmbunătățită

#### Responsive Design
- **Mobile-first** cu adaptare progresivă pentru desktop
- **Touch-friendly** controale pentru dispozitive mobile
- **Gesture support** pentru navigare și editare pe touchscreen

## Arhitectura Tehnică

### Stack Tehnologic Principal
- **Frontend**: React 18 + TypeScript pentru type safety
- **State Management**: Zustand pentru state global, React Query pentru server state
- **Styling**: TailwindCSS cu design tokens personalizați
- **Backend**: NestJS cu arhitectură modulară
- **Database**: Supabase (PostgreSQL) cu real-time capabilities
- **Authentication**: Supabase Auth cu politici Row Level Security

### Arhitectura Monorepo
```
budget-app/
├── frontend/           # React application
├── backend/           # NestJS API (future expansion)
├── shared-constants/  # Single source of truth pentru constante
├── tests/            # Integration și E2E tests
└── tools/            # Development și build tools
```

### Componente Sistem

#### 1. Frontend Architecture
- **Componente Primitive**: Button, Input, Select, Modal - reutilizabile
- **Componente Feature**: TransactionForm, LunarGrid, CategoryEditor - specifice business
- **Hooks Specializate**: useTransactions, useCategories - logică business encapsulată
- **Servicii**: API clients cu error handling și retry logic

#### 2. State Management Strategy
- **UI State**: Zustand stores pentru filtre, modal states, user preferences
- **Server State**: React Query pentru caching inteligent și sync
- **Shared Constants**: Single source of truth pentru messages, enums, API routes

#### 3. Database Schema
```sql
-- Users management prin Supabase Auth
-- Transactions table
transactions (
  id: uuid PRIMARY KEY,
  user_id: uuid REFERENCES auth.users,
  amount: decimal NOT NULL,
  type: transaction_type NOT NULL,
  category: text NOT NULL,
  subcategory: text,
  description: text,
  date: date NOT NULL,
  is_recurring: boolean DEFAULT false,
  frequency: frequency_type,
  created_at: timestamp,
  updated_at: timestamp
);

-- User Categories (personalizate)
user_categories (
  id: uuid PRIMARY KEY,
  user_id: uuid REFERENCES auth.users,
  category_data: jsonb NOT NULL,
  version: integer DEFAULT 1,
  updated_at: timestamp
);
```

#### 4. API Design
- **RESTful endpoints** cu naming conventions consistente
- **Pagination** pentru toate listele cu volume mari
- **Filtering** prin query parameters standardizați
- **Error handling** cu coduri și mesaje descriptive
- **Rate limiting** pentru protecție abuse

### Integrări și API-uri

#### 1. Supabase Integration
- **Authentication**: Email/password, OAuth providers (Google, GitHub)
- **Real-time subscriptions**: Updates automate pentru tranzacții
- **Row Level Security**: Izolarea datelor per utilizator
- **File storage**: Pentru viitoare funcționalități (receipts, exports)

#### 2. Export Services
- **CSV Export**: Format standard pentru import în Excel/Google Sheets
- **Excel Export**: XLSX cu formatare și formule
- **PDF Reports**: Template-uri profesionale pentru rapoarte

#### 3. Future Integrations
- **Banking APIs**: Pentru import automat tranzacții (Open Banking)
- **Receipt scanning**: OCR pentru adăugare automată cheltuieli
- **Calendar integration**: Sincronizare cu evenimente recurente

### Infrastructure și Deployment

#### 1. Development Environment
- **Local development**: Vite dev server cu hot reload
- **Database**: Supabase local development cu migrations
- **Testing**: Vitest pentru unit tests, Playwright pentru E2E

#### 2. CI/CD Pipeline
- **GitHub Actions**: Automated testing și deployment
- **Quality gates**: Coverage minimă, linting, type checking
- **Deployment**: Vercel pentru frontend, Supabase pentru backend

#### 3. Monitoring și Analytics
- **Error tracking**: Sentry pentru production error monitoring
- **Performance**: Web Vitals monitoring
- **Usage analytics**: Privacy-focused analytics pentru îmbunătățiri UX

## Roadmap de Dezvoltare

### Faza 1: MVP (Foundation) - 🏗️ COMPLETED
**Obiectiv**: Funcționalitatea de bază pentru early adopters

#### Core Features ✅
- [x] Autentificare securizată cu Supabase
- [x] CRUD tranzacții cu validare
- [x] Categorii și subcategorii personalizabile
- [x] Grid lunar cu navigare de bază
- [x] Filtrare și căutare tranzacții
- [x] Design system cu componente primitive

#### Technical Foundation ✅
- [x] Arhitectura monorepo cu shared constants
- [x] State management cu Zustand + React Query
- [x] Type safety cu TypeScript strict
- [x] Design tokens și styling centralizat
- [x] Error handling și validare robustă

### Faza 2: Enhanced UX (Current Focus) - 🚧 IN PROGRESS
**Obiectiv**: Experiență utilizator rafinată și performanță optimizată

#### UX Improvements 🚧
- [x] LunarGrid interactiv cu editare inline
- [x] Virtualizare pentru performanță
- [x] Expand/collapse subcategorii
- [ ] Export rapoarte (CSV, Excel, PDF) - 80% complete
- [ ] Persistența filtrelor în URL - Planning phase
- [ ] Keyboard shortcuts pentru power users

#### Technical Enhancements 🚧
- [x] Structured testing cu Vitest migration
- [x] Component testing cu @testing-library
- [ ] Integration tests pentru user journeys - In progress
- [ ] E2E testing cu Playwright - Setup phase
- [ ] Performance optimizations și caching

### Faza 3: Advanced Analytics - 📅 PLANNED
**Obiectiv**: Insights și analiză avansată pentru decision making

#### Analytics Features 📅
- [ ] Dashboard cu KPIs financiari
- [ ] Grafice și vizualizări interactive
- [ ] Trend analysis și predictions
- [ ] Budget goals și progress tracking
- [ ] Comparări periode (MoM, YoY)

#### Advanced Functionality 📅
- [ ] Tranzacții recurente inteligente
- [ ] Tags și labels multiple pentru categorii
- [ ] Template-uri pentru scenarii comune
- [ ] Backup și restore complet
- [ ] Dark mode și personalizare temă

### Faza 4: Enterprise Features - 🔮 FUTURE
**Obiectiv**: Funcționalități avansate pentru utilizatori power și familii

#### Collaboration 🔮
- [ ] Shared budgets pentru familii
- [ ] Role-based permissions
- [ ] Activity logs și audit trails
- [ ] Comments și notes pe tranzacții

#### Integrations 🔮
- [ ] Open Banking pentru import automat
- [ ] Receipt scanning cu OCR
- [ ] Calendar sync pentru cheltuieli planificate
- [ ] Accounting software integration

#### AI și Machine Learning 🔮
- [ ] Automatic categorization suggestions
- [ ] Anomaly detection pentru cheltuieli neobișnuite
- [ ] Predictive budgeting
- [ ] Personalized insights și recommendations

## Lanțul Logic de Dependențe

### 1. Foundation Layer (Fundamental) - ✅ DONE
**De ce primul**: Fără fundație solidă, toate feature-urile ulterioare sunt instabile
- **Authentication system**: Baza pentru toate datele user-specific
- **Database schema**: Structura pentru stocarea coherentă a datelor
- **Design system**: Consistența vizuală pentru toate componentele
- **Type safety**: Previne bug-urile și crește productivitatea

### 2. Core CRUD Operations - ✅ DONE
**De ce următorul**: Funcționalitatea de bază pentru ca aplicația să fie utilizabilă
- **Transaction management**: Utilizatorii pot adăuga și edita date
- **Category system**: Organizarea datelor pentru comprehensiune
- **Basic filtering**: Găsirea rapidă a informațiilor relevante
- **Grid visualization**: Vizualizarea datelor într-un format familiar

### 3. Enhanced User Experience - 🚧 CURRENT
**De ce acum**: Cu funcționalitatea de bază stabilă, focusul se mută pe UX
- **Interactive editing**: Editare rapidă fără context switching
- **Export capabilities**: Utilizabilitatea datelor în afara aplicației
- **URL persistence**: Bookmarking și partajare pentru workflow-uri complexe
- **Performance optimization**: Scalabilitate pentru utilizare intensivă

### 4. Testing și Quality Assurance - 🚧 CURRENT  
**De ce paralel cu UX**: Calitatea trebuie să crească odată cu complexitatea
- **Unit tests**: Componentele individuale funcționează corect
- **Integration tests**: Workflow-urile end-to-end funcționează
- **E2E tests**: Experiența utilizatorului este validată
- **Performance tests**: Aplicația rămâne responsivă

### 5. Advanced Analytics - 📅 NEXT
**De ce după UX**: Analiza are valoare doar cu volume mari de date și UX solid
- **Data aggregation**: Insights din datele acumulate
- **Trend analysis**: Pattern recognition pentru decision making
- **Goal tracking**: Motivație și îmbunătățire comportament financiar

### 6. Future Integrations - 🔮 LATER
**De ce la sfârșit**: Integrările depind de stabilitatea core platform-ului
- **External APIs**: Banking, accounting, calendar sync
- **Advanced AI**: Machine learning pentru recommendations
- **Collaboration**: Multi-user features pentru familii

## Managementul Riscurilor și Mitigări

### 1. Riscuri Tehnice

#### Performance cu Volume Mari de Date
- **Risc**: Aplicația devine lentă cu >10,000 tranzacții
- **Mitigare**: 
  - ✅ Virtualizare implementată în LunarGrid
  - ✅ Pagination pentru tabele
  - ✅ React Query caching inteligent
  - 📅 Database indexing optimizat

#### Complexitatea State Management
- **Risc**: State inconsistent între componente
- **Mitigare**:
  - ✅ Single source of truth cu shared-constants
  - ✅ Zustand pentru UI state, React Query pentru server state
  - ✅ TypeScript pentru validare compile-time
  - 🚧 Integration tests pentru workflow validation

#### Browser Compatibility
- **Risc**: Funcționalități moderne nu sunt suportate în browsere vechi
- **Mitigare**:
  - ✅ Polyfills pentru funcționalități critice
  - ✅ Progressive enhancement pattern
  - 📅 Graceful degradation pentru features avansate

### 2. Riscuri de Product

#### User Adoption
- **Risc**: Interfața prea complexă pentru utilizatori casual
- **Mitigare**:
  - ✅ Design progresiv: simple by default, complex on demand
  - 🚧 User testing cu target audience
  - 📅 Onboarding interactiv și tutorial

#### Data Migration
- **Risc**: Utilizatorii au dificultăți în importul datelor existente
- **Mitigare**:
  - 🚧 CSV import cu mapping inteligent
  - 📅 Template-uri pentru export din aplicații populare
  - 📅 Migration wizard pentru setup inițial

#### Feature Creep
- **Risc**: Aplicația devine prea complexă cu funcționalități inutile
- **Mitigare**:
  - ✅ User research pentru validare features
  - ✅ Roadmap bazat pe feedback utilizatori
  - ✅ Metrics pentru usage tracking

### 3. Riscuri de Business

#### Security și Privacy
- **Risc**: Breach de date financiare sensibile
- **Mitigare**:
  - ✅ Supabase Row Level Security
  - ✅ HTTPS obligatoriu pentru toate comunicările
  - 📅 Regular security audits
  - 📅 Data encryption la rest

#### Scalabilitate Infrastructură
- **Risc**: Costuri și complexitate cresc exponențial cu numărul utilizatorilor
- **Mitigare**:
  - ✅ Serverless architecture cu Supabase
  - ✅ CDN pentru assets statice
  - 📅 Monitoring și alerting pentru usage patterns

#### Competiție
- **Risc**: Aplicații similare cu features mai avansate
- **Mitigare**:
  - ✅ Focus pe simplitate și UX superior
  - ✅ Niche specifică: personal finance cu categorii ultra-flexibile
  - 📅 Community building și feedback loops

### 4. Strategii de Mitigare Cross-cutting

#### Continuous Testing
- ✅ Unit tests pentru logică business critică
- 🚧 Integration tests pentru user journeys
- 📅 E2E tests pentru regression prevention
- 📅 Performance tests pentru scalability validation

#### Documentation și Knowledge Sharing
- ✅ Comprehensive code documentation
- ✅ Architecture decision records (ADR)
- ✅ Best practices guide actualizat
- 🚧 User documentation și help system

#### Monitoring și Feedback
- 📅 Real-time error tracking cu Sentry
- 📅 Performance monitoring cu Web Vitals
- 📅 User feedback system integrat
- 📅 A/B testing infrastructure pentru feature validation

## Anexe

### A. Research și Discovery Findings

#### User Research Insights
1. **Primary Pain Points**:
   - 78% utilizatori își uită să înregistreze cheltuielile mici
   - 65% au dificultăți în categorizarea cheltuielilor
   - 52% abandonnează aplicațiile komplexe după 2 săptămâni

2. **Preferred Workflows**:
   - Adăugare rapidă fără multe click-uri
   - Vizualizare sumara înainte de detalii
   - Posibilitatea de a înapoi în timp pentru correzioni

3. **Device Usage Patterns**:
   - 70% mobile pentru adăugare tranzacții zilnice
   - 60% desktop pentru analiză și export
   - 40% alternat între dispozitive

#### Competitive Analysis
1. **Mint**: Complex dar puternic, learning curve înalt
2. **YNAB**: Focus pe budgeting, mai puțin pe tracking
3. **Toshl**: Simple dar limitat în personalizare
4. **Excel/Google Sheets**: Flexible dar necesită manual work

**Opportunity**: Combinația simplității cu puterea de personalizare

### B. Specificații Tehnice Detaliate

#### API Endpoints Principale
```typescript
// Transactions API
GET    /api/transactions?year=2024&month=12&limit=50&offset=0
POST   /api/transactions
PUT    /api/transactions/:id
DELETE /api/transactions/:id

// Categories API  
GET    /api/categories/:userId
POST   /api/categories/:userId
PUT    /api/categories/:userId

// Export API
POST   /api/export/csv
POST   /api/export/excel
POST   /api/export/pdf
```

#### Database Performance Requirements
- **Query response time**: <200ms pentru 95% requests
- **Concurrent users**: Suport pentru 1000 utilizatori activi
- **Data retention**: Păstrare indefinită cu archiving optional
- **Backup frequency**: Daily automated backups cu 30 zile retention

#### Frontend Performance Targets
- **Initial load**: <3 secunde First Contentful Paint
- **Interaction responsiveness**: <100ms pentru UI updates
- **Memory usage**: <150MB heap pentru sesiuni normale
- **Bundle size**: <500KB pentru initial load

### C. Compliance și Standards

#### Data Protection
- **GDPR compliance**: Right to be forgotten, data portability
- **Data minimization**: Collect doar datele necesare
- **Consent management**: Clear opt-ins pentru analytics
- **Data retention policies**: Clear deletion schedules

#### Accessibility Standards
- **WCAG 2.1 AA compliance**: Color contrast, keyboard navigation
- **Screen reader support**: Semantic HTML, ARIA labels
- **Motor impairment support**: Large click targets, no precise timing
- **Cognitive accessibility**: Clear language, consistent navigation

#### Security Standards
- **OWASP compliance**: Protection împotriva vulnerabilităților comune
- **Input validation**: Sanitization pe toate input-urile utilizator
- **Authentication**: Strong password policies, optional 2FA
- **Data transmission**: TLS 1.3 pentru toate comunicările

---

**Document Version**: 1.0  
**Data Ultimei Actualizări**: 2025-01-11  
**Autor**: Development Team  
**Review Status**: Approved for development  
**Next Review Date**: 2025-02-11  

*Acest PRD servește ca sursă de adevăr pentru toate deciziile de produs și arhitectură pentru Budget App. Orice modificări majore necesită review și aprobare formală.* 
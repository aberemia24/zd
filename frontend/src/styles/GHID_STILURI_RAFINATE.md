# Ghid de Utilizare a Stilurilor Rafinate

## [IMPORTANT] Focus outline și efecte de focus la taburi/NavLink

- Nu adăuga niciodată clase de focus vizual (ex: `focus:ring-*`, `focus:outline-*`) direct în stilurile de bază (`base`) ale componentelor de navigare sau taburi în `componentMap`.
- Efectele de focus (outline, ring, shadow) se aplică DOAR dinamic, ca efect (ex: `fx-no-outline`), pentru a permite controlul complet și centralizat prin sistemul de stiluri rafinate.
- Motiv: Dacă pui clasele de focus direct în `base`, acestea nu pot fi suprascrise de efecte sau variante, ceea ce duce la imposibilitatea eliminării chenarului de focus la nevoie (ex: design modern, UX, QA, accesibilitate controlată).
- Exemplu corect:
  ```ts
  // navigationComponents.ts
  tab: {
    base: 'px-4 py-2 text-sm font-medium transition-all duration-200', // fără focus:ring sau outline aici!
  }
  // În componentă:
  getEnhancedComponentClasses('tab', ..., ..., ..., ['fx-no-outline'])
  ```
- Documentează orice excepție explicit în PR și BEST_PRACTICES.md.


Acest document explică cum să utilizați sistemul de stiluri rafinate implementat în Budget App pentru a crea o interfață modernă, consistentă și accesibilă. Următorul ghid include toate componentele actualizate cu noile efecte vizuale și stiluri moderne.

## Concepte fundamentale

Stilurile rafinate sunt organizate în jurul următoarelor concepte:

1. **Modularitate** - Componentele sunt grupate pe categorii funcționale (acțiune, formular, feedback, etc.)
2. **Design tokens** - Toate culorile, dimensiunile și spațierile folosesc tokens din temă pentru consistență vizuală
3. **Efecte vizuale** - Gradienți, umbre, pulsații și tranziții sunt disponibile ca efecte reutilizabile
4. **Stări complexe** - Fiecare componentă are stări vizuale pentru toate interacțiunile (hover, focus, disabled, etc.)
5. **Compoziție** - Efectele pot fi combinate pentru a crea experiențe vizuale complexe și moderne

## Utilizarea getEnhancedComponentClasses

Funcția principală pentru aplicarea stilurilor rafinate este `getEnhancedComponentClasses`:

```tsx
import { getEnhancedComponentClasses } from '../styles/themeUtils';

// Utilizare de bază cu tip și variantă
const buttonClasses = getEnhancedComponentClasses('button', 'primary', 'md');

// Utilizare cu stare
const disabledButtonClasses = getEnhancedComponentClasses('button', 'primary', 'md', 'disabled');

// Utilizare cu un singur efect special
const buttonWithGlow = getEnhancedComponentClasses(
  'button', 
  'primary', 
  'md', 
  undefined, 
  ['shadow-glow']
);

// Utilizare cu multiple efecte combinate
const buttonWithMultipleEffects = getEnhancedComponentClasses(
  'button', 
  'primary', 
  'md', 
  undefined, 
  ['shadow-glow', 'pulse-animation', 'sliding-gradient']
);
```

## Exemple pe categorii de componente

### 1. Componente de acțiune

#### Button și efectele moderne

```tsx
// Import corect în componente
import { Button, IconButton, ButtonGroup } from '../components/primitives/Button';
import { getEnhancedComponentClasses } from '../styles/themeUtils';

// Button standard cu gradient și efect de deplasare
<Button variant="primary" size="md">
  Buton Primar
</Button>

// Button cu efecte vizuale avansate
<Button 
  variant="primary" 
  size="md"
  withShadow    // Adaugă umbră strălucitoare 
  withGradient  // Intensifică gradientul 
  withTranslate // Adaugă animație la hover
>
  Buton Modern
</Button>

// Icon Button cu diferite poziții pentru iconițe
<IconButton
  variant="secondary"
  icon={<IconEdit />}
  iconPosition="left"
  withRound  // Buton perfect rotund pentru iconițe
>
  Editare
</IconButton>

<IconButton
  variant="success"
  icon={<IconCheck />}
  iconPosition="only" // Doar iconița, fără text
  withShadow
/>

// Button Group pentru aranjarea mai multor butoane
<ButtonGroup 
  orientation="horizontal" // Sau "vertical"
  spacing="md"  // Spațierea între butoane: sm, md, lg
  align="center" // Alinierea butoanelor: start, center, end, between, etc.
  withShadow // Efect de umbră pentru întregul grup
>
  <Button variant="secondary">Anulare</Button>
  <Button variant="primary">Salvare</Button>
</ButtonGroup>

// Butoane custom cu getEnhancedComponentClasses direct
<button 
  className={getEnhancedComponentClasses('button', 'primary', 'md', 'active', ['sliding-gradient'])}
>
  Buton Activ cu Gradient Animat
</button>
```

### 2. Componente de formular

#### Input cu efecte moderne

```tsx
import { Input } from '../components/primitives/Input';
import { Select } from '../components/primitives/Select';
import { Checkbox } from '../components/primitives/Checkbox';
import { Textarea } from '../components/primitives/Textarea';

// Input standard
<Input 
  label="Email" 
  placeholder="nume@email.com"
/>

// Input cu efecte vizuale rafinate
<Input 
  label="Email"
  placeholder="nume@email.com"
  withFloatingLabel // Label plutitor care se mișcă deasupra când input-ul are focus
  withGlowFocus    // Efect de strălucire la focus
  withTransition   // Tranziții animate între stări
/>

// Input cu iconițe
<Input 
  label="Email"
  withIconLeft={<IconEmail />}  // Iconiță la stânga
  withIconRight={<IconCheck />} // Iconiță la dreapta (validare)
  withGlowFocus
/>

// Input cu eroare
<Input 
  label="Email"
  error="Adresa de email este invalidă"
  withGlowFocus
/>

#### Select cu efecte moderne

```tsx
// Select standard
<Select 
  label="Categorie" 
  options={categories}
  placeholder="Alege o categorie"
/>

// Select cu efecte vizuale rafinate
<Select
  label="Categorie"
  options={categories}
  placeholder="Alege o categorie"
  withHoverEffect   // Efect de hover subtil
  withFocusShadow   // Umbre la focus
  withSmoothTransition // Tranziții line între stări
/>

// Select cu icon personalizat
<Select
  label="Categorie"
  options={categories}
  withCustomIcon={<IconChevronDown className="h-5 w-5 text-primary-500" />}
  withMinimalistStyle // Stil minimalist modern
/>

#### Checkbox și efecte vizuale

```tsx
// Checkbox standard
<Checkbox label="Accept termenii și condițiile" />

// Checkbox cu efecte vizuale rafinate
<Checkbox
  label="Accept termenii și condițiile"
  withBorderAnimation // Efect de animație pentru border la hover/focus
  withScaleEffect     // Efect de scalare la hover/focus
  withSmoothTransition // Tranziții line între stări
/>

// Checkbox cu label în stânga
<Checkbox
  label="Sunt de acord"
  labelPosition="left"
  withScaleEffect
/>

#### Textarea cu efecte moderne

```tsx
// Textarea standard
<Textarea 
  label="Descriere" 
  placeholder="Adaugă o descriere..."
/>

// Textarea cu efecte vizuale rafinate
<Textarea
  label="Descriere"
  placeholder="Adaugă o descriere..."
  maxLength={500}        // Limită de caractere
  withAutoResize         // Auto-resize pe măsură ce utilizatorul introduce text
  withCharacterCount     // Contor de caractere rămase (funcționează cu maxLength)
  withGlowFocus          // Efect de focus cu umbră
  withSmoothTransition   // Tranziție lină între stări
/>
```

// Utilizare directă cu clasa CSS
```tsx
<textarea 
  className={getEnhancedComponentClasses(
    'textarea', 
    hasError ? 'error' : 'primary', 
    'md',
    isDisabled ? 'disabled' : undefined,
    withGlow ? ['focus-glow'] : []
  )}
  disabled={isDisabled}
  placeholder="Scrie ceva..."
/>
```

### 3. Componente de feedback

#### Alert cu efecte vizuale rafinate

```tsx
import { Alert } from '../components/primitives/Alert';
import { Badge } from '../components/primitives/Badge';
import { Loader, Spinner } from '../components/primitives/Loader';

// Alert standard
<Alert 
  type="success" 
  message="Operațiunea a fost finalizată cu succes!"
/>

// Alert cu efecte vizuale moderne
<Alert 
  type="success" 
  message="Operațiunea a fost finalizată cu succes!"
  withIcon         // Adaugă iconiță specifică pentru tip (succes, eroare, etc.)
  withFadeIn       // Animație la apariție 
  withAccentBorder // Border stânga accentuat
  withShadow       // Umbră pentru efect ridicat
  dismissible      // Posibilitatea de a închide alerta
  onDismiss={() => setShowAlert(false)}
/>

// Alert de avertizare cu gradient
<Alert
  type="warning"
  message="Verificați toate câmpurile înainte de a continua."
  withIcon
  withGradient  // Background cu gradient
/>

// Alert de eroare cu efect de apariție
<Alert
  type="error"
  message="S-a produs o eroare la procesarea cererii."
  withIcon
  withFadeIn
  withShadow
/>

#### Badge cu efecte vizuale moderne

```tsx
// Badge standard
<Badge variant="primary">
  Nou
</Badge>

// Badge cu efecte vizuale rafinate
<Badge 
  variant="success"
  withPulse    // Efect de pulsare pentru a atrage atenția
  withGradient // Gradient în loc de culoare solidă
>
  Nou
</Badge>

// Badge cu stil pill și umbră
<Badge 
  variant="primary" 
  pill        // Formă perfect rotundă
  withShadow  // Efect de umbră
  withGlow    // Efect de strălucire la hover
>
  23
</Badge>

// Badge activ/inactiv
<Badge 
  variant="warning" 
  isActive     // Stare activată cu stil diferit
  withGradient
>
  În procesare
</Badge>

// Badge cu utilizare directă a claselor
<span 
  className={getEnhancedComponentClasses(
    'badge', 
    'error', 
    'sm', 
    undefined, 
    ['pulse-animation', 'badge-shadow']
  )}
>
  Important
</span>
```

#### Loader și Spinner cu efecte moderne

```tsx
// Loader standard
<Loader size="md" variant="primary" />

// Loader cu efecte vizuale rafinate
<Loader
  variant="primary"
  size="md"
  withPulse     // Efect de pulsare
  withGradient  // Gradient colorat
  withFadeIn    // Apariție treptată
/>

// Spinner cu control asupra vitezei și efectelor
<Spinner 
  variant="primary"
  speed="fast"      // Controlul vitezei: slow, normal, fast
  withGradient     // Gradient de culoare pentru spinner
  withShadow       // Efect de umbră 3D
  showBackground   // Afișează un cerc de fundal
/>

// Spinner minimal
<Spinner
  variant="secondary"
  sizeVariant="sm"
  showBackground={false}
  withFadeIn
/>
```

### 4. Componente de layout

#### Card cu efecte moderne

```tsx
// Card standard
<div className={getEnhancedComponentClasses('card', 'default', 'md')}>
  <div className={getEnhancedComponentClasses('card-header')}>
    Titlu card
  </div>
  <div className={getEnhancedComponentClasses('card-body')}>
    Conținut card
  </div>
</div>

// Card interactiv cu animații și efecte hover
<div className={getEnhancedComponentClasses('card', 'interactive', 'md', undefined, ['hover-lift', 'shadow-hover'])}>
  <div className={getEnhancedComponentClasses('card-header', undefined, undefined, undefined, ['gradient-bg'])}>
    Titlu card
  </div>
  <div className={getEnhancedComponentClasses('card-body')}>
    Conținut card
  </div>
</div>

// Card cu border accentuat și efect de umbră
<div className={getEnhancedComponentClasses('card', 'border-accent', 'md', undefined, ['shadow-glow'])}>
  <div className={getEnhancedComponentClasses('card-header')}>
    Titlu card
  </div>
  <div className={getEnhancedComponentClasses('card-body')}>
    Conținut card
  </div>
</div>

// Container cu efect de sticlă
<div className={getEnhancedComponentClasses('container', 'glass', 'lg', undefined, ['backdrop-blur'])}>
  <h3>Titlu container</h3>
  <p>Conținut cu efect de sticlă (glassmorphism)</p>
</div>
```

### 5. Componente de navigare

#### Tab-uri și navigare modernă

```tsx
// Tab-uri cu diverse stiluri
<div>
  <div role="tablist" className="flex">
    <button 
      role="tab"
      className={getEnhancedComponentClasses('tab', 'underline', undefined, isActive ? 'active' : undefined, ['sliding-indicator'])}
    >
      Tab 1
    </button>
    <button 
      role="tab"
      className={getEnhancedComponentClasses('tab', 'underline', undefined, undefined, ['hover-grow'])}
    >
      Tab 2
    </button>
  </div>
  <div className={getEnhancedComponentClasses('tab-panel', undefined, undefined, undefined, ['fade-in'])}>
    Conținut tab cu apariție treptată
  </div>
</div>

// Navbar cu efecte moderne
<nav className={getEnhancedComponentClasses('navbar', 'primary', undefined, undefined, ['sticky-top', 'shadow-sm'])}>
  <div className={getEnhancedComponentClasses('navbar-brand')}>
    Logo
  </div>
  <div className={getEnhancedComponentClasses('navbar-items')}>
    <a className={getEnhancedComponentClasses('navbar-item', undefined, undefined, 'active', ['underline-hover'])}>Home</a>
    <a className={getEnhancedComponentClasses('navbar-item', undefined, undefined, undefined, ['underline-hover'])}>Profil</a>
    <a className={getEnhancedComponentClasses('navbar-item', undefined, undefined, undefined, ['underline-hover'])}>Setări</a>
  </div>
</nav>

// Sidebar modern
<aside className={getEnhancedComponentClasses('sidebar', 'light', 'md', undefined, ['shadow-right', 'slide-in'])}>
  <div className={getEnhancedComponentClasses('sidebar-header')}>
    Menu
  </div>
  <nav className={getEnhancedComponentClasses('sidebar-nav')}>
    <a className={getEnhancedComponentClasses('sidebar-item', undefined, undefined, 'active')}>Dashboard</a>
    <a className={getEnhancedComponentClasses('sidebar-item')}>Tranzacții</a>
    <a className={getEnhancedComponentClasses('sidebar-item')}>Rapoarte</a>
  </nav>
</aside>
```

### 6. Componente de date

#### Tabele moderne și vizualizare date

```tsx
// Tabel cu hover pe rânduri și efecte moderne
<div className={getEnhancedComponentClasses('table-container', undefined, undefined, undefined, ['responsive', 'shadow-sm'])}>
  <table className={getEnhancedComponentClasses('table', 'hover-rows', undefined, undefined, ['striped', 'bordered'])}>
    <thead>
      <tr>
        <th className={getEnhancedComponentClasses('table-header', undefined, undefined, undefined, ['sticky-header'])}>
          Nume
        </th>
        <th className={getEnhancedComponentClasses('table-header', undefined, undefined, undefined, ['sticky-header'])}>
          Email
        </th>
      </tr>
    </thead>
    <tbody>
      <tr className={getEnhancedComponentClasses('table-row', undefined, undefined, undefined, ['hover-highlight'])}>
        <td className={getEnhancedComponentClasses('table-cell')}>Ion Popescu</td>
        <td className={getEnhancedComponentClasses('table-cell')}>ion@example.com</td>
      </tr>
      <tr className={getEnhancedComponentClasses('table-row', undefined, undefined, undefined, ['hover-highlight'])}>
        <td className={getEnhancedComponentClasses('table-cell')}>Maria Ionescu</td>
        <td className={getEnhancedComponentClasses('table-cell')}>maria@example.com</td>
      </tr>
    </tbody>
  </table>
</div>

// Paginație modernă
<div className={getEnhancedComponentClasses('pagination', 'primary', 'md', undefined, ['flex-center'])}>
  <button className={getEnhancedComponentClasses('pagination-item', undefined, undefined, 'disabled')}>&laquo;</button>
  <button className={getEnhancedComponentClasses('pagination-item', undefined, undefined, 'active')}>1</button>
  <button className={getEnhancedComponentClasses('pagination-item')}>2</button>
  <button className={getEnhancedComponentClasses('pagination-item')}>3</button>
  <button className={getEnhancedComponentClasses('pagination-item')}>&raquo;</button>
</div>
```

### 7. Efecte vizuale speciale

```tsx
// Text cu gradient animat
<h2 className={getEnhancedComponentClasses('fx-gradient-text', 'primary', undefined, undefined, ['animated-gradient'])}>
  Titlu cu gradient animat
</h2>

// Efect de sticlă (glassmorphism)
<div className={getEnhancedComponentClasses('fx-glass', undefined, undefined, undefined, ['border-light', 'shadow-sm'])}>
  Conținut pe fundal blur
</div>

// Efect de strălucire la hover
<button 
  className={classNames(
    getEnhancedComponentClasses('button', 'primary', undefined, undefined, ['shadow-glow', 'pulse-on-hover'])
  )}
>
  Buton cu strălucire și pulsare
</button>

// Card cu efect de gradient animat pe border
<div className={getEnhancedComponentClasses('card', 'primary', 'md', undefined, ['gradient-border-animated'])}>
  Card cu border animat
</div>

// Efect de apariție treptată (fade-in)
<div className={getEnhancedComponentClasses('container', undefined, undefined, undefined, ['fade-in'])}>
  Conținut cu apariție treptată
</div>

// Efect de deplasare la scroll
<section className={getEnhancedComponentClasses('section', undefined, undefined, undefined, ['parallax-scroll'])}>
  Secțiune cu efect parallax la scroll
</section>

// Text cu efect de tastare (typewriter)
<h3 className={getEnhancedComponentClasses('heading', undefined, undefined, undefined, ['typewriter'])}>
  Text cu efect de tastare
</h3>
```

## Recomandări de performanță

1. **Evitați folosirea excesivă a efectelor** - Gradienții și umbrele pot afecta performanța pe dispozitive mai slabe. Folosiți-le cu moderație.

2. **Combinați clasele cu classNames** - Pentru a evita string-uri lungi de clase:
   ```tsx
   import classNames from 'classnames';
   
   const classes = classNames(
     getEnhancedComponentClasses('button', 'primary'),
     className, // clase suplimentare
     isActive && 'active-custom-class'
   );
   ```

3. **Memorați rezultatele** - Pentru componente care se re-renderizează frecvent, considerați memorarea rezultatelor funcției:
   ```tsx
   const buttonClasses = useMemo(() => 
     getEnhancedComponentClasses('button', variant, size, state),
     [variant, size, state]
   );
   ```

## Arhitectura sistemului de stiluri rafinate

Sistemul este structurat în următoarele componente cheie:

### 1. Definirea tipurilor (`themeTypes.ts`)

- `ComponentType`: Definește toate tipurile valide de componente (button, input, card, etc.)
- `ComponentVariant`: Definește variantele posibile (primary, secondary, success, etc.)
- `ComponentSize`: Definește dimensiunile acceptate (xs, sm, md, lg, xl, etc.)
- `ComponentState`: Definește stările posibile (active, disabled, hover, etc.)

### 2. Configurația componentelor (`componentMap/`)

Directorul `componentMap/` conține fișiere separate pentru fiecare categorie de componente:

- `actionComponents.ts`: Butoane și acțiuni (Button, IconButton, etc.)
- `formComponents.ts`: Componente de formular (Input, Select, Checkbox, etc.)
- `feedbackComponents.ts`: Alerte, notificări (Alert, Badge, Toast, etc.)
- `layoutComponents.ts`: Structuri de layout (Card, Container, Grid, etc.)
- `navigationComponents.ts`: Navigare (Tab, Sidebar, Navbar, etc.)
- `dataComponents.ts`: Prezentare date (Table, etc.)
- `utilityComponents.ts`: Efecte speciale și utilitare

### 3. Integrarea în sistem (`themeUtils.ts`)

Funcția `getEnhancedComponentClasses` face legătura între tipuri și configurație:

```typescript
export function getEnhancedComponentClasses(
  componentType: ComponentType,  // Tipul componentei (button, card, etc.)
  variant?: ComponentVariant,    // Varianta (primary, secondary, etc.)
  size?: ComponentSize,          // Dimensiunea (sm, md, lg, etc.)
  state?: ComponentState,        // Starea (disabled, active, etc.)
  effects?: string[]            // Efecte speciale adiționale
): string {
  // Returnează clasele CSS concatenate
}
```

## Extinderea sistemului

Pentru a adăuga noi stiluri sau componente, urmați aceast procedură standard:

### A. Adăugarea unui tip nou de componentă

1. Actualizați `themeTypes.ts` - adăugați noul tip în `ComponentType`
2. Identificați categoria potrivită din `componentMap/` (sau creați una nouă)
3. Adăugați configurația componentei cu următoarea structură:

```typescript
'component-name': {
  base: `clase-tailwind de bază pentru componentă`,
  variants: {
    primary: `clase pentru varianta primary`,
    secondary: `clase pentru varianta secondary`,
    // alte variante
  },
  sizes: {
    sm: `clase pentru dimensiunea sm`,
    md: `clase pentru dimensiunea md`,
    // alte dimensiuni
  },
  states: {
    disabled: `clase pentru starea disabled`,
    // alte stări
  }
},
```

### B. Adăugarea unui efect vizual nou

1. Identificați dacă efectul este specific unei componente sau general
2. Pentru efecte specifice, extindeți configurația componentei respective
3. Pentru efecte generale, adăugați-le în `utilityComponents.ts`:

```typescript
'fx-effect-name': {
  base: `clase-tailwind pentru efect`,
  variants: {
    // variante de efect dacă este cazul
  }
},
```

### C. Modificarea unei componente existente

1. Localizați configurația componentei în fișierul corespunzător din `componentMap/`
2. Extindeți/modificați configurația existentă păstrând structura
3. Verificați că modificările nu afectează compat-itatea cu codul existent
4. Actualizați documentația dacă e necesar

## Recomandări de performanță și bune practici

Pentru a menține o performanță bună a aplicației și a asigura consistența vizuală, respectați următoarele recomandări:

### Performanță

- Evitați suprapunerea mai mult de 3 efecte vizuale pe același element
- Pentru efecte complexe (gradient-border-animated, parallax), asigurați-vă că sunt aplicate doar pe elemente vizibile în viewport
- Preferați efecte bazate pe CSS (`transform`, `opacity`, `filter`) în loc de JavaScript când este posibil
- Utilizați tehnici de lazy loading pentru pagini cu multe efecte vizuale
- Testatți pe dispozitive mai vechi pentru a vă asigura că performanța rămâne acceptabilă
- Pentru animații, optați pentru proprietatea `transform` în loc de modificarea poziției sau dimensiunilor
- Utilizați `will-change` doar pentru elementele care au realmente nevoie de optimizare, nu pentru toate efectele

### Accesibilitate

- Asigurați-vă că efectele vizuale nu distrag utilizatorii sau nu afectează lizibilitatea
- Respectați contrastul minim text/fundal conform WCAG 2.1 (min 4.5:1 pentru text normal, 3:1 pentru text mare)
- Dezactivați animațiile pentru utilizatorii care preferă mișcare redusă (`prefers-reduced-motion`)
- Păstrați focus-states vizibile pentru navigarea cu tastatura
- Testatți cu screen reader-e pentru a vă asigura că efectele nu afectează accesibilitatea

### Consistență și mentenanță

- IMPORTANT: Folositi întotdeauna design tokens din sistem, nu valori hardcodate
- Grupati efectele vizuale în funcție de scopul lor, nu de aspectul vizual
- Documentați orice excepții sau efecte custom în comentarii
- La fiecare componentă nouă, verificați dacă respectați aceleași principii vizuale ca în celelalte componente
- Testati cross-browser pentru consistenta vizuala (Chrome, Firefox, Safari, Edge)
- Păstrați documentatia codului actualizată, în special pentru noile efecte sau variantă de componente

### Îmbunătățirea continuă

- Colectati feedback de la utilizatori cu privire la efectele vizuale pentru a le îmbunătăți continuu
- Pentru efecte noi, creați mai întâi un prototip izolat, testat cu utilizatori reali înainte de integrare
- Monitorizați metricile de performanță pentru pagini cu multe efecte vizuale
- Revizuiți periodic efectele și eliminați cele neutilizate

## Metode de implementare corectă

### A. Utilizarea componentelor primitive predefinite (recomandat)

```tsx
// Metoda recomandată: Utilizați componentele primitive preexistente
import { Button } from '../components/primitives/Button';

<Button 
  variant="primary" 
  size="md"  
  withGradient 
  withShadow
>
  Acțiune
</Button>
```

### B. Utilizarea `getEnhancedComponentClasses` pentru clasele CSS

```tsx
// Metoda alternativă: Utilizarea directă a funcției helper 
<button 
  className={getEnhancedComponentClasses(
    'button', 
    'primary', 
    'md', 
    undefined, 
    ['shadow-glow', 'pulse-on-hover']
  )}
>
  Acțiune
</button>
```

### C. Metode de combinație incorecte (NU FOLOSIȚI)

```tsx
// ❌ INCORECT: Stiluri hardcodate 
<button className="bg-blue-500 hover:bg-blue-600 rounded-md px-4 py-2 text-white shadow-lg">
  Buton cu clase hardcodate
</button>

// ❌ INCORECT: Amestecând clasele din design system cu clase custom
<button className={`${getEnhancedComponentClasses('button', 'primary')} my-custom-shadow rounded-xl`}>
  Buton cu amestec de clase
</button>
```

## Migrarea componentelor existente

Pentru a migra componente existente la noile stiluri rafinate:

1. Importați `getEnhancedComponentClasses` din `themeUtils.ts`
2. Înlocuiți clasele hardcodate cu apeluri la această funcție
3. Păstrați props-urile existente pentru compatibilitate
4. Adăugați noile props pentru efecte vizuale (withGradient, withShadow, etc.)
5. Testați toate stările componentei pentru a vă asigura că stilizarea e consistentă

## Exemplu de migrare

### Înainte:

```tsx
const Button = ({ variant = 'primary', size = 'md', disabled, children }) => (
  <button 
    className={`
      px-4 py-2 rounded-md font-medium 
      ${variant === 'primary' ? 'bg-blue-600 text-white' : ''}
      ${variant === 'secondary' ? 'bg-gray-200 text-gray-800' : ''}
      ${size === 'sm' ? 'text-sm' : ''}
      ${size === 'lg' ? 'text-lg px-6 py-3' : ''}
      ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
    `}
    disabled={disabled}
  >
    {children}
  </button>
);
```

### După:

```tsx
// Import din locația corectă
import { getEnhancedComponentClasses } from '../../styles/themeUtils';

// Adăugarea noilor props pentru efecte vizuale
interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'success' | 'error' | 'warning';
  size?: 'xs' | 'sm' | 'md' | 'lg';
  disabled?: boolean;
  withShadow?: boolean;
  withGradient?: boolean;
  withTranslate?: boolean;
  children: React.ReactNode;
  className?: string;
  'data-testid'?: string;
}

const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  disabled,
  withShadow = false,
  withGradient = false,
  withTranslate = false,
  children,
  ...rest
}) => {
  // Colectarea efectelor vizuale într-un array
  const effects: string[] = [];
  if (withShadow) effects.push('shadow-glow');
  if (withGradient) effects.push('gradient-bg');
  if (withTranslate) effects.push('translate-on-hover');
  
  return (
    <button 
      className={getEnhancedComponentClasses(
        'button', 
        variant, 
        size, 
        disabled ? 'disabled' : undefined,
        effects
      )}
      disabled={disabled}
      {...rest}
    >
      {children}
    </button>
  );
};
```

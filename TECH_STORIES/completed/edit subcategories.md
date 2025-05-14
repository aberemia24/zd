# Implementare Personalizare Subcategorii

## User Story

**Titlu:** Personalizarea subcategoriilor în Grid Lunar

**Ca** utilizator al aplicației de bugetare,  
**Vreau să** pot adăuga, edita și șterge subcategorii direct din Grid-ul Lunar,  
**Pentru ca** să-mi pot personaliza mai bine structura bugetului conform nevoilor mele specifice.

### Criterii de Acceptare

- [x] Pot adăuga subcategorii noi la categoriile principale existente
- [x] Pot redenumi subcategorii existente
- [x] Pot șterge subcategorii personalizate cu confirmare prealabilă
- [x] La ștergerea unei subcategorii, am opțiunea să migrez tranzacțiile existente sau să le șterg
- [x] Modificările sunt reflectate imediat în Grid-ul Lunar
- [x] Modificările sunt propagate în formularul de adăugare tranzacții
- [x] Categoriile principale rămân neschimbate
- [x] Subcategoriile personalizate persistă între sesiuni

## Status Implementare

- [2025-05-09] Branch: `feature/subcategory-customization`
- [x] Migrare DB aplicată (`custom_categories`)
- [x] Tipuri TypeScript definite (`frontend/src/types/Category.ts`)
- [x] categoryService.ts implementat (CRUD + utilitare)
- [x] categoryStore.ts Zustand implementat (fuziune, acțiuni CRUD)
- [x] UI modal CategoryEditor implementat (adăugare, redenumire, ștergere)
- [x] Integrare cu store-ul de tranzacții - categorii încărcate și fuzionate în LunarGridPage
- [x] Integrare TransactionForm - dropdown-uri actualizate pentru a folosi categoriile personalizate + predefinite
- [x] Integrare TransactionFilters și butoane acțiune în LunarGrid
- [x] Bug fix pentru "Cannot update a component while rendering a different component"
- [x] Remediere problemă Supabase upsert pentru categorii personalizate
- [x] Documentare lecții învățate în BEST_PRACTICES.md (interacțiune Supabase jsonb, manipulare state React)
- [ ] Testare și QA (in progres)

## Lecții învățate în timpul implementării

### 1. Interacțiune robustă cu Supabase jsonb și upsert

- **Context**: Implementare salvare/actualizare categorii personalizate în Supabase cu câmpuri jsonb
- **Problemă**: Eroarea 400 Bad Request la upsert fără constrângere UNIQUE pe user_id
- **Soluție**: Înlocuire upsert cu pattern robust select-then-insert/update
  ```typescript
  // Verificare dacă există înregistrare pentru user
  const { data } = await supabase
    .from(TABLE)
    .select('id')
    .eq('user_id', userId);
  
  // Alegere între INSERT sau UPDATE în funcție de rezultat
  if (!data || data.length === 0) {
    await supabase.from(TABLE).insert([payload]);
  } else {
    await supabase.from(TABLE).update(payload).eq('user_id', userId);
  }
  ```
- **Documentat** în `BEST_PRACTICES.md` la secțiunea "Interacțiune robustă cu Supabase jsonb și upsert"

### 2. Separarea stărilor pentru moduri de operare conflictuale în React

- **Context**: Implementare UI pentru editare/ștergere subcategorii în componenta `CategoryEditor` 
- **Problemă**: Eroarea "Cannot update a component while rendering a different component" când același state era modificat în componente diferite
- **Soluție**: Implementare state separat pentru fiecare mod de operare + useEffect pentru manipularea stării
  ```typescript
  // State separat pentru operațiuni
  const [editingSubcat, setEditingSubcat] = useState(null);
  const [deletingSubcat, setDeletingSubcat] = useState(null);
  const [deleteMode, setDeleteMode] = useState(false);
  
  // Manipulare de state în useEffect cu dependențe complete
  React.useEffect(() => {
    if (condition) {
      setState(newValue);
    }
  }, [condition, otherDependencies]);
  ```
- **Documentat** în `BEST_PRACTICES.md` la secțiunea "Separarea stărilor pentru moduri de operare conflictuale în React"

## Plan de Implementare

### 1. Schema DB și Modele de Date

- [ ] Creare tabel `custom_categories` în Supabase
```sql
CREATE TABLE custom_categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  category_data JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  version INTEGER DEFAULT 1
);
```

- [ ] Adăugare politici RLS pentru securitate
```sql
ALTER TABLE custom_categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can only access their own categories"
  ON custom_categories
  FOR ALL
  USING (auth.uid() = user_id);
```

- [ ] Validare simplă la nivel DB
```sql
-- Constrain pentru a asigura structure de bază validă
ALTER TABLE custom_categories 
ADD CONSTRAINT check_category_data 
CHECK (jsonb_typeof(category_data) = 'object');
```

### 2. Servicii

- [ ] Creare `categoryService.ts` (nou)
  - [ ] Metoda `getUserCategories(userId)` - obține categoriile personalizate
  - [ ] Metoda `saveUserCategories(userId, categoryData)` - salvează categoriile personalizate
  - [ ] Metoda `updateTransactionsForSubcategoryRename(userId, category, oldName, newName)` - actualizează tranzacțiile la redenumire
  - [ ] Metoda `handleSubcategoryDeletion(userId, category, subcategory, action, target)` - gestionează ștergerea subcategoriilor
  - [ ] Metoda `getAvailableSubcategoriesForMigration(userId, category, excludeSubcategory)` - obține subcategoriile disponibile pentru migrare
  - [ ] Metoda `checkForDuplicateSubcategory(userId, category, group, subcategoryName)` - verifică duplicate

- [ ] Actualizare `supabaseService.ts`
  - [ ] Integrare cu `categoryService`

### 3. Store-uri

- [ ] Creare `categoryStore.ts` (nou)
  - [ ] State pentru categorii fuzionate
  - [ ] Metoda `loadUserCategories()` - încarcă categoriile personalizate
  - [ ] Metoda `saveCategories(categories)` - salvează categoriile personalizate
  - [ ] Metoda `renameSubcategory(category, group, oldName, newName)` - redenumește subcategoria
  - [ ] Metoda `deleteSubcategory(category, group, subcategory, action, target)` - șterge subcategoria
  - [ ] Algoritm de fuziune între categoriile predefinite și cele personalizate
    - [ ] Logică pentru detectarea și gestionarea duplicatelor (prioritate pentru versiunea personalizată)

- [ ] Actualizare `transactionStore.ts`
  - [ ] Metoda de refresh după modificarea categoriilor
  - [ ] Integrare cu `categoryStore`

### 4. Componente UI

- [ ] Creare `CategoryEditor.tsx` (componentă modală nouă)
  - [ ] UI pentru listarea categoriilor/grupurilor/subcategoriilor
  - [ ] Form pentru adăugare/editare subcategorii
  - [ ] Validare nume subcategorie (duplicat, lungime, caractere speciale)
  - [ ] Dialog de confirmare pentru ștergere
  - [ ] Opțiuni pentru migrarea tranzacțiilor:
    - [ ] Dropdown cu subcategoriile disponibile în aceeași categorie/grup
    - [ ] Mesaj special când nu există subcategorii pentru migrare
    - [ ] Opțiune "Șterge tranzacțiile" cu avertisment clar

- [ ] Actualizare `LunarGrid.tsx`
  - [ ] Adăugare butoane de acțiune pe subcategorii (editare/ștergere)
  - [ ] Buton de adăugare subcategorie nouă la finalul fiecărui grup
  - [ ] Integrare cu `CategoryEditor`
  - [ ] Refresh Grid după modificări
  - [ ] Indicator vizual pentru subcategorii personalizate vs. predefinite

- [ ] Actualizare `TransactionForm.tsx`
  - [ ] Utilizare categorii fuzionate din `categoryStore`
  - [ ] Actualizare dropdown-urilor la modificarea categoriilor

- [ ] Actualizare `TransactionFilters.tsx`
  - [ ] Utilizare categorii fuzionate din `categoryStore`

### 5. Pagini

- [ ] Actualizare `LunarGridPage.tsx`
  - [ ] Integrare buton de gestionare categorii
  - [ ] Inițializare `categoryStore` la încărcare

- [ ] Actualizare `TransactionsPage.tsx` (opțional)
  - [ ] Acces la editor categorii

### 6. Mecanisme de Propagare

- [ ] Implementare invalidare cache selectivă
  - [ ] Invalidare cache după modificarea categoriilor
  - [ ] Refresh doar a componentelor afectate

- [ ] Implementare listener pentru modificări categorii
  - [ ] Actualizare automată a UI-urilor dependente

### 7. Testare și QA

- [ ] Teste unitare pentru `categoryService`
  - [ ] Test fuziune categorii cu gestionare duplicate
  - [ ] Test migrare tranzacții

- [ ] Teste unitare pentru `categoryStore`
  - [ ] Test persistență și încărcare

- [ ] Teste componente pentru `CategoryEditor`
  - [ ] Test validare formular
  - [ ] Test UI pentru migrare

- [ ] Teste E2E pentru fluxul complet
  - [ ] Test adăugare, editare, ștergere subcategorie
  - [ ] Test migrare tranzacții

## Clarificări & Decizii de Implementare

### 1. Versionare și Conflicte

- **Strategie pentru V1**: "Last-write wins" - ultima modificare persistă
- **Implementare**: Utilizăm câmpul `version` incrementat la fiecare modificare
- **Motivație**: Simplitate și acoperă cazul utilizator single cu multiple tabs
- **Future V2**: Dacă se dovedește a fi nevoie, putem evolua spre:
  - Semnalizare vizuală a conflictelor
  - Mecanism simplu de merge automat pe subcategorii
  - Fără UI complex de conflict resolution, nepotrivit pentru target-ul aplicației

### 2. Tranzacții Orfane

- **Abordare pragmatică**: Validare preventivă + feedback clar
- **Implementare**: 
  - Verificare la salvare/ștergere că toate tranzacțiile au subcategorii valide
  - Niciun job nightly (complexitate inutilă pentru V1)
- **Recovery**: În cazul rar al incidentelor, adăugăm o subcategorie "Altele" care servește și ca fallback

### 3. Feedback UX la Acțiuni Critice

- **Pattern**: Folosim toast/snackbar existent în aplicație
- **Implementare**:
  - Toast de succes la adăugare/editare reușită
  - Dialog modal de confirmare pentru operații distructive (ștergere/migrare)
  - Consistent cu restul UX-ului aplicației

### 4. Sincronizare Multi-Device

- **Abordare V1**: Refresh manual + management versiune
- **Implementare**:
  - Buton de refresh explicit în UI
  - Încărcare automată la navigarea între pagini
  - Versioning simplu pentru detectarea modificărilor
- **Justificare**: Suficient pentru use-case-ul actual
- **Future V2**: Dacă feedback-ul utilizatorilor o cere, putem adăuga polling la interval

### 5. Edge Cases Tratate

- **Subcategorii duplicate**: Priorizam versiunea personalizată
- **Migrare fără opțiuni**: UI specific cu doar opțiunea de ștergere + avertisment
- **Conflicte de modificare**: Last-write wins cu menținerea integrității datelor
- **Ștergere cont**: CASCADE normal în Supabase (simpler is better)

### 6. Exportul categoriilor (Future V2)
- **Format**: JSON simplu, structure identică cu cea din DB
- **Validare**: Verificare structură de bază la import
- **Implementare**: Funcționalitate de export/import ca upgrade ulterior

## Fișiere Afectate

### Fișiere Noi

- [ ] `frontend/src/services/categoryService.ts`
- [ ] `frontend/src/stores/categoryStore.ts`
- [ ] `frontend/src/components/features/CategoryEditor/CategoryEditor.tsx`
- [ ] `frontend/src/components/features/CategoryEditor/index.ts`
- [ ] `frontend/src/components/features/CategoryEditor/MigrationDialog.tsx` (componentă separată)
- [ ] `frontend/src/types/Category.ts` (tipuri pentru categorii personalizate)

### Modificări în Fișiere Existente

- [ ] `shared-constants/categories.ts`
  - [ ] Posibil refactor pentru a facilita fuziunea cu override-uri

- [ ] `shared-constants/index.ts`
  - [ ] Export pentru noi utilități de categorii

- [ ] `frontend/src/services/supabaseService.ts`
  - [ ] Integrare cu managementul categoriilor

- [ ] `frontend/src/stores/transactionStore.ts`
  - [ ] Integrare cu categoryStore
  - [ ] Refresh la modificarea categoriilor

- [ ] `frontend/src/components/features/LunarGrid/LunarGrid.tsx`
  - [ ] UI pentru editare subcategorii
  - [ ] Handlers pentru acțiuni pe subcategorii

- [ ] `frontend/src/components/features/TransactionForm/TransactionForm.tsx`
  - [ ] Utilizarea categoriilor fuzionate
  - [ ] Reacție la modificarea categoriilor

- [ ] `frontend/src/components/features/TransactionFilters/TransactionFilters.tsx`
  - [ ] Actualizare filtre conform categoriilor modificate

- [ ] `frontend/src/pages/LunarGridPage.tsx`
  - [ ] Integrare editor categorii

## Dependințe și Riscuri

### Dependințe Transversale

- `LunarGrid` → `categoryStore` → `supabaseService`
- `TransactionForm` → `categoryStore` → `supabaseService`
- `categoryStore` → `transactionStore` (pentru refresh)

### Riscuri Tehnice

- [ ] **Caching și Sincronizare**
  - Risc: Cache-ul pentru categorii poate deveni desincronizat
  - Soluție: Implementare sistem de invalidare la modificări
  - Mitigare: Refresh explicit la navigare + buton manual de refresh

- [ ] **Consistența Datelor**
  - Risc: Tranzacțiile cu subcategorii șterse pot deveni invalide
  - Soluție: Dialog de confirmare cu opțiuni de migrare
  - Mitigare: Validare preventivă + categoria default "Altele" ca fallback

- [ ] **Memorie locală vs Server**
  - Risc: Inconsistențe între categoriile locale și cele din server
  - Soluție: Single source of truth și fuziune la runtime
  - Mitigare: Versioning simplu + last-write wins pentru V1

- [ ] **Performanță**
  - Risc: Reîncărcarea frecventă a datelor poate afecta performanța
  - Soluție: Optimizare prin caching și invalidare selectivă

## Decizii Pragmatice MVP

### Preseturi categorii
- Se vor folosi 2-3 preseturi predefinite, hardcodate ca array static.
- Implementare: buton "Încarcă preset" cu dropdown (doar preseturile noastre, fără import custom inițial).
- Ușor de extins ulterior dacă există cerere pentru preseturi custom/import.

### Statistici subcategorii
- Strict count de tranzacții per subcategorie (datele deja există în sistem).
- UI minimal: badge mic cu număr lângă numele subcategoriei în editor.
- Fără grafice sau vizualizări complexe în V1.

### Fallback "Altele"
- Subcategoria "Altele" apare automat dacă există tranzacții orfane.
- Poate fi adăugată manual de utilizator ca orice altă subcategorie.
- Este protejată împotriva ștergerii dacă are tranzacții asociate.
- Nu aglomerează UI-ul; vizibilă doar când e relevantă.

### Export/import
- Doar JSON validat la import, fără UI de mapping/transformare.
- Validare de bază pentru structura JSON + integritate minimă.
- Avertisment clar la import despre suprascrierea categoriilor existente.
- Funcționalitate planificată pentru V2, după validarea conceptului.

### UX feedback
- Toast/snackbar pentru succes/eroare este suficient în V1.
- Opțional: highlight temporar (flash) pentru rândurile modificate în grid.
- Fără indicatori vizuali permanenți.
- Experiență simplă, fără a complica UI-ul inutil.

## Future Improvements (V2)

- [ ] Sincronizare îmbunătățită între dispozitive (polling controlat)
- [ ] Export/import categorii personalizate în format JSON (cu validare și avertisment la suprascriere)
- [ ] Statistici simple pentru utilizarea subcategoriilor (număr tranzacții, posibil extindere cu vizualizări dacă există cerere)
- [ ] Presetări de categorii suplimentare sau customizabile (extindere peste array-ul static inițial)

## Resurse și Documentație

- [Documentație Supabase](https://supabase.com/docs)
- [Zustand Store Management](https://github.com/pmndrs/zustand)
- [Best Practices pentru React Components](https://reactjs.org/docs/thinking-in-react.html)

---

**Estimare:** ~5-7 zile de dezvoltare pentru V1  
**Prioritate:** Medium-High  
**Owner:** TBD
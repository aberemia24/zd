// Componenta principală a aplicației - orchestrator pentru rutare între pagini
import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom'; // Importuri react-router-dom

import TransactionsPage from './pages/TransactionsPage';
import LunarGridPage from './pages/LunarGridPage';
import OptionsPage from './pages/OptionsPage';
import LoginForm from './components/features/Auth/LoginForm';
import RegisterForm from './components/features/Auth/RegisterForm';
import { Toaster } from 'react-hot-toast';
import Spinner from './components/primitives/Spinner';
import NavLink from './components/primitives/NavLink';
import { TITLES } from '@shared-constants';
import { cn } from './styles/new/shared/utils';
import { container, flex } from './styles/new/components/layout';

// Import store Zustand pentru autentificare
import { useAuthStore } from './stores/authStore';
// Import pentru inițializarea categoriilor
import { useCategoryStore } from './stores/categoryStore';
import { CATEGORIES } from '@shared-constants/categories';

/**
 * Componenta principală a aplicației, refactorizată pentru a utiliza custom hooks și servicii
 * Migrated la CVA styling system pentru consistență
 * 
 * Structura:
 * 
 * Această structură separă clar logica de business de UI, crescând testabilitatea, 
 * mentenabilitatea și facilitând extinderea ulterioară.
 */
export const App: React.FC = () => {
  console.log('🔜 App render using react-router-dom');
  
  const { user, loading, checkUser } = useAuthStore();
  
  // Inițializarea categoriilor la nivel global
  const loadCategories = useCategoryStore(state => state.loadUserCategories);
  const mergeWithDefaults = useCategoryStore(state => state.mergeWithDefaults);
  
  // Verificăm dacă utilizatorul este autentificat
  useEffect(() => {
    checkUser();
  }, [checkUser]);
  
  // Inițializăm categoriile după autentificare
  useEffect(() => {
    // Nu încărcăm categoriile dacă utilizatorul nu este autentificat
    if (!user) return;
    
    console.log('[App] Inițializare categorii globală');
    
    const initializeCategories = async () => {
      try {
        // 1. Mai întâi încărcăm categoriile personalizate din DB
        await loadCategories(user.id);
        
        // 2. Apoi fuzionăm cu cele predefinite din CATEGORIES (shared-constants)
        // Conversia e necesară pentru că CATEGORIES are un format ușor diferit de CustomCategory[]
        const defaultCategories = Object.entries(CATEGORIES).map(([name, subcats]) => ({
          name,
          subcategories: Object.values(subcats).flat().map(subcatName => ({
            name: subcatName,
            isCustom: false
          })),
          isCustom: false
        }));
        
        // 3. Fuziune - prioritate pentru cele personalizate
        mergeWithDefaults(defaultCategories);
        
        console.log('[App] Categorii inițializate cu succes');
      } catch (error) {
        console.error('[App] Eroare la inițializarea categoriilor:', error);
      }
    };
    
    initializeCategories();
  }, [user, loadCategories, mergeWithDefaults]);
  
  // Afișează spinner în timpul încărcării stării de autentificare
  if (loading) {
    return (
            <div className={cn(        container({ size: 'lg' }),        'min-h-screen flex items-center justify-center'      )}>        <Spinner size="xl" />      </div>
    );
  }

  // Rute protejate și publice
  // Dacă utilizatorul nu este autentificat, și încearcă să acceseze o rută protejată, va fi redirecționat
  // la /login. Pagina de login va fi ruta implicită dacă nu e logat.

  return (
    <>
      <Toaster position="top-right" toastOptions={{ duration: 3500 }} />
      <div className={container({ size: 'lg' })}>
        {user && ( /* Afișează navigarea doar dacă utilizatorul este logat */ 
          <div className={cn(
            flex({ direction: 'row', gap: 'lg', justify: 'start' }),
            'border-b border-gray-200 mb-6 pb-4'
          )}>
            <NavLink to="/transactions" testId="transactions-tab">
              {TITLES.TRANZACTII}
            </NavLink>
            <NavLink to="/lunar-grid" testId="lunar-grid-tab">
              {TITLES.GRID_LUNAR}
            </NavLink>
            <NavLink to="/options" testId="options-tab">
              {TITLES.OPTIUNI || 'Opțiuni'}
            </NavLink>
          </div>
        )}
        
        <Routes>
          {user ? (
            <>
              <Route path="/" element={<Navigate to="/transactions" replace />} />
              <Route path="/transactions" element={<TransactionsPage />} />
              <Route path="/lunar-grid" element={<LunarGridPage />} />
              <Route path="/options" element={<OptionsPage />} />
              {/* Orice altă rută pentru utilizator logat, redirecționează la tranzacții */}
              <Route path="*" element={<Navigate to="/transactions" replace />} />
            </>
          ) : (
            <>
              {/* Rute publice pentru login și register */}
              <Route path="/login" element={<LoginForm />} /> {/* Simplificat: LoginForm va avea link către /register */}
              <Route path="/register" element={<RegisterForm />} /> {/* Simplificat: RegisterForm va avea link către /login */}
              {/* Orice altă rută, inclusiv rădăcina, redirecționează la login dacă nu e logat */}
              <Route path="*" element={<Navigate to="/login" replace />} />
            </>
          )}
        </Routes>
      </div>
    </>
  );
};

export default App;

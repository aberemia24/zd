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
import { getEnhancedComponentClasses } from './styles/themeUtils';

// Import store Zustand pentru autentificare
import { useAuthStore } from './stores/authStore';

/**
 * Componenta principală a aplicației, refactorizată pentru a utiliza custom hooks și servicii
 * 
 * Structura:
 * 
 * Această structură separă clar logica de business de UI, crescând testabilitatea, 
 * mentenabilitatea și facilitând extinderea ulterioară.
 */
export const App: React.FC = () => {
  console.log('🔜 App render using react-router-dom');
  
  const { user, loading, checkUser } = useAuthStore();

  useEffect(() => {
    checkUser();
  }, [checkUser]);
  
  // Afișează spinner în timpul încărcării stării de autentificare
  if (loading) {
    return (
      <div className={getEnhancedComponentClasses('container', 'primary', undefined, 'loading', ['centered', 'fixed'])}>
        <Spinner sizeVariant="xl" />
      </div>
    );
  }

  // Rute protejate și publice
  // Dacă utilizatorul nu este autentificat, și încearcă să acceseze o rută protejată, va fi redirecționat
  // la /login. Pagina de login va fi ruta implicită dacă nu e logat.

  return (
    <>
      <Toaster position="top-right" toastOptions={{ duration: 3500 }} />
      <div className={getEnhancedComponentClasses('container', 'primary', 'lg')}>
        {user && ( /* Afișează navigarea doar dacă utilizatorul este logat */ 
          <div className={getEnhancedComponentClasses('navbar-container', 'primary') + ' mb-6'}>
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

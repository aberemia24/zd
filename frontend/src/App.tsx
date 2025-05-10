// Componenta principală a aplicației - orchestrator pentru rutare între pagini
import React, { useEffect } from 'react';
import { Routes, Route, Link, Navigate, useLocation } from 'react-router-dom'; // Importuri react-router-dom

import TransactionsPage from './pages/TransactionsPage';
import LunarGridPage from './pages/LunarGridPage';
import OptionsPage from './pages/OptionsPage';
import LoginForm from './components/features/Auth/LoginForm';
import RegisterForm from './components/features/Auth/RegisterForm';
import { Toaster } from 'react-hot-toast';
import Spinner from './components/primitives/Spinner';
import { TITLES } from '@shared-constants';

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
  const location = useLocation(); // Hook pentru a obține locația curentă

  useEffect(() => {
    checkUser();
  }, [checkUser]);
  
  // Afișează spinner în timpul încărcării stării de autentificare
  if (loading) {
    return (
      <div className="fixed inset-0 bg-white/60 flex items-center justify-center z-50">
        <Spinner size={60} />
      </div>
    );
  }

  // Rute protejate și publice
  // Dacă utilizatorul nu este autentificat, și încearcă să acceseze o rută protejată, va fi redirecționat
  // la /login. Pagina de login va fi ruta implicită dacă nu e logat.

  return (
    <>
      <Toaster position="top-right" toastOptions={{ duration: 3500 }} />
      <div className="max-w-[1200px] mx-auto my-8 font-sans">
        {user && ( /* Afișează navigarea doar dacă utilizatorul este logat */ 
          <div className="flex border-b border-gray-200 mb-6">
            <Link 
              to="/transactions"
              className={`py-2 px-4 font-medium ${location.pathname === '/transactions' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
              data-testid="transactions-tab"
            >
              {TITLES.TRANZACTII}
            </Link>
            <Link 
              to="/lunar-grid"
              className={`py-2 px-4 font-medium ${location.pathname === '/lunar-grid' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
              data-testid="lunar-grid-tab"
            >
              {TITLES.GRID_LUNAR}
            </Link>
            <Link 
              to="/options"
              className={`py-2 px-4 font-medium ${location.pathname === '/options' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
              data-testid="options-tab"
            >
              {TITLES.OPTIUNI || 'Opțiuni'}
            </Link>
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

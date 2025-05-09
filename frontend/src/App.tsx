// Componenta principală a aplicației - orchestrator pentru rutare între pagini
import React from 'react';
import TransactionsPage from './pages/TransactionsPage';
import LunarGridPage from './pages/LunarGridPage';
import OptionsPage from './pages/OptionsPage';
import LoginForm from './components/features/Auth/LoginForm';
import RegisterForm from './components/features/Auth/RegisterForm';
import { Toaster } from 'react-hot-toast';
import Spinner from './components/primitives/Spinner';
import { TITLES } from '@shared-constants';

// Import store Zustand pentru tranzacții
import { useTransactionStore } from './stores/transactionStore';
import type { TransactionState } from './stores/transactionStore';

/**
 * Componenta principală a aplicației, refactorizată pentru a utiliza custom hooks și servicii
 * 
 * Structura:
 * 
 * Această structură separă clar logica de business de UI, crescând testabilitatea, 
 * mentenabilitatea și facilitând extinderea ulterioară.
 */
import { useAuthStore } from './stores/authStore';

export const App: React.FC = () => {
  console.log('🔜 App render');
  
  // Verificăm sesiunea la pornirea aplicației pentru a menține utilizatorul autentificat la refresh
  React.useEffect(() => {
    // Verificăm dacă există o sesiune activă
    useAuthStore.getState().checkUser();
  }, []);
  

  // State pentru pagina activă (tranzacții, grid lunar sau opțiuni)
  const [activePage, setActivePage] = React.useState<'transactions' | 'lunar-grid' | 'options'>('transactions');

  const { user, loading } = useAuthStore();
  const [showRegister, setShowRegister] = React.useState(false);

  if (!user && !loading) {
    if (showRegister) {
      return <RegisterForm onSwitchToLogin={() => setShowRegister(false)} />;
    }
    return <LoginForm onSwitchToRegister={() => setShowRegister(true)} />;
  }

  if (loading) {
    return (
      <div className="fixed inset-0 bg-white/60 flex items-center justify-center z-50">
        <Spinner size={60} />
      </div>
    );
  }

  return (
    <>
      <Toaster position="top-right" toastOptions={{ duration: 3500 }} />
      <div className="max-w-[1200px] mx-auto my-8 font-sans">
        {/* Tabs pentru navigare între pagini */}
        <div className="flex border-b border-gray-200 mb-6">
          <button 
            className={`py-2 px-4 font-medium ${activePage === 'transactions' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActivePage('transactions')}
            data-testid="transactions-tab"
          >
            {TITLES.TRANZACTII}
          </button>
          <button 
            className={`py-2 px-4 font-medium ${activePage === 'lunar-grid' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActivePage('lunar-grid')}
            data-testid="lunar-grid-tab"
          >
            {TITLES.GRID_LUNAR}
          </button>
          <button 
            className={`py-2 px-4 font-medium ${activePage === 'options' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActivePage('options')}
            data-testid="options-tab"
          >
            {TITLES.OPTIUNI || 'Opțiuni'}
          </button>
        </div>
        
        {/* Afișăm pagina activă */}
        {activePage === 'transactions' && <TransactionsPage />}
        {activePage === 'lunar-grid' && <LunarGridPage />}
        {activePage === 'options' && <OptionsPage />}
      </div>
    </>
  );
};

export default App;

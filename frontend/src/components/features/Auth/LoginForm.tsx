import React, { useState } from 'react';
import { useAuthStore } from '../../../stores/authStore';
import toast from 'react-hot-toast';
import { MESAJE } from '@shared-constants';

interface LoginFormProps {
  onSwitchToRegister?: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onSwitchToRegister }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, logout, loading, error, errorType, user } = useAuthStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await login(email, password);
    const { error } = useAuthStore.getState();
    if (!error) {
      toast.success(MESAJE.LOGIN_SUCCES);
    } else {
      let msg = error;
      switch (errorType) {
        case 'INVALID_CREDENTIALS':
          msg = MESAJE.EROARE_AUTENTIFICARE || 'Date de autentificare incorecte.';
          break;
        case 'RLS_DENIED':
          msg = MESAJE.EROARE_RLS || 'Acces interzis (RLS).';
          break;
        case 'NETWORK':
          msg = MESAJE.EROARE_RETEA || 'Eroare de rețea. Încearcă din nou.';
          break;
        default:
          msg = error || MESAJE.LOGIN_ERROR;
      }
      toast.error(msg);
    }
  };

  return (
    <form className="max-w-sm mx-auto mt-12 p-6 bg-white rounded shadow" onSubmit={handleSubmit} data-testid="login-form">
      <h2 className="text-xl font-bold mb-4 text-center">Autentificare</h2>
      <div className="mb-4">
        <label htmlFor="email" className="block mb-1 font-medium">Email</label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="w-full border px-3 py-2 rounded"
          required
          data-testid="login-email"
        />
      </div>
      <div className="mb-4">
        <label htmlFor="password" className="block mb-1 font-medium">Parolă</label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="w-full border px-3 py-2 rounded"
          required
          data-testid="login-password"
        />
      </div>
      {error && (
        <div className="mb-2 text-red-600 text-center" data-testid="login-error">
          {(() => {
            switch (errorType) {
              case 'INVALID_CREDENTIALS':
                return 'Date de autentificare incorecte.';
              case 'RLS_DENIED':
                return 'Acces interzis (RLS).';
              case 'NETWORK':
                return 'Eroare de rețea. Încearcă din nou.';
              default:
                return error;
            }
          })()}
        </div>
      )}
      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition disabled:opacity-60"
        disabled={loading}
        data-testid="login-submit"
      >
        {loading ? 'Se autentifică...' : 'Autentificare'}
      </button>
      {onSwitchToRegister && (
        <button
          type="button"
          className="w-full mt-2 text-green-600 underline text-sm"
          onClick={onSwitchToRegister}
          data-testid="switch-to-register"
        >Nu ai cont? Creează unul!</button>
      )}
      {user && (
        <button
          type="button"
          className="w-full mt-2 text-red-600 underline text-sm"
          onClick={async () => {
            await logout();
            toast.success(MESAJE.LOGOUT_SUCCES);
          }}
          data-testid="logout-btn"
        >Logout</button>
      )}
    </form>
  );
};

export default LoginForm;

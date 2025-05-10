import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../../../stores/authStore';
import toast from 'react-hot-toast';
import { MESAJE } from '@shared-constants';

interface LoginFormProps {
}

const LoginForm: React.FC<LoginFormProps> = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, logout, loading, error, errorType } = useAuthStore();

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
    <form className="form-container max-w-sm mx-auto mt-12 p-token bg-secondary-50 rounded-token shadow-token" onSubmit={handleSubmit} data-testid="login-form">
      <h2 className="text-xl font-bold mb-token text-center text-headings">Autentificare</h2>
      <div className="mb-token">
        <label htmlFor="email" className="block mb-token font-medium text-secondary-700">Email</label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="input-field w-full"
          required
          data-testid="login-email"
        />
      </div>
      <div className="mb-token">
        <label htmlFor="password" className="block mb-token font-medium text-secondary-700">Parolă</label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="input-field w-full"
          required
          data-testid="login-password"
        />
      </div>
      {error && (
        <div className="mb-token text-error-600 text-center" data-testid="login-error">
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
        className="btn btn-primary w-full transition disabled:opacity-60"
        disabled={loading}
        data-testid="login-submit"
      >
        {loading ? 'Se autentifică...' : 'Autentificare'}
      </button>
      <div className="text-center mt-token">
        <Link 
          to="/register" 
          className="btn btn-link text-sm text-accent hover:text-accent-hover"
          data-testid="switch-to-register"
        >
          Nu ai cont? Creează unul!
        </Link>
      </div>
    </form>
  );
};

export default LoginForm;

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../../../stores/authStore';
import type { AuthErrorType } from '../../../services/supabaseAuthService';
import toast from 'react-hot-toast';
import { MESAJE } from '@shared-constants';

const RegisterForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const { register, loading, error, errorType } = useAuthStore();
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess(null);
    if (password !== confirm) {
      setSuccess(null);
      toast.error(MESAJE.PAROLE_NECORESPUNZATOARE);
      return;
    }
    await register(email, password);
    const { error } = useAuthStore.getState();
    if (!error) {
      setSuccess(MESAJE.REGISTER_SUCCES);
      toast.success(MESAJE.REGISTER_SUCCES);
    } else {
      let msg = error;
      switch (errorType) {
        case 'PASSWORD_WEAK':
          msg = MESAJE.PAROLA_PREA_SLABA || 'Parola trebuie să aibă minim 8 caractere, literă mare, mică, cifră și simbol.';
          break;
        case 'NETWORK':
          msg = 'Eroare de rețea. Încearcă din nou.';
          break;
        default:
          msg = error || MESAJE.REGISTER_ERROR;
      }
      toast.error(msg);
    }
  };

  return (
    <form className="form-container max-w-sm mx-auto mt-12 p-token bg-secondary-50 rounded-token shadow-token" onSubmit={handleSubmit} data-testid="register-form">
      <h2 className="text-xl font-bold mb-token text-center text-headings">Înregistrare</h2>
      <div className="mb-token">
        <label htmlFor="register-email" className="block mb-token font-medium text-secondary-700">Email</label>
        <input
          id="register-email"
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="input-field w-full"
          required
          data-testid="register-email"
        />
      </div>
      <div className="mb-token">
        <label htmlFor="register-password" className="block mb-token font-medium text-secondary-700">Parolă</label>
        <input
          id="register-password"
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="input-field w-full"
          required
          data-testid="register-password"
        />
      </div>
      <div className="mb-token">
        <label htmlFor="register-confirm" className="block mb-token font-medium text-secondary-700">Confirmă parola</label>
        <input
          id="register-confirm"
          type="password"
          value={confirm}
          onChange={e => setConfirm(e.target.value)}
          className="input-field w-full"
          required
          data-testid="register-confirm"
        />
      </div>
      {error && (
        <div className="mb-token text-error-600 text-center" data-testid="register-error">
          {(() => {
            switch (errorType as AuthErrorType) {
              case 'PASSWORD_WEAK':
                return 'Parola trebuie să aibă minim 8 caractere, literă mare, mică, cifră și simbol.';
              case 'NETWORK':
                return 'Eroare de rețea. Încearcă din nou.';
              default:
                return error;
            }
          })()}
        </div>
      )}
      {success && <div className="mb-token text-success-600 text-center" data-testid="register-success">{success}</div>}
      <button
        type="submit"
        className="btn btn-primary w-full transition disabled:opacity-60"
        disabled={loading}
        data-testid="register-submit"
      >
        {loading ? 'Se creează...' : 'Creează cont'}
      </button>
      <div className="text-center mt-token">
        <Link 
          to="/login" 
          className="btn btn-link text-sm text-accent hover:text-accent-hover"
          data-testid="switch-to-login"
        >
          Ai deja cont? Autentifică-te!
        </Link>
      </div>
    </form>
  );
};

export default RegisterForm;

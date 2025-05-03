import React, { useState } from 'react';
import { useAuthStore } from '../../../stores/authStore';
import type { AuthErrorType } from '../../../services/supabaseAuthService';
import toast from 'react-hot-toast';
import { MESAJE } from '@shared-constants';

const RegisterForm: React.FC<{ onSwitchToLogin?: () => void }> = ({ onSwitchToLogin }) => {
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
          msg = 'Parola trebuie să aibă minim 8 caractere, literă mare, mică, cifră și simbol.';
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
    <form className="max-w-sm mx-auto mt-12 p-6 bg-white rounded shadow" onSubmit={handleSubmit} data-testid="register-form">
      <h2 className="text-xl font-bold mb-4 text-center">Înregistrare</h2>
      <div className="mb-4">
        <label htmlFor="register-email" className="block mb-1 font-medium">Email</label>
        <input
          id="register-email"
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="w-full border px-3 py-2 rounded"
          required
          data-testid="register-email"
        />
      </div>
      <div className="mb-4">
        <label htmlFor="register-password" className="block mb-1 font-medium">Parolă</label>
        <input
          id="register-password"
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="w-full border px-3 py-2 rounded"
          required
          data-testid="register-password"
        />
      </div>
      <div className="mb-4">
        <label htmlFor="register-confirm" className="block mb-1 font-medium">Confirmă parola</label>
        <input
          id="register-confirm"
          type="password"
          value={confirm}
          onChange={e => setConfirm(e.target.value)}
          className="w-full border px-3 py-2 rounded"
          required
          data-testid="register-confirm"
        />
      </div>
      {error && (
        <div className="mb-2 text-red-600 text-center" data-testid="register-error">
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
      {success && <div className="mb-2 text-green-600 text-center" data-testid="register-success">{success}</div>}
      <button
        type="submit"
        className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition disabled:opacity-60"
        disabled={loading}
        data-testid="register-submit"
      >
        {loading ? 'Se creează...' : 'Creează cont'}
      </button>
      {onSwitchToLogin && (
        <button
          type="button"
          className="w-full mt-2 text-blue-600 underline text-sm"
          onClick={onSwitchToLogin}
          data-testid="switch-to-login"
        >Ai deja cont? Autentifică-te!</button>
      )}
    </form>
  );
};

export default RegisterForm;

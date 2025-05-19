import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../../../stores/authStore';
import type { AuthErrorType } from '../../../services/supabaseAuthService';
import toast from 'react-hot-toast';
import { MESAJE, LABELS, BUTTONS } from '@shared-constants';
import { getEnhancedComponentClasses } from '../../../styles/themeUtils';
import Input from '../../primitives/Input/Input';
import Button from '../../primitives/Button/Button';
import Alert from '../../primitives/Alert/Alert';

const RegisterForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const { register, loading, error, errorType } = useAuthStore();
  const [success, setSuccess] = useState<string | null>(null);
  const [activatedField, setActivatedField] = useState<string | null>(null);

  // Handleri pentru efecte de focus/blur
  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    setActivatedField(e.target.id);
  };

  const handleBlur = () => {
    setActivatedField(null);
  };

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
          msg = MESAJE.EROARE_RETEA || 'Eroare de rețea. Încearcă din nou.';
          break;
        default:
          msg = error || MESAJE.REGISTER_ERROR;
      }
      toast.error(msg);
    }
  };

  // Determinarea mesajului de eroare formatat
  const getErrorMessage = () => {
    switch (errorType as AuthErrorType) {
      case 'PASSWORD_WEAK':
        return MESAJE.PAROLA_PREA_SLABA || 'Parola trebuie să aibă minim 8 caractere, literă mare, mică, cifră și simbol.';
      case 'NETWORK':
        return MESAJE.EROARE_RETEA || 'Eroare de rețea. Încearcă din nou.';
      default:
        return error || '';
    }
  };

  return (
    <form 
      className={getEnhancedComponentClasses('form-container', 'primary', 'md', undefined, ['fade-in', 'shadow-md'])}
      onSubmit={handleSubmit} 
      data-testid="register-form"
    >
      <div className={getEnhancedComponentClasses('card-header', 'default', undefined, undefined, ['gradient-bg-subtle'])}>
        <h2 className={getEnhancedComponentClasses('form-label', 'primary', 'xl', undefined, ['gradient-text-subtle', 'text-center'])}>Înregistrare</h2>
      </div>
      
      <div className={getEnhancedComponentClasses('card-body', undefined, undefined, undefined, ['space-y-token'])}>
        {/* Email Input */}
        <Input
          id="register-email"
          type="email"
          label={`${LABELS.EMAIL}*`}
          value={email}
          onChange={e => setEmail(e.target.value)}
          onFocus={handleFocus}
          onBlur={handleBlur}
          required
          data-testid="register-email"
          withGlowFocus={activatedField === 'register-email'}
          withTransition
        />
        
        {/* Password Input */}
        <Input
          id="register-password"
          type="password"
          label={`${LABELS.PAROLA}*`}
          value={password}
          onChange={e => setPassword(e.target.value)}
          onFocus={handleFocus}
          onBlur={handleBlur}
          required
          data-testid="register-password"
          withGlowFocus={activatedField === 'register-password'}
          withTransition
        />
        
        {/* Confirm Password Input */}
        <Input
          id="register-confirm"
          type="password"
          label={`${LABELS.CONFIRMA_PAROLA}*`}
          value={confirm}
          onChange={e => setConfirm(e.target.value)}
          onFocus={handleFocus}
          onBlur={handleBlur}
          required
          data-testid="register-confirm"
          withGlowFocus={activatedField === 'register-confirm'}
          withTransition
        />
        
        {/* Error Message */}
        {error && (
          <Alert
            type="error"
            message={getErrorMessage()}
            data-testid="register-error"
            withIcon
            withFadeIn
            withAccentBorder
          />
        )}
        
        {/* Success Message */}
        {success && (
          <Alert
            type="success"
            message={success || ''}
            data-testid="register-success"
            withIcon
            withFadeIn
            withAccentBorder
          />
        )}
        
        {/* Submit Button */}
        <Button
          type="submit"
          variant="primary" 
          size="md"
          disabled={loading}
          isLoading={loading}
          data-testid="register-submit"
          className={getEnhancedComponentClasses('flex', undefined, undefined, undefined, ['w-full', 'justify-center'])}
          withShadow
          withGradient
          withTranslate
        >
          {loading ? BUTTONS.LOADING : BUTTONS.REGISTER}
        </Button>
        
        {/* Login Link */}
        <div className={getEnhancedComponentClasses('flex', undefined, undefined, undefined, ['justify-center', 'mt-4'])}>
          <Link 
            to="/login" 
            className={getEnhancedComponentClasses('button', 'link', 'sm', undefined, ['text-center'])}
            data-testid="switch-to-login"
          >
            Ai deja cont? Autentifică-te!
          </Link>
        </div>
      </div>
    </form>
  );
};

export default RegisterForm;

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../../../stores/authStore';
import toast from 'react-hot-toast';
import { MESAJE, LABELS, BUTTONS } from '@shared-constants';
import { getEnhancedComponentClasses } from '../../../styles/themeUtils';
import Input from '../../primitives/Input/Input';
import { ValidatedSubmitButton } from '../../primitives/Button';
import Alert from '../../primitives/Alert/Alert';

interface LoginFormProps {}

const LoginForm: React.FC<LoginFormProps> = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, loading, error, errorType } = useAuthStore();
  const [activatedField, setActivatedField] = useState<string | null>(null);
  
  // Funcție pentru validarea formatului de email
  const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email.trim());
  };

  // Verifică dacă formularul este valid (email corect și parolă introdusă)
  const isFormValid = isValidEmail(email) && password.length >= 6;

  // Handleri pentru efecte de focus/blur
  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    setActivatedField(e.target.id);
  };

  const handleBlur = () => {
    setActivatedField(null);
  };

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

  // Determinarea mesajului de eroare formatat
  const getErrorMessage = () => {
    switch (errorType) {
      case 'INVALID_CREDENTIALS':
        return MESAJE.EROARE_AUTENTIFICARE || 'Date de autentificare incorecte.';
      case 'RLS_DENIED':
        return MESAJE.EROARE_RLS || 'Acces interzis (RLS).';
      case 'NETWORK':
        return MESAJE.EROARE_RETEA || 'Eroare de rețea. Încearcă din nou.';
      default:
        return error;
    }
  };

  return (
    <form 
      className={getEnhancedComponentClasses('form-container', 'primary', 'md', undefined, ['fade-in', 'shadow-md'])}
      onSubmit={handleSubmit} 
      data-testid="login-form"
    >
      <div className={getEnhancedComponentClasses('card-header', 'default', undefined, undefined, ['gradient-bg-subtle'])}>
        <h2 className={getEnhancedComponentClasses('form-label', 'primary', 'xl', undefined, ['gradient-text-subtle', 'text-center'])}>Autentificare</h2>
      </div>
      
      <div className={getEnhancedComponentClasses('card-body', undefined, undefined, undefined, ['space-y-token'])}>
        {/* Email Input */}
        <Input
          id="email"
          type="email"
          label={`${LABELS.EMAIL}*`}
          value={email}
          onChange={e => setEmail(e.target.value)}
          onFocus={handleFocus}
          onBlur={handleBlur}
          required
          data-testid="login-email"
          withGlowFocus={activatedField === 'email'}
          withTransition
        />
        
        {/* Password Input */}
        <Input
          id="password"
          type="password"
          label={`${LABELS.PAROLA}*`}
          value={password}
          onChange={e => setPassword(e.target.value)}
          onFocus={handleFocus}
          onBlur={handleBlur}
          required
          data-testid="login-password"
          withGlowFocus={activatedField === 'password'}
          withTransition
        />
        
        {/* Error Message */}
        {error && (
          <Alert
            type="error"
            message={getErrorMessage() || ''}
            data-testid="login-error"
            withIcon
            withFadeIn
            withAccentBorder
          />
        )}
        
        {/* Submit Button */}
        <ValidatedSubmitButton
          isFormValid={isFormValid}
          size="md"
          isLoading={loading}
          data-testid="login-submit"
          className={getEnhancedComponentClasses('flex', undefined, undefined, undefined, ['w-full', 'justify-center'])}
          submitText={BUTTONS.LOGIN}
        />
        
        {/* Register Link */}
        <div className={getEnhancedComponentClasses('flex', undefined, undefined, undefined, ['justify-center', 'mt-4'])}>
          <Link 
            to="/register" 
            className={getEnhancedComponentClasses('button', 'link', 'sm', undefined, ['text-center'])}
            data-testid="switch-to-register"
          >
            Nu ai cont? Crează unul!
          </Link>
        </div>
      </div>
    </form>
  );
};

export default LoginForm;

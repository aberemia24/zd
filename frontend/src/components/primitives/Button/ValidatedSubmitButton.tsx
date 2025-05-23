import React from 'react';
import Button, { ButtonProps } from './Button';
import { BUTTONS } from '@shared-constants';

export interface ValidatedSubmitButtonProps extends Omit<ButtonProps, 'variant'> {
  /**
   * Indică dacă formularul este valid și poate fi trimis
   */
  isFormValid: boolean;
  
  /**
   * Indică dacă operația este în curs (loading)
   * Convertăm orice valoare non-falsy la boolean pentru compatibilitate
   */
  isLoading?: any;
  
  /**
   * Text pentru buton în stare de loading (opțional)
   */
  loadingText?: string;
  
  /**
   * Text pentru buton în stare normală (opțional)
   */
  submitText?: string;
}

/**
 * Buton specializat pentru formulare, cu stare validată
 * Schimbă automat varianta în funcție de validitatea formularului
 * 
 * @param props - Proprietățile butonului
 * @returns Un buton adaptat pentru submit cu stare validată
 */
const ValidatedSubmitButton: React.FC<ValidatedSubmitButtonProps> = ({
  isFormValid,
  isLoading = false,
  disabled = false,
  loadingText = BUTTONS.LOADING,
  submitText,
  children,
  ...rest
}) => {
  return (
    <Button
      type="submit"
      variant={isFormValid ? 'primary' : 'secondary'}
      disabled={!isFormValid || isLoading || disabled}
      isLoading={Boolean(isLoading)}
      {...rest}
    >
      {isLoading ? loadingText : (submitText || children)}
    </Button>
  );
};

export default ValidatedSubmitButton;

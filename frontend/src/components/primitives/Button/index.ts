import Button from './Button';
import ValidatedSubmitButton from './ValidatedSubmitButton';
import type { ButtonProps } from './Button';
import type { ValidatedSubmitButtonProps } from './ValidatedSubmitButton';

export {
  Button,
  ValidatedSubmitButton,
  // Exportăm tipurile pentru utilizare în alte componente
  ButtonProps,
  ValidatedSubmitButtonProps
};

// Pentru compatibilitate backwards
export default Button;

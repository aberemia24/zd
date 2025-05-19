import Button from './Button';
import IconButton from './IconButton';
import ButtonGroup from './ButtonGroup';
import ValidatedSubmitButton from './ValidatedSubmitButton';
import type { ButtonProps } from './Button';
import type { IconButtonProps } from './IconButton';
import type { ButtonGroupProps } from './ButtonGroup';
import type { ValidatedSubmitButtonProps } from './ValidatedSubmitButton';

export {
  Button,
  IconButton,
  ButtonGroup,
  ValidatedSubmitButton,
  // Exportăm tipurile pentru utilizare în alte componente
  ButtonProps,
  IconButtonProps,
  ButtonGroupProps,
  ValidatedSubmitButtonProps
};

// Pentru compatibilitate backwards
export default Button;

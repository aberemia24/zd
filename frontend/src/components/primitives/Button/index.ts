import Button from './Button';
import IconButton from './IconButton';
import ButtonGroup from './ButtonGroup';
import type { ButtonProps } from './Button';
import type { IconButtonProps } from './IconButton';
import type { ButtonGroupProps } from './ButtonGroup';

export {
  Button,
  IconButton,
  ButtonGroup,
  // Exportăm tipurile pentru utilizare în alte componente
  ButtonProps,
  IconButtonProps,
  ButtonGroupProps
};

// Pentru compatibilitate backwards
export default Button;

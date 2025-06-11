/**
 * 🎨 COMPOSITIONS MODULE - Carbon Copper Design System
 * Barrel exports pentru componente complexe și compositions
 */

// Layout System
export { 
  container, 
  grid, 
  flexLayout, 
  stackLayout, 
  section,
  gridArea,
  gridTemplate 
} from './layout';
export type { 
  ContainerProps, 
  GridProps, 
  FlexLayoutProps, 
  StackLayoutProps, 
  SectionProps,
  GridAreaProps,
  GridTemplateProps 
} from './layout';

// Modal System
export { modal, modalContent, modalOverlay } from './modal';
export type { ModalProps, ModalContentProps, ModalOverlayProps } from './modal';

// Grid System
export { 
  gridContainer, 
  gridCell, 
  gridRow, 
  gridHeader, 
  gridExpandIcon, 
  gridInput 
} from './grid';
export type { 
  GridContainerProps, 
  GridCellProps, 
  GridRowProps, 
  GridHeaderProps, 
  GridExpandIconProps, 
  GridInputProps 
} from './grid';

// Navigation System
export { 
  navigation, 
  navigationItem, 
  breadcrumb, 
  breadcrumbSeparator 
} from './navigation';
export type { 
  NavigationProps, 
  NavigationItemProps, 
  BreadcrumbProps, 
  BreadcrumbSeparatorProps 
} from './navigation'; 

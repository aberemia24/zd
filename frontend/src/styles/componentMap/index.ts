/**
 * Configurația centralizată de stiluri pentru componentele primitive
 * Folosește sistemul de design tokens și respectă arhitectura aplicației
 */
import { actionComponents } from './actionComponents';
import { formComponents } from './formComponents';
import { feedbackComponents } from './feedbackComponents';
import { layoutComponents } from './layoutComponents';
import { navigationComponents } from './navigationComponents';
import { dataComponents } from './dataComponents';
import { utilityComponents } from './utilityComponents';
import { effectComponents } from './effectComponents';
import { modalComponents } from './modalComponents';
import tableConfig from './table';
import categoryConfig from './category';
import gridConfig from './grid';

/**
 * Definiție pentru configurațiile de stiluri ale componentelor
 */
export interface ComponentStyleConfig {
  base?: string;
  variants?: Record<string, string>;
  sizes?: Record<string, string>;
  states?: Record<string, string | Record<string, string>>;
}

/**
 * Tip pentru obiectul componentMap
 */
export interface ComponentMap {
  [key: string]: ComponentStyleConfig;
}

/**
 * Maparea componentelor la stilurile lor - single source of truth pentru stilizare
 * Permite aplicarea consistentă a temei pe toate componentele
 */
export const componentMap: ComponentMap = {
  // Componente de acțiune (Button, etc.)
  ...actionComponents,
  
  // Componente de form (Input, Select, Checkbox, etc.)
  ...formComponents,
  
  // Componente de feedback (Alert, Badge, Toast, etc.)
  ...feedbackComponents,
  
  // Componente de layout (Card, Container, Modal, etc.)
  ...layoutComponents,
  
  // Componente de navigare (Tab, Sidebar, Navbar, etc.)
  ...navigationComponents,
  
  // Componente de date (Table, etc.)
  ...dataComponents,
  
  // Componente utilitare și efecte speciale
  ...utilityComponents,
  
  // Efecte vizuale și animații
  ...effectComponents,
  
  // Componente modale
  ...modalComponents,

  // Componente de tabel rafinate
  ...tableConfig,
  
  // Componente pentru categorii
  ...categoryConfig,
  
  // Componente pentru grid (LunarGrid)
  ...gridConfig
};

export default componentMap;

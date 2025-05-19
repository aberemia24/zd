import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { getEnhancedComponentClasses } from '../../styles/themeUtils';

/**
 * Componentă primitivă pentru linkuri de navigare
 * Folosește exclusiv getEnhancedComponentClasses pentru stilizare consistentă
 * Respectă sursa unică de adevăr pentru stiluri, fără clase hardcodate
 */
interface NavLinkProps {
  to: string;
  children: React.ReactNode;
  testId?: string;
}

export const NavLink: React.FC<NavLinkProps> = ({ to, children, testId }) => {
  const location = useLocation();
  const isActive = location.pathname === to;
  
  // Folosim numai getEnhancedComponentClasses conform ghidului de stiluri rafinate
  // Tipul 'tab' cu variantă 'underline' pentru a obține doar linia de sub text
  return (
    <Link
      to={to}
      className={getEnhancedComponentClasses(
        'tab',                         // ComponentType
        'underline',                   // ComponentVariant pentru stilul cu linie sub text
        'md',                          // ComponentSize
        isActive ? 'active' : 'default', // ComponentState
        isActive ? ['active-indicator', 'fx-no-outline'] : ['hover-underline', 'fx-no-outline'] // Efectul corect pentru eliminare outline focus, conform sistemului de stiluri
      )}
      data-testid={testId}
    >
      {children}
    </Link>
  );
};

export default NavLink;

import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useThemeEffects } from '../../hooks';

/**
 * Componentă primitivă pentru linkuri de navigare
 * Folosește exclusiv hook-ul useThemeEffects pentru stilizare consistentă
 * Respectă sursa unică de adevăr pentru stiluri, fără clase hardcodate
 */
interface NavLinkProps {
  to: string;
  children: React.ReactNode;
  testId?: string;
  withHoverEffect?: boolean;
  withTransition?: boolean;
  withFadeIn?: boolean;
}

export const NavLink: React.FC<NavLinkProps> = ({ 
  to, 
  children, 
  testId,
  withHoverEffect = true,
  withTransition = false,
  withFadeIn = false
}) => {
  const location = useLocation();
  const isActive = location.pathname === to;
  
  // Utilizăm hook-ul pentru gestionarea efectelor vizuale
  const { getClasses } = useThemeEffects({
    withHoverEffect,
    withTransition,
    withFadeIn
  });
  
  return (
    <Link
      to={to}
      className={getClasses(
        'tab',                         // ComponentType
        'underline',                   // ComponentVariant pentru stilul cu linie sub text
        'md',                          // ComponentSize
        isActive ? 'active' : 'default' // ComponentState
      )}
      data-testid={testId}
    >
      {children}
    </Link>
  );
};

export default NavLink;

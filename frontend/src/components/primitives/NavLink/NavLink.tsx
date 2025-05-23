import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '../../../styles/new/shared/utils';
import { button, type ButtonProps as CVAButtonProps } from '../../../styles/new/components/forms';

/**
 * Componentă primitivă pentru linkuri de navigare
 * Folosește CVA styling system pentru stilizare consistentă
 * Respectă sursa unică de adevăr pentru stiluri, fără clase hardcodate
 */
interface NavLinkProps extends Omit<CVAButtonProps, 'fullWidth'> {
  to: string;
  children: React.ReactNode;
  testId?: string;
  className?: string;
}

export const NavLink: React.FC<NavLinkProps> = ({ 
  to, 
  children, 
  testId,
  variant = 'ghost',
  size = 'md',
  className
}) => {
  const location = useLocation();
  const isActive = location.pathname === to;
  
  return (
    <Link
      to={to}
      className={cn(
        button({ 
          variant: isActive ? 'primary' : variant, 
          size 
        }),
        // Active state override pentru mai multă vizibilitate
        isActive && "bg-blue-100 text-blue-700 border-blue-300",
        className
      )}
      data-testid={testId}
    >
      {children}
    </Link>
  );
};

export default NavLink;

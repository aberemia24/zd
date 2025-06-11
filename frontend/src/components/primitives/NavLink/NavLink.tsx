import React from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  cn,
  button,
  type ButtonProps as CVAButtonProps
} from "../../../styles/cva-v2";

/**
 * Componentă primitivă pentru linkuri de navigare
 * Folosește CVA v2 styling system pentru stilizare consistentă
 * Respectă sursa unică de adevăr pentru stiluri, fără clase hardcodate
 * Bazat pe noul sistem CVA v2 modular cu Carbon Copper palette
 */
interface NavLinkProps extends Omit<CVAButtonProps, "children"> {
  to: string;
  children: React.ReactNode;
  testId?: string;
  className?: string;
  activeClassName?: string;
  exact?: boolean;
}

const NavLink: React.FC<NavLinkProps> = ({
  to,
  children,
  variant = "ghost",
  size = "md",
  testId,
  className,
  activeClassName,
  exact = false,
  ...props
}) => {
  const location = useLocation();
  
  // Determine if link is active
  const isActive = exact 
    ? location.pathname === to
    : location.pathname.startsWith(to);

  return (
    <Link
      to={to}
      className={cn(
        button({ variant, size }),
        isActive && [
          "bg-copper-500/10 text-copper-600 border-copper-500/20",
          "dark:bg-copper-400/20 dark:text-copper-300 dark:border-copper-400/30",
          activeClassName
        ],
        className
      )}
      data-testid={testId}
      {...props}
    >
      {children}
    </Link>
  );
};

export default NavLink;

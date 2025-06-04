import React from "react";
import { 
  cn,
  badge,
  type BadgeProps as CVABadgeProps
} from "../../../styles/cva-v2";

export interface BadgeProps extends CVABadgeProps {
  children: React.ReactNode;
  className?: string;
  dataTestId?: string;
}

/**
 * Badge component pentru status și categorii
 * Bazat pe noul sistem CVA v2 modular
 */
const Badge: React.FC<BadgeProps> = ({
  children,
  variant = "neutral",
  className,
  dataTestId,
  ...props
}) => {
  return (
    <span
      className={cn(badge({ variant }), className)}
      data-testid={dataTestId}
      {...props}
    >
      {children}
    </span>
  );
};

export default Badge;

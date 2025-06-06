import React from "react";
import { 
  cn,
  stackLayout,
  type StackLayoutProps as CVAStackLayoutProps
} from "../../../styles/cva-v2";

export interface StackLayoutProps extends CVAStackLayoutProps {
  children: React.ReactNode;
  className?: string;
  dataTestId?: string;
  as?: React.ElementType;
}

/**
 * StackLayout component pentru vertical/horizontal stacking
 * Bazat pe noul sistem CVA v2 modular cu Carbon Copper palette
 */
const StackLayout: React.FC<StackLayoutProps> = ({
  children,
  direction = "vertical",
  spacing = 4,
  align = "stretch",
  justify = "start",
  wrap = false,
  className,
  dataTestId,
  as: Component = "div",
  ...props
}) => {
  return (
    <Component
      className={cn(stackLayout({ direction, spacing, align, justify, wrap }), className)}
      data-testid={dataTestId}
      {...props}
    >
      {children}
    </Component>
  );
};

export default StackLayout; 

import React from "react";
import { 
  cn,
  flexLayout,
  type FlexLayoutProps as CVAFlexLayoutProps
} from "../../../styles/cva-v2";

export interface FlexLayoutProps extends CVAFlexLayoutProps {
  children: React.ReactNode;
  className?: string;
  dataTestId?: string;
  as?: React.ElementType;
}

/**
 * FlexLayout component pentru flexible layouts
 * Bazat pe noul sistem CVA v2 modular cu Carbon Copper palette
 */
const FlexLayout: React.FC<FlexLayoutProps> = ({
  children,
  direction = "row",
  wrap = "nowrap",
  justify = "start",
  align = "start",
  gap = 0,
  className,
  dataTestId,
  as: Component = "div",
  ...props
}) => {
  return (
    <Component
      className={cn(flexLayout({ direction, wrap, justify, align, gap }), className)}
      data-testid={dataTestId}
      {...props}
    >
      {children}
    </Component>
  );
};

export default FlexLayout; 

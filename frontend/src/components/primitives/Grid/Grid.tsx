import React from "react";
import { 
  cn,
  grid,
  type GridProps as CVAGridProps
} from "../../../styles/cva-v2";

export interface GridProps extends CVAGridProps {
  children: React.ReactNode;
  className?: string;
  dataTestId?: string;
  as?: React.ElementType;
}

/**
 * Grid component pentru Tailwind grid layouts
 * Bazat pe noul sistem CVA v2 modular cu Carbon Copper palette
 */
const Grid: React.FC<GridProps> = ({
  children,
  cols = 1,
  gap = 4,
  responsive = false,
  className,
  dataTestId,
  as: Component = "div",
  ...props
}) => {
  return (
    <Component
      className={cn(grid({ cols, gap, responsive }), className)}
      data-testid={dataTestId}
      {...props}
    >
      {children}
    </Component>
  );
};

export default Grid; 
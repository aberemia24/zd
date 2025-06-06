import React from "react";
import { 
  cn,
  container,
  type ContainerProps as CVAContainerProps
} from "../../../styles/cva-v2";

export interface ContainerProps extends CVAContainerProps {
  children: React.ReactNode;
  className?: string;
  dataTestId?: string;
  as?: React.ElementType;
}

/**
 * Container component pentru consistent content width
 * Bazat pe noul sistem CVA v2 modular cu Carbon Copper palette
 */
const Container: React.FC<ContainerProps> = ({
  children,
  maxWidth = "7xl",
  padding = "lg",
  className,
  dataTestId,
  as: Component = "div",
  ...props
}) => {
  return (
    <Component
      className={cn(container({ maxWidth, padding }), className)}
      data-testid={dataTestId}
      {...props}
    >
      {children}
    </Component>
  );
};

export default Container; 

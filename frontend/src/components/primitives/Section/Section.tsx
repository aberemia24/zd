import React from "react";
import { 
  cn,
  section,
  type SectionProps as CVASectionProps
} from "../../../styles/cva-v2";

export interface SectionProps extends CVASectionProps {
  children: React.ReactNode;
  className?: string;
  dataTestId?: string;
  as?: React.ElementType;
}

/**
 * Section component pentru consistent page sections
 * Bazat pe noul sistem CVA v2 modular cu Carbon Copper palette
 */
const Section: React.FC<SectionProps> = ({
  children,
  variant = "default",
  padding = "md",
  margin = "none",
  width = "full",
  className,
  dataTestId,
  as: Component = "section",
  ...props
}) => {
  return (
    <Component
      className={cn(section({ variant, padding, margin, width }), className)}
      data-testid={dataTestId}
      {...props}
    >
      {children}
    </Component>
  );
};

export default Section;

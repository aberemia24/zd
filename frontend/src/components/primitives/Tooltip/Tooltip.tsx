import React, { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { 
  cn,
  tooltip,
  type TooltipProps as CVATooltipProps
} from "../../../styles/cva-v2";

export interface TooltipProps extends CVATooltipProps {
  className?: string;
  dataTestId?: string;
}

/**
 * Tooltip component pentru informații suplimentare
 * Bazat pe CVA v2 cu Carbon Copper design system
 */
const Tooltip: React.FC<TooltipProps> = ({
  content,
  children,
  placement = "top",
  variant = "default",
  delay = 200,
  disabled = false,
  className,
  dataTestId,
  ...props
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const triggerRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Calculate tooltip position
  const calculatePosition = () => {
    if (!triggerRef.current || !tooltipRef.current) return;

    const triggerRect = triggerRef.current.getBoundingClientRect();
    const tooltipRect = tooltipRef.current.getBoundingClientRect();
    const scrollX = window.scrollX;
    const scrollY = window.scrollY;

    let x = 0;
    let y = 0;

    switch (placement) {
      case "top":
        x = triggerRect.left + scrollX + (triggerRect.width / 2) - (tooltipRect.width / 2);
        y = triggerRect.top + scrollY - tooltipRect.height - 8;
        break;
      case "bottom":
        x = triggerRect.left + scrollX + (triggerRect.width / 2) - (tooltipRect.width / 2);
        y = triggerRect.bottom + scrollY + 8;
        break;
      case "left":
        x = triggerRect.left + scrollX - tooltipRect.width - 8;
        y = triggerRect.top + scrollY + (triggerRect.height / 2) - (tooltipRect.height / 2);
        break;
      case "right":
        x = triggerRect.right + scrollX + 8;
        y = triggerRect.top + scrollY + (triggerRect.height / 2) - (tooltipRect.height / 2);
        break;
    }

    // Keep tooltip within viewport
    const padding = 8;
    x = Math.max(padding, Math.min(x, window.innerWidth - tooltipRect.width - padding));
    y = Math.max(padding, Math.min(y, window.innerHeight - tooltipRect.height - padding));

    setPosition({ x, y });
  };

  const showTooltip = () => {
    if (disabled) return;
    
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    timeoutRef.current = setTimeout(() => {
      setIsVisible(true);
    }, delay);
  };

  const hideTooltip = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsVisible(false);
  };

  // Update position when visible
  useEffect(() => {
    if (isVisible) {
      calculatePosition();
      
      // Recalculate on scroll/resize
      const handleUpdate = () => calculatePosition();
      window.addEventListener('scroll', handleUpdate);
      window.addEventListener('resize', handleUpdate);
      
      return () => {
        window.removeEventListener('scroll', handleUpdate);
        window.removeEventListener('resize', handleUpdate);
      };
    }
  }, [isVisible, placement, calculatePosition]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const tooltipElement = isVisible ? (
    <div
      ref={tooltipRef}
      className={cn(tooltip({ placement, variant }), className)}
      style={{
        position: 'absolute',
        left: position.x,
        top: position.y,
        zIndex: 9999
      }}
      data-testid={dataTestId}
      role="tooltip"
      {...props}
    >
      {content}
    </div>
  ) : null;

  return (
    <>
      <div
        ref={triggerRef}
        onMouseEnter={showTooltip}
        onMouseLeave={hideTooltip}
        onFocus={showTooltip}
        onBlur={hideTooltip}
        className="inline-block"
      >
        {children}
      </div>
      {tooltipElement && createPortal(tooltipElement, document.body)}
    </>
  );
};

export default Tooltip; 

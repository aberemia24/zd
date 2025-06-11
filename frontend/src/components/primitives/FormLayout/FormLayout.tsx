import React from 'react';
import { cn, formGroup } from '../../../styles/cva-v2';

export interface FormLayoutProps {
  /** Form title */
  title?: string;
  /** Loading indicator content */
  loadingIndicator?: React.ReactNode;
  /** Main form fields content */
  children: React.ReactNode;
  /** Form actions (buttons) */
  actions?: React.ReactNode;
  /** Success/error messages */
  messages?: React.ReactNode;
  /** Form submission handler */
  onSubmit?: (e: React.FormEvent) => void;
  /** Additional CSS classes */
  className?: string;
  /** Data test ID */
  testId?: string;
  /** ARIA label for the form */
  ariaLabel?: string;
}

/**
 * 🎨 FORM LAYOUT COMPONENT - Generic & Reusable
 * 
 * Extrage pattern-urile comune de layout din toate formularele
 * pentru consistency și reutilizare. Bazat pe CVA-v2 system.
 * 
 * Features:
 * - Header section cu title și loading indicator
 * - Main content area pentru fields
 * - Footer section pentru actions (buttons)
 * - Messages area pentru feedback
 * - Responsive design cu mobile-first approach
 * - Accessibility support cu ARIA
 */
const FormLayout: React.FC<FormLayoutProps> = ({
  title,
  loadingIndicator,
  children,
  actions,
  messages,
  onSubmit,
  className,
  testId = 'form-layout',
  ariaLabel = 'Form'
}) => {
  return (
    <form
      aria-label={ariaLabel}
      onSubmit={onSubmit}
      className={cn(
        formGroup({ variant: "default" }),
        "space-y-6 bg-white p-6 rounded-lg border border-carbon-200 dark:bg-carbon-900 dark:border-carbon-700",
        className
      )}
      data-testid={testId}
    >
      {/* Header Section */}
      {(title || loadingIndicator) && (
        <div className="flex flex-row justify-between items-center border-b border-carbon-200 dark:border-carbon-700 pb-4">
          {title && (
            <h3 className="text-lg font-semibold text-carbon-900 dark:text-carbon-100">
              {title}
            </h3>
          )}
          {loadingIndicator && (
            <div className="flex-shrink-0">
              {loadingIndicator}
            </div>
          )}
        </div>
      )}

      {/* Main Content Area */}
      <div className="space-y-6">
        {children}
      </div>

      {/* Actions Section */}
      {actions && (
        <div className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-3 space-y-3 space-y-reverse sm:space-y-0 pt-4 border-t border-carbon-200 dark:border-carbon-700">
          {actions}
        </div>
      )}

      {/* Messages Section */}
      {messages && (
        <div className="space-y-2">
          {messages}
        </div>
      )}
    </form>
  );
};

export default FormLayout; 

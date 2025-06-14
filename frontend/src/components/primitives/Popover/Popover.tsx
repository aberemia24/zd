/**
 * 🎨 POPOVER WRAPPER - Generic Popover Component
 *
 * Wrapper peste Radix UI Popover cu styling CVA v2 și shared constants.
 * Respectă principiile pragmatice: simplu, robust, ușor de întreținut.
 *
 * 🧠 ARHITECTURĂ:
 * - Wrapper minimal peste Radix UI pentru consistență
 * - CVA styling integration cu card({ variant: "elevated" })
 * - Shared constants pentru toate textele
 * - Props standardizate pentru reutilizare
 *
 * ⚙️ FUNCȚIONALITĂȚI:
 * - Automatic positioning cu Radix UI Portal
 * - Keyboard shortcuts (Escape pentru închidere)
 * - Focus management automat
 * - Responsive design cu max-width
 * - Z-index management prin Portal
 *
 * 🐛 DEBUGGING:
 * - Console logs în development pentru state tracking
 * - Error boundaries pentru robustețe
 */

import { POPOVER_CONSTANTS } from '@budget-app/shared-constants';
import * as RadixPopover from '@radix-ui/react-popover';
import React from 'react';
import { card, cn } from '../../../styles/cva-v2';

export interface PopoverProps {
  /** Conținutul care va declanșa popover-ul */
  trigger: React.ReactNode;
  /** Conținutul popover-ului */
  children: React.ReactNode;
  /** Controlează dacă popover-ul este deschis (controlled mode) */
  open?: boolean;
  /** Callback pentru schimbarea stării (controlled mode) */
  onOpenChange?: (open: boolean) => void;
  /** Poziționarea popover-ului față de trigger */
  side?: 'top' | 'right' | 'bottom' | 'left';
  /** Alinierea popover-ului */
  align?: 'start' | 'center' | 'end';
  /** Offset-ul față de trigger */
  sideOffset?: number;
  /** Clasa CSS suplimentară pentru container */
  className?: string;
  /** Clasa CSS suplimentară pentru conținut */
  contentClassName?: string;
  /** Varianta de styling */
  variant?: 'default' | 'elevated' | 'compact';
  /** Lățimea maximă a popover-ului */
  maxWidth?: string;
  /** Dacă să se închidă la click în afara popover-ului */
  modal?: boolean;
  /** Aria label pentru accessibility */
  'aria-label'?: string;
  /** Test ID pentru testing */
  'data-testid'?: string;
}

const Popover: React.FC<PopoverProps> = ({
  trigger,
  children,
  open,
  onOpenChange,
  side = 'bottom',
  align = 'start',
  sideOffset = 5,
  className,
  contentClassName,
  variant = 'elevated',
  maxWidth = '320px',
  modal = false,
  'aria-label': ariaLabel,
  'data-testid': testId,
}) => {
  // 🐛 Development debugging
  React.useEffect(() => {
    if (process.env.NODE_ENV === 'development' && open !== undefined) {
      console.log('[Popover] State changed:', { open, side, align });
    }
  }, [open, side, align]);

  return (
    <RadixPopover.Root
      {...(open !== undefined && { open })}
      {...(onOpenChange && { onOpenChange })}
      modal={modal}
    >
      {/* Trigger - folosește asChild pentru a nu wrappa în div suplimentar */}
      <RadixPopover.Trigger asChild>
        {trigger}
      </RadixPopover.Trigger>

      {/* Portal pentru z-index management automat */}
      <RadixPopover.Portal>
        <RadixPopover.Content
          side={side}
          align={align}
          sideOffset={sideOffset}
          className={cn(
            // CVA styling cu card elevated
            card({ variant }),
            // Styling specific pentru popover
            'z-50 min-w-[200px] animate-in fade-in-0 zoom-in-95',
            'data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95',
            'data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2',
            'data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',
            // Responsive și max-width
            'max-w-[95vw] overflow-hidden',
            contentClassName
          )}
          style={{ maxWidth }}
          aria-label={ariaLabel || POPOVER_CONSTANTS.ARIA_LABELS.CONTENT}
          data-testid={testId}
        >
          {children}

          {/* Arrow pentru pointing către trigger */}
          <RadixPopover.Arrow
            className="fill-white dark:fill-carbon-900 drop-shadow-sm"
            width={12}
            height={6}
          />
        </RadixPopover.Content>
      </RadixPopover.Portal>
    </RadixPopover.Root>
  );
};

export default Popover;

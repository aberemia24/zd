import React, { useState, useCallback } from 'react';
import * as Popover from '@radix-ui/react-popover';
import { Edit2, Trash2, Calendar, DollarSign, MoreHorizontal } from 'lucide-react';
import { cn } from "../../../../styles/cva-v2";
import { cva } from "class-variance-authority";
import { UI } from "@budget-app/shared-constants";

// ===== CVA STYLING =====
const popoverVariants = cva(
  "z-50 rounded-md border bg-white shadow-lg outline-none animate-in fade-in-0 zoom-in-95",
  {
    variants: {
      size: {
        compact: "w-64 p-3",
        standard: "w-80 p-4",
        wide: "w-96 p-4",
      },
      theme: {
        default: "bg-white border-gray-200 text-gray-900",
        copper: "bg-copper-50 border-copper-200 text-copper-900",
        dark: "bg-gray-800 border-gray-700 text-gray-100",
      }
    },
    defaultVariants: {
      size: "standard",
      theme: "default",
    },
  },
);

// ===== TYPES =====
export interface CellData {
  value: string | number;
  date: string;
  cellId: string;
  validationType: "amount" | "text" | "percentage" | "date";
}

export interface PopoverAction {
  id: string;
  label: string;
  icon: React.ReactNode;
  onClick: () => void;
  variant?: 'default' | 'destructive' | 'secondary';
  disabled?: boolean;
}

export interface AdvancedCellPopoverProps {
  // Trigger props
  trigger?: React.ReactNode;
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  
  // Cell data
  cellData: CellData;
  existingTransaction?: any;
  
  // Actions
  onQuickEdit?: () => void;
  onAdvancedEdit?: () => void;
  onDelete?: () => void;
  onDuplicate?: () => void;
  customActions?: PopoverAction[];
  
  // Styling
  size?: 'compact' | 'standard' | 'wide';
  theme?: 'default' | 'copper' | 'dark';
  showQuickActions?: boolean;
  
  // Callbacks
  onSave?: (value: string | number) => Promise<void>;
  onClose?: () => void;
}

// ===== MAIN COMPONENT =====
export const AdvancedCellPopover: React.FC<AdvancedCellPopoverProps> = ({
  trigger,
  isOpen,
  onOpenChange,
  cellData,
  existingTransaction,
  onQuickEdit,
  onAdvancedEdit,
  onDelete,
  onDuplicate,
  customActions = [],
  size = 'standard',
  theme = 'default',
  showQuickActions = true,
  onSave,
  onClose,
}) => {
  const [internalOpen, setInternalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Controlled vs uncontrolled state
  const isPopoverOpen = isOpen !== undefined ? isOpen : internalOpen;
  const setPopoverOpen = onOpenChange || setInternalOpen;
  
  // ===== COMPUTED VALUES =====
  const hasValue = cellData.value !== "" && cellData.value !== null && cellData.value !== undefined;
  const displayValue = hasValue ? String(cellData.value) : "Empty";
  const formattedDate = new Date(cellData.date).toLocaleDateString('ro-RO');
  
  // ===== DEFAULT ACTIONS =====
  const defaultActions: PopoverAction[] = [
    {
      id: 'quick-edit',
      label: 'Edit Inline',
      icon: <Edit2 size={16} />,
      onClick: () => {
        setPopoverOpen(false);
        onQuickEdit?.();
      },
    },
    {
      id: 'advanced-edit',
      label: 'Advanced Edit',
      icon: <Calendar size={16} />,
      onClick: () => {
        setPopoverOpen(false);
        onAdvancedEdit?.();
      },
    }
  ];
  
  // Add delete action if value exists
  if (hasValue) {
    defaultActions.push({
      id: 'delete',
      label: 'Clear Value',
      icon: <Trash2 size={16} />,
      onClick: () => {
        setPopoverOpen(false);
        onDelete?.();
      },
      variant: 'destructive',
    });
  }
  
  // Add duplicate action if transaction exists
  if (existingTransaction) {
    defaultActions.push({
      id: 'duplicate',
      label: 'Duplicate Transaction',
      icon: <DollarSign size={16} />,
      onClick: () => {
        setPopoverOpen(false);
        onDuplicate?.();
      },
      variant: 'secondary',
    });
  }
  
  // Combine default and custom actions
  const allActions = [...defaultActions, ...customActions];
  
  // ===== ACTION HANDLERS =====
  const handleActionClick = useCallback(async (action: PopoverAction) => {
    if (action.disabled) return;
    
    setIsLoading(true);
    try {
      action.onClick();
    } catch (error) {
      console.error('Action failed:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  const handleClose = useCallback(() => {
    setPopoverOpen(false);
    onClose?.();
  }, [setPopoverOpen, onClose]);
  
  // ===== DEFAULT TRIGGER =====
  const defaultTrigger = (
    <button
      className="p-1 rounded hover:bg-copper-100 dark:hover:bg-copper-700 transition-colors focus:outline-none focus:ring-2 focus:ring-copper-500"
      title="Advanced options"
      aria-label="Open advanced options"
    >
      <MoreHorizontal size={14} />
    </button>
  );
  
  // ===== RENDER =====
  return (
    <Popover.Root open={isPopoverOpen} onOpenChange={setPopoverOpen}>
      <Popover.Trigger asChild>
        {trigger || defaultTrigger}
      </Popover.Trigger>
      
      <Popover.Portal>
        <Popover.Content
          className={cn(popoverVariants({ size, theme }))}
          sideOffset={5}
          align="start"
          collisionPadding={10}
        >
          {/* Header */}
          <div className="mb-3 border-b pb-2">
            <div className="flex items-center justify-between">
              <h3 className="font-medium text-sm">Cell Options</h3>
              <button
                onClick={handleClose}
                className="text-gray-400 hover:text-gray-600 p-1 rounded"
                aria-label="Close"
              >
                ×
              </button>
            </div>
          </div>
          
          {/* Cell Info */}
          <div className="space-y-2 mb-4">
            <div className="flex justify-between text-xs">
              <span className="text-gray-500">Date:</span>
              <span className="font-mono">{formattedDate}</span>
            </div>
            
            <div className="flex justify-between text-xs">
              <span className="text-gray-500">Value:</span>
              <span className={cn(
                "font-mono",
                !hasValue && "text-gray-400 italic"
              )}>
                {displayValue}
              </span>
            </div>
            
            <div className="flex justify-between text-xs">
              <span className="text-gray-500">Type:</span>
              <span className="text-gray-700 capitalize">{cellData.validationType}</span>
            </div>
            
            {existingTransaction && (
              <div className="flex justify-between text-xs">
                <span className="text-gray-500">Transaction:</span>
                <span className="text-green-600">✓ Exists</span>
              </div>
            )}
          </div>
          
          {/* Quick Actions */}
          {showQuickActions && (
            <div className="space-y-1">
              {allActions.map((action) => (
                <button
                  key={action.id}
                  onClick={() => handleActionClick(action)}
                  disabled={action.disabled || isLoading}
                  className={cn(
                    "w-full flex items-center gap-3 px-3 py-2 text-sm rounded-md transition-colors text-left",
                    action.variant === 'destructive' 
                      ? "hover:bg-red-50 hover:text-red-700 text-red-600"
                      : action.variant === 'secondary'
                      ? "hover:bg-gray-50 text-gray-600"
                      : "hover:bg-copper-50 text-gray-700",
                    action.disabled && "opacity-50 cursor-not-allowed"
                  )}
                >
                  <span className="flex-shrink-0">{action.icon}</span>
                  <span className="flex-1">{action.label}</span>
                  {action.id === 'quick-edit' && (
                    <span className="text-xs text-gray-400">F2</span>
                  )}
                </button>
              ))}
            </div>
          )}
          
          {/* Loading State */}
          {isLoading && (
            <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center">
              <div className="w-5 h-5 border-2 border-copper-500 border-t-transparent rounded-full animate-spin" />
            </div>
          )}
          
          <Popover.Arrow className="fill-white" />
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
};

// ===== COMPOUND COMPONENTS =====

// Quick edit variant
export const QuickEditPopover: React.FC<Omit<AdvancedCellPopoverProps, 'showQuickActions' | 'customActions'>> = (props) => (
  <AdvancedCellPopover 
    {...props} 
    size="compact"
    showQuickActions={true}
    customActions={[]}
  />
);

// Info-only variant  
export const CellInfoPopover: React.FC<Omit<AdvancedCellPopoverProps, 'showQuickActions'>> = (props) => (
  <AdvancedCellPopover 
    {...props} 
    showQuickActions={false}
  />
);

export default AdvancedCellPopover; 
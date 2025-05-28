import { cva } from "class-variance-authority";

// Modal overlay styling
export const transactionModalOverlay = cva(
  [
    "fixed inset-0 z-50",
    "bg-black bg-opacity-50",
    "flex items-center justify-center",
    "transition-opacity duration-200",
  ],
  {
    variants: {
      blur: {
        true: "backdrop-blur-sm",
        false: "",
      },
    },
    defaultVariants: {
      blur: true,
    },
  },
);

// Transaction modal content styling
export const transactionModalContent = cva(
  [
    "bg-white rounded-lg shadow-lg",
    "max-h-[90vh] overflow-hidden",
    "transform transition-all duration-200",
    "border border-slate-200",
  ],
  {
    variants: {
      size: {
        sm: "w-96 max-w-sm",
        md: "w-[500px] max-w-md",
        lg: "w-[600px] max-w-lg",
        xl: "w-[700px] max-w-xl",
        "2xl": "w-[800px] max-w-2xl",
      },
      mode: {
        "quick-add": "w-96 max-h-[400px]",
        "advanced-edit": "w-[500px] max-h-[600px]",
        "recurring-setup": "w-[600px] max-h-[700px]",
        "bulk-operations": "w-[800px] max-h-[800px]",
        "financial-preview": "w-[700px] max-h-[500px]",
      },
    },
    defaultVariants: {
      size: "md",
      mode: "quick-add",
    },
  },
);

// Modal header styling
export const transactionModalHeader = cva(
  [
    "px-6 py-4",
    "border-b border-slate-200",
    "bg-slate-50",
    "flex items-center justify-between",
  ],
  {
    variants: {
      variant: {
        default: "",
        primary: "bg-blue-50 border-blue-200",
        success: "bg-emerald-50 border-emerald-200",
        warning: "bg-amber-50 border-amber-200",
        danger: "bg-red-50 border-red-200",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

// Modal title styling
export const transactionModalTitle = cva(
  ["text-lg font-semibold", "text-slate-900"],
  {
    variants: {
      variant: {
        default: "text-slate-900",
        primary: "text-blue-900",
        success: "text-emerald-900",
        warning: "text-amber-900",
        danger: "text-red-900",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

// Modal body styling
export const transactionModalBody = cva(
  ["px-6 py-4", "space-y-4", "overflow-y-auto"],
  {
    variants: {
      padding: {
        none: "p-0",
        sm: "px-4 py-3",
        md: "px-6 py-4",
        lg: "px-8 py-6",
      },
    },
    defaultVariants: {
      padding: "md",
    },
  },
);

// Modal footer styling
export const transactionModalFooter = cva(
  [
    "px-6 py-4",
    "border-t border-slate-200",
    "bg-slate-50",
    "flex justify-end space-x-3",
  ],
  {
    variants: {
      alignment: {
        left: "justify-start",
        center: "justify-center",
        right: "justify-end",
        between: "justify-between",
      },
    },
    defaultVariants: {
      alignment: "right",
    },
  },
);

// Modal close button styling
export const transactionModalCloseButton = cva([
  "p-2 rounded-md",
  "text-slate-400 hover:text-slate-600",
  "hover:bg-slate-100",
  "transition-colors duration-150",
  "focus:outline-none focus:ring-2 focus:ring-blue-500",
]);

import { cva, type VariantProps } from "class-variance-authority";

export const modal = cva(
  // Base modal classes - overlay foarte subtil pentru UX seamless
  "fixed inset-0 bg-black bg-opacity-15 flex items-center justify-center z-50",
  {
    variants: {
      variant: {
        default: "",
        overlay: "overscroll-contain overflow-hidden",
        centered: "",
        subtle: "bg-opacity-10", // Opțiune extra subtilă
        strong: "bg-opacity-30", // Opțiune mai puternică când e necesar
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

// Separate modalContent for sizing the actual modal content
export const modalContent = cva(
  // Base content classes - simplificate
  "relative bg-white dark:bg-surface-dark rounded-lg shadow-xl",
  {
    variants: {
      size: {
        sm: "w-full max-w-sm",
        md: "w-full max-w-md", 
        lg: "w-full max-w-lg",
        xl: "w-full max-w-4xl", // Pentru CategoryEditor - 4xl e mai rezonabil
        "2xl": "w-full max-w-2xl",
        full: "w-full h-full",
      },
      padding: {
        none: "p-0",
        sm: "p-4",
        md: "p-6",
        lg: "p-8",
      },
      maxHeight: {
        default: "max-h-[90vh] overflow-auto",
        full: "h-full",
      }
    },
    defaultVariants: {
      size: "md",
      padding: "md",
      maxHeight: "default",
    },
  }
);

// Pentru containerul care previne închiderea modalului când dai click pe conținut
export const modalContainer = cva(
  "mx-4", // Marginile pentru responsive
  {
    variants: {
      centered: {
        true: "flex items-center justify-center min-h-screen",
        false: "",
      }
    },
    defaultVariants: {
      centered: true,
    }
  }
);

export type ModalVariants = VariantProps<typeof modal>;
export type ModalContentVariants = VariantProps<typeof modalContent>;
export type ModalContainerVariants = VariantProps<typeof modalContainer>; 
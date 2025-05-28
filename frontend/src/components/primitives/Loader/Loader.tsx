import React from "react";
import { LOADER } from "@shared-constants";
import { cn } from "../../../styles/cva/shared/utils";
import {
  loader,
  type LoaderProps as CVALoaderProps,
} from "../../../styles/cva/components/feedback";

export interface LoaderProps extends CVALoaderProps {
  text?: string;
  showText?: boolean;
  className?: string;
  dataTestId?: string;
}

const Loader: React.FC<LoaderProps> = ({
  size = "md",
  color = "primary",
  text = LOADER.TEXT,
  showText = true,
  className,
  dataTestId,
}) => {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center space-y-2",
        className,
      )}
      data-testid={dataTestId || "loader-container"}
    >
      <svg
        className={cn(loader({ size, color }))}
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        data-testid="loader-svg"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
        />
      </svg>
      {showText && (
        <span className="text-sm text-secondary-700" data-testid="loader-text">
          {text}
        </span>
      )}
    </div>
  );
};

export default Loader;

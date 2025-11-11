import React from "react";
import { cn } from "@/lib/utils";

export interface LoadingSpinnerProps {
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  className?: string;
  color?: "primary" | "secondary" | "white" | "current";
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = "md",
  className,
  color = "primary",
}) => {
  const sizes = {
    xs: "w-4 h-4",
    sm: "w-5 h-5",
    md: "w-6 h-6",
    lg: "w-8 h-8",
    xl: "w-12 h-12",
  };

  const colors = {
    primary: "text-[rgb(var(--color-brand-primary))]",
    secondary: "text-[rgb(var(--color-brand-secondary))]",
    white: "text-white",
    current: "text-current",
  };

  return (
    <div className={cn("animate-spin", sizes[size], colors[color], className)}>
      <svg
        className="w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        aria-hidden="true"
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
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
    </div>
  );
};

export interface LoadingDotsProps {
  size?: "sm" | "md" | "lg";
  className?: string;
  color?: "primary" | "secondary" | "white" | "current";
}

const LoadingDots: React.FC<LoadingDotsProps> = ({
  size = "md",
  className,
  color = "primary",
}) => {
  const sizes = {
    sm: "space-x-1",
    md: "space-x-1.5",
    lg: "space-x-2",
  };

  const dotSizes = {
    sm: "w-1 h-1",
    md: "w-1.5 h-1.5",
    lg: "w-2 h-2",
  };

  const colors = {
    primary: "bg-[rgb(var(--color-brand-primary))]",
    secondary: "bg-[rgb(var(--color-brand-secondary))]",
    white: "bg-white",
    current: "bg-current",
  };

  return (
    <div
      className={cn("flex items-center justify-center", sizes[size], className)}
    >
      {[0, 1, 2].map((index) => (
        <div
          key={index}
          className={cn(
            "rounded-full animate-pulse",
            dotSizes[size],
            colors[color],
          )}
          style={{
            animationDelay: `${index * 0.2}s`,
            animationDuration: "1s",
          }}
        />
      ))}
    </div>
  );
};

export interface LoadingSkeletonProps {
  className?: string;
  height?: string | number;
  width?: string | number;
  rounded?: boolean;
  animated?: boolean;
}

const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({
  className,
  height = "1rem",
  width = "100%",
  rounded = false,
  animated = true,
}) => {
  const style = {
    height: typeof height === "number" ? `${height}px` : height,
    width: typeof width === "number" ? `${width}px` : width,
  };

  const classes = cn(
    "bg-[rgb(var(--color-bg-secondary))] overflow-hidden",
    rounded ? "rounded-full" : "rounded-lg",
    animated && "animate-pulse",
    className,
  );

  return <div className={classes} style={style} aria-hidden="true" />;
};

export { LoadingSpinner, LoadingDots, LoadingSkeleton };

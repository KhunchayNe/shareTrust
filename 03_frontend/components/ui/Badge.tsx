import React, { forwardRef } from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?:
    | "default"
    | "success"
    | "warning"
    | "danger"
    | "info"
    | "trust"
    | "escrow";
  size?: "xs" | "sm" | "md" | "lg";
  status?: "pending" | "funded" | "released" | "refunded" | "cancelled";
  level?: number; // 1-5 for trust levels
  rounded?: boolean;
}

const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  (
    {
      className,
      variant = "default",
      size = "sm",
      status,
      level,
      rounded = false,
      children,
      ...props
    },
    ref,
  ) => {
    const baseClasses = "inline-flex items-center font-medium";

    const variants = {
      default:
        "bg-[rgb(var(--color-bg-secondary))] text-[rgb(var(--color-text-primary))] border border-[rgb(var(--color-border-primary))]",
      success: "bg-[rgb(var(--color-success))] text-white",
      warning: "bg-[rgb(var(--color-warning))] text-white",
      danger: "bg-[rgb(var(--color-danger))] text-white",
      info: "bg-[rgb(var(--color-info))] text-white",
      trust: "trust-badge",
      escrow: "escrow-status",
    };

    const sizes = {
      xs: "text-xs px-1.5 py-0.5",
      sm: "text-xs px-2 py-1",
      md: "text-sm px-2.5 py-1",
      lg: "text-sm px-3 py-1.5",
    };

    const roundedClasses = rounded ? "rounded-full" : "rounded-lg";

    const classes = cn(
      baseClasses,
      variants[variant],
      sizes[size],
      roundedClasses,
      status && variant === "escrow" && status,
      level && variant === "trust" && `trust-level-${level}`,
      className,
    );

    return (
      <span className={classes} ref={ref} {...props}>
        {children}
      </span>
    );
  },
);

Badge.displayName = "Badge";

export { Badge };

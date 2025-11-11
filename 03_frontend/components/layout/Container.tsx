import React from "react";
import { cn } from "@/lib/utils";

interface ContainerProps {
  children: React.ReactNode;
  size?: "xs" | "sm" | "md" | "lg" | "xl" | "full";
  padding?: "none" | "sm" | "md" | "lg" | "xl";
  className?: string;
  as?: React.ElementType;
}

const Container: React.FC<ContainerProps> = ({
  children,
  size = "lg",
  padding = "md",
  className,
  as: Component = "div",
}) => {
  const sizes = {
    xs: "max-w-xs",
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
    full: "max-w-full",
  };

  const paddings = {
    none: "",
    sm: "px-4 py-2",
    md: "px-4 py-4",
    lg: "px-6 py-6",
    xl: "px-8 py-8",
  };

  const containerClasses = cn(
    "w-full mx-auto",
    sizes[size],
    paddings[padding],
    className,
  );

  return React.createElement(
    Component,
    { className: containerClasses },
    children,
  );
};

export default Container;

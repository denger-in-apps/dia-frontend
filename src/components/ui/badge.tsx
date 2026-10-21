import * as React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "brand" | "lime" | "mint" | "lavender" | "danger" | "outline";
}

export function Badge({
  className,
  variant = "brand",
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold",
        {
          "bg-brand text-white": variant === "brand",
          "bg-accent-lime text-brand": variant === "lime",
          "bg-accent-mint text-brand": variant === "mint",
          "bg-accent-lavender text-brand": variant === "lavender",
          "bg-danger text-white": variant === "danger",
          "border border-current": variant === "outline",
        },
        className
      )}
      {...props}
    />
  );
}

import * as React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center font-medium rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus disabled:pointer-events-none disabled:opacity-50 active:scale-95",
          {
            "bg-brand text-white hover:opacity-90": variant === "primary",
            "bg-accent-lime text-brand hover:opacity-90": variant === "secondary",
            "bg-danger text-white hover:opacity-90": variant === "danger",
            "border border-current bg-transparent hover:bg-black/5 dark:hover:bg-white/5": variant === "outline",
            "bg-transparent hover:bg-black/5 dark:hover:bg-white/5": variant === "ghost",
            "h-8 px-3 text-xs": size === "sm",
            "h-10 px-5 text-sm": size === "md",
            "h-12 px-6 text-base": size === "lg",
          },
          className
        )}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

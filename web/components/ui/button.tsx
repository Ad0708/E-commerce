import * as React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "ghost" | "destructive" | "secondary" | "link";
  size?: "default" | "sm" | "lg" | "icon";
}

const variantClasses: Record<NonNullable<ButtonProps["variant"]>, string> = {
  default:
    "bg-[linear-gradient(to_right,var(--accent-start),var(--accent-mid))] text-white hover:opacity-90 shadow-sm shadow-[var(--accent-mid)]/20 dark:shadow-[var(--accent-mid)]/40",
  
  outline:
    "glass-panel text-foreground hover:bg-black/5 dark:hover:bg-white/10",
  
  ghost:
    "text-foreground hover:bg-black/5 dark:hover:bg-white/10",
  
  destructive:
    "bg-red-500 text-white hover:bg-red-600 shadow-sm shadow-red-500/20 dark:bg-red-500/80 dark:text-red-50 dark:hover:bg-red-500",
  
  secondary:
    "bg-secondary text-foreground hover:bg-black/10 dark:hover:bg-white/10",
  
  link:
    "text-foreground underline-offset-4 hover:underline",
};

const sizeClasses: Record<NonNullable<ButtonProps["size"]>, string> = {
  default: "h-11 px-5 py-2 text-sm",
  sm:      "h-9 px-4 text-xs rounded-lg", 
  lg:      "h-14 px-8 text-base rounded-full", 
  icon:    "h-11 w-11 rounded-full",
};

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", disabled, ...props }, ref) => (
    <button
      ref={ref}
      disabled={disabled}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-xl font-semibold select-none",
        "transition-all duration-300 active:scale-[0.98]",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-mid)] focus-visible:ring-offset-2 dark:focus-visible:ring-offset-background",
        "disabled:pointer-events-none disabled:opacity-50",
        variantClasses[variant],
        sizeClasses[size],
        className,
      )}
      {...props}
    />
  ),
);
Button.displayName = "Button";

export { Button };
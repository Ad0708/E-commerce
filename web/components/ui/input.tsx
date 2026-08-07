import * as React from "react";
import { cn } from "@/lib/utils";

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => (
    <input
      type={type}
      ref={ref}
      className={cn(
        // Base structure & smooth transitions
        "flex h-11 w-full rounded-xl px-4 py-2 text-sm transition-all duration-200 select-text",
        
        // Premium Mode: Clean surfaces, crisp borders
        "border border-[var(--glass-border)] bg-background text-foreground placeholder:text-muted",
        "hover:border-black/20 dark:hover:border-white/20 hover:bg-black/5 dark:hover:bg-white/5",
        
        // High-end Universal Focus States: Deep Aurora accent glow ring
        "focus-visible:outline-none focus-visible:bg-background focus-visible:border-[var(--accent-mid)] focus-visible:ring-4 focus-visible:ring-[var(--accent-mid)]/10",
        
        // Disabled States
        "disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-secondary disabled:hover:border-[var(--glass-border)]",
        
        // Safe Class Override Injection
        className,
      )}
      {...props}
    />
  ),
);
Input.displayName = "Input";

export { Input };
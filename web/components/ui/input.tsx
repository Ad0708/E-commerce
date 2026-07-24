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
        "flex h-10 w-full rounded-xl px-3.5 py-2.5 text-sm transition-all duration-200 select-text",
        
        // Premium Light Mode: Deepened border contrast, crisp interactive shadows, soft indigo focus hints
        "border border-slate-200 bg-slate-50/50 text-slate-800 placeholder:text-slate-400/90 shadow-[inset_0_1px_2px_rgba(0,0,0,0,02)]",
        "hover:border-slate-300 hover:bg-white",
        
        // Premium Dark Mode: Deep zinc surfaces, rich slate borders, crisp contrast
        "dark:border-slate-800/80 dark:bg-slate-900/50 dark:text-slate-100 dark:placeholder:text-slate-500",
        "dark:hover:border-slate-700 dark:hover:bg-slate-900",
        
        // High-end Universal Focus States: Deep Indigo accent glow ring with inner border alignment
        "focus-visible:outline-none focus-visible:bg-white focus-visible:border-indigo-500 focus-visible:ring-4 focus-visible:ring-indigo-500/10",
        "dark:focus-visible:bg-slate-950 dark:focus-visible:border-indigo-400 dark:focus-visible:ring-indigo-400/10",
        
        // Custom File Input Styling: Sleek modern upload capsule alignment
        "file:mr-2 file:inline-flex file:h-6 file:items-center file:rounded-md file:border file:border-slate-200 file:bg-white file:px-2.5 file:text-xs file:font-semibold file:text-slate-700 file:shadow-sm file:transition-colors",
        "dark:file:border-slate-800 dark:file:bg-slate-900 dark:file:text-slate-300",
        "file:cursor-pointer hover:file:bg-slate-50 dark:hover:file:bg-slate-800/80",
        
        // Disabled States
        "disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-slate-100 dark:disabled:bg-slate-900/60 disabled:hover:border-slate-200",
        
        // Safe Class Override Injection
        className,
      )}
      {...props}
    />
  ),
);
Input.displayName = "Input";

export { Input };
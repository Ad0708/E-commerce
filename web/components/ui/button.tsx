import * as React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "ghost" | "destructive" | "secondary" | "link";
  size?: "default" | "sm" | "lg" | "icon";
}

const variantClasses: Record<NonNullable<ButtonProps["variant"]>, string> = {
  // Fixed: Dark mode now uses a premium muted zinc-800 tone that blends instead of blinding white
  default:
    "bg-slate-900 text-white hover:bg-slate-800 shadow-sm dark:bg-slate-200 dark:text-slate-950 dark:hover:bg-slate-300",
  
  // High-end glass effect outline that blends seamlessly into card containers
  outline:
    "border border-slate-200 bg-transparent text-slate-900 hover:bg-slate-50/80 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-900/60 dark:hover:text-slate-100",
  
  // Clean ghost interactive text
  ghost:
    "text-slate-700 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-900/80 dark:hover:text-slate-200",
  
  // Softened red that matches dark background configurations without glowing
  destructive:
    "bg-red-600 text-white hover:bg-red-500 shadow-sm dark:bg-red-950/40 dark:text-red-400 dark:border dark:border-red-900/50 dark:hover:bg-red-950/60",
  
  // Perfect for secondary controls; drops right into the background layout
  secondary:
    "bg-slate-100 text-slate-900 hover:bg-slate-200/80 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800/80",
  
  link:
    "text-slate-900 underline-offset-4 hover:underline dark:text-slate-400 dark:hover:text-slate-200",
};

const sizeClasses: Record<NonNullable<ButtonProps["size"]>, string> = {
  default: "h-9 px-4 py-2 text-sm",
  sm:      "h-8 px-3 text-xs rounded-md", 
  lg:      "h-10 px-5 text-base rounded-xl", 
  icon:    "h-9 w-9",
};

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", disabled, ...props }, ref) => (
    <button
      ref={ref}
      disabled={disabled}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-lg font-medium text-sm select-none",
        "transition-all duration-200 active:scale-[0.98]",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 dark:focus-visible:ring-slate-700 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-950",
        "disabled:pointer-events-none disabled:opacity-40",
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
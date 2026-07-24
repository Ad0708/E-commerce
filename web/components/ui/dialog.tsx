"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/* Context                                                             */
/* ------------------------------------------------------------------ */
interface DialogContextValue {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}
const DialogContext = React.createContext<DialogContextValue>({
  open: false,
  onOpenChange: () => {},
});

/* ------------------------------------------------------------------ */
/* Root                                                                */
/* ------------------------------------------------------------------ */
interface DialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children: React.ReactNode;
  onclose?: () => void;
}

function Dialog({ open = false, onOpenChange = () => {}, onclose, children }: DialogProps) {
  // Intercept open state changes to trigger onclose when closing
  const handleOpenChange = React.useCallback((nextOpen: boolean) => {
    onOpenChange(nextOpen);
    if (!nextOpen && onclose) {
      onclose();
    }
  }, [onOpenChange, onclose]);

  return (
    <DialogContext.Provider value={{ open, onOpenChange: handleOpenChange }}>
      {children}
    </DialogContext.Provider>
  );
}

/* ------------------------------------------------------------------ */
/* Trigger                                                             */
/* ------------------------------------------------------------------ */
function DialogTrigger({ asChild, children }: { asChild?: boolean; children: React.ReactNode }) {
  const { onOpenChange } = React.useContext(DialogContext);
  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children as React.ReactElement<{ onClick?: () => void }>, {
      onClick: () => onOpenChange(true),
    });
  }
  return <button onClick={() => onOpenChange(true)}>{children}</button>;
}

/* ------------------------------------------------------------------ */
/* Portal / Overlay / Content                                          */
/* ------------------------------------------------------------------ */
function DialogPortal({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);
  if (!mounted) return null;
  return createPortal(children, document.body);
}

function DialogOverlay({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  const { onOpenChange } = React.useContext(DialogContext);
  return (
    <div
      className={cn(
        // Enhanced backdrop readability with modern high-blur alpha layers
        "fixed inset-0 z-50 bg-slate-950/40 backdrop-blur-md transition-all duration-300",
        "animate-in fade-in-0 duration-200",
        className,
      )}
      onClick={() => onOpenChange(false)}
      {...props}
    />
  );
}

interface DialogContentProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

function DialogContent({ className, children, ...props }: DialogContentProps) {
  const { open, onOpenChange } = React.useContext(DialogContext);

  // Close on Escape key press
  React.useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onOpenChange(false);
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open, onOpenChange]);

  if (!open) return null;

  return (
    <DialogPortal>
      <DialogOverlay />
      <div
        role="dialog"
        aria-modal="true"
        className={cn(
          // Universal high-end surface style fallbacks
          "fixed left-1/2 top-1/2 z-50 w-[calc(100%-2rem)] max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-xl p-6",
          // Clean solid background rendering
          "border border-slate-200 bg-white text-slate-950 shadow-xl shadow-slate-950/10",
          // Deep dark mode compatibility layers
          "dark:border-slate-800 dark:bg-slate-950 dark:text-slate-50 dark:shadow-black/40",
          // Micro animation smoothing configurations
          "animate-in fade-in-0 zoom-in-95 duration-200",
          className,
        )}
        onClick={(e) => e.stopPropagation()}
        {...props}
      >
        {children}
        
        {/* Upgraded x-close toggle style alignment */}
        <button
          onClick={() => onOpenChange(false)}
          className={cn(
            "absolute right-4 top-4 rounded-lg p-1.5 text-slate-400 transition-colors",
            "hover:bg-slate-100 hover:text-slate-900",
            "dark:text-slate-500 dark:hover:bg-slate-900 dark:hover:text-slate-100",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 dark:focus-visible:ring-slate-600",
          )}
          aria-label="Close"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </DialogPortal>
  );
}

function DialogHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("mb-4 flex flex-col space-y-1.5 text-left", className)} {...props} />
  );
}

function DialogFooter({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "mt-6 flex flex-col-reverse gap-2 border-t border-slate-100 pt-4 sm:flex-row sm:justify-end dark:border-slate-900",
        className
      )}
      {...props}
    />
  );
}

function DialogTitle({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h2
      className={cn(
        "text-lg font-semibold leading-none tracking-tight text-slate-900 dark:text-slate-50",
        className
      )}
      {...props}
    />
  );
}

function DialogDescription({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p className={cn("text-sm text-slate-500 dark:text-slate-400", className)} {...props} />
  );
}

export {
  Dialog,
  DialogTrigger,
  DialogPortal,
  DialogOverlay,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
};
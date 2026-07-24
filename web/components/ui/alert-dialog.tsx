"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/* Context                                                             */
/* ------------------------------------------------------------------ */
interface AlertDialogContextValue {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}
const AlertDialogContext = React.createContext<AlertDialogContextValue>({
  open: false,
  onOpenChange: () => {},
});

/* ------------------------------------------------------------------ */
/* Root                                                                */
/* ------------------------------------------------------------------ */
interface AlertDialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children: React.ReactNode;
}

function AlertDialog({
  open = false,
  onOpenChange = () => {},
  children,
}: AlertDialogProps) {
  return (
    <AlertDialogContext.Provider value={{ open, onOpenChange }}>
      {children}
    </AlertDialogContext.Provider>
  );
}

/* ------------------------------------------------------------------ */
/* Trigger                                                             */
/* ------------------------------------------------------------------ */
function AlertDialogTrigger({ children }: { children: React.ReactNode }) {
  const { onOpenChange } = React.useContext(AlertDialogContext);
  return (
    <span className="cursor-pointer" onClick={() => onOpenChange(true)}>
      {children}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/* Portal                                                              */
/* ------------------------------------------------------------------ */
function AlertDialogPortal({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);
  if (!mounted) return null;
  return createPortal(children, document.body);
}

/* ------------------------------------------------------------------ */
/* Overlay                                                             */
/* ------------------------------------------------------------------ */
function AlertDialogOverlay({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        // Styled backdrop to match primary Dialog
        "fixed inset-0 z-50 bg-slate-950/40 backdrop-blur-md transition-all duration-300",
        "animate-in fade-in-0 duration-200",
        className,
      )}
      {...props}
    />
  );
}

/* ------------------------------------------------------------------ */
/* Content                                                             */
/* ------------------------------------------------------------------ */
function AlertDialogContent({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  const { open } = React.useContext(AlertDialogContext);

  if (!open) return null;

  return (
    <AlertDialogPortal>
      <AlertDialogOverlay />
      <div
        role="alertdialog"
        aria-modal="true"
        className={cn(
          // Universal surface style matching main dialog windows
          "fixed left-1/2 top-1/2 z-50 w-[calc(100%-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-xl p-6",
          "border border-slate-200 bg-white text-slate-950 shadow-xl shadow-slate-950/10",
          "dark:border-slate-800 dark:bg-slate-950 dark:text-slate-50 dark:shadow-black/40",
          "animate-in fade-in-0 zoom-in-95 duration-200",
          className,
        )}
        onClick={(e) => e.stopPropagation()}
        {...props}
      >
        {children}
      </div>
    </AlertDialogPortal>
  );
}

/* ------------------------------------------------------------------ */
/* Header / Footer                                                     */
/* ------------------------------------------------------------------ */
function AlertDialogHeader({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return <div className="mb-4 flex flex-col space-y-2 text-left" {...props} />;
}

function AlertDialogFooter({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        // Structured footer line separation
        "mt-6 flex flex-col-reverse gap-2 border-t border-slate-100 pt-4 sm:flex-row sm:justify-end dark:border-slate-900",
        className,
      )}
      {...props}
    />
  );
}

/* ------------------------------------------------------------------ */
/* Title / Description                                                 */
/* ------------------------------------------------------------------ */
function AlertDialogTitle({
  className,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h2
      className={cn(
        "text-lg font-semibold text-slate-900 dark:text-slate-50",
        className,
      )}
      {...props}
    />
  );
}

function AlertDialogDescription({
  className,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      className={cn("text-sm text-slate-500 dark:text-slate-400", className)}
      {...props}
    />
  );
}

/* ------------------------------------------------------------------ */
/* Action / Cancel buttons                                             */
/* ------------------------------------------------------------------ */
interface AlertDialogActionProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

function AlertDialogAction({ className, ...props }: AlertDialogActionProps) {
  return (
    <button
      className={cn(
        "inline-flex h-9 items-center justify-center rounded-lg px-4 text-sm font-medium select-none",
        "transition-all duration-200 active:scale-[0.98]",
        // Universal default button colors fallback
        "bg-slate-900 text-white hover:bg-slate-800 shadow-sm dark:bg-slate-200 dark:text-slate-950 dark:hover:bg-slate-300",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 dark:focus-visible:ring-slate-600 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-950",
        "disabled:pointer-events-none disabled:opacity-40",
        className,
      )}
      {...props}
    />
  );
}

function AlertDialogCancel({ className, ...props }: AlertDialogActionProps) {
  const { onOpenChange } = React.useContext(AlertDialogContext);
  return (
    <button
      onClick={() => onOpenChange(false)}
      className={cn(
        "inline-flex h-9 items-center justify-center rounded-lg px-4 text-sm font-medium select-none",
        "transition-all duration-200 active:scale-[0.98]",
        // Universal outline button colors fallback
        "border border-slate-200 bg-transparent text-slate-900 hover:bg-slate-50 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-900/60",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 dark:focus-visible:ring-slate-600 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-950",
        "disabled:pointer-events-none disabled:opacity-40",
        className,
      )}
      {...props}
    />
  );
}

export {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogPortal,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
};

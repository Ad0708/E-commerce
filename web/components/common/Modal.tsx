"use client";

import { ReactNode, useEffect } from "react";
import { Loader2, X } from "lucide-react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  children?: ReactNode;
  isLoading?: boolean;
  variant?: "danger" | "primary" | "slate";
}

export default function Modal({
  isOpen,
  onClose,
  onConfirm,
  title = "Are you sure?",
  description = "This action cannot be undone.",
  confirmText = "Confirm",
  cancelText = "Cancel",
  children,
  isLoading = false,
  variant = "danger",
}: ModalProps) {
  // Prevent scrolling on background when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  // Dynamic styles for the main confirm button
  const variantStyles = {
    danger:
      "bg-red-600 hover:bg-red-700 text-white dark:bg-red-600 dark:hover:bg-red-500",
    primary:
      "bg-indigo-600 hover:bg-indigo-700 text-white dark:bg-indigo-600 dark:hover:bg-indigo-500",
    slate:
      "bg-slate-900 hover:bg-slate-800 text-white dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200",
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm transition-opacity"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md transform rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl transition-all animate-in fade-in zoom-in-95 dark:border-slate-800 dark:bg-slate-900"
        onClick={(event) => event.stopPropagation()}
      >
        {/* Close Icon */}
        <button
          type="button"
          onClick={onClose}
          disabled={isLoading}
          className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 disabled:pointer-events-none dark:text-slate-500 dark:hover:bg-slate-800 dark:hover:text-slate-300"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Header Section */}
        <div className="pr-6">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
            {title}
          </h2>

          {description && (
            <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400">
              {description}
            </p>
          )}
        </div>

        {/* Modal Body Content */}
        {children && <div className="mt-4">{children}</div>}

        {/* Action Buttons */}
        <div className="mt-6 flex flex-col-reverse gap-2.5 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="inline-flex w-full items-center justify-center rounded-lg border border-slate-200 bg-white px-4 py-2 text-xs font-medium text-slate-700 transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-400 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:focus:ring-slate-700 sm:w-auto"
          >
            {cancelText}
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className={`inline-flex w-full items-center justify-center gap-2 rounded-lg px-4 py-2 text-xs font-medium transition focus:outline-none focus:ring-2 focus:ring-slate-400 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto ${variantStyles[variant]}`}
          >
            {isLoading ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                Processing...
              </>
            ) : (
              confirmText
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

import React from "react";

// ─── Input class helpers ──────────────────────────────────────────────────────

export function inputClass(hasError?: boolean) {
  return [
    "w-full px-3.5 py-2.5 text-sm rounded-xl border bg-white dark:bg-gray-800",
    "text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500",
    "transition-colors duration-150",
    "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent",
    hasError
      ? "border-red-400 dark:border-red-500"
      : "border-gray-200 dark:border-gray-700",
  ]
    .filter(Boolean)
    .join(" ");
}

export function selectClass(hasError?: boolean) {
  return inputClass(hasError) + " appearance-none cursor-pointer";
}

// ─── Label ────────────────────────────────────────────────────────────────────

interface LabelProps {
  htmlFor?: string;
  children: React.ReactNode;
  required?: boolean;
}

export function FieldLabel({ htmlFor, children, required }: LabelProps) {
  return (
    <label
      htmlFor={htmlFor}
      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5"
    >
      {children}
      {required && <span className="text-red-400 ml-0.5">*</span>}
    </label>
  );
}

// ─── Error message ────────────────────────────────────────────────────────────

export function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p className="mt-1.5 flex items-center gap-1 text-xs text-red-500 dark:text-red-400">
      <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 20 20" fill="currentColor">
        <path
          fillRule="evenodd"
          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
          clipRule="evenodd"
        />
      </svg>
      {message}
    </p>
  );
}

// ─── Wrapper ──────────────────────────────────────────────────────────────────

export function FieldWrapper({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={className ?? "space-y-0"}>{children}</div>;
}
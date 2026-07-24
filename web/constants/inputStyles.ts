import clsx from "clsx";

export const getInputClass = (error?: string, className?: string) =>
  clsx(
    "w-full rounded-xl border bg-white px-4 py-2.5 text-sm text-slate-900 shadow-sm outline-none transition-all",
    "placeholder:text-slate-400",
    "dark:bg-slate-900 dark:text-white dark:placeholder:text-slate-500",

    error
      ? "border-red-500 focus:border-red-500 focus:ring-4 focus:ring-red-500/10"
      : "border-slate-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10",

    className
  );
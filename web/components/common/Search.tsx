"use client";

import { InputHTMLAttributes } from "react";
import { Search, X } from "lucide-react";

interface SearchInputProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "onChange"
> {
  value: string;
  onChange: (value: string) => void;
}

export default function SearchInput({
  value,
  onChange,
  placeholder = "Search...",
  className = "",
  ...props
}: SearchInputProps) {
  return (
    <div className={`relative w-full max-w-md ${className}`}>
      <Search
        size={18}
        className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400"
      />

      <input
        {...props}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="h-11 w-full rounded-xl border border-zinc-200 bg-white pl-11 pr-10 text-sm text-zinc-900 outline-none transition-all placeholder:text-zinc-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 dark:border-zinc-700 dark:bg-zinc-900 dark:text-white dark:placeholder:text-zinc-500 dark:focus:border-blue-600"
      />

      {value && (
        <button
          type="button"
          onClick={() => onChange("")}
          className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-zinc-400 transition hover:bg-zinc-100 hover:text-zinc-700 dark:hover:bg-zinc-800 dark:hover:text-zinc-300"
        >
          <X size={15} />
        </button>
      )}
    </div>
  );
}

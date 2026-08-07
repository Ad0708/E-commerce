"use client";

import SearchInput from "@/components/common/Search";
import { categories } from "@/constants/categories";
import { cn } from "@/lib/utils";
import { ChevronDown, SlidersHorizontal, X } from "lucide-react";
import { useState } from "react";

export const sortOptions = [
  { value: "newest", label: "What's New" },
  { value: "price-low", label: "Price: Low to High" },
  { value: "price-high", label: "Price: High to Low" },
] as const;

export type SortOption = (typeof sortOptions)[number]["value"];

interface ProductFiltersProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  selectedCategory: string | null;
  onCategoryChange: (value: string | null) => void;
  sortBy: SortOption;
  onSortChange: (value: SortOption) => void;
  onClearFilters: () => void;
  totalResults?: number;
  isLoading?: boolean;
}

export default function ProductFilters({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  sortBy,
  onSortChange,
  onClearFilters,
  totalResults,
  isLoading,
}: ProductFiltersProps) {
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [showSortDropdown, setShowSortDropdown] = useState(false);

  const activeCategoryLabel =
    categories.find((c) => c.value === selectedCategory)?.label || null;

  const hasActiveFilters = Boolean(selectedCategory || searchQuery);

  const closeDropdowns = () => {
    setShowCategoryDropdown(false);
    setShowSortDropdown(false);
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex-1 lg:max-w-md">
          <SearchInput
            value={searchQuery}
            onChange={onSearchChange}
            placeholder="Search by name, brand, or SKU..."
            className="w-full rounded-xl bg-secondary/5 border-[var(--glass-border)] shadow-inner transition-colors hover:bg-secondary/10 focus-within:bg-background"
          />
        </div>

        <div className="flex items-center justify-end gap-3 w-full lg:w-auto">

          <div className="relative flex-1 lg:flex-initial">
            <button
              type="button"
              onClick={() => {
                setShowSortDropdown((prev) => !prev);
              }}
              className="flex w-full min-w-[160px] items-center justify-between gap-2 rounded-xl border border-[var(--glass-border)] bg-secondary/5 px-4 py-2.5 text-sm font-bold shadow-sm transition-all hover:border-muted hover:bg-secondary/10 font-heading"
            >
              <span className="truncate">
                {sortOptions.find((o) => o.value === sortBy)?.label}
              </span>
              <SlidersHorizontal
                size={14}
                className="shrink-0 text-muted"
              />
            </button>

            {showSortDropdown && (
              <>
                <div className="fixed inset-0 z-40" onClick={closeDropdowns} />
                <div className="absolute right-0 z-50 mt-1.5 w-48 rounded-xl border border-[var(--glass-border)] bg-background/90 backdrop-blur-xl py-1.5 shadow-xl">
                  {sortOptions.map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => {
                        onSortChange(opt.value);
                        closeDropdowns();
                      }}
                      className={cn(
                        "w-full px-4 py-2 text-left text-xs font-bold font-heading transition-colors",
                        sortBy === opt.value
                          ? "bg-secondary/10 text-foreground"
                          : "text-secondary hover:bg-black/5 dark:hover:bg-white/5",
                      )}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1">
        <button
          type="button"
          onClick={() => onCategoryChange(null)}
          className={cn(
            "shrink-0 rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-wide transition-all font-heading",
            selectedCategory === null
              ? "bg-linear-to-r from-[var(--accent-start)] to-[var(--accent-end)] text-white shadow-md shadow-[var(--accent-mid)]/20"
              : "border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-700 hover:text-foreground shadow-sm",
          )}
        >
          All
        </button>
        {categories.map((cat) => (
          <button
            key={cat.value}
            type="button"
            onClick={() => onCategoryChange(cat.value)}
            className={cn(
              "shrink-0 rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-wide transition-all font-heading",
              selectedCategory === cat.value
                ? "bg-linear-to-r from-[var(--accent-start)] to-[var(--accent-end)] text-white shadow-md shadow-[var(--accent-mid)]/20"
                : "border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-700 hover:text-foreground shadow-sm",
            )}
          >
            {cat.label}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-secondary font-medium">
          {isLoading ? (
            "Loading products..."
          ) : (
            <>
              <span className="font-bold text-foreground">
                {totalResults ?? 0}
              </span>{" "}
              {totalResults === 1 ? "product" : "products"} found
            </>
          )}
        </p>

        {hasActiveFilters && (
          <div className="flex flex-wrap items-center gap-2">
            {selectedCategory && (
              <span className="inline-flex items-center gap-1 rounded-lg bg-secondary/10 border border-[var(--glass-border)] px-2.5 py-1 text-xs font-bold text-foreground">
                {activeCategoryLabel}
                <button
                  type="button"
                  onClick={() => onCategoryChange(null)}
                  className="hover:text-muted"
                  aria-label="Remove category filter"
                >
                  <X size={12} />
                </button>
              </span>
            )}
            {searchQuery && (
              <span className="inline-flex items-center gap-1 rounded-lg bg-secondary/10 border border-[var(--glass-border)] px-2.5 py-1 text-xs font-bold text-foreground">
                &ldquo;{searchQuery}&rdquo;
                <button
                  type="button"
                  onClick={() => onSearchChange("")}
                  className="hover:text-muted"
                  aria-label="Clear search"
                >
                  <X size={12} />
                </button>
              </span>
            )}
            <button
              type="button"
              onClick={onClearFilters}
              className="text-xs text-muted underline hover:text-foreground font-bold transition-colors"
            >
              Clear all
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

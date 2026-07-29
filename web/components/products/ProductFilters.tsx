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
            className="w-full"
          />
        </div>

        <div className="flex items-center gap-3">
          <div className="relative flex-1 sm:flex-initial">
            <button
              type="button"
              onClick={() => {
                setShowSortDropdown(false);
                setShowCategoryDropdown((prev) => !prev);
              }}
              className="flex w-full min-w-40 items-center justify-between gap-2 rounded-xl border border-slate-200/80 bg-white px-4 py-2.5 text-sm font-medium shadow-sm transition-all hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-slate-700"
            >
              <span className="truncate">
                {activeCategoryLabel || "All Categories"}
              </span>
              <ChevronDown
                size={14}
                className={cn(
                  "shrink-0 text-slate-400 transition-transform duration-200",
                  showCategoryDropdown && "rotate-180",
                )}
              />
            </button>

            {showCategoryDropdown && (
              <>
                <div className="fixed inset-0 z-40" onClick={closeDropdowns} />
                <div className="absolute right-0 z-50 mt-1.5 max-h-64 w-52 overflow-y-auto rounded-xl border border-slate-200 bg-white py-1.5 shadow-xl dark:border-slate-800 dark:bg-slate-900">
                  <button
                    type="button"
                    onClick={() => {
                      onCategoryChange(null);
                      closeDropdowns();
                    }}
                    className={cn(
                      "w-full px-4 py-2 text-left text-xs font-medium transition-colors",
                      selectedCategory === null
                        ? "bg-slate-100 font-semibold text-slate-900 dark:bg-slate-800 dark:text-white"
                        : "text-slate-600 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-800/50",
                    )}
                  >
                    All Categories
                  </button>
                  {categories.map((cat) => (
                    <button
                      key={cat.value}
                      type="button"
                      onClick={() => {
                        onCategoryChange(cat.value);
                        closeDropdowns();
                      }}
                      className={cn(
                        "w-full px-4 py-2 text-left text-xs font-medium transition-colors",
                        selectedCategory === cat.value
                          ? "bg-slate-100 font-semibold text-slate-900 dark:bg-slate-800 dark:text-white"
                          : "text-slate-600 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-800/50",
                      )}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          <div className="relative flex-1 sm:flex-initial">
            <button
              type="button"
              onClick={() => {
                setShowCategoryDropdown(false);
                setShowSortDropdown((prev) => !prev);
              }}
              className="flex w-full min-w-[160px] items-center justify-between gap-2 rounded-xl border border-slate-200/80 bg-white px-4 py-2.5 text-sm font-medium shadow-sm transition-all hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-slate-700"
            >
              <span className="truncate">
                {sortOptions.find((o) => o.value === sortBy)?.label}
              </span>
              <SlidersHorizontal
                size={14}
                className="shrink-0 text-slate-400"
              />
            </button>

            {showSortDropdown && (
              <>
                <div className="fixed inset-0 z-40" onClick={closeDropdowns} />
                <div className="absolute right-0 z-50 mt-1.5 w-48 rounded-xl border border-slate-200 bg-white py-1.5 shadow-xl dark:border-slate-800 dark:bg-slate-900">
                  {sortOptions.map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => {
                        onSortChange(opt.value);
                        closeDropdowns();
                      }}
                      className={cn(
                        "w-full px-4 py-2 text-left text-xs font-medium transition-colors",
                        sortBy === opt.value
                          ? "bg-slate-100 font-semibold text-slate-900 dark:bg-slate-800 dark:text-white"
                          : "text-slate-600 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-800/50",
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
            "shrink-0 rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-wide transition-all",
            selectedCategory === null
              ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900"
              : "border border-slate-200 bg-white text-slate-600 hover:border-slate-300 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400 dark:hover:border-slate-600",
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
              "shrink-0 rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-wide transition-all",
              selectedCategory === cat.value
                ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900"
                : "border border-slate-200 bg-white text-slate-600 hover:border-slate-300 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400 dark:hover:border-slate-600",
            )}
          >
            {cat.label}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-slate-500 dark:text-slate-400">
          {isLoading ? (
            "Loading products..."
          ) : (
            <>
              <span className="font-semibold text-slate-900 dark:text-white">
                {totalResults ?? 0}
              </span>{" "}
              {totalResults === 1 ? "product" : "products"} found
            </>
          )}
        </p>

        {hasActiveFilters && (
          <div className="flex flex-wrap items-center gap-2">
            {selectedCategory && (
              <span className="inline-flex items-center gap-1 rounded-lg bg-slate-200/60 px-2.5 py-1 text-xs font-medium text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                {activeCategoryLabel}
                <button
                  type="button"
                  onClick={() => onCategoryChange(null)}
                  className="hover:text-slate-900 dark:hover:text-white"
                  aria-label="Remove category filter"
                >
                  <X size={12} />
                </button>
              </span>
            )}
            {searchQuery && (
              <span className="inline-flex items-center gap-1 rounded-lg bg-slate-200/60 px-2.5 py-1 text-xs font-medium text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                &ldquo;{searchQuery}&rdquo;
                <button
                  type="button"
                  onClick={() => onSearchChange("")}
                  className="hover:text-slate-900 dark:hover:text-white"
                  aria-label="Clear search"
                >
                  <X size={12} />
                </button>
              </span>
            )}
            <button
              type="button"
              onClick={onClearFilters}
              className="text-xs text-slate-500 underline hover:text-slate-800 dark:hover:text-slate-300"
            >
              Clear all
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

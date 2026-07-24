"use client";

import Pagination from "@/components/common/Pagination";
import SearchInput from "@/components/common/Search";
import ProductGrid from "@/components/products/ProductGrid";
import { categories } from "@/constants/categories";
import { useProducts } from "@/hooks/product/useProducts";
import { useDebounce } from "@/hooks/useDebounce";
import { useWishlistStore } from "@/store/wishlist.store";
import { Product } from "@/types/product";
import { Wishlist } from "@/types/wishlist";
import { ChevronDown, Package, SlidersHorizontal, X } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

const sortOptions = [
  { value: "newest", label: "What's New" },
  { value: "price-low", label: "Price: Low to High" },
  { value: "price-high", label: "Price: High to Low" },
];

export default function ProductsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState("newest");
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);

  const searchParams = useSearchParams();
  const currentCategory = searchParams.get("category");

  useEffect(() => {
    if (currentCategory) {
      setSelectedCategory(currentCategory);
    }
  }, [currentCategory]);

  const debouncedSearch = useDebounce(searchQuery, 500);

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);

  const { data, isLoading } = useProducts({
    page,
    limit,
    search: debouncedSearch || undefined,
    category: selectedCategory || undefined,
  });

  // Reset page whenever filters change
  useEffect(() => {
    setPage(1);
  }, [searchQuery, selectedCategory, sortBy]);

  // Dynamic sorting engine based on selection
  const filteredProducts: Product[] = useMemo(() => {
    const result: Product[] = [...(data?.products || [])];
    if (sortBy === "price-low") {
      result.sort(
        (a, b) => (a.discountPrice ?? a.price) - (b.discountPrice ?? b.price),
      );
    } else if (sortBy === "price-high") {
      result.sort(
        (a, b) => (b.discountPrice ?? b.price) - (a.discountPrice ?? a.price),
      );
    }
    return result;
  }, [data?.products, sortBy]);

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCategory(null);
    setSortBy("newest");
  };

  const wishlist = useWishlistStore((state) => state.wishlist);
  const wishlistSet = useMemo<Set<string>>(
    () => new Set((wishlist ?? []).map((item: Wishlist) => item.product._id)),
    [wishlist],
  );

  const activeCategoryLabel =
    categories.find((c) => c.value === selectedCategory)?.label ||
    selectedCategory;

  return (
    <main className="mx-auto min-h-screen w-full max-w-350 px-4 py-8 sm:px-6 lg:px-8 bg-slate-50 text-slate-900 transition-colors duration-300 dark:bg-slate-950 dark:text-slate-50">
      {/* ============ COMPACT FILTER & CONTROLS ROW ============ */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        {/* Interactive Search Input */}
        <div className="relative flex-1 max-w-md">
          <SearchInput
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search products..."
            className="w-full"
          />
        </div>

        {/* Filters and Sort Dropdowns */}
        <div className="flex items-center gap-3 w-full sm:w-auto">
          {/* Category Dropdown */}
          <div className="relative flex-1 sm:flex-initial">
            <button
              onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
              className="flex w-full items-center justify-between gap-2 rounded-xl border border-slate-200/80 bg-white px-4 py-2.5 text-sm font-medium shadow-sm transition-all hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-slate-700"
            >
              <span className="truncate max-w-30 sm:max-w-40">
                {activeCategoryLabel || "All Categories"}
              </span>
              <ChevronDown
                size={14}
                className={`text-slate-400 shrink-0 transition-transform duration-200 ${
                  showCategoryDropdown ? "rotate-180" : ""
                }`}
              />
            </button>

            {showCategoryDropdown && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setShowCategoryDropdown(false)}
                />
                <div className="absolute right-0 z-20 mt-1.5 w-52 rounded-xl border border-slate-200 bg-white py-1.5 shadow-xl dark:bg-slate-900 dark:border-slate-800 max-h-64 overflow-y-auto">
                  <button
                    onClick={() => {
                      setSelectedCategory(null);
                      setShowCategoryDropdown(false);
                    }}
                    className={`w-full px-4 py-2 text-left text-xs font-medium transition-colors ${
                      selectedCategory === null
                        ? "bg-slate-100 text-slate-900 font-semibold dark:bg-slate-800 dark:text-white"
                        : "text-slate-600 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-800/50"
                    }`}
                  >
                    All Categories
                  </button>
                  {categories.map((cat) => (
                    <button
                      key={cat.value}
                      onClick={() => {
                        setSelectedCategory(cat.value);
                        setShowCategoryDropdown(false);
                      }}
                      className={`w-full px-4 py-2 text-left text-xs font-medium transition-colors ${
                        selectedCategory === cat.value
                          ? "bg-slate-100 text-slate-900 font-semibold dark:bg-slate-800 dark:text-white"
                          : "text-slate-600 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-800/50"
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Sort Dropdown */}
          <div className="relative flex-1 sm:flex-initial">
            <button
              onClick={() => setShowSortDropdown(!showSortDropdown)}
              className="flex w-full items-center justify-between gap-2 rounded-xl border border-slate-200/80 bg-white px-4 py-2.5 text-sm font-medium shadow-sm transition-all hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-slate-700"
            >
              <span className="truncate">
                {sortOptions.find((o) => o.value === sortBy)?.label}
              </span>
              <SlidersHorizontal
                size={14}
                className="text-slate-400 shrink-0"
              />
            </button>

            {showSortDropdown && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setShowSortDropdown(false)}
                />
                <div className="absolute right-0 z-20 mt-1.5 w-48 rounded-xl border border-slate-200 bg-white py-1.5 shadow-xl dark:bg-slate-900 dark:border-slate-800">
                  {sortOptions.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => {
                        setSortBy(opt.value);
                        setShowSortDropdown(false);
                      }}
                      className={`w-full px-4 py-2 text-left text-xs font-medium transition-colors ${
                        sortBy === opt.value
                          ? "bg-slate-100 text-slate-900 font-semibold dark:bg-slate-800 dark:text-white"
                          : "text-slate-600 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-800/50"
                      }`}
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

      {/* Active Filter Indicators */}
      {(selectedCategory || searchQuery) && (
        <div className="mb-6 flex flex-wrap items-center gap-2">
          <span className="text-xs font-medium text-slate-400 dark:text-slate-500">
            Active Filters:
          </span>
          {selectedCategory && (
            <span className="inline-flex items-center gap-1 rounded-lg bg-slate-200/60 px-2.5 py-1 text-xs font-medium text-slate-700 dark:bg-slate-800 dark:text-slate-300">
              {activeCategoryLabel}
              <button
                onClick={() => setSelectedCategory(null)}
                className="hover:text-slate-900 dark:hover:text-white"
              >
                <X size={12} />
              </button>
            </span>
          )}
          {searchQuery && (
            <span className="inline-flex items-center gap-1 rounded-lg bg-slate-200/60 px-2.5 py-1 text-xs font-medium text-slate-700 dark:bg-slate-800 dark:text-slate-300">
              "{searchQuery}"
              <button
                onClick={() => setSearchQuery("")}
                className="hover:text-slate-900 dark:hover:text-white"
              >
                <X size={12} />
              </button>
            </span>
          )}
          <button
            onClick={clearFilters}
            className="text-xs text-slate-500 hover:text-slate-800 underline dark:hover:text-slate-300 ml-1"
          >
            Clear all
          </button>
        </div>
      )}

      {/* ============ PRODUCT DISPLAY GRID LAYER ============ */}
      {isLoading ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="animate-pulse rounded-2xl bg-white border border-slate-200/80 h-80 dark:bg-slate-900 dark:border-slate-800"
            />
          ))}
        </div>
      ) : filteredProducts.length > 0 ? (
        <div className="space-y-8">
          {/* Main Full Page Scrollable Product Grid */}
          <ProductGrid
            products={filteredProducts}
            mode="customer"
            wishlist={wishlistSet}
          />

          {data?.pagination && (
            <div className="pt-4 border-t border-slate-200/80 dark:border-slate-800/80">
              <Pagination
                page={page}
                total={data.pagination.total ?? 0}
                totalPages={data.pagination.totalPages ?? 1}
                limit={limit}
                hasNextPage={data.pagination.hasNextPage ?? false}
                hasPreviousPage={data.pagination.hasPreviousPage ?? false}
                onPageChange={(newPage) => setPage(newPage)}
                onLimitChange={(newLimit) => {
                  setLimit(newLimit);
                  setPage(1);
                }}
              />
            </div>
          )}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-white py-16 text-center dark:bg-slate-900 dark:border-slate-800">
          <Package className="h-10 w-10 text-slate-300 dark:text-slate-700" />
          <h3 className="mt-4 text-base font-semibold">No products matched</h3>
          <p className="mt-1 text-xs text-slate-500 max-w-sm">
            We couldn't find anything matching your current filters or search
            term.
          </p>
          <button
            onClick={clearFilters}
            className="mt-5 rounded-xl bg-slate-900 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-950 dark:hover:bg-white transition-colors"
          >
            Reset Filters
          </button>
        </div>
      )}
    </main>
  );
}

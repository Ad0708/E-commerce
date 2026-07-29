"use client";

import Pagination from "@/components/common/Pagination";
import ProductFilters, {
  SortOption,
} from "@/components/products/ProductFilters";
import ProductGrid from "@/components/products/ProductGrid";
import { useProducts } from "@/hooks/product/useProducts";
import { useDebounce } from "@/hooks/useDebounce";
import { useWishlistStore } from "@/store/wishlist.store";
import { Product } from "@/types/product";
import { Wishlist } from "@/types/wishlist";
import { Package, Sparkles } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";

export default function ProductsPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<SortOption>("newest");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const debouncedSearch = useDebounce(searchQuery, 400);

  // Sync category from URL on mount / navigation
  useEffect(() => {
    const categoryFromUrl = searchParams.get("category");
    setSelectedCategory(categoryFromUrl);
  }, [searchParams]);

  const updateCategory = useCallback(
    (category: string | null) => {
      setSelectedCategory(category);
      const params = new URLSearchParams(searchParams.toString());
      if (category) params.set("category", category);
      else params.delete("category");
      const query = params.toString();
      router.replace(query ? `${pathname}?${query}` : pathname, {
        scroll: false,
      });
    },
    [pathname, router, searchParams]
  );

  useEffect(() => {
    window.scrollTo(0, 0);
  } ,[page ,  selectedCategory, sortBy]);

  const { data, isLoading } = useProducts({
    page,
    limit,
    search: debouncedSearch || undefined,
    category: selectedCategory || undefined,
  });

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, selectedCategory, sortBy]);

  const filteredProducts: Product[] = useMemo(() => {
    const result: Product[] = [...(data?.products || [])];
    if (sortBy === "price-low") {
      result.sort(
        (a, b) => (a.discountPrice ?? a.price) - (b.discountPrice ?? b.price)
      );
    } else if (sortBy === "price-high") {
      result.sort(
        (a, b) => (b.discountPrice ?? b.price) - (a.discountPrice ?? a.price)
      );
    }
    return result;
  }, [data?.products, sortBy]);

  const clearFilters = () => {
    setSearchQuery("");
    setSortBy("newest");
    updateCategory(null);
  };

  const wishlist = useWishlistStore((state) => state.wishlist);
  const wishlistSet = useMemo<Set<string>>(
    () => new Set((wishlist ?? []).map((item: Wishlist) => item.product._id)),
    [wishlist]
  );

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 transition-colors duration-300 dark:bg-slate-950 dark:text-slate-50">
      Page hero — offset for fixed header
      <section className="border-b border-slate-200/80 bg-white pt-24 dark:border-slate-800 dark:bg-slate-900">
        <div className="mx-auto max-w-360 px-4 pb-10 sm:px-6 lg:px-8">
          <div className="flex items-start gap-3">
            <div className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-900 text-white dark:bg-white dark:text-slate-900">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-slate-500">
                Browse Collection
              </p>
              <h1 className="mt-1 text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
                All Products
              </h1>
              <p className="mt-2 max-w-xl text-sm text-slate-500 dark:text-slate-400">
                Discover our full range — filter by category, search by name or
                brand, and sort to find exactly what you need.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Sticky filter bar */}
      <div className="sticky top-[72px] z-40 border-b border-slate-200/80 bg-slate-50/95 backdrop-blur-md dark:border-slate-800 dark:bg-slate-950/95">
        <div className="mx-auto max-w-360 px-4 py-4 sm:px-8 lg:px-8">
          <ProductFilters
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            selectedCategory={selectedCategory}
            onCategoryChange={updateCategory}
            sortBy={sortBy}
            onSortChange={setSortBy}
            onClearFilters={clearFilters}
            totalResults={data?.pagination?.total}
            isLoading={isLoading}
          />
        </div>
      </div>

      {/* Product grid */}
      <section className="mx-auto max-w-360 px-4 py-8 sm:px-6 lg:px-8">
        {isLoading ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="h-80 animate-pulse rounded-2xl border border-slate-200/80 bg-white dark:border-slate-800 dark:bg-slate-900"
              />
            ))}
          </div>
        ) : filteredProducts.length > 0 ? (
          <div className="space-y-8">
            <ProductGrid
              products={filteredProducts}
              mode="customer"
              wishlist={wishlistSet}
            />

            {data?.pagination && (
              <div className="border-t border-slate-200/80 pt-4 dark:border-slate-800/80">
                <Pagination
                  page={page}
                  total={data.pagination.total ?? 0}
                  totalPages={data.pagination.totalPages ?? 1}
                  limit={limit}
                  hasNextPage={data.pagination.hasNextPage ?? false}
                  hasPreviousPage={data.pagination.hasPreviousPage ?? false}
                  onPageChange={setPage}
                  onLimitChange={(newLimit) => {
                    setLimit(newLimit);
                    setPage(1);
                  }}
                />
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-white py-20 text-center dark:border-slate-800 dark:bg-slate-900">
            <Package className="h-10 w-10 text-slate-300 dark:text-slate-700" />
            <h3 className="mt-4 text-base font-semibold">No products matched</h3>
            <p className="mt-1 max-w-sm text-xs text-slate-500">
              We couldn&apos;t find anything matching your current filters or
              search term.
            </p>
            <button
              type="button"
              onClick={clearFilters}
              className="mt-5 rounded-xl bg-slate-900 px-5 py-2.5 text-xs font-semibold text-white shadow-sm transition-colors hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-950 dark:hover:bg-white"
            >
              Reset Filters
            </button>
          </div>
        )}
      </section>
    </main>
  );
}

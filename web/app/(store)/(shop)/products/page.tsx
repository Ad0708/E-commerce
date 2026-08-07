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
import { categories } from "@/constants/categories";
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

  const activeCategoryLabel =
    categories.find((c) => c.value === selectedCategory)?.label || "All Products";

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
    <main className="min-h-screen bg-[var(--bg-primary)] text-foreground transition-colors duration-300 flex flex-col pt-24 lg:pt-28">

      {/* Sticky filter bar */}
      <div className="sticky top-[72px] z-40 border-b border-[var(--glass-border)] bg-background/80 backdrop-blur-xl">
        <div className="mx-auto max-w-370 px-4 py-4 sm:px-6 lg:px-8">
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
      <section className="mx-auto w-full max-w-370 px-4 py-12 sm:px-6 lg:px-8 flex-1">
        {isLoading ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="h-[28rem] animate-pulse rounded-3xl border border-[var(--glass-border)] bg-black/5 dark:bg-white/5"
              />
            ))}
          </div>
        ) : filteredProducts.length > 0 ? (
          <div className="space-y-8 w-full">
            <ProductGrid
              products={filteredProducts}
              mode="customer"
              wishlist={wishlistSet}
            />

            {data?.pagination && (
              <div className="border-t border-[var(--glass-border)] pt-8 mt-12">
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
          <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-[var(--glass-border)] bg-background py-20 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-secondary/10 text-secondary mb-4">
              <Package className="h-8 w-8" />
            </div>
            <h3 className="mt-4 text-xl font-bold font-heading text-foreground">No products found</h3>
            <p className="mt-2 max-w-sm text-sm font-medium text-secondary">
              We couldn&apos;t find anything matching your current filters or
              search term.
            </p>
            <button
              type="button"
              onClick={clearFilters}
              className="mt-8 rounded-full bg-linear-to-r from-[var(--accent-start)] to-[var(--accent-end)] px-8 py-3 text-sm font-bold uppercase tracking-widest text-white shadow-md shadow-[var(--accent-mid)]/20 transition-transform hover:-translate-y-1 active:scale-95"
            >
              Reset Filters
            </button>
          </div>
        )}
      </section>
    </main>
  );
}

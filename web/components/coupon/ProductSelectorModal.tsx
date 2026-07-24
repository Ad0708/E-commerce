"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { useProducts } from "@/hooks/product/useProducts"; // adjust path as needed
import { Product } from "@/types/product";

// ─── Types ────────────────────────────────────────────────────────────────────

interface ProductSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (selected: Product[]) => void;
  initialSelected?: Product[];
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function ProductCardSkeleton() {
  return (
    <div className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 dark:border-gray-700 animate-pulse">
      <div className="w-14 h-14 rounded-lg bg-gray-200 dark:bg-gray-700 shrink-0" />
      <div className="flex-1 space-y-2">
        <div className="h-3.5 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/3" />
      </div>
      <div className="w-5 h-5 rounded bg-gray-200 dark:bg-gray-700 shrink-0" />
    </div>
  );
}

// ─── Product Card ─────────────────────────────────────────────────────────────

interface ProductCardProps {
  product: Product;
  checked: boolean;
  onToggle: (product: Product) => void;
}

function ProductSelectionCard({
  product,
  checked,
  onToggle,
}: ProductCardProps) {
  const category =
    typeof product.category === "object"
      ? product.category
      : (product.category ?? "—");

  return (
    <button
      type="button"
      onClick={() => onToggle(product)}
      className={`
        w-full flex items-center gap-3 p-3 rounded-xl border text-left transition-all duration-150
        focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500
        ${
          checked
            ? "border-blue-500 bg-blue-50 dark:bg-blue-950/40 dark:border-blue-500"
            : "border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700/50"
        }
      `}
    >
      {/* Image */}
      <div className="relative w-14 h-14 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700 shrink-0">
        {product.images?.[0] ? (
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.style.display = "none";
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-xs text-gray-500 dark:text-gray-300 text-center px-1">
            {product.name}
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate">
          {product.name}
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400 truncate mt-0.5">
          {category}
        </p>
        <div className="flex items-center gap-3 mt-1">
          <span className="text-xs font-medium text-blue-600 dark:text-blue-400">
            ${product.price?.toFixed(2)}
          </span>
          {product.stock !== undefined && (
            <span
              className={`text-xs ${
                product.stock > 0
                  ? "text-green-600 dark:text-green-400"
                  : "text-red-500 dark:text-red-400"
              }`}
            >
              {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
            </span>
          )}
        </div>
      </div>

      {/* Checkbox */}
      <div
        className={`
          w-5 h-5 rounded-md border-2 shrink-0 flex items-center justify-center transition-colors
          ${
            checked
              ? "bg-blue-600 border-blue-600"
              : "bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600"
          }
        `}
      >
        {checked && (
          <svg className="w-3 h-3 text-white" viewBox="0 0 12 12" fill="none">
            <path
              d="M2 6l3 3 5-5"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </div>
    </button>
  );
}

// ─── Main Modal ───────────────────────────────────────────────────────────────

const LIMIT = 10;

export function ProductSelectorModal({
  isOpen,
  onClose,
  onSave,
  initialSelected = [],
}: ProductSelectorModalProps) {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(1);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [selected, setSelected] = useState<Product[]>(initialSelected);

  const observerRef = useRef<IntersectionObserver | null>(null);
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const listRef = useRef<HTMLDivElement | null>(null);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
      setHasMore(true);
    }, 400);
    return () => clearTimeout(timer);
  }, [search]);

  // Sync selected when modal opens
  useEffect(() => {
    // console.log("initialSelected", initialSelected);
    if (isOpen) {
      setSelected(initialSelected);
      setSearch("");
      setDebouncedSearch("");
      setPage(1);
      setHasMore(true);
    }
  }, [isOpen, initialSelected]); // eslint-disable-line react-hooks/exhaustive-deps

  const { data, isFetching, isError } = useProducts({
    page,
    limit: LIMIT,
    search: debouncedSearch,
    enabled: isOpen,
  });

  useEffect(() => {
    if (!data) return;

    const incoming: Product[] = data.products ?? [];

    setAllProducts((prev) => {
      const merged = page === 1 ? incoming : [...prev, ...incoming];

      return merged.filter(
        (product, index, self) =>
          index === self.findIndex((p) => p._id === product._id),
      );
    });

    const total = data?.total ?? incoming.length;
    setHasMore(page * LIMIT < total);
  }, [data, page]);
  // Infinite scroll observer
  const setupObserver = useCallback(() => {
    if (observerRef.current) observerRef.current.disconnect();
    if (!sentinelRef.current || !hasMore || isFetching) return;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isFetching) {
          setPage((p) => p + 1);
        }
      },
      { threshold: 0.1 },
    );
    observerRef.current.observe(sentinelRef.current);
  }, [hasMore, isFetching]);

  useEffect(() => {
    setupObserver();
    return () => observerRef.current?.disconnect();
  }, [setupObserver]);

  const toggleProduct = (product: Product) => {
    setSelected((prev) => {
      const exists = prev.find((p) => p._id === product._id);
      return exists
        ? prev.filter((p) => p._id !== product._id)
        : [...prev, product];
    });
  };

  const handleSave = () => {
    onSave(selected);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative z-10 w-full max-w-2xl max-h-[90vh] flex flex-col bg-white dark:bg-gray-900 rounded-2xl shadow-2xl overflow-hidden border border-gray-100 dark:border-gray-800">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between shrink-0">
          <div>
            <h2 className="text-base font-semibold text-gray-900 dark:text-white">
              Select Products
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              {selected.length > 0
                ? `${selected.length} product${selected.length !== 1 ? "s" : ""} selected`
                : "Select products to apply the discount"}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>

        {/* Search */}
        <div className="px-6 py-3 border-b border-gray-100 dark:border-gray-800 shrink-0">
          <div className="relative">
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                clipRule="evenodd"
              />
            </svg>
            <input
              type="text"
              placeholder="Search products…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 text-sm rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            />
          </div>
        </div>

        {/* Product list */}
        <div
          ref={listRef}
          className="flex-1 overflow-y-auto px-6 py-4 space-y-2"
        >
          {isError && (
            <div className="py-8 text-center">
              <p className="text-sm text-red-500 dark:text-red-400">
                Failed to load products. Please try again.
              </p>
            </div>
          )}

          {allProducts.map((product) => (
            <ProductSelectionCard
              key={product._id}
              product={product}
              checked={!!selected.find((p) => p._id === product._id)}
              onToggle={toggleProduct}
            />
          ))}

          {/* Loading skeletons */}
          {isFetching &&
            Array.from({ length: 4 }).map((_, i) => (
              <ProductCardSkeleton key={`sk-${i}`} />
            ))}

          {/* Empty state */}
          {!isFetching && allProducts.length === 0 && !isError && (
            <div className="py-16 text-center">
              <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mx-auto mb-3">
                <svg
                  className="w-6 h-6 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                  />
                </svg>
              </div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                No products found
              </p>
              {debouncedSearch && (
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                  Try a different search term
                </p>
              )}
            </div>
          )}

          {/* Infinite scroll sentinel */}
          <div ref={sentinelRef} className="h-1" />
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between shrink-0 bg-gray-50 dark:bg-gray-900/50">
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {selected.length} selected
          </span>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={selected.length === 0}
              className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors"
            >
              Save Selection
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

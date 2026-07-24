"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  CheckCircle2,
  Download,
  Loader2,
  Package,
  RefreshCcw,
  Search,
  Sparkles,
  Tag,
} from "lucide-react";

import Pagination from "@/components/common/Pagination";
import { useInventoryForecast } from "@/hooks/ai/useAI";
import { useallProducts } from "@/hooks/product/useAllProduct";
import { Product } from "@/types/product";

export default function InventoryForecastingPage() {
  const [productId, setProductId] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);

  const { data: productsData, isLoading: isProductsLoading } = useallProducts({
    page,
    limit,
    search,
  });

  const {
    mutate: generateForecast,
    data: forecastData,
    isPending,
    isError,
    error,
    reset,
  } = useInventoryForecast();

  const products: Product[] = productsData?.products ?? [];

  const selectedProduct = products.find(
    (product: Product) => product._id === productId,
  );

  const handleGenerateForecast = () => {
    if (!productId) return;

    generateForecast({
      productId,
    });
  };

  const handleProductChange = (value: string) => {
    // If clicking the currently selected product, deselect it (set to "")
    setProductId((prevId) => (prevId === value ? "" : value));
    reset();
  };

  const handleSearch = (value: string) => {
    setSearch(value);
    setPage(1);
    setProductId("");
    reset();
  };

  return (
    <main className="mx-auto w-full max-w-7xl space-y-8 p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <section className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <Link
            href="/admin/ai"
            className="mb-4 inline-flex items-center gap-2 text-xs font-medium text-slate-500 transition-colors hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to AI Tools
          </Link>

          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400">
              <Package className="h-5 w-5" />
            </div>

            <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100 sm:text-2xl">
              Inventory Forecasting
            </h1>
          </div>

          <p className="mt-2 max-w-2xl text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Use AI to analyze product demand and predict future inventory needs.
          </p>
        </div>
      </section>

      {/* Product Selection Card */}
      <section className="rounded-xl border border-slate-200 bg-white p-5 sm:p-6 dark:border-slate-800 dark:bg-slate-900/60">
        <div className="mb-6">
          <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">
            Select Product
          </h2>

          <p className="mt-0.5 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Search and select a product to generate its inventory forecast.
          </p>
        </div>

        {/* Search Input */}
        <div className="mb-5">
          <label
            htmlFor="product-search"
            className="mb-1.5 block text-xs font-medium text-slate-700 dark:text-slate-300"
          >
            Search Product
          </label>

          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 dark:text-slate-500" />

            <input
              id="product-search"
              type="text"
              value={search}
              onChange={(event) => handleSearch(event.target.value)}
              placeholder="Search by product name..."
              className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-400 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-slate-600"
            />
          </div>
        </div>

        {/* Product List */}
        <div className="space-y-2.5 overflow-y-auto max-h-100">
          {isProductsLoading ? (
            <div className="flex min-h-[180px] items-center justify-center rounded-lg border border-dashed border-slate-200 bg-slate-50/50 dark:border-slate-800 dark:bg-slate-900/30">
              <div className="flex flex-col items-center gap-2.5 text-center">
                <Loader2 className="h-6 w-6 animate-spin text-slate-600 dark:text-slate-400" />
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Loading products...
                </p>
              </div>
            </div>
          ) : products.length === 0 ? (
            <div className="flex min-h-[180px] items-center justify-center rounded-lg border border-dashed border-slate-200 bg-slate-50/50 dark:border-slate-800 dark:bg-slate-900/30">
              <div className="text-center">
                <Package className="mx-auto h-7 w-7 text-slate-400 dark:text-slate-600" />
                <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                  No products found.
                </p>
              </div>
            </div>
          ) : (
            products.map((product: Product) => (
              <button
                key={product._id}
                type="button"
                onClick={() => handleProductChange(product._id)}
                className={`flex w-full items-center justify-between gap-4 rounded-lg border p-3.5 text-left transition ${
                  productId === product._id
                    ? "border-slate-900 bg-slate-50 dark:border-slate-100 dark:bg-slate-800/60"
                    : "border-slate-200 bg-white hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-slate-700"
                }`}
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-slate-900 dark:text-slate-100">
                    {product.name}
                  </p>

                  <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500 dark:text-slate-400">
                    <span>Stock: {product.stock}</span>
                    <span>Category: {product.category}</span>
                    <span className="capitalize">Status: {product.status}</span>
                  </div>
                </div>

                {productId === product._id && (
                  <CheckCircle2 className="h-5 w-5 shrink-0 text-slate-900 dark:text-slate-100" />
                )}
              </button>
            ))
          )}
        </div>

        {/* Built-in Pagination Component */}
        {products.length > 0 && (
          <div className="mt-6 border-t border-slate-200 pt-4 dark:border-slate-800">
            <Pagination
              page={page}
              total={productsData.pagination.total ?? 0}
              totalPages={productsData.pagination.totalPages ?? 1}
              limit={limit}
              hasNextPage={productsData.pagination.hasNextPage ?? false}
              hasPreviousPage={productsData.pagination.hasPreviousPage ?? false}
              onPageChange={(newPage) => setPage(newPage)}
              onLimitChange={(newLimit) => {
                setLimit(newLimit);
                setPage(1);
              }}
            />
          </div>
        )}

        {/* Generate Button */}
        <div className="mt-5 flex justify-end">
          <button
            type="button"
            onClick={handleGenerateForecast}
            disabled={isPending || !productId}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200 sm:w-auto"
          >
            {isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                Generate Forecast
              </>
            )}
          </button>
        </div>
      </section>

      {/* Selected Product Summary */}
      {selectedProduct && (
        <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <InfoCard
            title="Current Stock"
            value={selectedProduct.stock}
            icon={Package}
            iconBg="bg-indigo-50 text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400"
          />

          <InfoCard
            title="Product Status"
            value={selectedProduct.status}
            icon={CheckCircle2}
            iconBg="bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400"
          />

          <InfoCard
            title="Product Category"
            value={selectedProduct.category}
            icon={Tag}
            iconBg="bg-violet-50 text-violet-600 dark:bg-violet-950/50 dark:text-violet-400"
          />
        </section>
      )}

      {/* Error State */}
      {isError && (
        <section className="rounded-xl border border-red-200 bg-red-50 p-4 dark:border-red-900/50 dark:bg-red-950/30">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs text-red-600 dark:text-red-400">
              {error instanceof Error
                ? error.message
                : "Failed to generate inventory forecast."}
            </p>

            <button
              type="button"
              onClick={handleGenerateForecast}
              className="inline-flex w-fit items-center gap-1.5 rounded-lg border border-red-200 bg-white px-3 py-1.5 text-xs font-medium text-red-600 transition hover:bg-red-50 dark:border-red-900/50 dark:bg-slate-900 dark:text-red-400 dark:hover:bg-red-950/50"
            >
              <RefreshCcw className="h-3.5 w-3.5" />
              Retry
            </button>
          </div>
        </section>
      )}

      {/* Loading State */}
      {isPending && (
        <section className="flex min-h-[380px] items-center justify-center rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900/60">
          <div className="flex flex-col items-center gap-2.5 text-center">
            <Loader2 className="h-6 w-6 animate-spin text-slate-600 dark:text-slate-400" />
            <p className="text-xs text-slate-500 dark:text-slate-400">
              AI is analyzing inventory and sales data...
            </p>
          </div>
        </section>
      )}

      {/* Forecast Result */}
      {forecastData && !isPending && (
        <section className="rounded-xl border border-slate-200 bg-white p-5 sm:p-6 dark:border-slate-800 dark:bg-slate-900/60">
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-amber-50 text-amber-600 dark:bg-amber-950/50 dark:text-amber-400">
                <Sparkles className="h-4 w-4" />
              </div>

              <div>
                <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">
                  Inventory Forecast
                </h2>

                <p className="mt-0.5 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                  AI-powered inventory analysis for {selectedProduct?.name}.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => window.print()}
              className="inline-flex w-fit items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 transition hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              <Download className="h-3.5 w-3.5" />
              Export
            </button>
          </div>

          <div className="rounded-lg border border-dashed border-slate-200 bg-slate-50/50 p-5 sm:p-6 dark:border-slate-800 dark:bg-slate-900/30">
            <div className="space-y-3">
              {forecastData.forecast
                .split("\n")
                .map((line: string, index: number) => {
                  const trimmedLine = line.trim();

                  if (!trimmedLine) {
                    return <div key={index} className="h-1" />;
                  }

                  if (trimmedLine.startsWith("###")) {
                    return (
                      <h3
                        key={index}
                        className="pt-2 text-xs font-semibold uppercase tracking-wider text-slate-900 dark:text-slate-100"
                      >
                        {trimmedLine.replace(/^###\s*/, "")}
                      </h3>
                    );
                  }

                  if (trimmedLine.startsWith("##")) {
                    return (
                      <h3
                        key={index}
                        className="pt-2 text-sm font-semibold text-slate-900 dark:text-slate-100"
                      >
                        {trimmedLine.replace(/^##\s*/, "")}
                      </h3>
                    );
                  }

                  if (trimmedLine.startsWith("- ")) {
                    return (
                      <div
                        key={index}
                        className="flex gap-2.5 text-xs leading-relaxed text-slate-600 dark:text-slate-300"
                      >
                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-indigo-500" />
                        <p>{trimmedLine.replace(/^-\s*/, "")}</p>
                      </div>
                    );
                  }

                  return (
                    <p
                      key={index}
                      className="text-xs leading-relaxed text-slate-600 dark:text-slate-300"
                    >
                      {trimmedLine}
                    </p>
                  );
                })}
            </div>
          </div>
        </section>
      )}

      {/* Empty State */}
      {!forecastData && !isPending && !isError && (
        <section className="flex min-h-[350px] items-center justify-center rounded-xl border border-dashed border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900/60">
          <div className="max-w-md text-center">
            <Package className="mx-auto h-8 w-8 text-slate-400 dark:text-slate-600" />

            <h2 className="mt-3 text-sm font-semibold text-slate-900 dark:text-slate-100">
              No Forecast Generated
            </h2>

            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Search and select a product above, then generate an AI-powered
              inventory forecast.
            </p>
          </div>
        </section>
      )}
    </main>
  );
}

function InfoCard({
  title,
  value,
  icon: Icon,
  iconBg,
}: {
  title: string;
  value: string | number;
  icon: React.ElementType;
  iconBg: string;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900/60">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
            {title}
          </p>

          <p className="mt-2 text-xl font-bold capitalize text-slate-900 dark:text-slate-100">
            {value}
          </p>
        </div>

        <div
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${iconBg}`}
        >
          <Icon className="h-4 w-4" />
        </div>
      </div>
    </div>
  );
}

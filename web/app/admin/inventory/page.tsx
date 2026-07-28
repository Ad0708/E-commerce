"use client";

import InventoryTable from "@/components/admin/inventory/InventoryTable";
import InventoryTableSkeleton from "@/components/admin/inventory/InventoryTableSkeleton";
import Pagination from "@/components/common/Pagination";
import SearchInput from "@/components/common/Search";
import { SummaryCard } from "@/components/common/SummaryCard";
import { useInventory } from "@/hooks/admin/inventory/useInventory";
import { useDebounce } from "@/hooks/useDebounce";
import { StockFilter } from "@/types/inventory";
import { Package, PackageCheck, PackageX, TriangleAlert } from "lucide-react";
import { useCallback, useState } from "react";

// ─── Stock badge ──────────────────────────────────────────────────────────────

// ─── Inline stock editor ──────────────────────────────────────────────────────

function FilterPill({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`text-xs font-medium px-3 py-1.5 rounded-full border transition-all ${
        active
          ? "bg-blue-500 border-blue-500 text-white"
          : "bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:border-gray-400 dark:hover:border-gray-500"
      }`}
    >
      {label}
    </button>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────
export default function InventoryPage() {
  const [search, setSearch] = useState("");
  const [stockFilter, setStockFilter] = useState<StockFilter>("all");
  const [category, setCategory] = useState("all");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5); // Defaulting to 2 items as per your spec

  // --- Search Debouncing (Prevents API spamming) ---
  const debouncedSearch = useDebounce(search, 400);

  // --- Data Fetching Hook Execution ---
  const { data, isLoading, isFetching } = useInventory({
    search: debouncedSearch,
    stockFilter,
    category,
    page,
    limit,
  });

  // --- Context Mutators & Reset Handlers ---
  const handleSearch = useCallback((value: string) => {
    setSearch(value);
    setPage(1);
  }, []);

  const handleFilter = (f: StockFilter) => {
    setStockFilter(f);
    setPage(1); // Crucial: Reset to page 1 on tab filtering shifts
  };

  const handleCategory = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCategory(e.target.value);
    setPage(1); // Crucial: Reset to page 1 on option select transitions
  };

  // --- Structural Component Meta Mappings ---
  const stockFilters: { label: string; value: StockFilter }[] = [
    { label: "All", value: "all" },
    { label: "In stock", value: "in" },
    { label: "Low stock", value: "low" },
    { label: "Out of stock", value: "out" },
  ];
  return (
    <div className="flex flex-col h-[calc(100vh-10rem)] min-h-125 text-slate-900 dark:text-slate-50">
      {/* ============ FIXED TOP WRAPPER (Header + Summaries + Filters) ============ */}
      <div className="shrink-0 space-y-4 pb-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Inventory</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Click any stock number to edit it inline
            </p>
          </div>
          {isFetching && !isLoading && (
            <span className="flex items-center gap-1.5 text-xs text-slate-400 dark:text-slate-500">
              <span className="w-3 h-3 border-2 border-gray-200 dark:border-gray-700 border-t-blue-400 rounded-full animate-spin" />
              Syncing…
            </span>
          )}
        </div>

        {/* Summary Cards Grid */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <SummaryCard
            label="Total Products"
            value={data?.summary.total ?? 0}
            color="gray"
            icon={
              <Package className="h-6 w-6 text-violet-600 dark:text-violet-400" />
            }
            iconBg="bg-violet-100 dark:bg-violet-900/30"
          />

          <SummaryCard
            label="In Stock"
            value={data?.summary.in ?? 0}
            color="green"
            icon={
              <PackageCheck className="h-6 w-6 text-green-600 dark:text-green-400" />
            }
            iconBg="bg-green-100 dark:bg-green-900/30"
          />

          <SummaryCard
            label="Low Stock"
            value={data?.summary.low ?? 0}
            color="amber"
            icon={
              <TriangleAlert className="h-6 w-6 text-amber-600 dark:text-amber-400" />
            }
            iconBg="bg-amber-100 dark:bg-amber-900/30"
          />

          <SummaryCard
            label="Out of Stock"
            value={data?.summary.out ?? 0}
            color="red"
            icon={
              <PackageX className="h-6 w-6 text-red-600 dark:text-red-400" />
            }
            iconBg="bg-red-100 dark:bg-red-900/30"
          />
        </div>

        {/* Filters Toolbar */}
        <div className="flex flex-col gap-3 md:flex-row md:items-center">
          {/* Search Field */}
          <div className="relative flex-1 w-full">
            <SearchInput value={search} onChange={handleSearch} />
          </div>

          {/* Dropdowns Container (Side-by-side on mobile, integrated on desktop) */}
          <div className="flex items-center gap-3 w-full md:w-auto">
            {/* Category Dropdown */}
            <div className="relative flex-1 md:min-w-40 md:flex-initial">
              <select
                value={category}
                onChange={handleCategory}
                className="w-full appearance-none rounded-xl border border-slate-200 bg-white px-4 py-2.5 pr-10 text-sm outline-none transition focus:border-blue-500 dark:border-slate-800 dark:bg-slate-900 dark:text-white"
              >
                <option value="all">All categories</option>
                {data?.categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
              <svg
                className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400"
                viewBox="0 0 16 16"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  d="M4 6l4 4 4-4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>

            {/* Stock Filter Pills Row integrated or kept here */}
            <div className="flex gap-1.5 flex-wrap flex-1 md:flex-initial md:w-auto">
              {/* Kept out to save desktop line horizontal space, or placed right below */}
            </div>
          </div>
        </div>

        {/* Extra sub-row for pills on small sizes if they don't fit up top */}
        <div className="flex gap-2 flex-wrap pt-1">
          {stockFilters.map((f) => (
            <FilterPill
              key={f.value}
              label={f.label}
              active={stockFilter === f.value}
              onClick={() => handleFilter(f.value)}
            />
          ))}
        </div>
      </div>

      <div className="flex-1">
        {isLoading ? (
          <InventoryTableSkeleton />
        ) : (
          <InventoryTable data={data} />
        )}
      </div>

      {/* ============ FIXED STICKY FOOTER PAGINATION ============ */}
      {data?.pagination && (
        <div className="shrink-0  border-slate-100 bg-slate-50/80 backdrop-blur-sm dark:border-slate-800 dark:bg-slate-950/80">
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
  );
}

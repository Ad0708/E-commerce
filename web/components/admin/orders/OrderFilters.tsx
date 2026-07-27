"use client";

import { ChangeEvent, useEffect, useState } from "react";
import { AdminOrderFilters } from "@/api/adminorders";
import { Calendar, Filter } from "lucide-react";
import SearchInput from "@/components/common/Search";
import { useDebounce } from "@/hooks/useDebounce";

interface OrderFiltersProps {
  filters: AdminOrderFilters;
  onFilterChange: (newFilters: Partial<AdminOrderFilters>) => void;
}

export default function OrderFilters({
  filters,
  onFilterChange,
}: OrderFiltersProps) {
  const currentYear = new Date().getFullYear();

  const [searchInput, setSearchInput] = useState(filters.search || "");

  const [isCustomRange, setIsCustomRange] = useState(
    Boolean(filters.startDate || filters.endDate),
  );

  const debouncedSearch = useDebounce(searchInput, 500);

  useEffect(() => {
    if (debouncedSearch !== filters.search) {
      onFilterChange({
        search: debouncedSearch,
        page: 1,
      });
    }
  }, [debouncedSearch, filters.search, onFilterChange]);

  useEffect(() => {
    setSearchInput(filters.search || "");
  }, [filters.search]);

  useEffect(() => {
    if (filters.startDate || filters.endDate) {
      setIsCustomRange(true);
    }
  }, [filters.startDate, filters.endDate]);

  const handleSearchChange = (value: string) => {
    setSearchInput(value);
  };

  const handleStatusChange = (e: ChangeEvent<HTMLSelectElement>) => {
    onFilterChange({
      status: e.target.value || undefined,
      page: 1,
    });
  };

  const handlePresetDateChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    const now = new Date();

    if (value === "custom") {
      setIsCustomRange(true);

      onFilterChange({
        year: undefined,
        month: undefined,
        startDate: undefined,
        endDate: undefined,
        page: 1,
      });

      return;
    }

    setIsCustomRange(false);

    let updatedDates: Partial<AdminOrderFilters> = {
      year: undefined,
      month: undefined,
      startDate: undefined,
      endDate: undefined,
    };

    if (value === "current_month") {
      updatedDates.year = now.getFullYear().toString();
      updatedDates.month = (now.getMonth() + 1).toString();
    }

    if (value === "previous_month") {
      const previousMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

      updatedDates.year = previousMonth.getFullYear().toString();
      updatedDates.month = (previousMonth.getMonth() + 1).toString();
    }

    if (value === "current_year") {
      updatedDates.year = now.getFullYear().toString();
    }

    if (value === "previous_year") {
      updatedDates.year = (now.getFullYear() - 1).toString();
    }

    onFilterChange({
      ...updatedDates,
      page: 1,
    });
  };
  const handleCustomDateChange = (
    type: "startDate" | "endDate",
    value: string,
  ) => {
    setIsCustomRange(true);

    onFilterChange({
      [type]: value || undefined,
      year: undefined,
      month: undefined,
      page: 1,
    });
  };

  const getPresetValue = () => {
    if (isCustomRange) {
      return "custom";
    }

    const now = new Date();

    const currentYearValue = now.getFullYear().toString();
    const currentMonthValue = (now.getMonth() + 1).toString();

    const previousMonthDate = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      1,
    );

    const previousYearValue = previousMonthDate.getFullYear().toString();
    const previousMonthValue = (previousMonthDate.getMonth() + 1).toString();

    if (
      filters.year === currentYearValue &&
      filters.month === currentMonthValue
    ) {
      return "current_month";
    }

    if (
      filters.year === previousYearValue &&
      filters.month === previousMonthValue
    ) {
      return "previous_month";
    }

    if (filters.year === currentYearValue && !filters.month) {
      return "current_year";
    }

    if (filters.year === (currentYear - 1).toString() && !filters.month) {
      return "previous_year";
    }

    return "all";
  };

  return (
    <div className="space-y-3">
      {/* Filters Header Container */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Search Bar - Takes available space on the left */}
        <div className="relative w-full md:flex-1 min-w-60">
          <SearchInput
            value={searchInput}
            onChange={handleSearchChange}
            className="w-full"
            placeholder="Search orders..."
          />
        </div>

        {/* Filters Group - Right Aligned */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-end shrink-0">
          {/* Status Filter */}
          <div className="relative flex-1 md:flex-none w-full sm:w-48">
            <Filter
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400 dark:text-zinc-500 pointer-events-none"
              size={16}
            />

            <select
              value={filters.status || ""}
              onChange={handleStatusChange}
              className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent appearance-none cursor-pointer transition"
            >
              <option value="">All Statuses</option>
              <option value="Pending">Pending</option>
              <option value="Confirmed">Confirmed</option>
              <option value="Processing">Processing</option>
              <option value="Shipped">Shipped</option>
              <option value="Out For Delivery">Out For Delivery</option>
              <option value="Delivered">Delivered</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>

          {/* Date Preset Filter */}
          <div className="relative flex-1 md:flex-none w-full sm:w-48">
            <Calendar
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400 dark:text-zinc-500 pointer-events-none"
              size={16}
            />

            <select
              value={getPresetValue()}
              onChange={handlePresetDateChange}
              className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent appearance-none cursor-pointer transition"
            >
              <option value="all">All Time</option>
              <option value="current_month">Current Month</option>
              <option value="previous_month">Previous Month</option>
              <option value="current_year">Current Year</option>
              <option value="previous_year">Previous Year</option>
              <option value="custom">Custom Range</option>
            </select>
          </div>
        </div>
      </div>

      {/* Custom Date Range Panel */}
      {isCustomRange && (
        <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800/60 flex flex-col sm:flex-row items-center justify-end gap-3 sm:gap-4 animate-in fade-in duration-200">
          <div className="w-full sm:w-48">
            <label className="block text-[10px] sm:text-xs font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider mb-1.5 truncate">
              Start Date
            </label>

            <input
              type="date"
              value={filters.startDate || ""}
              onChange={(e) =>
                handleCustomDateChange("startDate", e.target.value)
              }
              className="w-full px-3 sm:px-4 py-2 text-sm bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition"
            />
          </div>

          <div className="w-full sm:w-48">
            <label className="block text-[10px] sm:text-xs font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider mb-1.5 truncate">
              End Date
            </label>

            <input
              type="date"
              value={filters.endDate || ""}
              onChange={(e) =>
                handleCustomDateChange("endDate", e.target.value)
              }
              className="w-full px-3 sm:px-4 py-2 text-sm bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition"
            />
          </div>
        </div>
      )}
    </div>
  );
}

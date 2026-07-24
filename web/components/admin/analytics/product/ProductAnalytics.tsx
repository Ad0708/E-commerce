// components/analytics/products/ProductAnalytics.tsx
"use client";

import React from "react";
import ProductSummaryCards from "./ProductSummaryCards";
import RevenueByProductChart from "./RevenueByProductChart";
import ProfitByProductChart from "./ProfitByProductChart";
import TopSellingProducts from "./TopSellingProducts";
import LeastSellingProducts from "./LeastSellingProducts";

export default function ProductAnalytics() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
          Product Analytics
        </h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Real-time tracking of Product performance.
        </p>
      </div>
      <ProductSummaryCards />

      {/* Visual Analytics Layer */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <RevenueByProductChart />
        <ProfitByProductChart />
      </div>

      {/* Tables Performance Layer */}
      {/* <div className="grid grid-cols-1 gap-6 lg:grid-cols-2"> */}
      <div className="grid grid-cols-1 gap-6">
        <TopSellingProducts />
        <LeastSellingProducts />
      </div>
    </div>
  );
}

"use client";

import { SalesSummaryCards } from "./SalesSummaryCards";
import { PaymentAnalyticsChart } from "./PaymentAnalyticsChart";
import { OrderStatusChart } from "./OrderStatusChart";
import { RefundAnalytics } from "./RefundAnalytics";
import { DiscountAnalytics } from "./DiscountAnalytics";
import { CategoryRevenueChart } from "./CategoryRevenueChart";
import SalesAnalyticsChart from "./SalesAnalyticsChart";

export function SalesAnalytics() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
          Sales Analytics
        </h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Real-time tracking of sales, inventory, and customer activity.
        </p>
      </div>
      {/* Summary KPIs */}
      <SalesSummaryCards />

      {/* Revenue Trend — full width */}
      <SalesAnalyticsChart />

      {/* Payment + Order Status side by side */}
      <div className="grid gap-4 md:grid-cols-2">
        <PaymentAnalyticsChart />
        <OrderStatusChart />
      </div>

      {/* Refunds + Discounts side by side */}
      <div className="grid gap-4 md:grid-cols-2">
        <RefundAnalytics />
        <DiscountAnalytics />
      </div>

      {/* Category Revenue — full width */}
      <CategoryRevenueChart />
    </div>
  );
}

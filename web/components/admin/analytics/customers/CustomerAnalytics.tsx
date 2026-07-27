"use client";

import CustomerOrderFrequencyChart from "./CustomerOrderFrequencyChart";
import CustomerRegistrationTrend from "./CustomerRegistrationTrend";
import CustomerSummaryCards from "./CustomerSummaryCards";
import FavoriteCategoriesChart from "./FavoriteCategoriesChart";
import RepeatCustomersChart from "./RepeatCustomersChart";
import TopCustomersTable from "./TopCustomersTable";

export default function CustomerAnalytics() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
          Customer Analytics
        </h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Real-time tracking of customer activity.
        </p>
      </div>
      <CustomerSummaryCards />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <CustomerRegistrationTrend />
        </div>
        <div>
          <RepeatCustomersChart />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <FavoriteCategoriesChart />
        <CustomerOrderFrequencyChart />
      </div>

      <TopCustomersTable />
    </div>
  );
}

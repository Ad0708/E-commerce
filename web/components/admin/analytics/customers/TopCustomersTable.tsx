"use client";

import { useTopCustomers } from "@/hooks/admin/analytics/useCustomerAnalytics";
import { Trophy } from "lucide-react";
import Image from "next/image";
import { EmptyStateView } from "./StateViews";

const formatINR = (value: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);

const formatDate = (dateStr: string) => {
  if (!dateStr) return "-";
  return new Date(dateStr).toLocaleDateString("en-IN", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

export default function TopCustomersTable() {
  const { data, isLoading } = useTopCustomers();

  if (isLoading) return <TableSkeletonHeader />;
  if (!data || data.length === 0)
    return <EmptyStateView message="No dynamic profile returns" />;

  return (
    <div className="rounded-xl border border-slate-200 bg-white shadow-sm transition-shadow hover:shadow-md dark:border-slate-800 dark:bg-slate-900">
      <div className="border-b border-slate-100 p-5 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <div className="rounded-lg bg-amber-50 p-2 text-amber-600 dark:bg-amber-950/30 dark:text-amber-400">
            <Trophy className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-slate-900 dark:text-slate-50">
              Top Performing Customers
            </h3>
            <p className="text-xs text-slate-400 dark:text-slate-500">
              Elite consumer profiles categorized by aggregate transaction yield
            </p>
          </div>
        </div>
      </div>

      <div className="relative overflow-x-auto max-h-110 overflow-y-auto">
        <table className="w-full text-left text-sm text-slate-500 dark:text-slate-400">
          <thead className="sticky top-0 z-10 bg-slate-50 text-xs font-semibold uppercase text-slate-700 dark:bg-slate-800/80 dark:text-slate-300 backdrop-blur-sm border-b border-slate-200 dark:border-slate-700">
            <tr>
              <th scope="col" className="px-6 py-3">
                Customer
              </th>
              <th scope="col" className="px-6 py-3">
                Email Address
              </th>
              <th scope="col" className="px-6 py-3 text-right">
                Orders
              </th>
              <th scope="col" className="px-6 py-3 text-right">
                Total Spent
              </th>
              <th scope="col" className="px-6 py-3 text-right">
                Avg Order
              </th>
              <th scope="col" className="px-6 py-3 text-right">
                Last Purchase
              </th>
              <th scope="col" className="px-6 py-3 text-right">
                Joined Date
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
            {data.map((customer) => {
              const fallbackInitials = customer.name
                ? customer.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .substring(0, 2)
                    .toUpperCase()
                : "CS";
              return (
                <tr
                  key={customer._id}
                  className="bg-white hover:bg-slate-50/70 transition-colors dark:bg-slate-900 dark:hover:bg-slate-800/50"
                >
                  <td className="whitespace-nowrap px-6 py-4 font-medium text-slate-900 dark:text-slate-100">
                    <div className="flex items-center gap-3">
                      <div className="relative h-9 w-9 shrink-0 rounded-full overflow-hidden border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 flex items-center justify-center font-bold text-xs text-slate-400">
                        {customer.avatar ? (
                          <Image
                            src={customer.avatar}
                            alt={customer.name}
                            fill
                            sizes="36px"
                            className="object-cover"
                            unoptimized
                          />
                        ) : (
                          <span>{fallbackInitials}</span>
                        )}
                      </div>
                      <span className="truncate max-w-37.5 text-sm font-semibold">
                        {customer.name}
                      </span>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm">
                    {customer.email}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-right font-medium text-slate-900 dark:text-slate-100">
                    {customer.totalOrders.toLocaleString("en-IN")}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-right font-semibold text-slate-900 dark:text-slate-50">
                    {formatINR(customer.totalSpent)}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-right font-medium text-slate-600 dark:text-slate-400">
                    {formatINR(customer.averageOrderValue)}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-right text-xs">
                    {formatDate(customer.lastPurchase)}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-right text-xs text-slate-400">
                    {formatDate(customer.joinedAt)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function TableSkeletonHeader() {
  return (
    <div className="w-full rounded-xl border border-slate-200 bg-white p-5 space-y-4 dark:border-slate-800 dark:bg-slate-900 animate-pulse">
      <div className="flex items-center gap-3">
        <div className="h-8 w-8 rounded-lg bg-slate-200 dark:bg-slate-800" />
        <div className="space-y-2">
          <div className="h-4 w-36 rounded bg-slate-200 dark:bg-slate-800" />
          <div className="h-3 w-56 rounded bg-slate-100 dark:bg-slate-800/60" />
        </div>
      </div>
      <div className="space-y-2 pt-2">
        <div className="h-10 w-full rounded bg-slate-50 dark:bg-slate-800/20" />
        <div className="h-10 w-full rounded bg-slate-50 dark:bg-slate-800/20" />
      </div>
    </div>
  );
}

"use client";

import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { TrendingUp, Package, Users, Megaphone } from "lucide-react";
import ProductAnalytics from "@/components/admin/analytics/product/ProductAnalytics";
import CustomerAnalytics from "@/components/admin/analytics/customers/CustomerAnalytics";
import MarketingAnalyticsPage from "@/components/admin/analytics/market/MarketingAnalysis";
import { SalesAnalytics } from "@/components/admin/analytics/sales/SalesAnalytics";

export type AnalyticsTab = "sales" | "products" | "customers" | "marketing";

const navItems = [
  { id: "sales" as AnalyticsTab, label: "Sales", icon: TrendingUp },
  { id: "products" as AnalyticsTab, label: "Products", icon: Package },
  { id: "customers" as AnalyticsTab, label: "Customers", icon: Users },
  { id: "marketing" as AnalyticsTab, label: "Marketing", icon: Megaphone },
];

export default function AnalyticsPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Read active tab from URL query params, default to "sales"
  const currentTab = searchParams.get("tab") as AnalyticsTab;
  const activeTab: AnalyticsTab = navItems.some(
    (item) => item.id === currentTab,
  )
    ? currentTab
    : "sales";

  const handleTabChange = (tab: AnalyticsTab) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", tab);
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="w-full min-w-0 space-y-6">
      {/* Scrollable Tab Bar Container */}
      <div className="w-full border-b border-slate-200 dark:border-slate-800">
        <div className="overflow-x-auto custom-scrollbar -mb-px">
          <nav className="flex min-w-max gap-4 sm:gap-6 px-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleTabChange(item.id)}
                  className={`inline-flex items-center gap-2 border-b-2 pb-3 pt-1 text-xs sm:text-sm font-semibold transition-colors shrink-0 whitespace-nowrap ${
                    isActive
                      ? "border-blue-600 text-blue-600 dark:border-blue-500 dark:text-blue-400"
                      : "border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
                  }`}
                >
                  <Icon size={16} className="shrink-0" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Analytics Content Body */}
      <div className="w-full min-w-0 overflow-hidden">
        {activeTab === "sales" && <SalesAnalytics />}
        {activeTab === "products" && <ProductAnalytics />}
        {activeTab === "customers" && <CustomerAnalytics />}
        {activeTab === "marketing" && <MarketingAnalyticsPage />}
      </div>
    </div>
  );
}

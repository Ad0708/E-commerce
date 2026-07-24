  "use client";

  import { motion } from "framer-motion";

  export type AnalyticsTab =
    | "sales"
    | "products"
    | "customers"
    | "website"
    | "marketing";

  interface AnalyticsTabsProps {
    value: AnalyticsTab;
    onChange: (value: AnalyticsTab) => void;
  }

  const tabs: {
    value: AnalyticsTab;
    label: string;
  }[] = [
    { value: "sales", label: "Sales" },
    { value: "products", label: "Products" },
    { value: "customers", label: "Customers" },
    // { value: "website", label: "Website" },  
    { value: "marketing", label: "Marketing" },
  ];

  export function AnalyticsTabs({ value, onChange }: AnalyticsTabsProps) {
    return (
      <div className="w-full">
        {/* - bg-slate-100/60 (Light slate-blue tint) | bg-slate-900/40 (Dark slate-blue tint)
          - border-slate-200/40 | border-slate-800/40 (Ultra-lightened borders)
        */}
        <div className="grid grid-cols-4 items-center gap-1 w-full rounded-xl border border-slate-200/40 dark:border-slate-800/40 bg-slate-100/60 dark:bg-slate-900/40 p-1 backdrop-blur-sm">
          {tabs.map((tab) => {
            const isActive = value === tab.value;
            return (
              <button
                key={tab.value}
                type="button"
                onClick={() => onChange(tab.value)}
                className="relative flex items-center justify-center rounded-lg py-2 text-center text-xs md:text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50"
                style={{
                  WebkitTapHighlightColor: "transparent",
                }}
              >
                {/* Active Sliding Pill:
                  - Uses a soft, translucent light-blue fill in light mode (bg-blue-50/80)
                  - Uses a deep, subtle slate-blue in dark mode (bg-blue-950/40)
                  - Styled with a delicate blue-tinted border
                */}
                {isActive && (
                  <motion.span
                    layoutId="activeTabIndicator"
                    className="absolute inset-0 z-0 rounded-lg bg-blue-50/80 dark:bg-blue-950/40 border border-blue-100/50 dark:border-blue-900/30 shadow-[0_1px_2px_rgba(59,130,246,0.05)]"
                    transition={{ type: "spring", stiffness: 450, damping: 35 }}
                  />
                )}
                
                {/* Text Colors:
                  - Active text pops with vibrant slate-blue (text-blue-600 / text-blue-400)
                  - Inactive text rests in a neutral slate tone
                */}
                <span
                  className={`relative z-10 block transition-colors duration-150 truncate ${
                    isActive
                      ? "text-blue-600 dark:text-blue-400 font-semibold"
                      : "text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200"
                  }`}
                >
                  {tab.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    );
  }
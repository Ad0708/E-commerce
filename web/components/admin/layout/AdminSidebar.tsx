"use client";

import { useLogout } from "@/hooks/auth/uselogout";
import {
  Boxes,
  ExternalLink,
  LayoutDashboard,
  LogOut,
  Package,
  RotateCcw,
  Settings,
  ShoppingCart,
  Sparkles,
  TicketPercent,
  Users,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

interface Props {
  mobileSidebarOpen: boolean;
  setMobileSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
  desktopCollapsed: boolean;
}

const menuGroups = [
  {
    groupLabel: "General",
    items: [
      {
        title: "Dashboard",
        href: "/admin",
        icon: LayoutDashboard,
      },
    ],
  },
  {
    groupLabel: "Management",
    items: [
      {
        title: "Products",
        href: "/admin/products",
        icon: Package,
      },
      {
        title: "Inventory",
        href: "/admin/inventory",
        icon: Boxes,
      },
      {
        title: "Orders",
        href: "/admin/orders",
        icon: ShoppingCart,
      },
      {
        title: "Refunds",
        href: "/admin/refunds",
        icon: RotateCcw,
      },
      {
        title: "Customers",
        href: "/admin/customers",
        icon: Users,
      },
    ],
  },
  {
    groupLabel: "Promotions & AI",
    items: [
      {
        title: "Coupons",
        href: "/admin/coupons",
        icon: TicketPercent,
      },
      {
        title: "AI Tools",
        href: "/admin/ai",
        icon: Sparkles,
      },
    ],
  },
  {
    groupLabel: "Configuration",
    items: [
      {
        title: "Store Settings",
        href: "/admin/settings",
        icon: Settings,
      },
    ],
  },
];

export default function AdminSidebar({
  mobileSidebarOpen,
  setMobileSidebarOpen,
  desktopCollapsed,
}: Props) {
  const pathname = usePathname();
  const router = useRouter();
  const { mutate: logout } = useLogout();

  const handleLogout = () => {
    logout(undefined, {
      onSuccess: () => {
        router.replace("/login");
        router.refresh();
      },
    });
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`
          fixed left-0 top-0 z-50 flex h-[calc(100vh-1rem)] flex-col
          border border-slate-200 bg-white/90 backdrop-blur-xl
          dark:border-slate-800 dark:bg-slate-900/90
          transition-all duration-300 m-2 rounded-2xl overflow-hidden shadow-sm

          ${mobileSidebarOpen ? "translate-x-0" : "-translate-x-full"}

          lg:translate-x-0
          ${desktopCollapsed ? "lg:w-20" : "lg:w-64"}
        `}
      >
        {/* Fixed Header */}
        <div className="shrink-0 border-b border-slate-200/60 px-4.5 h-20 dark:border-slate-800/60 flex flex-col justify-center">
          {!desktopCollapsed ? (
            <>
              <h1 className="bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-2xl font-bold text-transparent">
                Admin Panel
              </h1>
              <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                Manage your store
              </p>
            </>
          ) : (
            <div className="flex justify-center text-2xl font-bold text-blue-600">
              A
            </div>
          )}
        </div>

        {/* Scrollable Middle Area (Categorized Navigation) */}
        <div className="flex-1 overflow-y-auto p-3 space-y-5 custom-scrollbar">
          {menuGroups.map((group, groupIdx) => (
            <div key={groupIdx} className="space-y-1">
              {!desktopCollapsed ? (
                <div className="px-3 pb-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 font-mono">
                  {group.groupLabel}
                </div>
              ) : (
                <div className="my-2 border-t border-slate-200/40 dark:border-slate-800/40 first:hidden" />
              )}

              {group.items.map((item) => {
                const Icon = item.icon;
                const isActive =
                  pathname === item.href ||
                  (item.href !== "/admin" && pathname.startsWith(item.href));

                return (
                  <Link
                    key={item.title}
                    href={item.href}
                    onClick={() => setMobileSidebarOpen(false)}
                    className={`group flex items-center rounded-xl px-3.5 py-2.5 transition-all duration-200 ${
                      desktopCollapsed ? "justify-center" : "gap-3.5"
                    } ${
                      isActive
                        ? "bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-md font-medium"
                        : "text-slate-600 hover:bg-slate-100/80 dark:text-slate-300 dark:hover:bg-slate-800/60"
                    }`}
                  >
                    <Icon size={19} className="shrink-0" />

                    {!desktopCollapsed && (
                      <span className="text-sm font-medium tracking-tight">
                        {item.title}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          ))}
        </div>

        {/* Fixed Footer Actions */}
        <div className="shrink-0 space-y-1 border-t border-slate-200/60 p-3 dark:border-slate-800/60">
          <Link
            href="/home"
            className={`flex items-center rounded-xl px-3.5 py-2.5 text-slate-600 transition hover:bg-slate-100/80 dark:text-slate-300 dark:hover:bg-slate-800/60 ${
              desktopCollapsed ? "justify-center" : "gap-3.5"
            }`}
          >
            <ExternalLink size={19} className="shrink-0" />

            {!desktopCollapsed && (
              <span className="text-sm font-medium tracking-tight">
                View Store
              </span>
            )}
          </Link>

          <button
            type="button"
            className={`flex w-full items-center rounded-xl px-3.5 py-2.5 text-red-500 transition hover:bg-red-50 dark:hover:bg-red-500/10 ${
              desktopCollapsed ? "justify-center" : "gap-3.5"
            }`}
            onClick={handleLogout}
          >
            <LogOut size={19} className="shrink-0" />

            {!desktopCollapsed && (
              <span className="text-sm font-medium tracking-tight">Logout</span>
            )}
          </button>
        </div>
      </aside>
    </>
  );
}

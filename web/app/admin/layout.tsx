"use client";

import { useState } from "react";
import AdminHeader from "../../components/admin/layout/AdminHeader";
import AdminSidebar from "../../components/admin/layout/AdminSidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [desktopCollapsed, setDesktopCollapsed] = useState(false);

  return (
    <div className="min-h-screen w-full bg-slate-50 dark:bg-slate-950 flex relative">
      <AdminSidebar
        mobileSidebarOpen={mobileSidebarOpen}
        setMobileSidebarOpen={setMobileSidebarOpen}
        desktopCollapsed={desktopCollapsed}
      />

      <div
        className={`flex flex-col flex-1 min-w-0 transition-all duration-300 ${
          desktopCollapsed ? "lg:ml-24" : "lg:ml-68"
        }`}
      >
        {/* Sticky Header stays pinned at top of viewport */}
        <div className="sticky top-0 z-30 w-full bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 rounded-2xl">
          <AdminHeader
            onToggleSidebar={() => {
              if (window.innerWidth >= 1024) {
                setDesktopCollapsed((prev) => !prev);
              } else {
                setMobileSidebarOpen((prev) => !prev);
              }
            }}
          />
        </div>

        {/* Main body expands to allow natural full-page browser scrolling */}
        <main className="w-full max-w-370 mx-auto px-6 py-6 min-w-0 flex-1">
          {children}
        </main>
      </div>
    </div>
  );
}

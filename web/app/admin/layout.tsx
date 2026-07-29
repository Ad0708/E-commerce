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
        setDesktopCollapsed={setDesktopCollapsed}
      />

      <div
        className={`flex flex-col flex-1 min-w-0 transition-all duration-300 p-2 ${
          desktopCollapsed ? "lg:ml-21" : "lg:ml-67"
        }`}
      >
        {/* Sticky Header */}
        <div className="sticky top-2 z-30 w-full">
          <AdminHeader
            onToggleSidebar={() => setMobileSidebarOpen((prev) => !prev)}
          />
        </div>

        {/* Main Content Area */}
        <main
          className={`w-full mx-auto px-4 sm:px-6 py-6 min-w-0 flex-1 transition-all duration-300 ${
            desktopCollapsed ? "max-w-420" : "max-w-370"
          }`}
        >
          {children}
        </main>
      </div>
    </div>
  );
}

"use client";

import { Menu } from "lucide-react";
import { useRouter } from "next/navigation";
import ThemeToggle from "../../common/ThemeToggle";

interface Props {
  onToggleSidebar: () => void;
}

export default function AdminHeader({ onToggleSidebar }: Props) {
  const router = useRouter();

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/80 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-900/80 rounded">
      <div className="flex h-17 items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Mobile menu open trigger */}
        <div className="flex items-center gap-4 lg:hidden">
          <button
            type="button"
            onClick={onToggleSidebar}
            className="flex items-center justify-center rounded-xl border border-slate-200 p-2.5 text-slate-600 transition hover:bg-slate-100 hover:text-slate-900 dark:border-slate-800/60 dark:text-slate-400 dark:hover:bg-slate-800/60 dark:hover:text-slate-200"
            title="Open Navigation"
          >
            <Menu size={18} />
          </button>
        </div>

        {/* Empty placeholder for flex alignment on desktop */}
        <div className="hidden lg:block" />

        <div className="flex items-center gap-4 ml-auto">
          <div>
            <ThemeToggle />
          </div>

          <button
            type="button"
            onClick={() => router.push("/profile")}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-linear-to-r from-blue-600 to-cyan-500 font-bold text-white shadow-sm transition hover:opacity-90 hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            title="View Profile"
          >
            A
          </button>
        </div>
      </div>
    </header>
  );
}

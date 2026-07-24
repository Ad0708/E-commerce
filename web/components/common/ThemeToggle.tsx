"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const { resolvedTheme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const isDark = resolvedTheme === "dark";

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="
        h-11
        w-11
        rounded-full
        flex
        items-center
        justify-center
        transition-all
        duration-300
        border
        shadow-lg

        bg-white
        text-slate-800
        border-slate-200

        dark:bg-slate-900
        dark:text-yellow-400
        dark:border-slate-700

        hover:scale-110
      "
    >
      {isDark ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  );
}
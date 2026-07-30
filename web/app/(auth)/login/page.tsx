import AuthShowcase from "@/components/auth/AuthShowcase";
import LoginForm from "@/components/auth/LoginForm";
import ThemeToggle from "@/components/common/ThemeToggle";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function LoginPage() {
  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-slate-50 dark:bg-slate-950">
      <AuthShowcase />

      <div className="relative flex flex-col items-center justify-center p-6 sm:p-10">
        {/* Header bar above the form — Back to Home + mobile-only ThemeToggle */}
        <div className="w-full max-w-md mb-6 flex items-center justify-between">
          <Link
            href="/home"
            className="group inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-xs sm:text-sm font-semibold text-slate-700 shadow-sm transition-all hover:bg-slate-900 hover:text-white dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-white dark:hover:text-slate-900"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            <span>Back to Home</span>
          </Link>

          {/* Only visible on mobile — desktop has ThemeToggle in the left panel */}
          <div className="lg:hidden">
            <ThemeToggle />
          </div>
        </div>

        <LoginForm />
      </div>
    </div>
  );
}
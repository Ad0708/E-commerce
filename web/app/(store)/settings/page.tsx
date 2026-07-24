"use client";

import { ArrowLeft, Moon, Sun, Bell, BellOff } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function SettingsPage() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>("default");

  useEffect(() => {
    setMounted(true);
    // Safely check current native permission level on the client
    if (typeof window !== "undefined" && "Notification" in window) {
      setNotificationPermission(Notification.permission);
    }
  }, []);

  const handleRequestNotification = async () => {
    if (typeof window !== "undefined" && "Notification" in window) {
      const permission = await Notification.requestPermission();
      setNotificationPermission(permission);
    }
  };

  if (!mounted) return null;

  const isDark = resolvedTheme === "dark";

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 transition-colors duration-300 dark:bg-slate-950 dark:text-slate-50">
      <div className="mx-auto flex w-full max-w-2xl flex-col gap-6 px-4 py-8 sm:px-6">
        {/* Navigation & Header */}
        <div className="space-y-5">
          <Link
            href="/"
            className="group inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition-colors hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100"
          >
            <ArrowLeft
              size={16}
              className="transition-transform group-hover:-translate-x-1"
            />
            Back to Home
          </Link>
          <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Manage your application preferences and appearance.
          </p>
        </div>

        {/* Appearance Panel */}
        <div className="rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center gap-3 border-b border-slate-200 p-5 dark:border-slate-800">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
              {isDark ? <Moon size={20} /> : <Sun size={20} />}
            </div>
            <div>
              <h2 className="text-lg font-semibold tracking-tight">Appearance</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Customize how the application looks.
              </p>
            </div>
          </div>

          {/* Toggle Section */}
          <div className="p-5">
            <div className="flex items-center justify-between gap-4 rounded-xl border border-slate-100 bg-slate-50/50 p-4 dark:border-slate-800/50 dark:bg-slate-950/40">
              <div className="space-y-0.5">
                <h3 className="text-sm font-medium">Dark Mode</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Switch between dynamic light and comfortable slate dark interfaces.
                </p>
              </div>

              {/* Toggle Switch */}
              <button
                onClick={() => setTheme(isDark ? "light" : "dark")}
                aria-label="Toggle theme"
                className={`relative inline-flex h-7 w-14 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-300 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2 dark:focus-visible:ring-slate-700 ${
                  isDark ? "bg-slate-700" : "bg-slate-200"
                }`}
              >
                <span
                  className={`pointer-events-none flex h-6 w-6 items-center justify-center rounded-full bg-white text-slate-900 shadow-sm ring-0 transition duration-300 ease-in-out dark:bg-slate-950 dark:text-slate-100 ${
                    isDark ? "translate-x-7" : "translate-x-0"
                  }`}
                >
                  {isDark ? (
                    <Moon size={12} className="text-amber-400 fill-amber-400" />
                  ) : (
                    <Sun size={12} className="text-amber-500" />
                  )}
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* System Notifications Panel */}
        <div className="rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center gap-3 border-b border-slate-200 p-5 dark:border-slate-800">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
              {notificationPermission === "granted" ? <Bell size={20} className="text-blue-500" /> : <BellOff size={20} />}
            </div>
            <div>
              <h2 className="text-lg font-semibold tracking-tight">Notifications</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Configure your system push alert options.
              </p>
            </div>
          </div>

          <div className="p-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-xl border border-slate-100 bg-slate-50/50 p-4 dark:border-slate-800/50 dark:bg-slate-950/40">
              <div className="space-y-0.5">
                <h3 className="text-sm font-medium">Push Notifications</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {notificationPermission === "granted" && "System notifications are currently active."}
                  {notificationPermission === "denied" && "Notifications are blocked. Reset browser site settings to adjust."}
                  {notificationPermission === "default" && "Request system permissions to view background alerts."}
                </p>
              </div>

              {/* Status Smart Button */}
              {notificationPermission === "granted" ? (
                <span className="inline-flex items-center justify-center rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400 border border-emerald-200/40 dark:border-emerald-800/30 self-start sm:self-center">
                  Enabled
                </span>
              ) : notificationPermission === "denied" ? (
                <span className="inline-flex items-center justify-center rounded-full bg-rose-50 px-3 py-1.5 text-xs font-semibold text-rose-700 dark:bg-rose-950/30 dark:text-rose-400 border border-rose-200/40 dark:border-rose-800/30 self-start sm:self-center">
                  Blocked
                </span>
              ) : (
                <button
                  onClick={handleRequestNotification}
                  className="rounded-lg bg-blue-600 px-4 py-2 text-xs font-medium text-white shadow-sm hover:bg-blue-500 dark:bg-blue-500 dark:hover:bg-blue-400 transition-colors duration-200 self-start sm:self-center whitespace-nowrap"
                >
                  Enable Notifications
                </button>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
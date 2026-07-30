"use client";

import { useEffect, useRef } from "react";
import { useAuthStore } from "@/store/auth.store";
import { getCurrentUser } from "@/api/auth";
import { usePathname } from "next/navigation";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const authRoutes = ["/login", "/signup", "/forgot-password"];
  const isAuthRoute = authRoutes.includes(pathname);

  const { user, setUser, setLoading, isLoading } = useAuthStore();
  const hasFetched = useRef(false);

  useEffect(() => {
    if (isAuthRoute) return;

    if (!user && !hasFetched.current) {
      hasFetched.current = true;

      const hasCookie = typeof document !== "undefined" && (
        document.cookie.includes("auth_token=") || document.cookie.includes("token=")
      );

      if (!hasCookie) {
        setUser(null);
        setLoading(false);
        return;
      }

      setLoading(true);

      getCurrentUser()
        .then(setUser)
        .catch(() => setUser(null))
        .finally(() => setLoading(false));
    }
  }, [isAuthRoute, user, setUser, setLoading]);

  // Show full screen loading state only on protected pages when auth is resolving
  const protectedRoutes = ["/cart", "/wishlist", "/checkout", "/orders", "/profile", "/settings", "/wallet"];
  const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route));

  if (isLoading && !user && isProtectedRoute) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-900 dark:border-white" />
      </div>
    );
  }

  return <>{children}</>;
}

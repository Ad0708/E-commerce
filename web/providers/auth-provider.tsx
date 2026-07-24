"use client";

import { useEffect, useRef } from "react";
import { useAuthStore } from "@/store/auth.store";
import { getCurrentUser } from "@/api/auth";
import { usePathname } from "next/navigation";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const publicRoutes = ["/login", "/signup", "/forgot-password"];

  const isPublicRoute = publicRoutes.includes(pathname);
  const { user, setUser, setLoading, isLoading } = useAuthStore();
  const hasFetched = useRef(false);

  useEffect(() => {
    if (isPublicRoute) return;

    if (!user && !hasFetched.current) {
      hasFetched.current = true;
      setLoading(true);

      getCurrentUser()
        .then(setUser)
        .catch(() => setUser(null))
        .finally(() => setLoading(false));
    }
  }, [isPublicRoute, user, setUser, setLoading]);

  // Show loading state while fetching
  if (isLoading && !user) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
      </div>
    );
  }

  return <>{children}</>;
}

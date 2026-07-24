"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useStoreMaintenance } from "@/hooks/store/useStore";

interface MaintenanceGuardProps {
  children: React.ReactNode;
}

export default function MaintenanceGuard({
  children,
}: MaintenanceGuardProps) {
  const pathname = usePathname();
  const router = useRouter();

  const { data, isLoading, isError } = useStoreMaintenance();

  const maintenanceEnabled = data?.maintenance?.enabled === true;

  useEffect(() => {
    if (isLoading || isError) return;

    // Maintenance is enabled → redirect store users to maintenance page
    if (maintenanceEnabled && pathname !== "/maintenance") {
      router.replace("/maintenance");
      return;
    }

    // Maintenance is disabled → redirect maintenance page to home
    if (!maintenanceEnabled && pathname === "/maintenance") {
      router.replace("/");
    }
  }, [
    isLoading,
    isError,
    maintenanceEnabled,
    pathname,
    router,
  ]);

  if (isLoading) {
    return null;
  }

  // While redirecting store pages during maintenance
  if (maintenanceEnabled && pathname !== "/maintenance") {
    return null;
  }

  // While redirecting /maintenance back to home when maintenance is disabled
  if (!maintenanceEnabled && pathname === "/maintenance") {
    return null;
  }

  return <>{children}</>;
}
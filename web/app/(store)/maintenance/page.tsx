// app/(shop)/maintenance/page.tsx

"use client";

import { useStoreMaintenance } from "@/hooks/store/useStore";

export default function MaintenancePage() {
  const { data, isLoading } = useStoreMaintenance();

  if (isLoading) {
    return null;
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-6">
      <div className="w-full max-w-lg text-center">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
          <span className="text-4xl">🔧</span>
        </div>

        <h1 className="text-2xl font-bold text-foreground">
          We'll Be Back Soon
        </h1>

        <p className="mt-4 text-muted-foreground">
          {data?.maintenance?.message ||
            "Our store is currently under maintenance. Please check back soon."}
        </p>
      </div>
    </main>
  );
}
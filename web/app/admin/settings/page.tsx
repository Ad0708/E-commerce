"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, Settings } from "lucide-react";
import { useAdminStore } from "@/hooks/admin/store/useAdminStore";
import { StoreInformationCard } from "@/components/admin/settings/Storeinformationcard";
import { StoreLogoCard } from "@/components/admin/settings/StoreLogoCard";
import { BannerManagementCard } from "@/components/admin/settings/BannerManagementCard";
import { ContactCard } from "@/components/admin/settings/ContactCard";
import { BusinessAddressCard } from "@/components/admin/settings/BusinessAddressCard";
import { ShippingCard } from "@/components/admin/settings/ShippingCard";
import { TaxCard } from "@/components/admin/settings/TaxCard";
import { LocalizationCard } from "@/components/admin/settings/LocalizationCard";
import { SocialLinksCard } from "@/components/admin/settings/SocialLinksCard";
import { BusinessInformationCard } from "@/components/admin/settings/BusinessInformationCard";
import { SeoCard } from "@/components/admin/settings/SeoCard";
import { MaintenanceCard } from "@/components/admin/settings/MaintenanceCard";
import { InvoiceCard } from "@/components/admin/settings/InvoiceCard";
import { ReturnsCard } from "@/components/admin/settings/ReturnsCard";

function CardSkeleton() {
  return (
    <div className="rounded-xl border border-slate-200 bg-card p-6 space-y-4">
      <div className="flex items-center gap-2">
        <Skeleton className="h-8 w-8 rounded-lg" />
        <div className="space-y-1.5">
          <Skeleton className="h-4 w-36" />
          <Skeleton className="h-3 w-48" />
        </div>
      </div>
      <Skeleton className="h-9 w-full" />
      <Skeleton className="h-9 w-full" />
      <Skeleton className="h-9 w-3/4" />
      <div className="flex justify-end">
        <Skeleton className="h-8 w-24" />
      </div>
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header skeleton */}
      <div className="space-y-2">
        <Skeleton className="h-7 w-44" />
        <Skeleton className="h-4 w-80" />
      </div>
      {/* Banner skeleton — full width */}
      <div className="rounded-xl border border-slate-200 bg-card p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Skeleton className="h-8 w-8 rounded-lg" />
            <div className="space-y-1.5">
              <Skeleton className="h-4 w-44" />
              <Skeleton className="h-3 w-32" />
            </div>
          </div>
          <Skeleton className="h-8 w-28" />
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="aspect-video rounded-xl" />
          ))}
        </div>
      </div>
      {/* 2-column grid skeletons */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {Array.from({ length: 12 }).map((_, i) => (
          <CardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}

export default function StoreSettingsPage() {
  const { data: store, isLoading, isError, error } = useAdminStore();

  if (isLoading) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <LoadingSkeleton />
      </div>
    );
  }

  if (isError || !store) {
    return (
      <div className="mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6 space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight">
            Store Settings
          </h1>
          <p className="text-sm text-muted-foreground">
            Manage your store information, branding, shipping, tax and
            localization.
          </p>
        </div>
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Failed to load store settings</AlertTitle>
          <AlertDescription>
            {error instanceof Error
              ? error.message
              : "An unexpected error occurred. Please refresh the page and try again."}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Page Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-1">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10">
            <Settings className="h-5 w-5 text-primary" />
          </div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Store Settings
          </h1>
        </div>
        <p className="ml-12 text-sm text-muted-foreground">
          Manage your store information, branding, shipping, tax and
          localization.
        </p>
      </div>

      <div className="space-y-8">
        {/* Banner — full width because it has a 3-column internal grid */}
        <BannerManagementCard store={store} />

        {/* 2-column responsive grid */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Row 1 */}
          <StoreInformationCard store={store} />
          <StoreLogoCard store={store} />

          {/* Row 2 */}
          <ContactCard store={store} />
          <BusinessAddressCard store={store} />

          {/* Row 3 */}
          <ShippingCard store={store} />
          <TaxCard store={store} />

          {/* Row 4 */}
          <LocalizationCard store={store} />
          <BusinessInformationCard store={store} />

          {/* Row 5 */}
          <SocialLinksCard store={store} />
          <SeoCard store={store} />

          {/* Row 6 */}
          <InvoiceCard store={store} />
          <ReturnsCard store={store} />

          {/* Row 7 — Maintenance spans full width for emphasis */}
          <div className="lg:col-span-2">
            <MaintenanceCard store={store} />
          </div>
        </div>
      </div>
    </div>
  );
}

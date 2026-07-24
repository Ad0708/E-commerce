"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Loader2, Receipt } from "lucide-react";
import { toast } from "react-hot-toast";
import { useUpdateAdminStore } from "@/hooks/admin/store/useAdminStore";
import type { AdminStore, Tax } from "@/types/adminStore";
import { cn } from "@/lib/utils";

interface TaxFields {
  tax: Tax;
}

interface Props {
  store: AdminStore;
}

export function TaxCard({ store }: Props) {
  const { mutate: updateStore, isPending } = useUpdateAdminStore();

  const { register, handleSubmit, reset, watch, setValue } = useForm<TaxFields>(
    {
      defaultValues: {
        tax: {
          gstNumber: store.tax?.gstNumber || "",
          vatNumber: store.tax?.vatNumber || "",
          taxEnabled: store.tax?.taxEnabled ?? false,
          taxRate: store.tax?.taxRate ?? 0,
        },
      },
    },
  );

  useEffect(() => {
    reset({
      tax: {
        gstNumber: store.tax?.gstNumber || "",
        vatNumber: store.tax?.vatNumber || "",
        taxEnabled: store.tax?.taxEnabled ?? false,
        taxRate: store.tax?.taxRate ?? 0,
      },
    });
  }, [store, reset]);

  const taxEnabled = watch("tax.taxEnabled");

  const onSubmit = (data: TaxFields) => {
    updateStore(data, {
      onSuccess: () => {
        toast.success("Tax settings saved");
      },
      onError: () => {
        toast.error("Save failed");
      },
    });
  };

  return (
    <Card className="">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-50 transition-colors dark:bg-indigo-950/40">
            <Receipt className="h-4 w-4 text-indigo-600 dark:text-indigo-400 dark:fill-indigo-500/10 fill-indigo-600/10" />
          </div>

          <div>
            <CardTitle className="text-base font-semibold text-slate-900 dark:text-slate-50">
              Tax Configuration
            </CardTitle>
            <CardDescription className="text-xs text-slate-500 dark:text-slate-400">
              Set up GST, VAT and tax rates
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      {/* The form acts as a flex container that spreads to wrap the footer perfectly */}
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-1 flex-col">
        <CardContent className="flex-1 space-y-5">
          {/* Row 1: Identification Numbers */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label
                htmlFor="gstNumber"
                className="text-sm font-medium text-slate-700 dark:text-slate-300"
              >
                GST Number
              </Label>
              <Input
                id="gstNumber"
                placeholder="GST1234567890"
                {...register("tax.gstNumber")}
              />
            </div>

            <div className="space-y-1.5">
              <Label
                htmlFor="vatNumber"
                className="text-sm font-medium text-slate-700 dark:text-slate-300"
              >
                VAT Number
              </Label>
              <Input
                id="vatNumber"
                placeholder="VAT1234567890"
                {...register("tax.vatNumber")}
              />
            </div>
          </div>

          {/* Dynamic Status Activation Control row */}
          <div
            className={cn(
              "flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-xl border px-4 py-4 transition-all duration-300 shadow-sm",
              taxEnabled
                ? "border-indigo-500/20 bg-indigo-50/[0.02] dark:bg-indigo-400/[0.02] hover:border-indigo-500/30"
                : "border-slate-200 bg-slate-50/50 hover:bg-white dark:border-slate-800 dark:bg-slate-900/20 dark:hover:bg-slate-900/40",
            )}
          >
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span
                  className={cn(
                    "h-2 w-2 rounded-full transition-all duration-300",
                    taxEnabled
                      ? "bg-indigo-500 shadow-sm shadow-indigo-500/50 animate-pulse"
                      : "bg-slate-300 dark:bg-slate-600",
                  )}
                />
                <p className="text-sm font-semibold tracking-tight text-slate-900 dark:text-slate-50">
                  Enable Tax Calculation
                </p>
              </div>

              <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                {taxEnabled
                  ? "Automated tax logic is live. Tax rates will be calculated and appended at checkout."
                  : "Tax calculations are disabled. Checkout orders will be processed tax-free."}
              </p>
            </div>

            <div className="flex items-center sm:justify-end">
              <Switch
                checked={taxEnabled}
                onCheckedChange={(value) => setValue("tax.taxEnabled", value)}
              />
            </div>
          </div>

          {/* Conditional Tax Rate Field with micro entrance slide animations */}
          {taxEnabled && (
            <div className="space-y-1.5 animate-in fade-in-50 slide-in-from-top-1 duration-200">
              <Label
                htmlFor="taxRate"
                className="text-sm font-medium text-slate-700 dark:text-slate-300"
              >
                Tax Rate (%)
              </Label>

              <div className="relative max-w-[160px]">
                <Input
                  id="taxRate"
                  type="number"
                  step="0.01"
                  min="0"
                  max="100"
                  placeholder="18.00"
                  className="pr-8"
                  {...register("tax.taxRate", { valueAsNumber: true })}
                />
                <span className="pointer-events-none absolute inset-y-0 right-3.5 flex items-center text-sm font-semibold text-slate-400 dark:text-slate-500">
                  %
                </span>
              </div>
            </div>
          )}
        </CardContent>

        {/* Modern Fixed Action Footer Pinning Button */}
        <CardFooter className="flex justify-end">
          <Button
            type="submit"
            disabled={isPending}
            size="sm"
            className="font-medium shadow-sm"
          >
            {isPending && <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />}
            Save Changes
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}

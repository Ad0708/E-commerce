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
import { Loader2, Truck } from "lucide-react";
import { toast } from "react-hot-toast";
import { useUpdateAdminStore } from "@/hooks/admin/store/useAdminStore";
import type { AdminStore, Shipping } from "@/types/adminStore";
import { cn } from "@/lib/utils";

interface ShippingFields {
  shipping: Shipping;
}

interface Props {
  store: AdminStore;
}

export function ShippingCard({ store }: Props) {
  const { mutate: updateStore, isPending } = useUpdateAdminStore();

  const { register, handleSubmit, reset, watch, setValue } =
    useForm<ShippingFields>({
      defaultValues: {
        shipping: {
          enabled: store.shipping?.enabled ?? false,
          defaultCharge: store.shipping?.defaultCharge ?? 0,
          freeShipping: store.shipping?.freeShipping ?? false,
          freeShippingAmount: store.shipping?.freeShippingAmount ?? 0,
          estimatedDeliveryDays: store.shipping?.estimatedDeliveryDays ?? 1,
        },
      },
    });

  useEffect(() => {
    reset({
      shipping: {
        enabled: store.shipping?.enabled ?? false,
        defaultCharge: store.shipping?.defaultCharge ?? 0,
        freeShipping: store.shipping?.freeShipping ?? false,
        freeShippingAmount: store.shipping?.freeShippingAmount ?? 0,
        estimatedDeliveryDays: store.shipping?.estimatedDeliveryDays ?? 1,
      },
    });
  }, [store, reset]);

  const shippingEnabled = watch("shipping.enabled");
  const freeShipping = watch("shipping.freeShipping");

  const onSubmit = (data: ShippingFields) => {
    updateStore(data, {
      onSuccess: () => {
        toast.success("Shipping settings saved");
      },
      onError: () => {
        toast.error("Save failed");
      },
    });
  };

  return (
    <Card>
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-50 transition-colors dark:bg-indigo-950/40">
            <Truck className="h-4 w-4 text-indigo-600 dark:text-indigo-400 dark:fill-indigo-500/10 fill-indigo-600/10" />
          </div>

          <div>
            <CardTitle className="text-base font-semibold text-slate-900 dark:text-slate-50">
              Shipping
            </CardTitle>
            <CardDescription className="text-xs text-slate-500 dark:text-slate-400">
              Configure delivery options and charges
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      {/* Form acts as a vertical flex column layout container */}
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-1 flex-col">
        <CardContent className="flex-1 space-y-5">
          {/* Toggle Option: Enable Shipping */}
          <div
            className={cn(
              "flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-xl border px-4 py-4 transition-all duration-300 shadow-sm",
              shippingEnabled
                ? "border-indigo-500/20 bg-indigo-50/[0.02] dark:bg-indigo-400/[0.02] hover:border-indigo-500/30"
                : "border-slate-200 bg-slate-50/50 hover:bg-white dark:border-slate-800 dark:bg-slate-900/20 dark:hover:bg-slate-900/40",
            )}
          >
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span
                  className={cn(
                    "h-2 w-2 rounded-full transition-all duration-300",
                    shippingEnabled
                      ? "bg-indigo-500 shadow-sm shadow-indigo-500/50 animate-pulse"
                      : "bg-slate-300 dark:bg-slate-600",
                  )}
                />
                <p className="text-sm font-semibold tracking-tight text-slate-900 dark:text-slate-50">
                  Enable Shipping
                </p>
              </div>
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                {shippingEnabled
                  ? "Shipping options are active. Customers can enter delivery addresses at checkout."
                  : "Shipping is disabled. Storefront will operate exclusively in localized pickup mode."}
              </p>
            </div>

            <div className="flex items-center sm:justify-end">
              <Switch
                checked={shippingEnabled}
                onCheckedChange={(value) => setValue("shipping.enabled", value)}
              />
            </div>
          </div>

          {/* Conditional Layout Section: Only render numeric inputs if shipping is allowed */}
          {shippingEnabled && (
            <div className="space-y-5 animate-in fade-in-50 slide-in-from-top-1 duration-200">
              {/* Input Row: Base Shipping Charge */}
              <div className="space-y-1.5">
                <Label
                  htmlFor="defaultCharge"
                  className="text-sm font-medium text-slate-700 dark:text-slate-300"
                >
                  Default Shipping Charge
                </Label>
                <div className="relative max-w-[200px]">
                  <span className="pointer-events-none absolute inset-y-0 left-3.5 flex items-center text-sm font-semibold text-slate-400 dark:text-slate-500">
                    ₹
                  </span>
                  <Input
                    id="defaultCharge"
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="0.00"
                    className="pl-8"
                    {...register("shipping.defaultCharge", {
                      valueAsNumber: true,
                    })}
                  />
                </div>
              </div>

              {/* Toggle Option: Free Shipping */}
              <div
                className={cn(
                  "flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-xl border px-4 py-4 transition-all duration-300 shadow-sm",
                  freeShipping
                    ? "border-indigo-500/20 bg-indigo-50/[0.02] dark:bg-indigo-400/[0.02] hover:border-indigo-500/30"
                    : "border-slate-200 bg-slate-50/50 hover:bg-white dark:border-slate-800 dark:bg-slate-900/20 dark:hover:bg-slate-900/40",
                )}
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span
                      className={cn(
                        "h-2 w-2 rounded-full transition-all duration-300",
                        freeShipping
                          ? "bg-indigo-500 shadow-sm shadow-indigo-500/50 animate-pulse"
                          : "bg-slate-300 dark:bg-slate-600",
                      )}
                    />
                    <p className="text-sm font-semibold tracking-tight text-slate-900 dark:text-slate-50">
                      Free Shipping Threshold
                    </p>
                  </div>
                  <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                    {freeShipping
                      ? "Free shipping is enabled. Customers will unlock zero delivery fees when meeting configuration requirements."
                      : "Free shipping is deactivated. Baseline tier rates apply to all basket sizes."}
                  </p>
                </div>

                <div className="flex items-center sm:justify-end">
                  <Switch
                    checked={freeShipping}
                    onCheckedChange={(value) =>
                      setValue("shipping.freeShipping", value)
                    }
                  />
                </div>
              </div>

              {/* Sub-Conditional Input: Free Shipping Limit Amount */}
              {freeShipping && (
                <div className="space-y-1.5 pl-2 border-l-2 border-slate-100 dark:border-slate-900 animate-in fade-in-50 slide-in-from-top-1 duration-200">
                  <Label
                    htmlFor="freeShippingAmount"
                    className="text-sm font-medium text-slate-700 dark:text-slate-300"
                  >
                    Minimum Order Value for Free Shipping
                  </Label>
                  <div className="relative max-w-[200px]">
                    <span className="pointer-events-none absolute inset-y-0 left-3.5 flex items-center text-sm font-semibold text-slate-400 dark:text-slate-500">
                      ₹
                    </span>
                    <Input
                      id="freeShippingAmount"
                      type="number"
                      step="0.01"
                      min="0"
                      placeholder="50.00"
                      className="pl-8"
                      {...register("shipping.freeShippingAmount", {
                        valueAsNumber: true,
                      })}
                    />
                  </div>
                </div>
              )}

              {/* Input Row: Delivery Lead Times */}
              <div className="space-y-1.5">
                <Label
                  htmlFor="estimatedDeliveryDays"
                  className="text-sm font-medium text-slate-700 dark:text-slate-300"
                >
                  Estimated Delivery Days
                </Label>
                <div className="relative max-w-[200px]">
                  <Input
                    id="estimatedDeliveryDays"
                    type="number"
                    min="1"
                    placeholder="5"
                    className="pr-14"
                    {...register("shipping.estimatedDeliveryDays", {
                      valueAsNumber: true,
                    })}
                  />
                  <span className="pointer-events-none absolute inset-y-0 right-3.5 flex items-center text-xs font-semibold text-slate-400 dark:text-slate-500">
                    days
                  </span>
                </div>
              </div>
            </div>
          )}
        </CardContent>

        {/* Permanently Pinned Footer Layout Area */}
        <CardFooter className="mt-auto border-t border-slate-100 pt-4 flex justify-end dark:border-slate-900">
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

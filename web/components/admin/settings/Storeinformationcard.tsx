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
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Loader2, Store } from "lucide-react";
import { toast } from "react-hot-toast";
import { useUpdateAdminStore } from "@/hooks/admin/store/useAdminStore";
import type { AdminStore } from "@/types/adminStore";
import { cn } from "@/lib/utils";

interface StoreInformationFields {
  storeName: string;
  description: string;
  acceptOrders: boolean;
}

interface Props {
  store: AdminStore;
}

export function StoreInformationCard({ store }: Props) {
  const { mutate: updateStore, isPending } = useUpdateAdminStore();

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<StoreInformationFields>({
    defaultValues: {
      storeName: store.storeName,
      description: store.description,
      acceptOrders: store.acceptOrders,
    },
  });

  useEffect(() => {
    reset({
      storeName: store.storeName,
      description: store.description,
      acceptOrders: store.acceptOrders,
    });
  }, [store, reset]);

  const acceptOrders = watch("acceptOrders");

  const onSubmit = (data: StoreInformationFields) => {
    updateStore(data, {
      onSuccess: () => toast.success("Store information updated successfully"),
      onError: () =>
        toast.error("Failed to update store information. Please try again."),
    });
  };

  return (
    <Card>
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-50 transition-colors dark:bg-indigo-950/40">
            <Store className="h-4 w-4 text-indigo-600 dark:text-indigo-400 dark:fill-indigo-500/10 fill-indigo-600/10" />
          </div>
          <div>
            <CardTitle className="text-base font-semibold text-slate-900 dark:text-slate-50">
              Store Information
            </CardTitle>
            <CardDescription className="text-xs text-slate-500 dark:text-slate-400">
              Basic details about your store
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-1 flex-col">
        <CardContent className="flex-1 space-y-5">
          {/* Store Name Input */}
          <div className="space-y-1.5">
            <Label
              htmlFor="storeName"
              className="text-sm font-medium text-slate-700 dark:text-slate-300"
            >
              Store Name
            </Label>
            <Input
              id="storeName"
              placeholder="My Awesome Store"
              {...register("storeName", { required: "Store name is required" })}
            />
            {errors.storeName && (
              <p className="text-xs font-medium text-destructive animate-in fade-in-50 slide-in-from-top-1 duration-150">
                {errors.storeName.message}
              </p>
            )}
          </div>

          {/* Store Description Input */}
          <div className="space-y-1.5">
            <Label
              htmlFor="description"
              className="text-sm font-medium text-slate-700 dark:text-slate-300"
            >
              Description
            </Label>
            <Textarea
              id="description"
              placeholder="Tell customers about your store..."
              className="min-h-[90px] resize-none"
              {...register("description")}
            />
          </div>

          {/* Dynamic Status Toggle Block */}
          <div
            className={cn(
              "flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-xl border px-4 py-4 transition-all duration-300 shadow-sm",
              acceptOrders
                ? "border-emerald-500/20 bg-emerald-50/[0.02] dark:bg-emerald-500/[0.02] hover:border-emerald-500/30 shadow-emerald-500/[0.01]"
                : "border-slate-200 bg-slate-50/50 hover:bg-white dark:border-slate-800 dark:bg-slate-900/20 dark:hover:bg-slate-900/40",
            )}
          >
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span
                  className={cn(
                    "h-2 w-2 rounded-full transition-all duration-300",
                    acceptOrders
                      ? "bg-emerald-500 shadow-sm shadow-emerald-500 animate-pulse"
                      : "bg-slate-300 dark:bg-slate-600",
                  )}
                />
                <p className="text-sm font-semibold tracking-tight text-slate-900 dark:text-slate-50">
                  Accept Orders
                </p>
              </div>

              <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                {acceptOrders
                  ? "Your store is live and actively processing customer checkouts"
                  : "Order acceptance is paused. Visitors cannot check out"}
              </p>
            </div>

            <div className="flex items-center sm:justify-end">
              <Switch
                checked={acceptOrders}
                onCheckedChange={(val) => setValue("acceptOrders", val)}
              />
            </div>
          </div>
        </CardContent>

        {/* Permanently pinned footer boundary element */}
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

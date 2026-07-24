"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { AlertTriangle, Loader2 } from "lucide-react";
import { toast } from "react-hot-toast";

import { useUpdateAdminStore } from "@/hooks/admin/store/useAdminStore";
import type { AdminStore, Maintenance } from "@/types/adminStore";

interface MaintenanceFields {
  maintenance: Maintenance;
}
interface Props {
  store: AdminStore;
}

export function MaintenanceCard({ store }: Props) {
  const { mutate: updateStore, isPending } = useUpdateAdminStore();

  const { register, handleSubmit, reset, watch, setValue } =
    useForm<MaintenanceFields>({
      defaultValues: {
        maintenance: {
          enabled: store.maintenance?.enabled ?? false,
          message: store.maintenance?.message ?? "",
        },
      },
    });

  useEffect(() => {
    reset({
      maintenance: {
        enabled: store.maintenance?.enabled ?? false,
        message: store.maintenance?.message ?? "",
      },
    });
  }, [store, reset]);

  const maintenanceEnabled = watch("maintenance.enabled");

  const onSubmit = (data: MaintenanceFields) => {
    updateStore(data, {
      onSuccess: () => {
        toast.success("Maintenance mode saved");
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
        <div
          className={`flex h-9 w-9 items-center justify-center rounded-lg transition-colors ${
            maintenanceEnabled
              ? "bg-amber-500/10 dark:bg-amber-500/20"
              : "bg-slate-100 dark:bg-slate-900"
          }`}
        >
          <AlertTriangle
            className={`h-4 w-4 transition-colors ${
              maintenanceEnabled
                ? "text-amber-500"
                : "text-slate-500 dark:text-slate-400"
            }`}
          />
        </div>
        <div>
          <CardTitle className="text-base font-semibold tracking-tight text-slate-900 dark:text-slate-50">
            Maintenance Mode
          </CardTitle>
          <CardDescription className="text-xs text-slate-500 dark:text-slate-400">
            Temporarily take your store offline
          </CardDescription>
        </div>
      </div>
    </CardHeader>

    <CardContent>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Fixed: Flattened layout container */}
        <div
          className={`flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-xl border px-4 py-4 transition-all duration-200 ${
            maintenanceEnabled
              ? "border-amber-500/30 bg-amber-500/[0.02] dark:bg-amber-500/[0.04] shadow-sm shadow-amber-500/[0.02]"
              : "border-slate-200 bg-slate-50/50 dark:border-slate-800 dark:bg-slate-900/30"
          }`}
        >
          <div className="space-y-1">
            <p className="text-sm font-medium leading-none text-slate-900 dark:text-slate-50">
              Enable Maintenance Mode
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {maintenanceEnabled
                ? "Your store is currently offline for visitors"
                : "Store is live and accepting visitors"}
            </p>
          </div>

          <div className="flex items-center sm:justify-end">
            <Switch
              checked={maintenanceEnabled}
              onCheckedChange={(value) => setValue("maintenance.enabled", value)}
            />
          </div>
        </div>

        {/* Dynamic Textarea Field */}
        {maintenanceEnabled && (
          <div className="space-y-2 animate-in fade-in-50 slide-in-from-top-2 duration-200">
            <Label
              className="text-xs font-semibold tracking-wide uppercase text-slate-500 dark:text-slate-400"
              htmlFor="maintenance-message"
            >
              Maintenance Message
            </Label>
            <Textarea
              className="min-h-[100px] resize-none border-slate-200 bg-white p-3 text-sm focus-visible:ring-slate-950 dark:border-slate-800 dark:bg-slate-950 dark:focus-visible:ring-slate-300"
              id="maintenance-message"
              placeholder="We're performing some upgrades. We'll be back shortly!"
              {...register("maintenance.message")}
            />
            <p className="text-xs italic text-slate-400 dark:text-slate-500">
              This message will be shown to visitors.
            </p>
          </div>
        )}

        {/* Action Button */}
        <div className="flex flex-col sm:flex-row sm:justify-end border-t border-slate-100 pt-4 dark:border-slate-900">
          <Button
            type="submit"
            disabled={isPending}
            size="sm"
            variant={maintenanceEnabled ? "destructive" : "default"}
            className="w-full sm:w-auto font-medium transition-colors"
          >
            {isPending && (
              <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />
            )}
            Save Changes
          </Button>
        </div>
      </form>
    </CardContent>
  </Card>
);
}

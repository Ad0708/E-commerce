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
import { Globe, Loader2 } from "lucide-react";
import { toast } from "react-hot-toast";
import { useUpdateAdminStore } from "@/hooks/admin/store/useAdminStore";
import type { AdminStore, Currency } from "@/types/adminStore";

interface LocalizationFields {
  currency: Currency;
  timezone: string;
}

interface Props {
  store: AdminStore;
}

export function LocalizationCard({ store }: Props) {
  const { mutate: updateStore, isPending } = useUpdateAdminStore();

  const { register, handleSubmit, reset } = useForm<LocalizationFields>({
    defaultValues: {
      currency: {
        code: store.currency?.code || "",
        symbol: store.currency?.symbol || "",
      },
      timezone: store.timezone || "",
    },
  });

  useEffect(() => {
    reset({
      currency: {
        code: store.currency?.code || "",
        symbol: store.currency?.symbol || "",
      },
      timezone: store.timezone || "",
    });
  }, [store, reset]);

  const onSubmit = (data: LocalizationFields) => {
    updateStore(data, {
      onSuccess: () => {
        toast.success("Localization settings saved");
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
            <Globe className="h-4 w-4 text-indigo-600 dark:text-indigo-400 dark:fill-indigo-500/10 fill-indigo-600/10" />
          </div>

          <div>
            <CardTitle className="text-base font-semibold text-slate-900 dark:text-slate-50">
              Localization
            </CardTitle>
            <CardDescription className="text-xs text-slate-500 dark:text-slate-400">
              Currency and timezone settings
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      {/* Form acts as a full-height flex column wrapper */}
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-1 flex-col">
        <CardContent className="flex-1 space-y-5">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label
                htmlFor="currencyCode"
                className="text-sm font-medium text-slate-700 dark:text-slate-300"
              >
                Currency Code
              </Label>
              <Input
                id="currencyCode"
                placeholder="USD"
                {...register("currency.code")}
              />
            </div>

            <div className="space-y-1.5">
              <Label
                htmlFor="currencySymbol"
                className="text-sm font-medium text-slate-700 dark:text-slate-300"
              >
                Currency Symbol
              </Label>
              <Input
                id="currencySymbol"
                placeholder="$"
                {...register("currency.symbol")}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label
              htmlFor="timezone"
              className="text-sm font-medium text-slate-700 dark:text-slate-300"
            >
              Timezone
            </Label>
            <Input
              id="timezone"
              placeholder="America/New_York"
              {...register("timezone")}
            />
            <p className="text-xs font-medium text-slate-400 dark:text-slate-500">
              Use IANA timezone format, e.g. Asia/Kolkata
            </p>
          </div>
        </CardContent>

        {/* Permanently pinned to the bottom of the card block */}
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

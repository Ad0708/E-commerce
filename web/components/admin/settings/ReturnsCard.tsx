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
import { Info, Loader2, RefreshCw } from "lucide-react";
import { toast } from "react-hot-toast";
import { useUpdateAdminStore } from "@/hooks/admin/store/useAdminStore";
import type { AdminStore, Return } from "@/types/adminStore";

interface ReturnsFields {
  returns: Return;
}

interface Props {
  store: AdminStore;
}

export function ReturnsCard({ store }: Props) {
  const { mutate: updateStore, isPending } = useUpdateAdminStore();

  const { register, handleSubmit, reset } = useForm<ReturnsFields>({
    defaultValues: {
      returns: {
        returnDays: store.returns?.returnDays ?? 0,
        replacementDays: store.returns?.replacementDays ?? 0,
      },
    },
  });

  useEffect(() => {
    reset({
      returns: {
        returnDays: store.returns?.returnDays ?? 0,
        replacementDays: store.returns?.replacementDays ?? 0,
      },
    });
  }, [store, reset]);

  const onSubmit = (data: ReturnsFields) => {
    updateStore(data, {
      onSuccess: () => {
        toast.success("Returns & Replacements saved");
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
            <RefreshCw className="h-4 w-4 text-indigo-600 dark:text-indigo-400 dark:fill-indigo-500/10 fill-indigo-600/10" />
          </div>

          <div>
            <CardTitle className="text-base font-semibold text-slate-900 dark:text-slate-50">
              Returns & Replacements
            </CardTitle>
            <CardDescription className="text-xs text-slate-500 dark:text-slate-400">
              Define your return and replacement policy windows
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      {/* Form acts as a vertical flex column layout container to stick footer at the bottom */}
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-1 flex-col">
        <CardContent className="flex-1 space-y-5">
          {/* Input Window Grid */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label
                htmlFor="returnDays"
                className="text-sm font-medium text-slate-700 dark:text-slate-300"
              >
                Return Window (days)
              </Label>
              <Input
                id="returnDays"
                type="number"
                min="0"
                placeholder="30"
                {...register("returns.returnDays", {
                  valueAsNumber: true,
                })}
              />
              <p className="text-xs font-medium text-slate-400 dark:text-slate-500">
                Days allowed for returns
              </p>
            </div>

            <div className="space-y-1.5">
              <Label
                htmlFor="replacementDays"
                className="text-sm font-medium text-slate-700 dark:text-slate-300"
              >
                Replacement Window (days)
              </Label>
              <Input
                id="replacementDays"
                type="number"
                min="0"
                placeholder="7"
                {...register("returns.replacementDays", {
                  valueAsNumber: true,
                })}
              />
              <p className="text-xs font-medium text-slate-400 dark:text-slate-500">
                Days allowed for replacements
              </p>
            </div>
          </div>

          {/* System Informational Notice */}
          <div className="flex gap-3 rounded-xl border border-amber-500/20 bg-amber-50/[0.03] p-4 transition-all duration-200 dark:border-amber-400/20 dark:bg-amber-400/[0.02]">
            <Info className="h-4 w-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />

            <div className="space-y-0.5">
              <p className="text-xs font-semibold text-amber-800 dark:text-amber-300">
                System Notice
              </p>
              <p className="text-xs font-medium leading-relaxed text-slate-500 dark:text-slate-400">
                These values are used to calculate eligibility on the order
                detail page and customer-facing policy pages. Ensure accuracy to
                prevent processing discrepancies.
              </p>
            </div>
          </div>
        </CardContent>

        {/* Permanently pinned to the absolute bottom of the card block */}
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

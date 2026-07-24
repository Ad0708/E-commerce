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
import { Briefcase, Loader2 } from "lucide-react";
import { toast } from "react-hot-toast";
import { useUpdateAdminStore } from "@/hooks/admin/store/useAdminStore";
import type { AdminStore, BusinessInfo } from "@/types/adminStore";

interface BusinessInfoFields {
  business: BusinessInfo;
}

interface Props {
  store: AdminStore;
}

export function BusinessInformationCard({ store }: Props) {
  const { mutate: updateStore, isPending } = useUpdateAdminStore();

  const { register, handleSubmit, reset } = useForm<BusinessInfoFields>({
    defaultValues: {
      business: {
        businessName: store.business?.businessName || "",
        supportEmail: store.business?.supportEmail || "",
        supportPhone: store.business?.supportPhone || "",
      },
    },
  });

  useEffect(() => {
    reset({
      business: {
        businessName: store.business?.businessName || "",
        supportEmail: store.business?.supportEmail || "",
        supportPhone: store.business?.supportPhone || "",
      },
    });
  }, [store, reset]);

  const onSubmit = (data: BusinessInfoFields) => {
    updateStore(data, {
      onSuccess: () => {
        toast.success("Business information saved");
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
            <Briefcase className="h-4 w-4 text-indigo-600 dark:text-indigo-400 dark:fill-indigo-500/10 fill-indigo-600/10" />
          </div>

          <div>
            <CardTitle className="text-base font-semibold text-slate-900 dark:text-slate-50">
              Business Information
            </CardTitle>
            <CardDescription className="text-xs text-slate-500 dark:text-slate-400">
              Legal business name and support contact
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      {/* Form acts as a vertical flex column layout container to stick footer at the bottom */}
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-1 flex-col">
        <CardContent className="flex-1 space-y-5">
          <div className="space-y-1.5">
            <Label
              htmlFor="businessName"
              className="text-sm font-medium text-slate-700 dark:text-slate-300"
            >
              Business Name
            </Label>
            <Input
              id="businessName"
              placeholder="Acme Commerce Inc."
              {...register("business.businessName")}
            />
          </div>

          {/* Responsive Grid layout for contact details */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label
                htmlFor="supportEmail"
                className="text-sm font-medium text-slate-700 dark:text-slate-300"
              >
                Support Email
              </Label>
              <Input
                id="supportEmail"
                type="email"
                placeholder="support@yourstore.com"
                {...register("business.supportEmail")}
              />
            </div>

            <div className="space-y-1.5">
              <Label
                htmlFor="supportPhone"
                className="text-sm font-medium text-slate-700 dark:text-slate-300"
              >
                Support Phone
              </Label>
              <Input
                id="supportPhone"
                type="tel"
                placeholder="+1 (800) 000-0000"
                {...register("business.supportPhone")}
              />
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

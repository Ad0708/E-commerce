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
import { Loader2, MapPin } from "lucide-react";
import { toast } from "react-hot-toast";
import { useUpdateAdminStore } from "@/hooks/admin/store/useAdminStore";
import type { AddressStore, AdminStore } from "@/types/adminStore";

interface AddressFields {
  address: AddressStore;
}

interface Props {
  store: AdminStore;
}

export function BusinessAddressCard({ store }: Props) {
  const { mutate: updateStore, isPending } = useUpdateAdminStore();

  const { register, handleSubmit, reset } = useForm<AddressFields>({
    defaultValues: {
      address: {
        street: store.address?.street || "",
        city: store.address?.city || "",
        state: store.address?.state || "",
        country: store.address?.country || "",
        pincode: store.address?.pincode || "",
      },
    },
  });

  useEffect(() => {
    reset({
      address: {
        street: store.address?.street || "",
        city: store.address?.city || "",
        state: store.address?.state || "",
        country: store.address?.country || "",
        pincode: store.address?.pincode || "",
      },
    });
  }, [store, reset]);

  const onSubmit = (data: AddressFields) => {
    updateStore(data, {
      onSuccess: () => {
        toast.success("Business address saved");
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
            <MapPin className="h-4 w-4 text-indigo-600 dark:text-indigo-400 dark:fill-indigo-500/10 fill-indigo-600/10" />
          </div>

          <div>
            <CardTitle className="text-base font-semibold text-slate-900 dark:text-slate-50">
              Business Address
            </CardTitle>
            <CardDescription className="text-xs text-slate-500 dark:text-slate-400">
              Used on invoices and shipping labels
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-1 flex-col">
        <CardContent className="flex-1 space-y-4">
          {/* Street Address */}
          <div className="space-y-1.5">
            <Label
              htmlFor="street"
              className="text-sm font-medium text-slate-700 dark:text-slate-300"
            >
              Street Address
            </Label>
            <Input
              id="street"
              placeholder="123 Commerce St"
              {...register("address.street")}
            />
          </div>

          {/* City & State Row */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label
                htmlFor="city"
                className="text-sm font-medium text-slate-700 dark:text-slate-300"
              >
                City
              </Label>
              <Input
                id="city"
                placeholder="San Francisco"
                {...register("address.city")}
              />
            </div>

            <div className="space-y-1.5">
              <Label
                htmlFor="state"
                className="text-sm font-medium text-slate-700 dark:text-slate-300"
              >
                State / Province
              </Label>
              <Input
                id="state"
                placeholder="California"
                {...register("address.state")}
              />
            </div>
          </div>

          {/* Country & Pincode Row */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label
                htmlFor="country"
                className="text-sm font-medium text-slate-700 dark:text-slate-300"
              >
                Country
              </Label>
              <Input
                id="country"
                placeholder="United States"
                {...register("address.country")}
              />
            </div>

            <div className="space-y-1.5">
              <Label
                htmlFor="pincode"
                className="text-sm font-medium text-slate-700 dark:text-slate-300"
              >
                ZIP / Pincode
              </Label>
              <Input
                id="pincode"
                placeholder="94102"
                {...register("address.pincode")}
              />
            </div>
          </div>
        </CardContent>

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

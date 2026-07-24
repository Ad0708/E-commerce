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
import { Loader2, Phone } from "lucide-react";
import { toast } from "react-hot-toast";
import { useUpdateAdminStore } from "@/hooks/admin/store/useAdminStore";
import type { AdminStore, Contact } from "@/types/adminStore";

interface ContactFields {
  contact: Contact;
}

interface Props {
  store: AdminStore;
}

export function ContactCard({ store }: Props) {
  const { mutate: updateStore, isPending } = useUpdateAdminStore();

  const { register, handleSubmit, reset } = useForm<ContactFields>({
    defaultValues: {
      contact: {
        email: store.contact?.email || "",
        phone: store.contact?.phone || "",
        whatsapp: store.contact?.whatsapp || "",
      },
    },
  });

  useEffect(() => {
    reset({
      contact: {
        email: store.contact?.email || "",
        phone: store.contact?.phone || "",
        whatsapp: store.contact?.whatsapp || "",
      },
    });
  }, [store, reset]);

  const onSubmit = (data: ContactFields) => {
    updateStore(data, {
      onSuccess: () => {
        toast.success("Contact details saved");
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
            <Phone className="h-4 w-4 text-indigo-600 dark:text-indigo-400 dark:fill-indigo-500/10 fill-indigo-600/10" />
          </div>

          <div>
            <CardTitle className="text-base font-semibold text-slate-900 dark:text-slate-50">
              Contact Details
            </CardTitle>
            <CardDescription className="text-xs text-slate-500 dark:text-slate-400">
              How customers can reach you
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-1 flex-col">
        <CardContent className="flex-1 space-y-4">
          {/* Email Address */}
          <div className="space-y-1.5">
            <Label
              htmlFor="email"
              className="text-sm font-medium text-slate-700 dark:text-slate-300"
            >
              Email Address
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="hello@yourstore.com"
              {...register("contact.email")}
            />
          </div>

          {/* Phone & WhatsApp Side-by-Side Responsive Grid */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label
                htmlFor="phone"
                className="text-sm font-medium text-slate-700 dark:text-slate-300"
              >
                Phone Number
              </Label>
              <Input
                id="phone"
                type="tel"
                placeholder="+1 (555) 000-0000"
                {...register("contact.phone")}
              />
            </div>

            <div className="space-y-1.5">
              <Label
                htmlFor="whatsapp"
                className="text-sm font-medium text-slate-700 dark:text-slate-300"
              >
                WhatsApp Number
              </Label>
              <Input
                id="whatsapp"
                type="tel"
                placeholder="+1 (555) 000-0000"
                {...register("contact.whatsapp")}
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

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
import { Loader2, Share2 } from "lucide-react";
import { toast } from "react-hot-toast";
import { useUpdateAdminStore } from "@/hooks/admin/store/useAdminStore";
import type { AdminStore, SocialLinks } from "@/types/adminStore";

interface SocialLinksFields {
  socialLinks: SocialLinks;
}

interface Props {
  store: AdminStore;
}

const socialPlatforms: {
  key: keyof SocialLinks;
  label: string;
  placeholder: string;
}[] = [
  {
    key: "facebook",
    label: "Facebook",
    placeholder: "https://facebook.com/yourstore",
  },
  {
    key: "instagram",
    label: "Instagram",
    placeholder: "https://instagram.com/yourstore",
  },
  {
    key: "twitter",
    label: "Twitter / X",
    placeholder: "https://twitter.com/yourstore",
  },
  {
    key: "linkedin",
    label: "LinkedIn",
    placeholder: "https://linkedin.com/company/yourstore",
  },
  {
    key: "youtube",
    label: "YouTube",
    placeholder: "https://youtube.com/@yourstore",
  },
];

export function SocialLinksCard({ store }: Props) {
  const { mutate: updateStore, isPending } = useUpdateAdminStore();

  const { register, handleSubmit, reset } = useForm<SocialLinksFields>({
    defaultValues: {
      socialLinks: {
        facebook: store.socialLinks?.facebook || "",
        instagram: store.socialLinks?.instagram || "",
        twitter: store.socialLinks?.twitter || "",
        linkedin: store.socialLinks?.linkedin || "",
        youtube: store.socialLinks?.youtube || "",
      },
    },
  });

  useEffect(() => {
    reset({
      socialLinks: {
        facebook: store.socialLinks?.facebook || "",
        instagram: store.socialLinks?.instagram || "",
        twitter: store.socialLinks?.twitter || "",
        linkedin: store.socialLinks?.linkedin || "",
        youtube: store.socialLinks?.youtube || "",
      },
    });
  }, [store, reset]);

  const onSubmit = (data: SocialLinksFields) => {
    updateStore(data, {
      onSuccess: () => {
        toast.success("Social links saved");
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
            <Share2 className="h-4 w-4 text-indigo-600 dark:text-indigo-400 dark:fill-indigo-500/10 fill-indigo-600/10" />
          </div>

          <div>
            <CardTitle className="text-base font-semibold text-slate-900 dark:text-slate-50">
              Social Links
            </CardTitle>
            <CardDescription className="text-xs text-slate-500 dark:text-slate-400">
              Connect your social media profiles
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-1 flex-col">
        <CardContent className="flex-1 space-y-4">
          {socialPlatforms.map(({ key, label, placeholder }) => (
            <div key={key} className="space-y-1.5">
              <Label
                htmlFor={key}
                className="text-sm font-medium text-slate-700 dark:text-slate-300"
              >
                {label}
              </Label>

              <Input
                id={key}
                type="url"
                placeholder={placeholder}
                {...register(`socialLinks.${key}`)}
              />
            </div>
          ))}
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

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
import { Loader2, Search } from "lucide-react";
import { toast } from "react-hot-toast";
import { useUpdateAdminStore } from "@/hooks/admin/store/useAdminStore";
import type { AdminStore, SEO } from "@/types/adminStore";

interface SeoFields {
  seo: SEO;
}

interface Props {
  store: AdminStore;
}

export function SeoCard({ store }: Props) {
  const { mutate: updateStore, isPending } = useUpdateAdminStore();

  const { register, handleSubmit, reset, watch } = useForm<SeoFields>({
    defaultValues: {
      seo: {
        metaTitle: store.seo?.metaTitle || "",
        metaDescription: store.seo?.metaDescription || "",
        metaKeywords: store.seo?.metaKeywords || "",
        ogImage: store.seo?.ogImage || "",
      },
    },
  });

  useEffect(() => {
    reset({
      seo: {
        metaTitle: store.seo?.metaTitle || "",
        metaDescription: store.seo?.metaDescription || "",
        metaKeywords: store.seo?.metaKeywords || "",
        ogImage: store.seo?.ogImage || "",
      },
    });
  }, [store, reset]);

  const metaTitle = watch("seo.metaTitle");
  const metaDescription = watch("seo.metaDescription");

  const onSubmit = (data: SeoFields) => {
    updateStore(data, {
      onSuccess: () => {
        toast.success("SEO settings saved");
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
            <Search className="h-4 w-4 text-indigo-600 dark:text-indigo-400 dark:fill-indigo-500/10 fill-indigo-600/10" />
          </div>

          <div>
            <CardTitle className="text-base font-semibold text-slate-900 dark:text-slate-50">
              SEO
            </CardTitle>
            <CardDescription className="text-xs text-slate-500 dark:text-slate-400">
              Control how your store appears in search results
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-1 flex-col">
        <CardContent className="flex-1 space-y-5">
          {/* Live Preview */}
          <div className="space-y-1.5 rounded-xl border border-slate-200 bg-slate-50/50 p-4 transition-all duration-200 hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900/30 dark:hover:border-slate-700">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Search Engine Preview
            </p>

            <p className="truncate text-base font-medium text-[#1a0dab] hover:underline cursor-pointer dark:text-[#8ab4f8]">
              {metaTitle || "Your Store Title"}
            </p>

            <p className="line-clamp-2 text-xs leading-relaxed text-slate-600 dark:text-slate-400">
              {metaDescription ||
                "Your store meta description will appear here. Write a compelling description to improve your click-through rates on search results pages."}
            </p>
          </div>

          {/* Meta Title */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label
                htmlFor="metaTitle"
                className="text-sm font-medium text-slate-700 dark:text-slate-300"
              >
                Meta Title
              </Label>
              <span className="text-xs font-medium text-slate-400 dark:text-slate-500">
                {metaTitle?.length ?? 0}/60
              </span>
            </div>

            <Input
              id="metaTitle"
              placeholder="My Store — Best Products Online"
              {...register("seo.metaTitle")}
            />
          </div>

          {/* Meta Description */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label
                htmlFor="metaDescription"
                className="text-sm font-medium text-slate-700 dark:text-slate-300"
              >
                Meta Description
              </Label>
              <span className="text-xs font-medium text-slate-400 dark:text-slate-500">
                {metaDescription?.length ?? 0}/160
              </span>
            </div>

            <Textarea
              id="metaDescription"
              placeholder="A short description for search engines..."
              className="min-h-[80px] resize-none"
              {...register("seo.metaDescription")}
            />
          </div>

          {/* Meta Keywords */}
          <div className="space-y-1.5">
            <Label
              htmlFor="metaKeywords"
              className="text-sm font-medium text-slate-700 dark:text-slate-300"
            >
              Meta Keywords
            </Label>

            <Input
              id="metaKeywords"
              placeholder="fashion, clothing, accessories"
              {...register("seo.metaKeywords")}
            />

            <p className="text-xs font-medium text-slate-400 dark:text-slate-500">
              Comma-separated keywords
            </p>
          </div>

          {/* OG Image */}
          <div className="space-y-1.5">
            <Label
              htmlFor="ogImage"
              className="text-sm font-medium text-slate-700 dark:text-slate-300"
            >
              OG Image URL
            </Label>

            <Input
              id="ogImage"
              type="url"
              placeholder="https://example.com/og-image.jpg"
              {...register("seo.ogImage")}
            />

            <p className="text-xs font-medium text-slate-400 dark:text-slate-500">
              Recommended: 1200×630px for social sharing
            </p>
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

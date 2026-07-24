"use client";

import { useRef, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ImageIcon, Loader2, Upload, X } from "lucide-react";
import { toast } from "react-hot-toast";
import { useUploadStoreLogo } from "@/hooks/admin/store/useAdminStore";
import type { AdminStore } from "@/types/adminStore";
import Image from "next/image";

interface Props {
  store: AdminStore;
}

export function StoreLogoCard({ store }: Props) {
  const { mutate: uploadLogo, isPending } = useUploadStoreLogo();

  const inputRef = useRef<HTMLInputElement>(null);

  const [preview, setPreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    setSelectedFile(file);

    const reader = new FileReader();

    reader.onloadend = () => {
      setPreview(reader.result as string);
    };

    reader.readAsDataURL(file);
  };

  const handleUpload = () => {
    if (!selectedFile) return;

    uploadLogo(selectedFile, {
      onSuccess: () => {
        toast.success("Logo uploaded");

        setPreview(null);
        setSelectedFile(null);

        if (inputRef.current) {
          inputRef.current.value = "";
        }
      },

      onError: () => {
        toast.error("Failed to upload logo, please try again");
      },
    });
  };

  const handleClear = () => {
    setPreview(null);
    setSelectedFile(null);

    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };
  // Show the newly selected image preview first.
  // If no new image is selected, show the stored logo URL.
  const currentImage = preview || store.logo;

return (
  <Card>
    <CardHeader className="pb-4">
      <div className="flex items-center gap-3">
        {/* Lighter, modern branded icon frame */}
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-50 transition-colors dark:bg-indigo-950/40">
          <ImageIcon className="h-4 w-4 text-indigo-600 dark:text-indigo-400 dark:fill-indigo-500/10 fill-indigo-600/10" />
        </div>

        <div>
          <CardTitle className="text-base font-semibold text-slate-900 dark:text-slate-50">
            Store Logo
          </CardTitle>
          <CardDescription className="text-xs text-slate-500 dark:text-slate-400">
            Displayed across your storefront and invoices
          </CardDescription>
        </div>
      </div>
    </CardHeader>

    <CardContent className="space-y-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-5">
        
        {/* Upgraded Image Frame: Transparent grid background pattern look */}
        <div className="relative flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-slate-200 bg-slate-50 shadow-inner dark:border-slate-800 dark:bg-slate-900/40">
          {currentImage ? (
            <Image
              src={currentImage}
              alt="Store logo"
              fill
              sizes="96px"
              className="object-contain p-2 transition-transform duration-300 hover:scale-105"
            />
          ) : (
            <div className="flex flex-col items-center gap-1.5 text-slate-400 dark:text-slate-600">
              <ImageIcon className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
              <span className="text-[10px] font-semibold uppercase tracking-wider">No logo</span>
            </div>
          )}
        </div>

        {/* Configuration Upload Actions */}
        <div className="space-y-1">
          <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
            Upload a new logo
          </p>

          <p className="text-xs text-slate-400 dark:text-slate-500 max-w-[280px] leading-relaxed">
            PNG, JPG, WebP or SVG. Recommended square dimensions (400×400px).
          </p>

          <div className="flex items-center gap-2 pt-2.5">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => inputRef.current?.click()}
              className="shadow-sm font-medium"
            >
              <Upload className="mr-1.5 h-3.5 w-3.5" />
              Choose file
            </Button>

            {selectedFile && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleClear}
                className="h-8 px-2 text-slate-400 hover:text-red-600 dark:text-slate-500 dark:hover:text-red-400"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Upgraded Pending File Sync Row Container */}
      {selectedFile && (
        <div className="flex items-center justify-between rounded-xl border border-indigo-500/20 bg-indigo-50/[0.03] p-3 animate-in fade-in-50 slide-in-from-top-1 duration-200 dark:border-indigo-400/20 dark:bg-indigo-400/[0.02]">
          <div className="flex items-center gap-2 max-w-[70%]">
            <div className="h-2 w-2 rounded-full bg-indigo-500 animate-pulse shrink-0" />
            <span className="truncate text-xs font-medium text-slate-600 dark:text-slate-300">
              {selectedFile.name}
            </span>
          </div>

          <Button
            type="button"
            size="sm"
            disabled={isPending}
            onClick={handleUpload}
            className="h-8 text-xs font-medium"
          >
            {isPending && (
              <Loader2 className="mr-1.5 h-3 w-3 animate-spin" />
            )}
            Upload File
          </Button>
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />
    </CardContent>
  </Card>
);
}

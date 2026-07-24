"use client";

import { useEffect, useState, useRef } from "react";
import { useForm } from "react-hook-form";
import Image from "next/image";
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
import { FileText, Loader2, Upload, X, CheckCircle2 } from "lucide-react";
import { toast } from "react-hot-toast";
import {
  useUpdateAdminStore,
  useUploadInvoiceSignature,
  useUploadInvoiceStamp,
} from "@/hooks/admin/store/useAdminStore";
import type { AdminStore } from "@/types/adminStore";

interface InvoiceFields {
  invoice: {
    prefix: string;
    footer: string;
    signature: string;
    stamp: string;
  };
}

interface Props {
  store: AdminStore;
}

export function InvoiceCard({ store }: Props) {
  const { mutate: updateStore, isPending } = useUpdateAdminStore();
  const { mutate: uploadSignature, isPending: isUploadingSignature } =
    useUploadInvoiceSignature();
  const { mutate: uploadStamp, isPending: isUploadingStamp } =
    useUploadInvoiceStamp();

  const [signatureFile, setSignatureFile] = useState<File | null>(null);
  const [stampFile, setStampFile] = useState<File | null>(null);

  // Element refs to trigger the hidden file inputs programmatically
  const signatureInputRef = useRef<HTMLInputElement>(null);
  const stampInputRef = useRef<HTMLInputElement>(null);

  const { register, handleSubmit, reset } = useForm<InvoiceFields>({
    defaultValues: {
      invoice: {
        prefix: store.invoice?.prefix || "",
        footer: store.invoice?.footer || "",
        signature: store.invoice?.signature || "",
        stamp: store.invoice?.stamp || "",
      },
    },
  });

  useEffect(() => {
    reset({
      invoice: {
        prefix: store.invoice?.prefix || "",
        footer: store.invoice?.footer || "",
        signature: store.invoice?.signature || "",
        stamp: store.invoice?.stamp || "",
      },
    });

    setSignatureFile(null);
    setStampFile(null);
  }, [store, reset]);

  const onSubmit = (data: InvoiceFields) => {
    updateStore(
      {
        invoice: {
          prefix: data.invoice.prefix,
          footer: data.invoice.footer,
          signature: store.invoice?.signature || "",
          stamp: store.invoice?.stamp || "",
        },
      },
      {
        onSuccess: () => {
          if (signatureFile) {
            uploadSignature(signatureFile);
          }

          if (stampFile) {
            uploadStamp(stampFile);
          }

          toast.success("Invoice settings saved");
        },
        onError: () => {
          toast.error("Failed to save invoice settings");
        },
      },
    );
  };

  return (
    <Card>
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-50 transition-colors dark:bg-indigo-950/40">
            <FileText className="h-4 w-4 text-indigo-600 dark:text-indigo-400 dark:fill-indigo-500/10 fill-indigo-600/10" />
          </div>

          <div>
            <CardTitle className="text-base font-semibold tracking-tight text-slate-900 dark:text-slate-50">
              Invoice Settings
            </CardTitle>
            <CardDescription className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Customize invoice prefix, footer layouts, and branding assets
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      {/* Form acts as a vertical flex column layout container to stick footer at the bottom */}
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-1 flex-col">
        <CardContent className="flex-1 space-y-5">
          {/* Invoice Prefix Field */}
          <div className="space-y-1.5">
            <Label
              htmlFor="invoice-prefix"
              className="text-sm font-medium text-slate-700 dark:text-slate-300"
            >
              Invoice Prefix
            </Label>
            <Input
              id="invoice-prefix"
              placeholder="INV-"
              className="max-w-xs h-9 text-sm rounded-lg"
              {...register("invoice.prefix")}
            />
            <p className="text-[11px] font-medium text-slate-400 dark:text-slate-500">
              Example format:{" "}
              <span className="font-mono bg-slate-100 dark:bg-slate-900 px-1 py-0.5 rounded text-slate-800 dark:text-slate-200">
                INV-
              </span>{" "}
              → INV-0001
            </p>
          </div>

          {/* Invoice Footer Field */}
          <div className="space-y-1.5">
            <Label
              htmlFor="invoice-footer"
              className="text-sm font-medium text-slate-700 dark:text-slate-300"
            >
              Invoice Footer Notes
            </Label>
            <Textarea
              id="invoice-footer"
              placeholder="Thank you for your business. All sales are final."
              className="min-h-[90px] text-sm rounded-lg resize-none leading-relaxed"
              {...register("invoice.footer")}
            />
          </div>

          {/* Branding Upload Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            {/* ── Signature Image Upload ── */}
            <div className="space-y-1.5">
              <Label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Signature Image
              </Label>

              <div
                onClick={() => signatureInputRef.current?.click()}
                className="group relative flex h-32 w-full cursor-pointer items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50/50 transition-all hover:border-indigo-500/40 hover:bg-white dark:border-slate-800 dark:bg-slate-900/20 dark:hover:bg-slate-900/40"
              >
                {signatureFile || store.invoice?.signature ? (
                  <div className="relative w-full h-full flex flex-col items-center justify-center p-3">
                    <div className="relative w-full h-16">
                      <Image
                        src={
                          signatureFile
                            ? URL.createObjectURL(signatureFile)
                            : store.invoice.signature
                        }
                        alt="Signature Preview"
                        fill
                        className="object-contain transition-transform duration-200 group-hover:scale-95"
                      />
                    </div>
                    <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 mt-2 truncate max-w-[90%]">
                      {signatureFile ? signatureFile.name : "Active Signature"}
                    </span>

                    {/* Hover Overlay */}
                    <div className="absolute inset-0 flex items-center justify-center bg-slate-950/60 dark:bg-slate-950/80 rounded-xl opacity-0 transition-opacity duration-150 group-hover:opacity-100">
                      <Upload className="h-4 w-4 text-white mr-1.5 animate-pulse" />
                      <span className="text-[10px] font-bold text-white uppercase tracking-wider">
                        Replace
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-1.5 text-slate-400 dark:text-slate-500 transition-colors group-hover:text-indigo-500 dark:group-hover:text-indigo-400">
                    <Upload className="h-4 w-4" />
                    <span className="text-[10px] font-bold uppercase tracking-wider">
                      Upload Signature
                    </span>
                  </div>
                )}
              </div>

              <input
                ref={signatureInputRef}
                type="file"
                accept="image/png,image/jpeg,image/jpg"
                className="hidden"
                onChange={(event) => {
                  const file = event.target.files?.[0];
                  if (file) setSignatureFile(file);
                }}
              />
            </div>

            {/* ── Stamp Image Upload ── */}
            <div className="space-y-1.5">
              <Label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Stamp Image
              </Label>

              <div
                onClick={() => stampInputRef.current?.click()}
                className="group relative flex h-32 w-full cursor-pointer items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50/50 transition-all hover:border-indigo-500/40 hover:bg-white dark:border-slate-800 dark:bg-slate-900/20 dark:hover:bg-slate-900/40"
              >
                {stampFile || store.invoice?.stamp ? (
                  <div className="relative w-full h-full flex flex-col items-center justify-center p-3">
                    <div className="relative w-full h-16">
                      <Image
                        src={
                          stampFile
                            ? URL.createObjectURL(stampFile)
                            : store.invoice.stamp
                        }
                        alt="Stamp Preview"
                        fill
                        className="object-contain transition-transform duration-200 group-hover:scale-95"
                      />
                    </div>
                    <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 mt-2 truncate max-w-[90%]">
                      {stampFile ? stampFile.name : "Active Stamp"}
                    </span>

                    {/* Hover Overlay */}
                    <div className="absolute inset-0 flex items-center justify-center bg-slate-950/60 dark:bg-slate-950/80 rounded-xl opacity-0 transition-opacity duration-150 group-hover:opacity-100">
                      <Upload className="h-4 w-4 text-white mr-1.5 animate-pulse" />
                      <span className="text-[10px] font-bold text-white uppercase tracking-wider">
                        Replace
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-1.5 text-slate-400 dark:text-slate-500 transition-colors group-hover:text-indigo-500 dark:group-hover:text-indigo-400">
                    <Upload className="h-4 w-4" />
                    <span className="text-[10px] font-bold uppercase tracking-wider">
                      Upload Stamp
                    </span>
                  </div>
                )}
              </div>

              <input
                ref={stampInputRef}
                type="file"
                accept="image/png,image/jpeg,image/jpg"
                className="hidden"
                onChange={(event) => {
                  const file = event.target.files?.[0];
                  if (file) setStampFile(file);
                }}
              />
            </div>
          </div>

          {/* Informational Subtext */}
          <p className="text-[11px] font-medium leading-normal max-w-md text-slate-400 dark:text-slate-500">
            Branding graphics are automatically mapped and overlayed on your
            generated invoice PDF files. Supports transparent PNGs for best
            results.
          </p>
        </CardContent>

        {/* Permanently pinned to the absolute bottom of the card block */}
        <CardFooter className="mt-auto border-t border-slate-100 pt-4 flex justify-end dark:border-slate-900">
          <Button
            type="submit"
            disabled={isPending || isUploadingSignature || isUploadingStamp}
            size="sm"
            className="font-medium shadow-sm"
          >
            {(isPending || isUploadingSignature || isUploadingStamp) && (
              <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />
            )}
            Save Changes
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}

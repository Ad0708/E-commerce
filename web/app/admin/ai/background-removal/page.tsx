"use client";

import { ChangeEvent, DragEvent, useRef, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Check,
  Copy,
  Download,
  Image as ImageIcon,
  Loader2,
  RefreshCcw,
  Sparkles,
  Upload,
  X,
} from "lucide-react";

import { useRemoveBackground } from "@/hooks/ai/useAI";

export default function BackgroundRemovalPage() {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [resultUrl, setResultUrl] = useState("");
  const [copied, setCopied] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const {
    mutate: removeBackground,
    isPending,
    isError,
    error,
  } = useRemoveBackground();

  const handleFile = (file: File) => {
    if (!file.type.startsWith("image/")) {
      return;
    }

    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }

    const newPreviewUrl = URL.createObjectURL(file);

    setSelectedFile(file);
    setPreviewUrl(newPreviewUrl);
    setResultUrl("");
    setCopied(false);
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (file) {
      handleFile(file);
    }
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);

    const file = event.dataTransfer.files?.[0];

    if (file) {
      handleFile(file);
    }
  };

  const handleRemoveBackground = () => {
    if (!selectedFile) return;

    const formData = new FormData();

    formData.append("image", selectedFile);

    removeBackground(formData, {
      onSuccess: (data) => {
        setResultUrl(data.imageUrl);
      },
    });
  };

  const handleCopy = async () => {
    if (!resultUrl) return;

    await navigator.clipboard.writeText(resultUrl);

    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  const handleDownload = async () => {
    if (!resultUrl) return;

    const response = await fetch(resultUrl);
    const blob = await response.blob();

    const blobUrl = URL.createObjectURL(blob);

    const link = document.createElement("a");

    link.href = blobUrl;
    link.download = "background-removed-image.png";

    document.body.appendChild(link);
    link.click();

    document.body.removeChild(link);
    URL.revokeObjectURL(blobUrl);
  };

  const handleReset = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }

    setSelectedFile(null);
    setPreviewUrl("");
    setResultUrl("");
    setCopied(false);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <main className="mx-auto w-full max-w-7xl space-y-8 p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <section>
        <Link
          href="/admin/ai"
          className="mb-4 inline-flex items-center gap-2 text-xs font-medium text-slate-500 transition-colors hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to AI Tools
        </Link>

        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
            <ImageIcon className="h-5 w-5" />
          </div>

          <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100 sm:text-2xl">
            Background Removal
          </h1>
        </div>

        <p className="mt-2 max-w-2xl text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          Remove backgrounds from product images using AI.
        </p>
      </section>

      {/* Content Grid */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        {/* Upload Section */}
        <section className="rounded-xl border border-slate-200 bg-white p-5 sm:p-6 dark:border-slate-800 dark:bg-slate-900/60">
          <div className="mb-6">
            <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">
              Upload Image
            </h2>

            <p className="mt-0.5 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              Upload a product image to automatically remove its background.
            </p>
          </div>

          {!previewUrl ? (
            <div
              onDragOver={(event) => {
                event.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => {
                setIsDragging(false);
              }}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`flex min-h-[350px] cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed p-6 text-center transition ${
                isDragging
                  ? "border-slate-400 bg-slate-50 dark:border-slate-600 dark:bg-slate-800/40"
                  : "border-slate-200 bg-slate-50/50 hover:border-slate-300 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900/30 dark:hover:border-slate-700 dark:hover:bg-slate-800/20"
              }`}
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                <Upload className="h-6 w-6" />
              </div>

              <h3 className="mt-4 text-sm font-semibold text-slate-900 dark:text-slate-100">
                Drop your image here
              </h3>

              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                or click to browse from your device
              </p>

              <p className="mt-3 text-[11px] text-slate-400 dark:text-slate-500">
                Supports JPG, JPEG, PNG, and WEBP
              </p>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>
          ) : (
            <div className="space-y-4">
              <div className="relative overflow-hidden rounded-lg border border-slate-200 bg-slate-50/50 dark:border-slate-800 dark:bg-slate-900/30">
                <img
                  src={previewUrl}
                  alt="Selected product"
                  className="h-[320px] w-full object-contain p-2"
                />

                <button
                  type="button"
                  onClick={handleReset}
                  className="absolute right-3 top-3 rounded-full border border-slate-200 bg-white p-1.5 text-slate-500 shadow-sm transition hover:text-red-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400 dark:hover:text-red-400"
                  aria-label="Remove selected image"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="rounded-lg border border-slate-200 bg-slate-50/50 p-3 dark:border-slate-800 dark:bg-slate-900/30">
                <p className="truncate text-xs font-medium text-slate-800 dark:text-slate-200">
                  {selectedFile?.name}
                </p>

                <p className="mt-0.5 text-[11px] text-slate-400 dark:text-slate-500">
                  {selectedFile
                    ? `${(selectedFile.size / 1024 / 1024).toFixed(2)} MB`
                    : ""}
                </p>
              </div>

              {isError && (
                <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-xs text-red-600 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-400">
                  {error instanceof Error
                    ? error.message
                    : "Failed to remove image background."}
                </div>
              )}

              <button
                type="button"
                onClick={handleRemoveBackground}
                disabled={isPending || !selectedFile}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200"
              >
                {isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Removing Background...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" />
                    Remove Background
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleReset}
                disabled={isPending}
                className="flex w-full items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
              >
                <RefreshCcw className="h-3.5 w-3.5" />
                Choose Another Image
              </button>
            </div>
          )}
        </section>

        {/* Output Section */}
        <section className="flex min-h-[480px] flex-col rounded-xl border border-slate-200 bg-white p-5 sm:p-6 dark:border-slate-800 dark:bg-slate-900/60">
          <div className="mb-6 flex items-start justify-between gap-4">
            <div>
              <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">
                Result
              </h2>

              <p className="mt-0.5 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                Your background-removed image will appear below.
              </p>
            </div>

            {resultUrl && (
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleCopy}
                  className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 transition hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
                >
                  {copied ? (
                    <>
                      <Check className="h-3.5 w-3.5 text-green-600 dark:text-green-400" />
                      Copied
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5" />
                      Copy URL
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleDownload}
                  className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 transition hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
                >
                  <Download className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Download</span>
                </button>
              </div>
            )}
          </div>

          <div className="flex flex-1 items-center justify-center overflow-hidden rounded-lg border border-dashed border-slate-200 bg-slate-50/50 p-6 dark:border-slate-800 dark:bg-slate-900/30">
            {isPending ? (
              <div className="flex flex-col items-center gap-2.5 text-center">
                <Loader2 className="h-6 w-6 animate-spin text-slate-600 dark:text-slate-400" />
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  AI is removing the background...
                </p>
              </div>
            ) : resultUrl ? (
              <div className="w-full space-y-4">
                {/* Checkerboard Pattern Container for Transparency */}
                <div className="overflow-hidden rounded-lg border border-slate-200 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] bg-[size:16px_16px] p-4 dark:border-slate-800 dark:bg-[radial-gradient(#1e293b_1px,transparent_1px)]">
                  <img
                    src={resultUrl}
                    alt="Background removed product"
                    className="max-h-[350px] w-full object-contain"
                  />
                </div>

                <div className="rounded-lg border border-slate-200 bg-white p-3 dark:border-slate-800 dark:bg-slate-900">
                  <p className="mb-1 text-[11px] font-medium text-slate-400 dark:text-slate-500">
                    Result URL
                  </p>

                  <p className="break-all text-xs text-slate-800 dark:text-slate-200">
                    {resultUrl}
                  </p>
                </div>
              </div>
            ) : (
              <div className="text-center">
                <ImageIcon className="mx-auto h-7 w-7 text-slate-400 dark:text-slate-600" />

                <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                  Upload an image and remove its background to see the result.
                </p>
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
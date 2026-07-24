"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Check, Copy, Loader2, Sparkles } from "lucide-react";

import { useGenerateProductDescription } from "@/hooks/ai/useAI";

export default function ProductDescriptionPage() {
  const [productName, setProductName] = useState("");
  const [category, setCategory] = useState("");
  const [brand, setBrand] = useState("");
  const [features, setFeatures] = useState("");
  const [tone, setTone] = useState("professional");

  const [description, setDescription] = useState("");
  const [copied, setCopied] = useState(false);

  const {
    mutate: generateDescription,
    isPending,
    isError,
    error,
  } = useGenerateProductDescription();

  const handleGenerate = () => {
    if (!productName.trim() || !category.trim()) {
      return;
    }

    setDescription("");
    setCopied(false);

    generateDescription(
      {
        productName: productName,
        category,
        brand,
        features: features
          .split(",")
          .map((feature) => feature.trim())
          .filter(Boolean),
        tone,
      },
      {
        onSuccess: (data) => {
          setDescription(data.description);
        },
      },
    );
  };

  const handleCopy = async () => {
    if (!description) return;

    await navigator.clipboard.writeText(description);

    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 2000);
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
            <Sparkles className="h-5 w-5" />
          </div>

          <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100 sm:text-2xl">
            Product Description Generator
          </h1>
        </div>

        <p className="mt-2 max-w-2xl text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          Generate engaging and professional product descriptions using AI.
        </p>
      </section>

      {/* Content Grid */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        {/* Form */}
        <section className="rounded-xl border border-slate-200 bg-white p-5 sm:p-6 dark:border-slate-800 dark:bg-slate-900/60">
          <div className="mb-6">
            <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">
              Product Information
            </h2>

            <p className="mt-0.5 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              Provide details about your product to generate a description.
            </p>
          </div>

          <div className="space-y-4">
            {/* Product Name */}
            <div className="space-y-1.5">
              <label
                htmlFor="product-name"
                className="text-xs font-medium text-slate-700 dark:text-slate-300"
              >
                Product Name <span className="text-red-500">*</span>
              </label>

              <input
                id="product-name"
                type="text"
                value={productName}
                onChange={(event) => setProductName(event.target.value)}
                placeholder="e.g. Wireless Headphones"
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-400 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-slate-600"
              />
            </div>

            {/* Category */}
            <div className="space-y-1.5">
              <label
                htmlFor="category"
                className="text-xs font-medium text-slate-700 dark:text-slate-300"
              >
                Category <span className="text-red-500">*</span>
              </label>

              <input
                id="category"
                type="text"
                value={category}
                onChange={(event) => setCategory(event.target.value)}
                placeholder="e.g. Electronics"
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-400 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-slate-600"
              />
            </div>

            {/* Brand */}
            <div className="space-y-1.5">
              <label
                htmlFor="brand"
                className="text-xs font-medium text-slate-700 dark:text-slate-300"
              >
                Brand
              </label>

              <input
                id="brand"
                type="text"
                value={brand}
                onChange={(event) => setBrand(event.target.value)}
                placeholder="e.g. Sony"
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-400 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-slate-600"
              />
            </div>

            {/* Features */}
            <div className="space-y-1.5">
              <label
                htmlFor="features"
                className="text-xs font-medium text-slate-700 dark:text-slate-300"
              >
                Features
              </label>

              <textarea
                id="features"
                value={features}
                onChange={(event) => setFeatures(event.target.value)}
                placeholder="Enter features, specifications, and key benefits (separated by commas)..."
                rows={5}
                className="w-full resize-none rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm leading-relaxed text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-400 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-slate-600"
              />
            </div>

            {/* Tone */}
            <div className="space-y-1.5">
              <label
                htmlFor="tone"
                className="text-xs font-medium text-slate-700 dark:text-slate-300"
              >
                Tone
              </label>

              <select
                id="tone"
                value={tone}
                onChange={(event) => setTone(event.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-slate-400 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100 dark:focus:border-slate-600"
              >
                <option value="professional">Professional</option>
                <option value="friendly">Friendly</option>
                <option value="luxury">Luxury</option>
                <option value="casual">Casual</option>
              </select>
            </div>

            {/* Error Message */}
            {isError && (
              <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-xs text-red-600 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-400">
                {error instanceof Error
                  ? error.message
                  : "Failed to generate description."}
              </div>
            )}

            {/* Generate Button */}
            <button
              type="button"
              onClick={handleGenerate}
              disabled={isPending || !productName.trim() || !category.trim()}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200"
            >
              {isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  Generate Description
                </>
              )}
            </button>
          </div>
        </section>

        {/* Output Section */}
        <section className="flex min-h-[480px] flex-col rounded-xl border border-slate-200 bg-white p-5 sm:p-6 dark:border-slate-800 dark:bg-slate-900/60">
          <div className="mb-6 flex items-start justify-between gap-4">
            <div>
              <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">
                Generated Description
              </h2>

              <p className="mt-0.5 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                Your AI-generated product description will appear below.
              </p>
            </div>

            {description && (
              <button
                type="button"
                onClick={handleCopy}
                className="flex shrink-0 items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 transition hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
              >
                {copied ? (
                  <>
                    <Check className="h-3.5 w-3.5 text-green-600 dark:text-green-400" />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5" />
                    Copy
                  </>
                )}
              </button>
            )}
          </div>

          <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed border-slate-200 bg-slate-50/50 p-6 dark:border-slate-800 dark:bg-slate-900/30">
            {isPending ? (
              <div className="flex flex-col items-center gap-2.5 text-center">
                <Loader2 className="h-6 w-6 animate-spin text-slate-600 dark:text-slate-400" />
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  AI is generating your product description...
                </p>
              </div>
            ) : description ? (
              <div className="h-full w-full whitespace-pre-wrap text-sm leading-relaxed text-slate-800 dark:text-slate-200">
                {description}
              </div>
            ) : (
              <div className="text-center">
                <Sparkles className="mx-auto h-7 w-7 text-slate-400 dark:text-slate-600" />
                <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                  Fill in the product information and click Generate Description.
                </p>
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
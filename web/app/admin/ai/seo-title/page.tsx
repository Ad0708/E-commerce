"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Check,
  Copy,
  Loader2,
  Search,
  Sparkles,
} from "lucide-react";

import { useGenerateSeoTitle } from "@/hooks/ai/useAI";

export default function SeoTitlePage() {
  const [productName, setProductName] = useState("");
  const [category, setCategory] = useState("");
  const [brand, setBrand] = useState("");
  const [keywords, setKeywords] = useState("");

  const [titles, setTitles] = useState("");
  const [copied, setCopied] = useState(false);

  const {
    mutate: generateTitle,
    isPending,
    isError,
    error,
  } = useGenerateSeoTitle();

  const handleGenerate = () => {
    if (!productName.trim() || !category.trim()) {
      return;
    }

    setTitles("");
    setCopied(false);

    generateTitle(
      {
        productName,
        category,
        brand,
        keywords: keywords
          .split(/\n|,/)
          .map((keyword) => keyword.trim())
          .filter(Boolean),
      },
      {
        onSuccess: (data) => {
          setTitles(data.titles);
        },
      },
    );
  };

  const handleCopy = async () => {
    if (!titles) return;

    await navigator.clipboard.writeText(titles);

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
            <Search className="h-5 w-5" />
          </div>

          <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100 sm:text-2xl">
            SEO Title Generator
          </h1>
        </div>

        <p className="mt-2 max-w-2xl text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          Generate optimized SEO titles to improve your product visibility.
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
              Provide product details to generate an SEO-friendly title.
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

            {/* Keywords */}
            <div className="space-y-1.5">
              <label
                htmlFor="keywords"
                className="text-xs font-medium text-slate-700 dark:text-slate-300"
              >
                Keywords
              </label>

              <textarea
                id="keywords"
                value={keywords}
                onChange={(event) => setKeywords(event.target.value)}
                placeholder="Enter keywords separated by commas or new lines..."
                rows={5}
                className="w-full resize-none rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm leading-relaxed text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-400 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-slate-600"
              />
            </div>

            {/* Error */}
            {isError && (
              <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-xs text-red-600 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-400">
                {error instanceof Error
                  ? error.message
                  : "Failed to generate SEO title."}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="button"
              onClick={handleGenerate}
              disabled={
                isPending || !productName.trim() || !category.trim()
              }
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
                  Generate SEO Title
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
                Generated SEO Title
              </h2>

              <p className="mt-0.5 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                Your optimized title will appear below.
              </p>
            </div>

            {titles && (
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
                  AI is generating your SEO title...
                </p>
              </div>
            ) : titles ? (
              <div className="w-full rounded-lg border border-slate-200 bg-white p-4 text-center text-base font-semibold leading-relaxed text-slate-900 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100 sm:text-lg">
                {titles}
              </div>
            ) : (
              <div className="text-center">
                <Search className="mx-auto h-7 w-7 text-slate-400 dark:text-slate-600" />
                <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                  Fill in the product information and click Generate SEO Title.
                </p>
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
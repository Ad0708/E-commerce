"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Check,
  Copy,
  Loader2,
  Sparkles,
  Tags,
  X,
} from "lucide-react";

import { useGenerateKeywords } from "@/hooks/ai/useAI";
import { KeywordGeneratorResponse } from "@/types/ai";

export default function KeywordsPage() {
  const [productName, setProductName] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");

  const [keywords, setKeywords] =
    useState<KeywordGeneratorResponse | null>(null);

  const [copied, setCopied] = useState(false);

  const {
    mutate: generateKeywords,
    isPending,
    isError,
    error,
  } = useGenerateKeywords();

  const handleGenerate = () => {
    if (!productName.trim() || !category.trim()) {
      return;
    }

    setKeywords(null);
    setCopied(false);

    generateKeywords(
      {
        productName,
        category,
        description,
      },
      {
        onSuccess: (data) => {
          setKeywords(data);
        },
      },
    );
  };

  const getAllKeywords = () => {
    if (!keywords) return [];

    return [
      ...keywords.primary,
      ...keywords.secondary,
      ...keywords.longTail,
      ...keywords.tags,
    ];
  };

  const handleCopy = async () => {
    const allKeywords = getAllKeywords();

    if (!allKeywords.length) return;

    await navigator.clipboard.writeText(allKeywords.join(", "));

    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  const removeKeyword = (
    group: keyof KeywordGeneratorResponse,
    keywordToRemove: string,
  ) => {
    setKeywords((currentKeywords) => {
      if (!currentKeywords) return null;

      return {
        ...currentKeywords,
        [group]: currentKeywords[group].filter(
          (keyword) => keyword !== keywordToRemove,
        ),
      };
    });
  };

  const keywordGroups: {
    key: keyof KeywordGeneratorResponse;
    label: string;
  }[] = [
    {
      key: "primary",
      label: "Primary Keywords",
    },
    {
      key: "secondary",
      label: "Secondary Keywords",
    },
    {
      key: "longTail",
      label: "Long-Tail Keywords",
    },
    {
      key: "tags",
      label: "Tags",
    },
  ];

  const hasKeywords =
    keywords &&
    Object.values(keywords).some((group) => group.length > 0);

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
            <Tags className="h-5 w-5" />
          </div>

          <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100 sm:text-2xl">
            Keyword Generator
          </h1>
        </div>

        <p className="mt-2 max-w-2xl text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          Generate relevant keywords to improve product discoverability.
        </p>
      </section>

      {/* Content Grid */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        {/* Form Section */}
        <section className="rounded-xl border border-slate-200 bg-white p-5 sm:p-6 dark:border-slate-800 dark:bg-slate-900/60">
          <div className="mb-6">
            <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">
              Product Information
            </h2>

            <p className="mt-0.5 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              Provide product details to generate relevant keywords.
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

            {/* Description */}
            <div className="space-y-1.5">
              <label
                htmlFor="description"
                className="text-xs font-medium text-slate-700 dark:text-slate-300"
              >
                Product Description
              </label>

              <textarea
                id="description"
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                placeholder="Enter a short description of your product..."
                rows={5}
                className="w-full resize-none rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm leading-relaxed text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-400 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-slate-600"
              />
            </div>

            {/* Error Message */}
            {isError && (
              <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-xs text-red-600 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-400">
                {error instanceof Error
                  ? error.message
                  : "Failed to generate keywords."}
              </div>
            )}

            {/* Generate Button */}
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
                  Generate Keywords
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
                Generated Keywords
              </h2>

              <p className="mt-0.5 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                Your AI-generated keywords will appear below.
              </p>
            </div>

            {hasKeywords && (
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
                    Copy All
                  </>
                )}
              </button>
            )}
          </div>

          <div className="flex flex-1 items-start justify-center overflow-y-auto rounded-lg border border-dashed border-slate-200 bg-slate-50/50 p-6 dark:border-slate-800 dark:bg-slate-900/30">
            {isPending ? (
              <div className="flex flex-col items-center gap-2.5 text-center my-auto">
                <Loader2 className="h-6 w-6 animate-spin text-slate-600 dark:text-slate-400" />
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  AI is generating relevant keywords...
                </p>
              </div>
            ) : hasKeywords ? (
              <div className="w-full space-y-5">
                {keywordGroups.map(({ key, label }) => {
                  const groupKeywords = keywords[key];

                  if (!groupKeywords.length) {
                    return null;
                  }

                  return (
                    <div key={key}>
                      <h3 className="mb-2 text-xs font-semibold text-slate-900 dark:text-slate-100">
                        {label}
                      </h3>

                      <div className="flex flex-wrap gap-2">
                        {groupKeywords.map((keyword) => (
                          <div
                            key={keyword}
                            className="group flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-2.5 py-1 text-xs text-slate-800 transition hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-slate-700"
                          >
                            <span>{keyword}</span>

                            <button
                              type="button"
                              onClick={() =>
                                removeKeyword(key, keyword)
                              }
                              className="text-slate-400 transition-colors hover:text-red-500 dark:text-slate-500 dark:hover:text-red-400"
                              aria-label={`Remove ${keyword}`}
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="my-auto text-center">
                <Tags className="mx-auto h-7 w-7 text-slate-400 dark:text-slate-600" />
                <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                  Fill in the product information and click Generate Keywords.
                </p>
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
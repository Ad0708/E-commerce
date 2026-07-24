"use client";

import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  Bot,
  ImageIcon,
  Lightbulb,
  PackageSearch,
  Search,
  Sparkles,
  Tags,
  WandSparkles,
  type LucideIcon,
} from "lucide-react";

interface Tool {
  title: string;
  description: string;
  icon: LucideIcon;
  href: string;
}

const aiTools: Tool[] = [
  {
    title: "Product Description Generator",
    description:
      "Generate engaging and professional product descriptions using AI.",
    icon: WandSparkles,
    href: "/admin/ai/product-description",
  },
  {
    title: "SEO Title Generator",
    description:
      "Create optimized SEO titles to improve your product visibility.",
    icon: Search,
    href: "/admin/ai/seo-title",
  },
  {
    title: "Keyword Generator",
    description:
      "Generate relevant keywords to improve product discoverability.",
    icon: Tags,
    href: "/admin/ai/keywords",
  },
];

const imageTools: Tool[] = [
  {
    title: "Background Removal",
    description:
      "Remove image backgrounds and create clean product images instantly.",
    icon: ImageIcon,
    href: "/admin/ai/background-removal",
  },
];

const businessTools: Tool[] = [
  {
    title: "Sales Insights",
    description:
      "Analyze your sales data and get actionable business insights.",
    icon: BarChart3,
    href: "/admin/ai/sales-insights",
  },
  {
    title: "Inventory Forecasting",
    description:
      "Predict inventory demand and identify potential stockout risks.",
    icon: PackageSearch,
    href: "/admin/ai/inventory-forecasting",
  },
];

// const supportTools: Tool[] = [
//   {
//     title: "Customer Support Assistant",
//     description:
//       "Get AI-powered assistance for handling customer support queries.",
//     icon: Bot,
//     href: "/customer-support",
//   },
// ];

function AIToolCard({ title, description, icon: Icon, href }: Tool) {
  return (
    <Link
      href={href}
      className="group flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-5 transition-all duration-150 hover:border-slate-300 hover:shadow-sm dark:border-slate-800 dark:bg-slate-900/60 dark:hover:border-slate-700 dark:hover:bg-slate-900"
    >
      <div>
        <div className="flex items-center justify-between gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
            <Icon className="h-5 w-5" />
          </div>
          <ArrowRight className="h-4 w-4 text-slate-400 transition-transform duration-150 group-hover:translate-x-0.5 group-hover:text-slate-700 dark:text-slate-500 dark:group-hover:text-slate-200" />
        </div>

        <h3 className="mt-4 text-sm font-semibold text-slate-900 dark:text-slate-100">
          {title}
        </h3>

        <p className="mt-1.5 text-xs sm:text-sm leading-relaxed text-slate-500 dark:text-slate-400">
          {description}
        </p>
      </div>
    </Link>
  );
}

function AIToolSection({
  title,
  description,
  tools,
}: {
  title: string;
  description: string;
  tools: Tool[];
}) {
  return (
    <section className="space-y-3">
      <div>
        <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">
          {title}
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          {description}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {tools.map((tool) => (
          <AIToolCard key={tool.title} {...tool} />
        ))}
      </div>
    </section>
  );
}

export default function AIPage() {
  return (
    <main className="mx-auto w-full space-y-8 sm:p-6 lg:p-6">
      {/* Top Banner */}
      <section>
        <div className="mb-3 flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
            <Sparkles className="h-5 w-5" />
          </div>

          <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100 sm:text-2xl">
            AI Tools
          </h1>
        </div>

        <p className="max-w-2xl text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          Use AI-powered tools to create better products, understand your
          business, manage inventory, and improve customer support.
        </p>
      </section>

      {/* Sections */}
      <div className="space-y-8">
        <AIToolSection
          title="Product AI"
          description="Create and optimize your product content with AI."
          tools={aiTools}
        />

        <AIToolSection
          title="Image AI"
          description="Improve your product images using AI-powered tools."
          tools={imageTools}
        />

        <AIToolSection
          title="Business AI"
          description="Understand your business performance and make data-driven decisions."
          tools={businessTools}
        />

        {/* <AIToolSection
          title="Support AI"
          description="Use AI to improve and simplify customer support."
          tools={supportTools}
        /> */}
      </div>

      {/* Footer Info Box */}
      <section className="flex items-start gap-3.5 rounded-xl border border-slate-200 bg-white p-4 sm:p-5 dark:border-slate-800 dark:bg-slate-900/60">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
          <Lightbulb className="h-4 w-4" />
        </div>

        <div>
          <h3 className="text-sm font-medium text-slate-900 dark:text-slate-100">
            Work smarter with AI
          </h3>
          <p className="mt-0.5 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Select any AI tool above to get started. More intelligent tools will
            be added to your admin workspace over time.
          </p>
        </div>
      </section>
    </main>
  );
}

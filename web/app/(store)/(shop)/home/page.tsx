import { ArrowRight } from "lucide-react";
import CategorySection from "@/components/home/CategorySection";
import Link from "next/link";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import { StoreBanners } from "@/components/home/Banners";

export default function HomePage() {
  return (
    <main className="flex-1 bg-slate-50/50 text-slate-900 transition-colors duration-200 dark:bg-slate-950 dark:text-slate-50">
      <StoreBanners />

      {/* ============ SHOP BY CATEGORY ============ */}
      <CategorySection />

      {/* ============ FEATURED PRODUCTS ============ */}
      <section className="bg-white py-12 sm:py-16 border-t border-b border-slate-100 dark:bg-slate-900/40 dark:border-slate-900">
        <div className="mx-auto max-w-350 px-4 sm:px-6 lg:px-8">
          <div className="mb-8 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 text-center sm:text-left">
            <div>
              <h2 className="text-xs font-bold uppercase tracking-widest text-blue-600 dark:text-blue-400">
                Highly Coveted
              </h2>
              <p className="mt-1 text-2xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                Featured Products
              </p>
            </div>
            <Link
              href="/products"
              className="group inline-flex items-center justify-center gap-1.5 text-sm font-semibold text-blue-600 hover:text-blue-700 dark:text-cyan-400 dark:hover:text-cyan-300 transition-colors"
            >
              View All Masterpieces
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          <div>
            <FeaturedProducts />
          </div>
        </div>
      </section>
    </main>
  );
  
}

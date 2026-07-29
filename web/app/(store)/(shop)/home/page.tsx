import CategorySection from "@/components/home/CategorySection";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import { StoreBanners } from "@/components/home/Banners";
import TrendingProducts from "@/components/home/TrendingProducts";

export default function HomePage() {
  return (
    <main className="flex-1 bg-white text-slate-900 transition-colors duration-300 dark:bg-slate-950 dark:text-white">
      {/* Hero */}
      <StoreBanners />

      {/* Categories (Parallax Scroll) */}
      <CategorySection />

      {/* Trending (Editorial Layout) */}
      <TrendingProducts />

      {/* Featured (Masonry Grid) */}
      <section className="bg-slate-50 dark:bg-slate-900 py-32">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="mb-20 text-center max-w-3xl mx-auto">
                <h2 className="text-sm font-bold uppercase tracking-widest text-slate-500 mb-4">Highly Coveted</h2>
                <h3 className="text-4xl md:text-6xl font-extrabold tracking-tighter text-slate-900 dark:text-white">Masterpieces</h3>
                <p className="mt-6 text-lg text-slate-600 dark:text-slate-400">
                    A curated selection of our most extraordinary pieces, designed to elevate your everyday.
                </p>
            </div>
            
            <FeaturedProducts />
        </div>
      </section>
    </main>
  );
}

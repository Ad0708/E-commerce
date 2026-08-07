import CategorySection from "@/components/home/CategorySection";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import { StoreBanners } from "@/components/home/Banners";
import TrendingProducts from "@/components/home/TrendingProducts";

export default function HomePage() {
  return (
    <main className="flex-1 bg-background text-foreground transition-colors duration-300">
      {/* Hero */}
      <StoreBanners />
      

      {/* Categories (Parallax Scroll) */}
      <CategorySection />

      {/* Trending (Editorial Layout) */}
      <TrendingProducts />

      {/* Featured (Masonry Grid) */}
      <section className="bg-secondary py-32">
        <div className="max-w-370 mx-auto px-6 lg:px-8">
          <div className="mb-20 text-center max-w-3xl mx-auto">
            <h2 className="text-sm font-bold uppercase tracking-widest text-muted mb-4 font-heading">
              Highly Coveted
            </h2>
            <h3 className="text-4xl md:text-6xl font-extrabold tracking-tighter text-foreground font-heading">
              Masterpieces
            </h3>
            <p className="mt-6 text-lg text-secondary">
              A curated selection of our most extraordinary pieces, designed to
              elevate your everyday.
            </p>
          </div>

          <FeaturedProducts />
        </div>
      </section>
    </main>
  );
}

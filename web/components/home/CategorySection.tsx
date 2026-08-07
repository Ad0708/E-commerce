"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import { categories } from "@/constants/categories";
import { ArrowRight } from "lucide-react";
import Image from "next/image";

export default function CategorySection() {
  const targetRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollRange, setScrollRange] = useState(0);

  useEffect(() => {
    const updateMetrics = () => {
      if (!containerRef.current) return;

      // Calculate total horizontal scroll distance including right end padding
      const padding = window.innerWidth < 768 ? 25 : 50;
      const range = Math.max(
        0,
        containerRef.current.scrollWidth - window.innerWidth + padding
      );

      setScrollRange(range);
    };

    updateMetrics();

    const ro = new ResizeObserver(updateMetrics);
    if (containerRef.current) ro.observe(containerRef.current);

    window.addEventListener("resize", updateMetrics);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", updateMetrics);
    };
  }, []);

  // Section height determines how long user stays pinned while scrolling horizontally
  const sectionHeight = scrollRange > 0 ? scrollRange + window.innerHeight : "100vh";

  // Track scroll while section is pinned (start top of viewport -> end bottom of viewport)
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start start", "end end"],
  });

  // Smooth translation across full range
  const x = useTransform(
    scrollYProgress,
    [0, 1],
    [0, scrollRange > 0 ? -scrollRange : 0]
  );

  const categoryImages: Record<string, string> = {
    smartphones:
      "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=800&auto=format&fit=crop",
    laptops:
      "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?q=80&w=800&auto=format&fit=crop",
    tablets:
      "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?q=80&w=800&auto=format&fit=crop",
    smartwatches:
      "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?q=80&w=800&auto=format&fit=crop",
    headphones:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=800&auto=format&fit=crop",
    gaming:
      "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=800&auto=format&fit=crop&q=80",
    accessories:
      "https://images.unsplash.com/photo-1629131726692-1accd0c53ce0?q=80&w=800&auto=format&fit=crop",
    electronics:
      "https://images.unsplash.com/photo-1550009158-9ebf69173e03?q=80&w=800&auto=format&fit=crop",
  };

  return (
    <section
      ref={targetRef}
      className="relative bg-background"
      style={{ height: sectionHeight }}
    >
      <div className="sticky top-0 flex h-screen items-center overflow-hidden">
        <motion.div
          ref={containerRef}
          style={{ x }}
          className="flex items-center gap-[22px] px-6 will-change-transform md:gap-8 md:px-[50px]"
        >
          {/* Intro Text Card */}
          <div className="flex w-[78vw] shrink-0 flex-col justify-center pr-7 sm:w-[378px] md:w-[425px]">
            <h2 className="mb-3.5 text-[13px] font-bold uppercase tracking-widest text-muted font-heading">
              Curated Collection
            </h2>
            <h3 className="mb-6 text-[34px] font-extrabold leading-tight tracking-tight text-foreground font-heading md:text-[52px]">
              Explore Our <br /> <span className="text-gradient">Categories</span>
            </h3>
            <Link
              href="/products"
              className="inline-flex w-max items-center gap-2 border-b-2 border-foreground pb-1 text-[13px] font-bold uppercase tracking-widest text-foreground transition-colors hover:text-muted group"
            >
              View All Products 
              <ArrowRight className="h-[17px] w-[17px] transform group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Category Image Cards */}
          {categories.map((cat, idx) => (
            <Link
              href={`/products?category=${cat.value}`}
              key={cat.value}
              className="group relative aspect-[4/4.8] w-[71vw] shrink-0 overflow-hidden rounded-[2rem] bg-black shadow-xl sm:w-[330px] md:w-[378px]"
            >
              <motion.div className="w-full h-full relative origin-center">
                <Image
                  src={categoryImages[cat.value] || categoryImages.electronics}
                  alt={cat.label}
                  fill
                  sizes="(max-width: 768px) 71vw, 378px"
                  className="object-cover opacity-60 grayscale transition-all duration-700 ease-out group-hover:scale-110 group-hover:grayscale-0 group-hover:opacity-100"
                />
              </motion.div>
              
              <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black via-black/50 to-transparent opacity-80" />

              <div className="absolute inset-x-0 bottom-0 p-[22px] md:p-[30px] translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                <div className="glass-panel w-max rounded-full px-3 py-1 mb-3 border-[var(--glass-border)] bg-black/20 backdrop-blur-md">
                  <span className="font-mono text-xs uppercase tracking-widest text-white/90">
                    0{idx + 1}
                  </span>
                </div>
                <h4 className="text-[26px] font-bold text-white font-heading md:text-[33px] drop-shadow-lg">
                  {cat.label}
                </h4>
              </div>
            </Link>
          ))}

          {/* Extra right space to guarantee the final card reaches the viewport margin */}
          <div className="w-[25px] shrink-0 md:w-[50px]" aria-hidden />
        </motion.div>
      </div>
    </section>
  );
}
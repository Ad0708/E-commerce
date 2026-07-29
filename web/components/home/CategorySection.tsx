"use client";

import { useRef, useState, useEffect, useMemo } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import { categories } from "@/constants/categories";
import { ArrowRight } from "lucide-react";
import Image from "next/image";

export default function CategorySection() {
  const targetRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollRange, setScrollRange] = useState(0);
  const [viewportHeight, setViewportHeight] = useState(0);

  useEffect(() => {
    const updateMetrics = () => {
      if (!containerRef.current) return;

      const vh = window.innerHeight;
      const range = Math.max(
        0,
        containerRef.current.scrollWidth - window.innerWidth + 48
      );

      setViewportHeight(vh);
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

  // Phase 1: vertical scroll while section enters (V)
  // Phase 2: horizontal scroll through categories (scrollRange)
  // Phase 3: release back to normal vertical scroll (V buffer)
  const sectionHeight = viewportHeight + scrollRange + viewportHeight;

  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start end", "end start"],
  });

  const enterProgress = useMemo(() => {
    if (viewportHeight <= 0 || scrollRange <= 0) return 1;
    return viewportHeight / (viewportHeight + scrollRange);
  }, [viewportHeight, scrollRange]);

  const x = useTransform(
    scrollYProgress,
    [enterProgress, 1],
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
      className="relative bg-slate-50 dark:bg-slate-950"
      style={{ height: sectionHeight > 0 ? sectionHeight : "100vh" }}
    >
      <div className="sticky top-0 flex h-screen items-center overflow-hidden">
        <motion.div
          ref={containerRef}
          style={{ x }}
          className="flex items-center gap-6 px-6 will-change-transform md:gap-8 md:px-12"
        >
          {/* Intro Text Card */}
          <div className="flex w-[85vw] flex-shrink-0 flex-col justify-center pr-8 sm:w-[400px] md:w-[450px]">
            <h2 className="mb-4 text-sm font-bold uppercase tracking-widest text-slate-500">
              Curated Collection
            </h2>
            <h3 className="mb-8 text-4xl font-extrabold leading-tight tracking-tight text-slate-900 dark:text-white md:text-6xl">
              Explore Our <br /> Categories
            </h3>
            <Link
              href="/products"
              className="inline-flex w-max items-center gap-2 border-b-2 border-slate-900 pb-1 text-sm font-bold uppercase tracking-widest text-slate-900 transition-colors hover:text-slate-500 dark:border-white dark:text-white"
            >
              View All Products <ArrowRight className="h-5 w-5" />
            </Link>
          </div>

          {/* Category Image Cards */}
          {categories.map((cat, idx) => (
            <Link
              href={`/products?category=${cat.value}`}
              key={cat.value}
              className="group relative aspect-[4/5] w-[75vw] flex-shrink-0 overflow-hidden rounded-3xl bg-slate-900 shadow-xl sm:w-[350px] md:w-[400px]"
            >
              <Image
                src={categoryImages[cat.value] || categoryImages.electronics}
                alt={cat.label}
                fill
                sizes="(max-width: 768px) 75vw, 400px"
                className="object-cover opacity-80 transition-all duration-700 ease-out group-hover:scale-110 group-hover:opacity-100"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent transition-opacity duration-500 group-hover:opacity-80" />

              <div className="absolute inset-0 flex transform flex-col justify-end p-6 transition-transform duration-500 md:p-8">
                <span className="mb-2 block font-mono text-sm uppercase tracking-widest text-white/60">
                  0{idx + 1}
                </span>
                <h4 className="mb-2 text-3xl font-bold text-white md:text-4xl">
                  {cat.label}
                </h4>
              </div>
            </Link>
          ))}

          <div className="w-6 flex-shrink-0 md:w-12" aria-hidden />
        </motion.div>
      </div>
    </section>
  );
}

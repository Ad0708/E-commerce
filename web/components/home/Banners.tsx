"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useStoreBanners } from "@/hooks/store/useStore";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight } from "lucide-react";

export function StoreBanners() {
  const { data: banners = [], isLoading, isError } = useStoreBanners();
  const [currentIndex, setCurrentIndex] = useState(0);

  const activeBanners = banners
    .filter((banner) => banner.active)
    .sort((a, b) => a.order - b.order);

  useEffect(() => {
    if (activeBanners.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % activeBanners.length);
    }, 6000);

    return () => clearInterval(interval);
  }, [activeBanners.length]);

  if (isLoading) {
    return <div className="h-screen w-full animate-pulse bg-slate-900" />;
  }

  if (isError || activeBanners.length === 0) {
    return null;
  }

  const currentBanner = activeBanners[currentIndex];

  return (
    <section className="relative w-full h-screen overflow-hidden bg-black">
      <AnimatePresence initial={false} mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: [0.33, 1, 0.68, 1] }}
          className="absolute inset-0"
        >
          <Image
            src={currentBanner.image}
            alt={currentBanner.title || "Store banner"}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          {/* Subtle gradient to ensure text readability */}
          <div className="absolute inset-0 bg-black/40" />
        </motion.div>
      </AnimatePresence>

      <div className="absolute inset-0 flex flex-col justify-center items-center text-center px-6 z-20 pt-20">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="max-w-4xl"
          >
            {currentBanner.title && (
              <h2 className="text-5xl md:text-7xl lg:text-8xl font-extrabold tracking-tighter text-white leading-tight mb-6 drop-shadow-xl">
                {currentBanner.title}
              </h2>
            )}
            
            {currentBanner.subtitle && (
              <p className="text-xl md:text-2xl text-white/90 mb-10 font-medium drop-shadow-md">
                {currentBanner.subtitle}
              </p>
            )}

            {currentBanner.buttonText && currentBanner.buttonLink && (
              <Link
                href={
                  currentBanner.buttonLink.startsWith("http") || currentBanner.buttonLink.startsWith("/")
                    ? currentBanner.buttonLink
                    : `/${currentBanner.buttonLink}`
                }
                className="group inline-flex items-center gap-4 bg-white text-black px-10 py-5 rounded-full font-bold text-sm tracking-widest uppercase hover:bg-slate-200 transition-colors shadow-2xl"
              >
                {currentBanner.buttonText}
                <div className="bg-black rounded-full p-2 text-white group-hover:translate-x-1 transition-transform">
                    <ChevronRight className="w-4 h-4" />
                </div>
              </Link>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Indicators */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex gap-4 z-20">
        {activeBanners.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            className={`h-1.5 rounded-full transition-all duration-500 ${
              idx === currentIndex ? "w-16 bg-white" : "w-6 bg-white/40 hover:bg-white/70"
            }`}
          />
        ))}
      </div>
    </section>
  );
}

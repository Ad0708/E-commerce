"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useStoreBanners } from "@/hooks/store/useStore";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

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
    return <div className="h-screen w-full bg-[var(--bg-primary)]" />;
  }

  if (isError || activeBanners.length === 0) {
    return null;
  }

  const currentBanner = activeBanners[currentIndex];

  const letterAnimation = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <section className="relative w-full h-screen overflow-hidden bg-black group">
      <AnimatePresence initial={false} mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1.05 }}
          exit={{ opacity: 0 }}
          transition={{ opacity: { duration: 1.2 }, scale: { duration: 10, ease: "linear" } }}
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
          {/* Gradient mesh overlay instead of flat black */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/60 mix-blend-multiply" />
          <div className="absolute inset-0 bg-[var(--accent-start)]/10 mix-blend-overlay" />
        </motion.div>
      </AnimatePresence>

      <div className="absolute inset-0 flex flex-col justify-center items-center text-center px-6 z-20 pt-20">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            className="max-w-4xl"
          >
            {currentBanner.title && (
              <h2 className="text-5xl md:text-7xl lg:text-8xl font-extrabold tracking-tighter text-white leading-tight mb-6 drop-shadow-2xl font-heading flex justify-center flex-wrap gap-x-3 overflow-hidden">
                {currentBanner.title.split(" ").map((word, wordIndex) => (
                  <span key={wordIndex} className="inline-flex overflow-hidden">
                    {word.split("").map((char, charIndex) => (
                      <motion.span
                        key={charIndex}
                        variants={letterAnimation}
                        initial="hidden"
                        animate="visible"
                        transition={{ duration: 0.5, delay: (wordIndex * 0.1) + (charIndex * 0.03), ease: [0.33, 1, 0.68, 1] }}
                      >
                        {char}
                      </motion.span>
                    ))}
                  </span>
                ))}
              </h2>
            )}
            
            {currentBanner.subtitle && (
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.8 }}
                className="text-xl md:text-2xl text-white/90 mb-10 font-medium drop-shadow-md"
              >
                {currentBanner.subtitle}
              </motion.p>
            )}

            {currentBanner.buttonText && currentBanner.buttonLink && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.8, duration: 0.5 }}
              >
                <Link
                  href={
                    currentBanner.buttonLink.startsWith("http") || currentBanner.buttonLink.startsWith("/")
                      ? currentBanner.buttonLink
                      : `/${currentBanner.buttonLink}`
                  }
                >
                  <Button size="lg" className="px-10 text-base uppercase tracking-widest gap-4 group/btn overflow-hidden">
                    {currentBanner.buttonText}
                    <div className="bg-white/20 rounded-full p-1 group-hover/btn:translate-x-1 transition-transform">
                      <ChevronRight className="w-5 h-5" />
                    </div>
                  </Button>
                </Link>
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Progress bar timeline indicators */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex gap-3 z-20">
        {activeBanners.map((_, idx) => (
          <div
            key={idx}
            className="h-1 w-16 bg-white/20 rounded-full overflow-hidden cursor-pointer"
            onClick={() => setCurrentIndex(idx)}
          >
            {idx === currentIndex && (
              <motion.div 
                className="h-full bg-white w-full origin-left"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 6, ease: "linear" }}
              />
            )}
          </div>
        ))}
      </div>
      
      {/* Scroll indicator chevron */}
      <motion.div 
        className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 text-white/50 hidden md:block"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      >
        <ChevronRight className="w-6 h-6 rotate-90" />
      </motion.div>
    </section>
  );
}

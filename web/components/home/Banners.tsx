"use client";

import { useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useStoreBanners } from "@/hooks/store/useStore";

export function StoreBanners() {
  const { data: banners = [], isLoading, isError } = useStoreBanners();
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const activeBanners = banners
    .filter((banner) => banner.active)
    .sort((a, b) => a.order - b.order);

  // Navigation handlers for infinite looping side buttons
  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const { clientWidth, scrollLeft, scrollWidth } =
        scrollContainerRef.current;
      let scrollTo =
        direction === "left"
          ? scrollLeft - clientWidth
          : scrollLeft + clientWidth;

      const isAtEnd = scrollLeft + clientWidth >= scrollWidth - 10;
      const isAtStart = scrollLeft <= 10;

      if (direction === "right" && isAtEnd) {
        scrollTo = 0;
      } else if (direction === "left" && isAtStart) {
        scrollTo = scrollWidth - clientWidth;
      }

      scrollContainerRef.current.scrollTo({
        left: scrollTo,
        behavior: "smooth",
      });
    }
  };

  // Autoplay function
  useEffect(() => {
    if (activeBanners.length <= 1) return;

    const interval = setInterval(() => {
      scroll("right");
    }, 5000); // Transitions every 5 seconds

    return () => clearInterval(interval);
  }, [activeBanners.length]);

  if (isLoading) {
    return (
      <section className="w-full px-4 md:px-6">
        <div className="h-[250px] sm:h-[350px] md:h-[450px] lg:h-[500px] w-full animate-pulse rounded-2xl bg-muted" />
      </section>
    );
  }

  if (isError || activeBanners.length === 0) {
    return null;
  }

  return (
    <section className="group relative w-full px-4 md:px-6">
      {/* Scroll Container */}
      <div
        ref={scrollContainerRef}
        className="scrollbar-none flex w-full snap-x snap-mandatory overflow-x-auto rounded-2xl"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {activeBanners.map((banner) => (
          <div
            key={banner._id}
            className="relative h-[250px] sm:h-[350px] md:h-[450px] lg:h-[700px] w-full shrink-0 snap-start overflow-hidden"
          >
            {/* Banner Background Image */}
            <Image
              src={banner.image}
              alt={banner.title || "Store banner"}
              fill
              priority
              sizes="100vw"
              className="object-cover object-center"
            />

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-linear-to-r from-black/70 via-black/40 to-transparent pointer-events-none" />

            {/* Content Container */}
            <div className="absolute inset-0 z-30 flex flex-col justify-center px-8 sm:px-12 md:px-16 lg:px-20 text-white pointer-events-none">
              {/* Responsive text alignment wrapper */}
              <div className="w-full max-w-xs sm:max-w-md md:max-w-xl lg:max-w-2xl space-y-3 md:space-y-4 pointer-events-auto">
                {banner.title && (
                  <h2 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight drop-shadow-sm leading-tight max-w-[85%] sm:max-w-[80%] md:max-w-[75%]">
                    {banner.title}
                  </h2>
                )}

                {banner.subtitle && (
                  <p className="text-xs sm:text-base md:text-lg text-zinc-200 font-medium drop-shadow-sm line-clamp-2 sm:line-clamp-none max-w-[90%] sm:max-w-[85%]">
                    {banner.subtitle}
                  </p>
                )}

                {banner.buttonText && banner.buttonLink && (
                  <div className="pt-2 md:pt-4">
                    <Link
                      href={
                        banner.buttonLink.startsWith("http") ||
                        banner.buttonLink.startsWith("/")
                          ? banner.buttonLink
                          : `/${banner.buttonLink}`
                      }
                      className="inline-flex items-center justify-center rounded-xl bg-white px-5 py-2.5 sm:px-6 sm:py-3 text-xs sm:text-sm font-bold text-black shadow-lg transition-all duration-200 hover:bg-zinc-100 hover:scale-[1.02] active:scale-[0.98]"
                    >
                      {banner.buttonText}
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Side Navigation Buttons */}
      {activeBanners.length > 1 && (
        <>
          <button
            onClick={() => scroll("left")}
            className="absolute left-6 md:left-8 top-1/2 z-40 flex h-10 w-10 md:h-12 md:w-12 -translate-y-1/2 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-md transition-all duration-200 opacity-0 group-hover:opacity-100 hover:bg-black/70 active:scale-95 shadow-md"
            aria-label="Previous slide"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2.5}
              stroke="currentColor"
              className="w-5 h-5 md:w-6 md:h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 19.5L8.25 12l7.5-7.5"
              />
            </svg>
          </button>

          <button
            onClick={() => scroll("right")}
            className="absolute right-6 md:right-8 top-1/2 z-40 flex h-10 w-10 md:h-12 md:w-12 -translate-y-1/2 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-md transition-all duration-200 opacity-0 group-hover:opacity-100 hover:bg-black/70 active:scale-95 shadow-md"
            aria-label="Next slide"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2.5}
              stroke="currentColor"
              className="w-5 h-5 md:w-6 md:h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8.25 4.5l7.5 7.5-7.5 7.5"
              />
            </svg>
          </button>
        </>
      )}
    </section>
  );
}

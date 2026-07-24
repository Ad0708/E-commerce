"use client";

import {
  Smartphone,
  Watch,
  Laptop,
  ArrowUpRight,
  Computer,
} from "lucide-react";
import { motion, Variants } from "framer-motion";

// Section header slide-down animation
const headerVariants: Variants = {
  hidden: { opacity: 0, y: -20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

// Container stagger controller
const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
    },
  },
};

// Card pop-and-scale animation variant
const cardVariants: Variants = {
  hidden: { opacity: 0, scale: 0.9, y: 30 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
};

export default function CategorySection() {
  const techCategories = [
    {
      label: "Mobile Devices",
      slug: "smartphones",
      icon: Smartphone,
      color: "group-hover:text-purple-500 dark:group-hover:text-purple-400",
    },
    {
      label: "Smart Accessories",
      slug: "accessories",
      icon: Watch,
      color: "group-hover:text-cyan-500 dark:group-hover:text-cyan-400",
    },
    {
      label: "Gaming",
      slug: "gaming",
      icon: Computer,
      color: "group-hover:text-blue-500 dark:group-hover:text-blue-400",
    },
    {
      label: "Laptops",
      slug: "laptops",
      icon: Laptop,
      color: "group-hover:text-pink-500 dark:group-hover:text-pink-400",
    },
  ];

  return (
    <section className="mx-auto max-w-350 px-4 py-12 sm:py-16 sm:px-6 lg:px-8">
      {/* Header with gentle slide-down effect */}
      <motion.div
        className="mb-8 sm:mb-10 text-center sm:text-left"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false, margin: "-50px" }}
        variants={headerVariants}
      >
        <h2 className="text-xs font-bold uppercase tracking-widest text-blue-600 dark:text-blue-400">
          Next-Gen Ecosystems
        </h2>
        <p className="mt-1 text-2xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          Shop by Category
        </p>
      </motion.div>

      {/* Grid with stagger scale pop-in */}
      <motion.div
        className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false, margin: "-50px" }}
      >
        {techCategories.map((cat) => (
          <motion.a
            key={cat.slug}
            href={`/products?category=${cat.slug}`}
            variants={cardVariants}
            className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-200 bg-white p-4 sm:p-6 text-left hover:border-slate-300 hover:shadow-xl dark:border-slate-800 dark:bg-slate-900 dark:hover:border-slate-700 transition-all duration-200"
          >
            <div className="flex items-center justify-between">
              <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-xl bg-slate-50 text-slate-700 border border-slate-100 group-hover:bg-slate-900 group-hover:text-white dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700 dark:group-hover:bg-white dark:group-hover:text-slate-900 transition-colors duration-200">
                <cat.icon className="h-5 w-5 stroke-[1.5]" />
              </div>
              <ArrowUpRight className="h-4 w-4 text-slate-300 group-hover:text-slate-500 dark:text-slate-700 dark:group-hover:text-slate-400 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-200" />
            </div>

            <div className="mt-8 sm:mt-12">
              <span
                className={`mt-0.5 block text-sm sm:text-base font-semibold text-slate-900 dark:text-white transition-colors duration-200 ${cat.color}`}
              >
                {cat.label}
              </span>
            </div>
          </motion.a>
        ))}
      </motion.div>
    </section>
  );
}

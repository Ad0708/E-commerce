// "use client";

// import { useState } from "react";
// import Link from "next/link";
// import { LayoutGrid, List } from "lucide-react";
// import { motion, AnimatePresence, Variants } from "framer-motion";
// import ProductCard from "./ProductCard";
// import { Product } from "@/types/product";

// interface ProductGridProps {
//   products: Product[];
//   mode: "admin" | "customer";
//   wishlist: Set<string>;
// }

// // Explicitly typed variants to prevent TypeScript easing mismatch
// const containerVariants: Variants = {
//   hidden: { opacity: 0 },
//   show: {
//     opacity: 1,
//     transition: {
//       staggerChildren: 0.05,
//     },
//   },
// };

// const itemVariants: Variants = {
//   hidden: { opacity: 0, y: 16 },
//   show: {
//     opacity: 1,
//     y: 0,
//     transition: { duration: 0.25, ease: "easeOut" },
//   },
// };

// export default function ProductGrid({
//   products,
//   mode,
//   wishlist,
// }: ProductGridProps) {
//   const [view, setView] = useState<"grid" | "list">("grid");

//   return (
//     <div className="space-y-4">
//       {/* Sticky view toggle */}
//       <div className="sticky top-0 z-10 flex items-center justify-end py-2">
//         <div className="flex gap-1 rounded-xl border border-slate-200 bg-white p-1 shadow-sm dark:border-slate-700 dark:bg-slate-900">
//           <button
//             onClick={() => setView("grid")}
//             className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
//               view === "grid"
//                 ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900"
//                 : "text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white"
//             }`}
//             aria-label="Grid view"
//           >
//             <LayoutGrid size={15} />
//             <span className="hidden sm:inline">Grid</span>
//           </button>
//           <button
//             onClick={() => setView("list")}
//             className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
//               view === "list"
//                 ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900"
//                 : "text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white"
//             }`}
//             aria-label="List view"
//           >
//             <List size={15} />
//             <span className="hidden sm:inline">List</span>
//           </button>
//         </div>
//       </div>

//       <AnimatePresence mode="wait">
//         {/* Grid view */}
//         {view === "grid" && (
//           <motion.div
//             key="grid-layout"
//             variants={containerVariants}
//             initial="hidden"
//             animate="show"
//             exit={{ opacity: 0 }}
//             className="grid gap-5 grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
//           >
//             {mode === "admin"
//               ? products?.map((product, index) => (
//                   <motion.div
//                     key={`${product._id}-${index}`}
//                     variants={itemVariants}
//                   >
//                     <ProductCard
//                       product={product}
//                       mode={mode}
//                       view="grid"
//                       wishlisted={wishlist?.has(product._id)}
//                     />
//                   </motion.div>
//                 ))
//               : products?.map((product) => (
//                   <motion.div key={product._id} variants={itemVariants}>
//                     <Link href={`/product/${product._id}`} className="block">
//                       <ProductCard
//                         product={product}
//                         mode={mode}
//                         view="grid"
//                         wishlisted={wishlist?.has(product._id)}
//                       />
//                     </Link>
//                   </motion.div>
//                 ))}
//           </motion.div>
//         )}

//         {/* List view */}
//         {view === "list" && (
//           <motion.div
//             key="list-layout"
//             variants={containerVariants}
//             initial="hidden"
//             animate="show"
//             exit={{ opacity: 0 }}
//             className="flex flex-col gap-3"
//           >
//             {mode === "admin"
//               ? products?.map((product, index) => (
//                   <motion.div
//                     key={`${product._id}-${index}`}
//                     variants={itemVariants}
//                   >
//                     <ProductCard
//                       product={product}
//                       mode={mode}
//                       view="list"
//                       wishlisted={wishlist?.has(product._id)}
//                     />
//                   </motion.div>
//                 ))
//               : products?.map((product) => (
//                   <motion.div key={product._id} variants={itemVariants}>
//                     <Link href={`/product/${product._id}`} className="block">
//                       <ProductCard
//                         product={product}
//                         mode={mode}
//                         view="list"
//                         wishlisted={wishlist?.has(product._id)}
//                       />
//                     </Link>
//                   </motion.div>
//                 ))}
//           </motion.div>
//         )}
//       </AnimatePresence>
//     </div>
//   );
// }

"use client";

import { useState } from "react";
import Link from "next/link";
import { LayoutGrid, List } from "lucide-react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import ProductCard from "./ProductCard";
import { Product } from "@/types/product";

interface ProductGridProps {
  products: Product[];
  mode: "admin" | "customer";
  wishlist: Set<string>;
}

// Explicitly typed variants to prevent TypeScript easing mismatch
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.25, ease: "easeOut" },
  },
};

export default function ProductGrid({
  products,
  mode,
  wishlist,
}: ProductGridProps) {
  const [view, setView] = useState<"grid" | "list">("grid");

  return (
    <div className="space-y-4">
      {/* Sticky view toggle */}
      <div className="sticky top-0 z-10 flex items-center justify-end py-2">
        <div className="flex gap-1 rounded-xl border border-slate-200 bg-white p-1 shadow-sm dark:border-slate-700 dark:bg-slate-900">
          <button
            onClick={() => setView("grid")}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
              view === "grid"
                ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900"
                : "text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white"
            }`}
            aria-label="Grid view"
          >
            <LayoutGrid size={15} />
            <span className="hidden sm:inline">Grid</span>
          </button>
          <button
            onClick={() => setView("list")}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
              view === "list"
                ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900"
                : "text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white"
            }`}
            aria-label="List view"
          >
            <List size={15} />
            <span className="hidden sm:inline">List</span>
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {/* Grid view */}
        {view === "grid" && (
          <motion.div
            key="grid-layout"
            variants={containerVariants}
            initial="hidden"
            animate="show"
            exit={{ opacity: 0 }}
            className="grid gap-5 grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
          >
            {mode === "admin"
              ? products?.map((product, index) => (
                  <motion.div
                    key={`${product._id}-${index}`}
                    variants={itemVariants}
                    className="h-full"
                  >
                    <ProductCard
                      product={product}
                      mode={mode}
                      view="grid"
                      wishlisted={wishlist?.has(product._id)}
                    />
                  </motion.div>
                ))
              : products?.map((product) => (
                  <motion.div
                    key={product._id}
                    variants={itemVariants}
                    className="h-full"
                  >
                    <Link href={`/product/${product._id}`} className="block h-full">
                      <ProductCard
                        product={product}
                        mode={mode}
                        view="grid"
                        wishlisted={wishlist?.has(product._id)}
                      />
                    </Link>
                  </motion.div>
                ))}
          </motion.div>
        )}

        {/* List view */}
        {view === "list" && (
          <motion.div
            key="list-layout"
            variants={containerVariants}
            initial="hidden"
            animate="show"
            exit={{ opacity: 0 }}
            className="flex flex-col gap-3"
          >
            {mode === "admin"
              ? products?.map((product, index) => (
                  <motion.div
                    key={`${product._id}-${index}`}
                    variants={itemVariants}
                  >
                    <ProductCard
                      product={product}
                      mode={mode}
                      view="list"
                      wishlisted={wishlist?.has(product._id)}
                    />
                  </motion.div>
                ))
              : products?.map((product) => (
                  <motion.div key={product._id} variants={itemVariants}>
                    <Link href={`/product/${product._id}`} className="block">
                      <ProductCard
                        product={product}
                        mode={mode}
                        view="list"
                        wishlisted={wishlist?.has(product._id)}
                      />
                    </Link>
                  </motion.div>
                ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
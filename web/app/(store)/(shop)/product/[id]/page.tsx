"use client";

import { useParams, useRouter } from "next/navigation";
import ProductDetails from "@/components/products/ProductDetails";
import { useWishlist } from "@/hooks/wishlist/useWishlist";
import { useWishlistStore } from "@/store/wishlist.store";
import { useCartStore } from "@/store/cart.store";
import { useCart } from "@/hooks/cart/useCart";
import { useProduct } from "@/hooks/product/useProduct";
import { motion, Variants } from "framer-motion";

// Animation Variants
const containerVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: "easeOut",
      staggerChildren: 0.1,
    },
  },
};

const buttonVariants: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, ease: "easeOut" },
  },
};

import { useAuthStore } from "@/store/auth.store";
import { useAuthModalStore } from "@/store/authModal.store";

export default function CustomerProductPage() {
  const { id } = useParams();
  const router = useRouter();

  const user = useAuthStore((s) => s.user);
  const openAuthModal = useAuthModalStore((s) => s.openAuthModal);

  const wishlistItems = useWishlistStore((state) => state.wishlist);
  const isWishlisted = (wishlistItems ?? []).some((item) => item?.product?._id === id);

  const { addToWishlist, removeFromWishlist } = useWishlist();

  const handleToggleWishlist = () => {
    if (!user) {
      openAuthModal({
        title: "Login Required",
        description: "Please log in to save items to your wishlist.",
        pendingAction: { type: "ADD_TO_WISHLIST", productId: id as string },
      });
      return;
    }

    if (isWishlisted) {
      removeFromWishlist(id as string);
    } else {
      addToWishlist(id as string);
    }
  };

  const { data: product } = useProduct(id as string);
  const { addToCart, isAdding, removeFromCart } = useCart();
  const isInCart = useCartStore((s) =>
    product ? s.isInCart(product._id) : false,
  );

  const handleBuyNow = () => {
    if (!product || product.stock === 0) return;

    const payload = {
      productId: product._id,
      name: product.name,
      image: product.images?.[0] || "",
      price: product.price,
      discountPrice: product.discountPrice,
      stock: product.stock,
      category: product.category,
      quantity: 1,
    };

    if (!user) {
      openAuthModal({
        title: "Login Required",
        description: `Please log in to buy ${product.name}.`,
        pendingAction: { type: "ADD_TO_CART", payload },
      });
      return;
    }

    addToCart(payload);
    router.push("/cart");
  };

  if (!product) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex h-96 items-center justify-center text-red-500 font-medium"
      >
        Product not found
      </motion.div>
    );
  }

  const imageUrl = product.images?.find(
    (img) =>
      typeof img === "string" && img.trim() !== "" && img.startsWith("http"),
  ) as string;

  function handleAddToCart() {
    if (!product) return;
    if (isInCart || product.stock === 0) return;

    const payload = {
      productId: product._id,
      name: product.name,
      image: imageUrl,
      price: product.price,
      discountPrice: product.discountPrice,
      stock: product.stock,
      category: product.category,
      quantity: 1,
    };

    if (!user) {
      openAuthModal({
        title: "Login Required",
        description: `Please log in to add ${product.name} to your cart.`,
        pendingAction: { type: "ADD_TO_CART", payload },
      });
      return;
    }

    addToCart(payload);
  }

  const handletoggle = () => {
    if (isInCart) {
      removeFromCart(product._id);
    } else {
      handleAddToCart();
    }
  };

  return (
    <div className="bg-slate-50 dark:bg-slate-950 min-h-screen pt-20">
      <main className="py-10 lg:py-14">
        <div className="mx-auto max-w-370 px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-lg dark:border-slate-800 dark:bg-slate-900"
          >
            <ProductDetails
              id={id as string}
              isAdmin={false}
              actions={() => (
                <motion.div
                  variants={containerVariants}
                  className="mt-6 flex flex-col gap-3 border-t border-zinc-200 pt-6 dark:border-zinc-800"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {/* ── 1. ADD TO CART / REMOVE BUTTON ── */}
                    <motion.button
                      variants={buttonVariants}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handletoggle}
                      disabled={isAdding || product.stock === 0}
                      className={`group relative flex items-center justify-center gap-2.5 rounded-xl px-4 py-3.5 text-sm font-bold tracking-wide uppercase transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed ${
                        isInCart
                          ? "border border-rose-500/50 bg-rose-500/10 text-rose-500 shadow-sm hover:bg-rose-500/20"
                          : "border border-[var(--glass-border)] bg-secondary/10 text-foreground shadow-sm hover:bg-foreground hover:text-background hover:shadow-lg hover:-translate-y-0.5"
                      }`}
                    >
                      <svg
                        className={`w-4 h-4 shrink-0 transition-transform duration-300 ${
                          isInCart ? "group-hover:rotate-12" : "group-hover:-rotate-12"
                        }`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth="2.5"
                      >
                        {isInCart ? (
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        ) : (
                          <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                        )}
                      </svg>
                      <span className="truncate">{isInCart ? "Remove" : "Add to Bag"}</span>
                    </motion.button>

                    {/* ── 2. BUY NOW BUTTON ── */}
                    <motion.button
                      variants={buttonVariants}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleBuyNow}
                      disabled={product.stock === 0}
                      className="group relative flex items-center justify-center gap-2.5 rounded-xl bg-linear-to-r from-[var(--accent-start)] to-[var(--accent-end)] px-4 py-3.5 text-sm font-bold text-white tracking-wide uppercase shadow-lg shadow-[var(--accent-mid)]/20 transition-all duration-300 hover:shadow-[var(--accent-mid)]/40 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-[var(--accent-mid)]/20"
                    >
                      <svg
                        className="w-4 h-4 shrink-0 transition-transform duration-300 group-hover:translate-x-1"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth="2.5"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      <span className="truncate">Buy Now</span>
                    </motion.button>
                  </div>

                  {/* ── 3. WISHLIST BUTTON ── */}
                  <motion.button
                    variants={buttonVariants}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    onClick={handleToggleWishlist}
                    className={`group relative flex w-full items-center justify-center gap-2 rounded-xl border px-4 py-3.5 text-sm font-bold uppercase tracking-wide shadow-sm transition-all duration-300 ${
                      isWishlisted
                        ? "border-pink-500/30 bg-pink-500/10 text-pink-500"
                        : "border-[var(--glass-border)] bg-background text-secondary hover:bg-secondary/10 hover:text-foreground"
                    }`}
                  >
                    <motion.svg
                      animate={{ scale: isWishlisted ? [1, 1.25, 1] : 1 }}
                      transition={{ duration: 0.3 }}
                      className={`w-4.5 h-4.5 transition-colors duration-300 ${
                        isWishlisted
                          ? "fill-pink-500 text-pink-500 dark:fill-pink-400 dark:text-pink-400"
                          : "fill-transparent stroke-current group-hover:text-pink-500 dark:group-hover:text-pink-400"
                      }`}
                      viewBox="0 0 24 24"
                      strokeWidth="2"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
                      />
                    </motion.svg>
                    <span>
                      {isWishlisted ? "Saved to Wishlist" : "Add to Wishlist"}
                    </span>
                  </motion.button>
                </motion.div>
              )}
            />
          </motion.div>
        </div>
      </main>
    </div>
  );
}

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
    if (!product) return;

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
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
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
                  className="mt-8 flex flex-col gap-3.5 border-t border-slate-200 pt-6 dark:border-slate-700"
                >
                  {/* ── 1. WISHLIST BUTTON ── */}
                  <motion.button
                    variants={buttonVariants}
                    whileHover={{ scale: 1.015 }}
                    whileTap={{ scale: 0.985 }}
                    onClick={handleToggleWishlist}
                    className={`group relative w-full flex items-center justify-center gap-2 rounded-xl border-2 px-6 py-4 text-base font-bold tracking-wide shadow-sm transition-colors duration-300 ${
                      isWishlisted
                        ? "border-rose-500 bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 shadow-rose-500/20 hover:bg-rose-100 dark:hover:bg-rose-500/20"
                        : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 hover:border-rose-500 dark:hover:border-rose-500 hover:text-rose-500 dark:hover:text-rose-400 hover:shadow-xl hover:shadow-rose-500/15"
                    }`}
                  >
                    <motion.svg
                      animate={{ scale: isWishlisted ? [1, 1.3, 1] : 1 }}
                      transition={{ duration: 0.3 }}
                      className={`w-5 h-5 transition-colors duration-300 ${
                        isWishlisted
                          ? "fill-rose-500 text-rose-500"
                          : "stroke-current fill-transparent group-hover:fill-rose-500 group-hover:text-rose-500"
                      }`}
                      viewBox="0 0 24 24"
                      strokeWidth="2.5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
                      />
                    </motion.svg>

                    <span>
                      {isWishlisted
                        ? "Remove from Wishlist"
                        : "Add to Wishlist"}
                    </span>
                  </motion.button>

                  {/* ── 2. ADD TO CART BUTTON ── */}
                  <motion.button
                    variants={buttonVariants}
                    whileHover={{ scale: 1.015 }}
                    whileTap={{ scale: 0.985 }}
                    onClick={handletoggle}
                    disabled={isAdding}
                    className={`group relative w-full flex items-center justify-center gap-2 rounded-xl px-6 py-4 text-base font-bold text-white tracking-wide shadow-lg transition-all duration-300 disabled:opacity-50 ${
                      isInCart
                        ? "bg-linear-to-r from-red-500 to-rose-600 shadow-red-500/30 hover:shadow-red-500/50"
                        : "bg-linear-to-r from-blue-600 to-indigo-600 shadow-blue-600/20 hover:shadow-blue-600/40"
                    }`}
                  >
                    <svg
                      className={`w-5 h-5 transition-transform duration-300 group-hover:scale-110 ${
                        isInCart
                          ? "group-hover:rotate-6"
                          : "group-hover:-rotate-6"
                      }`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="2.5"
                    >
                      {isInCart ? (
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M6 18L18 6M6 6l12 12"
                        />
                      ) : (
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                        />
                      )}
                    </svg>

                    <span>{isInCart ? "Remove from Bag" : "Add to Bag"}</span>
                  </motion.button>

                  {/* ── 3. BUY NOW BUTTON ── */}
                  <motion.button
                    variants={buttonVariants}
                    whileHover={{ scale: 1.015 }}
                    whileTap={{ scale: 0.985 }}
                    onClick={handleBuyNow}
                    className="group relative w-full flex items-center justify-center gap-2 rounded-xl bg-linear-to-r from-emerald-500 to-teal-600 px-6 py-4 text-base font-bold text-white tracking-wide shadow-lg shadow-emerald-500/20 dark:shadow-teal-500/10 hover:shadow-xl hover:shadow-emerald-500/40 transition-all duration-300"
                  >
                    <svg
                      className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="2.5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M13 10V3L4 14h7v7l9-11h-7z"
                      />
                    </svg>
                    Buy Now
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

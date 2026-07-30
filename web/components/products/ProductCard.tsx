"use client";

import Image from "next/image";
import Link from "next/link";
import {
  Eye,
  Pencil,
  Trash2,
  ShoppingCart,
  Check,
  FileText,
  Star,
} from "lucide-react";
import { Product } from "@/types/product";
import { categories } from "@/constants/categories";
import { useDeleteProduct } from "@/hooks/product/useDeleteProduct";
import { useCart } from "@/hooks/cart/useCart";
import { useCartStore } from "@/store/cart.store";
import { useAuthStore } from "@/store/auth.store";
import { useAuthModalStore } from "@/store/authModal.store";
import WishlistButton from "./WishlistButton";
import { useState } from "react";
import Modal from "../common/Modal";

interface ProductCardProps {
  product: Product & { status?: "draft" | "published" | string };
  mode: "admin" | "customer";
  view?: "grid" | "list";
  wishlisted: boolean;
}

export default function ProductCard({
  product,
  mode,
  view = "grid",
  wishlisted,
}: ProductCardProps) {
  const imageUrl = product.images?.find(
    (img) =>
      typeof img === "string" && img.trim() !== "" && img.startsWith("http"),
  );
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const deleteProduct = useDeleteProduct();

  const handleDelete = () => {
    deleteProduct.mutate(product._id);
    setIsDeleteModalOpen(false);
  };

  const { addToCart, removeFromCart, isAdding } = useCart();
  const isInCart = useCartStore((s) => s.isInCart(product._id));

  const categoryLabel =
    categories.find((cat) => cat.value === product.category)?.label ||
    product.category;

  // ── PRICE & DISCOUNT CALCULATION ─────────────────────────────────────────
  // A valid discount exists ONLY if discountPrice is a number > 0 AND strictly less than price
  const hasValidDiscount =
    typeof product.discountPrice === "number" &&
    product.discountPrice > 0 &&
    product.discountPrice < product.price;

  const displayPrice = hasValidDiscount
    ? product.discountPrice!
    : product.price;

  const discountPct = hasValidDiscount
    ? Math.round(
        ((product.price - product.discountPrice!) / product.price) * 100,
      )
    : 0;

  const isDraft = product.status === "draft";

  const user = useAuthStore((s) => s.user);
  const openAuthModal = useAuthModalStore((s) => s.openAuthModal);

  function handleAddToCart() {
    if (isInCart || product.stock === 0 || isDraft) return;

    const payload = {
      productId: product._id,
      name: product.name,
      image: imageUrl ?? "",
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

  function handleRemoveToCart() {
    removeFromCart(product._id);
  }

  const handleToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isInCart) {
      handleRemoveToCart();
    } else {
      handleAddToCart();
    }
  };

  const salebadge: boolean = discountPct > 0 && mode !== "admin";

  // ── LIST VIEW ────────────────────────────────────────────────────────────────
  if (view === "list") {
    return (
      <div
        className={`group flex gap-0 overflow-hidden rounded-2xl border bg-white shadow-sm transition-all duration-300 hover:shadow-md dark:bg-slate-900 ${
          isDraft
            ? "border-amber-200 dark:border-amber-900/40"
            : "border-slate-200 dark:border-slate-800"
        }`}
      >
        {/* Image Frame */}
        <div className="relative h-40 w-40 shrink-0 overflow-hidden bg-slate-50 dark:bg-slate-800 sm:h-48 sm:w-48">
          {/* Badges */}
          {isDraft ? (
            <span className="absolute left-2 top-2 z-10 inline-flex items-center gap-1 rounded-full bg-amber-500 px-2.5 py-1 text-[10px] font-bold tracking-wide text-white uppercase shadow">
              <FileText size={10} /> Draft
            </span>
          ) : salebadge ? (
            <span className="absolute left-2 top-2 z-10 rounded-full bg-red-500 px-2.5 py-1 text-[10px] font-bold tracking-wide text-white uppercase shadow">
              SALE
            </span>
          ) : null}

          {/* Wishlist */}
          {mode !== "admin" && !isDraft && (
            <div className="absolute right-2 top-2 z-10">
              <WishlistButton productId={product._id} wishlisted={wishlisted} />
            </div>
          )}
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={product.name}
              fill
              sizes="192px"
              className="object-contain p-5 transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <span className="px-1 text-center text-[8px] font-medium leading-none text-gray-700 dark:text-gray-200">
              {product.name}
            </span>
          )}
        </div>

        {/* Content */}
        <div className="flex flex-1 flex-col justify-between p-4 min-w-0">
          <div className="space-y-1">
            <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-500">
              {categoryLabel}
            </p>
            <h3 className="text-base font-semibold leading-snug text-slate-900 line-clamp-2 dark:text-white">
              {product.name}
            </h3>
            {product.description && (
              <p className="mt-1 line-clamp-2 text-sm text-slate-500 dark:text-slate-400">
                {product.description}
              </p>
            )}

            {/* Stars — customer mode only */}
            {mode !== "admin" && (
              <div className="flex items-center gap-0.5 pt-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    size={13}
                    className="fill-amber-400 text-amber-400"
                  />
                ))}
              </div>
            )}
          </div>

          <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
            {/* Pricing */}
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-bold text-slate-900 dark:text-white">
                ₹{displayPrice.toLocaleString("en-IN")}
              </span>
              {hasValidDiscount && (
                <span className="text-sm text-slate-400 line-through">
                  ₹{product.price.toLocaleString("en-IN")}
                </span>
              )}
              <span
                className={`text-xs font-semibold ${
                  isDraft
                    ? "text-amber-500 dark:text-amber-400"
                    : product.stock > 0
                      ? "text-emerald-600 dark:text-emerald-400"
                      : "text-red-500 dark:text-red-400"
                }`}
              >
                {isDraft
                  ? "Unpublished"
                  : product.stock > 0
                    ? `In Stock (${product.stock})`
                    : "Out of Stock"}
              </span>
            </div>

            {/* Actions */}
            {mode === "admin" ? (
              <div className="flex items-center gap-2">
                <Link
                  href={`/admin/products/${product._id}`}
                  className="flex items-center justify-center rounded-xl border border-slate-200 p-2 text-slate-500 transition hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                >
                  <Eye size={16} />
                </Link>
                <Link
                  href={`/admin/products/edit/${product._id}`}
                  className="flex items-center justify-center rounded-xl border border-slate-200 p-2 text-slate-500 transition hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                >
                  <Pencil size={16} />
                </Link>
                <button
                  className="flex items-center justify-center rounded-xl border border-red-200 p-2 text-red-500 transition hover:bg-red-50 dark:border-red-900 dark:hover:bg-red-950"
                  onClick={() => setIsDeleteModalOpen(true)}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ) : (
              <button
                onClick={handleToggle}
                disabled={product.stock === 0 || isAdding || isDraft}
                className={`flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold shadow-sm transition-all duration-200 active:scale-95 disabled:cursor-not-allowed ${
                  isInCart
                    ? "bg-emerald-500 text-white hover:bg-emerald-600"
                    : product.stock === 0 || isDraft
                      ? "border border-slate-200 bg-slate-100 text-slate-400 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-500"
                      : "bg-slate-900 text-white hover:bg-slate-700 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100"
                }`}
              >
                {isInCart ? (
                  <>
                    <Check size={15} /> In Cart
                  </>
                ) : (
                  <>
                    <ShoppingCart size={15} />
                    {isDraft
                      ? "Unavailable"
                      : product.stock === 0
                        ? "Out of Stock"
                        : "Quick Add to Bag"}
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ── GRID VIEW ────────────────────────────────────────────────────────────────
  return (
    <div
      className={`group flex h-full flex-col justify-between overflow-hidden rounded-2xl border bg-white shadow-sm transition-all duration-300 hover:shadow-xl dark:bg-slate-900 ${
        isDraft
          ? "border-amber-200 dark:border-amber-900/40"
          : "border-slate-200 dark:border-slate-800"
      }`}
    >
      <div>
        {/* ── Image Zone ──────────────────────────────── */}
        <div className="relative aspect-square w-full shrink-0 overflow-hidden bg-slate-50 dark:bg-slate-800">
          {/* Sale / Draft badge — top left */}
          {isDraft ? (
            <span className="absolute left-3 top-3 z-10 inline-flex items-center gap-1 rounded-full bg-amber-500 px-2.5 py-1 text-[10px] font-bold tracking-wide text-white uppercase shadow">
              <FileText size={10} /> Draft
            </span>
          ) : salebadge ? (
            <span className="absolute left-3 top-3 z-10 rounded-xl bg-red-500 px-3 py-1 text-[11px] font-bold tracking-wide text-white uppercase shadow">
              SALE
            </span>
          ) : null}

          {/* Wishlist — top right */}
          {mode !== "admin" && !isDraft && (
            <div className="absolute right-0 top-1 z-10">
              <WishlistButton productId={product._id} wishlisted={wishlisted} />
            </div>
          )}

          {/* Product Image */}
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={product.name}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className="object-contain p-5 transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <span className="px-1 text-center text-[8px] font-medium leading-none text-gray-700 dark:text-gray-200">
              {product.name}
            </span>
          )}

          {/* Bottom gradient + Quick Add overlay (customer, in-stock, not draft) */}
          {mode !== "admin" && product.stock > 0 && !isDraft && (
            <div className="absolute inset-x-0 bottom-0">
              {/* Gradient fade */}
              <div className="h-20 bg-linear-to-t from-black/60 to-transparent" />
              {/* Button slides up on hover */}
              <div className="absolute inset-x-0 bottom-0 translate-y-full pb-3 px-3 transition-transform duration-300 group-hover:translate-y-0">
                <button
                  onClick={handleToggle}
                  disabled={isAdding}
                  className={`flex w-full items-center justify-center gap-2 rounded-full py-2.5 text-sm font-semibold shadow-md transition-colors duration-200 active:scale-95 ${
                    isInCart
                      ? "bg-emerald-500 text-white hover:bg-emerald-600"
                      : "bg-white text-slate-900 hover:bg-slate-100"
                  }`}
                >
                  {isInCart ? (
                    <>
                      <Check size={14} /> In Cart
                    </>
                  ) : (
                    <>
                      <ShoppingCart size={14} /> Quick Add to Bag
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* Admin overlay — always visible action row */}
          {mode === "admin" && (
            <div className="absolute inset-x-0 bottom-0 translate-y-full transition-transform duration-300 group-hover:translate-y-0">
              <div className="flex items-center justify-center gap-2 bg-black/70 px-3 py-3 backdrop-blur-sm">
                <Link
                  href={`/admin/products/${product._id}`}
                  className="flex items-center justify-center rounded-full bg-white/20 p-2 text-white transition hover:bg-white/40"
                >
                  <Eye size={15} />
                </Link>
                <Link
                  href={`/admin/products/edit/${product._id}`}
                  className="flex items-center justify-center rounded-full bg-white/20 p-2 text-white transition hover:bg-white/40"
                >
                  <Pencil size={15} />
                </Link>
                <button
                  className="flex items-center justify-center rounded-full bg-red-500/80 p-2 text-white transition hover:bg-red-600"
                  onClick={() => setIsDeleteModalOpen(true)}
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* ── Info Zone ───────────────────────────────── */}
        <div className="p-4 space-y-2">
          {/* Category + Name */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-500 line-clamp-1">
              {categoryLabel}
            </p>
            <h3 className="mt-0.5 line-clamp-2 text-sm font-semibold leading-snug text-slate-900 dark:text-white">
              {product.name}
            </h3>
          </div>
        </div>
      </div>

      {/* ── Footer Zone (Price & Mobile Actions) ─────── */}
      <div className="p-4 pt-0 space-y-2 mt-auto">
        {/* Price row */}
        <div className="flex items-center justify-between">
          <div className="flex items-baseline gap-1.5">
            <span className="text-base font-bold text-slate-900 dark:text-white">
              ₹{displayPrice.toLocaleString("en-IN")}
            </span>
            {hasValidDiscount && (
              <span className="text-xs text-slate-400 line-through">
                ₹{product.price.toLocaleString("en-IN")}
              </span>
            )}
          </div>
          <span
            className={`text-xs font-semibold ${
              isDraft
                ? "text-amber-500"
                : product.stock > 0
                  ? "text-emerald-600 dark:text-emerald-400"
                  : "text-red-500 dark:text-red-400"
            }`}
          >
            {isDraft
              ? "Draft"
              : product.stock > 0
                ? "In Stock"
                : "Out of Stock"}
          </span>
        </div>

        {/* Customer: fallback Add to Cart button (mobile) */}
        {mode !== "admin" && (
          <button
            onClick={handleToggle}
            disabled={product.stock === 0 || isAdding || isDraft}
            className={`mt-1 flex w-full items-center justify-center gap-2 rounded-full py-2.5 text-sm font-semibold shadow-sm transition-all duration-200 active:scale-95 sm:hidden disabled:cursor-not-allowed ${
              isInCart
                ? "bg-emerald-500 text-white hover:bg-emerald-600"
                : product.stock === 0 || isDraft
                  ? "border border-slate-200 bg-slate-100 text-slate-400 dark:border-slate-700 dark:bg-slate-800"
                  : "bg-slate-900 text-white hover:bg-slate-700 dark:bg-white dark:text-slate-900"
            }`}
          >
            {isInCart ? (
              <>
                <Check size={14} /> In Cart
              </>
            ) : (
              <>
                <ShoppingCart size={14} />
                {isDraft
                  ? "Draft Product"
                  : product.stock === 0
                    ? "Out of Stock"
                    : "Quick Add to Bag"}
              </>
            )}
          </button>
        )}
      </div>

      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDelete}
        title="Delete Product?"
        description="Are you sure you want to delete this Product? This action cannot be undone."
        confirmText="Delete"
      />
    </div>
  );
}

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
  const validImages =
    product.images?.filter(
      (img) =>
        typeof img === "string" && img.trim() !== "" && img.startsWith("http"),
    ).slice(0, 3) || [];
  const imageUrl = validImages[0];

  const [hoverIndex, setHoverIndex] = useState(0);
  const [isHovering, setIsHovering] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (validImages.length <= 1) return;
    const { left, width } = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - left;
    const percent = Math.max(0, Math.min(1, x / width));
    const index = Math.min(Math.floor(percent * validImages.length), validImages.length - 1);
    setHoverIndex(index);
  };
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
        className={`group flex gap-0 overflow-hidden rounded-2xl border bg-background shadow-sm transition-all duration-300 hover:shadow-md hover:border-foreground/20 ${isDraft
          ? "border-amber-500/40"
          : "border-[var(--glass-border)]"
          }`}
      >
        {/* Image Frame */}
        <div
          className="relative h-40 w-40 shrink-0 overflow-hidden bg-secondary/10 sm:h-48 sm:w-48"
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => { setIsHovering(false); setHoverIndex(0); }}
          onMouseMove={handleMouseMove}
        >
          {/* Badges */}
          {isDraft ? (
            <span className="absolute left-2 top-2 z-20 inline-flex items-center gap-1 rounded-full bg-amber-500 px-2.5 py-1 text-[10px] font-bold tracking-wide text-white uppercase shadow">
              <FileText size={10} /> Draft
            </span>
          ) : salebadge ? (
            <span className="absolute left-2 top-2 z-20 rounded-full bg-red-500 px-2.5 py-1 text-[10px] font-bold tracking-wide text-white uppercase shadow">
              SALE
            </span>
          ) : null}

          {/* Wishlist */}
          {mode !== "admin" && !isDraft && (
            <div className="absolute right-2 top-2 z-20">
              <WishlistButton productId={product._id} wishlisted={wishlisted} />
            </div>
          )}
          {validImages.length > 0 ? (
            validImages.map((imgSrc, idx) => (
              <Image
                key={imgSrc}
                src={imgSrc}
                alt={`${product.name} - ${idx}`}
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                className={`object-contain p-3 sm:p-5 transition-all duration-300 group-hover:scale-105 ${(isHovering && hoverIndex === idx) || (!isHovering && idx === 0)
                    ? "opacity-100 z-10"
                    : "opacity-0 z-0"
                  }`}
              />
            ))
          ) : (
            <span className="px-1 text-center text-[8px] font-medium leading-none text-muted-foreground">
              {product.name}
            </span>
          )}
        </div>

        {/* Content */}
        <div className="flex flex-1 flex-col justify-between p-4 min-w-0">
          <div className="space-y-1">
            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground font-heading">
              {categoryLabel}
            </p>
            <h3 className="text-base font-extrabold leading-snug text-foreground line-clamp-2 font-heading">
              {product.name}
            </h3>
            {product.description && (
              <p className="mt-1 line-clamp-2 text-sm font-medium text-secondary">
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
              <span className="text-xl font-extrabold text-foreground font-heading">
                ₹{displayPrice.toLocaleString("en-IN")}
              </span>
              {hasValidDiscount && (
                <span className="text-sm font-medium text-muted-foreground line-through">
                  ₹{product.price.toLocaleString("en-IN")}
                </span>
              )}
              <span
                className={`text-[11px] font-bold uppercase tracking-wide ${isDraft
                  ? "text-amber-500"
                  : product.stock > 0
                    ? "text-emerald-500"
                    : "text-red-500"
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
                  className="flex items-center justify-center rounded-xl border border-[var(--glass-border)] p-2 text-secondary transition hover:bg-secondary/10"
                >
                  <Eye size={16} />
                </Link>
                <Link
                  href={`/admin/products/edit/${product._id}`}
                  className="flex items-center justify-center rounded-xl border border-[var(--glass-border)] p-2 text-secondary transition hover:bg-secondary/10"
                >
                  <Pencil size={16} />
                </Link>
                <button
                  className="flex items-center justify-center rounded-xl border border-red-500/20 p-2 text-red-500 transition hover:bg-red-500/10"
                  onClick={() => setIsDeleteModalOpen(true)}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ) : (
              <button
                onClick={handleToggle}
                disabled={product.stock === 0 || isAdding || isDraft}
                className={`flex items-center gap-2 rounded-full px-6 py-2.5 text-[13px] font-bold shadow-sm transition-all duration-200 active:scale-95 disabled:cursor-not-allowed uppercase tracking-wide ${isInCart
                  ? "bg-emerald-500 text-white hover:bg-emerald-600"
                  : product.stock === 0 || isDraft
                    ? "border border-[var(--glass-border)] bg-secondary/5 text-secondary"
                    : "bg-foreground text-background hover:opacity-90"
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
      className={`group flex h-full flex-col justify-between overflow-hidden rounded-3xl border bg-background shadow-sm transition-all duration-500 hover:shadow-2xl hover:shadow-[var(--accent-mid)]/10 hover:-translate-y-1 relative before:absolute before:inset-0 before:rounded-3xl before:border before:border-transparent hover:before:border-[var(--accent-mid)]/30 before:transition-colors before:pointer-events-none ${isDraft
        ? "border-amber-200 dark:border-amber-900/40"
        : "border-[var(--glass-border)]"
        }`}
    >
      <div>
        {/* ── Image Zone ──────────────────────────────── */}
        <div
          className="relative aspect-[4/5] w-full shrink-0 overflow-hidden bg-secondary/10 rounded-t-3xl"
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => { setIsHovering(false); setHoverIndex(0); }}
          onMouseMove={handleMouseMove}
        >
          {/* Sale / Draft badge — top left */}
          {isDraft ? (
            <span className="absolute left-3 top-3 z-20 inline-flex items-center gap-1 rounded-full bg-amber-500 px-2.5 py-1 text-[10px] font-bold tracking-wide text-white uppercase shadow">
              <FileText size={10} /> Draft
            </span>
          ) : salebadge ? (
            <span className="absolute left-3 top-3 z-20 rounded-xl bg-red-500 px-3 py-1 text-[11px] font-bold tracking-wide text-white uppercase shadow">
              SALE
            </span>
          ) : null}

          {/* Wishlist — top right */}
          {mode !== "admin" && !isDraft && (
            <div className="absolute right-0 top-1 z-20">
              <WishlistButton productId={product._id} wishlisted={wishlisted} />
            </div>
          )}

          {/* Product Image */}
          {validImages.length > 0 ? (
            validImages.map((imgSrc, idx) => (
              <Image
                key={imgSrc}
                src={imgSrc}
                alt={`${product.name} - ${idx}`}
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                className={`object-contain p-5 transition-all duration-300 group-hover:scale-105 absolute inset-0 ${(isHovering && hoverIndex === idx) || (!isHovering && idx === 0)
                    ? "opacity-100 z-10"
                    : "opacity-0 z-0"
                  }`}
              />
            ))
          ) : (
            <span className="px-1 text-center text-[8px] font-medium leading-none text-gray-700 dark:text-gray-200">
              {product.name}
            </span>
          )}

          {/* Bottom gradient + Quick Add overlay (customer, in-stock, not draft) */}
          {mode !== "admin" && product.stock > 0 && !isDraft && (
            <div className="absolute inset-x-0 bottom-0 z-20">
              {/* Gradient fade */}
              <div className="h-32 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
              {/* Button slides up on hover */}
              <div className="absolute inset-x-0 bottom-0 translate-y-full pb-4 px-4 transition-transform duration-300 group-hover:translate-y-0">
                <button
                  onClick={handleToggle}
                  disabled={isAdding}
                  className={`flex w-full items-center justify-center gap-2 rounded-full py-3 text-sm font-bold shadow-lg transition-all duration-300 active:scale-95 ${isInCart
                    ? "bg-emerald-500 text-white hover:bg-emerald-600"
                    : "bg-white/10 backdrop-blur-md text-white border border-white/20 hover:bg-white hover:text-black"
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
            <div className="absolute inset-x-0 bottom-0 z-20 translate-y-full transition-transform duration-300 group-hover:translate-y-0">
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
            <p className="text-xs font-bold uppercase tracking-widest text-muted line-clamp-1 font-heading">
              {categoryLabel}
            </p>
            <h3 className="mt-1 line-clamp-2 text-base font-extrabold leading-snug text-foreground font-heading">
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
            <span className="text-lg font-extrabold text-foreground font-heading">
              ₹{displayPrice.toLocaleString("en-IN")}
            </span>
            {hasValidDiscount && (
              <span className="text-xs text-slate-400 line-through">
                ₹{product.price.toLocaleString("en-IN")}
              </span>
            )}
          </div>
          <span
            className={`text-xs font-semibold ${isDraft
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
            className={`mt-1 flex w-full items-center justify-center gap-2 rounded-full py-2.5 text-sm font-semibold shadow-sm transition-all duration-200 active:scale-95 sm:hidden disabled:cursor-not-allowed ${isInCart
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

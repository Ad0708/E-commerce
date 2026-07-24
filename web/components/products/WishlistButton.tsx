"use client";

import { Heart } from "lucide-react";
import { useWishlist } from "@/hooks/wishlist/useWishlist";

interface WishlistButtonProps {
  productId: string;
  wishlisted: boolean;
  size?: number;
}

export default function WishlistButton({
  productId,
  wishlisted,
  size = 22,
}: WishlistButtonProps) {
  const { addToWishlist, removeFromWishlist, isAdding, isRemoving } =
    useWishlist();

  const handleToggleWishlist = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();

    if (wishlisted) {
      removeFromWishlist(productId);
    } else {
      addToWishlist(productId);
    }
  };
  return (
    <button
      onClick={handleToggleWishlist}
      aria-label="Toggle Wishlist"
      className="absolute right-3 top-3 z-20 rounded-full bg-white/90 p-2 shadow-md transition-all duration-200 hover:scale-110 hover:bg-white"
    >
      <Heart
        size={size}
        className={`transition-colors ${
          wishlisted ? "fill-red-500 text-red-500" : "text-slate-600"
        }`}
      />
    </button>
  );
}

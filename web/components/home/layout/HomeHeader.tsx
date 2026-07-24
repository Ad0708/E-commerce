// components/layout/Header.tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth.store";
import {
  Search,
  ShoppingCart,
  Heart,
  LogOut,
  User,
  Settings,
  Menu,
  X,
  ShoppingBag,
  ChevronDown,
  Wallet,
} from "lucide-react";
import ThemeToggle from "../../common/ThemeToggle";
import { useWishlist } from "@/hooks/wishlist/useWishlist";
import { useWishlistStore } from "@/store/wishlist.store";
import { useCartStore } from "@/store/cart.store";
import NotificationButton from "../../notification/NotificationButton";
import { useStoreBasic } from "@/hooks/store/useStore";
import Loader from "@/components/common/Loader";

const navLinks = [
  { href: "/home", label: "Home" },
  { href: "/products", label: "Products" },
];

interface HeaderProps {
  logo: string;
  storeName: string;
}

export function Header({ logo, storeName }: HeaderProps) {
  const [mobileMenu, setSearch] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { user, clearAuth } = useAuthStore();

  const handleLogout = async () => {
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
    } catch (error) {
      console.error(error);
    } finally {
      clearAuth();
      router.replace("/login");
    }
  };

  const isActive = (href: string) => pathname === href;
  const { wishlist, wishlistLoading: isLoading } = useWishlist();

  const setLoading = useWishlistStore((state) => state.setLoading);

  const setWishlist = useWishlistStore((state) => state.setWishlist);

  useEffect(() => {
    setLoading(isLoading);

    if (wishlist) {
      setWishlist(wishlist);
    }
  }, [wishlist, isLoading, setWishlist, setLoading]);

  const length = wishlist ? Object.keys(wishlist).length : 0;
  
  const itemCount = useCartStore((state) => state.getItemCount());
  // console.log("Item Count:", itemCount);

  return (
    <nav className="sticky top-0 z-50 border-b border-slate-200 bg-white/80 backdrop-blur-lg dark:border-slate-800 dark:bg-slate-900/80">
      <div className="mx-auto flex max-w-350 items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/home" className="flex items-center gap-2">
          {logo ? (
            <img
              src={logo}
              alt={storeName}
              className="h-10 w-10 rounded-full"
            />
          ) : (
            <ShoppingBag className="h-10 w-10 rounded-full" />
          )}
          <span className="text-xl font-bold tracking-wider font-sans select-none">
            {storeName.includes(" ") ? (
              <>
                <span className="text-sky-500 dark:text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.4)]">
                  {storeName.split(" ")[0]}
                </span>
                <span className="text-slate-900 dark:text-slate-50 ml-1">
                  {storeName.split(" ").slice(1).join(" ")}
                </span>
              </>
            ) : (
              // Fallback if there is no space
              <span className="text-sky-500 dark:text-cyan-400">
                {storeName}
              </span>
            )}
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="relative px-4 py-2 text-sm font-medium transition-colors"
            >
              <span
                className={
                  isActive(link.href)
                    ? "text-blue-600"
                    : "text-slate-500 hover:text-blue-600"
                }
              >
                {link.label}
              </span>
              {/* Active Indicator */}
              <span
                className={`absolute bottom-0 left-4 right-4 h-0.5 bg-blue-600 transition-all duration-300 origin-left ${
                  isActive(link.href) ? "scale-x-100" : "scale-x-0"
                }`}
              />
            </Link>
          ))}
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-2">
          <div>
            <ThemeToggle />
          </div>
          <div>
            <NotificationButton />
          </div>

          {/* Cart Button */}
          <button
            onClick={() => router.push("/cart")}
            className="relative rounded-xl p-2.5 text-slate-500 hover:bg-slate-100 hover:text-blue-600 transition-all"
            title="Cart"
          >
            <ShoppingCart className="h-5 w-5" />
            {/* Cart Badge - Update count from your cart store */}
            <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-blue-600 text-[10px] font-bold text-white">
              {itemCount}
            </span>
          </button>

          {/* Wishlist Button */}
          <button
            onClick={() => router.push("/wishlist")}
            className="relative rounded-xl p-2.5 text-slate-500 hover:bg-slate-100 hover:text-red-500 transition-all"
            title="Wishlist"
          >
            <Heart className="h-5 w-5" />
            <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
              {length}
            </span>
          </button>

          {/* User Dropdown */}
          <div
            className="relative"
            onMouseEnter={() => setUserMenuOpen(true)}
            onMouseLeave={() => setUserMenuOpen(false)}
          >
            <button className="flex items-center gap-2 rounded-xl p-1.5 hover:bg-slate-100 transition-all">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white">
                {user?.name?.[0]?.toUpperCase()}
              </div>
              <ChevronDown
                className={`hidden h-4 w-4 text-slate-400 transition-transform sm:block ${
                  userMenuOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {/* Dropdown Menu */}
            <div
              className={`absolute right-0 top-full mt-2 w-56 rounded-xl border border-slate-200 bg-white py-2 shadow-lg transition-all duration-200 origin-top-right dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400 ${
                userMenuOpen
                  ? "scale-100 opacity-100 visible"
                  : "scale-95 opacity-0 invisible"
              }`}
            >
              {/* User Info */}
              <div className="border-b border-slate-100 px-4 py-3 dark:border-slate-700 dark:text-slate-200">
                <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                  {user?.name}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {user?.email}
                </p>
              </div>

              {/* Menu Items */}
              <div className="py-1">
                <Link
                  href="/profile"
                  className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 hover:text-blue-600 transition-colors dark:text-slate-200 dark:hover:bg-slate-700"
                >
                  <User className="h-4 w-4" />
                  Profile
                </Link>
                <Link
                  href="/wallet"
                  className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 hover:text-blue-600 transition-colors dark:text-slate-200 dark:hover:bg-slate-700"
                >
                  <Wallet className="h-4 w-4" />
                  Wallet
                </Link>
                <Link
                  href="/orders"
                  className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 hover:text-blue-600 transition-colors dark:text-slate-200 dark:hover:bg-slate-700"
                >
                  <ShoppingBag className="h-4 w-4" />
                  Orders
                </Link>
                <Link
                  href="/settings"
                  className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 hover:text-blue-600 transition-colors dark:text-slate-200 dark:hover:bg-slate-700"
                >
                  <Settings className="h-4 w-4" />
                  Settings
                </Link>
              </div>

              {/* Logout */}
              <div className="border-t border-slate-100 py-1">
                <button
                  onClick={handleLogout}
                  className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </button>
              </div>
            </div>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setSearch(!mobileMenu)}
            className="rounded-xl p-2.5 text-slate-500 hover:bg-slate-100 md:hidden"
          >
            {mobileMenu ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`overflow-hidden border-t border-slate-200 bg-white transition-all duration-300 md:hidden dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400 ${
          mobileMenu ? "max-h-96" : "max-h-0"
        }`}
      >
        <div className="px-4 py-4">
          {/* Mobile Nav Links */}
          <div className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setSearch(false)}
                className={`rounded-xl px-4 py-3 text-sm font-medium transition-all ${
                  isActive(link.href)
                    ? "bg-blue-50 text-blue-600"
                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}

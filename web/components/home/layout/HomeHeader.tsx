// components/layout/Header.tsx
"use client";

import { useWishlist } from "@/hooks/wishlist/useWishlist";
import { useAuthStore } from "@/store/auth.store";
import { useCartStore } from "@/store/cart.store";
import { useWishlistStore } from "@/store/wishlist.store";
import {
  ChevronDown,
  Heart,
  LogOut,
  Menu,
  Settings,
  ShoppingBag,
  ShoppingCart,
  User,
  Wallet,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import ThemeToggle from "../../common/ThemeToggle";
import NotificationButton from "../../notification/NotificationButton";
import { useLogout } from "@/hooks/auth/uselogout";

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
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { user, clearAuth } = useAuthStore();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const { mutate: logout } = useLogout();

  const handleLogout = () => {
    logout(undefined, {
      onSuccess: () => {
        router.replace("/login");
        router.refresh();
      },
    });
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

  const isHome = pathname === "/home";

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled || !isHome
          ? "border-b border-slate-200/50 bg-white/80 backdrop-blur-xl dark:border-slate-800/50 dark:bg-slate-950/80 shadow-sm"
          : "border-transparent bg-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-370 items-center justify-between px-4 py-5 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/home" className="flex items-center gap-3 group">
          {logo ? (
            <img
              src={logo}
              alt={storeName}
              className="h-10 w-10 rounded-full transition-transform group-hover:scale-105"
            />
          ) : (
            <div
              className={`flex h-10 w-10 items-center justify-center rounded-full transition-colors ${
                isScrolled || !isHome
                  ? "bg-black text-white dark:bg-white dark:text-black"
                  : "bg-white text-black"
              }`}
            >
              <ShoppingBag className="h-5 w-5" />
            </div>
          )}
          <span
            className={`text-xl font-bold tracking-widest font-sans uppercase ${
              isScrolled || !isHome
                ? "text-slate-900 dark:text-white"
                : "text-white drop-shadow-md"
            }`}
          >
            {storeName}
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="group relative py-2 text-sm font-semibold tracking-wide uppercase transition-colors"
            >
              <span
                className={`${
                  isActive(link.href)
                    ? isScrolled || !isHome
                      ? "text-slate-900 dark:text-white"
                      : "text-white"
                    : isScrolled || !isHome
                      ? "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                      : "text-white/70 hover:text-white"
                }`}
              >
                {link.label}
              </span>
              <span
                className={`absolute bottom-0 left-0 right-0 h-0.5 transition-transform duration-300 origin-left ${
                  isScrolled || !isHome
                    ? "bg-slate-900 dark:bg-white"
                    : "bg-white"
                } ${
                  isActive(link.href)
                    ? "scale-x-100"
                    : "scale-x-0 group-hover:scale-x-100"
                }`}
              />
            </Link>
          ))}
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-4">
          <div
            className={
              !isScrolled && isHome
                ? "opacity-0 pointer-events-none w-0 overflow-hidden transition-all"
                : "transition-all"
            }
          >
            <ThemeToggle />
          </div>
          <div className={!isScrolled && isHome ? "text-white" : ""}>
            <NotificationButton />
          </div>

          {/* Cart Button */}
          <button
            onClick={() => router.push("/cart")}
            className={`relative rounded-full p-2.5 transition-all hover:scale-110 active:scale-95 ${
              isScrolled || !isHome
                ? "text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                : "text-white hover:bg-white/20"
            }`}
            title="Cart"
          >
            <ShoppingCart className="h-5 w-5" />
            <span className="absolute 0 top-0 flex h-4 w-4 items-center justify-center rounded-full bg-blue-600 text-[10px] font-bold text-white shadow-sm ring-2 ring-white dark:ring-slate-950">
              {itemCount}
            </span>
          </button>

          {/* Wishlist Button */}
          <button
            onClick={() => router.push("/wishlist")}
            className={`relative rounded-full p-2.5 transition-all hover:scale-110 active:scale-95 ${
              isScrolled || !isHome
                ? "text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                : "text-white hover:bg-white/20"
            }`}
            title="Wishlist"
          >
            <Heart className="h-5 w-5" />
            <span className="absolute 0 top-0 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white shadow-sm ring-2 ring-white dark:ring-slate-950">
              {length}
            </span>
          </button>

          {/* User Dropdown */}
          <div
            className="relative"
            onMouseEnter={() => setUserMenuOpen(true)}
            onMouseLeave={() => setUserMenuOpen(false)}
          >
            <button
              className={`flex items-center gap-2 rounded-full p-1 transition-all ${
                isScrolled || !isHome
                  ? "hover:bg-slate-100 dark:hover:bg-slate-800"
                  : "hover:bg-white/20"
              }`}
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-900 text-sm font-bold text-white dark:bg-white dark:text-slate-900">
                {user?.name?.[0]?.toUpperCase()}
              </div>
              <ChevronDown
                className={`hidden h-4 w-4 transition-transform sm:block ${
                  isScrolled || !isHome ? "text-slate-500" : "text-white"
                } ${userMenuOpen ? "rotate-180" : ""}`}
              />
            </button>

            {/* Dropdown Menu */}
            <div
              className={`absolute right-0 top-full mt-2 w-64 rounded-2xl border border-slate-200 bg-white/90 backdrop-blur-xl py-2 shadow-2xl transition-all duration-200 origin-top-right dark:border-slate-800/80 dark:bg-slate-900/90 ${
                userMenuOpen
                  ? "scale-100 opacity-100 visible translate-y-0"
                  : "scale-95 opacity-0 invisible -translate-y-2"
              }`}
            >
              {/* User Info */}
              <div className="border-b border-slate-100/50 px-5 py-4 dark:border-slate-800">
                <p className="text-sm font-bold text-slate-900 dark:text-white truncate">
                  {user?.name}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5">
                  {user?.email}
                </p>
              </div>

              {/* Menu Items */}
              <div className="py-2 px-2">
                <Link
                  href="/profile"
                  className="flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition-colors dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
                >
                  <User className="h-4 w-4" />
                  Profile
                </Link>
                <Link
                  href="/wallet"
                  className="flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition-colors dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
                >
                  <Wallet className="h-4 w-4" />
                  Wallet
                </Link>
                <Link
                  href="/orders"
                  className="flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition-colors dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
                >
                  <ShoppingBag className="h-4 w-4" />
                  Orders
                </Link>
                <Link
                  href="/settings"
                  className="flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition-colors dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
                >
                  <Settings className="h-4 w-4" />
                  Settings
                </Link>
              </div>

              {/* Logout */}
              <div className="border-t border-slate-100/50 px-2 py-2 dark:border-slate-800">
                <button
                  onClick={handleLogout}
                  className="flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors dark:hover:bg-red-500/10"
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
            className={`rounded-full p-2.5 md:hidden transition-colors ${
              isScrolled || !isHome
                ? "text-slate-900 dark:text-white"
                : "text-white"
            }`}
          >
            {mobileMenu ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`overflow-hidden border-t border-slate-200/50 bg-white/95 backdrop-blur-xl transition-all duration-300 md:hidden dark:border-slate-800/50 dark:bg-slate-950/95 ${
          mobileMenu ? "max-h-96" : "max-h-0 border-transparent"
        }`}
      >
        <div className="px-4 py-4">
          <div className="flex flex-col gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setSearch(false)}
                className={`rounded-xl px-4 py-3 text-sm font-bold tracking-wide uppercase transition-all ${
                  isActive(link.href)
                    ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900"
                    : "text-slate-500 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white"
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

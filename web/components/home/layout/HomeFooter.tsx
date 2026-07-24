"use client";

import Link from "next/link";
import Image from "next/image";
import { Mail, Phone, MapPin, RefreshCw, ArrowUpRight } from "lucide-react";

import {
  useStoreAddress,
  useStoreBusiness,
  useStoreContact,
  useStoreReturns,
  useStoreSocialLinks,
} from "@/hooks/store/useStore";

interface StoreFooterProps {
  storeName: string;
  logo: string;
}

export default function StoreFooter({ storeName, logo }: StoreFooterProps) {
  const { data: contact, isError: contactError } = useStoreContact();
  const { data: address, isError: addressError } = useStoreAddress();
  const { data: socialLinks, isError: socialError } = useStoreSocialLinks();
  const { data: business, isError: businessError } = useStoreBusiness();
  const { data: returns, isError: returnsError } = useStoreReturns();

  const email = contact?.email || business?.supportEmail;
  const phone = contact?.phone || business?.supportPhone;
  const whatsappNumber = contact?.whatsapp;

  const getWhatsAppUrl = (rawPhone: string) => {
    const cleanNumber = rawPhone.replace(/\D/g, "");
    return `https://wa.me/${cleanNumber}`;
  };

  const addressParts = address
    ? [
        address.street,
        address.city,
        address.state,
        address.country,
        address.pincode,
      ].filter(Boolean)
    : [];

  const discoverLinks = [
    { label: "Home", href: "/" },
    { label: "Shop Products", href: "/products" },
    { label: "Categories", href: "/products" },
    // { label: "Categories", href: "/categories" },
    { label: "New Arrivals", href: "products?filter=new-arrivals" },
    { label: "Best Sellers", href: "products?filter=best-sellers" },
  ];

  const supportLinks = [
    { label: "My Account", href: "/profile" },
    { label: "My Orders", href: "/orders" },
    { label: "Wishlist", href: "/wishlist" },
    { label: "Cart", href: "/cart" },
    { label: "Contact Us", href: "/home" },
  ];

  const legalLinks = [
    { label: "Shipping Policy", href: "/home" },
    { label: "Returns & Replacements", href: "/home" },
    { label: "Privacy Policy", href: "/home" },
    { label: "Terms & Conditions", href: "/home" },
    { label: "Refund Policy", href: "/home" },
    // { label: "Shipping Policy", href: "/policies/shipping" },
    // { label: "Returns & Replacements", href: "/policies/returns" },
    // { label: "Privacy Policy", href: "/policies/privacy" },
    // { label: "Terms & Conditions", href: "/policies/terms" },
    // { label: "Refund Policy", href: "/policies/refund" },
  ];

  return (
    <footer className="w-full bg-slate-50 dark:bg-slate-950 text-slate-600 dark:text-slate-400 border-t border-slate-200/80 dark:border-slate-800/80 mt-auto transition-colors duration-300">
      <div className="max-w-350 mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8">
          {/* Brand & Guarantees (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            <Link href="/" className="inline-flex items-center gap-3 group">
              {logo && (
                <div className="relative w-9 h-9 rounded-xl overflow-hidden bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-1 shadow-sm transition-all duration-300 group-hover:scale-105 group-hover:border-slate-300 dark:group-hover:border-slate-700">
                  <Image
                    src={logo}
                    alt={`${storeName} logo`}
                    fill
                    sizes="36px"
                    className="object-contain p-0.5"
                    priority
                  />
                </div>
              )}
              <span className="font-extrabold text-xl tracking-tight text-slate-900 dark:text-white group-hover:text-slate-700 dark:group-hover:text-slate-200 transition-colors">
                {storeName}
              </span>
            </Link>

            {business?.businessName && (
              <p className="text-xs font-mono tracking-wider text-slate-400 dark:text-slate-500 uppercase">
                © {business.businessName} Entity
              </p>
            )}

            {/* Policy Badge Card */}
            {!returnsError &&
              returns &&
              (returns.returnDays > 0 || returns.replacementDays > 0) && (
                <div className="rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800/80 p-4 shadow-sm space-y-2.5 max-w-sm">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200 font-mono">
                    <RefreshCw className="h-3.5 w-3.5 text-slate-500 animate-[spin_6s_linear_infinite]" />
                    <span>Store Guarantees</span>
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 space-y-1.5 font-medium">
                    {returns.returnDays > 0 && (
                      <p className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                        Hassle-free returns up to {returns.returnDays} days
                      </p>
                    )}
                    {returns.replacementDays > 0 && (
                      <p className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                        Direct replacements within {returns.replacementDays}{" "}
                        days
                      </p>
                    )}
                  </div>
                </div>
              )}
          </div>

          {/* Quick Navigation Links (5 cols) */}
          <div className="lg:col-span-5 grid grid-cols-2 sm:grid-cols-3 gap-6">
            {/* Discover */}
            <div className="space-y-3">
              <h3 className="font-bold text-xs text-slate-900 dark:text-slate-100 uppercase tracking-widest font-mono">
                Discover
              </h3>
              <ul className="space-y-2.5 text-sm font-medium">
                {discoverLinks.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="hover:text-slate-900 dark:hover:text-slate-100 transition-colors inline-flex items-center group text-xs sm:text-sm"
                    >
                      <span>{link.label}</span>
                      <ArrowUpRight className="h-3 w-3 ml-0.5 opacity-0 -translate-y-0.5 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-200 text-slate-400" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Support */}
            <div className="space-y-3">
              <h3 className="font-bold text-xs text-slate-900 dark:text-slate-100 uppercase tracking-widest font-mono">
                Support
              </h3>
              <ul className="space-y-2.5 text-sm font-medium">
                {supportLinks.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="hover:text-slate-900 dark:hover:text-slate-100 transition-colors inline-flex items-center group text-xs sm:text-sm"
                    >
                      <span>{link.label}</span>
                      <ArrowUpRight className="h-3 w-3 ml-0.5 opacity-0 -translate-y-0.5 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-200 text-slate-400" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Legal */}
            <div className="space-y-3 col-span-2 sm:col-span-1">
              <h3 className="font-bold text-xs text-slate-900 dark:text-slate-100 uppercase tracking-widest font-mono">
                Legal
              </h3>
              <ul className="space-y-2.5 text-sm font-medium">
                {legalLinks.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="hover:text-slate-900 dark:hover:text-slate-100 transition-colors text-xs sm:text-sm"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Contact & Social (3 cols) */}
          <div className="lg:col-span-3 space-y-4">
            <h3 className="font-bold text-xs text-slate-900 dark:text-slate-100 uppercase tracking-widest font-mono">
              Get In Touch
            </h3>

            <div className="space-y-3 text-xs sm:text-sm font-medium">
              {!contactError && !businessError && email && (
                <div className="flex items-center space-x-2.5 group">
                  <Mail className="h-4 w-4 text-slate-400 dark:text-slate-500 shrink-0 transition-colors group-hover:text-slate-900 dark:group-hover:text-slate-100" />
                  <a
                    href={`mailto:${email}`}
                    className="break-all text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100 transition-colors"
                  >
                    {email}
                  </a>
                </div>
              )}

              {!contactError && !businessError && phone && (
                <div className="flex items-center space-x-2.5 group">
                  <Phone className="h-4 w-4 text-slate-400 dark:text-slate-500 shrink-0 transition-colors group-hover:text-slate-900 dark:group-hover:text-slate-100" />
                  <a
                    href={`tel:${phone}`}
                    className="text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100 transition-colors"
                  >
                    {phone}
                  </a>
                </div>
              )}

              {!contactError && whatsappNumber && (
                <div className="pt-1">
                  <a
                    href={getWhatsAppUrl(whatsappNumber)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500 hover:text-white dark:hover:bg-emerald-500 dark:hover:text-slate-950 transition-all duration-200"
                  >
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span>Live WhatsApp Support</span>
                  </a>
                </div>
              )}

              {!addressError && addressParts.length > 0 && (
                <div className="flex items-start space-x-2.5 pt-2 border-t border-slate-200/80 dark:border-slate-800/80">
                  <MapPin className="h-4 w-4 text-slate-400 dark:text-slate-500 mt-0.5 shrink-0" />
                  <address className="not-italic leading-relaxed text-xs text-slate-500 dark:text-slate-400">
                    {addressParts.join(", ")}
                  </address>
                </div>
              )}
            </div>

            {/* Social Icons */}
            {!socialError &&
              socialLinks &&
              Object.values(socialLinks).some(Boolean) && (
                <div className="flex items-center gap-2 pt-2">
                  {socialLinks.facebook && (
                    <a
                      href={socialLinks.facebook}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-lg bg-white dark:bg-slate-900 text-slate-400 border border-slate-200/80 dark:border-slate-800/80 hover:text-slate-900 dark:hover:text-slate-100 hover:border-slate-300 dark:hover:border-slate-700 hover:-translate-y-0.5 transition-all shadow-sm"
                      aria-label="Facebook"
                    >
                      <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                        <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                      </svg>
                    </a>
                  )}
                  {socialLinks.instagram && (
                    <a
                      href={socialLinks.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-lg bg-white dark:bg-slate-900 text-slate-400 border border-slate-200/80 dark:border-slate-800/80 hover:text-slate-900 dark:hover:text-slate-100 hover:border-slate-300 dark:hover:border-slate-700 hover:-translate-y-0.5 transition-all shadow-sm"
                      aria-label="Instagram"
                    >
                      <svg
                        className="h-4 w-4"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <rect
                          width="20"
                          height="20"
                          x="2"
                          y="2"
                          rx="5"
                          ry="5"
                        />
                        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                        <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                      </svg>
                    </a>
                  )}
                  {socialLinks.twitter && (
                    <a
                      href={socialLinks.twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-lg bg-white dark:bg-slate-900 text-slate-400 border border-slate-200/80 dark:border-slate-800/80 hover:text-slate-900 dark:hover:text-slate-100 hover:border-slate-300 dark:hover:border-slate-700 hover:-translate-y-0.5 transition-all shadow-sm"
                      aria-label="Twitter"
                    >
                      <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                      </svg>
                    </a>
                  )}
                  {socialLinks.linkedin && (
                    <a
                      href={socialLinks.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-lg bg-white dark:bg-slate-900 text-slate-400 border border-slate-200/80 dark:border-slate-800/80 hover:text-slate-900 dark:hover:text-slate-100 hover:border-slate-300 dark:hover:border-slate-700 hover:-translate-y-0.5 transition-all shadow-sm"
                      aria-label="LinkedIn"
                    >
                      <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                      </svg>
                    </a>
                  )}
                  {socialLinks.youtube && (
                    <a
                      href={socialLinks.youtube}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-lg bg-white dark:bg-slate-900 text-slate-400 border border-slate-200/80 dark:border-slate-800/80 hover:text-slate-900 dark:hover:text-slate-100 hover:border-slate-300 dark:hover:border-slate-700 hover:-translate-y-0.5 transition-all shadow-sm"
                      aria-label="YouTube"
                    >
                      <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                      </svg>
                    </a>
                  )}
                </div>
              )}
          </div>
        </div>
      </div>

      {/* Sub-Footer Bar */}
      <div className="w-full border-t border-slate-200/80 dark:border-slate-800/80 bg-slate-100/60 dark:bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-medium text-slate-500 dark:text-slate-400">
          <div>
            © {new Date().getFullYear()}{" "}
            <span className="text-slate-800 dark:text-slate-200 font-semibold">
              {storeName}
            </span>
            . All rights reserved.
          </div>
          <div className="flex items-center space-x-5">
            <Link
              href="/policies/privacy"
              className="hover:text-slate-900 dark:hover:text-slate-100 transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              href="/policies/terms"
              className="hover:text-slate-900 dark:hover:text-slate-100 transition-colors"
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

import {
  useStoreAddress,
  useStoreBusiness,
  useStoreContact,
  useStoreSocialLinks,
} from "@/hooks/store/useStore";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";

interface StoreFooterProps {
  storeName: string;
  logo: string;
}

export default function StoreFooter({ storeName }: StoreFooterProps) {
  const { data: contact } = useStoreContact();
  const { data: address } = useStoreAddress();
  const { data: socialLinks } = useStoreSocialLinks();
  const { data: business } = useStoreBusiness();

  const email = contact?.email || business?.supportEmail;
  const phone = contact?.phone || business?.supportPhone;

  const discoverLinks = [
    { label: "Home", href: "/home" },
    { label: "Shop Products", href: "/products" },
    { label: "New Arrivals", href: "/products?filter=new-arrivals" },
  ];

  const supportLinks = [
    { label: "My Account", href: "/profile" },
    { label: "Wishlist", href: "/wishlist" },
    { label: "Cart", href: "/cart" },
  ];

  return (
    <footer className="w-full bg-slate-100 dark:bg-zinc-900 text-foreground pt-16 pb-8 mt-auto border-t border-[var(--glass-border)]">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">

        <div className="flex flex-col lg:flex-row justify-between gap-10 lg:gap-16 pt-8 border-t border-[var(--glass-border)]">
          {/* Left Side: Brand Name & Description */}
          <div className="lg:w-[35%] flex flex-col">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight font-heading text-foreground">
              {storeName}<span className="text-[var(--accent-mid)]">.</span>
            </h2>
            <p className="mt-4 text-secondary max-w-sm">
              A curated selection of extraordinary pieces, designed to elevate your everyday. Shop smarter, live better.
            </p>
            {address?.city && (
              <p className="text-sm text-secondary mt-2">
                {address.city}, {address.country}
              </p>
            )}

            {/* Social Links */}
            {socialLinks && (
              <div className="flex flex-wrap gap-4 mt-6">
                {Object.entries(socialLinks).map(([platform, url]) => {
                  if (
                    typeof url === "string" &&
                    url.length > 0 &&
                    platform !== "_id" &&
                    platform !== "__v"
                  ) {
                    return (
                      <a
                        key={platform}
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs font-bold uppercase tracking-wider text-muted hover:text-foreground transition-colors"
                      >
                        {platform}
                      </a>
                    );
                  }
                  return null;
                })}
              </div>
            )}
          </div>

          {/* Right Side: Links & Contact Grid (65% width) */}
          <div className="lg:w-[65%] grid grid-cols-2 sm:grid-cols-3 gap-8 lg:gap-12 lg:pl-10">
            {/* Discover Links */}
            <div>
              <h3 className="font-semibold text-xs uppercase tracking-widest text-muted mb-4">
                Discover
              </h3>
              <ul className="space-y-2.5">
                {discoverLinks.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm font-medium text-secondary hover:text-foreground inline-flex items-center group transition-colors"
                    >
                      {link.label}
                      <ArrowUpRight className="w-3.5 h-3.5 ml-0.5 opacity-0 group-hover:opacity-100 transition-opacity text-[var(--accent-mid)]" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Support Links */}
            <div>
              <h3 className="font-semibold text-xs uppercase tracking-widest text-muted mb-4">
                Support
              </h3>
              <ul className="space-y-2.5">
                {supportLinks.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm font-medium text-secondary hover:text-foreground inline-flex items-center group transition-colors"
                    >
                      {link.label}
                      <ArrowUpRight className="w-3.5 h-3.5 ml-0.5 opacity-0 group-hover:opacity-100 transition-opacity text-[var(--accent-mid)]" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact Details */}
            <div className="col-span-2 sm:col-span-1">
              <h3 className="font-semibold text-xs uppercase tracking-widest text-muted mb-4">
                Contact
              </h3>
              <div className="space-y-2">
                {email && (
                  <a
                    href={`mailto:${email}`}
                    className="block text-sm text-secondary hover:text-foreground transition-colors truncate"
                  >
                    {email}
                  </a>
                )}
                {phone && (
                  <a
                    href={`tel:${phone}`}
                    className="block text-sm text-secondary hover:text-foreground transition-colors"
                  >
                    {phone}
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-6 border-t border-[var(--glass-border)] flex flex-col sm:flex-row justify-between items-center gap-3 text-[11px] text-muted uppercase tracking-wider">
          <p>
            © {new Date().getFullYear()} {storeName}. All rights reserved.
          </p>
          <div className="flex gap-4">
            <Link
              href="/privacy"
              className="hover:text-foreground transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms"
              className="hover:text-foreground transition-colors"
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

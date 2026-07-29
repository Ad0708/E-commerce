"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import {
  useStoreAddress,
  useStoreBusiness,
  useStoreContact,
  useStoreSocialLinks,
} from "@/hooks/store/useStore";

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
    { label: "Home", href: "/" },
    { label: "Shop Products", href: "/products" },
    { label: "New Arrivals", href: "/products?filter=new-arrivals" },
  ];

  const supportLinks = [
    { label: "My Account", href: "/profile" },
    { label: "Wishlist", href: "/wishlist" },
    { label: "Cart", href: "/cart" },
  ];

  return (
    <footer className="w-full bg-slate-950 text-white pt-24 pb-12 mt-auto">
      <div className="max-w-360 mx-auto px-6 lg:px-8">
        
        {/* Top Huge Type */}
        <div className="mb-20">
            <h2 className="text-5xl md:text-7xl lg:text-9xl font-extrabold tracking-tighter uppercase text-white/90">
                {storeName}
            </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 border-t border-white/10 pt-16">
          {/* Quick Links */}
          <div>
            <h3 className="font-bold text-sm uppercase tracking-widest text-slate-500 mb-6">Discover</h3>
            <ul className="space-y-4">
              {discoverLinks.map(link => (
                <li key={link.label}>
                  <Link href={link.href} className="text-lg font-medium text-slate-300 hover:text-white flex items-center group">
                    {link.label}
                    <ArrowUpRight className="w-4 h-4 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-sm uppercase tracking-widest text-slate-500 mb-6">Support</h3>
            <ul className="space-y-4">
              {supportLinks.map(link => (
                <li key={link.label}>
                  <Link href={link.href} className="text-lg font-medium text-slate-300 hover:text-white flex items-center group">
                    {link.label}
                    <ArrowUpRight className="w-4 h-4 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="md:col-span-2">
            <h3 className="font-bold text-sm uppercase tracking-widest text-slate-500 mb-6">Contact</h3>
            <div className="space-y-4">
              {email && (
                <a href={`mailto:${email}`} className="block text-2xl font-light hover:text-slate-300 transition-colors">
                  {email}
                </a>
              )}
              {phone && (
                <a href={`tel:${phone}`} className="block text-2xl font-light hover:text-slate-300 transition-colors">
                  {phone}
                </a>
              )}
              {address?.city && (
                <p className="text-slate-400 mt-4">
                  {address.city}, {address.country}
                </p>
              )}
            </div>
            
            {/* Socials */}
            {socialLinks && (
                <div className="flex gap-6 mt-8">
                    {Object.entries(socialLinks).map(([platform, url]) => {
                        if(typeof url === 'string' && url.length > 0 && platform !== '_id' && platform !== '__v') {
                            return (
                                <a key={platform} href={url} target="_blank" rel="noopener noreferrer" className="text-sm font-bold uppercase tracking-wider hover:text-slate-300">
                                    {platform}
                                </a>
                            )
                        }
                        return null;
                    })}
                </div>
            )}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-24 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-600 uppercase tracking-widest">
            <p>© {new Date().getFullYear()} {storeName}</p>
            <div className="flex gap-6">
                <Link href="/privacy" className="hover:text-slate-400">Privacy</Link>
                <Link href="/terms" className="hover:text-slate-400">Terms</Link>
            </div>
        </div>
      </div>
    </footer>
  );
}

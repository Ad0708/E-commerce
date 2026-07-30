"use client";

import { useAuthModalStore } from "@/store/authModal.store";
import { AnimatePresence, motion } from "framer-motion";
import { LogIn, ShoppingBag, X } from "lucide-react";
import { useRouter } from "next/navigation";

export default function AuthModal() {
  const { isOpen, title, description, closeAuthModal } = useAuthModalStore();
  const router = useRouter();

  if (!isOpen) return null;

  const handleLoginRedirect = () => {
    closeAuthModal();
    router.push("/login");
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={closeAuthModal}
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-md transition-opacity"
        />

        {/* Modal content */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="relative w-full max-w-md overflow-hidden rounded-3xl border border-slate-200/80 bg-white/95 p-6 sm:p-8 shadow-2xl backdrop-blur-xl dark:border-slate-800/80 dark:bg-slate-900/95"
        >
          {/* Close button */}
          <button
            onClick={closeAuthModal}
            className="absolute right-4 top-4 rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors dark:hover:bg-slate-800 dark:hover:text-slate-300"
          >
            <X className="h-5 w-5" />
          </button>

          <div className="flex flex-col items-center text-center">
            {/* Animated Icon */}
            <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/30">
              <ShoppingBag className="h-8 w-8" />
            </div>

            {/* Title & Description */}
            <h3 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              {title}
            </h3>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              {description}
            </p>

            {/* Action buttons */}
            <div className="mt-8 flex w-full flex-col gap-3">
              <button
                onClick={handleLoginRedirect}
                className="group flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 py-3.5 text-sm font-semibold text-white shadow-md transition-all hover:bg-slate-800 active:scale-[0.98] dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100"
              >
                <LogIn className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                Log In / Register
              </button>

              <button
                onClick={closeAuthModal}
                className="w-full rounded-xl border border-slate-200 py-3 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 dark:border-slate-800 dark:text-slate-400 dark:hover:bg-slate-800"
              >
                Continue Browsing
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

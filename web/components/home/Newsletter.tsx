"use client";

import { motion } from "framer-motion";
import { Send } from "lucide-react";

export default function Newsletter() {
  return (
    <section className="relative overflow-hidden bg-white py-24 dark:bg-slate-950 sm:py-32">
      <div className="absolute inset-0 bg-slate-50 dark:bg-slate-900/50" />
      
      <div className="relative mx-auto max-w-370 px-6 lg:px-8">
        <motion.div
          className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-2 lg:items-center"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
              Stay in the loop.
            </h2>
            <p className="mt-4 text-lg leading-8 text-slate-600 dark:text-slate-300">
              Subscribe to our newsletter for exclusive drops, early access to sales, and curated inspiration delivered straight to your inbox.
            </p>
          </div>
          
          <div className="flex w-full items-center justify-end lg:w-auto">
            <form className="w-full max-w-md">
              <div className="flex gap-x-4 relative group">
                <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-blue-600 to-cyan-400 opacity-25 blur transition duration-500 group-hover:opacity-50"></div>
                <div className="relative flex w-full">
                    <label htmlFor="email-address" className="sr-only">
                    Email address
                    </label>
                    <input
                    id="email-address"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    className="min-w-0 flex-auto rounded-l-full border-0 bg-white/5 px-6 py-4 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-inset focus:ring-blue-500 dark:text-white dark:ring-white/10 dark:focus:ring-blue-400 sm:text-sm sm:leading-6 backdrop-blur-md transition-all"
                    placeholder="Enter your email"
                    />
                    <button
                    type="submit"
                    className="flex-none rounded-r-full bg-slate-900 px-8 py-4 text-sm font-semibold text-white shadow-sm hover:bg-slate-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200 transition-all active:scale-95 flex items-center gap-2 group/btn"
                    >
                    Subscribe
                    <Send className="h-4 w-4 transition-transform group-hover/btn:-translate-y-1 group-hover/btn:translate-x-1" />
                    </button>
                </div>
              </div>
              <p className="mt-4 text-sm leading-6 text-slate-500 dark:text-slate-400">
                We care about your data. Read our{" "}
                <a href="#" className="font-semibold text-slate-900 dark:text-white hover:underline">
                  Privacy Policy
                </a>
                .
              </p>
            </form>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

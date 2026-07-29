"use client";

import { motion } from "framer-motion";
import { Truck, ShieldCheck, Clock, CreditCard } from "lucide-react";

const features = [
  {
    icon: Truck,
    title: "Global Delivery",
    description: "Lightning-fast shipping to over 200 countries worldwide.",
    color: "text-blue-500",
    bg: "bg-blue-500/10",
  },
  {
    icon: ShieldCheck,
    title: "Secure Checkout",
    description: "Bank-grade encryption for all your transactions.",
    color: "text-emerald-500",
    bg: "bg-emerald-500/10",
  },
  {
    icon: Clock,
    title: "24/7 Support",
    description: "Round-the-clock assistance from our dedicated team.",
    color: "text-purple-500",
    bg: "bg-purple-500/10",
  },
  {
    icon: CreditCard,
    title: "Flexible Payments",
    description: "Pay your way with multiple secure payment options.",
    color: "text-orange-500",
    bg: "bg-orange-500/10",
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
};

export default function ValueProps() {
  return (
    <section className="relative overflow-hidden bg-slate-900 py-24 text-white sm:py-32">
      {/* Abstract Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute -top-1/2 -left-1/2 h-full w-full rounded-full bg-blue-500/10 blur-[120px]" />
        <div className="absolute -bottom-1/2 -right-1/2 h-full w-full rounded-full bg-purple-500/10 blur-[120px]" />
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8">
        <motion.div
          className="mx-auto max-w-2xl lg:text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-base font-semibold leading-7 text-indigo-400 uppercase tracking-widest">
            The Premium Experience
          </h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
            Everything you need, nothing you don't.
          </p>
          <p className="mt-6 text-lg leading-8 text-gray-300">
            We've meticulously crafted every detail of your shopping experience to ensure it's as flawless as the products we sell.
          </p>
        </motion.div>

        <motion.div
          className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-4">
            {features.map((feature) => (
              <motion.div key={feature.title} variants={itemVariants} className="flex flex-col items-center text-center">
                <div className={`mb-6 flex h-16 w-16 items-center justify-center rounded-2xl ${feature.bg} ring-1 ring-white/10 backdrop-blur-sm transition-transform duration-300 hover:scale-110 hover:-rotate-3`}>
                  <feature.icon className={`h-8 w-8 ${feature.color}`} aria-hidden="true" />
                </div>
                <dt className="text-xl font-semibold leading-7 text-white">
                  {feature.title}
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-400">
                  <p className="flex-auto">{feature.description}</p>
                </dd>
              </motion.div>
            ))}
          </dl>
        </motion.div>
      </div>
    </section>
  );
}

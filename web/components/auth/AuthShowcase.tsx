import ThemeToggle from "@/components/common/ThemeToggle";

export default function AuthShowcase() {
  return (
    <div className="hidden lg:flex relative overflow-hidden p-16 flex-col justify-between text-white bg-background border-r border-[var(--glass-border)] transition-all duration-500 group">
      
      {/* Animated Aurora Gradient Background */}
      <div className="absolute inset-0 z-0 bg-[linear-gradient(120deg,var(--accent-start)_0%,var(--accent-mid)_50%,var(--accent-end)_100%)] opacity-20 dark:opacity-40" />
      <div className="absolute inset-0 z-0 animate-aurora bg-[linear-gradient(120deg,var(--accent-end)_0%,var(--accent-mid)_50%,var(--accent-start)_100%)] opacity-30 mix-blend-overlay blur-3xl scale-150" />
      
      {/* Floating orbs for depth */}
      <div className="absolute w-[40rem] h-[40rem] rounded-full -top-40 -left-40 blur-[100px] bg-[var(--accent-start)]/20 animate-float" style={{ animationDuration: '8s' }} />
      <div className="absolute w-[30rem] h-[30rem] rounded-full bottom-0 right-0 blur-[80px] bg-[var(--accent-end)]/20 animate-float" style={{ animationDuration: '10s', animationDelay: '1s' }} />

      <div className="relative z-20 flex justify-between items-start">
        <div className="font-heading text-3xl font-bold tracking-tighter text-foreground">
          E-Commerce<span className="text-[var(--accent-mid)]">.</span>
        </div>
        <ThemeToggle />
      </div>

      <div className="relative z-20 mt-20 flex-1 flex flex-col justify-center">
        <h1 className="text-5xl lg:text-7xl font-extrabold leading-[1.1] tracking-tight text-foreground font-heading">
          Shop Smarter.
          <br />
          <span className="text-gradient">Live Better.</span>
        </h1>

        <p className="mt-8 text-xl max-w-lg text-secondary font-medium">
          Discover premium products with fast delivery, secure payments and an
          amazing shopping experience.
        </p>
      </div>

      <div className="relative z-20 grid grid-cols-3 gap-4 xl:gap-6 mt-12">
        {[
          { stat: "20K+", label: "Products" },
          { stat: "24H", label: "Delivery" },
          { stat: "99.9%", label: "Secure Payments" }
        ].map((item, i) => (
          <div
            key={i}
            className="glass-panel rounded-3xl p-6 text-center border-[var(--glass-border)] shadow-sm hover:-translate-y-1 transition-transform duration-300"
          >
            <h3 className="text-2xl xl:text-4xl font-bold text-foreground font-heading">{item.stat}</h3>
            <p className="text-sm xl:text-base mt-2 text-secondary font-medium">
              {item.label}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
